-- ==========================================
-- Toyga.kz Database Schema
-- Run this file manually in your Supabase SQL Editor
-- ==========================================

-- Categories of events (toy types)
CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    title_kk    TEXT NOT NULL,
    image_url   TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invitation templates
CREATE TABLE IF NOT EXISTS templates (
    id                  BIGSERIAL PRIMARY KEY,
    category_id         BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    title               TEXT NOT NULL,
    description         TEXT,
    price               INTEGER NOT NULL DEFAULT 0,   -- in KZT tenge (0 = free)
    extra_price         INTEGER NOT NULL DEFAULT 400, -- extra for updates
    preview_image_url   TEXT,
    is_free             BOOLEAN NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order          INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Media files for templates (gallery)
CREATE TABLE IF NOT EXISTS template_media (
    id          BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    type        TEXT NOT NULL CHECK (type IN ('image', 'video')),
    url         TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

-- Published invitations
CREATE TABLE IF NOT EXISTS invitations (
    id              BIGSERIAL PRIMARY KEY,
    template_id     BIGINT REFERENCES templates(id) ON DELETE SET NULL,
    short_slug      TEXT NOT NULL UNIQUE,
    owner_name      TEXT NOT NULL,
    owner_phone     TEXT,
    event_type      TEXT NOT NULL,       -- e.g. 'Үйлену той'
    event_date      TIMESTAMPTZ NOT NULL,
    event_location  TEXT,
    event_lat       NUMERIC(10, 7),
    event_lng       NUMERIC(10, 7),
    cover_image_url TEXT,
    audio_url       TEXT,
    custom_data     JSONB DEFAULT '{}',  -- { description, brideName, groomName, etc. }
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Orders from clients (via WhatsApp/Telegram)
CREATE TABLE IF NOT EXISTS orders (
    id              BIGSERIAL PRIMARY KEY,
    template_id     BIGINT REFERENCES templates(id) ON DELETE SET NULL,
    invitation_id   BIGINT REFERENCES invitations(id) ON DELETE SET NULL,
    client_name     TEXT NOT NULL,
    client_phone    TEXT NOT NULL,
    channel         TEXT NOT NULL DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'telegram')),
    status          TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'done')),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Guest RSVPs for invitations
CREATE TABLE IF NOT EXISTS guests (
    id              BIGSERIAL PRIMARY KEY,
    invitation_id   BIGINT NOT NULL REFERENCES invitations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    rsvp_status     TEXT NOT NULL DEFAULT 'maybe' CHECK (rsvp_status IN ('yes', 'no', 'maybe')),
    guest_count     INTEGER NOT NULL DEFAULT 1,
    message         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin accounts
CREATE TABLE IF NOT EXISTS admins (
    id              BIGSERIAL PRIMARY KEY,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Indexes for performance
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_active ON templates(is_active);
CREATE INDEX IF NOT EXISTS idx_invitations_slug ON invitations(short_slug);
CREATE INDEX IF NOT EXISTS idx_invitations_status ON invitations(status);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_guests_invitation ON guests(invitation_id);
CREATE INDEX IF NOT EXISTS idx_template_media_template ON template_media(template_id);
