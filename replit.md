# Omni Shift AI

Omni Shift AI is a directory of AI tools — browse, search, and compare tools by category and pricing.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at `/api`)
- `pnpm --filter @workspace/omni-shift-ai run dev` — run the web frontend (served at `/`)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed the database with sample categories and tools
- Required env: `DATABASE_URL` — Postgres connection string
- Apps run via Replit workflows (`artifacts/api-server: API Server`, `artifacts/omni-shift-ai: web`), not root-level `pnpm dev`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Web: Vite + React + wouter (ported from an imported Next.js/Vercel app)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/omni-shift-ai` — the directory web app (frontend)
- `artifacts/api-server` — Express API (`/categories`, `/tools`, `/stats` routes)
- `lib/api-spec/openapi.yaml` — source of truth for the API contract
- `lib/db/src/schema` — Drizzle schema for categories and tools
- `scripts/src/seed.ts` — sample data seeder
- `admin-panel/` — a standalone Next.js admin app from the original Vercel project. Not part of the pnpm workspace; run and deploy it independently.

## Architecture decisions

- The app was imported from Vercel as Next.js and ported to Vite + React + wouter to run as a Replit artifact (Next.js isn't a supported artifact type).
- `admin-panel/` was intentionally left outside the workspace — it's a separate standalone app from the original project, not wired to the shared API/DB here.

## Product

- Home page: search/filter AI tools by category, pricing, and sort.
- `/categories`: browse all categories.
- `/categories/:slug`: tools within a category.
- `/tools/:slug`: tool detail page.
- `/new`, `/blog`, `/about`, `/contact`, `/privacy`, `/terms`, `/favorites`, `/bookmarks`: supporting pages.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- If artifacts exist on disk with `.replit-artifact/artifact.toml` but don't show up in `listArtifacts()` (e.g. after a fresh import), re-registering them via `verifyAndReplaceArtifactToml` (rewriting the same toml content) restores them and their workflows — no need to delete/recreate.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
