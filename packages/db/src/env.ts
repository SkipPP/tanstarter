export function parseDatabaseUrl(value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error("Missing environment variable: SERVER_DATABASE_URL");
  }

  const url = new URL(value);
  if (url.protocol !== "postgres:" && url.protocol !== "postgresql:") {
    throw new Error("SERVER_DATABASE_URL must be a PostgreSQL URL");
  }

  return url.toString();
}
