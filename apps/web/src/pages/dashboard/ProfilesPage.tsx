import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, AlertCircle, User, Check } from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCNIC } from "@/lib/utils";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Profile {
  id: string;
  name: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  dateOfBirth: string;
  occupation: string;
  isPrimary: boolean;
}

interface ProfileFormData {
  name: string;
  cnic: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  dateOfBirth: string;
  occupation: string;
}

const emptyForm: ProfileFormData = {
  name: "",
  cnic: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  dateOfBirth: "",
  occupation: "",
};

export default function ProfilesPage() {
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileFormData>(emptyForm);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const res = await api.get("/profiles");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload: ProfileFormData) => api.post("/profiles", payload),
    onSuccess: () => {
      toast.success("Profile added successfully!");
      setShowAdd(false);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: () => {
      toast.error("Failed to add profile");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProfileFormData }) =>
      api.put(`/profiles/${id}`, payload),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setEditingId(null);
      setForm(emptyForm);
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  const setActiveMutation = useMutation({
    mutationFn: (id: string) => api.put(`/profiles/${id}`, { isActive: true }),
    onSuccess: (_, id) => {
      setActiveProfileId(id);
      toast.success("Profile set as active");
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: () => {
      toast.error("Failed to set profile as active");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/profiles/${id}`),
    onSuccess: () => {
      toast.success("Profile deleted");
      queryClient.invalidateQueries({ queryKey: ["profiles"] });
    },
    onError: () => {
      toast.error("Failed to delete profile");
    },
  });

  const profiles: Profile[] = data?.data || [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveProfile = () => {
    if (!form.name || !form.cnic) {
      toast.error("Please fill in required fields (Name and CNIC)");
      return;
    }
    createMutation.mutate(form);
  };

  const handleEdit = (profile: Profile) => {
    setEditingId(profile.id);
    setForm({
      name: profile.name,
      cnic: profile.cnic,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
      city: profile.city,
      dateOfBirth: profile.dateOfBirth,
      occupation: profile.occupation,
    });
    setShowAdd(true);
  };

  const handleUpdateProfile = () => {
    if (!form.name || !form.cnic) {
      toast.error("Please fill in required fields (Name and CNIC)");
      return;
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: form });
    }
  };

  const handleSetActive = (profileId: string) => {
    setActiveMutation.mutate(profileId);
  };

  const handleDelete = (profile: Profile) => {
    if (profile.isPrimary) {
      toast.error("Cannot delete primary profile");
      return;
    }
    deleteMutation.mutate(profile.id);
  };

  const handleClose = () => {
    setShowAdd(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load profiles"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Tax Profiles"
        subtitle="Manage multiple tax profiles for your family or business"
        action={
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Profile
          </Button>
        }
      />

      {profiles.length === 0 ? (
        <EmptyState
          icon={<User className="h-12 w-12 text-muted-foreground" />}
          title="No profiles yet"
          description="Add your first tax profile to get started."
          action={{
            label: "Add Your First Profile",
            onClick: () => setShowAdd(true),
          }}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <motion.div
              key={profile.id}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card
                className={`h-full overflow-hidden ${profile.isPrimary ? "border-primary ring-1 ring-primary/20" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                          {getInitials(profile.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{profile.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatCNIC(profile.cnic)}
                        </p>
                      </div>
                    </div>
                    {profile.isPrimary && (
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        Primary
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    {profile.phone && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium">{profile.phone}</span>
                      </div>
                    )}
                    {profile.email && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium">{profile.email}</span>
                      </div>
                    )}
                    {profile.city && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">City</span>
                        <span className="font-medium">{profile.city}</span>
                      </div>
                    )}
                    {profile.occupation && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Occupation</span>
                        <span className="font-medium">{profile.occupation}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!profile.isPrimary && (
                      <Button
                        variant={
                          activeProfileId === profile.id ? "default" : "outline"
                        }
                        size="sm"
                        className="flex-1"
                        onClick={() => handleSetActive(profile.id)}
                      >
                        {activeProfileId === profile.id ? (
                          <>
                            <Check className="mr-1 h-4 w-4" /> Active
                          </>
                        ) : (
                          "Set Active"
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 px-3"
                      onClick={() => handleEdit(profile)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {!profile.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3 text-destructive"
                        onClick={() => handleDelete(profile)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Profile" : "Add New Profile"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input
                placeholder="name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CNIC *</Label>
                <Input
                  placeholder="42101-1234567-8"
                  value={form.cnic}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, cnic: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, dateOfBirth: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  placeholder="+92 300 1234567"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Full address"
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Occupation</Label>
                <Input
                  placeholder="Occupation"
                  value={form.occupation}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, occupation: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={editingId ? handleUpdateProfile : handleSaveProfile}>
                {editingId ? "Update Profile" : "Save Profile"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
