/**
 * Red Brick house — programmatic model generator (v2: the large detached house).
 *
 * An original, stylised but recognisable British red-brick detached family home
 * built for Red Brick Lettings, laid out from an owner-supplied floor plan:
 *
 *   Ground floor — drawing room (rear left, with a canted bay), family room
 *   (rear centre, French doors), kitchen (rear right, with a canted bay and an
 *   island), study and cloakroom (front left), entrance hall with the stair
 *   (front centre), dining room (front right) and utility (right, boiler).
 *   First floor — bedroom 4 (rear left), en-suite (rear centre), bedroom 1 (rear
 *   right), bedroom 3 with en-suite (front left), landing (centre), bedroom 2
 *   with dressing room and en-suite (front right).
 *
 * Exterior: two storeys of red brick, slate roof with gables at both ends and a
 * chimney stack near each gable, five first-floor sashes on the front, an oxblood
 * front door under a small porch canopy, white windows, gutters and downpipes.
 * Every important part is a separately named mesh or group with a stored "home"
 * transform so GSAP can open the house up (roof lifts, first floor lifts as a
 * layer, the front façade and the right-hand wall slide aside), light rooms one
 * by one and move the people about (see src/lib/house/animation.ts).
 *
 * The front wall has a REAL doorway and every internal partition has real door
 * openings, so the people walk through openings and never through geometry.
 *
 * Built with Three.js only (Blender is not available on the build machine);
 * this file is the model source. `scripts/house/export-glb.mjs` writes the
 * same scene to `public/models/red-brick-house.glb`, and
 * `scripts/house/render-chapters.mjs` produces the static chapter renders.
 *
 * Units: metres. +z is the front (towards the visitor), +y is up. Ground at y=0.
 * Palette: brick #A63D2F · deep brick #70291F · cream #F7F2EA · sand #E8D7C6 ·
 * ink #1D1B1A · oxblood door #5B1F22 · slate #3B3633.
 * No address, house number, car, keys, documents or security details. The three
 * stylised people (a Red Brick agent with a clipboard and two applicants) have
 * no faces and no identifying features.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const HOUSE_MODEL_VERSION = "2.0.0";

// ---------------------------------------------------------------------------
// Dimensions (metres)
// ---------------------------------------------------------------------------
const W = 18.0; // width (x)
const D = 12.0; // depth (z)
const T = 0.35; // external wall thickness
const TI = 0.15; // internal partition thickness
const H_GROUND = 2.9; // ground-floor ceiling (underside of the first-floor slab)
const SLAB = 0.24; // first-floor slab
const H_FIRST = 2.7; // first-floor ceiling
const H_EAVES = H_GROUND + SLAB + H_FIRST + 0.06; // 5.9
const RIDGE_RISE = 3.5;
const H_RIDGE = H_EAVES + RIDGE_RISE; // 9.4
const SLOPE_LEN = Math.hypot(D / 2, RIDGE_RISE); // ≈ 6.95
const SLOPE_ANGLE = Math.atan2(RIDGE_RISE, D / 2); // ≈ 30°

/** Plinth (foundation) top. */
const PLINTH_TOP = 0.3;
/** Interior ground-floor level: the cream floor sits ON the plinth. */
export const FLOOR_TOP = 0.44;
/** First-floor level (top of the slab). */
export const FIRST_TOP = H_GROUND + SLAB; // 3.14
/** Front-door step top. */
export const STEP_TOP = 0.3;
/** Doorway cut into the front wall — the people walk through it. */
export const DOORWAY = { xMin: -1.55, xMax: -0.15, height: 2.6 } as const;
/** Front door / path centre line. */
export const DOOR_CENTRE_X = (DOORWAY.xMin + DOORWAY.xMax) / 2; // -0.85
/** Ground plate. */
const GROUND_W = 46;
const GROUND_D = 36;
/** Where the front path meets the pavement line the people walk along. */
export const PAVEMENT_Z = 9.6;

// ---------------------------------------------------------------------------
// Shared materials (flat colours, no textures, no env map)
// ---------------------------------------------------------------------------
export interface HouseMaterials {
  brick: THREE.MeshStandardMaterial;
  brickDeep: THREE.MeshStandardMaterial;
  slate: THREE.MeshStandardMaterial;
  cream: THREE.MeshStandardMaterial;
  sand: THREE.MeshStandardMaterial;
  ink: THREE.MeshStandardMaterial;
  white: THREE.MeshStandardMaterial;
  oxblood: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  fabric: THREE.MeshStandardMaterial;
  lamp: THREE.MeshStandardMaterial;
  ground: THREE.MeshStandardMaterial;
  /** Stylised people: one warm neutral skin tone, a denim blue and a moss top. */
  skin: THREE.MeshStandardMaterial;
  denim: THREE.MeshStandardMaterial;
  moss: THREE.MeshStandardMaterial;
}

export function createMaterials(): HouseMaterials {
  const std = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.88, metalness: 0, ...extra });
  return {
    brick: std("#a63d2f"),
    brickDeep: std("#70291f"),
    slate: std("#3b3633", { roughness: 0.75 }),
    cream: std("#f7f2ea"),
    sand: std("#e8d7c6"),
    ink: std("#1d1b1a"),
    white: std("#ffffff", { roughness: 0.6 }),
    oxblood: std("#5b1f22", { roughness: 0.55 }),
    // Daylight glass: cool grey; at dusk the scene animates emissive to warm light.
    glass: std("#b9c3c9", { roughness: 0.25, emissive: "#ffb86b", emissiveIntensity: 0 }),
    wood: std("#a67c52", { roughness: 0.8 }),
    fabric: std("#8c3a33"),
    lamp: std("#fff2d6", { emissive: "#ffb86b", emissiveIntensity: 0 }),
    ground: std("#e8d7c6", { roughness: 1 }),
    skin: std("#d9a98a"),
    denim: std("#4a5a7a"),
    moss: std("#6f7a5a"),
  };
}

// ---------------------------------------------------------------------------
// Result contract
// ---------------------------------------------------------------------------
export interface HomeTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface HouseModel {
  group: THREE.Group;
  parts: Record<string, THREE.Object3D>;
  materials: HouseMaterials;
  partNames: string[];
  /** Approximate triangle count for the performance report. */
  triangles: number;
}

/** Part groups used by the animation (src/lib/house/animation.ts) and the report. */
export const HOUSE_PART_GROUPS = {
  ground: ["ground", "path", "foundation"],
  /** Slides aside (−x) to open the front. */
  facade: [
    "wall-front",
    "wall-front-right",
    "wall-front-lintel",
    "door",
    "door-frame",
    "fanlight",
    "door-step",
    "porch-canopy",
    "porch-post-l",
    "porch-post-r",
    "window-gf-study",
    "window-gf-dining-1",
    "window-gf-dining-2",
    "window-ff-front-1",
    "window-ff-front-2",
    "window-ff-front-3",
    "window-ff-front-4",
    "window-ff-front-5",
    "gutter-front",
  ],
  /** Slides aside (+x) to open the right-hand side. */
  rightSide: [
    "wall-right",
    "gable-right",
    "window-gf-kitchen-side",
    "window-gf-utility",
    "window-gf-dining-side",
    "window-ff-bed1-side",
    "window-ff-ensuite-right",
    "window-ff-bed2-side",
    "downpipe-right",
  ],
  /** Lifts straight up. */
  roof: ["roof-front", "roof-rear", "ridge", "chimney-left", "chimney-right", "chimney-pot-1", "chimney-pot-2", "chimney-pot-3", "chimney-pot-4", "roof-tile-loose"],
  /** Lifts as one layer (slab, partitions, rooms, lights and the ceiling fittings of the ground floor). */
  firstFloor: [
    "floor-first",
    "wall1-rear-row",
    "wall1-bed4-ensuite",
    "wall1-ensuite-bed1",
    "wall1-landing-left",
    "wall1-bed3-ensuite",
    "wall1-landing-right",
    "wall1-bed2-dressing",
    "wall1-dressing-ensuite",
    "bed-1",
    "bed-2",
    "bed-3",
    "bed-4",
    "wardrobe-1",
    "wardrobe-2",
    "wardrobe-3",
    "wardrobe-4",
    "wardrobe-dressing",
    "bath-mid",
    "basin-mid",
    "bath-left",
    "basin-left",
    "bath-right",
    "basin-right",
    "radiator-bed1",
    "radiator-bed3",
    "light-bed1",
    "light-bed2",
    "light-bed3",
    "light-bed4",
    "light-landing",
    "light-hall",
    "light-dining",
    "light-kitchen",
    "light-family",
    "light-drawing",
    "light-study",
    "smoke-alarm",
  ],
  structure: ["wall-rear", "wall-left", "gable-left", "foundation"],
  care: ["roof-tile-loose", "boiler", "radiator-hall", "smoke-alarm"],
  /** The story's people and the To Let board (animated by src/lib/house/animation.ts). */
  people: ["figure-agent", "figure-tenant-1", "figure-tenant-2", "let-board"],
} as const;

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------
/** Rounded box without UVs (no textures anywhere) — segments scale with the radius so small trims stay cheap. */
function rbox(w: number, h: number, d: number, radius = 0.03, segments?: number): THREE.BufferGeometry {
  const r = Math.min(radius, w / 2, h / 2, d / 2);
  // Small radii are invisible at the chapter's camera distances: use a plain box (keeps the GLB small).
  if (r < 0.05) return box(w, h, d);
  const geo = new RoundedBoxGeometry(w, h, d, segments ?? 1, r);
  geo.deleteAttribute("uv");
  return geo;
}

/** Plain box without UVs. */
function box(w: number, h: number, d: number): THREE.BufferGeometry {
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.deleteAttribute("uv");
  return geo;
}

function mesh(
  name: string,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number],
  rotation: [number, number, number] = [0, 0, 0],
): THREE.Mesh {
  const m = new THREE.Mesh(geometry, material);
  m.name = name;
  m.position.set(...position);
  m.rotation.set(...rotation);
  m.castShadow = false;
  m.receiveShadow = false;
  return m;
}

/** Triangular gable prism in the y/z plane, thickness along x. */
function gableGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  shape.moveTo(-D / 2, 0);
  shape.lineTo(D / 2, 0);
  shape.lineTo(0, RIDGE_RISE);
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: false });
  geo.rotateY(Math.PI / 2);
  geo.translate(-T / 2, 0, 0);
  return geo;
}

/** A window: white frame (four bars) around a glass pane with a central glazing bar and a sill. */
function windowGroup(
  name: string,
  width: number,
  height: number,
  materials: HouseMaterials,
  position: [number, number, number],
  rotationY = 0,
): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  const bar = 0.1;
  const depth = 0.12;
  g.add(mesh(`${name}-glass`, box(width - bar, height - bar, 0.05), materials.glass, [0, 0, -0.01]));
  g.add(mesh(`${name}-frame-top`, box(width, bar, depth), materials.white, [0, height / 2 - bar / 2, 0]));
  g.add(mesh(`${name}-frame-bottom`, box(width, bar, depth), materials.white, [0, -height / 2 + bar / 2, 0]));
  g.add(mesh(`${name}-frame-left`, box(bar, height, depth), materials.white, [-width / 2 + bar / 2, 0, 0]));
  g.add(mesh(`${name}-frame-right`, box(bar, height, depth), materials.white, [width / 2 - bar / 2, 0, 0]));
  g.add(mesh(`${name}-bar`, box(width - bar, 0.06, 0.08), materials.white, [0, 0, 0.01]));
  g.add(mesh(`${name}-sill`, box(width + 0.18, 0.09, 0.22), materials.cream, [0, -height / 2 - 0.02, 0.07]));
  g.position.set(...position);
  g.rotation.y = rotationY;
  return g;
}

/** Canted bay: brick plinth, three glazed facets and a lead-effect roof. Faces +z in its own frame. */
function bayWindow(name: string, materials: HouseMaterials, frontW = 2.0, sideW = 1.0, depth = 0.9, h = 2.0): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  const y = 0.6 + h / 2;
  const totalW = frontW + 1.3;
  g.add(mesh(`${name}-plinth`, rbox(totalW, 0.6, depth, 0.02), materials.brick, [0, 0.3, depth / 2]));
  g.add(windowGroup(`${name}-front`, frontW, h, materials, [0, y, depth]));
  const angle = Math.atan2(depth, (totalW - frontW) / 2);
  const leftX = -(frontW / 2 + Math.cos(angle) * (sideW / 2));
  const leftZ = depth - Math.sin(angle) * (sideW / 2);
  g.add(windowGroup(`${name}-left`, sideW, h, materials, [leftX, y, leftZ], -angle));
  g.add(windowGroup(`${name}-right`, sideW, h, materials, [-leftX, y, leftZ], angle));
  g.add(mesh(`${name}-roof`, rbox(totalW + 0.4, 0.16, depth + 0.4, 0.03), materials.slate, [0, 0.6 + h + 0.24, depth / 2 + 0.05]));
  return g;
}

/**
 * Internal partition along x or z with door openings: a group of wall segments.
 * `axis` is the direction the wall runs; `at` is its fixed coordinate; `from`/`to` its extent
 * along the axis; `gaps` are [start, end] openings along the axis (real doorways).
 */
function partition(
  name: string,
  materials: HouseMaterials,
  axis: "x" | "z",
  at: number,
  from: number,
  to: number,
  gaps: Array<[number, number]>,
  base: number,
  height: number,
): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  const edges = [from, ...gaps.flat().sort((a, b) => a - b), to];
  let i = 0;
  for (let k = 0; k < edges.length; k += 2) {
    const a = edges[k]!;
    const b = edges[k + 1]!;
    const len = b - a;
    if (len <= 0.02) continue;
    const centre = (a + b) / 2;
    if (axis === "x") g.add(mesh(`${name}-${i}`, box(len, height, TI), materials.cream, [centre, base + height / 2, at]));
    else g.add(mesh(`${name}-${i}`, box(TI, height, len), materials.cream, [at, base + height / 2, centre]));
    i += 1;
  }
  return g;
}

/** Instanced stair run in the hall (x 0.6–1.6), rising from the front towards the rear. */
export const STAIRS_X = 1.1;
function stairs(materials: HouseMaterials): THREE.InstancedMesh {
  const count = 13;
  const tread = box(1.0, 0.2, 0.22);
  const inst = new THREE.InstancedMesh(tread, materials.wood, count);
  inst.name = "stairs";
  const m = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    m.makeTranslation(STAIRS_X, FLOOR_TOP + 0.1 + i * 0.17, 1.5 - i * 0.22);
    inst.setMatrixAt(i, m);
  }
  inst.instanceMatrix.needsUpdate = true;
  return inst;
}

/** Bed with base, mattress, throw, two pillows and an oxblood headboard (headboard at −z). */
function bed(name: string, materials: HouseMaterials, w = 1.6, l = 2.0): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(mesh(`${name}-base`, rbox(w, 0.35, l, 0.03), materials.wood, [0, 0.175, 0]));
  g.add(mesh(`${name}-mattress`, rbox(w - 0.1, 0.24, l - 0.1, 0.06), materials.white, [0, 0.47, 0]));
  g.add(mesh(`${name}-throw`, rbox(w - 0.08, 0.06, l * 0.5, 0.03), materials.fabric, [0, 0.62, l * 0.18]));
  g.add(mesh(`${name}-pillow-1`, rbox(w * 0.36, 0.14, 0.4, 0.06), materials.cream, [-w * 0.23, 0.66, -l * 0.35]));
  g.add(mesh(`${name}-pillow-2`, rbox(w * 0.36, 0.14, 0.4, 0.06), materials.cream, [w * 0.23, 0.66, -l * 0.35]));
  g.add(mesh(`${name}-headboard`, rbox(w + 0.1, 0.9, 0.08, 0.03), materials.oxblood, [0, 0.6, -l / 2]));
  return g;
}

/** Sofa: seat, back and two arms (back at −z, i.e. faces +z in its own frame). */
function sofa(name: string, materials: HouseMaterials, w = 2.0): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(mesh(`${name}-seat`, rbox(w, 0.42, 0.9, 0.06), materials.fabric, [0, 0.21, 0]));
  g.add(mesh(`${name}-back`, rbox(w, 0.5, 0.25, 0.06), materials.fabric, [0, 0.62, -0.33]));
  g.add(mesh(`${name}-arm-l`, rbox(0.22, 0.6, 0.9, 0.05), materials.fabric, [-w / 2 + 0.11, 0.3, 0]));
  g.add(mesh(`${name}-arm-r`, rbox(0.22, 0.6, 0.9, 0.05), materials.fabric, [w / 2 - 0.11, 0.3, 0]));
  g.add(mesh(`${name}-cushion`, rbox(0.4, 0.14, 0.4, 0.05), materials.sand, [-w * 0.2, 0.5, -0.05]));
  return g;
}

/** Pendant light: short flex, shade and a warm bulb (emissive at dusk). Origin at the ceiling. */
function pendant(name: string, materials: HouseMaterials, position: [number, number, number]): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(mesh(`${name}-flex`, new THREE.CylinderGeometry(0.012, 0.012, 0.35, 6), materials.ink, [0, -0.175, 0]));
  g.add(mesh(`${name}-shade`, new THREE.CylinderGeometry(0.16, 0.22, 0.16, 16, 1, true), materials.cream, [0, -0.42, 0]));
  // Each bulb gets its own lamp material so rooms can light up one by one.
  g.add(mesh(`${name}-bulb`, new THREE.SphereGeometry(0.07, 12, 10), materials.lamp.clone(), [0, -0.46, 0]));
  g.position.set(...position);
  return g;
}

/** Radiator: white panel with a valve. */
function radiator(name: string, materials: HouseMaterials, position: [number, number, number], rotationY = 0): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(mesh(`${name}-panel`, rbox(1.1, 0.55, 0.09, 0.02), materials.white, [0, 0, 0]));
  g.add(mesh(`${name}-valve`, new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), materials.ink, [0.6, -0.2, 0], [0, 0, Math.PI / 2]));
  g.position.set(...position);
  g.rotation.y = rotationY;
  return g;
}

/** Simple dining chair. */
function chair(name: string, materials: HouseMaterials, position: [number, number, number], rotationY = 0): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(mesh(`${name}-seat`, box(0.44, 0.06, 0.44), materials.wood, [0, 0.45, 0]));
  g.add(mesh(`${name}-back`, box(0.44, 0.5, 0.05), materials.wood, [0, 0.73, -0.2]));
  g.add(mesh(`${name}-legs`, box(0.4, 0.42, 0.4), materials.wood, [0, 0.21, 0]));
  g.position.set(...position);
  g.rotation.y = rotationY;
  return g;
}

/**
 * Stylised person (~1.9 m tall) as a group whose origin is at the feet: two legs, a body, two
 * arms hung from shoulder pivots (so they can be raised for a wave, a handshake or a pointing
 * gesture) and a head. The agent carries a clipboard in the right hand. No faces, no textures.
 */
function figure(
  name: string,
  materials: HouseMaterials,
  top: THREE.Material,
  legs: THREE.Material,
  clipboard: boolean,
  position: [number, number, number],
  rotationY = 0,
): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(mesh(`${name}-leg-l`, rbox(0.16, 0.82, 0.18, 0.05), legs, [-0.11, 0.41, 0]));
  g.add(mesh(`${name}-leg-r`, rbox(0.16, 0.82, 0.18, 0.05), legs, [0.11, 0.41, 0]));
  g.add(mesh(`${name}-body`, rbox(0.46, 0.72, 0.28, 0.08), top, [0, 1.18, 0]));
  for (const side of ["l", "r"] as const) {
    const arm = new THREE.Group();
    arm.name = `${name}-arm-${side}`;
    arm.position.set(side === "l" ? -0.3 : 0.3, 1.5, 0); // shoulder pivot
    arm.add(mesh(`${name}-arm-${side}-mesh`, rbox(0.11, 0.6, 0.13, 0.05), top, [0, -0.3, 0]));
    if (clipboard && side === "r") arm.add(mesh(`${name}-clipboard`, box(0.26, 0.34, 0.03), materials.white, [0.05, -0.5, 0.12], [0.3, 0, 0]));
    g.add(arm);
  }
  g.add(mesh(`${name}-head`, new THREE.SphereGeometry(0.17, 14, 10), materials.skin, [0, 1.73, 0]));
  g.position.set(...position);
  g.rotation.y = rotationY;
  g.scale.setScalar(1.12); // a touch larger than life so the people read at the chapter's camera distances
  return g;
}

/** "To Let" board on a post — origin at the base so it can rise and fold away without touching the ground. */
function letBoard(materials: HouseMaterials): THREE.Group {
  const g = new THREE.Group();
  g.name = "let-board";
  g.add(mesh("let-board-post", rbox(0.09, 2.6, 0.09, 0.01), materials.ink, [0, 1.3, 0]));
  g.add(mesh("let-board-panel", rbox(1.3, 0.85, 0.06, 0.02), materials.brick, [0.5, 2.25, 0]));
  g.add(mesh("let-board-band", rbox(1.0, 0.16, 0.02, 0.005), materials.cream, [0.5, 2.4, 0.04]));
  g.add(mesh("let-board-line", rbox(0.7, 0.07, 0.02, 0.005), materials.cream, [0.5, 2.1, 0.04]));
  g.position.set(-5.6, 0, 8.3);
  g.rotation.y = 0.12;
  return g;
}

// ---------------------------------------------------------------------------
// Assemble
// ---------------------------------------------------------------------------
export function buildHouse(materials: HouseMaterials = createMaterials()): HouseModel {
  const group = new THREE.Group();
  group.name = "red-brick-house";
  const parts: Record<string, THREE.Object3D> = {};
  const add = (o: THREE.Object3D) => {
    group.add(o);
    parts[o.name] = o;
    return o;
  };
  const zFront = D / 2;
  const zRear = -D / 2;
  const xLeft = -W / 2;
  const xRight = W / 2;
  const inW = W - 2 * T - 0.04;
  const inD = D - 2 * T - 0.04;
  const G_H = H_GROUND - FLOOR_TOP; // internal partition height, ground
  const F_H = H_FIRST - 0.2; // internal partition height, first

  // Ground, path, foundation ------------------------------------------------------
  add(mesh("ground", rbox(GROUND_W, 0.12, GROUND_D, 0.06), materials.ground, [0, -0.06, 0]));
  add(mesh("path", rbox(1.7, 0.04, PAVEMENT_Z - zFront, 0.02), materials.cream, [DOOR_CENTRE_X, 0.02, (zFront + PAVEMENT_Z) / 2]));
  add(mesh("foundation", rbox(W + 0.24, PLINTH_TOP, D + 0.24, 0.03), materials.brickDeep, [0, PLINTH_TOP / 2, 0]));

  // External walls ------------------------------------------------------------------
  {
    // Front wall in three pieces so the doorway is a real opening.
    const zW = zFront - T / 2;
    const leftW = DOORWAY.xMin - xLeft;
    const rightW = xRight - DOORWAY.xMax;
    const doorW = DOORWAY.xMax - DOORWAY.xMin;
    add(mesh("wall-front", box(leftW, H_EAVES, T), materials.brick, [xLeft + leftW / 2, H_EAVES / 2, zW]));
    add(mesh("wall-front-right", box(rightW, H_EAVES, T), materials.brick, [xRight - rightW / 2, H_EAVES / 2, zW]));
    add(
      mesh("wall-front-lintel", box(doorW, H_EAVES - DOORWAY.height, T), materials.brick, [
        DOOR_CENTRE_X,
        DOORWAY.height + (H_EAVES - DOORWAY.height) / 2,
        zW,
      ]),
    );
  }
  add(mesh("wall-rear", box(W, H_EAVES, T), materials.brick, [0, H_EAVES / 2, zRear + T / 2]));
  add(mesh("wall-left", box(T, H_EAVES, D - 2 * T), materials.brickDeep, [xLeft + T / 2, H_EAVES / 2, 0]));
  add(mesh("wall-right", box(T, H_EAVES, D - 2 * T), materials.brick, [xRight - T / 2, H_EAVES / 2, 0]));
  add(mesh("gable-left", gableGeometry(), materials.brickDeep, [xLeft + T / 2, H_EAVES, 0]));
  add(mesh("gable-right", gableGeometry(), materials.brick, [xRight - T / 2, H_EAVES, 0]));

  // Roof ------------------------------------------------------------------------------
  const roofY = H_EAVES + RIDGE_RISE / 2 + 0.06;
  add(mesh("roof-front", rbox(W + 0.9, 0.2, SLOPE_LEN + 0.4, 0.02), materials.slate, [0, roofY, D / 4 + 0.1], [SLOPE_ANGLE, 0, 0]));
  add(mesh("roof-rear", rbox(W + 0.9, 0.2, SLOPE_LEN + 0.4, 0.02), materials.slate, [0, roofY, -D / 4 - 0.1], [-SLOPE_ANGLE, 0, 0]));
  add(mesh("ridge", rbox(W + 0.9, 0.18, 0.4, 0.06), materials.ink, [0, H_RIDGE + 0.12, 0]));
  for (const [side, x] of [
    ["left", -W / 2 + 1.4],
    ["right", W / 2 - 1.4],
  ] as const) {
    add(mesh(`chimney-${side}`, rbox(1.1, 2.6, 0.9, 0.03), materials.brick, [x, H_RIDGE - 0.6, 0]));
  }
  add(mesh("chimney-pot-1", new THREE.CylinderGeometry(0.12, 0.15, 0.45, 12), materials.sand, [-W / 2 + 1.15, H_RIDGE + 0.9, 0]));
  add(mesh("chimney-pot-2", new THREE.CylinderGeometry(0.12, 0.15, 0.45, 12), materials.sand, [-W / 2 + 1.65, H_RIDGE + 0.9, 0]));
  add(mesh("chimney-pot-3", new THREE.CylinderGeometry(0.12, 0.15, 0.45, 12), materials.sand, [W / 2 - 1.65, H_RIDGE + 0.9, 0]));
  add(mesh("chimney-pot-4", new THREE.CylinderGeometry(0.12, 0.15, 0.45, 12), materials.sand, [W / 2 - 1.15, H_RIDGE + 0.9, 0]));
  add(mesh("roof-tile-loose", rbox(0.55, 0.06, 0.45, 0.01), materials.slate, [-3.2, H_EAVES + 1.5, D / 4 + 1.9], [SLOPE_ANGLE, 0, 0]));

  // Front door, frame, fanlight, step, porch -----------------------------------------------
  add(mesh("door-frame", rbox(1.4, DOORWAY.height - STEP_TOP, 0.14, 0.02), materials.white, [DOOR_CENTRE_X, STEP_TOP + (DOORWAY.height - STEP_TOP) / 2, zFront + 0.02]));
  {
    // The door is a group whose origin sits on the hinge edge (xMin), so rotation.y swings the
    // leaf outward cleanly. Leaf spans x 0..1.15 from the hinge.
    const doorGroup = new THREE.Group();
    doorGroup.name = "door";
    doorGroup.add(mesh("door-leaf", rbox(1.15, 1.9, 0.07, 0.015), materials.oxblood, [0.575, 0, 0]));
    doorGroup.add(mesh("door-knob", new THREE.SphereGeometry(0.05, 10, 8), materials.sand, [1.0, 0.02, 0.06]));
    doorGroup.position.set(DOORWAY.xMin + 0.1, STEP_TOP + 0.95, zFront + 0.09);
    add(doorGroup);
  }
  add(mesh("fanlight", box(1.15, 0.36, 0.05), materials.glass, [DOOR_CENTRE_X, STEP_TOP + 1.9 + 0.2, zFront + 0.08]));
  add(mesh("door-step", rbox(1.6, STEP_TOP, 0.55, 0.02), materials.cream, [DOOR_CENTRE_X, STEP_TOP / 2, zFront + 0.32]));
  add(mesh("porch-canopy", rbox(2.4, 0.16, 1.1, 0.03), materials.slate, [DOOR_CENTRE_X, DOORWAY.height + 0.5, zFront + 0.5]));
  add(mesh("porch-post-l", box(0.1, DOORWAY.height + 0.42, 0.1), materials.ink, [DOOR_CENTRE_X - 1.05, (DOORWAY.height + 0.42) / 2, zFront + 0.95]));
  add(mesh("porch-post-r", box(0.1, DOORWAY.height + 0.42, 0.1), materials.ink, [DOOR_CENTRE_X + 1.05, (DOORWAY.height + 0.42) / 2, zFront + 0.95]));

  // Windows -----------------------------------------------------------------------------
  const gfY = FLOOR_TOP + 1.35;
  const ffY = FIRST_TOP + 1.35;
  const zF = zFront + 0.02;
  const zR = zRear - 0.02;
  // Front, ground: study, dining ×2.
  add(windowGroup("window-gf-study", 2.4, 1.6, materials, [-6.3, gfY, zF]));
  add(windowGroup("window-gf-dining-1", 1.6, 1.6, materials, [4.0, gfY, zF]));
  add(windowGroup("window-gf-dining-2", 1.6, 1.6, materials, [7.0, gfY, zF]));
  // Front, first: five sashes.
  add(windowGroup("window-ff-front-1", 2.0, 1.5, materials, [-6.3, ffY, zF]));
  add(windowGroup("window-ff-front-2", 1.4, 1.5, materials, [-3.5, ffY, zF]));
  add(windowGroup("window-ff-front-3", 1.4, 1.5, materials, [DOOR_CENTRE_X, ffY, zF]));
  add(windowGroup("window-ff-front-4", 1.6, 1.5, materials, [3.4, ffY, zF]));
  add(windowGroup("window-ff-front-5", 1.6, 1.5, materials, [6.8, ffY, zF]));
  // Right side (x = +9): kitchen, utility, dining; bedroom 1, en-suite, bedroom 2.
  add(windowGroup("window-gf-kitchen-side", 2.0, 1.6, materials, [xRight + 0.02, gfY, -3.7], Math.PI / 2));
  add(windowGroup("window-gf-utility", 1.1, 1.2, materials, [xRight + 0.02, gfY + 0.2, 0.5], Math.PI / 2));
  add(windowGroup("window-gf-dining-side", 1.6, 1.6, materials, [xRight + 0.02, gfY, 4.2], Math.PI / 2));
  add(windowGroup("window-ff-bed1-side", 1.8, 1.5, materials, [xRight + 0.02, ffY, -3.6], Math.PI / 2));
  add(windowGroup("window-ff-ensuite-right", 0.9, 1.1, materials, [xRight + 0.02, ffY + 0.2, 0.5], Math.PI / 2));
  add(windowGroup("window-ff-bed2-side", 1.6, 1.5, materials, [xRight + 0.02, ffY, 4.2], Math.PI / 2));
  // Left side (x = −9): drawing room, study; bedroom 4, en-suite, bedroom 3.
  add(windowGroup("window-gf-drawing-side", 2.2, 1.6, materials, [xLeft - 0.02, gfY, -3.6], -Math.PI / 2));
  add(windowGroup("window-gf-study-side", 1.4, 1.6, materials, [xLeft - 0.02, gfY, 4.6], -Math.PI / 2));
  add(windowGroup("window-ff-bed4-side", 2.0, 1.5, materials, [xLeft - 0.02, ffY, -3.6], -Math.PI / 2));
  add(windowGroup("window-ff-ensuite-left", 0.9, 1.1, materials, [xLeft - 0.02, ffY + 0.2, 0.6], -Math.PI / 2));
  add(windowGroup("window-ff-bed3-side", 1.8, 1.5, materials, [xLeft - 0.02, ffY, 4.4], -Math.PI / 2));
  // Rear: two canted bays (drawing room, kitchen), family-room French doors, four first-floor windows.
  {
    const bay1 = bayWindow("bay-drawing", materials);
    bay1.position.set(-4.9, 0, zRear);
    bay1.rotation.y = Math.PI;
    add(bay1);
    const bay2 = bayWindow("bay-kitchen", materials);
    bay2.position.set(6.2, 0, zRear);
    bay2.rotation.y = Math.PI;
    add(bay2);
  }
  add(windowGroup("window-gf-family-doors", 2.4, 2.2, materials, [0.9, FLOOR_TOP + 1.12, zR], Math.PI));
  add(windowGroup("window-ff-rear-1", 2.0, 1.5, materials, [-4.9, ffY, zR], Math.PI));
  add(windowGroup("window-ff-rear-2", 1.4, 1.5, materials, [-0.5, ffY, zR], Math.PI));
  add(windowGroup("window-ff-rear-3", 1.0, 1.1, materials, [2.6, ffY + 0.2, zR], Math.PI));
  add(windowGroup("window-ff-rear-4", 2.0, 1.5, materials, [6.2, ffY, zR], Math.PI));

  // Gutters and downpipes -----------------------------------------------------------------
  add(mesh("gutter-front", rbox(W + 0.9, 0.16, 0.18, 0.05), materials.ink, [0, H_EAVES - 0.04, zFront + 0.3]));
  add(mesh("gutter-rear", rbox(W + 0.9, 0.16, 0.18, 0.05), materials.ink, [0, H_EAVES - 0.04, zRear - 0.3]));
  add(mesh("downpipe-right", new THREE.CylinderGeometry(0.06, 0.06, H_EAVES - 0.5, 10), materials.ink, [xRight + 0.14, (H_EAVES - 0.5) / 2 + 0.25, zFront + 0.3]));
  add(mesh("downpipe-left", new THREE.CylinderGeometry(0.06, 0.06, H_EAVES - 0.5, 10), materials.ink, [xLeft - 0.14, (H_EAVES - 0.5) / 2 + 0.25, zRear - 0.3]));

  // Floors -----------------------------------------------------------------------------------
  add(mesh("floor-ground", rbox(inW, 0.14, inD, 0.02), materials.cream, [0, FLOOR_TOP - 0.07, 0]));
  add(mesh("floor-first", rbox(inW, SLAB, inD, 0.02), materials.cream, [0, H_GROUND + SLAB / 2, 0]));

  // Ground-floor partitions (real door openings; the people's routes go through them) --------
  const gBase = FLOOR_TOP;
  // Rear row boundary: drawing room / family room / kitchen against the front rooms and the hall.
  add(partition("wall-rear-row", materials, "x", -1.4, xLeft + T, xRight - T, [[-5.6, -4.6], [-1.4, 0.6], [6.2, 7.2]], gBase, G_H));
  add(partition("wall-drawing-family", materials, "z", -1.5, zRear + T, -1.4, [[-3.8, -2.8]], gBase, G_H));
  add(partition("wall-family-kitchen", materials, "z", 3.3, zRear + T, -1.4, [[-5.2, -2.4]], gBase, G_H));
  add(partition("wall-hall-left", materials, "z", -3.6, -1.4, zFront - T, [[0.4, 1.4], [4.2, 5.2]], gBase, G_H));
  add(partition("wall-study-rear", materials, "x", 3.3, xLeft + T, -3.6, [], gBase, G_H));
  add(partition("wall-cloak", materials, "z", -6.2, -1.4, 3.3, [[1.6, 2.6]], gBase, G_H));
  add(partition("wall-hall-right", materials, "z", 1.9, 2.4, zFront - T, [[3.5, 4.5]], gBase, G_H));
  add(partition("wall-dining-rear", materials, "x", 2.4, 1.9, xRight - T, [], gBase, G_H));
  add(partition("wall-utility", materials, "z", 3.3, -1.4, 2.4, [[0.2, 1.2]], gBase, G_H));
  add(stairs(materials));

  // First-floor partitions ------------------------------------------------------------------
  const fBase = FIRST_TOP;
  add(partition("wall1-rear-row", materials, "x", -1.4, xLeft + T, xRight - T, [[-6.5, -5.5], [-0.5, 0.5], [5.0, 6.0]], fBase, F_H));
  add(partition("wall1-bed4-ensuite", materials, "z", -2.5, zRear + T, -1.4, [], fBase, F_H));
  add(partition("wall1-ensuite-bed1", materials, "z", 1.5, zRear + T, -1.4, [], fBase, F_H));
  add(partition("wall1-landing-left", materials, "z", -3.6, -1.4, zFront - T, [[0.2, 1.2], [3.5, 4.5]], fBase, F_H));
  add(partition("wall1-bed3-ensuite", materials, "x", 2.4, xLeft + T, -3.6, [], fBase, F_H));
  add(partition("wall1-landing-right", materials, "z", 1.9, -1.4, zFront - T, [[0.4, 1.4], [3.6, 4.6]], fBase, F_H));
  add(partition("wall1-bed2-dressing", materials, "x", 2.4, 1.9, xRight - T, [], fBase, F_H));
  add(partition("wall1-dressing-ensuite", materials, "z", 5.5, -1.4, 2.4, [], fBase, F_H));

  // Ground-floor rooms ---------------------------------------------------------------------
  // Drawing room (rear left): fireplace on the left wall, two sofas facing across a rug.
  add(mesh("fireplace", rbox(0.5, 1.3, 1.7, 0.02), materials.brickDeep, [xLeft + T + 0.25, FLOOR_TOP + 0.65, -3.7]));
  {
    const s1 = sofa("sofa-drawing-1", materials, 2.2);
    s1.position.set(-4.9, FLOOR_TOP, -5.0);
    add(s1);
    const s2 = sofa("sofa-drawing-2", materials, 2.2);
    s2.position.set(-4.9, FLOOR_TOP, -2.9);
    s2.rotation.y = Math.PI;
    add(s2);
  }
  add(mesh("rug-drawing", rbox(3.2, 0.03, 1.3, 0.02), materials.sand, [-4.9, FLOOR_TOP + 0.02, -3.95]));
  add(mesh("coffee-table-drawing", rbox(1.1, 0.38, 0.55, 0.03), materials.ink, [-4.9, FLOOR_TOP + 0.19, -3.95]));
  add(pendant("light-drawing", materials, [-4.9, H_GROUND, -3.7]));
  // Family room (rear centre): sofa facing the French doors, TV unit.
  {
    const s = sofa("sofa-family", materials, 2.0);
    s.position.set(0.9, FLOOR_TOP, -3.9);
    s.rotation.y = Math.PI;
    add(s);
  }
  add(mesh("tv-unit", rbox(1.6, 0.5, 0.42, 0.02), materials.ink, [0.9, FLOOR_TOP + 0.25, zRear + T + 0.3]));
  add(pendant("light-family", materials, [0.9, H_GROUND, -3.6]));
  // Kitchen (rear right): run of units on the rear wall, island with hob, tall fridge.
  add(mesh("kitchen-units", rbox(4.4, 0.9, 0.62, 0.02), materials.cream, [6.3, FLOOR_TOP + 0.45, zRear + T + 0.33]));
  add(mesh("kitchen-worktop", rbox(4.44, 0.06, 0.66, 0.01), materials.ink, [6.3, FLOOR_TOP + 0.93, zRear + T + 0.33]));
  add(mesh("kitchen-island", rbox(2.4, 0.9, 1.0, 0.02), materials.cream, [6.1, FLOOR_TOP + 0.45, -3.4]));
  add(mesh("kitchen-island-top", rbox(2.46, 0.06, 1.06, 0.01), materials.ink, [6.1, FLOOR_TOP + 0.93, -3.4]));
  add(mesh("kitchen-hob", rbox(0.7, 0.03, 0.5, 0.01), materials.slate, [6.6, FLOOR_TOP + 0.975, -3.4]));
  add(mesh("kitchen-fridge", rbox(0.7, 2.0, 0.7, 0.02), materials.white, [xRight - T - 0.36, FLOOR_TOP + 1.0, -1.95]));
  add(pendant("light-kitchen", materials, [6.1, H_GROUND, -3.4]));
  // Utility (right, middle): boiler on the right wall, washing machine.
  add(mesh("boiler", rbox(0.45, 0.75, 0.34, 0.03), materials.white, [xRight - T - 0.17, FLOOR_TOP + 1.55, 0.5]));
  add(mesh("washing-machine", rbox(0.6, 0.85, 0.6, 0.02), materials.white, [xRight - T - 0.32, FLOOR_TOP + 0.425, 1.7]));
  // Dining room (front right): table and six chairs.
  add(mesh("dining-table", rbox(2.4, 0.08, 1.0, 0.02), materials.wood, [5.5, FLOOR_TOP + 0.74, 4.2]));
  add(mesh("dining-table-legs", box(2.0, 0.7, 0.7), materials.wood, [5.5, FLOOR_TOP + 0.35, 4.2]));
  for (const [i, x] of [4.7, 5.5, 6.3].entries()) {
    add(chair(`chair-${i + 1}`, materials, [x, FLOOR_TOP, 3.45], 0));
    add(chair(`chair-${i + 4}`, materials, [x, FLOOR_TOP, 4.95], Math.PI));
  }
  add(pendant("light-dining", materials, [5.5, H_GROUND, 4.2]));
  // Study (front left): desk and chair. Cloakroom: basin.
  add(mesh("desk", rbox(1.6, 0.06, 0.7, 0.02), materials.wood, [-6.3, FLOOR_TOP + 0.75, 4.9]));
  add(mesh("desk-legs", box(1.4, 0.72, 0.6), materials.wood, [-6.3, FLOOR_TOP + 0.36, 4.9]));
  add(chair("desk-chair", materials, [-6.3, FLOOR_TOP, 4.1], 0));
  add(pendant("light-study", materials, [-6.3, H_GROUND, 4.6]));
  add(mesh("cloak-basin", rbox(0.5, 0.18, 0.4, 0.05), materials.white, [-8.2, FLOOR_TOP + 0.85, 0.9]));
  // Entrance hall: console table, radiator, pendant, smoke alarm.
  add(mesh("console-table", rbox(1.1, 0.06, 0.36, 0.02), materials.wood, [-2.9, FLOOR_TOP + 0.85, 5.1]));
  add(mesh("console-legs", box(0.9, 0.82, 0.3), materials.wood, [-2.9, FLOOR_TOP + 0.41, 5.1]));
  add(radiator("radiator-hall", materials, [1.0, FLOOR_TOP + 0.45, zFront - T - 0.06]));
  add(pendant("light-hall", materials, [DOOR_CENTRE_X, H_GROUND, 3.2]));
  add(mesh("smoke-alarm", new THREE.CylinderGeometry(0.09, 0.09, 0.03, 12), materials.white, [DOOR_CENTRE_X, H_GROUND - 0.03, 1.2]));

  // First-floor rooms -----------------------------------------------------------------------
  const ffLight = FIRST_TOP + H_FIRST - 0.3;
  const b1 = bed("bed-1", materials, 1.8, 2.1);
  b1.position.set(6.2, FIRST_TOP, -3.6);
  b1.rotation.y = Math.PI / 2; // headboard against the right wall
  add(b1);
  add(mesh("wardrobe-1", rbox(1.6, 2.1, 0.6, 0.02), materials.wood, [4.4, FIRST_TOP + 1.05, zRear + T + 0.32]));
  add(radiator("radiator-bed1", materials, [6.2, FIRST_TOP + 0.45, zRear + T + 0.06], Math.PI));
  add(pendant("light-bed1", materials, [6.2, ffLight, -3.6]));
  const b2 = bed("bed-2", materials, 1.5, 2.0);
  b2.position.set(5.5, FIRST_TOP, 4.4);
  b2.rotation.y = Math.PI; // headboard against the front wall
  add(b2);
  add(mesh("wardrobe-2", rbox(1.4, 2.1, 0.6, 0.02), materials.wood, [3.0, FIRST_TOP + 1.05, 2.4 + TI / 2 + 0.32]));
  add(pendant("light-bed2", materials, [5.5, ffLight, 4.2]));
  const b3 = bed("bed-3", materials, 1.6, 2.0);
  b3.position.set(-6.4, FIRST_TOP, 4.4);
  b3.rotation.y = Math.PI;
  add(b3);
  add(mesh("wardrobe-3", rbox(1.4, 2.1, 0.6, 0.02), materials.wood, [-4.6, FIRST_TOP + 1.05, 2.4 + TI / 2 + 0.32]));
  add(radiator("radiator-bed3", materials, [-6.4, FIRST_TOP + 0.45, zFront - T - 0.06]));
  add(pendant("light-bed3", materials, [-6.4, ffLight, 4.2]));
  const b4 = bed("bed-4", materials, 1.7, 2.1);
  b4.position.set(-5.5, FIRST_TOP, -3.8);
  b4.rotation.y = -Math.PI / 2; // headboard against the left wall
  add(b4);
  add(mesh("wardrobe-4", rbox(1.6, 2.1, 0.6, 0.02), materials.wood, [-3.4, FIRST_TOP + 1.05, zRear + T + 0.32]));
  add(pendant("light-bed4", materials, [-5.5, ffLight, -3.7]));
  add(mesh("wardrobe-dressing", rbox(0.6, 2.1, 2.6, 0.02), materials.wood, [5.5 - TI / 2 - 0.32, FIRST_TOP + 1.05, 0.5]));
  // En-suites: bath + basin each (rear centre, front left, front right).
  add(mesh("bath-mid", rbox(0.8, 0.56, 1.7, 0.12), materials.white, [-1.9, FIRST_TOP + 0.28, -4.5]));
  add(mesh("basin-mid", rbox(0.5, 0.18, 0.4, 0.05), materials.white, [0.8, FIRST_TOP + 0.85, -5.3]));
  add(mesh("bath-left", rbox(1.7, 0.56, 0.8, 0.12), materials.white, [-7.9, FIRST_TOP + 0.28, 1.8]));
  add(mesh("basin-left", rbox(0.4, 0.18, 0.5, 0.05), materials.white, [-8.3, FIRST_TOP + 0.85, -0.6]));
  add(mesh("bath-right", rbox(0.8, 0.56, 1.7, 0.12), materials.white, [8.1, FIRST_TOP + 0.28, 0.5]));
  add(mesh("basin-right", rbox(0.5, 0.18, 0.4, 0.05), materials.white, [6.6, FIRST_TOP + 0.85, -1.0]));
  add(pendant("light-landing", materials, [DOOR_CENTRE_X, ffLight, 2.2]));

  // People and the To Let board (home = the "presentation" state: board up, agent by the path,
  // applicants arriving). animation.ts moves them off-stage for the start of the story.
  add(letBoard(materials));
  add(figure("figure-agent", materials, materials.oxblood, materials.ink, true, [-2.4, 0, PAVEMENT_Z], Math.PI * 0.55));
  add(figure("figure-tenant-1", materials, materials.moss, materials.denim, false, [1.8, 0, PAVEMENT_Z], -Math.PI * 0.5));
  add(figure("figure-tenant-2", materials, materials.denim, materials.ink, false, [2.9, 0, PAVEMENT_Z + 0.7], -Math.PI * 0.45));

  // Snapshot every part's assembled ("home") transform for the animation system.
  const partNames = Object.keys(parts);
  for (const name of partNames) {
    const o = parts[name]!;
    o.userData.home = {
      position: [o.position.x, o.position.y, o.position.z],
      rotation: [o.rotation.x, o.rotation.y, o.rotation.z],
      scale: [o.scale.x, o.scale.y, o.scale.z],
    } satisfies HomeTransform;
  }

  // Triangle count (instances counted once each).
  let triangles = 0;
  group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      const idx = m.geometry.getIndex();
      const tris = idx ? idx.count / 3 : m.geometry.getAttribute("position").count / 3;
      const count = (m as THREE.InstancedMesh).isInstancedMesh ? (m as THREE.InstancedMesh).count : 1;
      triangles += tris * count;
    }
  });

  return { group, parts, materials, partNames, triangles: Math.round(triangles) };
}

/** Restore every part to its assembled transform. */
export function resetHouse(model: HouseModel): void {
  for (const name of model.partNames) {
    const o = model.parts[name]!;
    const home = o.userData.home as HomeTransform | undefined;
    if (!home) continue;
    o.position.set(...home.position);
    o.rotation.set(...home.rotation);
    o.scale.set(...home.scale);
    o.visible = true;
  }
}
