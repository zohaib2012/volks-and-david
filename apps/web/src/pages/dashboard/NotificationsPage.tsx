import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  CheckCheck,
  Bell,
  AlertCircle,
  FileText,
  CreditCard,
  Calendar,
  Clock,
  Trash2,
  Mail,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

const tabOptions = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "RETURN_STATUS", label: "Tax Returns" },
  { id: "TAX_DEADLINE", label: "Tax Deadlines" },
  { id: "PAYMENT", label: "Payments" },
  { id: "CONSULTATION", label: "Consultations" },
  { id: "FBR_NOTICE", label: "FBR Notices" },
];

const typeIcons: Record<string, React.ReactNode> = {
  TAX_DEADLINE: <Clock className="h-5 w-5" />,
  RETURN_STATUS: <FileText className="h-5 w-5" />,
  PAYMENT: <CreditCard className="h-5 w-5" />,
  CONSULTATION: <Calendar className="h-5 w-5" />,
  SYSTEM: <Bell className="h-5 w-5" />,
  REFERRAL: <Mail className="h-5 w-5" />,
  FBR_NOTICE: <AlertCircle className="h-5 w-5" />,
};

const typeIconBg: Record<string, string> = {
  TAX_DEADLINE: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
  RETURN_STATUS: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  PAYMENT: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  CONSULTATION: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  SYSTEM: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  REFERRAL: "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  FBR_NOTICE: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return formatDate(dateString);
}

function groupNotificationsByDate(
  notifications: Notification[],
): Record<string, Notification[]> {
  const groups: Record<string, Notification[]> = {};
  notifications.forEach((n) => {
    const dateKey = new Date(n.createdAt).toDateString();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(n);
  });
  return groups;
}

function formatDateHeader(dateKey: string): string {
  const date = new Date(dateKey);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(dateKey);
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["notifications", activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab === "unread") {
        params.set("unread", "true");
      } else if (activeTab !== "all") {
        params.set("type", activeTab);
      }
      const res = await api.get(`/notifications?${params}`);
      return res.data;
    },
  });

  const notifications: Notification[] = data?.data || [];
  const grouped = groupNotificationsByDate(notifications);

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await api.put("/notifications/read-all");
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => toast.error("Failed to mark all as read"),
  });

  const handleMarkAllRead = () => markAllReadMutation.mutate();

  const handleMarkRead = (id: string) => {
    markReadMutation.mutate(id);
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load notifications"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Notifications"
        subtitle="Stay updated with your tax and account activities"
        action={
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={markAllReadMutation.isPending}
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            {markAllReadMutation.isPending ? "Marking..." : "Mark All Read"}
          </Button>
        }
      />

      <div className="flex border-b border-border mb-6 overflow-x-auto">
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-12 w-12 text-muted-foreground" />}
          title="No notifications"
          description={
            activeTab === "all"
              ? "You're all caught up! No new notifications."
              : `No ${activeTab.replace("_", " ")} notifications.`
          }
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([dateKey, items]) => (
            <div key={dateKey}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {formatDateHeader(dateKey)}
              </h3>
              <Card>
                <CardContent className="p-0">
                  {items.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() =>
                        !notification.isRead && handleMarkRead(notification.id)
                      }
                      className={`p-4 flex items-start gap-4 cursor-pointer transition-colors hover:bg-muted/30 ${
                        index < items.length - 1
                          ? "border-b border-border/50"
                          : ""
                      } ${!notification.isRead ? "bg-primary/5" : ""}`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                          typeIconBg[notification.type] || typeIconBg.system
                        }`}
                      >
                        {typeIcons[notification.type] || (
                          <Bell className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                            <h4
                              className={`font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {notification.title}
                            </h4>
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
