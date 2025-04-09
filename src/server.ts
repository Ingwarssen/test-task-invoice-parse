import fastify from "fastify";
import multipartPlugin from "./plugins/multipart";
import { parseRoutes } from "./routes/parse";
import { healthcheckRoutes } from "./routes/healthcheck";

export async function buildServer() {
  const server = fastify({ logger: true });

  await server.register(multipartPlugin);
  await server.register(healthcheckRoutes);
  await server.register(parseRoutes);

  return server;
}

const start = async () => {
  const server = await buildServer();
  try {
    await server.listen({ port: 3000 });
    console.log("Server running at http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
