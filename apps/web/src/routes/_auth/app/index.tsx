import { $getGreeting } from "@/lib/example-protected-server";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndex,
});

function AppIndex() {
  // we can also use the useAuth() or useAuthSuspense() hooks here from @repo/auth/tanstack/hooks
  const { user } = Route.useRouteContext();
  const { data: greeting } = useQuery({
    queryKey: ["greeting"],
    queryFn: () => $getGreeting(),
  });

  return (
    <div className="space-y-2 px-4 py-2">
      <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>

      <p className="text-sm text-muted-foreground">You are logged in as "{user.email}".</p>

      {greeting && (
        <p className="text-sm text-muted-foreground">
          From protected server function: {greeting.message}
        </p>
      )}
    </div>
  );
}
