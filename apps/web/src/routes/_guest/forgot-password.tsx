import authClient from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import { Field, FieldGroup } from "@repo/ui/components/field";
import { cn } from "@repo/ui/lib/utils";
import { IconArrowLeft } from "@tabler/icons-react";
import { revalidateLogic } from "@tanstack/react-form-start";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useId } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { useAppForm } from "@/components/form";

export const Route = createFileRoute("/_guest/forgot-password")({
  component: ForgotPasswordForm,
});

const formValidator = z.object({
  email: z.email("Email is required"),
});

function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
  const id = useId();

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
      await authClient.requestPasswordReset(
        {
          email: value.email,
          redirectTo: "/reset-password",
        },
        {
          onSuccess: () => {
            toast.success("A password reset email has been sent to your email address.");
          },
          onError: ({ error }) => {
            toast.error(error.message || "An error occurred while requesting a password reset.");
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
          <h1 className="text-2xl font-bold">Forgot your password ?</h1>

          <p className="hidden text-sm text-balance text-muted-foreground lg:block">
            Enter your email below to request a password reset.
          </p>
        </div>

        <form.AppField name="email">
          {(field) => (
            <field.InputField label="Email" placeholder="mail@example.com" type="email" required />
          )}
        </form.AppField>

        <form.AppForm>
          <form.SubmitButton
            label="Request Password Reset"
            loadingLabel="Requesting Password Reset..."
          />
        </form.AppForm>

        <Field className="w-fit self-center">
          <Button asChild variant="link" size="sm" className="text-muted-foreground underline">
            <Link to="/login">
              <IconArrowLeft /> Back to login
            </Link>
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
