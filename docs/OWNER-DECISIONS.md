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
