import { authClient } from "@repo/auth/auth-client";
import { FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute } from "@tanstack/react-router";
import { useId, useState } from "react";
import { z } from "zod";

import { AuthPageHeader, AuthPagePrompt, AuthState } from "@/components/auth-page";
import { useAppForm } from "@/components/form";

export const Route = createFileRoute("/_guest/forgot-password")({
  component: ForgotPasswordForm,
});

const formValidator = z.object({
  email: z.email("Enter a valid email address"),
});

function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();
  const [isComplete, setIsComplete] = useState(false);

  const form = useAppForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChange: formValidator,
      onSubmit: formValidator,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      const showGenericConfirmation = () => {
        setIsComplete(true);
      };

      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: "/reset-password",
        },
        {
          onSuccess: showGenericConfirmation,
          // Keep the response indistinguishable to avoid account enumeration.
          onError: showGenericConfirmation,
        },
      );
    },
  });

  if (isComplete) {
    return (
      <AuthState
        tone="success"
        title="Check your inbox"
        description="If an account exists for that email address, we’ll send a password reset link shortly."
        action={{ label: "Return to sign in", to: "/login" }}
      />
    );
  }

  return (
    <form
      id={id}
      className={cn("flex flex-col gap-8", className)}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        form.handleSubmit();
      }}
      {...props}
    >
      <FieldGroup>
        <AuthPageHeader
          eyebrow="Account recovery"
          title="Reset your password"
          description="Enter your email address and we’ll send you a secure link to choose a new password."
        />

        <form.AppField name="email">
          {(field) => (
            <field.InputField
              label="Email address"
              placeholder="name@example.com"
              type="email"
              autoComplete="email"
              required
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton
            label="Send reset link"
            loadingLabel="Sending reset link…"
          />
        </form.AppForm>

        <AuthPagePrompt prompt="Remembered your password?" label="Return to sign in" to="/login" />
      </FieldGroup>
    </form>
  );
}
