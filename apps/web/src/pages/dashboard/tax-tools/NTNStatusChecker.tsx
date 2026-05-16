import { motion } from "framer-motion";
import { useState } from "react";
import { Search, FileText, Building, Calendar, User, Hash } from "lucide-react";
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
import { formatCNIC, formatDate } from "@/lib/utils";

interface NTNResult {
  ntn: string;
  name: string;
  registrationDate: string;
  taxOffice: string;
  ntnType: string;
}

export default function NTNStatusChecker() {
  const [cnic, setCnic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NTNResult | null>(null);
  const [error, setError] = useState("");
  const [noNtn, setNoNtn] = useState(false);

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
    setNoNtn(false);
    try {
      const res = await api.get(`/tax-tools/ntn-status/${raw}`);
      if (res.data.data && res.data.data.ntn) {
        setResult(res.data.data);
        setNoNtn(false);
      } else {
        setResult(null);
        setNoNtn(true);
      }
    } catch {
      setError("Failed to check NTN status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const detailRows = result
    ? [
        { icon: Hash, label: "NTN Number", value: result.ntn },
        { icon: User, label: "Registered Name", value: result.name },
        {
          icon: Calendar,
          label: "Registration Date",
          value: formatDate(result.registrationDate),
        },
        { icon: Building, label: "Tax Office", value: result.taxOffice },
        { icon: FileText, label: "NTN Type", value: result.ntnType },
      ]
    : [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="NTN Status Checker"
        subtitle="Verify your National Tax Number registration"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enter Details</CardTitle>
            <CardDescription>Provide your CNIC to check NTN</CardDescription>
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
              {loading ? (
                "Checking..."
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" /> Check Status
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">NTN Details</CardTitle>
            <CardDescription>Registered information</CardDescription>
          </CardHeader>
          <CardContent>
            {result && !noNtn ? (
              <div className="space-y-4">
                {detailRows.map((row, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <row.icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {row.label}
                      </p>
                      <p className="text-sm font-medium">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : noNtn ? (
              <div className="text-center py-8 space-y-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="font-semibold text-lg">No NTN Found</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    No NTN is registered against this CNIC
                  </p>
                </div>
                <Button>
                  <FileText className="mr-2 h-4 w-4" /> Register for NTN
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-muted-foreground">
                  Enter your CNIC and click "Check Status" to view NTN details
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
