import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, FileText, Wallet, Clock, AlertCircle, Activity,
  UserPlus, Receipt, Building2, ShieldCheck, Globe, CalendarCheck,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR, formatDate } from "@/lib/utils";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingReviews: number;
  monthlyRevenue: number;
  totalReturns: number;
  consultants: number;
  totalNtn: number;
  totalGst: number;
  totalSecp: number;
  totalIp: number;
  totalConsultations: number;
  totalUsaServices: number;
}

interface RecentReturn {
  id: string;
  user: { name: string; email: string };
  returnType: string;
  taxYear: number;
  status: string;
  createdAt: string;
}

interface DashboardResponse {
  stats: DashboardStats;
  recentReturns: RecentReturn[];
  chartData: { month: string; count: number }[];
}

interface RevenueData {
  revenueChart: { month: string; revenue: number }[];
  totalRevenue: number;
  growthPercent: number;
}

const fallbackStats: DashboardStats = {
  totalUsers: 0,
  activeUsers: 0,
  pendingReviews: 0,
  monthlyRevenue: 0,
  totalReturns: 0,
  consultants: 0,
  totalNtn: 0,
  totalGst: 0,
  totalSecp: 0,
  totalIp: 0,
  totalConsultations: 0,
  totalUsaServices: 0,
};

export default function AdminDashboard() {
  const { data, isLoading, error, refetch } = useQuery<DashboardResponse>({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard");
      return res.data.data;
    },
  });

  const { data: revenueData } = useQuery<RevenueData>({
    queryKey: ["admin-revenue"],
    queryFn: async () => {
      const res = await api.get("/admin/revenue-data");
      return res.data.data;
    },
  });

  const stats = data?.stats || fallbackStats;
  const recentReturns = data?.recentReturns || [];
  const chartData = data?.chartData || [];

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load dashboard"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <PageHeader title="Admin Dashboard" subtitle="Overview of your platform" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              {isLoading ? <div className="h-5 w-5 animate-pulse rounded bg-muted" /> : <Users className="h-5 w-5 text-primary" />}
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-7 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </>
          )}
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              {isLoading ? <div className="h-5 w-5 animate-pulse rounded bg-muted" /> : <FileText className="h-5 w-5 text-emerald-500" />}
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-7 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">{stats.totalReturns.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Returns</p>
            </>
          )}
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              {isLoading ? <div className="h-5 w-5 animate-pulse rounded bg-muted" /> : <Wallet className="h-5 w-5 text-amber-500" />}
            </div>
            {revenueData && revenueData.growthPercent !== 0 && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${revenueData.growthPercent > 0 ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}>
                {revenueData.growthPercent > 0 ? "+" : ""}{revenueData.growthPercent}%
              </span>
            )}
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-7 w-28 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">{formatPKR(revenueData?.totalRevenue ?? stats.monthlyRevenue)}</p>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
            </>
          )}
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
              {isLoading ? <div className="h-5 w-5 animate-pulse rounded bg-muted" /> : <Clock className="h-5 w-5 text-rose-500" />}
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-7 w-20 animate-pulse rounded bg-muted" />
              <div className="h-4 w-24 animate-pulse rounded bg-muted/50" />
            </div>
          ) : (
            <>
              <p className="text-2xl font-bold">{stats.pendingReviews}</p>
              <p className="text-sm text-muted-foreground">Pending Reviews</p>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-indigo-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalNtn.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">NTN Registrations</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-teal-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalGst.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">GST Registrations</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Building2 className="h-5 w-5 text-cyan-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalSecp.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">SECP Registrations</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-violet-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalIp.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">IP Registrations</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-orange-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalConsultations.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Consultations</p>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="h-10 w-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Globe className="h-5 w-5 text-pink-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalUsaServices.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">USA Services</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader><CardTitle className="text-lg">Active Users vs Consultants</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-muted/50" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted/50" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Active Users</span>
                  </div>
                  <span className="text-lg font-bold">{stats.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-medium">Consultants</span>
                  </div>
                  <span className="text-lg font-bold">{stats.consultants}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {chartData.length > 0 && (
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader><CardTitle className="text-lg">Monthly Registrations</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {chartData.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-10">{item.month}</span>
                    <div className="flex-1 h-6 rounded bg-muted/50 overflow-hidden">
                      <div
                        className="h-full rounded bg-primary/70 transition-all"
                        style={{ width: `${Math.min(100, (item.count / Math.max(...chartData.map(d => d.count))) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-10 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {revenueData && revenueData.revenueChart.length > 0 && (
          <Card className="rounded-2xl border-border/50 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Monthly Revenue (12 months)</span>
                <span className="text-sm font-normal text-muted-foreground">{formatPKR(revenueData.totalRevenue)} total</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {revenueData.revenueChart.map((item, i) => {
                  const maxRevenue = Math.max(...revenueData.revenueChart.map(d => d.revenue));
                  const pct = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-24">{item.month}</span>
                      <div className="flex-1 h-6 rounded bg-muted/50 overflow-hidden">
                        <div
                          className="h-full rounded bg-emerald-500/70 transition-all"
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-24 text-right">{formatPKR(item.revenue)}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="rounded-2xl border-border/50 shadow-sm mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Tax Returns</CardTitle>
            <Button variant="outline" size="sm" asChild><Link to="/admin/returns">View All</Link></Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 rounded-lg bg-muted/50 animate-pulse" />
              ))}
            </div>
          ) : recentReturns.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No recent returns</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">User</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Year</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                    <th className="text-right py-3 px-2 font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReturns.map((r) => (
                    <tr key={r.id} className="border-b border-border/30 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-medium">{r.user.name}</span>
                        <span className="block text-xs text-muted-foreground">{r.user.email}</span>
                      </td>
                      <td className="py-3 px-2">{r.returnType}</td>
                      <td className="py-3 px-2">{r.taxYear}</td>
                      <td className="py-3 px-2"><StatusBadge status={r.status} /></td>
                      <td className="py-3 px-2 text-muted-foreground">{formatDate(r.createdAt)}</td>
                      <td className="py-3 px-2 text-right">
                        <Button variant="ghost" size="sm" asChild><Link to="/admin/returns">View</Link></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
