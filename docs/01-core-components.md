# Toyga.kz — Спека компонентов `shared/ui` v2

> Опирается на токены из `00-brand-and-tokens.md`. Каждый компонент уже существует в `frontend/src/shared/ui/*` на cva — здесь описано, что меняется в вариантах/классах, а не структура файлов (её сохраняем).

## Button (`shared/ui/button`)

| Variant | Назначение | Стиль |
|---|---|---|
| `default` (primary) | Главное действие: «Подтвердить приход», «Создать приглашение» | Заливка `saukele-gold`, текст `qara-ink`, вес 600. Без градиента (градиент — это старый amber-паттерн). Hover: фон темнеет до `#A17E28`, тень `shadow-seal` появляется |
| `wine` (новый вариант) | Второе по важности действие на приглашении: «Оставить пожелание» | Контур `1.5px solid torgyn-wine`, текст `torgyn-wine` (на светлом) / `ac-parqyt` (на тёмном), заливка прозрачная → при hover заливка `torgyn-wine` 10% |
| `outline` | Второстепенные действия в кабинете | Контур `boz-dala` 1px, текст `qara-ink`/`ac-parqyt`, hover — фон `boz-dala` 8% |
| `ghost` | Табы, иконки в навбаре | Без фона, hover — фон `saukele-gold` 8% |
| `destructive` | Удаление события/гостя | Заливка `torgyn-wine` полная, текст `ac-parqyt` |
| `link` | Инлайн-ссылки в тексте | `kok-tengri`, underline-offset 4px |

Размеры без изменений (`sm/default/lg/xl/icon`), но радиус везде `rounded-xl` (0.75rem), убрать `rounded-2xl` на `xl`. `active:scale-[0.98]` оставить — единственный tactile-эффект, который держим.

Focus-ring: `ring-2 ring-[var(--color-gold)] ring-offset-2`, offset-color зависит от фона родителя (задаётся через `--tw-ring-offset-color` в обёртке секции, не хардкодить).

---

## Input / Select (`shared/ui/input`, `shared/ui/select`)

- Фон: `ac-parqyt` на светлых формах (кабинет), `rgba(244,236,216,0.06)` на тёмных (RSVP-форма прямо на приглашении).
- Граница: `1px solid boz-dala/40`, focus → `1.5px solid saukele-gold` + мягкое золотое свечение `0 0 0 3px rgba(184,144,46,0.15)`.
- Label — `text-eyebrow` токен (Forum, капс, tracking) над полем, не placeholder-only (placeholder нельзя использовать как единственный лейбл — это анти-паттерн доступности).
- Ошибка: текст под полем `torgyn-wine`, граница поля `torgyn-wine`, без красного.
- Высота полей — `h-12` (48px) на публичной RSVP-форме (крупные тач-таргеты для гостей на телефоне), `h-10` в кабинете организатора.

---

## Card (`shared/ui/card`)

Два подтипа, различай явно в API (`variant="paper" | "seal"`):

- **`paper`** (по умолчанию, кабинет/дашборд): фон `ac-parqyt`, `rounded-2xl`, тень `shadow-seal` слабая, граница `saukele-gold/12`.
- **`seal`** (карточки на самом приглашении — детали церемонии, адрес, дресс-код): фон `rgba(244,236,216,0.04)` на `qara-ink`, граница `1px solid saukele-gold/20`, верхняя золотая грань `inset 0 1px 0 rgba(184,144,46,0.25)`. Внутренний паддинг `p-6`, иконка секции — золотая обводка, не заливка.

---

## Badge (`shared/ui/badge`)

RSVP-статусы — единственное место с семантическим цветом вне палитры-по-умолчанию:

| Статус | Стиль |
|---|---|
| Подтверждено | Заливка `saukele-gold`, текст `qara-ink` |
| Ожидание | Контур `boz-dala`, текст `boz-dala` |
| Отказ | Контур `torgyn-wine`, текст `torgyn-wine` |
| Premium-шаблон | Заливка `torgyn-wine`, текст `ac-parqyt`, маленькая иконка печати слева |

---

## Avatar (`shared/ui/avatar`)

Fallback (нет фото гостя) — не инициалы на сером фоне, а инициалы на `torgyn-wine` заливке шрифтом Golos Text 600, текст `ac-parqyt`. Кольцо вокруг аватара организатора — `1.5px saukele-gold`.

---

## Modal (`shared/ui/modal`)

Оверлей: `rgba(21,17,13,0.72)` + `backdrop-blur(6px)` (не чёрный 50% — это generic). Панель модалки — `variant="paper"` карточки выше. Анимация появления: scale 0.97→1 + fade, 200ms ease-out (без bounce — люкс-бренд не «прыгает»).

---

## Toast (`shared/ui/toast`)

Фон `qara-ink`, левая грань 3px `saukele-gold` (success) / `torgyn-wine` (error) / `kok-tengri` (info) — цветная полоса-акцент вместо цветного фона целиком. Иконка соответствует полосе.

---

## Skeleton (`shared/ui/skeleton`)

Заменить серый shimmer на `boz-dala/15` базовый фон с волной `boz-dala/25`, direction зависит от языка (RTL не требуется, но учитывать для будущего arabic-контента шаблонов).

---

## Общее для всех интерактивных компонентов

- Disabled-состояние: `opacity-40`, курсор `not-allowed`, никаких серых перекрасок — сохраняем цвет варианта с прозрачностью.
- `prefers-reduced-motion`: все transition/scale-эффекты выше — отключить transform, оставить только opacity-переходы 120ms.
