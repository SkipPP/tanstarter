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
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 bg-card p-2">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold sm:text-4xl">TanStarter</h1>
        <div className="flex items-center gap-2 text-sm text-foreground/80 max-sm:flex-col">
          This is an unprotected page:
          <pre className="rounded-md border bg-card p-1 text-card-foreground">routes/index.tsx</pre>
        </div>
      </div>

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
      <p>Welcome back, {user.name}!</p>

      <Button asChild className="mb-2 w-fit" size="lg">
        <Link to="/app">Go to App</Link>
      </Button>

      <div className="text-center text-xs sm:text-sm">
        Session user:
        <pre className="max-w-screen overflow-x-auto px-2 text-start">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <SignOutButton />
    </div>
  ) : (
    <div className="flex flex-col items-center gap-2">
      <p>You are not signed in.</p>

      <Button asChild className="w-fit" size="lg">
        <Link to="/login">Log in</Link>
      </Button>

      <ThemeToggle />
    </div>
  );
}
