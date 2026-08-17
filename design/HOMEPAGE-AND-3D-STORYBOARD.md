# Homepage and 3D house storyboard — v3 (17/08/2026)

Supersedes v2 (same day) and v1 (kept as `HOMEPAGE-AND-3D-STORYBOARD-v1-superseded.md`).
Incorporates the owner's conditional approval of the reference report and the approval of the
Pexels stock-footage sequence. Companion documents: `docs/REFERENCE-REPORT.md`,
`docs/MEDIA-ASSET-REGISTER.md`, `docs/OWNER-DECISIONS.md`, `CLAUDE.md`.

Still the rule: refine in low-detail browser prototypes before any final model or master
transcode. All headings and lines below are **prototype copy / storyboard labels** until the
owner approves them; only `brief/BUSINESS-FACTS-AND-COPY.md` is approved copy.

## Concept statement

**Cinematic hero → audience choice → local introduction with a scroll-led media story →
personalised 3D house journey → properties/map preview → landlord appraisal and tenant cost
tools → maintenance → insights → final WhatsApp action.**

This preserves the original concept: *"Igloo's memorable house-building story outside;
Resider's clear letting journeys inside."*

## Overall rhythm

```text
1  Cinematic hero                 cream + film   poster first; one film, plays once, holds; three live actions
2  Audience choice                —              sets landlord/tenant story for this session; stays on the page
3  Local introduction +
   scroll-led media story         white/ink      approved intro copy + five illustrative stock clips, one active
   (choice check)                 cream          only if nothing chosen; neutral story otherwise
4  3D house journey               ink            one bounded chapter, four beats, Skip story
5  Properties / map preview       white          list-first cards + static map poster (demo data, labelled)
6  Appraisal + move-in costs      sand           "What could your property rent for?" · tenant cost preview
7  Maintenance                    white          Report → Triage → Arrange → Update → Resolve
8  Insights                       cream          latest landlord / tenant / Peterborough articles
9  Final contact action           deep brick     WhatsApp
```

The beginning is confident and spacious; the media story and 3D chapter are the emotional
high point; the second half is calm, practical HTML — the D+B hybrid rhythm extended with the
Resider-inspired previews from the original concept.

---

## 1. Cinematic hero

**Purpose:** orientation in one screen. Film is a presentation layer; it never delays or
obscures the actions.

Approved film behaviour
- **One ~10-second exterior property film, one uninterrupted slow camera movement.** Source:
  Pexels 12217554 (hero/context clip, trimmed to a single move; see the register). Label:
  *illustrative stock footage*.
- Poster displayed first (the LCP element is the poster or the H1, never a canvas).
- Video may autoplay **muted** after the usable shell has loaded (`preload="none"`,
  `muted playsinline`, no controls, no sound).
- **Plays once and holds the final frame. Never loops.**
- Reduced motion and Save-Data receive the poster only.
- Mobile defaults to the poster; a separately approved, separately cropped mobile clip is
  optional and only on fast connections.
- The earlier AI clip `Using_the_approved_Red_Brick_V (1).mp4` (in `C:\Users\moeen\Downloads`)
  is a **prototype motion reference only** — its two-door architecture, 720p resolution and
  visible platform mark rule it out as a final master or as a 3D reference. Any future
  AI-generated hero must use the corrected one-home reference still and carry the public label
  *"Illustrative brand film created with AI — not an available property."*

Composition — desktop (≥ 64 rem)
- Text column left within the safe width: eyebrow, tagline (split-colour), approved supporting
  sentence, "Where would you like to start?", then the three actions as large HTML links:
  **I'm a landlord** · **I'm looking for a home** · **View properties**. Beneath, smaller and
  clearly labelled: *Landlords page* · *Tenants page* · *Request a rental appraisal* ·
  *Already rent with us? Report a repair.*
- Film right (~55 % width) in a rounded frame (16–24 px). At ≥ 90 rem the film may sit
  full-bleed behind a cream text panel; text contrast never depends on frame content.
- Header/logo remain crisp HTML above.

Composition — mobile (< 64 rem)
- DOM and visual order: text and the three actions first, poster below. Actions ≥ 44 px.

## 2. Audience choice

- **I'm a landlord** sets the *landlord* homepage story; **I'm looking for a home** sets the
  *tenant* homepage story. Both keep the visitor **on the homepage** and scroll them into the
  story; the selected 3D journey follows.
- **View properties** may navigate straight to `/properties`.
- Separate, clearly labelled links lead to the complete `/landlords` and `/tenants` pages.
- A visible **Switch story** control stays available in the media story, before the 3D chapter
  and inside it.
- Storage: only the explicit landlord/tenant preference, for the current session
  (`sessionStorage`; optionally mirrored as `?story=landlord|tenant` for sharing). Not connected
  to analytics, advertising, CRM profiling or any persistent identifier.
- Without JavaScript or without a selection: the complete **neutral HTML story** is served
  (all four neutral beats and both audience actions), so the page reads fully with no script.

## 3. Local introduction and scroll-led media story

- Opens with the approved company introduction and the three verifiable facts as quiet chips
  (since 2012 · Peterborough · *Ask us about arranging a meeting*).
- Then five stock clips in a scroll-led sequence, one section per clip, each with a short HTML
  caption/heading beside it. **One active video at a time**: a clip starts (muted, plays once,
  holds) only when its section is mostly in view and the previous clip has been paused; posters
  otherwise. Every clip is captioned *illustrative stock footage* and never described as
  Peterborough, a Red Brick-managed home, an available property or a client outcome.

| Beat | Clip (Pexels ID) | Storyboard role | Copy direction (prototype) |
|---|---|---|---|
| a | 14807040 | Doorway transition — crossing the threshold | *Every letting starts at the front door.* |
| b | 14807010 (alt 14806961) | Lounge / home — what a cared-for home feels like | *A good home should feel easy to live in.* |
| c | 14806944 (alt 14806923) | Preparation / kitchen — getting a property ready | *Preparation shows in the details.* |
| d | 14807056 | Readiness / bathroom — the practical checks | *Ready for the next tenancy.* |
| e | 14806975 | Warm conclusion — hand-off into the 3D chapter | *Now let's follow one house through the journey.* |

Excluded from the main narrative: the cat clip, the mirrored-bedroom clip and the blue-bedroom
clip (recorded in the register as not used).

Behaviour: desktop — rounded frame ~55 % width, sticky within its own beat only, poster →
play once → hold; mobile — poster only by default (optional approved mobile clip on fast
connections); reduced motion / Save-Data — posters only, no crops. Choice check at the end of
this section (only if no story chosen), then the surface turns to ink.

## 4. Interactive 3D-house chapter

### Look (reaffirmed)
Original stylised **British** red-brick house — terrace/semi, not a mansion; warm and
architectural; not futuristic, glossy, cartoonish or a development advert. Brick `#A63D2F`,
cream interior planes, ink structure, sand accents; soft daylight → warm dusk window light;
lightly rounded geometry; cutaway logic without toy people; no house number, vehicle, keys,
documents or security detail; no chrome, neon, purple or gaming effects. Reference boards
(AI or photographic) are visual reference only and are logged in the register.

### Model layers (animate independently, later phase)
Foundation/base · exterior brick walls · roof sections · front door and windows · interior
planes · room suggestion pieces · warm lights · small care details · ground plane.

### Layout
Desktop: scene ~52–58 % of the viewport, **CSS sticky** within the chapter only; copy in the
remaining column as ordinary document text; a small HTML progress label ("Chapter 2 of 4 —
Finding a tenant"); **Skip story** and **Switch story** always visible in HTML.
Mobile: **static chapter sequence by default** (one image per beat above stacked copy);
a simplified scene only if a later device check proves it worthwhile. No long pinning.

### Entry state — the moving parts
The house arrives as calm exploded layers (never broken or distressed).
Copy: **A property has a lot of moving parts.** / We bring the important ones into one clearer
journey.

### Landlord story (chapter keys prepare · let · manage · care)
Preparing the property → Finding a tenant → Managing the tenancy → Continuing property care

| Beat | Chapter name | Visual | Copy (prototype) |
|---|---|---|---|
| 1 | **Preparing the property** | Foundation and walls align; a subtle outline travels round the structure | *Start with a clear picture.* Understand the property, its condition and the next steps before it reaches the market. |
| 2 | **Finding a tenant** | Door, windows and outer brick move into place; the exterior becomes presentable and lit; one restrained listing-card shape appears in HTML beside the scene | *Present the home clearly.* Give prospective tenants the information they need to make an informed enquiry. |
| 3 | **Managing the tenancy** | Interior planes align in order; a simple line links the rooms (communication and coordination); no dashboards in the canvas | *Keep the tenancy connected.* Good management depends on clear administration, communication and follow-through. |
| 4 | **Continuing property care** | One small component is removed, restored and returned; warm light passes through as the structure settles | *Look after what happens next.* Maintenance coordination and ongoing attention help keep a property working as it should. |
| Close | — | Complete house on a warm ground plane; camera pulls back slightly; motion ends | *Your property is in good hands.* → **Request a rental appraisal** |

### Tenant story (chapter keys find · understand · live · help)
Finding a suitable home → Understanding the move → Living in the property → Getting maintenance help

| Beat | Chapter name | Visual | Copy (prototype) |
|---|---|---|---|
| 1 | **Finding a suitable home** | Simple Peterborough ground plane with a few markers; the house resolves from one | *Find the right next step.* Search clearly and understand what is actually available. |
| 2 | **Understanding the move** | House opens as a calm cutaway; key rooms visible; costs/features in HTML cards beside it | *Know the home before you commit.* See the important features, costs and practical information in one place. |
| 3 | **Living in the property** | Front door opens; a few neutral boxes settle inside; interior lights come on room by room | *Make the move clearer.* Understand the steps and what will be needed along the way. |
| 4 | **Getting maintenance help** | One simple care/repair pathway animates without signalling an emergency | *Know how to reach us.* Clear maintenance and communication routes should continue after move-in. |
| Close | — | Complete warm home; all movement settles | *A good property should feel easy to live in.* → **View properties** |

### Neutral story (no choice made or no JavaScript)
Four neutral beats — Property · People · Communication · Care — ending with both audience
actions. This is the complete server-rendered default.

These are navigation and storytelling concepts. No guarantees, service claims, response times
or operational details may be introduced through them; Let / Manage / Care stay labels.

### Motion parameters
Four or five meaningful states; progress follows the chapter's own scroll range; text changes at
stable thresholds; smooth easing, no bounce; modest camera travel; no scroll-jack.

### 3D previs rules (binding, from `CLAUDE.md`)
- One bounded homepage chapter only; **CSS sticky**; no page hijack, no ScrollTrigger pinning.
- Server-rendered HTML and a static illustration appear first and remain visible until the
  first successful canvas frame.
- Load R3F/GSAP only when the chapter approaches the viewport and the device is eligible; do
  not download or initialise 3D for reduced-motion, Save-Data, missing WebGL or
  mobile/static-default visitors.
- Canvas is decorative: `aria-hidden`, outside the tab order, no OrbitControls or pointer
  capture. All copy, progress, switching and actions remain HTML.
- Scroll updates invalidate the demand-rendered scene; error boundary, dynamic-import fallback
  and one-way WebGL context-loss fallback.
- Skip story is a real anchor that moves focus to the heading after the chapter.
- Start at ~240–300 vh; cap at 320 vh unless testing proves more is beneficial.
- Previs uses boxes, planes, flat materials and one light only — no GLB, textures, decoders,
  shadows, HDRI, post-processing or final film.
- Budgets (3D chunk ≤ 350 KB gz, model ≤ 1.5 MB, textures ≤ 2 MB, LCP ≤ 2.5 s never on the
  canvas) are **targets to measure**, not achieved facts.

## 5. Properties / map preview

Lightweight, conventional HTML: three or four sample property cards (photo placeholder, rent,
approximate area, beds, availability) each carrying **"Demonstration listing — not a real
property"**, a list-first layout with a **static map poster / lightweight placeholder** for the
Peterborough map (no map WebGL canvas on the landing page; a live map is never active while the
3D canvas is), and one action **View properties** → `/properties`.

## 6. Landlord appraisal and tenant move-in-cost tools (previews)

- **"What could your property rent for?"** — one sentence, "Indicative rental estimate — not a
  valuation", action **Request a rental appraisal** → `/rental-appraisal`.
- **Move-in costs explained** — a short HTML explanation (rent in advance, deposit cap, first
  payment) with demonstration figures clearly labelled, or a static preview of the future
  calculator; no live calculation in this phase; action → `/tenants`.

## 7. Maintenance

Report → Triage → Arrange → Update → Resolve; one repair action; no time promises.

## 8. Insights preview

Latest landlord, tenant and Peterborough insights as three plain article cards → `/insights`
(honest empty state until articles exist).

## 9. Final contact action

Deep-brick band; one WhatsApp action and the display number from `business.ts`; footer as
built in Phase 1.

---

## Media the register governs

| Asset | Used for | Notes |
|---|---|---|
| Pexels 12217554 (hero/context) | Section 1 | ~10 s single-move trim; poster; plays once, holds |
| Pexels 14807040 · 14807010/14806961 · 14806944/14806923 · 14807056 · 14806975 | Section 3 | one active at a time; posters for reduced motion/mobile |
| Static fallback sequence for the 3D chapter (per path, day + dusk) | Section 4 | illustration or AI stills with the AI label if realistic |
| 3D reference boards | Section 4 modelling | reference only |
| Demonstration property images | Section 5 | never real listings; labelled |

4K originals are **source masters** kept outside `public/`; derivatives (trims, 1080p/720p
encodes, posters) are produced only after approval and logged in
`docs/MEDIA-ASSET-REGISTER.md`.

## Prototype requirement

Before any final model or master transcode: a low-detail browser previs (boxes/planes) inside
the hybrid page validating chapter pacing, copy length, choice persistence, responsive
behaviour, WebGL failure, reduced-motion output and performance on a mid-range phone against
the budgets — **only after the owner approves this storyboard and the asset plan.**
