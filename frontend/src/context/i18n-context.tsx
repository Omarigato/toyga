"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "kk" | "ru";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => str;
}

const translations: Record<Language, Record<string, string>> = {
  kk: {
    "nav.landing": "Басты бет",
    "nav.marketplace": "Шаблондар",
    "nav.dashboard": "Басқару панелі",
    "nav.admin": "Админ",
    "hero.badge": "Luxe Digital Invitations",
    "hero.title": "Тойыңызға ерекше сәнді цифрлық шақыру жасаңыз",
    "hero.subtitle": "Үйлену тойы, Қыз ұзату, Құдалық, Ауызашар және Тұсаукесер тойларына арналған эксклюзивті анимациялық шақырулар",
    "hero.cta": "Шақыру жасау",
    "hero.demo": "Демо көру",
    "categories.title": "Той санаттары",
    "categories.uylenu": "Үйлену той",
    "categories.kyz_uzatu": "Қыз ұзату",
    "categories.kudalyk": "Құдалық",
    "categories.auyzashar": "Ауызашар",
    "categories.tsusakeser": "Тұсаукесер",
    "rsvp.heading": "Шақыру билеті",
    "rsvp.question": "Тойға қатысасыз ба?",
    "rsvp.accept": "Иә, барамын",
    "rsvp.decline": "Өкінішке орай, бара алмаймын",
    "rsvp.guests_count": "Өзіңізбен бірге келетін адам саны:",
    "rsvp.comment": "Тілек немесе пікіріңіз:",
    "rsvp.submit": "Жауапты жіберу",
    "rsvp.success": "Жауабыңыз қабылданды! Рахмет!"
  },
  ru: {
    "nav.landing": "Главная",
    "nav.marketplace": "Шаблоны",
    "nav.dashboard": "Панель управления",
    "nav.admin": "Админ",
    "hero.badge": "Luxe Digital Invitations",
    "hero.title": "Создайте уникальное цифровое приглашение на ваш той",
    "hero.subtitle": "Эксклюзивные анимационные приглашения для Свадьбы, Кыз узату, Кудалык, Ауызашар и Тусаукесер",
    "hero.cta": "Создать приглашение",
    "hero.demo": "Смотреть демо",
    "categories.title": "Категории торжеств",
    "categories.uylenu": "Свадьба",
    "categories.kyz_uzatu": "Кыз узату",
    "categories.kudalyk": "Кудалык",
    "categories.auyzashar": "Ауызашар",
    "categories.tsusakeser": "Тусаукесер",
    "rsvp.heading": "Пригласительный билет",
    "rsvp.question": "Подтвердите ваше присутствие:",
    "rsvp.accept": "Да, приду",
    "rsvp.decline": "К сожалению, не смогу",
    "rsvp.guests_count": "Количество гостей с вами:",
    "rsvp.comment": "Пожедание или комментарий:",
    "rsvp.submit": "Отправить ответ",
    "rsvp.success": "Ваш ответ принят! Спасибо!"
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>("kk");

  useEffect(() => {
    const saved = localStorage.getItem("toyga_lang") as Language;
    if (saved === "kk" || saved === "ru") {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("toyga_lang", newLang);
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations["kk"]?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
