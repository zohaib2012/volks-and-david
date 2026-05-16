import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ShieldCheck, AlertCircle, Eye } from "lucide-react";
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

interface IpRecord {
  id: string;
  type: "TRADEMARK" | "COPYRIGHT" | "PATENT";
  formData: any;
  status: string;
  fee: number | null;
  refNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function IPRegistrationHistory() {
  const [selected, setSelected] = useState<IpRecord | null>(null);

  const { data, isLoading, error, refetch } = useQuery<IpRecord[]>({
    queryKey: ["my-ip-registrations"],
    queryFn: async () => {
      const res = await api.get("/ip-services");
      return res.data.data;
    },
  });

  const records = data ?? [];

  const typeLabel = (type: string) => {
    switch (type) {
      case "TRADEMARK": return "Trademark";
      case "COPYRIGHT": return "Copyright";
      case "PATENT": return "Patent";
      default: return type;
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return (
    <EmptyState
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      title="Failed to load IP registrations"
      action={{ label: "Retry", onClick: () => refetch() }}
    />
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="My IP Registrations"
        subtitle="Track your trademark, copyright, and patent applications"
      />

      {records.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="h-12 w-12 text-muted-foreground" />}
          title="No IP registrations yet"
          description="You haven't filed any IP registration applications yet."
        />
      ) : (
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Details</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Fee</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Ref #</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-medium">{typeLabel(r.type)}</span>
                      </td>
                      <td className="py-3 px-2 max-w-[200px] truncate text-muted-foreground">
                        {r.formData?.patentTitle || r.formData?.brandName || r.formData?.workTitle || "-"}
                      </td>
                      <td className="py-3 px-2">{r.fee ? formatPKR(r.fee) : "-"}</td>
                      <td className="py-3 px-2 font-mono text-xs">{r.refNumber || "-"}</td>
                      <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                      <td className="py-3 px-2 text-muted-foreground">{formatDate(r.createdAt)}</td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg rounded-xl">
          <DialogHeader>
            <DialogTitle>{selected ? typeLabel(selected.type) + " Application" : ""}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selected.status} /></div>
                <div><span className="text-muted-foreground">Fee:</span> {selected.fee ? formatPKR(selected.fee) : "-"}</div>
                <div><span className="text-muted-foreground">Ref #:</span> <span className="font-mono">{selected.refNumber || "-"}</span></div>
                <div><span className="text-muted-foreground">Filed:</span> {formatDate(selected.createdAt)}</div>
              </div>
              {selected.formData && (
                <div className="border-t border-border pt-3">
                  <h4 className="text-sm font-semibold mb-2">Form Data</h4>
                  <pre className="text-xs bg-muted/30 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selected.formData, null, 2)}
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
