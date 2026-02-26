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
    <main className="grid min-h-svh bg-card lg:grid-cols-2">
      <section className="flex flex-col gap-4 p-10">
        <div className="flex justify-start gap-2">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src="/logo-partitio-blanc.png" alt="Partitio" className="h-9 w-full" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconBug className="text-red-500" />
                </EmptyMedia>

                <EmptyTitle>500 - Internal Server Error</EmptyTitle>

                <EmptyDescription>
                  An unexpected error occurred. Please try again later.
                </EmptyDescription>
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
