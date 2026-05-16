import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { Edit, Save, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import toast from "react-hot-toast";

interface FBRProfile {
  name: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  employer: string;
  designation: string;
  salary: number;
  bankName: string;
  iban: string;
}

const sections = [
  {
    key: "personal",
    title: "Personal Information",
    fields: ["name", "dob", "gender"],
  },
  { key: "contact", title: "Contact", fields: ["phone", "email"] },
  { key: "address", title: "Address", fields: ["address", "city", "province"] },
  {
    key: "employment",
    title: "Employment",
    fields: ["employer", "designation", "salary"],
  },
  { key: "bank", title: "Bank Account", fields: ["bankName", "iban"] },
];

const emptyProfile: FBRProfile = {
  name: "", dob: "", gender: "", phone: "", email: "",
  address: "", city: "", province: "", employer: "",
  designation: "", salary: 0, bankName: "", iban: "",
};

function extractProfile(apiData: any): FBRProfile {
  const u = apiData?.user || {};
  const p = apiData?.profile || {};
  return {
    name: p.name || u.name || "",
    dob: p.dob ? p.dob.split("T")[0] : "",
    gender: p.gender || "",
    phone: p.phone || u.phone || "",
    email: p.email || u.email || "",
    address: p.address || "",
    city: p.city || "",
    province: p.province || "",
    employer: p.employer || "",
    designation: p.designation || "",
    salary: p.salary || 0,
    bankName: p.bankName || "",
    iban: p.iban || "",
  };
}

export default function FBRProfilePage() {
  const [editing, setEditing] = useState<string | null>(null);
  const [profile, setProfile] = useState<FBRProfile>(emptyProfile);
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/fbr-profile", data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success("Profile updated!");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["fbr-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const { isLoading, error } = useQuery({
    queryKey: ["fbr-profile"],
    queryFn: async () => {
      const res = await api.get("/fbr-profile");
      setProfile(extractProfile(res.data.data));
      return res.data;
    },
  });

  const fieldLabels: Record<string, string> = {
    name: "Full Name",
    dob: "Date of Birth",
    gender: "Gender",
    phone: "Phone",
    email: "Email",
    address: "Complete Address",
    city: "City",
    province: "Province",
    employer: "Employer Name",
    designation: "Designation",
    salary: "Salary (PKR)",
    bankName: "Bank Name",
    iban: "IBAN",
  };

  const handleSave = () => {
    saveMutation.mutate(profile);
  };

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error)
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load profile"
      />
    );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="FBR Profile"
        subtitle="Your profile as registered with FBR"
      />

      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.key}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{section.title}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setEditing(editing === section.key ? null : section.key)
                }
              >
                {editing === section.key ? (
                  <Save className="h-4 w-4" />
                ) : (
                  <Edit className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {section.fields.map((field) => (
                  <div key={field}>
                    <Label className="text-xs text-muted-foreground">
                      {fieldLabels[field]}
                    </Label>
                    {editing === section.key ? (
                      <Input
                        value={(profile as any)[field] || ""}
                        onChange={(e) =>
                          setProfile((p) =>
                            p ? { ...p, [field]: e.target.value } : p,
                          )
                        }
                      />
                    ) : (
                      <p className="text-sm font-medium mt-0.5">
                        {(profile as any)[field] || "—"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {editing === section.key && (
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending}>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-6 text-xs text-muted-foreground text-center">
        Changes take 2-3 working days to reflect in FBR system
      </p>
    </motion.div>
  );
}
