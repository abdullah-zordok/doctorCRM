import { getDirection, getLocale, normalizeLanguage, resolveLanguage } from "@/i18n";

export function verifyI18nScenario() {
  return {
    storedPreferenceWins: resolveLanguage("ar", ["en-US"]) === "ar",
    browserLanguageFallsBack: resolveLanguage(null, ["fr-FR", "ar-SA"]) === "ar",
    unsupportedLanguagesUseEnglish: resolveLanguage("fr", ["de-DE"]) === "en",
    regionalCodesNormalize: normalizeLanguage("EN-gb") === "en" && normalizeLanguage("ar-SA") === "ar",
    directionsMatchLanguage: getDirection("ar") === "rtl" && getDirection("en") === "ltr",
    arabicUsesLatinDigits: getLocale("ar").includes("nu-latn")
  };
}
