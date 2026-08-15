import path from "node:path";

import { expect, test } from "@playwright/test";

/**
 * Captures the Phase 1 evidence pack: screenshots at the required
 * breakpoints plus a reduced-motion capture, and verifies 320px reflow
 * has no horizontal overflow (DoD: Required evidence / Accessibility).
 */

const EVIDENCE_DIR = path.join(__dirname, "..", "..", "docs", "evidence", "phase-1");

const BREAKPOINTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const PAGES = [
  { route: "/", slug: "home" },
  { route: "/properties", slug: "properties" },
  { route: "/landlords", slug: "landlords" },
  { route: "/maintenance", slug: "maintenance" },
  { route: "/contact", slug: "contact" },
];

for (const { width, height } of BREAKPOINTS) {
  for (const { route, slug } of PAGES) {
    test(`capture ${slug} at ${width}px and verify no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // 320px reflow requirement: no horizontal scrolling at any breakpoint.
      const overflow = await page.evaluate(() => {
        const el = document.scrollingElement;
        return el ? el.scrollWidth - el.clientWidth : 0;
      });
      expect(overflow, `${route} overflows horizontally at ${width}px`).toBeLessThanOrEqual(0);

      await page.screenshot({
        path: path.join(EVIDENCE_DIR, `${slug}-${width}.png`),
        fullPage: true,
      });
    });
  }
}

test("reduced-motion homepage capture", async ({ browser }) => {
  const context = await browser.newContext({
    reducedMotion: "reduce",
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "home-1440-reduced-motion.png"),
    fullPage: true,
  });
  await context.close();
});
