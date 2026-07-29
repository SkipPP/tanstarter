import { cn } from "@repo/ui/lib/utils";
import { IconLoader } from "@tabler/icons-react";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <IconLoader aria-hidden="true" className={cn("size-4 animate-spin", className)} {...props} />
  );
}

export { Spinner };
