import { authClient } from "@repo/auth/auth-client";
import { cn } from "@repo/ui/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AuthState } from "@/components/auth-page";
import { safeInternalRedirectPath } from "@/lib/safe-redirect";

export const Route = createFileRoute("/_guest/verify-email")({
  component: VerifyEmailForm,
  validateSearch: z.object({
    token: z.string().min(1).optional().catch(undefined),
    callbackURL: z
      .string()
      .optional()
      .catch(undefined)
      .transform((value) => safeInternalRedirectPath(value ?? "/app")),
  }),
});

function VerifyEmailForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();

  const { token, callbackURL } = Route.useSearch();

  const hasStartedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMessage("This verification link is invalid or has expired.");
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    setErrorMessage(null);

    void authClient.verifyEmail(
      {
        query: {
          token,
          callbackURL,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Email verified.", {
            description: "Redirecting you to the dashboard...",
          });

          await navigate({ to: callbackURL });
        },
        onError: ({ error }) => {
          const message =
            import.meta.env.DEV && error.message
              ? error.message
              : "This verification link is invalid or has expired.";

          setErrorMessage(message);
        },
      },
    );
  }, [navigate, callbackURL, token]);

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {errorMessage ? (
        <AuthState
          tone="error"
          title="We couldn’t verify your email"
          description={errorMessage}
          action={{ label: "Return to sign in", to: "/login" }}
        />
      ) : (
        <AuthState
          tone="loading"
          title="Verifying your email"
          description="This should only take a moment. You’ll be redirected automatically."
        />
      )}
    </div>
  );
}
