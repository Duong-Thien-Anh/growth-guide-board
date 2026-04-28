import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { Category } from "@/lib/api/types";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Atelier CMS" },
      { name: "description", content: "Organize content with categories." },
    ],
  }),
  component: CategoriesPage,
});

const columns: Column<Category>[] = [
  { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
  { header: "Slug", cell: (c) => <span className="text-sm text-muted-foreground font-mono">{c.slug}</span> },
  { header: "Posts", align: "right", cell: (c) => <span className="text-sm tabular-nums text-muted-foreground">{c.posts_count}</span> },
  { header: "Updated", cell: (c) => <span className="text-sm text-muted-foreground">{new Date(c.updated_at).toLocaleDateString()}</span> },
];

function CategoriesPage() {
  return (
    <div>
      <PageHeader title="Categories" description="Group posts and products by topic." actionLabel="New category" />
      <ResourceTable<Category>
        queryKey="categories"
        fetcher={(p) => api.categories.list(p)}
        columns={columns}
        searchPlaceholder="Search categories…"
      />
    </div>
  );
}
