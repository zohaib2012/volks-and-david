import { motion } from "framer-motion";
import { useState } from "react";
import { Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPKR } from "@/lib/utils";

const TAX_YEARS = ["2023-24", "2024-25", "2025-26"];

const FILER_SLABS = [
  { min: 0, max: 600000, rate: 0, base: 0, label: "0 – 600,000" },
  {
    min: 600000,
    max: 1200000,
    rate: 0.05,
    base: 0,
    label: "600,001 – 1,200,000",
  },
  {
    min: 1200000,
    max: 2200000,
    rate: 0.15,
    base: 30000,
    label: "1,200,001 – 2,200,000",
  },
  {
    min: 2200000,
    max: 3200000,
    rate: 0.25,
    base: 180000,
    label: "2,200,001 – 3,200,000",
  },
  {
    min: 3200000,
    max: 4100000,
    rate: 0.3,
    base: 430000,
    label: "3,200,001 – 4,100,000",
  },
  {
    min: 4100000,
    max: Infinity,
    rate: 0.35,
    base: 700000,
    label: "4,100,001+",
  },
];

const NON_FILER_SLABS = [
  { min: 0, max: 600000, rate: 0, base: 0, label: "0 – 600,000" },
  {
    min: 600000,
    max: 1200000,
    rate: 0.1,
    base: 0,
    label: "600,001 – 1,200,000",
  },
  {
    min: 1200000,
    max: 2200000,
    rate: 0.3,
    base: 60000,
    label: "1,200,001 – 2,200,000",
  },
  {
    min: 2200000,
    max: 3200000,
    rate: 0.35,
    base: 360000,
    label: "2,200,001 – 3,200,000",
  },
  {
    min: 3200000,
    max: 4100000,
    rate: 0.4,
    base: 710000,
    label: "3,200,001 – 4,100,000",
  },
  {
    min: 4100000,
    max: Infinity,
    rate: 0.45,
    base: 1070000,
    label: "4,100,001+",
  },
];

const MAX_CONVEYANCE_EXEMPT = 7500 * 12;
const BASIC_PCT = 0.6;
const MEDICAL_EXEMPT_PCT = 0.1;

function calcTax(income: number, slabs: typeof FILER_SLABS) {
  if (income <= 0) return 0;
  const slab =
    slabs.find((s) => income > s.min && income <= s.max) ||
    slabs[slabs.length - 1];
  return slab.base + (income - slab.min) * slab.rate;
}

function findSlabInfo(income: number, slabs: typeof FILER_SLABS) {
  return (
    slabs.find((s) => income > s.min && income <= s.max) ||
    slabs[slabs.length - 1]
  );
}

export default function SalaryCalculator() {
  const [taxYear, setTaxYear] = useState("2024-25");
  const [monthlyGross, setMonthlyGross] = useState("250000");
  const [basicPct, setBasicPct] = useState("60");
  const [conveyanceOn, setConveyanceOn] = useState(true);
  const [medicalOn, setMedicalOn] = useState(true);
  const [houseRentOn, setHouseRentOn] = useState(false);

  const gross = parseFloat(monthlyGross) || 0;
  const annualGross = gross * 12;
  const basic = annualGross * (parseFloat(basicPct) / 100 || BASIC_PCT);

  const conveyanceExempt = conveyanceOn
    ? Math.min(MAX_CONVEYANCE_EXEMPT, 7500 * 12)
    : 0;
  const medicalExempt = medicalOn
    ? Math.min(basic * MEDICAL_EXEMPT_PCT, basic * MEDICAL_EXEMPT_PCT)
    : 0;
  const houseRentExempt = houseRentOn ? basic * 0.45 : 0;

  const totalExempt = conveyanceExempt + medicalExempt + houseRentExempt;
  const taxableIncome = Math.max(0, annualGross - totalExempt);

  const slabs = taxYear === "2024-25" ? FILER_SLABS : FILER_SLABS;
  const nonSlabs = taxYear === "2024-25" ? NON_FILER_SLABS : NON_FILER_SLABS;

  const filerTax = calcTax(taxableIncome, slabs);
  const nonFilerTax = calcTax(taxableIncome, nonSlabs);
  const filerMonthlyTax = filerTax / 12;
  const nonFilerMonthlyTax = nonFilerTax / 12;
  const filerEffectiveRate =
    taxableIncome > 0 ? (filerTax / taxableIncome) * 100 : 0;
  const nonFilerEffectiveRate =
    taxableIncome > 0 ? (nonFilerTax / taxableIncome) * 100 : 0;

  const filerSlabInfo = findSlabInfo(taxableIncome, slabs);
  const nonFilerSlabInfo = findSlabInfo(taxableIncome, nonSlabs);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Salary Tax Calculator"
        subtitle="Estimate your income tax liability on salary"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Input Details</CardTitle>
            <CardDescription>Enter your salary and allowances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Tax Year</Label>
              <Select value={taxYear} onValueChange={setTaxYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TAX_YEARS.map((y) => (
                    <SelectItem key={y} value={y}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Monthly Gross Salary (PKR)</Label>
              <Input
                type="number"
                value={monthlyGross}
                onChange={(e) => setMonthlyGross(e.target.value)}
                placeholder="250000"
              />
            </div>

            <div className="space-y-2">
              <Label>Basic Salary % of Gross</Label>
              <Input
                type="number"
                value={basicPct}
                onChange={(e) => setBasicPct(e.target.value)}
                placeholder="60"
                min={0}
                max={100}
              />
            </div>

            <div className="space-y-3 pt-2 border-t">
              <p className="text-sm font-medium">Allowances</p>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Conveyance</Label>
                  <p className="text-xs text-muted-foreground">
                    Up to Rs.7,500/month exempt
                  </p>
                </div>
                <Switch
                  checked={conveyanceOn}
                  onCheckedChange={setConveyanceOn}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">Medical</Label>
                  <p className="text-xs text-muted-foreground">
                    10% of basic exempt
                  </p>
                </div>
                <Switch checked={medicalOn} onCheckedChange={setMedicalOn} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm">House Rent</Label>
                  <p className="text-xs text-muted-foreground">
                    45% of basic exempt
                  </p>
                </div>
                <Switch
                  checked={houseRentOn}
                  onCheckedChange={setHouseRentOn}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tax Summary</CardTitle>
                <Button variant="outline" size="sm" onClick={() => window.print()}>
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Annual Gross</p>
                  <p className="text-lg font-bold">{formatPKR(annualGross)}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Exempt Allowances
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {formatPKR(totalExempt)}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3">
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    Taxable Income
                  </p>
                  <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                    {formatPKR(taxableIncome)}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3">
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    Tax Slab
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {(filerSlabInfo.rate * 100).toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-semibold">Filer</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Annual Tax
                        </span>
                        <span className="font-bold">{formatPKR(filerTax)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monthly Tax
                        </span>
                        <span className="font-bold">
                          {formatPKR(filerMonthlyTax)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Effective Rate
                        </span>
                        <span className="font-bold">
                          {filerEffectiveRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monthly Take-Home
                        </span>
                        <span className="font-bold">
                          {formatPKR(gross - filerMonthlyTax)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-destructive/20 bg-destructive/5">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="font-semibold">Non-Filer</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Annual Tax
                        </span>
                        <span className="font-bold text-destructive">
                          {formatPKR(nonFilerTax)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monthly Tax
                        </span>
                        <span className="font-bold text-destructive">
                          {formatPKR(nonFilerMonthlyTax)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Effective Rate
                        </span>
                        <span className="font-bold text-destructive">
                          {nonFilerEffectiveRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monthly Take-Home
                        </span>
                        <span className="font-bold">
                          {formatPKR(gross - nonFilerMonthlyTax)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {nonFilerTax > filerTax && (
                <div className="mt-4 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 rounded-lg p-3">
                  <Info className="h-4 w-4 shrink-0" />
                  <span>
                    You save{" "}
                    <strong>{formatPKR(nonFilerTax - filerTax)}</strong> per
                    year by filing your taxes.
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tax Slab Reference</CardTitle>
              <CardDescription>
                Pakistan income tax slabs {taxYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-3 font-medium">
                        Taxable Income
                      </th>
                      <th className="text-right py-2 px-3 font-medium">
                        Filer Rate
                      </th>
                      <th className="text-right py-2 px-3 font-medium">
                        Non-Filer Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {FILER_SLABS.map((s, i) => (
                      <tr
                        key={i}
                        className="border-b last:border-0 hover:bg-muted/30"
                      >
                        <td className="py-2 px-3">{s.label}</td>
                        <td className="text-right py-2 px-3">
                          {(s.rate * 100).toFixed(0)}%
                        </td>
                        <td className="text-right py-2 px-3">
                          {(NON_FILER_SLABS[i].rate * 100).toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
