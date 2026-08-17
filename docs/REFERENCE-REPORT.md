# Reference report — Igloo, Resider and the Dribbble media reel

Prepared 17/08/2026 on branch `experiment/hybrid-db`; revised the same day after the owner's
conditional approval (hero film, audience choice, restored practical previews, 3D previs rules,
contract consistency, media rights) and the approval of the Pexels stock-footage sequence.
The inspection itself, the BORROW / ADAPT / AVOID analysis and the overall D+B direction are
**approved**. No code, dependency or test was changed for this document.

All three references were opened directly in Chrome on this machine and captured; nothing
below is inferred from memory. The captured frames are **third-party material kept local and
untracked** in `docs/evidence/references/` (internal use only — see the README there); only
this written record, the source links and the observations are committed.

Scope reminder: these are inspiration references, not templates. The approved D+B hybrid
structure stays; the interactive 3D-house chapter stays (scope correction of 17/08/2026).

---

## 1. What was inspected

### 1.1 Igloo — https://www.igloo.inc/ (opened; 22 frames, local)

| Frame (local) | What it shows |
|---|---|
| `00-loader-preloader` | Grey full-screen preloader with an ASCII progress bar. ~14 MB of KTX2 textures downloaded before anything appears (≈60–90 s on this connection). |
| `01-hero-igloo-manifesto` | Hero: 3D igloo on a snow landscape (WebGL). Crisp HTML overlay: logo top-left, "Manifesto" paragraph top-right, "Scroll down to discover" and a sound toggle bottom-left. Igloo yaws slightly with the mouse. |
| `02–03 scroll-start-blocks-lift` | First scroll: individual ice blocks lift and glow — the object begins to come apart. |
| `04–05 transition-whiteout` | Chapter change = a fog/whiteout with a chromatic-aberration "glitch" and text scramble; the next object emerges from the fog. |
| `06–08 chapter-portfolio-01` | Chapter object: a rotating ice block containing a portfolio piece, annotated with HUD-style call-out lines and labels (label text scrambles in, "click to explore"). |
| `09–11 portfolio-02/03` | Same pattern repeated for two more portfolio blocks, each separated by fog. |
| `12–16 ring` | Fragments of the igloo's bricks reassemble into a glowing ring; the camera flies *through* it — a large scale change and the strongest "reveal" beat. |
| `17–18 finale` | Particle figure hovering over a plinth; the only navigation on the whole site (Medium / LinkedIn / X) sits on the plinth. |
| `19–21 loop` | Bricks fly back, the landscape returns, the hero re-forms — the page loops with no footer, no end state. |

Technical notes observed: the DOM is a single empty `#app` div (body `innerText` is empty), 0
`<canvas>` visible to scripts, no `<a>` links, one JS bundle. Real mouse-wheel events barely
moved it; a virtual damped scroller drives everything. On the first load the scene threw
`RangeError: Maximum call stack size exceeded` inside its Three.js update loop and never left
the preloader; a reload worked. This is exactly the failure profile CLAUDE.md forbids
(all-WebGL, no HTML fallback, hidden navigation, infinite loop).

### 1.2 Resider — https://resider.ca/home, https://resider.ca/, a listing, https://resider.ca/sell (opened; 16 frames, local)

| Frame (local) | What it shows |
|---|---|
| `01-home-hero-search` | Marketing home: full-bleed city photo, one H1 ("Find home."), one search box, top nav Buy / Sell / Areas. |
| `02–06 home sections` | Feature sections in a fixed order (headings read from the DOM): AI Companion → Map search → All statuses (comparable active / sold tables) → Building details → Mortgage ("Accurate cost analysis" + calculator) → Neighbourhood ("Local amenities and planning" with walk/bike/drive map) → Sell ("What is your home worth?" 3-step + CMA form) → legal footer. |
| `07–08 buy-grid` | `/` = the search workspace: "26,110 homes for sale" H1, card grid (photo, type · year, price, address, beds/baths/sqft/parking, MLS/brokerage/listed date). |
| `09-buy-split` | Toggle to split view: map left, single-column cards right; "Update as map moves" checkbox. |
| `10-buy-map` | Toggle to full map: price-label pins, numeric cluster bubbles, Map/Satellite, +/−, 3D, locate. Wheel-zoom is on by default (we will not copy that). |
| `11-buy-pagination` | Numbered pagination + the same legal footer. |
| `12–14 listing-detail` | Detail page: breadcrumb, 1+4 gallery, sticky in-page tab bar (Overview · Neighbourhood · Details · History · Assessment · Comparables · Contact · Nearby), key facts strip, sticky right-hand price/CTA card, long grouped fact tables, nearby schools/childcare/bus stops, FAQ. |
| `15–16 sell` | `/sell`: full-height map with sold-price pins on the left, evaluation form panel on the right (three reassurance bullets, then First/Last/Email/Phone, consent text, one button). |

### 1.3 Dribbble media reel — `cdn.dribbble.com/…/original-0990d3044a6141488c665f7c8395b409.mp4` (opened; 23.0 s, 1600×1200; sampled every 1.5 s, 17 frames, local)

A showreel for a concept website called "Elyse Residence" (a luxury-residence brand).
Timestamps are from the file's own clock.

| t | What it shows |
|---|---|
| 0.0–1.0 | A dark mosaic of the whole site's screens (bento of ~9 rounded browser frames) which zooms in to the hero. |
| 1.5 | Hero: full-bleed dusk photograph of a house inside a large rounded frame; enormous serif wordmark overlapping the photo; tiny nav (EN/DE, "Book a visit" pill, hamburger); "SCROLL" cue. |
| 3.0 | About: eyebrow "(ABOUT)", tall serif italic headline left, one portrait photo centre, short paragraph + pill button right. Lots of dark charcoal negative space. |
| 4.5–6.0 | Stats: four large serif numbers count up with staggered timing ("144k sq ft", "58 %", "29", "24/7 concierge"). |
| 7.5–10.5 | Projects: three portrait photos in a row (centre one taller), title set *across* the photos, indices (1)(2)(3); photos slide horizontally as the project changes — a carousel. |
| 12.0–13.5 | Beliefs: an image rises from the bottom-left as a masked reveal while the headline uncovers line by line; settles into photo-left / text-right. |
| 15.0–16.5 | Values: one full-bleed room photo with five frosted, rounded glass panels (1–5) laid over it; the panels move at a different speed from the photo (parallax). |
| 18.0 | Amenities: a smaller photo overlapping a full-bleed architectural photo; headline + pill button left. |
| 19.5 | Transition: the frame goes dark and the next photo wipes up from the bottom edge (mask). |
| 21.0–23.0 | Hero again, then zoom out to the mosaic — the reel loops. |

**Two honest observations about this reel.**

1. Its palette is deep charcoal / near-black, off-white serif type and the warm neutrals of the
   photography (beige, walnut, greige). There is no cream and no brick red in the file. "Cream,
   brick red and deep charcoal" is therefore Red Brick's *translation* of its rhythm, not a
   description of it.
2. It is a luxury-development presentation with exactly the claims Red Brick must not make
   ("24/7 concierge", "exclusive residences", "holistic luxury"). We borrow the presentation
   grammar only.

---

## 2. BORROW / ADAPT / AVOID (approved)

| Idea | Source | Verdict | Red Brick use |
|---|---|---|---|
| Story unfolds as you scroll; one object is the spine | Igloo | **Borrow** | One persistent red-brick house is the spine of *one bounded chapter*, not the whole page. |
| Early categorisation of the visitor | Igloo (implicit) / Resider (Buy · Sell nav) | **Borrow** | Hero offers "I'm a landlord" / "I'm looking for a home" / "View properties" as live HTML links; the landlord/tenant choice personalises the rest of the homepage (see §3). |
| Smooth chapter transitions with a change of scale (fog → object; fly-through-the-ring) | Igloo | **Adapt** | Cream→ink dissolve into the house chapter and one modest camera settle; no fog, no glitch, no chromatic aberration, camera travel kept small. |
| Object comes apart / reassembles (blocks lift, ring re-forms) | Igloo | **Adapt** | The house arrives as calm exploded layers and settles per chapter (already in the D+B hybrid). |
| Fine HUD call-out lines and labels on the object | Igloo | **Adapt** | Chapter labels stay in HTML beside the scene, never drawn in WebGL; a small progress label states the current chapter. |
| Crisp HTML overlay text over a scene | Igloo (manifesto/nav) | **Borrow** | Same principle: every word is HTML. |
| Preloader before anything is usable; ~14 MB of textures | Igloo | **Avoid** | Usable HTML shell first; the 3D chunk lazy-loads after it; budgets in §6 are targets to measure. |
| Virtual/damped scroll that hijacks the wheel; page loops forever; nav hidden on a plinth | Igloo | **Avoid** | Native scroll everywhere; CSS sticky only; a "Skip story" anchor; footer and nav always present. |
| Body copy or navigation in the canvas; empty DOM | Igloo | **Avoid** | Forbidden by CLAUDE.md; also failed once with a stack-overflow and showed nothing. |
| Editorial photography/film inside rounded frames; full-bleed media mixed with collage and restrained text panels | Dribbble reel | **Borrow** | Hero film and the scroll-led media story in rounded frames; transitional stills between practical sections. |
| Slow crops, masked reveals, crossfades, gentle scale changes | Dribbble reel (t 12.0, 19.5) | **Borrow** | The only hero/photo motion we use: ≤ 6 % crop, clip-path reveals, cross-fades; all off under reduced motion. |
| Frosted panels over a full-bleed photo with parallax | Dribbble reel (t 15.0) | **Adapt** | Sparingly, e.g. Let / Manage / Care ledger over one still on desktop; stacked plain panels on mobile; no parallax under reduced motion. |
| Dense cinematic section alternating with a quiet readable one | Dribbble reel | **Borrow** | The D+B rhythm already does this: cream → ink → white → sand → white → deep brick. |
| Count-up statistics ("144k", "24/7") | Dribbble reel (t 4.5) | **Avoid** | We have no approved figures; "since 2012" is the only number allowed and it will not animate. |
| Serif luxury voice, "book a visit", concierge/exclusivity language | Dribbble reel | **Avoid** | Brand rules: Inter/Roboto Condensed, warm and plain, no luxury styling. |
| Charcoal/near-black palette | Dribbble reel | **Adapt** | Ink `#1D1B1A` is used for the one dark chapter only; the page stays cream-led. |
| Conventional list/grid of listings with the essentials on the card | Resider `/` | **Borrow** | Properties page and the homepage preview: photo, rent, approximate area, beds/baths, availability. |
| Grid ↔ split ↔ map toggle; "update as map moves" | Resider | **Borrow** | 2D map + list, list first; map lazy-loaded; wheel-zoom off until deliberate interaction; **homepage preview uses a static map poster only**. |
| Price-label pins and cluster bubbles | Resider map | **Adapt** | Rent-label pins on approximate locations; clusters at low zoom (properties page, later phase). |
| Sticky in-page tab bar + sticky price/CTA card on the detail page | Resider listing | **Borrow** | Property detail: sticky "Enquire / WhatsApp" card; tabs Overview · Costs · Area · Enquire. |
| Grouped fact tables and FAQ on the detail page | Resider listing | **Adapt** | Only fields we actually hold; no legal/assessment/parcel data. |
| Cost calculator | Resider (mortgage) | **Adapt** | Becomes "Move-in costs" (rent in advance, deposit cap, first payment) with an "estimate only" note; homepage shows an explanation/preview, not a live tool. |
| Appraisal journey: map of context + a short form with three reassurance bullets | Resider `/sell` | **Adapt** | `/rental-appraisal`: "Indicative rental estimate", short form, WhatsApp alternative; **no** "typical response within a few hours" line. |
| Progressive area information (amenities, schools, transit) | Resider | **Adapt** | Peterborough insight inside search, property pages and the rental report — only from a configured, sourced dataset. |
| AI search, sign-in gates, "Login to view", crime/ranking data | Resider | **Avoid** | Per REFERENCE-NOTES.md and the owner register. |
| MLS wording, card layout, proprietary data | Resider | **Avoid** | Ours are rentals; wording and cards are our own. |

---

## 3. Resulting Red Brick homepage section order (revised)

Concept: **Cinematic hero → audience choice → local introduction with a scroll-led media
story → personalised 3D house journey → properties/map preview → landlord appraisal and
tenant cost tools → maintenance → insights → final WhatsApp action** — "Igloo's memorable
house-building story outside; Resider's clear letting journeys inside."

| # | Section | Surface | Media |
|---|---|---|---|
| 1 | **Cinematic hero** — tagline, supporting line, "Where would you like to start?", the three live actions (I'm a landlord · I'm looking for a home · View properties) + clearly labelled links to the full Landlords and Tenants pages, appraisal and repair | cream → film | One ~10 s exterior film (Pexels 12217554, single slow move), poster first, muted autoplay after the shell, plays once and holds, never loops; poster-only for reduced motion / Save-Data / mobile default |
| 2 | **Audience choice** — landlord or tenant sets the homepage story for this session and keeps the visitor on the page; "View properties" may go to `/properties`; visible Switch story; session-only preference, no analytics/CRM/persistent ID; complete neutral HTML story without JS or a choice | — | — |
| 3 | **Local introduction + scroll-led media story** — approved intro and facts, then five illustrative stock clips (doorway → lounge → kitchen → bathroom → warm conclusion), one active at a time, HTML captions; choice check at the end only if nothing chosen | white → ink | Pexels 14807040, 14807010/14806961, 14806944/14806923, 14807056, 14806975 — posters under reduced motion/mobile |
| 4 | **Interactive 3D-house chapter** — one persistent stylised red-brick house; four chapters for the chosen path (landlord: Preparing the property → Finding a tenant → Managing the tenancy → Continuing property care; tenant: Finding a suitable home → Understanding the move → Living in the property → Getting maintenance help; neutral: Property · People · Communication · Care); Skip story anchor; all copy in HTML | ink | R3F/Drei scene under the previs rules in §5; static illustration first and as fallback |
| 5 | **Properties / map preview** — sample cards labelled "Demonstration listing — not a real property", list-first, static Peterborough map poster / placeholder, View properties | white | Static image only; never a live map canvas alongside the 3D canvas |
| 6 | **Appraisal and move-in-cost previews** — "What could your property rent for?" → `/rental-appraisal`; move-in-cost explanation or calculator preview with demonstration figures labelled → `/tenants` | sand | — |
| 7 | **Maintenance** — Report → Triage → Arrange → Update → Resolve, repair action | white | — |
| 8 | **Insights preview** — latest landlord, tenant and Peterborough articles → `/insights` | cream | — |
| 9 | **Final contact action** — WhatsApp from configuration | deep brick | — |

Nothing else is added: no testimonials, no stats band. Peterborough proof (since 2012, facts)
lives in section 3 and in the practical sections; "Ask us about arranging a meeting" replaces
any meeting promise until arrangements are confirmed.

---

## 4. Proposed media behaviour (revised)

### Hero film and story clips (desktop ≥ 64 rem)
- Hero: `<video muted playsinline preload="none" poster>` in a rounded frame beside the text
  column (full-bleed behind a cream text panel at ≥ 90 rem). Poster paints first; the file is
  requested after the shell is interactive; **plays once, holds the last frame, no loop**;
  no controls, no sound, no autoplay dependency for content.
- Story clips: same element pattern; **one active video at a time** — a clip starts only when
  its beat is mostly in view and the previous clip has been paused; otherwise posters. Each
  beat is captioned "illustrative stock footage".
- Stills between practical sections: rounded frames, one slow crop ≤ 6 % or a clip-path
  reveal on entry; nothing loops.

### Mobile (< 64 rem)
- Hero and story: **posters by default**; a separately approved mobile hero clip is optional
  and only on fast connections without Save-Data. Text and the three actions come first in DOM
  order.
- 3D chapter: **static chapter sequence by default** (one image per beat above stacked copy).
- Properties preview: cards + static map image; the properties page itself is list-first with a
  Map tab (later phase).

### Reduced-motion, Save-Data and no-WebGL
- Posters instead of video; no crops, reveals or parallax; the 3D chapter renders as static
  images beside normal HTML steps with all beats visible; **no canvas exists and no R3F, GSAP,
  model or texture request is made**; Skip story and Switch story remain keyboard-accessible.
- WebGL unavailable or context lost → one-way fallback to the same static sequence.
- Every image has meaningful `alt` or is `aria-hidden` when decorative; no essential text in
  any image, video or canvas.

---

## 5. 3D previs rules (binding — recorded before implementation)

- One bounded homepage chapter only.
- **CSS sticky positioning**; do not hijack the page or use ScrollTrigger pinning.
- Server-rendered HTML and a static illustration appear first.
- Load R3F/GSAP only when the chapter approaches the viewport and the device is eligible.
- Do not download or initialise 3D for reduced-motion, Save-Data, unavailable-WebGL or
  mobile/static-default visitors. Mobile defaults to the static chapter sequence.
- Keep the static stage visible until the first successful canvas frame.
- Canvas is decorative: `aria-hidden`, outside the tab order, no OrbitControls or pointer capture.
- All copy, progress, switching and actions remain HTML.
- Scroll updates invalidate the demand-rendered R3F scene.
- Error boundary, dynamic-import fallback and one-way WebGL context-loss fallback.
- Skip story is a real anchor that moves focus to the heading after the chapter.
- Begin at ~240–300 vh; cap at 320 vh unless testing proves more is beneficial.
- Previs uses boxes, planes, flat materials and one light only — no GLB, textures, decoders,
  shadows, HDRI, post-processing or final film.
- The 350 KB 3D chunk and every other budget in §6 are **targets to measure**, not facts.

## 6. Performance budgets — targets to measure

| Item | Target |
|---|---|
| Hero film | ≤ 4 MB desktop (H.264 + AV1/WebM) for ~10 s; ≤ 2 MB for any approved mobile clip; poster ≤ 120 KB AVIF/WebP |
| Story clips | ≤ 3 MB each at 1080p, ≤ 1.5 MB at 720p; posters ≤ 120 KB |
| 3D chunk (R3F + Drei + scene code) | ≤ 350 KB gzipped, loaded on approach + eligibility |
| House model (later) | ≤ 1.5 MB (glTF, Draco/meshopt), ≤ 40 k triangles, ≤ 9 animatable groups |
| Textures (later) | ≤ 2 MB total (KTX2/basis), none > 1024² |
| Frame rate | 60 fps desktop / 30 fps for any future mobile scene at DPR ≤ 1.5; static if < 24 fps sustained |
| Core Web Vitals on `/` | LCP ≤ 2.5 s (poster/text, never the canvas), INP ≤ 200 ms, CLS ≤ 0.05 |
| Stills | ≤ 200 KB each at 1600 w, responsive `srcset`, AVIF/WebP |

---

## 7. Contract and rule consistency

- **Chapter names** — `CLAUDE.md` previously read "Landlord story: Prepare → Let → Manage →
  Care / Tenant story: Find → Understand → Move → Live". It now carries the storyboard v3
  names (landlord: Preparing the property → Finding a tenant → Managing the tenancy →
  Continuing property care; tenant: Finding a suitable home → Understanding the move → Living
  in the property → Getting maintenance help) with the short forms retained as chapter keys
  (prepare · let · manage · care / find · understand · live · help). The hybrid's current
  code labels ("Prepare / Let / Manage / Care") are prototype copy and will follow at build time.
- **Experiment contract** — `tests/e2e/experiments/landing-contract.ts` currently rejects
  `<canvas>` and `<video>` for every candidate ("no forbidden media elements") and the hybrid
  spec asserts "at most six major sections". Planned, **not yet applied** (no test changes in
  this pass): an *enhanced-media* contract option used **only** by the hybrid during the previs
  phase (allows `<video>` with poster/muted/no-loop and a decorative canvas that never exists
  under reduced motion), while Candidates 01–05 keep the strict default; and the section-count
  expectation is replaced with **required-landmark expectations** (hero with the three actions,
  audience choice, media story, 3D chapter with Skip/Switch, properties preview, appraisal/cost
  preview, maintenance, insights, contact). Later tests reflect the intended product (choice
  keeps the visitor on the homepage) rather than the earlier route-only behaviour.
- **Reduced-motion verification must prove:** no canvas exists; no R3F, GSAP, model or texture
  request occurs; every story step remains readable in HTML; Skip and story-switch controls
  remain keyboard-accessible.

## 8. Media rights and copy status

- `docs/evidence/references/` (Igloo, Resider, Dribbble frames) stays **private, local and
  untracked** — excluded via `.git/info/exclude`; only its README (source links, observations,
  internal-use notice) is committed. Do not delete, publish or commit the frames.
- Approved footage is Pexels stock under the Pexels License, described only as "illustrative
  stock footage"; the register (`docs/MEDIA-ASSET-REGISTER.md`) records file, page, creator,
  licence, intended use and derivatives. 4K originals are source masters kept outside `public/`.
- Realistic generated media carries: **"Illustrative brand film created with AI — not an
  available property."**
- All journey copy remains prototype copy until approved (owner row 45); Let / Manage / Care are
  labels, not service claims; "Ask us about arranging a meeting" until confirmed.
- Rights rows added to the owner register: AI platform/commercial-use rights per asset,
  input/reference rights, property/location/person permissions, 3D model/texture/HDRI licences,
  provenance marks, public AI disclosure, the provenance register, final story-copy approval.

## 9. What this report does not do

It changes no code, copy, dependency or test. Next: owner approval of this revision, the
storyboard v3 and the asset plan → then the boxes/planes 3D previs inside the hybrid page.
