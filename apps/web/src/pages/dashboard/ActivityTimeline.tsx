import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  FileText,
  UserPlus,
  Receipt,
  Building2,
  Shield,
  Wallet,
  Calendar,
  MessageSquare,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  status?: string;
  createdAt: string;
  href?: string;
}

const activityIcons: Record<string, React.ElementType> = {
  TAX_RETURN: FileText,
  NTN: UserPlus,
  GST: Receipt,
  SECP: Building2,
  IP: Shield,
  PAYMENT: Wallet,
  CONSULTATION: MessageSquare,
  DEFAULT: Activity,
};

const activityIconColors: Record<string, string> = {
  TAX_RETURN: "bg-blue-500",
  NTN: "bg-emerald-500",
  GST: "bg-purple-500",
  SECP: "bg-cyan-500",
  IP: "bg-rose-500",
  PAYMENT: "bg-amber-500",
  CONSULTATION: "bg-indigo-500",
  DEFAULT: "bg-gray-500",
};

export default function ActivityTimeline() {
  const { data: activityData, isLoading, error, refetch } = useQuery({
    queryKey: ["activity-timeline"],
    queryFn: async () => {
      try {
        const res = await api.get("/activity");
        return res.data.data;
      } catch {
        return null;
      }
    },
  });

  const { data: taxReturnsData } = useQuery({
    queryKey: ["activity-tax-returns"],
    queryFn: async () => {
      try { const res = await api.get("/tax-returns?limit=10"); return res.data.data; }
      catch { return []; }
    },
  });

  const { data: paymentsData } = useQuery({
    queryKey: ["activity-payments"],
    queryFn: async () => {
      try { const res = await api.get("/payments?limit=10"); return res.data.data; }
      catch { return []; }
    },
  });

  const { data: consultationsData } = useQuery({
    queryKey: ["activity-consultations"],
    queryFn: async () => {
      try { const res = await api.get("/consultations?limit=10"); return res.data.data; }
      catch { return []; }
    },
  });

  const buildFallbackActivities = (): ActivityItem[] => {
    const items: ActivityItem[] = [];
    const taxReturns = Array.isArray(taxReturnsData) ? taxReturnsData : [];
    const payments = Array.isArray(paymentsData) ? paymentsData : [];
    const consultations = Array.isArray(consultationsData) ? consultationsData : [];

    taxReturns.forEach((r: any) => {
      items.push({
        id: `tr-${r.id}`,
        type: "TAX_RETURN",
        description: `Tax return ${r.status === "DRAFT" ? "created" : "filed"} for ${r.taxYear} (${r.returnType})`,
        status: r.status,
        createdAt: r.filedDate || r.createdAt,
        href: `/dashboard/tax-return/${r.id}`,
      });
    });

    payments.forEach((p: any) => {
      items.push({
        id: `pm-${p.id}`,
        type: "PAYMENT",
        description: `Payment of ${p.amount} for ${p.serviceType || "service"} — ${p.status}`,
        status: p.status,
        createdAt: p.date || p.createdAt,
        href: "/dashboard/payments",
      });
    });

    consultations.forEach((c: any) => {
      items.push({
        id: `cn-${c.id}`,
        type: "CONSULTATION",
        description: `Consultation ${c.status.toLowerCase()} — ${c.subject || "No subject"}`,
        status: c.status,
        createdAt: c.scheduledAt || c.createdAt,
        href: "/dashboard/consultations",
      });
    });

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return items;
  };

  const activities: ActivityItem[] = activityData || buildFallbackActivities();

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error && !activityData) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load activity"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  if (activities.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <PageHeader title="Activity Timeline" subtitle="Your recent account activity" />
        <EmptyState
          icon={<Activity className="h-12 w-12 text-muted-foreground" />}
          title="No activity yet"
          description="Your recent actions will appear here."
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Activity Timeline"
        subtitle="Your recent account activity"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-0">
              {activities.slice(0, 50).map((item, idx) => {
                const Icon = activityIcons[item.type] || activityIcons.DEFAULT;
                const iconColor = activityIconColors[item.type] || activityIconColors.DEFAULT;
                return (
                  <div key={item.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${iconColor} text-white shadow-sm shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-medium">{item.description}</p>
                        <span className="text-xs text-muted-foreground shrink-0">{formatDate(item.createdAt)}</span>
                      </div>
                      {item.status && (
                        <div className="mt-1">
                          <StatusBadge status={item.status} />
                        </div>
                      )}
                      {item.href && (
                        <Link to={item.href} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                          View details <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
