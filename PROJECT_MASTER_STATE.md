# Orient — Project Master State

**Stack:** Medusa v2 (backend) + Next.js 15 storefront + Puck CMS
**Last updated:** 2026-06-06
**Status:** ✅ Live, functional, and verified

---

## Repository layout

| Path | Role |
|---|---|
| `medusa_zero_store/` | Medusa v2 backend — runs on **:9000** (admin at `/app`) |
| `medusa_zero_store-storefront/` | Next.js 15 storefront — runs on **:8000** (editor at `/gb/editor`) |

---

## What's done (verified)

### 1. Editor → Live sync
- Puck editor (`/[countryCode]/editor`) loads via **GET `/api/puck`** and saves via **POST `/api/puck`** on publish.
- Route: `medusa_zero_store-storefront/src/app/api/puck/route.ts`
- Store helper: `medusa_zero_store-storefront/src/lib/puck/load.ts` (`loadPuckData` / `savePuckData` → `src/puck/data/home.json`).
- Home page `src/app/[countryCode]/(main)/page.tsx` is `export const dynamic = "force-dynamic"` and reads the doc fresh on every request.
- **Verified** with a POST → live `/gb` round-trip (change appeared, then restored).

### 2. Dynamic layout (CMS-controlled chrome)
- `src/app/[countryCode]/(main)/layout.tsx` reads `loadPuckData().root.props` and renders `<OrientNav>` (gated by `showNavigation`) + `<FooterSection>`.
- Nav/Footer settings live in Puck **root props**, edited from the editor's page-settings panel → dynamic on every page, no duplication.
- Deleted the old dummy `src/modules/layout/templates/nav` and `templates/footer` (Medusa Store / GitHub / Docs / Source-code links).

### 3. CMS components (Puck blocks)
- **Hero** — `src/modules/home/components/HeroSection.tsx`: multi-slide array (desktop/mobile image, heading, subheading, CTA), **Swiper** carousel, autoplay toggle.
- **FeaturedProductsGrid** — `src/modules/home/components/featured-products-grid/index.tsx`: client-side fetch via `sdk.client.fetch`, **collection picker** (`external` field), `productLimit`, `desktopColumns`/`mobileColumns`, **Swiper** on mobile.
- **FooterSection** — `src/modules/home/components/footer-section/index.tsx`: logo, link-column arrays, copyright.
- **Navigation** — `src/modules/layout/components/orient-nav/index.tsx`.
- Config + registration: `src/puck/config.tsx`. Custom fields (color pickers + checkbox toggles): `src/puck/fields.tsx`.

### 4. Key fix — Puck + RSC serialization
The page uses Puck's `react-server` `<Render>`, which passes a `puck` context object (functions like `renderDropZone`) into block props. Spreading that into a `"use client"` component threw *"Functions cannot be passed directly to Client Components."*
**Fix:** strip it in every block render — `render: ({ puck, editMode, ...props }) => <Comp {...props} />`.

### 5. Build / QA
- `next build` → **exit 0** (68 pages compiled).
- `tsc --noEmit` → **clean for all custom files**.
- Note: `next.config.js` has `typescript.ignoreBuildErrors: true` + `eslint.ignoreDuringBuilds: true`, so `next build` skips type-checking — run `npx tsc --noEmit` separately.

### 6. Storage
- File-based: `src/puck/data/home.json` (shape: `{ root: { props: { showNavigation, nav, footer } }, content: [Hero, FeaturedProductsGrid], zones: {} }`).
- DB-swap seam = `src/lib/puck/load.ts` (only file to change for a backend/DB store).

---

## How to resume (restart servers)

```bash
# Backend (Postgres 18 must be running)
cd medusa_zero_store
npx medusa develop            # -> http://localhost:9000  (admin /app)

# Storefront
cd medusa_zero_store-storefront
npm run dev                   # -> http://localhost:8000/gb  (editor /gb/editor)
```

> A stale dev server often keeps squatting **port 8000** across sessions (`EADDRINUSE`). Kill the `node` PID on 8000 before starting:
> `Get-NetTCPConnection -LocalPort 8000 -State Listen | %{ Stop-Process -Id $_.OwningProcess -Force }`

**Backend `DATABASE_URL`** must include the user: `postgres://postgres@localhost:5432/medusa-v2` (local Postgres 18 uses trust auth). Redis is optional (in-memory fallback).

---

## Next steps (agreed — none time-bound)

1. **Proxima Nova font** — configured in `tailwind.config.js` but NOT licensed/loaded yet (falls back to Inter). *(User handling licensing separately.)*
2. **Persistence → DB** — swap `src/lib/puck/load.ts` for a Medusa-backed module or database for production/serverless (file writes don't work on serverless/multi-instance).
3. **FeaturedProductsGrid SSR** — currently client-fetch (brief "Loading…", not in SSR HTML). Make server-rendered if SEO matters more than live config flexibility.
4. **Pre-existing starter `tsc` errors (~21)** — in starter files only (products `[handle]`, cart, checkout/shipping, line-item-price/unit-price, country-select). Untouched, unrelated to our work. Clean these if a fully type-clean repo is desired.
5. **Reference images** `image_ff0f4e.png` / `image_ff6586.png` — were not viewable during the build; confirm the Puck editor UX matches the intended design.

---

## Quick reference

- Figma file key: `8cvS9PLP65YVyCi0kpgfe2` (token in `medusa_zero_store/.env` — keep private; use `curl -H "X-Figma-Token: $TOKEN"`).
- Publishable key (storefront): set in `medusa_zero_store-storefront/.env.local` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`; backend URL var is `MEDUSA_BACKEND_URL`.
- Default region/country: `gb` (seed creates a Europe region: gb, de, dk, se, fr, es, it).
- A "Featured" collection (4 seeded products) was created via `medusa_zero_store/src/scripts/create-featured-collection.ts`.
