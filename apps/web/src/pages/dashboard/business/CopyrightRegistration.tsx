import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentModal } from "@/components/shared/PaymentModal";
import { formatPKR, formatCNIC } from "@/lib/utils";

const WORK_TYPES = [
  { value: "LITERARY", label: "Literary Work" },
  { value: "ARTISTIC", label: "Artistic Work" },
  { value: "MUSICAL", label: "Musical Work" },
  { value: "DRAMATIC", label: "Dramatic Work" },
  { value: "SOFTWARE", label: "Software / Computer Program" },
  { value: "FILM", label: "Cinematograph Film" },
];

const formSchema = z.object({
  authorName: z.string().min(2, "Author name is required"),
  cnic: z
    .string()
    .min(15, "CNIC must be in format XXXXX-XXXXXXX-X")
    .regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  workTitle: z.string().min(2, "Work title is required"),
  workType: z.string().min(1, "Please select a work type"),
  dateOfCreation: z.string().min(1, "Date of creation is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function CopyrightRegistration() {
  const [showPayment, setShowPayment] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/ip-services", data).then((r) => r.data),
    onError: () => toast.error("Failed to submit copyright application"),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      authorName: "",
      cnic: "",
      workTitle: "",
      workType: "",
      dateOfCreation: "",
      description: "",
    },
  });

  const handleSubmit = form.handleSubmit(() => {
    setShowPayment(true);
  });

  const handlePaymentSuccess = (_paymentId: string) => {
    submitMutation.mutate({
      type: "COPYRIGHT",
      formData: form.getValues(),
      fee: 5999,
    });
    toast.success("Copyright registration submitted successfully!");
    setShowPayment(false);
    form.reset();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Copyright Registration"
        subtitle="Register your copyright with Pakistan Copyright Office"
      />

      <div className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
        <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-600">
          Copyright registration in Pakistan typically takes 2-3 months for
          processing.
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Author Name</Label>
                <Input
                  placeholder="Full name of the author"
                  {...form.register("authorName")}
                />
                {form.formState.errors.authorName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.authorName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>CNIC</Label>
                <Input
                  placeholder="XXXXX-XXXXXXX-X"
                  {...form.register("cnic")}
                  onChange={(e) => {
                    const formatted = formatCNIC(e.target.value);
                    form.setValue("cnic", formatted);
                  }}
                />
                {form.formState.errors.cnic && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.cnic.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Work Title</Label>
                <Input
                  placeholder="Title of the work"
                  {...form.register("workTitle")}
                />
                {form.formState.errors.workTitle && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.workTitle.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Work Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("workType")}
                >
                  <option value="">Select type</option>
                  {WORK_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.workType && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.workType.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Date of Creation</Label>
                <Input type="date" {...form.register("dateOfCreation")} />
                {form.formState.errors.dateOfCreation && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.dateOfCreation.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your work in detail"
                  rows={4}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Upload Work File</Label>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a copy of your work (PDF, DOC, or image)
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Registration Fee
                </p>
                <p className="text-xl font-bold">{formatPKR(5999)}</p>
              </div>
              <Button type="submit" size="lg">
                Proceed to Payment
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={5999}
        serviceType="Copyright Registration"
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
}
