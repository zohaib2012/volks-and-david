import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Upload, FileCheck, Plus, Trash2, AlertTriangle, Info } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api";

const steps = ["Business Info", "Call Center Details", "Services", "Directors & Address", "Documents & Submit"];

const companyTypes = [
  { value: "PRIVATE_LIMITED", label: "Private Limited" },
  { value: "PUBLIC_LIMITED", label: "Public Limited" },
  { value: "SMC_PVT_LTD", label: "SMC (Private) Limited" },
  { value: "SOLE_PROPRIETOR", label: "Sole Proprietor" },
  { value: "PARTNERSHIP", label: "Partnership" },
];

const serviceTypeOptions = [
  { value: "INBOUND", label: "Inbound" },
  { value: "OUTBOUND", label: "Outbound" },
  { value: "BLENDED", label: "Blended" },
  { value: "BPO", label: "BPO" },
];

const infoSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  businessNtn: z.string().optional(),
  registrationDate: z.string().optional(),
  totalEmployees: z.string().optional(),
});

export default function PSEBCallCenterForm() {
  const [step, setStep] = useState(0);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([]);
  const [isBranch, setIsBranch] = useState(false);
  const [directors, setDirectors] = useState<{ name: string; cnic: string; designation: string; email: string; phone: string }[]>([]);
  const [uploads, setUploads] = useState<Record<string, string>>({});
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [numberOfShifts, setNumberOfShifts] = useState("");
  const [dialerSystem, setDialerSystem] = useState("");
  const [pbxSystem, setPbxSystem] = useState("");
  const [internetBandwidth, setInternetBandwidth] = useState("");
  const [floorArea, setFloorArea] = useState("");
  const [clientCountries, setClientCountries] = useState("");
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

  const submitMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.post("/pseb/call-center", payload).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pseb-call-center"] });
      toast.success("PSEB Call Center registration submitted successfully!");
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

  const toggleServiceType = (svc: string) => {
    setSelectedServiceTypes((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleNext = () => {
    if (step === 0) {
      infoForm.handleSubmit(() => setStep(1))();
      return;
    }
    if (step === 2) {
      if (selectedServiceTypes.length === 0) {
        toast.error("Please select at least one service type");
        return;
      }
      setStep(3);
      return;
    }
    if (step === 3) {
      if (directors.length === 0) {
        toast.error("Please add at least one director/partner");
        return;
      }
      const invalid = directors.some((d) => !d.name || !d.cnic);
      if (invalid) {
        toast.error("Please fill in name and CNIC for all directors");
        return;
      }
      setStep(4);
      return;
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    const formValues = infoForm.getValues();
    const payload: Record<string, unknown> = {
      companyName: formValues.companyName,
      companyType: formValues.companyType,
      businessNtn: formValues.businessNtn || null,
      registrationDate: formValues.registrationDate || null,
      totalEmployees: formValues.totalEmployees ? Number(formValues.totalEmployees) : null,
      seatingCapacity: seatingCapacity ? Number(seatingCapacity) : null,
      numberOfShifts: numberOfShifts ? Number(numberOfShifts) : null,
      dialerSystem: dialerSystem || null,
      pbxSystem: pbxSystem || null,
      internetBandwidth: internetBandwidth || null,
      floorArea: floorArea || null,
      serviceType: selectedServiceTypes,
      clientCountries: clientCountries ? clientCountries.split(",").map((c: string) => c.trim()) : [],
      serviceDescription,
      address,
      city,
      province,
      phone,
      email,
      website,
      directors,
      isBranch,
      ntnCertificateUrl: uploads.ntnCertificate || null,
      cnicDirectorsUrl: uploads.cnicDirectors ? [uploads.cnicDirectors] : [],
      moaUrl: uploads.moa || null,
      aoaUrl: uploads.aoa || null,
      form29Url: uploads.form29 || null,
      incCertificateUrl: uploads.incCertificate || null,
      partnershipDeedUrl: uploads.partnershipDeed || null,
      formCUrl: uploads.formC || null,
      bankStatementUrl: uploads.bankStatement || null,
      officePhotosUrl: uploads.officePhotos ? [uploads.officePhotos] : [],
      equipmentListUrl: uploads.equipmentList || null,
      fee: isBranch ? 10000 : 20000,
    };
    submitMutation.mutate(payload);
  };

  const docFields = [
    { key: "ntnCertificate", label: "NTN Certificate" },
    { key: "cnicDirectors", label: "CNIC of Directors" },
    { key: "moa", label: "Memorandum of Association" },
    { key: "aoa", label: "Articles of Association" },
    { key: "form29", label: "Form-29" },
    { key: "incCertificate", label: "Incorporation Certificate" },
    { key: "partnershipDeed", label: "Partnership Deed" },
    { key: "formC", label: "Form-C" },
    { key: "bankStatement", label: "Bank Statement" },
    { key: "officePhotos", label: "Office Photos" },
    { key: "equipmentList", label: "Equipment List" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader title="PSEB Call Center Registration" subtitle="Register your call center or BPO with PSEB" />

      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 mb-6 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Call Center registration is MANDATORY by law</p>
          <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">Unregistered call centers face legal action from PTA and FIA. Registration is required under the PSEB Act.</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => i < step && setStep(i)}
              className={`text-xs font-medium ${i === step ? "text-primary" : i < step ? "text-emerald-600" : "text-muted-foreground"}`}
            >
              <div className="hidden sm:block">{s}</div>
              <div className={`sm:hidden flex h-6 w-6 items-center justify-center rounded-full text-xs ${i === step ? "bg-primary text-white" : i < step ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}>
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
                {infoForm.formState.errors.companyName && <p className="text-sm text-destructive">{infoForm.formState.errors.companyName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Company Type *</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" {...infoForm.register("companyType")}>
                  <option value="">Select type</option>
                  {companyTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {infoForm.formState.errors.companyType && <p className="text-sm text-destructive">{infoForm.formState.errors.companyType.message}</p>}
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
              <div className="space-y-2 flex items-center gap-3">
                <Switch checked={isBranch} onCheckedChange={setIsBranch} id="isBranch" />
                <Label htmlFor="isBranch">This is a Branch Office</Label>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Seating Capacity</Label>
                <Input value={seatingCapacity} onChange={(e) => setSeatingCapacity(e.target.value)} type="number" placeholder="Number of workstations" />
              </div>
              <div className="space-y-2">
                <Label>Number of Shifts</Label>
                <Input value={numberOfShifts} onChange={(e) => setNumberOfShifts(e.target.value)} type="number" placeholder="Per day" />
              </div>
              <div className="space-y-2">
                <Label>Dialer System</Label>
                <Input value={dialerSystem} onChange={(e) => setDialerSystem(e.target.value)} placeholder="e.g., Vicidial, GoAutoDial" />
              </div>
              <div className="space-y-2">
                <Label>PBX System</Label>
                <Input value={pbxSystem} onChange={(e) => setPbxSystem(e.target.value)} placeholder="e.g., Asterisk, 3CX" />
              </div>
              <div className="space-y-2">
                <Label>Internet Bandwidth (Mbps)</Label>
                <Input value={internetBandwidth} onChange={(e) => setInternetBandwidth(e.target.value)} placeholder="e.g., 100" />
              </div>
              <div className="space-y-2">
                <Label>Floor Area</Label>
                <Input value={floorArea} onChange={(e) => setFloorArea(e.target.value)} placeholder="e.g., 2000 sq ft" />
              </div>
              <div className="space-y-2 flex items-end">
                <div className="rounded-lg bg-muted/50 p-3 w-full">
                  <p className="text-xs text-muted-foreground">Registration Fee</p>
                  <p className="text-lg font-bold text-blue-500">PKR {isBranch ? "10,000" : "20,000"}/year</p>
                  <p className="text-xs text-muted-foreground">{isBranch ? "Branch office" : "Main office"}</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">Service Types *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {serviceTypeOptions.map((svc) => (
                    <button
                      key={svc.value}
                      type="button"
                      onClick={() => toggleServiceType(svc.value)}
                      className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                        selectedServiceTypes.includes(svc.value)
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
                <Label>Client Countries</Label>
                <Textarea value={clientCountries} onChange={(e) => setClientCountries(e.target.value)} placeholder="e.g., USA, UK, Canada, Australia (comma separated)" />
              </div>
              <div className="space-y-2">
                <Label>Service Description</Label>
                <Textarea value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Brief description of services" />
              </div>
            </div>
          )}

          {step === 3 && (
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
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-semibold mb-3">Address & Contact</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Office address" />
                  </div>
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
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="03XX-XXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="company@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://example.com" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Registration Process</p>
                  <ol className="text-xs text-blue-700 dark:text-blue-400 mt-1 space-y-1 list-decimal list-inside">
                    <li>Submit application and documents</li>
                    <li>Receive 60-day provisional letter</li>
                    <li>Physical site inspection by PSEB team</li>
                    <li>1-year certificate issued upon approval</li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Registration Fee</p>
                  <p className="text-2xl font-bold text-primary">PKR {isBranch ? "10,000" : "20,000"}/year</p>
                  <p className="text-xs text-muted-foreground">{isBranch ? "Branch" : "Main office"} &bull; Annual</p>
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

          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleNext}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
                {submitMutation.isPending ? (
                  <>Submitting...</>
                ) : (
                  <>Submit Registration (PKR {isBranch ? "10,000" : "20,000"}/year)</>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
