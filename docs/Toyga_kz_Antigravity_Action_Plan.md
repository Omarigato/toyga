# Toyga.kz Migration & New Architecture Action Plan

## Purpose

Этот документ предназначен для Antigravity / AI Developer Agent.

Цель:
перестроить существующий проект Toyga.kz с текущей архитектуры на новую production-ready архитектуру, используя новый дизайн Stitch, новую бизнес-логику SaaS платформы и правильную структуру базы данных.

Важно:

- Проект еще не имеет production версий.
- Нет необходимости делать миграцию версий.
- Нужно провести архитектурный рефакторинг с текущего состояния.
- Сначала провести анализ существующего проекта.
- Затем создать план действий.
- После согласования реализовать новую архитектуру.

---

# 1. Current Project Analysis Phase

Перед изменениями необходимо изучить:

## Existing Code

Проверить:

- текущую структуру frontend
- текущую структуру backend
- используемый стек
- зависимости
- API
- сервисы
- компоненты
- состояние проекта


## Existing Database

Проверить:

- текущие таблицы
- связи
- индексы
- ограничения
- существующие данные


Создать документ:

CURRENT_ARCHITECTURE_ANALYSIS.md


С описанием:

- что есть сейчас
- что нужно удалить
- что можно сохранить
- что нужно переписать


---

# 2. New Target Architecture

Создать новую архитектуру:

## Backend

Technology:

- Python
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Redis
- Celery


Architecture:

Clean Architecture


Structure:

backend/

    app/

        domain/

        application/

        infrastructure/

        presentation/

        shared/


Принципы:

SOLID

DRY

KISS


---

# 3. Frontend New Architecture

Technology:

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- React Query


Structure:

frontend/

    app/

    components/

    features/

    entities/

    shared/

    services/


---

# 4. New Product Modules

Создать модули:


## Authentication

Поддержка:

- WhatsApp OTP
- Email/password
- Google OAuth


## User Dashboard

- мероприятия
- гости
- оплаты
- настройки


## Event Management

Создание:

- свадьба
- қыз ұзату
- құдалық
- ауызашар
- другие мероприятия


## Template Marketplace

Каждый шаблон имеет:

- категорию
- цену
- скидку
- демо страницу
- дизайн конфигурацию
- анимации


Нет подписочной модели.


---

# 5. Invitation Engine

Создать новый движок приглашений.


Поддержка:

Общая ссылка:

toyga.kz/i/{event_slug}


Персональная:

toyga.kz/i/{event_slug}/{guest_slug}


Переменные:

{guest_name}

{event_name}

{date}

{location}


---

# 6. Invitation Builder Flow


Создать пошаговый редактор:


1. Category

2. Template

3. Design customization

4. Text editing

5. Date and location

6. Music

7. Gallery

8. Program

9. Guests

10. Preview

11. Payment

12. Publish


Каждый шаг:

- автосохранение
- назад
- далее
- предпросмотр
- редактирование


---

# 7. Guest CRM


Функции:

- импорт Excel
- создание персональных ссылок
- RSVP
- статистика


Статусы:

- accepted
- declined
- pending


---

# 8. Admin Panel


Создать:

/admin


Разделы:

Dashboard

Users

Events

Templates

Categories

Payments

Media

Music

Notifications


---

# 9. Database Redesign


Создать новую PostgreSQL архитектуру.

Основные сущности:


users

roles

events

event_categories

templates

template_assets

template_versions

event_designs

guests

invitation_links

rsvp_answers

media

music

program_items

locations

payments

notifications

audit_logs


Перед созданием:

создать ER диаграмму.

---

# 10. Design Integration

Использовать новый дизайн Stitch.


Основные требования:

- Apple premium style
- Luxury wedding style
- mobile first
- animations
- live preview


---

# 11. Stitch Design Reference

# Toyga.kz Design System
Category:
Luxury Digital Invitation SaaS Platform
Product:
Create premium animated wedding and event invitations.
# Visual Direction
Design language:
Apple premium minimalism mixed with luxury wedding aesthetics.
The interface should feel:
- elegant
- emotional
- premium
- modern
- trustworthy
Reference:
Apple.com
Canva editor
Luxury wedding websites
Modern SaaS dashboards
# Brand Personality
Keywords:
Luxury
Romantic
Premium
Clean
Elegant
Modern
Kazakh culture
Celebration
# Color System
Primary Background:
#FFFFFF
Soft Background:
#F7F7F8
Dark Premium:
#111111
Gold Accent:
#C9A227
Rose Gold:
#D8A39D
Action Blue:
#0071E3
Text:
#1D1D1F
Secondary Text:
#6E6E73
# Typography
Headings:
Elegant serif font
Examples:
Playfair Display
Cormorant Garamond
UI:
Inter
SF Pro style
Hero:
64-80px
Section:
40-48px
Body:
16-18px
# UI Style
Cards:
Border radius:
24px
Soft shadows
Minimal borders
Buttons:
Rounded pill buttons
Height:
48-56px
Primary:
Gold gradient
Secondary:
Black
# Main Application Screens
## Landing Page
Sections:
Hero:
"Создайте уникальное приглашение на ваш той"
Large cinematic wedding image
Animated background
CTA:
Создать приглашение
Categories:
Үйлену той
Қыз ұзату
Құдалық
Ауызашар
Тұсаукесер
Template showcase carousel
Pricing
Testimonials
# Customer Dashboard
Modern SaaS dashboard.
Sidebar:
Мои мероприятия
Гости
Шаблоны
Платежи
Настройки
Main:
Event cards:
Photo preview
Event name
Guest statistics
Invitation link
# Create Invitation Wizard
Multi-step beautiful wizard.
Progress indicator:
1 Категория
2 Дизайн
3 Цвет
4 Тексты
5 Дата и место
6 Музыка
7 Галерея
8 Программа
9 Гости
# Template Marketplace
Like Canva.
Cards:
Large preview
Animation preview
Price
Premium badge
Actions:
Demo
Choose template
# Design Editor
Canvas based editor.
Left:
Components
Middle:
Live invitation preview
Right:
Settings panel
Controls:
Change colors
Fonts
Background
Cover image
Music
Animation
# Personal Invitation Page
Example:
toyga.kz/i/omar-marzhan/erzhan
Design:
Full screen mobile first
Content:
Photo
Greeting:
"Уважаемый Ержан"
Event information
Buttons:
Приду
Не смогу
Comment field
# CRM Guest Management
Table:
Name
Phone
Status
Guests count
Answer date
Filters:
Coming
Not coming
No answer
# Admin Panel
Manage:
Users
Templates
Categories
Payments
Music
Media
# Animation System
Use:
Lottie
GSAP
Framer Motion
Effects:
Envelope opening
Fade animations
Floating particles
Parallax images
Smooth transitions
# Responsive
Mobile first.
Support:
iPhone
Android
Tablet
Desktop
# Components
Navbar
Sidebar
Cards
Modal
Wizard Steps
Template Cards
Invitation Preview
Guest Table
Analytics Cards
# Design Principles
Do:
Premium whitespace
Beautiful typography
Smooth animation
Emotional experience
Don't:
Heavy colors
Complex UI
Cheap gradients
Too many borders
# Overall Feeling
Opening Toyga.kz should feel like opening a premium wedding invitation.


---

# 12. Migration Strategy

Этапы:


## Phase 1

Анализ текущего проекта.


## Phase 2

Создание новой структуры.


## Phase 3

Создание новой базы данных.


## Phase 4

Создание backend modules.


## Phase 5

Создание frontend.


## Phase 6

Интеграция дизайна.


## Phase 7

Testing.


## Phase 8

Deployment.


---

# 13. Expected Result

После выполнения:

Получить полноценную production архитектуру Toyga.kz:

- современный frontend
- чистый backend
- нормальная БД
- редактор приглашений
- marketplace шаблонов
- CRM гостей
- admin panel
- готовность к запуску SaaS продукта

