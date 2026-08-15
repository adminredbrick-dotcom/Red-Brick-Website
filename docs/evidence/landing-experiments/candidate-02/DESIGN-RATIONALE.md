# Candidate 02 — design rationale

Route: `/experiments/candidate-02`. Server Component, no client JavaScript, CSS modules,
locally created inline SVG. Every colour, radius, shadow and typeface is a brand token.

## The subject, pinned

- **Subject:** Red Brick Lettings — residential lettings and property management across
  Peterborough, established 2012.
- **Audience:** landlords deciding who should look after a property; people looking for a
  home; current tenants who need a repair.
- **The page's single job:** orient in five seconds (who, where, what to do), offer the
  landlord/tenant choice plainly, and end on WhatsApp — without inventing anything.

The subject's own world is the material: brick, mortar courses, a front door, lit windows, a
roofline of terraces, and the brand mark itself — one continuous rounded stroke describing a
roof and a wall.

## Plan (before building)

**Colour** — the six brand tokens only: brick `#A63D2F`, deep brick `#70291F`, ink `#1D1B1A`,
cream `#F7F2EA`, sand `#E8D7C6`, stone `#716B64` (white for panels). Cream is the page; ink is a
single bounded stage; deep brick is the full stop at the end.

**Type** — the two brand faces, but with a deliberate split of duties: Roboto Condensed 700 for
the tagline, section headings, chapter names and eyebrows (short display text only), Inter for
every sentence at 18px / 1.6 with a 52–62ch measure. The condensed face at large size gives the
page a plain, signage-like confidence; the warmth comes from cream, sand and rounded panels
rather than from a decorative face.

**Layout** — three acts:

```
Act I  orientation  | hero (words left, house right) → short introduction
Act II the story    | ink stage (house in parts) → two paths → Let / Manage / Care → the house
Act III practical   | terrace roofline → Peterborough → maintenance track → the facts → WhatsApp
```

Recurring form: a label column on the left and content on the right ("ledger" layout) for the
introduction, Peterborough and the facts, so the quiet chapters share one shape.

**Signature** — *one house, drawn in one line.* The brand mark's single stroke is extended into a
whole house that reappears in three states:

1. **Elevation** in the hero — finished, brick-red, day.
2. **Exploded** on the ink stage — roof lifted, foundation lowered, rooms visible, night — the
   honest still that marks where the future scrolling story will live.
3. **Cutaway** in "The house" — front wall removed, and one continuous brick line running from
   the front door through every room and out of the chimney: communication threading through a
   home. This is the one moment of boldness on the page.

## Self-critique against the generic default

The default answer for this brief would be: centred hero with two buttons, three-column trust
strip, alternating card grids, a numbered process card row and a dark CTA band. Changes made
against that default:

- Hero is left-weighted words with the house beside them; the audience choice is two
  substantial panels, each with a one-line "what happens next", and the three utility actions
  sit under them so every locked action is visible without scrolling on desktop.
- The scrolling-story placeholder is a real chapter — a bounded ink stage with a dashed
  frame and a plain note saying it is a still — not a grey box.
- The two audience paths are drawn as paths: one line, four stops each, because
  Prepare → Let → Manage → Care and Find → Understand → Move → Live really are sequences.
- Let / Manage / Care are three courses with a brick rule above each and the stage name set
  large; only names and headings are shown, with a plain note that the detail follows.
- Maintenance is an ordered track with honest small numerals (a true sequence) and the
  approved caveat that the response depends on the issue.
- The trust section is a definition-list ledger of confirmed facts, with a sentence saying that
  anything unconfirmed is left out — trust from restraint rather than badges.
- One decorative element only: the terrace roofline that opens the practical half.

Removed in the "one accessory" pass: chapter glyphs beside the four house chapters, an
ambient float on the exploded parts, and a fourth surface colour. Motion is limited to
hover/focus transitions, which the global reduced-motion rule already disables.

## Constraints honoured

- Locked facts and labels come from `shared-copy.ts` and `approved-copy.ts`; the number is never
  retyped; the WhatsApp link uses `whatsappHref()`.
- No `serviceJourney.body` claims are displayed and no replacement service claims were written.
- Ten beats in order, each a `<section>` with a real heading; one `h1`, nine `h2`s, no skips.
- No purple, no remote assets, no maps/video/canvas/WebGL, no new dependencies.
- 44px targets, visible focus (global ring; cream ring on dark surfaces via `data-surface`),
  stone text only on cream/white (≥ 4.5:1), never on sand.
- `robots: { index: false, follow: false }` on the route.

## Interpretation notes

- "Roboto Condensed only for short display text" is read as: tagline, section headings of a
  handful of words, chapter names, eyebrows and single words. All body sentences are Inter.
- The tagline is split at its full stops for display (two block lines, first in brick); the
  words are unchanged.
