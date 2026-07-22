# Toyga.kz — Current Architecture & Stitch Design Analysis

> **Status:** Completed Analysis  
> **Target System:** Toyga.kz SaaS Wedding & Digital Invitation Platform  
> **Source Files Analyzed:** `c:\Users\Akim.O\Downloads\stitch_toyga_saas_wedding_platform\stitch_toyga_saas_wedding_platform` and `c:\Users\Akim.O\Documents\Личные\проект\toyga`

---

## 1. Executive Summary

This document presents a comprehensive audit of the **Stitch Toyga SaaS Design System & Prototype Collection** alongside the **Current Codebase State** of Toyga.kz.

The goal of this analysis is to evaluate the existing legacy/prototype codebase, map out all screens and visual requirements from the newly provided Stitch design prototypes, and establish clear guidelines for what must be retained, refactored, or completely rewritten to achieve a production-ready SaaS digital invitation platform.

---

## 2. Stitch Design System & Screens Analysis (`stitch_toyga_saas_wedding_platform`)

### 2.1 Visual Design Tokens & Aesthetics
The design language combines **Apple-level premium minimalism** with **luxury wedding aesthetics** tailored for Kazakh cultural celebrations (Үйлену той, Қыз ұзату, Құдалық, Ауызашар, Тұсаукесер).

* **Color Palette:**
  * **Primary Background:** `#FFFFFF` (Clean, spacious canvas)
  * **Soft Background:** `#F7F7F8` (Light grey section divider)
  * **Dark Premium:** `#111111` (Deep dark mode & luxurious footer elements)
  * **Gold Accent:** `#C9A227` (Antique luxury gold for primary CTAs & headers)
  * **Rose Gold:** `#D8A39D` (Gentle wedding romantic tone)
  * **Action Blue:** `#0071E3` (Interactive links & status highlights)
  * **Text Primary:** `#1D1D1F` / **Secondary:** `#6E6E73`
* **Typography:**
  * **Headings:** Elegant Serif (`Playfair Display`, `Cormorant Garamond`) — Hero (64–80px), Section (40–48px)
  * **UI & Body:** Modern Sans-Serif (`Inter`, `SF Pro Text`) — Body (16–18px)
* **UI Components & Style Principles:**
  * **Cards:** Soft drop shadows, 24px border radius, ultra-clean borders (`border-white/10` or soft grey).
  * **Buttons:** Rounded pill buttons (48–56px height) with gold gradient background for primary actions.
  * **Animations:** Envelope opening, parallax image scrolls, floating sparkle particles, smooth page transitions (GSAP / Framer Motion / Lottie).

---

### 2.2 Page & Prototype Screen Inventory Audit
A full review of the 50+ HTML screen prototypes in `stitch_toyga_saas_wedding_platform` yields 8 core user journeys:

| # | Prototype Folder | Target Screen / Module | Key UI Components & Features |
|---|---|---|---|
| 1 | `toyga.kz_1` .. `toyga.kz_17`, `_4` | **Landing Page & Category Hub** | Hero banner with cinematic imagery, category pills (Үйлену той, Қыз ұзату, etc.), live template carousel, pricing section, testimonials. |
| 2 | `toyga.kz_2` | **Auth (Login / Register / OTP)** | WhatsApp OTP verification input, email/password login modal, Google OAuth buttons. |
| 3 | `toyga.kz_3` | **Customer Dashboard** | Events list, guest count stats card, quick share invitation links, event creation trigger. |
| 4 | `toyga.kz_4`, `toyga.kz_5`, `toyga.kz_7`, `toyga.kz_marketplace`, `premium_marketplace_aesthetic` | **Template Marketplace (Canva style)** | Grid of invitation cards, live animation preview modal, price badges, category & style filters. |
| 5 | `toyga.kz_wizard_1` .. `toyga.kz_wizard_4`, `wizard`, `rsvp_toyga.kz_wizard` | **Step-by-Step Invitation Wizard** | 12-step step indicator (Category -> Design -> Colors -> Text -> Date/Location -> Music -> Gallery -> Program -> Guests -> Preview -> Payment -> Publish). |
| 6 | `toyga.kz_editor` | **Live Canvas Editor** | Left sidebar (blocks/components), middle live mobile preview canvas, right inspector panel (fonts, colors, music, background). |
| 7 | `_1`, `_2`, `_5`, `altyn_shatyr_luxe` | **Personal Mobile Invitation Page (`/i/{event}/{guest}`)** | Full-screen mobile-first invitation, customized guest greeting ("Уважаемый Ержан"), countdown timer, RSVP form ("Приду" / "Не смогу"), map location. |
| 8 | `toyga.kz_crm`, `toyga.kz_9` | **Guest CRM & Management** | Interactive table with guest names, phone numbers, RSVP status badges, seat count, Excel import/export actions. |
| 9 | `toyga.kz_admin`, `toyga.kz_6`, `_3` | **SaaS Admin Panel** | Management dashboards for Users, Templates, Categories, Music, Media Assets, Payments, System Logs. |
| 10 | `toyga.kz_11`, `toyga.kz_12`, `toyga.kz_13` | **Payment & Checkout Flow** | Kaspi / Card payment integration gateway, success screen, error handler screen. |

---

## 3. Current Codebase Evaluation (`c:\Users\Akim.O\Documents\Личные\проект\toyga`)

### 3.1 Backend Analysis (`backend/`)
* **Current Stack:** NestJS (Node.js, TypeScript), Prisma ORM, Passport JWT, Zod.
* **Database Target in Action Plan:** The user target architecture explicitly specifies a transition to **Python (FastAPI)** with **SQLAlchemy 2.0**, **Alembic**, **PostgreSQL**, **Redis**, and **Celery** following **Clean Architecture** principles (`domain/`, `application/`, `infrastructure/`, `presentation/`, `shared/`).
* **Evaluation:** The existing NestJS code provides basic API endpoints, but lacks Clean Architecture separation and Celery background task processing for WhatsApp OTP/reminders.

### 3.2 Database Schema Analysis (`database/`, `backend/prisma/schema.prisma`)
* **Current State:** Basic Prisma schema containing `users`, `auth_sessions`, `events`, `templates`, `categories`, `guests`.
* **Gaps & Missing Entities:**
  * Lacks normalized `event_designs` and full `template_versions` tracking.
  * Missing granular `rsvp_answers`, `music`, `program_items`, `locations`, `payments`, `notifications`, and `audit_logs` entities needed for production SaaS multi-tenancy.

### 3.3 Frontend Analysis (`frontend/`)
* **Current State:** React / Next.js boilerplate.
* **Gaps:** Does not yet incorporate the luxury gold/dark design system tokens, 24px rounded card styles, Framer Motion animations, or the interactive canvas-based live editor from Stitch.

---

## 4. Refactoring & Migration Matrix

| Component | Current State | Target State | Action Required |
|---|---|---|---|
| **Backend Core** | NestJS Node.js API | FastAPI Python 3.12 (Clean Architecture) | **Rewrite** in FastAPI (`app/domain`, `app/application`, `app/infrastructure`, `app/presentation`) |
| **Database ORM** | Prisma Schema | SQLAlchemy 2.0 + Alembic Migrations | **Migrate** to PostgreSQL + Alembic SQL migrations |
| **Frontend Framework** | Basic Next.js Setup | Next.js 14+ App Router + TypeScript + Tailwind CSS | **Refactor** & style with Stitch Luxury Design Tokens |
| **Design System** | Generic CSS | Luxury Gold (`#C9A227`), Dark (`#111111`), 24px radius cards, Serif fonts | **Implement** in Tailwind CSS & global theme tokens |
| **Invitation Editor** | Form-based inputs | Canvas Live Editor with real-time preview & step wizard | **Build** interactive Next.js canvas editor component |
| **Guest CRM** | Primitive table | Complete CRM with Excel import, custom RSVP links & analytics | **Enhance** with status filters, mass actions & Excel processing |
| **Admin Panel** | Not fully implemented | `/admin` with template marketplace manager, media library & audit log | **Build** dedicated Admin layout & dashboards |

---

## 5. Conclusion
The Stitch design package provides an exceptionally detailed UI prototype foundation. The current project requires a backend transition to Python FastAPI Clean Architecture and a complete frontend design system upgrade to reflect the luxury Apple-style aesthetic.
