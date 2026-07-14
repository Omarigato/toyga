# TOYGA.KZ V2 — Database Architecture

PostgreSQL schema for a SaaS digital invitation platform. Kyrgyz-focused event invitation service with template-based design, guest management, WhatsApp delivery, and RSVP tracking.

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | All table DDL, constraints, triggers |
| `indexes.sql` | Performance indexes (partial, nullable-aware) |
| `seed.sql` | Initial category data |
| `README.md` | This file |

## Setup

```bash
psql -U postgres -d toyga -f schema.sql
psql -U postgres -d toyga -f indexes.sql
psql -U postgres -d toyga -f seed.sql
```

## Tables (15)

### Auth & Users
- **users** — Email/password, phone OTP, Google OAuth authentication
- **auth_sessions** — JWT refresh token tracking per device
- **otp_codes** — Phone OTP verification codes with attempt tracking

### Templates
- **categories** — Event categories (Wedding, Birthday, etc.)
- **templates** — Design templates with canvas_json, animation_config, design_tokens
- **template_assets** — Per-template images, music files, fonts

### Invitations
- **events** — Main invitation entity linking user to template
- **event_contents** — User-edited canvas and content (customized from template)
- **event_versions** — Version history snapshots for undo/redo

### Content & Guests
- **media** — User-uploaded photos, music, videos
- **guests** — Invitation recipients with personal slugs and status tracking
- **invitation_links** — Public (general) and personal (per-guest) sharing links

### Communication
- **rsvp** — Guest RSVP responses (yes/no/maybe)
- **whatsapp_messages** — WhatsApp message queue with scheduling and retry

### System
- **audit_logs** — Immutable action audit trail

## Key JSONB Schemas

### `templates.canvas_json`
```json
{
  "width": 1080,
  "height": 1920,
  "background": "#ffffff",
  "blocks": [
    {
      "id": "block-1",
      "type": "text",
      "content": "Тойга чакырабыз!",
      "x": 100, "y": 200,
      "width": 880, "height": 120,
      "style": { "fontFamily": "Montserrat", "fontSize": 48, "color": "#333333" }
    },
    {
      "id": "block-2",
      "type": "image",
      "src": "https://cdn.toyga.kz/assets/flowers.png",
      "x": 0, "y": 0,
      "width": 1080, "height": 600
    }
  ]
}
```

### `templates.animation_config`
```json
{
  "global": { "duration": 5000, "easing": "ease-in-out" },
  "timeline": [
    {
      "blockId": "block-1",
      "type": "fade",
      "delay": 500,
      "duration": 1000
    },
    {
      "blockId": "block-2",
      "type": "slide",
      "direction": "bottom",
      "distance": 200,
      "duration": 800
    },
    {
      "blockId": "block-3",
      "type": "zoom",
      "from": 0.5,
      "to": 1.0,
      "duration": 1200
    },
    {
      "type": "parallax",
      "speed": 0.5
    },
    {
      "type": "scroll",
      "trigger": "enter-view"
    }
  ]
}
```

### `templates.design_tokens`
```json
{
  "colors": { "primary": "#C8956C", "secondary": "#F5E6D3", "text": "#333333" },
  "fonts": { "heading": "Montserrat-Bold", "body": "Montserrat-Regular" },
  "spacing": { "sectionGap": 60, "blockPadding": 20 }
}
```

### `event_contents.content_json`
```json
{
  "coupleNames": "Азамат & Айгуль",
  "eventDate": "2026-08-15T16:00:00+06:00",
  "venue": "Ресторан «Бишкек»",
  "address": "ул. Çaңкычəк 15, Бишкек",
  "message": "Биздин кубанычыбызды бөлүшүңүздү каалайбыз!",
  "schedule": [
    { "time": "16:00", "title": "Конактарды тосуу" },
    { "time": "17:00", "title": "Тойдун башталышы" },
    { "time": "20:00", "title": "Баңгизат" }
  ]
}
```

## Relations

```
users ─┬─< auth_sessions
       ├─< events ─┬─< event_contents
       │            ├─< event_versions
       │            ├─< guests ──< rsvp
       │            │        └──< invitation_links
       │            ├─< invitation_links
       │            ├─< media
       │            └─< whatsapp_messages
       └─< media
       └─< audit_logs (nullable)

categories ─< templates ─< template_assets
```

## Design Decisions

- **UUID PKs** everywhere — safe for distributed inserts, no sequence contention
- **TIMESTAMP WITH TIME ZONE** — all timestamps store UTC, display adjusted per-user
- **Soft delete** via `deleted_at` on all mutable tables — data recovery, audit trail
- **Partial indexes** (`WHERE deleted_at IS NULL`) — keep index scans fast on active rows
- **JSONB** for template design data — flexible schema for evolving canvas/animation formats
- **Cascading deletes** on child entities (auth_sessions, event_contents, guests)
- **RESTRICT** on category→template and template→event — prevent accidental data loss
- **SET NULL** on media.event_id and whatsapp_messages.guest_id — preserve media/messages if entity removed
- **Check constraints** on all status/role/type columns — data integrity at DB level
- **Triggers** for `updated_at` — automatic timestamp maintenance

## Future Tables (not yet created)

These are planned for later stages:
- `render_jobs` / `video_jobs` — video export pipeline
- `payments` / `subscriptions` / `billing` — monetization
