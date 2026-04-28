import { api } from "@/lib/api/client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal } from "lucide-react";
import { ResourceTable, PUBLISH_FILTERS, type Column } from "@/components/admin/ResourceTable";
import type { Post } from "@/lib/api/types";

const columns: Column<Post>[] = [
  {
    header: "Title",
    cell: (p) => (
      <div>
        <div className="font-medium">{p.title}</div>
        <div className="text-xs text-muted-foreground mt-0.5">/{p.slug}</div>
      </div>
    ),
  },
  { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
  { header: "Category", cell: (p) => <span className="text-sm text-muted-foreground">{p.category}</span> },
  { header: "Author", cell: (p) => <span className="text-sm">{p.author.name}</span> },
  {
    header: "Views", align: "right",
    cell: (p) => (
      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground tabular-nums">
        <Eye className="h-3 w-3" /> {p.views.toLocaleString()}
      </span>
    ),
  },
  { header: "Updated", cell: (p) => <span className="text-sm text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</span> },
  {
    header: "", className: "w-12",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];

export function PostsScreen() {
  return (
    <div>
      <PageHeader title="Posts" description="Articles, news, and editorial pieces." actionLabel="New post" />
      <ResourceTable<Post>
        queryKey="posts"
        fetcher={(p) => api.posts.list(p)}
        columns={columns}
        filters={PUBLISH_FILTERS}
        searchPlaceholder="Search posts…"
        emptyText="No posts match your filters."
      />
    </div>
  );
}
