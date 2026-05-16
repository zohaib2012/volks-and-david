import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AlertCircle, Eye } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

interface SalesTaxNoticeRecord {
  id: string;
  user: { id: string; name: string; email: string };
  noticeNumber: string;
  type: string;
  amount: number | null;
  dueDate: string | null;
  status: string;
  createdAt: string;
}

const statusOptions = ["PENDING", "ASSIGNED", "RESPONDED", "CLOSED"];

export default function SalesTaxNoticesManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;
  const [editOpen, setEditOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<SalesTaxNoticeRecord | null>(null);
  const [editStatus, setEditStatus] = useState("");

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-sales-tax-notices", page, statusFilter],
    queryFn: async () => { const res = await api.get(`/admin/sales-tax-notices?${queryParams}`); return res.data; },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { await api.put(`/admin/sales-tax-notices/${id}`, { status }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-sales-tax-notices"] }); toast.success("Updated"); setEditOpen(false); },
    onError: () => toast.error("Failed"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const columns: Column<SalesTaxNoticeRecord>[] = [
    { key: "user", header: "User", render: (item) => <span className="font-medium">{item.user.name}</span> },
    { key: "noticeNumber", header: "Notice #" },
    { key: "type", header: "Type" },
    { key: "amount", header: "Amount", render: (item) => item.amount ? formatPKR(item.amount) : "-" },
    { key: "dueDate", header: "Due Date", render: (item) => item.dueDate ? formatDate(item.dueDate) : "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", header: "Received", render: (item) => formatDate(item.createdAt) },
    { key: "actions", header: "", render: (item) => (
      <Button variant="ghost" size="sm" onClick={() => { setDetailItem(item); setEditStatus(item.status); setEditOpen(true); }}><Eye className="h-4 w-4" /></Button>
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Sales Tax Notices" subtitle="Manage sales tax notices received by users" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1.5 min-w-[140px]">
            <Label>Status</Label>
            <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">All</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </CardContent></Card>
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable columns={columns} data={records} keyExtractor={(item) => item.id}
          pagination={pagination} onPageChange={setPage} emptyTitle="No sales tax notices" />
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader><DialogTitle>Update Sales Tax Notice</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <p className="text-sm">Notice: {detailItem.noticeNumber} | User: {detailItem.user.name}</p>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => detailItem && updateMutation.mutate({ id: detailItem.id, status: editStatus })}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
