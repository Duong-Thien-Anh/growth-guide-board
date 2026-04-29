// Shared API types — mirrors the Laravel API contract.
// Admin base: /api/v1/admin
// Response envelope (list): { success, resource, data: LaravelPaginator }
// Response envelope (item): { success, message, data }

export type ID = number | string;

// ============ Enums (from Laravel migrations & validators) ============
export const PUBLISH_STATUS = ["draft", "pending", "published", "private", "trash"] as const;
export type PublishStatus = (typeof PUBLISH_STATUS)[number];

export const PRODUCT_TYPE = ["simple", "variable", "grouped", "external"] as const;
export type ProductType = (typeof PRODUCT_TYPE)[number];

export const STOCK_STATUS = ["instock", "outofstock", "onbackorder"] as const;
export type StockStatus = (typeof STOCK_STATUS)[number];

export const LEAD_STATUS = ["new", "qualified", "proposal", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUS)[number];

export const COUPON_STATUS = ["active", "inactive", "expired", "draft"] as const;
export type CouponStatus = (typeof COUPON_STATUS)[number];

export const COUPON_DISCOUNT_TYPE = ["fixed_cart", "percent", "fixed_product"] as const;
export type CouponDiscountType = (typeof COUPON_DISCOUNT_TYPE)[number];

export const ORDER_STATUS = [
  "pending", "processing", "completed", "cancelled", "refunded", "failed", "on-hold",
] as const;
export type OrderStatus = (typeof ORDER_STATUS)[number];

export const REDIRECT_HTTP_CODE = [301, 302, 307, 308] as const;
export type RedirectHttpCode = (typeof REDIRECT_HTTP_CODE)[number];

// Backwards-compat alias used by existing components — maps to publish status.
export type Status = PublishStatus;

// ============ Laravel paginator ============
export interface LaravelPaginator<T> {
  current_page: number;
  data: T[];
  total: number;
  per_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

// Simplified envelope used by our client (we unwrap success/resource).
export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface Author {
  id: ID;
  name: string;
  avatar_url?: string;
}

// ============ Resources ============
export interface Post {
  id: ID;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  wp_post_id?: ID | null;
  status: PublishStatus;
  category: string;
  tags: string[];
  cover_url?: string;
  author: Author;
  views: number;
  published_at: string | null;
  updated_at: string;
}

export interface Page {
  id: ID;
  title: string;
  slug: string;
  status: PublishStatus;
  template: "default" | "landing" | "legal";
  updated_at: string;
  author: Author;
}

export interface Portfolio {
  id: ID;
  title: string;
  client: string;
  category: string;
  cover_url: string;
  status: PublishStatus;
  year: number;
  updated_at: string;
}

export interface MediaItem {
  id: ID;
  name: string;
  type: "image" | "video" | "document";
  size_kb: number;
  url: string;
  uploaded_at: string;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  type: ProductType;
  status: PublishStatus;
  sku: string;
  price: number;
  stock_status: StockStatus;
  stock_quantity: number;
  updated_at: string;
}

export interface Order {
  id: ID;
  number: string;
  customer_name: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  currency: string;
  created_at: string;
}

export interface Contact {
  id: ID;
  name: string;
  email: string;
  phone: string;
  subject: string;
  submitted_at: string;
}

export interface Lead {
  id: ID;
  contact_name: string;
  status: LeadStatus;
  score: number;
  source: string;
  channel: string;
  assignee_name: string;
  captured_at: string;
}

export interface Coupon {
  id: ID;
  code: string;
  discount_type: CouponDiscountType;
  amount: number;
  status: CouponStatus;
  usage_count: number;
  usage_limit: number | null;
  expires_at: string | null;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  parent_id: ID | null;
  posts_count: number;
  updated_at: string;
}

export interface Tag {
  id: ID;
  name: string;
  slug: string;
  posts_count: number;
  updated_at: string;
}

export interface Redirect {
  id: ID;
  old_path: string;
  new_url: string;
  http_code: RedirectHttpCode;
  is_active: boolean;
  hits: number;
  updated_at: string;
}

export interface NavigationItem {
  id: ID;
  title: string;
  menu_name: string;
  url: string;
  item_type: string;
  sort_order: number;
  status: PublishStatus;
}

export interface ListParams {
  page?: number;
  per_page?: number;
  q?: string;
  search?: string; // alias for q
  status?: string;
  sort_by?: string;
  sort_dir?: "asc" | "desc";
}

// ============ Auth ============
export interface AdminUser {
  id: ID;
  name: string;
  email: string;
  login?: string | null;
  role: "admin" | "administrator" | "super_admin" | string;
  registered?: string;
  billing_first_name?: string | null;
  billing_last_name?: string | null;
  billing_phone?: string | null;
  billing_address?: string | null;
  billing_city?: string | null;
  billing_country?: string | null;
}

export interface HealthStatus {
  ok: boolean;
  database: "up" | "down" | "unknown";
  app?: string;
  version?: string;
  checked_at: string;
  latency_ms?: number;
}
