-- ==========================================
-- Toyga.kz Seed Data
-- Run AFTER schema.sql
-- ==========================================

-- Categories
INSERT INTO categories (slug, title_kk, sort_order, image_url) VALUES
('uylen-toy',       'Үйлену той',                  1, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=200&fit=crop'),
('kyz-uzatu',       'Қыз ұзату',                   2, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=200&fit=crop'),
('sundet-toy',      'Сүндет той',                  3, 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&h=200&fit=crop'),
('tusaukesar',      'Тұсаукесер',                  4, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=200&fit=crop'),
('merey-toy',       'Мерей той',                   5, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=200&fit=crop'),
('besik-toy',       'Бесік той',                   6, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&h=200&fit=crop'),
('merey-sundet',    'Мерей той + Сүндет той',      7, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=200&fit=crop'),
('uylen-besik',     'Үйлену той + Бесік той',      8, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=200&fit=crop'),
('sundet-tusaukesar','Сүндет той + Тұсаукесер',    9, 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&h=200&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- Templates (2 per main category)
INSERT INTO templates (category_id, title, description, price, extra_price, preview_image_url, is_free, is_active, sort_order) VALUES
-- Үйлену той
((SELECT id FROM categories WHERE slug='uylen-toy'), 'Алтын үйлену шақыру',   'Классикалық алтын дизайнда жасалған керемет үйлену той шақыруы',         800,  400, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=500&fit=crop', false, true, 1),
((SELECT id FROM categories WHERE slug='uylen-toy'), 'Раушан гүлді шақыру',   'Нежный гүл суреттерімен безендірілген романтикалық шақыру',                0,   400, 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=500&fit=crop', true,  true, 2),
-- Қыз ұзату
((SELECT id FROM categories WHERE slug='kyz-uzatu'), 'Қыз ұзату классик',      'Ұлттық өрнектерімен безендірілген керемет қыз ұзату шақыруы',             800,  400, 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=400&h=500&fit=crop', false, true, 1),
((SELECT id FROM categories WHERE slug='kyz-uzatu'), 'Ақ жібек қыз ұзату',    'Ақ жібек және алтын реңдерімен безендірілген нәзік шақыру',               800,  400, 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=500&fit=crop', false, true, 2),
-- Сүндет той
((SELECT id FROM categories WHERE slug='sundet-toy'), 'Сүндет той — Аспан',   'Аспан көк түстерімен безендірілген ерекше сүндет той шақыруы',            800,  400, 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&h=500&fit=crop', false, true, 1),
((SELECT id FROM categories WHERE slug='sundet-toy'), 'Сүндет той — Батыр',   'Ерлік тақырыбындағы жарқын және ержүрек дизайнды шақыру',                  0,   400, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=500&fit=crop', true,  true, 2),
-- Тұсаукесер
((SELECT id FROM categories WHERE slug='tusaukesar'), 'Тұсаукесер — Бақыт',   'Балапандарға арналған жарқын және шапшаң дизайнды шақыру',                  0,   400, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=500&fit=crop', true,  true, 1),
((SELECT id FROM categories WHERE slug='tusaukesar'), 'Тұсаукесер — Нәресте', 'Нәзік реңдермен безендірілген сүйкімді нәресте шақыруы',                  800,  400, 'https://images.unsplash.com/photo-1596003906949-67221c37965c?w=400&h=500&fit=crop', false, true, 2),
-- Мерей той
((SELECT id FROM categories WHERE slug='merey-toy'), 'Мерей той — Алтын жыл', 'Ерекше мерей тойға арналған сәулетті және элегантты шақыру',             1200,  400, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=500&fit=crop', false, true, 1),
((SELECT id FROM categories WHERE slug='merey-toy'), 'Мерей той — Күміс',     'Күміс және ақ реңдерімен безендірілген мерей той шақыруы',                800,  400, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=500&fit=crop', false, true, 2),
-- Бесік той
((SELECT id FROM categories WHERE slug='besik-toy'), 'Бесік той — Бояулы',    'Жарқын бояулармен безендірілген бесік той шақыруы',                          0,   400, 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=500&fit=crop', true,  true, 1),
((SELECT id FROM categories WHERE slug='besik-toy'), 'Бесік той — Классик',   'Классикалық дизайнда жасалған бесік той шақыруы',                           800,  400, 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=400&h=500&fit=crop', false, true, 2);

-- Demo invitation for testing /i/:slug
INSERT INTO invitations (template_id, short_slug, owner_name, owner_phone, event_type, event_date, event_location, event_lat, event_lng, cover_image_url, custom_data, status)
VALUES (
    (SELECT id FROM templates LIMIT 1),
    'demo01',
    'Айгерім & Нұрлан',
    '+77066403655',
    'Үйлену той',
    NOW() + INTERVAL '30 days',
    'Алматы, «Достық» банкет залы',
    43.2384,
    76.9457,
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&h=600&fit=crop',
    '{"brideName": "Айгерім", "groomName": "Нұрлан", "description": "Сізді біздің той кешіне шақырамыз! Бірге қуанышты сәтті бөлісейік.", "dressCode": "Ресми киім"}'::JSONB,
    'published'
);

-- Demo guest messages
INSERT INTO guests (invitation_id, name, rsvp_status, guest_count, message)
VALUES
    ((SELECT id FROM invitations WHERE short_slug='demo01'), 'Зарина', 'yes', 2, 'Қатысамыз! Бақытты болыңыздар! 🌹'),
    ((SELECT id FROM invitations WHERE short_slug='demo01'), 'Дамир', 'yes', 3, 'Міндетті түрде келеміз. Дұрыс бақыт тілеймін!'),
    ((SELECT id FROM invitations WHERE short_slug='demo01'), 'Аида', 'maybe', 1, 'Келуге тырысамын, жолдар сызылсын!');

-- Admin account
-- Password: I.love.eww.05 (bcrypt hash, cost=12)
INSERT INTO admins (email, password_hash)
VALUES ('omarakim2005@gmail.com', '$2b$12$z9lrqwHxXdzDtTf/gMKgVOQu8RZAS2pEGhfCdY2R1ZDP/h7Z.o2QS')
ON CONFLICT (email) DO NOTHING;
