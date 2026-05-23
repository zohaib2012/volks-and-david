import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Building2, CheckCircle, Clock, Upload, FileText, Download, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate, resolveFileUrl } from "@/lib/utils";

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  PRIMARY_APPROVED: "bg-cyan-100 text-cyan-700",
  PAYMENT_PENDING: "bg-yellow-100 text-yellow-700",
  PAYMENT_SUBMITTED: "bg-orange-100 text-orange-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  REQUIRES_INFO: "bg-purple-100 text-purple-700",
};

const statusExplanations: Record<string, string> = {
  SUBMITTED: "Application received and under initial review",
  PRIMARY_APPROVED: "Application approved pending payment of registration fee",
  PAYMENT_PENDING: "Please submit your registration fee to proceed",
  PAYMENT_SUBMITTED: "Payment receipt received, awaiting confirmation",
  APPROVED: "Registration complete! Certificate has been issued",
  REJECTED: "Application did not meet requirements",
  REQUIRES_INFO: "Additional information/documentation is needed",
};

const timelineStages = [
  { status: "SUBMITTED", label: "Submitted", icon: Clock },
  { status: "PRIMARY_APPROVED", label: "Primary Approved", icon: CheckCircle },
  { status: "PAYMENT_SUBMITTED", label: "Payment Received", icon: Upload },
  { status: "APPROVED", label: "Approved", icon: CheckCircle },
];

const timelineIndex: Record<string, number> = {
  SUBMITTED: 0,
  PRIMARY_APPROVED: 1,
  PAYMENT_PENDING: 1,
  PAYMENT_SUBMITTED: 2,
  APPROVED: 3,
};

export default function PSEBCompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const { data: record, isLoading } = useQuery({
    queryKey: ["pseb-company", id],
    queryFn: async () => {
      const res = await api.get(`/pseb/company/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ paymentReceiptUrl }: { paymentReceiptUrl: string }) => {
      await api.put(`/pseb/company/${id}`, { paymentReceiptUrl, status: "PAYMENT_SUBMITTED" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pseb-company", id] });
      toast.success("Payment receipt uploaded successfully");
    },
    onError: () => toast.error("Failed to upload receipt"),
  });

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/pseb/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.data?.url) {
        updateMutation.mutate({ paymentReceiptUrl: res.data.data.url });
      }
    } catch {
      toast.error("Upload failed");
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (!record) return <EmptyState icon={<Building2 />} title="Not found" description="Registration not found" />;

  const currentStep = timelineIndex[record.status] ?? 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/pseb")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      <PageHeader title={record.companyName} subtitle="PSEB Company Registration" />

      <Card><CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={statusColors[record.status]}>{record.status.replace(/_/g, " ")}</Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">{statusExplanations[record.status] || ""}</p>

        <div className="flex items-center justify-between mb-2">
          {timelineStages.map((stage, i) => {
            const StageIcon = stage.icon;
            const isActive = i <= currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={stage.status} className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                  isActive ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <StageIcon className="h-4 w-4" />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{stage.label}</span>
              </div>
            );
          })}
        </div>
      </CardContent></Card>

      {record.status === "PRIMARY_APPROVED" && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardHeader><CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" /> Payment Required
          </CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-white dark:bg-background p-4 border border-yellow-200">
              <p className="text-sm font-medium">PSEB Registration Fee</p>
              <p className="text-2xl font-bold">PKR {record.fee?.toLocaleString() || "5,000"}</p>
              <p className="text-xs text-muted-foreground mt-2">Bank: National Bank of Pakistan</p>
              <p className="text-xs text-muted-foreground">Account: PSEB Collection Account # 1234-5678-9012</p>
              <p className="text-xs text-muted-foreground">IBAN: PK12NBPA1234567890123</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Upload Payment Receipt</p>
              <input ref={receiptInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleReceiptUpload} />
              <Button onClick={() => receiptInputRef.current?.click()} disabled={updateMutation.isPending}>
                <Upload className="h-4 w-4 mr-2" /> Upload Receipt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {record.status === "APPROVED" && record.certificateUrl && (
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Registration Certificate</p>
              <p className="text-sm text-muted-foreground">PSEB Ref: {record.psebRefNumber || "N/A"}</p>
            </div>
            <a href={record.certificateUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Download Certificate
              </Button>
            </a>
          </div>
        </CardContent></Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Company Type</span><span className="font-medium">{record.companyType}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">NTN</span><span className="font-medium">{record.businessNtn || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Registration Date</span><span className="font-medium">{record.registrationDate ? formatDate(record.registrationDate) : "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Employees</span><span className="font-medium">{record.totalEmployees || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">PKR {record.fee?.toLocaleString() || "N/A"}</span></div>
          </CardContent></Card>

        <Card><CardHeader><CardTitle className="text-sm">Contact & Address</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium text-right">{record.address || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="font-medium">{record.city || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Province</span><span className="font-medium">{record.province || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{record.phone || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{record.email || "N/A"}</span></div>
          </CardContent></Card>
      </div>

      <Card><CardHeader><CardTitle className="text-sm">Services</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-2">
            {record.servicesOffered?.map((s: string) => (
              <Badge key={s} variant="outline">{s}</Badge>
            ))}
          </div>
          {record.serviceDescription && <p className="text-sm text-muted-foreground">{record.serviceDescription}</p>}
        </CardContent></Card>

      {record.directors?.length > 0 && (
        <Card><CardHeader><CardTitle className="text-sm">Directors / Partners</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.directors.map((d: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground">{d.cnic} {d.designation ? `- ${d.designation}` : ""}</span>
                </div>
              ))}
            </div>
          </CardContent></Card>
      )}

      <Card><CardHeader><CardTitle className="text-sm">Documents</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {[
              { label: "NTN Certificate", url: record.ntnCertificateUrl },
              { label: "MOA", url: record.moaUrl },
              { label: "AOA", url: record.aoaUrl },
              { label: "Form-29", url: record.form29Url },
              { label: "Form-2", url: record.form2Url },
              { label: "Incorporation Certificate", url: record.incCertificateUrl },
              { label: "Partnership Deed", url: record.partnershipDeedUrl },
              { label: "Form-C", url: record.formCUrl },
              { label: "Bank Statement", url: record.bankStatementUrl },
            ].filter((d) => d.url).map((doc) => (
              <a key={doc.label} href={doc.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span>{doc.label}</span>
              </a>
            ))}
            {record.cnicDirectorsUrl?.map((url: string, i: number) => (
              <a key={`cnic-${i}`} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span>CNIC of Directors #{i + 1}</span>
              </a>
            ))}
            {!record.ntnCertificateUrl && !record.moaUrl && !record.aoaUrl && !record.form29Url && !record.form2Url &&
             !record.incCertificateUrl && !record.partnershipDeedUrl && !record.formCUrl && !record.bankStatementUrl &&
             (!record.cnicDirectorsUrl || record.cnicDirectorsUrl.length === 0) && (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            )}
          </div>
        </CardContent></Card>

      {record.adminDocUrl && (
        <Card className="border-primary/20">
          <CardHeader><CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Document from Admin
          </CardTitle></CardHeader>
          <CardContent>
            <a href={resolveFileUrl(record.adminDocUrl)} target="_blank" rel="noopener noreferrer">
              <Button>
                <Download className="h-4 w-4 mr-2" /> {record.adminDocName || "Download Document"}
              </Button>
            </a>
          </CardContent>
        </Card>
      )}

      {record.adminNotes && (
        <Card className="border-purple-200"><CardHeader><CardTitle className="text-sm text-purple-700">Admin Notes</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{record.adminNotes}</p></CardContent></Card>
      )}
    </motion.div>
  );
}
