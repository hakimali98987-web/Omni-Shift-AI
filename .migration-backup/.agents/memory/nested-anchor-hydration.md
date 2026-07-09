---
name: Nested anchor tags with wouter Link
description: Avoid invalid nested <a> tags (React hydration warning) in card components with both an internal route link and an external link.
---

A common card pattern — wrap the whole card in a `wouter` `<Link>` for internal navigation, then add an "open external site" button using `asChild` with an inner `<a target="_blank">` — produces an `<a>` nested inside another `<a>`, which is invalid HTML and triggers a React hydration warning ("This will cause a hydration error").

**Why:** `wouter`'s `<Link>` renders an `<a>` by default, and any `asChild` button rendering its own `<a>` inside it creates the nested-anchor violation, regardless of framework.

**How to apply:** make the card container a plain `<div role="link" tabIndex={0} onClick={...}>` using `useLocation().navigate(...)` for the primary click target, keep only small internal text links (e.g. the title) as `<Link>`, and let the external CTA render its own standalone `<a>` with `stopPropagation` on click — never nest one inside the other.
