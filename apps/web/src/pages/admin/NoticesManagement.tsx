import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  AlertCircle,
  Filter,
  Eye,
  FileWarning,
  Receipt,
  Calendar,
  DollarSign,
  User,
  Hash,
  Clock,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

interface Notice {
  id: string;
  userName: string;
  userId: string;
  type: "INCOME_TAX" | "SALES_TAX";
  noticeNumber: string;
  issueDate?: string;
  dueDate?: string;
  amount?: number;
  status: string;
  document?: string;
  response?: string;
  consultantId?: string;
  assignedTo?: string | null;
  urgency: "HIGH" | "MEDIUM" | "LOW";
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Consultant {
  id: string;
  name: string;
}

const urgencyColors: Record<string, "destructive" | "warning" | "secondary"> = {
  HIGH: "destructive",
  MEDIUM: "warning",
  LOW: "secondary",
};

export default function NoticesManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ type: "", status: "", urgency: "" });
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailNotice, setDetailNotice] = useState<Notice | null>(null);

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", "20");
  if (filters.type) queryParams.set("type", filters.type);
  if (filters.status) queryParams.set("status", filters.status);
  if (filters.urgency) queryParams.set("urgency", filters.urgency);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-notices", page, filters],
    queryFn: async () => {
      const res = await api.get(`/admin/notices?${queryParams}`);
      return {
        data: (res.data.data || []).map((n: Record<string, unknown>) => ({
          ...n,
          userName: (n.user as Record<string, unknown>)?.name || "Unknown",
          assignedTo:
            (n.consultant as Record<string, unknown>)?.name || null,
        })) as Notice[],
        pagination: res.data.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
        },
      };
    },
  });

  const notices = data?.data ?? [];
  const pagination = data?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  };

  const { data: consultantsData } = useQuery({
    queryKey: ["admin-consultants"],
    queryFn: async () => {
      const res = await api.get("/admin/consultants?limit=100");
      return (res.data.data || []) as Consultant[];
    },
  });
  const consultants: Consultant[] = consultantsData ?? [];

  const assignMutation = useMutation({
    mutationFn: async ({
      id,
      consultantId,
    }: {
      id: string;
      consultantId: string;
    }) => {
      await api.put(`/admin/notices/${id}/assign`, { consultantId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast.success("Notice assigned successfully");
    },
    onError: () => toast.error("Failed to assign notice"),
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/admin/notices/${id}`, { status: "RESOLVED" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast.success("Notice resolved successfully");
    },
    onError: () => toast.error("Failed to resolve notice"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...body
    }: { id: string } & Record<string, unknown>) => {
      await api.put(`/admin/notices/${id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notices"] });
      toast.success("Notice updated successfully");
    },
    onError: () => toast.error("Failed to update notice"),
  });

  const handleAssign = (noticeId: string, consultantId: string) => {
    assignMutation.mutate({ id: noticeId, consultantId });
  };

  const handleResolve = (noticeId: string) => {
    resolveMutation.mutate(noticeId);
  };

  const openDetail = (notice: Notice) => {
    setDetailNotice(notice);
    setDetailOpen(true);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((p) => ({ ...p, [key]: value }));
    setPage(1);
  };

  const columns: Column<Notice>[] = [
    {
      key: "userName",
      header: "User",
      render: (item) => <span className="font-medium">{item.userName}</span>,
    },
    {
      key: "type",
      header: "Type",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          {item.type === "INCOME_TAX" ? (
            <FileWarning className="h-4 w-4 text-blue-500" />
          ) : (
            <Receipt className="h-4 w-4 text-purple-500" />
          )}
          <span>
            {item.type === "INCOME_TAX" ? "Income Tax" : "Sales Tax"}
          </span>
        </div>
      ),
    },
    {
      key: "noticeNumber",
      header: "Notice #",
      render: (item) => (
        <span className="font-mono text-xs">{item.noticeNumber}</span>
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (item) => {
        if (!item.dueDate)
          return <span className="text-muted-foreground">—</span>;
        const isOverdue =
          new Date(item.dueDate) < new Date() && item.status !== "RESOLVED";
        return (
          <span className={isOverdue ? "text-destructive font-medium" : ""}>
            {formatDate(item.dueDate)}
            {isOverdue && " (Overdue)"}
          </span>
        );
      },
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className="font-medium">
          {item.amount != null ? formatPKR(item.amount) : "—"}
        </span>
      ),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "urgency",
      header: "Urgency",
      render: (item) => (
        <Badge variant={urgencyColors[item.urgency] || "secondary"}>
          {item.urgency}
        </Badge>
      ),
    },
    {
      key: "assignedTo",
      header: "Assigned",
      render: (item) => (
        <span className="text-muted-foreground">
          {item.assignedTo || (
            <span className="text-amber-500 text-xs">Unassigned</span>
          )}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => openDetail(item)}>
            <Eye className="h-4 w-4" />
          </Button>
          <select
            className="h-8 w-28 rounded-md border border-input bg-background px-2 text-xs"
            value={item.consultantId || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val) handleAssign(item.id, val);
            }}
          >
            <option value="">Assign</option>
            {consultants.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {item.status !== "RESOLVED" ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleResolve(item.id)}
            >
              Resolve
            </Button>
          ) : (
            <span className="text-xs text-emerald-600 font-medium px-2">
              Resolved
            </span>
          )}
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
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Notices Management"
        subtitle="Manage income tax and sales tax notices"
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter Notices</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1.5 min-w-[150px]">
              <Label>Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                <option value="INCOME_TAX">Income Tax</option>
                <option value="SALES_TAX">Sales Tax</option>
              </select>
            </div>
            <div className="space-y-1.5 min-w-[150px]">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>
            <div className="space-y-1.5 min-w-[140px]">
              <Label>Urgency</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.urgency}
                onChange={(e) => handleFilterChange("urgency", e.target.value)}
              >
                <option value="">All</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable
          columns={columns}
          data={notices}
          keyExtractor={(item) => item.id}
          pagination={pagination}
          onPageChange={setPage}
          emptyTitle="No notices found"
          emptyDescription="Try adjusting your filters."
        />
      </div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>Notice Details</DialogTitle>
          </DialogHeader>
          {detailNotice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Hash className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Notice #</p>
                    <p className="text-sm font-mono font-medium">
                      {detailNotice.noticeNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <FileWarning className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">
                      {detailNotice.type === "INCOME_TAX"
                        ? "Income Tax"
                        : "Sales Tax"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">User</p>
                    <p className="text-sm font-medium">
                      {detailNotice.userName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <DollarSign className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-medium">
                      {detailNotice.amount != null
                        ? formatPKR(detailNotice.amount)
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <StatusBadge status={detailNotice.status} />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Urgency</p>
                    <Badge
                      variant={
                        urgencyColors[detailNotice.urgency] || "secondary"
                      }
                    >
                      {detailNotice.urgency}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="text-sm font-medium">
                      {detailNotice.dueDate
                        ? formatDate(detailNotice.dueDate)
                        : "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Assigned To
                    </p>
                    <p className="text-sm font-medium">
                      {detailNotice.assignedTo || (
                        <span className="text-amber-500">Unassigned</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
