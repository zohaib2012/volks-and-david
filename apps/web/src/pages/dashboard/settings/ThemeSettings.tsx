import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/useThemeStore";
import type { ThemeConfig } from "@volks/types";

const colorPresets = [
  { color: "#4F6FF5", name: "Navy Blue", accent: "#10B981" },
  { color: "#059669", name: "Forest Green", accent: "#34D399" },
  { color: "#7C3AED", name: "Royal Purple", accent: "#A78BFA" },
  { color: "#0F172A", name: "Midnight Black", accent: "#22D3EE" },
  { color: "#DC2626", name: "Crimson Red", accent: "#FB923C" },
];

const sidebarStylePreviews = [
  { id: "solid" as const, label: "Solid", desc: "Full color background" },
  { id: "glass" as const, label: "Glass", desc: "Frosted glass effect" },
  { id: "minimal" as const, label: "Minimal", desc: "Clean and simple" },
];

export default function ThemeSettings() {
  const { theme, setTheme, resetTheme } = useThemeStore();
  const [customColor, setCustomColor] = useState(theme.primaryColor);

  const handleColorSelect = (color: string, name: string) => {
    setTheme({ primaryColor: color, primaryColorName: name });
    setCustomColor(color);
  };

  const handleCustomColor = (color: string) => {
    setCustomColor(color);
    setTheme({ primaryColor: color, primaryColorName: "Custom" });
  };

  const handleSave = async () => {
    try {
      const { default: api } = await import("@/lib/api");
      await api.put("/settings/theme", theme);
      toast.success("Theme preferences saved!");
    } catch {
      toast("Theme saved locally — connect to server to sync across devices", { icon: "💾" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeader
        title="Theme Settings"
        subtitle="Customize your dashboard appearance"
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetTheme}>
              Reset to Default
            </Button>
            <Button onClick={handleSave}>Save Preferences</Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Theme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mb-4">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleColorSelect(preset.color, preset.name)}
                    className="group relative flex flex-col items-center gap-1"
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full border-2 transition-all",
                        theme.primaryColor === preset.color
                          ? "border-primary scale-110 shadow-lg"
                          : "border-transparent hover:scale-105",
                      )}
                      style={{ backgroundColor: preset.color }}
                    >
                      {theme.primaryColor === preset.color && (
                        <Check className="h-full w-full p-2 text-white" />
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Label>Custom</Label>
                <Input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColor(e.target.value)}
                  className="h-10 w-20 p-1 cursor-pointer"
                />
                <span className="text-xs text-muted-foreground">
                  {customColor}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[
                  { id: "light" as const, icon: Sun, label: "Light" },
                  { id: "dark" as const, icon: Moon, label: "Dark" },
                  { id: "system" as const, icon: Monitor, label: "System" },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setTheme({ mode: mode.id })}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                        theme.mode === mode.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border hover:border-primary/50",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sidebar Style</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {sidebarStylePreviews.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setTheme({ sidebarStyle: s.id })}
                    className={cn(
                      "rounded-lg border-2 p-3 text-center transition-all",
                      theme.sidebarStyle === s.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div
                      className={cn(
                        "h-12 rounded mb-2",
                        s.id === "solid" && "bg-sidebar",
                        s.id === "glass" &&
                          "bg-sidebar/50 backdrop-blur border border-white/10",
                        s.id === "minimal" &&
                          "bg-transparent border border-sidebar-border",
                      )}
                    />
                    <p className="text-xs font-medium">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {s.desc}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Font Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[
                  { id: "sm" as const, label: "Small" },
                  { id: "md" as const, label: "Medium" },
                  { id: "lg" as const, label: "Large" },
                ].map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setTheme({ fontSize: size.id })}
                    className={cn(
                      "flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                      theme.fontSize === size.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Border Radius</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[
                  { id: "sharp" as const, label: "Sharp", demo: "0" },
                  { id: "rounded" as const, label: "Rounded", demo: "8" },
                  { id: "pill" as const, label: "Pill", demo: "9999" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setTheme({ borderRadius: r.id })}
                    className={cn(
                      "flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                      theme.borderRadius === r.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <div className="flex justify-center mb-2">
                      <div
                        className="h-6 w-12 bg-primary/20"
                        style={{
                          borderRadius:
                            r.demo === "9999" ? "9999px" : `${r.demo}px`,
                        }}
                      />
                    </div>
                    {r.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Density</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {[
                  {
                    id: "compact" as const,
                    label: "Compact",
                    desc: "Tighter spacing",
                  },
                  {
                    id: "default" as const,
                    label: "Default",
                    desc: "Standard spacing",
                  },
                  {
                    id: "comfortable" as const,
                    label: "Comfortable",
                    desc: "Extra spacing",
                  },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setTheme({ density: d.id })}
                    className={cn(
                      "flex-1 rounded-lg border-2 p-3 text-sm font-medium transition-all",
                      theme.density === d.id
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {d.label}
                    <p className="text-[10px] text-muted-foreground">
                      {d.desc}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-8 self-start">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "overflow-hidden rounded-xl border",
                  theme.borderRadius === "sharp" && "rounded-none",
                  theme.borderRadius === "pill" && "rounded-2xl",
                )}
                style={{
                  fontSize:
                    theme.fontSize === "sm"
                      ? "12px"
                      : theme.fontSize === "lg"
                        ? "16px"
                        : "14px",
                }}
              >
                <div className="flex h-[400px]">
                  <div
                    className={cn(
                      "w-1/4 p-3 space-y-2",
                      theme.sidebarStyle === "solid" && "bg-sidebar",
                      theme.sidebarStyle === "glass" &&
                        "bg-sidebar/50 backdrop-blur",
                      theme.sidebarStyle === "minimal" &&
                        "bg-transparent border-r",
                    )}
                  >
                    <div className="h-6 w-16 rounded bg-primary/60" />
                    <div className="space-y-1.5 mt-4">
                      {[60, 80, 50, 70].map((w, i) => (
                        <div
                          key={i}
                          className="h-3 rounded bg-sidebar-foreground/10"
                          style={{ width: `${w}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 p-4 space-y-4 bg-background">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-32 rounded bg-muted" />
                      <div className="flex gap-2">
                        <div className="h-7 w-16 rounded bg-muted" />
                        <div
                          className="h-7 w-16 rounded"
                          style={{ backgroundColor: theme.primaryColor }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="rounded-lg border p-3 space-y-2"
                        >
                          <div className="h-3 w-12 rounded bg-muted" />
                          <div className="h-6 w-20 rounded bg-muted-foreground/20" />
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 rounded-full px-3 flex items-center text-xs text-white font-medium"
                          style={{ backgroundColor: theme.primaryColor }}
                        >
                          ACTIVE
                        </div>
                        <div
                          className="h-6 rounded-full px-3 flex items-center text-xs"
                          style={{
                            backgroundColor: `${theme.primaryColor}20`,
                            color: theme.primaryColor,
                          }}
                        >
                          PENDING
                        </div>
                      </div>
                      <div className="h-3 w-full rounded bg-muted" />
                      <div className="h-3 w-3/4 rounded bg-muted" />
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground text-center">
                Preview updates in real-time as you change settings
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
