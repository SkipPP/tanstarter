# Tanstarter project audit

**Scope:** Monorepo template with TanStack Start, Drizzle, Better Auth, Resend, and shadcn/ui.  
**Date:** 2025-03-04.

---

## 1. Executive summary

The template is well structured and aligned with the documented conventions (`.cursor/rules`). Auth, routing, and data patterns are consistent. A few improvements are suggested around env validation, placeholder copy, optional hardening for server functions, and documentation so future protected server functions use `authMiddleware` correctly.

| Area           | Status   | Notes                                                                 |
|----------------|----------|-----------------------------------------------------------------------|
| Monorepo       | Good     | pnpm + Turborepo + catalog; clear app/package split                   |
| TanStack Start | Good     | Route groups, loaders, server functions used correctly                |
| Drizzle        | Good     | Schema + relations; auth schema generated; migrations present         |
| Better Auth    | Good     | TanStack Start plugin, session cache, email flows, Resend integration |
| Resend         | Good     | Centralized client; used only from auth (server-only)                 |
| shadcn/ui      | Good     | Shared `@repo/ui`; forms, fields, sidebar used across app            |

---

## 2. Monorepo and tooling

- **Workspace:** `pnpm-workspace.yaml` includes `apps/*`, `packages/*`, `tooling/*`; catalog versions used consistently.
- **Scripts:** `build`, `dev`, `lint`, `format`, `db`, `ui`, `auth:secret`, `auth:generate` are appropriate. `pnpm db` delegates to Drizzle Kit.
- **Turbo:** `turbo.json` passes `SERVER_*` and `VITE_*` into build; `globalPassThroughEnv` includes `NODE_ENV`, `PROD`. Dev/preview are non-cached and persistent.
- **Lint/format:** Oxlint (type-aware) and Oxfmt; lint-staged runs format on commit. Per workflow rule, `pnpm lint` is the main feedback loop.

**Recommendation:** None critical. Consider adding a single `quality` script in root that runs lint + format check if you want a one-command pre-push check (Turbo already has `//#quality` tasks).

---

## 3. TanStack Start

- **Route groups:** Protected routes under `_auth`; guest-only under `_guest`. Layouts use `beforeLoad` with `ensureQueryData(authQueryOptions())` and redirect when appropriate. Root does not prefetch auth (comment explains this is intentional for landing).
- **Auth in loaders:** `_auth` layout returns `{ user }` from the same query; children use `Route.useRouteContext()` (e.g. `_auth/app/index.tsx`). No duplicate auth fetches.
- **Server functions:** `$getUser` uses `createServerFn` and forwards Set-Cookie from `auth.api.getSession`. Theme server functions use `createServerFn` with cookie read/write. No server-only code is imported from client.
- **API route:** `routes/api/auth/$.ts` mounts `auth.handler` for GET and POST; matches Better Auth TanStack Start docs.

**Recommendation:** When you add server functions that require an authenticated user, chain `authMiddleware` as per `auth-conventions.mdc` (e.g. `createServerFn().middleware(authMiddleware).handler(...)`). The template does not yet have an example of this; adding one in a comment or a small example would help.

---

## 4. Drizzle

- **Schema:** `packages/db/src/schema/auth.schema.ts` (Better Auth–generated) plus `relations.ts` using `defineRelations`. Re-exported from `schema/index.ts`.
- **Client:** `packages/db/src/index.ts` uses `postgres()` with `SERVER_DATABASE_URL`, `drizzle(..., { schema, relations, casing: "snake_case" })`. Auth relations are merged correctly for relations-v2.
- **Config:** `drizzle.config.ts` uses same schema path, `breakpoints`, `strict`, `casing: "snake_case"`, PostgreSQL dialect.
- **Migrations:** Present under `packages/db/migrations/`. Auth schema is generated via `pnpm auth:generate` from the auth config.

**Recommendation:** Ensure `SERVER_DATABASE_URL` is set and migrations are applied in any deployment or “first run” docs. No code changes required.

---

## 5. Better Auth

- **Config:** `packages/auth/src/auth.ts` uses `betterAuth` with:
  - `baseURL` / `trustedOrigins` from env; `secret` from `SERVER_AUTH_SECRET`.
  - `drizzleAdapter(db, { provider: "pg", schema })`.
  - `tanstackStartCookies()` plugin.
  - Session `cookieCache` (5 min).
  - Social providers (GitHub, Google) and email/password with `requireEmailVerification: true`, reset password and verification emails via Resend.
- **TanStack integration:** `$getUser` in `packages/auth/src/tanstack/functions.ts` uses `auth.api.getSession` with `getRequest().headers` and forwards Set-Cookie. `authQueryOptions` wraps it in TanStack Query; `_auth` and `_guest` use `ensureQueryData(authQueryOptions())`. Hooks `useAuth` / `useAuthSuspense` in `packages/auth/src/tanstack/hooks.ts` use the same query options.
- **Middleware:** `authMiddleware` in `packages/auth/src/tanstack/middleware.ts` uses `auth.api.getSession` with `disableCookieCache: true`, forwards Set-Cookie, and returns 401 when there is no user. Ready for use on protected server functions; not yet used by any server function in the template.

**Recommendations:**

1. **Env at runtime:** Auth and mail depend on `SERVER_*` env. Consider validating required vars (e.g. `SERVER_AUTH_SECRET`, `SERVER_DATABASE_URL`, `SERVER_RESEND_API_KEY`) in a small server-only module used at startup or first request, so failures are explicit instead of generic runtime errors.
2. **Placeholder “from” addresses:** In `auth.ts`, `SERVER_MAIL_FROM` fallbacks are `"reset@urmomlovme.fr"` and `"verify@urmomlovme.fr"`. Prefer a neutral placeholder (e.g. `"noreply@example.com"`) or no fallback so misconfiguration is obvious.

---

## 6. Resend / mail

- **Client:** `packages/mail/src/resend.ts` creates a Resend instance with `SERVER_RESEND_API_KEY` and throws if the env var is missing. Only this file instantiates Resend.
- **Usage:** Auth imports `resend` from `@repo/mail/resend` and uses it in `sendResetPassword` and `sendVerificationEmail`. No other package imports the mail package; server-only usage is correct.

**Recommendation:** None. If you add more email types later, consider keeping all “send” logic in `@repo/mail` (or auth) and calling it from server functions so Resend stays server-only.

---

## 7. shadcn/ui

- **Package:** `@repo/ui` exposes components and styles; app uses `@repo/ui/components/*` and `@repo/ui/lib/utils`. Buttons, fields, forms, sidebar, dropdown, avatar, sonner, tooltip, etc. are used consistently.
- **Forms:** TanStack Form with `revalidateLogic()`, Zod validators, and shared `useAppForm` + field components. Login, signup, forgot-password, reset-password, verify-email use the same patterns.
- **Guest layout:** Two-column layout with theme toggle, logo, and footer links; Outlet for auth forms. Social buttons component reused for login and signup.

**Recommendation:** After adding or changing UI components, run the shadcn audit checklist (e.g. via the project’s shadcn MCP tool): verify imports, dependencies, and lint/TypeScript. No structural issues found.

---

## 8. Security and environment

- **Secrets:** Auth secret, DB URL, Resend API key, and OAuth client credentials are behind `SERVER_*` (or app-specific) env. Not committed.
- **Turbo:** Build tasks declare `env: ["SERVER_*", "VITE_*"]` so these are available when needed. `.env.example` in `apps/web` documents `VITE_BASE_URL`, DB, auth, and Resend vars; no secrets.
- **Route protection:** Unauthenticated users cannot reach `_auth` routes (redirect to login). Authenticated users cannot reach `_guest` routes (redirect to `/app`). Server-side enforcement for future APIs should use `authMiddleware` on server functions.

**Recommendations:**

1. Add a short “Required env” section to the README (or a dedicated env doc) listing `SERVER_AUTH_SECRET`, `SERVER_DATABASE_URL`, `BETTER_AUTH_URL`, `SERVER_RESEND_API_KEY`, `SERVER_MAIL_FROM`, and optional OAuth vars, and how to generate the auth secret (`pnpm auth:secret`).
2. If you support multiple environments, document that `BETTER_AUTH_URL` / `trustedOrigins` must match the app URL (e.g. no trailing slash, correct scheme).

---

## 9. Checklist summary

| Item                                              | Status |
|---------------------------------------------------|--------|
| Monorepo uses pnpm + catalog                       | Yes    |
| Protected routes under `_auth`, guest under `_guest` | Yes    |
| Auth state via TanStack Query + same query in layouts | Yes    |
| Better Auth handler mounted at `/api/auth/$`      | Yes    |
| TanStack Start cookie plugin used                 | Yes    |
| Drizzle schema + relations + migrations           | Yes    |
| Resend used only from server (auth)               | Yes    |
| UI components from `@repo/ui`                     | Yes    |
| No server-only imports in client code             | Yes    |
| `authMiddleware` available for server functions   | Yes (example in `apps/web/src/lib/example-protected-server.ts`) |
| Env examples documented                           | Yes (README + .env.example) |
| Placeholder mail “from” in auth                   | Done (validated via `packages/auth/src/env.ts`, no fallback) |

---

## 10. Optional follow-ups

1. **Example protected server function:** Done. See `apps/web/src/lib/example-protected-server.ts` and its usage in `_auth/app/index.tsx`.
2. **Env validation:** Done. `packages/auth/src/env.ts` validates `SERVER_AUTH_SECRET`, base URL, and `SERVER_MAIL_FROM` on first auth load and throws a clear error if any are ’ missing.
3. **Signup flow:** After signup, the app navigates to `redirectUrl` (/app) and shows a “verify your email” toast. If Better Auth blocks unverified users from signing in, consider whether post-signup redirect should go to a “check your email” page instead of /app, or document the current behavior.

This audit was produced using the project structure, `.cursor/rules`, and the Better Auth and shadcn MCP tools where relevant.
