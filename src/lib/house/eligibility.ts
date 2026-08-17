/**
 * Decides whether this visitor's device should download and run the 3D
 * chapter at all. Anyone who fails a check gets the static chapter sequence
 * and never fetches R3F, GSAP or the model. Client-only.
 */
export interface Eligibility {
  eligible: boolean;
  reason:
    | "ok"
    | "server"
    | "reduced-motion"
    | "save-data"
    | "small-viewport"
    | "no-webgl2"
    | "low-power"
    | "forced-static";
}

interface NavigatorExtras extends Navigator {
  connection?: { saveData?: boolean; effectiveType?: string };
  deviceMemory?: number;
}

export const DESKTOP_QUERY = "(min-width: 64rem)";
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function webgl2Available(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: false });
    if (!gl) return false;
    const lose = gl.getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function houseEligibility(): Eligibility {
  if (typeof window === "undefined") return { eligible: false, reason: "server" };
  // Test/debug override: ?static=1 or a data attribute never ships to visitors as tracking — it is read only, never written.
  if (document.documentElement.dataset.forceStaticHouse === "true") return { eligible: false, reason: "forced-static" };
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return { eligible: false, reason: "reduced-motion" };
  const nav = navigator as NavigatorExtras;
  if (nav.connection?.saveData) return { eligible: false, reason: "save-data" };
  if (!window.matchMedia(DESKTOP_QUERY).matches) return { eligible: false, reason: "small-viewport" };
  if ((nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4) return { eligible: false, reason: "low-power" };
  if (!webgl2Available()) return { eligible: false, reason: "no-webgl2" };
  return { eligible: true, reason: "ok" };
}
