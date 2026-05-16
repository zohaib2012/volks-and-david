import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ur" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn("flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary", className)}
    >
      <Globe className="h-4 w-4" />
      <span>{i18n.language === "en" ? "EN" : "UR"}</span>
    </button>
  );
}
