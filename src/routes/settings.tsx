import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";

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
  return (
    <div>
      <PageHeader title="Settings" description="Manage your workspace and connection to the API." />
      <div className="grid gap-4 max-w-2xl">
        <Card className="p-6">
          <h2 className="text-base font-semibold mb-4">Profile</h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Display name</Label>
              <Input id="name" defaultValue="Linh Nguyen" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="linh@atelier.co" className="mt-1.5" />
            </div>
            <Button className="w-fit">Save changes</Button>
          </div>
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
              Currently running on <span className="font-medium text-foreground">mock data</span>. Toggle <code>USE_MOCK</code> in <code>src/lib/api/client.ts</code> to connect to your real API.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
