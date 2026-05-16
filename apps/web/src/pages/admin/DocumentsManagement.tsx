import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, Download } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

interface DocumentRecord {
  id: string;
  user: { id: string; name: string; email: string };
  name: string;
  type: string | null;
  fileUrl: string | null;
  fileSize: number | null;
  createdAt: string;
}

export default function DocumentsManagement() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-documents", page],
    queryFn: async () => { const res = await api.get(`/admin/documents?page=${page}&limit=${limit}`); return res.data; },
  });

  const records = data?.data ?? [];
  const pagination = data?.pagination ?? { page: 1, limit, total: 0 };

  const columns: Column<DocumentRecord>[] = [
    { key: "user", header: "User", render: (item) => <span className="font-medium">{item.user.name}</span> },
    { key: "name", header: "Name" },
    { key: "type", header: "Type", render: (item) => item.type || "-" },
    { key: "fileSize", header: "Size", render: (item) => item.fileSize ? `${(item.fileSize / 1024).toFixed(1)} KB` : "-" },
    { key: "createdAt", header: "Uploaded", render: (item) => formatDate(item.createdAt) },
    { key: "actions", header: "", render: (item) => (
      item.fileUrl ? <Button variant="ghost" size="sm" asChild><a href={item.fileUrl} target="_blank" rel="noopener noreferrer"><Download className="h-4 w-4" /></a></Button> : null
    )},
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <EmptyState icon={<AlertCircle />} title="Failed" action={{ label: "Retry", onClick: () => refetch() }} />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Documents" subtitle="View all user uploaded documents" />
      <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
        <DataTable columns={columns} data={records} keyExtractor={(item) => item.id}
          pagination={pagination} onPageChange={setPage} emptyTitle="No documents uploaded" />
      </div>
    </motion.div>
  );
}
