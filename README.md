# TanStarter

A minimal monorepo starter for 🏝️ TanStack Start.

- [Turborepo](https://turborepo.com/) + [pnpm](https://pnpm.io/)
- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest) + [Form](https://tanstack.com/form/latest)
- [Vite 8](https://vite.dev/) + [Nitro v3](https://v3.nitro.build/)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL
- [Better Auth](https://www.better-auth.com/)
- [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) + [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)

```sh
├── apps
│    └── web                    # TanStack Start web app
├── packages
│    ├── auth                   # Better Auth
│    ├── db                     # Drizzle ORM + Drizzle Kit + PostgreSQL
│    ├── mail                   # Resend
│    └── ui                     # shadcn/ui primitives & utils
├── tooling
│    └── tsconfig               # Shared TypeScript configuration
├── turbo.json
└── README.md
```

## Table of Contents

- [Getting Started](#getting-started)
- [Required environment variables](#required-environment-variables)
- [Deploying to production](#deploying-to-production)
- [Issue watchlist](#issue-watchlist)
- [Goodies](#goodies)
  - [Scripts](#scripts)
  - [Utilities](#utilities)
- [Third-party integrations](#thirdparty-integrations)
- [Ecosystem](#ecosystem)

## Getting Started

1. Clone this repository with gitpick, then install dependencies:

   ```sh
   pnpm dlx gitpick skippp/tanstarter myproject
   cd myproject

   pnpm install
   ```

2. Create `.env` files in [`/apps/web`](./apps/web/.env.example), based on the `.env.example` file. See [Required environment variables](#required-environment-variables) below.

3. Start PostgreSQL, generate the initial migration with Drizzle Kit, then apply it:

   ```sh
   docker compose --env-file apps/web/.env up -d db
   pnpm db generate
   pnpm db migrate
   ```

4. Run the development server:

   ```sh
   pnpm dev
   ```

   The development server should now be running at [http://localhost:3000](http://localhost:3000).

## Required environment variables

Set these in `apps/web/.env` (and in your deployment environment). Copy from [`apps/web/.env.example`](./apps/web/.env.example).

| Variable                                                  | Required | Description                                                              |
| --------------------------------------------------------- | -------- | ------------------------------------------------------------------------ |
| `VITE_BASE_URL`                                           | Yes      | Public URL of the app (e.g. `http://localhost:3000`).                    |
| `SERVER_DATABASE_URL`                                     | Yes      | PostgreSQL connection string.                                            |
| `SERVER_AUTH_SECRET`                                      | Yes      | Secret for signing sessions. Generate one with **`pnpm auth:secret`**.   |
| `SERVER_RESEND_API_KEY`                                   | Yes      | Resend API key for sending verification and password-reset emails.       |
| `SERVER_MAIL_FROM`                                        | Yes      | "From" address for transactional emails (e.g. `noreply@yourdomain.com`). |
| `SERVER_GITHUB_CLIENT_ID` / `SERVER_GITHUB_CLIENT_SECRET` | No       | For GitHub OAuth.                                                        |
| `SERVER_GOOGLE_CLIENT_ID` / `SERVER_GOOGLE_CLIENT_SECRET` | No       | For Google OAuth.                                                        |

The PostgreSQL container and the application both use `apps/web/.env`; pass that file to Compose with `--env-file apps/web/.env`. Replace the example database password before using it outside local development. In staging and production, set `VITE_BASE_URL` to the public origin (scheme and host, without a path).

## Deploying to production

Build and run the Nitro output with:

```sh
pnpm build
pnpm --filter @repo/web start
```

The [Vite config](./apps/web/vite.config.ts) uses the official Nitro v3 beta. Configure a [Nitro deployment preset](https://v3.nitro.build/deploy) when targeting a platform other than the default Node server.

Refer to the [TanStack Start hosting docs](https://tanstack.com/start/latest/docs/framework/react/guide/hosting) for deploying to other platforms.

CI installs from the frozen lockfile, then runs lint, the non-mutating format check, the production build, and a production dependency audit that blocks critical advisories. Pre-GA framework dependencies can still report upstream high-severity advisories, so review the full `pnpm audit --prod` output during dependency updates. CI uses non-sensitive placeholder environment values; runtime secrets must still be supplied by the deployment platform.

## Issue watchlist

- [Router/Start issues](https://github.com/TanStack/router/issues) - TanStack Start is in RC.
- [Devtools releases](https://github.com/TanStack/devtools/releases) - TanStack Devtools is in alpha and may still have breaking changes.
- [Nitro v3](https://v3.nitro.build/) - Nitro v3 remains beta and is pinned exactly.
- [Drizzle ORM v1](https://orm.drizzle.team/docs/relations-v1-v2) - Drizzle ORM v1 remains RC and is pinned exactly for Relations v2.
- [Better Auth releases](https://github.com/better-auth/better-auth/releases) - Better Auth 1.7 remains RC; the Relations v2 adapter is pinned through the `@better-auth/drizzle-adapter` catalog alias.

## Goodies

#### Scripts

This template is configured for **[pnpm](https://pnpm.io/)** by default. Check the root [package.json](./package.json) and each workspace package's `package.json` for the full list of available scripts.

- **`auth:generate`** - Regenerate the [auth db schema](./packages/db/src/schema/auth.schema.ts) if you've made changes to your Better Auth [config](./packages/auth/src/auth.ts).
- **`ui`** - The shadcn/ui CLI. (e.g. `pnpm ui add button`)
- **`format`**, **`format:check`**, **`lint`** - Format, verify formatting without modifying files, and run type-aware linting. `pnpm check` runs the non-mutating checks.
- **`deps`** - Selectively upgrade dependencies via taze.

> [!NOTE]
> To switch to another package manager (e.g., bun or npm), update the commands in your `package.json` files. You'll also need to replace or remove [`pnpm-workspace.yaml`](./pnpm-workspace.yaml), which uses pnpm [catalogs](https://pnpm.io/catalogs). Bun and Yarn have their own equivalents, but the file formats may differ.

#### Utilities

- [`/auth/src/tanstack/middleware.ts`](./packages/auth/src/tanstack/middleware.ts) - Sample middleware for forcing authentication on server functions.
- [`/web/src/components/theme-toggle.tsx`](./apps/web/src/components/theme-toggle.tsx) - A theme toggle for toggling between light and dark mode.

## Third‑party integrations

The template is kept minimal by default, but is compatible with many third‑party integrations. Here are a few we use in our projects:

- [Resend](https://resend.com/) - email
- ... and many more!

## Ecosystem

- [TanStack MCP](https://tanstack.com/cli/latest/docs/mcp/connecting) - The official MCP server for searching the latest docs for TanStack libraries.
- [awesome-tanstack-start](https://github.com/Balastrong/awesome-tanstack-start) - A curated list of awesome resources for TanStack Start.
- [shadcn/ui Directory](https://ui.shadcn.com/docs/directory), [MCP](https://ui.shadcn.com/docs/mcp), [shoogle.dev](https://shoogle.dev/) - Component directories & registries for shadcn/ui.
