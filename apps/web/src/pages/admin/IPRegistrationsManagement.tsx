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

interface IpRecord {
  id: string;
  user: { id: string; name: string; email: string };
  type: string;
  formData: any;
  status: string;
  refNumber: string | null;
  fee: number | null;
  createdAt: string;
}

interface EditForm { status: string; refNumber: string; fee: number }

const statusOptions = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
const typeOptions = ["TRADEMARK", "COPYRIGHT", "PATENT"];

const typeLabels: Record<string, string> = { TRADEMARK: "Trademark", COPYRIGHT: "Copyright", PATENT: "Patent" };

export default function IPRegistrationsManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;
  const [detailItem, setDetailItem] = useState<IpRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ status: "", refNumber: "", fee: 0 });

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (typeFilter) queryParams.set("type", typeFilter);
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-ip", page, typeFilter, statusFilter],
    queryFn: async () => { const res = await api.get(`/admin/ip-registrations?${queryParams}`); return res.data; },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & EditForm) => { await api.put(`/admin/ip-registrations/${id}`, body); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-ip"] }); toast.success("Updated"); setEditOpen(false); },
    onError: () => toast.error("Failed"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const getTitle = (r: IpRecord) => r.formData?.patentTitle || r.formData?.brandName || r.formData?.workTitle || "-";

  const columns: Column<IpRecord>[] = [
    { key: "type", header: "Type", render: (item) => typeLabels[item.type] || item.type },
    { key: "title", header: "Title", render: (item) => <span className="max-w-[200px] truncate block">{getTitle(item)}</span> },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "refNumber", header: "Ref #", render: (item) => <span className="font-mono text-xs">{item.refNumber || "-"}</span> },
    { key: "fee", header: "Fee", render: (item) => item.fee ? formatPKR(item.fee) : "-" },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    { key: "actions", header: "", render: (item) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => { setDetailItem(item); setViewOpen(true); }}><Eye className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" onClick={() => { setEditForm({ status: item.status, refNumber: item.refNumber || "", fee: item.fee || 0 }); setDetailItem(item); setEditOpen(true); }}>Edit</Button>
      </div>
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="IP Registrations" subtitle="Manage Trademark, Copyright & Patent applications" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1.5 min-w-[140px]">
            <Label>Type</Label>
            <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
              <option value="">All Types</option>
              {typeOptions.map(t => <option key={t} value={t}>{typeLabels[t]}</option>)}
            </select>
          </div>
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
          pagination={pagination} onPageChange={setPage} emptyTitle="No IP registrations" />
      </div>
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader><DialogTitle>{detailItem ? typeLabels[detailItem.type] + " Details" : ""}</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type:</span> {typeLabels[detailItem.type]}</div>
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={detailItem.status} /></div>
                <div><span className="text-muted-foreground">Ref #:</span> {detailItem.refNumber || "-"}</div>
                <div><span className="text-muted-foreground">Fee:</span> {detailItem.fee ? formatPKR(detailItem.fee) : "-"}</div>
              </div>
              {detailItem.formData && (
                <div className="border-t border-border pt-3">
                  <h4 className="text-sm font-semibold mb-2">Form Data</h4>
                  <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">{JSON.stringify(detailItem.formData, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter><Button onClick={() => setViewOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader><DialogTitle>Update IP Registration</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <p className="text-sm">{typeLabels[detailItem.type]}: {getTitle(detailItem)}</p>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5"><Label>Ref Number</Label>
                <Input value={editForm.refNumber} onChange={(e) => setEditForm(p => ({ ...p, refNumber: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>Fee</Label>
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
