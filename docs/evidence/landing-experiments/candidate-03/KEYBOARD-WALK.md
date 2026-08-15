# Candidate 03 — keyboard walk

Recorded by `capture-evidence.mjs` (Chromium, 1440×900, Tab from page load); the raw stops are in
`capture-results.json` under `keyboardWalk`. Every stop below showed a visible focus indicator
(the site's 3px outline — ink on light surfaces, cream on the ink and deep-brick sections).

| # | Landmark | Focused control | Target |
|---|---|---|---|
| 1 | shell | Skip to main content | `#main-content` |
| 2–10 | header | Logo/home, Properties, Landlords, Tenants, Maintenance, Insights, About, WhatsApp, Contact | site routes |
| 11 | main · hero | I’m a landlord | `/landlords` |
| 12 | main · hero | I’m looking for a home | `/properties` |
| 13 | main · hero | View properties | `/properties` |
| 14 | main · hero | Already rent with us? Report a repair. | `/maintenance` |
| 15 | main · paths | Request a rental appraisal | `/rental-appraisal` |
| 16 | main · paths | I’m a landlord | `/landlords` |
| 17 | main · paths | View properties | `/properties` |
| 18 | main · paths | I’m looking for a home | `/properties` |
| 19 | main · journey close | Request a rental appraisal | `/rental-appraisal` |
| 20 | main · journey close | View properties | `/properties` |
| 21 | main · maintenance | Already rent with us? Report a repair. | `/maintenance` |
| 22 | main · final action | Message us on WhatsApp | `https://wa.me/447300856675` |
| 23 | footer | Message us on WhatsApp (shared footer) | `https://wa.me/447300856675` |

## Summary

- Tab order follows the visual and reading order exactly: hero choices → property/repair links →
  landlord path → tenant path → journey close → repair → WhatsApp. No focus traps, no
  positive `tabindex`, no hidden focusable elements.
- All six locked actions are reached within 22 stops (12 inside `main`); the first required
  action is stop 11 (after the shared header's 10 stops).
- The sticky journey figure contains no focusable content, so it never captures focus.
- Under `prefers-reduced-motion: reduce` the same walk applies; nothing is animated
  (`document.getAnimations()` running count = 0).

## Surprises

- None. Only note: the shared header contributes ten stops before `main`, which is inherited
  from the base layout and identical for every candidate.
