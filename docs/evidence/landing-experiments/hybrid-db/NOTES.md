# Hybrid D+B — "One house. Two paths. Four chapters."

Route: `/experiments/hybrid-db` · Branch: `experiment/hybrid-db` · Based on results commit
`3492c20` (`experiment/landing-results`). Round-two static storytelling prototype: semantic HTML,
CSS and local inline SVG only; no Three.js/R3F/GSAP/video/map; no new dependency.

## Six sections

| # | Section | Surface | From |
|---|---|---|---|
| 1 | Hero — eyebrow, tagline, approved supporting sentence, "Where would you like to start?", two equal choice tiles, three secondary routes, quiet house poster | cream | D (structure, tiles, quick links); house drawing shared with B's group structure |
| 2 | One house, four chapters — bounded ink stage, sticky dusk house on desktop settling from parts to a complete, warmly lit home; Prepare → Let → Manage → Care; closing line, no per-chapter CTA | ink | B (cinema) framed with D's chapter head |
| 3 | Start from where you stand — two concise panels; landlord panel carries the Let / Manage / Care ledger and "Request a rental appraisal"; tenant panel "View properties" | white | D |
| 4 | Peterborough and verified trust — "Peterborough, since 2012", approved company introduction, three facts, terrace | sand | D |
| 5 | When something needs attention — Report → Triage → Arrange → Update → Resolve, one repair action | white | D |
| 6 | Final contact — one WhatsApp action from the shared configuration, display number | deep brick | D |

Removed relative to D and B: the still-frame story placeholder, the separate Let/Manage/Care grid,
the second house journey, the repeated trust facts and "facts, plainly" panel, the ten-brick
progress course, the storyboard stills strip, the "moving parts" introduction, per-chapter CTAs,
long pinned mobile sequences, and all visitor-facing prototype language.

## Motion and fallbacks

- The only motion is a CSS scroll-driven settle inside section 2 (`view-timeline` on the
  section; walls → roof → windows → door → windows light), applied only when
  `animation-timeline` is supported, the viewport is ≥ 64rem and `prefers-reduced-motion` is
  `no-preference`. Base state is the finished, lit house.
- Mobile/tablet: two ordinary stacked stills (parts, then the finished home) bracket the four
  chapters; no sticky element.
- Reduced motion: finished house and all text, no running animations (asserted).
- No essential content depends on the illustration; the house has a text alternative only where
  it carries meaning.

## Copy sources

- Verbatim approved: tagline, eyebrow, supporting sentence, landlord/tenant route copy,
  maintenance heading/body, closing heading/body, company introduction, meetings line.
- Locked labels/routes: all six actions from `shared-copy.ts`; WhatsApp from `whatsappHref()`.
- Prototype copy (not production-approved): "Where would you like to start?", tile notes,
  "One house, four chapters" + lead, chapter names Prepare/Let/Manage/Care with storyboard
  lines, "Your property is in good hands." / "A good property should feel easy to live in.",
  "Start from where you stand", "When something needs attention", "Talk to us".

## Verification (this worktree)

lint · typecheck · unit 15/15 · production build · `hybrid-db.spec.ts` 28/28 (14 shared contract
checks + six-section limit, no prototype language, four chapters without CTAs, locked routes and
WhatsApp, 44px controls, first-viewport checks at 1440/390/320, evidence capture, reduced-motion
capture).

## Evidence files

`hybrid-db-{1440,1024,768,390,320}-{fold,full}.png`, `hybrid-db-1440-story-mid.png`,
`hybrid-db-{1440,390}-reduced-motion-full.png`.
