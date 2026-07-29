import { authClient } from "@repo/auth/auth-client";
import { $getOAuthProviders } from "@repo/auth/tanstack/functions";
import { Field, FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AuthPageHeader, AuthPagePrompt } from "@/components/auth-page";
import { useAppForm } from "@/components/form";
import { SocialLoginButtons } from "@/components/social-login-buttons";
import { safeInternalRedirectPath } from "@/lib/safe-redirect";

export const Route = createFileRoute("/_guest/login")({
  component: LoginForm,
  loader: () => $getOAuthProviders(),
});

const formValidator = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Enter your password (at least 8 characters)"),
});

function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();

  const { redirectUrl } = Route.useRouteContext();
  const providers = Route.useLoaderData();
  const safeRedirectUrl = safeInternalRedirectPath(redirectUrl);

  const form = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: formValidator,
      onSubmit: formValidator,
    },
    validationLogic: revalidateLogic(),
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          ...value,
          callbackURL: safeRedirectUrl,
        },
        {
          onError: ({ error }) => {
            if (error.status === 403) {
              toast.error("Please verify your email address.", {
                action: {
                  label: "Send Email",
                  onClick: async () => {
                    await authClient.sendVerificationEmail(
                      {
                        email: value.email,
                        callbackURL: safeRedirectUrl,
                      },
                      {
                        onSuccess: () => {
                          toast.success(
                            "A new verification email has been sent to your email address.",
                          );
                        },
                        onError: ({ error }) => {
                          toast.error(
                            import.meta.env.DEV && error.message
                              ? error.message
                              : "The verification email could not be sent. Please try again later.",
                          );
                        },
                      },
                    );
                  },
                },
              });

              return;
            }

            toast.error(
              import.meta.env.DEV && error.message
                ? error.message
                : "Unable to sign in with those credentials.",
            );
          },
          // better-auth seems to trigger a hard navigation on login,
          // so we don't have to revalidate & navigate ourselves
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
          eyebrow="Welcome back"
          title="Sign in to your account"
          description="Enter your details to continue to your workspace."
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

        <form.AppField name="password">
          {(field) => (
            <field.PasswordField
              label="Password"
              placeholder="•••••••••••••"
              autoComplete="current-password"
              action={
                <Link
                  to="/forgot-password"
                  className="ms-auto text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Forgot password?
                </Link>
              }
            />
          )}
        </form.AppField>

        <Field>
          <form.AppForm>
            <form.SubmitButton label="Sign in" loadingLabel="Signing in…" />
          </form.AppForm>

          {providers.length > 0 ? (
            <SocialLoginButtons
              callbackURL={safeRedirectUrl}
              actionLabel="Continue"
              providers={providers}
            />
          ) : null}
        </Field>

        <AuthPagePrompt prompt="New to TanStarter?" label="Create an account" to="/signup" />
      </FieldGroup>
    </form>
  );
}
