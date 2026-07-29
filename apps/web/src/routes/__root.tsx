/// <reference types="vite/client" />

import type { AuthQueryResult } from "@repo/auth/tanstack/queries";
import { Toaster } from "@repo/ui/components/sonner";
import { TooltipProvider } from "@repo/ui/components/tooltip";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
// import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { themeQueryOptions } from "@/lib/theme";

import appCss from "@/styles.css?url";

const siteUrl = new URL("/", import.meta.env.VITE_BASE_URL).href;
const siteDescription =
  "A production-minded TanStack Start monorepo starter for building TypeScript SaaS applications.";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: AuthQueryResult;
}>()({
  // Typically we don't need the user immediately in landing pages.
  // For protected routes with loader data, see /_auth/route.tsx
  // beforeLoad: ({ context }) => {
  //   context.queryClient.prefetchQuery(authQueryOptions());
  // },
  shellComponent: RootComponent,
  beforeLoad: async ({ context }) => ({
    theme: await context.queryClient.ensureQueryData(themeQueryOptions()),
  }),
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStarter",
      },
      {
        name: "description",
        content: siteDescription,
      },
      {
        name: "theme-color",
        media: "(prefers-color-scheme: light)",
        content: "#ffffff",
      },
      {
        name: "theme-color",
        media: "(prefers-color-scheme: dark)",
        content: "#09090b",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:site_name",
        content: "TanStarter",
      },
      {
        property: "og:title",
        content: "TanStarter",
      },
      {
        property: "og:description",
        content: siteDescription,
      },
      {
        property: "og:url",
        content: siteUrl,
      },
      {
        name: "twitter:card",
        content: "summary",
      },
      {
        name: "twitter:title",
        content: "TanStarter",
      },
      {
        name: "twitter:description",
        content: siteDescription,
      },
    ],
    links: [
      { rel: "canonical", href: siteUrl },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  const { theme } = Route.useRouteContext();

  return (
    <html lang="en" className={theme}>
      <head>
        <HeadContent />
      </head>

      <body>
        <TooltipProvider>{children}</TooltipProvider>

        <Toaster richColors theme={theme} />

        {import.meta.env.DEV && (
          <TanStackDevtools
            plugins={[
              {
                name: "TanStack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
              {
                name: "TanStack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              // formDevtoolsPlugin(),
            ]}
          />
        )}

        <Scripts />
      </body>
    </html>
  );
}
