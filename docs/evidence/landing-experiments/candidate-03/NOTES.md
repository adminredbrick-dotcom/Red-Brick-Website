# Candidate 03 — notes

Route: `/experiments/candidate-03` · Branch: `experiment/candidate-03`

## Approach

One locally drawn brick house is the story spine, shown three times: held apart in the hero
("a property has a lot of moving parts"), settling into place as the reader scrolls the ink
"How a home comes together" chapter, and complete beside the verified facts. Ten beats, in the
brief's order, each a `section` with a real heading; a ten-brick "course" at the top of every
section fills one brick per chapter as a quiet transition device.

Built with semantic HTML, CSS Modules on the existing brand tokens, the shared `container-rb`
gutter utility, and locally authored inline SVG (the house, five storyboard stills, chevrons).
No new dependencies, no images, no scripts of our own, no canvas/video/map. The shared header
and footer are used unchanged. See `RATIONALE.md` for the design reasoning.

Motion: exactly one authored moment — the house assembling as the journey section is scrolled —
implemented with CSS scroll-driven animation (`animation-timeline: view()`) bounded to that
section, wrapped in `@supports` and `@media (prefers-reduced-motion: no-preference)`. Reduced
motion and non-supporting browsers see the finished house throughout; hover/focus transitions are
the only other CSS transitions.

## Copy sources

| Section | Source |
|---|---|
| Name, year, area, tagline, eyebrow, supporting line, meetings, WhatsApp | `experimentFacts` / `experimentActions` (shared-copy.ts) — never retyped |
| All six action labels and routes | `experimentActions` (shared-copy.ts) |
| "A property has a lot of moving parts." / "We bring the important ones into one clearer journey." | `design/HOMEPAGE-AND-3D-STORYBOARD.md` entry state — verbatim |
| Introduction paragraphs | `approved-copy.ts` `introductionCopy` + `companyIntroduction` — verbatim |
| Landlord / tenant route headings and bodies | `approved-copy.ts` — verbatim |
| Prepare/Let/Manage/Care and Find/Understand/Move/Live step words | `CLAUDE.md` experience rules |
| Let / Manage / Care names and headings | `serviceJourney` (shared-copy.ts) — **bodies deliberately not displayed** (coordinator note) |
| Journey chapter headings and lines; "Your property is in good hands." / "A good property should feel easy to live in." | storyboard landlord/tenant story — verbatim |
| Maintenance heading, body, step names | `approved-copy.ts` + `maintenanceSteps` — verbatim |
| Trust points, closing heading/body/CTA | `approved-copy.ts` — verbatim |
| Written by the candidate | section headings "Where the story will live", "Two ways in", "Let, manage and care", "How a home comes together", "What you can rely on"; the storyboard body/tag/note and five still labels; the paths lead; the services lead; the journey lead; the Peterborough sentence; the five one-line maintenance step descriptions; the trust lead; the two illustration descriptions |

Every written line was checked against `forbiddenClaimPatterns` and the brief's prohibitions:
no figures, times, superlatives, schemes, testimonials, portfolio wording or new service claims.

## Assumptions

- The tagline is rendered as two lines (one sentence each) at desktop widths — a presentation
  choice, the text is unchanged.
- The "2012" date stone on the house is decorative (the fact is also in HTML text next to it).
- The storyboard stills describe the *kind* of footage the future film would use (brick, doors,
  window light, rooms); they claim nothing about real properties.
- The journey's Prepare → Let → Manage → Care copy is the storyboard's landlord story; the
  close carries both the landlord and tenant lines and both CTAs.

## Verification

- `npm run lint` — 0 errors in project files (the only warnings are inside the untracked,
  git-excluded `.claude/skills/` staging folder)
- `npm run typecheck` — clean · `npm test` — 15/15 · `npm run build` — clean, route static
- `npm run test:e2e -- tests/e2e/experiments/candidate-03.spec.ts` — **14/14 passed**
  (`contract-run.txt`)
- Screenshots (`capture-evidence.mjs`, results in `capture-results.json`): full page + fold at
  320×800, 390×844, 768×1024, 1024×768, 1440×900; 1440×900 reduced-motion full page + journey
  crop; journey start/middle/end at 1440 and 390. Horizontal overflow 0 at every viewport, no
  console errors, 0 running animations under reduced motion.
- Keyboard walk: `KEYBOARD-WALK.md`.

## Known trade-offs

- The desktop journey is intentionally long (four chapters × ~52vh) so the house has room to
  settle; the mobile version uses a bounded sticky figure taking ≈36% of the viewport.
- In browsers without scroll-driven animation the journey is a static finished house with the
  chapters beside it — designed as the baseline, not a degraded state.
- No photography in round one; the illustration stands in until real Peterborough imagery is
  supplied.
