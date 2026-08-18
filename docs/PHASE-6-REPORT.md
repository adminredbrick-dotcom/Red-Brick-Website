# Phase 6 report — maintenance, service pages, insights, forms and social metadata

Branch `feature/homepage-production` (the owner asked to keep working on this branch), built
18/08/2026 on top of the Phase 3 revision. `main` is not merged. Phases 4 and 5 were delivered in
reduced, owner-directed form during the Phase 2 rebuild and the Phase 3 revision (properties + static
schematic map with the real portfolio; illustrative rental estimate; move-in cost explainer) — this
phase adds the live move-in cost calculator and completes the Phase 6 scope.

## What was built

### Maintenance (`/maintenance`)
- Urgent safety guidance first (gas 0800 111 999; 999), then the two routes (tenant / landlord),
  the five steps Report → Triage → Arrange → Update → Resolve, and the FAQ. No response times, no
  round-the-clock promise anywhere (asserted by tests).
- **Report a repair** — a real form (name, property street + postcode, category, urgency with the
  urgent/soon/routine guidance, description, access/contact). Server-side validation on every
  submission (works without JavaScript via a plain POST), errors announced and linked to fields
  (`role=alert`, `aria-invalid`, `aria-describedby`), focus management. Because no delivery endpoint
  is confirmed (owner row 52) the form **composes a WhatsApp message** the visitor sends themselves;
  the page says plainly that nothing has been sent. Nothing is stored or logged.
- **Landlord maintenance** — how coordination works (one route in, work arranged not assumed,
  everyone informed; approvals/costs "as agreed with you"), plus the same kind of composer form.

### Landlords (`/landlords`)
Problem in plain language; Let / Manage / Care journey described as process; **fees and service
choices honestly pending**; the appraisal entry (`AppraisalPreview`); a compliance checklist of the
standing legal requirements for a rented home in England, each with its GOV.UK/council source and a
checked date; landlord FAQ (FAQPage JSON-LD); related articles; closing appraisal + WhatsApp CTA.

### Tenants (`/tenants`)
Six-step journey (Find → Ask → View → Apply → Move in → Live) mirroring the homepage story; the
portfolio property preview; **move-in cost calculator** (GET form, `?rent=`, shareable, no-JS; applies
the current caps to the visitor's rent — labelled illustrative, not a quote; out-of-range input gets a
clear error); "what happens after a viewing"; the repairs quick route; tenant FAQ; related articles.

### Insights (`/insights`, `/insights/[slug]`)
- Content layer `src/lib/content/` — typed `Article` / `Faq` / `Block` models (data/CMS-AND-LISTING-
  MODELS.md), `ContentRepository` interface with a local implementation; a Sanity adapter drops in
  later without touching pages (docs/CONTENT-EDITING.md).
- Six articles prepared 18/08/2026, all `reviewStatus: "draft"` (visible note, `noindex` until
  reviewed): move-in costs; how to report a repair; what to expect at a viewing; EPC ratings; landlord
  safety checks; what our property statuses mean. Each restates guidance already on the site or
  established English PRS law with GOV.UK sources and retrieval dates. Unit tests forbid banned
  claims (24/7, guarantees, awards, testimonials, "within N hours").
- Index with URL category filter (works without JS), honest empty category state; article template
  with author/published/reviewed dates, sources, share links (WhatsApp/Facebook anchors + JS-only
  copy/native share), related articles, Article JSON-LD, canonical, per-article Open Graph image
  (`/insights/<slug>/opengraph-image`, generated text-only from the article).

### Contact (`/contact`)
Composer form (role, name, message → WhatsApp), quick routes, socials; email/telephone/address/hours
remain pending (`business.ts` nulls).

### Social metadata, sitemap, robots, structured data
Root layout: `metadataBase` (NEXT_PUBLIC_SITE_URL → Vercel host → localhost), Open Graph + Twitter
defaults, `/opengraph-image` from confirmed facts (name, tagline, service area, since 2012),
Organization (`RealEstateAgent`) JSON-LD **from confirmed facts only** (no phone/email/address/hours);
`sitemap.xml` (static pages, 46 portfolio pages, reviewed articles only; experiments excluded);
`robots.txt` disallow-all pre-launch (matches the `noindex`).

## Verification (18/08/2026, port 3113, production build)
| Check | Result |
|---|---|
| `npm run lint` / `npm run typecheck` | clean |
| Vitest | **48 / 48** (new: `forms.test.ts` — specs, validation, FormData reading, message composition; `content.test.ts` — articles/FAQ/guidance rules, worked example = calculator, repository) |
| Playwright `tests/e2e/phase6/service-pages.spec.ts` | **10 / 10** — maintenance page order/promises/axe; repair form validation → composed message (JS) and no-JS round-trip; landlords checklist/sources/pending fees; tenants calculator (850 → £981 / £196 / £1,831; out-of-range error), FAQ keyboard + FAQPage JSON-LD; contact composer; insights index/filter/empty/article/JSON-LD/og:image/404; layout metadata + Organization JSON-LD; sitemap/robots/OG images |
| Whole suite | see the commit message |

## Assumptions recorded (docs/OWNER-DECISIONS.md rows 71–78)
Forms compose WhatsApp messages until a delivery destination exists; article drafts visible and
noindex until reviewed; the six article topics; FAQ answers; the compliance checklist wording; the
move-in calculator offered as an explainer; local content repository until Sanity exists;
robots disallow-all pre-launch.
