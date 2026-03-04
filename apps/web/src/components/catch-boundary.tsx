import { Button } from "@repo/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { IconBug } from "@tabler/icons-react";
import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from "@tanstack/react-router";

export function DefaultCatchBoundary({ error }: Readonly<ErrorComponentProps>) {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  console.error(error);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconBug className="text-red-500" />
        </EmptyMedia>

        <EmptyTitle>500 - Internal Server Error</EmptyTitle>

        <EmptyDescription>An unexpected error occurred. Please try again later.</EmptyDescription>
      </EmptyHeader>

      <ErrorComponent error={error} />

      <EmptyContent className="flex-row items-center justify-center gap-2">
        <Button
          type="button"
          onClick={async () => {
            await router.invalidate();
          }}
        >
          Try Again
        </Button>

        {isRoot ? (
          <Button asChild variant="outline">
            <Link to="/">Home</Link>
          </Button>
        ) : (
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
