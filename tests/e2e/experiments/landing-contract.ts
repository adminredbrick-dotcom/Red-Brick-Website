import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

import {
  experimentActions,
  forbiddenClaimPatterns,
  forbiddenElementSelectors,
} from "@/content/experiments/shared-copy";

/**
 * Shared landing-page contract for the experiment.
 *
 * Candidate specs call `landingContract({ name, route })` once. The contract
 * registers the same battery of tests for every candidate so results are
 * comparable. Uses the existing Playwright + axe setup; no extra dependencies.
 */

export interface LandingContractOptions {
  /** Display name, e.g. "candidate-01". */
  name: string;
  /** Route under test, e.g. "/experiments/candidate-01". */
  route: string;
}

export const CONTRACT_VIEWPORTS = [
  { width: 320, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
] as const;

/** Accept both the typographic and straight apostrophe in labels. */
function labelPattern(label: string): RegExp {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/[’']/g, "[’']");
  return new RegExp(`^\\s*${escaped}\\s*$`, "i");
}

const REQUIRED_ACTIONS = [
  experimentActions.landlord,
  experimentActions.tenant,
  experimentActions.viewProperties,
  experimentActions.appraisal,
  experimentActions.repair,
] as const;

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function horizontalOverflow(page: Page): Promise<number> {
  return page.evaluate(() => {
    const el = document.scrollingElement;
    return el ? el.scrollWidth - el.clientWidth : 0;
  });
}

export function landingContract({ name, route }: LandingContractOptions): void {
  test.describe(`landing contract — ${name}`, () => {
    test("route returns 200 with exactly one h1", async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    });

    test("heading levels never skip and start at h1", async ({ page }) => {
      await page.goto(route);
      const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (nodes) =>
        nodes.map((node) => Number(node.tagName.slice(1))),
      );
      expect(levels.length).toBeGreaterThan(3);
      expect(levels[0]).toBe(1);
      for (let i = 1; i < levels.length; i += 1) {
        const step = (levels[i] ?? 0) - (levels[i - 1] ?? 0);
        expect(step, `heading jump at index ${i} (${levels.join(",")})`).toBeLessThanOrEqual(1);
      }
    });

    test("required audience actions exist with the locked labels and routes", async ({ page }) => {
      await page.goto(route);
      const main = page.getByRole("main");
      for (const action of REQUIRED_ACTIONS) {
        const link = main.getByRole("link", { name: labelPattern(action.label) }).first();
        await expect(link, `missing action "${action.label}"`).toBeVisible();
        await expect(link).toHaveAttribute("href", action.href);
      }
      const whatsapp = main
        .getByRole("link", { name: labelPattern(experimentActions.whatsapp.label) })
        .first();
      await expect(whatsapp, "missing final WhatsApp action").toBeVisible();
      const href = await whatsapp.getAttribute("href");
      expect(href?.startsWith(experimentActions.whatsapp.href)).toBe(true);
    });

    test("keyboard reaches every required action with visible focus", async ({ page }) => {
      await page.goto(route);
      const targets = new Set<string>([
        ...REQUIRED_ACTIONS.map((action) => action.href),
        experimentActions.whatsapp.href,
      ]);
      const reached = new Set<string>();
      const invisibleFocus: string[] = [];

      for (let i = 0; i < 250 && reached.size < targets.size; i += 1) {
        await page.keyboard.press("Tab");
        const info = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null;
          if (!el || el === document.body) return null;
          const style = getComputedStyle(el);
          const outlineVisible = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0;
          const shadowVisible = style.boxShadow !== "none";
          const inMain = Boolean(el.closest("main"));
          const href = el.getAttribute("href") ?? "";
          return { href, inMain, focusVisible: outlineVisible || shadowVisible, tag: el.tagName };
        });
        if (!info) continue;
        if (!info.focusVisible) invisibleFocus.push(`${info.tag} ${info.href}`);
        if (!info.inMain) continue;
        for (const target of targets) {
          if (info.href === target || info.href.startsWith(`${target}?`)) reached.add(target);
        }
      }

      expect([...targets].filter((t) => !reached.has(t)), "actions not reachable by Tab").toEqual(
        [],
      );
      expect(invisibleFocus, "focused elements without a visible focus indicator").toEqual([]);
    });

    test("no serious or critical axe violations (WCAG 2.2 AA tags)", async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(
        blocking.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5),
        })),
      ).toEqual([]);
    });

    test("no console errors or page errors", async ({ page }) => {
      const errors = collectConsoleErrors(page);
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      expect(errors).toEqual([]);
    });

    for (const viewport of CONTRACT_VIEWPORTS) {
      test(`no horizontal overflow at ${viewport.width}×${viewport.height}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      });
    }

    test.describe("reduced motion", () => {
      test.use({ contextOptions: { reducedMotion: "reduce" } });

      test("page remains fully understandable and static", async ({ page }) => {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        expect(
          await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches),
        ).toBe(true);
        await expect(page.locator("h1")).toBeVisible();
        const main = page.getByRole("main");
        for (const action of REQUIRED_ACTIONS) {
          await expect(main.getByRole("link", { name: labelPattern(action.label) }).first()).toBeVisible();
        }
        // Every section heading is present and readable.
        const headings = await main.locator("h2").allInnerTexts();
        expect(headings.length).toBeGreaterThanOrEqual(6);
        for (const heading of headings) expect(heading.trim().length).toBeGreaterThan(0);
        // Nothing is still animating.
        const running = await page.evaluate(() =>
          document.getAnimations().filter((a) => a.playState === "running").length,
        );
        expect(running).toBe(0);
      });
    });

    test("no remote third-party requests and no forbidden media elements", async ({ page }) => {
      const remote: string[] = [];
      page.on("request", (request) => {
        const url = new URL(request.url());
        const isLocal =
          url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "[::1]";
        const isInline = url.protocol === "data:" || url.protocol === "blob:" || url.protocol === "about:";
        if (!isLocal && !isInline) remote.push(request.url());
      });
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      expect(remote, "remote requests observed").toEqual([]);

      for (const selector of forbiddenElementSelectors) {
        await expect(page.locator(selector), `forbidden element <${selector}>`).toHaveCount(0);
      }
    });

    test("no forbidden claims in visible text and no purple in the palette", async ({ page }) => {
      await page.goto(route);
      const text = await page.getByRole("main").innerText();
      const hits = forbiddenClaimPatterns
        .filter(({ pattern }) => pattern.test(text))
        .map(({ reason, pattern }) => `${reason}: ${String(text.match(pattern)?.[0])}`);
      expect(hits, "forbidden claims found").toEqual([]);

      const purple = await page.evaluate(() => {
        const found: string[] = [];
        const toHsl = (rgb: string) => {
          const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (!m) return null;
          const a = m[4] === undefined ? 1 : parseFloat(m[4]);
          if (a === 0) return null;
          const r = Number(m[1]) / 255;
          const g = Number(m[2]) / 255;
          const b = Number(m[3]) / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 2;
          if (max === min) return { h: 0, s: 0, l };
          const d = max - min;
          const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          let h = 0;
          if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
          else if (max === g) h = ((b - r) / d + 2) * 60;
          else h = ((r - g) / d + 4) * 60;
          return { h, s, l };
        };
        const nodes = Array.from(document.querySelectorAll("main *")).slice(0, 4000);
        for (const el of nodes) {
          const style = getComputedStyle(el);
          for (const prop of ["color", "background-color", "border-top-color", "outline-color"]) {
            const hsl = toHsl(style.getPropertyValue(prop));
            if (hsl && hsl.s > 0.2 && hsl.h >= 255 && hsl.h <= 330) {
              found.push(`${el.tagName.toLowerCase()} ${prop}=${style.getPropertyValue(prop)}`);
              break;
            }
          }
        }
        return found.slice(0, 10);
      });
      expect(purple, "purple/violet colours found").toEqual([]);
    });
  });
}
