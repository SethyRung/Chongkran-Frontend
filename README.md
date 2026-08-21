# Chongkran

A recipe web application for browsing, creating, and sharing recipes. Built as a single full-stack [Nuxt 4](https://nuxt.com) deployment: Nitro server routes replace the previous NestJS proxy layer, Postgres + Drizzle replace MongoDB + Mongoose, Better-Auth replaces JWT cookies, and Vercel Blob replaces Cloudinary.

## Features

- Home page with featured and popular recipes, plus live counts (recipes, categories, authors)
- Search and filtering by recipe name, category, and ingredients
- Detailed recipe pages with steps, ingredients, and reviews
- Authenticated recipe authoring, editing, and deletion
- Favorites for saving recipes
- Per-user shopping list (auto-created on first request)
- Weekly meal planner
- Email/password authentication with email verification
- Author-request flow with admin approval
- Roles: `user` (default), `author` (creates recipes), `admin` (approves and moderates)
- TipTap rich text editor for recipe creation
- Responsive, mobile-first layout with dark mode support

## Tech Stack

| Layer           | Technology                                                         |
| --------------- | ------------------------------------------------------------------ |
| Framework       | Nuxt 4 (Vue 3, hybrid rendering, auto-imports)                     |
| Server          | Nitro (replaces the NestJS backend)                                |
| Styling         | Tailwind CSS v4, Nuxt UI v4                                        |
| State           | Pinia                                                              |
| Database        | Postgres 18 via NuxtHub                                            |
| ORM             | Drizzle ORM (schema-first; migrations via `bunx nuxt db generate`) |
| Auth            | Better-Auth with email verification + admin plugin                 |
| Session storage | Postgres `session` table (Better-Auth)                             |
| File uploads    | Vercel Blob                                                        |
| Email           | Resend (verification + password reset)                             |
| Deployment      | Vercel                                                             |

## Installation

### Prerequisites

- [Bun](https://bun.sh) 1.1 or later (primary package manager)
- Docker and Docker Compose (for local Postgres)
- A Vercel account (only required for blob uploads in production; locally any token works)

### Steps

1. Clone the repository:

   ```sh
   git clone https://github.com/SethyRung/chongkran.git
   cd chongkran
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Create the local environment file:

   ```sh
   cp .env.example .env
   ```

   At minimum, replace `NUXT_BETTER_AUTH_SECRET` with a random 32-byte string. The other placeholders work for local development.

4. Start the local services:

   ```sh
   bun docker-compose up -d
   ```

   This brings up Postgres 18 (port 5432) using the credentials from `.env`.

5. Apply database migrations:

   ```sh
   bunx nuxt db migrate
   ```

   For the dev workflow where NuxtHub auto-generates migrations on first boot:

   ```sh
   bun dev
   ```

6. (Optional) Seed the database:

   ```sh
   bun hub:task db:seed
   ```

   Creates `admin@chongkran.com` (password `Password123!`) and a demo user so the admin pages have someone to sign in as.

7. Run the development server:

   ```sh
   bun dev
   ```

   The app is available at http://localhost:3000.

## Development Commands

### Application

| Command         | Description                       |
| --------------- | --------------------------------- |
| `bun dev`       | Dev server with HMR               |
| `bun build`     | Production build                  |
| `bun generate`  | Static site generation            |
| `bun preview`   | Preview production build          |
| `bun predeploy` | `bun hub:db:migrate && bun build` |
| `bun typecheck` | `nuxt typecheck`                  |

### Quality

| Command         | Description          |
| --------------- | -------------------- |
| `bun lint`      | oxlint check         |
| `bun lint:fix`  | oxlint with auto-fix |
| `bun fmt`       | oxfmt write          |
| `bun fmt:check` | oxfmt check          |

### Tests

| Command         | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `bun test`      | All Vitest projects (unit + e2e + nuxt)                              |
| `bun test:unit` | Pure-function unit tests (fast, ~150 ms)                             |
| `bun test:nuxt` | Server-handler tests under the Nuxt environment (~5 min, serialized) |

### Database

| Command                 | Description                                             |
| ----------------------- | ------------------------------------------------------- |
| `bunx nuxt db generate` | Regenerate Drizzle migration from `server/db/schema.ts` |
| `bunx nuxt db migrate`  | Apply pending migrations                                |
| `bun hub:task db:seed`  | Run the seed task                                       |

### Local services

| Command                    | Description                           |
| -------------------------- | ------------------------------------- |
| `bun docker-compose up -d` | Start Postgres                        |
| `bun docker-compose down`  | Stop them (add `-v` to clear volumes) |

## Project Structure

```
chongkran/
  app/
    app.vue                   Root application component
    auth.config.ts            Better-Auth client config (defineClientAuth)
    layouts/                  default / auth / admin
    pages/                    File-based routing
    components/               Global components (auto-imported)
    composables/              useApi, useFetchApi, useUserSession
    middleware/               auth.global.ts (public-route allow-list)
    plugins/                  fetch.ts (custom $fetch)
    assets/css/               Tailwind entry + custom scrollbar styles
  server/
    auth.config.ts            Better-Auth server config (defineServerAuth)
    api/                      Nitro endpoints (replaces NestJS controllers)
      categories/             CRUD
      recipes/                CRUD + engagement + author views + popular (15 handlers)
      reviews/                CRUD + admin global (6 handlers)
      favorites/              CRUD + check (4 handlers)
      follows/                follow/unfollow + lists + stats (6 handlers)
      users/                  CRUD + authors + author-requests (14 handlers)
      meal-plans/             CRUD (5 handlers)
      shopping-lists/         One list per user (4 handlers)
      upload/                 Vercel Blob upload
      admin/                  stats.get.ts
      stats.get.ts            Public homepage counts (recipes, categories, authors)
    db/
      schema.ts               Drizzle schema (single source of truth)
      migrations/postgresql/  Auto-generated migrations
    tasks/db/seed.ts          Nitro task
    utils/                    auto-imported: auth, email, pagination, recipe, response, review, user
  shared/
    types/index.ts            ApiResponse, ApiResponseCode, Role, Recipe, Review, etc.
    utils/index.ts            isSuccessResponse type guard
  docs/PORT_PLAN.md           Phase-by-phase port plan (gitignored)
  public/                     Static assets + Geist fonts
  nuxt.config.ts              Nuxt configuration
  docker-compose.yml          Postgres only
  vitest.config.ts            3 projects: unit / e2e / nuxt
  .env.test                   Test-only env defaults (committed)
```

## Authentication and Authorization

- **Better-Auth** replaces the previous JWT proxy layer.
- **Email verification** is required before sign-in is allowed (MVP gate).
- **Sessions** are stored in the Postgres `session` table; Better-Auth reads them directly with no secondary storage.
- **Roles** are stored as a `role` text column on `user` (`'user' | 'author' | 'admin'`).
- **Route protection** is declarative in `nuxt.config.ts → routeRules`:

  | Path                 | Required role          |
  | -------------------- | ---------------------- |
  | `/admin/**`          | `admin`                |
  | `/profile/**`        | any authenticated user |
  | `/meal-plans/**`     | any authenticated user |
  | `/shopping-lists/**` | any authenticated user |
  | `/auth`              | guest only             |

  `app/middleware/auth.global.ts` adds the public-route allow-list (`/`, `/recipes/*`, `/categories/*`) since `routeRules` has no "public" mode.

## Database

- **Drizzle ORM** with **Postgres 18** via NuxtHub's `hub.db` block.
- **Schema** in `server/db/schema.ts` is the single source of truth.
- **Migrations** auto-generated by `bunx nuxt db generate` and written to `server/db/migrations/postgresql/`. Do not hand-roll.
- **Tables**:
  - Better-Auth: `user`, `session`, `account`, `verification`
  - App: `categories`, `recipes`, `recipe_likes`, `reviews`, `favorites`, `follows`, `meal_plans`, `shopping_lists`
- **Denormalized counters** on `user`: `followers_count`, `following_count`, `recipes_count`, `total_views`, `total_likes`. Updated transactionally in `follows/` handlers (`GREATEST(count - 1, 0)` on unfollow to avoid negative drift).
- **Denormalized fields** on `recipes`: `author_name`, `author_avatar`, `author_bio` (set on POST so list reads don't need a JOIN).
- **`#auth/schema`** virtual import (provided by `@onmax/nuxt-better-auth`) re-exports the Better-Auth tables so `server/db/schema.ts` can FK into `user.id`.

## File Uploads

- **Vercel Blob** (`@vercel/blob`) handles recipe image uploads.
- **Endpoint**: `POST /api/upload` (multipart) returns `{ public_id, url }`.
- **Token**: `BLOB_READ_WRITE_TOKEN` from env. Production requires a real Vercel Blob token; locally any non-empty value works.

## Deployment

### Build

```sh
bun predeploy
```

This runs migrations against the production database, then builds the Nuxt app. Deploy the `.output` directory to Vercel or any Nitro-compatible host.

### Required Environment Variables

| Variable                  | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `DATABASE_URL`            | Postgres connection string (Neon or any Postgres) |
| `NUXT_BETTER_AUTH_SECRET` | Random 32-byte secret                             |
| `NUXT_PUBLIC_SITE_URL`    | `https://your-domain.com`                         |
| `NUXT_RESEND_API_KEY`     | Resend API key (verified domain required)         |
| `NUXT_RESEND_FROM_EMAIL`  | `Chongkran <noreply@your-domain.com>`             |
| `BLOB_READ_WRITE_TOKEN`   | Vercel Blob token                                 |

## License

MIT License. See [LICENSE](./LICENSE).

## Contributing

Contributions are welcome. Open an issue or submit a pull request.

### Development Guidelines

- Follow the existing code style. Run `bun fmt` before committing.
- TypeScript is required. `bun typecheck` must pass.
- Use Nuxt UI components for consistency.
- Run `bun lint && bun fmt:check && bun test:unit` before opening a pull request.
- For server-handler changes, also run `bun test:nuxt` (slower; serializes to avoid port collisions).
- Update documentation as needed.

## Contact

**rungsethyhk@gmail.com** — or open an issue on GitHub.
