import { useState } from "react"
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/store/useAuthStore"
import api from "@/lib/api"
import {
  LayoutDashboard, Users, FileText, DollarSign, CalendarCheck,
  FileEdit, FileWarning, Settings as SettingsIcon, Video, HelpCircle,
  UserPlus, Receipt, Building2, ShieldCheck, Globe, Gift,
  ScrollText, FileSearch, Landmark, FolderOpen, Wallet, Activity,
  ChevronLeft, LogOut, ExternalLink, Menu, X, ChevronDown, Bell,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import toast from "react-hot-toast"

const adminNavItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Tax Returns", path: "/admin/returns", icon: FileText },
  { label: "Consultants", path: "/admin/consultants", icon: CalendarCheck },
  { label: "Payments", path: "/admin/payments", icon: DollarSign },
  { label: "NTN Registrations", path: "/admin/ntn", icon: UserPlus },
  { label: "GST Registrations", path: "/admin/gst", icon: Receipt },
  { label: "SECP / Business", path: "/admin/secp", icon: Building2 },
  { label: "IP Registrations", path: "/admin/ip-registrations", icon: ShieldCheck },
  { label: "Sales Tax Returns", path: "/admin/sales-tax-returns", icon: ScrollText },
  { label: "Sales Tax Notices", path: "/admin/sales-tax-notices", icon: FileWarning },
  { label: "Withholding Tax", path: "/admin/withholding-tax", icon: FileSearch },
  { label: "USA Services", path: "/admin/usa-services", icon: Globe },
  { label: "Consultations", path: "/admin/consultations-list", icon: CalendarCheck },
  { label: "Referrals", path: "/admin/referrals", icon: Gift },
  { label: "FBR Notices", path: "/admin/notices", icon: Landmark },
  { label: "Blog", path: "/admin/blog", icon: FileEdit },
  { label: "Videos", path: "/admin/videos", icon: Video },
  { label: "FAQs", path: "/admin/faqs", icon: HelpCircle },
  { label: "Activity Logs", path: "/admin/activity-logs", icon: Activity },
  { label: "Send Notification", path: "/admin/send-notification", icon: Bell },
  { label: "Documents", path: "/admin/documents", icon: FolderOpen },
  { label: "Expenses", path: "/admin/expenses", icon: Wallet },
  { label: "Site Settings", path: "/admin/settings", icon: SettingsIcon },
]

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/users": "Users",
  "/admin/returns": "Tax Returns",
  "/admin/consultants": "Consultants",
  "/admin/payments": "Payments",
  "/admin/blog": "Blog",
  "/admin/videos": "Videos",
  "/admin/faqs": "FAQs",
  "/admin/notices": "FBR Notices",
  "/admin/settings": "Site Settings",
  "/admin/ntn": "NTN Registrations",
  "/admin/gst": "GST Registrations",
  "/admin/secp": "SECP / Business",
  "/admin/ip-registrations": "IP Registrations",
  "/admin/sales-tax-returns": "Sales Tax Returns",
  "/admin/sales-tax-notices": "Sales Tax Notices",
  "/admin/withholding-tax": "Withholding Tax",
  "/admin/usa-services": "USA Services",
  "/admin/consultations-list": "Consultations",
  "/admin/referrals": "Referrals",
  "/admin/activity-logs": "Activity Logs",
  "/admin/send-notification": "Send Notification",
  "/admin/documents": "Documents",
  "/admin/expenses": "Expenses",
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: stats } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const res = await api.get("/admin/dashboard/stats");
      return res.data.data;
    },
    refetchInterval: 60000,
  })

  const pendingReviews = stats?.pendingReturns ?? 0
  const pendingPayments = stats?.pendingPayments ?? 0

  const handleLogout = () => {
    logout()
    toast.success("Logged out")
    navigate("/login")
  }

  const currentPage = breadcrumbMap[location.pathname] || "Admin"

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <NavLink to="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25">
              V&D
            </div>
            <div>
              <span className="text-sm font-bold text-sidebar-foreground">V&D Admin</span>
              <span className="block text-[10px] text-sidebar-foreground/50 uppercase tracking-wider">Panel</span>
            </div>
          </NavLink>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex rounded-lg p-1.5 text-sidebar-foreground/50 hover:bg-sidebar-border hover:text-sidebar-foreground transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {adminNavItems.map((item) => {
          const Icon = item.icon
          let badge: number | null = null
          if (item.path === "/admin/returns" && pendingReviews > 0) badge = pendingReviews
          else if (item.path === "/admin/payments" && pendingPayments > 0) badge = pendingPayments
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-blue-500/15 text-blue-400 shadow-sm"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-border/50 hover:text-sidebar-foreground"
                )
              }
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}
              {!collapsed && badge != null && (
                <span className="flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold px-1.5">
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border/50 px-3 py-3 space-y-2">
        {!collapsed && (
          <NavLink
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/50 hover:bg-sidebar-border/50 hover:text-sidebar-foreground transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Back to Site
          </NavLink>
        )}
        <div className={cn(!collapsed ? "" : "flex justify-center")}>
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-border/50 hover:text-red-400 transition-colors w-full",
              collapsed && "justify-center w-9 h-9 p-0"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xs font-bold shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate text-sidebar-foreground">{user?.name || "Admin"}</p>
              <p className="text-xs truncate text-sidebar-foreground/50">{user?.email || ""}</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 text-white text-xs font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 hidden lg:flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        {sidebarContent}
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMobileOpen(false)}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {sidebarContent}
      </aside>

      <div className={cn("flex flex-1 flex-col transition-all duration-300", "lg:ml-64", collapsed && "lg:ml-16")}>
        <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden rounded-lg p-1.5 hover:bg-muted transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Admin</span>
                <span className="text-muted-foreground/50">/</span>
                <span className="font-medium">{currentPage}</span>
              </div>
            </div>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors"
              >
                  <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", userMenuOpen && "rotate-180")} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card p-1 shadow-xl">
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || ""}</p>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setUserMenuOpen(false) }}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
