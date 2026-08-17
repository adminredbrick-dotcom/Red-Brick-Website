import path from "node:path";

import { expect, test } from "@playwright/test";

/**
 * Phase 2 evidence pack: screenshots of every new page state at the five
 * required widths, verified free of horizontal overflow and console errors,
 * plus a reduced-motion capture. Output: docs/evidence/phase-2/.
 */

const EVIDENCE_DIR = path.join(__dirname, "..", "..", "..", "docs", "evidence", "phase-2");

const BREAKPOINTS = [
  { width: 320, height: 568 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const PAGES = [
  { route: "/properties", slug: "properties" },
  { route: "/properties?area=werrington&beds=3", slug: "properties-filtered" },
  { route: "/properties?view=map", slug: "properties-map" },
  { route: "/properties?area=hampton&max=500", slug: "properties-empty" },
  { route: "/properties/demo-three-bedroom-semi-werrington", slug: "property-detail" },
  { route: "/rental-appraisal", slug: "appraisal-form" },
  { route: "/rental-appraisal?area=werrington&type=semi-detached-house&beds=3&status=vacant", slug: "appraisal-report" },
  { route: "/experiments/phase2-previews", slug: "phase2-previews" },
];

for (const { width, height } of BREAKPOINTS) {
  for (const { route, slug } of PAGES) {
    test(`capture ${slug} at ${width}px with no overflow and no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() === "error") errors.push(m.text());
      });
      page.on("pageerror", (e) => errors.push(e.message));

      await page.setViewportSize({ width, height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const overflow = await page.evaluate(() => {
        const el = document.scrollingElement;
        return el ? el.scrollWidth - el.clientWidth : 0;
      });
      expect(overflow, `${route} overflows horizontally at ${width}px`).toBeLessThanOrEqual(0);

      await page.screenshot({ path: path.join(EVIDENCE_DIR, `${slug}-${width}.png`), fullPage: true });
      expect(errors).toEqual([]);
    });
  }
}

test("mobile filter drawer capture at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/properties?beds=2");
  await page.getByRole("button", { name: /Filters/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: path.join(EVIDENCE_DIR, "properties-filter-drawer-390.png") });
});

test("reduced-motion captures", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  for (const { route, slug } of [PAGES[0]!, PAGES[4]!, PAGES[6]!]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("canvas")).toHaveCount(0);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, `${slug}-1440-reduced-motion.png`), fullPage: true });
  }
  await context.close();
});
