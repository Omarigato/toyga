import { translate, getLocale, setLocale } from "./translations";
import type { Locale, TranslationKey } from "./types";

export function t(key: TranslationKey, locale?: Locale): string {
  return translate(key, locale);
}

export { getLocale, setLocale };
