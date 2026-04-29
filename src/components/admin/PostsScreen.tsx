import { api } from "@/lib/api/client";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { PageHeader } from "@/components/admin/PageHeader";
import { ResourceTable, PUBLISH_FILTERS, type Column } from "@/components/admin/ResourceTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { toast } from "sonner";
import type { Post } from "@/lib/api/types";

type PostFormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: Post["status"];
  meta_title: string;
  meta_description: string;
};

const emptyForm: PostFormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  status: "draft",
  meta_title: "",
  meta_description: "",
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toPayload(form: PostFormState) {
  const slug = form.slug.trim() || slugify(form.title);
  return {
    title: form.title.trim(),
    slug,
    excerpt: form.excerpt.trim(),
    content: form.content.trim(),
    status: form.status,
    meta_title: form.meta_title.trim(),
    meta_description: form.meta_description.trim(),
  };
}

function buildColumns(onEdit: (post: Post) => void, onDelete: (post: Post) => void): Column<Post>[] {
  return [
    {
      header: "Title",
      cell: (p) => (
        <div>
          <div className="font-medium">{p.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">/{p.slug}</div>
        </div>
      ),
    },
    { header: "Status", cell: (p) => <StatusBadge status={p.status} /> },
    { header: "Category", cell: (p) => <span className="text-sm text-muted-foreground">{p.category}</span> },
    { header: "Author", cell: (p) => <span className="text-sm">{p.author.name}</span> },
    {
      header: "Views",
      align: "right",
      cell: (p) => (
        <span className="inline-flex items-center gap-1 text-sm tabular-nums text-muted-foreground">
          <Eye className="h-3 w-3" /> {p.views.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Updated",
      cell: (p) => <span className="text-sm text-muted-foreground">{new Date(p.updated_at).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      align: "right",
      className: "w-[140px]",
      cell: (p) => (
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(p)} aria-label={`Edit ${p.title}`}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(p)}
            aria-label={`Delete ${p.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}

export function PostsScreen() {
  const qc = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState<PostFormState>(emptyForm);
  const [editForm, setEditForm] = useState<PostFormState>(emptyForm);
  const [editingPostId, setEditingPostId] = useState<string | number | null>(null);

  const createMutation = useMutation({
    mutationFn: (payload: ReturnType<typeof toPayload>) => api.posts.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      setCreateOpen(false);
      setCreateForm(emptyForm);
      toast.success("Post created successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to create post.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: ReturnType<typeof toPayload> }) =>
      api.posts.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      setEditOpen(false);
      setEditingPostId(null);
      toast.success("Post updated successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to update post.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string | number) => api.posts.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully.");
    },
    onError: (error: any) => {
      toast.error(error?.message ?? "Failed to delete post.");
    },
  });

  const columns = useMemo(
    () =>
      buildColumns(
        (post) => {
          setEditingPostId(post.id);
          setEditForm({
            title: post.title ?? "",
            slug: post.slug ?? "",
            excerpt: post.excerpt ?? "",
            content: post.content ?? "",
            status: post.status,
            meta_title: post.meta_title ?? "",
            meta_description: post.meta_description ?? "",
          });
          setEditOpen(true);
        },
        (post) => {
          if (!confirm(`Delete "${post.title}"?`)) return;
          deleteMutation.mutate(post.id);
        },
      ),
    [deleteMutation],
  );

  const submitCreate = () => {
    if (!createForm.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    createMutation.mutate(toPayload(createForm));
  };

  const submitEdit = () => {
    if (!editingPostId) return;
    if (!editForm.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    updateMutation.mutate({ id: editingPostId, payload: toPayload(editForm) });
  };

  return (
    <div>
      <PageHeader
        title="Posts"
        description="Articles, news, and editorial pieces."
        actionLabel="New post"
        onAction={() => {
          setCreateForm(emptyForm);
          setCreateOpen(true);
        }}
      />

      <ResourceTable<Post>
        queryKey="posts"
        fetcher={(p) => api.posts.list(p)}
        columns={columns}
        filters={PUBLISH_FILTERS}
        searchPlaceholder="Search posts..."
        emptyText="No posts match your filters."
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <DialogDescription>Create a new post and push it to WordPress publish layer.</DialogDescription>
          </DialogHeader>
          <PostForm form={createForm} setForm={setCreateForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)} disabled={createMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={submitCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>Update this post and synchronize to WordPress.</DialogDescription>
          </DialogHeader>
          <PostForm form={editForm} setForm={setEditForm} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={updateMutation.isPending}>
              Cancel
            </Button>
            <Button onClick={submitEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PostForm({
  form,
  setForm,
}: {
  form: PostFormState;
  setForm: Dispatch<SetStateAction<PostFormState>>;
}) {
  return (
    <div className="grid gap-3">
      <div className="grid gap-1.5">
        <Label htmlFor="post-title">Title</Label>
        <Input
          id="post-title"
          value={form.title}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              title: e.target.value,
              slug: f.slug ? f.slug : slugify(e.target.value),
            }))
          }
          placeholder="Post title"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="post-slug">Slug</Label>
        <Input
          id="post-slug"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
          placeholder="post-slug"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="post-status">Status</Label>
        <select
          id="post-status"
          value={form.status}
          onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Post["status"] }))}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        >
          {["draft", "pending", "published", "private", "trash"].map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="post-excerpt">Excerpt</Label>
        <Textarea
          id="post-excerpt"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          placeholder="Short summary"
          rows={3}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="post-content">Content</Label>
        <Textarea
          id="post-content"
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          placeholder="Main content"
          rows={6}
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="post-meta-title">SEO Title</Label>
        <Input
          id="post-meta-title"
          value={form.meta_title}
          onChange={(e) => setForm((f) => ({ ...f, meta_title: e.target.value }))}
          placeholder="SEO title"
        />
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="post-meta-description">SEO Description</Label>
        <Textarea
          id="post-meta-description"
          value={form.meta_description}
          onChange={(e) => setForm((f) => ({ ...f, meta_description: e.target.value }))}
          placeholder="SEO description"
          rows={3}
        />
      </div>
    </div>
  );
}
