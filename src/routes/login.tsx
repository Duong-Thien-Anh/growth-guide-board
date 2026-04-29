import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api, auth } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/admin/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Atelier CMS" },
      { name: "description", content: "Sign in to your marketing workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth.getToken()) navigate({ to: "/" });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.login(email, password);
      toast.success("Signed in");
      navigate({ to: "/" });
    } catch (err: any) {
      toast.error(err?.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background px-4">
      <div className="flex justify-end pt-4">
        <LanguageSwitcher variant="outline" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm -mt-10">
          <div className="flex flex-col items-center mb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-3" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">{t("auth.welcome")}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t("auth.subtitle")}</p>
          </div>

          <Card className="p-6">
            <form onSubmit={onSubmit} className="grid gap-4">
              <div>
                <Label htmlFor="email">{t("auth.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  autoFocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5"
                  autoComplete="username"
                />
              </div>
              <div>
                <Label htmlFor="password">{t("auth.password")}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1.5"
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t("auth.signingIn") : t("auth.signIn")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
