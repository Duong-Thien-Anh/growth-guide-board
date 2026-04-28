import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";
import type { AdminUser } from "@/lib/api/types";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Atelier CMS" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { t } = useI18n();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { data: me, isLoading } = useQuery({ queryKey: ["me"], queryFn: () => api.me() });
  const [form, setForm] = useState<Partial<AdminUser>>({});

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("atelier_admin_token")) {
      navigate({ to: "/login" });
    }
  }, [navigate]);

  useEffect(() => { if (me) setForm(me); }, [me]);

  const update = useMutation({
    mutationFn: (body: Partial<AdminUser>) => api.updateMe(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["me"] });
      toast.success(t("profile.saved"));
    },
  });

  const set = (k: keyof AdminUser) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const fmtDate = (s?: string | null) =>
    s ? new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : t("common.never");

  if (isLoading || !me) return <div className="text-sm text-muted-foreground">Loading…</div>;

  return (
    <div>
      <PageHeader title={t("profile.title")} description={t("profile.subtitle")} />

      <Card className="p-5 mb-4 max-w-3xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Field label={t("profile.name")} value={me.name} />
          <Field label={t("profile.email")} value={me.email} />
          <Field label={t("profile.login")} value={me.login ?? "—"} />
          <Field label={t("profile.role")}>
            <Badge variant="secondary" className="font-normal">{me.role}</Badge>
          </Field>
          <Field label={t("profile.registered")} value={fmtDate(me.registered)} />
        </div>
      </Card>

      <Tabs defaultValue="account" className="max-w-3xl">
        <TabsList>
          <TabsTrigger value="account">{t("profile.account")}</TabsTrigger>
          <TabsTrigger value="billing">{t("profile.billing")}</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="p-6 grid gap-4">
            <Row label={t("profile.name")}>
              <Input value={form.name ?? ""} onChange={set("name")} />
            </Row>
            <Row label={t("profile.email")}>
              <Input type="email" value={form.email ?? ""} onChange={set("email")} />
            </Row>
            <Button className="w-fit" disabled={update.isPending} onClick={() => update.mutate({ name: form.name, email: form.email })}>
              {t("profile.save")}
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="p-6 grid gap-4 sm:grid-cols-2">
            <Row label={t("profile.firstName")}>
              <Input value={form.billing_first_name ?? ""} onChange={set("billing_first_name")} />
            </Row>
            <Row label={t("profile.lastName")}>
              <Input value={form.billing_last_name ?? ""} onChange={set("billing_last_name")} />
            </Row>
            <Row label={t("profile.phone")}>
              <Input value={form.billing_phone ?? ""} onChange={set("billing_phone")} />
            </Row>
            <Row label={t("profile.country")}>
              <Input value={form.billing_country ?? ""} onChange={set("billing_country")} />
            </Row>
            <div className="sm:col-span-2">
              <Row label={t("profile.address")}>
                <Input value={form.billing_address ?? ""} onChange={set("billing_address")} />
              </Row>
            </div>
            <Row label={t("profile.city")}>
              <Input value={form.billing_city ?? ""} onChange={set("billing_city")} />
            </Row>
            <div className="sm:col-span-2">
              <Button className="w-fit" disabled={update.isPending} onClick={() => update.mutate(form)}>
                {t("profile.save")}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground mt-4">
        <Link to="/settings" className="hover:text-foreground">→ {t("nav.settings")}</Link>
      </p>
    </div>
  );
}

function Field({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium">{children ?? value}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
