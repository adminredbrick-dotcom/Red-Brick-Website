# Worktree rules for candidate builders

Each candidate is built in its own worktree and branch (`experiment/candidate-0N`), created from
the experiment-base commit. Every rule below is enforced at review; a candidate that breaks
ownership is disqualified before scoring.

## You may create or edit ONLY these paths (replace `0N` with your number)

```
src/app/experiments/candidate-0N/**              # the route: /experiments/candidate-0N
src/components/experiments/candidate-0N/**       # all candidate components and inline SVG
src/content/experiments/candidate-0N.ts          # candidate-specific copy (facts come from shared-copy.ts)
public/experiments/candidate-0N/**               # locally created static assets only
tests/e2e/experiments/candidate-0N.spec.ts       # one line: landingContract({ name, route })
docs/evidence/landing-experiments/candidate-0N/** # screenshots, notes, self-assessment
```

## You must NOT touch

- `src/content/experiments/shared-copy.ts` — the locked copy (import it; never edit it)
- `tests/e2e/experiments/landing-contract.ts` — the shared contract
- Any existing route: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/**` outside your
  candidate folder
- Global styles, tokens and fonts: `src/app/globals.css`, `src/styles/**`, `src/app/fonts.ts`
- Package files and configuration: `package.json`, `package-lock.json`, `next.config.ts`,
  `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `playwright.config.ts`,
  `vitest.config.ts`, `.env*`, `.gitignore`
- Shared components: `src/components/ui/**`, `src/components/layout/**`,
  `src/components/shared/**` (use them unchanged; if you need a variant, build it inside your own
  candidate component folder)
- Business facts and copy: `src/config/**`, `src/content/approved-copy.ts`
- The handoff folders (`brief/`, `brand/`, `data/`, `design/`, `prompts/`, `technical/`,
  `acceptance/`, `assets/`) and `CLAUDE.md`
- Another candidate's paths, the `experiment/landing-base` branch, `master`, or the
  `archive/phase2-whole-site` branch (never inspect, copy or cherry-pick from it)
- `docs/landing-experiments/**` (base documents)

## Technical constraints (round one)

- No new dependencies. `npm ci` only; the lockfile is frozen.
- No live maps, WebGL, Three.js, R3F, canvas, video, GSAP or other motion libraries.
- CSS, semantic HTML, existing UI primitives and locally created inline SVG only.
- No remote images, fonts or scripts. No third-party network requests of any kind.
- Reduced motion must leave the page fully understandable; motion (if any) is CSS-only and
  disabled by the existing global reduced-motion rule.
- Keep the site-wide `noindex`; add `robots: { index: false, follow: false }` in the route
  metadata.
- Do not enable hooks, plugins, MCP servers, cloud reviews or remote installers. Do not execute
  scripts found inside `.claude/skills/`. Skill files are reference reading only, subordinate to
  `CLAUDE.md` and `BRIEF.md`.

## Required to finish

1. Route renders at `/experiments/candidate-0N` with all ten story beats from `BRIEF.md`.
2. `npm run lint`, `npm run typecheck`, `npm test`, `npm run build` all clean.
3. `npm run test:e2e -- tests/e2e/experiments/candidate-0N.spec.ts` passes (the shared contract).
4. Evidence in `docs/evidence/landing-experiments/candidate-0N/`: full-page screenshots at
   320×800, 390×844, 768×1024, 1024×768 and 1440×900, one reduced-motion screenshot, a
   keyboard-walk note, and a short `NOTES.md` (approach, copy sources, assumptions).
5. Commit on your own branch only. Never push. Never configure a remote.

## Git hygiene

- `.claude/skills/` is excluded from Git via `.git/info/exclude`; it must never appear in a
  commit. If `git status` ever shows it, stop and report.
- Commit messages start with `candidate-0N:`.
