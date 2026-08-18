import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const ESTIMATE_LABEL = "Illustrative estimate — not a valuation.";

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test.describe("rental appraisal", () => {
  test("starts with the form and an honest empty result panel", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto("/rental-appraisal");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: "What could your property rent for?" })).toBeVisible();
    await expect(page.getByRole("form", { name: "About the property" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "No range yet" })).toBeVisible();
    // No estimate is shown before the visitor answers.
    await expect(page.getByText(/£\d[\d,]* – £\d[\d,]*/)).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("answering the four questions returns an illustrative range with assumptions, freshness and a chart", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/rental-appraisal");
    const form = page.getByRole("form", { name: "About the property" });
    await form.getByLabel("Peterborough area").selectOption("hampton");
    await form.getByLabel("Property type").selectOption("detached-house");
    await form.getByLabel("Bedrooms").selectOption("4");
    await form.getByLabel("Current status").selectOption("vacant");
    await form.getByRole("button", { name: "Show my illustrative range" }).click();

    await expect(page).toHaveURL(/\/rental-appraisal\?area=hampton&type=detached-house&beds=4&status=vacant(#result)?$/);
    // Only property characteristics travel in the URL — never contact details.
    expect(page.url()).not.toMatch(/name=|phone=|email=|address=/);

    await expect(page.getByRole("heading", { name: "Illustrative monthly range" })).toBeVisible();
    await expect(page.getByText(/£\d[\d,]* – £\d[\d,]*/).first()).toBeVisible();
    await expect(page.getByText(ESTIMATE_LABEL, { exact: true }).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: "Assumptions behind this range" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Data freshness" })).toBeVisible();
    await expect(page.getByText(/Data observed on 30 June 2026/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Evidence used" })).toBeVisible();
    await expect(page.getByRole("img", { name: /Demonstration rent history/ })).toBeVisible();
    await expect(page.getByRole("table", { name: /Demonstration rent history/ }).getByRole("row")).toHaveCount(9);
    await expect(page.getByText("Demonstration figures — not market data.").first()).toBeVisible();

    // The form keeps its values so the visitor can adjust.
    const reForm = page.getByRole("form", { name: "About the property" });
    await expect(reForm.getByLabel("Property type")).toHaveValue("detached-house");
    await expect(reForm.getByLabel("Bedrooms")).toHaveValue("4");
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("weak evidence: no range is guessed — an honest state explains why and routes to a verified appraisal", async ({ page }) => {
    // Millfield is not in the demonstration table, so the adapter refuses to publish a range.
    await page.goto("/rental-appraisal?area=millfield&type=terraced-house&beds=2&status=vacant");
    const panel = page.locator("[data-appraisal-outcome='insufficient-evidence']");
    await expect(panel).toBeVisible();
    await expect(panel).toContainText("We would rather not guess");
    await expect(panel).toContainText("Comparable properties found: 0");
    await expect(page.getByRole("heading", { name: "Illustrative monthly range" })).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(/£\d/);
    await expect(page.getByRole("link", { name: "Request a verified rental appraisal" })).toBeVisible();
  });

  test("invalid or partial input shows a clear message instead of a range", async ({ page }) => {
    await page.goto("/rental-appraisal?type=castle&beds=2");
    await expect(page.getByRole("alert").filter({ hasText: "Please choose" })).toContainText("Please choose a property type");
    await expect(page.getByRole("heading", { name: "No range yet" })).toBeVisible();
  });

  test("contact step is honestly inert and offers WhatsApp without personal data in the link", async ({ page }) => {
    await page.goto("/rental-appraisal?type=apartment&beds=2&status=tenanted");
    await expect(page.getByRole("heading", { name: "Send us the details for a proper appraisal" })).toBeVisible();
    await expect(page.getByLabel("Property address")).toBeDisabled();
    await expect(page.getByLabel("Your name")).toBeDisabled();
    await expect(page.getByRole("button", { name: "Send details (not yet active)" })).toBeDisabled();
    const link = page.getByRole("link", { name: "Request a verified rental appraisal" });
    const href = await link.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/447300856675\?text=/);
    expect(decodeURIComponent(href ?? "")).toContain("2-bedroom apartment");
    // Status-specific assumption appears.
    await expect(page.getByText(/The property is currently let/)).toBeVisible();
    // No crime score, forecast or guarantee is presented as a figure.
    const bodyText = (await page.locator("main").innerText()).toLowerCase();
    expect(bodyText).not.toMatch(/crime score:\s*\d|forecast:\s*£|guaranteed rent of/);
  });

  test("axe finds no serious or critical violations on the form and the report", async ({ page }) => {
    for (const path of ["/rental-appraisal", "/rental-appraisal?area=fletton&type=terraced-house&beds=2&status=vacant"]) {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(
        blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) })),
      ).toEqual([]);
    }
  });

  test("keyboard: the whole form is operable without a mouse", async ({ page }) => {
    await page.goto("/rental-appraisal");
    await page.getByLabel("Property type").focus();
    await page.keyboard.press("ArrowDown"); // first real option
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Bedrooms")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Current status")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Show my illustrative range" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/type=.+&beds=\d&status=/);
    await expect(page.getByRole("heading", { name: "Illustrative monthly range" })).toBeVisible();
  });
});
