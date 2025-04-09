# Invoice Parser API

A Fastify-based API for parsing Excel invoice files with currency conversion capabilities.

## Features

- Parse Excel files with invoice data
- Convert currencies using provided exchange rates
- Validate invoice data against schema
- Health check endpoint
- TypeScript support
- Unit and E2E tests

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:

```bash
npm run dev
```

## Testing

Run unit tests:

```bash
npm test
```

Run tests coverage:

```bash
npm run test:coverage
```

## API Endpoints

### POST /parse

Parse an Excel file with invoice data.

**Query Parameters:**

- `invoicingMonth` (required): The month of invoicing in YYYY-MM format

**Request Body:**

- `file`: Excel file with invoice data

**Response:**

```json
{
  "invoicingMonth": "2023-09",
  "currencyRates": {
    "USD": 1.1,
    "EUR": 1.3,
    "UAH": 0.027
  },
  "invoicesData": [
    {
      "Status": "READY",
      "Item Price Currency": "USD",
      "Invoice Currency": "EUR",
      "Invoice Total Price": 100
    }
  ]
}
```

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

## Project Structure

```
src/
├── routes/           # API routes
├── utils/           # Utility functions
├── schemas/         # Zod schemas
├── plugins/         # Fastify plugins
└── server.ts        # Server configuration
```

## License

MIT
