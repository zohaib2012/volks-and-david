import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, AlertCircle, Upload, FileWarning, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
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
import { formatPKR, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface SalesTaxNotice {
  id: string;
  noticeNumber: string;
  type: string;
  period: string;
  amount: number;
  dueDate: string;
  status: string;
}

const noticeTypes = ["Audit", "Tax Demand", "Penalty", "Information Request", "Show Cause"];

export default function SalesTaxNoticesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [noticeFile, setNoticeFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    noticeNumber: "",
    type: "Audit",
    amount: "",
    dueDate: "",
    period: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/sales-tax-notices", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Notice added!");
      setShowAdd(false);
      setForm({ noticeNumber: "", type: "Audit", amount: "", dueDate: "", period: "" });
      setNoticeFile(null);
      queryClient.invalidateQueries({ queryKey: ["sales-tax-notices"] });
    },
    onError: () => toast.error("Failed to add notice"),
  });

  const handleSave = () => {
    if (!form.noticeNumber) { toast.error("Please enter a notice number"); return; }
    createMutation.mutate({
      noticeNumber: form.noticeNumber,
      type: form.type,
      amount: form.amount ? Number(form.amount) : null,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      period: form.period || null,
      document: noticeFile ? noticeFile.name : null,
    });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["sales-tax-notices"],
    queryFn: async () => {
      const res = await api.get("/sales-tax-notices");
      return res.data;
    },
  });

  const notices: SalesTaxNotice[] = data?.data || [];

  const urgentNotices = notices.filter((n) => {
    if (!n.dueDate) return false;
    const daysLeft = Math.ceil(
      (new Date(n.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    return daysLeft <= 15 && n.status === "PENDING";
  });

  const columns: Column<SalesTaxNotice>[] = [
    { key: "noticeNumber", header: "Notice #" },
    { key: "type", header: "Type" },
    { key: "period", header: "Period" },
    {
      key: "amount",
      header: "Amount",
      render: (item) => item.amount ? formatPKR(item.amount) : "—",
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (item) => formatDate(item.dueDate),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: () => (
        <div className="flex gap-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Respond</Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load notices"
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Sales Tax Notices"
        subtitle="Track and respond to sales tax notices"
        action={
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Notice
          </Button>
        }
      />

      {urgentNotices.map((notice) => {
        const daysLeft = Math.ceil(
          (new Date(notice.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        );
        const isUrgent = daysLeft <= 7;
        return (
          <Card
            key={notice.id}
            className={`mb-4 border-l-4 ${isUrgent ? "border-l-red-500 bg-red-500/5" : "border-l-orange-500 bg-orange-500/5"}`}
          >
            <CardContent className="py-3 flex items-center gap-3">
              <FileWarning className={`h-5 w-5 ${isUrgent ? "text-red-500" : "text-orange-500"}`} />
              <p className="text-sm font-medium">
                Notice #{notice.noticeNumber} due in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        );
      })}

      <DataTable
        columns={columns}
        data={notices}
        keyExtractor={(item) => item.id}
        emptyTitle="No sales tax notices"
        emptyDescription="All clear — no notices to show."
      />

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Notice</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Notice Document</Label>
              <div
                className="rounded-lg border-2 border-dashed border-border p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                {noticeFile ? (
                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">{noticeFile.name}</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload or drag & drop</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      if (f.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
                      setNoticeFile(f);
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notice Number *</Label>
              <Input
                placeholder="e.g. STN-2024-001"
                value={form.noticeNumber}
                onChange={(e) => setForm((p) => ({ ...p, noticeNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Notice Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              >
                {noticeTypes.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Period (e.g. Jan 2025)</Label>
              <Input
                placeholder="e.g. Jan 2025"
                value={form.period}
                onChange={(e) => setForm((p) => ({ ...p, period: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
