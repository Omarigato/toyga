"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "kk" | "ru";

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  kk: {
    // Navigation
    "nav.landing": "Басты бет",
    "nav.templates": "Шаблондар",
    "nav.dashboard": "Мои мероприятия",
    "nav.admin": "Админ",
    "nav.login": "Кіру",
    "nav.register": "Тіркелу",
    "nav.logout": "Шығу",

    // Hero
    "hero.badge": "Apple Premium Digital Invitations",
    "hero.title": "Создайте уникальное приглашение на ваш той",
    "hero.subtitle": "Эксклюзивті анимациялық цифрлық шақырулар: Үйлену тойы, Қыз ұзату, Құдалық, Ауызашар және Тұсаукесер",
    "hero.cta": "Создать приглашение",
    "hero.demo": "Демо көру",

    // Categories
    "categories.title": "Той санаттары",
    "categories.uylenu": "Үйлену той",
    "categories.kyz_uzatu": "Қыз ұзату",
    "categories.kudalyk": "Құдалық",
    "categories.auyzashar": "Ауызашар",
    "categories.tsusakeser": "Тұсаукесер",
    "categories.view_templates": "Шаблондарды көру",

    // Pricing
    "pricing.title": "Разовое создание (Подписка жоқ)",
    "pricing.subtitle": "Артық төлемсіз — 1 шақыру үшін 1 рет қана төлейсіз",
    "pricing.price": "4 990 ₸",
    "pricing.feature1": "Барлық музыка және анимациялар тегін",
    "pricing.feature2": "Шексіз қонақтар тізімі және RSVP тіркеу",
    "pricing.feature3": "2GIS және Яндекс Карта интеграциясы",
    "pricing.feature4": "WhatsApp / SMS арқылы жеке сілтеме тарату",

    // Templates Page
    "templates.title": "Цифрлық шақырулар шаблондары",
    "templates.subtitle": "Өзіңізге ұнаған сәнді шаблонды таңдап, бірнеше минутта шақыру жасаңыз",
    "templates.filter_all": "Барлығы",
    "templates.tag_luxe": "Премиум",
    "templates.tag_free": "Тегін",
    "templates.tag_classic": "Классика",
    "templates.price_label": "Бағасы:",
    "templates.btn_select": "Таңдау",
    "templates.btn_demo": "Демо көру",

    // Wizard Steps Titles
    "wizard.title": "Шақыру билетін жасау конструкторы",
    "wizard.subtitle": "Қадам сайын той ақпаратын енгізіңіз",
    "wizard.step1": "1. Санат",
    "wizard.step2": "2. Шаблон",
    "wizard.step3": "3. Түс пен қаріп",
    "wizard.step4": "4. Мәтіндер",
    "wizard.step5": "5. Уақыт & Мекенжай (2GIS)",
    "wizard.step6": "6. Әуен",
    "wizard.step7": "7. Галерея",
    "wizard.step8": "8. Бағдарлама",
    "wizard.step9": "9. Қонақтар тізімі",
    "wizard.step10": "10. Алдын ала көру",
    "wizard.step11": "11. Төлем",
    "wizard.step12": "12. Жариялау",

    // Wizard Form Controls
    "wizard.form.title_label": "Шақыру тақырыбы (мысалы: Омар & Маржан):",
    "wizard.form.date_label": "Той күні:",
    "wizard.form.time_label": "Басталу уақыты:",
    "wizard.form.venue_label": "Ресторан / Зал атауы:",
    "wizard.form.address_label": "Мекенжай:",
    "wizard.form.gis_label": "2GIS Карта сілтемесі:",
    "wizard.form.music_label": "Фондық музыканы таңдаңыз:",
    "wizard.form.program_add": "+ Бағдарлама пунктін қосу",
    "wizard.form.guest_add": "+ Қонақ қосу",

    // Personal RSVP
    "rsvp.heading": "Шақыру билеті",
    "rsvp.question": "Тойға қатысасыз ба?",
    "rsvp.accept": "Иә, барамын",
    "rsvp.decline": "Өкінішке орай, бара алмаймын",
    "rsvp.guests_count": "Өзіңізбен бірге келетін адам саны:",
    "rsvp.comment": "Тілек немесе пікіріңіз:",
    "rsvp.submit": "Жауапты жіберу",
    "rsvp.success": "Жауабыңыз қабылданды! Рахмет!",

    // Payments
    "payment.checkout_title": "Төлем жасау",
    "payment.checkout_subtitle": "1 шақыру жасауға арналған разовый төлем",
    "payment.kaspi_option": "Kaspi.kz арқылы төлеу",
    "payment.card_option": "Банк картасымен төлеу",
    "payment.pay_button": "Төлеу 4 990 ₸",
    "payment.success_title": "Төлем сәтті өтті!",
    "payment.success_desc": "Шақыруыңыз белсендірілді және жариялауға дайын.",
    "payment.open_invitation": "Шақыруды ашу",
    "payment.to_dashboard": "Кабинетке өту",
    "payment.failed_title": "Төлем өтпеді!",
    "payment.failed_desc": "Төлем барысында қателік орын алды. Қайтадан байқап көріңіз.",
    "payment.retry": "Қайта төлеу",

    // Dashboard & CRM
    "dashboard.title": "Мои мероприятия",
    "dashboard.subtitle": "Барлық жасалған той-шақыруларыңыз бен қонақтар статистикасы",
    "dashboard.btn_create": "Жаңа шақыру жасау",
    "dashboard.status_published": "Жарияланған",
    "dashboard.btn_crm": "Қонақтар CRM",
    "dashboard.btn_view": "Шақыруды көру",
    "crm.title": "Қонақтарды басқару (CRM)",
    "crm.export": "Excel жүктеп алу",
    "crm.filter_all": "Барлығы",
    "crm.filter_accepted": "Иә, барады",
    "crm.filter_declined": "Бара алмайды",
    "crm.filter_pending": "Күтілуде",

    // Buttons
    "btn.back": "Артқа",
    "btn.next": "Келесі қадам",
    "btn.save": "Сақтау",
    "btn.select": "Таңдау",
    "btn.finish": "Аяқтау & Төлеу",
    "btn.cancel": "Бас тарту"
  },
  ru: {
    // Navigation
    "nav.landing": "Главная",
    "nav.templates": "Шаблоны",
    "nav.dashboard": "Мои мероприятия",
    "nav.admin": "Админ",
    "nav.login": "Войти",
    "nav.register": "Регистрация",
    "nav.logout": "Выйти",

    // Hero
    "hero.badge": "Apple Premium Digital Invitations",
    "hero.title": "Создайте уникальное приглашение на ваш той",
    "hero.subtitle": "Эксклюзивные анимационные цифровые приглашения для Свадьбы, Кыз узату, Кудалык, Ауызашар и Тусаукесер",
    "hero.cta": "Создать приглашение",
    "hero.demo": "Смотреть демо",

    // Categories
    "categories.title": "Категории торжеств",
    "categories.uylenu": "Үйлену той (Свадьба)",
    "categories.kyz_uzatu": "Қыз ұзату (Проводы)",
    "categories.kudalyk": "Құдалық (Сватовство)",
    "categories.auyzashar": "Ауызашар",
    "categories.tsusakeser": "Тұсаукесер",
    "categories.view_templates": "Смотреть шаблоны",

    // Pricing
    "pricing.title": "Разовая оплата (Без подписок)",
    "pricing.subtitle": "Без переплат — оплачивайте 1 раз за каждое созданное приглашение",
    "pricing.price": "4 990 ₸",
    "pricing.feature1": "Все музыкальные треки и анимации включены",
    "pricing.feature2": "Неограниченный список гостей и учет RSVP",
    "pricing.feature3": "Интеграция с навигацией 2GIS и Яндекс Картами",
    "pricing.feature4": "Персональная рассылка ссылок через WhatsApp",

    // Templates Page
    "templates.title": "Шаблоны цифровых приглашений",
    "templates.subtitle": "Выберите понравившийся стильный шаблон и создайте приглашение за 5 минут",
    "templates.filter_all": "Все шаблоны",
    "templates.tag_luxe": "Премиум",
    "templates.tag_free": "Бесплатно",
    "templates.tag_classic": "Классика",
    "templates.price_label": "Цена:",
    "templates.btn_select": "Выбрать",
    "templates.btn_demo": "Демо просмотр",

    // Wizard Steps Titles
    "wizard.title": "Конструктор создания приглашений",
    "wizard.subtitle": "Пошагово заполните данные вашего торжества",
    "wizard.step1": "1. Категория",
    "wizard.step2": "2. Шаблон",
    "wizard.step3": "3. Цвет и шрифт",
    "wizard.step4": "4. Тексты",
    "wizard.step5": "5. Время & 2GIS Локация",
    "wizard.step6": "6. Музыка",
    "wizard.step7": "7. Галерея",
    "wizard.step8": "8. Программа",
    "wizard.step9": "9. Список гостей",
    "wizard.step10": "10. Предпросмотр",
    "wizard.step11": "11. Оплата",
    "wizard.step12": "12. Публикация",

    // Wizard Form Controls
    "wizard.form.title_label": "Название приглашения (например: Омар & Маржан):",
    "wizard.form.date_label": "Дата торжества:",
    "wizard.form.time_label": "Время начала:",
    "wizard.form.venue_label": "Ресторан / Зал:",
    "wizard.form.address_label": "Адрес:",
    "wizard.form.gis_label": "Ссылка на 2GIS Карс:",
    "wizard.form.music_label": "Выберите фоновую музыку:",
    "wizard.form.program_add": "+ Добавить пункт программы",
    "wizard.form.guest_add": "+ Добавить гостя",

    // Personal RSVP
    "rsvp.heading": "Пригласительный билет",
    "rsvp.question": "Подтвердите ваше присутствие:",
    "rsvp.accept": "Да, приду",
    "rsvp.decline": "К сожалению, не смогу",
    "rsvp.guests_count": "Количество гостей с вами:",
    "rsvp.comment": "Пожелание или комментарий:",
    "rsvp.submit": "Отправить ответ",
    "rsvp.success": "Ваш ответ принят! Спасибо!",

    // Payments
    "payment.checkout_title": "Оплата заказа",
    "payment.checkout_subtitle": "Разовая активация 1 цифрового приглашения",
    "payment.kaspi_option": "Оплатить через Kaspi.kz",
    "payment.card_option": "Оплатить банковской картой",
    "payment.pay_button": "Оплатить 4 990 ₸",
    "payment.success_title": "Оплата успешно прошла!",
    "payment.success_desc": "Ваше приглашение активировано и готово к рассылке.",
    "payment.open_invitation": "Открыть приглашение",
    "payment.to_dashboard": "В личный кабинет",
    "payment.failed_title": "Ошибка оплаты!",
    "payment.failed_desc": "Произошла ошибка при обработке платежа. Попробуйте еще раз.",
    "payment.retry": "Повторить оплату",

    // Dashboard & CRM
    "dashboard.title": "Мои мероприятия",
    "dashboard.subtitle": "Все созданные приглашения и статистика гостей",
    "dashboard.btn_create": "Создать новое приглашение",
    "dashboard.status_published": "Опубликовано",
    "dashboard.btn_crm": "CRM Гостей",
    "dashboard.btn_view": "Просмотр",
    "crm.title": "Управление гостями (CRM)",
    "crm.export": "Скачать Excel",
    "crm.filter_all": "Все",
    "crm.filter_accepted": "Да, придут",
    "crm.filter_declined": "Не смогут",
    "crm.filter_pending": "Ожидание",

    // Buttons
    "btn.back": "Назад",
    "btn.next": "Следующий шаг",
    "btn.save": "Сохранить",
    "btn.select": "Выбрать",
    "btn.finish": "Завершить & Оплатить",
    "btn.cancel": "Отмена"
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
