# Content editing guide — how Red Brick changes what the site says

Written 18/08/2026 (Phase 6). Everything editable lives in a handful of typed files today; when the
Sanity project is created (owner register row 28) the same shapes move into the CMS and the pages do
not change — only the repository binding does.

## 1. Business facts (name, WhatsApp, meetings line, socials, pending details)
`src/config/business.ts` — the single source of truth. Anything `null` (email, telephone, address,
opening hours, regulatory details) renders as an honest "to follow" state; **never** type a value here
that has not been confirmed. Changing the WhatsApp number here changes every link and every composed
message on the site.

## 2. Approved copy
`src/content/approved-copy.ts` — hero, introduction, landlord/tenant/maintenance route copy, trust
points, company introduction (verbatim from the brief). Homepage-only prototype copy is in
`src/content/home.ts` and the 3D-house chapter copy in `src/lib/house/story.ts`.

## 3. Insights articles
`src/lib/content/articles.ts` — one object per article:

| Field | Meaning |
|---|---|
| `slug` | URL: `/insights/<slug>` (letters, digits, hyphens; never change once shared) |
| `title`, `excerpt` | Heading and card/summary text |
| `category` | one of `landlords`, `tenants`, `peterborough`, `maintenance`, `property-guidance` |
| `tags` | short keywords (used in Article structured data) |
| `author` | defaults to "Red Brick Lettings" |
| `publishedOn`, `reviewedOn` | ISO dates (`2026-08-18`); shown as dd Month yyyy |
| `reviewStatus` | `draft` shows the "awaiting Red Brick review" note and keeps the article `noindex`; set to `reviewed` once checked |
| `body` | blocks: `paragraph`, `heading`, `list` (`ordered` optional), `callout` (`tone: "attention"` for safety notes), `link` (internal path or https URL) |
| `sources` | official links with the date read — required for any legal/regulatory statement |
| `related` | slugs of related articles (the template fills to three from the same category) |
| `socialCaption` | one line for the share sheet / social preview |
| `cover` | `null` until an approved, rights-cleared image exists — never stock or AI |

Rules: guidance, not advice; no fees, response times, guarantees or "24/7"; every legal statement
cites GOV.UK (or the council); UK English and dd/mm/yyyy. Adding an article automatically creates its
page, its social image (`/insights/<slug>/opengraph-image`), its Article JSON-LD, its share links and
(once `reviewed`) its sitemap entry.

## 4. FAQs
`src/lib/content/faqs.ts` — three groups (`landlords`, `tenants`, `maintenance`), each item with
`question`, `answer` and `basis` (where the answer comes from). Rendered as an accessible accordion with
FAQPage structured data on the Landlords, Tenants and Maintenance pages.

## 5. Landlord requirements checklist and journeys
`src/lib/content/guidance.ts` — the compliance checklist (each item with its official source), the
tenant journey steps and the landlord Let / Manage / Care journey. Update `guidanceReviewedOn` when
re-checked.

## 6. Forms (repair report, landlord maintenance question, contact)
`src/lib/forms/messages.ts` — field lists, required messages, categories, urgency wording, privacy
notes and the WhatsApp message each form composes. Validation runs on the server for every submission
(`src/lib/forms/actions.ts`); nothing is stored or logged. When a delivery destination exists
(`.env.example` → `FORM_DELIVERY_*`), add the delivery step in `actions.ts` and show a success message
only after confirmed delivery.

## 7. Properties
See `docs/PORTFOLIO-LISTINGS.md` — re-run `scripts/listings/extract-portfolio.py` on the office
machine when certificates or availability change; supply bedrooms/bathrooms/photographs per property to
replace "to be confirmed".

## 8. Move-in cost rules
`src/lib/appraisal/move-in-costs.ts` — the caps and the GOV.UK sources with `reviewedOn`. The Tenants
page calculator and the homepage explainer both read from here.

## Later: Sanity
Create the project (row 28), add the schemas mirroring §3–§5 (`data/CMS-AND-LISTING-MODELS.md`),
implement `ContentRepository` (`src/lib/content/repository.ts`) with a Sanity client, and change the
single `contentRepository` binding. Keep `reviewStatus`, `sources` and the review dates as required
fields so the honesty rules survive the move.
