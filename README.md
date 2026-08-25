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

Для staging (DigitalOcean managed Postgres) CA из панели DO закодируй в одну строку и положи в `DATABASE_SSL_CA_B64`:

```bash
base64 -i ca-certificate.crt | tr -d '\n'
```

Файл сертификата в репозиторий и образ не клади. Локально переменная не нужна.

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

## Staging deploy (DigitalOcean Droplet)

Merge в `main` (или ручной Run workflow): GitHub Actions собирает образ, пушит в GHCR (`ghcr.io/word-memo/word-memo-backend`), Droplet только `docker pull` + `up`. `.env` на сервере не трогает. Контейнер сам делает `prisma migrate deploy` на старте.

Org: Settings → Actions → General → Workflow permissions = **Read and write**. Иначе пуш в GHCR падает.

### Один раз на Droplet

```bash
apt-get update && apt-get install -y rsync
# .env уже лежит в /root/opt/word-memo-backend
```

Ключ только для GitHub Actions (на своём Mac):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github-actions-droplet -N ""
ssh-copy-id -i ~/.ssh/github-actions-droplet.pub root@<DROPLET_IP>
```

### Secrets в GitHub

Repo → Settings → Secrets and variables → Actions:

| Secret | Значение |
| --- | --- |
| `DROPLET_HOST` | IP Droplet |
| `DROPLET_USER` | `root` |
| `DROPLET_SSH_KEY` | содержимое `~/.ssh/github-actions-droplet` (приватный ключ, целиком) |

Приватный ключ в git не клади. Сначала добавь secrets, потом мержи в `main`.

---

## Path aliases

| Alias | Path |
| --- | --- |
| `@/*` | `src/*` |
| `@modules/*` | `src/modules/*` |
| `@prisma/*` | `src/prisma/*` |
| `@generated/*` | `src/generated/*` |

Example: `import { PrismaService } from '@prisma/prisma.service'`.

`tsc-alias` rewrites aliases in `dist` after build (needed for Node runtime).

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
