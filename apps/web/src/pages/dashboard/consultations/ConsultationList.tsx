import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Plus,
  AlertCircle,
  Video,
  Phone,
  MessageSquare,
  Mail,
  Eye,
  Calendar,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface Consultation {
  id: string;
  consultantId: string | null;
  type: string;
  subject: string | null;
  description: string | null;
  scheduledAt: string | null;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  meetingLink: string | null;
  fee: number | null;
}

const typeIcons: Record<string, React.ReactNode> = {
  chat: <MessageSquare className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
};

const typeLabels: Record<string, string> = {
  chat: "Chat",
  call: "Call",
  video: "Video",
  email: "Email",
};

const typeVariants: Record<string, string> = {
  chat: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  call: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  video:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  email: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const tabOptions = [
  { id: "all", label: "All" },
  { id: "PENDING", label: "Pending" },
  { id: "CONFIRMED", label: "Confirmed" },
  { id: "COMPLETED", label: "Completed" },
];

const consultationTypes = ["chat", "call", "video", "email"] as const;

export default function ConsultationListPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [showBook, setShowBook] = useState(false);
  const [bookForm, setBookForm] = useState({
    type: "call" as typeof consultationTypes[number],
    subject: "",
    description: "",
    scheduledAt: "",
  });
  const queryClient = useQueryClient();

  const bookMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/consultations", payload).then((r) => r.data),
    onSuccess: () => {
      toast.success("Consultation booked successfully!");
      setShowBook(false);
      setBookForm({ type: "call", subject: "", description: "", scheduledAt: "" });
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
    },
    onError: () => toast.error("Failed to book consultation"),
  });

  const handleBook = () => {
    if (!bookForm.subject) { toast.error("Please enter a subject"); return; }
    if (!bookForm.scheduledAt) { toast.error("Please select a date & time"); return; }
    bookMutation.mutate({
      type: bookForm.type.toUpperCase(),
      subject: bookForm.subject,
      description: bookForm.description || null,
      scheduledAt: new Date(bookForm.scheduledAt).toISOString(),
    });
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["consultations", activeTab],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== "all") params.set("status", activeTab);
      const res = await api.get(`/consultations?${params}`);
      return res.data;
    },
  });

  const consultations: Consultation[] = data?.data || [];


  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load consultations"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Consultations"
        subtitle="Book and manage your tax consultant appointments"
        action={
          <Button onClick={() => setShowBook(true)}>
            <Plus className="mr-2 h-4 w-4" /> Book Consultation
          </Button>
        }
      />

      <div className="flex border-b border-border mb-6">
        {tabOptions.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {consultations.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-12 w-12 text-muted-foreground" />}
          title="No consultations found"
          description={
            activeTab === "all"
              ? "Book your first consultation to get expert tax advice."
              : `No ${activeTab.toLowerCase()} consultations.`
          }
          action={{
            label: "Book Consultation",
            onClick: () => setShowBook(true),
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {consultations.map((consultation) => (
            <motion.div
              key={consultation.id}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {consultation.consultantId ? "C" : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {consultation.consultantId ? "Assigned Consultant" : "Pending Assignment"}
                        </h3>
                        <p className="text-sm text-muted-foreground">Tax Consultant</p>
                      </div>
                    </div>
                    <StatusBadge status={consultation.status} />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {(() => {
                      const key = consultation.type?.toLowerCase() || "call";
                      return (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${typeVariants[key] || ""}`}>
                          {typeIcons[key]}
                          {typeLabels[key] || consultation.type}
                        </span>
                      );
                    })()}
                    <span className="text-sm text-muted-foreground">
                      {formatDate(consultation.scheduledAt)}
                    </span>
                  </div>

                  <p className="text-sm font-medium mb-4">
                    {consultation.subject || "—"}
                  </p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-2 h-4 w-4" /> View Details
                    </Button>
                    {consultation.status === "CONFIRMED" && (
                      <Button size="sm">Join</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Book Consultation Modal */}
      <Dialog open={showBook} onOpenChange={setShowBook}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book a Consultation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Consultation Type</Label>
              <div className="grid grid-cols-4 gap-2">
                {consultationTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setBookForm((p) => ({ ...p, type: t }))}
                    className={`rounded-lg border p-2 text-xs font-medium capitalize transition-all ${bookForm.type === t ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Subject *</Label>
              <Input
                placeholder="e.g. Tax return query"
                value={bookForm.subject}
                onChange={(e) => setBookForm((p) => ({ ...p, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of your query"
                value={bookForm.description}
                onChange={(e) => setBookForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Preferred Date & Time *</Label>
              <Input
                type="datetime-local"
                value={bookForm.scheduledAt}
                onChange={(e) => setBookForm((p) => ({ ...p, scheduledAt: e.target.value }))}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowBook(false)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleBook} disabled={bookMutation.isPending}>
                {bookMutation.isPending ? "Booking..." : "Book Consultation"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
