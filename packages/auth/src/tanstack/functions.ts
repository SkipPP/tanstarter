import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";

import { auth } from "../auth";
import { getOAuthProviders, type OAuthProviderId } from "../env";

/**
 * This server function is meant to be called via authQueryOptions() in queries.ts,
 * which is used in the _auth layout route to protect all child routes under it (e.g. _auth/app/*)
 *
 * For securing server functions or API routes,
 * consider using authMiddleware from middleware.ts instead.
 */
export const $getUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await _getUser();

  return user;
});

/**
 * Returns public auth capabilities without exposing OAuth credentials.
 */
export const $getOAuthProviders = createServerFn({ method: "GET" }).handler(
  (): OAuthProviderId[] => {
    const providers = getOAuthProviders();

    return (["google", "github"] as const).filter((provider) => Boolean(providers[provider]));
  },
);

interface GetUserServerQuery {
  disableCookieCache?: boolean | undefined;
  disableRefresh?: boolean | undefined;
}

/**
 * Server-only util, meant to be used by the $getUser server function and auth middleware so logic can be shared with optional query params.
 *
 * For server app logic, consider using authMiddleware instead.
 */
export const _getUser = createServerOnlyFn(async (query?: GetUserServerQuery) => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    query,
    returnHeaders: true,
  });

  // Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
  const cookies = session.headers?.getSetCookie();
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies);
  }

  const user = session.response?.user;
  if (!user) {
    return null;
  }

  // Keep the client/session DTO intentionally smaller than the database model.
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
  };
});
