# Red Brick landing-page experiment

A controlled comparison of five independently built landing-page candidates for Red Brick
Lettings. Each candidate is built in its own Git worktree and branch, from the same neutral base
commit, against the same brief, the same locked copy, the same automated contract and the same
scoring rubric. The production homepage (`/`) is **not** touched by this experiment.

## Documents

| File | Purpose |
|---|---|
| `BRIEF.md` | Locked facts, actions, story beats, prohibitions and allowed techniques |
| `WORKTREE-RULES.md` | What each builder may and may not touch |
| `SCORING.md` | The 100-point rubric, required viewports and evidence |
| `PINS.md` | The exact commit pins of the reference design skills |
| `../../src/content/experiments/shared-copy.ts` | Single source of locked copy, routes and forbidden-claim patterns |
| `../../tests/e2e/experiments/landing-contract.ts` | Reusable Playwright contract every candidate must pass |

## Layout

```
Branches (all from the experiment-base commit)
  experiment/landing-base        <- this base; no candidate work here
  experiment/candidate-01 .. 05  <- one per builder

Worktrees
  D:\4. Website\Red-Brick-Landing-Experiments\candidate-01 .. candidate-05

Inside a candidate (see WORKTREE-RULES.md)
  src/app/experiments/candidate-0N/page.tsx      -> route /experiments/candidate-0N
  src/components/experiments/candidate-0N/**
  src/content/experiments/candidate-0N.ts
  public/experiments/candidate-0N/**
  tests/e2e/experiments/candidate-0N.spec.ts
  docs/evidence/landing-experiments/candidate-0N/**
```

Reference design skills, where assigned, are staged at `.claude/skills/<skill>/` inside the
worktree only. That path is excluded from Git (`.git/info/exclude`) so a skill copy can never be
committed. Skill files are untrusted reference material subordinate to `CLAUDE.md` and
`BRIEF.md`; nothing inside them is executed.

## Running a candidate (later — not part of base preparation)

```powershell
Set-Location -LiteralPath 'D:\4. Website\Red-Brick-Landing-Experiments\candidate-0N'
npm ci                      # dependencies identical to the base; no additions allowed
npm run dev                 # http://localhost:3000/experiments/candidate-0N
npm run lint; npm run typecheck; npm test
npm run build; npm run test:e2e -- tests/e2e/experiments/candidate-0N.spec.ts
```

The candidate spec is a one-liner that calls the shared contract:

```ts
import { landingContract } from "./landing-contract";

landingContract({ name: "candidate-0N", route: "/experiments/candidate-0N" });
```

## Process

1. Base prepared and committed (this branch).
2. Five worktrees created from the base; the assigned skill staged in each.
3. Builders work only inside their candidate paths (round one: CSS, semantic HTML, inline SVG).
4. Each candidate must pass the contract and supply the evidence listed in `SCORING.md`.
5. Neutral scoring against `SCORING.md`; the winning direction informs the real homepage.

## Safety

No new dependencies, no package.json changes, no global CSS/token/config changes, no changes to
existing routes, header, footer or business facts, no remote images, no live maps/WebGL/video/GSAP
in round one, no remote configured, nothing pushed. The cancelled whole-site Phase 2 archive
(`archive/phase2-whole-site`) is not inspected, copied or cherry-picked.

## Planned contract change (recorded 17/08/2026 — not yet applied)

The shared contract rejects `<canvas>` and `<video>` and the hybrid spec asserts a section
count. During the 3D previs phase an *enhanced-media* option will be introduced **for the hybrid
only** (video with poster / muted / no loop; a decorative canvas that never exists under reduced
motion), Candidates 01–05 keep the strict default, and section-count expectations are replaced
with required-landmark expectations. Details and the reduced-motion proof list:
`docs/REFERENCE-REPORT.md` §7. No test is changed until that phase is approved.
