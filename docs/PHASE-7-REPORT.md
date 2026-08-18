# Phase 7 report — independent production review

Branch `feature/homepage-production`, 18/08/2026. Scope: audit and polish the whole project against
`acceptance/DEFINITION-OF-DONE.md`, using a fresh verifier (an independent review agent with no
implementation context — its report is `docs/evidence/phase-7/independent-review.md`), Lighthouse,
and new site-wide Playwright sweeps. Fixes were made before calling anything complete.

## Phase 5 gaps closed first (owner request)
- Rental estimate: `assessRentalReport()` classifies every adapter outcome as **ok / insufficient
  evidence / unavailable**; the demonstration adapter now *refuses* a range for areas outside its
  table instead of guessing; the page shows an honest panel (no figure, why, comparable count) and the
  result ends with **"Request a verified rental appraisal"** (brief wording). Unit + e2e tests.
- Live map deliberately left out (owner: "leave the map"); the static schematic map ships.

## Independent review — findings and what was done
| Finding (severity) | Action |
|---|---|
| Indexing switch could disagree between prerendered and dynamic routes (major) | Switch renamed **`NEXT_PUBLIC_SITE_INDEXING`** (inlined at build → consistent everywhere); docs, checklist and `.env.example` updated |
| Occupied homes published EPC-register-precise facts (floor area, dwelling type, rating) that could single out one house (major) | "Currently let" homes now show street, district and property type only; EPC facts only for marketed homes (row 81) |
| "Bills — Not included" hard-coded (major) | `billsIncluded` is nullable; the row appears only when a document states it |
| Unknown property/article slugs streamed an empty shell without JS (major) | `dynamicParams = false` on both routes → the static, fully server-rendered 404 |
| Open Graph title/description generic on every page (major) | Root layout no longer hard-codes them; Next resolves per-page titles into og/twitter |
| 14 property pages shared identical titles (major) | Same-street homes carry the district and reference in the title (unique titles asserted by unit test) |
| "A apartment" grammar (minor) | `withArticle()` |
| Enquiry panel on occupied homes (minor) | Reads "Ask about similar homes" |
| Privacy note "not stored or sent" while a server action receives the POST (minor) | Reworded: checked by this website, nothing stored or forwarded |
| Canonical/og:url on localhost when the domain is unconfirmed (minor) | Resolved from `NEXT_PUBLIC_SITE_URL` → Vercel host; set at launch |
| Duplicate landmark name on /landlords (minor) | CTA heading renamed |
| "46 of 46 homes" states portfolio size (minor) | Recorded for owner decision (row 83) |
| `<main>` lacked `tabindex=-1` (minor) | Added |
| `aria-invalid` on a fieldset (minor) | Moved to a `role="radiogroup"` |
| No security headers (note) | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` added; CSP left as a launch decision (row 85) |
| 3D chapter longer than the storyboard bound (note) | Owner-directed slow-down (row 87) |
| Draft articles are noindex → Lighthouse SEO 69 on article pages (note) | By design until reviewed (row 72) |

## Performance work
- Homepage mobile hero poster re-cut 640 px / 92 KB (from 129 KB); media register updated.
- FAQ blocks rebuilt on native `<details>/<summary>` (no JavaScript, keyboard-native) instead of a
  client accordion; below-the-fold sections on Tenants/Landlords/Maintenance use `content-visibility:
  auto` — mobile Total Blocking Time roughly halved on those pages.

## Lighthouse (launch-mode build, installed Chrome, mobile + desktop, 18/08/2026)
Targets: Accessibility 95+, Best practices 90+, SEO 90+, mobile Performance 80+ — **all met** on every
audited page (article SEO 69 is by design: draft articles are `noindex` until reviewed). Simulated
mobile performance varies ±5 between runs on this machine; the table is the final quiet-machine run
(per-page JSON in `docs/evidence/phase-7/lighthouse/`).

| Page | Preset | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|---|
| home | mobile | 89 | 100 | 100 | 100 | 3.2 s | 0 | 210 ms |
| home | desktop | 99 | 100 | 100 | 100 | 0.9 s | 0 | 20 ms |
| properties | mobile | 81 | 100 | 100 | 100 | 3.2 s | 0 | 400 ms |
| properties | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 20 ms |
| property-detail | mobile | 93 | 100 | 100 | 100 | 3.0 s | 0 | 150 ms |
| property-detail | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms |
| landlords | mobile | 90 | 100 | 100 | 100 | 3.2 s | 0 | 140 ms |
| landlords | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms |
| tenants | mobile | 84 | 100 | 100 | 100 | 3.3 s | 0 | 310 ms |
| tenants | desktop | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms |
| maintenance | mobile | 80 | 100 | 100 | 100 | 3.3 s | 0 | 500 ms |
| maintenance | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 10 ms |
| rental-appraisal | mobile | 86 | 100 | 100 | 100 | 3.1 s | 0 | 350 ms |
| rental-appraisal | desktop | 100 | 100 | 100 | 100 | 0.7 s | 0 | 10 ms |
| insights-article | mobile | 96 | 100 | 100 | 69 | 2.5 s | 0 | 130 ms |
| insights-article | desktop | 100 | 100 | 100 | 69 | 0.6 s | 0 | 0 ms |

Notes: `content-visibility: auto` is used only on the FAQ blocks (plain text + native `<details>`);
on sections with links it made axe/Lighthouse unable to measure contrast and target size, so it was
removed there. Mobile hero poster re-cut to 92 KB; FAQ moved off the client bundle.

## Site-wide sweeps added (`tests/e2e/phase7/production-review.spec.ts`)
Every public route (20 URLs): 200, one h1, no console errors, same-origin only, no cookies, no
horizontal overflow at 320/375/640 (≈ 200 % zoom)/768/1024/1440; unique titles and descriptions,
og:site_name/twitter:card, `lang="en-GB"`, pre-launch noindex; internal link crawl (all 200);
keyboard: skip link first and visible focus on the first 40 tab stops of /, /properties,
/maintenance, /insights; honest states for empty results, weak-evidence estimate, and a slow-network
homepage (HTML actions usable before media/3D).

## Verification
| Check | Result |
|---|---|
| `npm run lint` / `npm run typecheck` | clean |
| Vitest | **49 / 49** |
| Playwright — whole suite (routes, navigation, a11y, evidence, experiments, phase 2, 3, 6, 7) | **296 / 296** (final run; earlier run caught a WCAG 2.2 target-size violation on the landlords checklist links, fixed) |
| Independent review re-check | all "major" items fixed as above; remaining items are owner decisions (rows 83, 85) |

## Deliverables
- Setup/deployment guide — `docs/SETUP.md` (env, Vercel, audits)
- Content-editing guide — `docs/CONTENT-EDITING.md`
- Owner-decision and placeholder register — `docs/OWNER-DECISIONS.md` (rows 1–87)
- Test and Lighthouse summary — this report + `docs/evidence/phase-7/lighthouse/summary.md`
- Screenshots — `docs/evidence/phase-2/`, `docs/evidence/phase-3/` (desktop/mobile/reduced-motion/no-JS)
- Launch checklist — `docs/LAUNCH-CHECKLIST.md` (ready items vs legal/content/integration blockers)
