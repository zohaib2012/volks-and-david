import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Bell,
  Mail,
  MessageCircle,
  Smartphone,
  FileText,
  CreditCard,
  Calendar,
  Clock,
  AlertCircle,
  Info,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface NotificationPref {
  email: boolean;
  sms: boolean;
  push: boolean;
  whatsapp: boolean;
}

interface NotificationGroup {
  id: string;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  prefs: NotificationPref;
}

export default function NotificationSettingsPage() {
  const [groups, setGroups] = useState<NotificationGroup[]>([
    {
      id: "tax_return",
      label: "Tax Return Updates",
      description:
        "Get notified about your tax return status, reviews, and approvals",
      icon: FileText,
      prefs: { email: true, sms: false, push: true, whatsapp: false },
    },
    {
      id: "payment",
      label: "Payment Confirmations",
      description: "Receive confirmations for successful payments and refunds",
      icon: CreditCard,
      prefs: { email: true, sms: true, push: true, whatsapp: true },
    },
    {
      id: "consultation",
      label: "Consultation Reminders",
      description: "Get reminders before your scheduled consultations",
      icon: Calendar,
      prefs: { email: true, sms: true, push: true, whatsapp: true },
    },
    {
      id: "deadline",
      label: "Tax Deadline Alerts",
      description: "Important reminders about upcoming tax filing deadlines",
      icon: Clock,
      prefs: { email: true, sms: true, push: true, whatsapp: true },
    },
    {
      id: "fbr_notice",
      label: "FBR Notice Alerts",
      description:
        "Get notified immediately about any new FBR notices or updates",
      icon: AlertCircle,
      prefs: { email: true, sms: true, push: true, whatsapp: true },
    },
    {
      id: "system",
      label: "System & Security",
      description:
        "Account security alerts, password changes, and login notifications",
      icon: Info,
      prefs: { email: true, sms: true, push: true, whatsapp: false },
    },
    {
      id: "marketing",
      label: "Marketing & Offers",
      description:
        "New feature announcements, promotions, and referral rewards",
      icon: Bell,
      prefs: { email: false, sms: false, push: false, whatsapp: false },
    },
  ]);

  const [globalPrefs, setGlobalPrefs] = useState<NotificationPref>({
    email: true,
    sms: true,
    push: true,
    whatsapp: true,
  });

  const toggleGlobal = (channel: keyof NotificationPref) => {
    const newValue = !globalPrefs[channel];
    setGlobalPrefs((p) => ({ ...p, [channel]: newValue }));
    if (!newValue) {
      setGroups((groups) =>
        groups.map((g) => ({
          ...g,
          prefs: { ...g.prefs, [channel]: false },
        })),
      );
    }
  };

  const toggleGroupPref = (
    groupId: string,
    channel: keyof NotificationPref,
  ) => {
    setGroups((groups) =>
      groups.map((g) =>
        g.id === groupId
          ? { ...g, prefs: { ...g.prefs, [channel]: !g.prefs[channel] } }
          : g,
      ),
    );
  };

  const { data: savedPrefs } = useQuery({
    queryKey: ["notification-preferences"],
    queryFn: async () => {
      const res = await api.get("/notifications/preferences");
      return res.data?.data as Record<string, any> | null;
    },
  });

  useEffect(() => {
    if (!savedPrefs) return;
    if (savedPrefs.global) setGlobalPrefs(savedPrefs.global);
    if (savedPrefs.groups) {
      setGroups((prev) =>
        prev.map((g) =>
          savedPrefs.groups[g.id] ? { ...g, prefs: savedPrefs.groups[g.id] } : g,
        ),
      );
    }
  }, [savedPrefs]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const groupPrefs = groups.reduce((acc, g) => {
        acc[g.id] = g.prefs;
        return acc;
      }, {} as Record<string, any>);
      const res = await api.put("/notifications/preferences", {
        preferences: { global: globalPrefs, groups: groupPrefs },
      });
      return res.data;
    },
    onSuccess: () => toast.success("Notification preferences saved!"),
    onError: () => toast.error("Failed to save preferences"),
  });

  const handleSave = () => saveMutation.mutate();

  const channels = [
    {
      key: "email" as const,
      label: "Email",
      icon: Mail,
      description: "Sent to your registered email",
    },
    {
      key: "sms" as const,
      label: "SMS",
      icon: Smartphone,
      description: "Text messages to your phone",
    },
    {
      key: "push" as const,
      label: "Push",
      icon: Bell,
      description: "Browser/app notifications",
    },
    {
      key: "whatsapp" as const,
      label: "WhatsApp",
      icon: MessageCircle,
      description: "Messages on WhatsApp",
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Notification Settings"
        subtitle="Customize how and when you receive notifications"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Preferences</CardTitle>
            <CardDescription>
              Master switches for all notification channels. Turning these off
              will disable all notifications for that channel.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.key}
                    className={`rounded-xl border p-4 transition-colors ${
                      globalPrefs[channel.key]
                        ? "border-border bg-background"
                        : "border-border/50 bg-muted/30"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          globalPrefs[channel.key]
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <Switch
                        checked={globalPrefs[channel.key]}
                        onCheckedChange={() => toggleGlobal(channel.key)}
                      />
                    </div>
                    <h4 className="font-medium mb-1">{channel.label}</h4>
                    <p className="text-xs text-muted-foreground">
                      {channel.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Categories</CardTitle>
            <CardDescription>
              Fine-tune which notifications you receive on each channel
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Header Row */}
            <div className="hidden sm:grid grid-cols-6 gap-4 px-6 py-3 border-b border-border bg-muted/50">
              <div className="col-span-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Category
                </span>
              </div>
              {channels.map((ch) => (
                <div key={ch.key} className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <ch.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {ch.label}
                    </span>
                    {!globalPrefs[ch.key] && (
                      <Badge
                        variant="outline"
                        className="text-[10px] h-5 px-1.5 text-muted-foreground border-muted-foreground/30"
                      >
                        Off
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows */}
            {groups.map((group, index) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.id}
                  className={`px-6 py-4 ${
                    index < groups.length - 1 ? "border-b border-border/50" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 shrink-0 mt-0.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 sm:flex sm:items-center sm:gap-4">
                      <div className="sm:hidden flex items-center gap-3 mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 shrink-0">
                          <Icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{group.label}</h4>
                        </div>
                      </div>
                      <div className="sm:w-1/3">
                        <h4 className="hidden sm:block font-medium text-sm mb-0.5">
                          {group.label}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                      <div className="flex-1 grid grid-cols-4 sm:grid-cols-4 gap-3 mt-3 sm:mt-0">
                        {channels.map((ch) => (
                          <div
                            key={ch.key}
                            className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2"
                          >
                            <span className="text-xs text-muted-foreground sm:hidden">
                              {ch.label}
                            </span>
                            <Switch
                              checked={
                                globalPrefs[ch.key] && group.prefs[ch.key]
                              }
                              disabled={!globalPrefs[ch.key]}
                              onCheckedChange={() =>
                                toggleGroupPref(group.id, ch.key)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setGlobalPrefs({
                email: true,
                sms: true,
                push: true,
                whatsapp: true,
              });
              setGroups((prev) =>
                prev.map((g) => ({
                  ...g,
                  prefs: {
                    email: g.id !== "marketing",
                    sms: [
                      "payment",
                      "consultation",
                      "deadline",
                      "fbr_notice",
                      "system",
                    ].includes(g.id),
                    push: g.id !== "marketing",
                    whatsapp: [
                      "payment",
                      "consultation",
                      "deadline",
                      "fbr_notice",
                    ].includes(g.id),
                  },
                })),
              );
              toast.success("Reset to defaults");
            }}
          >
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={saveMutation.isPending}>
            {saveMutation.isPending ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
