import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, Link, Outlet, redirect, useRouteContext } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = "/app";

    const user = await context.queryClient.ensureQueryData(authQueryOptions());

    if (user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }

    return {
      redirectUrl: REDIRECT_URL,
    };
  },
  head: () => ({
    meta: [
      { title: "Account access — TanStarter" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function RouteComponent() {
  const { theme } = useRouteContext({ from: "__root__" });

  return (
    <main className="grid min-h-svh bg-card lg:grid-cols-2">
      <ThemeToggle className="absolute top-10 right-10 z-10" />

      <section className="flex flex-col gap-4 p-10">
        <div className="flex justify-start gap-2">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img
              src={theme === "dark" ? "/logo-partitio-blanc.png" : "/logo-partitio.png"}
              alt="TanStarter"
              width="400"
              height="108"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">TanStarter account access</p>
      </section>

      <div className="auth-visual hidden lg:block" aria-hidden="true" />
    </main>
  );
}
