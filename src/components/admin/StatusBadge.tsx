import type { Status } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const styles: Record<Status, string> = {
  published: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-[color:var(--warning)]/20 text-[color:oklch(0.45_0.12_75)]",
  archived: "bg-destructive/10 text-destructive",
};

const labels: Record<Status, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
  archived: "Archived",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", styles[status])}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}
