# Omni Shift AI

A modern AI tools directory — browse, search, and compare AI apps by category and pricing, with a fast, SEO-friendly, mobile-responsive UI.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (Supabase-compatible schema; can migrate to Supabase Postgres later without code changes)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Frontend: React + Vite (requested Next.js 15, but the platform only supports React+Vite artifacts — explained to user as the fast/SEO-friendly alternative), wouter routing, TanStack Query, shadcn/ui, Tailwind
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — source of truth for all API contracts (categories, tools, stats)
- `lib/db/src/schema/categories.ts`, `tools.ts` — Drizzle schema (tools have FK to categories, pricing enum Free/Freemium/Paid)
- `artifacts/api-server/src/routes/` — categories, tools (search/filter/sort/paginate), stats endpoints
- `artifacts/omni-shift-ai/src/pages/` — home.tsx (hero, categories, featured, filterable grid), tool-detail.tsx, category-detail.tsx
- `artifacts/omni-shift-ai/src/components/tool-card.tsx`, `layout/navbar.tsx`, `layout/footer.tsx`, `theme-provider.tsx`, `seo.tsx`

## Architecture decisions

- Tool logos use the public Clearbit Logo API (`logo.clearbit.com/<domain>`) keyed off each tool's real website domain, with a graceful initials-avatar fallback (`onError`) if a logo fails to load.
- Category icons are Lucide icon names stored as strings in the DB, resolved client-side via a small icon-name map (`lib/category-icons.tsx`) rather than storing SVGs.
- `ToolCard` uses a clickable div + `useLocation().navigate` (not a wrapping `<Link>`) so the external "Open Website" anchor and the internal name link can coexist without invalid nested `<a>` tags.
- Sort parameter values are `popular | newest | name` (not `rating`) to match the OpenAPI enum.

## Product

- Directory homepage: hero with search, live stats, category grid, featured tools, filterable/sortable/paginated all-tools grid.
- Tool detail page: full description, tags, related tools in the same category, "Open Website" CTA.
- Category detail page: filtered/sorted tool grid scoped to one category.
- Dark/light/system theme toggle, sticky nav, responsive down to mobile.
- Seeded with 12 categories and 51 real AI tools for a populated first impression; schema scales to thousands of rows via pagination.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml` before using new hooks/types in the frontend.
- Generated `useQuery` options require an explicit `queryKey` when passing `query.enabled` conditionally (e.g. dependent queries) — use the exported `getXQueryKey(params)` helper.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
