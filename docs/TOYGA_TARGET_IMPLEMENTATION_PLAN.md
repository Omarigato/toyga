# Toyga.kz — Target Architecture & New Design Implementation Plan

> **Status:** Actionable Blueprint  
> **Platform:** Toyga.kz — SaaS Wedding & Event Digital Invitation Platform  
> **Core Stack:** Python FastAPI (Clean Architecture) + PostgreSQL + SQLAlchemy + Alembic + Next.js 14+ (App Router) + Tailwind CSS + Framer Motion

---

## 1. Plan Overview & Objectives

This document establishes the step-by-step technical plan to transform Toyga.kz into a production-ready SaaS digital invitation platform based on:
1. **The Stitch Luxury Design System** (`Apple-minimalism` + `luxury Kazakh wedding aesthetic`).
2. **Clean Architecture Backend Specification** in Python (FastAPI).
3. **Comprehensive 20-Entity PostgreSQL Database Schema**.
4. **Full Feature Set:** Multi-step wizard, Canva-like live canvas editor, Guest CRM, Template Marketplace, Personal Invitation links (`toyga.kz/i/{event_slug}/{guest_slug}`), and Admin Panel.

---

## 2. Technical Architecture & Component Breakdown

```
toyga/
├── docs/
│   ├── Toyga_kz_Antigravity_Action_Plan.md
│   ├── CURRENT_ARCHITECTURE_ANALYSIS.md
│   └── TOYGA_TARGET_IMPLEMENTATION_PLAN.md
├── backend/                  # Python FastAPI Clean Architecture
│   ├── app/
│   │   ├── domain/           # Core Entities, Value Objects, Domain Interfaces
│   │   ├── application/      # Use Cases, DTOs, Business Logic Services
│   │   ├── infrastructure/   # DB Repositories (SQLAlchemy), Redis, Celery, SMS/WhatsApp OTP
│   │   ├── presentation/     # FastAPI Routers, Controllers, OpenAPI Schemas
│   │   └── shared/           # Config, Security (JWT/Bcrypt), Exception Handlers
│   ├── alembic/              # DB Migrations
│   └── pyproject.toml
├── frontend/                 # Next.js 14+ App Router
│   ├── app/                  # (marketing), (dashboard), (editor), (invitation), admin/
│   ├── components/           # UI design system tokens (buttons, cards, modals)
│   ├── features/             # Wizard, Canvas Editor, Guest CRM, Marketplace
│   ├── styles/               # Tailwind CSS theme extension
│   └── public/               # Static assets, fonts, audio
└── database/                 # Raw SQL Schema & ER Diagrams
```

---

## 3. Step-by-Step Execution Plan

### Phase 1: Database Redesign & ER Schema Specification
* **Objective:** Implement PostgreSQL schema with full multi-tenancy, soft deletes, and indexing.
* **Entities to define (20 Core Tables):**
  1. `users` (id, name, email, phone, password_hash, google_id, avatar_url, role, status)
  2. `auth_sessions` (refresh_token_hash, ip, user_agent, expires_at)
  3. `otp_codes` (phone, code_hash, attempts, expires_at)
  4. `roles` & `user_roles`
  5. `categories` (name, slug, description, image_url, sort_order)
  6. `templates` (category_id, name, slug, preview_url, canvas_json, animation_config, price_kzt, rating_avg)
  7. `template_assets` (template_id, type, url, metadata)
  8. `template_versions` (template_id, version, canvas_json)
  9. `events` (user_id, template_id, title, slug, event_type, event_date, location, status)
  10. `event_designs` (event_id, custom_canvas_json, custom_colors, font_family, music_url)
  11. `guests` (event_id, name, phone, status, guests_count, group_tag, guest_slug)
  12. `invitation_links` (event_id, guest_id, short_code, visits_count)
  13. `rsvp_answers` (guest_id, status, dietary_preferences, message, answered_at)
  14. `locations` (event_id, title, address, latitude, longitude, map_url)
  15. `program_items` (event_id, time, title, description, icon)
  16. `media` (user_id, event_id, url, media_type, file_size)
  17. `music` (title, artist, category, audio_url, duration)
  18. `payments` (user_id, event_id, amount_kzt, status, provider, transaction_id)
  19. `notifications` (user_id, title, body, is_read, channel)
  20. `audit_logs` (user_id, action, resource, details, ip_address)

---

### Phase 2: FastAPI Clean Architecture Backend Setup
* **Objective:** Build robust REST API with OpenAPI documentation, JWT authentication, and WhatsApp OTP support.
* **Key Modules to Implement:**
  * `AuthModule`: WhatsApp OTP generation & verification, Google OAuth token exchange, JWT Auth.
  * `EventModule`: Event CRUD, custom URL slug generator, event status lifecycle.
  * `TemplateModule`: Template marketplace endpoints, category filtering, canvas layout parser.
  * `InvitationModule`: Public invitation view renderer API (`/api/v1/invitations/{event_slug}/{guest_slug}`).
  * `GuestCRMModule`: Bulk guest import (Excel/CSV parser), personalized link generator, RSVP recorder.
  * `PaymentModule`: Kaspi & Payment Gateway webhook processing.
  * `AdminModule`: Platform analytics, user ban/unban, template publisher.

---

### Phase 3: Frontend Design System & UI Token Integration
* **Objective:** Integrate Stitch visual aesthetics into Next.js 14 using Tailwind CSS & Framer Motion.
* **Design System Integration:**
  * **Color Tokens:** Gold `#C9A227`, Soft Gray `#F7F7F8`, Dark `#111111`, Action `#0071E3`.
  * **Fonts:** `Playfair Display` / `Cormorant Garamond` (Headings), `Inter` (UI).
  * **Components:**
    * `GoldButton`: Pill-shaped, gradient animation, glowing hover states.
    * `GlassCard`: 24px border radius, soft drop shadow, luxury border treatment.
    * `EnvelopeOpening`: Animated SVG/GSAP wedding envelope uncurling transition.

---

### Phase 4: Main Application Modules Development

#### 4.1 Landing Page & Template Marketplace
* Cinematic hero banner with background video/parallax effect.
* Category filter tabs (Үйлену той, Қыз ұзату, Құдалық, Ауызашар, Тұсаукесер).
* Canva-style template cards with live hover animation previews and price tags.

#### 4.2 Step-by-Step Invitation Wizard (12 Steps)
1. Category selection
2. Template choice
3. Color palette & font customization
4. Event details & host names
5. Date, time & interactive map location
6. Background music selection
7. Photo gallery upload
8. Event program schedule
9. Guest list entry / Excel upload
10. Live mobile preview
11. Payment checkout (Kaspi/Card)
12. Publish & share link generation

#### 4.3 Interactive Canvas Editor
* Live split-screen or overlay preview.
* Inspector sidebars for adjusting text, background textures, music tracks, and particle animations.

#### 4.4 Personal Invitation Page (`/i/{event_slug}/{guest_slug}`)
* Mobile-first responsive presentation.
* Personalized guest greeting header ("Құрметті Ержан").
* Countdown timer to event date.
* Instant RSVP modal ("Приду" / "Не смогу") with guest count selector.
* Interactive Yandex/Google Map button.

#### 4.5 Guest CRM Dashboard
* Data table with search, status filters (Confirmed, Declined, Pending).
* Excel template export & download.
* WhatsApp share button generator for sending personal invitation links.

#### 4.6 Admin Panel (`/admin`)
* Dashboard metrics: Total Revenue, Active Invitations, Guest Responses Count.
* Management tables for Users, Templates, Categories, Music Library, System Audit Logs.

---

## 4. Verification & QA Matrix

| Area | Test Method | Success Criteria |
|---|---|---|
| **Database** | Alembic Migration Test | Schema deploys cleanly with foreign keys & indices |
| **Backend API** | Pytest / HTTP tests | JWT Auth, OTP flow, and Guest RSVP APIs return 200 OK |
| **Frontend UI** | Mobile & Desktop Audit | Pixel-perfect alignment with Stitch prototypes, 60fps animations |
| **Invitation Link** | Personal RSVP Flow | Opening `/i/wedding-omar/erzhan` displays personalized greeting and updates RSVP status in DB |

---

## 5. Next Steps & Execution Order

1. **User Approval:** Present `CURRENT_ARCHITECTURE_ANALYSIS.md` and `TOYGA_TARGET_IMPLEMENTATION_PLAN.md` for review.
2. **DB Migration Script:** Generate target PostgreSQL schema and migrations.
3. **Backend Core:** Scaffolding FastAPI Clean Architecture directory tree.
4. **Frontend Theme:** Initializing Next.js Stitch design token configuration.
