import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserPlus, Plus, AlertCircle, Download } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface NTN {
  id: string;
  ntnType: string;
  cnic: string;
  status: string;
  createdAt: string;
  ntnNumber?: string | null;
  adminDocUrl?: string | null;
  adminDocName?: string | null;
}

export default function NTNStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["ntn-status"],
    queryFn: async () => {
      const res = await api.get("/ntn");
      return res.data;
    },
  });

  const registrations: NTN[] = data?.data || [];

  const columns: Column<NTN>[] = [
    { key: "ntnType", header: "NTN Type" },
    { key: "cnic", header: "CNIC" },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "Submitted Date",
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: "ntnNumber",
      header: "NTN Number",
      render: (item) => item.ntnNumber || "—",
    },
    {
      key: "actions",
      header: "Document",
      render: (item) =>
        item.adminDocUrl ? (
          <a href={item.adminDocUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4 mr-1" /> {item.adminDocName || "Download"}
            </Button>
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load NTN status"
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );
  }

  if (!registrations.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PageHeader title="NTN Registration" subtitle="National Tax Number" />
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <UserPlus className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              No NTN Registered Yet
            </h2>
            <p className="text-muted-foreground max-w-md mb-6">
              An NTN (National Tax Number) is required to file taxes in
              Pakistan. Register now to get your NTN and start filing.
            </p>
            <Button asChild>
              <Link to="/dashboard/ntn/register">
                <Plus className="mr-2 h-4 w-4" /> Register NTN Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="NTN Status"
        subtitle="Track your NTN registrations"
        action={
          <Button asChild>
            <Link to="/dashboard/ntn/register">
              <Plus className="mr-2 h-4 w-4" /> Register Another NTN
            </Link>
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={registrations}
        keyExtractor={(item) => item.id}
      />
    </motion.div>
  );
}
