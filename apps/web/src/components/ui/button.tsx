import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:from-primary/95 hover:to-primary/85",
        accent:
          "bg-gradient-to-br from-accent via-accent to-accent/90 text-accent-foreground shadow-lg shadow-accent/30 hover:shadow-xl hover:shadow-accent/40 hover:brightness-105",
        destructive:
          "bg-gradient-to-br from-destructive to-destructive/90 text-destructive-foreground shadow-lg shadow-destructive/25 hover:shadow-xl hover:shadow-destructive/30",
        outline:
          "border-2 border-input bg-background hover:bg-accent/10 hover:text-accent hover:border-accent/40 hover:shadow-md",
        secondary:
          "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground hover:from-secondary/90 hover:to-secondary/70 shadow-sm hover:shadow-md",
        ghost:
          "hover:bg-accent/10 hover:text-accent hover:shadow-sm",
        link: "text-accent underline-offset-4 hover:underline hover:text-accent/80",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
