-- ============================================================================
-- TOYGA.KZ V2 — Database Indexes
-- ============================================================================

-- USERS
CREATE INDEX idx_users_email ON users (email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users (phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_google_id ON users (google_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users (status) WHERE deleted_at IS NULL;

-- AUTH SESSIONS
CREATE INDEX idx_auth_sessions_user_id ON auth_sessions (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_auth_sessions_expires_at ON auth_sessions (expires_at) WHERE deleted_at IS NULL;

-- OTP CODES
CREATE INDEX idx_otp_codes_phone ON otp_codes (phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_otp_codes_expires_at ON otp_codes (expires_at) WHERE deleted_at IS NULL;

-- TEMPLATES
CREATE INDEX idx_templates_category_id ON templates (category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_templates_slug ON templates (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_templates_status ON templates (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_templates_is_premium ON templates (is_premium) WHERE deleted_at IS NULL;

-- TEMPLATE ASSETS
CREATE INDEX idx_template_assets_template_id ON template_assets (template_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_template_assets_type ON template_assets (type) WHERE deleted_at IS NULL;

-- EVENTS
CREATE INDEX idx_events_user_id ON events (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_template_id ON events (template_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_slug ON events (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_event_date ON events (event_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_events_status ON events (status) WHERE deleted_at IS NULL;

-- EVENT CONTENTS
CREATE INDEX idx_event_contents_event_id ON event_contents (event_id) WHERE deleted_at IS NULL;

-- EVENT VERSIONS
CREATE INDEX idx_event_versions_event_id ON event_versions (event_id);

-- MEDIA
CREATE INDEX idx_media_user_id ON media (user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_event_id ON media (event_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_media_type ON media (type) WHERE deleted_at IS NULL;

-- GUESTS
CREATE INDEX idx_guests_event_id ON guests (event_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_personal_slug ON guests (personal_slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_status ON guests (status) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_phone ON guests (phone) WHERE deleted_at IS NULL;

-- INVITATION LINKS
CREATE INDEX idx_invitation_links_event_id ON invitation_links (event_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_invitation_links_slug ON invitation_links (slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_invitation_links_guest_id ON invitation_links (guest_id) WHERE deleted_at IS NULL;

-- RSVP
CREATE INDEX idx_rsvp_event_id ON rsvp (event_id);
CREATE INDEX idx_rsvp_guest_id ON rsvp (guest_id);

-- WHATSAPP MESSAGES
CREATE INDEX idx_whatsapp_messages_event_id ON whatsapp_messages (event_id);
CREATE INDEX idx_whatsapp_messages_guest_id ON whatsapp_messages (guest_id);
CREATE INDEX idx_whatsapp_messages_status ON whatsapp_messages (status);
CREATE INDEX idx_whatsapp_messages_scheduled_at ON whatsapp_messages (scheduled_at) WHERE status = 'pending';

-- AUDIT LOGS
CREATE INDEX idx_audit_logs_user_id ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs (action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs (created_at);
