# Claude Code Task · Frontend Architect Overhaul

## High-Level Goal
Partner with the **Frontend Architect** sub-agent to deliver a holistic polish pass across RGBUNION. Three pillars drive this sprint:

1. **Animation refresh** – modernize motion, easing, and transition cohesion across every route and reusable component while respecting accessibility (prefers-reduced-motion) and maintaining the brand’s gilded aesthetic.
2. **Shop listing thumbnails** – introduce image support for shop items end-to-end: database, admin management flows, and storefront presentation (including production migration & deploy).
3. **Material-inspired typography & UI polish** – overhaul font stack, typographic scale, and subtle surface treatments to nudge the interface toward a modern Material UI vibe without abandoning the brand’s premium identity.

Treat this as a feature wave that ships straight to production once QA passes.

---

## Working Agreements & Tooling Rules
- **Sub-agent**: Route all UI choreography, animation design, and component styling decisions through the **Frontend Architect** Claude agent. Use it for brainstorming, architecture, and implementation of motion primitives.
- **Package Manager**: Use `bun` for all scripts/commands (per `CLAUDE.md`).
- **Database workflow**: Update Drizzle schema, run `bun run db:gen`, `bun run db:mig:local`, validate locally, then `bun run db:mig:prod` prior to deploy.
- **Deployment**: After QA, execute `bun run deploy` to push to Cloudflare Pages. Capture the output and note the commit hash used.
- **Testing cadence**: At minimum run `bun run build` post-changes and before deploy. If additional validation is added (e.g., component/unit tests), run them too.
- **Reporting**: Maintain a running engineering log (markdown) summarizing key decisions, commands executed, and verification evidence. Append to a new section inside `claudedocs/production-deployment-report.md` titled `Animation & Thumbnail Refresh`.

---

## Detailed Requirements

### 1. Animation & Motion Overhaul
- Audit all primary routes (`/`, `/shop`, `/dashboard`, `/admin`, `/admin/account`, `/login`, modal overlays, toasts) and shared components under `src/lib/components/`.
- Replace legacy fades/fly-ins with a cohesive motion system designed with the Frontend Architect agent. Requirements:
  - Introduce a small animation utility module (e.g., `src/lib/motion/transitions.ts`) exporting standard transitions (enter, exit, hover micro-interactions) with Tailwind or Svelte transitions.
  - Use cubic-bezier easing consistent with premium feel (e.g., ease-out quart) while providing `prefers-reduced-motion` fallbacks.
  - Ensure staggered reveals for lists (links, shop cards, admin tables) feel polished but snappy (<400ms per item, max 1s total).
  - Update modal open/close animations to feel weightier with subtle scale/blur interplay.
  - Optimize for GPU transforms (translate/scale rather than layout-affecting props).
  - Validate there are no jarring transitions when navigating route-to-route.
- Provide brief documentation in the engineering log describing the motion tokens and how to extend them.

### 2. Material-Inspired Typography & UI Polish
- Curate a modern, Material-adjacent font pairing (primary heading + body) via Google Fonts or self-hosted files. Document selections and licensing in the engineering log.
- Update global typography tokens (font-family, weights, sizes, line-heights, letter spacing) in Tailwind config and/or shared CSS so every route/component gains the new type system.
- Introduce a responsive type scale (e.g., clamp-based sizing) and ensure headings, paragraphs, buttons, and form labels use consistent tokens.
- Refresh base UI elements to evoke Material cues: consider subtle surface elevations, refined shadow presets, softened border radii, and elevated focus states. Keep adjustments tasteful so the app still feels distinctly RGBUNION.
- Ensure accessibility: verify contrast ratios remain compliant, provide fallbacks for `prefers-reduced-motion`, and confirm new fonts load with `font-display: swap`.
- Update reusable components (navbar, modals, cards, toasts) and key pages to adopt the new typography and visual tweaks. Highlight any edge cases needing manual follow-up in the log.

### 3. Shop Listing Thumbnail Feature
- **Schema**: Add a nullable `thumbnail_url` (TEXT) column to `shop_items` in `src/lib/server/db/schema.js`. Generate and apply a migration locally & in production. Update seed scripts (`scripts/populate-dev-data.js`, `scripts/populate-dev-data-direct.js`, and `scripts/dev-data.sql`) with representative placeholder imagery.
- **Admin Dashboard** (`src/routes/admin/+page.svelte` & `+page.server.js`):
  - Extend add/edit item forms to accept thumbnail URLs (text input for now). Include live preview within the modal and enforce basic validation (`z.string().url()` with helpful error messaging; optional field allowed but trimmed).
  - Display thumbnail previews in the item list cards.
  - Ensure server actions persist the new field and avoid breaking existing records (fallback to empty string when absent).
- **Shop Frontend** (`src/routes/shop/+page.svelte` & `+page.server.js`):
  - Surface thumbnails on item cards with graceful loading (skeleton shimmer or blurred placeholder) and a fallback icon if missing/invalid.
  - Maintain responsiveness and accessibility (alt text derived from item name).
- **Dashboard (non-admin)** if it mirrors shop data: ensure consistent thumbnail display if applicable.
- **Storage**: For now use external URLs; note in the engineering log any future work needed for R2 integration.
- Provide migration notes in the log (timestamp, file names, command outputs).

### 4. QA, Docs, & Deployment
- Refresh any copy/doc references impacted by the new visuals (e.g., README thumbnails note, if relevant).
- Run `bun run build` and capture the output in the log (include timestamp & success confirmation).
- After local validation, run `bun run db:mig:prod` then `bun run deploy`. Include command transcripts and final deployment URL/preview in the log.
- Spot-check the live site post-deploy: confirm animations render correctly and thumbnails appear on production data (or note absence if dataset lacks URLs).
- Update `CLAUDE.md` if new workflows or commands are introduced (e.g., motion utility usage guidelines) so future iterations stay aligned.

---

## Deliverables Checklist
- [ ] Updated motion system integrated across all relevant components/routes.
- [ ] Modern typography stack and Material-inspired UI polish rolled out across layouts, components, and pages.
- [ ] New thumbnail field persisted through DB, server actions, admin UI, and storefront display.
- [ ] Seed scripts and SQL updated with thumbnail data.
- [ ] Engineering log entry summarizing approach, validation, and deployment (attach screenshots/links if possible).
- [ ] Successful production deployment with migrations applied.
- [ ] Any follow-up tasks or risks documented at the end of the log section.

Execute this as a cohesive, production-ready change set. When in doubt, consult the Frontend Architect agent for motion decisions and keep brand fidelity top of mind.
