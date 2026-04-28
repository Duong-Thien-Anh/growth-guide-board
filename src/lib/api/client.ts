// Typed API client. Routes to mock adapter by default; flip USE_MOCK to false
// (or set VITE_USE_MOCK=false + VITE_API_BASE_URL) to hit the Laravel backend.
//
// Laravel contract reminder:
//   Admin base:  /api/v1/admin
//   Auth:        Bearer <token>
//   List shape:  { success, resource, data: LaravelPaginator }
//   Item shape:  { success, message, data }
//   Errors:      401 unauth, 403 forbidden, 422 { message, errors }, 404, 500

import { mockApi } from "./mock";
import type {
  ListParams, Paginated, LaravelPaginator,
  Post, Page, Portfolio, MediaItem,
  Product, Order, Contact, Lead, Coupon, Category, Tag, Redirect, NavigationItem,
  AdminUser, PublishStatus,
} from "./types";

// ---------- Configuration ----------
export const USE_MOCK =
  (import.meta.env.VITE_USE_MOCK ?? "true").toString().toLowerCase() !== "false";
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";
const TOKEN_KEY = "atelier_admin_token";

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

function unwrapList<T>(payload: { data: LaravelPaginator<T> }): Paginated<T> {
  const p = payload.data;
  return {
    data: p.data,
    meta: { total: p.total, per_page: p.per_page, current_page: p.current_page, last_page: p.last_page },
  };
}

// ---------- Generic admin CRUD factory ----------
function crud<T>(resource: string) {
  return {
    list: (p?: ListParams): Promise<Paginated<T>> =>
      USE_MOCK
        ? (mockApi as any)[resource].list(p)
        : request<{ data: LaravelPaginator<T> }>(`/admin/${resource}${buildQuery(p)}`).then(unwrapList),
    get: (id: string | number): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].get?.(id)
        : request<{ data: T }>(`/admin/${resource}/${id}`).then((r) => r.data),
    create: (body: Partial<T>): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].create?.(body)
        : request<{ data: T }>(`/admin/${resource}`, { method: "POST", body: JSON.stringify(body) }).then((r) => r.data),
    update: (id: string | number, body: Partial<T>): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].update?.(id, body)
        : request<{ data: T }>(`/admin/${resource}/${id}`, { method: "PATCH", body: JSON.stringify(body) }).then((r) => r.data),
    remove: (id: string | number): Promise<void> =>
      USE_MOCK
        ? (mockApi as any)[resource].remove?.(id)
        : request<void>(`/admin/${resource}/${id}`, { method: "DELETE" }),
    publish: (id: string | number, status: PublishStatus, published_at?: string | null): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].publish?.(id, status, published_at)
        : request<{ data: T }>(`/admin/${resource}/${id}/publish`, {
            method: "PATCH",
            body: JSON.stringify({ status, published_at }),
          }).then((r) => r.data),
    seo: (id: string | number, seo: { seo_title?: string; seo_description?: string; seo_keywords?: string[] }): Promise<T> =>
      USE_MOCK
        ? (mockApi as any)[resource].seo?.(id, seo)
        : request<{ data: T }>(`/admin/${resource}/${id}/seo`, {
            method: "PATCH",
            body: JSON.stringify(seo),
          }).then((r) => r.data),
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
      return {
        token,
        user: { id: 1, name: "Linh Nguyen", email, role: "admin", registered: new Date().toISOString() },
      };
    }
    const r = await request<{ token: string; user: AdminUser }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    auth.setToken(r.token);
    return r;
  },
  logout: async () => {
    if (!USE_MOCK) await request<void>("/logout", { method: "POST" }).catch(() => {});
    auth.clear();
  },
  me: (): Promise<AdminUser> =>
    USE_MOCK
      ? Promise.resolve({ id: 1, name: "Linh Nguyen", email: "linh@atelier.co", role: "admin" })
      : request<{ data?: AdminUser } & AdminUser>("/me").then((r: any) => r.data ?? r),

  // Resources
  posts: crud<Post>("posts"),
  pages: crud<Page>("pages"),
  portfolios: crud<Portfolio>("portfolios"),
  media: {
    ...crud<MediaItem>("media"),
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
      return request<{ data: MediaItem }>("/admin/blog/media/upload", { method: "POST", body: fd }).then((r) => r.data);
    },
  },
  products: crud<Product>("products"),
  orders: crud<Order>("orders"),
  contacts: crud<Contact>("contacts"),
  leads: crud<Lead>("leads"),
  coupons: crud<Coupon>("coupons"),
  categories: crud<Category>("categories"),
  tags: crud<Tag>("tags"),
  redirects: crud<Redirect>("redirects"),
  navigation: crud<NavigationItem>("navigation-items"),

  stats: () => mockApi.stats(),
};
