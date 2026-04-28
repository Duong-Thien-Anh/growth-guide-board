import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, Files, Briefcase, Image as ImageIcon, Settings, Sparkles,
  ShoppingBag, Receipt, Ticket, FolderTree, Tag as TagIcon,
  Users, UserSquare2, Navigation, ArrowLeftRight, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/api/client";
import { useNavigate } from "@tanstack/react-router";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }> };

const overview: Item[] = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
];

const content: Item[] = [
  { title: "Posts", url: "/posts", icon: FileText },
  { title: "Pages", url: "/pages", icon: Files },
  { title: "Portfolios", url: "/portfolios", icon: Briefcase },
  { title: "Media", url: "/media", icon: ImageIcon },
  { title: "Categories", url: "/categories", icon: FolderTree },
  { title: "Tags", url: "/tags", icon: TagIcon },
];

const commerce: Item[] = [
  { title: "Products", url: "/products", icon: ShoppingBag },
  { title: "Orders", url: "/orders", icon: Receipt },
  { title: "Coupons", url: "/coupons", icon: Ticket },
];

const crm: Item[] = [
  { title: "Contacts", url: "/contacts", icon: Users },
  { title: "Leads", url: "/leads", icon: UserSquare2 },
];

const site: Item[] = [
  { title: "Navigation", url: "/navigation", icon: Navigation },
  { title: "Redirects", url: "/redirects", icon: ArrowLeftRight },
];

const account: Item[] = [{ title: "Settings", url: "/settings", icon: Settings }];

function Group({ label, items, isActive }: { label: string; items: Item[]; isActive: (u: string) => boolean }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-2.5">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const isActive = (url: string) => (url === "/" ? path === "/" : path.startsWith(url));

  function signOut() {
    auth.clear();
    navigate({ to: "/login" });
  }

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold">Atelier CMS</div>
              <div className="text-xs text-muted-foreground">Marketing workspace</div>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Group label="Workspace" items={overview} isActive={isActive} />
        <Group label="Content" items={content} isActive={isActive} />
        <Group label="Commerce" items={commerce} isActive={isActive} />
        <Group label="CRM" items={crm} isActive={isActive} />
        <Group label="Site" items={site} isActive={isActive} />
        <Group label="Account" items={account} isActive={isActive} />
      </SidebarContent>

      <SidebarFooter className="p-3 gap-2">
        {!collapsed && (
          <div className="rounded-lg border bg-card p-3 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-0.5">Need help?</div>
            Editor handbook explains every screen in plain language.
          </div>
        )}
        <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
