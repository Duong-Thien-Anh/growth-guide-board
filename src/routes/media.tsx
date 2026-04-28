import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/admin/PageHeader";
import { FileVideo, FileText, ImageIcon, UploadCloud } from "lucide-react";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media library — Atelier CMS" },
      { name: "description", content: "All images, videos, and documents in one place." },
    ],
  }),
  component: MediaPage,
});

const iconFor = { image: ImageIcon, video: FileVideo, document: FileText };

function MediaPage() {
  const { data, isLoading } = useQuery({ queryKey: ["media"], queryFn: () => api.media.list({ per_page: 50 }) });
  return (
    <div>
      <PageHeader title="Media library" description="All assets used across posts, pages, and portfolios." actionLabel="Upload files" />

      <Card className="p-6 mb-4 border-dashed bg-muted/30 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-primary mb-3">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div className="font-medium">Drop files here, or click upload</div>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4, PDF · up to 25 MB each</p>
      </Card>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {data?.data.map((m) => {
          const Icon = iconFor[m.type];
          return (
            <Card key={m.id} className="p-0 overflow-hidden group cursor-pointer">
              <div className="aspect-square bg-muted relative">
                {m.type === "image" ? (
                  <img src={m.url} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                    <Icon className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {m.type}
                </div>
              </div>
              <div className="p-2.5">
                <div className="text-xs font-medium truncate">{m.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{(m.size_kb / 1024).toFixed(1)} MB</div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
