# 👑 Toyga.kz — Luxury Kazakh Digital Invitation SaaS Platform (Frontend)

Built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **React Query**, inspired by Apple minimalism and Kazakh cultural wedding aesthetics based on the **Stitch** design prototypes.

---

## 🎨 Design System & Theme Architecture

* **Color Palette:**
  * Dark Premium Accent: `#111111` & `#1C1C1E`
  * Luxury Gold Accent: `#C9A227` & `#F59E0B`
  * Rose Pearl Accent: `#D8A39D`
  * Soft Light Theme: `#FAFAFA` & `#FFFFFF`
* **Typography:**
  * Serif Titles: `Playfair Display` & `Cormorant Garamond`
  * UI Body: `Inter`
* **Theme Modes:**
  * Instant Dark Mode / Light Mode toggle via `ThemeProvider` (`src/context/theme-context.tsx`) & `ThemeToggle` component.
* **i18n Localization:**
  * Kazakh (`kk`) and Russian (`ru`) reactive language toggle via `I18nProvider` (`src/context/i18n-context.tsx`).

---

## 🗺️ Complete Page Map (12 Implemented Pages)

| Page Route | Purpose | Features & Design Prototype |
| :--- | :--- | :--- |
| **`/`** | Landing Page | Hero banner, Kazakh event categories (Үйлену той, Қыз ұзату, Құдалық, Ауызашар, Тұсаукесер), single 4 990 ₸ purchase tier |
| **`/(auth)/login`** | Login Page | Email/Password, Google OAuth, and Phone OTP with Name registration |
| **`/(auth)/register`** | Register Page | New user registration form |
| **`/marketplace`** | Template Marketplace | Canva-style template grid, category tabs, price badges (4 990 ₸ / 0 ₸) |
| **`/marketplace/demo/[slug]`** | Interactive Template Demo | Animated envelope uncurling, background music player, RSVP simulator, 2GIS map button |
| **`/wizard`** | 12-Step Creation Wizard | Step-by-step invitation creation with auto-save draft functionality |
| **`/editor`** | Live Canvas Editor | Split view canvas preview & inspector control sidebars |
| **`/dashboard`** | Customer Dashboard | "Мои мероприятия" cards, event status, guest count, share link |
| **`/crm/[event_id]`** | Guest CRM Table | Guest list, attendance statuses, exact persons count selector (1, 2, 3+), Excel export |
| **`/admin`** | SaaS Admin Panel | Platform revenue metrics, user management table |
| **`/payment/checkout`** | Payment Checkout | Kaspi.kz QR & Card selection for 4 990 ₸ single activation |
| **`/payment/success`** | Payment Success | Stitch `toyga.kz_12` prototype: Gold checkmark badge, order summary, invitation activation |
| **`/payment/failed`** | Payment Error | Stitch `toyga.kz_13` prototype: Red error badge, retry payment button |
| **`/i/[event_slug]/[guest_slug]`** | Personal Invitation Page | Personalized greeting ("Ержан мырза"), mobile RSVP modal, persons count, 2GIS map button |
| **`404` (`not-found.tsx`)** | Custom 404 Page | Kazakh/Russian multi-language 404 page with return to home button |

---

## 🔒 Auth Persistence & Performance Middleware

* **Auth Persistence:** Middleware (`src/middleware.ts`) verifies session token cookies (`toyga_token` / `tg_access_token`) so authentication persists seamlessly across page reloads.
* **Caching:** Next.js static asset cache headers (`Cache-Control: public, max-age=31536000, immutable`) and React Query `staleTime` optimization configured.

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Production build
npm run build
```
