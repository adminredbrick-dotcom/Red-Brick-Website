# Round 1 results — landing-page experiment

Recorded 2026-08-15 on branch `experiment/landing-results` (from gallery commit
`dea21a7b6f91eb9141418206d1f529086ba677f0`). Nothing in the candidate branches, the blind
evidence or the blank scorecard has been altered; this document records what happened.

## 1. Purpose and controlled methodology

**Purpose.** Compare five independently built landing-page directions for Red Brick Lettings
under identical constraints, score them blind, and select a direction for the real homepage —
without touching the production `/` route.

**Controls.**

| Control | How it was held constant |
|---|---|
| Base | Every candidate branched from `experiment/landing-base` @ `45c26e4afe06bcdd8b25191f0edb09c2d21c7779` |
| Brief | `docs/landing-experiments/BRIEF.md` — locked facts, six locked actions, ten story beats, prohibitions |
| Copy | `src/content/experiments/shared-copy.ts` (facts from `src/config/business.ts`, WhatsApp via `whatsappHref()`) — never edited by builders |
| Ownership | `docs/landing-experiments/WORKTREE-RULES.md` — each builder confined to `…/candidate-0N` paths; separate Git worktrees at `D:\4. Website\Red-Brick-Landing-Experiments\candidate-0N` |
| Technique | Round one: semantic HTML, CSS, locally drawn inline SVG only; no new dependencies, maps, WebGL, video or GSAP |
| Contract | `tests/e2e/experiments/landing-contract.ts` — 14 identical Playwright checks per candidate |
| Rubric | `docs/landing-experiments/SCORING.md` (100 points) for builders; a 10-category blind scorecard for reviewers |
| Reference skills | Pinned by commit in `docs/landing-experiments/PINS.md`; staged read-only under `.claude/skills/` in the assigned worktree only, excluded from Git, never executed |
| Blinding | Candidates merged into `experiment/landing-gallery` and exposed only as Options A–E at `/experiments/options/{a…e}` with neutral titles; allocation kept outside the repository, committed only as a SHA-256 |
| Reviewers | Independent reviewers scored from the live blind aliases and the blind screenshot pack, not from source |

## 2. Candidate commits

| Candidate | Branch | Commit | Skill assigned |
|---|---|---|---|
| 01 | `experiment/candidate-01` | `ab643ecb8bbe6f1207bfcf659c8f57f20b72ed8f` | none (control) |
| 02 | `experiment/candidate-02` | `9e13da23222686c1ad90d2d0f15e708cd7ef84f2` | Anthropic Frontend Design (`anthropics/skills` @ `f6656c1…`) |
| 03 | `experiment/candidate-03` | `3303fec15fdfd30ada5cd22f21cd6ed7e4730420` | Impeccable (`pbakaus/impeccable` @ `7b646ba…`, skill dir only) |
| 04 | `experiment/candidate-04` | `123dd198453c6557e85f10a2450aea45c53ebd3b` | Hallmark (`Nutlope/hallmark` @ `13ac0ec…`) |
| 05 | `experiment/candidate-05` | `0b791e585075937936de5abea68d0ec8166f61ea` | UI/UX Pro Max core (`nextlevelbuilder/ui-ux-pro-max-skill` @ `a38d04c…`) |

Gallery: `experiment/landing-gallery` @ `dea21a7b6f91eb9141418206d1f529086ba677f0` — the base plus
five `--no-ff` merges (candidate commits preserved as parents) plus the gallery commit.

## 3. Automated verification results

Run on the gallery tree at `dea21a7` (this branch's starting point):

| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm test` (Vitest) | 15 / 15 |
| `npm run build` | clean — 26 routes; `/experiments`, five candidate routes and five blind aliases prerendered |
| Playwright — five candidate contracts (`tests/e2e/experiments/candidate-0N.spec.ts`) | **70 / 70** (14 checks × 5): 200 + single H1, no heading skips, locked actions/labels/routes, keyboard reach + visible focus, no serious/critical axe violations, no console errors, no horizontal overflow at 320/390/768/1024/1440, reduced-motion understandable and static, no remote requests / forbidden elements, no forbidden claims, no purple |
| Playwright — gallery (`tests/e2e/experiments/gallery.spec.ts`) | **22 / 22**: gallery neutral, five equal alphabetical cards, `noindex,nofollow`; each alias 200, one H1, no console/page errors, no overflow at 390×844 and 1440×900, reduced-motion smoke |
| Route sweep | all `200`: gallery, five candidate routes, five aliases, `/`, `/landlords`, `/properties`, `/maintenance`, `/rental-appraisal` |

Builder-side evidence per candidate lives in `docs/evidence/landing-experiments/candidate-0N/`
(screenshots at the five viewports, reduced-motion capture, keyboard-walk notes, NOTES /
RATIONALE, contract runs where supplied).

## 4. Independent reviewer scores and ranking

Final independent aggregate (blind, out of 10):

| Rank | Option | Aggregate |
|---|---|---|
| 1 | **D** | **9.02** |
| 2 | C | 8.77 |
| 3 | A | 8.68 |
| 4 | B | 8.55 |
| 5 | E | 8.17 |

The blank reviewer template is `docs/evidence/landing-experiments/blind/BLIND-SCORECARD.md`
(ten categories × five options). It is preserved unfilled.

## 5. Blind map — hash and revealed allocation

- Committed commitment: `docs/evidence/landing-experiments/blind/BLIND-MAP-COMMITMENT.txt`
- SHA-256 of `D:\4. Website\Red-Brick-Landing-Experiments\BLIND-MAP.txt`:
  **`8f5a804f2868fdd1aaaaaeafae16d89e819de3da1271aff491499936bf426305`** (verified against the file
  at reveal)

Revealed allocation:

| Option | Candidate | Skill used |
|---|---|---|
| A | candidate-02 | Anthropic Frontend Design |
| B | candidate-03 | Impeccable |
| C | candidate-05 | UI/UX Pro Max (core) |
| D | candidate-01 | none — control |
| E | candidate-04 | Hallmark |

Ranking by candidate: 01 (control) 9.02 · 05 (UI/UX Pro Max) 8.77 · 02 (Frontend Design) 8.68 ·
03 (Impeccable) 8.55 · 04 (Hallmark) 8.17. The unaided control scored highest.

## 6. Strengths and weaknesses of every option

**Option D — candidate-01 (control), 9.02**
- Strengths: the clearest first viewport (eyebrow, split-colour tagline, supporting line, "Where
  would you like to start?" with two large tiles, all three secondary routes visible above the
  fold on mobile); numbered brick-course chapter markers give a calm, ownable editorial rhythm;
  warm cream/white/sand banding; strong Peterborough identity (terrace illustration); the
  five-moment "house is cared for" timeline reads well; excellent mobile clarity.
- Weaknesses: the storytelling section is a labelled still frame with little cinematic ambition;
  the house journey and the Let/Manage/Care grid overlap in purpose (two service walkthroughs);
  the trust facts appear three times (introduction chips, Peterborough points, "The facts,
  plainly"); overall length is long for a landing page.

**Option C — candidate-05 (UI/UX Pro Max), 8.77**
- Strengths: tidy, confident hero with a stately house; a clean numbered Let/Manage/Care row;
  the "How a property comes together" section with numbered call-outs on the house is a good
  bridge between illustration and copy; a compact, honest facts section.
- Weaknesses: the story stage is a boxed still with a visible "static mock" label; sections feel
  card-heavy and similar in weight, so hierarchy flattens; the local-knowledge band is thin;
  less distinctive than D.

**Option A — candidate-02 (Frontend Design), 8.68**
- Strengths: distinctive full-bleed ink "moving parts" chapter with an exploded house diagram and
  a labelled parts list — the most editorial voice; the "How care holds a home together" panel
  pairs the house with a four-line ledger neatly; a strong red brick tagline treatment.
- Weaknesses: the dark chapter arrives very early and is a placeholder rather than a story;
  Let/Manage/Care is reduced to three words with a "will be published once confirmed" line;
  the paths section is dense; the roofline divider between chapters is decorative but slightly
  busy.

**Option B — candidate-03 (Impeccable), 8.55**
- Strengths: the strongest cinema — one recurring house held apart in the hero, settling into
  place across a bounded ink "How a home comes together" chapter (CSS scroll-driven, disabled
  under reduced motion), and complete and warmly lit beside the verified facts; the cream-to-ink
  transition and the "PETERBOROUGH / since 2012" typographic band are memorable; ledgers instead
  of cards; the ten-brick progress course is quiet and consistent.
- Weaknesses: the hero is less immediate (facts sentence runs into the supporting copy; the
  storyboard-stills strip and the "moving parts" introduction delay the paths); the page is the
  longest of the five; on mobile the ink chapter's sticky figure competes with reading; the
  progress course adds visual noise on small screens.

**Option E — candidate-04 (Hallmark), 8.17**
- Strengths: the most restrained, print-like layout; readable Roboto Condensed headings; a calm
  "Two paths, equal care" and a very compact "Facts you can check" panel; light and quick.
- Weaknesses: the storyboard band is explicitly labelled a placeholder in the visitor's view; the
  hero house is a plain line drawing with less warmth; the "2012" date-stone graphic is a weak
  centrepiece for the Peterborough section; overall it reads as a template with brand colours
  rather than a Red Brick page.

## 7. Owner's decision

**Combine D and B.** D supplies the structure; B supplies the cinema.

**Decision principle: 70 % D structure, 30 % B cinema.**

- From D (≈70 %): page structure and section order, the immediate hero choices, the numbered
  brick-course chapter markers, the warm editorial layout, the Peterborough identity, the mobile
  clarity.
- From B (≈30 %): one recurring house, exploded-to-complete storytelling in a single bounded
  chapter, the cream-to-ink cinematic transition, the warm illuminated final state.
- Not carried over: neither complete page; duplicate service grids; repeated house journeys;
  repeated trust facts; excessive progress bars; long pinned mobile sequences; visitor-facing
  prototype language.

The hybrid is built at `/experiments/hybrid-db` on branch `experiment/hybrid-db` (worktree
`D:\4. Website\Red-Brick-Landing-Experiments\hybrid-db`), based on this results commit, in its own
paths only.

## 8. Warning — prototype copy is not production-approved

All headings and sentences written by builders during rounds one and two are **prototype copy**.
Only the sentences in `brief/BUSINESS-FACTS-AND-COPY.md` (mirrored in
`src/content/approved-copy.ts`) and the locked facts/actions in
`src/content/experiments/shared-copy.ts` are approved. Chapter names such as Prepare → Let →
Manage → Care are storyboard labels, not confirmed service promises. Every other line must be
reviewed and approved by the owner before it appears on the production homepage.

## 9. Evidence locations

| What | Where |
|---|---|
| Blind screenshot pack (Options A–E, 390×844 and 1440×900, fold + full) and gallery captures | `docs/evidence/landing-experiments/blind/` |
| Blank blind scorecard (preserved) | `docs/evidence/landing-experiments/blind/BLIND-SCORECARD.md` |
| Blind-map commitment (hash only) | `docs/evidence/landing-experiments/blind/BLIND-MAP-COMMITMENT.txt` |
| Blind map (outside the repository) | `D:\4. Website\Red-Brick-Landing-Experiments\BLIND-MAP.txt` |
| Per-candidate builder evidence (viewport + reduced-motion screenshots, keyboard walks, notes) | `docs/evidence/landing-experiments/candidate-01/` … `candidate-05/` |
| Candidate source | `src/app/experiments/candidate-0N/`, `src/components/experiments/candidate-0N/`, `src/content/experiments/candidate-0N.ts` |
| Contract and specs | `tests/e2e/experiments/landing-contract.ts`, `candidate-0N.spec.ts`, `gallery.spec.ts` |
| Experiment documents | `docs/landing-experiments/{README,BRIEF,PINS,SCORING,WORKTREE-RULES}.md` |
| Live review | `/experiments` (gallery) → `/experiments/options/{a…e}`; originals at `/experiments/candidate-0N` |
