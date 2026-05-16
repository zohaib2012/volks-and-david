import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Monitor,
  MapPin,
  Clock,
  LogOut,
  AlertTriangle,
  Copy,
  RefreshCw,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const activeSessions = [
  {
    id: "1",
    device: "Chrome on Windows",
    location: "Karachi, Pakistan",
    ip: "192.168.1.100",
    lastActive: "2025-01-10T14:30:00",
    isCurrent: true,
  },
  {
    id: "2",
    device: "Safari on iPhone",
    location: "Lahore, Pakistan",
    ip: "192.168.1.101",
    lastActive: "2025-01-09T08:15:00",
    isCurrent: false,
  },
];

const loginHistory = [
  {
    id: "1",
    date: "2025-01-10T14:30:00",
    device: "Chrome on Windows",
    location: "Karachi, Pakistan",
    ip: "192.168.1.100",
    status: "SUCCESS",
  },
  {
    id: "2",
    date: "2025-01-09T08:15:00",
    device: "Safari on iPhone",
    location: "Lahore, Pakistan",
    ip: "192.168.1.101",
    status: "SUCCESS",
  },
  {
    id: "3",
    date: "2025-01-08T22:45:00",
    device: "Firefox on Linux",
    location: "Unknown",
    ip: "10.0.0.5",
    status: "FAILED",
  },
  {
    id: "4",
    date: "2025-01-07T16:20:00",
    device: "Edge on Windows",
    location: "Karachi, Pakistan",
    ip: "192.168.1.100",
    status: "SUCCESS",
  },
  {
    id: "5",
    date: "2025-01-05T11:00:00",
    device: "Chrome on macOS",
    location: "Islamabad, Pakistan",
    ip: "172.16.0.50",
    status: "SUCCESS",
  },
];

const backupCodes = [
  "ABCD-1234",
  "WXYZ-5678",
  "LMNO-9012",
  "PQRS-3456",
  "TUVW-7890",
];

function getPasswordStrength(password: string): {
  level: number;
  label: string;
  color: string;
} {
  if (password.length === 0) return { level: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { level: 2, label: "Fair", color: "bg-orange-500" };
  if (score <= 4) return { level: 3, label: "Good", color: "bg-blue-500" };
  return { level: 4, label: "Strong", color: "bg-emerald-500" };
}

export default function SecuritySettingsPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const passwordStrength = getPasswordStrength(passwords.new);

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await api.put("/auth/change-password", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to change password");
    },
  });

  const handleChangePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      toast.error("Please fill in all fields");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordStrength.level < 2) {
      toast.error("Please choose a stronger password");
      return;
    }
    changePasswordMutation.mutate({ currentPassword: passwords.current, newPassword: passwords.new });
  };

  const handleToggle2FA = () => {
    toast("2FA setup coming soon — contact support to enable", { icon: "🔒" });
  };

  const handleLogoutSession = (sessionId: string) => {
    toast("Session management coming soon", { icon: "ℹ️" });
  };

  const handleLogoutAll = () => {
    toast("Session management coming soon", { icon: "ℹ️" });
  };

  const handleCopyBackupCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    toast.success("Code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const sessionColumns: Column<(typeof activeSessions)[0]>[] = [
    {
      key: "device",
      header: "Device",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">{item.device}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {item.location}
            </p>
          </div>
          {item.isCurrent && (
            <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 ml-2">
              Current
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "ip",
      header: "IP Address",
      render: (item) => <span className="font-mono text-sm">{item.ip}</span>,
    },
    {
      key: "lastActive",
      header: "Last Active",
      render: (item) => (
        <span className="text-sm flex items-center gap-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          {formatDate(item.lastActive)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (item) =>
        !item.isCurrent ? (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={() => handleLogoutSession(item.id)}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        ) : null,
    },
  ];

  const historyColumns: Column<(typeof loginHistory)[0]>[] = [
    {
      key: "date",
      header: "Date & Time",
      render: (item) => formatDate(item.date),
      sortable: true,
    },
    {
      key: "device",
      header: "Device",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Monitor className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{item.device}</span>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (item) => (
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          {item.location}
        </div>
      ),
    },
    {
      key: "ip",
      header: "IP",
      render: (item) => <span className="font-mono text-xs">{item.ip}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            item.status === "SUCCESS"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Security Settings"
        subtitle="Keep your account secure with password and 2FA settings"
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your account password regularly for security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrent ? "text" : "password"}
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, current: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, new: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwords.new.length > 0 && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full ${
                          level <= passwordStrength.level
                            ? passwordStrength.color
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p
                    className={`text-xs font-medium ${
                      passwordStrength.label === "Weak"
                        ? "text-red-500"
                        : passwordStrength.label === "Fair"
                          ? "text-orange-500"
                          : passwordStrength.label === "Good"
                            ? "text-blue-500"
                            : "text-emerald-500"
                    }`}
                  >
                    {passwordStrength.label}
                  </p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, confirm: e.target.value }))
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwords.confirm.length > 0 && passwords.new.length > 0 && (
                <p
                  className={`text-xs ${
                    passwords.new === passwords.confirm
                      ? "text-emerald-500"
                      : "text-red-500"
                  }`}
                >
                  {passwords.new === passwords.confirm
                    ? "✓ Passwords match"
                    : "✗ Passwords do not match"}
                </p>
              )}
            </div>
            <Button onClick={handleChangePassword} disabled={changePasswordMutation.isPending}>
              {changePasswordMutation.isPending ? "Changing..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </div>
              <Switch
                checked={twoFAEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>
          </CardHeader>
          {twoFAEnabled && (
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex h-40 w-40 items-center justify-center rounded-lg border-2 border-dashed border-border shrink-0">
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">
                      QR Code Placeholder
                    </p>
                    <p className="text-xs text-muted-foreground">
                      (Scan with Authy/Google Authenticator)
                    </p>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Can't scan the QR code?
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Enter this code manually in your authenticator app:
                    </p>
                    <code className="inline-block rounded-lg bg-muted px-3 py-2 font-mono text-sm">
                      JBSWY3DPEHPK3PXP
                    </code>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Verify setup</p>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        className="w-40"
                      />
                      <Button>Verify</Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium">Backup Codes</p>
                    <p className="text-xs text-muted-foreground">
                      Save these codes to recover your account if you lose your
                      device
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBackupCodes(!showBackupCodes)}
                  >
                    {showBackupCodes ? "Hide Codes" : "Show Codes"}
                  </Button>
                </div>
                {showBackupCodes && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {backupCodes.map((code) => (
                      <div
                        key={code}
                        className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                          copiedCode === code
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-muted/50"
                        }`}
                      >
                        <code className="font-mono text-sm">{code}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => handleCopyBackupCode(code)}
                        >
                          <Copy
                            className={`h-3.5 w-3.5 ${copiedCode === code ? "text-emerald-500" : ""}`}
                          />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Important: Store these backup codes in a safe place. Each
                    code can be used only once. You can generate new codes if
                    you suspect they've been compromised.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage devices currently logged into your account
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogoutAll}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out All Others
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={sessionColumns}
              data={activeSessions}
              keyExtractor={(item) => item.id}
              emptyTitle="No active sessions"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Login History</CardTitle>
            <CardDescription>
              Review your recent login activity (last 10 logins)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={historyColumns}
              data={loginHistory}
              keyExtractor={(item) => item.id}
              emptyTitle="No login history"
            />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
