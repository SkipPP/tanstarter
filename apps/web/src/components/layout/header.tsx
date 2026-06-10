import { Separator } from "@repo/ui/components/separator";
import { SidebarTrigger } from "@repo/ui/components/sidebar";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="flex h-12 items-center gap-2 border-b">
      <div className="flex w-full items-center gap-1 px-4">
        <SidebarTrigger variant="secondary" />

        <Separator orientation="vertical" className="mx-2" />

        <h1 className="text-base font-medium">Documents</h1>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle variant="secondary" size="icon-sm" />
        </div>
      </div>
    </header>
  );
}
