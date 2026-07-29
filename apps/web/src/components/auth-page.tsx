import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import { IconAlertCircle, IconCircleCheck, IconLoader2 } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

type AuthPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AuthPageHeader({ eyebrow, title, description }: AuthPageHeaderProps) {
  return (
    <header className="space-y-3">
      <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        {eyebrow}
      </p>
      <div className="space-y-2">
        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-balance">{title}</h1>
        <p className="max-w-md text-sm leading-relaxed text-pretty text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  );
}

type AuthPagePromptProps = {
  prompt: string;
  label: string;
  to: "/login" | "/signup" | "/forgot-password";
};

export function AuthPagePrompt({ prompt, label, to }: AuthPagePromptProps) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link
        to={to}
        className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
      >
        {label}
      </Link>
    </p>
  );
}

type AuthStateProps = {
  title: string;
  description: string;
  tone: "error" | "loading" | "success";
  action?: {
    label: string;
    to: "/login" | "/forgot-password";
  };
};

export function AuthState({ title, description, tone, action }: AuthStateProps) {
  const Icon =
    tone === "error" ? IconAlertCircle : tone === "success" ? IconCircleCheck : IconLoader2;

  return (
    <section
      className="flex flex-col items-center gap-6 py-4 text-center"
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-2xl",
          tone === "error"
            ? "bg-destructive/10 text-destructive"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className={cn("size-6", tone === "loading" && "animate-spin")} aria-hidden />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground">{description}</p>
      </div>

      {action ? (
        <Button asChild size="lg" className="w-full">
          <Link to={action.to}>{action.label}</Link>
        </Button>
      ) : null}
    </section>
  );
}
