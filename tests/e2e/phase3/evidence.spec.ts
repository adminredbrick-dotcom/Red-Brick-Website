import { promises as fs } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { trackTransfers } from "./helpers";

/**
 * Phase 3 evidence pack: the homepage at the five required widths with zero
 * horizontal overflow and zero console errors, plus reduced-motion transfer
 * measurements. Output: docs/evidence/phase-3/.
 */
const EVIDENCE_DIR = path.join(__dirname, "..", "..", "..", "docs", "evidence", "phase-3");

const BREAKPOINTS = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

for (const { width, height } of BREAKPOINTS) {
  test(`homepage at ${width}px: no horizontal overflow, no console errors, capture`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setViewportSize({ width, height });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Scroll to the bottom and back so lazy content is exercised.
    await page.evaluate(async () => {
      const total = document.documentElement.scrollHeight;
      for (let y = 0; y < total; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    const overflow = await page.evaluate(() => {
      const el = document.scrollingElement;
      return el ? el.scrollWidth - el.clientWidth : 0;
    });
    expect(overflow, `homepage overflows horizontally at ${width}px`).toBeLessThanOrEqual(0);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, `home-${width}.png`), fullPage: true });
    expect(errors).toEqual([]);
  });
}

test("reduced-motion transfer measurement (static-fallback visitor)", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const totals = trackTransfers(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
  });
  await page.waitForTimeout(800);
  await fs.mkdir(EVIDENCE_DIR, { recursive: true });
  await fs.writeFile(
    path.join(EVIDENCE_DIR, "transfer-sizes-reduced-motion-1440.json"),
    JSON.stringify({ measuredOn: new Date().toISOString(), viewport: "1440x900 reduced motion (static)", ...totals, urls: undefined }, null, 2),
  );
  expect(totals.video).toBe(0);
  expect(totals.models).toBe(0);
  await context.close();
});
