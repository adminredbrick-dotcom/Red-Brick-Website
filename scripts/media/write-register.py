# One-off helper: regenerate docs/MEDIA-ASSET-REGISTER.md section tables from the
# manifests written by capture-posters.mjs. Run: python scripts/media/write-register.py
import json, io, os

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
man = json.load(open(os.path.join(ROOT, "scripts/media/masters-manifest.json"), encoding="utf-8"))
posters = json.load(open(os.path.join(ROOT, "scripts/media/posters-manifest.json"), encoding="utf-8"))["posters"]
H = {x["pexelsId"]: x for x in man["masters"]}
BT = "`"
info = {
    "12204524": ("1080×1920 (portrait), 60 fps, 21.0 s", "Aerial of red-brick terraced streets at dusk (portrait)", "Reserved — candidate mobile hero clip (portrait); not used until separately approved"),
    "12217554": ("3840×2160, 30 fps, 17.3 s", "Aerial of dense red-brick terraces with tree-lined roads; sky dominates after ~12 s", "**Selected — hero/context** (trim 0–10 s, one slow move); poster at t=4 s"),
    "12816094": ("1080×1920 (portrait), 60 fps, 8.9 s", "Cat asleep on a grey armchair", "**Not used** (the \"cat clip\") — excluded from the main narrative"),
    "14806923": ("3840×2160, 25 fps, 15.9 s", "Kitchen with island and cooker hood", "Alternate — preparation/kitchen (used only if 14806944 is rejected)"),
    "14806941": ("3840×2160, 25 fps, 17.1 s", "Bedroom with bright blue walls", "**Not used** (the \"blue-bedroom clip\") — excluded"),
    "14806944": ("3840×2160, 50 fps, 5.5 s", "Cream kitchen with range cooker and shelving", "**Selected — preparation/kitchen** (story beat c); poster at t=2 s"),
    "14806950": ("3840×2160, 25 fps, 14.6 s", "Dining/kitchen room with doors and plant", "Reserved — unused footage"),
    "14806961": ("3840×2160, 50 fps, 10.9 s", "Lounge with sofa, cushions and pictures", "Alternate — lounge/home (used only if 14807010 is rejected)"),
    "14806962": ("3840×2160, 50 fps, 10.9 s", "Dining room with bay window and radiator", "Reserved — unused footage"),
    "14806975": ("3840×2160, 25 fps, 16.6 s", "Bedroom in warm light with patterned throw", "**Selected — warm conclusion** (story beat e); poster at t=3 s"),
    "14806992": ("3840×2160, 50 fps, 12.0 s", "Bedroom with mirrored wardrobes", "**Not used** (the \"mirrored-bedroom clip\") — excluded"),
    "14806998": ("3840×2160, 25 fps, 18.6 s", "Kitchen units with rocking chair and washing machine", "Reserved — unused footage"),
    "14807010": ("3840×2160, 25 fps, 17.2 s", "Lounge with dark sofa and bay window", "**Selected — lounge/home** (story beat b); poster at t=3 s"),
    "14807040": ("3840×2160, 50 fps, 6.0 s", "Hallway/doorway into a lit room", "**Selected — doorway transition** (story beat a); poster at t=2 s"),
    "14807056": ("3840×2160, 25 fps, 17.9 s", "Bathroom with roll-top bath and window", "**Selected — readiness/bathroom** (story beat d); poster at t=3 s"),
    "18018628": ("3840×2160, 24 fps, 24.2 s", "Aerial of a red-brick suburban estate", "Reserved — alternate aerial/context"),
}
rows = []
for i, pid in enumerate(sorted(H), start=1):
    x = H[pid]
    res, desc, role = info[pid]
    rows.append(f"| A{i} | {pid} | https://www.pexels.com/video/{pid}/ | {BT}{x['file']}{BT} | {res} | {x['bytes']/1e6:.1f} MB | {BT}{x['sha256']}{BT} | {desc} | {role} |")
poster_rows = [
    f"| {BT}public/media/posters/{p['output']}{BT} | {p['source']} | t={p['time']:.0f} s | {p['width']}×{p['height']} | {p['bytes']/1024:.0f} KB | WebP q≈{p['quality']} |"
    for p in posters
]
NL = "\n"
doc = f"""# Media asset register

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
| Current source masters (16 Pexels files, ~605 MB) | {BT}C:\\Users\\moeen\\Downloads{BT} | Read in place; nothing moved. Hashes below taken 17/08/2026 |
| Proposed managed masters | {BT}D:\\4. Website\\media-masters\\pexels\\{BT} | **Copy** (never move) each master here, verify the SHA-256 matches, keep originals; not done yet — owner to confirm the folder |
| Web derivatives | {BT}public/media/posters/{BT} (posters only) | Never a 4K master, never in {BT}public/{BT} |
| Tooling | {BT}scripts/media/capture-posters.mjs{BT}, {BT}poster-plan.json{BT}, {BT}masters-manifest.json{BT}, {BT}posters-manifest.json{BT} | Chrome-based frame capture + SHA-256; no encoder |

## A. Pexels stock footage — all 16 masters

Licence for every row: **Pexels License** (free for commercial use, no attribution required, no
re-selling of unaltered copies, no implied endorsement) — https://www.pexels.com/license/.
Creator names: **to confirm** from each Pexels page (pages sat behind a bot check when
inspected); fill in before any derivative beyond posters is produced.

| # | Pexels ID | Pexels page | Source filename | Resolution / fps / length | Size | SHA-256 | Content | Role / status |
|---|---|---|---|---|---|---|---|---|
{NL.join(rows)}

Selected story order (storyboard v3 §3): 14807040 doorway → 14807010 lounge → 14806944 kitchen →
14807056 bathroom → 14806975 warm conclusion; hero/context 12217554.

## B. Web derivatives produced (17/08/2026)

**Derivative blocker recorded:** no trusted video encoder exists on this machine (no ffmpeg,
HandBrake, VLC, gltfpack, ImageMagick, sharp or Blender on PATH or in Program Files). Trimmed
web-size video derivatives were therefore **not** produced; the homepage ships approved posters
and the hero/story {BT}<video>{BT} elements are wired to accept derivatives once encoded (they render
poster-only until then). The 4K masters were **not** copied into {BT}public/{BT}.

Posters (WebP, frame captured from the master via the installed Google Chrome; source filename
kept separate from the public ID; no readable house numbers, plates or people):

| File | Source master | Frame | Size (px) | Bytes | Encoding |
|---|---|---|---|---|---|
{NL.join(poster_rows)}

Poster budget: story posters ≤ 110 KB met; hero poster 1440 px is 222 KB (dense aerial detail —
above the 120 KB target; kept for image quality at q≈0.22 and served only ≥ 64 rem; the 720 px
mobile crop is 126 KB). Recorded as a measured result, not an achieved target.

Planned (blocked until an encoder is available): hero trim 0–10 s at 1080p/720p ≤ 4 MB
(H.264 + AV1/WebM); story clips 1080p ≤ 3 MB each; separately approved mobile hero clip.

## C. Generated / prototype media

| # | Asset | Platform | Rights | Intended use | Status | Notes |
|---|---|---|---|---|---|---|
| C1 | {BT}Using_the_approved_Red_Brick_V (1).mp4{BT} and {BT}Using_the_approved_Red_Brick_V.mp4{BT} — {BT}C:\\Users\\moeen\\Downloads{BT} | AI video (platform TBC — record name, plan and commercial-use terms) | TBC | **Prototype motion reference only** | Reference only / Superseded for hero | Two-door architecture, 720p, visible platform mark → not a final master, not a 3D reference |
| C2 | Corrected one-home reference still | AI image (platform TBC) | TBC | Reference for any future AI hero film and for the 3D house look | Proposed | Any realistic use carries the AI label |
| C3 | 3D chapter static renders ({BT}public/media/house/*.jpg{BT}) | Rendered from the project's own Three.js house generator | Project-owned | Static fallbacks for the 3D chapter | Produced in Phase 3 | See docs/PHASE-3-REPORT.md |
| C4 | Demonstration property images | Illustration (inline SVG) | Project-owned | Properties preview/search | Produced in Phase 2 | Labelled "Demonstration listing — not a real property." |

## D. 3D assets

| # | Asset | Source | Licence | Use | Status |
|---|---|---|---|---|---|
| D1 | Red Brick house model — generator {BT}src/lib/house/build-house.ts{BT}, GLB {BT}public/models/red-brick-house.glb{BT} | Original, built programmatically for Red Brick Lettings (no stock, no identifiable real property) | Project-owned | Homepage 3D chapter | Phase 3 |
| D2 | Textures | none (flat shared materials) | — | — | — |
| D3 | HDRI / environment map | none | — | — | — |

## E. Third-party reference captures (private)

Igloo, Resider and Dribbble frames captured on 17/08/2026 for internal comparison live in
{BT}docs/evidence/references/{BT} — **local, untracked, internal use only**; never committed or
published (see {BT}docs/evidence/references/README.md{BT}, the only tracked file there).

## Provenance and disclosure

- Provenance marks on generated media and public AI disclosure wording are owner decisions
  ({BT}docs/OWNER-DECISIONS.md{BT} rows 38–45).
- Property, location and identifiable-person permissions apply to any footage or stills that
  show a real place or person; stock clips are used only within the Pexels License.
"""
open(os.path.join(ROOT, "docs/MEDIA-ASSET-REGISTER.md"), "w", encoding="utf-8").write(doc)
print("register written", len(rows), "masters,", len(poster_rows), "posters")
