import { Button } from "@repo/ui/components/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/empty";
import { InputGroup, InputGroupInput, InputGroupAddon } from "@repo/ui/components/input-group";
import { Kbd } from "@repo/ui/components/kbd";
import { IconAlertCircle, IconSearch } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconAlertCircle className="text-red-500" />
        </EmptyMedia>

        <EmptyTitle>404 - Not Found</EmptyTitle>

        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for what you need
          below.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="flex-col items-center justify-center gap-2">
        <InputGroup>
          <InputGroupInput placeholder="Try searching for pages..." />

          <InputGroupAddon>
            <IconSearch />
          </InputGroupAddon>

          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>

        <div className="flex flex-row justify-center gap-2">
          <Button type="button" onClick={() => window.history.back()}>
            Go Back
          </Button>

          <Button asChild variant="outline">
            <Link to="/app">Home</Link>
          </Button>
        </div>
      </EmptyContent>
    </Empty>
  );
}

export function DefaultNotFound() {
  return (
    <main className="grid min-h-svh bg-card lg:grid-cols-2">
      <section className="flex flex-col gap-4 p-10">
        <div className="flex justify-start gap-2">
          <Link to="/" className="flex items-center gap-2 font-medium">
            <img src="/logo-partitio-blanc.png" alt="Tanstarter" className="h-9 w-full" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconAlertCircle className="text-red-500" />
                </EmptyMedia>

                <EmptyTitle>404 - Not Found</EmptyTitle>

                <EmptyDescription>
                  The page you&apos;re looking for doesn&apos;t exist. Try searching for what you
                  need below.
                </EmptyDescription>
              </EmptyHeader>

              <EmptyContent className="flex-col items-center justify-center gap-2">
                <InputGroup>
                  <InputGroupInput placeholder="Try searching for pages..." />

                  <InputGroupAddon>
                    <IconSearch />
                  </InputGroupAddon>

                  <InputGroupAddon align="inline-end">
                    <Kbd>/</Kbd>
                  </InputGroupAddon>
                </InputGroup>

                <div className="flex flex-row justify-center gap-2">
                  <Button type="button" onClick={() => window.history.back()}>
                    Go Back
                  </Button>

                  <Button asChild variant="outline">
                    <Link to="/">Home</Link>
                  </Button>
                </div>
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
