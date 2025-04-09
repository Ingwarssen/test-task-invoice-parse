import { describe, it, expect, beforeAll } from "vitest";
import { buildServer } from "../../server";
import { createReadStream } from "fs";
import { join } from "path";
import { FormData } from "formdata-node";
import { fileFromPath } from "formdata-node/file-from-path";
import { File } from "formdata-node";

describe("parse endpoint", () => {
  let server: Awaited<ReturnType<typeof buildServer>>;

  beforeAll(async () => {
    server = await buildServer();
  });

  it("should parse valid Excel file and return correct data", async () => {
    const formData = new FormData();
    const filePath = join(__dirname, "../../../test-data/sample.xlsx");
    const file = await fileFromPath(filePath);
    formData.append("file", file);

    const response = await server.inject({
      method: "POST",
      url: "/parse?invoicingMonth=2023-09",
      payload: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.payload);

    // Verify the response structure
    expect(result).toHaveProperty("invoicingMonth");
    expect(result).toHaveProperty("currencyRates");
    expect(result).toHaveProperty("invoicesData");

    // Verify currency rates
    expect(result.currencyRates).toHaveProperty("USD");
    expect(result.currencyRates).toHaveProperty("EUR");

    // Verify items structure
    expect(Array.isArray(result.invoicesData)).toBe(true);
    if (result.invoicesData.length > 0) {
      const firstItem = result.invoicesData[0];
      expect(firstItem).toHaveProperty("Status");

      expect(firstItem).toHaveProperty("Item Price Currency");
      expect(firstItem).toHaveProperty("Invoice Currency");
      expect(firstItem).toHaveProperty("Invoice Total Price");
    }
  });
  it("should parse valid Excel file with new currency and return correct data", async () => {
    const formData = new FormData();
    const filePath = join(__dirname, "../../../test-data/newcurr.xlsx");
    const file = await fileFromPath(filePath);
    formData.append("file", file);

    const response = await server.inject({
      method: "POST",
      url: "/parse?invoicingMonth=2023-09",
      payload: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    console.log(response.body);

    expect(response.statusCode).toBe(200);
    const result = JSON.parse(response.payload);

    // Verify the response structure
    expect(result).toHaveProperty("invoicingMonth");
    expect(result).toHaveProperty("currencyRates");
    expect(result).toHaveProperty("invoicesData");

    // Verify currency rates
    expect(result.currencyRates).toHaveProperty("USD");
    expect(result.currencyRates).toHaveProperty("EUR");
    expect(result.currencyRates).toHaveProperty("UAH");

    // Verify items structure
    expect(Array.isArray(result.invoicesData)).toBe(true);
    if (result.invoicesData.length > 0) {
      const firstItem = result.invoicesData[0];
      expect(firstItem).toHaveProperty("Status");

      expect(firstItem).toHaveProperty("Item Price Currency");
      expect(firstItem).toHaveProperty("Invoice Currency");
      expect(firstItem).toHaveProperty("Invoice Total Price");
    }
  });

  it("should return 400 for invalid file format", async () => {
    const formData = new FormData();
    const filePath = join(__dirname, "../../../test-data/invalid.txt");
    const file = await fileFromPath(filePath);
    formData.append("file", file);

    const response = await server.inject({
      method: "POST",
      url: "/parse?invoicingMonth=2024-03",
      payload: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 for missing invoicingMonth", async () => {
    const formData = new FormData();
    const filePath = join(__dirname, "../../../test-data/sample.xlsx");
    const file = await fileFromPath(filePath);
    formData.append("file", file);

    const response = await server.inject({
      method: "POST",
      url: "/parse",
      payload: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 for invalid invoicingMonth format", async () => {
    const formData = new FormData();
    const filePath = join(__dirname, "../../../test-data/sample.xlsx");
    const file = await fileFromPath(filePath);
    formData.append("file", file);

    const response = await server.inject({
      method: "POST",
      url: "/parse?invoicingMonth=invalid-date",
      payload: formData,
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    expect(response.statusCode).toBe(400);
  });
});
