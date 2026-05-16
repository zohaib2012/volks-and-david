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
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          V&D
        </div>
      </Link>
      <Button variant="ghost" size="icon" onClick={onOpenSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  )
}
