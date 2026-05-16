import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, FileCheck } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PaymentModal } from "@/components/shared/PaymentModal";
import { formatCNIC } from "@/lib/utils";
import api from "@/lib/api";

const steps = ["Select Type", "Information", "Documents & Payment"];

const ntnTypes = [
  {
    id: "INDIVIDUAL",
    label: "Individual",
    fee: 1299,
    desc: "For salaried individuals and freelancers",
  },
  {
    id: "SOLE_PROPRIETOR",
    label: "Sole Proprietor",
    fee: 1999,
    desc: "For single-owner businesses",
  },
  {
    id: "AOP",
    label: "AOP",
    fee: 2499,
    desc: "Association of Persons (partnership)",
  },
  {
    id: "COMPANY",
    label: "Company",
    fee: 3499,
    desc: "Private or Public Limited Company",
  },
];

const infoSchema = z.object({
  cnic: z
    .string()
    .min(13, "CNIC is required")
    .regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
  fullName: z.string().min(2, "Name is required"),
  fatherName: z.string().min(2, "Father's name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  province: z.string().min(1, "Province is required"),
  phone: z.string().min(10, "Phone is required"),
  email: z.string().email("Invalid email"),
});

export default function NTNRegister() {
  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [fee, setFee] = useState(0);
  const [cnicFile, setCnicFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const cnicInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/ntn", payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ntn-status"] });
      toast.success("NTN registration submitted successfully!");
      navigate("/dashboard/ntn");
    },
    onError: () => {
      toast.error("Failed to submit NTN registration. Please try again.");
    },
  });

  const infoForm = useForm({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      cnic: "",
      fullName: "",
      fatherName: "",
      dob: "",
      address: "",
      city: "",
      province: "",
      phone: "",
      email: "",
    },
  });

  const handleTypeSelect = (type: (typeof ntnTypes)[0]) => {
    setSelectedType(type.id);
    setFee(type.fee);
  };

  const handleNext = () => {
    if (step === 0 && !selectedType) {
      toast.error("Please select an NTN type");
      return;
    }
    if (step === 1) {
      infoForm.handleSubmit(() => setStep(2))();
      return;
    }
    setStep((s) => s + 1);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    setShowPayment(false);
    const formValues = infoForm.getValues();
    submitMutation.mutate({
      ntnType: selectedType,
      cnic: formValues.cnic,
      fullName: formValues.fullName,
      fatherName: formValues.fatherName,
      dob: formValues.dob ? new Date(formValues.dob).toISOString() : null,
      address: formValues.address,
      city: formValues.city,
      province: formValues.province,
      phone: formValues.phone,
      email: formValues.email,
      fee,
      documents: {
        paymentId,
        cnicFile: cnicFile?.name ?? null,
        addressFile: addressFile?.name ?? null,
      },
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Register NTN"
        subtitle="Get your National Tax Number"
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              className={`text-xs font-medium ${i === step ? "text-primary" : i < step ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              <div className="hidden sm:block">{s}</div>
              <div
                className={`sm:hidden flex h-6 w-6 items-center justify-center rounded-full text-xs ${i === step ? "bg-primary text-white" : i < step ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
            </button>
          ))}
        </div>
        <Progress value={((step + 1) / steps.length) * 100} className="h-2" />
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {ntnTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type)}
                  className={`rounded-xl border-2 p-5 text-left transition-all ${
                    selectedType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-semibold">{type.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {type.desc}
                  </p>
                  <p className="text-lg font-bold text-primary mt-2">
                    Rs.{type.fee.toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>CNIC</Label>
                <Input
                  placeholder="XXXXX-XXXXXXX-X"
                  {...infoForm.register("cnic")}
                  onChange={(e) => {
                    const formatted = formatCNIC(e.target.value);
                    infoForm.setValue("cnic", formatted);
                  }}
                />
                {infoForm.formState.errors.cnic && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.cnic.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input {...infoForm.register("fullName")} />
                {infoForm.formState.errors.fullName && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Father's Name</Label>
                <Input {...infoForm.register("fatherName")} />
                {infoForm.formState.errors.fatherName && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.fatherName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" {...infoForm.register("dob")} />
                {infoForm.formState.errors.dob && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.dob.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address</Label>
                <Input {...infoForm.register("address")} />
                {infoForm.formState.errors.address && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.address.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...infoForm.register("city")} />
                {infoForm.formState.errors.city && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Province</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  {...infoForm.register("province")}
                >
                  <option value="">Select Province</option>
                  <option value="PUNJAB">Punjab</option>
                  <option value="SINDH">Sindh</option>
                  <option value="KPK">KPK</option>
                  <option value="BALOCHISTAN">Balochistan</option>
                  <option value="ISLAMABAD">Islamabad</option>
                </select>
                {infoForm.formState.errors.province && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.province.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="03XX-XXXXXXX"
                  {...infoForm.register("phone")}
                />
                {infoForm.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" {...infoForm.register("email")} />
                {infoForm.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {infoForm.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* CNIC Upload */}
              <div
                onClick={() => cnicInputRef.current?.click()}
                className={`rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                  cnicFile
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {cnicFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileCheck className="h-8 w-8 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-600">{cnicFile.name}</p>
                    <p className="text-xs text-muted-foreground">Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Upload CNIC (Front + Back)</p>
                    <p className="text-xs text-muted-foreground">Click to browse — JPG, PNG or PDF</p>
                  </div>
                )}
                <input
                  ref={cnicInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setCnicFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {/* Address Proof Upload */}
              <div
                onClick={() => addressInputRef.current?.click()}
                className={`rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
                  addressFile
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {addressFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileCheck className="h-8 w-8 text-emerald-500" />
                    <p className="text-sm font-medium text-emerald-600">{addressFile.name}</p>
                    <p className="text-xs text-muted-foreground">Click to change</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm font-medium">Upload Proof of Address</p>
                    <p className="text-xs text-muted-foreground">Utility bill or bank statement</p>
                  </div>
                )}
                <input
                  ref={addressInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => setAddressFile(e.target.files?.[0] ?? null)}
                />
              </div>

              {/* Fee + Payment Button */}
              <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Registration Fee</p>
                  <p className="text-xl font-bold">Rs.{fee.toLocaleString()}</p>
                </div>
                <Button
                  onClick={() => {
                    if (!cnicFile) {
                      toast.error("Please upload your CNIC");
                      return;
                    }
                    if (!addressFile) {
                      toast.error("Please upload proof of address");
                      return;
                    }
                    setShowPayment(true);
                  }}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending ? "Submitting..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          )}

          {step < 2 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={fee}
        serviceType="NTN Registration"
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
}
