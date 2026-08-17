/**
 * Exports the programmatic Red Brick house to a binary glTF:
 *   node scripts/house/export-glb.mjs   -> public/models/red-brick-house.glb (+ manifest JSON)
 *
 * The generator (src/lib/house/build-house.ts) is the model source; this
 * script writes the same scene as an interchange asset (uncompressed GLB —
 * no Draco/meshopt encoder is installed; size is reported, not assumed).
 * Uses Node's built-in TypeScript type stripping (Node ≥ 22.6).
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Minimal FileReader polyfill for GLTFExporter's binary path in Node.
if (typeof globalThis.FileReader === "undefined") {
  globalThis.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        this.onloadend?.({ target: this });
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = `data:${blob.type};base64,${Buffer.from(buf).toString("base64")}`;
        this.onloadend?.({ target: this });
      });
    }
  };
}

const { buildHouse, HOUSE_MODEL_VERSION } = await import("../../src/lib/house/build-house.ts");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const OUT_DIR = path.join(ROOT, "public", "models");
const OUT = path.join(OUT_DIR, "red-brick-house.glb");

const model = buildHouse();
const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(model.group, { binary: true, onlyVisible: true, truncateDrawRange: true });
await fs.mkdir(OUT_DIR, { recursive: true });
await fs.writeFile(OUT, Buffer.from(glb));

let meshes = 0;
let drawCalls = 0;
model.group.traverse((o) => {
  if (o.isMesh) {
    meshes += 1;
    drawCalls += 1; // one draw call per mesh (instanced stairs = 1)
  }
});
const stat = await fs.stat(OUT);
const manifest = {
  file: "public/models/red-brick-house.glb",
  modelVersion: HOUSE_MODEL_VERSION,
  generatedOn: new Date().toISOString().slice(0, 10),
  bytes: stat.size,
  kilobytes: Math.round(stat.size / 1024),
  meshes,
  drawCallsApprox: drawCalls,
  triangles: model.triangles,
  namedParts: model.partNames.length,
  parts: model.partNames,
  textures: 0,
  compression: "none (no Draco/meshopt encoder available on the build machine)",
};
await fs.writeFile(path.join(OUT_DIR, "red-brick-house.manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`GLB written: ${OUT} (${manifest.kilobytes} KB, ${meshes} meshes, ~${model.triangles} triangles, ${model.partNames.length} named parts)`);
