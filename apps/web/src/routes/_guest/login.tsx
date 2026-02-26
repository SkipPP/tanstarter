import authClient from "@repo/auth/auth-client";
import { Field, FieldDescription, FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAppForm } from "@/components/form";

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

          <p className="text-sm text-balance text-muted-foreground">
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
              placeholder="************"
              autoComplete="current-password"
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="Login" />
        </form.AppForm>

        <Field>
          <FieldDescription className="col-span-2 text-center">
            Don&apos;t have an account ?{" "}
            <Link to="/signup" className="underline underline-offset-4">
              Sign up
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
