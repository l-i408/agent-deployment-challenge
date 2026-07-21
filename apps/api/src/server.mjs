import "dotenv/config";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import express from "express";

import { loadConfig } from "./config.mjs";
import { validateMessages } from "./messages.mjs";
import { ModelRequestError, requestCompletion } from "./model-client.mjs";

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url));
const webDirectory = path.resolve(sourceDirectory, "../../web/dist");

export function createApp(config = loadConfig()) {
  const app = express();

  app.disable("x-powered-by");
  app.use((request, response, next) => {
    response.set({
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "x-frame-options": "DENY",
    });
    next();
  });
  app.use(express.json({ limit: "64kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({
      status: "ok",
      model: {
        configured: config.modelConfigured,
        name: config.modelConfigured ? config.model.name : null,
      },
    });
  });

  app.post("/api/chat", async (request, response) => {
    const requestId = crypto.randomUUID();

    if (!config.modelConfigured) {
      return response.status(503).json({
        error: "The model is not configured",
        requestId,
      });
    }

    const validation = validateMessages(request.body?.messages);
    if (!validation.ok) {
      return response.status(400).json({ error: validation.error, requestId });
    }

    try {
      const content = await requestCompletion({
        model: config.model,
        messages: validation.messages,
      });
      return response.json({ message: { role: "assistant", content }, requestId });
    } catch (error) {
      const status = error instanceof ModelRequestError ? error.status : 500;
      const publicMessage =
        error instanceof ModelRequestError
          ? error.message
          : "An unexpected error occurred";

      console.error(`[${requestId}] chat request failed: ${error?.message ?? "unknown error"}`);
      return response.status(status).json({ error: publicMessage, requestId });
    }
  });

  if (fs.existsSync(webDirectory)) {
    app.use(express.static(webDirectory, { index: false }));
    app.use((request, response, next) => {
      if (request.method !== "GET" || request.path.startsWith("/api/")) {
        return next();
      }
      return response.sendFile(path.join(webDirectory, "index.html"));
    });
  }

  app.use((error, _request, response, next) => {
    if (error?.status === 413) {
      return response.status(413).json({ error: "Request body is too large" });
    }

    if (error instanceof SyntaxError && error?.status === 400) {
      return response.status(400).json({ error: "Request body contains invalid JSON" });
    }

    return next(error);
  });

  app.use((_request, response) => {
    response.status(404).json({ error: "Not found" });
  });

  return app;
}

export function startServer(config = loadConfig()) {
  const app = createApp(config);
  return app.listen(config.port, config.host, () => {
    console.log(`Agent challenge listening on http://${config.host}:${config.port}`);
  });
}

const isEntryPoint = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isEntryPoint) startServer();
