import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Receipt,
  Building2,
  Shield,
  FileText,
  MessageSquare,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

interface ServiceRow {
  type: string;
  label: string;
  refNumber: string | null;
  status: string;
  updatedAt: string;
  detailHref: string;
  icon: React.ElementType;
  color: string;
}

export default function ServiceStatus() {
  const { data: ntnData, isLoading: ntnLoading } = useQuery({
    queryKey: ["ntn-status-list"],
    queryFn: async () => { const res = await api.get("/ntn"); return res.data.data; },
  });
  const { data: gstData, isLoading: gstLoading } = useQuery({
    queryKey: ["gst-status-list"],
    queryFn: async () => { const res = await api.get("/gst"); return res.data.data; },
  });
  const { data: secpData, isLoading: secpLoading } = useQuery({
    queryKey: ["secp-status-list"],
    queryFn: async () => { const res = await api.get("/business/secp"); return res.data.data; },
  });
  const { data: ipData, isLoading: ipLoading } = useQuery({
    queryKey: ["ip-status-list"],
    queryFn: async () => { const res = await api.get("/ip-services"); return res.data.data; },
  });

  const isLoading = ntnLoading || gstLoading || secpLoading || ipLoading;

  const ntnRegs = Array.isArray(ntnData) ? ntnData : [];
  const gstRegs = Array.isArray(gstData) ? gstData : [];
  const secpRegs = Array.isArray(secpData) ? secpData : [];
  const ipRegs = Array.isArray(ipData) ? ipData : [];

  const rows: ServiceRow[] = [
    ...ntnRegs.map((r: any) => ({
      type: "NTN",
      label: r.ntnType || "NTN Registration",
      refNumber: r.ntnNumber || null,
      status: r.status,
      updatedAt: r.updatedAt || r.createdAt,
      detailHref: "/dashboard/ntn",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
    })),
    ...gstRegs.map((r: any) => ({
      type: "GST",
      label: r.businessName || "GST Registration",
      refNumber: r.strn || null,
      status: r.status,
      updatedAt: r.updatedAt || r.createdAt,
      detailHref: "/dashboard/gst",
      icon: Receipt,
      color: "from-purple-500 to-purple-600",
    })),
    ...secpRegs.map((r: any) => ({
      type: "SECP",
      label: r.companyName || r.businessName || "SECP Registration",
      refNumber: r.registrationNumber || r.secpNumber || null,
      status: r.status,
      updatedAt: r.updatedAt || r.createdAt,
      detailHref: "/dashboard/business/secp",
      icon: Building2,
      color: "from-cyan-500 to-cyan-600",
    })),
    ...ipRegs.map((r: any) => ({
      type: r.type === "TRADEMARK" ? "Trademark" : r.type === "COPYRIGHT" ? "Copyright" : "Patent",
      label: r.formData?.title || r.formData?.name || `${r.type || "IP"} Registration`,
      refNumber: r.refNumber || null,
      status: r.status,
      updatedAt: r.updatedAt || r.createdAt,
      detailHref: "/dashboard/business/ip-history",
      icon: Shield,
      color: "from-rose-500 to-rose-600",
    })),
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (rows.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Service Status" subtitle="Overview of all your registered services" />
        <EmptyState
          icon={<AlertCircle className="h-12 w-12 text-muted-foreground" />}
          title="No services found"
          description="Register for a service to see its status here."
        />
      </motion.div>
    );
  }

  const grouped = rows.reduce<Record<string, ServiceRow[]>>((acc, row) => {
    if (!acc[row.type]) acc[row.type] = [];
    acc[row.type].push(row);
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Service Status" subtitle="Overview of all your registered services" />

      {Object.entries(grouped).map(([type, typeRows]) => {
        const Icon = typeRows[0].icon;
        const color = typeRows[0].color;
        return (
          <Card key={type} className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${color} text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                {type} Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Reference No.</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-2 px-3 font-medium text-muted-foreground">Last Updated</th>
                      <th className="text-right py-2 px-3 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeRows.map((row, idx) => (
                      <tr key={idx} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-3">{row.label}</td>
                        <td className="py-3 px-3">
                          {row.refNumber ? (
                            <Badge variant="outline" className="font-mono text-xs">{row.refNumber}</Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 px-3"><StatusBadge status={row.status} /></td>
                        <td className="py-3 px-3 text-muted-foreground">{formatDate(row.updatedAt)}</td>
                        <td className="py-3 px-3 text-right">
                          <Link to={row.detailHref} className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium">
                            View Details <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </motion.div>
  );
}
