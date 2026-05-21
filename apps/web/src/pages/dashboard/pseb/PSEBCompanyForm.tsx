import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, FileCheck, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";

const steps = ["Business Info", "Directors", "Services & Address", "Documents & Submit"];

const companyTypes = [
  { value: "PRIVATE_LIMITED", label: "Private Limited" },
  { value: "PUBLIC_LIMITED", label: "Public Limited" },
  { value: "SMC_PVT_LTD", label: "SMC (Private) Limited" },
  { value: "SOLE_PROPRIETOR", label: "Sole Proprietor" },
  { value: "PARTNERSHIP", label: "Partnership" },
  { value: "AOP", label: "Association of Persons (AOP)" },
];

const serviceOptions = [
  { value: "SOFTWARE_DEV", label: "Software Development" },
  { value: "WEB_DEV", label: "Web Development" },
  { value: "MOBILE_APP", label: "Mobile App Development" },
  { value: "IT_CONSULTING", label: "IT Consulting" },
  { value: "SAAS", label: "SaaS Products" },
  { value: "ECOMMERCE", label: "E-Commerce" },
  { value: "DATA_ENTRY", label: "Data Entry" },
  { value: "CLOUD_SERVICES", label: "Cloud Services" },
  { value: "CYBERSECURITY", label: "Cybersecurity" },
  { value: "OTHER", label: "Other" },
];

const infoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  businessNtn: z.string().optional(),
  registrationDate: z.string().optional(),
  totalEmployees: z.string().optional(),
});

export default function PSEBCompanyForm() {
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [directors, setDirectors] = useState<{ name: string; cnic: string; designation: string; email: string; phone: string }[]>([]);
  const [fee, setFee] = useState(5000);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [serviceDescription, setServiceDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const infoForm = useForm({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      companyName: "",
      companyType: "",
      businessNtn: "",
      registrationDate: "",
      totalEmployees: "",
    },
  });

  const watchRegDate = infoForm.watch("registrationDate");

  useEffect(() => {
    if (watchRegDate) {
      const regDate = new Date(watchRegDate);
      const now = new Date();
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      setFee(regDate >= oneYearAgo ? 5000 : 10000);
    }
  }, [watchRegDate]);

  const submitMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/pseb/company", payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pseb-company"] });
      toast.success("PSEB Company registration submitted successfully!");
      navigate("/dashboard/pseb");
    },
    onError: () => toast.error("Failed to submit. Please try again."),
  });

  const handleFileUpload = async (field: string, file: File) => {
    setUploadingFile(field);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/pseb/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.data?.url) {
        setUploads((prev) => ({ ...prev, [field]: res.data.data.url }));
        toast.success(`${field} uploaded`);
      }
    } catch {
      toast.error(`Failed to upload ${field}`);
    } finally {
      setUploadingFile(null);
    }
  };

  const addDirector = () => {
    setDirectors([...directors, { name: "", cnic: "", designation: "", email: "", phone: "" }]);
  };

  const removeDirector = (idx: number) => {
    setDirectors(directors.filter((_, i) => i !== idx));
  };

  const updateDirector = (idx: number, field: string, value: string) => {
    const updated = [...directors];
    (updated[idx] as any)[field] = value;
    setDirectors(updated);
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  };

  const handleNext = () => {
    if (step === 0) {
      infoForm.handleSubmit(() => setStep(1))();
      return;
    }
    if (step === 1) {
      if (directors.length === 0) {
        toast.error("Please add at least one director/partner");
        return;
      }
      const invalid = directors.some((d) => !d.name || !d.cnic);
      if (invalid) {
        toast.error("Please fill in name and CNIC for all directors");
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (selectedServices.length === 0) {
        toast.error("Please select at least one service");
        return;
      }
      setStep(3);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    const formValues = infoForm.getValues();
    submitMutation.mutate({
      companyName: formValues.companyName,
      companyType: formValues.companyType,
      businessNtn: formValues.businessNtn || null,
      registrationDate: formValues.registrationDate || null,
      totalEmployees: formValues.totalEmployees ? Number(formValues.totalEmployees) : null,
      servicesOffered: selectedServices,
      serviceDescription,
      address,
      city,
      province,
      phone,
      email,
      website,
      directors,
      ntnCertificateUrl: uploads.ntnCertificate || null,
      cnicDirectorsUrl: uploads.cnicDirectors ? [uploads.cnicDirectors] : [],
      moaUrl: uploads.moa || null,
      aoaUrl: uploads.aoa || null,
      form29Url: uploads.form29 || null,
      form2Url: uploads.form2 || null,
      incCertificateUrl: uploads.incCertificate || null,
      partnershipDeedUrl: uploads.partnershipDeed || null,
      formCUrl: uploads.formC || null,
      bankStatementUrl: uploads.bankStatement || null,
      fee,
    });
  };

  const docFields = [
    { key: "ntnCertificate", label: "NTN Certificate" },
    { key: "cnicDirectors", label: "CNIC of Directors" },
    { key: "moa", label: "Memorandum of Association (MOA)" },
    { key: "aoa", label: "Articles of Association (AOA)" },
    { key: "form29", label: "Form-29" },
    { key: "form2", label: "Form-2" },
    { key: "incCertificate", label: "Incorporation Certificate" },
    { key: "partnershipDeed", label: "Partnership Deed" },
    { key: "formC", label: "Form-C" },
    { key: "bankStatement", label: "Bank Statement (6 months)" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="PSEB Company Registration" subtitle="Register your IT company or firm with PSEB" />

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
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input {...infoForm.register("companyName")} placeholder="Enter company name" />
                {infoForm.formState.errors.companyName && (
                  <p className="text-sm text-destructive">{infoForm.formState.errors.companyName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Company Type *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...infoForm.register("companyType")}>
                  <option value="">Select type</option>
                  {companyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {infoForm.formState.errors.companyType && (
                  <p className="text-sm text-destructive">{infoForm.formState.errors.companyType.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Business NTN</Label>
                <Input {...infoForm.register("businessNtn")} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Registration Date</Label>
                <Input type="date" {...infoForm.register("registrationDate")} />
              </div>
              <div className="space-y-2">
                <Label>Total Employees</Label>
                <Input type="number" {...infoForm.register("totalEmployees")} placeholder="Number of employees" />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="rounded-lg bg-muted/50 p-3 w-full">
                  <p className="text-xs text-muted-foreground">Estimated Fee</p>
                  <p className="text-lg font-bold text-primary">PKR {fee.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{fee === 5000 ? "Startup (within 1 year)" : "Established"}</p>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Directors / Partners</h3>
                <Button type="button" variant="outline" size="sm" onClick={addDirector}>
                  <Plus className="h-4 w-4 mr-1" /> Add Director
                </Button>
              </div>
              {directors.length === 0 && (
                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  No directors added yet. Click "Add Director" to start.
                </div>
              )}
              {directors.map((dir, idx) => (
                <div key={idx} className="rounded-lg border border-border p-4 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Director #{idx + 1}</span>
                    <button onClick={() => removeDirector(idx)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Name *</Label>
                      <Input value={dir.name} onChange={(e) => updateDirector(idx, "name", e.target.value)} placeholder="Full name" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">CNIC *</Label>
                      <Input value={dir.cnic} onChange={(e) => updateDirector(idx, "cnic", e.target.value)} placeholder="XXXXX-XXXXXXX-X" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Designation</Label>
                      <Input value={dir.designation} onChange={(e) => updateDirector(idx, "designation", e.target.value)} placeholder="CEO, Director, etc." />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Email</Label>
                      <Input value={dir.email} onChange={(e) => updateDirector(idx, "email", e.target.value)} placeholder="email@example.com" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Phone</Label>
                      <Input value={dir.phone} onChange={(e) => updateDirector(idx, "phone", e.target.value)} placeholder="03XX-XXXXXXX" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Services Offered *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {serviceOptions.map((svc) => (
                    <button
                      key={svc.value}
                      type="button"
                      onClick={() => toggleService(svc.value)}
                      className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                        selectedServices.includes(svc.value)
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {svc.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Service Description</Label>
                <Textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Brief description of services offered" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Office address" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
                </div>
                <div className="space-y-2">
                  <Label>Province</Label>
                  <select value={province} onChange={(e) => setProvince(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Select Province</option>
                    <option value="PUNJAB">Punjab</option>
                    <option value="SINDH">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="BALOCHISTAN">Balochistan</option>
                    <option value="ISLAMABAD">Islamabad</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="company@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Registration Fee</p>
                  <p className="text-2xl font-bold text-primary">PKR {fee.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{fee === 5000 ? "Startup discount" : "Standard fee"}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
              </div>

              <h3 className="font-semibold">Upload Documents</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {docFields.map((doc) => (
                  <div
                    key={doc.key}
                    onClick={() => fileInputRefs.current[doc.key]?.click()}
                    className={`rounded-lg border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                      uploads[doc.key] ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" : "border-border hover:border-primary/50"
                    }`}
                  >
                    {uploads[doc.key] ? (
                      <div className="flex flex-col items-center gap-1">
                        <FileCheck className="h-6 w-6 text-emerald-500" />
                        <p className="text-xs font-medium text-emerald-600 truncate max-w-full">{uploads[doc.key].split("/").pop()}</p>
                        <p className="text-[10px] text-muted-foreground">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1">
                        {uploadingFile === doc.key ? (
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        )}
                        <p className="text-xs font-medium">{doc.label}</p>
                        <p className="text-[10px] text-muted-foreground">Click to upload</p>
                      </div>
                    )}
                    <input
                      ref={(el) => { fileInputRefs.current[doc.key] = el; }}
                      type="file"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(doc.key, file);
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step < 3 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
                {submitMutation.isPending ? (
                  <>Submitting...</>
                ) : (
                  <>Submit Registration (PKR {fee.toLocaleString()})</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
