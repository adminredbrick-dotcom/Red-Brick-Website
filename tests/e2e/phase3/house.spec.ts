import { promises as fs } from "node:fs";
import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { collectConsoleErrors, scrollThroughStory, trackTransfers } from "./helpers";

const EVIDENCE_DIR = path.join(__dirname, "..", "..", "..", "docs", "evidence", "phase-3");

async function webgl2Available(page: Page): Promise<boolean> {
  return page.evaluate(() => !!document.createElement("canvas").getContext("webgl2"));
}

test.describe("3D house chapter — eligible desktop", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("loads only on approach, draws behind the still, follows scroll, stays decorative", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const totals = trackTransfers(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    test.skip(!(await webgl2Available(page)), "test browser has no WebGL2");
    const section = page.locator("#house-story");
    // Before approaching: static, no canvas, JS baseline measured.
    await expect(section).toHaveAttribute("data-house-mode", "static");
    await expect(page.locator("canvas")).toHaveCount(0);
    const jsBefore = totals.js;

    await scrollThroughStory(page, 10);
    await expect(section).toHaveAttribute("data-house-mode", "live", { timeout: 20_000 });
    await expect(page.locator("#house-story canvas")).toHaveCount(1, { timeout: 20_000 });
    // First frame drawn → the still fades behind the canvas.
    await expect.poll(async () => page.locator("[data-house-still]").evaluate((el) => getComputedStyle(el).opacity), { timeout: 15_000 }).toBe("0");
    // Decorative canvas: aria-hidden ancestor, tabindex -1, no pointer events.
    const canvasInfo = await page.$eval("#house-story canvas", (c) => ({
      tabindex: c.getAttribute("tabindex"),
      hidden: c.closest("[aria-hidden='true']") !== null,
      pointer: getComputedStyle(c.parentElement as HTMLElement).pointerEvents,
    }));
    expect(canvasInfo.tabindex).toBe("-1");
    expect(canvasInfo.hidden).toBe(true);
    expect(canvasInfo.pointer).toBe("none");
    // Progress label follows scroll (chapter changed from 1 while scrolling to the end).
    const label = section.locator("[data-house-progress]");
    await expect(label).toContainText(/Chapter 6 of 6|complete/);
    // 3D JS was fetched only after approach; no model, texture or video files.
    expect(totals.js).toBeGreaterThan(jsBefore + 200_000);
    expect(totals.models).toBe(0);
    expect(totals.video).toBe(0);
    expect(totals.urls.filter((u) => /\.(glb|ktx2|basis|hdr|mp4|webm)(\?|$)/.test(u))).toEqual([]);
    // No pinning / scroll hijack: the document still scrolls normally and body has no fixed height hack.
    const pinSpacers = await page.$$eval(".pin-spacer", (n) => n.length);
    expect(pinSpacers).toBe(0);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "home-1440-3d-live-end.png") });
    // Mid-scroll capture for evidence.
    const box = await section.boundingBox();
    if (box) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior }), (await page.evaluate(() => window.scrollY)) + box.y + box.height * 0.45);
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(EVIDENCE_DIR, "home-1440-3d-live-mid.png") });
    }
    // Console must stay clean (THREE deprecation notices are warnings, not errors).
    expect(errors).toEqual([]);

    // Record measured transfer sizes for the report.
    await fs.mkdir(EVIDENCE_DIR, { recursive: true });
    await fs.writeFile(
      path.join(EVIDENCE_DIR, "transfer-sizes-live-1440.json"),
      JSON.stringify({ measuredOn: new Date().toISOString(), viewport: "1440x900 live 3D", ...totals, urls: undefined, jsBefore3D: jsBefore }, null, 2),
    );
  });

  test("story switch rebuilds the scene for the chosen journey", async ({ page }) => {
    await page.goto("/");
    test.skip(!(await webgl2Available(page)), "test browser has no WebGL2");
    await scrollThroughStory(page, 4);
    await expect(page.locator("#house-story")).toHaveAttribute("data-house-mode", "live", { timeout: 20_000 });
    await page.getByRole("group", { name: "Switch story" }).getByRole("button", { name: "Tenant" }).click();
    await expect(page.locator("#house-story")).toHaveAttribute("data-story-active", "tenant");
    await expect(page.locator("#house-story canvas")).toHaveCount(1);
    await expect(page.locator("[data-house-progress]")).toContainText(/Spotting the home|Getting in touch|Through the door|Room by room|Making it yours|Settled in|complete/);
  });

  test("failed WebGL: no 3D download, static sequence stays", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...rest: unknown[]) {
        if (type === "webgl2" || type === "webgl" || type === "experimental-webgl") return null;
        return (original as (...args: unknown[]) => unknown).call(this, type, ...rest);
      } as typeof HTMLCanvasElement.prototype.getContext;
    });
    const page = await context.newPage();
    const totals = trackTransfers(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const jsBefore = totals.js;
    await scrollThroughStory(page, 6);
    await page.waitForTimeout(800);
    await expect(page.locator("#house-story")).toHaveAttribute("data-house-eligibility", "no-webgl2");
    await expect(page.locator("#house-story")).toHaveAttribute("data-house-mode", "static");
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(totals.js - jsBefore).toBeLessThan(60_000);
    await expect(page.locator("[data-house-still]")).toBeVisible();
    await context.close();
  });

  test("dynamic import failure falls back to the static stage", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    test.skip(!(await webgl2Available(page)), "test browser has no WebGL2");
    // Every JS chunk requested from now on (i.e. the lazy 3D chunk) is aborted.
    await page.route(/\/_next\/static\/chunks\/.*\.js/, (route) => route.abort());
    await scrollThroughStory(page, 6);
    await expect(page.locator("#house-story")).toHaveAttribute("data-house-mode", "failed", { timeout: 20_000 });
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("[data-house-still]")).toBeVisible();
    await expect(page.getByText("Showing the illustrated version of the story.")).toBeVisible();
    await context.close();
  });

  test("WebGL context loss hands over to the static stage one-way", async ({ page }) => {
    await page.goto("/");
    test.skip(!(await webgl2Available(page)), "test browser has no WebGL2");
    await scrollThroughStory(page, 6);
    await expect(page.locator("#house-story canvas")).toHaveCount(1, { timeout: 20_000 });
    await page.evaluate(() => {
      const canvas = document.querySelector("#house-story canvas") as HTMLCanvasElement;
      const gl = (canvas.getContext("webgl2") ?? canvas.getContext("webgl")) as WebGLRenderingContext | null;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    });
    await expect(page.locator("#house-story")).toHaveAttribute("data-house-mode", "failed", { timeout: 10_000 });
    await expect(page.locator("#house-story canvas")).toHaveCount(0);
    await expect(page.locator("[data-house-still]")).toBeVisible();
    // Scrolling on does not bring the canvas back.
    await scrollThroughStory(page, 4);
    await expect(page.locator("#house-story canvas")).toHaveCount(0);
  });
});
