import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Check, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PaymentModal } from "@/components/shared/PaymentModal";
import { formatPKR, formatCNIC } from "@/lib/utils";

const STEPS = [
  "Company Type",
  "Company Details",
  "Directors",
  "Documents",
  "Confirmation",
];

const COMPANY_TYPES = [
  {
    id: "PRIVATE_LIMITED",
    label: "Private Limited",
    fee: 7999,
    desc: "Most common corporate structure",
  },
  {
    id: "PUBLIC_LIMITED",
    label: "Public Limited",
    fee: 14999,
    desc: "For companies offering shares to public",
  },
  { id: "SMCO", label: "SMCO", fee: 5999, desc: "Single Member Company" },
  {
    id: "TRUST",
    label: "Trust",
    fee: 4999,
    desc: "For charitable and non-profit purposes",
  },
  { id: "NPO", label: "NPO", fee: 3999, desc: "Non-Profit Organization" },
];

const formSchema = z.object({
  companyType: z.string().min(1, "Please select a company type"),
  companyName1: z.string().min(2, "First name option is required"),
  companyName2: z.string().min(2, "Second name option is required"),
  companyName3: z.string().min(2, "Third name option is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  paidUpCapital: z.string().min(1, "Paid-up capital is required"),
  natureOfBusiness: z.string().min(2, "Nature of business is required"),
  directors: z
    .array(
      z.object({
        name: z.string().min(2, "Name is required"),
        cnic: z
          .string()
          .min(15, "CNIC must be in format XXXXX-XXXXXXX-X")
          .regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format"),
        address: z.string().min(5, "Address is required"),
        contact: z.string().min(10, "Contact number is required"),
      }),
    )
    .min(2, "At least 2 directors required")
    .max(7, "Maximum 7 directors allowed"),
});

type FormData = z.infer<typeof formSchema>;

const stepFields: (keyof FormData | string)[][] = [
  ["companyType"],
  [
    "companyName1",
    "companyName2",
    "companyName3",
    "address",
    "city",
    "paidUpCapital",
    "natureOfBusiness",
  ],
  ["directors"],
  [],
  [],
];

export default function SECPRegistration() {
  const [step, setStep] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [secpRef, setSecpRef] = useState("");
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      api.post("/secp", data).then((r) => r.data),
    onError: () => toast.error("Failed to submit SECP registration"),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyType: "",
      companyName1: "",
      companyName2: "",
      companyName3: "",
      address: "",
      city: "",
      paidUpCapital: "",
      natureOfBusiness: "",
      directors: [{ name: "", cnic: "", address: "", contact: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "directors",
  });

  const watchType = form.watch("companyType");
  const selectedType = COMPANY_TYPES.find((t) => t.id === watchType);
  const fee = selectedType?.fee ?? 7999;

  const handleNext = async () => {
    if (step === 0 && !watchType) {
      toast.error("Please select a company type");
      return;
    }
    const fieldsToValidate = stepFields[step] as any[];
    if (fieldsToValidate.length > 0) {
      const valid = await form.trigger(fieldsToValidate as any);
      if (!valid) return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmitApplication = () => {
    setShowPayment(true);
  };

  const handlePaymentSuccess = (_paymentId: string) => {
    const values = form.getValues();
    const ref = `SECP-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    submitMutation.mutate({
      companyType: values.companyType,
      companyNames: [values.companyName1, values.companyName2, values.companyName3],
      address: values.address,
      city: values.city,
      paidUpCapital: Number(values.paidUpCapital),
      natureOfBusiness: values.natureOfBusiness,
      directors: values.directors,
      fee: fee,
      secpRefNumber: ref,
    });
    setSecpRef(ref);
    setShowPayment(false);
    setStep(4);
    toast.success(`SECP registration submitted! Reference: ${ref}`);
    queryClient.invalidateQueries({ queryKey: ["secp"] });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="SECP Company Registration"
        subtitle="Register your company with Securities and Exchange Commission of Pakistan"
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
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
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-2" />
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          {step === 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {COMPANY_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => form.setValue("companyType", type.id)}
                  className={`rounded-xl border-2 p-5 text-left transition-all ${
                    watchType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <h3 className="font-semibold">{type.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {type.desc}
                  </p>
                  <p className="text-lg font-bold text-primary mt-2">
                    {formatPKR(type.fee)}
                  </p>
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Company Name — Option 1</Label>
                <Input
                  placeholder="First preferred name"
                  {...form.register("companyName1")}
                />
                {form.formState.errors.companyName1 && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.companyName1.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Company Name — Option 2</Label>
                <Input
                  placeholder="Second preferred name"
                  {...form.register("companyName2")}
                />
                {form.formState.errors.companyName2 && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.companyName2.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Company Name — Option 3</Label>
                <Input
                  placeholder="Third preferred name"
                  {...form.register("companyName3")}
                />
                {form.formState.errors.companyName3 && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.companyName3.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Registered Address</Label>
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
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="City" {...form.register("city")} />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.city.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Paid-up Capital (PKR)</Label>
                <Input
                  type="number"
                  placeholder="100000"
                  {...form.register("paidUpCapital")}
                />
                {form.formState.errors.paidUpCapital && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.paidUpCapital.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Nature of Business</Label>
                <Input
                  placeholder="e.g. IT Services, Retail, Manufacturing"
                  {...form.register("natureOfBusiness")}
                />
                {form.formState.errors.natureOfBusiness && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.natureOfBusiness.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Add at least 2 directors (max 7)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={fields.length >= 7}
                  onClick={() =>
                    append({ name: "", cnic: "", address: "", contact: "" })
                  }
                >
                  <Plus className="mr-1 h-4 w-4" /> Add Director
                </Button>
              </div>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-border/50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">
                      Director #{index + 1}
                    </h4>
                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input {...form.register(`directors.${index}.name`)} />
                      {form.formState.errors.directors?.[index]?.name && (
                        <p className="text-sm text-destructive">
                          {
                            form.formState.errors.directors[index]?.name
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>CNIC</Label>
                      <Input
                        placeholder="XXXXX-XXXXXXX-X"
                        {...form.register(`directors.${index}.cnic`)}
                        onChange={(e) => {
                          const formatted = formatCNIC(e.target.value);
                          form.setValue(`directors.${index}.cnic`, formatted);
                        }}
                      />
                      {form.formState.errors.directors?.[index]?.cnic && (
                        <p className="text-sm text-destructive">
                          {
                            form.formState.errors.directors[index]?.cnic
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Address</Label>
                      <Input {...form.register(`directors.${index}.address`)} />
                      {form.formState.errors.directors?.[index]?.address && (
                        <p className="text-sm text-destructive">
                          {
                            form.formState.errors.directors[index]?.address
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input
                        placeholder="03XX-XXXXXXX"
                        {...form.register(`directors.${index}.contact`)}
                      />
                      {form.formState.errors.directors?.[index]?.contact && (
                        <p className="text-sm text-destructive">
                          {
                            form.formState.errors.directors[index]?.contact
                              ?.message
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {form.formState.errors.directors &&
                !Array.isArray(form.formState.errors.directors) && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.directors.message}
                  </p>
                )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium mb-2">
                    Memorandum & Articles of Association
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PDF format
                  </p>
                  <Input
                    type="file"
                    accept=".pdf"
                    className="max-w-xs mx-auto"
                  />
                </div>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium mb-2">
                    CNIC Copies (All Directors)
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Front & Back
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    className="max-w-xs mx-auto"
                    multiple
                  />
                </div>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium mb-2">NTN Certificate</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    If available
                  </p>
                  <Input
                    type="file"
                    accept=".pdf"
                    className="max-w-xs mx-auto"
                  />
                </div>
                <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                  <p className="text-sm font-medium mb-2">
                    Registered Office Proof
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Utility bill or rental agreement
                  </p>
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.png"
                    className="max-w-xs mx-auto"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Registration Fee
                  </p>
                  <p className="text-xl font-bold">{formatPKR(fee)}</p>
                </div>
                <Button onClick={() => setShowPayment(true)}>
                  Proceed to Payment
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              {secpRef ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                    <Check className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold">Application Submitted</h3>
                  <p className="text-muted-foreground">
                    Your SECP registration has been submitted successfully.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-muted/50 px-4 py-2">
                    <span className="text-sm text-muted-foreground">
                      Ref #:
                    </span>
                    <span className="font-mono font-bold text-primary">
                      {secpRef}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Processing typically takes 3-5 working days
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Summary</h3>
                  <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Company Type
                      </span>
                      <span className="font-medium">{selectedType?.label}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Company Name (Option 1)
                      </span>
                      <span className="font-medium">
                        {form.watch("companyName1")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">City</span>
                      <span className="font-medium">{form.watch("city")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Directors</span>
                      <span className="font-medium">{fields.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Paid-up Capital
                      </span>
                      <span className="font-medium">
                        {formatPKR(Number(form.watch("paidUpCapital")))}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2 flex justify-between text-sm">
                      <span className="font-medium">Total Fee</span>
                      <span className="font-bold text-primary">
                        {formatPKR(fee)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleSubmitApplication}
                  >
                    Submit & Pay {formatPKR(fee)}
                  </Button>
                </div>
              )}
            </div>
          )}

          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext} disabled={step === 3}>
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
        serviceType="SECP Company Registration"
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
}
