import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Search, Eye, FileText, Upload, Download } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable, type Column } from "@/components/shared/DataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatDate } from "@/lib/utils";

const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5001/api").replace(/\/api$/, "");

const psebStatusOptions = [
  "DRAFT", "SUBMITTED", "PRIMARY_APPROVED", "PAYMENT_PENDING",
  "PAYMENT_SUBMITTED", "APPROVED", "REJECTED", "REQUIRES_INFO",
];

export default function PSEBManagement() {
  const queryClient = useQueryClient();
  const [companySearch, setCompanySearch] = useState("");
  const [companyStatus, setCompanyStatus] = useState("");
  const [ccSearch, setCcSearch] = useState("");
  const [ccStatus, setCcStatus] = useState("");

  const [companyDetailOpen, setCompanyDetailOpen] = useState(false);
  const [companyDetail, setCompanyDetail] = useState<any>(null);
  const [ccDetailOpen, setCcDetailOpen] = useState(false);
  const [ccDetail, setCcDetail] = useState<any>(null);
  const companyDocRef = useRef<HTMLInputElement>(null);
  const ccDocRef = useRef<HTMLInputElement>(null);

  const [reviewForm, setReviewForm] = useState({
    status: "", adminNotes: "", psebRefNumber: "", certificateUrl: "",
    provisionalLetterUrl: "", inspectionDate: "", inspectionNotes: "",
  });

  const { data: companyData, isLoading: loadingCompany, refetch: refetchCompany } = useQuery({
    queryKey: ["admin-pseb-company", companySearch, companyStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (companySearch) params.set("search", companySearch);
      if (companyStatus) params.set("status", companyStatus);
      const res = await api.get(`/pseb/admin/company?${params}`);
      return res.data?.data || [];
    },
  });

  const { data: ccData, isLoading: loadingCC, refetch: refetchCC } = useQuery({
    queryKey: ["admin-pseb-call-center", ccSearch, ccStatus],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (ccSearch) params.set("search", ccSearch);
      if (ccStatus) params.set("status", ccStatus);
      const res = await api.get(`/pseb/admin/call-center?${params}`);
      return res.data?.data || [];
    },
  });

  const reviewCompanyMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      await api.put(`/pseb/admin/company/${id}/review`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pseb-company"] });
      toast.success("Company registration updated");
      setCompanyDetailOpen(false);
    },
    onError: () => toast.error("Failed to update"),
  });

  const reviewCCMutation = useMutation({
    mutationFn: async ({ id, ...data }: any) => {
      await api.put(`/pseb/admin/call-center/${id}/review`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pseb-call-center"] });
      toast.success("Call Center registration updated");
      setCcDetailOpen(false);
    },
    onError: () => toast.error("Failed to update"),
  });

  const uploadCompanyDocMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/pseb/admin/company/${id}/upload-doc`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-pseb-company"] });
      if (companyDetail) setCompanyDetail({ ...companyDetail, adminDocUrl: data.data?.url, adminDocName: data.data?.name });
      toast.success("Document uploaded successfully");
    },
    onError: () => toast.error("Failed to upload document"),
  });

  const uploadCCDocMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post(`/pseb/admin/call-center/${id}/upload-doc`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-pseb-call-center"] });
      if (ccDetail) setCcDetail({ ...ccDetail, adminDocUrl: data.data?.url, adminDocName: data.data?.name });
      toast.success("Document uploaded successfully");
    },
    onError: () => toast.error("Failed to upload document"),
  });

  const openCompanyDetail = (item: any) => {
    setReviewForm({
      status: item.status, adminNotes: item.adminNotes || "",
      psebRefNumber: item.psebRefNumber || "", certificateUrl: item.certificateUrl || "",
      provisionalLetterUrl: "", inspectionDate: "", inspectionNotes: "",
    });
    setCompanyDetail(item);
    setCompanyDetailOpen(true);
  };

  const openCCDetail = (item: any) => {
    setReviewForm({
      status: item.status, adminNotes: item.adminNotes || "",
      psebRefNumber: item.psebRefNumber || "", certificateUrl: item.certificateUrl || "",
      provisionalLetterUrl: item.provisionalLetterUrl || "",
      inspectionDate: item.inspectionDate ? item.inspectionDate.split("T")[0] : "",
      inspectionNotes: item.inspectionNotes || "",
    });
    setCcDetail(item);
    setCcDetailOpen(true);
  };

  const handleCompanyReview = () => {
    if (!companyDetail) return;
    reviewCompanyMutation.mutate({ id: companyDetail.id, ...reviewForm });
  };

  const handleCCReview = () => {
    if (!ccDetail) return;
    reviewCCMutation.mutate({ id: ccDetail.id, ...reviewForm });
  };

  const companyColumns: Column<any>[] = [
    { key: "companyName", header: "Company Name", render: (item) => <span className="font-medium">{item.companyName}</span> },
    { key: "companyType", header: "Type" },
    { key: "businessNtn", header: "NTN", render: (item) => item.businessNtn || "-" },
    { key: "user", header: "User", render: (item) => item.user?.email || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    {
      key: "actions", header: "Actions",
      render: (item) => (
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openCompanyDetail(item); }}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  const ccColumns: Column<any>[] = [
    { key: "companyName", header: "Company Name", render: (item) => <span className="font-medium">{item.companyName}</span> },
    { key: "companyType", header: "Type" },
    { key: "seatingCapacity", header: "Seats", render: (item) => item.seatingCapacity || "-" },
    { key: "user", header: "User", render: (item) => item.user?.email || "-" },
    { key: "status", header: "Status", render: (item) => <StatusBadge status={item.status} /> },
    { key: "isBranch", header: "Branch?", render: (item) => item.isBranch ? "Yes" : "No" },
    { key: "createdAt", header: "Date", render: (item) => formatDate(item.createdAt) },
    {
      key: "actions", header: "Actions",
      render: (item) => (
        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openCCDetail(item); }}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="PSEB Registrations" subtitle="Manage PSEB company and call center registrations" />

      <Tabs
        defaultTab="company"
        tabs={[
          {
            id: "company",
            label: "Company / Firm",
            content: (
              <>
                <Card className="mb-6"><CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search by company name or NTN..." className="pl-9 rounded-lg"
                        value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} />
                    </div>
                    <div className="space-y-1.5 min-w-[140px]">
                      <Label>Status</Label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        value={companyStatus} onChange={(e) => setCompanyStatus(e.target.value)}>
                        <option value="">All Status</option>
                        {psebStatusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                  </div>
                </CardContent></Card>

                {loadingCompany ? <LoadingSpinner size="lg" /> : (
                  <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
                    <DataTable columns={companyColumns} data={companyData || []}
                      keyExtractor={(item) => item.id}
                      emptyTitle="No company registrations found" />
                  </div>
                )}
              </>
            ),
          },
          {
            id: "call-center",
            label: "Call Center / BPO",
            content: (
              <>
                <Card className="mb-6"><CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search by company name or NTN..." className="pl-9 rounded-lg"
                        value={ccSearch} onChange={(e) => setCcSearch(e.target.value)} />
                    </div>
                    <div className="space-y-1.5 min-w-[140px]">
                      <Label>Status</Label>
                      <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                        value={ccStatus} onChange={(e) => setCcStatus(e.target.value)}>
                        <option value="">All Status</option>
                        {psebStatusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                      </select>
                    </div>
                  </div>
                </CardContent></Card>

                {loadingCC ? <LoadingSpinner size="lg" /> : (
                  <div className="rounded-xl border border-border/60 overflow-hidden bg-card">
                    <DataTable columns={ccColumns} data={ccData || []}
                      keyExtractor={(item) => item.id}
                      emptyTitle="No call center registrations found" />
                  </div>
                )}
              </>
            ),
          },
        ]}
      />

      {/* Company Detail Dialog */}
      <Dialog open={companyDetailOpen} onOpenChange={setCompanyDetailOpen}>
        <DialogContent className="sm:max-w-4xl rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Company Registration Details</DialogTitle></DialogHeader>
          {companyDetail && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Business Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Company Name</Label><p className="font-medium">{companyDetail.companyName}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Company Type</Label><p className="font-medium">{companyDetail.companyType}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Business NTN</Label><p className="font-medium">{companyDetail.businessNtn || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Registration Date</Label><p className="font-medium">{companyDetail.registrationDate ? formatDate(companyDetail.registrationDate) : "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Total Employees</Label><p className="font-medium">{companyDetail.totalEmployees ?? "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Status</Label><StatusBadge status={companyDetail.status} /></div>
                  {companyDetail.fee != null && <div><Label className="text-xs text-muted-foreground">Fee</Label><p className="font-medium">PKR {companyDetail.fee.toLocaleString()}</p></div>}
                  <div><Label className="text-xs text-muted-foreground">PSEB Ref #</Label><p className="font-medium">{companyDetail.psebRefNumber || "-"}</p></div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3">User Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Name</Label><p className="font-medium">{companyDetail.user?.name || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Email</Label><p className="font-medium">{companyDetail.user?.email || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Phone</Label><p className="font-medium">{companyDetail.user?.phone || "-"}</p></div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3">Contact & Address</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2"><Label className="text-xs text-muted-foreground">Address</Label><p className="font-medium">{companyDetail.address || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">City</Label><p className="font-medium">{companyDetail.city || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Province</Label><p className="font-medium">{companyDetail.province || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Phone</Label><p className="font-medium">{companyDetail.phone || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Email</Label><p className="font-medium">{companyDetail.email || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Website</Label><p className="font-medium">{companyDetail.website || "-"}</p></div>
                </div>
              </div>

              {companyDetail.servicesOffered?.length > 0 && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-3">Services Offered</h4>
                  <div className="flex flex-wrap gap-2">
                    {companyDetail.servicesOffered.map((s: string) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                  {companyDetail.serviceDescription && (
                    <p className="text-sm text-muted-foreground mt-2">{companyDetail.serviceDescription}</p>
                  )}
                </div>
              )}

              {companyDetail.directors?.length > 0 && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-3">Directors / Partners ({companyDetail.directors.length})</h4>
                  <div className="space-y-2">
                    {companyDetail.directors.map((d: any, i: number) => (
                      <div key={i} className="flex flex-wrap items-center gap-4 p-2 rounded-lg bg-muted/30 text-sm">
                        <span className="font-medium min-w-[120px]">{d.name}</span>
                        <span className="text-muted-foreground">CNIC: {d.cnic}</span>
                        {d.designation && <Badge variant="outline">{d.designation}</Badge>}
                        {d.email && <span className="text-muted-foreground">{d.email}</span>}
                        {d.phone && <span className="text-muted-foreground">{d.phone}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3">Documents ({companyDetail.paymentReceiptUrl ? "Payment Receipt + Uploads" : "Uploads"})</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "NTN Certificate", url: companyDetail.ntnCertificateUrl },
                    { label: "Memorandum of Association (MOA)", url: companyDetail.moaUrl },
                    { label: "Articles of Association (AOA)", url: companyDetail.aoaUrl },
                    { label: "Form-29", url: companyDetail.form29Url },
                    { label: "Form-2", url: companyDetail.form2Url },
                    { label: "Incorporation Certificate", url: companyDetail.incCertificateUrl },
                    { label: "Partnership Deed", url: companyDetail.partnershipDeedUrl },
                    { label: "Form-C", url: companyDetail.formCUrl },
                    { label: "Bank Statement (6 months)", url: companyDetail.bankStatementUrl },
                    { label: "Payment Receipt", url: companyDetail.paymentReceiptUrl },
                    { label: "Certificate", url: companyDetail.certificateUrl },
                  ].filter((d) => d.url).map((doc) => (
                    <a key={doc.label} href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="group block rounded-lg border border-border/60 overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                        {doc.url?.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) ? (
                          <img src={doc.url} alt={doc.label} className="max-h-full max-w-full object-contain p-2" />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2 border-t border-border/60">
                        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{doc.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{doc.url.split("/").pop()}</p>
                      </div>
                    </a>
                  ))}
                  {companyDetail.cnicDirectorsUrl?.map((url: string, i: number) => (
                    <a key={`cnic-${i}`} href={url} target="_blank" rel="noopener noreferrer"
                      className="group block rounded-lg border border-border/60 overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                        {url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) ? (
                          <img src={url} alt={`CNIC #${i + 1}`} className="max-h-full max-w-full object-contain p-2" />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2 border-t border-border/60">
                        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">CNIC Director #{i + 1}</p>
                      </div>
                    </a>
                  ))}
                </div>
                {!companyDetail.ntnCertificateUrl && !companyDetail.moaUrl && !companyDetail.aoaUrl && !companyDetail.form29Url && !companyDetail.form2Url && !companyDetail.incCertificateUrl && !companyDetail.partnershipDeedUrl && !companyDetail.formCUrl && !companyDetail.bankStatementUrl && !companyDetail.paymentReceiptUrl && !companyDetail.certificateUrl && (!companyDetail.cnicDirectorsUrl || companyDetail.cnicDirectorsUrl.length === 0) && (
                  <p className="text-sm text-muted-foreground">No documents uploaded</p>
                )}
              </div>

              {/* Admin Document Upload */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Admin Document (visible to user)
                </h4>
                {companyDetail.adminDocUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <a href={`${BASE_URL}${companyDetail.adminDocUrl}`} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors">
                        {companyDetail.adminDocName || "Download Document"}
                      </a>
                    </div>
                    <a href={`${BASE_URL}${companyDetail.adminDocUrl}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> View</Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No document uploaded yet</p>
                )}
                <input ref={companyDocRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && companyDetail) uploadCompanyDocMutation.mutate({ id: companyDetail.id, file });
                  }} />
                <Button variant="outline" size="sm" onClick={() => companyDocRef.current?.click()}
                  disabled={uploadCompanyDocMutation.isPending}>
                  <Upload className="h-4 w-4 mr-1" />
                  {uploadCompanyDocMutation.isPending ? "Uploading..." : "Upload Document"}
                </Button>
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="text-sm font-semibold">Review & Update</h4>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={reviewForm.status} onChange={(e) => setReviewForm((p) => ({ ...p, status: e.target.value }))}>
                    {psebStatusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>PSEB Reference Number</Label>
                  <Input value={reviewForm.psebRefNumber}
                    onChange={(e) => setReviewForm((p) => ({ ...p, psebRefNumber: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Certificate URL</Label>
                  <Input value={reviewForm.certificateUrl}
                    onChange={(e) => setReviewForm((p) => ({ ...p, certificateUrl: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Admin Notes</Label>
                  <Textarea value={reviewForm.adminNotes} rows={3}
                    onChange={(e) => setReviewForm((p) => ({ ...p, adminNotes: e.target.value }))} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompanyDetailOpen(false)}>Close</Button>
            <Button onClick={handleCompanyReview} disabled={reviewCompanyMutation.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Call Center Detail Dialog */}
      <Dialog open={ccDetailOpen} onOpenChange={setCcDetailOpen}>
        <DialogContent className="sm:max-w-4xl rounded-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Call Center Registration Details</DialogTitle></DialogHeader>
          {ccDetail && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /> Business Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Company Name</Label><p className="font-medium">{ccDetail.companyName}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Company Type</Label><p className="font-medium">{ccDetail.companyType}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Business NTN</Label><p className="font-medium">{ccDetail.businessNtn || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Registration Date</Label><p className="font-medium">{ccDetail.registrationDate ? formatDate(ccDetail.registrationDate) : "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Total Employees</Label><p className="font-medium">{ccDetail.totalEmployees ?? "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Status</Label><StatusBadge status={ccDetail.status} /></div>
                  {ccDetail.fee != null && <div><Label className="text-xs text-muted-foreground">Annual Fee</Label><p className="font-medium">PKR {ccDetail.fee.toLocaleString()}</p></div>}
                  <div><Label className="text-xs text-muted-foreground">PSEB Ref #</Label><p className="font-medium">{ccDetail.psebRefNumber || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Branch?</Label><p className="font-medium">{ccDetail.isBranch ? "Yes" : "No"}</p></div>
                  {ccDetail.mainOfficeId && <div><Label className="text-xs text-muted-foreground">Main Office ID</Label><p className="font-medium">{ccDetail.mainOfficeId}</p></div>}
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3">User Information</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Name</Label><p className="font-medium">{ccDetail.user?.name || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Email</Label><p className="font-medium">{ccDetail.user?.email || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Phone</Label><p className="font-medium">{ccDetail.user?.phone || "-"}</p></div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3">Call Center Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Seating Capacity</Label><p className="font-medium">{ccDetail.seatingCapacity ?? "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Number of Shifts</Label><p className="font-medium">{ccDetail.numberOfShifts ?? "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Dialer System</Label><p className="font-medium">{ccDetail.dialerSystem || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">PBX System</Label><p className="font-medium">{ccDetail.pbxSystem || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Internet Bandwidth</Label><p className="font-medium">{ccDetail.internetBandwidth ? `${ccDetail.internetBandwidth} Mbps` : "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Floor Area</Label><p className="font-medium">{ccDetail.floorArea || "-"}</p></div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3">Contact & Address</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2"><Label className="text-xs text-muted-foreground">Address</Label><p className="font-medium">{ccDetail.address || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">City</Label><p className="font-medium">{ccDetail.city || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Province</Label><p className="font-medium">{ccDetail.province || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Phone</Label><p className="font-medium">{ccDetail.phone || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Email</Label><p className="font-medium">{ccDetail.email || "-"}</p></div>
                  <div><Label className="text-xs text-muted-foreground">Website</Label><p className="font-medium">{ccDetail.website || "-"}</p></div>
                </div>
              </div>

              {ccDetail.serviceType?.length > 0 && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-3">Service Types</h4>
                  <div className="flex flex-wrap gap-2">
                    {ccDetail.serviceType.map((s: string) => (
                      <Badge key={s} variant="secondary">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {ccDetail.clientCountries?.length > 0 && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-3">Client Countries</h4>
                  <p className="text-sm">{ccDetail.clientCountries.join(", ")}</p>
                </div>
              )}

              {ccDetail.serviceDescription && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-3">Service Description</h4>
                  <p className="text-sm">{ccDetail.serviceDescription}</p>
                </div>
              )}

              {ccDetail.directors?.length > 0 && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-3">Directors / Partners ({ccDetail.directors.length})</h4>
                  <div className="space-y-2">
                    {ccDetail.directors.map((d: any, i: number) => (
                      <div key={i} className="flex flex-wrap items-center gap-4 p-2 rounded-lg bg-muted/30 text-sm">
                        <span className="font-medium min-w-[120px]">{d.name}</span>
                        <span className="text-muted-foreground">CNIC: {d.cnic}</span>
                        {d.designation && <Badge variant="outline">{d.designation}</Badge>}
                        {d.email && <span className="text-muted-foreground">{d.email}</span>}
                        {d.phone && <span className="text-muted-foreground">{d.phone}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border p-4">
                <h4 className="text-sm font-semibold mb-3">Documents</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: "NTN Certificate", url: ccDetail.ntnCertificateUrl },
                    { label: "Memorandum of Association (MOA)", url: ccDetail.moaUrl },
                    { label: "Articles of Association (AOA)", url: ccDetail.aoaUrl },
                    { label: "Form-29", url: ccDetail.form29Url },
                    { label: "Incorporation Certificate", url: ccDetail.incCertificateUrl },
                    { label: "Partnership Deed", url: ccDetail.partnershipDeedUrl },
                    { label: "Form-C", url: ccDetail.formCUrl },
                    { label: "Bank Statement", url: ccDetail.bankStatementUrl },
                    { label: "Equipment List", url: ccDetail.equipmentListUrl },
                    { label: "Provisional Letter", url: ccDetail.provisionalLetterUrl },
                    { label: "Certificate", url: ccDetail.certificateUrl },
                    { label: "Payment Receipt", url: ccDetail.paymentReceiptUrl },
                  ].filter((d) => d.url).map((doc) => (
                    <a key={doc.label} href={doc.url} target="_blank" rel="noopener noreferrer"
                      className="group block rounded-lg border border-border/60 overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                        {doc.url?.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) ? (
                          <img src={doc.url} alt={doc.label} className="max-h-full max-w-full object-contain p-2" />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2 border-t border-border/60">
                        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">{doc.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{doc.url.split("/").pop()}</p>
                      </div>
                    </a>
                  ))}
                  {ccDetail.cnicDirectorsUrl?.map((url: string, i: number) => (
                    <a key={`cnic-${i}`} href={url} target="_blank" rel="noopener noreferrer"
                      className="group block rounded-lg border border-border/60 overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                        {url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) ? (
                          <img src={url} alt={`CNIC #${i + 1}`} className="max-h-full max-w-full object-contain p-2" />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2 border-t border-border/60">
                        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">CNIC Director #{i + 1}</p>
                      </div>
                    </a>
                  ))}
                  {ccDetail.officePhotosUrl?.map((url: string, i: number) => (
                    <a key={`photo-${i}`} href={url} target="_blank" rel="noopener noreferrer"
                      className="group block rounded-lg border border-border/60 overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center overflow-hidden">
                        {url.match(/\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i) ? (
                          <img src={url} alt={`Office #${i + 1}`} className="max-h-full max-w-full object-contain p-2" />
                        ) : (
                          <FileText className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-2 border-t border-border/60">
                        <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">Office Photo #{i + 1}</p>
                      </div>
                    </a>
                  ))}
                </div>
                {!ccDetail.ntnCertificateUrl && !ccDetail.moaUrl && !ccDetail.aoaUrl && !ccDetail.form29Url &&
                 !ccDetail.incCertificateUrl && !ccDetail.partnershipDeedUrl && !ccDetail.formCUrl &&
                 !ccDetail.bankStatementUrl && !ccDetail.equipmentListUrl && !ccDetail.provisionalLetterUrl &&
                 !ccDetail.certificateUrl && !ccDetail.paymentReceiptUrl &&
                 (!ccDetail.cnicDirectorsUrl || ccDetail.cnicDirectorsUrl.length === 0) &&
                 (!ccDetail.officePhotosUrl || ccDetail.officePhotosUrl.length === 0) && (
                  <p className="text-sm text-muted-foreground">No documents uploaded</p>
                )}
              </div>

              {/* Admin Document Upload */}
              <div className="rounded-lg border border-border p-4 space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Admin Document (visible to user)
                </h4>
                {ccDetail.adminDocUrl ? (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <a href={`${BASE_URL}${ccDetail.adminDocUrl}`} target="_blank" rel="noopener noreferrer"
                        className="text-sm font-medium hover:text-primary transition-colors">
                        {ccDetail.adminDocName || "Download Document"}
                      </a>
                    </div>
                    <a href={`${BASE_URL}${ccDetail.adminDocUrl}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> View</Button>
                    </a>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No document uploaded yet</p>
                )}
                <input ref={ccDocRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && ccDetail) uploadCCDocMutation.mutate({ id: ccDetail.id, file });
                  }} />
                <Button variant="outline" size="sm" onClick={() => ccDocRef.current?.click()}
                  disabled={uploadCCDocMutation.isPending}>
                  <Upload className="h-4 w-4 mr-1" />
                  {uploadCCDocMutation.isPending ? "Uploading..." : "Upload Document"}
                </Button>
              </div>

              {ccDetail.inspectionDate && (
                <div className="rounded-lg border border-border p-4">
                  <h4 className="text-sm font-semibold mb-3">Site Inspection</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label className="text-xs text-muted-foreground">Inspection Date</Label><p className="font-medium">{formatDate(ccDetail.inspectionDate)}</p></div>
                    {ccDetail.inspectionNotes && <div className="md:col-span-2"><Label className="text-xs text-muted-foreground">Inspection Notes</Label><p className="font-medium">{ccDetail.inspectionNotes}</p></div>}
                  </div>
                </div>
              )}

              {ccDetail.adminNotes && (
                <div className="rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-950/20 p-4">
                  <h4 className="text-sm font-semibold text-purple-700 mb-1">Previous Admin Notes</h4>
                  <p className="text-sm">{ccDetail.adminNotes}</p>
                </div>
              )}

              <div className="border-t pt-4 space-y-4">
                <h4 className="text-sm font-semibold">Review & Update</h4>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    value={reviewForm.status} onChange={(e) => setReviewForm((p) => ({ ...p, status: e.target.value }))}>
                    {psebStatusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>PSEB Reference Number</Label>
                  <Input value={reviewForm.psebRefNumber}
                    onChange={(e) => setReviewForm((p) => ({ ...p, psebRefNumber: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Provisional Letter URL</Label>
                    <Input value={reviewForm.provisionalLetterUrl}
                      onChange={(e) => setReviewForm((p) => ({ ...p, provisionalLetterUrl: e.target.value }))} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Certificate URL</Label>
                    <Input value={reviewForm.certificateUrl}
                      onChange={(e) => setReviewForm((p) => ({ ...p, certificateUrl: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Inspection Date</Label>
                  <Input type="date" value={reviewForm.inspectionDate}
                    onChange={(e) => setReviewForm((p) => ({ ...p, inspectionDate: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Inspection Notes</Label>
                  <Textarea value={reviewForm.inspectionNotes} rows={2}
                    onChange={(e) => setReviewForm((p) => ({ ...p, inspectionNotes: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Admin Notes</Label>
                  <Textarea value={reviewForm.adminNotes} rows={3}
                    onChange={(e) => setReviewForm((p) => ({ ...p, adminNotes: e.target.value }))} />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCcDetailOpen(false)}>Close</Button>
            <Button onClick={handleCCReview} disabled={reviewCCMutation.isPending}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
