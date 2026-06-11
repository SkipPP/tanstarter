import { loadEnvFile } from "node:process";

import type { Config } from "drizzle-kit";

loadEnvFile("../../apps/web/.env");

if (!process.env.SERVER_DATABASE_URL) {
  throw new Error("Missing environment variable: SERVER_DATABASE_URL");
}

export default {
  out: "./migrations",
  schema: "./src/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,

  dialect: "postgresql",
  dbCredentials: {
    url: process.env.SERVER_DATABASE_URL as string,
  },
} satisfies Config;
