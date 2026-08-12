<p align="center">
  <img src="docs/logo-dark.png" width="120" alt="Word Memo logo" />
</p>

<h1 align="center">Word Memo Backend</h1>

<p align="center">
  NestJS API для приложения изучения иностранных слов.<br />
  PostgreSQL · Prisma · Docker
</p>

## Требования

- Node.js 22+
- npm
- Docker + Docker Compose (для Postgres / полного стека)

## Быстрый старт (локальная разработка)

### 1. Клонировать и установить зависимости

```bash
npm install
```

`postinstall` сам выполнит `prisma generate`.

### 2. Настроить окружение

```bash
cp .env.example .env
```

Проверь значения в `.env` (как минимум `PORT`, `DATABASE_URL`, креды Postgres).

### 3. Поднять Postgres

```bash
npm run docker:db
```

### 4. Применить миграции (если уже есть)

```bash
npm run prisma:deploy
```

Если миграций ещё нет — см. раздел [Prisma](#prisma) ниже.

### 5. Запустить API

```bash
npm run start:dev
```

Приложение слушает `PORT` из `.env` (по умолчанию `http://localhost:3000`).

---

## Запуск через Docker (API + DB)

```bash
cp .env.example .env
npm run docker:up
```

Полезные команды:

| Команда | Что делает |
| --- | --- |
| `npm run docker:up` | Собрать и поднять `api` + `db` |
| `npm run docker:db` | Только Postgres |
| `npm run docker:logs` | Логи стека |
| `npm run docker:down` | Остановить стек |

В контейнере API `DATABASE_URL` указывает на хост `db` (сервис Compose). Локально в `.env` — на `localhost`.

---

## Prisma

Схема: `prisma/schema.prisma`  
Клиент генерируется в `src/generated/prisma` (в git не коммитится).

### Генерация клиента

Нужна после изменений схемы, после `npm install`, или если папки `src/generated/prisma` нет:

```bash
npm run prisma:generate
```

Эквивалент: `npx prisma generate`.

### Миграции (разработка)

Алгоритм после правки `prisma/schema.prisma`:

1. Убедись, что Postgres запущен и `DATABASE_URL` в `.env` верный.
2. Создай и примени миграцию:

```bash
npm run prisma:migrate
```

или с именем:

```bash
npx prisma migrate dev --name describe_your_change
```

3. Prisma:
   - сравнит схему с БД;
   - создаст SQL в `prisma/migrations/...`;
   - применит миграцию к БД;
   - заново сгенерирует клиент.

4. Закоммить и схему, и папку `prisma/migrations`.

### Миграции (уже существующая БД / CI / prod)

Только применить уже созданные миграции, без интерактива:

```bash
npm run prisma:deploy
```

### Studio (опционально)

UI для просмотра данных:

```bash
npm run prisma:studio
```

### Чеклист после изменения схемы

1. Правишь `prisma/schema.prisma`
2. `npm run prisma:migrate` (dev) → миграция + generate
3. Проверяешь типы / код под новые модели
4. Коммитишь `schema.prisma` + `prisma/migrations/**`

Если миграцию создавать не нужно (только перегенерировать клиент после pull):

```bash
npm run prisma:generate
```

---

## Скрипты npm

| Скрипт | Описание |
| --- | --- |
| `npm run start:dev` | Dev-сервер с watch |
| `npm run start:prod` | Prod из `dist` |
| `npm run build` | Сборка Nest |
| `npm run prisma:generate` | Генерация Prisma Client |
| `npm run prisma:migrate` | `migrate dev` |
| `npm run prisma:deploy` | `migrate deploy` |
| `npm run prisma:studio` | Prisma Studio |
| `npm run docker:up` | Docker: api + db |
| `npm run docker:db` | Docker: только db |
| `npm run docker:down` | Остановить Docker |
| `npm run docker:logs` | Логи Docker |
