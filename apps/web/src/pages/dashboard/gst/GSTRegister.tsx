import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PaymentModal } from "@/components/shared/PaymentModal";

const gstSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  ntnNumber: z.string().min(1, "NTN number is required"),
  cnic: z.string().min(13, "CNIC is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address is required"),
  annualTurnover: z.string().min(1, "Annual turnover is required"),
  natureOfBusiness: z.string().min(2, "Nature of business is required"),
});

export default function GSTRegister() {
  const [showPayment, setShowPayment] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(gstSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      ntnNumber: "",
      cnic: "",
      phone: "",
      email: "",
      address: "",
      annualTurnover: "",
      natureOfBusiness: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/gst", data).then((r) => r.data),
    onSuccess: () => {
      toast.success("GST registration submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["gst-status"] });
      navigate("/dashboard/gst");
    },
    onError: () => toast.error("Failed to submit GST registration"),
  });

  const annualTurnover = Number(form.watch("annualTurnover")) || 0;

  const onSubmit = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (_paymentId: string) => {
    const values = form.getValues();
    submitMutation.mutate({
      businessName: values.businessName,
      businessType: values.businessType,
      ntnNumber: values.ntnNumber,
      cnic: values.cnic,
      phone: values.phone,
      email: values.email,
      address: values.address,
      annualTurnover: Number(values.annualTurnover),
      natureOfBusiness: values.natureOfBusiness,
      fee: 3999,
    });
    setShowPayment(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="GST Registration" subtitle="Register for Sales Tax" />

      {annualTurnover > 10000000 && (
        <div className="mb-6 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4 text-sm text-amber-700 dark:text-amber-400">
          Annual turnover exceeds PKR 10 Million — GST registration is
          mandatory.
        </div>
      )}

      <Card className="border-border/50">
        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input {...form.register("businessName")} />
                {form.formState.errors.businessName && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.businessName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...form.register("businessType")}
                >
                  <option value="">Select Type</option>
                  <option value="SOLE_PROPRIETOR">Sole Proprietor</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="PRIVATE_LIMITED">Private Limited</option>
                  <option value="PUBLIC_LIMITED">Public Limited</option>
                </select>
                {form.formState.errors.businessType && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.businessType.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>NTN Number</Label>
                <Input {...form.register("ntnNumber")} />
                {form.formState.errors.ntnNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.ntnNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>CNIC</Label>
                <Input
                  placeholder="XXXXX-XXXXXXX-X"
                  {...form.register("cnic")}
                />
                {form.formState.errors.cnic && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.cnic.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...form.register("phone")} />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address</Label>
                <Input {...form.register("address")} />
                {form.formState.errors.address && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Annual Turnover (PKR)</Label>
                <Input type="number" {...form.register("annualTurnover")} />
                {form.formState.errors.annualTurnover && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.annualTurnover.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Nature of Business</Label>
                <Input {...form.register("natureOfBusiness")} />
                {form.formState.errors.natureOfBusiness && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.natureOfBusiness.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border-2 border-dashed border-border p-4 text-center">
              <p className="text-sm font-medium">Upload Documents</p>
              <p className="text-xs text-muted-foreground">
                NTN Certificate, CNIC, Business Registration Docs
              </p>
              <Input
                type="file"
                multiple
                accept="image/*,.pdf"
                className="max-w-xs mx-auto mt-2"
              />
            </div>

            <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Registration Fee
                </p>
                <p className="text-xl font-bold">Rs. 3,999</p>
              </div>
              <Button type="submit">Proceed to Payment</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={3999}
        serviceType="GST Registration"
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
}
