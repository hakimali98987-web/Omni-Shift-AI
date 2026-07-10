# Omni Shift AI — Admin Panel

A standalone **Next.js 15 (App Router)** admin panel for managing the Omni
Shift AI tools directory. This project lives at the repo root
(`admin-panel/`) outside the pnpm workspace — Replit's artifact system does
not support Next.js as a runnable/previewable service, so this app is meant
to be run and deployed independently (Vercel, or any Node host).

## Features

- Admin login (email + password, signed HTTP-only session cookie)
- Protected `/dashboard` (redirects to `/login` if not authenticated)
- Dashboard stats: Total AI Tools, Categories, Featured Tools, Trending Tools
- Full CRUD for AI Tools: add, edit, delete, with every field the spec
  requires — Name, Slug, Logo, Description, Full Description, Category,
  Pricing, Official Website, Tags, Features, Pros, Cons, FAQ, Featured
  toggle, Trending toggle
- Same design language (colors, typography) as the public Omni Shift AI site
- Built against Supabase (Postgres) via `@supabase/supabase-js`

## Getting started

```bash
cd admin-panel
npm install
cp .env.example .env
```

### 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/schema.sql` — it creates `tools` and
   `categories` tables (matching the field list above) and seeds a few
   starter categories.
3. Copy your Project URL, anon key, and service role key into `.env`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only — never expose this to the browser)

### 2. Set up admin credentials

```bash
npm run hash-password -- "your-password"
```

Copy the printed hash into `.env` as `ADMIN_PASSWORD_HASH`, and set
`ADMIN_EMAIL` to the login email. Generate a random `SESSION_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`.

## Architecture notes

- **Auth**: a single hardcoded admin account (env-configured), password
  checked with bcrypt, session stored as a signed JWT in an HTTP-only cookie.
  `middleware.ts` protects `/dashboard/*` and all write methods on
  `/api/tools/*`. Swap `verifyAdminCredentials` in `src/lib/auth.ts` for
  `supabase.auth.signInWithPassword` if you'd rather manage admin users
  through Supabase Auth.
- **Data layer**: all reads/writes go through `src/lib/data/*`, which use a
  server-only Supabase client authenticated with the service role key (bypasses
  Row Level Security — this is an internal admin tool, not a public API).
- **Validation**: `src/lib/validations/tool.ts` (Zod) validates every write
  before it reaches Supabase.
- **Until Supabase is configured**, the dashboard and tools pages render a
  clear setup notice instead of crashing.

## Connecting this to the public Omni Shift AI site

This admin panel's schema (`supabase/schema.sql`) mirrors the field set of
the main site's `tools`/`categories` tables. To have both apps share the
same data, either:

- Point the main site's Postgres connection at the same Supabase project
  (Supabase gives you a standard `DATABASE_URL` you can hand to Drizzle), or
- Keep them separate and sync data between them on your own schedule.

This repo does not do that wiring automatically — it's intentionally kept
standalone since it runs outside the Replit workspace.
