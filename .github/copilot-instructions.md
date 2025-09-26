# RGBUnion · Copilot Guide

## Quick context
- SvelteKit 5 + Tailwind app targeting Cloudflare Pages/Workers; sessions and data live in Cloudflare D1 with optional R2 storage via Wrangler bindings.
- Server state is initialized in `src/hooks.server.js`: it attaches Drizzle via `locals.DB`, wires Lucia auth, and obfuscates the landing page HTML before returning `/`.
- Server-only helpers sit under `src/lib/server` (Lucia setup, PBKDF2 hashing, Drizzle schema). Frontend files rely on Svelte rune syntax (`$state`, `$props`, `$effect`, `@render`).

## Everyday workflow
- Install deps with `npm install` (repo ships `package-lock.json`; Bun commands in docs also work but npm is canonical).
- Start local D1 bridge: terminal A → `npm run proxy` (wraps `cfw-bindings-wrangler-bridge` so `DB`/`BUCKET` exist).
- Start the app: terminal B → `npm run dev`; the server expects the proxy to have populated `locals.DB` and `locals.bucket`.
- Generate/apply migrations from `src/lib/server/db/schema.js`: `npm run db:gen`, `npm run db:mig:local`, and `npm run db:mig:prod` for remote.
- Admin helpers: `npm run admin:create` seeds the local account, `npm run admin:create:prod` shells Wrangler to seed production (requires authenticated Wrangler CLI).

## Architecture cues
- Layout: `src/routes/+layout.server.js` exposes `user`, `loggedIn`, `isAdmin`; `+layout.svelte` pushes them into Svelte stores consumed by `Navbar.svelte`.
- Pages pair `+page.server.js` actions with rune-based Svelte components. Forms use `enhance` and return objects with an `action` flag so UI toasts resolve context (see `src/routes/admin/+page.svelte`).
- Auth/session: `initializeLucia` (`src/lib/server/auth.js`) builds a D1 adapter. Guarded routes redirect on missing `locals.user`. `logout/+page.server.js` invalidates sessions via Lucia and redirects.
- Data access: use `locals.DB` with Drizzle query helpers (`locals.DB.query.userTable.findFirst`, etc.) and wrap writes in `try/catch` + `fail(status, data)` for user feedback.
- Landing page obfuscation: `hooks.server.js` rewrites the full HTML response for `/`; ensure new homepage markup survives `obfuscateHtml` by testing after changes.

## Data model & gotchas
- Tables live in `schema.js`: `user`, `session`, `websites`, `shop_categories`, `shop_subcategories`, `shop_items`. Shop routes precompute category/subcategory groupings (see `shop/+page.server.js`).
- Foreign keys currently store user IDs as strings even though `user.id` is integer. Continue converting IDs to string when inserting related rows (pattern called out in `scripts/test-database-issues.js`) until the schema is normalized.
- `drizzle.config.js` resolves the local SQLite file under `.wrangler`; run one Wrangler command (e.g. `npm run proxy`) after cloning so the path exists before generating migrations.

## Cloudflare specifics
- Cloudflare bindings are named `DB` and `BUCKET`; production IDs live in `wrangler.jsonc`. Update bindings in tandem with code and scripts if they change.
- Preview builds run via `npm run preview` (build then `wrangler pages dev`). Deployments call `npm run deploy`, which pushes `.svelte-kit/cloudflare` with `--commit-dirty`, so ensure `npm run build` ran beforehand.
- Production Drizzle Studio expects `.env.production` with Cloudflare credentials; `scripts/studio-prod.js` loads it before launching `npx drizzle-kit studio`.

## Implementation patterns
- When adding new actions, validate input with Zod (see `login/+page.server.js` and `admin/+page.server.js`) and return `fail(status, {...})` including an `action` key so the client toasts map correctly.
- For authenticated mutations, always guard on `locals.user` and redirect unauthenticated users; invalidate sessions when mutating credentials as done in `admin/account/+page.server.js`.
- To extend homepage data, adjust `src/routes/+page.server.js`; it already returns `links`, `user`, `loggedIn` with safe fallbacks.
- Reuse the icon-domain helpers in the Svelte pages when rendering external links to keep the UI consistent.
