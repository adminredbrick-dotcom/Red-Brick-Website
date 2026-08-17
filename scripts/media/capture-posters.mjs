/**
 * Media tooling for the homepage (no encoder is installed on this machine, so
 * derivatives are limited to poster stills; see docs/MEDIA-ASSET-REGISTER.md).
 *
 *   node scripts/media/capture-posters.mjs sheet     -> contact sheet of every master (identification, scratch only)
 *   node scripts/media/capture-posters.mjs posters   -> WebP posters per scripts/media/poster-plan.json into public/media/posters
 *   node scripts/media/capture-posters.mjs hashes    -> SHA-256 + metadata of every master into scripts/media/masters-manifest.json
 *
 * Uses the installed Google Chrome (channel "chrome") through Playwright because
 * the bundled Chromium cannot decode H.264. Masters are read in place from the
 * source folder over a local Range-capable HTTP server; nothing is written to
 * or moved from that folder, and no master is ever copied into public/.
 */
import { createHash } from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const SOURCE_DIR = process.env.RB_MEDIA_SOURCE ?? "C:\\Users\\moeen\\Downloads";
const OUT_POSTERS = path.join(ROOT, "public", "media", "posters");
const SCRATCH = path.join(ROOT, "scripts", "media", "scratch");
const PLAN = JSON.parse(await fs.readFile(path.join(__dirname, "poster-plan.json"), "utf8"));
const PORT = 3199;

const mode = process.argv[2] ?? "posters";

function contentType(file) {
  return file.endsWith(".mp4") ? "video/mp4" : "application/octet-stream";
}

/** Minimal static server with Range support so <video> can seek. */
function serve(dir) {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const name = decodeURIComponent((req.url ?? "/").slice(1).split("?")[0]);
      if (name === "__page") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end("<!doctype html><html><body style='margin:0;background:#000'></body></html>");
      }
      const file = path.join(dir, name);
      if (!name || name.includes("..")) return res.writeHead(400).end();
      let stat;
      try {
        stat = await fs.stat(file);
      } catch {
        return res.writeHead(404).end();
      }
      const range = req.headers.range;
      if (range) {
        const m = /bytes=(\d*)-(\d*)/.exec(range);
        const start = m && m[1] ? Number(m[1]) : 0;
        const end = m && m[2] ? Number(m[2]) : stat.size - 1;
        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": end - start + 1,
          "Content-Type": contentType(file),
        });
        createReadStream(file, { start, end }).pipe(res);
      } else {
        res.writeHead(200, { "Content-Length": stat.size, "Content-Type": contentType(file), "Accept-Ranges": "bytes" });
        createReadStream(file).pipe(res);
      }
    });
    server.listen(PORT, "127.0.0.1", () => resolve(server));
  });
}

async function withPage(fn) {
  const server = await serve(SOURCE_DIR);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await page.goto(`http://127.0.0.1:${PORT}/__page`);
  try {
    return await fn(page);
  } finally {
    await browser.close();
    server.close();
  }
}

/** Seek a master to `time` seconds and return a frame as base64 (webp/jpeg) at `width` px, optional crop aspect. */
async function grabFrame(page, file, time, { width = 1600, type = "image/webp", quality = 0.8, aspect = null } = {}) {
  return page.evaluate(
    async ({ src, time, width, type, quality, aspect }) => {
      const video = document.createElement("video");
      video.muted = true;
      video.preload = "auto";
      video.src = src;
      await new Promise((ok, err) => {
        video.addEventListener("loadedmetadata", ok, { once: true });
        video.addEventListener("error", () => err(new Error("video error " + src)), { once: true });
      });
      for (let i = 0; i < 60 && !Number.isFinite(video.duration); i++) {
        await new Promise((r) => setTimeout(r, 50));
      }
      if (!Number.isFinite(video.duration)) throw new Error("no finite duration for " + src);
      const t = Math.min(Math.max(time < 0 ? video.duration + time : time, 0), Math.max(video.duration - 0.05, 0));
      await new Promise((ok) => {
        video.addEventListener("seeked", ok, { once: true });
        video.currentTime = t;
      });
      // Let the decoder present the frame.
      await new Promise((r) => setTimeout(r, 120));
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      let sx = 0, sy = 0, sw = vw, sh = vh;
      if (aspect) {
        const target = aspect;
        if (vw / vh > target) { sw = Math.round(vh * target); sx = Math.round((vw - sw) / 2); }
        else { sh = Math.round(vw / target); sy = Math.round((vh - sh) / 2); }
      }
      const w = Math.min(width, sw);
      const h = Math.round((w * sh) / sw);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, w, h);
      const blob = await new Promise((r) => canvas.toBlob(r, type, quality));
      const buf = new Uint8Array(await blob.arrayBuffer());
      let bin = "";
      for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      const duration = video.duration;
      video.removeAttribute("src");
      video.load();
      return { b64: btoa(bin), duration, vw, vh, w, h, t };
    },
    { src: `http://127.0.0.1:${PORT}/${encodeURIComponent(file)}`, time, width, type, quality, aspect },
  );
}

if (mode === "sheet") {
  await fs.mkdir(SCRATCH, { recursive: true });
  const files = PLAN.masters.map((m) => m.file);
  await withPage(async (page) => {
    const tiles = [];
    for (const file of files) {
      for (const frac of [0.1, 0.5, 0.9]) {
        const meta = await grabFrame(page, file, 0, { width: 8, type: "image/jpeg" });
        const f = await grabFrame(page, file, meta.duration * frac, { width: 400, type: "image/jpeg", quality: 0.7 });
        tiles.push({ file, frac, b64: f.b64, w: f.w, h: f.h, duration: meta.duration, vw: meta.vw, vh: meta.vh });
      }
    }
    // Compose the sheet in the page.
    const sheet = await page.evaluate(async (tiles) => {
      const cols = 3, tw = 400, th = 240, label = 22;
      const rows = tiles.length / cols;
      const canvas = document.createElement("canvas");
      canvas.width = cols * tw;
      canvas.height = rows * (th + label);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < tiles.length; i++) {
        const t = tiles[i];
        const img = new Image();
        img.src = "data:image/jpeg;base64," + t.b64;
        await img.decode();
        const x = (i % cols) * tw, y = Math.floor(i / cols) * (th + label);
        const scale = Math.min(tw / img.width, th / img.height);
        ctx.drawImage(img, x + (tw - img.width * scale) / 2, y + (th - img.height * scale) / 2, img.width * scale, img.height * scale);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px Arial";
        ctx.fillText(`${t.file} @${Math.round(t.frac * 100)}% ${t.vw}x${t.vh} ${t.duration.toFixed(1)}s`, x + 6, y + th + 16);
      }
      return canvas.toDataURL("image/jpeg", 0.75).split(",")[1];
    }, tiles);
    const out = path.join(SCRATCH, "contact-sheet.jpg");
    await fs.writeFile(out, Buffer.from(sheet, "base64"));
    console.log("wrote", out);
    for (const t of tiles.filter((x) => x.frac === 0.5)) console.log(t.file, `${t.vw}x${t.vh}`, `${t.duration.toFixed(2)}s`);
  });
} else if (mode === "posters") {
  await fs.mkdir(OUT_POSTERS, { recursive: true });
  const results = [];
  await withPage(async (page) => {
    for (const p of PLAN.posters) {
      let quality = p.quality ?? 0.82;
      let frame;
      // Step quality down until the poster meets its size budget.
      for (let i = 0; i < 6; i++) {
        frame = await grabFrame(page, p.file, p.time, { width: p.width ?? 1600, type: "image/webp", quality, aspect: p.aspect ?? null });
        const bytes = Buffer.from(frame.b64, "base64").length;
        if (bytes <= (p.maxBytes ?? 120_000)) break;
        quality -= 0.08;
      }
      const buf = Buffer.from(frame.b64, "base64");
      const out = path.join(OUT_POSTERS, p.output);
      await fs.writeFile(out, buf);
      results.push({ output: p.output, source: p.file, time: frame.t, width: frame.w, height: frame.h, bytes: buf.length, quality: Number(quality.toFixed(2)) });
      console.log(p.output, `${frame.w}x${frame.h}`, `${(buf.length / 1024).toFixed(1)} KB`, `t=${frame.t.toFixed(2)}s q=${quality.toFixed(2)}`);
    }
  });
  await fs.writeFile(path.join(__dirname, "posters-manifest.json"), JSON.stringify({ generatedOn: PLAN.generatedOn, posters: results }, null, 2));
} else if (mode === "hashes") {
  const manifest = [];
  for (const m of PLAN.masters) {
    const file = path.join(SOURCE_DIR, m.file);
    const stat = await fs.stat(file);
    const hash = await new Promise((resolve, reject) => {
      const h = createHash("sha256");
      createReadStream(file).on("data", (d) => h.update(d)).on("end", () => resolve(h.digest("hex"))).on("error", reject);
    });
    manifest.push({ file: m.file, pexelsId: m.pexelsId, bytes: stat.size, sha256: hash });
    console.log(m.file, stat.size, hash);
  }
  await fs.writeFile(path.join(__dirname, "masters-manifest.json"), JSON.stringify({ sourceDir: SOURCE_DIR, generatedOn: PLAN.generatedOn, masters: manifest }, null, 2));
}
