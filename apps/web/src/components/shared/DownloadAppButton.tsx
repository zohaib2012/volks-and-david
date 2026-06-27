import { useCallback } from "react";
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
  const { isInstalled, install } = usePWAInstall();

  const handleClick = useCallback(async () => {
    await install();
  }, [install]);

  if (isInstalled) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={cn("gap-2", className)}
    >
      <Download className="h-4 w-4" />
      {showLabel && <span>Download App</span>}
    </Button>
  );
}
