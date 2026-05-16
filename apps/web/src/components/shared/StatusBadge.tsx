import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  PENDING: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  IN_REVIEW:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  SUBMITTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  ACCEPTED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  APPROVED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  COMPLETED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  FAILED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  RESPONDED:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  RESOLVED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ACTIVE:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  INACTIVE: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  CONVERTED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  REGISTERED:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  UNDER_REVIEW:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = statusColors[status] || statusColors.PENDING;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        color,
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
