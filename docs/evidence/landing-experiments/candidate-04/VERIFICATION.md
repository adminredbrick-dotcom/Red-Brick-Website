# Candidate 04 — verification

Route: `/experiments/candidate-04` · production build served by `next start -p 3111` (Playwright's own webServer for the contract; a short-lived manual server for screenshots, stopped afterwards).

## Automated checks

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm test` (vitest) | 15 / 15 passed |
| `npm run build` | clean; `/experiments/candidate-04` prerendered as static |
| `npm run test:e2e -- tests/e2e/experiments/candidate-04.spec.ts` (shared contract) | **14 / 14 passed** |

Contract tests passed: 200 + one h1 · heading levels never skip · locked labels/routes · keyboard reaches every action with visible focus · axe WCAG 2.2 AA (no serious/critical) · no console/page errors · no horizontal overflow at 320/390/768/1024/1440 · reduced motion (static, headings present) · no remote requests / forbidden media · no forbidden claims, no purple.

Prerendered-HTML scan (static): 1×h1, 9 H2s in `<main>`, no heading skips, no forbidden-claim matches, all six locked actions with correct hrefs, `noindex` present.

## Screenshots (full page)

- `candidate-04-320x800.png`
- `candidate-04-390x844.png`
- `candidate-04-768x1024.png`
- `candidate-04-1024x768.png`
- `candidate-04-1440x900.png`
- `candidate-04-1440x900-reduced-motion.png` (`prefers-reduced-motion: reduce`; byte-identical to the default capture — the page has no motion; `document.getAnimations()` running count = 0)

`scrollWidth − clientWidth` was 0 at every viewport during capture.

## Keyboard walk (1440×900, Tab from page load)

Raw log: `keyboard-walk.json`. Every focused element showed the site's 3px ink outline (cream inside dark surfaces); no element was reached without a visible indicator.

1. Skip link → `#main-content`
2–10. Shared header: logo (home), Properties, Landlords, Tenants, Maintenance, Insights, About, WhatsApp, Contact
11. **I’m a landlord** → `/landlords` (hero, filled chip, 153×48)
12. **I’m looking for a home** → `/properties` (hero chip, 225×48)
13. **View properties** → `/properties` (hero chip, 174×48)
14. **Already rent with us? Report a repair.** → `/maintenance` (hero text link, 40px tall)
15. **Request a rental appraisal** → `/rental-appraisal` (landlord path chip)
16. I’m a landlord → `/landlords` (landlord path text link)
17. View properties → `/properties` (tenant path chip)
18. I’m looking for a home → `/properties` (tenant path text link)
19. Already rent with us? Report a repair. → `/maintenance` (maintenance section)
20. **Message us on WhatsApp** → `https://wa.me/447300856675` (final action, filled chip)
21+. Shared footer: WhatsApp button, footer navigation.

Summary: tab order follows reading order exactly (hero choices → paths → maintenance → final action → footer). All five locked routes plus the WhatsApp action are reachable within 20 Tabs from page load; the first three hero actions arrive on Tabs 11–13 immediately after the shared header. No focus traps, no hidden stops, no surprises. All chips are ≥ 48px tall; text links are 40px tall with generous padding-block.

## Notes on the fix applied during verification

The locked repair label was allowed to wrap on narrow phones; a first capture showed it breaking mid-question at 320px ("Already rent with / us? …"). The question is now held on one line so any wrap falls after the "?" — the label text and accessible name are unchanged. Lint, typecheck, unit tests, build and the full contract were re-run after the change and the screenshots re-captured against the final build.
