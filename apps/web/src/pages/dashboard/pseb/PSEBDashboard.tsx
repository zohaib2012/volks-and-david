import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Phone, Plus, FileText, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  PRIMARY_APPROVED: "bg-cyan-100 text-cyan-700",
  PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
  PAYMENT_SUBMITTED: "bg-orange-100 text-orange-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  REQUIRES_INFO: "bg-purple-100 text-purple-700",
};

const statusIcons: Record<string, React.ReactNode> = {
  DRAFT: <FileText className="h-4 w-4" />,
  SUBMITTED: <Clock className="h-4 w-4" />,
  PRIMARY_APPROVED: <CheckCircle className="h-4 w-4" />,
  PAYMENT_PENDING: <AlertCircle className="h-4 w-4" />,
  APPROVED: <CheckCircle className="h-4 w-4" />,
  REJECTED: <XCircle className="h-4 w-4" />,
  REQUIRES_INFO: <AlertCircle className="h-4 w-4" />,
};

export default function PSEBDashboard() {
  const navigate = useNavigate();

  const { data: companyData, isLoading: loadingCompany } = useQuery({
    queryKey: ["pseb-company"],
    queryFn: async () => { const res = await api.get("/pseb/company"); return res.data?.data || []; },
  });

  const { data: callCenterData, isLoading: loadingCC } = useQuery({
    queryKey: ["pseb-call-center"],
    queryFn: async () => { const res = await api.get("/pseb/call-center"); return res.data?.data || []; },
  });

  if (loadingCompany || loadingCC) return <LoadingSpinner size="lg" />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <PageHeader
        title="PSEB Registration"
        subtitle="Pakistan Software Export Board \u2014 Register your IT company or call center"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors cursor-pointer"
          onClick={() => navigate("/dashboard/pseb/company/new")}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Register Company / Firm</h3>
              <p className="text-sm text-muted-foreground">IT company, software house, startup</p>
              <p className="text-xs text-primary mt-1">Fee: PKR 5,000\u201310,000</p>
            </div>
            <Plus className="h-5 w-5 text-primary ml-auto" />
          </CardContent>
        </Card>

        <Card className="border-2 border-dashed border-blue-500/30 hover:border-blue-500/60 transition-colors cursor-pointer"
          onClick={() => navigate("/dashboard/pseb/call-center/new")}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Phone className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Register Call Center / BPO</h3>
              <p className="text-sm text-muted-foreground">Call center, BPO, inbound/outbound</p>
              <p className="text-xs text-blue-500 mt-1">Fee: PKR 20,000/year (mandatory by law)</p>
            </div>
            <Plus className="h-5 w-5 text-blue-500 ml-auto" />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Building2 className="h-5 w-5" /> Company / Firm Registrations
        </h2>
        {companyData?.length === 0 ? (
          <EmptyState icon={<Building2 className="h-10 w-10 text-muted-foreground" />}
            title="No company registrations yet"
            description="Register your IT company with PSEB to unlock tax benefits and export opportunities"
            action={{ label: "Register Company", onClick: () => navigate("/dashboard/pseb/company/new") }} />
        ) : (
          <div className="space-y-3">
            {companyData?.map((item: any) => (
              <Card key={item.id} className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => navigate(`/dashboard/pseb/company/${item.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-medium">{item.companyName}</h4>
                    <p className="text-sm text-muted-foreground">{item.companyType} \u2022 NTN: {item.businessNtn || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={statusColors[item.status] || "bg-gray-100"}>
                    <span className="flex items-center gap-1">{statusIcons[item.status]} {item.status.replace(/_/g, " ")}</span>
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Phone className="h-5 w-5" /> Call Center / BPO Registrations
        </h2>
        {callCenterData?.length === 0 ? (
          <EmptyState icon={<Phone className="h-10 w-10 text-muted-foreground" />}
            title="No call center registrations yet"
            description="Call center registration is mandatory by law. Register with PSEB to avoid legal action."
            action={{ label: "Register Call Center", onClick: () => navigate("/dashboard/pseb/call-center/new") }} />
        ) : (
          <div className="space-y-3">
            {callCenterData?.map((item: any) => (
              <Card key={item.id} className="cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => navigate(`/dashboard/pseb/call-center/${item.id}`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h4 className="font-medium">{item.companyName}</h4>
                    <p className="text-sm text-muted-foreground">{item.companyType} \u2022 Seats: {item.seatingCapacity || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Badge className={statusColors[item.status] || "bg-gray-100"}>
                    <span className="flex items-center gap-1">{statusIcons[item.status]} {item.status.replace(/_/g, " ")}</span>
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
