-- ============================================================================
-- TOYGA.KZ V3 — Initial Seed Data (Multi-Language KK/RU)
-- ============================================================================

-- 1. Default Admin User (Password: AdminSecret123!)
INSERT INTO users (id, name, email, phone, password_hash, role, status, preferred_lang)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Toyga Admin',
    'admin@toyga.kz',
    '+77000000000',
    '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', -- bcrypt hash
    'admin',
    'active',
    'kk'
) ON CONFLICT (email) DO NOTHING;

-- 2. Event Categories (Үйлену той, Қыз ұзату, Құдалық, Ауызашар, Тұсаукесер)
INSERT INTO categories (id, name_kk, name_ru, slug, description_kk, description_ru, sort_order)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Үйлену той', 'Свадьба', 'uylenu-toy', 'Сән-салтанаты жарасқан үйлену тойына арналған цифрлық шақырулар', 'Премиальные цифровые приглашения на свадьбу', 1),
    ('22222222-2222-2222-2222-222222222222', 'Қыз ұзату', 'Кыз узату', 'kyz-uzatu', 'Нәзік әрі сәнді қыз ұзату тойына арналған шақыру шаблондары', 'Изысканные приглашения на проводы невесты', 2),
    ('33333333-3333-3333-3333-333333333333', 'Құдалық', 'Кудалык', 'kudalyk', 'Құдаларға арналған сыйлы шақырулар', 'Уважительные цифровые приглашения для сватов', 3),
    ('44444444-4444-4444-4444-444444444444', 'Ауызашар', 'Ауызашар', 'auyzashar', 'Ораза айындағы ауызашар дастарханына шақыру', 'Приглашения на ауызашар в священный месяц', 4),
    ('55555555-5555-5555-5555-555555555555', 'Тұсаукесер', 'Тусаукесер', 'tsusakeser', 'Сәбидің алғашқы қадамына арналған қуанышты шақыру', 'Приглашения на тусаукесер первого шага малыша', 5)
ON CONFLICT (slug) DO NOTHING;

-- 3. Initial Templates
INSERT INTO templates (id, category_id, name_kk, name_ru, slug, description_kk, description_ru, price_kzt, is_premium, status)
VALUES 
    (
        'a1111111-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'Алтын Шатыр Luxe',
        'Золотой Шатер Luxe',
        'altyn-shatyr-luxe',
        'Премиум дизайн алтын элементтермен және әуенмен',
        'Премиальный дизайн с золотыми элементами и музыкой',
        4990,
        true,
        'published'
    ),
    (
        'b2222222-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        'Меруерт Нәзіктігі',
        'Жемчужная Нежность',
        'meruert-naziktigi',
        'Қыз ұзату тойына арналған нәзік роза түсті шаблон',
        'Нежный розово-жемчужный шаблон для кыз узату',
        0,
        false,
        'published'
    )
ON CONFLICT (slug) DO NOTHING;

-- 4. Initial Music Library
INSERT INTO music_library (id, title, artist, category, audio_url, duration, is_free)
VALUES
    ('m1111111-1111-1111-1111-111111111111', 'Үйлену той вальсі', 'Казахский Оркестр', 'Свадьба', 'https://assets.toyga.kz/audio/wedding_waltz.mp3', 180, true),
    ('m2222222-2222-2222-2222-222222222222', 'Қыз ұзату әні', 'Аққу Тобы', 'Қыз ұзату', 'https://assets.toyga.kz/audio/kyz_uzatu_song.mp3', 210, true)
ON CONFLICT DO NOTHING;
