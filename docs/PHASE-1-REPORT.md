# Phase 1 report — foundations (completed 2026-08-13, finalised 2026-08-15, awaiting approval)

Phase 0 (architecture + traceability) and Phase 1 (foundations) are complete. The site builds,
passes all tests and runs at http://localhost:3000 with `npm run start`. **Work resumes Saturday
2026-08-15 with the Phase 2 go-ahead.**

## Status at a glance

| Item | State |
|---|---|
| Phase 0 plan | Approved. Full plan (incl. traceability IDs B1–W3): `C:\Users\moeen\.claude\plans\you-are-building-the-glistening-cocoa.md` |
| Phase 1 build | Complete and verified |
| Phase 1 approval | **Pending your review** — committed to Git (see final report in chat / `git log`) |
| Git baseline | `ce92ca1` = untouched handoff; Phase 1 committed on top |
| Next step | Your go-ahead → Phase 2 (static vertical slice), built with parallel agents |

**First step on Saturday:** review the site (`npm run start` → http://localhost:3000), then
give the Phase 2 go-ahead.

## What was built

- **Scaffold at the handoff root** (user-approved): Next.js App Router + strict TypeScript +
  Tailwind v4 + shadcn/Radix-style UI kit. Handoff folders preserved untouched.
- **Brand system**: `src/styles/tokens.css` ported 1:1 from `brand/red-brick-tokens.css`;
  Tailwind theme mapped onto those custom properties; Inter + Roboto Condensed via `next/font`;
  supplied logo SVGs used verbatim (`public/brand/`, favicon `src/app/icon.svg`).
- **Typed business config** (`src/config/business.ts`): the only source of confirmed facts;
  unknowns are typed `null`. Route registry + nav in `src/config/site.ts`. Approved copy verbatim
  in `src/content/approved-copy.ts`.
- **Layout shell**: skip link, header (full nav ≥1280px; compact logo + WhatsApp icon + drawer
  below), accessible Radix drawer (focus trap, Esc, visible close), dark footer with socials and
  honest "contact details to follow" note. WhatsApp always displays `07300 856675`, links
  `https://wa.me/447300856675`.
- **All 14 routes** with semantic placeholder sections and only approved copy. Legal pages carry
  visible "Draft placeholder — not yet reviewed" banners. Unpublished property/article slugs
  return an honest branded 404. Site-wide `noindex` until the domain is confirmed.
- **Registers/docs**: `docs/OWNER-DECISIONS.md` (32 tracked items), `docs/SETUP.md`,
  `docs/evidence/phase-1/` (26 screenshots).

## Verification evidence

- `npm run typecheck` ✓ `npm run lint` ✓ `npm test` 15/15 ✓ `npm run build` ✓
- `npm run test:e2e` **52/52** ✓ — every route renders with one h1 and zero console errors;
  drawer opens/traps focus/closes on Esc and returns focus; skip link is first tab stop; desktop
  nav keyboard-operable; wa.me href format; axe WCAG 2.2 AA scans on 6 pages with no
  serious/critical violations; honest 404s; "Lets Move" never appears.
- Screenshots at 320/375/768/1024/1440 px + reduced-motion for 5 pages, no horizontal overflow at
  any width: `docs/evidence/phase-1/`.
- Banned-claims sweep of `src/` clean (no best/guaranteed/24-7/etc. as claims).

## Issues found and fixed during verification

1. **TS 7 / ESLint 10 incompatible with Next 16 lint config** → pinned TypeScript **6.0.3** and
   ESLint **9.39.5**. Do not blind-upgrade these two. `eslint.config.mjs` imports
   `eslint-config-next/core-web-vitals` + `/typescript` directly (FlatCompat does not work).
2. **Desktop header overflowed 124px at exactly 1024px** → full nav now appears from 1280px
   (`xl:`); 1024 uses the drawer; header button uses the wireframe's short "WhatsApp" label.
3. **Heading hierarchy** (2026-08-15 review) → `PendingSection` placeholder titles now default to
   `h3` because they sit beneath a section `h2` (Contact keeps `h2` where the panel is a
   sibling); Insights' hidden section heading renamed to "Articles". A heading-order assertion
   was added to the route e2e tests so no page skips a level.

## Assumptions recorded this phase

Repo-local git identity `Moeen <info@pickigo.com>` (change with `git config` if wrong); npm with
exact version pins; `noindex` pre-launch; dynamic slugs 404 until Phases 4/6; generic official
emergency routes (999, National Gas Emergency 0800 111 999) on /maintenance pending approved
wording — all in `docs/OWNER-DECISIONS.md`.

## Standing workflow (user instructions, 2026-08-13)

1. Wait for explicit go-ahead before each phase.
2. Show each phase in a Chrome window for the second screen (`npm run start`, then open
   http://localhost:3000).
3. Divide phase work between parallel agents as much as possible (explicit multi-agent opt-in).

## Phase 2 plan (on go-ahead, Saturday 2026-08-15)

Polished static vertical slice per `prompts/phases/02-static-vertical-slice.md`: homepage visual
polish (incl. static house-story fallback and map/list preview fallback), one property search
page, one property detail page, one illustrative rental-report result — using the labelled demo
data from `data/sample-properties.json`, no advanced motion. Planned agent split: (a) homepage
polish, (b) property search + detail, (c) rental-report result, (d) independent copy-audit +
test agent; integration and final verification single-threaded.
