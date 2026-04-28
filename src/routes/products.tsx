import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceTable, PUBLISH_FILTERS, type Column } from "@/components/admin/ResourceTable";
import type { Product } from "@/lib/api/types";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Atelier CMS" },
      { name: "description", content: "Manage your product catalog, pricing, and stock." },
    ],
  }),
  component: ProductsPage,
});

const columns: Column<Product>[] = [
  {
    header: "Product",
    cell: (p) => (
      <div>
        <div className="font-medium">{p.name}</div>
        <div className="text-xs text-muted-foreground mt-0.5 font-mono">{p.sku}</div>
      </div>
    ),
  },
  { header: "Type", cell: (p) => <span className="text-sm capitalize text-muted-foreground">{p.type}</span> },
  { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
  { header: "Stock", cell: (p) => <StatusBadge status={p.stock_status} /> },
  { header: "Price", align: "right", cell: (p) => <span className="text-sm tabular-nums">${p.price.toFixed(2)}</span> },
  { header: "Qty", align: "right", cell: (p) => <span className="text-sm tabular-nums text-muted-foreground">{p.stock_quantity}</span> },
  { header: "Updated", cell: (p) => <span className="text-sm text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</span> },
];

function ProductsPage() {
  return (
    <div>
      <PageHeader title="Products" description="Catalog, pricing, and stock for your store." actionLabel="New product" />
      <ResourceTable<Product>
        queryKey="products"
        fetcher={(p) => api.products.list(p)}
        columns={columns}
        filters={PUBLISH_FILTERS}
        searchPlaceholder="Search by name, slug, SKU…"
      />
    </div>
  );
}
