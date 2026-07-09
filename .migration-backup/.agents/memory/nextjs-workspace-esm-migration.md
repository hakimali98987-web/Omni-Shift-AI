---
name: Next.js 15 migration with ESM workspace packages
description: Lessons from migrating a React+Vite app to Next.js 15 App Router when workspace packages export TypeScript files with "type":"module"
---

## The core constraint
Workspace packages that export raw TypeScript files (`"type":"module"` + exports pointing to `.ts` paths) cause webpack to crash with `TypeError: a[d] is not a function` during Next.js server-side prerendering. `transpilePackages` doesn't resolve this.

**Why:** Next.js prerendering runs the server bundle through webpack. Even for `'use client'` components, webpack still traverses the import graph. ESM workspace packages with `.ts` exports (no compiled JS) trigger a webpack runtime error in the SSR phase.

**How to apply:** Any time a Next.js App Router page imports (directly or transitively) a workspace package that has `"type":"module"` and exports `.ts` files, use the client-boundary pattern below.

## Pattern: client boundary wrapper for ssr:false dynamic imports

Server Components (`page.tsx`) cannot use `dynamic(..., { ssr: false })` directly. Create a separate client component file in the same directory:

```tsx
// src/app/_home-view.tsx
'use client';
import dynamic from 'next/dynamic';
const HomeView = dynamic(() => import('@/views/home'), { ssr: false });
export { HomeView };
```

Then import it from the server page:
```tsx
// src/app/page.tsx  (Server Component — no 'use client')
import { HomeView } from './_home-view';
export const metadata = { ... };  // still works server-side
export default function Page() { return <HomeView />; }
```

**Why this works:** The `dynamic` call with `ssr:false` is evaluated inside a Client Component, which is allowed. The Server Component only imports the already-compiled wrapper, not the problematic ESM package.

## Pages Router conflict
Next.js treats `src/pages/` as the Pages Router. View components stored there get treated as routes, not modules — `useParams()` from `next/navigation` returns null during Pages Router prerendering.

**Fix:** Rename `src/pages/` to `src/views/` (or any non-`pages` name) before adding App Router structure.

## localStorage in client components
Even with `'use client'`, Next.js pre-renders client components once on the server (for initial HTML). `localStorage` in `useState` initializers crashes SSR.

**Fix:** Guard with `typeof window !== 'undefined'`:
```ts
useState(() => (typeof window !== 'undefined' ? localStorage.getItem(key) : null) || defaultValue)
```

## ThemeProvider storage key
The default `storageKey` in custom ThemeProviders from Vite templates is often `"vite-ui-theme"`. Rename to an app-specific key (e.g. `"omnishift-theme"`) on migration.

## Duplicate re-exports in api-client-react
`lib/api-client-react/src/index.ts` had duplicate `export *` statements that can cause webpack bundling issues. Always deduplicate.

## Build output
- Static pages: use `○ (Static)` in route table
- Dynamic pages with `generateMetadata` but `ssr:false` content: use `ƒ (Dynamic)`
- `next build` + `next dev -p $PORT --hostname 0.0.0.0` work correctly in Replit monorepo
- PostCSS config for Tailwind v4: `postcss.config.mjs` with `{ plugins: { '@tailwindcss/postcss': {} } }`
