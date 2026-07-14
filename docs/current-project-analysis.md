# Анализ текущего проекта Toyga.kz

> Дата анализа: 2026-07-13
> Цель: зафиксировать что было, что можно переиспользовать, что устарело, какие зависимости были

---

## 1. Общее описание проекта

**Toyga.kz** — казахстанская платформа для создания онлайн-приглашений на той (свадьбы, кыз узату, сүндет той, бесік той и др.).

**Стек:**
- **Frontend:** React 19 + TypeScript + Vite 8 + TailwindCSS 3
- **Backend:** Vercel Serverless Functions (api/*)
- **Database:** PostgreSQL (Neon)
- **Языки интерфейса:** казахский (kk), русский (ru), английский (en)
- **Деплой:** Vercel
- **Доп. сервис:** WhatsApp Gateway (Baileys, Express, Docker)

---

## 2. Структура старого проекта

```
toyga/
├── api/                    # Vercel serverless API handlers
│   ├── _core/              # Инфраструктура API (db, env, errors, http, middleware)
│   ├── admin/              # Админ-эндпоинты (login, me)
│   ├── auth/               # Авторизация пользователей (login, register, otp, google)
│   ├── categories/         # CRUD категорий
│   ├── guests/             # RSVP гостей
│   ├── invitations/        # CRUD приглашений
│   ├── media/              # Загрузка медиа
│   ├── orders/             # Заказы
│   ├── templates/          # CRUD шаблонов
│   ├── upload.googledrive.ts
│   ├── openapi.ts          # OpenAPI spec
│   └── swagger.ts          # Swagger UI
├── src/                    # React frontend
│   ├── components/
│   │   ├── feature/        # Navbar, Footer
│   │   └── ui/             # SpotlightCard
│   ├── core/               # Доменная логика (shared с api/)
│   │   ├── constants/      # Enum-ы, лимиты, шаблоны уведомлений
│   │   ├── factories.ts    # Manual DI (синглтоны репозиториев и сервисов)
│   │   ├── repositories/   # Интерфейсы + PostgreSQL реализации
│   │   ├── services/       # CategoryService, TemplateService, EventService и др.
│   │   └── validation/     # Zod-схемы (shared между api/ и src/)
│   ├── i18n/               # Локализация (kk, ru, en)
│   ├── lib/                # Утилиты (apiClient, auth, cn, qr)
│   ├── mocks/              # Моки для разработки
│   ├── pages/              # Страницы (home, admin, auth, invitation, blog, tandau, suret, musics, swagger)
│   ├── router/             # React Router конфиг
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css           # CSS-переменные (oklch цвета)
├── db/
│   ├── _legacy/            # Старая схема (schema.sql, seed.sql)
│   └── migrations/         # Миграция 0001_init.sql
├── services/
│   └── whatsapp-gateway/   # Express + Baileys WhatsApp бот
├── scripts/
│   └── migrate.ts          # Запуск миграций через jiti
├── public/                 # Статика (logo, openapi.json)
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
├── postcss.config.js
├── .env.example
└── .gitignore
```

---

## 3. База данных — схема

### Legacy (db/_legacy/schema.sql) — 6 таблиц:
| Таблица | Описание |
|---------|----------|
| categories | Категории той |
| templates | Шаблоны приглашений |
| template_media | Медиа-файлы шаблонов |
| invitations | Опубликованные приглашения |
| orders | Заказы через WhatsApp/Telegram |
| guests | RSVP гостей |
| admins | Админы |

### Текущая (db/migrations/0001_init.sql) — 18 таблиц:
| Таблица | Описание |
|---------|----------|
| users | Пользователи (password/OTP/Google auth) |
| otp_codes | Коды OTP |
| admins | Админы (с updated_at, deleted_at) |
| categories | Категории (multi-lang, icon_url, is_active) |
| templates | Шаблоны (code, content JSONB, design_tokens, is_premium) |
| template_assets | Аудио/видео/изображения шаблонов |
| events | Мероприятия пользователей (9 типов, link_mode, view_count) |
| event_addresses | Адреса мероприятий |
| event_invitations | Связь мероприятий с шаблонами, рендер-данные |
| event_media | Медиа мероприятий |
| guest_contacts | Контакты гостей (personal_slug, send_status, scheduled_at) |
| notification_jobs | Очередь уведомлений (WhatsApp) |
| surveys | RSVP ответы |
| survey_guests | Гости в рамках RSVP |
| orders | Заказы (с привязкой к user и event) |
| payment_settings | Настройки оплаты (manual/auto, Kaspi) |
| render_jobs | Очередь рендеринга видео |
| audit_logs | Аудит действий |

**Ключевые отличия v2 (0001_init.sql) от legacy:**
- `users` вместо отдельных таблиц авторизации
- `events` вместо `invitations` — более широкая модель
- `guest_contacts` вместо `guests` — с поддержкой рассылки
- `notification_jobs` — очередь отправки WhatsApp
- `render_jobs` — очередь рендеринга видео
- `payment_settings` — оплата через Kaspi
- `audit_logs` — аудит
- Триггеры `set_updated_at()` на всех таблицах

---

## 4. API — архитектура

### Инфраструктура (api/_core/):
- **db.ts** — PostgreSQL пул через `pg`, singleton для Vercel serverless, транзакции
- **env.ts** — Zod-валидация переменных окружения
- **http.ts** — `withHandler()` — обёртка: CORS, метод-фильтр, auth, rate limiting, error handling
- **errors.ts** — Иерархия ошибок: AppError → ValidationError, UnauthorizedError, NotFoundError и др.
- **types.ts** — RequestContext, AuthenticatedRequest, Handler, HandlerOptions
- **middleware/requireAuth.ts** — JWT-авторизация (user + admin), cookie + Bearer
- **middleware/requireAdmin.ts** — Проверка админ-роли
- **middleware/rateLimit.ts** — In-memory rate limiter (best effort для serverless)

### Эндпоинты:
| Путь | Методы | Описание |
|------|--------|----------|
| /api/admin/login | POST | Вход админа |
| /api/admin/me | GET, DELETE | Текущий админ / выход |
| /api/auth/login | POST | Вход пользователя |
| /api/auth/register | POST | Регистрация |
| /api/auth/otp-request | POST | Запрос OTP |
| /api/auth/otp-verify | POST | Верификация OTP |
| /api/auth/me | GET | Текущий пользователь |
| /api/auth/logout | POST | Выход |
| /api/categories | GET, POST, PUT | CRUD категорий |
| /api/templates | GET, POST | Список / создание шаблонов |
| /api/templates/[id] | GET, PUT | Шаблон по ID |
| /api/orders | GET, POST, PUT | Заказы |
| /api/guests/[invitationId] | GET, POST | RSVP гостей |
| /api/invitations/[slug] | GET | Публичное приглашение |

---

## 5. Frontend — архитектура

### Страницы:
| Маршрут | Страница | Описание |
|---------|----------|----------|
| / | Home | Главная с Hero, Categories, PhotoTemplates, BlogPreview |
| /tandau | Tandau | Каталог шаблонов |
| /suret | Suret | Фото-шаблоны |
| /blog | Blog | Блог |
| /blog/:slug | BlogDetail | Статья блога |
| /musics | Musics | Музыка |
| /i/:slug | InvitationPage | Публичное приглашение |
| /login, /register | UserAuthPage | Авторизация |
| /app/templates | AppTemplates | Личный кабинет — шаблоны |
| /admin/login | AdminLoginPage | Вход админа |
| /admin | AdminDashboardPage | Панель админа |
| /swagger | SwaggerPage | API документация |

### Ключевые компоненты:
- **Navbar.tsx, Footer.tsx** — навигация и подвал
- **SpotlightCard.tsx** — UI-компонент карточки
- **home/components/** — HeroSection, CategoriesSection, PhotoTemplatesSection, BlogPreviewSection

### Библиотеки:
- `react-router-dom` v7 — маршрутизация (lazy loading)
- `framer-motion` — анимации
- `react-helmet-async` — SEO meta-теги
- `recharts` — графики (админ-дашборд)
- `react-i18next` + `i18next` — локализация
- `zod` — валидация (shared между api/ и src/)
- `lucide-react` — иконки
- `class-variance-authority` + `tailwind-merge` — утилиты стилей
- `@radix-ui/react-slot` — композиция компонентов

### Дизайн-система:
- **Шрифты:** Cormorant Garamond (heading), Inter (body)
- **Цвета:** oklch с CSS-переменными — background, primary, accent, secondary, foreground (по 11 оттенков каждый)
- **TailwindCSS 3** с кастомными цветами через CSS-переменные

---

## 6. Сервисы

### WhatsApp Gateway (services/whatsapp-gateway/)
- **Стек:** Express + Baileys (WhatsApp Web API)
- **Описание:** Самостоятельный микросервис для отправки приглашений через WhatsApp
- **Depends on:** @whiskeysockets/baileys, express, cors, pino, qrcode
- **Деплой:** Docker (Dockerfile есть)
- **Статус:** Рабочий, но привязан к Baileys (ненадёжная библиотека, может ломаться)

---

## 7. Что можно переиспользовать

### Однозначно переиспользовать:
1. **База данных (0001_init.sql)** — полная, продуманная схема с 18 таблицами, триггерами и индексами
2. **API core (api/_core/)** — отличная инфраструктура:
   - `withHandler()` — обёртка с CORS, auth, rate limiting, error handling
   - JWT-авторизация (user + admin) с cookie
   - Zod-валидация env
   - Error hierarchy
   - PostgreSQL pool + транзакции
3. **Валидационные схемы (src/core/validation/)** — Zod-схемы для всех сущностей
4. **Константы и enum-ы (src/core/constants/)** — полный набор бизнес-enum-ов
5. **Доменные сервисы (src/core/services/)** — CategoryService, TemplateService, EventService, SurveyService, NotificationService
6. **Репозитории (src/core/repositories/)** — интерфейсы + PostgreSQL реализации
7. **i18n конфигурация** — настройка i18next с 3 языками
8. **Дизайн-система** — oklch цвета, шрифты, TailwindCSS конфиг

### Переиспользовать с доработкой:
1. **API handlers** — рабочие, но привязаны к Vercel serverless (нужно адаптировать под новый бэкенд)
2. **apiClient.ts** — клиент для API, можно обновить
3. **WhatsApp Gateway** — рабочий, но Baileys ненадёжен; стоит рассмотреть替代 решения
4. **Фронтенд-страницы** — HomePage, AdminDashboard, Auth — требуют переработки под новый дизайн

### Миграционные скрипты:
- `scripts/migrate.ts` — простой скрипт для запуска SQL-миграций
- `db/seed.sql` — данные для заполнения (legacy)

---

## 8. Что устарело / нужно заменить

| Компонент | Проблема | Рекомендация |
|-----------|----------|--------------|
| `api/_auth.ts` | Дублирует `_core/middleware/requireAuth.ts`, устаревший подход | Удалить, использовать _core |
| `db/_legacy/schema.sql` | Старая схема (6 таблиц), не совпадает с текущей | Удалить, использовать 0001_init.sql |
| TailwindCSS 3 | Устаревшая версия | Обновить до TailwindCSS 4 |
| Vite 8 | Нестабильная/новая версия | Использовать стабильную |
| Baileys (WhatsApp) | Ненадёжная библиотека, часто ломается | Рассмотреть WhatsApp Business API или alternatives |
| `@vercel/node` | Привязка к Vercel | Рассмотреть собственный сервер (Hono, Elysia) |
| `framer-motion` | Тяжёлый для простых анимаций | CSS-анимации или轻量 alternatives |
| `recharts` | Используется только в админке | Определиться: нужен ли дашборд с графиками |
| `formidable` | Парсинг multipart forms | Рассмотреть alternatives или нативный approach |
| `qrcode` (в корне) | Дублируется с whatsapp-gateway | Вынести общую зависимость |
| `source-map` (devDep) | Не используется напрямую | Убрать |

---

## 9. Зависимости (из package.json)

### Production dependencies (19):
| Пакет | Версия | Назначение |
|-------|--------|------------|
| react | ^19.1.2 | UI framework |
| react-dom | ^19.1.2 | React DOM renderer |
| react-router-dom | ^7.6.3 | Маршрутизация |
| react-i18next | ^15.6.0 | Интернационализация |
| i18next | ^25.3.2 | i18n core |
| i18next-browser-languagedetector | ^8.2.0 | Определение языка |
| react-helmet-async | ^3.0.0 | SEO meta |
| framer-motion | ^12.42.2 | Анимации |
| recharts | 3.2.0 | Графики |
| zod | ^4.4.3 | Валидация |
| pg | ^8.22.0 | PostgreSQL клиент |
| jsonwebtoken | ^9.0.3 | JWT |
| bcryptjs | ^3.0.3 | Хеширование паролей |
| nanoid | ^5.1.16 | Генерация ID |
| lucide-react | ^0.469.0 | Иконки |
| class-variance-authority | ^0.7.1 | CSS утилиты |
| tailwind-merge | ^3.6.0 | Merge Tailwind классов |
| @radix-ui/react-slot | ^1.3.0 | UI primitives |
| @stripe/react-stripe-js | 4.0.2 | Stripe (не активен) |
| googleapis | ^173.0.0 | Google Drive API |
| qrcode | ^1.5.4 | Генерация QR |
| formidable | ^3.5.4 | Multipart form parser |
| @types/jsonwebtoken | ^9.0.10 | Types |
| @types/pg | ^8.20.0 | Types |

### Dev dependencies (17):
| Пакет | Версия | Назначение |
|-------|--------|------------|
| vite | ^8.0.1 | Build tool |
| @vitejs/plugin-react | ^6.0.1 | React plugin for Vite |
| typescript | ~5.8.3 | TypeScript |
| tailwindcss | ^3.4.17 | CSS framework |
| autoprefixer | ^10.4.21 | PostCSS plugin |
| postcss | ^8.5.6 | CSS processor |
| eslint | ^9.30.1 | Linting |
| @eslint/js | ^9.30.1 | ESLint config |
| eslint-plugin-react-hooks | ^5.2.0 | React hooks linting |
| eslint-plugin-react-refresh | ^0.4.20 | HMR linting |
| typescript-eslint | ^8.35.1 | TS ESLint |
| globals | ^16.3.0 | Global variables |
| jiti | ^2.6.1 | TS runtime for scripts |
| @vercel/node | ^5.8.23 | Vercel serverless types |
| unplugin-auto-import | ^19.3.0 | Auto-imports |
| source-map | ^0.7.6 | Source maps |
| @types/node, @types/react, @types/react-dom, @types/bcryptjs, @types/formidable, @types/qrcode | various | Type definitions |

---

## 10. Заметки по миграции

### Не переносить в новый проект:
- `node_modules/` — будет создан заново
- `dist/` — билд-артефакт
- `.mimocode/` — конфигурация агента
- `.git/` — остаётся в корне

### Сохранить в old/ (архив):
- Весь исходный код — для справки при миграции
- `.env.example` — документация переменных окружения
- `toyga-kz-2026-cb53d5358944.json` — Google Service Account (секрет!)

### Приоритеты миграции:
1. Перенести DB-схему (0001_init.sql) → database/
2. Перенести API core → backend/
3. Перенести валидацию и константы → backend/ + frontend/ (shared)
4. Пересоздать фронтенд с нуля (новый дизайн)
5. Настроить WhatsApp Gateway → services/
