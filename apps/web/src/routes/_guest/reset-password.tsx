import { authClient } from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import { FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAppForm } from "@/components/form";

export const Route = createFileRoute("/_guest/reset-password")({
  component: ResetPasswordForm,
  validateSearch: z.object({
    token: z.string().min(1).optional(),
  }),
});

const formValidator = z
  .object({
    password: z.string().min(8, "Password is too short"),
    confirmPassword: z.string().min(8, "Confirm password is too short"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
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
      <div className={cn("flex flex-col gap-6 text-center", className)}>
        <h1 className="text-2xl font-bold">Invalid password reset link</h1>
        <p className="text-sm text-muted-foreground">Request a new link to reset your password.</p>
        <Button asChild>
          <Link to="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold">Reset your password</h1>

          <p className="hidden text-sm text-balance text-muted-foreground lg:block">
            Enter your new password below to reset your password.
          </p>
        </div>

        <form.AppField name="password">
          {(field) => (
            <field.PasswordField
              label="New password"
              placeholder="************"
              autoComplete="new-password"
              required
            />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordField
              label="Confirm password"
              placeholder="************"
              autoComplete="new-password"
              required
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="Reset Password" loadingLabel="Resetting Password..." />
        </form.AppForm>
      </FieldGroup>
    </form>
  );
}
