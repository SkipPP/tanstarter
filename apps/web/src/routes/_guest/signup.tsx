import { authClient } from "@repo/auth/auth-client";
import { $getOAuthProviders } from "@repo/auth/tanstack/functions";
import { Field, FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import z from "zod";

import { AuthPageHeader, AuthPagePrompt } from "@/components/auth-page";
import { useAppForm } from "@/components/form";
import { SocialLoginButtons } from "@/components/social-login-buttons";
import { safeInternalRedirectPath } from "@/lib/safe-redirect";

export const Route = createFileRoute("/_guest/signup")({
  component: SignupForm,
  loader: () => $getOAuthProviders(),
});

const formValidator = z
  .object({
    name: z.string().trim().min(1, "Enter your name"),
    email: z.email("Enter a valid email address"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(8, "Enter the password again"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Make sure both passwords match",
  });

function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();
  const navigate = useNavigate();

  const { redirectUrl } = Route.useRouteContext();
  const providers = Route.useLoaderData();
  const safeRedirectUrl = safeInternalRedirectPath(redirectUrl);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: formValidator,
      onSubmit: formValidator,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await authClient.signUp.email(
        {
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: safeRedirectUrl,
        },
        {
          onSuccess: async () => {
            toast.success("Account created successfully.", {
              description: "Please check your email for verification.",
            });

            await navigate({ to: "/login" });
          },
          onError: ({ error }) => {
            toast.error(
              import.meta.env.DEV && error.message
                ? error.message
                : "Unable to create the account. Please try again later.",
            );
          },
        },
      );
    },
  });

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
          eyebrow="Get started"
          title="Create your account"
          description="Set up your profile and start working in just a few moments."
        />

        <form.AppField name="name">
          {(field) => (
            <field.InputField
              label="Full name"
              placeholder="John Doe"
              type="text"
              autoComplete="name"
              required
            />
          )}
        </form.AppField>

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

        <form.AppField name="password">
          {(field) => (
            <field.PasswordField
              label="Password"
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

        <Field>
          <form.AppForm>
            <form.SubmitButton label="Create account" loadingLabel="Creating account…" />
          </form.AppForm>

          {providers.length > 0 ? (
            <SocialLoginButtons
              callbackURL={safeRedirectUrl}
              actionLabel="Sign up"
              providers={providers}
            />
          ) : null}
        </Field>

        <AuthPagePrompt prompt="Already have an account?" label="Sign in" to="/login" />
      </FieldGroup>
    </form>
  );
}
