import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  AlertCircle,
  Upload,
  FileWarning,
  Eye,
  Send,
  FileCheck,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPKR, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";

interface FBRNotice {
  id: string;
  noticeNumber: string;
  type: string;
  taxYear: string;
  amount: number;
  dueDate: string;
  status: string;
  urgency: "low" | "medium" | "high" | "critical";
  description: string;
}

const noticeTypes = [
  "Audit Notice",
  "Tax Demand",
  "Penalty",
  "Information Request",
  "Show Cause",
  "Assessment",
  "Rejection",
];

const urgencyColors: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medium:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const taxYears = Array.from({ length: 10 }, (_, i) => String(2017 + i));

export default function FBRNoticesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [showRespond, setShowRespond] = useState<FBRNotice | null>(null);
  const [responseText, setResponseText] = useState("");
  const [noticeFile, setNoticeFile] = useState<File | null>(null);
  const [responseFile, setResponseFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const responseFileInputRef = useRef<HTMLInputElement>(null);
  const [newNotice, setNewNotice] = useState({
    noticeNumber: "",
    type: "",
    taxYear: "",
    amount: "",
    dueDate: "",
    description: "",
    urgency: "medium" as const,
  });
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["fbr-notices"],
    queryFn: async () => {
      const res = await api.get("/fbr-notices");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/fbr-notices", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Notice added successfully!");
      setShowAdd(false);
      setNewNotice({ noticeNumber: "", type: "", taxYear: "", amount: "", dueDate: "", description: "", urgency: "medium" });
      setNoticeFile(null);
      queryClient.invalidateQueries({ queryKey: ["fbr-notices"] });
    },
    onError: () => toast.error("Failed to add notice"),
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const res = await api.post(`/fbr-notices/${id}/respond`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Response submitted successfully!");
      setShowRespond(null);
      setResponseText("");
      setResponseFile(null);
      queryClient.invalidateQueries({ queryKey: ["fbr-notices"] });
    },
    onError: () => toast.error("Failed to submit response"),
  });

  const notices: FBRNotice[] = data?.data || [];

  const urgentNotices = notices.filter((n) => {
    const daysLeft = Math.ceil(
      (new Date(n.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return (
      (daysLeft <= 15 && n.status === "PENDING") ||
      n.urgency === "critical" ||
      n.urgency === "high"
    );
  });

  const columns: Column<FBRNotice>[] = [
    { key: "noticeNumber", header: "Notice #", sortable: true },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium">{item.type}</span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium w-fit ${urgencyColors[item.urgency]}`}
          >
            {item.urgency.toUpperCase()}
          </span>
        </div>
      ),
    },
    { key: "taxYear", header: "Tax Year" },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (item.amount > 0 ? formatPKR(item.amount) : "N/A"),
      sortable: true,
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (item) => formatDate(item.dueDate),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          {item.status === "PENDING" && (
            <Button
              variant="ghost"
              size="sm"
              className="text-primary"
              onClick={() => setShowRespond(item)}
            >
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleSaveNotice = () => {
    if (!newNotice.noticeNumber || !newNotice.type) {
      toast.error("Please fill in required fields");
      return;
    }
    createMutation.mutate({
      noticeNumber: newNotice.noticeNumber,
      type: newNotice.type,
      taxYear: newNotice.taxYear ? Number(newNotice.taxYear) : null,
      amount: newNotice.amount ? Number(newNotice.amount) : null,
      dueDate: newNotice.dueDate || null,
      description: newNotice.description || null,
      urgency: newNotice.urgency,
      document: noticeFile ? noticeFile.name : null,
    });
  };

  const handleSubmitResponse = () => {
    if (!responseText.trim()) {
      toast.error("Please enter your response");
      return;
    }
    if (!showRespond) return;
    const formData = new FormData();
    formData.append("response", responseText);
    if (responseFile) {
      formData.append("document", responseFile);
    }
    respondMutation.mutate({ id: showRespond.id, formData });
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load FBR notices"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="FBR Income Tax Notices"
        subtitle="Track and respond to your FBR income tax notices"
        action={
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Notice
          </Button>
        }
      />

      {urgentNotices.map((notice) => {
        const daysLeft = Math.ceil(
          (new Date(notice.dueDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        );
        const isCritical = notice.urgency === "critical" || daysLeft <= 7;
        return (
          <Card
            key={notice.id}
            className={`mb-4 border-l-4 ${
              isCritical
                ? "border-l-red-500 bg-red-500/5"
                : "border-l-orange-500 bg-orange-500/5"
            }`}
          >
            <CardContent className="py-3 flex items-center gap-3">
              <FileWarning
                className={`h-5 w-5 ${isCritical ? "text-red-500" : "text-orange-500"}`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {notice.type} #{notice.noticeNumber}
                  {daysLeft > 0 &&
                    ` — Due in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
                  {daysLeft <= 0 && " — OVERDUE"}
                </p>
                {notice.amount > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Amount: {formatPKR(notice.amount)}
                  </p>
                )}
              </div>
              <Button
                variant={isCritical ? "default" : "outline"}
                size="sm"
                onClick={() => setShowRespond(notice)}
              >
                Respond
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <DataTable
        columns={columns}
        data={notices}
        keyExtractor={(item) => item.id}
        emptyTitle="No FBR notices"
        emptyDescription="All clear — no income tax notices to show."
      />

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add FBR Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Notice Document</Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                  noticeFile
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {noticeFile ? (
                  <div className="flex flex-col items-center gap-1">
                    <FileCheck className="h-8 w-8 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-600">{noticeFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(noticeFile.size / 1024).toFixed(0)} KB — Click to change
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag &amp; drop</p>
                    <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
                    setNoticeFile(f);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Notice Number *</Label>
                <Input
                  placeholder="e.g., IT-123456"
                  value={newNotice.noticeNumber}
                  onChange={(e) =>
                    setNewNotice((p) => ({
                      ...p,
                      noticeNumber: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Notice Type *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newNotice.type}
                  onChange={(e) =>
                    setNewNotice((p) => ({ ...p, type: e.target.value }))
                  }
                >
                  <option value="">Select type</option>
                  {noticeTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tax Year</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newNotice.taxYear}
                  onChange={(e) =>
                    setNewNotice((p) => ({ ...p, taxYear: e.target.value }))
                  }
                >
                  <option value="">Select</option>
                  {taxYears.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Amount (PKR)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={newNotice.amount}
                  onChange={(e) =>
                    setNewNotice((p) => ({ ...p, amount: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Urgency</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newNotice.urgency}
                  onChange={(e) =>
                    setNewNotice((p) => ({
                      ...p,
                      urgency: e.target.value as any,
                    }))
                  }
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={newNotice.dueDate}
                onChange={(e) =>
                  setNewNotice((p) => ({ ...p, dueDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Brief description of the notice..."
                value={newNotice.description}
                onChange={(e) =>
                  setNewNotice((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveNotice}>Save Notice</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showRespond !== null}
        onOpenChange={(o) => !o && setShowRespond(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Notice</DialogTitle>
          </DialogHeader>
          {showRespond && (
            <div className="space-y-4">
              <Card className="bg-muted/50 border-border/50">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Notice #:</span>
                    </div>
                    <div className="font-medium">
                      {showRespond.noticeNumber}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                    </div>
                    <div className="font-medium">{showRespond.type}</div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                    </div>
                    <div className="font-medium">
                      {formatDate(showRespond.dueDate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="space-y-2">
                <Label>Upload Supporting Documents</Label>
                <div
                  onClick={() => responseFileInputRef.current?.click()}
                  className={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
                    responseFile
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {responseFile ? (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-8 w-8 text-emerald-500" />
                      <p className="text-sm font-medium text-emerald-600">{responseFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(responseFile.size / 1024).toFixed(0)} KB — Click to change
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag & drop
                      </p>
                      <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  )}
                  <Input
                    ref={responseFileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      if (f.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
                      setResponseFile(f);
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Your Response</Label>
                <textarea
                  className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type your response to this notice..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowRespond(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitResponse}>Submit Response</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
