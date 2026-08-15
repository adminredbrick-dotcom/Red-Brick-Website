# Candidate 02 — keyboard walk

Method: production build served on port 3111, Chromium 1440×900, Tab from page load until the
first footer stop. Focus visibility read from computed `outline` / `box-shadow` on the active
element. Raw log: `keyboard-walk-raw.json`.

## Tab order (22 stops to the first footer control)

| # | Region | Control | Target | Focus ring |
|---|---|---|---|---|
| 1 | skip link | Skip to main content | `#main-content` | visible |
| 2–10 | header (shared) | Logo, Properties, Landlords, Tenants, Maintenance, Insights, About, WhatsApp, Contact | — | visible |
| 11 | main · hero | I’m a landlord (choice panel; whole panel is the link) | `/landlords` | visible, ring wraps the panel |
| 12 | main · hero | I’m looking for a home (choice panel) | `/properties` | visible |
| 13 | main · hero | View properties | `/properties` | visible |
| 14 | main · hero | Request a rental appraisal | `/rental-appraisal` | visible |
| 15 | main · hero | Already rent with us? Report a repair. | `/maintenance` | visible |
| 16 | main · two paths | Request a rental appraisal (landlord path) | `/rental-appraisal` | visible |
| 17 | main · two paths | View properties (tenant path) | `/properties` | visible |
| 18 | main · the house | I’m a landlord | `/landlords` | visible |
| 19 | main · the house | I’m looking for a home | `/properties` | visible |
| 20 | main · maintenance | Already rent with us? Report a repair. | `/maintenance` | visible |
| 21 | main · closing (dark) | Message us on WhatsApp | `https://wa.me/447300856675` | visible — cream ring via `data-surface="dark"` |
| 22 | footer (shared) | Message us on WhatsApp | wa.me | visible |

## Observations

- Every locked action is reachable within the first eleven Tab presses inside `<main>`; the
  final WhatsApp action is the last stop in `<main>`, so the story ends where the keyboard does.
- All 22 stops report a visible focus indicator (global 3px ink ring; cream ring on the ink stage
  and the deep-brick closing band).
- No focus traps, no positive `tabindex`, no hidden focusable elements; the story stage,
  Let/Manage/Care courses, chapter list, maintenance track and facts ledger are static content
  and are correctly skipped.
- Choice panels use `aria-labelledby` (exact locked label) and `aria-describedby` (the "what
  happens next" line), so the accessible name stays exact while the description is still read.
- Smallest interactive height in `<main>` at 390px: 44px (utility text links); all others
  ≥ 53px. No targets under 44×44 at 390 px.
- Surprises: none. The shared header contributes nine stops before `<main>`; the skip link
  bypasses them.
