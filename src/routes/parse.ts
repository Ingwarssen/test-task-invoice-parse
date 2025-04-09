import { FastifyInstance } from "fastify";
import { normalizeJsonData, readJsonData } from "../utils/excel.utils";
import { processData } from "./services/dataProcessor";

const invoicingMonthSchema = {
  type: "object",
  required: ["invoicingMonth"],
  properties: {
    invoicingMonth: {
      type: "string",
      pattern: "^\\d{4}-(?:0[1-9]|1[0-2])$",
    },
  },
} as const;

export async function parseRoutes(server: FastifyInstance) {
  server.post(
    "/parse",
    {
      schema: {
        querystring: invoicingMonthSchema,
      },
    },
    async (request, reply) => {
      const data = await request.file();
      const { invoicingMonth } = request.query as { invoicingMonth: string };

      if (!data) {
        return reply.status(400).send({ error: "No file uploaded" });
      }

      const jsonData = await readJsonData(data);

      try {
        const { currencyRates, normalized } = normalizeJsonData(
          jsonData,
          invoicingMonth
        );
        const invoicesData = processData(normalized, currencyRates);

        return { currencyRates, invoicesData, invoicingMonth };
      } catch (error) {
        const { message } = error as { message: string };
        reply.status(400).send({ error: message });
      }
    }
  );
}
