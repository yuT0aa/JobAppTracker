# CareerTrack

CareerTrack is a polished job-search workspace for tracking applications, companies, interviews, tasks, reminders, contacts, documents, notifications, and pipeline analytics.

## Stack

- Next.js App Router and React
- TypeScript, Tailwind CSS, and shadcn/ui primitives
- NextAuth credentials authentication
- Prisma ORM with PostgreSQL
- Vitest unit tests and Playwright browser tests
- Docker Compose for local PostgreSQL and application startup

## Local development

### Requirements

- Node.js 20+
- npm 10+
- PostgreSQL 16+, or Docker Desktop

### Environment

```bash
copy .env.example .env.local
```

Set `DATABASE_URL`, `NEXTAUTH_URL`, and a strong `NEXTAUTH_SECRET` in `.env.local`.

### Install and migrate

```bash
npm ci
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open <http://localhost:3000>.

The seed creates demo accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@careertrack.local` | `Admin123!` |
| User | `demo@careertrack.local` | `User123!` |

Do not use these credentials outside local development.

## Docker Compose

Compose starts PostgreSQL, waits for its health check, applies committed migrations, seeds demo data, and starts the standalone Next.js server.

```bash
docker compose up --build
```

Open <http://localhost:3000>. Stop the stack with `docker compose down`; add `-v` only when you intentionally want to remove the database volume.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The Playwright suite verifies every page route, the health endpoint, and unauthenticated API protection. In CI, Chromium is installed with `npx playwright install --with-deps chromium`.

## Database commands

```bash
npx prisma studio
npx prisma migrate dev --name describe-your-change
npx prisma migrate deploy
npm run db:seed
```

Never run destructive database commands against production without a backup and explicit approval.

## Production configuration

Set a managed PostgreSQL `DATABASE_URL`, a stable HTTPS `NEXTAUTH_URL`, and a cryptographically random `NEXTAUTH_SECRET`. Build with `npm run build` and run with `npm start`, or deploy the generated standalone image with Docker.

## CI

`.github/workflows/ci.yml` starts PostgreSQL, applies migrations, seeds the database, runs lint/typecheck/unit tests, builds the app, installs Chromium, and runs Playwright E2E tests.
