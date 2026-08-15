# Candidate 05 — design rationale (anonymised)

This candidate was designed with the assigned reference design skill as its sole creative
authority. The skill is not named here or anywhere in the rendered page or screenshots. Only the
skill's bundled, local, read-only search tool was run, against its own bundled data. No
`--persist`, no `--force`, no generated design-system files, no network access, no API keys, no
downloads, no sub-skills, no other design skill.

## Local searches run (read-only)

All searches used the assigned query, `residential lettings property management Peterborough
warm trustworthy accessible Next.js`, unless noted.

| # | Mode | Result summary | Used? |
|---|---|---|---|
| 1 | `--design-system -f markdown --density 2 --motion 1 --variance 3` (no persist) | Pattern **Hero-Centric Design** (one primary CTA; hero dominates without hiding the next content cue; static hero + non-pulsing CTA under reduced motion). Style **Minimalism & Swiss** (clean, spacious, high contrast, grid-based). Effects: subtle hover 200–250 ms, clear type hierarchy, fast loading. Palette: teal/blue. Type: Cinzel + Josefin Sans. Motion: GSAP scroll-reveal snippet. Anti-patterns: poor photos, no virtual tours. | Pattern, style and effects **adopted**. Palette, fonts and GSAP **rejected** (brand tokens, `next/font` Inter/Roboto Condensed and the round-one no-GSAP rule win). |
| 2 | `--domain product -n 5` | Real Estate/Property → Hero-Centric + Feature-Rich; Glassmorphism + Minimalism recommended. | Hero-Centric **adopted**; glassmorphism **rejected** (CLAUDE.md forbids glassmorphism overload). |
| 3 | `--domain landing -n 5` | **0 results** — closest known terms "Trust & Authority + Accessible". | One permitted retry (row 4). |
| 4 | `"trust authority accessible property lettings" --domain landing -n 3` (the single narrower retry the skill's own contract allows) | **Trust & Authority + Conversion** (hero mission/credibility → proof → solution overview → clear CTA path; render static under reduced motion). **Enterprise Gateway** ("I am a…" path selection; trust signals prominent). | Section order and "I am a…" path selection **adopted**; logo carousels, badges, case studies, pricing **rejected** (prohibited claims). |
| 5 | `--domain style -n 5` | Accessible & Ethical (3–4 px focus ring, 16 px+, 44 px targets, skip links, reduced motion). Inclusive Design. **Nature Distilled** (muted earthy: terracotta, sand, cream; soft shadows; humanist sans). 3D & Hyperrealism; Vintage/Retro Film. | Accessible & Ethical and Nature Distilled **adopted** (they map onto brick/cream/sand/ink/stone). 3D, film grain **rejected**. |
| 6 | `--domain ux -n 5` | Z-index scale; render-blocking CSS; ARIA labels for icon-only controls; compact control semantics (real buttons/links, no hover-only actions); accessible authentication. | Applied where relevant: every action is a real `<a>`; icons are `aria-hidden` next to visible text; no icon-only controls; no z-index stacking beyond a bounded sticky. |
| 7 | `--domain typography -n 5` | Corporate Trust (Lexend + Source Sans 3), Medical Clean, Real Estate Luxury (Cinzel), Playful, Handwritten. | **Rejected** — fonts are locked to the existing `next/font` Inter + Roboto Condensed; the "trustworthy, accessible, readable" intent is honoured with Inter at 18 px/1.6 and 55–65ch measures. |
| 8 | `--domain color -n 5` | Trust teal + professional blue; CRM blue; slate; dark audio; event purple. | **Rejected** — palette locked to brand tokens; purple explicitly prohibited. |
| 9 | `--stack nextjs -n 6` | NEXT_PUBLIC env prefix; OG images; next.config names; explicit caching; CSP; remote image domains. | Nothing applied — the candidate adds no data fetching, images or config (all outside its allowed scope). |

The skill's quick-reference (accessibility, touch, performance, layout, typography, animation
sections) was read as reference material. Its pre-delivery checklist items that survive the
experiment rules were applied: no emoji icons (SVG only), `cursor: pointer` on actions, 200 ms
hover transitions, light-mode contrast ≥ 4.5:1, visible focus, reduced motion respected,
responsive at the required viewports.

## What the search shaped

- **Hero-Centric + "I am a…" path selection**: eyebrow → tagline `<h1>` → supporting line →
  "What would you like help with?" → two substantial choices → a quiet utility strip with the
  three remaining locked routes. One dominant primary CTA (brick), one outline secondary.
- **Trust & Authority order** adapted to the ten locked beats: credibility (facts) → paths →
  what we do → journey → local → maintenance → verified facts → one clear final action.
- **Minimalism & Swiss + Nature Distilled**: spacious sections, one accent hue, soft shadows,
  cream/white/sand-tint alternation, restrained brick-course motif under each eyebrow.
- **Accessible & Ethical**: 3 px focus outline (global), ≥ 44 px targets, semantic landmarks,
  one `<h1>`, sequential headings, decorative SVG hidden, meaningful SVG labelled.
- **Motion 1/10**: a single CSS-only "settle" of the hero house layers (700 ms, transform/opacity
  only) and 200 ms hover/focus transitions; everything is instantly in its final state under
  `prefers-reduced-motion`.

## Contrast pairs verified (WCAG 2.x formula)

| Pair | Ratio |
|---|---|
| stone `#716B64` on cream `#F7F2EA` | 4.72 |
| stone on white | 5.26 |
| stone on sand-tint (45 % sand over cream) | 4.27 → **not used**; ink is used on the tint |
| brick `#A63D2F` on cream | 5.66 |
| brick on white | 6.31 |
| brick on sand-tint | 5.12 (numerals/eyebrows only) |
| white on brick (primary button) | 6.31 |
| ink on sand | 12.23 |
| cream on deep brick `#70291F` | 9.30 |
| cream at 85–88 % over deep brick | 6.55–7.18 |
| white on deep brick (final button) | 10.37 |
