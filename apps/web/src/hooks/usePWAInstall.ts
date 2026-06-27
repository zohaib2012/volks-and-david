import { useState, useEffect, useCallback, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const pendingInstallRef = useRef(false);

  const triggerPrompt = useCallback(async (e: BeforeInstallPromptEvent) => {
    e.prompt();
    const { outcome } = await e.userChoice;
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    pendingInstallRef.current = false;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const alreadyInstalled =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsInstalled(alreadyInstalled);

    const earlyEvent = (window as any).__deferredPrompt;
    if (earlyEvent) {
      setDeferredPrompt(earlyEvent);
      (window as any).__deferredPrompt = null;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      if (pendingInstallRef.current) {
        triggerPrompt(promptEvent);
      }
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, [triggerPrompt]);

  const install = useCallback(async () => {
    if (deferredPrompt) {
      await triggerPrompt(deferredPrompt);
      return true;
    }
    pendingInstallRef.current = true;
    return false;
  }, [deferredPrompt, triggerPrompt]);

  return { isInstalled, install };
}
