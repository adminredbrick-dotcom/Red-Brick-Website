# Keyboard walk — `/experiments/candidate-01` (1440 × 900, Chromium, final build)

Method: fresh page load, then repeated Tab from the document start; for every stop the focused
element, its accessible name, href, enclosing landmark, the section it sits in and whether a
visible focus indicator (outline or box-shadow) was computed. 33 stops before focus
wraps back to the document; **0 stops without a visible focus ring**.

## Summary

- Order is strictly source order: skip link → header (logo, six nav links, WhatsApp, Contact) →
  main (the two hero tiles, the three hero quick links, the two path buttons, the repair button,
  the WhatsApp button) → footer (WhatsApp, twelve links, Facebook, Instagram).
- Inside `main` the required actions are reached in the first five Tab stops after the header:
  I’m a landlord → I’m looking for a home → View properties → Request a rental appraisal →
  Already rent with us? Report a repair. The final "Message us on WhatsApp" is the last stop in
  `main` (stop 19).
- Focus ring: 3px ink outline on light surfaces; 3px cream outline inside the deep-brick closing
  chapter (`data-surface="dark"`). Hero tiles additionally darken their border while their link
  is focused.
- No focus traps, no positive tabindex, no off-screen focus, nothing focusable inside the
  decorative SVG (`focusable="false"`). The skip link is the first stop and jumps to `#main-content`.
- Surprises: none. (Below 1280px the header collapses to the menu button, so the header portion is
  four stops instead of ten; the main-content order is unchanged.)

## Stops

| # | Landmark | Accessible name | href | Section heading | Focus visible |
|---|---|---|---|---|---|
| 1 | other | Skip to main content | `#main-content` | — | yes |
| 2 | header | Red Brick Lettings — home | `/` | — | yes |
| 3 | header | Properties | `/properties` | — | yes |
| 4 | header | Landlords | `/landlords` | — | yes |
| 5 | header | Tenants | `/tenants` | — | yes |
| 6 | header | Maintenance | `/maintenance` | — | yes |
| 7 | header | Insights | `/insights` | — | yes |
| 8 | header | About | `/about` | — | yes |
| 9 | header | WhatsApp | `https://wa.me/447300856675` | — | yes |
| 10 | header | Contact | `/contact` | — | yes |
| 11 | main | I’m a landlord | `/landlords` | Property cared for. People looked after. | yes |
| 12 | main | I’m looking for a home | `/properties` | Property cared for. People looked after. | yes |
| 13 | main | View properties | `/properties` | Property cared for. People looked after. | yes |
| 14 | main | Request a rental appraisal | `/rental-appraisal` | Property cared for. People looked after. | yes |
| 15 | main | Already rent with us? Report a repair. | `/maintenance` | Property cared for. People looked after. | yes |
| 16 | main | Request a rental appraisal | `/rental-appraisal` | Start from where you stand | yes |
| 17 | main | View properties | `/properties` | Start from where you stand | yes |
| 18 | main | Already rent with us? Report a repair. | `/maintenance` | Care should not disappear after move-in | yes |
| 19 | main | Message us on WhatsApp | `https://wa.me/447300856675` | Tell us what you need help with | yes |
| 20 | footer | Message us on WhatsApp | `https://wa.me/447300856675` | — | yes |
| 21 | footer | Properties | `/properties` | — | yes |
| 22 | footer | Landlords | `/landlords` | — | yes |
| 23 | footer | Tenants | `/tenants` | — | yes |
| 24 | footer | Maintenance | `/maintenance` | — | yes |
| 25 | footer | About | `/about` | — | yes |
| 26 | footer | Insights | `/insights` | — | yes |
| 27 | footer | Contact | `/contact` | — | yes |
| 28 | footer | Rental appraisal | `/rental-appraisal` | — | yes |
| 29 | footer | Privacy | `/privacy` | — | yes |
| 30 | footer | Cookies | `/cookies` | — | yes |
| 31 | footer | Terms | `/terms` | — | yes |
| 32 | footer | Facebook | `https://www.facebook.com/RedBrickPeterborough/` | — | yes |
| 33 | footer | Instagram | `https://www.instagram.com/red_brick_lettings/` | — | yes |
