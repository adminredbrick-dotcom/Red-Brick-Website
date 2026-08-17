/**
 * Captures the static chapter renders of the 3D house from the internal
 * harness route (/experiments/house-renders) — one JPEG per story per state:
 *   public/media/house/{neutral|landlord|tenant}-{exploded|chapter-1..4|complete}.jpg
 *
 *   node scripts/house/render-chapters.mjs [baseUrl]   (default http://localhost:3113)
 *
 * Requires a running server (dev or production build) on the base URL. Uses
 * Playwright's bundled Chromium (software WebGL); falls back to the installed
 * Chrome channel if the bundled build cannot create a WebGL2 context.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.join(ROOT, "public", "media", "house");
const BASE = process.argv[2] ?? "http://localhost:3113";
const STORIES = ["neutral", "landlord", "tenant"];
const STATES = { exploded: 0, "chapter-1": 0.2, "chapter-2": 0.4, "chapter-3": 0.6, "chapter-4": 0.8, complete: 1 };
const W = 1200;
const H = 900;

async function launch(channel) {
  return chromium.launch({
    channel,
    headless: true,
    args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
  });
}

await fs.mkdir(OUT, { recursive: true });
let browser = await launch(undefined);
let page = await browser.newPage({ viewport: { width: W + 64, height: H + 64 }, deviceScaleFactor: 1 });
const webgl = await page.evaluate(() => !!document.createElement("canvas").getContext("webgl2"));
if (!webgl) {
  console.log("Bundled Chromium has no WebGL2 — switching to the installed Chrome channel.");
  await browser.close();
  browser = await launch("chrome");
  page = await browser.newPage({ viewport: { width: W + 64, height: H + 64 }, deviceScaleFactor: 1 });
}

const manifest = [];
for (const story of STORIES) {
  for (const [state, progress] of Object.entries(STATES)) {
    const url = `${BASE}/experiments/house-renders?story=${story}&progress=${progress}&w=${W}&h=${H}`;
    await page.goto(url, { waitUntil: "networkidle" });
    const stage = page.locator("[data-house-render]");
    await stage.waitFor({ state: "visible", timeout: 60_000 });
    await page.waitForFunction(() => document.querySelector("[data-house-render]")?.getAttribute("data-ready") === "true", null, { timeout: 60_000 });
    // Let the demand renderer present the scrubbed frame.
    await page.waitForTimeout(600);
    const file = path.join(OUT, `${story}-${state}.jpg`);
    await stage.screenshot({ path: file, type: "jpeg", quality: 82 });
    const bytes = (await fs.stat(file)).size;
    manifest.push({ story, state, progress, file: path.relative(ROOT, file).split(path.sep).join("/"), bytes });
    console.log(`${story}-${state}.jpg ${(bytes / 1024).toFixed(0)} KB`);
  }
}
await browser.close();
await fs.writeFile(path.join(OUT, "manifest.json"), JSON.stringify({ generatedOn: new Date().toISOString().slice(0, 10), width: W, height: H, renders: manifest }, null, 2));
console.log(`done: ${manifest.length} renders, ${(manifest.reduce((a, r) => a + r.bytes, 0) / 1024).toFixed(0)} KB total`);
