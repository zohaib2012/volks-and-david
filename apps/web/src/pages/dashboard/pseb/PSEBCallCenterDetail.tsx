import { useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { ArrowLeft, Phone, CheckCircle, Clock, Upload, FileText, Download, AlertCircle, Building2 } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

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

const processSteps = [
  { key: "submitted", label: "Application Submitted", desc: "Documents received and under review" },
  { key: "provisional", label: "Provisional Letter (60 Days)", desc: "Temporary approval with 60-day validity" },
  { key: "inspection", label: "Site Inspection", desc: "Physical inspection by PSEB team" },
  { key: "certificate", label: "1-Year Certificate", desc: "Full registration certificate issued" },
];

export default function PSEBCallCenterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const receiptInputRef = useRef<HTMLInputElement>(null);

  const { data: record, isLoading } = useQuery({
    queryKey: ["pseb-call-center", id],
    queryFn: async () => {
      const res = await api.get(`/pseb/call-center/${id}`);
      return res.data?.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ paymentReceiptUrl }: { paymentReceiptUrl: string }) => {
      await api.put(`/pseb/call-center/${id}`, { paymentReceiptUrl, status: "PAYMENT_SUBMITTED" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pseb-call-center", id] });
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
  if (!record) return <EmptyState icon={<Phone />} title="Not found" description="Registration not found" />;

  const getActiveProcessStep = () => {
    if (record.status === "APPROVED") return 3;
    if (record.status === "PRIMARY_APPROVED" || record.status === "PAYMENT_SUBMITTED") return 2;
    if (record.status === "SUBMITTED") return 0;
    return 0;
  };

  const activeStep = getActiveProcessStep();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/pseb")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>
      <PageHeader title={record.companyName} subtitle="PSEB Call Center Registration" />

      <Card><CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={statusColors[record.status]}>{record.status.replace(/_/g, " ")}</Badge>
          {record.provisionalLetterUrl && (
            <a href={record.provisionalLetterUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" /> Provisional Letter
              </Button>
            </a>
          )}
        </div>

        <div className="relative">
          {processSteps.map((step, i) => {
            const isActive = i <= activeStep;
            const isCurrent = i === activeStep;
            return (
              <div key={step.key} className="flex items-start gap-3 pb-6 last:pb-0 relative">
                {i < processSteps.length - 1 && (
                  <div className={`absolute left-[15px] top-8 w-0.5 h-full -z-10 ${
                    isActive ? "bg-emerald-500" : "bg-muted"
                  }`} />
                )}
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                  isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary/30" :
                  isActive ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {isActive ? <CheckCircle className="h-4 w-4" /> : <div className="h-2 w-2 rounded-full bg-current" />}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
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
              <p className="text-sm font-medium">PSEB Registration Fee (Annual)</p>
              <p className="text-2xl font-bold">PKR {record.fee?.toLocaleString() || "20,000"}/year</p>
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
            <div className="flex justify-between"><span className="text-muted-foreground">Branch?</span><span className="font-medium">{record.isBranch ? "Yes" : "No"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fee</span><span className="font-medium">PKR {record.fee?.toLocaleString() || "N/A"}/year</span></div>
          </CardContent></Card>

        <Card><CardHeader><CardTitle className="text-sm">Call Center Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Seating Capacity</span><span className="font-medium">{record.seatingCapacity || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shifts</span><span className="font-medium">{record.numberOfShifts || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Dialer System</span><span className="font-medium">{record.dialerSystem || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">PBX System</span><span className="font-medium">{record.pbxSystem || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Internet</span><span className="font-medium">{record.internetBandwidth ? `${record.internetBandwidth} Mbps` : "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Floor Area</span><span className="font-medium">{record.floorArea || "N/A"}</span></div>
          </CardContent></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Contact & Address</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium text-right">{record.address || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="font-medium">{record.city || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Province</span><span className="font-medium">{record.province || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-medium">{record.phone || "N/A"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{record.email || "N/A"}</span></div>
          </CardContent></Card>

        <Card><CardHeader><CardTitle className="text-sm">Service Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex flex-wrap gap-2 mb-2">
              {record.serviceType?.map((s: string) => (
                <Badge key={s} variant="outline">{s}</Badge>
              ))}
            </div>
            {record.clientCountries?.length > 0 && (
              <div className="flex justify-between"><span className="text-muted-foreground">Countries</span><span className="font-medium">{record.clientCountries.join(", ")}</span></div>
            )}
            {record.serviceDescription && <p className="text-sm text-muted-foreground mt-2">{record.serviceDescription}</p>}
          </CardContent></Card>
      </div>

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
              { label: "Incorporation Certificate", url: record.incCertificateUrl },
              { label: "Partnership Deed", url: record.partnershipDeedUrl },
              { label: "Form-C", url: record.formCUrl },
              { label: "Bank Statement", url: record.bankStatementUrl },
              { label: "Equipment List", url: record.equipmentListUrl },
              { label: "Provisional Letter", url: record.provisionalLetterUrl },
              { label: "Certificate", url: record.certificateUrl },
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
            {record.officePhotosUrl?.map((url: string, i: number) => (
              <a key={`photo-${i}`} href={url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/30 transition-colors text-sm">
                <FileText className="h-4 w-4 text-primary" />
                <span>Office Photo #{i + 1}</span>
              </a>
            ))}
            {!record.ntnCertificateUrl && !record.moaUrl && !record.aoaUrl && !record.form29Url &&
             !record.incCertificateUrl && !record.partnershipDeedUrl && !record.formCUrl &&
             !record.bankStatementUrl && !record.equipmentListUrl && !record.provisionalLetterUrl &&
             !record.certificateUrl && (!record.cnicDirectorsUrl || record.cnicDirectorsUrl.length === 0) &&
             (!record.officePhotosUrl || record.officePhotosUrl.length === 0) && (
              <p className="text-sm text-muted-foreground">No documents uploaded</p>
            )}
          </div>
        </CardContent></Card>

      {record.inspectionDate && (
        <Card><CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Site Inspection</p>
              <p className="text-sm text-muted-foreground">Date: {formatDate(record.inspectionDate)}</p>
              {record.inspectionNotes && <p className="text-sm text-muted-foreground mt-1">Notes: {record.inspectionNotes}</p>}
            </div>
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent></Card>
      )}

      {record.adminNotes && (
        <Card className="border-purple-200"><CardHeader><CardTitle className="text-sm text-purple-700">Admin Notes</CardTitle></CardHeader>
          <CardContent><p className="text-sm">{record.adminNotes}</p></CardContent></Card>
      )}
    </motion.div>
  );
}
