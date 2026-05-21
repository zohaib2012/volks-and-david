import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  UserPlus,
  Receipt,
  Calculator,
  Wallet,
  FolderOpen,
  Users,
  CalendarCheck,
  Bell,
  DollarSign,
  Gift,
  Settings,
  ChevronLeft,
  ChevronDown,
  X,
  FileWarning,
  FileSearch,
  ScrollText,
  Building2,
  Landmark,
  ShieldCheck,
  LogOut,
  Globe,
  Activity,
  ListChecks,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface SidebarSection {
  label: string;
  items: {
    label: string;
    path: string;
    icon: typeof LayoutDashboard;
  }[];
}

const sections: SidebarSection[] = [
  {
    label: "TAX SERVICES",
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "Tax Returns", path: "/dashboard/tax-return", icon: FileText },
      { label: "NTN Registration", path: "/dashboard/ntn", icon: UserPlus },
      { label: "GST / STRN", path: "/dashboard/gst", icon: Receipt },
      { label: "Sales Tax Returns", path: "/dashboard/gst/monthly-returns", icon: ScrollText },
      { label: "Sales Tax Notices", path: "/dashboard/sales-tax-notices", icon: FileWarning },
      { label: "Withholding Tax", path: "/dashboard/withholding-tax", icon: FileSearch },
      { label: "FBR Profile", path: "/dashboard/fbr-profile", icon: Landmark },
      { label: "Service Status", path: "/dashboard/service-status", icon: ListChecks },
    ],
  },
  {
    label: "BUSINESS & LEGAL",
    items: [
      { label: "Business Registration", path: "/dashboard/business/secp", icon: Building2 },
      { label: "My SECP History", path: "/dashboard/business/secp-history", icon: Building2 },
      { label: "Trademark", path: "/dashboard/business/trademark", icon: ShieldCheck },
      { label: "Copyright", path: "/dashboard/business/copyright", icon: ShieldCheck },
      { label: "Patent", path: "/dashboard/business/patent", icon: ShieldCheck },
      { label: "My IP History", path: "/dashboard/business/ip-history", icon: ShieldCheck },
      { label: "USA Services", path: "/dashboard/usa-services", icon: Globe },
      { label: "PSEB Registration", path: "/dashboard/pseb", icon: Building2 },
    ],
  },
  {
    label: "TOOLS",
    items: [
      { label: "Tax Tools", path: "/dashboard/tools/salary-calculator", icon: Calculator },
      { label: "Expense Tracker", path: "/dashboard/expenses", icon: Wallet },
      { label: "Document Vault", path: "/dashboard/documents", icon: FolderOpen },
      { label: "Profiles", path: "/dashboard/profiles", icon: Users },
      { label: "Consultations", path: "/dashboard/consultations", icon: CalendarCheck },
      { label: "FBR Notices", path: "/dashboard/fbr-notices", icon: FileWarning },
      { label: "Tax Calendar", path: "/dashboard/tax-calendar", icon: CalendarCheck },
      { label: "Activity Log", path: "/dashboard/activity", icon: Activity },
    ],
  },
  {
    label: "ACCOUNT",
    items: [
      { label: "Payments", path: "/dashboard/payments", icon: DollarSign },
      { label: "Referrals", path: "/dashboard/referrals", icon: Gift },
      { label: "Notifications", path: "/dashboard/notifications", icon: Bell },
      { label: "Settings", path: "/dashboard/settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const checkActive = (itemPath: string) => {
    if (location.pathname === itemPath) return true;
    if (itemPath !== "/dashboard" && location.pathname.startsWith(itemPath + "/")) {
      const isOtherExactMatch = sections
        .flatMap(s => s.items)
        .some(other => other.path !== itemPath && location.pathname === other.path);
      return !isOtherExactMatch;
    }
    return false;
  };

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={onClose} />
      )}
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 border-r border-sidebar-border flex flex-col",
        "bg-sidebar text-sidebar-foreground",
        collapsed ? "w-16" : "w-64",
        "max-md:fixed max-md:inset-y-0 max-md:z-40",
        isOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
      )}>
        <div className="flex items-center justify-between p-4 shrink-0">
          {!collapsed && (
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/volksanddavid-logo.svg" alt="Volks & David" className="h-8 w-8" />
              <div>
                <span className="text-sm font-bold block leading-tight">Volks &amp; David</span>
                <span className="text-[10px] text-sidebar-foreground/60">Tax Platform</span>
              </div>
            </Link>
          )}
          <div className="flex items-center gap-1">
            {onClose && (
              <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-sidebar-border/50 transition-colors md:hidden">
                <X className="h-4 w-4" />
              </button>
            )}
            <button onClick={() => setCollapsed(!collapsed)} className="rounded-lg p-1.5 hover:bg-sidebar-border/50 transition-colors">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-2 overflow-y-auto pb-4">
          {sections.map((section, sIdx) => {
            const isExpanded = expandedSections[sIdx] ?? true;
            return (
              <div key={sIdx} className="mb-3">
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(sIdx)}
                    className="flex items-center justify-between w-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground/80 transition-colors"
                  >
                    {section.label}
                    <ChevronDown className={cn("h-3 w-3 transition-transform", !isExpanded && "-rotate-90")} />
                  </button>
                )}
                {isExpanded && section.items.map((item) => {
                  const Icon = item.icon;
                  const active = checkActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 mb-0.5 relative",
                        active
                          ? "bg-gradient-to-r from-primary/15 to-primary/5 text-sidebar-foreground font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-4 before:w-0.5 before:bg-primary before:rounded-full"
                          : "text-sidebar-foreground/60 hover:bg-sidebar-border/20 hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {!collapsed && user && (
          <div className="shrink-0 border-t border-sidebar-border/50 p-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center text-sm font-medium shrink-0">
                {user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                <p className="text-[10px] text-sidebar-foreground/50 truncate">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="rounded-lg p-1.5 hover:bg-sidebar-border/30 transition-colors text-sidebar-foreground/50 hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
