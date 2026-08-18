import path from "node:path";

import { expect, test } from "@playwright/test";

import { collectConsoleErrors, scrollThroughStory, trackTransfers } from "./helpers";

const EVIDENCE_DIR = path.join(__dirname, "..", "..", "..", "docs", "evidence", "phase-3");
// Chunk/asset names that would betray a 3D download (word-bounded so "three-bedroom" listing URLs do not match).
const THREE_OR_GSAP = /(three(?!-bedroom)|gsap|fiber|drei|house-scene)|\.glb(\?|$)/i;

test.describe("static fallbacks never download 3D or video", () => {
  test("reduced motion: no canvas, no 3D/GSAP/model/video request, every chapter readable in HTML", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = collectConsoleErrors(page);
    const totals = trackTransfers(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await scrollThroughStory(page);
    await page.waitForTimeout(800);
    const section = page.locator("#house-story");
    await expect(section).toHaveAttribute("data-house-eligibility", "reduced-motion");
    await expect(section).toHaveAttribute("data-house-mode", "static");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("video")).toHaveCount(0);
    expect(totals.urls.filter((u) => THREE_OR_GSAP.test(new URL(u).pathname))).toEqual([]);
    expect(totals.video).toBe(0);
    expect(totals.models).toBe(0);
    // Static chapter sequence: still + one image per chapter, all copy visible.
    const neutral = section.locator("[data-story-variant='neutral']");
    await expect(neutral.locator("[data-chapter-index]")).toHaveCount(7);
    await expect(neutral.locator("img")).toHaveCount(6);
    for (const img of await neutral.locator("img").all()) await expect(img).toHaveAttribute("src", /\/media\/house\/neutral-chapter-\d\.jpg/);
    await expect(section.locator("[data-house-still]")).toBeVisible();
    // Controls stay keyboard accessible.
    await page.getByRole("link", { name: "Skip the house story" }).focus();
    await expect(page.getByRole("link", { name: "Skip the house story" })).toBeFocused();
    await page.keyboard.press("Tab");
    // (the next focusable after Skip is a Switch story button or a chapter link)
    expect(await page.evaluate(() => document.activeElement?.tagName)).toMatch(/BUTTON|A/);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "home-1440-reduced-motion.png"), fullPage: true });
    expect(errors).toEqual([]);
    await context.close();
  });

  test("Save-Data: poster-only media and no 3D download", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "connection", { value: { saveData: true, effectiveType: "3g" }, configurable: true });
    });
    const page = await context.newPage();
    const totals = trackTransfers(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await scrollThroughStory(page);
    await page.waitForTimeout(800);
    await expect(page.locator("#house-story")).toHaveAttribute("data-house-eligibility", "save-data");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("video")).toHaveCount(0);
    expect(totals.urls.filter((u) => THREE_OR_GSAP.test(new URL(u).pathname))).toEqual([]);
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "home-1440-save-data.png"), fullPage: true });
    await context.close();
  });

  test("no JavaScript: the complete neutral story is served with all copy, images and actions", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Property cared for.");
    const section = page.locator("#house-story");
    await expect(section.locator("[data-story-variant='neutral']")).toBeVisible();
    await expect(section.locator("[data-story-variant='landlord']")).toBeHidden();
    await expect(section.locator("[data-story-variant='tenant']")).toBeHidden();
    for (const name of ["On the market", "The meeting", "Through the door", "Room by room", "Making it home", "Looked after"]) {
      await expect(section.locator("[data-story-variant='neutral']").getByText(new RegExp(`Chapter \\d · ${name}`))).toBeVisible();
    }
    await expect(section.locator("[data-story-variant='neutral'] img")).toHaveCount(6);
    await expect(page.locator("canvas")).toHaveCount(0);
    // JS-only Switch story control is hidden; the actions still work as anchors/links.
    await expect(page.getByRole("group", { name: "Switch story" })).toBeHidden();
    await expect(page.getByRole("link", { name: /I’m a landlord/ })).toHaveAttribute("href", "#house-story");
    await expect(page.getByRole("link", { name: "View properties" }).first()).toHaveAttribute("href", "/properties");
    await expect(page.getByRole("link", { name: "Skip the house story" })).toHaveAttribute("href", "#after-story");
    await page.screenshot({ path: path.join(EVIDENCE_DIR, "home-1440-no-js.png"), fullPage: true });
    await context.close();
  });

  test("small viewport (390px) defaults to the static chapter sequence and posters", async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const totals = trackTransfers(page);
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await scrollThroughStory(page, 6);
    await page.waitForTimeout(600);
    await expect(page.locator("#house-story")).toHaveAttribute("data-house-eligibility", "small-viewport");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("video")).toHaveCount(0);
    expect(totals.urls.filter((u) => THREE_OR_GSAP.test(new URL(u).pathname))).toEqual([]);
    // Mobile hero poster crop is the one requested.
    expect(totals.urls.some((u) => u.includes("hero-12217554-mobile.webp"))).toBe(true);
    await context.close();
  });
});
