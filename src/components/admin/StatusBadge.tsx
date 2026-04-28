import { cn } from "@/lib/utils";

// Generic status badge — handles publish, order, lead, coupon, stock statuses.
// Maps known status strings to color tones from the design tokens.

type Tone = "success" | "warning" | "muted" | "info" | "destructive" | "primary";

const toneClass: Record<Tone, string> = {
  success: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  warning: "bg-[color:var(--warning)]/20 text-[color:oklch(0.45_0.12_75)]",
  muted: "bg-muted text-muted-foreground",
  info: "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]",
  destructive: "bg-destructive/10 text-destructive",
  primary: "bg-[color:var(--primary-soft)] text-primary",
};

const STATUS_TONE: Record<string, Tone> = {
  // publish
  published: "success",
  draft: "muted",
  pending: "warning",
  private: "info",
  scheduled: "warning",
  archived: "destructive",
  trash: "destructive",
  // order
  processing: "primary",
  completed: "success",
  cancelled: "destructive",
  refunded: "muted",
  failed: "destructive",
  "on-hold": "warning",
  // lead
  new: "primary",
  qualified: "info",
  proposal: "warning",
  won: "success",
  lost: "destructive",
  spam: "destructive",
  // coupon
  active: "success",
  inactive: "muted",
  expired: "destructive",
  // stock
  instock: "success",
  outofstock: "destructive",
  onbackorder: "warning",
};

const LABEL: Record<string, string> = {
  "on-hold": "On hold",
  instock: "In stock",
  outofstock: "Out of stock",
  onbackorder: "Backorder",
  fixed_cart: "Fixed (cart)",
  fixed_product: "Fixed (product)",
  percent: "Percent",
};

function formatLabel(s: string) {
  if (LABEL[s]) return LABEL[s];
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function StatusBadge({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? "muted";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", toneClass[tone])}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {formatLabel(status)}
    </span>
  );
}
