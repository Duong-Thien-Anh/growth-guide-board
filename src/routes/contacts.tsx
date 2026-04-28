import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResourceTable, type Column } from "@/components/admin/ResourceTable";
import type { Contact } from "@/lib/api/types";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — Atelier CMS" },
      { name: "description", content: "Inbound contact form submissions." },
    ],
  }),
  component: ContactsPage,
});

const columns: Column<Contact>[] = [
  { header: "Name", cell: (c) => <span className="font-medium">{c.name}</span> },
  { header: "Email", cell: (c) => <span className="text-sm text-muted-foreground">{c.email}</span> },
  { header: "Phone", cell: (c) => <span className="text-sm text-muted-foreground">{c.phone}</span> },
  { header: "Subject", cell: (c) => <span className="text-sm">{c.subject}</span> },
  { header: "Submitted", cell: (c) => <span className="text-sm text-muted-foreground">{new Date(c.submitted_at).toLocaleDateString()}</span> },
];

function ContactsPage() {
  return (
    <div>
      <PageHeader title="Contacts" description="Everyone who reached out through your forms." actionLabel="Add contact" />
      <ResourceTable<Contact>
        queryKey="contacts"
        fetcher={(p) => api.contacts.list(p)}
        columns={columns}
        searchPlaceholder="Search contacts…"
      />
    </div>
  );
}
