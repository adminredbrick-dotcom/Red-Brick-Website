# Media asset register

Every video, image, model, texture or reference used by the Red Brick website is recorded here
**before** it is used. Source masters (4K originals) live outside the repository and are never
copied into `public/`; only approved derivatives (trims, encodes, posters) are added, and each
derivative gets its own row. Status key: **Approved** (owner-approved for the stated use) ·
**Proposed** · **Not used** · **Reference only** · **Superseded**.

Public labels: stock footage → *"Illustrative stock footage."* · realistic generated media →
*"Illustrative brand film created with AI — not an available property."* Never describe any
of these as Peterborough, a Red Brick-managed home, an available property or a client outcome.

## A. Pexels stock footage (approved sequence, 17/08/2026)

Licence for all rows in this section: **Pexels License** (free for commercial use, no
attribution required, no re-selling of unaltered copies, no implied endorsement, no identifiable
people/brands in a way that is offensive) — https://www.pexels.com/license/. Creator names are
to be confirmed from each Pexels page and entered here before any derivative is produced (the
pages sat behind a bot check when this register was written; do not leave "TBC" in a committed
row once the asset is in use).

| # | Pexels ID | Pexels page | Creator | Intended use | Storyboard beat | Status | Source master (path) | Derivatives planned |
|---|---|---|---|---|---|---|---|---|
| A1 | 12217554 | https://www.pexels.com/video/12217554/ | TBC | Hero / context — one ~10 s single-move trim; poster; plays once, holds, never loops | §1 hero | Approved (source) / derivatives pending | not yet on disk — store under `D:\4. Website\media-masters\pexels\` (proposed) | 1080p + 720p H.264/AV1 trims, poster AVIF/WebP ≤ 120 KB, optional mobile crop (separate approval) |
| A2 | 14807040 | https://www.pexels.com/video/14807040/ | TBC | Doorway transition | §3 beat a | Approved (source) | as above | trim, 1080p/720p, poster |
| A3 | 14807010 | https://www.pexels.com/video/14807010/ | TBC | Lounge / home (primary) | §3 beat b | Approved (source) | as above | trim, 1080p/720p, poster |
| A4 | 14806961 | https://www.pexels.com/video/14806961/ | TBC | Lounge / home (alternate) | §3 beat b alt | Approved (alternate) | as above | only if A3 rejected |
| A5 | 14806944 | https://www.pexels.com/video/14806944/ | TBC | Preparation / kitchen (primary) | §3 beat c | Approved (source) | as above | trim, 1080p/720p, poster |
| A6 | 14806923 | https://www.pexels.com/video/14806923/ | TBC | Preparation / kitchen (alternate) | §3 beat c alt | Approved (alternate) | as above | only if A5 rejected |
| A7 | 14807056 | https://www.pexels.com/video/14807056/ | TBC | Readiness / bathroom | §3 beat d | Approved (source) | as above | trim, 1080p/720p, poster |
| A8 | 14806975 | https://www.pexels.com/video/14806975/ | TBC | Warm conclusion → hand-off to 3D chapter | §3 beat e | Approved (source) | as above | trim, 1080p/720p, poster |
| A9 | (cat clip) | — | — | — | — | **Not used** in the main narrative | — | — |
| A10 | (mirrored-bedroom clip) | — | — | — | — | **Not used** in the main narrative | — | — |
| A11 | (blue-bedroom clip) | — | — | — | — | **Not used** in the main narrative | — | — |

Rules for this section: one active video at a time on the page; poster-only under reduced
motion and Save-Data; mobile defaults to posters; captions read *illustrative stock footage*.
No editing, transcoding or implementation until the owner approves the storyboard v3 and this
plan.

## B. Generated / prototype media

| # | Asset | Platform | Rights | Intended use | Status | Notes |
|---|---|---|---|---|---|---|
| B1 | `Using_the_approved_Red_Brick_V (1).mp4` (and `…_V.mp4`) — `C:\Users\moeen\Downloads` | AI video (platform TBC — record name, plan and commercial-use terms) | TBC | **Prototype motion reference only** | Reference only / Superseded for hero | Two-door architecture, 720p, visible platform mark → not a final master, not a 3D reference |
| B2 | Corrected one-home reference still | AI image (platform TBC) | TBC | Reference for any future AI hero film and for the 3D house look | Proposed | Any realistic use carries the AI label |
| B3 | 3D reference boards (elevation, materials, lighting, day/dusk) | AI image / photographs | TBC per board | 3D modelling reference only | Proposed | Not published |
| B4 | Static fallback sequence for the 3D chapter (parts, beats 1–4, complete; both paths; day + dusk) | Illustration (SVG) or AI stills | TBC | Reduced-motion / mobile / no-WebGL fallback | Proposed | Realistic stills carry the AI label |
| B5 | Demonstration property images for the properties preview | Illustration or clearly synthetic | TBC | §5 preview | Proposed | Labelled "Demonstration listing — not a real property" |

## C. 3D assets (later phase — none yet)

| # | Asset | Source | Licence | Use | Status |
|---|---|---|---|---|---|
| C1 | House model (GLB) | to be commissioned/modelled | TBC | §4 | Not started (previs uses boxes/planes only) |
| C2 | Textures | none in previs | — | — | — |
| C3 | HDRI | none (not permitted in previs) | — | — | — |

## D. Third-party reference captures (private)

Igloo, Resider and Dribbble frames captured on 17/08/2026 for internal comparison live in
`docs/evidence/references/` — **local, untracked, internal use only**; never committed or
published (see `docs/evidence/references/README.md`, which is the only tracked file there).

## Provenance and disclosure

- Provenance marks required on generated media and the wording of any public AI disclosure are
  owner decisions (`docs/OWNER-DECISIONS.md` rows 38–45).
- Property, location and identifiable-person permissions apply to any footage or stills that
  show a real place or person; stock clips are used only within the Pexels License.
