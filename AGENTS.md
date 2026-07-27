# Chongkran

Full-stack recipe web app. Single Nuxt 4 deploy — Nitro server routes + Vue client, backed by Postgres (Drizzle), Redis (Better-Auth secondary storage), Vercel Blob, and Resend.

## Commands

| Command                                      | What                                                                                                                                            |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `bun dev`                                    | Dev server (http://localhost:3000)                                                                                                              |
| `bun build` / `bun generate` / `bun preview` | Production / static / preview                                                                                                                   |
| `bun predeploy`                              | `bun hub:db:migrate && bun build` — run before deploy                                                                                           |
| `bun lint` / `bun lint:fix`                  | oxlint (`oxlint.config.ts`)                                                                                                                     |
| `bun fmt` / `bun fmt:check`                  | oxfmt (`oxfmt.config.ts`, 2-space, double quotes, trailing commas, 100 char)                                                                    |
| `bun typecheck`                              | `nuxt typecheck` (run before opening a PR — catches the class of bugs that lint/fmt miss)                                                       |
| `bun test`                                   | All Vitest projects                                                                                                                             |
| `bun test:unit`                              | Pure-function tests, ~150 ms total                                                                                                              |
| `bun test:nuxt`                              | Server-handler tests under Nuxt, **runs serially via `--no-file-parallelism`** (~5 min) — see Testing below                                     |
| `bunx nuxt db generate`                      | Regenerate Drizzle migration from `server/db/schema.ts` (NuxtHub writes to `server/db/migrations/postgresql/`). **Never hand-roll migrations.** |
| `bunx nuxt db migrate`                       | Apply pending migrations                                                                                                                        |
| `bun hub:task db:seed`                       | Run the seed task (creates `admin@chongkran.com` / `Password123!`)                                                                              |
| `bun docker-compose up -d`                   | Start Postgres + Redis                                                                                                                          |

## Architecture

- **Single-tier Nitro server**: `server/api/<module>/<route>.{get,post,put,patch,delete}.ts` talks directly to Drizzle/Postgres. There is no BFF proxy layer. Better-Auth auto-mounts `/api/auth/*`.
- **Better-Auth** config: `server/auth.config.ts` (defineServerAuth) and `app/auth.config.ts` (defineClientAuth with `adminClient()`). Auto-imports: `requireUserSession(event)`, `requireAdmin(event)`, `requireRole(event, role[])`, `refreshSessionCookieCache(event)` (server); `useUserSession()` (client).
- **Sessions** in Postgres `session` table with Redis secondary storage (`auth.hubSecondaryStorage: true`).
- **Route protection** is declarative in `nuxt.config.ts → routeRules`:
  - `/admin/**` → admin only; `/profile/**`, `/meal-plans/**`, `/shopping-lists/**` → auth required; `/auth` → guest only.
  - `app/middleware/auth.global.ts` is the public-route allow-list (`/`, `/recipes/*`, `/categories/*`) since `routeRules` has no "public" mode.

## Database

- Schema lives in `server/db/schema.ts` — single source of truth.
- **Import the Better-Auth tables** via `import { account, session, user } from "#auth/schema"` (virtual module provided by `@onmax/nuxt-better-auth`) so app tables can FK into `user.id`.
- Denormalized counters on `user` (`followers_count`, `following_count`, `recipes_count`, `total_views`, `total_likes`) — updated transactionally in `follows/[id]` handlers. Use `GREATEST(count - 1, 0)` on unfollow to avoid negative drift.
- Denormalized `author_name` / `author_avatar` / `author_bio` on `recipes` (set on POST so list reads don't need a JOIN).
- `relations()` helpers in `schema.ts` — use them for future relational queries.

## Server Utilities (auto-imported)

- `requireAdmin(event)` / `requireRole(event, role | role[])` — wraps `requireUserSession` with role matchers.
- `createResponse()` envelope: Success → `ApiResponse<T>`, error → `ApiResponse<never>` (assignable to `ApiResponse<T>`).
- `clampLimit(raw, { default, max })` / `clampOffset(raw)` — `DEFAULT_LIMIT=60`, `MAX_LIMIT=200`.
- `aggregateLikesForRecipes(ids)` → `Map<id, { count, userIds }>` in one IN query.
- `formatRecipeResponse(row, likes?)` / `formatReviewResponse(row, extras?)` / `formatUserResponse(row)` — nullables → undefined, timestamps → ISO, denormalized fields preserved.
- `sendVerificationEmail` / `sendPasswordResetEmail` via Resend. `escapeHtml()` for safety. Console.warn fallback when `NUXT_RESEND_API_KEY` is empty.

## Conventions and Gotchas

- **`noUncheckedIndexedAccess: true`** (in `.nuxt/tsconfig.json`): array index access returns `T | undefined`. After `const [row] = await db.update(...).returning()`, `row` is `T | undefined` — always guard before use.
- **`requireRole(event, [Role.Admin, Role.Author])`** uses the `Role` enum from `shared/types`. Literal `["admin", "author"]` doesn't widen — TS complains. Don't use `useUser()` — it's gone; use `useUserSession()` from `@onmax/nuxt-better-auth`.
- **`AuthUser.image`** is the avatar field, not `avatar`. For `<UAvatar :src>`, coalesce nulls: `:src="user.image ?? undefined"`.
- **Vue templates don't parse `??` inside `:attr` template literals.** Use a `displayName` computed in `<script setup>` instead of `${user.firstName ?? ""} ${user.lastName ?? ""}` inline.
- **`UForm` nesting** for array items: `<UForm :schema="itemSchema" :name="`items.${index}`" nested>`. Parent schema must not include nested fields; use a `validate` function for array-level constraints.
- **`USelectMenu value-key="id"`** — Drizzle serializes IDs as `text`, not `_id`.
- **`UPagination v-model:page`** — Nuxt UI v4 (not `v-model`).
- **Use Nuxt UI semantic colors** (`text-default`, `bg-elevated`, `border-muted`), never raw Tailwind palette colors.
- **Zod v4** (`zod@^4.3.6`): API differs from v3 (`z.string("message")` for invalid_type, new refinement syntax). Check existing handlers before writing new schemas.
- **Adding an `/admin/*` route** requires updating the `navItems` array in `app/layouts/admin.vue`.

## Testing

- **3 Vitest projects** (`vitest.config.ts`): `unit` (`test/unit/`, node env), `e2e` (`test/e2e/`, currently empty), `nuxt` (`test/nuxt/`, full Nuxt runtime via `@nuxt/test-utils/e2e`).
- **`.env.test`** is committed with placeholder secrets (Better-Auth + NuxtHub read it on Nuxt boot).
- **`bun:test` stub** (`test/stubs/bun-test.ts` aliased via `vitest.config.ts → resolve.alias`) — Vite tries to bundle `bun:test` when `process.versions.bun` is set; the stub makes it resolvable under Node. Don't delete.
- **`bun test:nuxt`** must serialize (`--no-file-parallelism` is in the npm script): each test file spins up its own Nitro server on port 3000; parallel runs collide on the port.
- Test workflow: `bun test:unit` before pushing (fast), `bun test:nuxt` before opening a PR (slow).

## Git

- `main` — default branch (`origin/HEAD`)
- `develop` — development branch (current work lives here)

## .gitignore excludes

`.github/`, `.claude/`, `CLAUDE.md`, `docs/PORT_PLAN.md` (do not commit — it's the historical port plan).

## `../chongkran-backend`

Kept frozen as historical reference. **Do not add new code there.** All endpoints it used to serve are now Nitro handlers in `server/api/`. Per-module `*.controller.ts` / `*.service.ts` files there are the source of truth for original request/response shapes.

## OpenCode

`opencode.json` enables remote MCP servers for Nuxt (`https://nuxt.com/mcp`) and Nuxt UI (`https://ui.nuxt.com/mcp`).
