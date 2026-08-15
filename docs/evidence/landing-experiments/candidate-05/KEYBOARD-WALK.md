# Candidate 05 — keyboard walk

Recorded at 1440 × 900 in Chromium (Playwright) on the production build, pressing Tab from page
load until focus left `<main>`. Every focused element showed the global 3 px ink outline (cream
outline inside the deep-brick closing band). All links inside `<main>` measured ≥ 44 px tall.

| # | Region | Focused element | Height |
|---|---|---|---|
| 1 | skip link | Skip to main content (becomes visible on focus) | 53 px |
| 2–10 | header (shared, unchanged) | Logo → Properties → Landlords → Tenants → Maintenance → Insights → About → WhatsApp → Contact | 44–48 px |
| 11 | main · hero | **I’m a landlord** → `/landlords` | 56 px |
| 12 | main · hero | **I’m looking for a home** → `/properties` | 56 px |
| 13 | main · hero utility strip | **View properties** → `/properties` | 44 px |
| 14 | main · hero utility strip | **Request a rental appraisal** → `/rental-appraisal` | 44 px |
| 15 | main · hero utility strip | **Already rent with us? Report a repair.** → `/maintenance` | 44 px |
| 16 | main · landlord path card | Request a rental appraisal | 50 px |
| 17 | main · tenant path card | View properties | 50 px |
| 18 | main · house journey | Request a rental appraisal | 50 px |
| 19 | main · local | View properties | 44 px |
| 20 | main · maintenance | Already rent with us? Report a repair. | 50 px |
| 21 | main · closing | **Message us on WhatsApp** → `https://wa.me/447300856675` | 56 px |
| 22 → | footer (shared, unchanged) | Message us on WhatsApp, footer navigation, social links | — |

## Observations

- Tab order matches the visual order top-to-bottom; there are no positive `tabindex` values,
  no focus traps and no hidden focus stops. The three SVG illustrations are non-focusable
  (`focusable="false"`), so nothing decorative interrupts the walk.
- All five locked routes plus the WhatsApp action are reached within the first 21 stops (11 in
  `<main>`); the contract's own Tab test confirmed the same and passed.
- The sticky house in the journey section never covers the focused control (it sits in its own
  column with `top: 2rem`).
- No surprises. The only repeat stops are the intentional duplicates of the appraisal, properties
  and repair routes further down the page.

## Reduced motion

With `prefers-reduced-motion: reduce` the page rendered identically apart from the hero house
arriving already settled; `document.getAnimations()` reported 0 running animations after load
(see `candidate-05-1440x900-reduced-motion.png`).
