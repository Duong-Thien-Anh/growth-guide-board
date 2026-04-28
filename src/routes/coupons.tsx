import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { Coupon } from "@/lib/api/types";

export const Route = createFileRoute("/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons — Atelier CMS" },
      { name: "description", content: "Discounts and promotional codes." },
    ],
  }),
  component: CouponsPage,
});

function formatAmount(c: Coupon) {
  if (c.discount_type === "percent") return `${c.amount}%`;
  return `$${c.amount.toFixed(2)}`;
}

const columns: Column<Coupon>[] = [
  { header: "Code", cell: (c) => <span className="font-mono font-medium text-sm">{c.code}</span> },
  { header: "Type", cell: (c) => <StatusBadge status={c.discount_type} /> },
  { header: "Amount", align: "right", cell: (c) => <span className="text-sm tabular-nums font-medium">{formatAmount(c)}</span> },
  { header: "Status", cell: (c) => <StatusBadge status={c.status} /> },
  {
    header: "Usage", align: "right",
    cell: (c) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {c.usage_count.toLocaleString()}{c.usage_limit ? ` / ${c.usage_limit.toLocaleString()}` : ""}
      </span>
    ),
  },
  { header: "Expires", cell: (c) => <span className="text-sm text-muted-foreground">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : "—"}</span> },
];

const filters = [
  { key: "all", label: "All", value: "all" },
  { key: "active", label: "Active", value: "active" },
  { key: "inactive", label: "Inactive", value: "inactive" },
  { key: "expired", label: "Expired", value: "expired" },
  { key: "draft", label: "Draft", value: "draft" },
];

function CouponsPage() {
  return (
    <div>
      <PageHeader title="Coupons" description="Promotional discount codes for your store." actionLabel="New coupon" />
      <ResourceTable<Coupon>
        queryKey="coupons"
        fetcher={(p) => api.coupons.list(p)}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search by code…"
      />
    </div>
  );
}
