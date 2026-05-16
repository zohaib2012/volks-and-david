import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Globe,
  Lock,
  AlertCircle,
  Image,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { formatDate } from "@/lib/utils";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: string | null;
  excerpt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  status: "PUBLISHED" | "DRAFT";
  authorId: string;
  views: number;
  createdAt: string;
  publishedAt: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface BlogListResponse {
  success: boolean;
  data: BlogPost[];
  pagination: Pagination;
}



const categories = [
  "Tax Guide",
  "NTN",
  "GST",
  "Sales Tax",
  "Freelance",
  "Business",
  "News",
  "General",
];

interface BlogForm {
  title: string;
  category: string;
  tags: string;
  excerpt: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  coverImage: string;
}

const emptyForm: BlogForm = {
  title: "",
  category: "",
  tags: "",
  excerpt: "",
  content: "",
  seoTitle: "",
  seoDescription: "",
  coverImage: "",
};

export default function BlogManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<BlogPost | null>(null);
  const [deleteItem, setDeleteItem] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-blog", page],
    queryFn: async () => {
      const res = await api.get<BlogListResponse>(
        `/admin/blog?page=${page}&limit=20`
      );
      return res.data;
    },
  });

  const posts: BlogPost[] = data?.data || [];
  const pagination = data?.pagination;

  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const res = await api.post("/admin/blog", payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Blog post created");
      setCreateOpen(false);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create post");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => {
      const res = await api.put(`/admin/blog/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Blog post updated");
      setEditOpen(false);
      setEditItem(null);
      resetForm();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update post");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/admin/blog/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Blog post deleted");
      setDeleteItem(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete post");
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: "PUBLISHED" | "DRAFT";
    }) => {
      const res = await api.put(`/admin/blog/${id}`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
      toast.success("Status updated");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setUploading(false);
  };

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    const localPreview = URL.createObjectURL(file);
    setImagePreview(localPreview);

    const fd = new FormData();
    fd.append("image", file);
    setUploading(true);
    try {
      const res = await api.post("/admin/upload/image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.url;
      setForm((p) => ({ ...p, coverImage: url }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openCreate = () => {
    resetForm();
    setEditItem(null);
    setCreateOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditItem(post);
    setForm({
      title: post.title,
      category: post.category,
      tags: (post.tags ?? []).join(", "),
      excerpt: post.excerpt ?? "",
      content: post.content ?? "",
      seoTitle: post.metaTitle ?? "",
      seoDescription: post.metaDescription ?? "",
      coverImage: post.coverImage ?? "",
    });
    setImagePreview(post.coverImage ?? "");
    setImageFile(null);
    setEditOpen(true);
  };

  const handleCreate = () => {
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    createMutation.mutate({
      title: form.title,
      category: form.category,
      tags,
      excerpt: form.excerpt,
      content: form.content,
      metaTitle: form.seoTitle,
      metaDescription: form.seoDescription,
      coverImage: form.coverImage || undefined,
      status: "DRAFT",
    });
  };

  const handleUpdate = () => {
    if (!editItem) return;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    updateMutation.mutate({
      id: editItem.id,
      payload: {
        title: form.title,
        category: form.category,
        tags,
        excerpt: form.excerpt,
        content: form.content,
        metaTitle: form.seoTitle,
        metaDescription: form.seoDescription,
        coverImage: form.coverImage || undefined,
      },
    });
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    deleteMutation.mutate(deleteItem.id);
  };

  const handleToggleStatus = (post: BlogPost) => {
    const next =
      post.status === "PUBLISHED" ? ("DRAFT" as const) : ("PUBLISHED" as const);
    toggleMutation.mutate({ id: post.id, status: next });
  };

  const columns: Column<BlogPost>[] = [
    {
      key: "title",
      header: "Title",
      render: (item) => <span className="font-medium">{item.title}</span>,
    },
    {
      key: "category",
      header: "Category",
      render: (item) => <Badge variant="secondary">{item.category}</Badge>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "views",
      header: "Views",
      render: (item) => (
        <span className="font-mono text-sm">
          {item.views.toLocaleString()}
        </span>
      ),
      sortable: true,
    },
    {
      key: "publishedAt",
      header: "Published",
      render: (item) =>
        item.publishedAt ? (
          formatDate(item.publishedAt)
        ) : (
          <span className="text-muted-foreground">--</span>
        ),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => openEdit(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toast.success(`Preview: ${item.title}`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleStatus(item)}
            disabled={toggleMutation.isPending}
          >
            {item.status === "PUBLISHED" ? (
              <Lock className="h-4 w-4 text-amber-500" />
            ) : (
              <Globe className="h-4 w-4 text-emerald-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteItem(item)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load blog posts"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  const formIsValid = form.title.trim() && form.category;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Blog Management"
        subtitle="Create and manage blog posts"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" /> New Post
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={posts}
        isLoading={isLoading}
        pagination={
          pagination
            ? {
                page: pagination.page,
                limit: pagination.limit,
                total: pagination.total,
                totalPages: pagination.totalPages,
              }
            : undefined
        }
        onPageChange={setPage}
        keyExtractor={(item) => item.id}
        emptyTitle="No blog posts yet"
        emptyDescription="Create your first blog post to get started."
        emptyAction={{ label: "New Post", onClick: openCreate }}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Post title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  placeholder="tax, guide"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Cover Image</Label>
              <label className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Image className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload cover image
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </label>
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, excerpt: e.target.value }))
                }
                placeholder="Short excerpt..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                placeholder="Write your post content here..."
                rows={8}
              />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">SEO Settings</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Meta Title</Label>
                  <Input
                    value={form.seoTitle}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, seoTitle: e.target.value }))
                    }
                    placeholder="SEO title"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={form.seoDescription}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, seoDescription: e.target.value }))
                    }
                    placeholder="SEO description..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!formIsValid || createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Post title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Tags (comma separated)</Label>
                <Input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  placeholder="tax, guide"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Cover Image</Label>
              <label className="flex items-center justify-center h-32 rounded-lg border-2 border-dashed border-border bg-muted/30 cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover absolute inset-0"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Image className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Click to upload cover image
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
                {uploading && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                )}
              </label>
            </div>
            <div className="space-y-1.5">
              <Label>Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) =>
                  setForm((p) => ({ ...p, excerpt: e.target.value }))
                }
                placeholder="Short excerpt..."
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Content</Label>
              <Textarea
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                placeholder="Write your post content here..."
                rows={8}
              />
            </div>
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-2">SEO Settings</p>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label>Meta Title</Label>
                  <Input
                    value={form.seoTitle}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, seoTitle: e.target.value }))
                    }
                    placeholder="SEO title"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={form.seoDescription}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, seoDescription: e.target.value }))
                    }
                    placeholder="SEO description..."
                    rows={2}
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditOpen(false);
                setEditItem(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!formIsValid || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Post"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) setDeleteItem(null);
        }}
        title="Delete Blog Post"
        description={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.title}"? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
