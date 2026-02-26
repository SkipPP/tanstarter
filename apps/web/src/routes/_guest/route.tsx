import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";

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
  return (
    <main className="grid min-h-svh bg-card lg:grid-cols-2">
      <section className="flex flex-col gap-4 p-10">
        <div className="flex justify-start gap-2">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src="/logo-partitio-blanc.png" alt="Partitio" className="h-9 w-full" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </section>

      <section className="relative hidden lg:block">
        <img
          src="/background-login.jpg"
          alt="Background login"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </section>
    </main>
  );
}
