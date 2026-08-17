# Phase 2 report — property journeys rebuilt for the approved flow

Branch `experiment/phase2-new-flow` (worktree `D:\4. Website\Red-Brick-Landing-Experiments\phase2-new-flow`),
based on `experiment/hybrid-db` @ `4cc8902`. Built 17/08/2026. Nothing was cherry-picked, merged
or restored from `archive/phase2-whole-site` (inspected read-only for lessons only). The hybrid
homepage and 3D narrative were not edited.

## Finished routes

| Route | What it does |
|---|---|
| `/properties` | List-first search over the demonstration repository. Filters: Peterborough area, minimum/maximum rent, bedrooms (N+), property type, availability. Plain GET form → **filter state lives in the URL** (`?area=&min=&max=&beds=&type=&availability=&view=`), works without JavaScript, shareable, back-button safe. Desktop sidebar + **mobile filter drawer** (Radix dialog: focus trap, Esc, focus return) with a `<noscript>` inline fallback. Result toolbar (count, active filters, Reset), **List / Map** toggle. **Optional static map view** = inline-SVG schematic Peterborough map with numbered pins and a text list of every pin (no provider, no canvas, no requests). Clear empty state with reset and widen-search actions. Every card carries "Demonstration listing — not a real property." |
| `/properties/[slug]` | Eight demonstration detail pages (SSG). Breadcrumb, mandatory label, sticky in-page nav **Overview · Features · Costs · Location · Enquire**, key facts, costs table where deposit / holding deposit / council-tax band / EPC appear **only when the record holds a `VerifiedFact`** (unverified fields are named as "not yet verified"), availability status, static approximate-location map, one prominent WhatsApp enquiry action (message names only the public reference), placeholder illustration (never a photo/AI/stock image for a demo record). Unknown slugs → honest 404 (unchanged). |
| `/rental-appraisal` | "What could your property rent for?" Step 1: area · property type · bedrooms · current status (GET; only property characteristics ever enter the URL). Result: **illustrative monthly range** with "Illustrative estimate — not a valuation.", plain-English assumptions (status-specific lines for tenanted / buying), **data freshness** (observed / generated dates, model version), evidence list with provenance kinds, comparable count and confidence, and a **demonstration rent-history chart** (SVG band + midpoint with the figures as a real table). No crime score, no future-price forecast. Step 2: address/name/contact form shown in an honest **inert** state (form delivery not configured) beside a WhatsApp route whose message carries no personal data. |
| `/experiments/phase2-previews` | Internal showcase of the three homepage integration components (noindex). |

## Homepage integration contracts (not wired into the hybrid — by design)

`src/components/previews/property-preview.tsx` (async server; 3 featured cards + static map +
View properties), `appraisal-preview.tsx`, `move-in-cost-preview.tsx` (worked example via
`calculateMoveInCosts`, Tenant Fees Act 2019 caps, labelled demonstration). How to import them
later: `docs/PHASE-2-INTEGRATION.md`.

## Data architecture

- `src/lib/listings/types.ts` — public-safe `Listing` contract; restricted fields are not part
  of the type. `VerifiedFact<T>` = value + verifiedOn + source.
- `src/lib/listings/areas.ts` — 12-area registry (name, outward postcode, approximate centre).
- `src/lib/listings/filters.ts` — parse/serialise/apply; unit-tested.
- `src/lib/listings/repository.ts` — `ListingsRepository` interface, `DemoListingsRepository`,
  single binding `listingsRepository` (swap for CMS/PMS adapter).
- `src/lib/listings/demo-listings.ts` — 8 fictional, labelled records; no addresses,
  photographs or people.
- `src/lib/appraisal/types.ts` — `RentalReport` with evidence/provenance/model version;
  `RentalReportAdapter` interface. `demo-adapter.ts` — deterministic demonstration adapter.
  `move-in-costs.ts` — pure calculator.
- No CMS, map provider, analytics, payments or form delivery. Site remains `noindex`.

## Verification (all green, 17/08/2026)

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm test` (Vitest) | **35 / 35** (6 files: business, site, whatsapp + new listing-filters, listings, rental-report) |
| `npm run build` | clean — 36 routes; 8 property pages SSG; `/properties`, `/rental-appraisal` dynamic |
| Playwright `tests/e2e/phase2/properties.spec.ts` + `appraisal.spec.ts` (port 3112) | **18 / 18** — labels on every card, filters ↔ URL, URL-only filters, empty state + reset, map view + text pins + no canvas, mobile drawer (open/values/Esc/focus return), keyboard tab-to-card with visible focus + Enter, detail sections + verified-only facts + enquiry href, unverified-record page, previews showcase, axe on list/map/empty/detail/form/report/previews |
| Playwright `tests/e2e/phase2/evidence.spec.ts` | **42 / 42** — 8 page states × 320/390/768/1024/1440 with zero horizontal overflow and zero console errors, drawer capture, reduced-motion captures |
| Existing suites re-run: `routes`, `navigation`, `a11y`, `experiments/gallery`, `experiments/hybrid-db` | **76 / 76** — hybrid untouched and still green |
| Accessibility scan | axe WCAG 2.2 AA (2a/2aa/21a/21aa/22aa) — no serious/critical violations on any Phase 2 page |
| Evidence | `docs/evidence/phase-2/` — 44 PNGs (properties, filtered, map, empty, detail, appraisal form, report, previews at 5 widths + drawer + reduced motion) |

## Design decisions made without stopping (per instruction)

- Native GET forms everywhere (URL = state, no-JS parity); a submitted form leaves harmless empty
  params in the URL, while every link the site builds is clean.
- Static map = original inline SVG schematic (labelled "not to scale") rather than a raster
  poster, so it needs no asset, no provider and no rights review.
- Availability = "Any" is the option value `""` so it never appears in URLs.
- The address/contact step is inert (fieldset disabled) with an explanatory note rather than a
  form that silently drops data.
- Chart is inline SVG with a table twin; no chart library.
- Card headings support h2/h3/h4 so previews nest correctly in a host page's outline.

## Genuinely unresolved business information (owner register rows 48–54)

1. The Peterborough area list (names, boundaries, which to offer).
2. Which listing facts are published and the acceptable verification sources.
3. The live listing feed / CMS or PMS adapter, real photographs, and who updates availability.
4. The rental-estimate data provider and model sign-off (crime/forecast content stays off).
5. Enquiry/viewing/appraisal form delivery, spam protection and privacy notice.
6. Move-in-cost explainer wording and whether a live calculator is offered.
7. Approval of the demonstration listing copy (or its removal) before launch.
Plus, unchanged from earlier phases: domain, email, telephone, company/regulatory details,
fees, deposit-scheme wording, hosting/Sanity/MapTiler accounts.
