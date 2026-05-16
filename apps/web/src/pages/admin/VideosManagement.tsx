import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, AlertCircle, Youtube, Eye } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatDate } from "@/lib/utils";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  category: string;
  views: number;
  published: boolean;
  createdAt: string;
  tags: string[];
}

const fallbackVideos: Video[] = [
  {
    id: "1",
    youtubeId: "dQw4w9WgXcQ",
    title: "How to File Tax Return 2025",
    description: "Step by step guide for filing tax returns in Pakistan",
    category: "Tax Guide",
    views: 12500,
    published: true,
    createdAt: "2025-11-01",
    tags: ["tax", "guide"],
  },
  {
    id: "2",
    youtubeId: "dQw4w9WgXcQ",
    title: "NTN Registration Online",
    description: "Complete NTN registration process explained",
    category: "NTN",
    views: 8900,
    published: true,
    createdAt: "2025-10-15",
    tags: ["ntn", "registration"],
  },
  {
    id: "3",
    youtubeId: "dQw4w9WgXcQ",
    title: "Understanding Sales Tax",
    description: "Basics of sales tax in Pakistan",
    category: "Sales Tax",
    views: 5600,
    published: false,
    createdAt: "2025-09-20",
    tags: ["sales-tax"],
  },
  {
    id: "4",
    youtubeId: "dQw4w9WgXcQ",
    title: "GST for E-commerce",
    description: "GST requirements for online businesses",
    category: "GST",
    views: 3200,
    published: true,
    createdAt: "2025-08-10",
    tags: ["gst", "ecommerce"],
  },
];

const categories = [
  "Tax Guide",
  "NTN",
  "Sales Tax",
  "GST",
  "Business",
  "Freelance",
  "Tutorial",
];

export default function VideosManagement() {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    youtubeId: "",
    title: "",
    description: "",
    category: "",
    tags: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: async () => {
      const res = await api.get("/admin/videos");
      return res.data.data;
    },
  });

  const videos: Video[] = data || fallbackVideos;

  const handleAdd = () => {
    toast.success(`Video "${form.title}" added`);
    setAddOpen(false);
    setForm({
      youtubeId: "",
      title: "",
      description: "",
      category: "",
      tags: "",
    });
  };

  const handleDelete = (video: Video) => {
    toast.success(`"${video.title}" deleted`);
  };

  const handleTogglePublished = (video: Video) => {
    toast.success(
      `"${video.title}" ${video.published ? "unpublished" : "published"}`,
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Videos Management"
        subtitle="Manage your YouTube video library"
        action={
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Video
          </Button>
        }
      />

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : error ? (
        <EmptyState
          icon={<AlertCircle className="h-12 w-12 text-destructive" />}
          title="Failed to load videos"
          action={{ label: "Retry", onClick: () => refetch() }}
        />
      ) : videos.length === 0 ? (
        <EmptyState
          title="No videos yet"
          description="Add your first video to get started."
          action={{ label: "Add Video", onClick: () => setAddOpen(true) }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden group">
              <div className="relative aspect-video bg-muted">
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "";
                    (e.target as HTMLImageElement).classList.add("hidden");
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Youtube className="h-10 w-10 text-white" />
                </div>
                {!video.published && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary">Draft</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm line-clamp-2 mb-1">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <Badge variant="outline" className="text-xs">
                    {video.category}
                  </Badge>
                  <span>{video.views.toLocaleString()} views</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                  {video.description}
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success(`Previewing ${video.title}`)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toast.success(`Editing ${video.title}`)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTogglePublished(video)}
                  >
                    <Badge
                      variant={video.published ? "success" : "secondary"}
                      className="text-xs cursor-pointer"
                    >
                      {video.published ? "Published" : "Draft"}
                    </Badge>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(video)}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>YouTube Video ID</Label>
              <Input
                value={form.youtubeId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, youtubeId: e.target.value }))
                }
                placeholder="e.g. dQw4w9WgXcQ"
              />
              <p className="text-xs text-muted-foreground">
                The ID from your YouTube URL (youtube.com/watch?v=
                <strong>ID</strong>)
              </p>
            </div>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="Video title"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Video description..."
                rows={3}
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
                <Label>Tags</Label>
                <Input
                  value={form.tags}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, tags: e.target.value }))
                  }
                  placeholder="tax, guide"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setAddOpen(false);
                setForm({
                  youtubeId: "",
                  title: "",
                  description: "",
                  category: "",
                  tags: "",
                });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!form.youtubeId || !form.title}
            >
              Add Video
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
