import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ar from "@/i18n/ar/translation.json";
import en from "@/i18n/en/translation.json";

export const supportedLanguages = ["en", "ar"] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];
export type AppDirection = "ltr" | "rtl";

export const LANGUAGE_STORAGE_KEY = "doctor_clinic_language";

export const languageOptions: Array<{ code: SupportedLanguage; labelKey: "language.english" | "language.arabic" }> = [
  { code: "en", labelKey: "language.english" },
  { code: "ar", labelKey: "language.arabic" }
];

export function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

export function normalizeLanguage(value: string | null | undefined): SupportedLanguage | null {
  if (!value) return null;
  const base = value.toLowerCase().split("-")[0];
  return isSupportedLanguage(base) ? base : null;
}

export function resolveLanguage(storedLanguage: string | null | undefined, browserLanguages: readonly string[]): SupportedLanguage {
  const stored = normalizeLanguage(storedLanguage);
  if (stored) return stored;

  for (const language of browserLanguages) {
    const normalized = normalizeLanguage(language);
    if (normalized) return normalized;
  }

  return "en";
}

export function resolveInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "en";

  return resolveLanguage(
    window.localStorage.getItem(LANGUAGE_STORAGE_KEY),
    window.navigator.languages ?? [window.navigator.language]
  );
}

export function getDirection(language: string): AppDirection {
  return normalizeLanguage(language) === "ar" ? "rtl" : "ltr";
}

export function getLocale(language: string): string {
  return normalizeLanguage(language) === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US";
}

export function applyDocumentLanguage(language: string) {
  const normalized = normalizeLanguage(language) ?? "en";
  if (typeof window === "undefined" || typeof document === "undefined") return;

  document.documentElement.lang = normalized;
  document.documentElement.dir = getDirection(normalized);
  document.title = i18n.t("app.title", { lng: normalized });
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
}

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: resolveInitialLanguage(),
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  })
  .then(() => applyDocumentLanguage(i18n.resolvedLanguage ?? i18n.language));

i18n.on("languageChanged", applyDocumentLanguage);

export async function changeLanguage(language: SupportedLanguage) {
  await i18n.changeLanguage(language);
}

export default i18n;
