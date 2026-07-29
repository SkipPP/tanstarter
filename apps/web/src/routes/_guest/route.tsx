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
    <main className="min-h-svh bg-muted/40 p-3 sm:p-4 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(28rem,0.88fr)] lg:gap-4">
      <section className="flex min-h-[calc(100svh-1.5rem)] flex-col rounded-3xl bg-card px-5 py-5 shadow-[0_0_0_1px_oklch(0_0_0/0.05),0_12px_40px_oklch(0_0_0/0.06)] sm:min-h-[calc(100svh-2rem)] sm:px-8 sm:py-7 lg:px-12 lg:py-9 dark:shadow-[0_0_0_1px_oklch(1_0_0/0.08)]">
        <header className="flex items-center justify-between gap-4">
          <Link
            to="/"
            className="rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            aria-label="TanStarter home"
          >
            <img
              src={theme === "dark" ? "/logo-partitio-blanc.png" : "/logo-partitio.png"}
              alt=""
              width="400"
              height="108"
              className="h-7 w-auto sm:h-8"
            />
          </Link>
          <ThemeToggle variant="ghost" size="icon-lg" />
        </header>

        <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <div className="auth-form w-full max-w-md">
            <Outlet />
          </div>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>Secure account access</span>
          <span aria-hidden>·</span>
          <Link to="/" className="underline-offset-4 hover:text-foreground hover:underline">
            Back to home
          </Link>
        </footer>
      </section>

      <aside className="auth-visual relative hidden overflow-hidden rounded-3xl lg:flex lg:flex-col lg:justify-end">
        <div className="auth-visual-overlay absolute inset-0" aria-hidden="true" />
        <div className="relative z-10 max-w-xl p-10 text-white xl:p-14">
          <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-white/70 uppercase">
            One workspace, less friction
          </p>
          <p className="text-3xl leading-tight font-semibold tracking-tight text-balance xl:text-4xl">
            Focus on the work that matters. We’ll keep your account safe and ready.
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-pretty text-white/75">
            A secure, streamlined sign-in experience designed to get you back to your workspace.
          </p>
        </div>
      </aside>
    </main>
  );
}
