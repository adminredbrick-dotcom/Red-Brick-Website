import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

export async function expectNoSeriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(
    blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) })),
  ).toEqual([]);
}

export interface TransferTotals {
  html: number;
  js: number;
  css: number;
  images: number;
  video: number;
  models: number;
  fonts: number;
  other: number;
  requests: number;
  urls: string[];
}

/** Sums on-the-wire transfer sizes by resource kind (encoded body size when reported, else content-length/body length). */
export function trackTransfers(page: Page): TransferTotals {
  const totals: TransferTotals = { html: 0, js: 0, css: 0, images: 0, video: 0, models: 0, fonts: 0, other: 0, requests: 0, urls: [] };
  page.on("response", async (response) => {
    try {
      const url = response.url();
      if (!url.startsWith("http://localhost")) return;
      const headers = response.headers();
      // Encoded (on-the-wire) size where the browser reports it; fall back to headers/body.
      let bytes = 0;
      try {
        bytes = (await response.request().sizes()).responseBodySize;
      } catch {
        bytes = 0;
      }
      if (!bytes) bytes = Number(headers["content-length"] ?? "0");
      if (!bytes) {
        try {
          bytes = (await response.body()).length;
        } catch {
          bytes = 0;
        }
      }
      totals.requests += 1;
      totals.urls.push(url);
      const type = headers["content-type"] ?? "";
      if (/\.(mp4|webm)(\?|$)/.test(url) || type.startsWith("video/")) totals.video += bytes;
      else if (/\.(glb|gltf)(\?|$)/.test(url) || type.includes("gltf") || type.includes("model/")) totals.models += bytes;
      else if (/\.js(\?|$)/.test(url) || type.includes("javascript")) totals.js += bytes;
      else if (/\.css(\?|$)/.test(url) || type.includes("text/css")) totals.css += bytes;
      else if (/\.(png|jpe?g|webp|avif|svg|gif)(\?|$)/.test(url) || type.startsWith("image/")) totals.images += bytes;
      else if (/\.(woff2?|ttf|otf)(\?|$)/.test(url) || type.includes("font")) totals.fonts += bytes;
      else if (type.includes("text/html")) totals.html += bytes;
      else totals.other += bytes;
    } catch {
      /* ignore */
    }
  });
  return totals;
}

/** Scroll the house chapter through its whole range in steps, giving the scene time to draw. */
export async function scrollThroughStory(page: Page, steps = 8) {
  const section = page.locator("#house-story");
  const box = await section.boundingBox();
  if (!box) throw new Error("house story section not found");
  const start = await page.evaluate(() => window.scrollY);
  const top = start + box.y;
  for (let i = 0; i <= steps; i += 1) {
    const y = top - 200 + (box.height * i) / steps;
    await page.evaluate((v) => window.scrollTo({ top: v, behavior: "instant" as ScrollBehavior }), y);
    await page.waitForTimeout(250);
  }
}
