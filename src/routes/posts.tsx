import { createFileRoute } from "@tanstack/react-router";
import { PostsScreen } from "@/components/admin/PostsScreen";

export const Route = createFileRoute("/posts")({
  head: () => ({
    meta: [
      { title: "Posts — Atelier CMS" },
      { name: "description", content: "Manage articles, news, and editorial pieces." },
    ],
  }),
  component: PostsScreen,
});
