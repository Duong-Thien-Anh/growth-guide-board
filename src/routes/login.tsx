import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { api, auth, USE_MOCK } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

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
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@atelier.co");
  const [password, setPassword] = useState("password");
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
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl mb-3" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to Atelier CMS</p>
        </div>

        <Card className="p-6">
          <form onSubmit={onSubmit} className="grid gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoFocus required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
            {USE_MOCK && (
              <p className="text-xs text-muted-foreground text-center">
                Mock mode — any credentials will sign you in.
              </p>
            )}
          </form>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-4">
          <Link to="/" className="hover:text-foreground">← Back to dashboard</Link>
        </p>
      </div>
    </div>
  );
}
