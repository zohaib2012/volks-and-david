import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle, XCircle, Info, ShieldCheck } from "lucide-react";
import api from "@/lib/api";
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
import { Button } from "@/components/ui/button";
import { formatCNIC } from "@/lib/utils";

interface ATLResult {
  active: boolean;
  ntn: string;
  name: string;
  lastFiledYear: string;
}

const BENEFITS = [
  { type: "Dividend", filer: "15%", nonFiler: "30%" },
  { type: "Bank Interest", filer: "15%", nonFiler: "30%" },
  { type: "Property Sale", filer: "1%", nonFiler: "2%" },
  { type: "Contractor Payment", filer: "4%", nonFiler: "8%" },
  { type: "Vehicle Purchase", filer: "3%", nonFiler: "6%" },
];

export default function ATLChecker() {
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATLResult | null>(null);
  const [error, setError] = useState("");

  const handleCnicChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 13);
    setCnic(formatCNIC(cleaned));
  };

  const handleCheck = async () => {
    const raw = cnic.replace(/\D/g, "");
    if (raw.length !== 13) {
      setError("Please enter a valid 13-digit CNIC");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.get(`/tax-tools/atl-check/${raw}`);
      setResult(res.data.data);
    } catch {
      setError("Failed to check ATL status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Active Taxpayer List (ATL) Status"
        subtitle="Check if you are on FBR's Active Taxpayer List"
      />

      <Card className="mb-6 bg-primary/5 border-primary/20">
        <CardContent className="py-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">What is ATL?</p>
            <p className="text-sm text-muted-foreground">
              Active Taxpayer List (ATL) is a list of compliant taxpayers
              maintained by FBR. Being on the ATL entitles you to lower
              withholding tax rates on various transactions including banking,
              property, vehicles, and contracts.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Check Your Status</CardTitle>
              <CardDescription>Enter your CNIC number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>CNIC Number</Label>
                <Input
                  value={cnic}
                  onChange={(e) => handleCnicChange(e.target.value)}
                  placeholder="XXXXX-XXXXXXX-X"
                  maxLength={15}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button
                className="w-full"
                onClick={handleCheck}
                disabled={loading || cnic.replace(/\D/g, "").length !== 13}
              >
                {loading ? "Checking..." : "Check Status"}
              </Button>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg ${result.active ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}`}
                >
                  {result.active ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <p
                      className={`font-semibold ${result.active ? "text-green-600" : "text-red-600"}`}
                    >
                      {result.active ? "Active" : "Inactive"}
                    </p>
                    <p className="text-xs text-muted-foreground">ATL Status</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">NTN</span>
                    <span className="font-medium">{result.ntn}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">
                      Last Filed Year
                    </span>
                    <span className="font-medium">{result.lastFiledYear}</span>
                  </div>
                </div>

                {!result.active && (
                  <Button className="w-full" variant="default">
                    Become a Filer
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">
              Withholding Tax Rates: Filer vs Non-Filer
            </CardTitle>
            <CardDescription>Lower rates for Active Taxpayers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">
                      Transaction Type
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-primary">
                      Filer Rate
                    </th>
                    <th className="text-right py-2 px-3 font-medium text-destructive">
                      Non-Filer Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {BENEFITS.map((b, i) => (
                    <tr
                      key={i}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      <td className="py-2 px-3">{b.type}</td>
                      <td className="text-right py-2 px-3 text-primary font-medium">
                        {b.filer}
                      </td>
                      <td className="text-right py-2 px-3 text-destructive font-medium">
                        {b.nonFiler}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              * Rates are indicative and subject to change as per FBR
              notifications.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
