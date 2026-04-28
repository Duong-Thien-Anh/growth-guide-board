// Typed API client. Currently routes to mock adapter; swap MOCK -> false
// and set VITE_API_BASE_URL to point at the real Laravel backend.

import { mockApi } from "./mock";
import type { ListParams, Paginated, Post, Page, Portfolio, MediaItem } from "./types";

const USE_MOCK = true;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

export const api = {
  posts: {
    list: (p?: ListParams): Promise<Paginated<Post>> =>
      USE_MOCK ? mockApi.posts.list(p) : fetch(`/api/v1/posts`).then((r) => r.json()),
  },
  pages: {
    list: (p?: ListParams): Promise<Paginated<Page>> =>
      USE_MOCK ? mockApi.pages.list(p) : fetch(`/api/v1/pages`).then((r) => r.json()),
  },
  portfolios: {
    list: (p?: ListParams): Promise<Paginated<Portfolio>> =>
      USE_MOCK ? mockApi.portfolios.list(p) : fetch(`/api/v1/portfolios`).then((r) => r.json()),
  },
  media: {
    list: (p?: ListParams): Promise<Paginated<MediaItem>> =>
      USE_MOCK ? mockApi.media.list(p) : fetch(`/api/v1/media`).then((r) => r.json()),
  },
  stats: () => mockApi.stats(),
};
