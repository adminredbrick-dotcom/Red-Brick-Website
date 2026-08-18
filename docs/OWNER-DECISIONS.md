# Owner-decision and placeholder register

Every unconfirmed fact and pending decision lives here. Nothing on this list may appear on the
public website as if it were confirmed. When an item is confirmed, update
`src/config/business.ts` (facts) or the relevant page, then mark the row Confirmed.

Status key: **Open** (owner input needed) · **Assumed** (recommended default adopted, reversible) ·
**Confirmed**.

## Business identity and contact

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 1 | Domain / site URL | Canonical URLs, sitemap, metadata | Open | Site is `noindex` until confirmed (AS-10) |
| 2 | Permanent business email | Contact page, footer | Open | Honest "to follow" states shown |
| 3 | Permanent telephone number | Contact page | Open | WhatsApp 07300 856675 is the confirmed contact |
| 4 | Opening hours | Contact page | Open | Only "meetings by appointment" is approved |
| 5 | Registered company name & number | Footer/legal pages | Open | Required before launch |
| 6 | Registered / trading address | Legal pages | Open | No walk-in office may be implied |

## Regulatory and legal (launch blockers)

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 7 | Redress scheme membership | Footer/legal | Open | Must be verified before publication |
| 8 | Client Money Protection details | Legal | Open | If client money is held |
| 9 | Deposit scheme wording | Tenants/legal | Open | Only wording Red Brick is authorised to publish |
| 10 | Approved fees and charges | Landlords/tenants | Open | No fee content published until supplied |
| 11 | Complaints contact and procedure | Legal/contact | Open | |
| 12 | Privacy notice content | /privacy | Open | Draft banner shown until professionally reviewed |
| 13 | Cookie policy + consent tooling | /cookies | Open | No analytics/cookies active meanwhile |
| 14 | Terms of use content | /terms | Open | Draft banner shown until professionally reviewed |
| 15 | Emergency / out-of-hours instructions | /maintenance | **Assumed** | Generic official routes shown (999; National Gas Emergency 0800 111 999) with cautious wording. Confirm or replace with approved wording. |

## Services and operations

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 16 | Confirmed landlord service list | /landlords | **Assumed** | Presented as Let / Manage / Care journey per brief default; no packages or prices |
| 17 | Approved maintenance procedure detail | /maintenance | **Assumed** | Only the approved five-step outline is published |
| 18 | Enquiry form destination | Property/contact forms (later phase) | Open | Forms show honest "not yet active" + WhatsApp until configured |
| 19 | Maintenance report destination | /maintenance form (later phase) | Open | Same honest state |
| 20 | Contact form destination | /contact (later phase) | Open | Same honest state |
| 21 | Listing entry workflow & who updates availability | CMS (Phase 6) | **Assumed** | Editable website records now; PMS integration point later |
| 22 | Exact-address / map-pin rules | Property pages (Phase 4) | **Assumed** | Approximate locations for occupied homes by default |

## Media and content

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 23 | Hero video (desktop + mobile crop) + poster | Homepage (Phase 3) | **Assumed** | Branded placeholder until a real shoot is approved |
| 24 | Approved Peterborough/property photography | Site-wide | Open | No stock/AI imagery for real listings, ever |
| 25 | 3D house style preference | Homepage story (Phase 3) | **Assumed** | Low-detail previs first per storyboard |
| 26 | FAQs and final page copy | Various | Open | Honest pending states shown meanwhile |

## Accounts and integrations

| # | Item | Status | Notes |
|---|---|---|---|
| 27 | Hosting account | Open | |
| 28 | Sanity project | Open | Needed in Phase 6 |
| 29 | MapTiler account + key | Open | Needed in Phase 4; list fallback works without it |
| 30 | Analytics choice + consent platform | Open | Off by default until consent-reviewed |
| 31 | Spam protection & form delivery service | Open | Needed before forms go live |
| 32 | Monitoring and backups | Open | Before launch |

## Build assumptions (recorded, low-risk)

| # | Assumption | Detail |
|---|---|---|
| A1 | App location | Next.js app lives at the handoff root (user-approved in Phase 0) |
| A2 | Version control | Git initialised with the untouched handoff as the baseline commit (user-approved) |
| A3 | Git identity | Repo-local `user.name "Moeen"`, `user.email info@pickigo.com` — change with `git config` if wrong |
| A4 | Tooling | npm; exact dependency versions pinned in `package.json`; no blind upgrades |
| A5 | Fonts | Inter + Roboto Condensed via `next/font/google`, self-hosted at build time |
| A6 | Pre-launch indexing | `robots: noindex` site-wide until domain + launch approval |
| A7 | Dynamic routes | `/properties/[slug]` and `/insights/[slug]` return an honest branded 404 until real records exist (Phases 4/6) |

## Added 17/08/2026 — media, story and rights (after `docs/REFERENCE-REPORT.md` and the owner's conditional approval)

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 33 | Hero film — Pexels 12217554 trimmed to one ~10 s single camera move; poster first; muted autoplay after the shell; plays once and holds; never loops; poster-only for reduced motion, Save-Data and mobile by default | Homepage §1 | **Approved (direction)** — trim/poster derivatives pending approval | Storyboard v3 §1; register row A1. The AI clip `Using_the_approved_Red_Brick_V (1).mp4` is a prototype motion reference only (two doors, 720p, platform mark) |
| 34 | Optional separately approved mobile hero clip | Homepage §1 (mobile) | Open | Only if approved; otherwise poster |
| 35 | Scroll-led media story clips — 14807040, 14807010 (alt 14806961), 14806944 (alt 14806923), 14807056, 14806975; cat / mirrored-bedroom / blue-bedroom clips excluded | Homepage §3 | **Approved (selection)** — derivatives pending | Register rows A2–A11; one active video at a time; captions "illustrative stock footage" |
| 36 | 3D chapter names — landlord: Preparing the property → Finding a tenant → Managing the tenancy → Continuing property care; tenant: Finding a suitable home → Understanding the move → Living in the property → Getting maintenance help | Homepage §4, `CLAUDE.md` | **Assumed** | Navigation/storytelling labels only; final service-journey and story copy approval is row 45 |
| 37 | Audience-choice behaviour — landlord/tenant choice personalises the homepage story and keeps the visitor on the page; "View properties" may go to `/properties`; separate labelled links to full Landlords/Tenants pages; Switch story control; session-only preference, no analytics/CRM/persistent identifier; complete neutral HTML story without JavaScript or choice | Homepage §2, later tests | **Assumed (owner-directed)** | Later tests must reflect this product intent rather than the earlier route-only behaviour |
| 38 | AI platform and commercial-use rights per generated asset (platform name, plan, terms) | Register §B | Open | Record before any generated asset is published |
| 39 | Input/reference rights for generated media (what was fed in, whether it may be used) | Register §B | Open | |
| 40 | Property, location and identifiable-person permissions for any footage/stills showing a real place or person | All media | Open | Stock clips used only within the Pexels License; no Peterborough / managed-home claims |
| 41 | 3D model, texture and HDRI licences | Register §C | Open | None needed for the boxes/planes previs |
| 42 | Required provenance marks on generated media (e.g. C2PA / watermark policy) | Generated media | Open | |
| 43 | Public AI disclosure wording and placement | Site-wide / legal | Open | Default label until decided: "Illustrative brand film created with AI — not an available property." |
| 44 | Asset provenance register as the standing control (`docs/MEDIA-ASSET-REGISTER.md`) | Build gate | **Assumed** | Every asset logged before use; 4K originals stay outside `public/` |
| 45 | Final service-journey and story-copy approval (all chapter copy, media captions, Let / Manage / Care wording, "Ask us about arranging a meeting" until meetings are confirmed) | Homepage copy | Open | Everything remains prototype copy until this is confirmed |
| 46 | Performance budgets for video, 3D chunk, model and textures | Build gate before final assets | **Assumed** | Targets to measure in the previs, not achieved facts (REFERENCE-REPORT §6) |
| 47 | Restored practical previews on the homepage — properties/static map poster, appraisal entry, move-in-cost explanation, maintenance, insights — with demonstration data labelled | Homepage §5–§8 | **Assumed (owner-directed)** | Landing-page previews only; no live map canvas while the 3D canvas exists |

## Added 17/08/2026 — Phase 2 property journeys (`experiment/phase2-new-flow`)

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 48 | Peterborough area list for search and appraisal (12 neighbourhoods, PE1–PE4/PE7) | `/properties`, `/rental-appraisal` | **Assumed** | `src/lib/listings/areas.ts`; confirm names, add/remove areas |
| 49 | Which listing facts are published and their verification source (deposit, holding deposit, council-tax band, EPC — shown only when verified against a document) | Property detail | **Assumed** | `VerifiedFact` in the listing contract; confirm the rule and the acceptable sources |
| 50 | Live listing feed / CMS or PMS adapter, real photographs and the person who updates availability | Properties | Open | Demo repository in place; nothing real is shown until this is decided |
| 51 | Rental-estimate data provider (licensed comparables + Red Brick achieved rents), model review and sign-off | `/rental-appraisal` | Open | Demo adapter only; the report never claims a valuation; crime/forecast content stays off until sourced and approved |
| 52 | Enquiry, viewing and appraisal form delivery (destination, spam protection, privacy notice) | Property detail, appraisal | Open | Forms are honest inert states; WhatsApp is the only live route |
| 53 | Move-in-cost explainer wording (Tenant Fees Act 2019 caps) and whether a live calculator is offered | Tenants preview | **Assumed** | Worked example labelled demonstration; wording to be reviewed |
| 54 | Demonstration listing copy and the eight fictional records | Properties | **Assumed** | Fictional, labelled; replace or remove before launch |

## Added 17/08/2026 — Phase 3 production homepage and 3D house (`feature/homepage-production`)

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 55 | Approval of the 3D house look and the three chapter choreographies (landlord / tenant / neutral) | Homepage §4 | **Assumed (built)** | Original programmatic model, `src/lib/house/build-house.ts`; static renders in `public/media/house/`; adjust colours/proportions/beats on review |
| 56 | Homepage copy marked PROTOTYPE in `src/content/home.ts` and `src/lib/house/story.ts` (prompt, chapter names/lines, insights empty-state text) | Homepage | Open | Approved sentences are used verbatim; everything else awaits row 45 sign-off |
| 57 | Video derivatives (hero 0–10 s trim; five story clips) once a trusted encoder is available | Homepage §1 and §3 | Open | Components are wired (`src/content/home-media.ts` → `sources`); posters ship meanwhile; masters never in `public/` |
| 58 | Managed masters folder `D:\4. Website\media-masters\pexels\` (copy, verify SHA-256, keep originals) | Media register | Open | Not created yet — confirm the location |
| 59 | Pexels creator names for the 16 masters | Media register | Open | Pages sat behind a bot check; fill from the download pages |
| 60 | Hero poster size (222 KB at 1440 px for the dense aerial vs the 120 KB target) | Homepage §1 (LCP) | **Assumed** | Kept for image quality; alternative is a smaller/softer crop |
| 61 | Static-render refresh policy — re-run `scripts/house/render-chapters.mjs` whenever the model or choreography changes | Build gate | **Assumed** | 18 JPEGs, ~745 KB |

## Added 18/08/2026 — Phase 3 revision: larger house, viewing story, real portfolio (`feature/homepage-production`)

| # | Item | Where it surfaces | Status | Notes |
|---|---|---|---|---|
| 62 | The 3D house is now a large detached family home built from the owner-supplied floor plan (drawing room, family room, kitchen with island and rear bays, study, entrance hall, dining, utility; four bedrooms, three en-suites, dressing room, landing) — approve proportions, colours and the exterior | Homepage §4 | **Assumed (built)** | `src/lib/house/build-house.ts` v2.0.0; GLB 1.13 MB; adjust on review |
| 63 | Six-chapter viewing story shared by every audience (board up → applicants met, handshake → inside, exploded dollhouse → dining and kitchen room by room → upstairs lights, house closes → goodbye at the door, agent leaves, tile checked, dusk); the copy per audience is prototype | Homepage §4 | **Assumed (built)** | `src/lib/house/animation.ts` v4, `src/lib/house/story.ts`; camera stays front-on for lit/dusk beats; slower scroll pace (≈ 6 × 78 vh + 50 vh) |
| 64 | Real portfolio on `/properties` and the homepage preview: 46 homes with street + postcode district only, property type, floor area and EPC from the public register, "Available" or "Currently let" from the office occupancy sheet; no house numbers, owners, tenants, contacts, tenancy dates or occupied-home rents | `/properties`, detail pages, homepage preview | **Assumed (owner-directed)** | Generator `scripts/listings/extract-portfolio.py`; shipped data `src/lib/listings/portfolio.json`; audit `scripts/listings/portfolio-audit.json` (not shipped) |
| 65 | Six homes had no row on the One Page Plan and are shown as "Currently let" by assumption — confirm: Northfield Road (RB-361), Eastern Avenue (RB-166), Fulham Road (RB-316), Field Walk (RB-307), Sandford (RB-217), Nicholls Avenue (RB-170) | `/properties` | Open | Change `status` in the extractor's plan sheet or the JSON when confirmed |
| 66 | Available homes and their published rent: Apartment on Lincoln Road PE1 (RB-345, £600 pcm from the plan sheet) and Terraced house on Scotney Street PE1 (RB-50, "Rent on application" — no rent on the sheet) | `/properties` | Open | Confirm both are genuinely available and the rent; bedrooms/bathrooms are "to be confirmed" until supplied |
| 67 | Oxclose PE3 (RB-331): the only EPC on file expired 30/11/2025, so no EPC rating is published for it | Property detail | Open | Renew the certificate; the extractor picks it up automatically |
| 68 | Street → neighbourhood assignments (`STREET_AREAS` in `src/lib/listings/portfolio-listings.ts`; five areas added: Millfield, New England, Eastfield, West Town, Netherton) | Cards, filters, schematic map | **Assumed** | Best-effort local knowledge; the map pin is the area centre with a small offset, never the home |
| 69 | Bedrooms, bathrooms and photographs for the portfolio (currently "to be confirmed" / placeholder illustration) | Property cards and detail | Open | Supply per property; the listing contract already carries the fields |
| 70 | Static-render refresh — 24 JPEGs (3 stories × start, chapter 1–6, complete) at 1440 × 900 | Build gate | **Assumed** | `scripts/house/render-chapters.mjs`; re-run whenever the model or choreography changes |
