# Design rationale — `/experiments/candidate-01`

## Thesis: laid course by course

A lettings relationship is built the way a wall is: one course at a time, each resting on the
one below. The page is therefore a sequence of ten short chapters rather than a stack of
marketing blocks. Every chapter after the hero opens with the same small device — a
three-course brick mark, a two-digit chapter number and a plain label — so a visitor always
knows where they are in the story, and the ten required beats read as one continuous account:
who we are → the house → two paths → what we do → a house through time → where we work → when
something goes wrong → the facts → talk to us.

The tone is warm and unhurried. Cream is the ground; white and sand bands mark chapter changes;
brick is used as accent, never as flood. Nothing moves at load. Reading is the experience, and
the drawing is there to make the reading feel placed.

## Signature element: one drawn house, seen four ways

A single flat-vector red-brick house (running-bond pattern, deep-brick roof, cream window
frames, ink door, no house number) is the object the story hangs on:

1. **Hero** — the house stands to the right of the headline on a sand base, giving the page a
   sense of arrival without a photograph.
2. **The story frame (beat 3)** — the same house, larger, inside a sand panel with a four-stop
   track (Prepare · Let · Manage · Care). This is the visible home for the future scrolling
   story; the caption says plainly that it is a still frame in this round.
3. **The property-care journey (beat 6)** — parts of the house (clipboard, key, door, window,
   spanner) become the timeline glyphs.
4. **Peterborough (beat 7)** — the house appears with its neighbours as a short terrace standing
   on the bottom edge of a sand band, grounding the page locally without a map or any invented
   figure.

The supporting device is the **course mark**: three staggered courses of brick drawn in
`currentColor`, used as the chapter marker, the list bullet in the Peterborough and trust
chapters, and the eyebrow flag in the hero.

## Tokens (candidate-local, on `.page`; all colours are the canonical `--rb-*` tokens)

| Token | Value | Use |
|---|---|---|
| `--c1-h1` | `clamp(2.25rem, 2.4vw + 1.6rem, 4.25rem)` | Hero headline (36 → 68px) |
| `--c1-h2` | `clamp(1.875rem, 1.4vw + 1.35rem, 2.75rem)` | Chapter headings (30 → 44px) |
| `--c1-h3` | `1.375rem` | Card / list headings |
| `--c1-lead` | `clamp(1.125rem, 0.4vw + 1rem, 1.3125rem)` | Introduction lead, hero supporting line |
| `--c1-body` / `--c1-leading` | `1.125rem` / `1.6` | Body text (18px / 1.6) |
| `--c1-label` | `1rem` | Chapter labels and eyebrows (Roboto Condensed, uppercase, +0.08em) |
| `--c1-measure` | `62ch` | Body measure |
| `--c1-chapter-y` | `clamp(3.5rem, 7vw, 6.5rem)` | Vertical padding of every chapter |
| `--c1-gap` | `clamp(1.5rem, 3vw, 3rem)` | Grid gaps |
| `--c1-container` / `--c1-gutter` | `75rem` / `1rem → 2rem → 3rem` | Page width and gutters (16 / 32 / 48px) |
| `--c1-radius` / `--c1-radius-sm` | `--rb-radius-lg` (16px) / `--rb-radius-sm` (8px) | Cards, tiles / buttons |
| `--c1-line` | `--rb-stone-light` | Hairlines and card borders |
| `--c1-shadow-hover` | `0 16px 36px rgb(29 27 26 / 14%)` | Tile hover lift only |
| `--c1-ease` | `220ms cubic-bezier(0.2, 0.7, 0.2, 1)` | Hover/focus transitions (zeroed by the global reduced-motion rule) |

Surfaces per chapter: hero cream · intro white · story cream (sand frame) · paths white
(cream cards) · Let/Manage/Care cream · house journey white · Peterborough sand · maintenance
white (cream steps) · trust cream (white cards) · closing deep brick (`data-surface="dark"`,
cream focus ring).

Contrast pairs used (all ≥ 4.5:1 for text): ink on cream/white/sand; stone on cream (4.8:1) and
white (5.4:1) — stone is never used on sand; brick on cream (5.7:1) for links and labels; deep
brick on sand (7.4:1) for labels; white on brick (6.3:1) for the primary button; cream on deep
brick (9.3:1) for the closing chapter.

Focus: the global `:focus-visible` 3px ink outline (cream inside the dark chapter) is kept
everywhere; hero tiles additionally darken their border when their link is focused. Hit
targets: every link is at least 44px tall (`min-height: 2.75rem` on text links, 48px on
buttons, whole-tile hit areas in the hero).

Type: Inter (existing `next/font`) for everything; Roboto Condensed only for the short
uppercase labels, the stage numerals and the step numerals.

## Responsive wireframe

```
320–639px (one column)                640–1023px                    1024px+ (two columns where useful)
┌────────────────────────┐            ┌──────────────────────────┐   ┌───────────────────────────────────────┐
│ ▮▮ EYEBROW              │            │ ▮▮ EYEBROW               │   │ ▮▮ EYEBROW              ┌──────────┐ │
│ H1 Property cared for.  │            │ H1 ……………………             │   │ H1 Property cared for.  │  house   │ │
│    People looked after. │            │ supporting line          │   │    People looked after. │  drawing │ │
│ supporting line         │            │ Where would you start?   │   │ supporting line         │          │ │
│ Where would you start?  │            │ ┌──────────┐┌──────────┐ │   │ ┌─────────┐┌─────────┐  │          │ │
│ ┌────────────────────┐  │            │ │landlord →││home →    │ │   │ │landlord││ home    │  └──────────┘ │
│ │ I’m a landlord  →  │  │            │ └──────────┘└──────────┘ │   │ └─────────┘└─────────┘               │
│ └────────────────────┘  │            │ View · Appraisal · Repair│   │ View properties · Appraisal · Repair  │
│ ┌────────────────────┐  │            │      [ house drawing ]   │   ├───────────────────────────────────────┤
│ │ I’m looking for… → │  │            ├──────────────────────────┤   │ 01 WHO WE ARE   │ lead paragraph      │
│ └────────────────────┘  │            │ 01 WHO WE ARE            │   │ H2              │ body · fact pills   │
│ View properties         │            │ H2 · lead · body · pills │   ├───────────────────────────────────────┤
│ Request an appraisal    │            ├──────────────────────────┤   │ 02 THE STORY  H2                      │
│ Already rent with us?…  │            │ 02 THE STORY  H2         │   │ ┌───────────────────────────────────┐ │
│   [ house drawing ]     │            │ ┌──────────────────────┐ │   │ │      [ large house drawing ]      │ │
├────────────────────────┤            │ │   [ house drawing ]  │ │   │ │ 01 Prepare 02 Let 03 Manage 04 Care│ │
│ 01 WHO WE ARE           │            │ │ 01 Prep 02 Let       │ │   │ └───────────────────────────────────┘ │
│ H2                      │            │ │ 03 Manage 04 Care    │ │   ├───────────────────────────────────────┤
│ lead · body · pills     │            │ └──────────────────────┘ │   │ 03 TWO PATHS  H2                      │
├────────────────────────┤            ├──────────────────────────┤   │ ┌──────────────┐ ┌──────────────┐     │
│ 02 THE STORY            │            │ 03 TWO PATHS             │   │ │ FOR LANDLORDS│ │ FOR TENANTS  │     │
│ ┌────────────────────┐  │            │ ┌──────────┐┌──────────┐ │   │ │ H3 body      │ │ H3 body      │     │
│ │ [ house drawing ]  │  │            │ │landlords ││ tenants  │ │   │ │ Prep→Let→…   │ │ Find→…→Live  │     │
│ │ 01 Prepare 02 Let  │  │            │ └──────────┘└──────────┘ │   │ │ [Appraisal]  │ │ [View props] │     │
│ │ 03 Manage 04 Care  │  │            ├──────────────────────────┤   │ └──────────────┘ └──────────────┘     │
│ └────────────────────┘  │            │ 04 LET, MANAGE AND CARE  │   ├───────────────────────────────────────┤
├────────────────────────┤            │ ▌glyph LET  ▌MANAGE ▌CARE│   │ 04 LET, MANAGE AND CARE  H2           │
│ 03 TWO PATHS            │            ├──────────────────────────┤   │ ▌LET        ▌MANAGE       ▌CARE       │
│ ┌ FOR LANDLORDS ─────┐  │            │ 05 ONE HOUSE …           │   │  H3          H3            H3         │
│ │ H3 · body          │  │            │ ○ Made ready             │   ├───────────────────────────────────────┤
│ │ Prepare→Let→…      │  │            │ │ Let                    │   │ 05 ONE HOUSE, START TO FINISH  H2     │
│ │ [Request appraisal]│  │            │ │ Moving in  …           │   │ ○───○───○───○───○                     │
│ └────────────────────┘  │            ├──────────────────────────┤   │ H3  H3  H3  H3  H3                    │
│ ┌ FOR TENANTS ───────┐  │            │ 06 PETERBOROUGH (sand)   │   ├───────────────────────────────────────┤
│ │ …  [View properties]│  │            │ H2 · body · ▮▮ facts     │   │ 06 PETERBOROUGH (sand)  │ ▮▮ fact    │
│ └────────────────────┘  │            │ [ terrace drawing ]      │   │ H2 · body               │ ▮▮ fact    │
├────────────────────────┤            ├──────────────────────────┤   │ [ terrace drawing across the band ]   │
│ 04 LET, MANAGE AND CARE │            │ 07 WHEN SOMETHING …      │   ├───────────────────────────────────────┤
│ ▌ glyph  LET  H3        │            │ 01 Report  02 Triage     │   │ 07 WHEN SOMETHING NEEDS ATTENTION H2  │
│ ▌ glyph  MANAGE  H3     │            │ 03 Arrange 04 Update     │   │ 01 02 03 04 05 (five step cards)      │
│ ▌ glyph  CARE  H3       │            │ 05 Resolve  [Report…]    │   │ [Already rent with us? Report a repair.]│
├────────────────────────┤            ├──────────────────────────┤   ├───────────────────────────────────────┤
│ 05 ONE HOUSE …          │            │ 08 PLAINLY STATED        │   │ 08 PLAINLY STATED  H2                 │
│ ○ 01 Made ready         │            │ ▮▮ 2012 ▮▮ Peterborough  │   │ ▮▮ Established  ▮▮ Focused  ▮▮ Support│
│ │ 02 Let                │            │ ▮▮ Support …             │   ├───────────────────────────────────────┤
│ │ 03 Moving in          │            ├──────────────────────────┤   │ 09 TALK TO US (deep brick)            │
│ │ 04 Living there       │            │ 09 TALK TO US (deep)     │   │ H2 · body      [Message us on WhatsApp]│
│ ○ 05 Something needs …  │            │ [Message us on WhatsApp] │   │                 WhatsApp 07300 856675 │
├────────────────────────┤            │ WhatsApp 07300 856675    │   └───────────────────────────────────────┘
│ 06 PETERBOROUGH (sand)  │            └──────────────────────────┘
│ H2 · body · ▮▮ facts    │
│ [ terrace drawing ]     │
├────────────────────────┤
│ 07 WHEN SOMETHING …     │
│ 01 Report … 05 Resolve  │
│ [Already rent with us?…]│
├────────────────────────┤
│ 08 PLAINLY STATED       │
│ three fact cards        │
├────────────────────────┤
│ 09 TALK TO US (deep)    │
│ [Message us on WhatsApp]│
│ WhatsApp 07300 856675   │
└────────────────────────┘
```

Breakpoints: 40rem (choice tiles and step cards go two-up; story track four-up), 48rem (path
cards, Let/Manage/Care and trust go side by side; gutters 32px), 64rem (hero, intro,
Peterborough and closing become two-column; house journey becomes a horizontal rail; steps go
five-up), 80rem (gutters 48px). Nothing is hidden at any width; the hero drawing simply moves
beneath the copy on small screens.

## What was deliberately not done

- No entrance or scroll-linked animation — the rhythm comes from surface changes, chapter
  markers and the still frame; reduced motion therefore loses nothing.
- No map, no figures, no photographs, no testimonials, no service detail beyond the approved
  names and headings.
- No candidate-local header or footer; the shared shell is used unchanged.
