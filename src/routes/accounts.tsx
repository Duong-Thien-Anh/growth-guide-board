import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useI18n } from "@/lib/i18n";
import { Search } from "lucide-react";

export const Route = createFileRoute("/accounts")({
  head: () => ({ meta: [{ title: "Admin accounts — Atelier CMS" }] }),
  component: AccountsPage,
});

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function AccountsPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["accounts", q],
    queryFn: () => api.accounts.list({ q, per_page: 50 }),
  });

  const fmtDate = (s?: string) =>
    s ? new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

  return (
    <div>
      <PageHeader title={t("accounts.title")} description={t("accounts.subtitle")} actionLabel={t("accounts.invite")} />

      <Card className="p-4 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, role…" className="pl-8" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("profile.name")}</TableHead>
              <TableHead>{t("profile.email")}</TableHead>
              <TableHead>{t("profile.login")}</TableHead>
              <TableHead>{t("profile.role")}</TableHead>
              <TableHead>{t("profile.registered")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">Loading…</TableCell></TableRow>
            )}
            {data?.data.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[10px] bg-[color:var(--primary-soft)] text-primary">{initials(u.name)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{u.email}</TableCell>
                <TableCell className="text-muted-foreground">{u.login ?? "—"}</TableCell>
                <TableCell><Badge variant="secondary" className="font-normal">{u.role}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{fmtDate(u.registered)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
