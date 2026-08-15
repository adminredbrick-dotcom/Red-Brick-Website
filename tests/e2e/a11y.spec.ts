import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PATHS = [
  "/",
  "/?audience=landlord",
  "/?audience=tenant",
  "/properties",
  "/properties?view=map",
  "/properties?minRent=2000",
  "/properties/illustrative-two-bedroom-fletton-home",
  "/rental-appraisal",
  "/rental-appraisal?report=1",
  "/landlords",
  "/tenants",
  "/maintenance",
  "/contact",
  "/privacy",
];

for (const path of PATHS) {
  test(`axe scan on ${path} finds no serious or critical violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();

    const blocking = results.violations.filter(
      (violation) => violation.impact === "serious" || violation.impact === "critical",
    );

    expect(
      blocking.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.map((node) => node.target.join(" ")).slice(0, 5),
      })),
    ).toEqual([]);
  });
}

test.describe("mobile axe scans", () => {
  test.use({ viewport: { width: 375, height: 800 } });
  for (const path of ["/", "/properties?view=map", "/rental-appraisal?report=1"]) {
    test(`axe scan on ${path} at 375px finds no serious or critical violations`, async ({
      page,
    }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );
      expect(blocking.map((v) => ({ id: v.id, help: v.help }))).toEqual([]);
    });
  }
});
