import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface MobileNavProps {
  onOpenSidebar: () => void
}

export default function MobileNav({ onOpenSidebar }: MobileNavProps) {
  return (
    <div className="flex items-center justify-between md:hidden p-4 border-b border-border">
      <Link to="/dashboard" className="flex items-center gap-2">
        <img src="/volksanddavid-logo.svg" alt="Volks & David" className="h-7 w-7" />
        <span className="text-sm font-semibold">Volks &amp; David</span>
      </Link>
      <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  )
}
