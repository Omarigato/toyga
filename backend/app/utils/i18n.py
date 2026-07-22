TRANSLATIONS = {
    "kk": {
        "welcome": "TOYGA.KZ — Сән-салтанатты цифрлық шақырулар платфорамасы",
        "rsvp_accept": "Иә, барамын",
        "rsvp_decline": "Өкінішке орай, бара алмаймын",
        "paid_success": "Төлем сәтті өтті!"
    },
    "ru": {
        "welcome": "TOYGA.KZ — Платформа цифровых приглашений",
        "rsvp_accept": "Да, приду",
        "rsvp_decline": "К сожалению, не смогу",
        "paid_success": "Оплата успешно прошла!"
    }
}

def get_text(key: str, lang: str = "kk") -> str:
    locale = lang if lang in TRANSLATIONS else "kk"
    return TRANSLATIONS[locale].get(key, key)
