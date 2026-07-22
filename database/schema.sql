-- ============================================================================
-- TOYGA.KZ V3 — Production PostgreSQL Database Schema
-- SaaS Digital Invitation Platform (Kazakhstan)
-- Support: Multi-language (KK/RU), Guest RSVP ENUMs, 2GIS Links, Google Drive Files
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS (Strict Type Safety & Future Extensibility)
-- ============================================================================
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE user_status_enum AS ENUM ('active', 'suspended', 'deleted');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE template_status_enum AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE event_status_enum AS ENUM ('draft', 'published', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE guest_status_enum AS ENUM ('pending', 'accepted', 'declined', 'maybe');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_status_enum AS ENUM ('pending', 'paid', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE payment_provider_enum AS ENUM ('kaspi', 'card', 'manual', 'admin_override');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE asset_type_enum AS ENUM ('image', 'music', 'font', 'video');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE otp_provider_enum AS ENUM ('mock', 'whatsapp', 'telegram', 'sms');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 1. FILES TABLE (Google Drive & Media Asset Storage Metadata)
-- ============================================================================
CREATE TABLE IF NOT EXISTS files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_name   VARCHAR(255) NOT NULL,
    file_key        VARCHAR(255) UNIQUE NOT NULL, -- Google Drive File ID or Storage Key
    size_bytes      BIGINT,
    mime_type       VARCHAR(100),
    width_px        INTEGER,
    height_px       INTEGER,
    folder          VARCHAR(100) NOT NULL DEFAULT 'general',
    file_url        TEXT NOT NULL,
    user_id         UUID,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 2. USERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255) UNIQUE,
    phone           VARCHAR(20) UNIQUE,
    password_hash   VARCHAR(255),
    google_id       VARCHAR(255),
    telegram_id     BIGINT UNIQUE,
    avatar_file_id  UUID REFERENCES files(id) ON DELETE SET NULL,
    avatar_url      TEXT,
    role            user_role_enum NOT NULL DEFAULT 'user',
    status          user_status_enum NOT NULL DEFAULT 'active',
    preferred_lang  VARCHAR(5) NOT NULL DEFAULT 'kk',
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

-- Foreign key back-reference to user in files
ALTER TABLE files DROP CONSTRAINT IF EXISTS fk_files_user;
ALTER TABLE files ADD CONSTRAINT fk_files_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- ============================================================================
-- 3. AUTH SESSIONS & OTP CODES
-- ============================================================================
CREATE TABLE IF NOT EXISTS auth_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash  VARCHAR(255) NOT NULL,
    ip_address          INET,
    user_agent          TEXT,
    expires_at          TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS otp_codes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone       VARCHAR(20) NOT NULL,
    code_hash   VARCHAR(255) NOT NULL,
    provider    otp_provider_enum NOT NULL DEFAULT 'mock',
    attempts    INTEGER NOT NULL DEFAULT 0,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at     TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 4. DICTIONARY & APP SETTINGS (Multi-language Support)
-- ============================================================================
CREATE TABLE IF NOT EXISTS dictionary (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category    VARCHAR(100) NOT NULL,
    key         VARCHAR(255) NOT NULL,
    value_kk    TEXT NOT NULL,
    value_ru    TEXT NOT NULL,
    value_en    TEXT,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uq_dictionary_cat_key UNIQUE (category, key)
);

CREATE TABLE IF NOT EXISTS app_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(255) UNIQUE NOT NULL,
    value       JSONB NOT NULL,
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. CATEGORIES (Үйлену той, Қыз ұзату, Құдалық, Ауызашар, Тұсаукесер)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_kk         VARCHAR(100) NOT NULL,
    name_ru         VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    description_kk  TEXT,
    description_ru  TEXT,
    image_file_id   UUID REFERENCES files(id) ON DELETE SET NULL,
    image_url       TEXT,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 6. TEMPLATES (Single Purchase Model, Per-Event)
-- ============================================================================
CREATE TABLE IF NOT EXISTS templates (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id         UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name_kk             VARCHAR(255) NOT NULL,
    name_ru             VARCHAR(255) NOT NULL,
    slug                VARCHAR(255) UNIQUE NOT NULL,
    description_kk      TEXT,
    description_ru      TEXT,
    preview_file_id     UUID REFERENCES files(id) ON DELETE SET NULL,
    preview_url         TEXT,
    thumbnail_file_id   UUID REFERENCES files(id) ON DELETE SET NULL,
    thumbnail_url       TEXT,
    price_kzt           INTEGER NOT NULL DEFAULT 0, -- 0 = Free, >0 = Paid
    discount_kzt        INTEGER NOT NULL DEFAULT 0,
    status              template_status_enum NOT NULL DEFAULT 'draft',
    
    canvas_json         JSONB NOT NULL DEFAULT '{
        "width": 1080,
        "height": 1920,
        "background": "#ffffff",
        "blocks": []
    }'::jsonb,
    animation_config    JSONB NOT NULL DEFAULT '{
        "timeline": [],
        "global": {"duration": 0, "easing": "ease-in-out"}
    }'::jsonb,
    design_tokens       JSONB NOT NULL DEFAULT '{
        "colors": {}, "fonts": {}, "spacing": {}
    }'::jsonb,
    
    rating_avg          NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    purchase_count      INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS template_assets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    type        asset_type_enum NOT NULL,
    file_id     UUID REFERENCES files(id) ON DELETE SET NULL,
    url         TEXT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 7. MUSIC LIBRARY (All music tracks free with template)
-- ============================================================================
CREATE TABLE IF NOT EXISTS music_library (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    artist      VARCHAR(255),
    category    VARCHAR(100),
    audio_url   TEXT NOT NULL,
    duration    INTEGER NOT NULL DEFAULT 0, -- in seconds
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 8. EVENTS (Digital Invitation Container)
-- ============================================================================
CREATE TABLE IF NOT EXISTS events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id     UUID NOT NULL REFERENCES templates(id) ON DELETE RESTRICT,
    title           VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) UNIQUE NOT NULL,
    event_type      VARCHAR(50) NOT NULL,
    event_date      TIMESTAMP WITH TIME ZONE NOT NULL,
    default_lang    VARCHAR(5) NOT NULL DEFAULT 'kk',
    status          event_status_enum NOT NULL DEFAULT 'draft',
    is_paid         BOOLEAN NOT NULL DEFAULT false,
    canvas_json     JSONB NOT NULL DEFAULT '{}'::jsonb,
    draft_data      JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS event_contents (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    canvas_json     JSONB NOT NULL DEFAULT '{}'::jsonb,
    content_kk      JSONB NOT NULL DEFAULT '{}'::jsonb,
    content_ru      JSONB NOT NULL DEFAULT '{}'::jsonb,
    music_id        UUID REFERENCES music_library(id) ON DELETE SET NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    venue_name      VARCHAR(255) NOT NULL,
    address         VARCHAR(500) NOT NULL,
    city            VARCHAR(100),
    latitude        NUMERIC(10, 7),
    longitude       NUMERIC(10, 7),
    gis_map_url     TEXT, -- 2GIS Navigation Link
    yandex_map_url  TEXT,
    google_map_url  TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS program_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    time_str        VARCHAR(20) NOT NULL,
    title_kk        VARCHAR(255) NOT NULL,
    title_ru        VARCHAR(255) NOT NULL,
    description_kk  TEXT,
    description_ru  TEXT,
    icon_name       VARCHAR(50),
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 9. GUESTS & RSVP (ENUM Status + exact persons count + comment)
-- ============================================================================
CREATE TABLE IF NOT EXISTS guests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    personal_slug   VARCHAR(255) NOT NULL UNIQUE,
    group_tag       VARCHAR(100) DEFAULT 'general',
    status          guest_status_enum NOT NULL DEFAULT 'pending',
    guests_count    INTEGER NOT NULL DEFAULT 1,
    comment         TEXT,
    answered_at     TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS invitation_links (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id    UUID REFERENCES guests(id) ON DELETE SET NULL,
    slug        VARCHAR(255) UNIQUE NOT NULL,
    is_personal BOOLEAN NOT NULL DEFAULT false,
    views_count INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 10. PAYMENTS (Single Item Purchase Model)
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    template_id     UUID REFERENCES templates(id) ON DELETE SET NULL,
    amount_kzt      INTEGER NOT NULL,
    status          payment_status_enum NOT NULL DEFAULT 'pending',
    provider        payment_provider_enum NOT NULL DEFAULT 'kaspi',
    transaction_id  VARCHAR(255) UNIQUE,
    paid_at         TIMESTAMP WITH TIME ZONE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 11. NOTIFICATIONS & AUDIT LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    message     TEXT NOT NULL,
    is_read     BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   UUID NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address  INET,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- TRIGGERS: Automated updated_at Timestamp Updates
-- ============================================================================
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

DROP TRIGGER IF EXISTS trg_guests_updated_at ON guests;
CREATE TRIGGER trg_guests_updated_at BEFORE UPDATE ON guests FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

DROP TRIGGER IF EXISTS trg_payments_updated_at ON payments;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
