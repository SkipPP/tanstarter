import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { Button } from "@repo/ui/components/button";
import { IconLoader } from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense } from "react";

import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 p-2">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold sm:text-4xl">TanStarter</h1>

        <div className="mb-4 flex flex-col items-center gap-2 text-sm text-foreground/80">
          This is an unprotected page:
          <pre className="rounded-md border bg-card p-1 text-xs text-card-foreground">
            routes/index.tsx
          </pre>
        </div>
      </div>

      <ThemeToggle className="absolute top-10 right-10 z-10" />

      <Suspense fallback={<IconLoader className="animate-spin" />}>
        <UserAction />
      </Suspense>
    </div>
  );
}

function UserAction() {
  const { user } = useAuthSuspense();

  return user ? (
    <div className="flex flex-col items-center gap-2">
      <p>Welcome back, {user.name} !</p>

      <pre className="max-w-screen overflow-x-auto px-2 text-start">
        {JSON.stringify(user, null, 2)}
      </pre>

      <div className="grid grid-cols-2 gap-2">
        <Button asChild>
          <Link to="/app">Go to App</Link>
        </Button>

        <SignOutButton />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center gap-2">
      <p>You are not signed in.</p>

      <Button asChild className="w-fit">
        <Link to="/login">Log in</Link>
      </Button>
    </div>
  );
}
