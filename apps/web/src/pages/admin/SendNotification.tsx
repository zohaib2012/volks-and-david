import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Send, Users, Bell, AlertCircle, Loader2, Search } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

const NOTIFICATION_TYPES = [
  "TAX_DEADLINE",
  "RETURN_STATUS",
  "PAYMENT",
  "CONSULTATION",
  "SYSTEM",
  "FBR_NOTICE",
] as const;

interface NotificationForm {
  recipient: "ALL" | "SPECIFIC";
  userId: string;
  type: string;
  title: string;
  message: string;
}

interface UserSearchResult {
  id: string;
  name: string;
  email: string;
}

interface SentNotification {
  id: string;
  user: { id: string; name: string; email: string };
  type: string;
  title: string;
  message: string | null;
  isRead: boolean;
  createdAt: string;
}

const initialForm: NotificationForm = {
  recipient: "ALL",
  userId: "",
  type: "SYSTEM",
  title: "",
  message: "",
};

export default function SendNotification() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<NotificationForm>(initialForm);
  const [userSearch, setUserSearch] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-search", userSearch],
    queryFn: async () => {
      const res = await api.get(`/admin/users?search=${encodeURIComponent(userSearch)}&limit=10`);
      return res.data.data as UserSearchResult[];
    },
    enabled: userSearch.length > 0,
  });

  const { data: notificationsData, isLoading: notifsLoading } = useQuery({
    queryKey: ["admin-sent-notifications"],
    queryFn: async () => {
      const res = await api.get("/admin/notifications?limit=20");
      return res.data.data as SentNotification[];
    },
  });

  const sendMutation = useMutation({
    mutationFn: async (body: NotificationForm) => {
      const payload = {
        recipient: body.recipient,
        type: body.type,
        title: body.title,
        message: body.message,
        ...(body.recipient === "SPECIFIC" && { userId: body.userId }),
      };
      const res = await api.post("/admin/notifications", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Notification sent successfully");
      setForm(initialForm);
      setUserSearch("");
      queryClient.invalidateQueries({ queryKey: ["admin-sent-notifications"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to send notification");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    if (form.recipient === "SPECIFIC" && !form.userId) {
      toast.error("Please select a user");
      return;
    }
    sendMutation.mutate(form);
  };

  const selectUser = (user: UserSearchResult) => {
    setForm((p) => ({ ...p, userId: user.id }));
    setUserSearch(user.name);
    setShowUserDropdown(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="Send Notification" subtitle="Send push notifications to users" />

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Compose Notification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Recipient</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={form.recipient === "ALL" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm((p) => ({ ...p, recipient: "ALL", userId: "" }))}
                    className="flex-1"
                  >
                    <Users className="h-4 w-4 mr-1.5" />
                    All Users
                  </Button>
                  <Button
                    type="button"
                    variant={form.recipient === "SPECIFIC" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm((p) => ({ ...p, recipient: "SPECIFIC" }))}
                    className="flex-1"
                  >
                    <Search className="h-4 w-4 mr-1.5" />
                    Specific User
                  </Button>
                </div>
              </div>

              {form.recipient === "SPECIFIC" && (
                <div className="space-y-1.5 relative">
                  <Label>Search User</Label>
                  <Input
                    placeholder="Type user name or email..."
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                      setForm((p) => ({ ...p, userId: "" }));
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                  />
                  {showUserDropdown && userSearch.length > 0 && (
                    <div className="absolute z-50 top-full mt-1 w-full rounded-lg border border-border bg-card shadow-xl max-h-48 overflow-y-auto">
                      {usersLoading ? (
                        <div className="p-3 text-sm text-muted-foreground">Searching...</div>
                      ) : usersData && usersData.length > 0 ? (
                        usersData.map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors"
                            onClick={() => selectUser(u)}
                          >
                            <span className="font-medium">{u.name}</span>
                            <span className="text-muted-foreground ml-2">({u.email})</span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-sm text-muted-foreground">No users found</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-1.5">
                <Label>Type</Label>
                <select
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                >
                  {NOTIFICATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label>Title</Label>
                <Input
                  placeholder="Notification title"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Message (optional)</Label>
                <Textarea
                  placeholder="Enter notification message..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={sendMutation.isPending || !form.title.trim()}
              >
                {sendMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Send Notification
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifsLoading ? (
              <LoadingSpinner size="sm" />
            ) : !notificationsData || notificationsData.length === 0 ? (
              <EmptyState icon={<Bell className="h-8 w-8" />} title="No notifications sent yet" />
            ) : (
              <div className="space-y-3">
                {notificationsData.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-lg border border-border/50 p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-muted-foreground">
                        To: {n.user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatDate(n.createdAt)}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">{n.title}</p>
                    {n.message && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={n.type} />
                      {n.isRead ? (
                        <span className="text-xs text-muted-foreground">Read</span>
                      ) : (
                        <span className="text-xs text-amber-500">Unread</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
