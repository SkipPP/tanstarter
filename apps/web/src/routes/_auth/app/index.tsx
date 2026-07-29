import { queryOptions } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { $getGreeting } from "@/lib/example-protected-server";

const greetingQueryOptions = () =>
  queryOptions({
    queryKey: ["greeting"],
    queryFn: ({ signal }) => $getGreeting({ signal }),
    staleTime: 60_000,
  });

export const Route = createFileRoute("/_auth/app/")({
  component: AppIndex,
  loader: async ({ context }) => {
    const greeting = await context.queryClient.ensureQueryData(greetingQueryOptions());

    return {
      greeting,
    };
  },
});

function AppIndex() {
  // we can also use the useAuth() or useAuthSuspense() hooks here from @repo/auth/tanstack/hooks
  const { user } = Route.useRouteContext();
  const { greeting } = Route.useLoaderData();

  return (
    <div className="space-y-2 px-4 py-2">
      <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>

      <p className="text-sm text-muted-foreground">{greeting.message}</p>
    </div>
  );
}
