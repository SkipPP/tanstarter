import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";

import type { Config } from "drizzle-kit";

import { parseDatabaseUrl } from "./src/env";

if (existsSync("../../apps/web/.env")) {
  loadEnvFile("../../apps/web/.env");
}

const databaseUrl = process.env.SERVER_DATABASE_URL;

export default {
  out: "./migrations",
  schema: "./src/schema/index.ts",
  breakpoints: true,
  verbose: true,
  strict: true,

  dialect: "postgresql",
  ...(databaseUrl ? { dbCredentials: { url: parseDatabaseUrl(databaseUrl) } } : {}),
} satisfies Config;
