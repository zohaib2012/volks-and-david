import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Receipt, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface GSTRegistration {
  id: string;
  businessName: string;
  strn: string;
  status: string;
  createdAt: string;
}

export default function GSTStatus() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["gst-status"],
    queryFn: async () => {
      const res = await api.get("/gst");
      return res.data;
    },
  });

  const registrations: GSTRegistration[] = data?.data || [];

  const columns: Column<GSTRegistration>[] = [
    { key: "businessName", header: "Business Name" },
    { key: "strn", header: "STRN" },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "Applied Date",
      render: (item) => formatDate(item.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) => (
        <Button variant="outline" size="sm" asChild>
          <Link to="/dashboard/gst/monthly-returns">Monthly Returns</Link>
        </Button>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load GST status"
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
        <PageHeader
          title="GST Registration"
          subtitle="Sales Tax Registration Number"
        />
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <Receipt className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No GST Registered</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              Register for GST if your annual turnover exceeds PKR 10 Million.
            </p>
            <Button asChild>
              <Link to="/dashboard/gst/register">
                <Plus className="mr-2 h-4 w-4" /> Register for GST
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
        title="GST / STRN Status"
        subtitle="Track your GST registrations"
        action={
          <Button asChild>
            <Link to="/dashboard/gst/register">
              <Plus className="mr-2 h-4 w-4" /> Register New GST
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
