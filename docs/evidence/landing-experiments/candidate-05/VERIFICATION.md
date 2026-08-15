# Candidate 05 — verification log

Worktree: `D:\4. Website\Red-Brick-Landing-Experiments\candidate-05` · Branch: `experiment/candidate-05` · Date: 2026-08-15

## Static checks

| Check | Command | Result |
|---|---|---|
| Dependencies | `npm ci` | frozen lockfile; no package-file changes |
| Lint | `npm run lint` | clean |
| Types | `npm run typecheck` | clean |
| Unit tests | `npm test` | 3 files, 15 tests passed |
| Build | `npm run build` | compiled; `/experiments/candidate-05` prerendered as static (○) |
| Build-artifact sweep | node script over `.next/server/app/experiments/candidate-05.html` | 0 forbidden-claim hits in `<main>`; 1 × h1; 9 × h2 in main (12 incl. footer); no heading-level skips; all six locked labels present; `noindex`; wa.me href from the helper; no canvas/video/iframe/embed/object |

## Browser checks (serial slot on port 3111)

`npm run test:e2e -- tests/e2e/experiments/candidate-05.spec.ts` — Playwright started the
production server itself from the existing configuration.

**14 passed, 0 failed** (run twice: before and after two CSS polish fixes; both green):

1. route returns 200 with exactly one h1
2. heading levels never skip and start at h1
3. required audience actions exist with the locked labels and routes
4. keyboard reaches every required action with visible focus
5. no serious or critical axe violations (WCAG 2.2 AA tags)
6. no console errors or page errors
7–11. no horizontal overflow at 320×800, 390×844, 768×1024, 1024×768, 1440×900
12. reduced motion — page remains fully understandable and static
13. no remote third-party requests and no forbidden media elements
14. no forbidden claims in visible text and no purple in the palette

## Evidence captures

Server started with `npm run start -- -p 3111` for capture only and stopped immediately after
(no listener on 3111 afterwards). Full-page screenshots in this folder:

- `candidate-05-320x800.png`
- `candidate-05-390x844.png`
- `candidate-05-768x1024.png`
- `candidate-05-1024x768.png`
- `candidate-05-1440x900.png`
- `candidate-05-1440x900-reduced-motion.png` (`reducedMotion: "reduce"`; 0 running animations)

Also recorded during capture: no console or page errors; every `<main>` link ≥ 44 px tall;
keyboard walk in `KEYBOARD-WALK.md`.

## Scope

Only these paths were created (nothing else in the worktree changed; `.claude/skills/` stays
Git-excluded and uncommitted):

- `src/app/experiments/candidate-05/page.tsx`
- `src/components/experiments/candidate-05/{landing.tsx, landing.module.css, house-illustration.tsx}`
- `src/content/experiments/candidate-05.ts`
- `tests/e2e/experiments/candidate-05.spec.ts`
- `docs/evidence/landing-experiments/candidate-05/**`
