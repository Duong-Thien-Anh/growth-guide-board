import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { Lead } from "@/lib/api/types";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Atelier CMS" },
      { name: "description", content: "Sales pipeline and lead status." },
    ],
  }),
  component: LeadsPage,
});

const columns: Column<Lead>[] = [
  { header: "Contact", cell: (l) => <span className="font-medium">{l.contact_name}</span> },
  { header: "Status", cell: (l) => <StatusBadge status={l.status} /> },
  {
    header: "Score", align: "right",
    cell: (l) => (
      <div className="inline-flex items-center gap-2">
        <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${l.score}%`, background: "var(--gradient-brand)" }} />
        </div>
        <span className="text-sm tabular-nums w-8 text-right">{l.score}</span>
      </div>
    ),
  },
  { header: "Source", cell: (l) => <span className="text-sm text-muted-foreground">{l.source} · {l.channel}</span> },
  { header: "Assignee", cell: (l) => <span className="text-sm">{l.assignee_name}</span> },
  { header: "Captured", cell: (l) => <span className="text-sm text-muted-foreground">{new Date(l.captured_at).toLocaleDateString()}</span> },
];

const filters = [
  { key: "all", label: "All", value: "all" },
  { key: "new", label: "New", value: "new" },
  { key: "qualified", label: "Qualified", value: "qualified" },
  { key: "proposal", label: "Proposal", value: "proposal" },
  { key: "won", label: "Won", value: "won" },
  { key: "lost", label: "Lost", value: "lost" },
];

function LeadsPage() {
  return (
    <div>
      <PageHeader title="Leads" description="Track prospects through your pipeline." actionLabel="New lead" />
      <ResourceTable<Lead>
        queryKey="leads"
        fetcher={(p) => api.leads.list(p)}
        columns={columns}
        filters={filters}
        searchPlaceholder="Search leads…"
      />
    </div>
  );
}
