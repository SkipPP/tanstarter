import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, Link, Outlet, redirect, useRouteContext } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/_guest")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const REDIRECT_URL = "/app";

    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });

    if (user) {
      throw redirect({
        to: REDIRECT_URL,
      });
    }

    return {
      redirectUrl: REDIRECT_URL,
    };
  },
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
              alt="Partitio"
              className="h-8 w-full"
            />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>

        <span className="text-center text-xs text-muted-foreground">
          By clicking continue, you agree to our <br />
          <Link to="/" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/" className="underline">
            Privacy Policy
          </Link>
          .
        </span>
      </section>

      <section className="relative hidden flex-col gap-4 p-10 lg:flex">
        <img
          src="/background-login.jpg"
          alt="Background login"
          loading="lazy"
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover dark:grayscale"
        />
      </section>
    </main>
  );
}
