/**
 * House chapter choreography — one paused GSAP timeline per story, driven
 * by scroll progress (0–1) from the scene, or scrubbed directly by the
 * static-render harness. Pure GSAP + Three.js: no React, no ScrollTrigger
 * here (the scene owns the trigger), so the same code renders identically
 * in the browser and in the render script.
 *
 * Duration is normalised to 10 units: chapters 1–4 occupy 0–8 (2 units
 * each) and the close occupies 8–10, matching `chapterIndexFor()`.
 */
import gsap from "gsap";
import * as THREE from "three";

import { HOUSE_PART_GROUPS, resetHouse, type HomeTransform, type HouseModel } from "./build-house";
import type { StoryKey } from "./story";

export interface HouseRig {
  model: HouseModel;
  key: THREE.DirectionalLight;
  hemi: THREE.HemisphereLight;
  camera: THREE.PerspectiveCamera;
}

export const CAMERA_HOME: [number, number, number] = [16.5, 10.2, 21.2];
export const CAMERA_TARGET: [number, number, number] = [0, 3.6, 0];

type Vec3 = [number, number, number];

/** Exploded-entry offsets by part name (added to the assembled transform). Calm, never "broken". */
function explodeOffset(name: string): { position: Vec3; rotation: Vec3 } {
  const g = HOUSE_PART_GROUPS;
  const inList = (list: readonly string[]) => list.includes(name);
  if (name === "ground" || name === "path") return { position: [0, 0, 0], rotation: [0, 0, 0] };
  if (name === "foundation") return { position: [0, -0.5, 0], rotation: [0, 0, 0] };
  if (name === "wall-front") return { position: [0, 0.4, 2.8], rotation: [0, 0, 0] };
  if (name === "wall-rear") return { position: [0, 0.4, -2.8], rotation: [0, 0, 0] };
  if (name === "wall-left" || name === "gable-left") return { position: [-2.4, 0.3, 0], rotation: [0, 0, 0] };
  if (name === "wall-right" || name === "gable-right") return { position: [2.4, 0.3, 0], rotation: [0, 0, 0] };
  if (name === "roof-front") return { position: [0, 3.4, 1.2], rotation: [0.06, 0, 0] };
  if (name === "roof-rear") return { position: [0, 3.4, -1.2], rotation: [-0.06, 0, 0] };
  if (name === "ridge") return { position: [0, 3.9, 0], rotation: [0, 0, 0] };
  if (name.startsWith("chimney")) return { position: [1.0, 4.0, 0], rotation: [0, 0, 0] };
  if (name === "roof-tile-loose") return { position: [0, 3.8, 1.4], rotation: [0, 0, 0] };
  if (name === "window-rear-1" || name === "window-rear-2") return { position: [0, 0.6, -5.2], rotation: [0, 0, 0] };
  if (name === "window-side") return { position: [4.4, 0.6, 0], rotation: [0, 0, 0] };
  if (inList(g.openings)) return { position: [0, 0.6, 4.2], rotation: [0, 0, 0] };
  if (name === "gutter-front") return { position: [0, 1.6, 1.4], rotation: [0, 0, 0] };
  if (name === "gutter-rear") return { position: [0, 1.6, -1.4], rotation: [0, 0, 0] };
  if (name === "downpipe") return { position: [2.4, 0.5, 1.2], rotation: [0, 0, 0] };
  if (name === "floor-ground") return { position: [-4.4, 0, 0], rotation: [0, 0, 0] };
  if (name === "floor-first") return { position: [0, 2.6, 0], rotation: [0, 0, 0] };
  if (name === "partition-hall") return { position: [3.4, 0, 0], rotation: [0, 0, 0] };
  if (name === "stairs") return { position: [0, 0, -4.4], rotation: [0, 0, 0] };
  if (name.startsWith("partition-first")) return { position: [0, 2.8, 0], rotation: [0, 0, 0] };
  if (inList(g.living)) return { position: [-5.2, 0.2, 0.6], rotation: [0, 0, 0] };
  if (inList(g.kitchen)) return { position: [-5.2, 0.2, -2.4], rotation: [0, 0, 0] };
  if (inList(g.bedroom)) return { position: [-3.4, 3.4, 0.6], rotation: [0, 0, 0] };
  if (inList(g.bathroom)) return { position: [3.4, 3.4, -1.2], rotation: [0, 0, 0] };
  if (inList(g.hall)) return { position: [0, 3.2, 0], rotation: [0, 0, 0] };
  return { position: [0, 0.8, 0], rotation: [0, 0, 0] };
}

function home(o: THREE.Object3D): HomeTransform {
  return o.userData.home as HomeTransform;
}

/** Put every part in its exploded position. */
export function applyExploded(model: HouseModel): void {
  resetHouse(model);
  for (const name of model.partNames) {
    const o = model.parts[name]!;
    const h = home(o);
    const e = explodeOffset(name);
    o.position.set(h.position[0] + e.position[0], h.position[1] + e.position[1], h.position[2] + e.position[2]);
    o.rotation.set(h.rotation[0] + e.rotation[0], h.rotation[1] + e.rotation[1], h.rotation[2] + e.rotation[2]);
  }
}

/** Collect the bulb materials so lights can come on room by room. */
function bulbMaterials(model: HouseModel): THREE.MeshStandardMaterial[] {
  const out: THREE.MeshStandardMaterial[] = [];
  model.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh && /-bulb$/.test(m.name)) out.push(m.material as THREE.MeshStandardMaterial);
  });
  return out;
}

const EASE = "power2.inOut";

/**
 * Build the paused timeline for a story. Call `applyExploded()` first (the
 * timeline records start values from the current state).
 */
export function createHouseTimeline(rig: HouseRig, story: StoryKey, onUpdate?: () => void): gsap.core.Timeline {
  const { model, key, hemi, camera } = rig;
  const P = model.parts;
  const g = HOUSE_PART_GROUPS;
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE }, onUpdate });

  /** Tween a list of parts to their assembled transform over [at, at+dur] with a stagger. */
  const settle = (names: readonly string[], at: number, dur = 1.2, stagger = 0.06) => {
    names.forEach((name, i) => {
      const o = P[name];
      if (!o) return;
      const h = home(o);
      tl.to(o.position, { x: h.position[0], y: h.position[1], z: h.position[2], duration: dur }, at + i * stagger);
      tl.to(o.rotation, { x: h.rotation[0], y: h.rotation[1], z: h.rotation[2], duration: dur }, at + i * stagger);
    });
  };
  /** Move parts away from home by an offset (used for the tenant cutaway) and back later. */
  const move = (names: readonly string[], offset: Vec3, at: number, dur = 1.2) => {
    names.forEach((name, i) => {
      const o = P[name];
      if (!o) return;
      const h = home(o);
      tl.to(o.position, { x: h.position[0] + offset[0], y: h.position[1] + offset[1], z: h.position[2] + offset[2], duration: dur }, at + i * 0.04);
    });
  };
  const bulbs = bulbMaterials(model);
  const lightsOn = (at: number, dur = 0.8) => {
    bulbs.forEach((m, i) => tl.to(m, { emissiveIntensity: 1.6, duration: dur }, at + i * 0.15));
  };
  const dusk = (at: number, dur = 1.6) => {
    tl.to(key, { intensity: 1.15, duration: dur }, at);
    tl.to(key.color, { r: 1, g: 0.72, b: 0.5, duration: dur }, at);
    tl.to(hemi, { intensity: 0.55, duration: dur }, at);
    tl.to(model.materials.glass, { emissiveIntensity: 0.85, duration: dur }, at);
  };
  const tileRepair = (at: number) => {
    const tile = P["roof-tile-loose"];
    if (!tile) return;
    const h = home(tile);
    tl.to(tile.position, { y: h.position[1] + 0.45, z: h.position[2] + 0.25, duration: 0.5 }, at);
    tl.to(tile.rotation, { z: 0.35, duration: 0.5 }, at);
    tl.to(tile.position, { y: h.position[1], z: h.position[2], duration: 0.6 }, at + 0.7);
    tl.to(tile.rotation, { z: h.rotation[2], duration: 0.6 }, at + 0.7);
  };
  const pulse = (name: string, at: number) => {
    const o = P[name];
    if (!o) return;
    tl.to(o.scale, { x: 1.12, y: 1.12, z: 1.12, duration: 0.35, yoyo: true, repeat: 1 }, at);
  };
  const doorOpen = (at: number, dur = 0.9) => {
    const door = P["door"];
    if (!door) return;
    const h = home(door);
    // Approximate a hinge on the left edge: rotate and shift so the leaf swings outward.
    tl.to(door.rotation, { y: -1.15, duration: dur }, at);
    tl.to(door.position, { x: h.position[0] - 0.3, z: h.position[2] + 0.42, duration: dur }, at);
  };
  const doorClose = (at: number, dur = 0.9) => {
    const door = P["door"];
    if (!door) return;
    const h = home(door);
    tl.to(door.rotation, { y: h.rotation[1], duration: dur }, at);
    tl.to(door.position, { x: h.position[0], z: h.position[2], duration: dur }, at);
  };
  const dolly = (at: number, to: Vec3, dur = 2) => {
    tl.to(camera.position, { x: to[0], y: to[1], z: to[2], duration: dur, ease: "power1.inOut" }, at);
  };

  const exterior = [...g.ground, ...g.structure, ...g.roof, ...g.openings, ...g.trim];
  const interiorStructure = [...g.floors, ...g.partitions];
  const rooms = [...g.living, ...g.kitchen, ...g.bedroom, ...g.bathroom, ...g.hall];
  const frontCutaway = ["wall-front", "bay-window", "bay-roof", "window-ff-left", "window-ff-right", "door", "door-frame", "fanlight", "gutter-front", "downpipe"];
  const roofCutaway = [...g.roof, "roof-tile-loose"];

  if (story === "landlord") {
    // 1 Preparing the property — foundation, walls, floors settle.
    settle([...g.ground, ...g.structure, ...g.floors], 0, 1.4, 0.08);
    // 2 Finding a tenant — roof, doors, windows, trim: the exterior becomes presentable.
    settle([...g.roof, "roof-tile-loose", ...g.openings, ...g.trim], 2, 1.3, 0.05);
    // 3 Managing the tenancy — partitions, stairs and rooms align; lights come on.
    settle([...g.partitions, ...rooms], 4, 1.2, 0.05);
    lightsOn(5.3);
    // 4 Continuing property care — a tile is lifted, repaired and returned; boiler and radiator checked; dusk falls.
    tileRepair(6.1);
    pulse("boiler", 6.6);
    pulse("radiator-living", 6.9);
    dusk(7.0);
    // Close — settle, pull back slightly.
    dolly(8, [17.6, 10.9, 22.6]);
  } else if (story === "tenant") {
    // 1 Finding a suitable home — the exterior resolves.
    settle(exterior, 0, 1.4, 0.03);
    settle(["roof-tile-loose"], 0.4, 1.0);
    // 2 Understanding the move — cutaway: roof lifts, front wall slides away, interior settles.
    move(roofCutaway, [0, 3.2, 0.6], 2, 1.1);
    move(frontCutaway, [0, -0.2, 4.4], 2.1, 1.1);
    settle([...interiorStructure], 2.6, 1.0, 0.05);
    // 3 Living in the property — rooms settle, lights come on room by room.
    settle(rooms, 4, 1.1, 0.05);
    lightsOn(5.0, 0.7);
    // 4 Getting maintenance help — the care details are checked; the house closes up; dusk.
    pulse("radiator-bedroom", 6.0);
    pulse("boiler", 6.3);
    pulse("smoke-alarm", 6.6);
    settle(frontCutaway, 6.4, 1.1, 0.03);
    settle(roofCutaway, 6.7, 1.1, 0.03);
    dusk(7.2);
    dolly(8, [17.6, 10.9, 22.6]);
  } else {
    // Neutral: Property → People → Communication → Care.
    settle(exterior, 0, 1.4, 0.03);
    settle(["roof-tile-loose"], 0.4, 1.0);
    doorOpen(2.2);
    settle(interiorStructure, 2.3, 1.1, 0.06);
    settle(g.hall, 2.8, 0.8);
    settle(rooms.filter((n) => !g.hall.includes(n as never)), 4, 1.1, 0.05);
    lightsOn(5.0, 0.7);
    doorClose(5.6);
    tileRepair(6.1);
    pulse("boiler", 6.7);
    dusk(7.0);
    dolly(8, [17.6, 10.9, 22.6]);
  }

  // Ensure the timeline spans exactly 10 units so progress maps to chapters.
  tl.set({}, {}, 10);
  return tl;
}

/** Reset lights, materials and camera to the daylight home state (call before rebuilding a timeline). */
export function resetRig(rig: HouseRig): void {
  rig.key.intensity = 2.3;
  rig.key.color.set("#fff5e6");
  rig.hemi.intensity = 1.0;
  rig.model.materials.glass.emissiveIntensity = 0;
  for (const m of bulbMaterials(rig.model)) m.emissiveIntensity = 0;
  rig.camera.position.set(...CAMERA_HOME);
  rig.camera.lookAt(...CAMERA_TARGET);
  for (const name of rig.model.partNames) rig.model.parts[name]!.scale.set(1, 1, 1);
}
