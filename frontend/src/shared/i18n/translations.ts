import kk from "./kk";
import ru from "./ru";
import en from "./en";
import type { Locale, TranslationKey } from "./types";

const translations: Record<Locale, Record<TranslationKey, string>> = { kk, ru, en };

let currentLocale: Locale = "kk";

export function setLocale(locale: Locale) {
  currentLocale = locale;
  if (typeof window !== "undefined") {
    localStorage.setItem("tg_locale", locale);
  }
}

export function getLocale(): Locale {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("tg_locale") as Locale;
    if (stored && ["kk", "ru", "en"].includes(stored)) {
      currentLocale = stored;
    }
  }
  return currentLocale;
}

export function translate(key: TranslationKey, locale?: Locale): string {
  const lang = locale || currentLocale;
  return translations[lang]?.[key] || translations.kk[key] || key;
}
