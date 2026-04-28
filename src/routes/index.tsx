import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ArrowUpRight, Eye, FileText, Files, Briefcase, TrendingUp, Download, FileSpreadsheet, FileType2, ShoppingBag, Receipt, UserSquare2, DollarSign } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { exportOverviewCsv, exportOverviewPdf } from "@/lib/exports/overview";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Atelier CMS" },
      { name: "description", content: "At-a-glance health of your content: published posts, drafts, pages, and weekly views." },
    ],
  }),
  component: Overview,
});

function Stat({ icon: Icon, label, value, hint, accent }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; hint?: string; accent?: boolean }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-muted-foreground">{label}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent ? "text-primary-foreground" : "text-primary bg-[color:var(--primary-soft)]"}`} style={accent ? { background: "var(--gradient-brand)" } : undefined}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function Overview() {
  const { data, isLoading } = useQuery({ queryKey: ["stats"], queryFn: () => api.stats() });

  const max = Math.max(...(data?.activity.map((a) => a.views) ?? [1]));

  return (
    <div>
      <PageHeader
        title="Good morning, Linh 👋"
        description="Here's what's happening across your content this week."
        actionLabel="New post"
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={!data} className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                onClick={() => {
                  if (!data) return;
                  exportOverviewCsv(data);
                  toast.success("CSV downloaded");
                }}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Download CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (!data) return;
                  exportOverviewPdf(data);
                  toast.success("PDF downloaded");
                }}
              >
                <FileType2 className="h-4 w-4 mr-2" /> Download PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={TrendingUp} label="Monthly views" value={data ? data.monthly_views.toLocaleString() : "—"} hint={data ? `▲ ${data.growth_pct}% vs last month` : ""} accent />
        <Stat icon={DollarSign} label="Monthly revenue" value={data ? `$${Math.round(data.monthly_revenue).toLocaleString()}` : "—"} hint={`${data?.orders_total ?? 0} orders this month`} />
        <Stat icon={FileText} label="Published posts" value={data?.posts_published ?? "—"} hint={`${data?.posts_draft ?? 0} drafts in progress`} />
        <Stat icon={UserSquare2} label="Open leads" value={data?.leads_total ?? "—"} hint={`${data?.contacts_total ?? 0} contacts captured`} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
        <Stat icon={Files} label="Live pages" value={data?.pages_total ?? "—"} />
        <Stat icon={Briefcase} label="Portfolio cases" value={data?.portfolios_total ?? "—"} />
        <Stat icon={ShoppingBag} label="Products" value={data?.products_total ?? "—"} />
        <Stat icon={Receipt} label="Total orders" value={data?.orders_total ?? "—"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Weekly views</h2>
              <p className="text-xs text-muted-foreground">Visitors across all published content</p>
            </div>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              View report <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex items-end gap-3 h-44 px-1">
            {data?.activity.map((a) => (
              <div key={a.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-md bg-[color:var(--primary-soft)] relative overflow-hidden" style={{ height: "100%" }}>
                  <div className="absolute bottom-0 left-0 right-0 rounded-md transition-all" style={{ height: `${(a.views / max) * 100}%`, background: "var(--gradient-brand)" }} />
                </div>
                <div className="text-xs text-muted-foreground">{a.day}</div>
              </div>
            ))}
            {isLoading && <div className="w-full text-center text-sm text-muted-foreground">Loading…</div>}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold mb-1">Top performing</h2>
          <p className="text-xs text-muted-foreground mb-4">Most viewed posts this month</p>
          <ul className="space-y-3">
            {data?.top_posts.map((p, i) => (
              <li key={p.id} className="flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-medium text-muted-foreground shrink-0">{i + 1}</div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{p.title}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" /> {p.views.toLocaleString()}
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
