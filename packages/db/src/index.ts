import "@tanstack/react-start/server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { parseDatabaseUrl } from "./env";
import { authRelations } from "./schema/auth.schema";
import { relations } from "./schema/relations";

const client = postgres(parseDatabaseUrl(process.env.SERVER_DATABASE_URL), {
  max: 1,
  prepare: false,
});

export const db = drizzle({
  client,
  // authRelations uses defineRelationsPart,
  // so it must come after the main relations.
  // https://orm.drizzle.team/docs/relations-v2#relations-parts
  relations: { ...relations, ...authRelations },
});
