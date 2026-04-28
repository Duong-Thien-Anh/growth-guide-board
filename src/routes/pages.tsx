import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/pages")({
  head: () => ({
    meta: [
      { title: "Pages — Atelier CMS" },
      { name: "description", content: "Manage all marketing site pages." },
    ],
  }),
  component: PagesPage,
});

function PagesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["pages"], queryFn: () => api.pages.list({ per_page: 50 }) });
  return (
    <div>
      <PageHeader title="Pages" description="Every page that lives on your marketing site." actionLabel="New page" />
      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Path</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated by</TableHead>
              <TableHead>Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading…</TableCell></TableRow>}
            {data?.data.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground font-mono">
                    {p.slug} <ExternalLink className="h-3 w-3" />
                  </span>
                </TableCell>
                <TableCell className="text-sm capitalize text-muted-foreground">{p.template}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell className="text-sm">{p.author.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
