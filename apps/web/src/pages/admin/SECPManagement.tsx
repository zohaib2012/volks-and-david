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

interface SecpRecord {
  id: string;
  user: { id: string; name: string; email: string };
  companyType: string;
  companyNames: any;
  city: string | null;
  paidUpCapital: number | null;
  status: string;
  secpRefNumber: string | null;
  fee: number | null;
  createdAt: string;
}

interface EditForm { status: string; secpRefNumber: string; fee: number }

const statusOptions = ["PENDING", "APPROVED", "REJECTED"];
const companyTypeLabels: Record<string, string> = {
  PRIVATE_LIMITED: "Private Limited", PUBLIC_LIMITED: "Public Limited",
  SMCO: "SMCO", TRUST: "Trust", NPO: "NPO",
};

export default function SECPManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;
  const [detailItem, setDetailItem] = useState<SecpRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ status: "", secpRefNumber: "", fee: 0 });

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-secp", page, statusFilter],
    queryFn: async () => { const res = await api.get(`/admin/secp?${queryParams}`); return res.data; },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & EditForm) => { await api.put(`/admin/secp/${id}`, body); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-secp"] }); toast.success("Updated"); setEditOpen(false); },
    onError: () => toast.error("Failed to update"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const openView = (item: SecpRecord) => {
    setDetailItem(item);
    setViewOpen(true);
  };

  const openEdit = (item: SecpRecord) => {
    setEditForm({ status: item.status, secpRefNumber: item.secpRefNumber || "", fee: item.fee || 0 });
    setDetailItem(item);
    setEditOpen(true);
  };

  const columns: Column<SecpRecord>[] = [
    { key: "companyType", header: "Type", render: (item) => companyTypeLabels[item.companyType] || item.companyType },
    { key: "companyNames", header: "Name", render: (item) => {
      const names = Array.isArray(item.companyNames) ? item.companyNames : [];
      return <span className="max-w-[150px] truncate block">{names[0] || "-"}</span>;
    }},
    { key: "city", header: "City", render: (item) => item.city || "-" },
    { key: "paidUpCapital", header: "Capital", render: (item) => item.paidUpCapital ? formatPKR(item.paidUpCapital) : "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "secpRefNumber", header: "Ref #", render: (item) => <span className="font-mono text-xs">{item.secpRefNumber || "-"}</span> },
    { key: "actions", header: "", render: (item) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => openView(item)}><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
      </div>
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle className="h-12 w-12 text-destructive" />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="SECP / Business Registrations" subtitle="Manage company registration applications" />
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
          pagination={pagination} onPageChange={setPage} emptyTitle="No SECP registrations" />
      </div>
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader><DialogTitle>SECP Registration Details</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type:</span> {companyTypeLabels[detailItem.companyType] || detailItem.companyType}</div>
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={detailItem.status} /></div>
                <div><span className="text-muted-foreground">City:</span> {detailItem.city || "-"}</div>
                <div><span className="text-muted-foreground">Capital:</span> {detailItem.paidUpCapital ? formatPKR(detailItem.paidUpCapital) : "-"}</div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Names:</span>
                  {Array.isArray(detailItem.companyNames) ? detailItem.companyNames.join(", ") : "-"}
                </div>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader><DialogTitle>Update SECP Registration</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{companyTypeLabels[detailItem.companyType] || detailItem.companyType}</p>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>SECP Ref Number</Label>
                <Input value={editForm.secpRefNumber} onChange={(e) => setEditForm(p => ({ ...p, secpRefNumber: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Fee (PKR)</Label>
                <Input type="number" value={editForm.fee} onChange={(e) => setEditForm(p => ({ ...p, fee: Number(e.target.value) }))} /></div>
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
