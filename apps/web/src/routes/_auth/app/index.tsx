import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndex,
});

function AppIndex() {
  // we can also use the useAuth() or useAuthSuspense() hooks here from @repo/auth/tanstack/hooks
  const { user } = Route.useRouteContext();

  return (
    <div className="space-y-2 px-4 py-2">
      <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>

      <p className="text-sm text-muted-foreground">You are logged in as "{user.email}".</p>
    </div>
  );
}
