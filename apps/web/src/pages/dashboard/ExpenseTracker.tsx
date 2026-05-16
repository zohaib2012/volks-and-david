import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus, Download, Edit2, Trash2, AlertCircle,
  Wallet, Calendar, Tag, PieChart as PieChartIcon,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPKR, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatsCard } from "@/components/dashboard/StatsCard";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  tags: string[];
}

const categories = [
  "Office Supplies", "Travel", "Meals & Entertainment", "Rent",
  "Utilities", "Marketing", "Professional Fees", "Software",
  "Equipment", "Other",
];

const PIE_COLORS = [
  "hsl(var(--primary))", "hsl(var(--accent))", "#22c55e",
  "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899",
];

const emptyForm = {
  category: "",
  amount: "",
  date: new Date().toISOString().split("T")[0],
  description: "",
  tags: "",
};

export default function ExpenseTrackerPage() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Expense | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading, error } = useQuery({
    queryKey: ["expenses", categoryFilter, dateRange],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (categoryFilter) params.set("category", categoryFilter);
      if (dateRange.start) params.set("startDate", dateRange.start);
      if (dateRange.end) params.set("endDate", dateRange.end);
      params.set("limit", "100");
      const res = await api.get(`/expenses?${params}`);
      return res.data;
    },
  });

  const expenses: Expense[] = data?.data || [];

  // Compute real summary from API data
  const now = new Date();
  const thisMonthTotal = expenses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const thisYearTotal = expenses
    .filter((e) => new Date(e.date).getFullYear() === now.getFullYear())
    .reduce((sum, e) => sum + e.amount, 0);

  const categoryTotals = categories
    .map((cat) => ({
      name: cat,
      value: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((c) => c.value > 0);

  const topCategory = categoryTotals.length > 0
    ? categoryTotals.reduce((a, b) => (a.value > b.value ? a : b)).name
    : "—";

  // Monthly bar chart from real data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleString("default", { month: "short" });
    const amount = expenses
      .filter((e) => {
        const ed = new Date(e.date);
        return ed.getMonth() === d.getMonth() && ed.getFullYear() === d.getFullYear();
      })
      .reduce((sum, e) => sum + e.amount, 0);
    return { month, amount };
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof emptyForm) => {
      const res = await api.post("/expenses", {
        category: data.category,
        amount: Number(data.amount),
        date: data.date,
        description: data.description,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Expense added successfully!");
      setShowAdd(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => toast.error("Failed to add expense"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof emptyForm }) => {
      const res = await api.put(`/expenses/${id}`, {
        category: data.category,
        amount: Number(data.amount),
        date: data.date,
        description: data.description,
        tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Expense updated!");
      setEditingExpense(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => toast.error("Failed to update expense"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      toast.success("Expense deleted");
      setDeleteConfirm(null);
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: () => toast.error("Failed to delete expense"),
  });

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setForm({
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date?.split("T")[0] || "",
      description: expense.description || "",
      tags: (expense.tags || []).join(", "),
    });
  };

  const handleSave = () => {
    if (!form.category || !form.amount) {
      toast.error("Category and amount are required");
      return;
    }
    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleExportCSV = () => {
    if (expenses.length === 0) {
      toast.error("No expenses to export");
      return;
    }
    const headers = ["Date", "Category", "Description", "Amount", "Tags"];
    const rows = expenses.map((e) => [
      formatDate(e.date),
      e.category,
      `"${e.description || ""}"`,
      e.amount,
      `"${(e.tags || []).join(", ")}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported!");
  };

  const columns: Column<Expense>[] = [
    { key: "date", header: "Date", render: (item) => formatDate(item.date), sortable: true },
    { key: "category", header: "Category" },
    { key: "description", header: "Description" },
    {
      key: "amount",
      header: "Amount",
      render: (item) => <span className="font-medium">{formatPKR(item.amount)}</span>,
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => setDeleteConfirm(item)}
          >
            <Trash2 className="h-4 w-4" />
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
        title="Failed to load expenses"
        action={{ label: "Retry", onClick: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }) }}
      />
    );
  }

  const isDialogOpen = showAdd || !!editingExpense;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Expense Tracker"
        subtitle="Track and manage your business expenses"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export CSV
            </Button>
            <Button onClick={() => { setForm(emptyForm); setShowAdd(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon={<Wallet className="h-6 w-6" />}
          label="This Month"
          value={formatPKR(thisMonthTotal)}
          variant="default"
        />
        <StatsCard
          icon={<Calendar className="h-6 w-6" />}
          label="This Year"
          value={formatPKR(thisYearTotal)}
          variant="success"
        />
        <StatsCard
          icon={<Tag className="h-6 w-6" />}
          label="Top Category"
          value={topCategory}
          variant="warning"
        />
        <StatsCard
          icon={<PieChartIcon className="h-6 w-6" />}
          label="Total Expenses"
          value={String(expenses.length)}
          variant="default"
        />
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="space-y-1.5">
          <Label>Category</Label>
          <select
            className="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>From Date</Label>
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))}
          />
        </div>
        <div className="space-y-1.5">
          <Label>To Date</Label>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))}
          />
        </div>
      </div>

      {categoryTotals.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader><CardTitle className="text-sm">Expense Categories Breakdown</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryTotals} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {categoryTotals.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {categoryTotals.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-1.5 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-muted-foreground">{c.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader><CardTitle className="text-sm">Monthly Expenses (Last 6 Months)</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      <DataTable
        columns={columns}
        data={expenses}
        keyExtractor={(item) => item.id}
        emptyTitle="No expenses yet"
        emptyDescription="Start tracking your expenses by adding your first one."
        emptyAction={{ label: "Add Your First Expense", onClick: () => { setForm(emptyForm); setShowAdd(true); } }}
      />

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) { setShowAdd(false); setEditingExpense(null); setForm(emptyForm); } }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Amount (PKR) *</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Enter description..."
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tags (comma separated)</Label>
              <Input
                placeholder="tax-deductible, office, etc."
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => { setShowAdd(false); setEditingExpense(null); setForm(emptyForm); }}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingExpense ? "Update" : "Save Expense"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Expense</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Delete <strong>{deleteConfirm?.description || deleteConfirm?.category}</strong> ({formatPKR(deleteConfirm?.amount || 0)})? This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
