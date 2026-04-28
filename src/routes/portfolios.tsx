import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";

export const Route = createFileRoute("/portfolios")({
  head: () => ({
    meta: [
      { title: "Portfolios — Atelier CMS" },
      { name: "description", content: "Showcase your client work and case studies." },
    ],
  }),
  component: PortfoliosPage,
});

function PortfoliosPage() {
  const { data, isLoading } = useQuery({ queryKey: ["portfolios"], queryFn: () => api.portfolios.list({ per_page: 50 }) });
  return (
    <div>
      <PageHeader title="Portfolios" description="Client work and case studies featured on your site." actionLabel="New case study" />
      {isLoading && <p className="text-muted-foreground text-sm">Loading…</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data.map((p) => (
          <Card key={p.id} className="overflow-hidden p-0 group cursor-pointer hover:shadow-[var(--shadow-pop)] transition-shadow">
            <div className="aspect-[4/3] overflow-hidden bg-muted">
              <img src={p.cover_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.client} · {p.category} · {p.year}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
