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

const FIELDS_OF_INVENTION = [
  { value: "MECHANICAL", label: "Mechanical Engineering" },
  { value: "ELECTRICAL", label: "Electrical / Electronics" },
  { value: "CHEMICAL", label: "Chemical / Pharmaceutical" },
  { value: "BIOTECH", label: "Biotechnology" },
  { value: "SOFTWARE", label: "Software / Computer Science" },
  { value: "MEDICAL", label: "Medical / Healthcare" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "OTHER", label: "Other" },
];

const formSchema = z.object({
  inventorName: z.string().min(2, "Inventor name is required"),
  cnic: z
    .string()
    .min(15, "CNIC must be in format XXXXX-XXXXXXX-X")
    .regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  patentTitle: z.string().min(5, "Patent title is required"),
  fieldOfInvention: z.string().min(1, "Please select a field"),
  abstract: z
    .string()
    .min(50, "Abstract must be at least 50 characters")
    .max(500, "Abstract must not exceed 500 characters"),
  claims: z.string().min(20, "Claims must be at least 20 characters"),
  priorArtSearch: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function PatentRegistration() {
  const [showPayment, setShowPayment] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/ip-services", data).then((r) => r.data),
    onError: () => toast.error("Failed to submit patent application"),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inventorName: "",
      cnic: "",
      patentTitle: "",
      fieldOfInvention: "",
      abstract: "",
      claims: "",
      priorArtSearch: false,
    },
  });

  const handleSubmit = form.handleSubmit(() => {
    setShowPayment(true);
  });

  const handlePaymentSuccess = (_paymentId: string) => {
    const values = form.getValues();
    submitMutation.mutate({
      type: "PATENT",
      formData: values,
      fee: values.priorArtSearch ? 14999 + 4999 : 14999,
    });
    toast.success("Patent application submitted successfully!");
    setShowPayment(false);
    form.reset();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Patent Registration"
        subtitle="File a patent application with Pakistan Patent Office"
      />

      <div className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
        <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-600">
          Patent grant typically takes 3-5 years. A provisional application can
          be filed first (12 months) to secure an early priority date.
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Inventor Name(s)</Label>
                <Input
                  placeholder="Full name of inventor(s)"
                  {...form.register("inventorName")}
                />
                {form.formState.errors.inventorName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.inventorName.message}
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
                <Label>Patent Title</Label>
                <Input
                  placeholder="Title of the invention"
                  {...form.register("patentTitle")}
                />
                {form.formState.errors.patentTitle && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.patentTitle.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Field of Invention</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("fieldOfInvention")}
                >
                  <option value="">Select field</option>
                  {FIELDS_OF_INVENTION.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.fieldOfInvention && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.fieldOfInvention.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Abstract (max 500 characters)</Label>
                <Textarea
                  placeholder="Brief summary of the invention"
                  rows={4}
                  maxLength={500}
                  {...form.register("abstract")}
                />
                <div className="flex justify-between">
                  {form.formState.errors.abstract && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.abstract.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground ml-auto">
                    {(form.watch("abstract") || "").length}/500
                  </p>
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Claims</Label>
                <Textarea
                  placeholder="Describe what you claim as your invention. List each claim on a new line."
                  rows={6}
                  {...form.register("claims")}
                />
                {form.formState.errors.claims && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.claims.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Drawings / Diagrams</Label>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload technical drawings or diagrams (PDF, PNG, JPEG)
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="max-w-xs mx-auto"
                    multiple
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <input
                  type="checkbox"
                  id="priorArtSearch"
                  className="h-4 w-4 rounded border-border"
                  {...form.register("priorArtSearch")}
                />
                <Label
                  htmlFor="priorArtSearch"
                  className="text-sm font-normal cursor-pointer"
                >
                  I would like to add a prior art search report (additional Rs.
                  4,999)
                </Label>
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Filing Fee</p>
                <p className="text-xl font-bold">{formatPKR(14999)}</p>
                {form.watch("priorArtSearch") && (
                  <p className="text-xs text-muted-foreground mt-1">
                    + Rs. 4,999 prior art search
                  </p>
                )}
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
        amount={form.watch("priorArtSearch") ? 14999 + 4999 : 14999}
        serviceType="Patent Registration"
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
}
