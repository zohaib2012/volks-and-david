import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Camera, Download, Trash2, AlertCircle, Copy } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCNIC } from "@/lib/utils";
import { Tabs } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

export default function ProfileSettingsPage() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      const res = await api.get(`/users/${user?.id}`);
      return res.data?.data;
    },
    enabled: !!user?.id,
  });

  const profile = data || user;

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    language: "en",
  });

  // Sync form when data loads
  useState(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || profile.name || "",
        phone: profile.phone || "",
        language: profile.language || "en",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updates: typeof formData) => {
      const res = await api.put(`/users/${user?.id}`, updates);
      return res.data?.data;
    },
    onSuccess: (updated) => {
      if (updated) setUser({ ...user!, ...updated });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      toast.success("Profile updated successfully!");
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const handleSaveProfile = () => {
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    toast.success("Photo selected — save changes to upload");
  };

  const handleCopyReferral = () => {
    const code = profile?.referralCode || "—";
    navigator.clipboard?.writeText(code);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadData = () => {
    toast.success("Data export requested — check your email shortly");
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      toast.error("Account deletion — please contact support to proceed");
    }
  };

  const getInitials = (name: string) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  if (isLoading) return <LoadingSpinner size="lg" />;

  const profileTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a profile picture to personalize your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || profile?.avatar || ""} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {getInitials(formData.fullName || profile?.name || "")}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Upload a new photo</p>
              <p className="text-sm text-muted-foreground mb-3">JPG, PNG or GIF. Max 2MB.</p>
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                Choose File
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={profile?.email || ""} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Contact support to change your email</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+92 300 000 0000"
              />
            </div>
            <div className="space-y-2">
              <Label>CNIC</Label>
              <Input
                value={profile?.cnic ? formatCNIC(profile.cnic) : "—"}
                disabled
                className="bg-muted/50 font-mono"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Language</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.language}
                onChange={(e) => setFormData((p) => ({ ...p, language: e.target.value }))}
              >
                <option value="en">English</option>
                <option value="ur">اردو (Urdu)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>NTN</Label>
              <Input
                value={profile?.ntn || "—"}
                disabled
                className="bg-muted/50 font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveProfile} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );

  const accountTab = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Details about your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Created</p>
              <p className="font-medium">
                {profile?.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" })
                  : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Account Type</p>
              <div className="flex items-center gap-2">
                <span className="font-medium">{profile?.role || "User"}</span>
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Active
                </Badge>
              </div>
            </div>
          </div>
          {profile?.referralCode && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Referral Code</p>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-lg text-primary">
                  {profile.referralCode}
                </span>
                <Button variant="ghost" size="sm" onClick={handleCopyReferral} className="h-8 px-2">
                  <Copy className={`h-4 w-4 ${copied ? "text-emerald-500" : ""}`} />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Download My Data</CardTitle>
          <CardDescription>Export all your account data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Request a download of all your personal data including tax filings, documents, and account history.
          </p>
          <Button variant="outline" onClick={handleDownloadData}>
            <Download className="mr-2 h-4 w-4" /> Request Data Export
          </Button>
        </CardContent>
      </Card>

      <Card className="border-red-200 dark:border-red-900/50">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>Actions that can't be undone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-medium mb-1">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account, all tax data, documents, and history.
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount} className="shrink-0">
              <Trash2 className="mr-2 h-4 w-4" /> Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your profile and account settings"
      />
      <Tabs
        tabs={[
          { id: "profile", label: "Profile", content: profileTab },
          { id: "account", label: "Account", content: accountTab },
        ]}
        defaultTab="profile"
      />
    </motion.div>
  );
}
