import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

interface ExpenseRecord {
  id: string;
  user: { id: string; name: string; email: string };
  category: string;
  amount: number;
  date: string;
  description: string | null;
  createdAt: string;
}

export default function ExpensesManagement() {
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const limit = 20;

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (categoryFilter) queryParams.set("category", categoryFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-expenses", page, categoryFilter],
    queryFn: async () => { const res = await api.get(`/admin/expenses?${queryParams}`); return res.data; },
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const columns: Column<ExpenseRecord>[] = [
    { key: "user", header: "User", render: (item) => <span className="font-medium">{item.user.name}</span> },
    { key: "category", header: "Category" },
    { key: "amount", header: "Amount", render: (item) => <span className="font-medium">{formatPKR(item.amount)}</span> },
    { key: "description", header: "Description", render: (item) => item.description || "-" },
    { key: "date", header: "Date", render: (item) => formatDate(item.date) },
    { key: "createdAt", header: "Added", render: (item) => formatDate(item.createdAt) },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Expenses" subtitle="View all user expense entries" />
      <Card className="mb-6"><CardContent className="pt-6">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1.5 min-w-[140px]">
            <Label>Category</Label>
            <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
              <option value="">All</option>
              <option value="UTILITY">Utility</option>
              <option value="RENT">Rent</option>
              <option value="SALARY">Salary</option>
              <option value="OFFICE">Office</option>
              <option value="TRAVEL">Travel</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      </CardContent></Card>
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable columns={columns} data={records} keyExtractor={(item) => item.id}
          pagination={pagination} onPageChange={setPage} emptyTitle="No expenses recorded" />
      </div>
    </motion.div>
  );
}
