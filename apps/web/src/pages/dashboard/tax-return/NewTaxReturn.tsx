import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, Check, Save, LogOut } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPKR } from "@/lib/utils";

const steps = [
  "Setup",
  "Income",
  "Deductions",
  "Assets",
  "Liabilities",
  "Review & Submit",
];

const step1Schema = z.object({
  profileId: z.string().min(1, "Select a profile"),
  taxYear: z.string().min(1, "Select tax year"),
  returnType: z.string().min(1, "Select return type"),
});

const taxYears = Array.from({ length: 10 }, (_, i) => String(2016 + i));

const taxSlabs2024 = [
  { min: 0, max: 600000, rate: 0 },
  { min: 600001, max: 1200000, rate: 0.05 },
  { min: 1200001, max: 2200000, rate: 0.15 },
  { min: 2200001, max: 3200000, rate: 0.25 },
  { min: 3200001, max: 4100000, rate: 0.3 },
  { min: 4100001, max: Infinity, rate: 0.35 },
];

function calculateTax(income: number): number {
  let tax = 0;
  for (const slab of taxSlabs2024) {
    if (income > slab.min) {
      const taxable = Math.min(income, slab.max) - slab.min;
      tax += taxable * slab.rate;
    }
  }
  return Math.round(tax);
}

export default function NewTaxReturn() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const step1Form = useForm({
    resolver: zodResolver(step1Schema),
    defaultValues: { profileId: "", taxYear: "", returnType: "" },
  });

  const [incomeData, setIncomeData] = useState({
    hasSalary: false,
    salaryAmount: 0,
    employerName: "",
    hasBusiness: false,
    businessIncome: 0,
    hasRental: false,
    rentalIncome: 0,
    hasAgriculture: false,
    agricultureIncome: 0,
    hasForeign: false,
    foreignIncome: 0,
    hasOther: false,
    otherDescription: "",
    otherAmount: 0,
  });

  const [deductionData, setDeductionData] = useState({
    paidZakat: false,
    zakatAmount: 0,
    madeDonations: false,
    donationAmount: 0,
    donationOrg: "",
    hasPension: false,
    pensionAmount: 0,
    hasMedical: false,
    medicalAmount: 0,
    hasEducation: false,
    educationAmount: 0,
  });

  const [assetData, setAssetData] = useState({
    property: 0,
    vehicles: 0,
    bankBalance: 0,
    investments: 0,
    businessCapital: 0,
    otherAssets: 0,
  });

  const [liabilityData, setLiabilityData] = useState({
    bankLoans: 0,
    mortgage: 0,
    businessLoans: 0,
    otherLiabilities: 0,
  });

  const totalIncome =
    (incomeData.hasSalary ? incomeData.salaryAmount : 0) +
    (incomeData.hasBusiness ? incomeData.businessIncome : 0) +
    (incomeData.hasRental ? incomeData.rentalIncome : 0) +
    (incomeData.hasAgriculture ? incomeData.agricultureIncome : 0) +
    (incomeData.hasForeign ? incomeData.foreignIncome : 0) +
    (incomeData.hasOther ? incomeData.otherAmount : 0);

  const totalDeductions =
    (deductionData.paidZakat ? deductionData.zakatAmount : 0) +
    (deductionData.madeDonations ? deductionData.donationAmount : 0) +
    (deductionData.hasPension ? deductionData.pensionAmount : 0) +
    (deductionData.hasMedical ? deductionData.medicalAmount : 0) +
    (deductionData.hasEducation ? deductionData.educationAmount : 0);

  const totalAssets = Object.values(assetData).reduce((a, b) => a + b, 0);
  const totalLiabilities = Object.values(liabilityData).reduce(
    (a, b) => a + b,
    0,
  );
  const netWorth = totalAssets - totalLiabilities;
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  const taxPayable = calculateTax(taxableIncome);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/tax-returns", payload);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Tax return submitted successfully!");
      navigate("/dashboard/tax-return");
    },
    onError: () => toast.error("Failed to submit tax return"),
  });

  const draftMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/tax-returns", { ...payload, status: "DRAFT" });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Draft saved!");
    },
    onError: () => toast.error("Failed to save draft"),
  });

  const buildPayload = (status: string) => ({
    status,
    taxYear: step1Form.getValues().taxYear,
    profileId: step1Form.getValues().profileId,
    returnType: step1Form.getValues().returnType,
    incomeData,
    deductionData,
    assetData,
    liabilityData,
    totalIncome,
    totalDeductions,
    taxableIncome,
    taxPayable,
  });

  const handleSaveDraft = () => draftMutation.mutate(buildPayload("DRAFT"));

  const handleSaveAndExit = () => {
    draftMutation.mutate(buildPayload("DRAFT"), {
      onSuccess: () => navigate("/dashboard/tax-return"),
    });
  };

  const handleSubmit = async () => {
    saveMutation.mutate(buildPayload("SUBMITTED"));
  };

  const progressPercent = ((step + 1) / steps.length) * 100;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Profile</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...step1Form.register("profileId")}
              >
                <option value="">Select Profile</option>
                <option value="self">Self</option>
                <option value="spouse">Spouse</option>
              </select>
              {step1Form.formState.errors.profileId && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.profileId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Tax Year</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...step1Form.register("taxYear")}
              >
                <option value="">Select Tax Year</option>
                {taxYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              {step1Form.formState.errors.taxYear && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.taxYear.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Return Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...step1Form.register("returnType")}
              >
                <option value="">Select Type</option>
                <option value="SALARIED">Salaried</option>
                <option value="BUSINESS">Business</option>
                <option value="AOP">AOP</option>
                <option value="COMPANY">Company</option>
                <option value="RENTAL">Rental</option>
                <option value="AGRICULTURE">Agriculture</option>
                <option value="FREELANCER">Freelancer</option>
              </select>
              {step1Form.formState.errors.returnType && (
                <p className="text-sm text-destructive">
                  {step1Form.formState.errors.returnType.message}
                </p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="rounded-lg border border-border p-4 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incomeData.hasSalary}
                  onChange={(e) =>
                    setIncomeData((p) => ({
                      ...p,
                      hasSalary: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">Do you receive salary?</span>
              </label>
              {incomeData.hasSalary && (
                <div className="ml-7 space-y-3 pl-4 border-l-2 border-primary/20">
                  <div>
                    <Label>Salary Amount (PKR)</Label>
                    <Input
                      type="number"
                      value={incomeData.salaryAmount}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          salaryAmount: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Employer Name</Label>
                    <Input
                      value={incomeData.employerName}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          employerName: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incomeData.hasBusiness}
                  onChange={(e) =>
                    setIncomeData((p) => ({
                      ...p,
                      hasBusiness: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">
                  Do you have business income?
                </span>
              </label>
              {incomeData.hasBusiness && (
                <div className="ml-7 space-y-3 pl-4 border-l-2 border-primary/20">
                  <div>
                    <Label>Business Income (PKR)</Label>
                    <Input
                      type="number"
                      value={incomeData.businessIncome}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          businessIncome: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incomeData.hasRental}
                  onChange={(e) =>
                    setIncomeData((p) => ({
                      ...p,
                      hasRental: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">Do you have rental income?</span>
              </label>
              {incomeData.hasRental && (
                <div className="ml-7 space-y-3 pl-4 border-l-2 border-primary/20">
                  <div>
                    <Label>Rental Income (PKR)</Label>
                    <Input
                      type="number"
                      value={incomeData.rentalIncome}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          rentalIncome: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incomeData.hasAgriculture}
                  onChange={(e) =>
                    setIncomeData((p) => ({
                      ...p,
                      hasAgriculture: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">
                  Do you have agricultural income?
                </span>
              </label>
              {incomeData.hasAgriculture && (
                <div className="ml-7 space-y-3 pl-4 border-l-2 border-primary/20">
                  <div>
                    <Label>Agricultural Income (PKR)</Label>
                    <Input
                      type="number"
                      value={incomeData.agricultureIncome}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          agricultureIncome: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incomeData.hasForeign}
                  onChange={(e) =>
                    setIncomeData((p) => ({
                      ...p,
                      hasForeign: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">Do you have foreign income?</span>
              </label>
              {incomeData.hasForeign && (
                <div className="ml-7 space-y-3 pl-4 border-l-2 border-primary/20">
                  <div>
                    <Label>Foreign Income (PKR)</Label>
                    <Input
                      type="number"
                      value={incomeData.foreignIncome}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          foreignIncome: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-border p-4 space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={incomeData.hasOther}
                  onChange={(e) =>
                    setIncomeData((p) => ({ ...p, hasOther: e.target.checked }))
                  }
                  className="h-4 w-4 accent-primary"
                />
                <span className="font-medium">
                  Do you have any other income?
                </span>
              </label>
              {incomeData.hasOther && (
                <div className="ml-7 space-y-3 pl-4 border-l-2 border-primary/20">
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={incomeData.otherDescription}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          otherDescription: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Amount (PKR)</Label>
                    <Input
                      type="number"
                      value={incomeData.otherAmount}
                      onChange={(e) =>
                        setIncomeData((p) => ({
                          ...p,
                          otherAmount: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-primary">
                {formatPKR(totalIncome)}
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {[
              {
                key: "paidZakat",
                label: "Did you pay Zakat?",
                amountKey: "zakatAmount" as const,
              },
              {
                key: "madeDonations",
                label: "Did you make charitable donations?",
                amountKey: "donationAmount" as const,
                extra: true,
                extraLabel: "Organization",
                extraKey: "donationOrg" as const,
              },
              {
                key: "hasPension",
                label: "Do you contribute to pension fund?",
                amountKey: "pensionAmount" as const,
              },
              {
                key: "hasMedical",
                label: "Did you have medical expenses?",
                amountKey: "medicalAmount" as const,
              },
              {
                key: "hasEducation",
                label: "Did you pay education fees?",
                amountKey: "educationAmount" as const,
              },
            ].map((item) => (
              <div
                key={item.key}
                className="rounded-lg border border-border p-4 space-y-4"
              >
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={(deductionData as any)[item.key]}
                    onChange={(e) =>
                      setDeductionData((p) => ({
                        ...p,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-primary"
                  />
                  <span className="font-medium">{item.label}</span>
                </label>
                {(deductionData as any)[item.key] && (
                  <div className="ml-7 space-y-3 pl-4 border-l-2 border-primary/20">
                    <div>
                      <Label>Amount (PKR)</Label>
                      <Input
                        type="number"
                        value={(deductionData as any)[item.amountKey]}
                        onChange={(e) =>
                          setDeductionData((p) => ({
                            ...p,
                            [item.amountKey]: Number(e.target.value),
                          }))
                        }
                      />
                    </div>
                    {(item as any).extra && (
                      <div>
                        <Label>{(item as any).extraLabel}</Label>
                        <Input
                          value={(deductionData as any)[(item as any).extraKey]}
                          onChange={(e) =>
                            setDeductionData((p) => ({
                              ...p,
                              [(item as any).extraKey]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Estimated Tax Savings from Deductions
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {formatPKR(
                  calculateTax(totalIncome) - calculateTax(taxableIncome),
                )}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            {[
              { key: "property", label: "Property/Real Estate" },
              { key: "vehicles", label: "Motor Vehicles" },
              { key: "bankBalance", label: "Bank Account Balance" },
              {
                key: "investments",
                label: "Investments (Stocks, Mutual Funds)",
              },
              { key: "businessCapital", label: "Business Capital" },
              { key: "otherAssets", label: "Other Assets" },
            ].map((item) => (
              <div key={item.key}>
                <Label>{item.label} (PKR)</Label>
                <Input
                  type="number"
                  value={(assetData as any)[item.key]}
                  onChange={(e) =>
                    setAssetData((p) => ({
                      ...p,
                      [item.key]: Number(e.target.value),
                    }))
                  }
                />
              </div>
            ))}
            <div className="rounded-lg bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Assets</p>
              <p className="text-2xl font-bold text-primary">
                {formatPKR(totalAssets)}
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            {[
              { key: "bankLoans", label: "Bank Loans Outstanding" },
              { key: "mortgage", label: "Mortgage/Home Loan" },
              { key: "businessLoans", label: "Business Loans" },
              { key: "otherLiabilities", label: "Other Liabilities" },
            ].map((item) => (
              <div key={item.key}>
                <Label>{item.label} (PKR)</Label>
                <Input
                  type="number"
                  value={(liabilityData as any)[item.key]}
                  onChange={(e) =>
                    setLiabilityData((p) => ({
                      ...p,
                      [item.key]: Number(e.target.value),
                    }))
                  }
                />
              </div>
            ))}
            <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
              <p className="text-sm text-muted-foreground">Net Worth</p>
              <p
                className={`text-2xl font-bold ${netWorth >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {formatPKR(netWorth)}
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tax Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Gross Income</span>
                  <span className="font-medium">{formatPKR(totalIncome)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Deductions</span>
                  <span className="font-medium text-emerald-600">
                    -{formatPKR(totalDeductions)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Taxable Income</span>
                  <span className="font-semibold">
                    {formatPKR(taxableIncome)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Payable</span>
                  <span className="font-medium text-red-600">
                    {formatPKR(taxPayable)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Assets</span>
                  <span>{formatPKR(totalAssets)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Net Worth</span>
                  <span
                    className={
                      netWorth >= 0 ? "text-emerald-600" : "text-red-600"
                    }
                  >
                    {formatPKR(netWorth)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleSaveDraft}
                disabled={draftMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" /> {draftMutation.isPending ? "Saving..." : "Save Draft"}
              </Button>
              <Button className="flex-1" onClick={handleSubmit} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Submitting..." : "Proceed to Payment"} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="File Tax Return"
        subtitle="Complete all steps to file your return"
      />

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              className={`text-xs font-medium transition-colors ${i === step ? "text-primary" : i < step ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              <div
                className={`hidden sm:block ${i > step ? "cursor-not-allowed" : "cursor-pointer"}`}
              >
                {s}
              </div>
              <div
                className={`sm:hidden flex h-6 w-6 items-center justify-center rounded-full text-xs ${i === step ? "bg-primary text-white" : i < step ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
            </button>
          ))}
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      <Card className="border-border/50">
        <CardContent className="pt-6">
          {renderStep()}

          {step < 5 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSaveAndExit} disabled={draftMutation.isPending}>
                  <LogOut className="mr-2 h-4 w-4" /> Save & Continue Later
                </Button>
                <Button variant="outline" onClick={handleSaveDraft} disabled={draftMutation.isPending}>
                  <Save className="mr-2 h-4 w-4" /> {draftMutation.isPending ? "Saving..." : "Save Draft"}
                </Button>
                <Button onClick={() => setStep((s) => s + 1)}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
