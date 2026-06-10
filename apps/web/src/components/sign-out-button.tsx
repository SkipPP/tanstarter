import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { $signOut } from "@repo/auth/tanstack/functions";
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
        await $signOut();
        queryClient.setQueryData(authQueryOptions().queryKey, null);
        await router.invalidate();
      }}
    >
      <IconLogout />
      Sign out
    </Button>
  );
}
