import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

interface ReferralRecord {
  id: string;
  referrer: { id: string; name: string; email: string };
  refereeEmail: string;
  status: string;
  reward: number | null;
  createdAt: string;
}

export default function ReferralsManagement() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-referrals", page],
    queryFn: async () => { const res = await api.get(`/admin/referrals?page=${page}&limit=${limit}`); return res.data; },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => { await api.put(`/admin/referrals/${id}`, { status }); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-referrals"] }); toast.success("Updated"); },
    onError: () => toast.error("Failed"),
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const columns: Column<ReferralRecord>[] = [
    { key: "referrer", header: "Referrer", render: (item) => <span className="font-medium">{item.referrer.name}</span> },
    { key: "refereeEmail", header: "Referred Email" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "reward", header: "Reward", render: (item) => item.reward ? formatPKR(item.reward) : "-" },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    { key: "actions", header: "", render: (item) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="sm" onClick={() => updateMutation.mutate({ id: item.id, status: "APPROVED" })}>Approve</Button>
        <Button variant="ghost" size="sm" onClick={() => updateMutation.mutate({ id: item.id, status: "REJECTED" })}>Reject</Button>
      </div>
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Referrals" subtitle="Manage user referral rewards" />
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable columns={columns} data={records} keyExtractor={(item) => item.id}
          pagination={pagination} onPageChange={setPage} emptyTitle="No referrals yet" />
      </div>
    </motion.div>
  );
}
