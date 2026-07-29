import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

import { SiteHeader } from "@/components/layout/header";
import { AppSidebar } from "@/components/layout/sidebar";
import { NotFound } from "@/components/not-found";

export const Route = createFileRoute("/_auth/app")({
  component: AppLayout,
  notFoundComponent: NotFound,
});

function AppLayout() {
  const { user } = Route.useRouteContext();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />

      <SidebarInset>
        <SiteHeader />

        <main className="@container/main flex flex-1 flex-col gap-2">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
