// Evidence capture for candidate 03. Run from the candidate worktree with the
// production server already listening on the port given as argv[2] (default 3111).
//   node <this file> 3111
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const port = process.argv[2] ?? "3111";
const base = `http://localhost:${port}`;
const route = "/experiments/candidate-03";
const outDir = path.resolve("docs/evidence/landing-experiments/candidate-03");
mkdirSync(outDir, { recursive: true });

const viewports = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const browser = await chromium.launch();
const results = [];

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: vp, reducedMotion: "no-preference" });
  const page = await context.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + route, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(() => {
    const el = document.scrollingElement;
    return el ? el.scrollWidth - el.clientWidth : 0;
  });
  await page.screenshot({
    path: path.join(outDir, `candidate-03-${vp.width}x${vp.height}.png`),
    fullPage: true,
  });
  // Above-the-fold capture too (what a visitor sees first).
  await page.screenshot({
    path: path.join(outDir, `candidate-03-${vp.width}x${vp.height}-fold.png`),
    fullPage: false,
  });
  results.push({ ...vp, overflow, errors });
  await context.close();
}

// Reduced motion at 1440×900 (full page + fold + journey mid-scroll).
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });
  const running = await page.evaluate(
    () => document.getAnimations().filter((a) => a.playState === "running").length,
  );
  await page.screenshot({
    path: path.join(outDir, "candidate-03-1440x900-reduced-motion.png"),
    fullPage: true,
  });
  await page.locator("#c3-journey").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(outDir, "candidate-03-1440x900-reduced-motion-journey.png"),
    fullPage: false,
  });
  results.push({ reducedMotion: true, runningAnimations: running });
  await context.close();
}

// Journey mid-scroll states with motion enabled (desktop and phone).
for (const vp of [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport: vp, reducedMotion: "no-preference" });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });
  const section = page.locator("#c3-journey").locator("xpath=ancestor::section");
  const box = await section.boundingBox();
  const docY = await page.evaluate(() => window.scrollY);
  const top = (box?.y ?? 0) + docY;
  const height = box?.height ?? 0;
  for (const [name, frac] of [
    ["start", 0.05],
    ["middle", 0.5],
    ["end", 0.9],
  ]) {
    await page.evaluate((y) => window.scrollTo(0, y), top + (height - vp.height) * frac);
    await page.waitForTimeout(250);
    await page.screenshot({
      path: path.join(outDir, `candidate-03-${vp.width}-journey-${name}.png`),
      fullPage: false,
    });
  }
  await context.close();
}

// Keyboard walk: record the tab order through main.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });
  const walk = [];
  for (let i = 0; i < 80; i += 1) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      const outline = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
      return {
        tag: el.tagName.toLowerCase(),
        text: (el.getAttribute("aria-label") || el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 60),
        href: el.getAttribute("href") || "",
        inMain: Boolean(el.closest("main")),
        inFooter: Boolean(el.closest("footer")),
        focusVisible: outline || style.boxShadow !== "none",
      };
    });
    if (!info) break;
    walk.push(info);
    if (info.inFooter) break;
  }
  results.push({ keyboardWalk: walk });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
