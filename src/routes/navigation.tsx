import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { NavigationItem } from "@/lib/api/types";

export const Route = createFileRoute("/navigation")({
  head: () => ({
    meta: [
      { title: "Navigation — Atelier CMS" },
      { name: "description", content: "Manage site menus and links." },
    ],
  }),
  component: NavigationPage,
});

const columns: Column<NavigationItem>[] = [
  { header: "Title", cell: (n) => <span className="font-medium">{n.title}</span> },
  { header: "Menu", cell: (n) => <span className="text-sm text-muted-foreground">{n.menu_name}</span> },
  { header: "URL", cell: (n) => <span className="text-sm font-mono text-muted-foreground">{n.url}</span> },
  { header: "Type", cell: (n) => <span className="text-sm capitalize text-muted-foreground">{n.item_type}</span> },
  { header: "Order", align: "right", cell: (n) => <span className="text-sm tabular-nums text-muted-foreground">{n.sort_order}</span> },
  { header: "Status", cell: (n) => <StatusBadge status={n.status} /> },
];

function NavigationPage() {
  return (
    <div>
      <PageHeader title="Navigation" description="Items in your primary, footer, and other menus." actionLabel="New item" />
      <ResourceTable<NavigationItem>
        queryKey="navigation-items"
        fetcher={(p) => api.navigation.list(p)}
        columns={columns}
        searchPlaceholder="Search menu items…"
      />
    </div>
  );
}
