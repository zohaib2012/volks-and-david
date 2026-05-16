import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AlertCircle, Eye, Search } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ExportButton } from "@/components/shared/ExportButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

interface GstRecord {
  id: string;
  user: { id: string; name: string; email: string };
  businessName: string;
  ntnNumber: string | null;
  strn: string | null;
  status: string;
  fee: number | null;
  createdAt: string;
}

interface EditForm { status: string; strn: string; fee: number }

const statusOptions = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function GSTManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;
  const [detailItem, setDetailItem] = useState<GstRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ status: "", strn: "", fee: 0 });

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) queryParams.set("search", search);
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-gst", page, search, statusFilter],
    queryFn: async () => { const res = await api.get(`/admin/gst?${queryParams}`); return res.data; },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & EditForm) => { await api.put(`/admin/gst/${id}`, body); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-gst"] }); toast.success("Updated"); setEditOpen(false); },
    onError: () => toast.error("Failed to update"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const openEdit = (item: GstRecord) => {
    setEditForm({ status: item.status, strn: item.strn || "", fee: item.fee || 0 });
    setDetailItem(item);
    setEditOpen(true);
  };

  const columns: Column<GstRecord>[] = [
    { key: "businessName", header: "Business", render: (item) => <span className="font-medium">{item.businessName}</span> },
    { key: "ntnNumber", header: "NTN", render: (item) => item.ntnNumber || "-" },
    { key: "strn", header: "STRN", render: (item) => item.strn || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    { key: "actions", header: "", render: (item) => (
      <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Eye className="h-4 w-4" /></Button>
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle className="h-12 w-12 text-destructive" />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="GST Registrations" subtitle="Manage GST/STRN registration applications" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" />
            <Input placeholder="Search business, NTN, STRN..." className="pl-9 rounded-lg" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="space-y-1.5 min-w-[140px]">
            <Label>Status</Label>
            <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">All</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <ExportButton
              data={(records as GstRecord[]).map((r) => ({
                businessName: r.businessName,
                ntnNumber: r.ntnNumber || "-",
                strn: r.strn || "-",
                status: r.status,
                date: formatDate(r.createdAt),
              }))}
              filename="gst-registrations.csv"
              columns={[
                { key: "businessName", label: "Business" },
                { key: "ntnNumber", label: "NTN" },
                { key: "strn", label: "STRN" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
              ]}
            />
          </div>
        </div>
      </CardContent></Card>
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable columns={columns} data={records} keyExtractor={(item) => item.id}
          pagination={pagination} onPageChange={setPage} emptyTitle="No GST registrations" />
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader><DialogTitle>Update GST Registration</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Business: {detailItem.businessName}</p>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>STRN Number</Label>
                <Input value={editForm.strn} onChange={(e) => setEditForm(p => ({ ...p, strn: e.target.value }))} /></div>
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
