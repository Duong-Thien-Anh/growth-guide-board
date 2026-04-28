import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import type { Status } from "@/lib/api/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Search, MoreHorizontal, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs: { key: Status | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Drafts" },
  { key: "scheduled", label: "Scheduled" },
  { key: "archived", label: "Archived" },
];

export function PostsScreen() {
  const [status, setStatus] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["posts", status, search],
    queryFn: () => api.posts.list({ status, search, per_page: 20 }),
  });

  return (
    <div>
      <PageHeader title="Posts" description="Articles, news, and editorial pieces." actionLabel="New post" />

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setStatus(t.key)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors",
                  status === t.key ? "bg-[color:var(--primary-soft)] text-primary font-medium" : "text-muted-foreground hover:bg-muted"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search posts…" className="pl-8 h-9 w-full sm:w-64" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Author</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading posts…</TableCell></TableRow>
              )}
              {data?.data.map((p) => (
                <TableRow key={p.id} className="group">
                  <TableCell>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">/{p.slug}</div>
                  </TableCell>
                  <TableCell><StatusBadge status={p.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                  <TableCell className="text-sm">{p.author.name}</TableCell>
                  <TableCell className="text-right text-sm tabular-nums">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3 w-3" /> {p.views.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {data && data.data.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No posts match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {data && (
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div>Showing {data.data.length} of {data.meta.total}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
