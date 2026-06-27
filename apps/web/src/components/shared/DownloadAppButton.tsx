import { useCallback, useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setLoading(true);
    await install();
    setTimeout(() => setLoading(false), 3000);
  }, [install]);

  if (isInstalled) return null;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={cn("gap-2", className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {showLabel && <span>{loading ? "Preparing..." : "Download App"}</span>}
    </Button>
  );
}
