import { motion } from "framer-motion";
import { useState } from "react";
import { Info, TrendingDown, PiggyBank } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPKR } from "@/lib/utils";

const TAX_SLABS = [
  { min: 0, max: 600000, rate: 0, base: 0 },
  { min: 600000, max: 1200000, rate: 0.05, base: 0 },
  { min: 1200000, max: 2200000, rate: 0.15, base: 30000 },
  { min: 2200000, max: 3200000, rate: 0.25, base: 180000 },
  { min: 3200000, max: 4100000, rate: 0.3, base: 430000 },
  { min: 4100000, max: Infinity, rate: 0.35, base: 700000 },
];

interface Deduction {
  id: string;
  label: string;
  limit: number | null;
  limitLabel: string;
  percentage: number;
}

const DEDUCTIONS: Deduction[] = [
  {
    id: "zakat",
    label: "Zakat",
    limit: null,
    limitLabel: "100% of paid amount",
    percentage: 1,
  },
  {
    id: "charity",
    label: "Charitable Donations",
    limit: null,
    limitLabel: "Up to 30% of income",
    percentage: 0.3,
  },
  {
    id: "pension",
    label: "Pension/Annuity",
    limit: 500000,
    limitLabel: "Up to Rs.500,000",
    percentage: 1,
  },
  {
    id: "medical",
    label: "Medical Insurance",
    limit: null,
    limitLabel: "Actual premium paid",
    percentage: 1,
  },
  {
    id: "education",
    label: "Education Expenses",
    limit: null,
    limitLabel: "Actual fees paid",
    percentage: 1,
  },
];

function calcTax(income: number) {
  if (income <= 0) return 0;
  const slab =
    TAX_SLABS.find((s) => income > s.min && income <= s.max) ||
    TAX_SLABS[TAX_SLABS.length - 1];
  return slab.base + (income - slab.min) * slab.rate;
}

export default function TaxEstimator() {
  const [income, setIncome] = useState("1500000");
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    zakat: false,
    charity: false,
    pension: false,
    medical: false,
    education: false,
  });
  const [amounts, setAmounts] = useState<Record<string, string>>({
    zakat: "",
    charity: "",
    pension: "",
    medical: "",
    education: "",
  });

  const annualIncome = parseFloat(income) || 0;

  const totalDeductions = DEDUCTIONS.reduce((sum, d) => {
    if (!enabled[d.id]) return sum;
    const amt = parseFloat(amounts[d.id]) || 0;
    const limit =
      d.id === "charity" ? annualIncome * 0.3 : (d.limit ?? Infinity);
    return sum + Math.min(amt, limit);
  }, 0);

  const taxableWithoutDeductions = annualIncome;
  const taxableWithDeductions = Math.max(0, annualIncome - totalDeductions);

  const taxWithout = calcTax(taxableWithoutDeductions);
  const taxWith = calcTax(taxableWithDeductions);
  const savings = taxWithout - taxWith;

  const breakdown = DEDUCTIONS.map((d) => {
    if (!enabled[d.id]) return null;
    const amt = parseFloat(amounts[d.id]) || 0;
    if (amt <= 0) return null;
    const limit =
      d.id === "charity" ? annualIncome * 0.3 : (d.limit ?? Infinity);
    const actualDed = Math.min(amt, limit);
    const taxWithoutThis = calcTax(
      annualIncome - (totalDeductions - actualDed),
    );
    const taxImpact = taxWithoutThis - taxWith;
    return { ...d, amount: amt, actualDeduction: actualDed, taxImpact };
  }).filter(Boolean) as (Deduction & {
    amount: number;
    actualDeduction: number;
    taxImpact: number;
  })[];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Tax Estimator"
        subtitle="Estimate your tax with deductions"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income & Deductions</CardTitle>
              <CardDescription>Enter your details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label>Annual Income (PKR)</Label>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="1500000"
                />
              </div>

              <div className="space-y-3 pt-2 border-t">
                <p className="text-sm font-medium">Deductions</p>
                {DEDUCTIONS.map((d) => (
                  <div key={d.id}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={d.id}
                          checked={enabled[d.id]}
                          onChange={(e) =>
                            setEnabled((prev) => ({
                              ...prev,
                              [d.id]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label
                          htmlFor={d.id}
                          className="text-sm cursor-pointer"
                        >
                          {d.label}
                        </Label>
                      </div>
                    </div>
                    {enabled[d.id] && (
                      <div className="ml-6 space-y-1">
                        <Input
                          type="number"
                          value={amounts[d.id]}
                          onChange={(e) =>
                            setAmounts((prev) => ({
                              ...prev,
                              [d.id]: e.target.value,
                            }))
                          }
                          placeholder="Amount"
                          className="h-8 text-sm"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          {d.limitLabel}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">
                    Without Deductions
                  </p>
                  <p className="text-xl font-bold">{formatPKR(taxWithout)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    With Deductions
                  </p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPKR(taxWith)}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 border-2 border-emerald-400">
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    Total Savings
                  </p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatPKR(savings)}
                  </p>
                </div>
              </div>

              {annualIncome > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 p-3 bg-muted/30 rounded-lg">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>
                    Taxable income reduced from{" "}
                    <strong>{formatPKR(taxableWithoutDeductions)}</strong> to{" "}
                    <strong>{formatPKR(taxableWithDeductions)}</strong>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {breakdown.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deduction Breakdown</CardTitle>
                <CardDescription>Tax impact per deduction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {breakdown.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-start gap-3">
                        <TrendingDown className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">{d.label}</p>
                          <p className="text-xs text-muted-foreground">
                            Claimed: {formatPKR(d.actualDeduction)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                          -{formatPKR(d.taxImpact)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          tax saved
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3">
                      <PiggyBank className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          Total Savings
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Across all deductions
                        </p>
                      </div>
                    </div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {formatPKR(savings)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
