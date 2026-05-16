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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

interface WithholdingRecord {
  id: string;
  user: { id: string; name: string; email: string };
  taxYear: number;
  statementType: string | null;
  source: string | null;
  totalDeducted: number | null;
  status: string;
  createdAt: string;
}

const statusOptions = ["PENDING", "VERIFIED", "FILED", "REJECTED"];

export default function WithholdingTaxManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;
  const [editOpen, setEditOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<WithholdingRecord | null>(null);
  const [editForm, setEditForm] = useState({ status: "", certificate: "" });

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-withholding", page, statusFilter],
    queryFn: async () => { const res = await api.get(`/admin/withholding-tax?${queryParams}`); return res.data; },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string; status: string; certificate: string }) => { await api.put(`/admin/withholding-tax/${id}`, body); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-withholding"] }); toast.success("Updated"); setEditOpen(false); },
    onError: () => toast.error("Failed"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const columns: Column<WithholdingRecord>[] = [
    { key: "user", header: "User", render: (item) => <span className="font-medium">{item.user.name}</span> },
    { key: "taxYear", header: "Year", render: (item) => item.taxYear },
    { key: "statementType", header: "Type", render: (item) => item.statementType || "-" },
    { key: "source", header: "Source", render: (item) => item.source || "-" },
    { key: "totalDeducted", header: "Amount", render: (item) => item.totalDeducted ? formatPKR(item.totalDeducted) : "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    { key: "actions", header: "", render: (item) => (
      <Button variant="ghost" size="sm" onClick={() => { setDetailItem(item); setEditForm({ status: item.status, certificate: "" }); setEditOpen(true); }}><Eye className="h-4 w-4" /></Button>
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Withholding Tax" subtitle="Manage withholding tax statements" />
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
          pagination={pagination} onPageChange={setPage} emptyTitle="No withholding tax records" />
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader><DialogTitle>Update Withholding Tax</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <p className="text-sm">{detailItem.user.name} - FY {detailItem.taxYear}</p>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Certificate URL</Label>
                <Input value={editForm.certificate} onChange={(e) => setEditForm(p => ({ ...p, certificate: e.target.value }))} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={() => detailItem && updateMutation.mutate({ id: detailItem.id, ...editForm })}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
