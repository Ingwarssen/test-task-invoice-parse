import { describe, it, expect } from "vitest";
import { calculateInvoicePrice } from "../price";
import { Status } from "../../schemas/item.schema";
import { BASE_CURRENCY } from "../../constants/constants";

describe("price", () => {
  const currencyRates = {
    USD: 1.1,
    EUR: 1.3,
    [BASE_CURRENCY]: 1,
  };

  it("returns total price if item and invoice currencies are the same", () => {
    const item = {
      "Item Price Currency": "USD",
      "Invoice Currency": "USD",
      "Invoice Total Price": 100,
    };

    const result = calculateInvoicePrice(item, currencyRates);

    expect(result).toBe(100);
  });

  it("calculates correct invoice price when currencies are different", () => {
    const item = {
      "Item Price Currency": "USD",
      "Invoice Currency": "EUR",
      "Invoice Total Price": 100,
    };

    const result = calculateInvoicePrice(item, currencyRates);

    // 100 * (USD Rate / EUR Rate) = 100 * (1.1 / 1.3)
    const expected = Number((100 * (1.1 / 1.3)).toFixed(2));

    expect(result).toBe(expected);
  });

  it("returns NaN when item currency rate is missing", () => {
    const item = {
      "Item Price Currency": "GBP", // Missing in currencyRates
      "Invoice Currency": "USD",
      "Invoice Total Price": 100,
    };

    const result = calculateInvoicePrice(item, currencyRates);

    expect(result).toBeNaN();
  });

  it("returns NaN when invoice currency rate is missing", () => {
    const item = {
      "Item Price Currency": "USD",
      "Invoice Currency": "GBP", // Missing in currencyRates
      "Invoice Total Price": 100,
    };

    const result = calculateInvoicePrice(item, currencyRates);

    expect(result).toBeNaN();
  });
});
