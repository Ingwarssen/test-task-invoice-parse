export const REQUIRED_HEADERS = [
  "Customer",
  "Cust No'",
  "Project Type",
  "Quantity",
  "Price Per Item",
  "Item Price Currency",
  "Invoice Currency",
  "Invoice Total Price",
  "Status",
] as const;

export const RATE_PATTERN = /^([A-Z]{3})\s*Rate$/;

export const DEFAULT_PORT = 3000;

export const SERVER_URL = `http://localhost:${DEFAULT_PORT}`;

export const BASE_CURRENCY = "ILS";
