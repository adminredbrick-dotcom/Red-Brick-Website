# Verification record — `/experiments/candidate-01`

All runs on the final build (Node v24.18.0, npm 11.16.0, Windows 11), dependencies from the
frozen lockfile via `npm ci` — no package or lockfile changes.

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | clean |
| Types | `npm run typecheck` | clean |
| Unit | `npm test` | 15 / 15 passed (3 files) |
| Build | `npm run build` | success; `/experiments/candidate-01` prerendered as static |
| Shared contract | `npm run test:e2e -- tests/e2e/experiments/candidate-01.spec.ts` | **14 / 14 passed** — see `contract-run.txt` |
| Overflow at capture | scrollWidth − clientWidth at each viewport | 0px at 320, 390, 768, 1024, 1440 |
| Reduced motion | `prefers-reduced-motion: reduce` context at 1440 × 900 | media query matched; 0 running animations; page identical |
| Keyboard | Tab walk, 1440 × 900 | 33 stops, all with a visible focus ring — see `KEYBOARD-WALK.md` |

## Evidence files

- `candidate-01-320x800.png`, `candidate-01-390x844.png`, `candidate-01-768x1024.png`,
  `candidate-01-1024x768.png`, `candidate-01-1440x900.png` — full-page captures
- `candidate-01-1440x900-reduced-motion.png` — full-page capture with reduced motion
- `contract-run.txt` — Playwright list-reporter output of the shared contract
- `KEYBOARD-WALK.md` — tab-order note
- `NOTES.md` — approach, copy sources, assumptions, trade-offs
- `DESIGN-RATIONALE.md` — thesis, signature element, tokens, responsive wireframe

## Offline HTML check (prerendered output)

One `h1`; nine visible `h2` in `main` (footer adds three group headings); no heading level skips;
all six locked labels present with the locked routes (WhatsApp → `https://wa.me/447300856675`);
zero `forbiddenClaimPatterns` hits; no canvas / video / iframe / embed / object; robots meta
`noindex, nofollow`; no client `<script>` inside `main`.
