import path from "node:path";

import { expect, test } from "@playwright/test";

import { landingContract } from "./landing-contract";

/**
 * Hybrid D+B — the shared landing contract plus the round-two acceptance
 * checks and the evidence pack.
 */

const ROUTE = "/experiments/hybrid-db";
const EVIDENCE_DIR = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "docs",
  "evidence",
  "landing-experiments",
  "hybrid-db",
);

/** Visitor-facing prototype language that must not appear. */
const PROTOTYPE_WORDS =
  /placeholder|\bround\b|static preview|still frame|future animation|later (stage|round)|arrives in|prototype|storyboard|mock-?up|coming soon|will live/i;

landingContract({ name: "hybrid-db", route: ROUTE });

test.describe("hybrid-db acceptance", () => {
  test("has at most six major sections, one h1 and no visitor-facing prototype language", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const sections = page.getByRole("main").locator(":scope > div > section");
    await expect(sections).toHaveCount(6);
    await expect(page.locator("h1")).toHaveCount(1);
    const text = await page.getByRole("main").innerText();
    expect(text).not.toMatch(PROTOTYPE_WORDS);
    expect(await page.title()).not.toMatch(PROTOTYPE_WORDS);
  });

  test("story section has exactly four chapters and no per-chapter calls to action", async ({
    page,
  }) => {
    await page.goto(ROUTE);
    const story = page.locator("section[aria-labelledby='hdb-story']");
    await expect(story.getByRole("heading", { level: 3 })).toHaveText([
      "Prepare",
      "Let",
      "Manage",
      "Care",
    ]);
    await expect(story.getByRole("link")).toHaveCount(0);
  });

  test("locked routes and WhatsApp configuration are wired", async ({ page }) => {
    await page.goto(ROUTE);
    const main = page.getByRole("main");
    await expect(main.getByRole("link", { name: /I['’]m a landlord/ })).toHaveAttribute(
      "href",
      "/landlords",
    );
    await expect(main.getByRole("link", { name: /I['’]m looking for a home/ })).toHaveAttribute(
      "href",
      "/properties",
    );
    await expect(main.getByRole("link", { name: "View properties" }).first()).toHaveAttribute(
      "href",
      "/properties",
    );
    await expect(
      main.getByRole("link", { name: "Request a rental appraisal" }).first(),
    ).toHaveAttribute("href", "/rental-appraisal");
    await expect(
      main.getByRole("link", { name: "Already rent with us? Report a repair." }).first(),
    ).toHaveAttribute("href", "/maintenance");
    const whatsapp = main.getByRole("link", { name: "Message us on WhatsApp" });
    await expect(whatsapp).toHaveCount(1);
    await expect(whatsapp).toHaveAttribute("href", "https://wa.me/447300856675");
    await expect(main.getByText("07300 856675")).toBeVisible();
  });

  test("every interactive control in main is at least 44px tall", async ({ page }) => {
    await page.goto(ROUTE);
    const boxes = await page.getByRole("main").locator("a, button").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { text: (el.textContent ?? "").trim().slice(0, 40), h: r.height, w: r.width };
      }),
    );
    const small = boxes.filter((b) => b.h < 44 || b.w < 44);
    expect(small, "controls under 44px").toEqual([]);
  });

  for (const viewport of [
    { label: "1440x900", width: 1440, height: 900 },
    { label: "390x844", width: 390, height: 844 },
    { label: "320x800", width: 320, height: 800 },
  ]) {
    test(`first viewport (${viewport.label}) shows both audiences and Peterborough`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(ROUTE);
      const inView = async (name: RegExp) => {
        const box = await page.getByRole("main").getByRole("link", { name }).first().boundingBox();
        return Boolean(box && box.y >= 0 && box.y + box.height <= viewport.height);
      };
      expect(await inView(/I['’]m a landlord/), "landlord choice above the fold").toBe(true);
      expect(await inView(/I['’]m looking for a home/), "tenant choice above the fold").toBe(true);
      const eyebrow = page.getByText(/Peterborough lettings, since 2012/i).first();
      const box = await eyebrow.boundingBox();
      expect(Boolean(box && box.y >= 0 && box.y <= viewport.height)).toBe(true);
    });
  }

  test.describe("evidence", () => {
    for (const size of [
      { label: "1440", width: 1440, height: 900 },
      { label: "1024", width: 1024, height: 768 },
      { label: "768", width: 768, height: 1024 },
      { label: "390", width: 390, height: 844 },
      { label: "320", width: 320, height: 800 },
    ]) {
      test(`captures ${size.label} fold and full`, async ({ page }) => {
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.goto(ROUTE);
        await page.waitForLoadState("networkidle");
        await page.screenshot({
          path: path.join(EVIDENCE_DIR, `hybrid-db-${size.label}-fold.png`),
          fullPage: false,
        });
        await page.screenshot({
          path: path.join(EVIDENCE_DIR, `hybrid-db-${size.label}-full.png`),
          fullPage: true,
        });
      });
    }

    test("captures the story stage mid-scroll on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(ROUTE);
      const story = page.locator("section[aria-labelledby='hdb-story']");
      const box = await story.boundingBox();
      if (box) {
        await page.evaluate((y) => window.scrollTo(0, y), box.y + box.height * 0.45);
        await page.waitForTimeout(150);
      }
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, "hybrid-db-1440-story-mid.png"),
        fullPage: false,
      });
    });

    test.describe("reduced motion", () => {
      test.use({ contextOptions: { reducedMotion: "reduce" } });
      test("captures reduced-motion desktop and phone with the finished house and all text", async ({
        page,
      }) => {
        for (const size of [
          { label: "1440", width: 1440, height: 900 },
          { label: "390", width: 390, height: 844 },
        ]) {
          await page.setViewportSize({ width: size.width, height: size.height });
          await page.goto(ROUTE);
          await page.waitForLoadState("networkidle");
          const story = page.locator("section[aria-labelledby='hdb-story']");
          await expect(story.getByRole("heading", { level: 3 })).toHaveCount(4);
          const running = await page.evaluate(
            () => document.getAnimations().filter((a) => a.playState === "running").length,
          );
          expect(running).toBe(0);
          await page.screenshot({
            path: path.join(EVIDENCE_DIR, `hybrid-db-${size.label}-reduced-motion-full.png`),
            fullPage: true,
          });
        }
      });
    });
  });
});
