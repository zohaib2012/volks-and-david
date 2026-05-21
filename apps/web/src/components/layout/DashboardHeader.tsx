import { useState } from "react"
import { Bell, Search, LogOut, User, Settings as SettingsIcon, Palette, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/store/useAuthStore"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

export default function DashboardHeader() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const { data: unreadData } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const res = await api.get("/notifications/unread-count")
      return res.data
    },
    refetchInterval: 30000,
    staleTime: 10000,
  })

  const unreadCount: number = unreadData?.data?.count ?? 0

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 rounded-full border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] })
            navigate("/dashboard/notifications")
          }}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center text-sm font-medium">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="hidden md:block text-sm font-medium max-w-[120px] truncate">{user?.email}</span>
            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", dropdownOpen && "rotate-180")} />
          </Button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl border border-border/50 bg-card shadow-2xl shadow-primary/5 backdrop-blur-xl overflow-hidden">
                <div className="p-2">
                  <button
                    onClick={() => { navigate("/dashboard/settings"); setDropdownOpen(false) }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                    View Profile
                  </button>
                  <button
                    onClick={() => { navigate("/dashboard/settings"); setDropdownOpen(false) }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                    Settings
                  </button>
                  <button
                    onClick={() => { navigate("/dashboard/settings/theme"); setDropdownOpen(false) }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <Palette className="h-4 w-4 text-muted-foreground" />
                    Theme
                  </button>
                </div>
                <div className="border-t border-border/50 p-2">
                  <button
                    onClick={() => { logout(); navigate("/"); setDropdownOpen(false) }}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
