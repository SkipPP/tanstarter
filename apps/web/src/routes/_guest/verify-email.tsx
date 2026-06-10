import { authClient } from "@repo/auth/auth-client";
import { FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { safeInternalRedirectPath } from "@/lib/safe-redirect";

export const Route = createFileRoute("/_guest/verify-email")({
  component: VerifyEmailForm,
  validateSearch: z.object({
    token: z.string().nonempty("Token is required"),
    callbackURL: z
      .string()
      .optional()
      .transform((value) => safeInternalRedirectPath(value ?? "/app")),
  }),
  beforeLoad: ({ search }) => {
    if (!search.token) {
      throw new Error("Token is missing");
    }

    return {
      token: search.token,
      callbackURL: search.callbackURL,
    };
  },
});

function VerifyEmailForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate();

  const { token, callbackURL } = Route.useSearch();

  const hasStartedRef = useRef(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
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
          const message = error.message || "An error occurred while verifying your email.";

          setErrorMessage(message);
          toast.error(message);
        },
      },
    );
  }, [navigate, callbackURL, token]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">
            {errorMessage ? "We couldn't verify your email." : "Verifying your email address..."}
          </h1>
        </div>

        {errorMessage ? (
          <div className="text-center text-sm text-destructive">{errorMessage}</div>
        ) : (
          <div className="text-center text-sm text-muted-foreground">
            This should only take a moment.
          </div>
        )}
      </FieldGroup>
    </div>
  );
}
