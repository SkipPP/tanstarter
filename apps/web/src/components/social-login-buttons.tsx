import { authClient } from "@repo/auth/auth-client";
import { Button } from "@repo/ui/components/button";
import { Spinner } from "@repo/ui/components/spinner";
import {
  IconBrandAppleFilled,
  IconBrandDiscordFilled,
  IconBrandGithubFilled,
  IconBrandGoogleFilled,
} from "@tabler/icons-react";
import React, { type ComponentType } from "react";
import { toast } from "sonner";

/** Better Auth built-in social provider IDs supported by signIn.social */
export type SocialProviderId = "google" | "github" | "apple" | "discord";

type ProviderConfig = {
  label: string;
  Icon: ComponentType<{ className?: string }>;
};

const PROVIDER_CONFIG: Record<SocialProviderId, ProviderConfig> = {
  google: {
    label: "Google",
    Icon: IconBrandGoogleFilled,
  },
  github: {
    label: "GitHub",
    Icon: IconBrandGithubFilled,
  },
  apple: {
    label: "Apple",
    Icon: IconBrandAppleFilled,
  },
  discord: {
    label: "Discord",
    Icon: IconBrandDiscordFilled,
  },
};

export type SocialLoginButtonsProps = {
  /** URL to redirect to after successful auth */
  callbackURL: string;
  /** Provider IDs to show. Defaults to ["google"]. Must match providers enabled in auth config. */
  providers?: SocialProviderId[];
  /** Action verb for button labels, e.g. "Login" or "Sign up". Defaults to "Login". */
  actionLabel?: string;
  /** Loading text shown on the submitting button. Defaults to "Logging in..." or "Signing up..." based on actionLabel. */
  loadingLabel?: string;
  /** Button variant. Defaults to "outline". */
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
};

export function SocialLoginButtons({
  callbackURL,
  providers = ["google"],
  actionLabel = "Login",
  loadingLabel = actionLabel === "Sign up" ? "Signing up..." : "Logging in...",
  variant = "outline",
  className,
}: SocialLoginButtonsProps) {
  const [submittingProvider, setSubmittingProvider] = React.useState<SocialProviderId | null>(null);

  const handleSignIn = (providerId: SocialProviderId) => {
    setSubmittingProvider(providerId);

    const config = PROVIDER_CONFIG[providerId];
    const label = config?.label ?? providerId;

    toast.promise(
      (async () => {
        const result = await authClient.signIn.social({
          provider: providerId,
          callbackURL,
        });

        // Better Auth always resolves; errors are on result.error, so we must throw to trigger toast.promise error path
        if (result?.error) {
          const err = result.error as {
            message?: string;
            code?: string;
            status?: number;
            statusText?: string;
          };

          throw new Error(
            err?.message ?? err?.statusText ?? `An error occurred while logging in with ${label}`,
          );
        }

        return result.data;
      })(),
      {
        loading: `${actionLabel} with ${label}...`,
        success: () => {
          setSubmittingProvider(null);

          return `Logged in with ${label}`;
        },
        error: (error) => {
          setSubmittingProvider(null);

          return error?.message ?? `An error occurred while logging in with ${label}`;
        },
      },
    );
  };

  return (
    <div
      className={providers.length > 1 ? "grid gap-2 lg:grid-cols-2" : "flex flex-col"}
      role="group"
      aria-label={`${actionLabel} with social providers`}
    >
      {providers.map((providerId) => {
        const config = PROVIDER_CONFIG[providerId];
        if (!config) return null;

        const { label, Icon } = config;
        const buttonLabel = `${actionLabel} with ${label}`;
        const isProviderSubmitting = submittingProvider === providerId;
        const isDisabled = submittingProvider !== null;

        return (
          <Button
            key={providerId}
            type="button"
            variant={variant}
            className={className}
            disabled={isDisabled}
            onClick={() => handleSignIn(providerId)}
            aria-label={buttonLabel}
            aria-busy={isProviderSubmitting}
          >
            {isProviderSubmitting ? (
              <Spinner aria-hidden />
            ) : (
              <Icon className="size-4" aria-hidden />
            )}
            {isProviderSubmitting ? loadingLabel : buttonLabel}
          </Button>
        );
      })}
    </div>
  );
}
