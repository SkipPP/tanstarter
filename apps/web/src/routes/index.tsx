import { Button } from "@repo/ui/components/button";
import { createFileRoute, Link } from "@tanstack/react-router";

import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "TanStarter — TanStack SaaS starter" },
      {
        name: "description",
        content:
          "A production-minded TanStack Start monorepo starter for building TypeScript SaaS applications.",
      },
    ],
  }),
});

function HomePage() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-10 p-2">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold sm:text-4xl">TanStarter</h1>

        <div className="mb-4 flex flex-col items-center gap-2 text-sm text-foreground/80">
          A production-minded TanStack Start SaaS starter.
          <pre className="rounded-md border bg-card p-1 text-xs text-card-foreground">
            routes/index.tsx
          </pre>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <Button asChild>
          <Link to="/app">Open the app</Link>
        </Button>

        <Button asChild variant="outline">
          <Link to="/login">Log in</Link>
        </Button>
      </div>

      <ThemeToggle className="absolute top-10 right-10 z-10" />
    </main>
  );
}
