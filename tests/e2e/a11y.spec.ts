import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PATHS = ["/", "/properties", "/landlords", "/maintenance", "/contact", "/privacy"];

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
        nodes: violation.nodes.map((node) => node.target.join(" ")).slice(0, 5),
      })),
    ).toEqual([]);
  });
}
