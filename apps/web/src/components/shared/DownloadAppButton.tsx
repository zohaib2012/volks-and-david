import { useCallback, useState, useRef } from "react";
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const installed = await install();

    if (installed) {
      setLoading(false);
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
    }, 15000);
  }, [install, loading]);

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
      {showLabel && <span>{loading ? "Downloading..." : "Download App"}</span>}
    </Button>
  );
}
