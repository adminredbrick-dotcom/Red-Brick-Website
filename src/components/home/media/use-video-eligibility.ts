"use client";

import * as React from "react";

import { DESKTOP_QUERY, REDUCED_MOTION_QUERY } from "@/lib/house/eligibility";

interface NavigatorExtras extends Navigator {
  connection?: { saveData?: boolean };
}

/**
 * Should this visitor receive a playing video at all? False on the server,
 * under reduced motion, under Save-Data and below the desktop breakpoint —
 * those visitors keep the poster. Re-evaluates on viewport/motion changes.
 */
export function useVideoEligibility(): boolean {
  const [eligible, setEligible] = React.useState(false);
  React.useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    const compute = () => {
      const saveData = Boolean((navigator as NavigatorExtras).connection?.saveData);
      setEligible(desktop.matches && !reduced.matches && !saveData);
    };
    compute();
    desktop.addEventListener("change", compute);
    reduced.addEventListener("change", compute);
    return () => {
      desktop.removeEventListener("change", compute);
      reduced.removeEventListener("change", compute);
    };
  }, []);
  return eligible;
}
