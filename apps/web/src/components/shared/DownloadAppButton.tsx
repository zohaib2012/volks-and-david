import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadAppButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
  showLabel?: boolean;
}

export default function DownloadAppButton({
  variant = "default",
  size = "default",
  className,
  showLabel = true,
}: DownloadAppButtonProps) {
  const { canInstall, install } = usePWAInstall();

  if (!canInstall) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={install}
      className={cn("gap-2", className)}
    >
      <Download className="h-4 w-4" />
      {showLabel && <span>Download App</span>}
    </Button>
  );
}
