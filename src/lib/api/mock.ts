import type {
  Post, Page, Portfolio, MediaItem, ListParams, Paginated,
  PublishStatus, Product, Order, Contact, Lead, Coupon, Category, Tag, Redirect, NavigationItem,
} from "./types";

const authors = [
  { id: 1, name: "Linh Nguyen" },
  { id: 2, name: "Marcus Lee" },
  { id: 3, name: "Priya Shah" },
  { id: 4, name: "Tom Becker" },
];

const categoriesList = ["Brand", "Strategy", "Product", "Insights", "Press"];
const statuses: PublishStatus[] = ["published", "draft", "pending", "private", "trash"];

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
  id: i + 1,
  title: t,
  slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  excerpt: "A short, friendly summary that helps editors recognize the piece at a glance.",
  status: statuses[i % statuses.length],
  category: categoriesList[i % categoriesList.length],
  tags: ["marketing", i % 2 ? "growth" : "brand"],
  author: authors[i % authors.length],
  views: 320 + i * 187,
  published_at: i % 4 === 1 ? null : dateOffset(i * 2),
  updated_at: dateOffset(i),
}));

const PAGES: Page[] = [
  { id: 1, title: "Home", slug: "/", status: "published", template: "landing", updated_at: dateOffset(2), author: authors[0] },
  { id: 2, title: "About us", slug: "/about", status: "published", template: "default", updated_at: dateOffset(7), author: authors[1] },
  { id: 3, title: "Services", slug: "/services", status: "published", template: "default", updated_at: dateOffset(11), author: authors[0] },
  { id: 4, title: "Pricing", slug: "/pricing", status: "draft", template: "landing", updated_at: dateOffset(1), author: authors[2] },
  { id: 5, title: "Contact", slug: "/contact", status: "published", template: "default", updated_at: dateOffset(20), author: authors[3] },
  { id: 6, title: "Privacy policy", slug: "/privacy", status: "published", template: "legal", updated_at: dateOffset(60), author: authors[1] },
  { id: 7, title: "Terms", slug: "/terms", status: "published", template: "legal", updated_at: dateOffset(60), author: authors[1] },
  { id: 8, title: "Spring campaign", slug: "/spring", status: "pending", template: "landing", updated_at: dateOffset(3), author: authors[2] },
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
  id: i + 1,
  title,
  client: title.split(" ")[0],
  category: ["Branding", "Web", "Campaign", "Brand", "Editorial", "Product"][i],
  cover_url: portfolioCovers[i],
  status: i === 5 ? "draft" : "published",
  year: 2025 - (i % 3),
  updated_at: dateOffset(i * 4),
}));

const MEDIA: MediaItem[] = Array.from({ length: 14 }).map((_, i) => ({
  id: i + 1,
  name: `asset-${pad(i+1)}.${i % 3 === 0 ? "mp4" : i % 3 === 1 ? "pdf" : "jpg"}`,
  type: i % 3 === 0 ? "video" : i % 3 === 1 ? "document" : "image",
  size_kb: 240 + i * 110,
  url: portfolioCovers[i % portfolioCovers.length],
  uploaded_at: dateOffset(i),
}));

const PRODUCT_NAMES = ["Aurora Lamp", "Nimbus Chair", "Halo Speaker", "Echo Backpack", "Pulse Watch", "Lumen Notebook", "Drift Mug", "Vista Camera"];
const PRODUCTS: Product[] = PRODUCT_NAMES.map((name, i) => ({
  id: i + 1, name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  type: (["simple", "variable", "simple", "external"] as const)[i % 4],
  status: (["published", "published", "draft", "pending"] as const)[i % 4],
  sku: `SKU-${1000 + i}`,
  price: 29 + i * 18.5,
  stock_status: (["instock", "instock", "outofstock", "onbackorder"] as const)[i % 4],
  stock_quantity: 120 - i * 9,
  updated_at: dateOffset(i),
}));

const ORDERS: Order[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  number: `#10${(20 + i).toString()}`,
  customer_name: ["Eva Martin", "Sam Patel", "Yui Tanaka", "Noah Kim", "Maya Stone"][i % 5],
  customer_email: `customer${i+1}@example.com`,
  status: (["pending","processing","completed","completed","on-hold","cancelled","refunded"] as const)[i % 7],
  total: 49 + i * 23.4,
  currency: "USD",
  created_at: dateOffset(i),
}));

const CONTACTS: Contact[] = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  name: ["Eva Martin","Sam Patel","Yui Tanaka","Noah Kim","Maya Stone","Liam Park","Olivia West","Ravi Kumar","Anya Sokolova"][i],
  email: `lead${i+1}@example.com`,
  phone: `+1 555-01${pad(i+10)}`,
  subject: ["Website redesign", "Quote request", "Partnership", "Pricing inquiry", "Demo"][i % 5],
  submitted_at: dateOffset(i),
}));

const LEADS: Lead[] = CONTACTS.slice(0, 8).map((c, i) => ({
  id: i + 1,
  contact_name: c.name,
  status: (["new","qualified","proposal","won","lost","new","qualified","spam"] as const)[i],
  score: 30 + i * 8,
  source: ["Web", "Referral", "Ads", "Event"][i % 4],
  channel: ["organic", "paid", "social", "email"][i % 4],
  assignee_name: authors[i % authors.length].name,
  captured_at: dateOffset(i),
}));

const COUPONS: Coupon[] = [
  { id: 1, code: "SPRING20", discount_type: "percent", amount: 20, status: "active", usage_count: 142, usage_limit: 500, expires_at: dateOffset(-30) },
  { id: 2, code: "WELCOME10", discount_type: "fixed_cart", amount: 10, status: "active", usage_count: 380, usage_limit: null, expires_at: null },
  { id: 3, code: "BFRIDAY25", discount_type: "percent", amount: 25, status: "expired", usage_count: 1024, usage_limit: 1000, expires_at: dateOffset(120) },
  { id: 4, code: "VIPONLY", discount_type: "fixed_product", amount: 50, status: "draft", usage_count: 0, usage_limit: 50, expires_at: null },
  { id: 5, code: "SUMMER15", discount_type: "percent", amount: 15, status: "inactive", usage_count: 67, usage_limit: 200, expires_at: dateOffset(-200) },
];

const CATEGORIES: Category[] = categoriesList.map((name, i) => ({
  id: i + 1, name, slug: name.toLowerCase(), parent_id: null,
  posts_count: POSTS.filter((p) => p.category === name).length,
  updated_at: dateOffset(i * 3),
}));

const TAG_NAMES = ["marketing", "growth", "brand", "design", "product", "case-study"];
const TAGS: Tag[] = TAG_NAMES.map((name, i) => ({
  id: i + 1, name, slug: name, posts_count: 3 + i, updated_at: dateOffset(i * 2),
}));

const REDIRECTS: Redirect[] = [
  { id: 1, old_path: "/blog/old-post", new_url: "/posts/how-modern-brands-win-attention-in-2026", http_code: 301, is_active: true, hits: 1240, updated_at: dateOffset(2) },
  { id: 2, old_path: "/services/web", new_url: "/services", http_code: 301, is_active: true, hits: 442, updated_at: dateOffset(8) },
  { id: 3, old_path: "/promo", new_url: "/spring", http_code: 302, is_active: true, hits: 98, updated_at: dateOffset(1) },
  { id: 4, old_path: "/legacy", new_url: "/about", http_code: 308, is_active: false, hits: 0, updated_at: dateOffset(40) },
];

const NAVIGATION: NavigationItem[] = [
  { id: 1, title: "Home", menu_name: "Primary", url: "/", item_type: "page", sort_order: 1, status: "published" },
  { id: 2, title: "About", menu_name: "Primary", url: "/about", item_type: "page", sort_order: 2, status: "published" },
  { id: 3, title: "Services", menu_name: "Primary", url: "/services", item_type: "page", sort_order: 3, status: "published" },
  { id: 4, title: "Blog", menu_name: "Primary", url: "/blog", item_type: "page", sort_order: 4, status: "published" },
  { id: 5, title: "Contact", menu_name: "Primary", url: "/contact", item_type: "page", sort_order: 5, status: "published" },
  { id: 6, title: "Privacy", menu_name: "Footer", url: "/privacy", item_type: "page", sort_order: 1, status: "published" },
  { id: 7, title: "Terms", menu_name: "Footer", url: "/terms", item_type: "page", sort_order: 2, status: "published" },
];

function paginate<T>(rows: T[], p?: ListParams): Paginated<T> {
  const per_page = p?.per_page ?? 10;
  const current_page = p?.page ?? 1;
  const start = (current_page - 1) * per_page;
  return {
    data: rows.slice(start, start + per_page),
    meta: { total: rows.length, per_page, current_page, last_page: Math.max(1, Math.ceil(rows.length / per_page)) },
  };
}

function searchFilter<T extends Record<string, any>>(rows: T[], p?: ListParams, fields: string[] = ["title", "name"]): T[] {
  let r = rows;
  const status = p?.status;
  if (status && status !== "all") r = r.filter((x) => x.status === status);
  const q = (p?.q ?? p?.search ?? "").trim().toLowerCase();
  if (q) {
    r = r.filter((x) => fields.some((f) => String(x[f] ?? "").toLowerCase().includes(q)));
  }
  return r;
}

const delay = <T,>(v: T) => new Promise<T>((res) => setTimeout(() => res(v), 200));

function makeResource<T extends { id: number | string; status?: string }>(rows: T[], searchFields: string[]) {
  return {
    list: (p?: ListParams) => delay(paginate(searchFilter(rows, p, searchFields), p)),
    get: (id: string | number) => delay(rows.find((r) => String(r.id) === String(id)) as T),
    create: (body: Partial<T>) => {
      const item = { ...body, id: rows.length + 1 } as T;
      rows.unshift(item);
      return delay(item);
    },
    update: (id: string | number, body: Partial<T>) => {
      const i = rows.findIndex((r) => String(r.id) === String(id));
      if (i >= 0) rows[i] = { ...rows[i], ...body };
      return delay(rows[i]);
    },
    remove: (id: string | number) => {
      const i = rows.findIndex((r) => String(r.id) === String(id));
      if (i >= 0) rows.splice(i, 1);
      return delay(undefined as void);
    },
    publish: (id: string | number, status: PublishStatus, published_at?: string | null) => {
      const i = rows.findIndex((r) => String(r.id) === String(id));
      if (i >= 0) rows[i] = { ...rows[i], status, ...(published_at !== undefined ? { published_at } : {}) } as T;
      return delay(rows[i]);
    },
    seo: (id: string | number, _seo: any) => {
      const i = rows.findIndex((r) => String(r.id) === String(id));
      return delay(rows[i]);
    },
  };
}

export const mockApi = {
  posts: makeResource(POSTS, ["title", "slug", "category"]),
  pages: makeResource(PAGES, ["title", "slug", "template"]),
  portfolios: makeResource(PORTFOLIOS, ["title", "client", "category"]),
  media: makeResource(MEDIA, ["name"]),
  products: makeResource(PRODUCTS, ["name", "slug", "sku"]),
  orders: makeResource(ORDERS, ["number", "customer_name", "customer_email"]),
  contacts: makeResource(CONTACTS, ["name", "email", "subject"]),
  leads: makeResource(LEADS, ["contact_name", "source", "assignee_name"]),
  coupons: makeResource(COUPONS, ["code"]),
  categories: makeResource(CATEGORIES, ["name", "slug"]),
  tags: makeResource(TAGS, ["name", "slug"]),
  redirects: makeResource(REDIRECTS, ["old_path", "new_url"]),
  "navigation-items": makeResource(NAVIGATION, ["title", "menu_name", "url"]),

  stats: () => delay({
    posts_published: POSTS.filter((p) => p.status === "published").length,
    posts_draft: POSTS.filter((p) => p.status === "draft").length,
    pages_total: PAGES.length,
    portfolios_total: PORTFOLIOS.length,
    products_total: PRODUCTS.length,
    orders_total: ORDERS.length,
    leads_total: LEADS.length,
    contacts_total: CONTACTS.length,
    monthly_views: 48230,
    monthly_revenue: ORDERS.reduce((s, o) => s + o.total, 0),
    growth_pct: 12.4,
    top_posts: POSTS.slice(0, 5).map((p) => ({ id: String(p.id), title: p.title, views: p.views, status: p.status as string })),
    activity: Array.from({ length: 7 }).map((_, i) => ({
      day: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i],
      views: 1200 + Math.round(Math.sin(i) * 400 + i * 180),
    })),
    recent_orders: ORDERS.slice(0, 5),
  }),
};
