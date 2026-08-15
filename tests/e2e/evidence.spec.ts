import path from "node:path";

import { expect, test } from "@playwright/test";

/**
 * Captures the phase evidence pack: screenshots at the required breakpoints
 * plus reduced-motion captures, and verifies that no page overflows
 * horizontally at any width (DoD: Required evidence / Accessibility).
 */

const PHASE = "phase-2";
const EVIDENCE_DIR = path.join(__dirname, "..", "..", "docs", "evidence", PHASE);

const BREAKPOINTS = [
  { width: 320, height: 568 },
  { width: 375, height: 667 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

const PAGES = [
  { route: "/", slug: "home" },
  { route: "/?audience=landlord", slug: "home-landlord" },
  { route: "/?audience=tenant", slug: "home-tenant" },
  { route: "/properties", slug: "properties" },
  { route: "/properties?view=map", slug: "properties-map" },
  { route: "/properties?bedrooms=3", slug: "properties-filtered" },
  { route: "/properties?minRent=2000", slug: "properties-empty" },
  { route: "/properties/illustrative-two-bedroom-fletton-home", slug: "property-detail" },
  { route: "/rental-appraisal", slug: "appraisal-form" },
  { route: "/rental-appraisal?report=1", slug: "appraisal-report" },
  { route: "/landlords", slug: "landlords" },
  { route: "/tenants", slug: "tenants" },
  { route: "/maintenance", slug: "maintenance" },
  { route: "/contact", slug: "contact" },
];

for (const { width, height } of BREAKPOINTS) {
  for (const { route, slug } of PAGES) {
    test(`capture ${slug} at ${width}px and verify no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

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

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" }, viewport: { width: 1440, height: 900 } });

  for (const { route, slug } of [
    { route: "/", slug: "home" },
    { route: "/?audience=landlord", slug: "home-landlord" },
    { route: "/properties", slug: "properties" },
    { route: "/rental-appraisal?report=1", slug: "appraisal-report" },
  ]) {
    test(`reduced-motion capture of ${slug}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toBeVisible();
      const reduced = await page.evaluate(
        () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
      expect(reduced).toBe(true);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, `${slug}-1440-reduced-motion.png`),
        fullPage: true,
      });
    });
  }
});

test.describe("no JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });

  for (const { route, slug } of [
    { route: "/", slug: "home" },
    { route: "/properties?bedrooms=3", slug: "properties-filtered" },
    { route: "/rental-appraisal?report=1", slug: "appraisal-report" },
  ]) {
    test(`no-JS capture of ${slug} keeps essential content`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.getByRole("navigation", { name: "Primary" })).toBeAttached();
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, `${slug}-1440-no-js.png`),
        fullPage: true,
      });
    });
  }
});
