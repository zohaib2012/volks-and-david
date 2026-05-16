import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Building2, AlertCircle, Eye } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { formatPKR, formatDate } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SecpRecord {
  id: string;
  companyType: string | null;
  companyNames: any;
  address: string | null;
  city: string | null;
  paidUpCapital: number | null;
  natureOfBusiness: string | null;
  directors: any;
  status: string;
  secpRefNumber: string | null;
  fee: number | null;
  createdAt: string;
  updatedAt: string;
}

const companyTypeLabels: Record<string, string> = {
  PRIVATE_LIMITED: "Private Limited",
  PUBLIC_LIMITED: "Public Limited",
  SMCO: "Single Member Company",
  TRUST: "Trust",
  NPO: "Non-Profit Organization",
};

export default function SECPRegistrationHistory() {
  const [selected, setSelected] = useState<SecpRecord | null>(null);

  const { data, isLoading, error, refetch } = useQuery<SecpRecord[]>({
    queryKey: ["my-secp"],
    queryFn: async () => {
      const res = await api.get("/secp");
      return res.data.data;
    },
  });

  const records = data ?? [];

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      title="Failed to load SECP registrations"
      action={{ label: "Retry", onClick: () => refetch() }}
    />
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="My SECP Registrations"
        subtitle="Track your company registration applications"
      />

      {records.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-12 w-12 text-muted-foreground" />}
          title="No SECP registrations yet"
          description="You haven't registered any company yet."
        />
      ) : (
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Company Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">City</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Capital</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Ref #</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => {
                    const names = Array.isArray(r.companyNames) ? r.companyNames : [];
                    return (
                      <tr key={r.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2">
                          <span className="font-medium">{companyTypeLabels[r.companyType || ""] || r.companyType}</span>
                        </td>
                        <td className="py-3 px-2 max-w-[150px] truncate">{names[0] || "-"}</td>
                        <td className="py-3 px-2">{r.city || "-"}</td>
                        <td className="py-3 px-2">{r.paidUpCapital ? formatPKR(r.paidUpCapital) : "-"}</td>
                        <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                        <td className="py-3 px-2 font-mono text-xs">{r.secpRefNumber || "-"}</td>
                        <td className="py-3 px-2 text-muted-foreground">{formatDate(r.createdAt)}</td>
                        <td className="py-3 px-2 text-right">
                          <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>SECP Registration Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Type:</span> {companyTypeLabels[selected.companyType || ""] || selected.companyType}</div>
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
                <div><span className="text-muted-foreground">City:</span> {selected.city || "-"}</div>
                <div><span className="text-muted-foreground">Capital:</span> {selected.paidUpCapital ? formatPKR(selected.paidUpCapital) : "-"}</div>
                <div><span className="text-muted-foreground">Ref #:</span> <span className="font-mono">{selected.secpRefNumber || "-"}</span></div>
                <div><span className="text-muted-foreground">Fee:</span> {selected.fee ? formatPKR(selected.fee) : "-"}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {selected.address || "-"}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Business:</span> {selected.natureOfBusiness || "-"}</div>
              </div>
              {selected.directors && (
                <div className="border-t border-border pt-3">
                  <h4 className="text-sm font-semibold mb-2">Directors</h4>
                  <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selected.directors, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
