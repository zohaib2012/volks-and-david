import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Eye, Edit, Download, Plus, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { formatPKR, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface TaxReturn {
  id: string;
  taxYear: string;
  returnType: string;
  income: number;
  status: string;
  filedDate: string;
}

const taxYears = Array.from({ length: 10 }, (_, i) => String(2016 + i));

export default function TaxReturnList() {
  const [filters, setFilters] = useState({
    taxYear: "",
    returnType: "",
    status: "",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["tax-returns", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.taxYear) params.set("taxYear", filters.taxYear);
      if (filters.returnType) params.set("returnType", filters.returnType);
      if (filters.status) params.set("status", filters.status);
      const res = await api.get(`/tax-returns?${params}`);
      return res.data;
    },
  });

  const columns: Column<TaxReturn>[] = [
    { key: "taxYear", header: "Tax Year", sortable: true },
    { key: "returnType", header: "Return Type", sortable: true },
    {
      key: "income",
      header: "Income",
      render: (item) => formatPKR(item.income),
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "filedDate",
      header: "Filed Date",
      render: (item) => formatDate(item.filedDate),
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/dashboard/tax-return/${item.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          {item.status === "DRAFT" && (
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/dashboard/tax-return/new?id=${item.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          )}
          {item.status === "SUBMITTED" && (
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
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
        title="Failed to load tax returns"
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Tax Returns"
        subtitle="View and manage your filed tax returns"
        action={
          <Button asChild>
            <Link to="/dashboard/tax-return/new">
              <Plus className="mr-2 h-4 w-4" />
              File New Return
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="space-y-1.5">
          <Label>Tax Year</Label>
          <select
            className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.taxYear}
            onChange={(e) =>
              setFilters((p) => ({ ...p, taxYear: e.target.value }))
            }
          >
            <option value="">All Years</option>
            {taxYears.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Return Type</Label>
          <select
            className="flex h-10 w-[160px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.returnType}
            onChange={(e) =>
              setFilters((p) => ({ ...p, returnType: e.target.value }))
            }
          >
            <option value="">All Types</option>
            <option value="SALARIED">Salaried</option>
            <option value="BUSINESS">Business</option>
            <option value="AOP">AOP</option>
            <option value="COMPANY">Company</option>
            <option value="RENTAL">Rental</option>
            <option value="AGRICULTURE">Agriculture</option>
            <option value="FREELANCER">Freelancer</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <select
            className="flex h-10 w-[140px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({ ...p, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.data || []}
        pagination={data?.pagination}
        keyExtractor={(item) => item.id}
        emptyTitle="No tax returns yet"
        emptyDescription="Start by filing your first return."
        emptyAction={{
          label: "File Your First Return",
          onClick: () => (window.location.href = "/dashboard/tax-return/new"),
        }}
      />
    </motion.div>
  );
}
