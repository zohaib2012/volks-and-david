import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "@/components/shared/LanguageToggle"
import { useAuthStore } from "@/store/useAuthStore"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Services", path: "/services" },
  { label: "Pricing", path: "/pricing" },
  { label: "USA Services", path: "/usa-services" },
  { label: "Blog", path: "/blog" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact", path: "/contact" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 z-50 w-full transition-all duration-300",
      scrolled
        ? "backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-sm"
        : "bg-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl font-black text-xs text-white shadow-md"
            style={{ background: "linear-gradient(135deg, #4F6FF5, #10B981)" }}
          >
            V&D
          </div>
          <span className="text-lg font-black tracking-tight">
            <span style={{ background: "linear-gradient(135deg, #4F6FF5, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Volks
            </span>
            <span className="text-foreground/60 mx-0.5 font-light">&</span>
            <span style={{ background: "linear-gradient(135deg, #10B981, #34D399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              David
            </span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground group"
            >
              {link.label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary rounded-full transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          {isAuthenticated ? (
            <Button
              className="text-white font-semibold shadow-md"
              style={{ background: "linear-gradient(135deg, #4F6FF5, #10B981)", boxShadow: "0 4px 16px rgba(79,111,245,0.3)" }}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          ) : (
            <>
              <Button variant="outline" className="font-semibold" onClick={() => navigate("/login")}>Login</Button>
              <Button
                className="text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, #10B981, #059669)", boxShadow: "0 4px 16px rgba(16,185,129,0.35)" }}
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-2 pt-2 border-t border-border mt-2">
                {isAuthenticated ? (
                  <Button className="w-full" onClick={() => { navigate("/dashboard"); setMobileOpen(false) }}>Dashboard</Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => { navigate("/login"); setMobileOpen(false) }}>Login</Button>
                    <Button className="flex-1 bg-gradient-to-r from-primary to-accent" onClick={() => { navigate("/register"); setMobileOpen(false) }}>Get Started</Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
