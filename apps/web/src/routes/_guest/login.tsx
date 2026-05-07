import authClient from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import { Field, FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { IconArrowRight } from "@tabler/icons-react";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAppForm } from "@/components/form";
import { SocialLoginButtons } from "@/components/social-login-buttons";

export const Route = createFileRoute("/_guest/login")({
  component: LoginForm,
});

const formValidator = z.object({
  email: z.email("Email is required"),
  password: z.string().min(8, "Password is too short"),
});

function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();

  const { redirectUrl } = Route.useRouteContext();

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
          callbackURL: redirectUrl,
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
                        callbackURL: redirectUrl,
                      },
                      {
                        onSuccess: () => {
                          toast.success(
                            "A new verification email has been sent to your email address.",
                          );
                        },
                        onError: ({ error }) => {
                          toast.error(
                            error.message ||
                              "An error occurred while resending the verification email.",
                          );
                        },
                      },
                    );
                  },
                },
              });

              return;
            }

            toast.error(error.message || "An error occurred while signing in.");
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
          <h1 className="text-2xl font-bold">Login to your account</h1>

          <p className="hidden text-sm text-balance text-muted-foreground lg:block">
            Enter your email below to login to your account
          </p>
        </div>

        <form.AppField name="email">
          {(field) => (
            <field.InputField label="Email" placeholder="mail@example.com" type="email" />
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
                  className="ml-auto text-xs text-muted-foreground hover:underline"
                >
                  Forgot password ?
                </Link>
              }
            />
          )}
        </form.AppField>

        <Field>
          <form.AppForm>
            <form.SubmitButton label="Login" loadingLabel="Logging in..." />
          </form.AppForm>

          <SocialLoginButtons
            callbackURL={redirectUrl}
            actionLabel="Login"
            providers={["google", "github"]}
          />
        </Field>

        <Field className="w-fit self-center">
          <Button asChild variant="link" size="sm" className="text-muted-foreground underline">
            <Link to="/signup">
              <IconArrowRight /> Don't have an account ? Sign up
            </Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
