"use client";

import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

import { CAMERA_HOME, CAMERA_TARGET, applyExploded, createHouseTimeline, resetRig, type HouseRig } from "@/lib/house/animation";
import { buildHouse, type HouseModel } from "@/lib/house/build-house";
import type { StoryKey } from "@/lib/house/story";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export interface HouseSceneProps {
  story: StoryKey;
  /** The chapter section that drives scroll progress (ScrollTrigger, no pinning). */
  trigger: HTMLElement | null;
  /** Called once after the first successfully rendered frame. */
  onFirstFrame?: () => void;
  /** Scroll progress 0–1 across the chapter. */
  onProgress?: (progress: number) => void;
  /** One-way failure signal (context lost); the host swaps to the static stage. */
  onContextLost?: () => void;
  /**
   * Render-harness mode: no ScrollTrigger; the timeline is scrubbed to this
   * progress and the drawing buffer is preserved for screenshots.
   */
  fixedProgress?: number;
}

/** Disposes geometries and materials of a built model. */
function disposeModel(model: HouseModel) {
  model.group.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.geometry.dispose();
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) mat.dispose();
    }
  });
}

function HouseRigView({ story, trigger, onFirstFrame, onProgress, fixedProgress }: HouseSceneProps) {
  const model = React.useMemo(() => buildHouse(), []);
  const keyRef = React.useRef<THREE.DirectionalLight>(null);
  const hemiRef = React.useRef<THREE.HemisphereLight>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const firedRef = React.useRef(false);

  React.useEffect(() => () => disposeModel(model), [model]);

  useFrame(() => {
    if (!firedRef.current) {
      firedRef.current = true;
      onFirstFrame?.();
    }
  });

  useGSAP(
    () => {
      const key = keyRef.current;
      const hemi = hemiRef.current;
      if (!key || !hemi) return;
      const rig: HouseRig = { model, key, hemi, camera };
      camera.position.set(...CAMERA_HOME);
      camera.lookAt(...CAMERA_TARGET);
      resetRig(rig);
      applyExploded(model);
      const tl = createHouseTimeline(rig, story, () => {
        camera.lookAt(...CAMERA_TARGET);
        invalidate();
      });

      if (typeof fixedProgress === "number") {
        tl.progress(fixedProgress);
        camera.lookAt(...CAMERA_TARGET);
        invalidate();
        return;
      }
      if (!trigger) {
        // Nothing to scroll against yet — show the complete house.
        tl.progress(1);
        invalidate();
        return;
      }
      ScrollTrigger.create({
        trigger,
        start: "top 62%",
        end: "bottom 38%",
        scrub: 0.6,
        animation: tl,
        onUpdate: (self) => onProgress?.(self.progress),
        invalidateOnRefresh: true,
      });
      invalidate();
    },
    { dependencies: [story, trigger, fixedProgress], revertOnUpdate: true },
  );

  return (
    <>
      <hemisphereLight ref={hemiRef} args={["#f7f2ea", "#c9b8a4", 1.0]} />
      <directionalLight ref={keyRef} position={[7, 11, 6]} intensity={2.3} color="#fff5e6" />
      <primitive object={model.group} />
    </>
  );
}

/**
 * The 3D house canvas. Decorative: aria-hidden, no pointer capture, no
 * controls, demand-rendered (draws only when the timeline moves), DPR capped
 * at 1.5, no shadows, no environment map, no post-processing.
 */
export function HouseScene(props: HouseSceneProps) {
  const { onContextLost, fixedProgress } = props;
  return (
    <Canvas
      aria-hidden="true"
      className="pointer-events-none"
      style={{ pointerEvents: "none" }}
      frameloop="demand"
      dpr={[1, 1.5]}
      flat
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
        preserveDrawingBuffer: typeof fixedProgress === "number",
        failIfMajorPerformanceCaveat: false,
      }}
      camera={{ position: CAMERA_HOME, fov: 34, near: 0.5, far: 90 }}
      onCreated={({ gl, camera }) => {
        camera.lookAt(...CAMERA_TARGET);
        gl.domElement.setAttribute("tabindex", "-1");
        gl.domElement.addEventListener(
          "webglcontextlost",
          (event) => {
            event.preventDefault();
            onContextLost?.();
          },
          { once: true },
        );
      }}
    >
      <HouseRigView {...props} />
    </Canvas>
  );
}

export default HouseScene;
