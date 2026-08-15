# Candidate 05 — NOTES

Route: `/experiments/candidate-05` · Branch: `experiment/candidate-05`

## Approach

A calm, hero-centric page built from semantic HTML and one CSS module. Every colour is a
canonical `--rb-*` token; type is the existing `next/font` Inter (18 px / 1.6 body) with Roboto
Condensed reserved for short uppercase labels and numerals. There is no client JavaScript in the
candidate (Server Component only), no new dependency, no remote asset. Illustration is a single
original inline-SVG red-brick house drawn in brick / deep brick / cream / sand / ink / stone,
built from independent layer groups so it can appear settled (hero), gently exploded (the static
story placeholder) and annotated (the property-care journey), plus a small decorative terrace
skyline for the local section. A four-brick "course" motif sits under every section eyebrow.

Ten beats, in the locked order, each a `<section aria-labelledby>` with a real heading:

| # | Beat | What is on the page |
|---|---|---|
| 1 | Hero | Eyebrow → `<h1>` tagline → supporting line → "What would you like help with?" → **I’m a landlord** (primary) / **I’m looking for a home** (outline) → utility strip: **View properties**, **Request a rental appraisal**, **Already rent with us? Report a repair.** House illustration beside/below. |
| 2 | Introduction | "A property has a lot of moving parts." + the approved introduction and company introduction. |
| 3 | Story placeholder | Dashed frame labelled "Static preview — the scrolling story arrives in a later stage": exploded house + Prepare / Let / Manage / Care rail. |
| 4 | Paths | Landlord card (approved heading/body, Prepare→Let→Manage→Care, **Request a rental appraisal**) and tenant card (approved heading/body, Find→Understand→Move→Live, **View properties**). |
| 5 | Let, Manage and Care | The three locked headings only — no operational body claims (coordinator clarification). |
| 6 | House journey | Annotated house (sticky within the section on ≥1024 px) beside four storyboard chapters; closes with "Your property is in good hands." and **Request a rental appraisal**. |
| 7 | Local | "Across Peterborough, since 2012" — facts only, three fact chips, terrace skyline, **View properties**. |
| 8 | Maintenance | Approved heading/body, Report → Triage → Arrange → Update → Resolve as a five-step `<ol>`, **Already rent with us? Report a repair.** |
| 9 | Trust | Four `<dl>` facts: Established in 2012 · Focused on Peterborough · Support for landlords and tenants · Meetings by appointment, plus an honest note. |
| 10 | Closing | Deep-brick band: approved heading/body, **Message us on WhatsApp** (wa.me from the helper), display number, meetings line. |

## Copy sources

- **Locked (imported, never retyped)**: facts, eyebrow "Peterborough lettings, since 2012", tagline,
  supporting line, all six action labels and routes, the WhatsApp href/number, Let/Manage/Care
  headings, the five maintenance steps — from `src/content/experiments/shared-copy.ts`.
- **Approved verbatim** (`src/content/approved-copy.ts`): introduction, company introduction,
  landlord and tenant route headings and bodies, maintenance heading and body, closing heading and
  body, the three trust points.
- **From the handoff storyboard** (`design/HOMEPAGE-AND-3D-STORYBOARD.md`): "A property has a lot
  of moving parts.", the four landlord chapter lines, "Your property is in good hands."
- **Written for this candidate** (each marked `written` in `src/content/experiments/candidate-05.ts`):
  eyebrows, "What would you like help with?", "Or go straight to", the story-placeholder heading,
  body and frame label, "Two journeys, one standard of care", "Three parts of one service,
  whichever stage your property is at.", the journey heading/lead, the local heading/body/note
  (facts only), "Facts we can stand behind", the trust note, "Get in touch".

## Assumptions

- The direct candidate instruction (CSS modules, optional local SVG, running the bundled local
  search read-only) and the coordinator clarification override the general round-one wording;
  the shared header and footer stay in place unchanged.
- The tenant card uses the locked label **View properties** rather than the starter "View available
  properties" (coordinator point 3).
- Duplicated actions (repair link in hero and maintenance; appraisal in hero, paths and journey)
  are intentional discoverability aids; the contract takes the first match.
- `color-mix()` is used for the sand tint and cream-on-deep secondary text; on the rare browser
  without it the section falls back to the cream page background.

## Known trade-offs

- The sticky house in beat 6 only engages when the chapter column is taller than the viewport
  (≥1024 px); on smaller screens the house simply sits above the chapters.
- The story placeholder is deliberately plain (dashed frame, "Static preview" label) so it cannot
  be mistaken for finished content.
- No imagery beyond SVG: round one forbids remote assets and there are no approved photographs.

## Checks

See `VERIFICATION.md` for command output and `KEYBOARD-WALK.md` for the tab order.
