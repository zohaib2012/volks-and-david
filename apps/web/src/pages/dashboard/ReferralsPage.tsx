import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Copy,
  MessageCircle,
  Share2,
  Gift,
  Users,
  CheckCircle,
  Clock,
  Wallet,
  AlertCircle,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPKR, formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Badge } from "@/components/ui/badge";

interface Referral {
  id: string;
  name: string;
  email: string;
  status: "REGISTERED" | "CONVERTED" | "PENDING";
  joinedDate: string;
  rewardAmount: number;
}

interface ReferralStats {
  totalReferred: number;
  successful: number;
  totalEarned: number;
  pending: number;
}

const howItWorks = [
  {
    step: 1,
    title: "Share Your Code",
    description:
      "Share your unique referral code with friends via WhatsApp, email, or direct link.",
    icon: UserPlus,
  },
  {
    step: 2,
    title: "They Sign Up",
    description:
      "When your friend signs up using your code, they get a discount on their first service.",
    icon: Users,
  },
  {
    step: 3,
    title: "You Earn Rewards",
    description:
      "Once they make their first paid service, you earn Rs. 500 credited to your wallet!",
    icon: Gift,
  },
];

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { user } = useAuthStore();

  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery<ReferralStats>({
    queryKey: ["referral-stats"],
    queryFn: async () => {
      const res = await api.get("/referrals/stats");
      return res.data.data;
    },
  });

  const {
    data: referralsData,
    isLoading: referralsLoading,
    error: referralsError,
  } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const res = await api.get("/referrals");
      return res.data;
    },
  });

  const referrals: Referral[] = referralsData?.data || [];

  const stats = statsData || {
    totalReferred: 12,
    successful: 5,
    totalEarned: 2500,
    pending: 2,
  };

  const effectiveCode = referralsData?.referralCode || user?.referralCode || "—";
  const referralLink = `https://volksanddavid.com/signup?ref=${effectiveCode}`;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(effectiveCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const handleShareWhatsApp = () => {
    const text = `Join Volks & David for tax filing and consulting! Use my referral code ${effectiveCode} to get a discount on your first service. ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    toast.success("Opening WhatsApp...");
  };

  const columns: Column<Referral>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "joinedDate",
      header: "Joined",
      render: (item) => formatDate(item.joinedDate),
    },
    {
      key: "rewardAmount",
      header: "Reward",
      render: (item) =>
        item.rewardAmount > 0 ? (
          <span className="text-emerald-600 font-medium">
            {formatPKR(item.rewardAmount)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  if (statsLoading || referralsLoading) return <LoadingSpinner size="lg" />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Refer & Earn"
        subtitle="Invite friends and earn rewards for every successful referral"
      />

      <Card className="mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-6 w-6 text-primary" />
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                  Limited Time Offer
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Earn Rs. 500 for every friend you refer!
              </h2>
              <p className="text-muted-foreground mb-6">
                Share your unique referral code. When your friend signs up and
                uses any paid service, both of you get rewarded.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleShareWhatsApp}>
                  <MessageCircle className="mr-2 h-4 w-4" /> Share on WhatsApp
                </Button>
                <Button variant="outline" onClick={handleCopyLink}>
                  <Share2 className="mr-2 h-4 w-4" /> Copy Link
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground mb-1">
                Your Referral Code
              </p>
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-mono font-bold tracking-wider text-primary">
                  {effectiveCode}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyCode}
                  className="h-10 w-10"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleShareWhatsApp} variant="outline">
                <MessageCircle className="mr-2 h-4 w-4 text-green-500" />{" "}
                WhatsApp
              </Button>
              <Button onClick={handleCopyLink} variant="outline">
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          icon={<Users className="h-6 w-6" />}
          label="Total Referred"
          value={stats.totalReferred}
          variant="default"
        />
        <StatsCard
          icon={<CheckCircle className="h-6 w-6" />}
          label="Successful"
          value={stats.successful}
          variant="success"
        />
        <StatsCard
          icon={<Wallet className="h-6 w-6" />}
          label="Total Earned"
          value={formatPKR(stats.totalEarned)}
          variant="default"
        />
        <StatsCard
          icon={<Clock className="h-6 w-6" />}
          label="Pending"
          value={stats.pending}
          variant="warning"
        />
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {howItWorks.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="relative flex flex-col items-center text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="absolute -right-3 top-7 hidden md:flex">
                    {index < howItWorks.length - 1 && (
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <Badge className="mb-2">Step {item.step}</Badge>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={referrals}
            keyExtractor={(item) => item.id}
            emptyTitle="No referrals yet"
            emptyDescription="Start sharing your referral code to earn rewards!"
            emptyAction={{
              label: "Copy Referral Code",
              onClick: handleCopyCode,
            }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
