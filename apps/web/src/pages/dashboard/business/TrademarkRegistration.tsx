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

const TRADEMARK_TYPES = [
  { value: "WORD", label: "Word Mark" },
  { value: "LOGO", label: "Logo / Device Mark" },
  { value: "COMBINED", label: "Combined (Word + Logo)" },
  { value: "SLOGAN", label: "Slogan / Tagline" },
];

const TRADEMARK_CLASSES = Array.from({ length: 45 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}));

const formSchema = z.object({
  applicantName: z.string().min(2, "Applicant name is required"),
  cnic: z
    .string()
    .min(15, "CNIC must be in format XXXXX-XXXXXXX-X")
    .regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  address: z.string().min(5, "Address is required"),
  brandName: z.string().min(2, "Brand/Trademark name is required"),
  trademarkType: z.string().min(1, "Please select a type"),
  class: z.string().min(1, "Please select a class"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function TrademarkRegistration() {
  const [showPayment, setShowPayment] = useState(false);

  const submitMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/ip-services", data).then((r) => r.data),
    onError: () => toast.error("Failed to submit trademark application"),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicantName: "",
      cnic: "",
      address: "",
      brandName: "",
      trademarkType: "",
      class: "",
      description: "",
    },
  });

  const handleSubmit = form.handleSubmit(() => {
    setShowPayment(true);
  });

  const handlePaymentSuccess = (_paymentId: string) => {
    submitMutation.mutate({
      type: "TRADEMARK",
      formData: form.getValues(),
      fee: 9999,
    });
    toast.success("Trademark application submitted successfully!");
    setShowPayment(false);
    form.reset();
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Trademark Registration"
        subtitle="Register your trademark with IPO Pakistan"
      />

      <div className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex items-start gap-2">
        <Clock className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-600">
          IPO Pakistan trademark registration typically takes 18-24 months for
          complete processing. Provisional filing provides immediate priority
          date.
        </p>
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Applicant Name</Label>
                <Input
                  placeholder="Full name"
                  {...form.register("applicantName")}
                />
                {form.formState.errors.applicantName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.applicantName.message}
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
                <Label>Address</Label>
                <Input
                  placeholder="Complete address"
                  {...form.register("address")}
                />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Brand / Trademark Name</Label>
                <Input
                  placeholder="Name of your brand or trademark"
                  {...form.register("brandName")}
                />
                {form.formState.errors.brandName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.brandName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Trademark Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("trademarkType")}
                >
                  <option value="">Select type</option>
                  {TRADEMARK_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.trademarkType && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.trademarkType.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Class (Nice Classification)</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("class")}
                >
                  <option value="">Select class</option>
                  {TRADEMARK_CLASSES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.class && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.class.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Logo / Device Image</Label>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload trademark image (if applicable)
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your trademark and the goods/services it represents"
                  rows={4}
                  {...form.register("description")}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Registration Fee
                </p>
                <p className="text-xl font-bold">{formatPKR(9999)}</p>
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
        amount={9999}
        serviceType="Trademark Registration"
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
}
