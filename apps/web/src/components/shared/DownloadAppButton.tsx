import { useState, useCallback } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Button } from "@/components/ui/button";
import { Download, Smartphone, X } from "lucide-react";
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
  const { canInstall, isInstalled, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  const isIOS =
    typeof navigator !== "undefined" &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as any).MSStream;

  if (isInstalled) return null;

  const handleClick = useCallback(async () => {
    const installed = await install();
    if (!installed) {
      setShowGuide(true);
    }
  }, [install]);

  if (canInstall) {
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

  if (!showLabel) return null;

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={cn("gap-2", className)}
      >
        <Download className="h-4 w-4" />
        <span>Download App</span>
      </Button>

      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#21346E]">
                <Smartphone className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                Install App
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                {isIOS
                  ? 'Tap the Share button <svg class="inline-block h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg> in Safari, then scroll down and tap <strong>Add to Home Screen</strong>.'
                  : "Open the browser menu and tap <strong>Add to Home Screen</strong> or <strong>Install</strong>."}
              </p>
              <Button className="w-full" onClick={() => setShowGuide(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
