"use client";

import * as React from "react";
import { getLocale, setLocale as setLocaleInternal } from "./translations";
import type { Locale } from "./types";

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = React.createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("kk");

  React.useEffect(() => {
    setLocaleState(getLocale());
  }, []);

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l);
    setLocaleInternal(l);
  }, []);

  const t = React.useCallback(
    (key: string) => {
      const { translate } = require("./translations");
      return translate(key as any, locale);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = React.useContext(I18nContext);
  if (!context) {
    // Fallback for when provider is not mounted
    return {
      locale: getLocale() as Locale,
      setLocale: setLocaleInternal,
      t: (key: string) => {
        const { translate } = require("./translations");
        return translate(key as any);
      },
    };
  }
  return context;
}
