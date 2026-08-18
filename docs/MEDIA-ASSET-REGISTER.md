# Media asset register

Every video, image, model, texture or reference used by the Red Brick website is recorded here
**before** it is used. Status key: **Selected** · **Alternate** · **Reserved** · **Not used** ·
**Reference only** · **Superseded**. Source filenames and public Pexels IDs are recorded
separately; nothing here is described as Peterborough, a Red Brick-managed home, an available
property or a client outcome.

Public labels: stock footage → *"Illustrative stock footage."* · realistic generated media →
*"Illustrative brand film created with AI — not an available property."*

## Locations

| What | Location | Notes |
|---|---|---|
| Current source masters (16 Pexels files, ~605 MB) | `C:\Users\moeen\Downloads` | Read in place; nothing moved. Hashes below taken 17/08/2026 |
| Proposed managed masters | `D:\4. Website\media-masters\pexels\` | **Copy** (never move) each master here, verify the SHA-256 matches, keep originals; not done yet — owner to confirm the folder |
| Web derivatives | `public/media/posters/` (posters only) | Never a 4K master, never in `public/` |
| Tooling | `scripts/media/capture-posters.mjs`, `poster-plan.json`, `masters-manifest.json`, `posters-manifest.json` | Chrome-based frame capture + SHA-256; no encoder |

## A. Pexels stock footage — all 16 masters

Licence for every row: **Pexels License** (free for commercial use, no attribution required, no
re-selling of unaltered copies, no implied endorsement) — https://www.pexels.com/license/.
Creator names: **to confirm** from each Pexels page (pages sat behind a bot check when
inspected); fill in before any derivative beyond posters is produced.

| # | Pexels ID | Pexels page | Source filename | Resolution / fps / length | Size | SHA-256 | Content | Role / status |
|---|---|---|---|---|---|---|---|---|
| A1 | 12204524 | https://www.pexels.com/video/12204524/ | `12204524-hd_1080_1920_60fps.mp4` | 1080×1920 (portrait), 60 fps, 21.0 s | 14.9 MB | `e3fc0fd84f5c0a7fcc97c9f10abfcf8d4c0a70b5a611cdc2c6aad85b4a1fa1ed` | Aerial of red-brick terraced streets at dusk (portrait) | Reserved — candidate mobile hero clip (portrait); not used until separately approved |
| A2 | 12217554 | https://www.pexels.com/video/12217554/ | `12217554_3840_2160_30fps.mp4` | 3840×2160, 30 fps, 17.3 s | 175.1 MB | `62ee32e2150022a1b14685edecbeaf6c967a20bea15b01b694018e5fbcc96aed` | Aerial of dense red-brick terraces with tree-lined roads; sky dominates after ~12 s | **Selected — hero/context** (trim 0–10 s, one slow move); poster at t=4 s |
| A3 | 12816094 | https://www.pexels.com/video/12816094/ | `12816094_1080_1920_60fps.mp4` | 1080×1920 (portrait), 60 fps, 8.9 s | 19.2 MB | `7f6f516d8de109d30c47b4eebc22946c14aef7739d3a00f2495eba3b928dee44` | Cat asleep on a grey armchair | **Not used** (the "cat clip") — excluded from the main narrative |
| A4 | 14806923 | https://www.pexels.com/video/14806923/ | `14806923_3840_2160_25fps.mp4` | 3840×2160, 25 fps, 15.9 s | 19.0 MB | `fcb8d5d0cd80f15382a50df2d6a50ce866d3134a9038caf8b84c055c42bf7b19` | Kitchen with island and cooker hood | Alternate — preparation/kitchen (used only if 14806944 is rejected) |
| A5 | 14806941 | https://www.pexels.com/video/14806941/ | `14806941_3840_2160_25fps.mp4` | 3840×2160, 25 fps, 17.1 s | 35.0 MB | `81203d5c5c9f40fc760675fdbc678605cea42e17bbd64719abdc0aa28bb6a185` | Bedroom with bright blue walls | **Not used** (the "blue-bedroom clip") — excluded |
| A6 | 14806944 | https://www.pexels.com/video/14806944/ | `14806944_3840_2160_50fps.mp4` | 3840×2160, 50 fps, 5.5 s | 10.0 MB | `777ec5819878e12434fef27f7a849e2d9dbc0798eeffb2ab6f2f7474dd0f7e20` | Cream kitchen with range cooker and shelving | **Selected — preparation/kitchen** (story beat c); poster at t=2 s |
| A7 | 14806950 | https://www.pexels.com/video/14806950/ | `14806950_3840_2160_25fps.mp4` | 3840×2160, 25 fps, 14.6 s | 31.2 MB | `5904e1e328914ba2f82f4c24af50db25c38b53baa66983e2778e8b0d2cbbe488` | Dining/kitchen room with doors and plant | Reserved — unused footage |
| A8 | 14806961 | https://www.pexels.com/video/14806961/ | `14806961_3840_2160_50fps.mp4` | 3840×2160, 50 fps, 10.9 s | 28.3 MB | `17ee19ad4631d9546ac23235fd84a97ba2727e18aa3a03ef5aad0df2d525d823` | Lounge with sofa, cushions and pictures | Alternate — lounge/home (used only if 14807010 is rejected) |
| A9 | 14806962 | https://www.pexels.com/video/14806962/ | `14806962_3840_2160_50fps.mp4` | 3840×2160, 50 fps, 10.9 s | 28.5 MB | `abb4488a5f4d293f654e35dbce0789a9965b8c685f3fcb418eec11c48f25b019` | Dining room with bay window and radiator | Reserved — unused footage |
| A10 | 14806975 | https://www.pexels.com/video/14806975/ | `14806975_3840_2160_25fps.mp4` | 3840×2160, 25 fps, 16.6 s | 36.4 MB | `0094c934f98bb1817f2e42b98af55f3cdeda300c3b2d93192b8b1db25ba81c9e` | Bedroom in warm light with patterned throw | **Selected — warm conclusion** (story beat e); poster at t=3 s |
| A11 | 14806992 | https://www.pexels.com/video/14806992/ | `14806992_3840_2160_50fps.mp4` | 3840×2160, 50 fps, 12.0 s | 31.7 MB | `2207d88762a05247ab687470ed93e9e16d730bec63c8f4d2202f03ea4f0c86aa` | Bedroom with mirrored wardrobes | **Not used** (the "mirrored-bedroom clip") — excluded |
| A12 | 14806998 | https://www.pexels.com/video/14806998/ | `14806998_3840_2160_25fps.mp4` | 3840×2160, 25 fps, 18.6 s | 37.6 MB | `76923dffcf5252ab2d9274e9f74bdd1da40919ae2ce535f0cc960c18a3cf833c` | Kitchen units with rocking chair and washing machine | Reserved — unused footage |
| A13 | 14807010 | https://www.pexels.com/video/14807010/ | `14807010_3840_2160_25fps.mp4` | 3840×2160, 25 fps, 17.2 s | 40.3 MB | `c89d62fbc8ce33fcbbd00b18088dad11891cc6311494d44be486093d10c6f455` | Lounge with dark sofa and bay window | **Selected — lounge/home** (story beat b); poster at t=3 s |
| A14 | 14807040 | https://www.pexels.com/video/14807040/ | `14807040_3840_2160_50fps.mp4` | 3840×2160, 50 fps, 6.0 s | 9.7 MB | `41cee3ea4731866192904a75b41cac0a888f0ae299abcfc20ec713df32d63fd6` | Hallway/doorway into a lit room | **Selected — doorway transition** (story beat a); poster at t=2 s |
| A15 | 14807056 | https://www.pexels.com/video/14807056/ | `14807056_3840_2160_25fps.mp4` | 3840×2160, 25 fps, 17.9 s | 42.6 MB | `5b293368a73e4cffa44a7423a54c86af8dca839f385dcbd9855bd24f2aa5eec1` | Bathroom with roll-top bath and window | **Selected — readiness/bathroom** (story beat d); poster at t=3 s |
| A16 | 18018628 | https://www.pexels.com/video/18018628/ | `18018628-uhd_3840_2160_24fps.mp4` | 3840×2160, 24 fps, 24.2 s | 75.0 MB | `e811ecb1f32ee71c44d4cd38f0f07706dcf0e07d959e93972b828e666b49bcd6` | Aerial of a red-brick suburban estate | Reserved — alternate aerial/context |

Selected story order (storyboard v3 §3): 14807040 doorway → 14807010 lounge → 14806944 kitchen →
14807056 bathroom → 14806975 warm conclusion; hero/context 12217554.

## B. Web derivatives produced (17/08/2026)

**Derivative blocker recorded:** no trusted video encoder exists on this machine (no ffmpeg,
HandBrake, VLC, gltfpack, ImageMagick, sharp or Blender on PATH or in Program Files). Trimmed
web-size video derivatives were therefore **not** produced; the homepage ships approved posters
and the hero/story `<video>` elements are wired to accept derivatives once encoded (they render
poster-only until then). The 4K masters were **not** copied into `public/`.

Posters (WebP, frame captured from the master via the installed Google Chrome; source filename
kept separate from the public ID; no readable house numbers, plates or people):

| File | Source master | Frame | Size (px) | Bytes | Encoding |
|---|---|---|---|---|---|
| `public/media/posters/hero-12217554.webp` | 12217554_3840_2160_30fps.mp4 | t=4 s | 1440×810 | 222 KB | WebP q≈0.22 |
| `public/media/posters/hero-12217554-mobile.webp` | 12217554_3840_2160_30fps.mp4 | t=4 s | 640×800 | 92 KB | WebP q≈0.14 (re-cut 18/08/2026 for mobile LCP; visually checked) |
| `public/media/posters/story-14807040.webp` | 14807040_3840_2160_50fps.mp4 | t=2 s | 1400×788 | 48 KB | WebP q≈0.82 |
| `public/media/posters/story-14807010.webp` | 14807010_3840_2160_25fps.mp4 | t=3 s | 1400×788 | 87 KB | WebP q≈0.74 |
| `public/media/posters/story-14806944.webp` | 14806944_3840_2160_50fps.mp4 | t=2 s | 1400×788 | 64 KB | WebP q≈0.82 |
| `public/media/posters/story-14807056.webp` | 14807056_3840_2160_25fps.mp4 | t=3 s | 1400×788 | 96 KB | WebP q≈0.74 |
| `public/media/posters/story-14806975.webp` | 14806975_3840_2160_25fps.mp4 | t=3 s | 1400×788 | 104 KB | WebP q≈0.82 |

Poster budget: story posters ≤ 110 KB met; hero poster 1440 px is 222 KB (dense aerial detail —
above the 120 KB target; kept for image quality at q≈0.22 and served only ≥ 48 rem; the 640 px
mobile crop is 92 KB, re-cut 18/08/2026 from 126 KB). Recorded as a measured result, not an achieved target.

Planned (blocked until an encoder is available): hero trim 0–10 s at 1080p/720p ≤ 4 MB
(H.264 + AV1/WebM); story clips 1080p ≤ 3 MB each; separately approved mobile hero clip.

## C. Generated / prototype media

| # | Asset | Platform | Rights | Intended use | Status | Notes |
|---|---|---|---|---|---|---|
| C1 | `Using_the_approved_Red_Brick_V (1).mp4` and `Using_the_approved_Red_Brick_V.mp4` — `C:\Users\moeen\Downloads` | AI video (platform TBC — record name, plan and commercial-use terms) | TBC | **Prototype motion reference only** | Reference only / Superseded for hero | Two-door architecture, 720p, visible platform mark → not a final master, not a 3D reference |
| C2 | Corrected one-home reference still | AI image (platform TBC) | TBC | Reference for any future AI hero film and for the 3D house look | Proposed | Any realistic use carries the AI label |
| C3 | 3D chapter static renders (`public/media/house/*.jpg`) | Rendered from the project's own Three.js house generator | Project-owned | Static fallbacks for the 3D chapter | Produced in Phase 3 | See docs/PHASE-3-REPORT.md |
| C4 | Demonstration property images | Illustration (inline SVG) | Project-owned | Properties preview/search | Produced in Phase 2 | Labelled "Demonstration listing — not a real property." |

## D. 3D assets

| # | Asset | Source | Licence | Use | Status |
|---|---|---|---|---|---|
| D1 | Red Brick house model — generator `src/lib/house/build-house.ts`, GLB `public/models/red-brick-house.glb` | Original, built programmatically for Red Brick Lettings (no stock, no identifiable real property) | Project-owned | Homepage 3D chapter | Phase 3 |
| D2 | Textures | none (flat shared materials) | — | — | — |
| D3 | HDRI / environment map | none | — | — | — |

## E. Third-party reference captures (private)

Igloo, Resider and Dribbble frames captured on 17/08/2026 for internal comparison live in
`docs/evidence/references/` — **local, untracked, internal use only**; never committed or
published (see `docs/evidence/references/README.md`, the only tracked file there).

## Provenance and disclosure

- Provenance marks on generated media and public AI disclosure wording are owner decisions
  (`docs/OWNER-DECISIONS.md` rows 38–45).
- Property, location and identifiable-person permissions apply to any footage or stills that
  show a real place or person; stock clips are used only within the Pexels License.
