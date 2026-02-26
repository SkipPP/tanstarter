import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { IconDeviceDesktop, IconMoon, IconSun } from "@tabler/icons-react";
import { useRouteContext, useRouter } from "@tanstack/react-router";

import { setThemeServerFn } from "@/lib/theme";

export function ThemeToggle({ className }: { className?: string }) {
  const router = useRouter();
  const { theme } = useRouteContext({ from: "__root__" });

  function toggleTheme(theme: "light" | "dark" | "system") {
    setThemeServerFn({ data: theme }).then(() => router.invalidate());
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={className} asChild>
        <Button variant="secondary" size="icon">
          <IconMoon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "system"
                ? "scale-0 -rotate-90"
                : "scale-100 rotate-0 dark:scale-0 dark:-rotate-90"
            }`}
          />
          <IconSun
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "system"
                ? "scale-0 rotate-90"
                : "scale-0 rotate-90 dark:scale-100 dark:rotate-0"
            }`}
          />
          <IconDeviceDesktop
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "system" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
            }`}
          />

          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onCheckedChange={(v) => v && toggleTheme("light")}
        >
          Light
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onCheckedChange={(v) => v && toggleTheme("dark")}
        >
          Dark
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={theme === "system"}
          onCheckedChange={(v) => v && toggleTheme("system")}
        >
          System
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
