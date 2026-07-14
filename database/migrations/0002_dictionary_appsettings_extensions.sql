-- ============================================================================
-- TOYGA.KZ V3 — Migration 0002
-- Этап 2: Dictionary, AppSettings, расширение Guest/Template, Notification System
-- ============================================================================

-- ============================================================================
-- 1. DICTIONARY — Универсальные справочники
-- ============================================================================
CREATE TABLE dictionary (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category    VARCHAR(100) NOT NULL,
    key         VARCHAR(255) NOT NULL,
    value       JSONB NOT NULL DEFAULT '{}'::jsonb,
    label       VARCHAR(255),
    label_ru    VARCHAR(255),
    label_en    VARCHAR(255),
    sort_order  INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE,

    CONSTRAINT uq_dict_category_key UNIQUE (category, key)
);

CREATE TRIGGER trg_dictionary_updated_at
    BEFORE UPDATE ON dictionary
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ============================================================================
-- 2. APP_SETTINGS — Глобальные настройки приложения
-- ============================================================================
CREATE TABLE app_settings (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key         VARCHAR(255) NOT NULL UNIQUE,
    value       JSONB NOT NULL,
    category    VARCHAR(100) NOT NULL DEFAULT 'general',
    description TEXT,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_app_settings_updated_at
    BEFORE UPDATE ON app_settings
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ============================================================================
-- 3. NOTIFICATION TEMPLATES — Шаблоны уведомлений
-- ============================================================================
CREATE TABLE notification_templates (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    channel     VARCHAR(20) NOT NULL
                CHECK (channel IN ('whatsapp', 'telegram', 'email')),
    subject     VARCHAR(500),
    body        TEXT NOT NULL,
    html_body   TEXT,
    variables   JSONB DEFAULT '[]'::jsonb,
    is_default  BOOLEAN NOT NULL DEFAULT false,
    is_active   BOOLEAN NOT NULL DEFAULT true,
    event_type  VARCHAR(50),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    deleted_at  TIMESTAMP WITH TIME ZONE
);

CREATE TRIGGER trg_notification_templates_updated_at
    BEFORE UPDATE ON notification_templates
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ============================================================================
-- 4. NOTIFICATION QUEUE — Очередь уведомлений
-- ============================================================================
CREATE TABLE notification_queue (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    guest_id        UUID REFERENCES guests(id) ON DELETE SET NULL,
    channel         VARCHAR(20) NOT NULL
                    CHECK (channel IN ('whatsapp', 'telegram', 'email')),
    recipient       VARCHAR(500) NOT NULL,
    subject         VARCHAR(500),
    message         TEXT NOT NULL,
    html_message    TEXT,
    media_urls      JSONB DEFAULT '[]'::jsonb,
    template_id     UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
    template_vars   JSONB DEFAULT '{}'::jsonb,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'sent', 'delivered', 'failed', 'cancelled')),
    scheduled_at    TIMESTAMP WITH TIME ZONE,
    sent_at         TIMESTAMP WITH TIME ZONE,
    delivered_at    TIMESTAMP WITH TIME ZONE,
    failed_at       TIMESTAMP WITH TIME ZONE,
    attempts        INTEGER NOT NULL DEFAULT 0,
    max_attempts    INTEGER NOT NULL DEFAULT 3,
    error_message   TEXT,
    metadata        JSONB DEFAULT '{}'::jsonb,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_notification_queue_updated_at
    BEFORE UPDATE ON notification_queue
    FOR EACH ROW EXECUTE FUNCTION fn_update_timestamp();

-- ============================================================================
-- 5. РАСШИРЕНИЕ TEMPLATES — клонирование, цены, рейтинг
-- ============================================================================
ALTER TABLE templates ADD COLUMN original_template_id UUID REFERENCES templates(id);
ALTER TABLE templates ADD COLUMN cloned_by UUID REFERENCES users(id);
ALTER TABLE templates ADD COLUMN source VARCHAR(20) DEFAULT 'original'
    CHECK (source IN ('original', 'cloned', 'imported'));
ALTER TABLE templates ADD COLUMN price_kzt INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN download_count INTEGER DEFAULT 0;
ALTER TABLE templates ADD COLUMN rating_avg DECIMAL(3,2) DEFAULT 0;
ALTER TABLE templates ADD COLUMN rating_count INTEGER DEFAULT 0;

-- ============================================================================
-- 6. РАСШИРЕНИЕ GUESTS — мультиканал, группы, RSVP
-- ============================================================================
ALTER TABLE guests ADD COLUMN telegram_username VARCHAR(255);
ALTER TABLE guests ADD COLUMN group_key VARCHAR(100);
ALTER TABLE guests ADD COLUMN group_role VARCHAR(20) DEFAULT 'primary'
    CHECK (group_role IN ('primary', 'secondary'));
ALTER TABLE guests ADD COLUMN partner_guest_id UUID REFERENCES guests(id);
ALTER TABLE guests ADD COLUMN whatsapp_status VARCHAR(20) DEFAULT 'pending'
    CHECK (whatsapp_status IN ('pending', 'sent', 'delivered', 'failed'));
ALTER TABLE guests ADD COLUMN whatsapp_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN whatsapp_error TEXT;
ALTER TABLE guests ADD COLUMN telegram_status VARCHAR(20) DEFAULT 'pending'
    CHECK (telegram_status IN ('pending', 'sent', 'delivered', 'failed'));
ALTER TABLE guests ADD COLUMN telegram_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN telegram_error TEXT;
ALTER TABLE guests ADD COLUMN email_status VARCHAR(20) DEFAULT 'pending'
    CHECK (email_status IN ('pending', 'sent', 'delivered', 'failed'));
ALTER TABLE guests ADD COLUMN email_sent_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN email_error TEXT;
ALTER TABLE guests ADD COLUMN rsvp_status VARCHAR(20) DEFAULT 'pending'
    CHECK (rsvp_status IN ('pending', 'confirmed', 'declined', 'maybe'));
ALTER TABLE guests ADD COLUMN rsvp_comment TEXT;
ALTER TABLE guests ADD COLUMN rsvp_answered_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE guests ADD COLUMN sort_order INTEGER DEFAULT 0;

-- ============================================================================
-- 7. ИНДЕКСЫ для новых таблиц и полей
-- ============================================================================

-- Dictionary
CREATE INDEX idx_dict_category ON dictionary (category) WHERE deleted_at IS NULL;
CREATE INDEX idx_dict_category_key ON dictionary (category, key) WHERE deleted_at IS NULL;

-- App Settings
CREATE INDEX idx_app_settings_category ON app_settings (category);

-- Notification Templates
CREATE INDEX idx_notif_templates_channel ON notification_templates (channel) WHERE deleted_at IS NULL;
CREATE INDEX idx_notif_templates_event_type ON notification_templates (event_type) WHERE deleted_at IS NULL;

-- Notification Queue
CREATE INDEX idx_notif_queue_status ON notification_queue (status) WHERE status = 'pending';
CREATE INDEX idx_notif_queue_scheduled ON notification_queue (scheduled_at) WHERE status = 'pending';
CREATE INDEX idx_notif_queue_event ON notification_queue (event_id);
CREATE INDEX idx_notif_queue_guest ON notification_queue (guest_id);
CREATE INDEX idx_notif_queue_channel ON notification_queue (channel);

-- Templates (new columns)
CREATE INDEX idx_templates_source ON templates (source) WHERE deleted_at IS NULL;
CREATE INDEX idx_templates_original ON templates (original_template_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_templates_cloned_by ON templates (cloned_by) WHERE deleted_at IS NULL;

-- Guests (new columns)
CREATE INDEX idx_guests_group_key ON guests (group_key) WHERE deleted_at IS NULL AND group_key IS NOT NULL;
CREATE INDEX idx_guests_whatsapp_status ON guests (whatsapp_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_telegram_status ON guests (telegram_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_email_status ON guests (email_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_guests_rsvp_status ON guests (rsvp_status) WHERE deleted_at IS NULL;

-- ============================================================================
-- 8. SEED: Dictionary data
-- ============================================================================

-- Event types
INSERT INTO dictionary (category, key, value, label, label_ru, label_en, sort_order) VALUES
('event_type', 'wedding', '{"icon":"rings","color":"#B8902E","default_duration_hours":4}', 'Той', 'Свадьба', 'Wedding', 1),
('event_type', 'kyz-uzatu', '{"icon":"girl","color":"#5C1A24","default_duration_hours":3}', 'Кыз узату', 'Кыз узату', 'Kyz Uzatu', 2),
('event_type', 'sundet', '{"icon":"boy","color":"#26424A","default_duration_hours":3}', 'Сүннет той', 'Сундет той', 'Sundet', 3),
('event_type', 'birthday', '{"icon":"cake","color":"#9C9280","default_duration_hours":3}', 'Туған күн', 'День рождения', 'Birthday', 4),
('event_type', 'anniversary', '{"icon":"heart","color":"#B8902E","default_duration_hours":3}', 'Жылдызча', 'Годовщина', 'Anniversary', 5),
('event_type', 'corporate', '{"icon":"building","color":"#26424A","default_duration_hours":4}', 'Корпоратив', 'Корпоратив', 'Corporate', 6),
('event_type', 'baby-shower', '{"icon":"baby","color":"#E8C978","default_duration_hours":3}', 'Бала төрөлүші', 'Бэби-шOWER', 'Baby Shower', 7),
('event_type', 'other', '{"icon":"star","color":"#9C9280","default_duration_hours":3}', 'Басқа', 'Другое', 'Other', 8);

-- Guest statuses
INSERT INTO dictionary (category, key, value, label, label_ru, label_en, sort_order) VALUES
('guest_status', 'pending', '{"color":"#9C9280"}', 'Күтуде', 'Ожидание', 'Pending', 1),
('guest_status', 'invited', '{"color":"#26424A"}', 'Шақырылған', 'Приглашён', 'Invited', 2),
('guest_status', 'viewed', '{"color":"#B8902E"}', 'Қаралды', 'Просмотрен', 'Viewed', 3),
('guest_status', 'confirmed', '{"color":"#7A8B6F"}', 'Расталған', 'Подтверждён', 'Confirmed', 4),
('guest_status', 'declined', '{"color":"#5C1A24"}', 'Бас тартты', 'Отклонён', 'Declined', 5),
('guest_status', 'maybe', '{"color":"#E8C978"}', 'Шешпедім', 'Возможно', 'Maybe', 6);

-- Guest relations
INSERT INTO dictionary (category, key, value, label, label_ru, label_en, sort_order) VALUES
('guest_relation', 'spouse', '{}', 'Жұбайы', 'Супруг(а)', 'Spouse', 1),
('guest_relation', 'parent', '{}', 'Ата-ана', 'Родитель', 'Parent', 2),
('guest_relation', 'child', '{}', 'Бала', 'Ребёнок', 'Child', 3),
('guest_relation', 'sibling', '{}', 'Аға-әпке/іні-қарындаш', 'Брат/Сестра', 'Sibling', 4),
('guest_relation', 'friend', '{}', 'Дос', 'Друг', 'Friend', 5),
('guest_relation', 'colleague', '{}', 'Әріптес', 'Коллега', 'Colleague', 6),
('guest_relation', 'other', '{}', 'Басқа', 'Другое', 'Other', 7);

-- Notification channels
INSERT INTO dictionary (category, key, value, label, label_ru, label_en, sort_order) VALUES
('notification_channel', 'whatsapp', '{"enabled":true,"max_message_length":1024,"supports_media":true}', 'WhatsApp', 'WhatsApp', 'WhatsApp', 1),
('notification_channel', 'telegram', '{"enabled":false,"max_message_length":4096,"supports_media":true}', 'Telegram', 'Telegram', 'Telegram', 2),
('notification_channel', 'email', '{"enabled":false,"max_subject_length":200,"supports_html":true}', 'Email', 'Электронная почта', 'Email', 3);

-- Subscription plans
INSERT INTO dictionary (category, key, value, label, label_ru, label_en, sort_order) VALUES
('subscription_plan', 'free', '{"max_events":3,"max_guests":50,"max_templates":"all_basic","price_kzt":0}', 'Тегін', 'Бесплатный', 'Free', 1),
('subscription_plan', 'premium', '{"max_events":20,"max_guests":500,"max_templates":"all","price_kzt":4900}', 'Премиум', 'Премиум', 'Premium', 2),
('subscription_plan', 'business', '{"max_events":-1,"max_guests":-1,"max_templates":"all","price_kzt":14900}', 'Бизнес', 'Бизнес', 'Business', 3);

-- ============================================================================
-- 9. SEED: App Settings
-- ============================================================================
INSERT INTO app_settings (key, value, category, description) VALUES
('app_name', '"Тойға"', 'general', 'Название приложения'),
('app_version', '"3.0.0"', 'general', 'Текущая версия'),
('maintenance_mode', 'false', 'general', 'Режим обслуживания'),
('whatsapp_enabled', 'true', 'notifications', 'WhatsApp канал активен'),
('whatsapp_gateway_url', '""', 'integrations', 'URL WhatsApp Gateway'),
('whatsapp_gateway_token', '""', 'integrations', 'Токен WhatsApp Gateway'),
('telegram_bot_token', '""', 'notifications', 'Telegram Bot токен'),
('telegram_enabled', 'false', 'notifications', 'Telegram канал активен'),
('email_smtp_host', '""', 'notifications', 'SMTP хост'),
('email_smtp_port', '587', 'notifications', 'SMTP порт'),
('email_smtp_user', '""', 'notifications', 'SMTP пользователь'),
('email_smtp_password', '""', 'notifications', 'SMTP пароль'),
('email_from_name', '"Тойға"', 'notifications', 'Имя отправителя email'),
('email_from_address', '""', 'notifications', 'Адрес отправителя email'),
('email_enabled', 'false', 'notifications', 'Email канал активен'),
('ads_enabled', 'false', 'ads', 'Рекламные блоки включены'),
('ads_image_url', '""', 'ads', 'URL изображения баннера'),
('ads_banner_url', '""', 'ads', 'Ссылка баннера'),
('ads_height', '90', 'ads', 'Высота баннера (px)'),
('ads_position', '"bottom"', 'ads', 'Позиция баннера (top/bottom/both)'),
('max_events_free', '3', 'limits', 'Макс. событий (Free)'),
('max_guests_free', '50', 'limits', 'Макс. гостей (Free)'),
('max_upload_size_mb', '100', 'limits', 'Макс. размер загрузки (MB)'),
('og_default_image', '"/images/og-default.png"', 'seo', 'OG-изображение по умолчанию');

-- ============================================================================
-- 10. SEED: Default notification templates
-- ============================================================================
INSERT INTO notification_templates (name, channel, body, variables, is_default, event_type) VALUES
(
    'Приглашение (WhatsApp)',
    'whatsapp',
    'Сәлеметсіз бе, {{guest_name}}! 🎉

Біз сізді «{{event_title}}» мерекесіне шақырамыз!

📅 Дата: {{event_date}}
📍 Место: {{event_location}}

🔗 Сіздің жеке шақыруыңыз:
{{invitation_link}}

RSVP жауап беру:
{{rsvp_link}}

{{custom_message}}

Күтеміз! 💛',
    '["guest_name","event_title","event_date","event_location","invitation_link","rsvp_link","custom_message"]'::jsonb,
    true,
    NULL
),
(
    'Напоминание за 1 день (WhatsApp)',
    'whatsapp',
    '⏰ Еске салу: ертең «{{event_title}}» мерекесі!

📅 {{event_date}}
📍 {{event_location}}

Сіз келесіз бе? {{rsvp_link}}',
    '["guest_name","event_title","event_date","event_location","rsvp_link"]'::jsonb,
    true,
    NULL
),
(
    'Благодарность (WhatsApp)',
    'whatsapp',
    'Рақмет сізге, {{guest_name}}! 🙏

«{{event_title}}» мерекесіне қатысқаныңызға рахмет!',
    '["guest_name","event_title"]'::jsonb,
    true,
    NULL
),
(
    'Приглашение (Email)',
    'email',
    '<h1>Приглашение на {{event_title}}</h1><p>Уважаемый(ая) {{guest_name}},</p><p>Приглашаем Вас на наше торжество!</p><p><strong>Дата:</strong> {{event_date}}<br><strong>Место:</strong> {{event_location}}</p><p><a href="{{invitation_link}}">Открыть приглашение</a></p>',
    '["guest_name","event_title","event_date","event_location","invitation_link"]'::jsonb,
    true,
    NULL
);
