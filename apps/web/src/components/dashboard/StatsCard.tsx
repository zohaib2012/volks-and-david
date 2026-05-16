import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const variantStyles = {
  default: "from-primary/10 to-primary/5 text-primary",
  success:
    "from-emerald-500/10 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  warning:
    "from-amber-500/10 to-amber-500/5 text-amber-600 dark:text-amber-400",
  danger: "from-red-500/10 to-red-500/5 text-red-600 dark:text-red-400",
};

export function StatsCard({
  icon,
  label,
  value,
  change,
  variant = "default",
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("border-border/50 overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br",
              variantStyles[variant],
            )}
          >
            {icon}
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                change >= 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400",
              )}
            >
              {change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
