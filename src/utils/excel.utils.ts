import { createItemSchema } from "../schemas/item.schema";
import { type MultipartFile } from "@fastify/multipart";
import * as XLSX from "xlsx";
import { date, z } from "zod";
import { REQUIRED_HEADERS, RATE_PATTERN } from "../constants/constants";

export type InvoiceRow = (string | number)[];
export type NormalizedRow = Record<string, string | number | null>;
export type RatesRow = [string, number];

export const readJsonData = async (data: MultipartFile) => {
  const buffer = await data.toBuffer();
  const workbook = XLSX.read(buffer, { type: "buffer" });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
  }) as InvoiceRow[];

  return jsonData;
};

export const getInvoicingDate = (jsonData: InvoiceRow[]) => jsonData[0][0];

export const isMatchingInvoicingMonth = (
  dateFromFile: string,
  dateFromUser: string
): boolean => {
  const fileDate = new Date(dateFromFile);
  const userDate = new Date(dateFromUser);

  const res =
    fileDate.getFullYear() === userDate.getFullYear() &&
    fileDate.getMonth() === userDate.getMonth();
  return res;
};

export const getHeadersRowIndex = (jsonData: InvoiceRow[]) =>
  jsonData.findIndex((row) =>
    REQUIRED_HEADERS.every((header) => row.includes(header))
  );

export const getEndOfDataRowIndex = (jsonData: InvoiceRow[]) =>
  jsonData.findIndex((row) => row.length === 0);

export const getRates = (rateRows: RatesRow[]) =>
  rateRows.reduce((acc, cur) => {
    const [label, value] = cur;
    const match = label.match(RATE_PATTERN);
    const currency = match ? match[1] : null;

    if (!value || !currency) return acc;
    acc[currency] = value;
    return acc;
  }, {} as Record<string, number>);

export const getNormalizedData = (
  headers: string[],
  dataRows: InvoiceRow[]
): NormalizedRow[] =>
  dataRows.map((row) => {
    const item: NormalizedRow = {};
    headers.forEach((col, i) => {
      item[col] = row[i];
    });
    return item;
  });

export const normalizeJsonData = (
  jsonData: InvoiceRow[],
  invoicingMonth: string
) => {
  const headersRowIndex = getHeadersRowIndex(jsonData);
  if (headersRowIndex === -1) {
    throw new Error("Header row not found");
  }

  const endOfDataRowIndex = getEndOfDataRowIndex(jsonData);
  const headers = jsonData[headersRowIndex].map((cell) =>
    String(cell || "").trim()
  );

  const invoicingMonthFromFile = getInvoicingDate(
    jsonData.slice(0, 1)
  ) as string;
  if (!isMatchingInvoicingMonth(invoicingMonthFromFile, invoicingMonth)) {
    throw new Error(
      `Invoice date ${invoicingMonthFromFile} does not match requested month ${invoicingMonth}`
    );
  }

  const ratesRows = jsonData.slice(1, headersRowIndex) as RatesRow[];

  const currencyRates = getRates(ratesRows);
  if (!Object.keys(currencyRates).length) {
    throw new Error("Rates not found");
  }

  const dataRows = jsonData.slice(headersRowIndex + 1, endOfDataRowIndex);
  const normalized = getNormalizedData(headers, dataRows);

  if (!normalized.length) {
    throw new Error("Data rows not found");
  }
  return { currencyRates, normalized };
};

export const validateData = (
  dataArray: NormalizedRow[],
  currencyRates: Record<string, number>
) => {
  const ItemSchema = createItemSchema(currencyRates);
  return dataArray.map((item) => {
    const result = ItemSchema.safeParse(item);

    if (result.success) {
      return { ...item };
    } else {
      const errors = result.error.errors.map((err: z.ZodIssue) => {
        return `${err.path.join(".")} ${err.message}`;
      });

      return {
        ...item,
        validationErrors: errors.join("; "),
      };
    }
  });
};
