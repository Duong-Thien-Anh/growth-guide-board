import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { Order } from "@/lib/api/types";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Atelier CMS" },
      { name: "description", content: "Track and fulfill customer orders." },
    ],
  }),
  component: OrdersPage,
});

const columns: Column<Order>[] = [
  { header: "Order", cell: (o) => <span className="font-medium font-mono text-sm">{o.number}</span> },
  {
    header: "Customer",
    cell: (o) => (
      <div>
        <div className="text-sm">{o.customer_name}</div>
        <div className="text-xs text-muted-foreground">{o.customer_email}</div>
      </div>
    ),
  },
  { header: "Status", cell: (o) => <StatusBadge status={o.status} /> },
  { header: "Total", align: "right", cell: (o) => <span className="text-sm tabular-nums font-medium">${o.total.toFixed(2)}</span> },
  { header: "Created", cell: (o) => <span className="text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</span> },
];

const filters = [
  { key: "all", label: "All", value: "all" },
  { key: "pending", label: "Pending", value: "pending" },
  { key: "processing", label: "Processing", value: "processing" },
  { key: "completed", label: "Completed", value: "completed" },
  { key: "on-hold", label: "On hold", value: "on-hold" },
  { key: "cancelled", label: "Cancelled", value: "cancelled" },
  { key: "refunded", label: "Refunded", value: "refunded" },
];

function OrdersPage() {
  return (
    <div>
      <PageHeader title="Orders" description="All customer orders and their fulfillment status." />
      <ResourceTable<Order>
        queryKey="orders"
        fetcher={(p) => api.orders.list(p)}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search order # or customer…"
      />
    </div>
  );
}
