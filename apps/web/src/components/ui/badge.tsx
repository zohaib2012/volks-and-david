import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "premium"
}>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary/10 text-primary border-primary/20 shadow-sm",
    secondary: "bg-secondary text-secondary-foreground border-secondary/50",
    destructive: "bg-destructive/10 text-destructive border-destructive/20",
    outline: "border-2 border-input text-foreground",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 shadow-sm",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 shadow-sm",
    info: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 shadow-sm",
    premium: "bg-gradient-to-r from-primary/10 to-accent/10 text-primary border-primary/20 shadow-sm",
  }
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})
Badge.displayName = "Badge"

export { Badge }
