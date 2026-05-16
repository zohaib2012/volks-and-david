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

interface NtnRecord {
  id: string;
  user: { id: string; name: string; email: string };
  ntnType: string;
  cnic: string;
  fullName: string;
  status: string;
  ntnNumber: string | null;
  fee: number | null;
  createdAt: string;
}

interface EditForm {
  status: string;
  ntnNumber: string;
  fee: number;
}

const statusOptions = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

export default function NTNManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const limit = 20;

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<NtnRecord | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({ status: "", ntnNumber: "", fee: 0 });

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) queryParams.set("search", search);
  if (statusFilter) queryParams.set("status", statusFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-ntn", page, search, statusFilter],
    queryFn: async () => {
      const res = await api.get(`/admin/ntn?${queryParams}`);
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & EditForm) => {
      await api.put(`/admin/ntn/${id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ntn"] });
      toast.success("NTN registration updated");
      setEditOpen(false);
    },
    onError: () => toast.error("Failed to update"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const openEdit = (item: NtnRecord) => {
    setEditForm({ status: item.status, ntnNumber: item.ntnNumber || "", fee: item.fee || 0 });
    setDetailItem(item);
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!detailItem) return;
    updateMutation.mutate({ id: detailItem.id, ...editForm });
  };

  const columns: Column<NtnRecord>[] = [
    { key: "fullName", header: "Name", render: (item) => <span className="font-medium">{item.fullName}</span> },
    { key: "cnic", header: "CNIC" },
    { key: "ntnType", header: "Type" },
    { key: "ntnNumber", header: "NTN #", render: (item) => item.ntnNumber || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    {
      key: "actions", header: "Actions",
      render: (item) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return (
    <EmptyState icon={<AlertCircle className="h-12 w-12 text-destructive" />} title="Failed to load" action={{ label: "Retry", onClick: () => refetch() }} />
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="NTN Registrations" subtitle="Manage NTN registration applications" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name, CNIC, or NTN..." className="pl-9 rounded-lg" value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
          </div>
          <div className="space-y-1.5 min-w-[140px]">
            <Label>Status</Label>
            <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
              <option value="">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <ExportButton
              data={(records as NtnRecord[]).map((r) => ({
                fullName: r.fullName,
                cnic: r.cnic,
                ntnType: r.ntnType,
                ntnNumber: r.ntnNumber || "-",
                status: r.status,
                date: formatDate(r.createdAt),
              }))}
              filename="ntn-registrations.csv"
              columns={[
                { key: "fullName", label: "Name" },
                { key: "cnic", label: "CNIC" },
                { key: "ntnType", label: "Type" },
                { key: "ntnNumber", label: "NTN #" },
                { key: "status", label: "Status" },
                { key: "date", label: "Date" },
              ]}
            />
          </div>
        </div>
      </CardContent></Card>
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable columns={columns} data={records} keyExtractor={(item) => item.id}
          pagination={pagination} onPageChange={setPage} emptyTitle="No NTN registrations found" />
      </div>
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader><DialogTitle>Update NTN Registration</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">User: {detailItem.fullName} ({detailItem.cnic})</p>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>NTN Number</Label>
                <Input value={editForm.ntnNumber} onChange={(e) => setEditForm(p => ({ ...p, ntnNumber: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Fee (PKR)</Label>
                <Input type="number" value={editForm.fee} onChange={(e) => setEditForm(p => ({ ...p, fee: Number(e.target.value) }))} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
