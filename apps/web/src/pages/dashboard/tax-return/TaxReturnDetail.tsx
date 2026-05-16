import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Download, ArrowLeft, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

interface TaxReturnDetailData {
  id: string;
  taxYear: number;
  returnType: string;
  status: string;
  income: Record<string, number> | null;
  deductions: Record<string, number> | null;
  assets: Record<string, number> | null;
  liabilities: Record<string, number> | null;
  totalIncome: number | null;
  totalDeductions: number | null;
  taxableIncome: number | null;
  taxPayable: number | null;
  fbrReference?: string | null;
  filedDate: string | null;
  consultantNotes?: string | null;
}

export default function TaxReturnDetail() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useQuery<TaxReturnDetailData>({
    queryKey: ["tax-return", id],
    queryFn: async () => {
      const res = await api.get(`/tax-returns/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error || !data) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load tax return"
        action={{ label: "Go Back", onClick: () => window.history.back() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={`Tax Return ${data.taxYear}`}
        subtitle={`${data.returnType}${data.filedDate ? ` — Filed on ${formatDate(data.filedDate)}` : ""}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            {data.status === "SUBMITTED" && (
              <Button>
                <Download className="mr-2 h-4 w-4" /> Download Acknowledgement
              </Button>
            )}
          </div>
        }
      />

      <div className="mb-6">
        <StatusBadge status={data.status} className="text-sm px-4 py-1.5" />
        {data.fbrReference && (
          <span className="ml-3 text-sm text-muted-foreground">
            FBR Ref: {data.fbrReference}
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Income Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(data.income || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-medium">{formatPKR(Number(val))}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold">Total Income</span>
              <span className="font-semibold">{formatPKR(data.totalIncome ?? 0)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deductions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(data.deductions || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                <span className="font-medium">- {formatPKR(Number(val))}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold">Total Deductions</span>
              <span className="font-semibold text-emerald-600">
                - {formatPKR(data.totalDeductions ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tax Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Gross Income</p>
                <p className="text-xl font-bold">{formatPKR(data.totalIncome ?? 0)}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">Taxable Income</p>
                <p className="text-xl font-bold">
                  {formatPKR(data.taxableIncome ?? 0)}
                </p>
              </div>
              <div className="rounded-lg bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground">Tax Payable</p>
                <p className="text-xl font-bold text-primary">
                  {formatPKR(data.taxPayable ?? 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {data.consultantNotes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Consultant Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {data.consultantNotes}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
