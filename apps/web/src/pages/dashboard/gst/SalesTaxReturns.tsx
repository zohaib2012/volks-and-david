import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPKR, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface SalesTaxReturn {
  id: string;
  periodMonth: number;
  periodYear: number;
  strn: string;
  totalSales: number;
  taxPayable: number;
  status: string;
  acknowledgementNo?: string;
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const currentYear = new Date().getFullYear();

export default function SalesTaxReturnsPage() {
  const [filters, setFilters] = useState({
    periodYear: String(currentYear),
    periodMonth: "",
    status: "",
  });
  const [showFile, setShowFile] = useState(false);
  const [form, setForm] = useState({
    periodYear: String(currentYear),
    periodMonth: String(new Date().getMonth() + 1),
    strn: "",
    totalSales: "",
    taxPayable: "",
  });
  const queryClient = useQueryClient();

  const fileMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/sales-tax-returns", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Sales tax return filed!");
      setShowFile(false);
      setForm({ periodYear: String(currentYear), periodMonth: String(new Date().getMonth() + 1), strn: "", totalSales: "", taxPayable: "" });
      queryClient.invalidateQueries({ queryKey: ["sales-tax-returns"] });
    },
    onError: () => toast.error("Failed to file return"),
  });

  const handleFile = () => {
    if (!form.periodYear || !form.periodMonth) {
      toast.error("Please select year and month");
      return;
    }
    fileMutation.mutate({
      periodYear: Number(form.periodYear),
      periodMonth: Number(form.periodMonth),
      strn: form.strn || null,
      totalSales: form.totalSales ? Number(form.totalSales) : null,
      taxPayable: form.taxPayable ? Number(form.taxPayable) : null,
    });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["sales-tax-returns", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.periodYear) params.set("periodYear", filters.periodYear);
      if (filters.periodMonth) params.set("periodMonth", filters.periodMonth);
      if (filters.status) params.set("status", filters.status);
      const res = await api.get(`/sales-tax-returns?${params}`);
      return res.data;
    },
  });

  const columns: Column<SalesTaxReturn>[] = [
    {
      key: "periodMonth",
      header: "Period",
      render: (item) => `${months[item.periodMonth - 1] || item.periodMonth} ${item.periodYear}`,
    },
    { key: "strn", header: "STRN" },
    {
      key: "totalSales",
      header: "Total Sales",
      render: (item) => formatPKR(item.totalSales),
    },
    {
      key: "taxPayable",
      header: "Tax Payable",
      render: (item) => formatPKR(item.taxPayable),
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={item.status} />
          {item.acknowledgementNo && (
            <span className="text-xs text-muted-foreground">
              #{item.acknowledgementNo}
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
        title="Failed to load sales tax returns"
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Monthly Sales Tax Returns"
        subtitle="File and manage your monthly sales tax returns"
        action={
          <Button onClick={() => setShowFile(true)}>
            <Plus className="mr-2 h-4 w-4" /> File New Return
          </Button>
        }
      />

      <Card className="mb-6 border-l-4 border-l-amber-500 bg-amber-500/5">
        <CardContent className="py-3">
          <p className="text-sm font-medium">
            Monthly deadline: 15th of each month
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="space-y-1.5">
          <Label>Year</Label>
          <select
            className="flex h-10 w-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.periodYear}
            onChange={(e) =>
              setFilters((p) => ({ ...p, periodYear: e.target.value }))
            }
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Month</Label>
          <select
            className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.periodMonth}
            onChange={(e) =>
              setFilters((p) => ({ ...p, periodMonth: e.target.value }))
            }
          >
            <option value="">All Months</option>
            {months.map((m, i) => (
              <option key={m} value={String(i + 1)}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            className="flex h-10 w-[130px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ACCEPTED">Accepted</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        keyExtractor={(item) => item.id}
        emptyTitle="No sales tax returns yet"
        emptyDescription="Start by filing your first monthly return."
      />

      <Dialog open={showFile} onOpenChange={setShowFile}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>File New Return</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Year *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.periodYear}
                  onChange={(e) => setForm((p) => ({ ...p, periodYear: e.target.value }))}
                >
                  {[2024, 2025, 2026].map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label>Month *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.periodMonth}
                  onChange={(e) => setForm((p) => ({ ...p, periodMonth: e.target.value }))}
                >
                  {months.map((m, i) => (
                    <option key={m} value={String(i + 1)}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>STRN</Label>
              <Input
                placeholder="Sales Tax Registration Number"
                value={form.strn}
                onChange={(e) => setForm((p) => ({ ...p, strn: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Total Sales (PKR)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.totalSales}
                  onChange={(e) => setForm((p) => ({ ...p, totalSales: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tax Payable (PKR)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.taxPayable}
                  onChange={(e) => setForm((p) => ({ ...p, taxPayable: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowFile(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleFile} disabled={fileMutation.isPending}>
                {fileMutation.isPending ? "Filing..." : "File Return"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
