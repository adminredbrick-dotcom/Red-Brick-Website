# Candidate 03 — design rationale (anonymous)

## The idea in one line

A property has a lot of moving parts, and care is what holds them together — so the page is
**one house, shown three times**: held apart in the hero, settling into place as the reader
scrolls the journey chapter, and complete beside the verified facts.

## What the page refuses

- The estate-agent template: photo hero, three icon cards, testimonial strip, big numbers.
- Cards as page structure. Related content is grouped by proximity and hairline ledgers instead.
- Any claim the business has not confirmed. Every fact is imported from the shared copy module;
  the operational service detail (`serviceJourney.body`) is deliberately not displayed.
- Motion as decoration. There is one authored moment (the house settling into place), and it is
  scroll-driven CSS inside one bounded section, disabled under reduced motion and absent in
  browsers without scroll-driven animation — both of which see the finished house throughout.

## Composition and pacing

| Beat | Section | Ground | Device |
|---|---|---|---|
| 1 | Hero | cream + sand panel | h1 tagline, two facts, two large audience choices, quieter property/repair links; exploded house with a "2012" date stone |
| 2 | Introduction | cream | Storyboard entry line as h2; approved intro + company introduction |
| 3 | Scrolling-story placeholder | white | Five storyboard stills (locally drawn SVG) with a dashed "Placeholder" tag and a note |
| 4 | Landlord and tenant paths | cream | Two columns divided by a hairline; approved route copy; step lists; locked CTAs |
| 5 | Let, manage and care | sand | A ledger: growing brick stack, display word, approved heading — no body claims |
| 6 | House journey | ink | Sticky dusk house (bounded to the section) + four storyboard chapters; house settles into place as you scroll |
| 7 | Peterborough | cream | Typographic "PETERBOROUGH / since 2012" (short display text); facts only |
| 8 | Maintenance | white | Report → Triage → Arrange → Update → Resolve as a connected track; repair link |
| 9 | Verified trust | sand | The finished house beside the three approved trust points and the appointment line |
| 10 | Final action | deep brick | Approved closing copy; WhatsApp button; display number |

A "course" of ten small bricks sits at the top of every section, one more filled per chapter —
a quiet, ownable chapter-transition device that carries progress without section numbers.

## World

- Colours: brand tokens only — cream ground; brick as material; one ink dusk chapter and a
  deep-brick close; sand for the two "held" moments. No purple, no coral, no gradients.
- Type: Inter for everything read; Roboto Condensed only for short display words (chapter
  names, LET/MANAGE/CARE, step names, the place heading, the caption). Body 18px / 1.6, measure
  ≤ 62ch, one section rhythm with more space above headings than below.
- Surfaces: rounded but restrained (8/12/16), hairline ledgers, no drop-shadow decoration.
- Illustration: one locally authored inline SVG house whose parts are separate groups so CSS
  can hold them apart, settle them, or animate them; five storyboard stills in the same grammar.

## Accessibility decisions

- Landmarks come from the shared layout (`main`, header, footer). Every beat is a `section`
  with `aria-labelledby` pointing at a real heading; one `h1`, nine visible `h2`s, `h3`s inside.
- Every locked action is a real `<a>`/`Link` whose accessible name is exactly the locked label
  (chevrons are `aria-hidden`).
- Focus is the site's global 3px ring (cream on dark surfaces via `data-surface="dark"`).
- Contrast is checked per pair: on sand only ink/deep-brick text; stone only on cream/white;
  cream/sand on ink and deep brick.
- The sticky figure is bounded to the journey section; nothing is pinned page-wide and nothing
  hijacks scroll. Reduced motion removes the only animation and leaves the finished house.

## Known trade-offs

- The journey animation depends on `animation-timeline: view()`; browsers without it (or with
  reduced motion) get the static finished house. That is the intended fallback, not a defect.
- The storyboard is honest about being a placeholder; it does not simulate a film.
- No photography in round one, by rule; the house and stills stand in for real imagery.
