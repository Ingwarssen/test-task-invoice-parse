import fp from "fastify-plugin";
import fastifyMultipart from "@fastify/multipart";

export default fp(async (server) => {
  server.register(fastifyMultipart);
});
