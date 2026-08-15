# Candidate 02 — notes

Route: `/experiments/candidate-02` · Branch: `experiment/candidate-02`

## Approach

One house, drawn in one continuous line, as the spine of the page. The brand mark's single
rounded stroke is extended into a whole house that appears three times — finished (hero),
in parts on a bounded ink stage (the honest still for the future scrolling story), and as a
cutaway with one line threading through every room and out of the chimney ("The house").
Cream page, one dark stage, deep-brick full stop. Roboto Condensed for the tagline, section
headings, chapter names and eyebrows only; Inter at 18px / 1.6 for every sentence.
Server Component, CSS modules, no client JavaScript, no new dependencies. Full rationale in
`DESIGN-RATIONALE.md`.

The ten beats, in order, each a `<section>` with a real heading:

1. Hero — eyebrow, tagline (h1), supporting line, two choice panels, three utility links, house
2. Who we are — approved company introduction + approved introduction paragraph
3. The story — ink stage: exploded house, part names, "where the house story will live" note
4. Two paths — Prepare→Let→Manage→Care / Find→Understand→Move→Live, each ending in its action
5. Let, Manage and Care — names and headings only
6. The house — cutaway, four chapters (Property, People, Communication, Care), both audience actions
7. Peterborough — terrace roofline, "Across Peterborough, since 2012", approved facts
8. Maintenance — Report→Triage→Arrange→Update→Resolve track, repair action
9. The facts — ledger of confirmed facts only
10. Talk to us — Message us on WhatsApp, display number, appointment line

## Copy sources

| Text | Source |
|---|---|
| Name, 2012, Peterborough, tagline, eyebrow, supporting line, meetings, WhatsApp label/number/href | `shared-copy.ts` → `business.ts` / `whatsappHref()` (imported, never retyped) |
| All six action labels and routes | `experimentActions` (exact labels) |
| Company introduction, introduction paragraph, landlord/tenant route headings and bodies, maintenance heading/body, closing heading/body, three trust-point sentences | `approved-copy.ts` (verbatim, imported) |
| Let / Manage / Care names and "Let your property" etc. headings | `serviceJourney` names + headings only (bodies deliberately not shown) |
| "A property has a lot of moving parts." / "We bring the important ones into one clearer journey." | `design/HOMEPAGE-AND-3D-STORYBOARD.md` entry state, verbatim |
| Path step lines (Start with a clear picture… Know how to reach us.) | Storyboard chapter headings, verbatim |
| "Your property is in good hands." / "A good property should feel easy to live in." | Storyboard finale lines, verbatim |
| "How care holds a home together" | `brief/WEBSITE-CONCEPT-v1.md` concept line |
| Maintenance step lines | Phase 1 `src/app/maintenance/page.tsx` (`stepDetails`) |
| Chapter eyebrows, choice-panel "what happens next" lines, house chapter lines (Property, Communication, Care), services lede/note, local note, facts note, placeholder note | Written for this candidate, within confirmed facts |

## Assumptions and interpretations

- "Roboto Condensed only for short display text" read as headings of a handful of words,
  chapter names, single words and eyebrows; all sentences are Inter.
- The tagline is split at its full stops into two display lines (first line brick); words unchanged.
- The exact `experimentActions` labels are used everywhere; the alternative starter labels in
  `brief/BUSINESS-FACTS-AND-COPY.md` ("Let or manage my property", "Find a home") are not.
- The scrolling-story placeholder is a designed still with a dashed frame and a plain note; no
  motion of any kind is used on it (round one is static by brief).
- Choice panels are whole-panel links named by `aria-labelledby` (exact label) and described by
  `aria-describedby`; the ring wraps the whole panel.
- Sticky positioning is used once, bounded to "The house" section on ≥1024px, as the visible
  home for the future pinned scene. It is layout, not motion, and is unaffected by reduced motion.
- No candidate-local header/footer; the shared header and footer are used unchanged.

## Known trade-offs

- The hero house is a supporting object, not a full-bleed scene, so five-second clarity stays
  with the words on every viewport; on very wide screens there is generous cream around it.
- Beat 4 (paths) and beat 5 (Let, Manage and Care) both mention Let/Manage/Care; the brief
  requires both beats. Beat 4 shows the journey; beat 5 names the stages with headings only.
- The two utility links wrap onto two lines at 1440px because the hero text column is 7/12 wide
  and the repair link is deliberately subordinate on its own line.
- Only the shared `Card`/`Button` primitives' *behaviour* is mirrored (min-heights, radii,
  colours) in candidate CSS-module classes, so the candidate never edits shared components.

## Verification

- `npm run lint` clean · `npm run typecheck` clean · `npm test` 15/15 · `npm run build` clean
  (`/experiments/candidate-02` prerendered static)
- Shared contract `npm run test:e2e -- tests/e2e/experiments/candidate-02.spec.ts`:
  **14 passed** — output in `contract-run.txt`
- Screenshots (full page, production build): `candidate-02-320x800.png`, `-390x844.png`,
  `-768x1024.png`, `-1024x768.png`, `-1440x900.png`, `-1440x900-reduced-motion.png`;
  horizontal overflow 0 at every viewport; 0 running animations under reduced motion
- Keyboard walk: `KEYBOARD-WALK.md` (+ `keyboard-walk-raw.json`)
- No targets under 44×44 px in `<main>` at 390px
