# TOYGA.KZ V2 — Backend (ARCHIVED - NestJS Phantom Doc)

> **ВНИМАНИЕ / ARCHIVED:** Этот файл описывает проектировавшийся ранее бэкенд на NestJS + Prisma.
> Реальным единым бэкендом проекта Toyga.kz является **FastAPI (Python 3.12+ + SQLAlchemy 2.0 + Asyncpg)**, находящийся в директории `backend/app/`.
> Документ сохранён исключительно для архивной истории.

---

# Original Legacy Content

NestJS + TypeScript + Prisma + PostgreSQL backend for the SaaS digital invitation platform.

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript 5.7+
- **ORM**: Prisma 6
- **Database**: PostgreSQL 16
- **Auth**: JWT (Passport.js) with refresh tokens
- **Storage**: Google Drive API
- **Validation**: class-validator + class-transformer
- **API Docs**: Swagger/OpenAPI at `/api/docs`

## Architecture

```
backend/src/
├── core/                          # Global infrastructure
│   ├── config/                    # Environment configuration
│   ├── database/                  # Prisma service
│   ├── logger/                    # Application logger
│   ├── i18n/                      # Internationalization (kk/ru/en)
│   ├── exceptions/                # Custom exception classes
│   ├── filters/                   # Global exception filter
│   ├── interceptors/              # Response interceptor
│   ├── middleware/                # Request ID, logging, language, security
│   ├── guards/                    # JWT auth, admin guards, role guard
│   ├── decorators/                # Current user, language decorators
│   ├── storage/                   # Google Drive storage service
│   ├── audit/                     # Audit logging service
│   └── utils/                     # Phone, bcrypt, cookie utilities
├── common/                        # Shared types, enums, constants
├── i18n/                          # Translation files (kk, ru, en)
└── modules/
    ├── auth/                      # Authentication (email, OTP, Google, admin)
    ├── users/                     # User profile management
    ├── templates/                 # Templates + categories + assets
    ├── events/                    # Events with versions and autosave
    ├── media/                     # File uploads (images, music, video)
    ├── guests/                    # Guest management + invitation links
    ├── whatsapp/                  # WhatsApp gateway integration
    ├── admin/                     # Admin CRUD management
    └── health/                    # Health check
```
