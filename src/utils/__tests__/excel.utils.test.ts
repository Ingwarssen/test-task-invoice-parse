import { describe, it, expect } from "vitest";
import {
  getInvoicingDate,
  isMatchingInvoicingMonth,
  getRates,
} from "../excel.utils";
import type { RatesRow } from "../excel.utils";

describe("excel.utils", () => {
  describe("getInvoicingDate", () => {
    it("should return the first cell value from the first row", () => {
      const testData = [["2024-03-01"]];
      expect(getInvoicingDate(testData)).toBe("2024-03-01");
    });
  });

  describe("isMatchingInvoicingMonth", () => {
    it("should return true for matching dates", () => {
      expect(isMatchingInvoicingMonth("2024-03-01", "2024-03")).toBe(true);
    });

    it("should return false for different months", () => {
      expect(isMatchingInvoicingMonth("2024-03-01", "2024-04")).toBe(false);
    });

    it("should return false for different years", () => {
      expect(isMatchingInvoicingMonth("2024-03-01", "2023-03")).toBe(false);
    });
  });

  describe("getRates", () => {
    it("should extract currency rates correctly", () => {
      const rateRows: RatesRow[] = [
        ["USD Rate", 1.0],
        ["EUR Rate", 0.92],
        ["Invalid Rate", 0],
        ["", 1.5],
      ];

      const expected = {
        USD: 1.0,
        EUR: 0.92,
      };

      expect(getRates(rateRows)).toEqual(expected);
    });

    it("should handle empty input", () => {
      expect(getRates([])).toEqual({});
    });

    it("should skip invalid rate entries", () => {
      const rateRows: RatesRow[] = [
        ["Invalid", 1.0],
        ["", 0.92],
        ["", 1.5],
      ];

      expect(getRates(rateRows)).toEqual({});
    });
  });
});
