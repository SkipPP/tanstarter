export function requireEnv<const TNames extends readonly string[]>(
  names: TNames,
): { [K in TNames[number]]: string } {
  const missing = names.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(`Missing environment variable(s): ${missing.join(", ")}`);
  }

  return Object.fromEntries(names.map((name) => [name, process.env[name]!.trim()])) as {
    [K in TNames[number]]: string;
  };
}

export function requireHttpUrl(name: string, value: string): string {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`${name} must use http or https`);
  }

  return url.origin;
}

export type OAuthProviderId = "github" | "google";

type OAuthProviderConfig = {
  clientId: string;
  clientSecret: string;
};

/**
 * Enables a provider only when both server-side credentials are present.
 * A partially configured provider is ignored so the UI and auth API cannot
 * advertise a flow that is guaranteed to fail.
 */
export function getOAuthProviders(): Partial<Record<OAuthProviderId, OAuthProviderConfig>> {
  const providers: Partial<Record<OAuthProviderId, OAuthProviderConfig>> = {};

  const githubClientId = process.env.SERVER_GITHUB_CLIENT_ID?.trim();
  const githubClientSecret = process.env.SERVER_GITHUB_CLIENT_SECRET?.trim();
  if (githubClientId && githubClientSecret) {
    providers.github = {
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    };
  }

  const googleClientId = process.env.SERVER_GOOGLE_CLIENT_ID?.trim();
  const googleClientSecret = process.env.SERVER_GOOGLE_CLIENT_SECRET?.trim();
  if (googleClientId && googleClientSecret) {
    providers.google = {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    };
  }

  return providers;
}
