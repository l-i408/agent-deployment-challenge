# Agent Deployment Challenge

Este repositorio contiene una API base para una prueba técnica de desarrollo y puesta en funcionamiento de agentes de IA.

## El reto

Tu objetivo es diseñar y dejar funcionando una solución completa basada en un agente de IA. Para ello tendrás que:

- poner la solución en funcionamiento en un entorno de tu elección;
- conectar la aplicación con un modelo de IA de tu elección;
- diseñar y desarrollar un frontend web desde el que se pueda probar el agente;
- dejar el entorno accesible y preparado para probarlo;
- incorporar un sistema adecuado de control de acceso;
- crear una skill que permita al agente trabajar con GitHub;
- documentar el resultado y las decisiones técnicas tomadas.

La infraestructura, la arquitectura, el modelo y la estrategia de puesta en funcionamiento son decisiones abiertas. Puedes evolucionar o reorganizar la base proporcionada siempre que mantengas los objetivos del reto y puedas explicar y justificar tu enfoque.

## Qué contiene el repositorio

```text
apps/
  api/                       API y conexión configurable con el modelo
skills/
  github-access/             esqueleto de la skill solicitada
```

La API incluida utiliza un endpoint compatible con la interfaz de Chat Completions y sirve como punto de partida. Puedes adaptarla a la solución que decidas construir.

## Interfaz y acceso

El repositorio no incluye frontend. Diseña e implementa un frontend web propio para interactuar con el agente y aplica un control de acceso adecuado.

La tecnología, el diseño y el enfoque de autenticación son parte de tus decisiones.

## Ejecución local

Requisitos: Node.js 22 o posterior y npm.

```bash
npm install
cp .env.example .env
npm run dev
```

Completa en `.env` la URL del endpoint, el nombre del modelo y, cuando sea necesaria, su credencial. La API se abrirá en `http://localhost:4319`.

Para comprobar la base antes de trabajar:

```bash
npm run check
```

Para ejecutar el servicio sin recarga automática utiliza `npm start`. El puerto se define mediante `PORT` y la ruta `GET /api/health` permite comprobar el estado básico del servicio.

## Skill de acceso a GitHub

Completa [`skills/github-access/SKILL.md`](skills/github-access/SKILL.md) con tu propuesta para que el agente pueda trabajar con GitHub. Puedes añadir scripts o referencias dentro de la carpeta de la skill si tu enfoque los necesita.

El alcance, el método de autenticación, los permisos y las operaciones disponibles son parte de tus decisiones. No incluyas credenciales, tokens ni datos reales en el repositorio.

## Capacidad multiconversación

Desarrolla un sistema que permita al agente consultar y relacionar información obtenida en conversaciones diferentes. Una petición podrá comenzar en una conversación y completarse o enriquecerse utilizando información recopilada en conversaciones anteriores o posteriores.

La solución técnica es libre.

## Entrega

Comparte el código resultante, el acceso al entorno preparado para la prueba y una breve documentación que permita entender la solución y las decisiones tomadas.

No buscamos una infraestructura, un proveedor o una arquitectura concretos. Valoraremos el resultado en conjunto y la claridad con la que puedas explicar tu trabajo.
