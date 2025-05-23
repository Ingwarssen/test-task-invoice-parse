import { FastifyInstance } from "fastify";

export async function healthcheckRoutes(server: FastifyInstance) {
  server.get("/check", async (request, reply) => {
    // Get query parameters
    const { name, age } = request.query as { name?: string; age?: string };

    return {
      status: "ok",
      queryParams: {
        name,
        age: age ? parseInt(age) : undefined,
      },
    };
  });
}
