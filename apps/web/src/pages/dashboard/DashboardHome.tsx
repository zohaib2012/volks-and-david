import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  UserPlus,
  Receipt,
  Briefcase,
  Calculator,
  BookOpen,
  Wallet,
  Bell,
  Clock,
  TrendingUp,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Activity,
  Globe,
  Shield,
  Building2,
  BookMarked,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPKR, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface DashboardStats {
  totalReturns: number;
  pendingReturns: number;
  ntnStatus: string;
  nextDeadline: string;
  totalSpent: number;
  activeProfile: { name: string; cnic: string } | null;
  recentActivity: {
    id: string;
    type: string;
    description: string;
    createdAt: string;
  }[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const quickActions = [
  {
    label: "File Tax Return",
    path: "/dashboard/tax-return/new",
    icon: FileText,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Register NTN",
    path: "/dashboard/ntn/register",
    icon: UserPlus,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    label: "GST Registration",
    path: "/dashboard/gst/register",
    icon: Receipt,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Check ATL",
    path: "/dashboard/tools/atl-checker",
    icon: CheckCircle2,
    color: "from-amber-500 to-amber-600",
  },
  {
    label: "Book Consultant",
    path: "/dashboard/consultations/book",
    icon: Briefcase,
    color: "from-rose-500 to-rose-600",
  },
  {
    label: "Upload Document",
    path: "/dashboard/documents",
    icon: BookOpen,
    color: "from-cyan-500 to-cyan-600",
  },
];

export default function DashboardHome() {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/dashboard/stats");
      return res.data.data;
    },
  });

  const { data: notificationsData } = useQuery({
    queryKey: ["notifications", "unread", "home"],
    queryFn: async () => {
      const res = await api.get("/notifications?unread=true&limit=5");
      return res.data;
    },
  });
  const notifications: Notification[] = notificationsData?.data || [];

  const { data: ntnData } = useQuery({
    queryKey: ["ntn-status-home"],
    queryFn: async () => { const res = await api.get("/ntn"); return res.data.data; },
  });
  const { data: gstData } = useQuery({
    queryKey: ["gst-status-home"],
    queryFn: async () => { const res = await api.get("/gst"); return res.data.data; },
  });
  const { data: secpData } = useQuery({
    queryKey: ["secp-status-home"],
    queryFn: async () => { const res = await api.get("/business/secp"); return res.data.data; },
  });
  const { data: ipData } = useQuery({
    queryKey: ["ip-status-home"],
    queryFn: async () => { const res = await api.get("/ip-services"); return res.data.data; },
  });
  const { data: taxReturnsData } = useQuery({
    queryKey: ["tax-returns-home"],
    queryFn: async () => { const res = await api.get("/tax-returns?limit=5"); return res.data.data; },
  });
  const { data: consultationsData } = useQuery({
    queryKey: ["consultations-home"],
    queryFn: async () => { const res = await api.get("/consultations?limit=5"); return res.data.data; },
  });
  const { data: consultantData } = useQuery({
    queryKey: ["assigned-consultant"],
    queryFn: async () => {
      try { const res = await api.get("/consultations/assigned-consultant"); return res.data; }
      catch { return null; }
    },
  });

  const ntnRegs = Array.isArray(ntnData) ? ntnData : [];
  const gstRegs = Array.isArray(gstData) ? gstData : [];
  const secpRegs = Array.isArray(secpData) ? secpData : [];
  const ipRegs = Array.isArray(ipData) ? ipData : [];
  const taxReturns = Array.isArray(taxReturnsData) ? taxReturnsData : [];
  const consultations = Array.isArray(consultationsData) ? consultationsData : [];

  const deriveStatus = (items: any[]) => {
    if (items.length === 0) return "NOT_STARTED";
    const allActive = items.every((i: any) => i.status === "ACTIVE" || i.status === "SUBMITTED" || i.status === "COMPLETED");
    const hasPending = items.some((i: any) => i.status === "PENDING" || i.status === "DRAFT");
    if (allActive) return "COMPLETED";
    if (hasPending) return "PENDING";
    return "PROCESSING";
  };

  const ntnStatus = deriveStatus(ntnRegs);
  const gstStatus = deriveStatus(gstRegs);
  const secpStatus = deriveStatus(secpRegs);
  const ipStatus = deriveStatus(ipRegs);
  const taxReturnsStatus = deriveStatus(taxReturns.map(r => ({ ...r, status: r.status === "ACCEPTED" ? "ACTIVE" : r.status })));
  const consultationsStatus = deriveStatus(consultations);

  const serviceStatuses = [
    { label: "NTN Registration", status: ntnStatus, count: ntnRegs.length, icon: UserPlus, href: "/dashboard/ntn", color: "from-blue-500 to-blue-600" },
    { label: "GST Registration", status: gstStatus, count: gstRegs.length, icon: Receipt, href: "/dashboard/gst", color: "from-purple-500 to-purple-600" },
    { label: "SECP", status: secpStatus, count: secpRegs.length, icon: Building2, href: "/dashboard/business/secp", color: "from-cyan-500 to-cyan-600" },
    { label: "IP Registrations", status: ipStatus, count: ipRegs.length, icon: Shield, href: "/dashboard/business/ip-history", color: "from-rose-500 to-rose-600" },
    { label: "Tax Returns", status: taxReturnsStatus, count: taxReturns.length, icon: FileText, href: "/dashboard/tax-return", color: "from-emerald-500 to-emerald-600" },
    { label: "Consultations", status: consultationsStatus, count: consultations.length, icon: MessageSquare, href: "/dashboard/consultations", color: "from-amber-500 to-amber-600" },
  ];

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load dashboard"
        description="Please try refreshing the page"
        action={{ label: "Refresh", onClick: () => window.location.reload() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title={`Welcome back${data?.activeProfile?.name ? `, ${data.activeProfile.name}` : ""}`}
        subtitle="Here's your tax & financial overview"
        action={data?.ntnStatus && <StatusBadge status={data.ntnStatus} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon={<FileText className="h-6 w-6" />}
          label="Total Returns"
          value={data?.totalReturns ?? 0}
          variant="default"
        />
        <StatsCard
          icon={<Users className="h-6 w-6" />}
          label="NTN Status"
          value={data?.ntnStatus || "N/A"}
          variant={data?.ntnStatus === "ACTIVE" ? "success" : "warning"}
        />
        <StatsCard
          icon={<Clock className="h-6 w-6" />}
          label="Next Deadline"
          value={data?.nextDeadline ? formatDate(data.nextDeadline) : "N/A"}
          variant="warning"
        />
        <StatsCard
          icon={<Wallet className="h-6 w-6" />}
          label="Total Spent"
          value={data?.totalSpent ? formatPKR(data.totalSpent) : formatPKR(0)}
          variant="default"
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Service Status Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {serviceStatuses.map((svc) => {
              const Icon = svc.icon;
              const statusColor =
                svc.status === "COMPLETED" ? "bg-emerald-500" :
                svc.status === "PENDING" ? "bg-amber-500" :
                svc.status === "NOT_STARTED" ? "bg-gray-300" :
                "bg-blue-500";
              const statusLabel =
                svc.status === "COMPLETED" ? "Active" :
                svc.status === "PENDING" ? "Pending" :
                svc.status === "NOT_STARTED" ? "Not Started" :
                "Processing";
              return (
                <Link key={svc.label} to={svc.href} className="group flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 text-center hover:border-primary/30 hover:shadow-md transition-all">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${svc.color} text-white shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{svc.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${statusColor}`} />
                    <span className="text-xs text-muted-foreground">{statusLabel}</span>
                  </div>
                  <span className="text-lg font-bold">{svc.count}</span>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.path}
                      to={action.path}
                      className="group flex flex-col items-center gap-2 rounded-xl border border-border/50 p-4 text-center hover:border-primary/30 hover:shadow-md transition-all"
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} text-white shadow-sm`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium">
                        {action.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {data?.recentActivity && data.recentActivity.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <TrendingUp className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="space-y-6">
          {consultantData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Your Consultant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg">
                    {(consultantData.name || "C").charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{consultantData.name || "Tax Consultant"}</p>
                    {consultantData.email && (
                      <p className="text-xs text-muted-foreground">{consultantData.email}</p>
                    )}
                  </div>
                </div>
                {consultantData.specialization && (
                  <p className="text-xs text-muted-foreground mb-3">{consultantData.specialization}</p>
                )}
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/dashboard/consultations">
                    <MessageSquare className="mr-2 h-4 w-4" /> Contact
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="text-lg">Tax Deadline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary mb-2">
                  {data?.nextDeadline
                    ? Math.max(
                        0,
                        Math.ceil(
                          (new Date(data.nextDeadline).getTime() - Date.now()) /
                            (1000 * 60 * 60 * 24),
                        ),
                      )
                    : "--"}
                </div>
                <p className="text-sm text-muted-foreground">days remaining</p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/dashboard/tax-return/new">
                  File Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((n) => (
                    <div key={n.id} className="flex items-start gap-3 pb-3 border-b border-border/50 last:border-b-0 last:pb-0">
                      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground/60 mt-1">{formatDate(n.createdAt)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No new notifications
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
