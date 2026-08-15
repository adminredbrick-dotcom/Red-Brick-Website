# Notes — `/experiments/candidate-01`

## Approach

- One route (`src/app/experiments/candidate-01/page.tsx`) rendering one server component
  (`src/components/experiments/candidate-01/landing.tsx`). No client components, no client
  JavaScript of the candidate's own, no new dependencies.
- Styling is a single CSS module (`landing.module.css`) written on top of the canonical
  `--rb-*` tokens; the shared header, footer and skip link come from the root layout unchanged.
- All illustration is locally drawn inline SVG (`illustrations.tsx`, `glyphs.tsx`) in the brand
  palette. Decorative drawings are `aria-hidden`; the two that carry meaning (the story still
  frame and the terrace) are exposed as images with a short title.
- Ten beats in the brief's order, each a `<section aria-labelledby>` with a real, visible
  heading: one `h1` in the hero and nine `h2`s, with `h3`s beneath them and no level skips.
- Design thesis, signature element, tokens and wireframes: see `DESIGN-RATIONALE.md`.

## Copy sources

| Text | Source |
|---|---|
| Name, established year, area, tagline, eyebrow, supporting line, "what we do", meetings, WhatsApp label/number/link | `src/content/experiments/shared-copy.ts` (never retyped) |
| The six action labels and routes | `experimentActions` in `shared-copy.ts` |
| Let / Manage / Care names and their headings ("Let your property", "Manage your tenancy", "Care for your property") | `serviceJourney` in `shared-copy.ts` — **names and headings only; the body detail is not displayed** |
| Report → Triage → Arrange → Update → Resolve | `maintenanceSteps` in `shared-copy.ts` |
| Company introduction; "Property management is about more than paperwork…"; landlord and tenant path headings and bodies; maintenance heading and body; closing heading and body; the three trust points | `src/content/approved-copy.ts`, verbatim |
| Prepare → Let → Manage → Care; Find → Understand → Move → Live | `CLAUDE.md` experience rules |
| Chapter labels, section headings written for this page ("A local lettings business, one house at a time", "One house, told in four chapters", "Start from where you stand", "Three parts of one service", "A house is cared for in moments like these", "The facts, plainly"), the story-frame explanation and caption, the two hero tile notes, the five house-journey moment lines, "The things we can say plainly, because they are true." | Written for this candidate; kept inside the confirmed facts and the brief's voice; no operational or service claims added |

## Assumptions

- The tagline is the `h1` (as on the existing homepage); the eyebrow carries "since 2012" and
  "Peterborough" so both facts sit in the first viewport with the tagline.
- The brief lists three hero choices (landlord, tenant, property). Two of the locked labels
  ("I’m looking for a home" and "View properties") point to the same route, so the hero shows
  two audience tiles plus a quiet row of the other three locked actions rather than three equal
  tiles. All five non-WhatsApp actions are therefore visible in the hero without scrolling.
- The scrolling-story placeholder is a genuine still (drawing + four-stop track) with a caption
  saying so, rather than a dashed "coming soon" panel — it shows where the story will live
  without looking unfinished.
- The Peterborough chapter is facts only (since 2012, across Peterborough, landlords and
  tenants) with a drawn terrace; no map, no area statistics.
- Following the coordinator clarification, `serviceJourney.body` text is not displayed and no
  replacement service claims were written; the maintenance chapter shows the five step names
  with the approved body only.
- Chapter numbers (01–09) are decorative and `aria-hidden`; labels remain readable.

## Known trade-offs

- The house drawing appears twice above the fold-and-a-half (hero, then the story frame). This
  is intentional — it is the recurring object — but the two uses are close together on tall
  desktop screens.
- Hero tiles use a pseudo-element to make the whole tile clickable while the link's accessible
  name stays exactly the locked label; the focus ring therefore hugs the label text (plus a
  darkened tile border) rather than the whole tile.
- No entrance or scroll-linked motion at all. Pacing relies on surface changes and the chapter
  markers; the reduced-motion capture is visually identical to the default capture.

## Verification

Lint, typecheck, unit tests and production build clean; shared contract 14 / 14 on the final
build; screenshots at the five required viewports plus reduced motion; keyboard walk with every
stop showing a visible focus ring. Details in `VERIFICATION.md`, `KEYBOARD-WALK.md`,
`contract-run.txt` and the PNGs in this folder.
