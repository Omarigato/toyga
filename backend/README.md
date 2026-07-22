# TOYGA.KZ — Official Backend API

Официальный бэкенд платформы цифровых пригласительных **Toyga.kz**.

## Технологический стек

- **Фреймворк**: FastAPI (Python 3.12+)
- **ORM**: SQLAlchemy 2.0 (Async) + Alembic
- **Драйвер БД**: `asyncpg` / `psycopg2-binary`
- **База данных**: PostgreSQL 16
- **Аутентификация**: JWT (OAuth2 Password Bearer) + Passlib (bcrypt)
- **Валидация**: Pydantic v2
- **Документация**: Swagger / OpenAPI по адресу `/docs` и `/redoc`

## Структура проекта

```
backend/
├── app/
│   ├── api/ v1/                   # Эндпоинты (auth, users, events, templates, guests, payments, media, admin)
│   ├── core/                      # Конфигурация (config.py), безопасность (security.py), БД (database.py)
│   ├── models/                    # SQLAlchemy 2.0 ORM модели
│   ├── schemas/                   # Pydantic v2 схемы
│   ├── services/                  # Бизнес-логика (auth, events, guests, payments, media)
│   └── main.py                    # Инициализация FastAPI приложения
├── tests/                         # Pytest тесты
├── Dockerfile                     # Docker контейнеризация
├── docker-compose.yml             # Сервисы (API, PostgreSQL, Redis)
└── requirements.txt               # Зависимости Python
```

## Быстрый запуск

### 1. Переменные окружения
Создайте `.env` файл на основе `.env.example`:
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=toyga_db
SECRET_KEY=YOUR_SECURE_GENERATED_JWT_SECRET
```

### 2. Запуск через Docker Compose
```bash
docker-compose up --build -d
```

### 3. Локальный запуск (без Docker)
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
