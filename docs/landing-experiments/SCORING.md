# Scoring — landing-page candidates

Neutral, evidence-based scoring out of 100. A candidate is scored only if it passes the shared
contract (`tests/e2e/experiments/landing-contract.ts`) and respects `WORKTREE-RULES.md`; failing
either is a disqualification, not a deduction.

## Rubric (100 points)

| # | Criterion | Points | What earns full marks |
|---|---|---|---|
| 1 | Five-second clarity | 15 | Within five seconds a first-time visitor knows who Red Brick is, where it works and what to do next; the tagline and "since 2012 / across Peterborough" facts are unmistakable |
| 2 | Landlord/tenant choices and CTA discovery | 15 | "I’m a landlord", "I’m looking for a home", "View properties", "Request a rental appraisal" and the repair route are all found without scrolling hunts; the choice feels natural on every viewport |
| 3 | Warmth, trust and Red Brick fit | 15 | Feels warm, calm, dependable and local; brick/cream/ink palette used with restraint; no luxury gloss, no template feel; trust is built only from approved facts |
| 4 | Story and scroll flow | 15 | The ten beats read as one story with clear chapter transitions and a visible home for the future scrolling story; pacing rewards scrolling without hijacking it |
| 5 | Readability and hierarchy | 10 | 18px/1.6 body, 55–75ch measure, clear heading levels, generous space, no wall of text |
| 6 | Mobile experience | 10 | 320px and 390px feel designed, not squeezed; touch targets ≥44px; nothing hidden that matters |
| 7 | Accessibility and reduced motion | 10 | Keyboard walk is complete and focus is always visible; landmarks/headings/labels correct; contrast ≥4.5:1; reduced-motion version loses nothing |
| 8 | Performance and stability | 5 | Small client JS, explicit image dimensions, no layout shift, no console noise, fast first paint |
| 9 | Originality and polish | 5 | An original composition (not Igloo/Resider), consistent details, nothing unfinished |

Scores are whole numbers. Give the reason for every deduction in one line.

## Required viewports

Full-page screenshots for every candidate at:

| Viewport | Represents |
|---|---|
| 320 × 800 | Smallest supported phone |
| 390 × 844 | Common phone |
| 768 × 1024 | Tablet portrait |
| 1024 × 768 | Small laptop / tablet landscape |
| 1440 × 900 | Desktop |

Plus one 1440 × 900 capture with `prefers-reduced-motion: reduce`, and the contract's own
no-overflow checks at each viewport.

## Evidence each candidate must supply

- Screenshots above in `docs/evidence/landing-experiments/candidate-0N/`
- Contract run output (all green)
- Keyboard-walk note: tab order summary and any surprises
- `NOTES.md`: approach, copy sources (verbatim vs written), assumptions, known trade-offs

## Scoring sheet template

```
Candidate: 0N        Skill: <none | frontend-design | impeccable | hallmark | ui-ux-pro-max>
Contract: PASS/FAIL  Rules: PASS/FAIL

1 Five-second clarity            __ / 15   reason
2 Choices and CTA discovery      __ / 15   reason
3 Warmth, trust, Red Brick fit   __ / 15   reason
4 Story and scroll flow          __ / 15   reason
5 Readability and hierarchy      __ / 10   reason
6 Mobile experience              __ / 10   reason
7 Accessibility, reduced motion  __ / 10   reason
8 Performance and stability      __ /  5   reason
9 Originality and polish         __ /  5   reason
Total                            __ / 100
```

## Neutrality

Score from the evidence and a live run of the candidate, not from the builder's notes. Score
all five candidates in one sitting with the same viewports and the same order of checks. Record
ties honestly. The skill assignment must not influence the score.
