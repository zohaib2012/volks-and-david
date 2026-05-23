import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AlertCircle, Eye, Search, FileText, Upload, Download } from "lucide-react";
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
import { formatDate, resolveFileUrl } from "@/lib/utils";

interface NtnRecord {
  id: string;
  user: { id: string; name: string; email: string };
  ntnType: string;
  cnic: string;
  fullName: string;
  fatherName: string | null;
  dob: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  phone: string | null;
  email: string | null;
  status: string;
  ntnNumber: string | null;
  fee: number | null;
  documents: { cnicFrontFile?: string; cnicFrontUrl?: string; cnicBackFile?: string; cnicBackUrl?: string; addressFile?: string; addressUrl?: string; paymentId?: string; adminDocUrl?: string; adminDocName?: string } | null;
  createdAt: string;
}

interface EditForm {
  status: string;
  ntnNumber: string;
  fee: number;
}

const statusOptions = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

function DocCard({ label, fileUrl, fileName }: { label: string; fileUrl?: string | null; fileName?: string | null }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {fileUrl ? (
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="group block">
          <div className="relative rounded-lg border border-border/60 overflow-hidden bg-background aspect-[4/3] flex items-center justify-center hover:border-primary/50 transition-colors">
            <img src={fileUrl} alt={label} className="max-h-full max-w-full object-contain p-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-1 group-hover:text-primary transition-colors truncate">{fileName}</p>
        </a>
      ) : (
        <div className="flex items-center gap-2 p-3 rounded-lg border border-border/60">
          <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">{fileName || "Not uploaded"}</span>
        </div>
      )}
    </div>
  );
}

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

  const uploadDocMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/admin/ntn/${id}/upload-doc`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ntn"] });
      toast.success("Document uploaded successfully");
    },
    onError: () => toast.error("Failed to upload document"),
  });

  const docUploadRef = useRef<HTMLInputElement>(null);

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const openDetail = (item: NtnRecord) => {
    setEditForm({ status: item.status, ntnNumber: item.ntnNumber || "", fee: item.fee || 0 });
    setDetailItem(item);
    setDetailOpen(true);
  };

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
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => openDetail(item)} title="View Details">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => openEdit(item)} title="Edit">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </Button>
        </div>
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
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-2xl rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>NTN Registration Details</DialogTitle></DialogHeader>
          {detailItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div><Label className="text-xs text-muted-foreground">Full Name</Label><p className="font-medium">{detailItem.fullName}</p></div>
                <div><Label className="text-xs text-muted-foreground">Father Name</Label><p className="font-medium">{detailItem.fatherName || "-"}</p></div>
                <div><Label className="text-xs text-muted-foreground">CNIC</Label><p className="font-medium">{detailItem.cnic}</p></div>
                <div><Label className="text-xs text-muted-foreground">NTN Type</Label><p className="font-medium">{detailItem.ntnType}</p></div>
                <div><Label className="text-xs text-muted-foreground">Date of Birth</Label><p className="font-medium">{detailItem.dob ? formatDate(detailItem.dob) : "-"}</p></div>
                <div><Label className="text-xs text-muted-foreground">Phone</Label><p className="font-medium">{detailItem.phone || "-"}</p></div>
                <div><Label className="text-xs text-muted-foreground">Email</Label><p className="font-medium">{detailItem.email || detailItem.user?.email || "-"}</p></div>
                <div><Label className="text-xs text-muted-foreground">Status</Label><StatusBadge status={detailItem.status} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="col-span-2"><Label className="text-xs text-muted-foreground">Address</Label><p className="font-medium">{detailItem.address || "-"}</p></div>
                <div><Label className="text-xs text-muted-foreground">City</Label><p className="font-medium">{detailItem.city || "-"}</p></div>
                <div><Label className="text-xs text-muted-foreground">Province</Label><p className="font-medium">{detailItem.province || "-"}</p></div>
              </div>
              {detailItem.documents && (
                <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <Label className="text-xs text-muted-foreground font-semibold">User Uploaded Documents</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <DocCard
                      label="CNIC Front"
                      fileUrl={detailItem.documents.cnicFrontUrl ?? (detailItem.documents as any).cnicUrl}
                      fileName={detailItem.documents.cnicFrontFile ?? (detailItem.documents as any).cnicFile}
                    />
                    <DocCard
                      label="CNIC Back"
                      fileUrl={detailItem.documents.cnicBackUrl}
                      fileName={detailItem.documents.cnicBackFile}
                    />
                    <DocCard
                      label="Address Proof"
                      fileUrl={detailItem.documents.addressUrl}
                      fileName={detailItem.documents.addressFile}
                    />
                  </div>
                </div>
              )}

              {/* Admin Document Upload/View */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Admin Document
                </h4>
                {detailItem.documents?.adminDocUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <a href={resolveFileUrl(detailItem.documents.adminDocUrl)} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors">
                        {detailItem.documents.adminDocName || "Download Document"}
                      </a>
                    </div>
                    <a href={resolveFileUrl(detailItem.documents.adminDocUrl)} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" /> View
                      </Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No document uploaded yet</p>
                )}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    ref={docUploadRef}
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && detailItem) {
                        uploadDocMutation.mutate({ id: detailItem.id, file });
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => docUploadRef.current?.click()}
                    disabled={uploadDocMutation.isPending}
                  >
                    <Upload className="h-4 w-4 mr-1" /> Upload Document
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-semibold mb-3">Update Registration</h4>
                <div className="space-y-4">
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
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
