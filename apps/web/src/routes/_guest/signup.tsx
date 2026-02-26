import authClient from "@repo/auth/auth-client";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { Field, FieldDescription, FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { revalidateLogic } from "@tanstack/react-form-start";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import z from "zod";

import { useAppForm } from "@/components/form";

export const Route = createFileRoute("/_guest/signup")({
  component: SignupForm,
});

const formValidator = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Email is required"),
    password: z.string().min(8, "Password is too short"),
    confirmPassword: z.string().min(8, "Confirm password is too short"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { redirectUrl } = Route.useRouteContext();

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
          ...value,
          callbackURL: redirectUrl,
        },
        {
          onError: ({ error }) => {
            toast.error(error.message || "An error occurred while signing up.");
          },
          onSuccess: async () => {
            queryClient.removeQueries({ queryKey: authQueryOptions().queryKey });
            await navigate({ to: redirectUrl });
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
          <h1 className="text-2xl font-bold">Create an account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Enter your informations to create your account
          </p>
        </div>

        <form.AppField name="name">
          {(field) => <field.InputField label="Name" placeholder="John Doe" type="text" />}
        </form.AppField>

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
              autoComplete="new-password"
            />
          )}
        </form.AppField>

        <form.AppField name="confirmPassword">
          {(field) => (
            <field.PasswordField
              label="Confirm Password"
              placeholder="************"
              autoComplete="new-password"
            />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton label="Sign up" />
        </form.AppForm>

        <Field>
          <FieldDescription className="text-center">
            Already have an account ?{" "}
            <Link
              to="/login"
              data-disabled={form.state.isSubmitting}
              className="underline underline-offset-4 data-[disabled=true]:pointer-events-none"
            >
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
