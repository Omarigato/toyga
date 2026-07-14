# Toyga.kz V2 — Фронтенд-архитектура и новая бизнес-логика

> Дата: 2026-07-14 | Статус: Production-ready specification | Версия: 3.0
> Этап 1 из 8 — Документация

---

## Содержание

1. [Текущее состояние проекта](#1-текущее-состояние-проекта)
2. [Premium Luxury Design System](#2-premium-luxury-design-system)
3. [UI-правила и компоненты](#3-ui-правила-и-компоненты)
4. [Guest CRM — архитектура](#4-guest-crm--архитектура)
5. [Динамический Excel импорт/экспорт гостей](#5-динамический-excel-импортэкспорт-гостей)
6. [Template Cloning — система клонирования шаблонов](#6-template-cloning--система-клонирования-шаблонов)
7. [Dynamic OG-Image генерация](#7-dynamic-og-image-генерация)
8. [Рекламные блоки через AppSettings](#8-рекламные-блоки-через-appsettings)
9. [Импорт шаблонов JSON/HTML](#9-импорт-шаблонов-jsonhtml)
10. [Invitation Editor — архитектура редактора](#10-invitation-editor--архитектура-редактора)
11. [Новые таблицы БД](#11-новые-таблицы-бд)
12. [Новые API-эндпоинты](#12-новые-api-эндпоинты)

---

## 1. Текущее состояние проекта

### 1.1. Стек технологий

| Слой | Технология | Версия |
|------|-----------|--------|
| Frontend | Next.js (App Router) + React 19 + TypeScript | 16.2.10 |
| CSS | TailwindCSS 4 + CSS custom properties | ^4 |
| State | Zustand (auth) + TanStack Query (server) | 5.x / 5.x |
| Forms | React Hook Form + Zod | 7.x / 4.x |
| Backend | NestJS + TypeScript | 11.x |
| ORM | Prisma (read-only mirror, schema via raw SQL) | 6.x |
| Database | PostgreSQL | 16 |
| Storage | Google Drive API | — |
| Auth | JWT (Bearer + refresh tokens) + Passport.js | — |
| WhatsApp | Baileys Gateway (self-hosted) | — |

### 1.2. Текущая база данных (15 таблиц)

```
users, auth_sessions, otp_codes, categories, templates,
template_assets, events, event_contents, event_versions,
media, guests, invitation_links, rsvp, whatsapp_messages,
audit_logs
```

### 1.3. Текущие API-эндпоинты

| Модуль | Кол-во | Ключевые |
|--------|--------|----------|
| Auth | 9 | register, login, OTP, Google OAuth, refresh, logout |
| Templates | 7 | CRUD + assets |
| Categories | 5 | CRUD |
| Events | 11 | CRUD + publish, autosave, versions |
| Guests | 7 | CRUD + bulk import, personal slugs, RSVP |
| Invitation Links | 5 | General + personal |
| Media | 4 | Upload (Google Drive), delete |
| WhatsApp | 3 | Send, broadcast, list |
| Admin | 6+ | Stats, user/event/template management |

### 1.4. Текущий фронтенд

| Страница | Статус | Файлы |
|----------|--------|-------|
| Home | ✅ Полный | `app/page.tsx` — Hero, Features, HowItWorks, CTA |
| Auth (login/register) | ✅ Полный | `app/(auth)/*` — email/password, Google OAuth, OTP |
| Dashboard | ⚠️ Базовый | `app/(dashboard)/dashboard/page.tsx` |
| Events list | ✅ Рабочий | `app/(dashboard)/events/page.tsx` |
| Event editor | ⚠️ Базовый | `app/(dashboard)/events/[id]/editor/page.tsx` — canvas blocks |
| Guests | ❌ Заглушка | `app/(dashboard)/guests/page.tsx` (1019 bytes) |
| Media | ❌ Заглушка | `app/(dashboard)/media/page.tsx` (979 bytes) |
| Settings | ⚠️ Базовый | `app/(dashboard)/settings/page.tsx` — профиль |
| Templates | ✅ Рабочий | `app/(dashboard)/templates/page.tsx` |

### 1.5. Текущие UI-компоненты (`shared/ui/*`)

Button, Card (paper/seal), Badge, Avatar, Input, Select, Modal, Skeleton, SealSvg, OTP-input, SectionDivider, Toast (provider), ErrorBoundary.

### 1.6. Дизайн-система (текущая)

| Элемент | Значение |
|---------|----------|
| Display шрифт | Yeseva One |
| Body шрифт | Golos Text (400-700) |
| Eyebrow шрифт | Forum (letter-spacing: 0.08em, uppercase) |
| Mono шрифт | PT Mono |
| Primary цвет | `#B8902E` (gold) |
| Background | `#F4ECD8` (parchment) |
| Text | `#15110D` (ink) |
| Accent | `#26424A` (tengri) |
| Destructive | `#5C1A24` (wine) |
| Muted | `#9C9280` (steppe) |

---

## 2. Premium Luxury Design System

### 2.1. Философия

Дизайн-система Toyga.kz V3 следует принципам premium-luxury сегмента:

- **Apple** — чистота, пространство, типографический фокус
- **Linear** — минимальные UI, чёткая иерархия, micro-анимации
- **Canva** — доступность, drag-and-drop, визуальная интуитивность

**Ключевые принципы:**

1. **Воздух (Whitespace)** — минимум 24px между секциями, 16px между элементами, 8px внутри карточек
2. **Золотая пропорция** — отступы кратны 4px (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
3. **Одна задача на экран** — каждый экран решает одну задачу
4. **Нет перегрузки** — максимум 3 primary-действия на экран
5. **Плавность** — все переходы 200-400ms ease-out, spring-анимации для drag

### 2.2. Расширенная палитра

#### Основные цвета

| Токен | HEX | Использование |
|-------|-----|---------------|
| `--color-ink` | `#15110D` | Основной текст |
| `--color-parchment` | `#F4ECD8` | Фон страниц |
| `--color-gold` | `#B8902E` | Primary акцент, CTA |
| `--color-gold-hover` | `#A17E28` | Hover state gold |
| `--color-wine` | `#5C1A24` | Destructive, ошибки |
| `--color-tengri` | `#26424A` | Links, info |
| `--color-steppe` | `#9C9280` | Muted текст |
| `--color-sage` | `#7A8B6F` | Успех, подтверждения (НОВЫЙ) |

#### Расширенные оттенки (НОВЫЕ)

| Токен | Значение | Использование |
|-------|----------|---------------|
| `--color-gold-4` | `rgba(184,144,46,0.04)` | Hover фон кнопок |
| `--color-gold-6` | `rgba(184,144,46,0.06)` | Selected row |
| `--color-gold-10` | `rgba(184,144,46,0.10)` | Active tab underline |
| `--color-ink-4` | `rgba(21,17,13,0.04)` | Disabled state |
| `--color-ink-8` | `rgba(21,17,13,0.08)` | Hover ghost buttons |
| `--color-ink-12` | `rgba(21,17,13,0.12)` | Divider lines |
| `--color-sage-10` | `rgba(122,139,111,0.10)` | Success badge bg |
| `--color-wine-8` | `rgba(92,26,36,0.08)` | Error badge bg |

#### Градиенты

```css
/* Gold shimmer — для premium-элементов */
--gradient-gold: linear-gradient(135deg, #B8902E 0%, #E8C978 50%, #B8902E 100%);

/* Dark overlay — для hero секций */
--gradient-dark: linear-gradient(180deg, #15110D 0%, rgba(21,17,13,0.85) 100%);

/* Card hover — для карточек шаблонов */
--gradient-card-hover: linear-gradient(180deg, transparent 40%, rgba(21,17,13,0.02) 100%);
```

### 2.3. Типографическая система

#### Масштаб

| Роль | Размер | Высота строки | Шрифт | Вес | CSS-класс |
|------|--------|---------------|-------|-----|-----------|
| Display XL | 64px / 4rem | 1.05 | Yeseva One | 400 | `text-display-xl` |
| Display LG | 48px / 3rem | 1.1 | Yeseva One | 400 | `text-display-lg` |
| Display MD | 32px / 2rem | 1.2 | Golos Text | 600 | `text-display-md` |
| Heading | 24px / 1.5rem | 1.3 | Golos Text | 600 | `text-heading` |
| Subheading | 20px / 1.25rem | 1.4 | Golos Text | 500 | `text-subheading` |
| Body LG | 18px / 1.125rem | 1.6 | Golos Text | 400 | `text-body-lg` |
| Body MD | 16px / 1rem | 1.6 | Golos Text | 400 | `text-body-md` |
| Body SM | 14px / 0.875rem | 1.5 | Golos Text | 400 | `text-body-sm` |
| Caption | 12px / 0.75rem | 1.4 | Golos Text | 500 | `text-caption` |
| Eyebrow | 11px / 0.6875rem | 1.6 | Forum | 400 | `font-eyebrow` |
| Mono | 13px / 0.8125rem | 1.5 | PT Mono | 400 | `font-mono` |

#### Правила типографики

1. **Display** — только для Hero-секций и заголовков страниц
2. **Heading** — заголовки секций, модальных окон
3. **Body MD** — основной текст интерфейса
4. **Body SM** —.secondary текст, описания
5. **Caption** — метаданные, timestamp'ы, labels
6. **Eyebrow** — категории, статусы, метки над заголовками
7. **Mono** — числа, ID, коды, статистика

### 2.4. Теневая система

| Уровень | CSS | Применение |
|---------|-----|------------|
| Level 0 | `none` | Фоновые элементы |
| Level 1 | `0 1px 2px rgba(21,17,13,0.05)` | Кнопки в покое |
| Level 2 | `0 2px 8px rgba(21,17,13,0.08)` | Карточки в покое |
| Level 3 | `0 4px 16px rgba(21,17,13,0.12)` | Карточки в hover, dropdown |
| Level 4 | `0 8px 30px rgba(21,17,13,0.15)` | Модальные окна |
| Level 5 | `0 16px 48px rgba(21,17,13,0.20)` | Попапи, тултипы |
| Gold Glow | `0 0 0 3px rgba(184,144,46,0.15)` | Focus ring |
| Seal | `0 8px 30px -8px rgba(21,17,13,0.45)` | Hero cards |

### 2.5. Микроанимации

| Тип | Длительность | Easing | Использование |
|-----|-------------|--------|---------------|
| Fade In | 200ms | ease-out | Появление элементов |
| Fade In Up | 400ms | ease-out | Появление секций |
| Scale | 200ms | spring(1,80,10) | Hover кнопок, карточек |
| Slide Right | 300ms | ease-out | Открытие sidebar |
| Slide Up | 300ms | ease-out | Открытие modal |
| Shimmer | 1.5s | linear | Loading skeleton |
| Pulse | 2s | ease-in-out | Live-индикаторы |

**Правило:** Все анимации отключаются при `prefers-reduced-motion: reduce`.

---

## 3. UI-правила и компоненты

### 3.1. Общие правила

1. **Единый border-radius:** `8px` для малых элементов, `12px` для карточек, `16px` для модалок
2. **Padding карточек:** `24px` (p-6), `16px` (p-4) для компактных
3. **Gap в сетках:** `16px` (gap-4) для карточек, `12px` (gap-3) для списков
4. **Hover-состояние:** `transition-all duration-200` + scale(1.02) для карточек
5. **Focus ring:** `ring-2 ring-[var(--color-gold)] ring-offset-2`
6. **Loading skeleton:** `animate-shimmer` с gradient
7. **Empty state:** SealSvg (размер 64, opacity 25%) + текст + CTA кнопка
8. **Error state:** wine-8 фон + wine текст + retry кнопка

### 3.2. Расширенная библиотека компонентов

#### Существующие (обновить)

| Компонент | Файлы | Изменения |
|-----------|-------|-----------|
| Button | `shared/ui/button` | Добавить size `xl` (h-14, px-10, text-lg), variant `ghost-destructive` |
| Card | `shared/ui/card` | Добавить variant `elevated` (shadow-level-3), `interactive` (hover-scale) |
| Badge | `shared/ui/badge` | Добавить variant `success` (sage), `warning` (gold), `error` (wine) |
| Modal | `shared/ui/modal` | Добавить size `xl` (max-w-5xl), анимация slide-up |
| Input | `shared/ui/input` | Добавить state `error` (wine border), `success` (sage border) |

#### Новые компоненты

| Компонент | Описание | Приоритет |
|-----------|----------|-----------|
| `DataTable` | Таблица с сортировкой, фильтрами, пагинацией, bulk-select | P0 |
| `Toast` | Уведомления (success/error/info) — уже есть Provider, нужен UI | P0 |
| `Tabs` | Вертикальные/горизонтальные табы | P0 |
| `Dropdown` | Выпадающее меню (actions, filters) | P0 |
| `Pagination` | Навигация по страницам | P0 |
| `FileUpload` | Drag & drop загрузка файлов | P0 |
| `SearchInput` | Поиск с debounce и иконкой | P1 |
| `DateRangePicker` | Выбор диапазона дат | P1 |
| `ColorPicker` | Выбор цвета (для редактора) | P1 |
| `DragList` | Drag & drop список (для блоков редактора) | P1 |
| `StatCard` | Карточка статистики (число + label + trend) | P1 |
| `EmptyState` | Пустое состояние с иллюстрацией | P1 |
| `Stepper` | Пошаговый процесс (импорт, настройка) | P2 |
| `Tooltip` | Подсказки | P2 |
| `ContextMenu` | Контекстное меню (right-click) | P2 |

### 3.3. Layout-система

#### Dashboard Layout

```
┌─────────────────────────────────────────────────────┐
│ Navbar (sticky, glass-light, h-16)                  │
├──────────┬──────────────────────────────────────────┤
│          │                                          │
│ Sidebar  │         Content Area                     │
│ (240px)  │         (flex-1, max-w-7xl, mx-auto)    │
│          │                                          │
│ ┌──────┐ │  ┌────────────────────────────────────┐  │
│ │ Nav  │ │  │ Page Header (title + actions)      │  │
│ │ Items│ │  ├────────────────────────────────────┤  │
│ │      │ │  │                                    │  │
│ │      │ │  │ Page Content                       │  │
│ │      │ │  │                                    │  │
│ └──────┘ │  └────────────────────────────────────┘  │
├──────────┴──────────────────────────────────────────┤
│ (нет footer в dashboard)                            │
└─────────────────────────────────────────────────────┘
```

**Sidebar-навигация (Dashboard):**

| Группа | Элементы | Иконка |
|--------|----------|--------|
| Основное | Dashboard, Мероприятия | LayoutDashboard, Calendar |
| Работа | Гости, Медиа | Users, Image |
| Шаблоны | Каталог, Импорт | Sparkles, Upload |
| Рассылки | WhatsApp, Telegram, Email | MessageCircle, Send |
| Система | Настройки, Админ (если admin) | Settings, Shield |

#### Public Layout

```
┌─────────────────────────────────────────────────────┐
│ Navbar (sticky, glass-light, h-16)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│         Content Area (max-w-7xl, mx-auto)           │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Footer (dark ink bg, grid 4-col)                    │
└─────────────────────────────────────────────────────┘
```

#### Invitation Page Layout (Public `/i/[slug]`)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│     Full-screen invitation (min-h-screen)           │
│     Background: template canvas_json                │
│                                                     │
│     ┌───────────────────────────────────────────┐   │
│     │                                           │   │
│     │     Canvas blocks (text, image, etc.)     │   │
│     │     Rendered from template + user data    │   │
│     │                                           │   │
│     └───────────────────────────────────────────┘   │
│                                                     │
│     ┌───────────────────────────────────────────┐   │
│     │  RSVP Section (if enabled)                │   │
│     │  [Да] [Нет] [Может быть]                  │   │
│     └───────────────────────────────────────────┘   │
│                                                     │
│     ┌───────────────────────────────────────────┐   │
│     │  Ad Banner (if app_settings.ads_enabled)  │   │
│     │  Powered by Тойға                         │   │
│     └───────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Guest CRM — архитектура

### 4.1. Концепция

Guest CRM — это система управления гостями мероприятия с поддержкой:

- Семей/пар (group_key)
- Мультиканальной связи (WA/TG/Email)
- Индивидуальных сообщений
- Трекинга статусов отправки
- RSVP-управления
- Массовых операций

### 4.2. Модель данных Guest (расширенная)

```
┌─────────────────────────────────────────────────────────┐
│ GUEST                                                    │
├─────────────────────────────────────────────────────────┤
│ id: UUID (PK)                                           │
│ event_id: UUID (FK → events)                            │
│                                                         │
│ -- Основная информация                                   │
│ name: VARCHAR(255) NOT NULL                             │
│ phone: VARCHAR(20)           -- WhatsApp номер           │
│ email: VARCHAR(255)          -- Email адрес              │
│                                                         │
│ -- Социальные                                            │
│ telegram_username: VARCHAR(255)  -- @username            │
│                                                         │
│ -- Семья/пара                                            │
│ group_key: VARCHAR(100)       -- ключ группы (семья/пара)│
│ group_role: VARCHAR(20)       -- primary/secondary       │
│ partner_guest_id: UUID (FK)   -- ссылка на пару          │
│                                                         │
│ -- Персональные данные                                   │
│ personal_slug: VARCHAR(255) UNIQUE -- персональная ссылка│
│ custom_message: TEXT          -- персональное сообщение  │
│                                                         │
│ -- RSVP                                                  │
│ rsvp_status: VARCHAR(20)     -- pending/confirmed/...    │
│ rsvp_comment: TEXT           -- комментарий RSVP         │
│ rsvp_answered_at: TIMESTAMP  -- когда ответил            │
│                                                         │
│ -- Отправка (мультиканал)                                │
│ whatsapp_status: VARCHAR(20) -- pending/sent/delivered/..│
│ whatsapp_sent_at: TIMESTAMP                                │
│ whatsapp_error: TEXT                                       │
│ telegram_status: VARCHAR(20)                              │
│ telegram_sent_at: TIMESTAMP                               │
│ telegram_error: TEXT                                       │
│ email_status: VARCHAR(20)                                 │
│ email_sent_at: TIMESTAMP                                  │
│ email_error: TEXT                                         │
│                                                         │
│ -- Системные                                             │
│ status: VARCHAR(20) NOT NULL  -- pending/invited/...     │
│ sort_order: INTEGER                                        │
│ created_at: TIMESTAMP                                     │
│ updated_at: TIMESTAMP                                     │
│ deleted_at: TIMESTAMP                                     │
└─────────────────────────────────────────────────────────┘
```

### 4.3. Модель Group (группы гостей)

Группы — способ объединить гостей в семью/пару:

```typescript
interface GuestGroup {
  key: string;          // уникальный ключ группы
  eventId: string;      // ID мероприятия
  label: string;        // отображаемое имя ("Семья Азамата")
  guests: Guest[];      // участники группы
  primaryGuest: Guest;  // основной гость (получает ссылку)
}
```

**Правила групп:**
1. Группа определяется `group_key` — одинаковый `group_key` у всех участников
2. Один `group_role = primary` — основной гость, получает персональную ссылку
3. Остальные `group_role = secondary` — отображаются как "+N гостей"
4. Группа может быть: семья (2+ человек), пара (2 человека), один гость (без группы)

### 4.4. Guest CRM — UI-интерфейс

#### Страница: `/dashboard/guests?event=[eventId]`

```
┌─────────────────────────────────────────────────────────────┐
│ Guest CRM                                    [Импорт Excel] │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🔍 Поиск...     [Статус ▼] [Канал ▼] [Группы ▼]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌────┬──────────┬──────────┬──────┬────────┬──────┬──────┐ │
│ │ ☐  │ Имя      │ Телефон  │ WA   │ TG     │ Email│ RSVP │ │
│ ├────┼──────────┼──────────┼──────┼────────┼──────┼──────┤ │
│ │ ☐  │ Азамат   │+7900...  │ ✅ ✅│ —      │ ✅   │ Да   │ │
│ │    │ Семья: 3 │          │ Sent │        │ Sent │      │ │
│ │ ☐  │ Айгуль   │+7900...  │ ✅ ❌│ —      │ ✅   │ Да   │ │
│ │    │ (пара)   │          │ Err  │        │ Sent │      │ │
│ │ ☐  │ Бакыт    │ —        │ —    │@bakyt  │ ✅   │ Нет  │ │
│ │    │          │          │      │ Sent   │ Sent │      │ │
│ └────┴──────────┴──────────┴──────┴────────┴──────┴──────┘ │
│                                                             │
│ Выбрано: 2                    [Отправить] [Изменить] [Удалить]│
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ Итого: 150 гостей | Подтверждено: 89 (59%) | Отклонено: 12  │
│ Ожидание: 49 | Просмотрено: 22 | Не отправлено: 18          │
└─────────────────────────────────────────────────────────────┘
```

#### Колонки DataTable (динамические)

| Колонка | Видимость | Описание |
|---------|-----------|----------|
| ☐ (checkbox) | Всегда | Bulk select |
| Имя | Всегда | Имя + группа (badge "Семья: 3") |
| Телефон | Всегда | Номер телефона |
| WhatsApp | При включении WA | Статус иконкой: pending/sent/delivered/error |
| Telegram | При включении TG | Статус иконкой: pending/sent/error |
| Email | При включении Email | Статус иконкой: pending/sent/delivered/error |
| RSVP | Всегда | Badge: Да/Нет/Может/Ожидание |
| Персональная ссылка | Всегда | Копировать / QR |
| Действия | Всегда | Edit / Delete / Send |

**Динамические колонки:** При включении каналов отправки (WhatsApp/Telegram/Email) в `app_settings` — соответствующие колонки автоматически появляются в таблице.

#### Модальное окно: Добавление гостя

```
┌──────────────────────────────────────────┐
│ Добавить гостя                     [×]   │
├──────────────────────────────────────────┤
│                                          │
│ Имя *                                    │
│ ┌──────────────────────────────────────┐ │
│ │ Азамат                               │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Телефон (WhatsApp)                       │
│ ┌──────────────────────────────────────┐ │
│ │ +7 900 123 45 67                     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Email                                    │
│ ┌──────────────────────────────────────┐ │
│ │ azamat@mail.kz                       │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Telegram @username                       │
│ ┌──────────────────────────────────────┐ │
│ │ @azamat                              │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Группа                                   │
│ ┌──────────────────────────────────────┐ │
│ │ ▼ Новая группа                      │ │
│ │   Семья Азамата (3 чел.)            │ │
│ │   Пары (2 чел.)                     │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Персональное сообщение                   │
│ ┌──────────────────────────────────────┐ │
│ │ Ждём вас на нашем торжестве!         │ │
│ └──────────────────────────────────────┘ │
│                                          │
│         [Отмена]  [Добавить]             │
└──────────────────────────────────────────┘
```

---

## 5. Динамический Excel импорт/экспорт гостей

### 5.1. Концепция

Формат Excel-файла **динамически** меняется в зависимости от включённых каналов отправки в `app_settings`:

| Канал | Доп. колонки в Excel |
|-------|---------------------|
| WhatsApp | `Телефон (WA)` |
| Telegram | `Telegram @username` |
| Email | `Email` |
| Все выключены | Только `Имя` + `Сообщение` |

### 5.2. Формат Excel-файла

#### Минимальный (все каналы выключены)

| A: Имя* | B: Сообщение |
|---------|-------------|
| Азамат | Ждём вас! |
| Айгуль | |

#### С WhatsApp

| A: Имя* | B: Телефон (WA)* | C: Сообщение |
|---------|-----------------|-------------|
| Азамат | +79001234567 | Ждём вас! |
| Айгуль | +79001234568 | |

#### С WhatsApp + Email

| A: Имя* | B: Телефон (WA)* | C: Email | D: Сообщение |
|---------|-----------------|----------|-------------|
| Азамат | +79001234567 | azamat@mail.kz | Ждём вас! |

#### Все каналы

| A: Имя* | B: Телефон (WA)* | C: Telegram | D: Email | E: Сообщение |
|---------|-----------------|-------------|----------|-------------|
| Азамат | +79001234567 | @azamat | azamat@mail.kz | Ждём вас! |

**\* — обязательное поле**

### 5.3. Алгоритм импорта

```
1. Получить app_settings → определить активные каналы
2. Сформировать шаблон Excel (заголовки колонок)
3. Парсинг загруженного файла:
   a. Определить заголовки (по названиям колонок)
   b. Валидация обязательных полей (Имя + активные каналы)
   c. Нормализация данных:
      - Телефон:去除 пробелов, формат +7XXXXXXXXXX
      - Email: toLowerCase, trim
      - Telegram: добавить @ если нет
   d. Проверка дубликатов (по телефону/email внутри файла)
4. Сравнение с существующими гостями мероприятия:
   - Дубликаты → пропуск с предупреждением
   - Новые → добавление
5. Bulk insert
6. Возврат результата: { imported, skipped, errors[] }
```

### 5.4. Экспорт в Excel

Экспорт содержит **все** колонки независимо от настроек:

| A: Имя | B: Телефон | C: Email | D: Telegram | E: WhatsApp статус | F: TG статус | G: Email статус | H: RSVP | I: Группа | J: Сообщение |
|--------|-----------|----------|-------------|-------------------|--------------|-----------------|---------|-----------|-------------|

### 5.5. API

```
GET  /api/v1/guests/template-excel?eventId=xxx
     → Возвращает Excel-шаблон для загрузки

POST /api/v1/guests/import-excel
     Content-Type: multipart/form-data
     Body: file, eventId
     → { imported: 45, skipped: 3, errors: [...] }

GET  /api/v1/guests/export-excel?eventId=xxx
     → Возвращает Excel-файл со всеми гостями
```

---

## 6. Template Cloning — система клонирования шаблонов

### 6.1. Проблема

Пользователи **не должны** редактировать оригинальные шаблоны. Каждый пользователь получает **собственную копию** шаблона, привязанную к его мероприятию.

### 6.2. Модель данных

#### Расширение таблицы `templates`

```sql
ALTER TABLE templates ADD COLUMN original_template_id UUID REFERENCES templates(id);
ALTER TABLE templates ADD COLUMN cloned_by UUID REFERENCES users(id);
ALTER TABLE templates ADD COLUMN source VARCHAR(20) DEFAULT 'original'
    CHECK (source IN ('original', 'cloned', 'imported'));
```

#### Расширение таблицы `events`

```sql
-- events уже имеет template_id — это ID копии шаблона
-- При создании события из шаблона:
-- 1. Копировать template → новая запись (source='cloned')
-- 2. Копировать template_assets → новые записи
-- 3. Создать event с template_id = ID копии
-- 4. Создать event_contents с canvas_json из копии
```

### 6.3. Алгоритм клонирования

```
FUNCTION cloneTemplate(templateId, userId):
  1. Найти оригинальный шаблон
  2. Создать копию шаблона:
     - name: original.name + " (копия)"
     - slug: nanoid(10)
     - source: 'cloned'
     - original_template_id: original.id
     - cloned_by: userId
     - canvas_json: deep_copy(original.canvas_json)
     - animation_config: deep_copy(original.animation_config)
     - design_tokens: deep_copy(original.design_tokens)
     - is_premium: false (копия всегда бесплатная)
     - status: 'published'
  3. Скопировать все template_assets:
     - url: тот же (ссылка на файл)
     - metadata: deep_copy
  4. Вернуть новый template
```

### 6.4. Сценарии использования

| Сценарий | Действие |
|----------|----------|
| Пользователь выбирает бесплатный шаблон | cloneTemplate → createEvent(clonedId) |
| Пользователь покупает премиум шаблон | cloneTemplate → createEvent(clonedId) |
| Пользователь редактирует приглашение | Работает с cloned template, оригинал не тронут |
| Админ обновляет оригинал | Копии пользователей НЕ обновляются |
| Пользователь хочет другой шаблон | Новый cloneTemplate → updateEvent(newClonedId) |

### 6.5. Marketplace-модель

```
┌─────────────────────────────────────────────────────────────┐
│ Template Marketplace                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│ │ Preview │ │ Preview │ │ Preview │ │ Preview │           │
│ │ Template│ │ Template│ │ Template│ │ Template│           │
│ │         │ │         │ │         │ │         │           │
│ │ ☆ 4.8   │ │ ☆ 4.9   │ │ ☆ 4.7   │ │ ☆ 4.6   │           │
│ │ Бесплатн│ │ 4,900₸ │ │ Бесплатн│ │ 2,900₸ │           │
│ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│      │           │           │           │                  │
│  [Выбрать]  [Купить]    [Выбрать]  [Купить]               │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│                                                             │
│ Фильтры: [Все] [Свадьба] [Кыз узату] [Туған күн] ...    │
│ Сортировка: [Популярные] [Новые] [Цена ↑] [Рейтинг]      │
└─────────────────────────────────────────────────────────────┘
```

#### Pricing-модель

| Тип | Цена | Описание |
|-----|------|----------|
| Free | 0₸ | Базовые шаблоны |
| Premium | 2,900-9,900₸ | Расширенные шаблоны |
| Business | 14,900₸/мес | Без ограничений |

---

## 7. Dynamic OG-Image генерация

### 7.1. Концепция

Каждая страница приглашения (`/i/[slug]`) генерирует уникальное OG-изображение для шаринга в соцсетях.

### 7.2. Данные для OG

```typescript
interface OgData {
  title: string;           // название мероприятия
  date: string;            // дата в формате "15 августа 2026"
  eventType: string;       // тип мероприятия
  organizerName: string;   // имя организатора
  location: string;        // место проведения
  background: string;      // фоновый цвет из шаблона
  accentColor: string;     // акцентный цвет из шаблона
}
```

### 7.3. Реализация (Next.js ImageResponse)

```typescript
// frontend/app/api/og/route.ts

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  return new ImageResponse(
    <div style={{
      width: 1200, height: 630,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: `linear-gradient(135deg, ${bg} 0%, ${accent} 100%)`,
      fontFamily: 'serif', padding: 60,
    }}>
      {/* Decorative line */}
      <div style={{ width: 80, height: 4, backgroundColor: '#B8902E', borderRadius: 2, marginBottom: 30 }} />
      {/* Title */}
      <h1 style={{ fontSize: 64, fontWeight: 'bold', textAlign: 'center', margin: 0, color: '#F4ECD8' }}>
        {title}
      </h1>
      {/* Date */}
      <p style={{ fontSize: 28, color: '#B8902E', marginTop: 20, letterSpacing: '0.1em' }}>{date}</p>
      {/* Branding */}
      <div style={{ position: 'absolute', bottom: 40, color: '#9C9280', fontSize: 18 }}>
        Тойға • Цифровые приглашения
      </div>
    </div>,
    { width: 1200, height: 630 }
  );
}
```

### 7.4. Meta-теги

```tsx
// frontend/app/i/[slug]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  const ogUrl = `${APP_URL}/api/og?title=${encodeURIComponent(event.title)}&date=${formatDate(event.eventDate)}&type=${event.eventType}`;

  return {
    title: `${event.title} | Тойға`,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [ogUrl],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  };
}
```

### 7.5. Стили по типам мероприятия

| Тип | Фон | Акцент |
|-----|-----|--------|
| wedding | `#15110D` | `#B8902E` |
| kyz-uzatu | `#15110D` | `#5C1A24` |
| sundet | `#15110D` | `#26424A` |
| birthday | `#26424A` | `#B8902E` |
| anniversary | `#5C1A24` | `#B8902E` |
| corporate | `#15110D` | `#26424A` |
| baby-shower | `#F4ECD8` | `#B8902E` |

---

## 8. Рекламные блоки через AppSettings

### 8.1. Концепция

На странице приглашения (`/i/[slug]`) внизу отображается рекламный блок, управляемый через `app_settings`.

### 8.2. Настройки рекламы

```sql
-- app_settings
('ads_enabled', 'true', 'ads')
('ads_banner_html', '<div>...</div>', 'ads')
('ads_banner_url', 'https://example.com', 'ads')
('ads_image_url', '/images/ads/banner.png', 'ads')
('ads_height', '90', 'ads')
('ads_position', 'bottom', 'ads')  -- top | bottom | both
```

### 8.3. UI-компонент

```tsx
// widgets/ad-banner/index.tsx

interface AdBannerProps {
  position: 'top' | 'bottom';
  eventId: string;
}

export function AdBanner({ position, eventId }: AdBannerProps) {
  // Получить настройки из app_settings (SSR)
  const settings = await getAppSettings('ads');

  if (!settings.ads_enabled) return null;

  return (
    <div className="w-full border-t border-[var(--color-gold-12)] bg-[var(--color-parchment-4)] py-4">
      <div className="mx-auto max-w-7xl px-4">
        <a href={settings.ads_banner_url} target="_blank" rel="noopener noreferrer">
          <img
            src={settings.ads_image_url}
            alt="Реклама"
            className="mx-auto rounded-lg"
            style={{ maxHeight: settings.ads_height }}
          />
        </a>
      </div>
    </div>
  );
}
```

### 8.4. Админ-панель рекламы

Настройки в `/admin/settings` → вкладка "Реклама":

| Поле | Тип | Описание |
|------|-----|----------|
| Включена | Toggle | Глобальный toggle рекламы |
| Banner HTML | Textarea | Кастомный HTML баннера |
| Изображение | File upload | Картинка баннера |
| Ссылка | URL | Куда ведёт баннер |
| Высота | Number (px) | Высота баннера |
| Позиция | Select (top/bottom/both) | Где показывать |

---

## 9. Импорт шаблонов JSON/HTML

### 9.1. JSON-формат

```json
{
  "template": {
    "name": "Золотая свадьба",
    "description": "Элегантный шаблон",
    "categoryId": "uuid",
    "isPremium": false,
    "canvasJson": {
      "width": 1080,
      "height": 1920,
      "background": "#F4ECD8",
      "blocks": [
        {
          "id": "block-1",
          "type": "text",
          "content": "Той шақыру",
          "x": 100, "y": 400,
          "width": 880, "height": 120,
          "rotation": 0, "opacity": 1,
          "locked": false, "visible": true,
          "style": {
            "fontFamily": "Yeseva One",
            "fontSize": 72,
            "color": "#B8902E",
            "textAlign": "center"
          }
        },
        {
          "id": "block-2",
          "type": "image",
          "src": "https://...",
          "x": 0, "y": 0,
          "width": 1080, "height": 600,
          "rotation": 0, "opacity": 0.15,
          "style": {}
        }
      ]
    },
    "animationConfig": {
      "global": { "duration": 5000, "easing": "ease-in-out" },
      "timeline": [
        { "blockId": "block-1", "type": "fade", "delay": 300, "duration": 800 },
        { "blockId": "block-2", "type": "slide", "direction": "top", "distance": 50, "delay": 0, "duration": 1000 }
      ]
    },
    "designTokens": {
      "colors": { "primary": "#B8902E", "secondary": "#F4ECD8" },
      "fonts": { "heading": "Yeseva One", "body": "Golos Text" }
    },
    "assets": [
      { "type": "image", "url": "https://...", "name": "pattern.png" },
      { "type": "font", "url": "https://...", "name": "Yeseva One" }
    ]
  }
}
```

### 9.2. HTML-конвертер

**Вход:** HTML-файл с inline-стилями или `<style>` блоком.

**Алгоритм:**

```
1. Парсинг HTML (cheerio/jsdom)
2. Извлечение <style> CSS
3. Обход DOM-элементов:
   a. Каждый элемент → CanvasBlock
   b. inline-стили → BlockStyle
   c. Позиционирование: absolute → x,y; relative → автовычисление
   d. Размеры: width/height → canvas-координаты
4. Группировка: parent → container block
5. Формирование canvas_json
6. Автоматические анимации: fade-in для всех блоков
```

### 9.3. ZIP-импорт

```
archive.zip
├── index.html          -- основной HTML
├── assets/
│   ├── pattern.png     -- изображения
│   ├── flowers.jpg
│   └── fonts/
│       └── custom.woff2
└── manifest.json       -- опциональная мета-информация
```

### 9.4. API

```
POST /api/v1/templates/import
Content-Type: multipart/form-data
Body: { file: File, format: "json" | "html" | "zip" }

Response: {
  templateId: "uuid",
  name: "Imported Template",
  warnings: ["Шрифт 'Custom' заменён на 'Inter'"],
  blocksCount: 12
}
```

---

## 10. Invitation Editor — архитектура редактора

### 10.1. Архитектура

```
┌──────────────────────────────────────────────────────────────┐
│ Invitation Editor                                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ┌──────┐ ┌────────────────────────────────┐ ┌────────────┐  │
│ │      │ │                                │ │            │  │
│ │ Tool │ │         Canvas                 │ │ Properties │  │
│ │ bar  │ │         (preview)              │ │   Panel    │  │
│ │      │ │                                │ │            │  │
│ │ [T]  │ │  ┌──────────────────────────┐  │ │ Position   │  │
│ │ [🖼] │ │  │                          │  │ │ Size       │  │
│ │ [QR] │ │  │    Invitation Preview    │  │ │ Style      │  │
│ │ [⏰] │ │  │                          │  │ │ Content    │  │
│ │ [📍] │ │  │    1080 x 1920           │  │ │ Animation  │  │
│ │ [📋] │ │  │                          │  │ │            │  │
│ │ [─]  │ │  └──────────────────────────┘  │ │            │  │
│ │ [ ]  │ │                                │ │            │  │
│ │      │ └────────────────────────────────┘ │            │  │
│ └──────┘                                    └────────────┘  │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Layers Panel (collapsible)                               │ │
│ │ [block-1] Текст: "Той шақыру"           [👁] [🔒] [×]  │ │
│ │ [block-2] Изображение: pattern.png       [👁] [🔒] [×]  │ │
│ │ [block-3] QR-код                        [👁] [🔒] [×]  │ │
│ └──────────────────────────────────────────────────────────┘ │
│                                                              │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Toolbar: [↩ Undo] [↪ Redo] [💾 Save] [👁 Preview] [🚀 Publish]│
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 10.2. Типы блоков

| Тип | Иконка | Описание | Доступные стили |
|-----|--------|----------|-----------------|
| `text` | Type | Текстовый блок | fontSize, fontFamily, fontWeight, color, textAlign, lineHeight |
| `image` | Image | Изображение | borderRadius, objectFit, opacity |
| `qr` | QrCode | QR-код со ссылкой | size, color, bgColor, logoUrl |
| `countdown` | Clock | Таймер обратного отсчёта | format, fontSize, color |
| `map` | Map | Карта (location) | zoom, markerColor |
| `schedule` | List | Программа мероприятия | layout, timeColor, titleColor |
| `divider` | Minus | Разделитель | color, thickness, style (solid/dashed/dotted) |
| `spacer` | | Отступ | height |

### 10.3. Состояние редактора

```typescript
interface EditorState {
  // Canvas
  blocks: CanvasBlock[];
  selectedBlockId: string | null;
  background: string;
  zoom: number;           // 0.25 - 2.0
  panOffset: { x: number; y: number };

  // History
  undoStack: CanvasBlock[][];
  redoStack: CanvasBlock[][];

  // Mode
  mode: 'select' | 'preview' | 'text-edit';

  // Autosave
  lastSavedAt: Date | null;
  isDirty: boolean;
  isSaving: boolean;
}
```

### 10.4. API-взаимодействие

```
POST /api/v1/events/:id/autosave
Body: {
  canvasJson: { width, height, background, blocks },
  contentJson: { coupleNames, eventDate, venue, ... }
}

POST /api/v1/events/:id/publish
Body: {}

POST /api/v1/events/:id/versions
Body: { snapshotJson: {...} }

GET  /api/v1/events/:id/versions
Response: [{ id, versionNumber, createdAt }]
```

### 10.5. Autosave

- Интервал: 3000ms после последнего изменения
- Debounce: 1000ms
- При уходе со страницы: сохранить немедленно
- Индикатор: "Сохранено" / "Сохраняется..." / "Есть несохранённые изменения"

---

## 11. Новые таблицы БД

### 11.1. dictionary

```sql
CREATE TABLE dictionary (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category    VARCHAR(100) NOT NULL,
    key         VARCHAR(255) NOT NULL,
    value       JSONB NOT NULL,
    label       VARCHAR(255),
    label_ru    VARCHAR(255),
    label_en    VARCHAR(255),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_dict_category_key UNIQUE (category, key)
);
```

**Категории:**

| Категория | Ключи | Описание |
|-----------|-------|----------|
| `event_type` | wedding, kyz-uzatu, sundet, birthday, anniversary, corporate, baby-shower, other | Типы мероприятий |
| `guest_status` | pending, invited, viewed, confirmed, declined, maybe | Статусы гостей |
| `guest_relation` | spouse, parent, child, sibling, friend, colleague, other | Родственные связи |
| `notification_channel` | whatsapp, telegram, email | Каналы отправки |
| `subscription_plan` | free, premium, business | Тарифные планы |
| `rsvp_answer` | yes, no, maybe | Ответы RSVP |
| `template_style` | classic, modern, traditional | Стили шаблонов |

### 11.2. app_settings

```sql
CREATE TABLE app_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(255) NOT NULL UNIQUE,
    value       JSONB NOT NULL,
    category    VARCHAR(100) NOT NULL DEFAULT 'general',
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

**Настройки:**

| Ключ | Категория | Значение |
|------|-----------|----------|
| `app_name` | general | `"Тойға"` |
| `whatsapp_enabled` | notifications | `true` |
| `telegram_bot_token` | notifications | `""` |
| `telegram_enabled` | notifications | `false` |
| `email_smtp_host` | notifications | `""` |
| `email_enabled` | notifications | `false` |
| `ads_enabled` | ads | `false` |
| `ads_image_url` | ads | `""` |
| `ads_banner_url` | ads | `""` |
| `ads_height` | ads | `90` |
| `max_events_free` | limits | `3` |
| `max_guests_free` | limits | `50` |

### 11.3. notification_templates

```sql
CREATE TABLE notification_templates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    channel     VARCHAR(20) NOT NULL CHECK (channel IN ('whatsapp', 'telegram', 'email')),
    subject     VARCHAR(500),
    body        TEXT NOT NULL,
    html_body   TEXT,
    variables   JSONB DEFAULT '[]'::jsonb,
    is_default  BOOLEAN NOT NULL DEFAULT false,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    event_type  VARCHAR(50),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);
```

### 11.4. notification_queue

```sql
CREATE TABLE notification_queue (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id        UUID REFERENCES guests(id) ON DELETE SET NULL,
    channel         VARCHAR(20) NOT NULL,
    recipient       VARCHAR(500) NOT NULL,
    subject         VARCHAR(500),
    message         TEXT NOT NULL,
    html_message    TEXT,
    media_urls      JSONB DEFAULT '[]'::jsonb,
    template_id     UUID REFERENCES notification_templates(id),
    template_vars   JSONB DEFAULT '{}'::jsonb,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'sent', 'delivered', 'failed', 'cancelled')),
    scheduled_at    TIMESTAMP WITH TIME ZONE,
    sent_at         TIMESTAMP WITH TIME ZONE,
    delivered_at    TIMESTAMP WITH TIME ZONE,
    failed_at       TIMESTAMP WITH TIME ZONE,
    attempts        INTEGER NOT NULL DEFAULT 0,
    max_attempts    INTEGER NOT NULL DEFAULT 3,
    error_message   TEXT,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

### 11.5. Изменения в существующих таблицах

```sql
-- templates: добавить поддержку клонирования
ALTER TABLE templates ADD COLUMN original_template_id UUID REFERENCES templates(id);
ALTER TABLE templates ADD COLUMN cloned_by UUID REFERENCES users(id);
ALTER TABLE templates ADD COLUMN source VARCHAR(20) DEFAULT 'original'
    CHECK (source IN ('original', 'cloned', 'imported'));
ALTER TABLE templates ADD COLUMN price_kzt INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN download_count INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN rating_avg DECIMAL(3,2) DEFAULT 0;
ALTER TABLE templates ADD COLUMN rating_count INTEGER DEFAULT 0;

-- guests: расширить поддержку мультиканала и семей
ALTER TABLE guests ADD COLUMN telegram_username VARCHAR(255);
ALTER TABLE guests ADD COLUMN group_key VARCHAR(100);
ALTER TABLE guests ADD COLUMN group_role VARCHAR(20) DEFAULT 'primary'
    CHECK (group_role IN ('primary', 'secondary'));
ALTER TABLE guests ADD COLUMN partner_guest_id UUID REFERENCES guests(id);
ALTER TABLE guests ADD COLUMN whatsapp_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE guests ADD COLUMN whatsapp_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN whatsapp_error TEXT;
ALTER TABLE guests ADD COLUMN telegram_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE guests ADD COLUMN telegram_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN telegram_error TEXT;
ALTER TABLE guests ADD COLUMN email_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE guests ADD COLUMN email_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN email_error TEXT;
ALTER TABLE guests ADD COLUMN rsvp_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE guests ADD COLUMN rsvp_comment TEXT;
ALTER TABLE guests ADD COLUMN rsvp_answered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN sort_order INTEGER DEFAULT 0;
```

---

## 12. Новые API-эндпоинты

### 12.1. Dictionary

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/v1/dictionary?category=xxx` | Public | Список записей |
| GET | `/api/v1/dictionary/:id` | Public | Запись по ID |
| POST | `/api/v1/dictionary` | Admin | Создать |
| PUT | `/api/v1/dictionary/:id` | Admin | Обновить |
| DELETE | `/api/v1/dictionary/:id` | Admin | Удалить |

### 12.2. App Settings

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/v1/settings?category=xxx` | Public/Admin | Настройки |
| PUT | `/api/v1/settings/:key` | Admin | Обновить |
| PUT | `/api/v1/settings/bulk` | Admin | Массовое обновление |

### 12.3. Notifications

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/api/v1/notifications/send` | Auth | Отправить сообщение |
| POST | `/api/v1/notifications/broadcast` | Auth | Массовая рассылка |
| GET | `/api/v1/notifications/event/:eventId` | Auth | Сообщения мероприятия |
| POST | `/api/v1/notifications/:id/cancel` | Auth | Отменить |
| GET | `/api/v1/notifications/stats/:eventId` | Auth | Статистика |

### 12.4. Notification Templates

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/v1/notification-templates` | Auth | Список |
| POST | `/api/v1/notification-templates` | Admin | Создать |
| PUT | `/api/v1/notification-templates/:id` | Admin | Обновить |
| DELETE | `/api/v1/notification-templates/:id` | Admin | Удалить |

### 12.5. Template Import/Export

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| POST | `/api/v1/templates/import` | Admin | Импорт (JSON/HTML/ZIP) |
| GET | `/api/v1/templates/:id/export` | Admin | Экспорт JSON |
| POST | `/api/v1/templates/:id/clone` | Auth | Клонировать шаблон |

### 12.6. Guest Import/Export

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/v1/guests/template-excel?eventId=xxx` | Auth | Скачать шаблон Excel |
| POST | `/api/v1/guests/import-excel` | Auth | Импорт Excel |
| GET | `/api/v1/guests/export-excel?eventId=xxx` | Auth | Экспорт Excel |

### 12.7. OG Image

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| GET | `/api/og?title=xxx&date=xxx&type=xxx` | Public | OG-image генерация |

---

## Дорожная карта по этапам

| Этап | Описание | Статус |
|------|----------|--------|
| **1** | Документация (этот файл) | ✅ Выполнено |
| **2** | Prisma schema + миграции (dictionary, app_settings, расширение guests, templates) | ⏳ Ожидание |
| **3** | Backend API (Dictionary, AppSettings CRUD + Swagger) | ⏳ Ожидание |
| **4** | Template Marketplace (категории, цены, клонирование) | ⏳ Ожидание |
| **5** | Guest CRM (таблица, Excel импорт/экспорт, динамические колонки) | ⏳ Ожидание |
| **6** | Auto-send System (WhatsApp/Telegram/Email, очередь, статусы) | ⏳ Ожидание |
| **7** | Public Invitation (рендер, QR, OG-image, рекламные блоки) | ⏳ Ожидание |
| **8** | Template Import (JSON/HTML парсинг, Admin Panel) | ⏳ Ожидание |
