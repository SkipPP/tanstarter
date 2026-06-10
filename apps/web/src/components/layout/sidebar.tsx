import { AuthQueryResult } from "@repo/auth/tanstack/queries";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileWord,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconUsers,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import * as React from "react";

import { NavDocuments } from "@/components/layout/nav-documents";
import { NavMain } from "@/components/layout/nav-main";
import { NavUser } from "@/components/layout/nav-user";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/app",
      icon: IconDashboard,
    },
    {
      title: "Lifecycle",
      url: "/app",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "/app",
      icon: IconChartBar,
    },
    {
      title: "Projects",
      url: "/app",
      icon: IconFolder,
    },
    {
      title: "Team",
      url: "/app",
      icon: IconUsers,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "/app",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "/app",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "/app",
      icon: IconFileWord,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: AuthQueryResult;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link to="/app">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">TanStarter</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
