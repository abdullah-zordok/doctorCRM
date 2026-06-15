import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { changeLanguage, languageOptions, normalizeLanguage, type SupportedLanguage } from "@/i18n";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  compact?: boolean;
  className?: string;
};

export function LanguageSwitcher({ compact = false, className }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? "en";

  async function selectLanguage(language: SupportedLanguage) {
    if (language !== currentLanguage) {
      await changeLanguage(language);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size={compact ? "icon" : "md"}
          className={cn("gap-2", className)}
          aria-label={t("language.switchTo", {
            language: t(currentLanguage === "en" ? "language.arabic" : "language.english")
          })}
        >
          <Languages className="h-4 w-4" aria-hidden="true" />
          {compact ? null : <span>{t(currentLanguage === "en" ? "language.english" : "language.arabic")}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onSelect={() => void selectLanguage(option.code)}
            className={cn(option.code === currentLanguage && "bg-muted font-semibold")}
          >
            <span lang={option.code} dir={option.code === "ar" ? "rtl" : "ltr"}>
              {t(option.labelKey)}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
