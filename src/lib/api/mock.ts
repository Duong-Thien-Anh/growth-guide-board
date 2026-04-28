import type { Post, Page, Portfolio, MediaItem, ListParams, Paginated, Status } from "./types";

const authors = [
  { id: "u1", name: "Linh Nguyen" },
  { id: "u2", name: "Marcus Lee" },
  { id: "u3", name: "Priya Shah" },
  { id: "u4", name: "Tom Becker" },
];

const categories = ["Brand", "Strategy", "Product", "Insights", "Press"];
const statuses: Status[] = ["published", "draft", "scheduled", "archived"];

const titles = [
  "How modern brands win attention in 2026",
  "The quiet rebrand of legacy retailers",
  "Five lessons from our Q1 campaign",
  "Designing for trust in fintech",
  "What our 2025 audience taught us",
  "The no-meeting marketing sprint",
  "Crafting story-led product launches",
  "A field guide to landing pages",
  "Why portfolios still convert",
  "The ROI of editorial content",
  "Inside our new visual identity",
  "Email is back — and better",
  "Building a content engine, not a calendar",
  "How we test creative at scale",
  "When less polish wins",
];

function pad(n: number) { return n.toString().padStart(2, "0"); }
function dateOffset(days: number) {
  const d = new Date(); d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T10:00:00Z`;
}

const POSTS: Post[] = titles.map((t, i) => ({
  id: `p${i+1}`,
  title: t,
  slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  excerpt: "A short, friendly summary that helps editors recognize the piece at a glance.",
  status: statuses[i % statuses.length],
  category: categories[i % categories.length],
  tags: ["marketing", i % 2 ? "growth" : "brand"],
  author: authors[i % authors.length],
  views: 320 + i * 187,
  published_at: i % 4 === 1 ? null : dateOffset(i * 2),
  updated_at: dateOffset(i),
}));

const PAGES: Page[] = [
  { id: "pg1", title: "Home", slug: "/", status: "published", template: "landing", updated_at: dateOffset(2), author: authors[0] },
  { id: "pg2", title: "About us", slug: "/about", status: "published", template: "default", updated_at: dateOffset(7), author: authors[1] },
  { id: "pg3", title: "Services", slug: "/services", status: "published", template: "default", updated_at: dateOffset(11), author: authors[0] },
  { id: "pg4", title: "Pricing", slug: "/pricing", status: "draft", template: "landing", updated_at: dateOffset(1), author: authors[2] },
  { id: "pg5", title: "Contact", slug: "/contact", status: "published", template: "default", updated_at: dateOffset(20), author: authors[3] },
  { id: "pg6", title: "Privacy policy", slug: "/privacy", status: "published", template: "legal", updated_at: dateOffset(60), author: authors[1] },
  { id: "pg7", title: "Terms", slug: "/terms", status: "published", template: "legal", updated_at: dateOffset(60), author: authors[1] },
  { id: "pg8", title: "Spring campaign", slug: "/spring", status: "scheduled", template: "landing", updated_at: dateOffset(3), author: authors[2] },
];

const portfolioCovers = [
  "https://images.unsplash.com/photo-1561070791-2526d30994b8?w=600",
  "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600",
  "https://images.unsplash.com/photo-1517292987719-0369a794ec0f?w=600",
  "https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?w=600",
];

const PORTFOLIOS: Portfolio[] = [
  "Northwind Rebrand", "Aura Skincare Launch", "Lumen Fintech Site",
  "Verde Restaurant Group", "Helio Energy Report", "Kite Mobility App",
].map((title, i) => ({
  id: `pf${i+1}`,
  title,
  client: title.split(" ")[0],
  category: ["Branding", "Web", "Campaign", "Brand", "Editorial", "Product"][i],
  cover_url: portfolioCovers[i],
  status: i === 5 ? "draft" : "published",
  year: 2025 - (i % 3),
  updated_at: dateOffset(i * 4),
}));

const MEDIA: MediaItem[] = Array.from({ length: 14 }).map((_, i) => ({
  id: `m${i+1}`,
  name: `asset-${pad(i+1)}.${i % 3 === 0 ? "mp4" : i % 3 === 1 ? "pdf" : "jpg"}`,
  type: i % 3 === 0 ? "video" : i % 3 === 1 ? "document" : "image",
  size_kb: 240 + i * 110,
  url: portfolioCovers[i % portfolioCovers.length],
  uploaded_at: dateOffset(i),
}));

function paginate<T>(rows: T[], p?: ListParams): Paginated<T> {
  const per_page = p?.per_page ?? 10;
  const current_page = p?.page ?? 1;
  const start = (current_page - 1) * per_page;
  return {
    data: rows.slice(start, start + per_page),
    meta: { total: rows.length, per_page, current_page, last_page: Math.max(1, Math.ceil(rows.length / per_page)) },
  };
}

function filterByStatusAndSearch<T extends { status?: Status; title?: string; name?: string }>(rows: T[], p?: ListParams) {
  let r = rows;
  if (p?.status && p.status !== "all") r = r.filter((x) => x.status === p.status);
  if (p?.search) {
    const q = p.search.toLowerCase();
    r = r.filter((x) => (x.title ?? x.name ?? "").toLowerCase().includes(q));
  }
  return r;
}

const delay = <T,>(v: T) => new Promise<T>((res) => setTimeout(() => res(v), 250));

export const mockApi = {
  posts: { list: (p?: ListParams) => delay(paginate(filterByStatusAndSearch(POSTS, p), p)) },
  pages: { list: (p?: ListParams) => delay(paginate(filterByStatusAndSearch(PAGES, p), p)) },
  portfolios: { list: (p?: ListParams) => delay(paginate(filterByStatusAndSearch(PORTFOLIOS, p), p)) },
  media: { list: (p?: ListParams) => delay(paginate(filterByStatusAndSearch(MEDIA, p), p)) },
  stats: () => delay({
    posts_published: POSTS.filter((p) => p.status === "published").length,
    posts_draft: POSTS.filter((p) => p.status === "draft").length,
    pages_total: PAGES.length,
    portfolios_total: PORTFOLIOS.length,
    monthly_views: 48230,
    growth_pct: 12.4,
    top_posts: POSTS.slice(0, 5).map((p) => ({ id: p.id, title: p.title, views: p.views, status: p.status })),
    activity: Array.from({ length: 7 }).map((_, i) => ({
      day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
      views: 1200 + Math.round(Math.sin(i) * 400 + i * 180),
    })),
  }),
};
