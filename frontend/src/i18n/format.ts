import { getLocale } from "@/i18n";

export function formatDateTime(value: string | Date, language: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(getLocale(language), options ?? {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatDate(value: string | Date, language: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(getLocale(language), options ?? {
    dateStyle: "medium"
  }).format(new Date(value));
}

export function formatTime(value: string | Date, language: string, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(getLocale(language), options ?? {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatNumber(value: number, language: string, options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(getLocale(language), options).format(value);
}
