# Phase 3 report — production homepage and 3D house

> **Revision 2 (18/08/2026)** — see "Revision 2" at the end: the house is now the large detached
> home from the owner's floor plan, the story is a six-chapter viewing with people, the pace is
> slower, and `/properties` shows the real portfolio (street + district only).

Branch `feature/homepage-production` (worktree `D:\4. Website\Red-Brick-Landing-Experiments\homepage-production`),
created from `experiment/phase2-new-flow` @ `e422e74`. Built 17/08/2026. `main` is not merged.
`/experiments/hybrid-db` and every experiment evidence file are unchanged (the full-suite run
re-captured them; the captures were reverted so history stays intact).

## What was built

### Production homepage `/` (storyboard v3 order)
1. **Cinematic hero** — live semantic text and the three actions render first (server HTML).
   Poster-first media frame (`/media/posters/hero-12217554.webp`, `fetchpriority=high`, LCP);
   `<picture>` swaps the 720 px portrait crop below 48 rem. `PosterVideo` layers a muted,
   play-once, never-looping `<video>` **only** for eligible desktops (no reduced motion, no
   Save-Data, ≥ 64 rem) **and only when a derivative exists** — none exists yet, so the hero is
   poster-only (see media below). Caption: "Illustrative stock footage."
2. **Audience choice** — "I'm a landlord" / "I'm looking for a home" are anchors to
   `#house-story` (work without JS, keep the visitor on the page); with JS they record the
   choice in `sessionStorage['rb-story']` only (no URL param, cookie, persistent id, analytics
   or CRM) and the story personalises. "View properties" → `/properties`. Separate labelled
   links to the full Landlords/Tenants pages. Visible **Switch story** control (hidden via
   `<noscript>` when there is no JavaScript). Without JavaScript the complete neutral story is
   served.
3. **Local introduction + scroll-led stock-footage story** — approved company introduction,
   three fact chips (incl. "Ask us about arranging a meeting."), five poster-first beats
   (14807040 → 14807010 → 14806944 → 14807056 → 14806975) with HTML headings/captions; an
   IntersectionObserver grants play permission to at most one beat at a time.
4. **Personalised 3D-house chapter** — see below.
5. **Phase 2 properties/map preview** (`PropertyPreview`), 6. **appraisal + move-in-cost
   previews** (`AppraisalPreview`, `MoveInCostPreview`) — imported, not duplicated.
7. **Maintenance** (approved five steps), 8. **Insights** (honest empty state), 9. **WhatsApp
   conclusion** + footer.

### The 3D house (`src/lib/house/`)
- **Model**: `build-house.ts` — original programmatic Three.js model of a stylised British
  red-brick semi (Blender is not installed, so the generator is the model source): foundation
  and ground, front/rear/side brick walls and gables, two removable roof slopes + ridge, chimney
  with pots, oxblood door with fanlight/step/knob, white bay window with three glazed facets and
  lead roof, first-floor/rear/side windows, gutters and downpipe, ground and first floors,
  hallway and first-floor partitions, an instanced 12-tread stair, living room (sofa, rug,
  table), kitchen (units, worktop, tall unit, boiler), bedroom (bed with headboard, bedside table
  and lamp), bathroom (bath, basin), radiators, four pendant lights and a bedside lamp (per-bulb
  materials so rooms light one by one), smoke alarm and a loose roof tile for the care beat.
  **57 named parts** (every important part its own mesh with a stored home transform),
  shared flat materials, no textures/env map/shadows/post-processing, UVs stripped.
- **GLB**: `scripts/house/export-glb.mjs` → `public/models/red-brick-house.glb` = **755 KB**
  (uncompressed — no Draco/meshopt encoder on the machine; target ≤ 1.5 MB met),
  131 meshes / ~131 draw calls, **~10,444 triangles**, 0 textures
  (`public/models/red-brick-house.manifest.json`). The site renders from the generator at
  runtime (no model download); the GLB is the interchange deliverable.
- **Choreography**: `animation.ts` — one paused GSAP timeline per story (neutral / landlord /
  tenant), 10 units = four chapters + close: exploded entry → assembly / cutaway / repair
  beats → daylight-to-warm-dusk (key light colour/intensity, window emissive, room bulbs) →
  complete house with a slight camera pull-back. Landlord: prepare (foundation, walls, floors) →
  finding a tenant (roof, openings, trim) → managing (partitions, rooms, lights) → care (tile
  lifted/repaired, boiler and radiator checked, dusk). Tenant: exterior resolves → cutaway
  (roof lifts, front wall slides away, interior settles) → rooms and lights → care details,
  house closes up, dusk. Neutral: property → people (door opens) → communication → care.
- **Scene**: `components/home/house/house-scene.tsx` — R3F `Canvas`, `frameloop="demand"`
  (draws only when the timeline moves), DPR ≤ 1.5, `alpha`, `powerPreference: low-power`, no
  controls, `aria-hidden`, `tabindex=-1`, `pointer-events: none`; GSAP ScrollTrigger with
  `scrub` and **no pin** drives progress from the copy column (CSS sticky stage only), and
  every update calls `invalidate()`. Context loss → one-way handover.
- **Stage** (`house-stage.tsx`): server-rendered HTML first (heading, Skip story anchor →
  `#after-story` heading with `tabindex=-1`, Switch story, complete-house still, all three story
  variants' copy — neutral visible, others `hidden`), eligibility gate (reduced motion,
  Save-Data, < 64 rem, < 4 cores / < 4 GB, no WebGL2 → static), IntersectionObserver
  (600 px) → dynamic `import()` of the scene, still visible until the first successful frame,
  error boundary + import-failure + context-loss fallbacks, progress label with `aria-live`,
  `aria-current="step"` on the active chapter. Chapter length ≈ 4 × 58 vh + 40 vh ≈ 270 vh
  (within 240–320 vh).
- **Static renders**: `scripts/house/render-chapters.mjs` → `public/media/house/*.jpg` —
  18 JPEGs (3 stories × exploded, chapter-1…4, complete), 745 KB total, used as the stage still
  and the per-chapter fallback images.

### Corrections applied
- "Meetings are available by appointment." → "Ask us about arranging a meeting." globally
  (`business.meetings`, site description, CLAUDE.md fact line).
- Move-in-cost explainer rewritten to England's current rules (no rent before signing; max one
  month in advance after signing; deposit 5/6 weeks; holding deposit one week, credited only
  with the tenant's agreement), GOV.UK links + review date recorded in
  `moveInCostGuidance` (17/08/2026); unit test updated.
- "standard assured shorthold tenancy" → "an assured periodic tenancy under the current rules".
- Media register rewritten: all 16 masters with **source filename separate from Pexels ID**,
  resolution/fps/length, SHA-256, content, role (selected / alternate / reserved / not used —
  cat, blue-bedroom and mirrored-bedroom clips excluded), locations (current
  `C:\Users\moeen\Downloads`, proposed `D:\4. Website\media-masters\pexels`), poster derivatives
  and the encoder blocker.
- `next.config.ts`: `agentRules: false` (Next 16 dev appended a block to CLAUDE.md; removed).

### Media outcome
- No trusted video encoder exists on this machine (no ffmpeg/HandBrake/VLC/gltfpack/
  ImageMagick/sharp/Blender). **Derivative blocker recorded**; no 4K master was copied into
  `public/`; the homepage ships approved posters and the `<video>` path is wired for when
  derivatives are encoded (`src/content/home-media.ts` → `sources`).
- Posters (WebP, from the masters via installed Chrome, `scripts/media/capture-posters.mjs`):
  hero 1440 px **222 KB** (dense aerial; above the 120 KB target — recorded), hero mobile 720 px
  126 KB, story posters 48–107 KB.
- Masters hashed (SHA-256) — `scripts/media/masters-manifest.json` and the register.

## Skills
`docs/production-skills/SKILLS-LOCK.md` — Impeccable, frontend-ui-engineering, Vercel
react-best-practices, GSAP core/timeline/scrolltrigger/react/performance, fixing-accessibility,
fixing-motion-performance, verification-before-completion — staged project-locally in
`.claude/skills/` (Git-excluded), pinned by commit, read only, nothing executed. Three.js/R3F
followed the official docs.

## Verification (fresh, 17/08/2026, port 3113)
| Check | Result |
|---|---|
| `npm run lint` | clean |
| `npm run typecheck` | clean |
| `npm test` (Vitest) | **36 / 36** |
| `npm run build` | clean — 37 routes |
| Playwright — **whole suite** (`npx playwright test`) | **255 / 255** (routes, navigation, a11y, phase-1 evidence, experiments contracts + gallery + hybrid, phase-2 (60), phase-3 (23)) |
| Phase 3 specs | `homepage.spec` (section order, hero poster/LCP + no loop, story labels, previews, audience choice + sessionStorage only + no third-party requests, Skip anchor focus, keyboard/focus, axe); `fallbacks.spec` (reduced motion, Save-Data, no-JS, 390 px static — no canvas/video/3D download, chapter copy + images present, controls keyboard-reachable); `house.spec` (loads only on approach, still until first frame, follows scroll, decorative canvas, no pin spacers, story switch, failed WebGL, dynamic-import failure, context loss); `evidence.spec` (5 widths, zero overflow, zero console errors, reduced-motion transfer measurement) |
| Accessibility scan | axe WCAG 2.2 AA on `/` — no serious/critical (contrast fix applied to the sand-surface eyebrow) |
| Screenshots | `docs/evidence/phase-3/home-{320,390,768,1024,1440}.png`, `home-1440-reduced-motion.png`, `home-1440-no-js.png`, `home-1440-save-data.png`, `home-1440-3d-live-mid.png`, `home-1440-3d-live-end.png` |
| Console errors / horizontal overflow | zero at every width (THREE emits deprecation *warnings* only) |
| No 3D/media downloads for static fallbacks | asserted (no canvas, no video, no chunk with three/gsap/fiber/drei/house-scene, no .glb/.mp4/.webm; JS delta < 60 KB when WebGL is unavailable) |

### Measured transfer sizes (1440 × 900, `next start`, encoded on the wire)
| | Static-fallback visitor (reduced motion) | Live 3D visitor |
|---|---|---|
| Video | 0 B | 0 B (no derivatives yet) |
| Models | 0 B | 0 B (procedural at runtime) |
| Lazy 3D chunk (three + R3F + GSAP + scene) | not requested | **284 KB gzip** (1,016 KB raw; target ≤ 350 KB gz met) |
| Total JavaScript (encoded) | **173 KB** | **458 KB** (= 173 KB page + 284 KB lazy 3D chunk) |
| CSS / fonts / HTML | 8 KB / 95 KB / 19 KB | same |
| Images (posters + house stills, whole page scrolled) | 829 KB (hero 222 KB, five story posters ≈ 405 KB, house stills lazily) | 828 KB |
| Requests | 57 | 50 |
| GLB on disk (not downloaded) | 755 KB |

Full JSON: `docs/evidence/phase-3/transfer-sizes-live-1440.json`,
`transfer-sizes-reduced-motion-1440.json`.

## Design decisions made without stopping
- Runtime geometry from the generator instead of loading the GLB (zero model transfer; GLB
  delivered as the interchange asset).
- No-JS gate for JS-only controls via `<noscript><style>` (avoids hydration mismatch).
- Chunk-approach + eligibility gate as the only path that imports R3F/GSAP; everything else is
  server HTML + one CSS sticky column.
- The story-choice anchor keeps a `#house-story` fragment (in-page navigation, identical for
  both choices — not tracking).

## Owner items added (`docs/OWNER-DECISIONS.md` rows 55–61)
Approval of the 3D house look and chapter choreography; approval of the homepage copy marked
PROTOTYPE; hero/story derivatives once an encoder is available; managed-masters folder
confirmation; Pexels creator names; hero poster size trade-off; static-render refresh policy.


## Revision 2 — 18/08/2026 (owner feedback on the animation; real properties)

Owner asks answered: identical start for every story · smoother, immersive, no clipping ·
camera moves less and looks at the **front** of the house when the lights come on · slower pace ·
people who interact · take out two sides (front + right) for a Sims-style interior view · a bigger
house built from the supplied floor plan · put the real properties up without house numbers,
owners or legal details.

### The house (v2.0.0, `src/lib/house/build-house.ts`)
Large detached red-brick family home laid out from the floor plan: ground floor — drawing room
(rear left, canted bay, fireplace, two sofas), family room (French doors, sofa, TV unit), kitchen
(rear right, canted bay, units, island with hob, fridge), study + cloakroom (front left), entrance
hall with a 13-tread stair, dining room (table + six chairs), utility (boiler, washing machine);
first floor — bedrooms 1–4 with wardrobes, three en-suites, dressing room, landing. Exterior:
gabled slate roof, two chimney stacks, five front sashes, porch canopy on posts, gutters and
downpipes, 21 windows. **Real openings everywhere**: the front wall is three pieces around a real
doorway; every partition is built from segments with door gaps; the people only ever walk through
openings. Three stylised people (agent with clipboard, two applicants; shoulder-pivoted arms for
gestures) and a To Let board. 141 named parts, ~14.2k triangles, GLB **1.13 MB** (≤ 1.5 MB).

### The story (v4, `src/lib/house/animation.ts` + `story.ts`)
Six chapters + close, 14 timeline units, **the same beats for every audience** (copy differs):
1 board up, agent arrives · 2 applicants arrive, handshake, wave, nod, up the path, door opens ·
3 through the door; roof lifts, façade slides left, right wall slides right, first floor lifts as a
layer (exploded dollhouse) · 4 gesture, dining room, then via the family room to the kitchen
island (landlord: boiler check in the utility); each room lights · 5 upstairs lights as the camera
rises; the house closes around the people · 6/close: goodbye at the door (handshake, wave), agent
walks off along the pavement, board down, tile checked, dusk. Camera: ≤ ~12° orbit per chapter,
front-on for lit/dusk beats, home framing at start and end. Pace: chapter blocks 78 vh + close
50 vh (≈ 520 vh), `scrub: 1.3`, beats spread through each chapter. Stage widened to 16:10.
Renders: 24 JPEGs (3 stories × start, chapter 1–6, complete) at 1440 × 900, ≈ 1.0 MB.

### Real portfolio
See `docs/PORTFOLIO-LISTINGS.md` and OWNER-DECISIONS rows 64–69: 46 homes, street + district only,
EPC/type/floor area from the public register, Available (2) / Currently let (44) from the office
sheet; rent only for available homes; bedrooms, bathrooms and photographs "to be confirmed".

### Verification (18/08/2026, port 3113, production build)
`npm run lint` clean · `npm run typecheck` clean · Vitest **38 / 38** · Playwright phase 2 + 3
**84 / 84** (properties spec rewritten for the portfolio; house/fallback specs updated for six
chapters) · full suite re-run recorded in the commit message.
