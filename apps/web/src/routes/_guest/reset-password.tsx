import { authClient } from "@repo/auth/auth-client";
import { FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AuthPageHeader, AuthState } from "@/components/auth-page";
import { useAppForm } from "@/components/form";

export const Route = createFileRoute("/_guest/reset-password")({
  component: ResetPasswordForm,
  validateSearch: z.object({
    token: z.string().min(1).optional(),
  }),
});

const formValidator = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8, "Enter the password again"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Make sure both passwords match",
  });

function ResetPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();
  const navigate = useNavigate();

  const { token } = Route.useSearch();

  const form = useAppForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: formValidator,
      onSubmit: formValidator,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      if (!token) {
        toast.error("This password reset link is invalid.");
        return;
      }

      await authClient.resetPassword(
        {
          token,
          newPassword: value.password,
        },
        {
          onSuccess: async () => {
            toast.success("Your password has been reset.", {
              description: "Redirecting you to the login page...",
            });
            await navigate({ to: "/login" });
          },
          onError: ({ error }) => {
            toast.error(
              import.meta.env.DEV && error.message
                ? error.message
                : "This password reset link is invalid or has expired.",
            );
          },
        },
      );
    },
  });

  if (!token) {
    return (
      <div className={className}>
        <AuthState
          tone="error"
          title="This reset link isn’t valid"
          description="The link may have expired or already been used. Request a new one to continue."
          action={{ label: "Request a new link", to: "/forgot-password" }}
        />
      </div>
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
          eyebrow="Choose a new password"
          title="Secure your account"
          description="Create a new password with at least 8 characters. Make it unique to this account."
        />

        <form.AppField name="password">
          {(field) => (
            <field.PasswordField
              label="New password"
              placeholder="•••••••••••••"
              description="Use at least 8 characters."
              autoComplete="new-password"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordField
              label="Confirm password"
              placeholder="•••••••••••••"
              autoComplete="new-password"
              required
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="Save new password" loadingLabel="Saving new password…" />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
