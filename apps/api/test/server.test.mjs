import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

import { createApp } from "../src/server.mjs";

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address()));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test("connects the public chat route to the configured model endpoint", async () => {
  const modelServer = http.createServer((request, response) => {
    assert.equal(request.url, "/v1/chat/completions");
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({
      choices: [{ message: { content: "Integration works" } }],
    }));
  });
  const modelAddress = await listen(modelServer);

  const app = createApp({
    modelConfigured: true,
    model: {
      apiKey: "",
      baseUrl: `http://127.0.0.1:${modelAddress.port}/v1`,
      name: "local-test-model",
      systemPrompt: "Be useful",
      timeoutMs: 1_000,
    },
  });
  const appServer = http.createServer(app);
  const appAddress = await listen(appServer);

  try {
    const response = await fetch(`http://127.0.0.1:${appAddress.port}/api/chat`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }),
    });
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(payload.message, {
      role: "assistant",
      content: "Integration works",
    });
  } finally {
    await close(appServer);
    await close(modelServer);
  }
});
