# ARCHIVED PLAN: 1783936977093-silent-pixel.md

> **ВНИМАНИЕ / ARCHIVED:** Этот план описывает старую архитектуру (React+Vite + Vercel Serverless + 17-табличная схема PostgreSQL с BIGSERIAL).
> Настоящий стек проекта: Next.js App Router (Frontend) + FastAPI (Backend) + `database/schema.sql` (PostgreSQL UUID schema).

---

# Original Plan Content

# Toyga.kz — Полный анализ проекта

## Что это за проект

**Toyga.kz** — казахстанская платформа цифровых свадебных/праздничных приглашений. Слово "тойға" означает "на свадьбу" на казахском языке. Пользователи выбирают шаблон, создают приглашение, отправляют гостям через WhatsApp и собирают RSVP.

**Домен в продакшене:** `https://toyga.kz`

---

## Технологический стек

| Слой | Технологии |
|------|-----------|
| **Frontend** | React 19, TypeScript 5.8, Vite 8, TailwindCSS 3, Framer Motion 12, i18next 25, Recharts 3, Lucide Icons, Zod 4 |
| **Backend** | Vercel Serverless Functions (Node.js), pg 8 (raw SQL), jsonwebtoken, bcryptjs, formidable, nanoid |
| **База данных** | PostgreSQL (Neon), 17 таблиц |
| **Хранилище медиа** | Google Drive (Service Account + streaming proxy) |
| **Мессенджер** | WhatsApp Gateway (self-hosted, Express + Baileys) |
| **Деплой** | Vercel (frontend + API), Docker (WhatsApp gateway) |
