import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  Undo2,
  Banknote,
  Clock,
  RotateCcw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ExportButton } from "@/components/shared/ExportButton";
import { StatsCard } from "@/components/dashboard/StatsCard";
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
  DialogDescription,
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

type PaymentMethod = "JAZZCASH" | "EASYPAISA" | "CARD" | "BANK_TRANSFER";
type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

interface PaymentUser {
  id: string;
  name: string;
  email: string;
}

interface PaymentFromApi {
  id: string;
  userId: string;
  serviceType: string;
  serviceId: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayRef: string | null;
  createdAt: string;
  user: PaymentUser;
}

interface PaymentRow {
  id: string;
  userName: string;
  userEmail: string;
  service: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayRef: string | null;
  date: string;
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

const METHOD_OPTIONS: PaymentMethod[] = [
  "JAZZCASH",
  "EASYPAISA",
  "CARD",
  "BANK_TRANSFER",
];

const STATUS_OPTIONS: PaymentStatus[] = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
];

const SERVICE_TYPE_OPTIONS = [
  "TAX_FILING",
  "CONSULTATION",
  "REGISTRATION",
  "NTN_REGISTRATION",
  "SALES_TAX",
  "OTHER",
];

const methodLabels: Record<string, string> = {
  JAZZCASH: "JazzCash",
  EASYPAISA: "EasyPaisa",
  CARD: "Card",
  BANK_TRANSFER: "Bank Transfer",
};

function mapPayment(item: PaymentFromApi): PaymentRow {
  return {
    id: item.id,
    userName: item.user.name,
    userEmail: item.user.email,
    service: item.serviceType,
    amount: item.amount,
    method: item.method,
    status: item.status,
    gatewayRef: item.gatewayRef,
    date: item.createdAt,
  };
}

export default function PaymentsManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [methodFilter, setMethodFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [refundDialog, setRefundDialog] = useState<{
    open: boolean;
    payment: PaymentRow | null;
    reason: string;
  }>({ open: false, payment: null, reason: "" });

  const [detailDialog, setDetailDialog] = useState<{
    open: boolean;
    payment: PaymentRow | null;
  }>({ open: false, payment: null });

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "20");
    if (methodFilter) params.set("method", methodFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (serviceTypeFilter) params.set("serviceType", serviceTypeFilter);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    return params.toString();
  }, [page, methodFilter, statusFilter, serviceTypeFilter, dateFrom, dateTo]);

  const {
    data: paymentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-payments", queryParams],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<PaymentFromApi>>(
        `/admin/payments?${queryParams}`
      );
      return res.data;
    },
  });

  const payments = useMemo(
    () => (paymentsData?.data || []).map(mapPayment),
    [paymentsData]
  );
  const pagination = paymentsData?.pagination;

  const totalRevenue = useMemo(
    () =>
      payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  const pendingAmount = useMemo(
    () =>
      payments
        .filter((p) => p.status === "PENDING")
        .reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  const refundedAmount = useMemo(
    () =>
      payments
        .filter((p) => p.status === "REFUNDED")
        .reduce((sum, p) => sum + p.amount, 0),
    [payments]
  );

  const refundMutation = useMutation({
    mutationFn: async ({
      id,
      reason,
    }: {
      id: string;
      reason: string;
    }) => {
      const res = await api.put(`/admin/payments/${id}/refund`, { reason });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      setRefundDialog({ open: false, payment: null, reason: "" });
      toast.success("Payment refunded successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Refund failed");
    },
  });

  const handleRefund = () => {
    if (!refundDialog.payment) return;
    refundMutation.mutate({
      id: refundDialog.payment.id,
      reason: refundDialog.reason,
    });
  };

  const handleRowClick = (item: PaymentRow) => {
    setDetailDialog({ open: true, payment: item });
  };

  const columns: Column<PaymentRow>[] = [
    {
      key: "user",
      header: "User",
      render: (item) => (
        <div>
          <p className="font-medium">{item.userName}</p>
          <p className="text-xs text-muted-foreground">{item.userEmail}</p>
        </div>
      ),
    },
    {
      key: "service",
      header: "Service",
      render: (item) => (
        <span className="capitalize">
          {item.service.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className="font-medium">{formatPKR(item.amount)}</span>
      ),
      sortable: true,
    },
    {
      key: "method",
      header: "Method",
      render: (item) => (
        <span>{methodLabels[item.method] || item.method}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "date",
      header: "Date",
      render: (item) => <span>{formatDate(item.date)}</span>,
      sortable: true,
    },
    {
      key: "gatewayRef",
      header: "Gateway Ref",
      render: (item) =>
        item.gatewayRef ? (
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
            {item.gatewayRef}
          </code>
        ) : (
          <span className="text-muted-foreground">&mdash;</span>
        ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={item.status !== "COMPLETED"}
            onClick={(e) => {
              e.stopPropagation();
              setRefundDialog({ open: true, payment: item, reason: "" });
            }}
            title={
              item.status === "COMPLETED"
                ? "Refund payment"
                : "Only completed payments can be refunded"
            }
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load payments"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title="Payments Management"
        subtitle="View and manage all payment transactions"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard
          icon={<Banknote className="h-6 w-6" />}
          label="Total Revenue"
          value={formatPKR(totalRevenue)}
          variant="success"
        />
        <StatsCard
          icon={<Clock className="h-6 w-6" />}
          label="Pending Amount"
          value={formatPKR(pendingAmount)}
          variant="warning"
        />
        <StatsCard
          icon={<RotateCcw className="h-6 w-6" />}
          label="Refunded"
          value={formatPKR(refundedAmount)}
          variant="danger"
        />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1.5 min-w-[150px]">
              <Label>Method</Label>
              <Select
                value={methodFilter || "all"}
                onValueChange={(val) => {
                  setMethodFilter(val === "all" ? "" : val);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  {METHOD_OPTIONS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {methodLabels[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-[150px]">
              <Label>Status</Label>
              <Select
                value={statusFilter || "all"}
                onValueChange={(val) => {
                  setStatusFilter(val === "all" ? "" : val);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-[150px]">
              <Label>Service Type</Label>
              <Select
                value={serviceTypeFilter || "all"}
                onValueChange={(val) => {
                  setServiceTypeFilter(val === "all" ? "" : val);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {SERVICE_TYPE_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 min-w-[160px]">
              <Label>From</Label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="space-y-1.5 min-w-[160px]">
              <Label>To</Label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex items-end">
              <ExportButton
                data={payments.map((p) => ({
                  userName: p.userName,
                  userEmail: p.userEmail,
                  service: p.service.replace(/_/g, " "),
                  amount: formatPKR(p.amount),
                  method: methodLabels[p.method] || p.method,
                  status: p.status,
                  date: formatDate(p.date),
                  gatewayRef: p.gatewayRef || "-",
                }))}
                filename="payments.csv"
                columns={[
                  { key: "userName", label: "User" },
                  { key: "userEmail", label: "Email" },
                  { key: "service", label: "Service" },
                  { key: "amount", label: "Amount" },
                  { key: "method", label: "Method" },
                  { key: "status", label: "Status" },
                  { key: "date", label: "Date" },
                  { key: "gatewayRef", label: "Gateway Ref" },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={payments}
        pagination={
          pagination && pagination.totalPages > 1
            ? pagination
            : undefined
        }
        onPageChange={setPage}
        onRowClick={handleRowClick}
        keyExtractor={(item) => item.id}
        emptyTitle="No payments found"
        emptyDescription="Try adjusting your search or filters."
      />

      <Dialog
        open={refundDialog.open}
        onOpenChange={(o) =>
          setRefundDialog((p) => ({ ...p, open: o }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refund Payment</DialogTitle>
            <DialogDescription>
              You are about to refund{" "}
              <strong>
                {formatPKR(refundDialog.payment?.amount || 0)}
              </strong>{" "}
              for <strong>{refundDialog.payment?.userName}</strong> (
              {refundDialog.payment?.service?.replace(/_/g, " ")}).
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Reason for Refund</Label>
              <Textarea
                placeholder="Enter the reason for refund..."
                value={refundDialog.reason}
                onChange={(e) =>
                  setRefundDialog((p) => ({
                    ...p,
                    reason: e.target.value,
                  }))
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setRefundDialog({
                  open: false,
                  payment: null,
                  reason: "",
                })
              }
              disabled={refundMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRefund}
              disabled={
                !refundDialog.reason.trim() || refundMutation.isPending
              }
            >
              {refundMutation.isPending && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={detailDialog.open}
        onOpenChange={(o) =>
          setDetailDialog((p) => ({ ...p, open: o }))
        }
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
          </DialogHeader>
          {detailDialog.payment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment ID</Label>
                  <p className="text-sm font-mono">
                    {detailDialog.payment.id}
                  </p>
                </div>
                <div>
                  <Label>User</Label>
                  <p className="text-sm font-medium">
                    {detailDialog.payment.userName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {detailDialog.payment.userEmail}
                  </p>
                </div>
                <div>
                  <Label>Service</Label>
                  <p className="text-sm font-medium capitalize">
                    {detailDialog.payment.service.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <Label>Amount</Label>
                  <p className="text-sm font-bold">
                    {formatPKR(detailDialog.payment.amount)}
                  </p>
                </div>
                <div>
                  <Label>Method</Label>
                  <p className="text-sm font-medium">
                    {methodLabels[detailDialog.payment.method] ||
                      detailDialog.payment.method}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <StatusBadge status={detailDialog.payment.status} />
                </div>
                <div>
                  <Label>Gateway Reference</Label>
                  <p className="text-sm font-mono">
                    {detailDialog.payment.gatewayRef || (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </p>
                </div>
                <div>
                  <Label>Date</Label>
                  <p className="text-sm font-medium">
                    {formatDate(detailDialog.payment.date)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDetailDialog({ open: false, payment: null })
              }
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
