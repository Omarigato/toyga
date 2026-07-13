# TOYGA.KZ V2 — Backend

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

## API Endpoints

### Auth (10 endpoints)
- `POST /api/v1/auth/register` — Register with email/password
- `POST /api/v1/auth/login` — Login with email/password
- `POST /api/v1/auth/admin/login` — Admin login
- `POST /api/v1/auth/otp/request` — Request OTP via WhatsApp
- `POST /api/v1/auth/otp/verify` — Verify OTP code
- `POST /api/v1/auth/google/callback` — Google OAuth callback
- `POST /api/v1/auth/refresh` — Refresh access token
- `GET /api/v1/auth/me` — Get current user
- `POST /api/v1/auth/logout` — Logout

### Templates (8 endpoints)
- `GET /api/v1/templates` — List published templates
- `GET /api/v1/templates/:id` — Get template with assets
- `POST /api/v1/templates` — Create template (admin)
- `PUT /api/v1/templates/:id` — Update template (admin)
- `DELETE /api/v1/templates/:id` — Delete template (admin)
- `POST /api/v1/templates/:id/assets` — Add asset (admin)
- `DELETE /api/v1/templates/:templateId/assets/:assetId` — Remove asset (admin)

### Categories (5 endpoints)
- `GET /api/v1/categories` — List all categories
- `GET /api/v1/categories/:id` — Get category
- `POST /api/v1/categories` — Create category (admin)
- `PUT /api/v1/categories/:id` — Update category (admin)
- `DELETE /api/v1/categories/:id` — Delete category (admin)

### Events (9 endpoints)
- `GET /api/v1/events` — List user events
- `GET /api/v1/events/:id` — Get event details
- `GET /api/v1/events/public/:slug` — Get public event (for invitation page)
- `POST /api/v1/events` — Create event from template
- `PUT /api/v1/events/:id` — Update event
- `DELETE /api/v1/events/:id` — Delete event
- `POST /api/v1/events/:id/publish` — Publish event
- `POST /api/v1/events/:id/autosave` — Autosave editor content
- `POST /api/v1/events/:id/versions` — Save version snapshot
- `GET /api/v1/events/:id/versions` — List versions
- `POST /api/v1/events/:id/versions/:version/restore` — Restore version

### Guests (7 endpoints)
- `GET /api/v1/guests/event/:eventId` — List guests
- `GET /api/v1/guests/personal/:slug` — Get guest page (public)
- `POST /api/v1/guests` — Add guest
- `POST /api/v1/guests/bulk` — Import guests (Excel/CSV foundation)
- `PUT /api/v1/guests/:id` — Update guest
- `DELETE /api/v1/guests/:id` — Remove guest
- `POST /api/v1/guests/rsvp` — Submit RSVP (public)

### Invitation Links (5 endpoints)
- `GET /api/v1/invitation-links/event/:eventId` — List links
- `GET /api/v1/invitation-links/:slug` — Get invitation page (public)
- `POST /api/v1/invitation-links/general` — Create general link
- `POST /api/v1/invitation-links/personal` — Create personal link
- `DELETE /api/v1/invitation-links/:id` — Delete link

### Media (4 endpoints)
- `GET /api/v1/media` — List user media
- `GET /api/v1/media/event/:eventId` — List event media
- `POST /api/v1/media/upload` — Upload file (multipart)
- `DELETE /api/v1/media/:id` — Delete file

### WhatsApp (3 endpoints)
- `GET /api/v1/whatsapp/event/:eventId` — List messages
- `POST /api/v1/whatsapp/send` — Send single message
- `POST /api/v1/whatsapp/broadcast` — Broadcast to multiple guests

### Admin (6 endpoints)
- `GET /api/v1/admin/stats` — Dashboard stats
- `GET /api/v1/admin/users` — List users (with search)
- `PUT /api/v1/admin/users/:id/role` — Update user role
- `PUT /api/v1/admin/users/:id/status` — Update user status
- `DELETE /api/v1/admin/users/:id` — Delete user
- `GET /api/v1/admin/events` — List all events
- `GET /api/v1/admin/templates` — List all templates
- `GET /api/v1/admin/media` — List all media
- `GET /api/v1/admin/categories` — List categories

### Health
- `GET /api/v1/health` — Health check

## Features Implemented

1. **Auth**: Email/password, phone OTP via WhatsApp, Google OAuth, refresh tokens, admin login
2. **Roles**: USER, ADMIN with guards and permission foundation
3. **Storage**: Google Drive abstraction with folder management
4. **Media**: File upload with type/size validation (image 15MB, audio 20MB, video 100MB)
5. **Templates**: Full CRUD with categories, assets, canvas_json, animation_config, design_tokens
6. **Events**: Create from template, autosave, version history, publish workflow
7. **Invitation Links**: General and personal links with slug generation
8. **Guests**: CRUD, bulk import foundation, personal slugs, RSVP
9. **WhatsApp**: OTP, single send, broadcast via gateway
10. **I18n**: All errors translated in kk (default), ru, en
11. **Swagger**: Full documentation at `/api/docs` with JWT Bearer auth
12. **Validation**: DTOs for all endpoints, file upload security
13. **Audit**: Login, events, templates, media, guests, WhatsApp actions logged

## Development Rules

1. Controller → Service → Repository → Prisma flow
2. Business logic only in services
3. Database access only in repositories
4. Dependency injection everywhere
5. Soft delete with `deletedAt` on all mutable tables
6. All timestamps in UTC (TIMESTAMP WITH TIME ZONE)
7. UUID primary keys for all tables
8. Unified response: `{ success, data, message, errorCode }`
9. Errors translated via `Accept-Language` header
10. Default language: Kazakh (kk)
