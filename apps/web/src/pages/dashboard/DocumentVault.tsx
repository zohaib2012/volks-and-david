import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  Download,
  Share2,
  Trash2,
  AlertCircle,
  FileText,
  FileImage,
  FileSpreadsheet,
  Upload,
  HardDrive,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";

interface Document {
  id: string;
  name: string;
  type: string | null;
  createdAt: string;
  taxYear: number | null;
  size?: number;
  fileSize?: number | null;
  fileUrl?: string | null;
  notes?: string | null;
  fileType?: string;
  uploadDate?: string;
}

const docTypes = [
  "Tax Return",
  "Invoice",
  "Receipt",
  "Contract",
  "Bank Statement",
  "ID Document",
  "Other",
];

const taxYears = Array.from({ length: 10 }, (_, i) => String(2017 + i));

const getFileIcon = (fileUrl?: string | null) => {
  const ext = fileUrl?.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return <FileText className="h-10 w-10 text-red-500" />;
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return <FileImage className="h-10 w-10 text-blue-500" />;
  if (["xlsx", "xls", "csv"].includes(ext || "")) return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
  return <FileText className="h-10 w-10 text-muted-foreground" />;
};

const getTypeBadgeVariant = (type: string) => {
  const variants: Record<string, string> = {
    "Tax Return": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    Invoice: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    Receipt: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    Contract: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Bank Statement": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "ID Document": "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    Other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  };
  return variants[type] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
};

const detectFileType = (file: File): string => {
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("image/")) return "image";
  if (file.type.includes("spreadsheet") || file.type.includes("excel") || file.name.endsWith(".xlsx") || file.name.endsWith(".csv")) return "spreadsheet";
  return "other";
};

export default function DocumentVaultPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDoc, setNewDoc] = useState({ name: "", type: "", taxYear: "", notes: "" });
  const [deleteConfirm, setDeleteConfirm] = useState<Document | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await api.get("/documents");
      return res.data;
    },
  });

  const documents: Document[] = data?.data || [];

  const storageUsed = Math.round(documents.reduce((sum, d) => sum + (d.size || d.fileSize || 0), 0) / 1024);
  const storageTotal = 500;
  const storagePercent = Math.min((storageUsed / storageTotal) * 100, 100);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", newDoc.name);
      formData.append("type", newDoc.type || "");
      formData.append("taxYear", newDoc.taxYear ? String(newDoc.taxYear) : "");
      formData.append("notes", newDoc.notes || "");
      const res = await api.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Document uploaded successfully!");
      setShowUpload(false);
      setNewDoc({ name: "", type: "", taxYear: "", notes: "" });
      setSelectedFile(null);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => toast.error("Failed to upload document"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/documents/${id}`);
    },
    onSuccess: () => {
      toast.success("Document deleted");
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: () => toast.error("Failed to delete document"),
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10MB");
      return;
    }
    setSelectedFile(file);
    if (!newDoc.name) {
      setNewDoc((p) => ({ ...p, name: file.name.replace(/\.[^/.]+$/, "") }));
    }
  };

  const handleUpload = () => {
    if (!newDoc.name) {
      toast.error("Please enter a document name");
      return;
    }
    uploadMutation.mutate();
  };

  const handleDownload = (doc: Document) => {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.name;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      toast("No file URL available for this document", { icon: "ℹ️" });
    }
  };

  const handleShare = (doc: Document) => {
    if (doc.fileUrl && navigator.clipboard) {
      navigator.clipboard.writeText(doc.fileUrl);
      toast.success("Link copied to clipboard!");
    } else {
      toast("Share link not available", { icon: "ℹ️" });
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load documents"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Document Vault"
        subtitle="Store and manage your tax documents securely"
        action={
          <Button onClick={() => setShowUpload(true)}>
            <Plus className="mr-2 h-4 w-4" /> Upload Document
          </Button>
        }
      />

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Storage Used</p>
                <span className="text-sm text-muted-foreground">
                  {storageUsed} MB of {storageTotal} MB
                </span>
              </div>
              <Progress value={storagePercent} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {documents.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-muted-foreground" />}
          title="No documents yet"
          description="Upload your first document to get started."
          action={{ label: "Upload Document", onClick: () => setShowUpload(true) }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {documents.map((doc) => (
            <motion.div key={doc.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="h-full flex flex-col overflow-hidden group">
                <CardContent className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    {getFileIcon(doc.fileUrl)}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownload(doc)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleShare(doc)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => setDeleteConfirm(doc)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-medium truncate mb-2">{doc.name}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {doc.type && (
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getTypeBadgeVariant(doc.type)}`}>
                        {doc.type}
                      </span>
                    )}
                    {doc.taxYear && (
                      <Badge variant="outline" className="text-xs">TY {doc.taxYear}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-auto">
                    {formatDate(doc.createdAt)} · {doc.fileSize ? Math.round(doc.fileSize / 1024) : doc.size || 0} KB
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select File</Label>
              <div
                className="rounded-lg border-2 border-dashed border-border p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div>
                    <FileText className="h-10 w-10 mx-auto text-primary mb-2" />
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.gif,.xlsx,.csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Document Name *</Label>
              <Input
                placeholder="e.g., 2025 Tax Return"
                value={newDoc.name}
                onChange={(e) => setNewDoc((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Document Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newDoc.type}
                  onChange={(e) => setNewDoc((p) => ({ ...p, type: e.target.value }))}
                >
                  <option value="">Select type</option>
                  {docTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Tax Year</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newDoc.taxYear}
                  onChange={(e) => setNewDoc((p) => ({ ...p, taxYear: e.target.value }))}
                >
                  <option value="">Select year</option>
                  {taxYears.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Add any notes about this document"
                value={newDoc.notes}
                onChange={(e) => setNewDoc((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
