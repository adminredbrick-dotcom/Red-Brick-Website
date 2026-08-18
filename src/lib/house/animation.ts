/**
 * House chapter choreography (v4 — "a viewing, room by room", the large house).
 *
 * One paused GSAP timeline per story, scrubbed by scroll progress (0–1) or by
 * the static-render harness. Pure GSAP + Three.js: no React, no ScrollTrigger
 * here, so the browser scene and the render script produce identical frames.
 *
 * The story (six chapters + close, identical opening for every audience):
 *  1. On the market    — the To Let board rises; the Red Brick agent arrives at the path and
 *                        checks the clipboard.
 *  2. The meeting      — two applicants arrive from the other direction; the agent steps
 *                        forward, they shake hands (the second applicant waves, then nods);
 *                        the agent leads them up the path and opens the front door.
 *  3. Through the door — they step into the entrance hall; the roof lifts, the front façade
 *                        slides away to the left and the right-hand wall slides away to the
 *                        right, and the first floor lifts as a layer — an exploded dollhouse
 *                        seen from the front-right, so the visit can be watched.
 *  4. Room by room     — the agent gestures, leads them into the dining room, then through
 *                        the family room to the kitchen island (in the landlord story the
 *                        agent goes on to check the boiler in the utility). Each room lights.
 *  5. Making it home   — the camera rises to the first floor as the bedrooms light; the
 *                        house closes back up with the people inside.
 *  6. Looked after     — goodbye at the front door (handshake, a wave), the agent walks off
 *                        along the pavement, the board comes down, the loose roof tile is
 *                        lifted, checked and settled, dusk falls.
 *  Close               — settle back to the home framing at warm dusk.
 * Timeline units: chapters occupy 0–12 (2 each), close 12–14. The scroll length of the
 * chapter (see house-stage.tsx) sets the pace; the beats are spread through each chapter.
 *
 * Principles
 * - Every story starts from the SAME state (complete house, daylight, board down, nobody
 *   there) at the home framing — identical to the "start" still.
 * - Nothing passes through anything: the roof lifts straight up, the façade and the right
 *   wall slide sideways clear of everything, the door swings outward on a real hinge, the
 *   front wall has a real doorway and every partition has real openings (routes below stay
 *   clear of furniture, stairs and walls), the board grows from its base, the tile lifts along
 *   the roof normal, arms pivot at the shoulder.
 * - The camera moves little (≤ ~12° of orbit per chapter) and, whenever the lights are on or
 *   dusk falls, it looks at the FRONT of the house.
 * - Few, long tweens with gentle eases; people move at a walking pace with a slight bob and
 *   interact (handshake, wave, nod, point).
 */
import gsap from "gsap";
import * as THREE from "three";

import {
  DOOR_CENTRE_X,
  FLOOR_TOP,
  HOUSE_PART_GROUPS,
  PAVEMENT_Z,
  STEP_TOP,
  resetHouse,
  type HomeTransform,
  type HouseModel,
} from "./build-house";
import { CHAPTER_COUNT, type StoryKey } from "./story";

/** Camera orbit rig — the timeline animates these numbers; applyCamera() places the camera. */
export interface OrbitState {
  /** Azimuth in radians around the target (0 = looking from +z, the front; positive = towards +x). */
  theta: number;
  radius: number;
  height: number;
  /** Height of the look-at point. */
  targetY: number;
}

export interface HouseRig {
  model: HouseModel;
  key: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  camera: THREE.PerspectiveCamera;
  orbit: OrbitState;
}

export const ORBIT_HOME: OrbitState = { theta: 0.55, radius: 46, height: 18, targetY: 5.0 };
export const CAMERA_TARGET: [number, number, number] = [0, ORBIT_HOME.targetY, 0];
/** Camera far plane needed for the home framing (used by the Canvas). */
export const CAMERA_FAR = 220;

/** Convenience for the R3F Canvas initial camera prop (matches applyCamera at ORBIT_HOME). */
export const CAMERA_HOME: [number, number, number] = [
  Math.sin(ORBIT_HOME.theta) * ORBIT_HOME.radius,
  ORBIT_HOME.height,
  Math.cos(ORBIT_HOME.theta) * ORBIT_HOME.radius,
];

export function applyCamera(rig: HouseRig): void {
  const { theta, radius, height, targetY } = rig.orbit;
  rig.camera.position.set(Math.sin(theta) * radius, height, Math.cos(theta) * radius);
  rig.camera.lookAt(0, targetY, 0);
}

/** Total timeline length in units (chapters × 2 + close 2). */
export const TIMELINE_UNITS = CHAPTER_COUNT * 2 + 2;

const FIRST_LIFT = 4.6;
const ROOF_LIFT = FIRST_LIFT + 1.6;
const FACADE_SLIDE = -44;
const RIGHT_SLIDE = 24;

type Vec3 = [number, number, number];

/** Off-stage parking for the people (outside every chapter's frame). */
const OFF_LEFT: Vec3 = [-30, 0, 15];
const OFF_RIGHT_1: Vec3 = [30, 0, 15];
const OFF_RIGHT_2: Vec3 = [30.8, 0, 16.4];
const PX = DOOR_CENTRE_X; // the path / doorway line
const PZ = PAVEMENT_Z;
const F = FLOOR_TOP;
const S = STEP_TOP;
const PATH_Y = 0.04;

function home(o: THREE.Object3D): HomeTransform {
  return o.userData.home as HomeTransform;
}

/** Bulb materials keyed by light name. */
function bulbs(model: HouseModel): Record<string, THREE.MeshStandardMaterial> {
  const out: Record<string, THREE.MeshStandardMaterial> = {};
  model.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && /-bulb$/.test(m.name)) out[m.name.replace(/-bulb$/, "")] = m.material as THREE.MeshStandardMaterial;
  });
  return out;
}

const EASE = "power2.inOut";
const CAM_EASE = "sine.inOut";

/**
 * Build the paused timeline for a story. The rig must be in its start state
 * (`resetRig()`) so the timeline records the right values.
 */
export function createHouseTimeline(rig: HouseRig, story: StoryKey, onUpdate?: () => void): gsap.core.Timeline {
  const { model, key, hemi, orbit } = rig;
  const P = model.parts;
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE }, onUpdate });
  const lamps = bulbs(model);
  const glass = model.materials.glass;

  /** Translate a group of parts to home + offset (offset zero = back home). */
  const shift = (names: readonly string[], offset: Vec3, at: number, dur: number, stagger = 0) => {
    names.forEach((name, i) => {
      const o = P[name];
      if (!o) return;
      const h = home(o);
      tl.to(
        o.position,
        { x: h.position[0] + offset[0], y: h.position[1] + offset[1], z: h.position[2] + offset[2], duration: dur },
        at + i * stagger,
      );
    });
  };
  const G = HOUSE_PART_GROUPS;
  const roofUp = (at: number, dur = 1.6) => shift(G.roof, [0, ROOF_LIFT, 0], at, dur, 0.01);
  const roofDown = (at: number, dur = 1.6) => shift(G.roof, [0, 0, 0], at, dur, 0.01);
  const facadeOut = (at: number, dur = 1.5) => shift(G.facade, [FACADE_SLIDE, 0, 0], at, dur, 0.01);
  const facadeIn = (at: number, dur = 1.5) => shift(G.facade, [0, 0, 0], at, dur, 0.01);
  const rightOut = (at: number, dur = 1.5) => shift(G.rightSide, [RIGHT_SLIDE, 0, 0], at, dur, 0.01);
  const rightIn = (at: number, dur = 1.5) => shift(G.rightSide, [0, 0, 0], at, dur, 0.01);
  const floorsApart = (at: number, dur = 1.6) => shift(G.firstFloor, [0, FIRST_LIFT, 0], at, dur, 0.005);
  const floorsTogether = (at: number, dur = 1.6) => shift(G.firstFloor, [0, 0, 0], at, dur, 0.005);
  const cam = (to: Partial<OrbitState>, at: number, dur = 2) => tl.to(orbit, { ...to, duration: dur, ease: CAM_EASE }, at);
  const lampsOn = (names: readonly string[], at: number, dur = 0.7, stagger = 0.18) => {
    names.forEach((n, i) => {
      const m = lamps[n];
      if (m) tl.to(m, { emissiveIntensity: 1.6, duration: dur }, at + i * stagger);
    });
  };
  const windowsGlow = (at: number, dur = 1.2, to = 0.55) => tl.to(glass, { emissiveIntensity: to, duration: dur }, at);
  const doorOpen = (at: number, dur = 0.7) => tl.to(P["door"]!.rotation, { y: -1.5, duration: dur }, at);
  const tileRepair = (at: number) => {
    const tile = P["roof-tile-loose"];
    if (!tile) return;
    const h = home(tile);
    tl.to(tile.position, { y: h.position[1] + 0.6, z: h.position[2] + 0.4, duration: 0.6 }, at);
    tl.to(tile.position, { y: h.position[1], z: h.position[2], duration: 0.7 }, at + 0.9);
  };
  const dusk = (at: number, dur = 1.8) => {
    tl.to(key, { intensity: 1.15, duration: dur }, at);
    tl.to(key.color, { r: 1, g: 0.72, b: 0.5, duration: dur }, at);
    tl.to(hemi, { intensity: 0.55, duration: dur }, at);
    tl.to(glass, { emissiveIntensity: 0.9, duration: dur }, at);
    Object.values(lamps).forEach((m) => tl.to(m, { emissiveIntensity: 1.6, duration: dur }, at));
  };
  const boardUp = (at: number, dur = 1.0) => tl.to(P["let-board"]!.scale, { y: 1, duration: dur, ease: "power2.out" }, at);
  const boardDown = (at: number, dur = 0.8) => tl.to(P["let-board"]!.scale, { y: 0.001, duration: dur, ease: "power2.in" }, at);

  // ---- People ------------------------------------------------------------------------------
  const fig = (name: string) => P[name]!;
  const armOf = (name: string, side: "l" | "r") => fig(name).getObjectByName(`${name}-arm-${side}`)!;
  const headOf = (name: string) => fig(name).getObjectByName(`${name}-head`)!;
  /** Turn to a yaw (radians; 0 faces +z, π faces −z, +π/2 faces +x). */
  const face = (name: string, yaw: number, at: number, dur = 0.35) => tl.to(fig(name).rotation, { y: yaw, duration: dur, ease: "sine.inOut" }, at);
  /**
   * Walk along waypoints [x, y(feet), z] at a steady pace: turn to face each leg, gentle bob of
   * body and head, stop facing `faceAt` if given. `from` is where the person is when the walk
   * starts (used for headings and pacing only).
   */
  const walk = (name: string, from: Vec3, points: Vec3[], at: number, dur: number, faceAt?: number) => {
    const o = fig(name);
    const total = points.reduce((acc, p, i) => {
      const prev = i === 0 ? from : points[i - 1]!;
      return acc + Math.hypot(p[0] - prev[0], p[2] - prev[2]);
    }, 0);
    let t = at;
    points.forEach((p, i) => {
      const prev = i === 0 ? from : points[i - 1]!;
      const len = Math.hypot(p[0] - prev[0], p[2] - prev[2]);
      const d = total > 0 ? (dur * len) / total : 0;
      if (d <= 0) return;
      const heading = Math.atan2(p[0] - prev[0], p[2] - prev[2]);
      tl.to(o.rotation, { y: heading, duration: Math.min(0.25, d), ease: "sine.out" }, t);
      const ease = points.length === 1 ? "sine.inOut" : i === 0 ? "sine.in" : i === points.length - 1 ? "sine.out" : "none";
      tl.to(o.position, { x: p[0], y: p[1], z: p[2], duration: d, ease }, t);
      t += d;
    });
    if (faceAt !== undefined) tl.to(o.rotation, { y: faceAt, duration: 0.3, ease: "sine.inOut" }, t);
    const steps = Math.max(2, Math.round(dur / 0.16));
    for (const suffix of ["-body", "-head"]) {
      const part = o.getObjectByName(name + suffix);
      if (!part) continue;
      const y0 = part.position.y;
      tl.to(part.position, { y: y0 + 0.04, duration: dur / steps / 2, repeat: steps - 1, yoyo: true, ease: "sine.inOut" }, at);
      tl.set(part.position, { y: y0 }, at + dur + 0.001);
    }
  };
  /** Raise an arm forward (negative rotation.x) and hold, then lower. */
  const point = (name: string, side: "l" | "r", at: number, hold = 0.6, angle = -1.3) => {
    const arm = armOf(name, side);
    tl.to(arm.rotation, { x: angle, duration: 0.3, ease: "sine.out" }, at);
    tl.to(arm.rotation, { x: 0, duration: 0.35, ease: "sine.inOut" }, at + 0.3 + hold);
  };
  /** Nod twice. */
  const nod = (name: string, at: number) => {
    const head = headOf(name);
    tl.to(head.rotation, { x: 0.28, duration: 0.12, repeat: 3, yoyo: true, ease: "sine.inOut" }, at);
    tl.set(head.rotation, { x: 0 }, at + 0.49);
  };
  /** Wave: right arm straight up, wag sideways three times, lower. */
  const wave = (name: string, at: number) => {
    const arm = armOf(name, "r");
    tl.to(arm.rotation, { x: -2.6, duration: 0.2, ease: "sine.out" }, at);
    tl.to(arm.rotation, { z: -0.35, duration: 0.08, repeat: 5, yoyo: true, ease: "sine.inOut" }, at + 0.2);
    tl.set(arm.rotation, { z: 0 }, at + 0.69);
    tl.to(arm.rotation, { x: 0, duration: 0.25, ease: "sine.inOut" }, at + 0.7);
  };
  /** Handshake between two people already facing each other ~1.5 m apart: right arms out, three pumps, lower. */
  const handshake = (a: string, b: string, at: number) => {
    for (const name of [a, b]) {
      const arm = armOf(name, "r");
      tl.to(arm.rotation, { x: -1.15, duration: 0.25, ease: "sine.out" }, at);
      tl.to(arm.rotation, { x: -1.35, duration: 0.09, repeat: 5, yoyo: true, ease: "sine.inOut" }, at + 0.27);
      tl.to(arm.rotation, { x: 0, duration: 0.3, ease: "sine.inOut" }, at + 0.83);
    }
    nod(a, at + 0.35);
    nod(b, at + 0.5);
  };
  /** Room lights (see build-house.ts pendant names). */
  const GROUND_LAMPS = ["light-hall", "light-dining", "light-kitchen", "light-family", "light-drawing", "light-study"];
  const FIRST_LAMPS = ["light-landing", "light-bed1", "light-bed2", "light-bed3", "light-bed4"];

  // Shared waypoints (all routes go through real openings; see build-house.ts partitions).
  const HALL_A: Vec3 = [-0.4, F, 4.4]; // agent's spot in the hall, facing the door
  const HALL_T1: Vec3 = [-1.6, F, 4.5];
  const HALL_T2: Vec3 = [-1.7, F, 3.5];
  const DIN_A: Vec3 = [3.6, F, 3.6];
  const DIN_T1: Vec3 = [3.4, F, 4.85];
  const DIN_T2: Vec3 = [2.7, F, 5.15];
  const KIT_A: Vec3 = [4.3, F, -2.5];
  const KIT_T1: Vec3 = [5.6, F, -2.2];
  const KIT_T2: Vec3 = [6.9, F, -2.3];
  const UTIL_A: Vec3 = [7.9, F, 0.4];
  // Hall → dining door (x = 1.9, z 3.5–4.5) → dining.
  const toDining = (to: Vec3): Vec3[] => [[1.2, F, 4.0], [2.6, F, 4.0], to];
  // Dining → hall → rear opening (x −1.4..0.6 at z −1.4) → family room → kitchen opening (x 3.3, z −5.2..−2.4).
  const toKitchen = (to: Vec3): Vec3[] => [[2.6, F, 4.0], [1.2, F, 4.0], [-0.4, F, 2.2], [-0.4, F, -2.0], [2.6, F, -2.9], to];
  const backToHall = (from: Vec3, to: Vec3): Vec3[] => {
    const viaUtility: Vec3[] = from[0] > 6 && from[2] > -1.4 ? [[6.7, F, -0.6], [6.7, F, -2.1], [4.6, F, -2.6]] : [];
    return [...viaUtility, [2.6, F, -2.9], [-0.4, F, -2.0], [-0.4, F, 2.2], to];
  };

  // ---- Chapter 1 (0–2): On the market — identical for every story. ----------------------
  cam({ theta: 0.5, height: 15, radius: 42, targetY: 4.5 }, 0, 2.4);
  boardUp(0.4, 1.0);
  walk("figure-agent", OFF_LEFT, [[-16, 0, PZ], [-2.4, 0, PZ]], 0.3, 1.5, Math.PI * 0.5);
  point("figure-agent", "r", 1.95, 0.4, -0.9); // glances at the clipboard

  // ---- Chapter 2 (2–4): The meeting — applicants arrive, handshake, up the path, door opens. --
  cam({ theta: 0.42, height: 10, radius: 36, targetY: 3.4 }, 2.0, 2.4);
  walk("figure-tenant-1", OFF_RIGHT_1, [[16, 0, PZ], [1.8, 0, PZ]], 2.1, 1.3, -Math.PI * 0.5);
  walk("figure-tenant-2", OFF_RIGHT_2, [[16.8, 0, PZ + 0.8], [2.9, 0, PZ + 0.7]], 2.15, 1.3, -Math.PI * 0.5);
  wave("figure-tenant-2", 3.0);
  walk("figure-agent", [-2.4, 0, PZ], [[0.3, 0, PZ]], 3.15, 0.35, Math.PI * 0.5);
  handshake("figure-agent", "figure-tenant-1", 3.55);
  // The agent leads the way up the path; the door opens as the agent reaches the porch.
  walk("figure-agent", [0.3, 0, PZ], [[PX, PATH_Y, 8.4], [PX, PATH_Y, 7.4]], 4.6, 0.6, Math.PI);
  doorOpen(4.9, 0.7);

  // ---- Chapter 3 (4–6): Through the door — into the hall; the house opens up. ----------------
  cam({ theta: 0.44, height: 22, radius: 50, targetY: 8.5 }, 4.4, 2.6);
  walk("figure-agent", [PX, PATH_Y, 7.4], [[PX, S, 6.3], [PX, F, 5.4], HALL_A], 5.3, 0.6, 0);
  walk("figure-tenant-1", [1.8, 0, PZ], [[PX, PATH_Y, 8.4], [PX, PATH_Y, 7.4], [PX, S, 6.3], [PX, F, 5.4], HALL_T1], 5.5, 1.0, 1.5);
  walk("figure-tenant-2", [2.9, 0, PZ + 0.7], [[PX + 0.2, PATH_Y, 8.6], [PX, PATH_Y, 7.4], [PX, S, 6.3], [PX, F, 5.4], HALL_T2], 5.9, 1.05, 1.4);
  roofUp(5.2, 1.6);
  facadeOut(5.6, 1.5);
  rightOut(5.9, 1.5);
  floorsApart(6.2, 1.6);
  lampsOn(["light-hall"], 6.9, 0.6);

  // ---- Chapter 4 (6–8): Room by room — dining room, then the kitchen; lights follow. -----------
  cam({ theta: 0.46, height: 17, radius: 43, targetY: 6.6 }, 6.4, 2.2);
  face("figure-agent", Math.PI * 0.5, 6.9); // turns towards the dining room and gestures
  point("figure-agent", "r", 7.0, 0.4);
  nod("figure-tenant-1", 7.25);
  walk("figure-agent", HALL_A, toDining(DIN_A), 7.3, 0.5, Math.PI * 0.85);
  walk("figure-tenant-1", HALL_T1, toDining(DIN_T1), 7.45, 0.55, Math.PI);
  walk("figure-tenant-2", HALL_T2, [[0.2, F, 3.9], ...toDining(DIN_T2)], 7.6, 0.6, Math.PI * 0.85);
  lampsOn(["light-dining"], 7.9, 0.6);
  point("figure-agent", "l", 8.05, 0.4, -1.1); // the table, the window
  nod("figure-tenant-2", 8.3);
  walk("figure-agent", DIN_A, toKitchen(KIT_A), 8.6, 0.8, Math.PI * 0.6);
  walk("figure-tenant-1", DIN_T1, toKitchen(KIT_T1), 8.75, 0.9, Math.PI);
  walk("figure-tenant-2", DIN_T2, toKitchen(KIT_T2), 8.9, 0.95, Math.PI);
  lampsOn(["light-family"], 9.0, 0.6);
  lampsOn(["light-kitchen"], 9.5, 0.6);
  point("figure-agent", "r", 9.55, 0.3); // the island
  if (story === "landlord") {
    // Landlord story: the agent goes through to the utility and checks the boiler.
    walk("figure-agent", KIT_A, [[6.7, F, -2.1], [6.7, F, -0.6], UTIL_A], 9.9, 0.45, Math.PI * 0.5);
    point("figure-agent", "r", 10.4, 0.3, -1.0);
  } else {
    nod("figure-tenant-1", 9.9);
    nod("figure-tenant-2", 10.1);
  }

  // ---- Chapter 5 (8–10 → 12): Making it home — upstairs lights as the camera rises; the house closes. -
  cam({ theta: 0.44, height: 24, radius: 50, targetY: 9.5 }, 9.6, 1.0);
  lampsOn(FIRST_LAMPS, 9.9, 0.7, 0.12);
  cam({ theta: 0.46, height: 16, radius: 42, targetY: 6.0 }, 10.6, 1.4);
  // Everyone heads back to the hall while the house closes around them (walls return only where nobody stands).
  const agentAt = story === "landlord" ? UTIL_A : KIT_A;
  walk("figure-agent", agentAt, backToHall(agentAt, HALL_A), story === "landlord" ? 11.0 : 10.5, 0.9, 0);
  walk("figure-tenant-1", KIT_T1, backToHall(KIT_T1, [-1.5, F, 4.9]), 10.6, 0.9, 0);
  walk("figure-tenant-2", KIT_T2, backToHall(KIT_T2, HALL_T2), 10.7, 0.95, 0);
  rightIn(10.6, 1.2);
  facadeIn(10.7, 1.2);
  floorsTogether(11.0, 1.3);
  roofDown(11.3, 1.3);
  windowsGlow(11.5, 1.0, 0.45);

  // ---- Chapter 6 (10–12) and close (12–14): goodbye at the door, the agent leaves, board down, tile, dusk. -
  walk("figure-agent", HALL_A, [[PX, F, 5.4], [PX, S, 6.3], [PX, PATH_Y, 7.9]], 12.05, 0.4, Math.PI);
  walk("figure-tenant-1", [-1.5, F, 4.9], [[PX, F, 5.5], [PX, S, 6.4]], 12.25, 0.3, 0);
  handshake("figure-agent", "figure-tenant-1", 12.6);
  walk("figure-agent", [PX, PATH_Y, 7.9], [[PX, 0, PZ], [-16, 0, PZ]], 13.45, 0.55);
  wave("figure-tenant-1", 13.2);
  nod("figure-tenant-2", 13.4);
  boardDown(13.0, 0.7);
  tileRepair(12.4);
  dusk(12.3, 1.6);
  lampsOn(GROUND_LAMPS, 12.3, 0.8, 0.1);

  // ---- Close: settle back to the home framing at dusk. ------------------------------------------
  cam({ ...ORBIT_HOME }, 12.05, 1.9);
  tl.set({}, {}, TIMELINE_UNITS);
  return tl;
}

/** Reset lights, materials, door, people, board and camera to the daylight start state (call before rebuilding a timeline). */
export function resetRig(rig: HouseRig): void {
  resetHouse(rig.model);
  const P = rig.model.parts;
  rig.key.intensity = 2.3;
  rig.key.color.set("#fff5e6");
  rig.hemi.intensity = 1.0;
  rig.model.materials.glass.emissiveIntensity = 0;
  for (const m of Object.values(bulbs(rig.model))) m.emissiveIntensity = 0;
  // Story start: nobody there yet, board down (the model's home state is the presentation state).
  P["let-board"]?.scale.set(1, 0.001, 1);
  P["figure-agent"]?.position.set(...OFF_LEFT);
  P["figure-tenant-1"]?.position.set(...OFF_RIGHT_1);
  P["figure-tenant-2"]?.position.set(...OFF_RIGHT_2);
  for (const name of ["figure-agent", "figure-tenant-1", "figure-tenant-2"]) {
    const f = P[name];
    if (!f) continue;
    f.rotation.set(0, 0, 0);
    f.traverse((o) => {
      if (/-arm-[lr]$|-head$/.test(o.name)) o.rotation.set(0, 0, 0);
    });
  }
  Object.assign(rig.orbit, ORBIT_HOME);
  applyCamera(rig);
}
