import { useState, useRef } from "react";
import {
  Search,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  UserCheck,
  Loader2,
  ShieldCheck,
  FileImage,
  FileText,
  Upload,
  Download,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ExportButton } from "@/components/shared/ExportButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

type TaxReturnStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "SUBMITTED"
  | "ACCEPTED"
  | "REJECTED"
  | "REQUIRES_INFO";

interface TaxReturnUser {
  id: string;
  name: string;
  email: string;
}

interface TaxReturnAssignedUser {
  id: string;
  name: string;
}

interface TaxReturn {
  id: string;
  userId: string;
  taxYear: number;
  returnType: string;
  status: TaxReturnStatus;
  income: Record<string, unknown> | null;
  totalIncome: number | null;
  user: TaxReturnUser;
  assignedTo: string | null;
  assignedToUser: TaxReturnAssignedUser | null;
  createdAt: string;
  submittedAt: string | null;
  hasNtn?: boolean | null;
  fbrPassword?: string | null;
  fbrPin?: string | null;
  cnicFrontUrl?: string | null;
  cnicBackUrl?: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationInfo;
}

interface Consultant {
  id: string;
  name: string;
  email?: string;
}

const STATUS_OPTIONS: TaxReturnStatus[] = [
  "DRAFT",
  "IN_REVIEW",
  "SUBMITTED",
  "ACCEPTED",
  "REJECTED",
  "REQUIRES_INFO",
];

export default function ReturnsManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [review, setReview] = useState<{
    open: boolean;
    item: TaxReturn | null;
    notes: string;
  }>({ open: false, item: null, notes: "" });
  const [bulkAssign, setBulkAssign] = useState<{
    open: boolean;
    consultantId: string;
  }>({ open: false, consultantId: "" });

  const docUploadRef = useRef<HTMLInputElement>(null);

  const uploadDocMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/admin/tax-returns/${id}/upload-doc`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tax-returns"] });
      toast.success("Document uploaded successfully");
    },
    onError: () => toast.error("Failed to upload document"),
  });

  const {
    data: returnsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-tax-returns", page, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "20");
      if (statusFilter) params.set("status", statusFilter);
      const res = await api.get<PaginatedResponse<TaxReturn>>(
        `/admin/tax-returns?${params}`
      );
      return res.data;
    },
  });

  const { data: consultantsData } = useQuery({
    queryKey: ["admin-consultants"],
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Consultant[] }>(
        "/admin/consultants?limit=100"
      );
      return res.data.data;
    },
  });

  const returns = returnsData?.data || [];
  const pagination = returnsData?.pagination;
  const consultants = consultantsData || [];

  const filtered = returns.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.user.name.toLowerCase().includes(q) ||
      r.user.email.toLowerCase().includes(q) ||
      String(r.taxYear).includes(q)
    );
  });

  const reviewMutation = useMutation({
    mutationFn: async ({
      id,
      action,
      notes,
    }: {
      id: string;
      action: "approve" | "reject" | "request_info";
      notes: string;
    }) => {
      const res = await api.put(`/admin/tax-returns/${id}/review`, {
        action,
        notes,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tax-returns"] });
      setReview({ open: false, item: null, notes: "" });
      toast.success("Review action completed");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Review action failed");
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({
      id,
      consultantId,
    }: {
      id: string;
      consultantId: string;
    }) => {
      const res = await api.put(`/admin/tax-returns/${id}`, {
        assignedTo: consultantId,
      });
      return res.data;
    },
    onMutate: ({ id }) => setAssigningId(id),
    onSettled: () => setAssigningId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tax-returns"] });
      toast.success("Return assigned successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Assignment failed");
    },
  });

  const bulkAssignMutation = useMutation({
    mutationFn: async ({
      returnIds,
      consultantId,
    }: {
      returnIds: string[];
      consultantId: string;
    }) => {
      const res = await api.put("/admin/tax-returns/bulk-assign", {
        returnIds,
        consultantId,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-tax-returns"] });
      setBulkAssign({ open: false, consultantId: "" });
      setSelectedIds(new Set());
      toast.success("Returns assigned successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Bulk assign failed");
    },
  });

  const handleReviewAction = (
    action: "approve" | "reject" | "request_info"
  ) => {
    if (!review.item) return;
    reviewMutation.mutate({ id: review.item.id, action, notes: review.notes });
  };

  const handleAssign = (item: TaxReturn, consultantId: string) => {
    assignMutation.mutate({ id: item.id, consultantId });
  };

  const handleBulkAssign = () => {
    if (!bulkAssign.consultantId || selectedIds.size === 0) return;
    bulkAssignMutation.mutate({
      returnIds: Array.from(selectedIds),
      consultantId: bulkAssign.consultantId,
    });
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((r) => r.id)));
    }
  };

  const getDisplayIncome = (item: TaxReturn): number => {
    if (item.totalIncome != null) return item.totalIncome;
    if (item.income && typeof item.income === "object") {
      const inc = item.income as Record<string, unknown>;
      const val =
        inc.totalIncome ?? inc.amount ?? inc.grossIncome ?? inc.total ?? inc.income;
      return typeof val === "number" ? val : 0;
    }
    return 0;
  };

  const columns: Column<TaxReturn>[] = [
    {
      key: "select",
      header: "Select",
      render: (item) => (
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={selectedIds.has(item.id)}
          onChange={() => toggleSelect(item.id)}
        />
      ),
    },
    {
      key: "user",
      header: "User",
      render: (item) => (
        <div>
          <p className="font-medium">{item.user.name}</p>
          <p className="text-xs text-muted-foreground">{item.user.email}</p>
        </div>
      ),
    },
    {
      key: "taxYear",
      header: "Tax Year",
      render: (item) => <span>{item.taxYear}</span>,
    },
    {
      key: "returnType",
      header: "Type",
      render: (item) => <span>{item.returnType}</span>,
    },
    {
      key: "income",
      header: "Income",
      render: (item) => (
        <span className="font-medium">{formatPKR(getDisplayIncome(item))}</span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (item) =>
        item.submittedAt ? (
          <span>{formatDate(item.submittedAt)}</span>
        ) : (
          <span className="text-muted-foreground">&mdash;</span>
        ),
      sortable: true,
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.assignedToUser?.name || (
            <span className="text-amber-500 text-xs">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReview({ open: true, item, notes: "" })}
          >
            Review
          </Button>
          <Select
            value={item.assignedTo || ""}
            onValueChange={(val) => handleAssign(item, val)}
          >
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Assign" />
            </SelectTrigger>
            <SelectContent>
              {consultants.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {assigningId === item.id ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="h-3 w-3 animate-spin" /> {c.name}
                    </span>
                  ) : (
                    c.name
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load tax returns"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Returns Management"
        subtitle="Review and manage all tax returns"
        action={
          <Button
            variant="outline"
            onClick={() => setBulkAssign({ open: true, consultantId: "" })}
            disabled={selectedIds.size === 0}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Bulk Assign ({selectedIds.size})
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 min-w-[160px]">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <ExportButton
                data={filtered.map((r) => ({
                  user: r.user.name,
                  email: r.user.email,
                  taxYear: r.taxYear,
                  returnType: r.returnType,
                  income: formatPKR(getDisplayIncome(r)),
                  status: r.status,
                  assignedTo: r.assignedToUser?.name || "Unassigned",
                  submittedAt: r.submittedAt ? formatDate(r.submittedAt) : "-",
                }))}
                filename="tax-returns.csv"
                columns={[
                  { key: "user", label: "User" },
                  { key: "email", label: "Email" },
                  { key: "taxYear", label: "Tax Year" },
                  { key: "returnType", label: "Type" },
                  { key: "income", label: "Income" },
                  { key: "status", label: "Status" },
                  { key: "assignedTo", label: "Assigned To" },
                  { key: "submittedAt", label: "Submitted" },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {filtered.length > 0 && (
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
            {selectedIds.size === filtered.length
              ? "Deselect All"
              : "Select All"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {selectedIds.size} of {filtered.length} selected
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={filtered}
        pagination={
          pagination && pagination.totalPages > 1
            ? pagination
            : undefined
        }
        onPageChange={setPage}
        keyExtractor={(item) => item.id}
        emptyTitle="No returns found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Dialog
        open={review.open}
        onOpenChange={(o) => setReview((p) => ({ ...p, open: o }))}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Return &mdash; {review.item?.user.name}</DialogTitle>
          </DialogHeader>
          {review.item && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tax Year</Label>
                  <p className="text-sm font-medium">{review.item.taxYear}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p className="text-sm font-medium">{review.item.returnType}</p>
                </div>
                <div>
                  <Label>Income</Label>
                  <p className="text-sm font-medium">
                    {formatPKR(getDisplayIncome(review.item))}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge status={review.item.status} />
                </div>
              </div>
              {review.item.hasNtn != null && (
                <div className="rounded-lg border border-border p-4 space-y-3">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {review.item.hasNtn ? (
                      <><ShieldCheck className="h-4 w-4 text-primary" /> FBR Credentials</>
                    ) : (
                      <><FileImage className="h-4 w-4 text-primary" /> CNIC Photos</>
                    )}
                  </p>
                  {review.item.hasNtn ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">FBR Password</Label>
                        <p className="font-mono text-sm mt-1 break-all">{review.item.fbrPassword || "—"}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">FBR PIN</Label>
                        <p className="font-mono text-sm mt-1">{review.item.fbrPin || "—"}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {review.item.cnicFrontUrl ? (
                        <div>
                          <Label className="text-xs text-muted-foreground block mb-1">CNIC Front</Label>
                          <a
                            href={`${(import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "")}${review.item.cnicFrontUrl}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={`${(import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "")}${review.item.cnicFrontUrl}`}
                              alt="CNIC Front"
                              className="w-full h-28 object-cover rounded-lg border border-border hover:opacity-80 transition-opacity"
                            />
                          </a>
                        </div>
                      ) : null}
                      {review.item.cnicBackUrl ? (
                        <div>
                          <Label className="text-xs text-muted-foreground block mb-1">CNIC Back</Label>
                          <a
                            href={`${(import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "")}${review.item.cnicBackUrl}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={`${(import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "")}${review.item.cnicBackUrl}`}
                              alt="CNIC Back"
                              className="w-full h-28 object-cover rounded-lg border border-border hover:opacity-80 transition-opacity"
                            />
                          </a>
                        </div>
                      ) : null}
                      {!review.item.cnicFrontUrl && !review.item.cnicBackUrl && (
                        <p className="text-sm text-muted-foreground col-span-2">No CNIC photos uploaded yet.</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Admin Document Upload/View */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Admin Document
                </h4>
                {review.item && (review.item as any).adminDocUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <a href={`${(import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "")}${(review.item as any).adminDocUrl}`} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors">
                        {(review.item as any).adminDocName || "Download Document"}
                      </a>
                    </div>
                    <a href={`${(import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "")}${(review.item as any).adminDocUrl}`} target="_blank" rel="noopener noreferrer">
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
                      if (file && review.item) {
                        uploadDocMutation.mutate({ id: review.item.id, file });
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

              <div className="space-y-1.5">
                <Label>Review Notes</Label>
                <Textarea
                  placeholder="Add notes about this return..."
                  value={review.notes}
                  onChange={(e) =>
                    setReview((p) => ({ ...p, notes: e.target.value }))
                  }
                  rows={4}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  onClick={() => handleReviewAction("approve")}
                  disabled={reviewMutation.isPending}
                >
                  {reviewMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                  )}
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReviewAction("reject")}
                  disabled={reviewMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleReviewAction("request_info")}
                  disabled={reviewMutation.isPending}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Request Info
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={bulkAssign.open}
        onOpenChange={(o) =>
          setBulkAssign((p) => ({ ...p, open: o }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Assign Returns</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Assign to Consultant</Label>
              <Select
                value={bulkAssign.consultantId}
                onValueChange={(val) =>
                  setBulkAssign((p) => ({ ...p, consultantId: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select consultant..." />
                </SelectTrigger>
                <SelectContent>
                  {consultants.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-muted-foreground">
              This will assign {selectedIds.size} selected return
              {selectedIds.size !== 1 ? "s" : ""} to the selected consultant.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setBulkAssign({ open: false, consultantId: "" })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleBulkAssign}
              disabled={
                !bulkAssign.consultantId ||
                selectedIds.size === 0 ||
                bulkAssignMutation.isPending
              }
            >
              {bulkAssignMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Assign All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
