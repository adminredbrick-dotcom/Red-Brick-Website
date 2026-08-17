/**
 * Red Brick house — programmatic model generator.
 *
 * An original, stylised but recognisable British red-brick semi-detached home
 * built for Red Brick Lettings: pitched slate roof with a side chimney, ground-
 * floor bay window, oxblood front door with fanlight, white sash-style windows,
 * gutters and a downpipe, two floors, hallway stair, and room "suggestions"
 * (living room, kitchen, bedroom, bathroom), radiators, pendant lights and a few
 * restrained maintenance details. Every important part is a separately named
 * mesh so GSAP can explode, assemble, reveal, remove, repair and settle it.
 *
 * Built with Three.js only (Blender is not available on the build machine);
 * this file is the model source. `scripts/house/export-glb.mjs` writes the
 * same scene to `public/models/red-brick-house.glb`, and
 * `scripts/house/render-chapters.mjs` produces the static chapter renders.
 *
 * Units: metres. +z is the front (towards the visitor), +y is up. Ground at y=0.
 * Palette: brick #A63D2F · deep brick #70291F · cream #F7F2EA · sand #E8D7C6 ·
 * ink #1D1B1A · stone #716B64 · oxblood door #5B1F22 · slate #3B3633.
 * No people, address, house number, car, keys, documents or security details.
 */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export const HOUSE_MODEL_VERSION = "1.0.0";

// ---------------------------------------------------------------------------
// Dimensions
// ---------------------------------------------------------------------------
const W = 6.4; // width (x)
const D = 8.0; // depth (z)
const T = 0.3; // external wall thickness
const H_GROUND = 2.7;
const H_FIRST = 2.6;
const H_EAVES = H_GROUND + H_FIRST + 0.2; // 5.5
const RIDGE_RISE = 2.9;
const H_RIDGE = H_EAVES + RIDGE_RISE; // 8.4
const SLOPE_LEN = Math.hypot(D / 2, RIDGE_RISE); // ≈ 4.94
const SLOPE_ANGLE = Math.atan2(RIDGE_RISE, D / 2); // ≈ 36°

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
  /** Ordered list of part names, for tests and the exporter. */
  partNames: string[];
  /** Approximate triangle count for the performance report. */
  triangles: number;
}

/** Part groups used by the animation spec (src/lib/house/story.ts). */
export const HOUSE_PART_GROUPS = {
  ground: ["ground", "path", "foundation"],
  structure: ["wall-front", "wall-rear", "wall-left", "wall-right", "gable-left", "gable-right"],
  roof: ["roof-front", "roof-rear", "ridge", "chimney", "chimney-pot-1", "chimney-pot-2"],
  openings: [
    "door",
    "door-frame",
    "fanlight",
    "door-step",
    "bay-window",
    "bay-roof",
    "window-ff-left",
    "window-ff-right",
    "window-rear-1",
    "window-rear-2",
    "window-side",
  ],
  trim: ["gutter-front", "gutter-rear", "downpipe"],
  floors: ["floor-ground", "floor-first"],
  partitions: ["partition-hall", "partition-first-cross", "partition-first-long", "stairs"],
  living: ["sofa", "rug", "coffee-table", "radiator-living", "light-living"],
  kitchen: ["kitchen-units", "kitchen-worktop", "kitchen-tall-unit", "boiler", "light-kitchen"],
  bedroom: ["bed", "bedside-table", "radiator-bedroom", "light-bedroom", "lamp-bedside"],
  bathroom: ["bath", "basin", "light-bathroom"],
  hall: ["light-hall", "smoke-alarm"],
  care: ["roof-tile-loose", "boiler", "radiator-living", "smoke-alarm"],
} as const;

// ---------------------------------------------------------------------------
// Builders
// ---------------------------------------------------------------------------
/** Rounded box without UVs (no textures anywhere) — segments scale with the radius so small trims stay cheap. */
function rbox(w: number, h: number, d: number, radius = 0.03, segments?: number): THREE.BufferGeometry {
  const r = Math.min(radius, w / 2, h / 2, d / 2);
  const geo = new RoundedBoxGeometry(w, h, d, segments ?? (r >= 0.05 ? 2 : 1), r);
  geo.deleteAttribute("uv");
  return geo;
}

/** Plain box without UVs for small straight parts. */
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
  // Shape is in x/y; rotate so its base runs along z and its thickness along x.
  geo.rotateY(Math.PI / 2);
  geo.translate(-T / 2, 0, 0);
  return geo;
}

/** A window: white frame (four bars) around a recessed glass pane with a central glazing bar. Returns a group. */
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
  const bar = 0.09;
  const depth = 0.12;
  const glass = mesh(`${name}-glass`, box(width - bar, height - bar, 0.05), materials.glass, [0, 0, -0.01]);
  const top = mesh(`${name}-frame-top`, box(width, bar, depth), materials.white, [0, height / 2 - bar / 2, 0]);
  const bottom = mesh(`${name}-frame-bottom`, box(width, bar, depth), materials.white, [0, -height / 2 + bar / 2, 0]);
  const left = mesh(`${name}-frame-left`, box(bar, height, depth), materials.white, [-width / 2 + bar / 2, 0, 0]);
  const right = mesh(`${name}-frame-right`, box(bar, height, depth), materials.white, [width / 2 - bar / 2, 0, 0]);
  const glazingBar = mesh(`${name}-bar`, box(width - bar, 0.06, 0.08), materials.white, [0, 0, 0.01]);
  const sill = mesh(`${name}-sill`, box(width + 0.16, 0.08, 0.2), materials.cream, [0, -height / 2 - 0.02, 0.06]);
  g.add(glass, top, bottom, left, right, glazingBar, sill);
  g.position.set(...position);
  g.rotation.y = rotationY;
  return g;
}

/** Bay window: three glazed facets on a plinth with a lead-effect roof. */
function bayWindow(materials: HouseMaterials): THREE.Group {
  const g = new THREE.Group();
  g.name = "bay-window";
  const depth = 0.7;
  const frontW = 1.5;
  const sideW = 0.85;
  const h = 1.9;
  const y = 0.6 + h / 2;
  // Plinth (brick) under the bay
  g.add(mesh("bay-plinth", rbox(frontW + 1.1, 0.6, depth, 0.02), materials.brick, [0, 0.3, depth / 2]));
  // Front facet
  const front = windowGroup("bay-front", frontW, h, materials, [0, y, depth]);
  g.add(front);
  // Angled side facets
  const angle = Math.atan2(depth, (frontW + 1.1) / 2 - frontW / 2);
  const leftX = -(frontW / 2 + Math.cos(angle) * (sideW / 2));
  const leftZ = depth - Math.sin(angle) * (sideW / 2);
  // Facet normals point outward: rotate the +z-facing panel by -angle (left) / +angle (right).
  g.add(windowGroup("bay-left", sideW, h, materials, [leftX, y, leftZ], -angle));
  g.add(windowGroup("bay-right", sideW, h, materials, [-leftX, y, leftZ], angle));
  return g;
}

/** Instanced stair run: 12 treads rising from the front hallway towards the rear. */
function stairs(materials: HouseMaterials): THREE.InstancedMesh {
  const count = 12;
  const tread = box(0.9, 0.2, 0.28);
  const inst = new THREE.InstancedMesh(tread, materials.wood, count);
  inst.name = "stairs";
  const m = new THREE.Matrix4();
  for (let i = 0; i < count; i++) {
    m.makeTranslation(2.15, 0.1 + i * 0.208, 2.9 - i * 0.28);
    inst.setMatrixAt(i, m);
  }
  inst.instanceMatrix.needsUpdate = true;
  return inst;
}

/** Bed with base, mattress, two pillows and an oxblood headboard, as a group. */
function bed(materials: HouseMaterials): THREE.Group {
  const g = new THREE.Group();
  g.name = "bed";
  g.add(mesh("bed-base", rbox(1.5, 0.35, 2.0, 0.03), materials.wood, [0, 0.175, 0]));
  g.add(mesh("bed-mattress", rbox(1.4, 0.24, 1.9, 0.06), materials.white, [0, 0.47, 0]));
  g.add(mesh("bed-throw", rbox(1.42, 0.06, 1.0, 0.03), materials.fabric, [0, 0.62, 0.35]));
  g.add(mesh("bed-pillow-1", rbox(0.55, 0.14, 0.4, 0.06), materials.cream, [-0.35, 0.66, -0.7]));
  g.add(mesh("bed-pillow-2", rbox(0.55, 0.14, 0.4, 0.06), materials.cream, [0.35, 0.66, -0.7]));
  g.add(mesh("bed-headboard", rbox(1.6, 0.9, 0.08, 0.03), materials.oxblood, [0, 0.6, -1.0]));
  return g;
}

/** Sofa: seat, back and two arms as a group. */
function sofa(materials: HouseMaterials): THREE.Group {
  const g = new THREE.Group();
  g.name = "sofa";
  g.add(mesh("sofa-seat", rbox(1.9, 0.42, 0.9, 0.06), materials.fabric, [0, 0.21, 0]));
  g.add(mesh("sofa-back", rbox(1.9, 0.5, 0.25, 0.06), materials.fabric, [0, 0.62, -0.33]));
  g.add(mesh("sofa-arm-l", rbox(0.22, 0.6, 0.9, 0.05), materials.fabric, [-0.84, 0.3, 0]));
  g.add(mesh("sofa-arm-r", rbox(0.22, 0.6, 0.9, 0.05), materials.fabric, [0.84, 0.3, 0]));
  g.add(mesh("sofa-cushion", rbox(0.4, 0.14, 0.4, 0.05), materials.sand, [-0.4, 0.5, -0.05]));
  return g;
}

/** Pendant light: short flex, shade and a warm bulb (emissive at dusk). */
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

/** Radiator: white panel with subtle end caps. */
function radiator(name: string, materials: HouseMaterials, position: [number, number, number], rotationY = 0): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(mesh(`${name}-panel`, rbox(1.0, 0.55, 0.09, 0.02), materials.white, [0, 0, 0]));
  g.add(mesh(`${name}-valve`, new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), materials.ink, [0.55, -0.2, 0], [0, 0, Math.PI / 2]));
  g.position.set(...position);
  g.rotation.y = rotationY;
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

  // Ground and foundation --------------------------------------------------
  add(mesh("ground", rbox(16, 0.12, 14, 0.06), materials.ground, [0, -0.06, 0]));
  add(mesh("path", rbox(1.4, 0.04, 3.2, 0.02), materials.cream, [1.9, 0.02, D / 2 + 1.6]));
  add(mesh("foundation", rbox(W + 0.2, 0.3, D + 0.2, 0.03), materials.brickDeep, [0, 0.15, 0]));

  // External walls -----------------------------------------------------------
  add(mesh("wall-front", rbox(W, H_EAVES, T, 0.03), materials.brick, [0, H_EAVES / 2, D / 2 - T / 2]));
  add(mesh("wall-rear", rbox(W, H_EAVES, T, 0.03), materials.brick, [0, H_EAVES / 2, -D / 2 + T / 2]));
  add(mesh("wall-left", rbox(T, H_EAVES, D - 2 * T, 0.03), materials.brickDeep, [-W / 2 + T / 2, H_EAVES / 2, 0]));
  add(mesh("wall-right", rbox(T, H_EAVES, D - 2 * T, 0.03), materials.brick, [W / 2 - T / 2, H_EAVES / 2, 0]));
  add(mesh("gable-left", gableGeometry(), materials.brickDeep, [-W / 2 + T / 2, H_EAVES, 0]));
  add(mesh("gable-right", gableGeometry(), materials.brick, [W / 2 - T / 2, H_EAVES, 0]));

  // Roof ---------------------------------------------------------------------
  const roofY = H_EAVES + RIDGE_RISE / 2 + 0.06;
  add(
    mesh("roof-front", rbox(W + 0.7, 0.18, SLOPE_LEN + 0.35, 0.02), materials.slate, [0, roofY, D / 4 + 0.08], [SLOPE_ANGLE, 0, 0]),
  );
  add(
    mesh("roof-rear", rbox(W + 0.7, 0.18, SLOPE_LEN + 0.35, 0.02), materials.slate, [0, roofY, -D / 4 - 0.08], [-SLOPE_ANGLE, 0, 0]),
  );
  add(mesh("ridge", rbox(W + 0.7, 0.16, 0.34, 0.06), materials.ink, [0, H_RIDGE + 0.1, 0]));
  add(mesh("chimney", rbox(0.9, 2.2, 0.75, 0.03), materials.brick, [W / 2 - 0.9, H_RIDGE - 0.4, 0]));
  add(mesh("chimney-pot-1", new THREE.CylinderGeometry(0.11, 0.14, 0.4, 12), materials.sand, [W / 2 - 1.1, H_RIDGE + 0.9, 0]));
  add(mesh("chimney-pot-2", new THREE.CylinderGeometry(0.11, 0.14, 0.4, 12), materials.sand, [W / 2 - 0.7, H_RIDGE + 0.9, 0]));
  add(mesh("roof-tile-loose", rbox(0.5, 0.06, 0.4, 0.01), materials.slate, [-1.4, H_EAVES + 1.25, D / 4 + 1.55], [SLOPE_ANGLE, 0, 0]));

  // Front door, frame, fanlight, step ------------------------------------------
  const zFront = D / 2;
  add(mesh("door-frame", rbox(1.15, 2.55, 0.14, 0.02), materials.white, [1.9, 1.275, zFront + 0.02]));
  add(mesh("door", rbox(0.95, 2.05, 0.07, 0.015), materials.oxblood, [1.9, 1.025, zFront + 0.09]));
  add(mesh("fanlight", box(0.95, 0.35, 0.05), materials.glass, [1.9, 2.3, zFront + 0.08]));
  add(mesh("door-step", rbox(1.3, 0.14, 0.5, 0.02), materials.cream, [1.9, 0.07, zFront + 0.3]));
  // Door knob and letter plate — restrained details, no numbers.
  add(mesh("door-knob", new THREE.SphereGeometry(0.045, 10, 8), materials.sand, [1.55, 1.05, zFront + 0.15]));

  // Windows --------------------------------------------------------------------
  const bay = bayWindow(materials);
  bay.position.set(-1.25, 0, zFront - 0.02);
  add(bay);
  add(mesh("bay-roof", rbox(3.0, 0.14, 1.0, 0.03), materials.slate, [-1.25, 2.72, zFront + 0.42]));
  add(windowGroup("window-ff-left", 1.6, 1.4, materials, [-1.25, 3.95, zFront + 0.02]));
  add(windowGroup("window-ff-right", 1.1, 1.4, materials, [1.9, 3.95, zFront + 0.02]));
  add(windowGroup("window-rear-1", 1.4, 1.3, materials, [-1.4, 1.65, -zFront - 0.02], Math.PI));
  add(windowGroup("window-rear-2", 1.4, 1.3, materials, [1.2, 3.95, -zFront - 0.02], Math.PI));
  add(windowGroup("window-side", 1.0, 1.2, materials, [W / 2 + 0.02, 3.95, -1.6], Math.PI / 2));

  // Gutters and downpipe --------------------------------------------------------
  add(mesh("gutter-front", rbox(W + 0.7, 0.14, 0.16, 0.05), materials.ink, [0, H_EAVES - 0.05, zFront + 0.28]));
  add(mesh("gutter-rear", rbox(W + 0.7, 0.14, 0.16, 0.05), materials.ink, [0, H_EAVES - 0.05, -zFront - 0.28]));
  add(mesh("downpipe", new THREE.CylinderGeometry(0.06, 0.06, H_EAVES - 0.4, 10), materials.ink, [W / 2 + 0.12, (H_EAVES - 0.4) / 2 + 0.2, zFront + 0.28]));

  // Floors and partitions --------------------------------------------------------
  const inW = W - 2 * T;
  const inD = D - 2 * T;
  add(mesh("floor-ground", rbox(inW, 0.14, inD, 0.02), materials.cream, [0, 0.07, 0]));
  add(mesh("floor-first", rbox(inW, 0.22, inD, 0.02), materials.cream, [0, H_GROUND + 0.11, 0]));
  add(mesh("partition-hall", rbox(0.12, H_GROUND, inD * 0.7, 0.01), materials.cream, [1.05, H_GROUND / 2, 0.55]));
  add(mesh("partition-first-cross", rbox(inW, H_FIRST - 0.3, 0.12, 0.01), materials.cream, [0, H_GROUND + 0.22 + (H_FIRST - 0.3) / 2, 0]));
  add(mesh("partition-first-long", rbox(0.12, H_FIRST - 0.3, inD / 2 - 0.2, 0.01), materials.cream, [0.4, H_GROUND + 0.22 + (H_FIRST - 0.3) / 2, -inD / 4]));
  add(stairs(materials));

  // Living room (front-left, ground) --------------------------------------------
  const livingSofa = sofa(materials);
  livingSofa.position.set(-1.35, 0.14, 1.9);
  livingSofa.rotation.y = Math.PI;
  add(livingSofa);
  add(mesh("rug", rbox(2.4, 0.03, 1.8, 0.02), materials.sand, [-1.35, 0.16, 1.2]));
  add(mesh("coffee-table", rbox(0.9, 0.36, 0.5, 0.03), materials.ink, [-1.35, 0.32, 0.9]));
  add(radiator("radiator-living", materials, [-1.25, 0.55, zFront - T - 0.06]));
  add(pendant("light-living", materials, [-1.35, H_GROUND, 1.4]));

  // Kitchen (rear-left, ground) --------------------------------------------------
  add(mesh("kitchen-units", rbox(2.9, 0.88, 0.6, 0.02), materials.cream, [-1.35, 0.58, -zFront + T + 0.3]));
  add(mesh("kitchen-worktop", rbox(2.94, 0.06, 0.64, 0.01), materials.ink, [-1.35, 1.05, -zFront + T + 0.3]));
  add(mesh("kitchen-tall-unit", rbox(0.62, 1.95, 0.62, 0.02), materials.white, [-2.65, 1.12, -zFront + T + 1.2]));
  add(mesh("boiler", rbox(0.42, 0.7, 0.32, 0.03), materials.white, [0.3, 1.9, -zFront + T + 0.16]));
  add(pendant("light-kitchen", materials, [-1.35, H_GROUND, -2.0]));

  // Bedroom (front-left, first floor) -----------------------------------------------
  const b = bed(materials);
  b.position.set(-1.35, H_GROUND + 0.22, 1.5);
  add(b);
  add(mesh("bedside-table", rbox(0.45, 0.5, 0.45, 0.03), materials.wood, [-2.5, H_GROUND + 0.47, 0.35]));
  add(radiator("radiator-bedroom", materials, [-1.25, H_GROUND + 0.55 + 0.22, zFront - T - 0.06]));
  add(pendant("light-bedroom", materials, [-1.35, H_GROUND + 0.22 + H_FIRST - 0.35, 1.4]));
  const bedside = new THREE.Group();
  bedside.name = "lamp-bedside";
  bedside.add(mesh("lamp-bedside-stem", new THREE.CylinderGeometry(0.02, 0.05, 0.3, 8), materials.ink, [0, 0.15, 0]));
  bedside.add(mesh("lamp-bedside-shade", new THREE.CylinderGeometry(0.1, 0.13, 0.14, 12, 1, true), materials.sand, [0, 0.36, 0]));
  bedside.add(mesh("lamp-bedside-bulb", new THREE.SphereGeometry(0.045, 10, 8), materials.lamp.clone(), [0, 0.34, 0]));
  bedside.position.set(-2.5, H_GROUND + 0.72, 0.35);
  add(bedside);

  // Bathroom (rear-right, first floor) ----------------------------------------------
  add(mesh("bath", rbox(0.78, 0.56, 1.7, 0.12), materials.white, [2.2, H_GROUND + 0.22 + 0.28, -2.4]));
  add(mesh("basin", rbox(0.5, 0.18, 0.4, 0.05), materials.white, [1.3, H_GROUND + 0.22 + 0.85, -3.4]));
  add(pendant("light-bathroom", materials, [1.9, H_GROUND + 0.22 + H_FIRST - 0.35, -2.4]));

  // Hall ---------------------------------------------------------------------------
  add(pendant("light-hall", materials, [2.15, H_GROUND, 3.2]));
  add(mesh("smoke-alarm", new THREE.CylinderGeometry(0.09, 0.09, 0.03, 12), materials.white, [2.15, H_GROUND - 0.03, 1.4]));

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
