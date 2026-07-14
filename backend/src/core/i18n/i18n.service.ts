import { Injectable } from '@nestjs/common';
import * as kk from '../../i18n/kk.json';
import * as ru from '../../i18n/ru.json';
import * as en from '../../i18n/en.json';

export type SupportedLanguage = 'kk' | 'ru' | 'en';

const translations: Record<SupportedLanguage, Record<string, string>> = {
  kk: kk,
  ru: ru,
  en: en,
};

@Injectable()
export class I18nService {
  private defaultLanguage: SupportedLanguage = 'kk';

  translate(key: string, lang?: SupportedLanguage): string {
    const language = lang || this.defaultLanguage;
    return translations[language]?.[key] || translations[this.defaultLanguage]?.[key] || key;
  }

  setDefaultLanguage(lang: SupportedLanguage) {
    this.defaultLanguage = lang;
  }

  getDefaultLanguage(): SupportedLanguage {
    return this.defaultLanguage;
  }

  isValidLanguage(lang: string): lang is SupportedLanguage {
    return lang in translations;
  }
}
