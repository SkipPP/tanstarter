import authClient from "@repo/auth/auth-client";
import { FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAppForm } from "@/components/form";

export const Route = createFileRoute("/_guest/verify-email")({
  component: VerifyEmailForm,
  validateSearch: z.object({
    token: z.string().nonempty("Token is required"),
    callbackURL: z.string().optional(),
  }),
  beforeLoad: ({ search }) => {
    if (!search.token) {
      throw new Error("Token is missing");
    }

    return {
      token: search.token,
      callbackURL: search.callbackURL ?? "/app",
    };
  },
});

function VerifyEmailForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();
  const navigate = useNavigate();

  const { token, callbackURL } = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      token,
    },
    onSubmit: async () => {
      await authClient.verifyEmail(
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
            toast.error(error.message || "An error occurred while verifying your email.");
          },
        },
      );
    },
  });

  return (
    <form
      id={id}
      className={cn("flex flex-col gap-6", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        form.handleSubmit();
      }}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Verify your email</h1>

          <p className="hidden text-sm text-balance text-muted-foreground lg:block">
            Click the button below to verify your email address
          </p>
        </div>

        <form.AppForm>
          <form.SubmitButton label="Verify Email" loadingLabel="Verifying email..." />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
