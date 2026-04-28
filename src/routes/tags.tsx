import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { Tag } from "@/lib/api/types";

export const Route = createFileRoute("/tags")({
  head: () => ({
    meta: [
      { title: "Tags — Atelier CMS" },
      { name: "description", content: "Tag content for discovery." },
    ],
  }),
  component: TagsPage,
});

const columns: Column<Tag>[] = [
  { header: "Name", cell: (t) => <span className="font-medium">{t.name}</span> },
  { header: "Slug", cell: (t) => <span className="text-sm text-muted-foreground font-mono">{t.slug}</span> },
  { header: "Posts", align: "right", cell: (t) => <span className="text-sm tabular-nums text-muted-foreground">{t.posts_count}</span> },
  { header: "Updated", cell: (t) => <span className="text-sm text-muted-foreground">{new Date(t.updated_at).toLocaleDateString()}</span> },
];

function TagsPage() {
  return (
    <div>
      <PageHeader title="Tags" description="Lightweight content labels." actionLabel="New tag" />
      <ResourceTable<Tag>
        queryKey="tags"
        fetcher={(p) => api.tags.list(p)}
        columns={columns}
        searchPlaceholder="Search tags…"
      />
    </div>
  );
}
