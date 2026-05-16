import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Download, AlertCircle, Search } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPKR } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface WithholdingTaxItem {
  id: string;
  taxYear: number;
  statementType: string;
  source: string;
  totalDeducted: number;
  status: string;
}

const currentYear = new Date().getFullYear();

export default function WithholdingTaxPage() {
  const [showRequest, setShowRequest] = useState(false);
  const [form, setForm] = useState({
    taxYear: String(currentYear),
    statementType: "Employer",
    source: "",
  });
  const queryClient = useQueryClient();

  const requestMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/withholding-tax", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Statement requested!");
      setShowRequest(false);
      setForm({ taxYear: String(currentYear), statementType: "Employer", source: "" });
      queryClient.invalidateQueries({ queryKey: ["withholding-tax"] });
    },
    onError: () => toast.error("Failed to submit request"),
  });

  const handleRequest = () => {
    if (!form.taxYear) { toast.error("Please select a tax year"); return; }
    requestMutation.mutate({
      taxYear: Number(form.taxYear),
      statementType: form.statementType,
      source: form.source || null,
    });
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["withholding-tax"],
    queryFn: async () => {
      const res = await api.get("/withholding-tax");
      return res.data;
    },
  });

  const items: WithholdingTaxItem[] = data?.data || [];

  const columns: Column<WithholdingTaxItem>[] = [
    { key: "taxYear", header: "Tax Year" },
    { key: "statementType", header: "Statement Type" },
    { key: "source", header: "Source" },
    {
      key: "totalDeducted",
      header: "Total Deducted",
      render: (item) => item.totalDeducted ? formatPKR(item.totalDeducted) : "—",
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Certificate",
      render: () => (
        <Button variant="outline" size="sm">
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
        title="Failed to load withholding tax"
        action={{ label: "Retry", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Withholding Tax"
        subtitle="Track tax deducted at source"
        action={
          <Button onClick={() => setShowRequest(true)}>
            <Search className="mr-2 h-4 w-4" /> Request Statement
          </Button>
        }
      />

      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            Withholding tax is deducted at source by employers, banks, and
            others. You can request statements and download certificates here.
          </p>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={items}
        keyExtractor={(item) => item.id}
        emptyTitle="No withholding tax records"
        emptyDescription="Request a statement to get started."
      />

      <Dialog open={showRequest} onOpenChange={setShowRequest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Statement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tax Year</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.taxYear}
                onChange={(e) => setForm((p) => ({ ...p, taxYear: e.target.value }))}
              >
                {Array.from({ length: 5 }, (_, i) => String(currentYear - i)).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Statement Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.statementType}
                onChange={(e) => setForm((p) => ({ ...p, statementType: e.target.value }))}
              >
                <option>Employer</option>
                <option>Bank</option>
                <option>Property</option>
                <option>Dividend</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Source Name (Employer/Bank)</Label>
              <Input
                placeholder="e.g. ABC Company"
                value={form.source}
                onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-3 flex justify-between items-center">
              <span className="text-sm">Fee</span>
              <span className="font-bold">Rs. 1,499</span>
            </div>
            <Button
              className="w-full"
              onClick={handleRequest}
              disabled={requestMutation.isPending}
            >
              {requestMutation.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
