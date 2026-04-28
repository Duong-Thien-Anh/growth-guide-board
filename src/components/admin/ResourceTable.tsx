import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Paginated, ListParams } from "@/lib/api/types";

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  align?: "left" | "right";
}

interface Props<T> {
  queryKey: string;
  fetcher: (params: ListParams) => Promise<Paginated<T>>;
  columns: Column<T>[];
  searchPlaceholder?: string;
  filters?: { key: string; label: string; value: string }[];
  emptyText?: string;
  rowKey?: (row: T) => string;
}

export function ResourceTable<T extends { id: string | number }>({
  queryKey, fetcher, columns, searchPlaceholder = "Search…", filters, emptyText = "No results.", rowKey,
}: Props<T>) {
  const [params, setParams] = useState<ListParams>({ per_page: 20, page: 1, status: filters?.[0]?.value ?? "all" });
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => fetcher(params),
  });

  const onSearch = (v: string) => {
    setSearchInput(v);
    setParams((p) => ({ ...p, q: v, page: 1 }));
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        {filters && filters.length > 0 ? (
          <div className="flex gap-1 overflow-x-auto">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setParams((p) => ({ ...p, status: f.value, page: 1 }))}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md whitespace-nowrap transition-colors",
                  params.status === f.value
                    ? "bg-[color:var(--primary-soft)] text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : <div />}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-8 h-9 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c, i) => (
                <TableHead key={i} className={cn(c.align === "right" && "text-right", c.className)}>
                  {c.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">Loading…</TableCell></TableRow>
            )}
            {data?.data.map((row) => (
              <TableRow key={rowKey ? rowKey(row) : String(row.id)}>
                {columns.map((c, i) => (
                  <TableCell key={i} className={cn(c.align === "right" && "text-right", c.className)}>
                    {c.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {data && data.data.length === 0 && (
              <TableRow><TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">{emptyText}</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.meta.total > 0 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <div>Showing {data.data.length} of {data.meta.total}</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={data.meta.current_page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) - 1 }))}>Previous</Button>
            <Button variant="outline" size="sm" disabled={data.meta.current_page >= data.meta.last_page}
              onClick={() => setParams((p) => ({ ...p, page: (p.page ?? 1) + 1 }))}>Next</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export const PUBLISH_FILTERS = [
  { key: "all", label: "All", value: "all" },
  { key: "published", label: "Published", value: "published" },
  { key: "draft", label: "Drafts", value: "draft" },
  { key: "pending", label: "Pending", value: "pending" },
  { key: "private", label: "Private", value: "private" },
  { key: "trash", label: "Trash", value: "trash" },
];
