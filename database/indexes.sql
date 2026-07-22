-- ============================================================================
-- TOYGA.KZ V3 — PostgreSQL Database Indexes
-- High-Performance Optimization for SaaS Digital Invitation Engine
-- ============================================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users(role, status);

-- Auth Sessions & OTP
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_refresh_token ON auth_sessions(refresh_token_hash);
CREATE INDEX IF NOT EXISTS idx_otp_codes_phone ON otp_codes(phone);

-- Categories & Templates
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category_id);
CREATE INDEX IF NOT EXISTS idx_templates_slug ON templates(slug);
CREATE INDEX IF NOT EXISTS idx_templates_status_price ON templates(status, price_kzt);

-- Events
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, event_date);

-- Guests & RSVP Links (Critical for Fast Mobile Invitation Page Load)
CREATE INDEX IF NOT EXISTS idx_guests_event_id ON guests(event_id);
CREATE INDEX IF NOT EXISTS idx_guests_personal_slug ON guests(personal_slug);
CREATE INDEX IF NOT EXISTS idx_guests_status ON guests(status);
CREATE INDEX IF NOT EXISTS idx_invitation_links_slug ON invitation_links(slug);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_event_id ON payments(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Audit & Notifications
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read);
