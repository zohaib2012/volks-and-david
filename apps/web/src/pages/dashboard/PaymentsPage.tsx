import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Download,
  Filter,
  AlertCircle,
  Wallet,
  Clock,
  ArrowLeftRight,
  CreditCard,
  FileSpreadsheet,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPKR, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  paymentId: string;
  serviceType: string;
  amount: number;
  status: string;
  paymentMethod: string;
  date: string;
  description: string;
  receiptUrl?: string;
}

const serviceTypes = [
  "Tax Filing",
  "Consultation",
  "NTN Registration",
  "GST Registration",
  "Tax Planning",
  "Other",
];

const paymentMethods = ["JazzCash", "EasyPaisa", "Card", "Bank Transfer"];
const statuses = ["COMPLETED", "PENDING", "FAILED", "REFUNDED"];

const methodIcons: Record<string, string> = {
  JazzCash: "JC",
  EasyPaisa: "EP",
  Card: "CC",
  "Bank Transfer": "BT",
};

export default function PaymentsPage() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    serviceType: "",
    status: "",
    paymentMethod: "",
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["payments", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      if (filters.serviceType) params.set("serviceType", filters.serviceType);
      if (filters.status) params.set("status", filters.status);
      if (filters.paymentMethod)
        params.set("paymentMethod", filters.paymentMethod);
      const res = await api.get(`/payments?${params}`);
      return res.data;
    },
  });

  const payments: Payment[] = data?.data || [];

  const totalPaid = payments
    .filter(p => p.status === "COMPLETED" || p.status === "SUCCESS")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pending = payments
    .filter(p => p.status === "PENDING")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const refunded = payments
    .filter(p => p.status === "REFUNDED")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const handleExportCSV = useCallback(() => {
    if (payments.length === 0) {
      toast("No payments to export", { icon: "ℹ️" });
      return;
    }

    const headers = ["Payment ID", "Date", "Service Type", "Amount", "Method", "Status", "Description"];
    const rows = payments.map((p) => [
      p.paymentId,
      new Date(p.date).toLocaleDateString(),
      p.serviceType,
      p.amount.toString(),
      p.paymentMethod,
      p.status,
      `"${(p.description || "").replace(/"/g, '""')}"`,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payments-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Payments exported to CSV");
  }, [payments]);

  const handleDownloadReceipt = (payment: Payment) => {
    if (payment.receiptUrl) {
      const a = document.createElement("a");
      a.href = payment.receiptUrl;
      a.download = `receipt-${payment.paymentId}.pdf`;
      a.target = "_blank";
      a.click();
    } else {
      toast("Receipt not available for this payment", { icon: "ℹ️" });
    }
  };

  const columns: Column<Payment>[] = [
    {
      key: "paymentId",
      header: "Payment ID",
      render: (item) => (
        <span className="font-mono text-sm">{item.paymentId}</span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (item) => formatDate(item.date),
      sortable: true,
    },
    { key: "serviceType", header: "Service" },
    {
      key: "amount",
      header: "Amount",
      render: (item) => (
        <span className="font-medium">{formatPKR(item.amount)}</span>
      ),
      sortable: true,
    },
    {
      key: "paymentMethod",
      header: "Method",
      render: (item) => (
        <Badge variant="outline" className="font-mono">
          {methodIcons[item.paymentMethod] || item.paymentMethod}
        </Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownloadReceipt(item)}
          disabled={item.status !== "COMPLETED"}
        >
          <Download className="h-4 w-4" />
        </Button>
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Payments"
        subtitle="View and manage all your payment transactions"
        action={
          <Button variant="outline" onClick={handleExportCSV}>
            <FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <StatsCard
          icon={<Wallet className="h-6 w-6" />}
          label="Total Paid"
          value={formatPKR(totalPaid)}
          variant="success"
        />
        <StatsCard
          icon={<Clock className="h-6 w-6" />}
          label="Pending"
          value={formatPKR(pending)}
          variant="warning"
        />
        <StatsCard
          icon={<ArrowLeftRight className="h-6 w-6" />}
          label="Refunded"
          value={formatPKR(refunded)}
          variant="default"
        />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter Payments</span>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1.5 min-w-[140px]">
              <Label>From Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, startDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5 min-w-[140px]">
              <Label>To Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, endDate: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5 min-w-[160px]">
              <Label>Service Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.serviceType}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, serviceType: e.target.value }))
                }
              >
                <option value="">All Services</option>
                {serviceTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 min-w-[140px]">
              <Label>Status</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.status}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, status: e.target.value }))
                }
              >
                <option value="">All Status</option>
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5 min-w-[160px]">
              <Label>Payment Method</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filters.paymentMethod}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, paymentMethod: e.target.value }))
                }
              >
                <option value="">All Methods</option>
                {paymentMethods.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(item) => item.id}
        emptyTitle="No payments found"
        emptyDescription="Your payment history will appear here."
      />
    </motion.div>
  );
}
