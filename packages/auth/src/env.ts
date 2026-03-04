import "@tanstack/react-start/server-only";

/**
 * Validates required server env vars for auth and email.
 * Call once when building auth config; throws with a clear message if anything is missing.
 */
function getAuthEnv() {
  const secret = process.env.SERVER_AUTH_SECRET;
  const baseURL =
    process.env.BETTER_AUTH_URL ?? process.env.VITE_BASE_URL;
  const mailFrom = process.env.SERVER_MAIL_FROM;

  const missing: string[] = [];
  if (!secret?.trim()) missing.push("SERVER_AUTH_SECRET");
  if (!baseURL?.trim()) missing.push("BETTER_AUTH_URL or VITE_BASE_URL");
  if (!mailFrom?.trim()) missing.push("SERVER_MAIL_FROM");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Copy apps/web/.env.example and set values. Generate a secret with: pnpm auth:secret",
    );
  }

  return {
    secret: secret!,
    baseURL: baseURL!.replace(/\/$/, ""),
    mailFrom: mailFrom!,
  };
}

let cached: ReturnType<typeof getAuthEnv> | null = null;

/** Returns validated auth env; validates on first call and caches. */
export function getValidatedAuthEnv() {
  if (!cached) cached = getAuthEnv();
  return cached;
}
