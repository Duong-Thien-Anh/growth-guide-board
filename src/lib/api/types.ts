// Shared API types — mirrors the Laravel API contract from the requirements doc.
// Response envelope: { data, meta: { total, per_page, current_page, last_page } }

export type ID = string;

export type Status = "draft" | "scheduled" | "published" | "archived";

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

export interface Post {
  id: ID;
  title: string;
  slug: string;
  excerpt: string;
  status: Status;
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
  status: Status;
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
  status: Status;
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

export interface ListParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: Status | "all";
  sort?: string;
}
