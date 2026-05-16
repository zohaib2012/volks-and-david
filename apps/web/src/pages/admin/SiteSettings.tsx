import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Save,
  AlertCircle,
  Globe,
  DollarSign,
  Wrench,
  Bell,
  Calculator,
  Plus,
  Trash2,
} from "lucide-react";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatPKR } from "@/lib/utils";

interface ServicePrice {
  id: string;
  name: string;
  price: number;
}

interface TaxSlab {
  id: string;
  min: number;
  max: number;
  rate: number;
}

interface Settings {
  general: {
    siteName: string;
    tagline: string;
    contactEmail: string;
    contactPhone: string;
    socialLinks: {
      facebook: string;
      twitter: string;
      linkedin: string;
      youtube: string;
    };
  };
  pricing: ServicePrice[];
  maintenance: { enabled: boolean; message: string };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
  taxSlabs: TaxSlab[];
}

const defaultSettings: Settings = {
  general: { siteName: "", tagline: "", contactEmail: "", contactPhone: "", socialLinks: { facebook: "", twitter: "", linkedin: "", youtube: "" } },
  pricing: [],
  maintenance: { enabled: false, message: "" },
  notifications: { emailEnabled: false, smsEnabled: false, pushEnabled: false },
  taxSlabs: [],
};

export default function SiteSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [dirty, setDirty] = useState(false);

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const res = await api.get("/admin/settings");
      const data = res.data.data;
      if (data) {
        setSettings(data);
      }
      return data;
    },
  });

  const updateGeneral = (key: string, value: string) => {
    setSettings((p) => ({ ...p, general: { ...p.general, [key]: value } }));
    setDirty(true);
  };

  const updateSocial = (key: string, value: string) => {
    setSettings((p) => ({
      ...p,
      general: {
        ...p.general,
        socialLinks: { ...p.general.socialLinks, [key]: value },
      },
    }));
    setDirty(true);
  };

  const updatePrice = (id: string, price: number) => {
    setSettings((p) => ({
      ...p,
      pricing: p.pricing.map((s) => (s.id === id ? { ...s, price } : s)),
    }));
    setDirty(true);
  };

  const addService = () => {
    const newId = String(Date.now());
    setSettings((p) => ({
      ...p,
      pricing: [...p.pricing, { id: newId, name: "New Service", price: 0 }],
    }));
    setDirty(true);
  };

  const removeService = (id: string) => {
    setSettings((p) => ({
      ...p,
      pricing: p.pricing.filter((s) => s.id !== id),
    }));
    setDirty(true);
  };

  const updateServiceName = (id: string, name: string) => {
    setSettings((p) => ({
      ...p,
      pricing: p.pricing.map((s) => (s.id === id ? { ...s, name } : s)),
    }));
    setDirty(true);
  };

  const updateTaxSlab = (
    id: string,
    key: "min" | "max" | "rate",
    value: number,
  ) => {
    setSettings((p) => ({
      ...p,
      taxSlabs: p.taxSlabs.map((s) =>
        s.id === id ? { ...s, [key]: value } : s,
      ),
    }));
    setDirty(true);
  };

  const addTaxSlab = () => {
    setSettings((p) => ({
      ...p,
      taxSlabs: [
        ...p.taxSlabs,
        { id: String(Date.now()), min: 0, max: 0, rate: 0 },
      ],
    }));
    setDirty(true);
  };

  const removeTaxSlab = (id: string) => {
    setSettings((p) => ({
      ...p,
      taxSlabs: p.taxSlabs.filter((s) => s.id !== id),
    }));
    setDirty(true);
  };

  const handleSave = async () => {
    try {
      await api.put("/admin/settings", settings);
      toast.success("Settings saved successfully");
      setDirty(false);
    } catch {
      toast.error("Failed to save settings \u2014 working offline");
      setDirty(false);
    }
  };

  if (isLoading) return <LoadingSpinner size="lg" />;

  if (error) {
    return (
      <EmptyState
        icon={<AlertCircle className="h-12 w-12 text-destructive" />}
        title="Failed to load settings"
        action={{ label: "Retry", onClick: () => refetch() }}
      />
    );
  }

  const tabs = [
    {
      id: "general",
      label: "General",
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Site Name</Label>
                  <Input
                    value={settings.general.siteName}
                    onChange={(e) => updateGeneral("siteName", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Tagline</Label>
                  <Input
                    value={settings.general.tagline}
                    onChange={(e) => updateGeneral("tagline", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Contact Email</Label>
                  <Input
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) =>
                      updateGeneral("contactEmail", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Phone</Label>
                  <Input
                    value={settings.general.contactPhone}
                    onChange={(e) =>
                      updateGeneral("contactPhone", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Social Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(["facebook", "twitter", "linkedin", "youtube"] as const).map(
                (platform) => (
                  <div key={platform} className="space-y-1.5">
                    <Label className="capitalize">{platform}</Label>
                    <Input
                      value={settings.general.socialLinks[platform]}
                      onChange={(e) => updateSocial(platform, e.target.value)}
                    />
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      id: "pricing",
      label: "Pricing",
      content: (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Service Prices</CardTitle>
              <Button variant="outline" size="sm" onClick={addService}>
                <Plus className="h-4 w-4 mr-1" /> Add Service
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {settings.pricing.map((service, i) => (
                <div key={service.id} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-6">
                    {i + 1}.
                  </span>
                  <Input
                    value={service.name}
                    onChange={(e) =>
                      updateServiceName(service.id, e.target.value)
                    }
                    className="flex-1"
                  />
                  <div className="relative w-32">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      PKR
                    </span>
                    <Input
                      type="number"
                      value={service.price}
                      onChange={(e) =>
                        updatePrice(service.id, Number(e.target.value))
                      }
                      className="pl-10"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeService(service.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "maintenance",
      label: "Maintenance",
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Maintenance Mode</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable Maintenance Mode</p>
                <p className="text-sm text-muted-foreground">
                  When enabled, only admins can access the site.
                </p>
              </div>
              <Switch
                checked={settings.maintenance.enabled}
                onCheckedChange={(v) => {
                  setSettings((p) => ({
                    ...p,
                    maintenance: { ...p.maintenance, enabled: v },
                  }));
                  setDirty(true);
                }}
              />
            </div>
            {settings.maintenance.enabled && (
              <div className="space-y-1.5">
                <Label>Maintenance Message</Label>
                <Textarea
                  value={settings.maintenance.message}
                  onChange={(e) => {
                    setSettings((p) => ({
                      ...p,
                      maintenance: {
                        ...p.maintenance,
                        message: e.target.value,
                      },
                    }));
                    setDirty(true);
                  }}
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notification Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "emailEnabled" as const,
                label: "Email Notifications",
                description: "Send notifications via email",
              },
              {
                key: "smsEnabled" as const,
                label: "SMS Notifications",
                description: "Send notifications via SMS",
              },
              {
                key: "pushEnabled" as const,
                label: "Push Notifications",
                description: "Send in-app push notifications",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <Switch
                  checked={settings.notifications[item.key]}
                  onCheckedChange={(v) => {
                    setSettings((p) => ({
                      ...p,
                      notifications: { ...p.notifications, [item.key]: v },
                    }));
                    setDirty(true);
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ),
    },
    {
      id: "taxSlabs",
      label: "Tax Slabs",
      content: (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Income Tax Slabs</CardTitle>
              <Button variant="outline" size="sm" onClick={addTaxSlab}>
                <Plus className="h-4 w-4 mr-1" /> Add Slab
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 text-sm font-medium text-muted-foreground">
                      Min (PKR)
                    </th>
                    <th className="pb-2 text-sm font-medium text-muted-foreground">
                      Max (PKR)
                    </th>
                    <th className="pb-2 text-sm font-medium text-muted-foreground">
                      Rate (%)
                    </th>
                    <th className="pb-2 text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {settings.taxSlabs.map((slab) => (
                    <tr key={slab.id} className="border-b border-border/50">
                      <td className="py-2 pr-2">
                        <Input
                          type="number"
                          value={slab.min}
                          onChange={(e) =>
                            updateTaxSlab(
                              slab.id,
                              "min",
                              Number(e.target.value),
                            )
                          }
                          className="h-9"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <Input
                          type="number"
                          value={slab.max === Infinity ? "" : slab.max}
                          onChange={(e) =>
                            updateTaxSlab(
                              slab.id,
                              "max",
                              e.target.value
                                ? Number(e.target.value)
                                : Infinity,
                            )
                          }
                          placeholder="∞"
                          className="h-9"
                        />
                      </td>
                      <td className="py-2 pr-2">
                        <div className="relative w-24">
                          <Input
                            type="number"
                            value={slab.rate}
                            onChange={(e) =>
                              updateTaxSlab(
                                slab.id,
                                "rate",
                                Number(e.target.value),
                              )
                            }
                            className="h-9 pr-6"
                          />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                            %
                          </span>
                        </div>
                      </td>
                      <td className="py-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTaxSlab(slab.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ),
    },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Site Settings"
        subtitle="Manage your platform configuration"
        action={
          <Button onClick={handleSave} disabled={!dirty}>
            <Save className="h-4 w-4 mr-2" /> {dirty ? "Save Changes" : "Saved"}
          </Button>
        }
      />

      <Tabs tabs={tabs} defaultTab="general" />
    </motion.div>
  );
}
