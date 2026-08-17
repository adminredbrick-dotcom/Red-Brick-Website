import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const DEMO_LABEL = "Demonstration listing — not a real property.";

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function expectNoSeriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(
    blocking.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => n.target.join(" ")).slice(0, 5) })),
  ).toEqual([]);
}

test.describe("properties search", () => {
  test("lists every demonstration listing with the mandatory label and no console errors", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto("/properties");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: "Properties to rent in Peterborough" })).toBeVisible();

    const cards = page.getByRole("list", { name: "Matching properties" }).locator("article");
    await expect(cards).toHaveCount(8);
    for (const card of await cards.all()) {
      await expect(card.getByText(DEMO_LABEL, { exact: true })).toBeVisible();
      await expect(card.getByRole("link", { name: /View details for/ })).toBeVisible();
    }
    await expect(page.getByRole("status")).toContainText("8 of 8");
    // No photographs of any kind on demonstration listings.
    await expect(page.locator("main img")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("filter form reflects its state in the URL and the results", async ({ page }) => {
    await page.goto("/properties");
    const form = page.getByRole("form", { name: "Filter properties" }).first();
    await form.getByLabel("Peterborough area").selectOption("werrington");
    await form.getByLabel("Bedrooms").selectOption("3");
    await form.getByRole("button", { name: "Apply filters" }).click();

    // A native GET form submits every field; the values that matter are in the URL and empties are harmless.
    await expect(page).toHaveURL(/\/properties\?/);
    const params = new URL(page.url()).searchParams;
    expect(params.get("area")).toBe("werrington");
    expect(params.get("beds")).toBe("3");
    expect(params.get("availability") ?? "").toBe("");
    const cards = page.getByRole("list", { name: "Matching properties" }).locator("article");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Three-bedroom semi-detached house, Werrington");
    await expect(page.getByRole("status")).toContainText("1 of 8");
    await expect(page.getByRole("status")).toContainText("2 filters applied");

    // The form re-renders with the chosen values (URL is the state).
    const reForm = page.getByRole("form", { name: "Filter properties" }).first();
    await expect(reForm.getByLabel("Peterborough area")).toHaveValue("werrington");
    await expect(reForm.getByLabel("Bedrooms")).toHaveValue("3");
  });

  test("rent range, type and availability filters work from the URL alone", async ({ page }) => {
    await page.goto("/properties?max=1000&type=apartment");
    const cards = page.getByRole("list", { name: "Matching properties" }).locator("article");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("One-bedroom apartment, Central Peterborough");

    await page.goto("/properties?availability=let-agreed");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Let agreed");

    await page.goto("/properties?availability=soon");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Coming soon");
  });

  test("shows a clear empty state and resets", async ({ page }) => {
    await page.goto("/properties?area=hampton&max=500");
    await expect(page.getByRole("heading", { name: "No demonstration listings match those filters" })).toBeVisible();
    await expect(page.getByRole("status")).toContainText("0 of 8");
    await expect(page.getByRole("list", { name: "Matching properties" })).toHaveCount(0);
    await page.getByRole("link", { name: "Reset all filters" }).click();
    await expect(page).toHaveURL(/\/properties$/);
    await expect(page.getByRole("list", { name: "Matching properties" }).locator("article")).toHaveCount(8);
  });

  test("optional static map view lists every pin as text and keeps the filters", async ({ page }) => {
    await page.goto("/properties?area=werrington&view=map");
    const toggle = page.getByRole("navigation", { name: "Results view" });
    await expect(toggle.getByRole("link", { name: "Map" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("img", { name: /Schematic map of Peterborough/ })).toBeVisible();
    await expect(page.getByText("Schematic map with approximate locations — not to scale.")).toBeVisible();
    const pinList = page.getByRole("list", { name: "Locations shown on the map" });
    await expect(pinList.getByRole("listitem")).toHaveCount(1);
    await expect(pinList.getByRole("link")).toHaveAttribute("href", "/properties/demo-three-bedroom-semi-werrington");
    // No map provider, no canvas, no remote tiles.
    await expect(page.locator("canvas")).toHaveCount(0);
    // Switching back to list keeps the area filter.
    await toggle.getByRole("link", { name: "List" }).click();
    await expect(page).toHaveURL(/\/properties\?area=werrington$/);
  });

  test("mobile filter drawer opens, traps focus and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/properties?beds=2");
    const trigger = page.getByRole("button", { name: /Filters \(1 active\)/ });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("form", { name: "Filter properties" })).toBeVisible();
    await expect(dialog.getByLabel("Bedrooms")).toHaveValue("2");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("keyboard: tab reaches a card link with visible focus and Enter opens the detail page", async ({ page }) => {
    await page.goto("/properties");
    let reached = false;
    for (let i = 0; i < 80 && !reached; i += 1) {
      await page.keyboard.press("Tab");
      const info = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el) return null;
        const style = getComputedStyle(el);
        return {
          text: el.textContent?.trim() ?? "",
          href: (el as HTMLAnchorElement).getAttribute?.("href") ?? "",
          outline: style.outlineStyle,
          outlineWidth: style.outlineWidth,
        };
      });
      if (info && info.href.startsWith("/properties/demo-")) {
        expect(info.outline).not.toBe("none");
        expect(parseFloat(info.outlineWidth)).toBeGreaterThan(0);
        reached = true;
      }
    }
    expect(reached).toBe(true);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/properties\/demo-/);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("axe finds no serious or critical violations on list and map views", async ({ page }) => {
    await page.goto("/properties");
    await expectNoSeriousAxeViolations(page);
    await page.goto("/properties?view=map");
    await expectNoSeriousAxeViolations(page);
    await page.goto("/properties?area=hampton&max=500");
    await expectNoSeriousAxeViolations(page);
  });
});

test.describe("property detail", () => {
  test("renders the five sections, verified-only facts and one enquiry route", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto("/properties/demo-three-bedroom-semi-werrington");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Three-bedroom semi-detached house, Werrington");
    await expect(page.getByText(DEMO_LABEL, { exact: true }).first()).toBeVisible();

    for (const name of ["Overview", "Features", "Costs", "Location", "Enquire"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name })).toHaveAttribute(
        "href",
        `#${name.toLowerCase()}`,
      );
    }

    // Verified facts appear; the unverified EPC does not, and the page says so.
    const costs = page.getByRole("table", { name: /Costs and verified facts/ });
    await expect(costs.getByRole("rowheader", { name: "Rent" })).toBeVisible();
    await expect(costs.getByRole("rowheader", { name: "Council tax band" })).toBeVisible();
    await expect(costs.getByRole("rowheader", { name: "Tenancy deposit" })).toBeVisible();
    await expect(costs.getByRole("rowheader", { name: "EPC rating" })).toHaveCount(0);
    await expect(page.getByText(/Not shown because not yet verified against a document: EPC rating/)).toBeVisible();

    // Approximate-location static map, no canvas, no images.
    await expect(page.getByRole("img", { name: /Approximate location of/ })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("main img")).toHaveCount(0);

    // Prominent enquiry action carrying only the public reference.
    const enquire = page.getByRole("link", { name: "Ask about this property on WhatsApp" }).first();
    await expect(enquire).toBeVisible();
    const href = await enquire.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/447300856675\?text=/);
    expect(decodeURIComponent(href ?? "")).toContain("ref DEMO-RBL-002");
    expect(errors).toEqual([]);
  });

  test("hides every unverified fact on a record without verified data", async ({ page }) => {
    await page.goto("/properties/demo-two-bedroom-bungalow-bretton");
    const costs = page.getByRole("table", { name: /Costs and verified facts/ });
    await expect(costs.getByRole("rowheader", { name: "Rent" })).toBeVisible();
    for (const label of ["Tenancy deposit", "Holding deposit", "Council tax band", "EPC rating"]) {
      await expect(costs.getByRole("rowheader", { name: label })).toHaveCount(0);
    }
    await expect(page.getByText(/tenancy deposit, holding deposit, council-tax band, EPC rating/)).toBeVisible();
    await expect(page.getByText("Coming soon from 2 November 2026").first()).toBeVisible();
  });

  test("axe finds no serious or critical violations on the detail page", async ({ page }) => {
    await page.goto("/properties/demo-two-bedroom-terrace-fletton");
    await expectNoSeriousAxeViolations(page);
  });
});

test.describe("homepage preview components (internal showcase)", () => {
  test("render the property, appraisal and move-in-cost previews without a canvas", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/experiments/phase2-previews");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Homes to rent across Peterborough" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Featured demonstration listings" }).locator("article")).toHaveCount(3);
    await expect(page.getByRole("heading", { name: "What could your property rent for?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Move-in costs explained" })).toBeVisible();
    await expect(page.getByText("Demonstration figures — not market data.").first()).toBeVisible();
    await expect(page.getByRole("link", { name: "View properties" })).toHaveAttribute("href", "/properties");
    await expect(page.getByRole("link", { name: "Request a rental appraisal" })).toHaveAttribute("href", "/rental-appraisal");
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(errors).toEqual([]);
    await expectNoSeriousAxeViolations(page);
  });
});
