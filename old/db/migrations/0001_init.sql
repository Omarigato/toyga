-- ==========================================
-- Toyga.kz Database Schema — Migration 0001
-- Complete schema from architectural plan v2.0
-- Run: psql $DATABASE_URL -f db/migrations/0001_init.sql
-- ==========================================

-- ── Helper: auto-update updated_at trigger ──────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===== Пользователи и авторизация =====

CREATE TABLE IF NOT EXISTS users (
    id              BIGSERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    email           TEXT UNIQUE,
    phone           TEXT UNIQUE,
    password_hash   TEXT,
    avatar_url      TEXT,
    auth_provider   TEXT NOT NULL CHECK (auth_provider IN ('password', 'phone_otp', 'google')),
    google_id       TEXT UNIQUE,
    status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS otp_codes (
    id          BIGSERIAL PRIMARY KEY,
    phone       TEXT NOT NULL,
    code_hash   TEXT NOT NULL,
    purpose     TEXT NOT NULL CHECK (purpose IN ('login', 'register')),
    attempts    INTEGER NOT NULL DEFAULT 0,
    expires_at  TIMESTAMPTZ NOT NULL,
    consumed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
    id              BIGSERIAL PRIMARY KEY,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'admin',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TRIGGER trg_admins_updated_at
    BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===== Каталог шаблонов =====

CREATE TABLE IF NOT EXISTS categories (
    id          BIGSERIAL PRIMARY KEY,
    slug        TEXT NOT NULL UNIQUE,
    title_kk    TEXT NOT NULL,
    title_ru    TEXT,
    icon_url    TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS templates (
    id              BIGSERIAL PRIMARY KEY,
    category_id     BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    code            TEXT UNIQUE,
    title_kk        TEXT NOT NULL,
    title_ru        TEXT,
    preview_img     TEXT,
    envelope_img    TEXT,
    base_img        TEXT,
    content         JSONB,
    design_tokens   JSONB,
    price           INTEGER NOT NULL DEFAULT 0,
    is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    source          TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TRIGGER trg_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS template_assets (
    id              BIGSERIAL PRIMARY KEY,
    template_id     BIGINT NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    type            TEXT NOT NULL CHECK (type IN ('audio', 'video', 'image')),
    url             TEXT NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== Мероприятия (созданные пользователем приглашения) =====

CREATE TABLE IF NOT EXISTS events (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id     BIGINT REFERENCES templates(id) ON DELETE SET NULL,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    type            TEXT NOT NULL CHECK (type IN (
        'wedding', 'kyz_uzatu', 'sundet', 'tusaukeser',
        'merey', 'besik', 'betashar', 'corporate', 'other'
    )),
    description_html TEXT,
    event_date      TIMESTAMPTZ NOT NULL,
    program         JSONB NOT NULL DEFAULT '[]',
    hashtag         TEXT,
    audio_url       TEXT,
    video_url       TEXT,
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_payment', 'published', 'archived'
    )),
    link_mode       TEXT NOT NULL DEFAULT 'shared' CHECK (link_mode IN ('shared', 'personal')),
    view_count      INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS event_addresses (
    id              BIGSERIAL PRIMARY KEY,
    event_id        BIGINT NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    address_text    TEXT NOT NULL,
    place_name      TEXT,
    lat             NUMERIC(10, 7),
    lng             NUMERIC(10, 7),
    map_link        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_event_addresses_updated_at
    BEFORE UPDATE ON event_addresses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS event_invitations (
    id                  BIGSERIAL PRIMARY KEY,
    event_id            BIGINT NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
    template_id         BIGINT NOT NULL REFERENCES templates(id) ON DELETE RESTRICT,
    content             JSONB,
    rendered_image_url  TEXT,
    rendered_video_url  TEXT,
    version             INTEGER NOT NULL DEFAULT 1,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_event_invitations_updated_at
    BEFORE UPDATE ON event_invitations
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS event_media (
    id          BIGSERIAL PRIMARY KEY,
    event_id    BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    url         TEXT NOT NULL,
    type        TEXT NOT NULL CHECK (type IN ('image', 'video')),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);

-- ===== Гости / рассылка =====

CREATE TABLE IF NOT EXISTS guest_contacts (
    id                      BIGSERIAL PRIMARY KEY,
    event_id                BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    full_name               TEXT NOT NULL,
    phone                   TEXT NOT NULL,
    personal_slug           TEXT UNIQUE,
    greeting_text           TEXT,
    send_status             TEXT NOT NULL DEFAULT 'pending' CHECK (send_status IN (
        'pending', 'scheduled', 'sent', 'failed', 'resend_needed'
    )),
    scheduled_at            TIMESTAMPTZ,
    sent_at                 TIMESTAMPTZ,
    last_invitation_version INTEGER NOT NULL DEFAULT 1,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE TRIGGER trg_guest_contacts_updated_at
    BEFORE UPDATE ON guest_contacts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS notification_jobs (
    id                  BIGSERIAL PRIMARY KEY,
    event_id            BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_contact_id    BIGINT REFERENCES guest_contacts(id) ON DELETE SET NULL,
    channel             TEXT NOT NULL DEFAULT 'whatsapp',
    payload             JSONB NOT NULL,
    status              TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'sent', 'failed')),
    gateway_message_id  TEXT,
    error_message       TEXT,
    attempts            INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_notification_jobs_updated_at
    BEFORE UPDATE ON notification_jobs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===== RSVP =====

CREATE TABLE IF NOT EXISTS surveys (
    id                  BIGSERIAL PRIMARY KEY,
    event_id            BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_contact_id    BIGINT REFERENCES guest_contacts(id) ON DELETE SET NULL,
    name                TEXT NOT NULL,
    relation            TEXT,
    status              TEXT NOT NULL CHECK (status IN ('yes', 'no', 'maybe')),
    message             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE TRIGGER trg_surveys_updated_at
    BEFORE UPDATE ON surveys
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS survey_guests (
    id          BIGSERIAL PRIMARY KEY,
    survey_id   BIGINT NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===== Коммерция =====

CREATE TABLE IF NOT EXISTS orders (
    id                  BIGSERIAL PRIMARY KEY,
    event_id            BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount              INTEGER NOT NULL,
    status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'paid', 'cancelled', 'refunded'
    )),
    provider            TEXT,
    provider_payment_id TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS payment_settings (
    id                      BIGSERIAL PRIMARY KEY,
    mode                    TEXT NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual', 'auto')),
    kaspi_merchant_id       TEXT,
    kaspi_api_key_encrypted TEXT,
    manager_whatsapp        TEXT,
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by              BIGINT REFERENCES admins(id) ON DELETE SET NULL
);

-- Insert default payment settings (manual mode)
INSERT INTO payment_settings (mode) VALUES ('manual')
ON CONFLICT DO NOTHING;

-- ===== Рендер видео =====

CREATE TABLE IF NOT EXISTS render_jobs (
    id          BIGSERIAL PRIMARY KEY,
    event_id    BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    type        TEXT NOT NULL DEFAULT 'video' CHECK (type IN ('image', 'video')),
    status      TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued', 'processing', 'done', 'failed'
    )),
    output_url  TEXT,
    error       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_render_jobs_updated_at
    BEFORE UPDATE ON render_jobs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ===== Аудит =====

CREATE TABLE IF NOT EXISTS audit_logs (
    id          BIGSERIAL PRIMARY KEY,
    actor_type  TEXT NOT NULL,
    actor_id    BIGINT NOT NULL,
    action      TEXT NOT NULL,
    entity      TEXT NOT NULL,
    entity_id   BIGINT NOT NULL,
    meta        JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- Indexes
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id) WHERE google_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_otp_codes_phone_purpose ON otp_codes(phone, purpose);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories(is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_templates_category_active ON templates(category_id, is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_templates_code ON templates(code) WHERE code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_template_assets_template ON template_assets(template_id);

CREATE INDEX IF NOT EXISTS idx_events_user ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

CREATE INDEX IF NOT EXISTS idx_event_addresses_event ON event_addresses(event_id);
CREATE INDEX IF NOT EXISTS idx_event_invitations_event ON event_invitations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_media_event ON event_media(event_id);

CREATE INDEX IF NOT EXISTS idx_guest_contacts_event ON guest_contacts(event_id);
CREATE INDEX IF NOT EXISTS idx_guest_contacts_personal_slug ON guest_contacts(personal_slug) WHERE personal_slug IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_guest_contacts_send_status ON guest_contacts(send_status);

CREATE INDEX IF NOT EXISTS idx_notification_jobs_status ON notification_jobs(status);
CREATE INDEX IF NOT EXISTS idx_notification_jobs_event ON notification_jobs(event_id);

CREATE INDEX IF NOT EXISTS idx_surveys_event ON surveys(event_id);
CREATE INDEX IF NOT EXISTS idx_surveys_guest ON surveys(guest_contact_id) WHERE guest_contact_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_orders_event ON orders(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

CREATE INDEX IF NOT EXISTS idx_render_jobs_event ON render_jobs(event_id);
CREATE INDEX IF NOT EXISTS idx_render_jobs_status ON render_jobs(status);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_type, actor_id);
