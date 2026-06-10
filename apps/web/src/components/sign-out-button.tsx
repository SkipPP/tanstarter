import { authClient } from "@repo/auth/auth-client";
import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { Button } from "@repo/ui/components/button";
import { IconLogout } from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return (
    <Button
      type="button"
      className={className}
      variant="destructive"
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onResponse: async () => {
              // manually set to null to avoid unnecessary refetching
              queryClient.setQueryData(authQueryOptions().queryKey, null);
              await router.invalidate();
            },
          },
        });
      }}
    >
      <IconLogout />
      Sign out
    </Button>
  );
}
