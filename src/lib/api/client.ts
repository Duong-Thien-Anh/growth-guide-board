// Typed API client.
// Backend: Laravel API at /api/v1 (+ /api/v1/admin for CRUD resources).
// Toggle mock mode with VITE_USE_MOCK=true when needed.

import { mockApi } from "./mock";
import type {
  AdminUser,
  Category,
  Contact,
  Coupon,
  HealthStatus,
  LaravelPaginator,
  Lead,
  ListParams,
  MediaItem,
  NavigationItem,
  Order,
  Page,
  Paginated,
  Portfolio,
  Post,
  Product,
  PublishStatus,
  Redirect,
  Tag,
} from "./types";

// ---------- Configuration ----------
export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK ?? "false").toString().toLowerCase() === "true";
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
const TOKEN_KEY = "atelier_admin_token";
type DashboardStats = Awaited<ReturnType<typeof mockApi.stats>>;

// ---------- Token storage ----------
export const auth = {
  getToken: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  setToken: (t: string) => typeof window !== "undefined" && localStorage.setItem(TOKEN_KEY, t),
  clear: () => typeof window !== "undefined" && localStorage.removeItem(TOKEN_KEY),
};

// ---------- HTTP helpers ----------
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message);
  }
}

function buildQuery(p?: ListParams): string {
  if (!p) return "";
  const usp = new URLSearchParams();
  if (p.page) usp.set("page", String(p.page));
  if (p.per_page) usp.set("per_page", String(p.per_page));
  const q = p.q ?? p.search;
  if (q) usp.set("q", q);
  if (p.status && p.status !== "all") usp.set("status", p.status);
  if (p.sort_by) usp.set("sort_by", p.sort_by);
  if (p.sort_dir) usp.set("sort_dir", p.sort_dir);
  const s = usp.toString();
  return s ? `?${s}` : "";
}

function asNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}

function asText(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeAdminUser(raw: any): AdminUser {
  const billing = raw?.billing ?? {};
  return {
    id: raw?.id ?? 0,
    name: asText(raw?.name),
    email: asText(raw?.email),
    login: raw?.login ?? null,
    role: asText(raw?.role, "admin"),
    registered: raw?.registered ?? null,
    billing_first_name: raw?.billing_first_name ?? billing.first_name ?? null,
    billing_last_name: raw?.billing_last_name ?? billing.last_name ?? null,
    billing_phone: raw?.billing_phone ?? billing.phone ?? null,
    billing_address: raw?.billing_address ?? billing.address ?? null,
    billing_city: raw?.billing_city ?? billing.city ?? null,
    billing_country: raw?.billing_country ?? billing.country ?? null,
  };
}

function normalizePost(raw: any): Post {
  const categories = Array.isArray(raw?.categories) ? raw.categories : [];
  const tags = Array.isArray(raw?.tags) ? raw.tags : [];
  const media = raw?.featuredMedia ?? raw?.featured_media ?? null;
  const tagNames =
    tags.length > 0
      ? tags.map((t: any) => asText(t?.name)).filter(Boolean)
      : Array.isArray(raw?.tag_names)
        ? raw.tag_names
        : [];

  return {
    id: raw?.id ?? 0,
    title: asText(raw?.title),
    slug: asText(raw?.slug),
    excerpt: asText(raw?.excerpt),
    status: (raw?.status ?? "draft") as PublishStatus,
    category: asText(raw?.category, asText(categories[0]?.name)),
    tags: tagNames,
    cover_url: raw?.cover_url ?? raw?.image_url ?? media?.source_url,
    author: {
      id: raw?.author?.id ?? raw?.author_id ?? raw?.id ?? 0,
      name: asText(raw?.author?.name, asText(raw?.author_name, "Unknown")),
      avatar_url: raw?.author?.avatar_url,
    },
    views: asNumber(raw?.views ?? raw?.view_count ?? raw?.meta?.views, 0),
    published_at: raw?.published_at ?? null,
    updated_at: raw?.updated_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizePage(raw: any): Page {
  return {
    id: raw?.id ?? 0,
    title: asText(raw?.title),
    slug: asText(raw?.slug),
    status: (raw?.status ?? "draft") as PublishStatus,
    template: (raw?.template ?? "default") as Page["template"],
    updated_at: raw?.updated_at ?? raw?.created_at ?? new Date().toISOString(),
    author: {
      id: raw?.author?.id ?? raw?.author_id ?? raw?.id ?? 0,
      name: asText(raw?.author?.name, asText(raw?.author_name, "Unknown")),
      avatar_url: raw?.author?.avatar_url,
    },
  };
}

function normalizePortfolio(raw: any): Portfolio {
  const media = raw?.featuredMedia ?? raw?.featured_media ?? null;
  return {
    id: raw?.id ?? 0,
    title: asText(raw?.title),
    client: asText(raw?.client, asText(raw?.client_name)),
    category: asText(raw?.category, asText(raw?.meta?.category)),
    cover_url: raw?.cover_url ?? media?.source_url ?? "",
    status: (raw?.status ?? "draft") as PublishStatus,
    year: asNumber(raw?.year, new Date().getFullYear()),
    updated_at: raw?.updated_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeMedia(raw: any): MediaItem {
  const mimeType = asText(raw?.mime_type).toLowerCase();
  const type: MediaItem["type"] =
    raw?.type ??
    (mimeType.startsWith("image/")
      ? "image"
      : mimeType.startsWith("video/")
        ? "video"
        : "document");

  return {
    id: raw?.id ?? 0,
    name: asText(raw?.name, asText(raw?.title, asText(raw?.slug, "asset"))),
    type,
    size_kb: asNumber(raw?.size_kb ?? raw?.metadata?.size_kb, 0),
    url: raw?.url ?? raw?.source_url ?? "",
    uploaded_at: raw?.uploaded_at ?? raw?.published_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeProduct(raw: any): Product {
  return {
    id: raw?.id ?? 0,
    name: asText(raw?.name),
    slug: asText(raw?.slug),
    type: raw?.type ?? "simple",
    status: (raw?.status ?? "draft") as PublishStatus,
    sku: asText(raw?.sku),
    price: asNumber(raw?.price, 0),
    stock_status: raw?.stock_status ?? "outofstock",
    stock_quantity: asNumber(raw?.stock_quantity, 0),
    updated_at: raw?.updated_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeOrder(raw: any): Order {
  return {
    id: raw?.id ?? 0,
    number: asText(raw?.number, asText(raw?.order_number, `#${raw?.id ?? ""}`)),
    customer_name: asText(raw?.customer_name),
    customer_email: asText(raw?.customer_email),
    status: raw?.status ?? "pending",
    total: asNumber(raw?.total ?? raw?.grand_total, 0),
    currency: asText(raw?.currency, "VND"),
    created_at: raw?.created_at ?? raw?.placed_at ?? new Date().toISOString(),
  };
}

function normalizeContact(raw: any): Contact {
  return {
    id: raw?.id ?? 0,
    name: asText(raw?.name),
    email: asText(raw?.email),
    phone: asText(raw?.phone),
    subject: asText(raw?.subject),
    submitted_at: raw?.submitted_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeLead(raw: any): Lead {
  return {
    id: raw?.id ?? 0,
    contact_name: asText(raw?.contact_name, asText(raw?.contact?.name, "Unknown")),
    status: raw?.status ?? "new",
    score: asNumber(raw?.score, 0),
    source: asText(raw?.source),
    channel: asText(raw?.channel),
    assignee_name: asText(raw?.assignee_name),
    captured_at: raw?.captured_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeCoupon(raw: any): Coupon {
  return {
    id: raw?.id ?? 0,
    code: asText(raw?.code),
    discount_type: raw?.discount_type ?? "fixed_cart",
    amount: asNumber(raw?.amount, 0),
    status: raw?.status ?? "active",
    usage_count: asNumber(raw?.usage_count, 0),
    usage_limit: raw?.usage_limit ?? null,
    expires_at: raw?.expires_at ?? null,
  };
}

function normalizeCategory(raw: any): Category {
  return {
    id: raw?.id ?? 0,
    name: asText(raw?.name),
    slug: asText(raw?.slug),
    parent_id: raw?.parent_id ?? null,
    posts_count: asNumber(raw?.posts_count ?? raw?.posts?.length, 0),
    updated_at: raw?.updated_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeTag(raw: any): Tag {
  return {
    id: raw?.id ?? 0,
    name: asText(raw?.name),
    slug: asText(raw?.slug),
    posts_count: asNumber(raw?.posts_count ?? raw?.posts?.length, 0),
    updated_at: raw?.updated_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeRedirect(raw: any): Redirect {
  return {
    id: raw?.id ?? 0,
    old_path: asText(raw?.old_path),
    new_url: asText(raw?.new_url),
    http_code: asNumber(raw?.http_code, 301) as Redirect["http_code"],
    is_active: Boolean(raw?.is_active),
    hits: asNumber(raw?.hits, 0),
    updated_at: raw?.updated_at ?? raw?.created_at ?? new Date().toISOString(),
  };
}

function normalizeNavigationItem(raw: any): NavigationItem {
  return {
    id: raw?.id ?? 0,
    title: asText(raw?.title),
    menu_name: asText(raw?.menu_name),
    url: asText(raw?.url),
    item_type: asText(raw?.item_type),
    sort_order: asNumber(raw?.sort_order, 0),
    status: (raw?.status ?? "draft") as PublishStatus,
  };
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = auth.getToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(init.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...((init.headers as Record<string, string>) ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...init, headers });

  if (res.status === 401) {
    auth.clear();
    if (typeof window !== "undefined" && !window.location.pathname.endsWith("/login")) {
      window.location.href = "/login";
    }
    throw new ApiError(401, "Unauthenticated");
  }
  if (!res.ok) {
    let body: { message?: string; errors?: Record<string, string[]> } = {};
    try { body = await res.json(); } catch { /* ignore */ }
    throw new ApiError(res.status, body.message ?? res.statusText, body.errors);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

function unwrapList<T>(payload: { data: LaravelPaginator<any> }, normalize: (raw: any) => T): Paginated<T> {
  const p = payload.data;
  return {
    data: p.data.map(normalize),
    meta: { total: p.total, per_page: p.per_page, current_page: p.current_page, last_page: p.last_page },
  };
}

function localPaginate<T>(rows: T[], p?: ListParams): Paginated<T> {
  const per_page = p?.per_page ?? 20;
  const current_page = p?.page ?? 1;
  const start = (current_page - 1) * per_page;
  const data = rows.slice(start, start + per_page);
  return {
    data,
    meta: {
      total: rows.length,
      per_page,
      current_page,
      last_page: Math.max(1, Math.ceil(rows.length / per_page)),
    },
  };
}

async function fetchMeProfile(): Promise<AdminUser> {
  const profile = await request<any>("/me/profile");
  return normalizeAdminUser(profile);
}

// ---------- Generic admin CRUD factory ----------
function crud<T>(resource: string, normalize: (raw: any) => T) {
  return {
    list: (p?: ListParams): Promise<Paginated<T>> =>
      USE_MOCK
        ? (mockApi as any)[resource].list(p)
        : request<{ data: LaravelPaginator<any> }>(`/admin/${resource}${buildQuery(p)}`).then((r) => unwrapList(r, normalize)),
    get: (id: string | number): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].get?.(id)
        : request<{ data: any }>(`/admin/${resource}/${id}`).then((r) => normalize(r.data)),
    create: (body: Partial<T>): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].create?.(body)
        : request<{ data: any }>(`/admin/${resource}`, { method: "POST", body: JSON.stringify(body) }).then((r) => normalize(r.data)),
    update: (id: string | number, body: Partial<T>): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].update?.(id, body)
        : request<{ data: any }>(`/admin/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(body) }).then((r) => normalize(r.data)),
    remove: (id: string | number): Promise<void> =>
      USE_MOCK
        ? (mockApi as any)[resource].remove?.(id)
        : request<void>(`/admin/${resource}/${id}`, { method: "DELETE" }),
    publish: (id: string | number, status: PublishStatus, published_at?: string | null): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].publish?.(id, status, published_at)
        : request<{ data: any }>(`/admin/${resource}/${id}/publish`, {
            method: "PATCH",
            body: JSON.stringify({ status, published_at }),
          }).then((r) => normalize(r.data)),
    seo: (id: string | number, seo: { seo_title?: string; seo_description?: string; seo_keywords?: string[] }): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].seo?.(id, seo)
        : request<{ data: any }>(`/admin/${resource}/${id}/seo`, {
            method: "PATCH",
            body: JSON.stringify(seo),
          }).then((r) => normalize(r.data)),
  };
}

// ---------- Public API ----------
export const api = {
  // Auth
  login: async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const token = "mock-token-" + Date.now();
      auth.setToken(token);
      mockApi.setCurrentByEmail(email);
      const user = await mockApi.me();
      return { token, user: { ...user, email } };
    }
    const r = await request<{ token: string; user: any }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    auth.setToken(r.token);
    return { token: r.token, user: normalizeAdminUser(r.user) };
  },
  logout: async () => {
    if (!USE_MOCK) await request<void>("/logout", { method: "POST" }).catch(() => {});
    auth.clear();
  },
  me: (): Promise<AdminUser> =>
    USE_MOCK
      ? mockApi.me()
      : fetchMeProfile(),
  updateMe: (body: Partial<AdminUser>): Promise<AdminUser> =>
    USE_MOCK
      ? mockApi.updateMe(body)
      : request<{ user?: any; data?: any } & any>("/me/profile", { method: "PATCH", body: JSON.stringify(body) })
          .then((r: any) => normalizeAdminUser(r.user ?? r.data ?? r)),

  health: (): Promise<HealthStatus> =>
    USE_MOCK
      ? mockApi.health()
      : request<any>("/health").then((payload) => {
          const data = payload?.data ?? payload ?? {};
          return {
            ok: Boolean(data?.ok),
            database: data?.ok ? "up" : "down",
            app: typeof data?.database === "string" ? `database: ${data.database}` : undefined,
            checked_at: new Date().toISOString(),
          };
        }),

  accounts: {
    list: async (p?: ListParams): Promise<Paginated<AdminUser>> => {
      if (USE_MOCK) return mockApi.accounts.list(p);
      try {
        const r = await request<{ data: LaravelPaginator<any> }>(`/admin/accounts${buildQuery(p)}`);
        return unwrapList(r, normalizeAdminUser);
      } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 404) throw error;
        const me = await fetchMeProfile();
        const q = (p?.q ?? p?.search ?? "").toLowerCase().trim();
        const rows =
          q === ""
            ? [me]
            : [me].filter((u) =>
                [u.name, u.email, u.login ?? "", u.role].join(" ").toLowerCase().includes(q)
              );
        return localPaginate(rows, p);
      }
    },
  },

  // Resources
  posts: crud<Post>("posts", normalizePost),
  pages: crud<Page>("pages", normalizePage),
  portfolios: crud<Portfolio>("portfolios", normalizePortfolio),
  media: {
    ...crud<MediaItem>("media", normalizeMedia),
    upload: async (file: File, meta?: { title?: string; alt_text?: string; caption?: string; description?: string }) => {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        return { id: Math.random(), name: file.name, type: "image", size_kb: Math.round(file.size / 1024), url: URL.createObjectURL(file), uploaded_at: new Date().toISOString() } as MediaItem;
      }
      const fd = new FormData();
      fd.append("file", file);
      if (meta?.title) fd.append("title", meta.title);
      if (meta?.alt_text) fd.append("alt_text", meta.alt_text);
      if (meta?.caption) fd.append("caption", meta.caption);
      if (meta?.description) fd.append("description", meta.description);
      return request<{ data: any }>("/admin/blog/media/upload", { method: "POST", body: fd }).then((r) => normalizeMedia(r.data));
    },
  },
  products: crud<Product>("products", normalizeProduct),
  orders: crud<Order>("orders", normalizeOrder),
  contacts: crud<Contact>("contacts", normalizeContact),
  leads: crud<Lead>("leads", normalizeLead),
  coupons: crud<Coupon>("coupons", normalizeCoupon),
  categories: crud<Category>("categories", normalizeCategory),
  tags: crud<Tag>("tags", normalizeTag),
  redirects: crud<Redirect>("redirects", normalizeRedirect),
  navigation: crud<NavigationItem>("navigation-items", normalizeNavigationItem),

  stats: async (): Promise<DashboardStats> => {
    if (USE_MOCK) return mockApi.stats();

    const [postsPub, postsDraft, pages, portfolios, products, orders, leads, contacts, topPostsPage] = await Promise.all([
      request<{ data: LaravelPaginator<any> }>(`/admin/posts${buildQuery({ status: "published", per_page: 1 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/posts${buildQuery({ status: "draft", per_page: 1 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/pages${buildQuery({ per_page: 1 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/portfolios${buildQuery({ per_page: 1 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/products${buildQuery({ per_page: 1 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/orders${buildQuery({ per_page: 100 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/leads${buildQuery({ per_page: 1 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/contacts${buildQuery({ per_page: 1 })}`),
      request<{ data: LaravelPaginator<any> }>(`/admin/posts${buildQuery({ per_page: 5 })}`),
    ]);

    const normalizedOrders = orders.data.data.map(normalizeOrder);
    const normalizedTopPosts = topPostsPage.data.data.map(normalizePost).slice(0, 5);
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return {
      posts_published: postsPub.data.total,
      posts_draft: postsDraft.data.total,
      pages_total: pages.data.total,
      portfolios_total: portfolios.data.total,
      products_total: products.data.total,
      orders_total: orders.data.total,
      leads_total: leads.data.total,
      contacts_total: contacts.data.total,
      monthly_views: normalizedTopPosts.reduce((sum, p) => sum + p.views, 0),
      monthly_revenue: normalizedOrders.reduce((sum, o) => sum + o.total, 0),
      growth_pct: 0,
      top_posts: normalizedTopPosts.map((p) => ({
        id: String(p.id),
        title: p.title,
        views: p.views,
        status: p.status,
      })),
      activity: days.map((day) => ({ day, views: 0 })),
      recent_orders: normalizedOrders.slice(0, 5),
    };
  },
};
