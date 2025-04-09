# Invoice Parse Service

A Fastify-based service for parsing invoices, built with TypeScript.

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To run the development server with hot-reloading:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with hot-reloading
- `npm run build` - Build the TypeScript project
- `npm start` - Start the production server

## API Endpoints

### POST /parse

A basic endpoint for invoice parsing.

Example request:

```bash
curl -X POST http://localhost:3000/parse
```

Example response:

## Project Structure

- `src/` - Source code directory
  - `server.ts` - Main server file
- `dist/` - Compiled JavaScript output (created after build)
- `tsconfig.json` - TypeScript configuration
- `package.json` - Project dependencies and scripts
