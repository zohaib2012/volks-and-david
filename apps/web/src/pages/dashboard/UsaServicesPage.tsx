import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Globe,
  FileText,
  Building2,
  Landmark,
  PiggyBank,
  AlertCircle,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface UsaApplication {
  id: string;
  serviceType: string;
  companyName?: string;
  state?: string;
  status: string;
  createdAt: string;
}

const serviceOptions = [
  { type: "LLC", label: "LLC Formation", icon: Building2, desc: "Register your US LLC", price: "$399", path: "/dashboard/usa-services" },
  { type: "EIN", label: "EIN Application", icon: FileText, desc: "Employer ID Number", price: "$99", path: "/dashboard/usa-services" },
  { type: "ITIN", label: "ITIN Application", icon: Landmark, desc: "Individual Taxpayer Number", price: "$199", path: "/dashboard/usa-services" },
  { type: "BANK", label: "US Bank Account", icon: PiggyBank, desc: "Open US bank account", price: "$149", path: "/dashboard/usa-services" },
];

const statusIcon: Record<string, typeof CheckCircle> = {
  PENDING: Clock,
  UNDER_REVIEW: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
};

export default function UsaServicesPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["usa-services"],
    queryFn: async () => {
      const res = await api.get("/usa-services");
      return res.data;
    },
  });

  const applications: UsaApplication[] = data?.data || [];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load applications"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="USA Services"
        subtitle="US tax and business services for Pakistani residents"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {serviceOptions.map((svc) => {
          const Icon = svc.icon;
          return (
            <Card key={svc.type} className="card-hover border-border/50">
              <CardContent className="p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{svc.label}</h3>
                <p className="text-xs text-muted-foreground mb-2">{svc.desc}</p>
                <p className="text-lg font-bold text-primary mb-3">{svc.price}</p>
                <Button size="sm" className="w-full" asChild>
                  <Link to={svc.path}>Apply Now <ArrowRight className="ml-1 h-3 w-3" /></Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <EmptyState
              icon={<Globe className="h-12 w-12 text-muted-foreground" />}
              title="No applications yet"
              description="Apply for a US service to get started."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Company</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">State</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const Icon = statusIcon[app.status] || Clock;
                    return (
                      <tr key={app.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2 font-medium">{app.serviceType}</td>
                        <td className="py-3 px-2">{app.companyName || "-"}</td>
                        <td className="py-3 px-2">{app.state || "-"}</td>
                        <td className="py-3 px-2"><StatusBadge status={app.status} /></td>
                        <td className="py-3 px-2 text-muted-foreground">{formatDate(app.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
