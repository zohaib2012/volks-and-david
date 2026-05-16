import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, Activity } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

interface ActivityLogRecord {
  id: string;
  user: { id: string; name: string; email: string };
  type: string;
  description: string | null;
  createdAt: string;
}

export default function ActivityLogs() {
  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const limit = 50;

  const queryParams = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (typeFilter) queryParams.set("type", typeFilter);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-activity-logs", page, typeFilter],
    queryFn: async () => { const res = await api.get(`/admin/activity-logs?${queryParams}`); return res.data; },
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const columns: Column<ActivityLogRecord>[] = [
    { key: "user", header: "User", render: (item) => <span className="font-medium">{item.user.name}</span> },
    { key: "type", header: "Type", render: (item) => <span className="capitalize">{item.type}</span> },
    { key: "description", header: "Description", render: (item) => item.description || "-" },
    { key: "createdAt", header: "Time", render: (item) => formatDate(item.createdAt) },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Activity Logs" subtitle="View platform activity history" />
      {records.length > 0 && (
        <Card className="mb-6"><CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="space-y-1.5 min-w-[140px]">
              <Label>Type</Label>
              <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}>
                <option value="">All</option>
                <option value="LOGIN">Login</option>
                <option value="TAX_RETURN">Tax Return</option>
                <option value="PAYMENT">Payment</option>
                <option value="REGISTRATION">Registration</option>
                <option value="CONSULTATION">Consultation</option>
                <option value="DOCUMENT">Document</option>
              </select>
            </div>
          </div>
        </CardContent></Card>
      )}
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable columns={columns} data={records} keyExtractor={(item) => item.id}
          pagination={pagination} onPageChange={setPage} emptyTitle="No activity logs" emptyDescription="Activity logs will appear as users interact with the platform." />
      </div>
    </motion.div>
  );
}
