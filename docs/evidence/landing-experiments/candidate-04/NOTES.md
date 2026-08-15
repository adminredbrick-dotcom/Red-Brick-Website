# Candidate 04 — notes

Route: `/experiments/candidate-04`
Files: `src/app/experiments/candidate-04/page.tsx`, `src/components/experiments/candidate-04/{landing.tsx, illustrations.tsx, landing.module.css}`, `src/content/experiments/candidate-04.ts`, `tests/e2e/experiments/candidate-04.spec.ts`.

## Approach

**Mood.** "Warm local confidence, architectural rhythm, approachable and dependable — not luxury, corporate, playful or purple." The page reads like a course of brick: content is set as alternating diptychs (text on one side, a hand-drawn proof on the other), and the direction flips down the page the way stretchers and headers alternate in a wall. Two full-width breaks — the story placeholder band and the five maintenance steps — interrupt the rhythm on purpose so the ten beats read as chapters, not a template.

**Structure (ten beats, locked order).**

1. Hero — a 7/5 split: dateline ("Peterborough lettings, since 2012"), the tagline as the `h1`, the approved supporting line, three chips (I'm a landlord · I'm looking for a home · View properties) and the repair route as a text link. Right half: a hand-built SVG of a two-storey red-brick house.
2. Introduction — the approved company introduction beside the approved "more than paperwork" statement, set large.
3. Story placeholder — a sand band with a dashed, labelled placeholder frame holding a static four-frame storyboard (street · house · window · door). It says plainly that the scrolling story arrives later.
4. Landlord and tenant paths — two equal columns under one heading, each with the approved route heading, body and the locked actions (Request a rental appraisal · I'm a landlord / View properties · I'm looking for a home).
5. Let, Manage and Care — three hairline rows: stage name in the display face, approved stage heading beside it. Stage bodies are intentionally not shown (coordinator instruction).
6. One home, two journeys — a small house glyph between the landlord journey (Prepare · Let · Manage · Care) and the tenant journey (Find · Understand · Move · Live), both as real ordered lists.
7. Peterborough, since 2012 — the two approved local trust sentences beside a carved datestone ("Red Brick · 2012") drawn in brickwork.
8. Maintenance — the approved heading and body, the five steps (Report → Triage → Arrange → Update → Resolve) as a numbered sequence with a brick marker per step, then the repair link again.
9. Facts you can check — the three verified trust points laid out as three sand "bricks" in stretcher bond (two above, one offset below).
10. Final action — a sand band under a brick course: "Tell us what you need help with", the filled WhatsApp chip, the display number and the appointments line.

**Type and colour.** Roboto Condensed 700 is used only for short display text (h1, h2, h3, stage names, step numbers, the datestone). Inter carries everything else at 18px / 1.6 with a 55–65ch measure. Every colour in the module references a canonical `--rb-*` token through a small scoped token block; there are no raw hex values. Brick is used as an accent (chips, marks, the door, the course bands) — never as a section fill. Text on sand uses ink or deep brick (stone on sand fails 4.5:1; stone on cream is 4.72:1).

**Motion.** None. Hover states shift colour / underline weight only, using `transform`-free transitions that the global reduced-motion rule collapses. The reduced-motion page is identical to the default page.

**Illustration.** All four figures are hand-built inline SVG (hero house, storyboard strip, journey house, datestone), drawn in the palette with a shared stretcher-bond `<pattern>`. Each carries `role="img"` with an accessible label; the storyboard captions and journeys are also present as HTML text, so the page reads fully without images.

## Copy sources

Verbatim (locked or approved):
- Facts, actions, service journey names/headings and maintenance steps: `src/content/experiments/shared-copy.ts` (never retyped).
- Approved eyebrow, supporting line, company introduction, "more than paperwork" statement, landlord/tenant route heading + body, maintenance heading + body, closing heading + body, the three trust points: `src/content/approved-copy.ts` / `brief/BUSINESS-FACTS-AND-COPY.md`.

Written for this page (kept inside the confirmed facts, no claims):
- "More than paperwork." (heading only) · "Where the story of a home will live" + placeholder sentence · "Two paths, equal care" · "For landlords" / "For tenants" · "Our service journey has three parts…" · "One home, two journeys" + body (uses the CLAUDE.md landlord/tenant story words) · "Peterborough, since 2012" (facts) · "Facts you can check" + "Three things we can say for certain, and nothing we cannot." · storyboard frame titles and captions · datestone text ("Red Brick", "2012").

## Assumptions

- The tagline is used as the `h1` (as on the production homepage) with the eyebrow set as a plain dateline rather than an uppercase kicker.
- The two "tenant" hero choices both resolve to `/properties` by the locked action table; both are shown because the brief asks for landlord, tenant and property choices in the hero.
- Let/Manage/Care shows the stage names and approved headings only; the operational bodies are held back per the coordinator's instruction, with no replacement claims.
- The shared header and footer are used unchanged; the candidate owns only the `<main>` content.
- The locked repair label is long, so it is a text link rather than a chip; on narrow phones it wraps once, after the question mark.

## Known trade-offs

- The hero on phones stacks text above the house illustration; the illustration is capped at 26rem so the actions stay near the top.
- The storyboard is a static placeholder by design; it declares itself as one.
- Section rhythm relies on hairline rules and space rather than colour bands, so the page is calm; the two sand bands are the only tonal shifts.

## Verification

See `VERIFICATION.md` for the contract run (14/14), the six full-page screenshots and the keyboard walk.
