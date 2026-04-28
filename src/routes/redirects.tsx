import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { Redirect } from "@/lib/api/types";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/redirects")({
  head: () => ({
    meta: [
      { title: "Redirects — Atelier CMS" },
      { name: "description", content: "Manage URL redirects across your site." },
    ],
  }),
  component: RedirectsPage,
});

const columns: Column<Redirect>[] = [
  {
    header: "Rule",
    cell: (r) => (
      <div className="flex items-center gap-2 text-sm font-mono">
        <span>{r.old_path}</span>
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <span className="text-muted-foreground">{r.new_url}</span>
      </div>
    ),
  },
  { header: "Code", cell: (r) => <span className="text-sm tabular-nums">{r.http_code}</span> },
  {
    header: "Active",
    cell: (r) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${r.is_active ? "bg-[color:var(--success)]/15 text-[color:var(--success)]" : "bg-muted text-muted-foreground"}`}>
        {r.is_active ? "On" : "Off"}
      </span>
    ),
  },
  { header: "Hits", align: "right", cell: (r) => <span className="text-sm tabular-nums text-muted-foreground">{r.hits.toLocaleString()}</span> },
  { header: "Updated", cell: (r) => <span className="text-sm text-muted-foreground">{new Date(r.updated_at).toLocaleDateString()}</span> },
];

function RedirectsPage() {
  return (
    <div>
      <PageHeader title="Redirects" description="Forward old URLs to the right destination." actionLabel="New redirect" />
      <ResourceTable<Redirect>
        queryKey="redirects"
        fetcher={(p) => api.redirects.list(p)}
        columns={columns}
        searchPlaceholder="Search by path or URL…"
      />
    </div>
  );
}
