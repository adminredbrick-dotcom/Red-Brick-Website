import { expect, test, type Page } from "@playwright/test";

import { collectConsoleErrors, trackTransfers } from "../phase3/helpers";

/**
 * Phase 7 production review — the site-wide sweeps that the per-phase specs do
 * not cover: every public route at five widths plus 200 % zoom (640 px CSS
 * viewport), unique titles/descriptions and social/canonical tags, no third-
 * party requests, no cookies, no broken internal links, keyboard focus
 * visibility on the primary pages, and honest states for empty listings and an
 * unavailable estimate adapter (unit-covered) — see docs/PHASE-7-REPORT.md.
 */
const PUBLIC_ROUTES = [
  "/",
  "/properties",
  "/properties?view=map",
  "/properties/lincoln-road-pe1-345",
  "/properties/ellindon-pe3-360",
  "/landlords",
  "/tenants",
  "/tenants?rent=850",
  "/maintenance",
  "/rental-appraisal",
  "/rental-appraisal?type=apartment&beds=2&status=vacant",
  "/rental-appraisal?area=millfield&type=terraced-house&beds=2&status=vacant",
  "/insights",
  "/insights?category=landlords",
  "/insights/move-in-costs-in-england-what-you-can-be-asked-to-pay",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
];
const WIDTHS = [320, 375, 640, 768, 1024, 1440];

async function overflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.scrollingElement;
    return el ? el.scrollWidth - el.clientWidth : 0;
  });
}

test.describe("every public route", () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route}: 200, one h1, no console errors, same-origin only, no cookies, no overflow at 320–1440 and 200 % zoom`, async ({ page, context }) => {
      const errors = collectConsoleErrors(page);
      const totals = trackTransfers(page);
      const thirdParty: string[] = [];
      page.on("request", (r) => {
        const url = r.url();
        if (!url.startsWith("http://localhost") && !url.startsWith("data:") && !url.startsWith("blob:")) thirdParty.push(url);
      });
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.waitForTimeout(150);
        expect(await overflow(page), `${route} overflows at ${width}px`).toBeLessThanOrEqual(0);
      }
      expect(thirdParty, "third-party requests").toEqual([]);
      expect(await context.cookies()).toEqual([]);
      expect(errors).toEqual([]);
      expect(totals.requests).toBeGreaterThan(0);
    });
  }
});

test.describe("metadata", () => {
  test("titles and descriptions are unique per page; canonical/OG/twitter tags present; noindex pre-launch", async ({ page }) => {
    const seenTitles = new Map<string, string>();
    const seenDescriptions = new Map<string, string>();
    for (const route of PUBLIC_ROUTES.filter((r) => !r.includes("?"))) {
      await page.goto(route);
      const title = await page.title();
      const description = (await page.locator("meta[name='description']").getAttribute("content")) ?? "";
      expect(title.length, `${route} title`).toBeGreaterThan(10);
      expect(description.length, `${route} description`).toBeGreaterThan(30);
      expect(seenTitles.has(title), `duplicate title "${title}" on ${route} and ${seenTitles.get(title)}`).toBe(false);
      expect(seenDescriptions.has(description), `duplicate description on ${route} and ${seenDescriptions.get(description)}`).toBe(false);
      seenTitles.set(title, route);
      seenDescriptions.set(description, route);
      await expect(page.locator("meta[property='og:site_name']")).toHaveAttribute("content", "Red Brick Lettings");
      await expect(page.locator("meta[name='twitter:card']")).toHaveCount(1);
      await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
      expect(await page.locator("html").getAttribute("lang")).toBe("en-GB");
    }
  });
});

test.describe("links", () => {
  test("no broken internal links across the public routes", async ({ page, request }) => {
    const seen = new Set<string>();
    const broken: string[] = [];
    for (const route of PUBLIC_ROUTES) {
      await page.goto(route);
      const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""));
      for (const href of hrefs) {
        if (!href || href.startsWith("#") || /^(mailto:|tel:|https?:\/\/)/.test(href)) continue;
        const path = href.split("#")[0]!;
        if (!path || seen.has(path)) continue;
        seen.add(path);
        const res = await request.get(path);
        if (res.status() >= 400) broken.push(`${path} (${res.status()}) on ${route}`);
      }
    }
    expect(broken).toEqual([]);
    expect(seen.size).toBeGreaterThan(30);
  });
});

test.describe("keyboard", () => {
  for (const route of ["/", "/properties", "/maintenance", "/insights"]) {
    test(`${route}: skip link first, then every focused element shows a visible focus indicator`, async ({ page }) => {
      await page.goto(route);
      await page.keyboard.press("Tab");
      const skip = page.locator(":focus");
      await expect(skip).toContainText(/Skip to/i);
      const missing: string[] = [];
      for (let i = 0; i < 40; i += 1) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const s = getComputedStyle(el);
          const visible =
            (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== "none") || s.borderColor !== "rgba(0, 0, 0, 0)";
          return { tag: el.tagName, text: (el.textContent ?? "").trim().slice(0, 40), visible };
        });
        if (info && !info.visible) missing.push(`${info.tag}: ${info.text}`);
      }
      expect(missing).toEqual([]);
    });
  }
});

test.describe("honest states", () => {
  test("empty listings repository → the properties page shows the empty state, not an error", async ({ page }) => {
    // Filters that no home can satisfy stand in for an empty feed (nothing is guessed to fill the page).
    await page.goto("/properties?area=hampton&type=detached-house&max=100");
    await expect(page.getByRole("heading", { name: "No homes match those filters" })).toBeVisible();
    await expect(page.locator("main img")).toHaveCount(0);
  });

  test("weak-evidence estimate → no figure, an explanation and the verified-appraisal route", async ({ page }) => {
    await page.goto("/rental-appraisal?area=millfield&type=terraced-house&beds=2&status=vacant");
    await expect(page.locator("[data-appraisal-outcome='insufficient-evidence']")).toBeVisible();
    await expect(page.getByRole("link", { name: "Request a verified rental appraisal" })).toBeVisible();
  });

  test("slow network: the homepage's live HTML actions are usable before media and the 3D chunk arrive", async ({ page, context }) => {
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (200 * 1024) / 8 });
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("link", { name: /I’m a landlord/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /Report a repair/ }).first()).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
  });
});
