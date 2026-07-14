-- ============================================================================
-- TOYGA.KZ V2 — PostgreSQL Database Schema
-- SaaS Digital Invitation Platform
-- ============================================================================

-- ============================================================================
-- 1. USERS
-- ============================================================================
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    email           VARCHAR(255),
    phone           VARCHAR(20),
    password_hash   VARCHAR(255),
    google_id       VARCHAR(255),
    avatar_url      TEXT,
    role            VARCHAR(20) NOT NULL DEFAULT 'user'
                    CHECK (role IN ('user', 'admin')),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'suspended', 'deleted')),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMP WITH TIME ZONE,

    -- At least one auth method must be provided
    CONSTRAINT chk_user_auth_method CHECK (
        password_hash IS NOT NULL
        OR phone IS NOT NULL
        OR google_id IS NOT NULL
    )
);

-- ============================================================================
-- 2. AUTH SESSIONS (JWT refresh token tracking)
-- ============================================================================
CREATE TABLE auth_sessions (
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

-- ============================================================================
-- 3. OTP CODES (phone verification)
-- ============================================================================
CREATE TABLE otp_codes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone       VARCHAR(20) NOT NULL,
    code_hash   VARCHAR(255) NOT NULL,
    attempts    INTEGER NOT NULL DEFAULT 0,
    expires_at  TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at     TIMESTAMP WITH TIME ZONE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 4. CATEGORIES
-- ============================================================================
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    slug        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url   TEXT,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 5. TEMPLATES
-- ============================================================================
CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL UNIQUE,
    description     TEXT,
    preview_url     TEXT,
    thumbnail_url   TEXT,

    -- Canvas design: text blocks, images, positions, sizes, fonts, colors
    canvas_json     JSONB NOT NULL DEFAULT '{
        "width": 1080,
        "height": 1920,
        "background": "#ffffff",
        "blocks": []
    }'::jsonb,

    -- Animation config: fade, slide, zoom, parallax, scroll
    animation_config JSONB NOT NULL DEFAULT '{
        "timeline": [],
        "global": {
            "duration": 0,
            "easing": "ease-in-out"
        }
    }'::jsonb,

    -- Design tokens: colors, fonts, spacing
    design_tokens   JSONB NOT NULL DEFAULT '{
        "colors": {},
        "fonts": {},
        "spacing": {}
    }'::jsonb,

    is_premium      BOOLEAN NOT NULL DEFAULT false,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                    CHECK (status IN ('draft', 'published', 'archived')),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 6. TEMPLATE ASSETS (images, music, fonts)
-- ============================================================================
CREATE TABLE template_assets (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL
                CHECK (type IN ('image', 'music', 'font')),
    url         TEXT NOT NULL,
    name        VARCHAR(255) NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 7. EVENTS (main invitation entity)
-- ============================================================================
CREATE TABLE events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id) ON DELETE RESTRICT,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    event_type  VARCHAR(50) NOT NULL,
    event_date  TIMESTAMP WITH TIME ZONE NOT NULL,
    location    VARCHAR(500),
    description TEXT,
    status      VARCHAR(20) NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 8. EVENT CONTENTS (user-edited design)
-- ============================================================================
CREATE TABLE event_contents (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id      UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

    -- Edited canvas with user modifications
    canvas_json   JSONB NOT NULL DEFAULT '{
        "width": 1080,
        "height": 1920,
        "background": "#ffffff",
        "blocks": []
    }'::jsonb,

    -- User-edited content fields (names, dates, messages, etc.)
    content_json  JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at    TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 9. EVENT VERSIONS (design history snapshots)
-- ============================================================================
CREATE TABLE event_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    version_number  INTEGER NOT NULL,
    snapshot_json   JSONB NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT uq_event_version UNIQUE (event_id, version_number)
);

-- ============================================================================
-- 10. MEDIA (photos, music, videos)
-- ============================================================================
CREATE TABLE media (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    event_id    UUID REFERENCES events(id) ON DELETE SET NULL,
    type        VARCHAR(20) NOT NULL
                CHECK (type IN ('image', 'music', 'video')),
    file_name   VARCHAR(255) NOT NULL,
    file_url    TEXT NOT NULL,
    mime_type   VARCHAR(100) NOT NULL,
    size        BIGINT NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 11. GUESTS
-- ============================================================================
CREATE TABLE guests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    phone           VARCHAR(20),
    email           VARCHAR(255),
    personal_slug   VARCHAR(255) NOT NULL UNIQUE,
    custom_message  TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'invited', 'viewed', 'confirmed', 'declined', 'maybe')),
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at      TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 12. INVITATION LINKS (public + personal)
-- ============================================================================
CREATE TABLE invitation_links (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id    UUID REFERENCES guests(id) ON DELETE SET NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    is_personal BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- 13. RSVP
-- ============================================================================
CREATE TABLE rsvp (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id    UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id    UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
    answer      VARCHAR(20) NOT NULL
                CHECK (answer IN ('yes', 'no', 'maybe')),
    comment     TEXT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),

    CONSTRAINT uq_rsvp_per_guest UNIQUE (event_id, guest_id)
);

-- ============================================================================
-- 14. WHATSAPP MESSAGES
-- ============================================================================
CREATE TABLE whatsapp_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id        UUID REFERENCES guests(id) ON DELETE SET NULL,
    phone           VARCHAR(20) NOT NULL,
    message         TEXT NOT NULL,
    scheduled_at    TIMESTAMP WITH TIME ZONE,
    sent_at         TIMESTAMP WITH TIME ZONE,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'sent', 'delivered', 'failed')),
    attempts        INTEGER NOT NULL DEFAULT 0,
    error_message   TEXT,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- 15. AUDIT LOGS
-- ============================================================================
CREATE TABLE audit_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id   UUID NOT NULL,
    metadata    JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- TRIGGER: Auto-update updated_at on row modification
-- ============================================================================
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_auth_sessions_updated_at
    BEFORE UPDATE ON auth_sessions
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_otp_codes_updated_at
    BEFORE UPDATE ON otp_codes
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_template_assets_updated_at
    BEFORE UPDATE ON template_assets
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_event_contents_updated_at
    BEFORE UPDATE ON event_contents
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_media_updated_at
    BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_guests_updated_at
    BEFORE UPDATE ON guests
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_invitation_links_updated_at
    BEFORE UPDATE ON invitation_links
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_rsvp_updated_at
    BEFORE UPDATE ON rsvp
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

CREATE TRIGGER trg_whatsapp_messages_updated_at
    BEFORE UPDATE ON whatsapp_messages
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();
