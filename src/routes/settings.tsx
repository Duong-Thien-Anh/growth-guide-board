import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { api, USE_MOCK } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n";
import { Activity, CheckCircle2, XCircle, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Atelier CMS" },
      { name: "description", content: "Workspace, profile, and integration settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useI18n();
  const { data: health, isFetching, refetch } = useQuery({
    queryKey: ["health"],
    queryFn: () => api.health(),
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      <PageHeader title={t("settings.title")} description={t("settings.subtitle")} />
      <div className="grid gap-4 max-w-2xl">
        {/* Health check */}
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" /> {t("settings.health")}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">{t("settings.healthHint")}</p>
            </div>
            <Button variant="outline" size="sm" disabled={isFetching} onClick={() => refetch()} className="gap-2">
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
              {t("settings.checkNow")}
            </Button>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            {isFetching && !health ? (
              <div className="text-sm text-muted-foreground">{t("settings.healthChecking")}</div>
            ) : health ? (
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {health.ok ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15 border-0 gap-1">
                      <CheckCircle2 className="h-3 w-3" /> {t("settings.healthOk")}
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="gap-1">
                      <XCircle className="h-3 w-3" /> {t("settings.healthDown")}
                    </Badge>
                  )}
                </div>
                <div className="text-muted-foreground">DB: <span className="font-medium text-foreground">{health.database}</span></div>
                {health.app && <div className="text-muted-foreground">{health.app}</div>}
                {health.version && <div className="text-muted-foreground">v{health.version}</div>}
                {typeof health.latency_ms === "number" && (
                  <div className="text-muted-foreground">{health.latency_ms} ms</div>
                )}
                <div className="text-xs text-muted-foreground ml-auto">
                  {new Date(health.checked_at).toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="text-sm text-destructive flex items-center gap-2">
                <XCircle className="h-4 w-4" /> {t("settings.healthDown")}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Endpoint: <code className="text-foreground">/api/v1/health</code>
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-base font-semibold mb-1">API connection</h2>
          <p className="text-sm text-muted-foreground mb-4">Point the dashboard at your Laravel backend.</p>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="api">API base URL</Label>
              <Input id="api" placeholder="https://api.example.com/api/v1" className="mt-1.5 font-mono text-sm" />
            </div>
            <div className="rounded-md bg-muted/40 border border-dashed p-3 text-xs text-muted-foreground">
              Currently running on{" "}
              <span className="font-medium text-foreground">
                {USE_MOCK ? "mock data" : "Laravel API"}
              </span>
              . Configure <code>VITE_USE_MOCK</code>, <code>VITE_API_BASE_URL</code>, and <code>VITE_BACKEND_ORIGIN</code> in your env file.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
