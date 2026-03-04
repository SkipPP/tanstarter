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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} variant="inset" />

      <SidebarInset>
        <SiteHeader />

        <section className="@container/main flex flex-1 flex-col gap-2">
          <Outlet />
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
