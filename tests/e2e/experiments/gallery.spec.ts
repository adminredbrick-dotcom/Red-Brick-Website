import path from "node:path";

import { expect, test, type Page } from "@playwright/test";

/**
 * Blind gallery smoke test.
 *
 * Verifies the neutral gallery and the five blind aliases, and captures the
 * blind screenshot pack. Nothing here names candidates, branches or skills —
 * it works only with Options A–E.
 */

const OPTIONS = ["a", "b", "c", "d", "e"] as const;
const GALLERY = "/experiments";
const aliasRoute = (letter: string) => `/experiments/options/${letter}`;

const EVIDENCE_DIR = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "docs",
  "evidence",
  "landing-experiments",
  "blind",
);

const SIZES = [
  { label: "390", width: 390, height: 844 },
  { label: "1440", width: 1440, height: 900 },
] as const;

/** Text that would identify a candidate, branch or reference skill. */
const IDENTIFYING = /candidate|frontend[- ]design|impeccable|hallmark|ui[- /]?ux[- ]pro[- ]max|anthropic|\bskills?\b|branch/i;

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

async function overflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.scrollingElement;
    return el ? el.scrollWidth - el.clientWidth : 0;
  });
}

test.describe("blind gallery", () => {
  test("gallery renders five equal, alphabetical option cards with no identifying text", async ({
    page,
  }) => {
    const errors = collectErrors(page);
    const response = await page.goto(GALLERY);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);

    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots ?? "").toMatch(/noindex/);
    expect(robots ?? "").toMatch(/nofollow/);

    const cards = page.getByRole("list", { name: "Blind options" }).getByRole("listitem");
    await expect(cards).toHaveCount(5);
    const headings = await cards.locator("h2").allInnerTexts();
    expect(headings.map((h) => h.trim())).toEqual([
      "Option A",
      "Option B",
      "Option C",
      "Option D",
      "Option E",
    ]);

    // Equal-sized cards.
    const boxes = await cards.evaluateAll((els) =>
      els.map((el) => {
        const r = (el.firstElementChild as HTMLElement).getBoundingClientRect();
        return [Math.round(r.width), Math.round(r.height)] as const;
      }),
    );
    for (const [w, h] of boxes) {
      expect(Math.abs(w - (boxes[0]?.[0] ?? 0))).toBeLessThanOrEqual(1);
      expect(Math.abs(h - (boxes[0]?.[1] ?? 0))).toBeLessThanOrEqual(1);
    }

    // Each card opens its live blind alias.
    for (const letter of OPTIONS) {
      const link = page.getByRole("link", { name: `Open Option ${letter.toUpperCase()}` });
      await expect(link).toHaveAttribute("href", aliasRoute(letter));
    }

    // No identifying words in visible text or title.
    const text = await page.getByRole("main").innerText();
    expect(text).not.toMatch(IDENTIFYING);
    expect(await page.title()).not.toMatch(IDENTIFYING);
    expect(errors).toEqual([]);
  });

  test("gallery has no horizontal overflow at 390 and 1440", async ({ page }) => {
    for (const size of SIZES) {
      await page.setViewportSize({ width: size.width, height: size.height });
      await page.goto(GALLERY);
      await page.waitForLoadState("networkidle");
      expect(await overflow(page)).toBeLessThanOrEqual(0);
      await page.screenshot({
        path: path.join(EVIDENCE_DIR, `gallery-${size.label}-full.png`),
        fullPage: true,
      });
    }
  });
});

for (const letter of OPTIONS) {
  const upper = letter.toUpperCase();
  const route = aliasRoute(letter);

  test.describe(`Option ${upper}`, () => {
    test(`alias returns 200, one h1, noindex, no errors, no identifying text`, async ({ page }) => {
      const errors = collectErrors(page);
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await page.waitForLoadState("networkidle");
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();

      const robots = await page.locator('meta[name="robots"]').getAttribute("content");
      expect(robots ?? "").toMatch(/noindex/);
      expect(robots ?? "").toMatch(/nofollow/);

      expect(await page.title()).toMatch(new RegExp(`^Option ${upper}\\b`));
      const text = await page.getByRole("main").innerText();
      expect(text).not.toMatch(/candidate|frontend[- ]design|impeccable|hallmark|ui[- /]?ux[- ]pro[- ]max|anthropic/i);
      expect(errors).toEqual([]);
    });

    for (const size of SIZES) {
      test(`captures ${size.label} fold + full with no horizontal overflow`, async ({ page }) => {
        const errors = collectErrors(page);
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        expect(await overflow(page), `overflow at ${size.width}px`).toBeLessThanOrEqual(0);
        await page.screenshot({
          path: path.join(EVIDENCE_DIR, `option-${letter}-${size.label}-fold.png`),
          fullPage: false,
        });
        await page.screenshot({
          path: path.join(EVIDENCE_DIR, `option-${letter}-${size.label}-full.png`),
          fullPage: true,
        });
        expect(errors).toEqual([]);
      });
    }

    test.describe("reduced motion", () => {
      test.use({ contextOptions: { reducedMotion: "reduce" } });
      test("alias remains readable under prefers-reduced-motion", async ({ page }) => {
        const errors = collectErrors(page);
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        expect(
          await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
        ).toBe(true);
        await expect(page.locator("h1")).toBeVisible();
        const headings = await page.getByRole("main").locator("h2").allInnerTexts();
        expect(headings.length).toBeGreaterThan(0);
        const running = await page.evaluate(
          () => document.getAnimations().filter((a) => a.playState === "running").length,
        );
        expect(running).toBe(0);
        expect(errors).toEqual([]);
      });
    });
  });
}
