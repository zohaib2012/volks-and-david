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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

interface UsaRecord {
  id: string;
  user: { id: string; name: string; email: string };
  serviceType: string;
  companyName: string | null;
  state: string | null;
  status: string;
  ein: string | null;
  itin: string | null;
  llcNumber: string | null;
  notes: string | null;
  createdAt: string;
}

const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED", "REJECTED"];

export default function USAServicesManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;
  const [editOpen, setEditOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<UsaRecord | null>(null);
  const [editForm, setEditForm] = useState({ status: "", ein: "", itin: "", llcNumber: "", notes: "" });

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-usa", page, statusFilter],
    queryFn: async () => { const res = await api.get(`/admin/usa-services?${queryParams}`); return res.data; },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & typeof editForm) => { await api.put(`/admin/usa-services/${id}`, body); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-usa"] }); toast.success("Updated"); setEditOpen(false); },
    onError: () => toast.error("Failed"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const columns: Column<UsaRecord>[] = [
    { key: "user", header: "User", render: (item) => <span className="font-medium">{item.user.name}</span> },
    { key: "serviceType", header: "Service" },
    { key: "companyName", header: "Company", render: (item) => item.companyName || "-" },
    { key: "state", header: "State", render: (item) => item.state || "-" },
    { key: "ein", header: "EIN", render: (item) => item.ein || "-" },
    { key: "itin", header: "ITIN", render: (item) => item.itin || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    { key: "actions", header: "", render: (item) => (
      <Button variant="ghost" size="sm" onClick={() => { setDetailItem(item); setEditForm({ status: item.status, ein: item.ein || "", itin: item.itin || "", llcNumber: item.llcNumber || "", notes: item.notes || "" }); setEditOpen(true); }}><Eye className="h-4 w-4" /></Button>
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="USA Services" subtitle="Manage EIN, ITIN, LLC, and US bank account requests" />
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
          pagination={pagination} onPageChange={setPage} emptyTitle="No USA service requests" />
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader><DialogTitle>Update USA Service</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <p className="text-sm">{detailItem.serviceType} - {detailItem.user.name}</p>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>EIN</Label>
                  <Input value={editForm.ein} onChange={(e) => setEditForm(p => ({ ...p, ein: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>ITIN</Label>
                  <Input value={editForm.itin} onChange={(e) => setEditForm(p => ({ ...p, itin: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label>LLC Number</Label>
                  <Input value={editForm.llcNumber} onChange={(e) => setEditForm(p => ({ ...p, llcNumber: e.target.value }))} /></div>
              </div>
              <div className="space-y-1.5"><Label>Notes</Label>
                <Textarea value={editForm.notes} onChange={(e) => setEditForm(p => ({ ...p, notes: e.target.value }))} /></div>
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
