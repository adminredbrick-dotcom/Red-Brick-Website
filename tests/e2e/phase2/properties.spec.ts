import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Properties search and detail against the portfolio dataset
 * (src/lib/listings/portfolio.json → portfolio-listings.ts): 46 homes, street + district
 * only, two available (an apartment on Lincoln Road PE1 at £600 pcm and a terraced house on
 * Scotney Street PE1, rent on application), the rest "Currently let".
 */
const TOTAL = 46;
const AVAILABLE_SLUG = "lincoln-road-pe1-345";
const LET_SLUG = "ellindon-pe3-360";

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
  test("lists every portfolio home — street and district only, available first, no console errors", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto("/properties");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1, name: "Properties to rent in Peterborough" })).toBeVisible();

    const cards = page.getByRole("list", { name: "Matching properties" }).locator("article");
    await expect(cards).toHaveCount(TOTAL);
    // Available homes first, then the occupied portfolio.
    await expect(cards.nth(0)).toContainText("Available");
    await expect(cards.nth(1)).toContainText("Available");
    await expect(cards.nth(2)).toContainText("Currently let");
    // No fictional labels, no photographs, no house numbers, no full postcodes.
    await expect(page.getByText("Demonstration listing — not a real property.")).toHaveCount(0);
    await expect(page.locator("main img")).toHaveCount(0);
    const text = await page.getByRole("list", { name: "Matching properties" }).innerText();
    expect(text).not.toMatch(/\bPE\d\s?\d[A-Z]{2}\b/);
    expect(text).not.toMatch(/\b\d{1,4}[A-Za-z]?\s+(?:Lincoln|Belsize|Ellindon|Francis)/);
    for (const card of await cards.all()) {
      await expect(card.getByRole("link", { name: /View details for/ })).toBeVisible();
    }
    await expect(page.getByRole("status")).toContainText(`${TOTAL} of ${TOTAL}`);
    // Occupied homes never show a rent.
    await expect(cards.nth(2)).toContainText("Rent on application");
    expect(errors).toEqual([]);
  });

  test("filter form reflects its state in the URL and the results", async ({ page }) => {
    await page.goto("/properties");
    const form = page.getByRole("form", { name: "Filter properties" }).first();
    await form.getByLabel("Peterborough area").selectOption("bretton");
    await form.getByLabel("Property type").selectOption("terraced-house");
    await form.getByRole("button", { name: "Apply filters" }).click();

    await expect(page).toHaveURL(/\/properties\?/);
    const params = new URL(page.url()).searchParams;
    expect(params.get("area")).toBe("bretton");
    expect(params.get("type")).toBe("terraced-house");
    expect(params.get("availability") ?? "").toBe("");
    const cards = page.getByRole("list", { name: "Matching properties" }).locator("article");
    await expect(cards).toHaveCount(6);
    await expect(cards.first()).toContainText("Terraced house on");
    await expect(cards.first()).toContainText("Bretton, Peterborough (PE3)");
    await expect(page.getByRole("status")).toContainText(`6 of ${TOTAL}`);
    await expect(page.getByRole("status")).toContainText("2 filters applied");

    const reForm = page.getByRole("form", { name: "Filter properties" }).first();
    await expect(reForm.getByLabel("Peterborough area")).toHaveValue("bretton");
    await expect(reForm.getByLabel("Property type")).toHaveValue("terraced-house");
  });

  test("rent range, type and availability filters work from the URL alone; unknown rent never matches a rent filter", async ({ page }) => {
    await page.goto("/properties?max=1000&type=apartment");
    const cards = page.getByRole("list", { name: "Matching properties" }).locator("article");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("Apartment on Lincoln Road");
    await expect(cards.first()).toContainText("£600 pcm");

    await page.goto("/properties?availability=now");
    await expect(cards).toHaveCount(2);
    for (const card of await cards.all()) await expect(card).toContainText("Available");

    await page.goto("/properties?availability=let");
    await expect(cards).toHaveCount(TOTAL - 2);
    await expect(cards.first()).toContainText("Currently let");

    // A bedroom filter cannot be satisfied by "to be confirmed".
    await page.goto("/properties?beds=1");
    await expect(page.getByRole("heading", { name: "No homes match those filters" })).toBeVisible();
  });

  test("shows a clear empty state and resets", async ({ page }) => {
    await page.goto("/properties?area=hampton&max=500");
    await expect(page.getByRole("heading", { name: "No homes match those filters" })).toBeVisible();
    await expect(page.getByRole("status")).toContainText(`0 of ${TOTAL}`);
    await expect(page.getByRole("list", { name: "Matching properties" })).toHaveCount(0);
    await page.getByRole("link", { name: "Reset all filters" }).click();
    await expect(page).toHaveURL(/\/properties$/);
    await expect(page.getByRole("list", { name: "Matching properties" }).locator("article")).toHaveCount(TOTAL);
  });

  test("optional static map view lists every pin as text and keeps the filters", async ({ page }) => {
    await page.goto("/properties?area=werrington&view=map");
    const toggle = page.getByRole("navigation", { name: "Results view" });
    await expect(toggle.getByRole("link", { name: "Map" })).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("img", { name: /Schematic map of Peterborough/ })).toBeVisible();
    await expect(page.getByText("Schematic map with approximate locations — not to scale.")).toBeVisible();
    const pinList = page.getByRole("list", { name: "Locations shown on the map" });
    await expect(pinList.getByRole("listitem")).toHaveCount(2);
    await expect(pinList.getByRole("link").first()).toHaveAttribute("href", /\/properties\/(uplands|cranemore)-pe4-\d+/);
    // No map provider, no canvas, no remote tiles.
    await expect(page.locator("canvas")).toHaveCount(0);
    await toggle.getByRole("link", { name: "List" }).click();
    await expect(page).toHaveURL(/\/properties\?area=werrington$/);
  });

  test("mobile filter drawer opens, traps focus and closes on Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/properties?type=apartment");
    const trigger = page.getByRole("button", { name: /Filters \(1 active\)/ });
    await expect(trigger).toBeVisible();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("form", { name: "Filter properties" })).toBeVisible();
    await expect(dialog.getByLabel("Property type")).toHaveValue("apartment");
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
      if (info && /^\/properties\/[a-z-]+-pe\d-\d+$/.test(info.href)) {
        expect(info.outline).not.toBe("none");
        expect(parseFloat(info.outlineWidth)).toBeGreaterThan(0);
        reached = true;
      }
    }
    expect(reached).toBe(true);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/properties\/[a-z-]+-pe\d-\d+$/);
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
  test("renders the five sections, verified-only facts and one enquiry route (available home)", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(`/properties/${AVAILABLE_SLUG}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Apartment on Lincoln Road");
    await expect(page.getByText("Demonstration listing — not a real property.")).toHaveCount(0);
    await expect(page.getByText("£600 pcm").first()).toBeVisible();

    for (const name of ["Overview", "Features", "Costs", "Location", "Enquire"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
      await expect(page.getByRole("navigation", { name: "On this page" }).getByRole("link", { name })).toHaveAttribute(
        "href",
        `#${name.toLowerCase()}`,
      );
    }

    // Verified facts appear (EPC from the register); unverified ones do not, and the page says so.
    const costs = page.getByRole("table", { name: /Costs and verified facts/ });
    await expect(costs.getByRole("rowheader", { name: "Rent" })).toBeVisible();
    await expect(costs.getByRole("rowheader", { name: "EPC rating" })).toBeVisible();
    await expect(costs.getByRole("rowheader", { name: "Council tax band" })).toHaveCount(0);
    await expect(costs.getByRole("rowheader", { name: "Tenancy deposit" })).toHaveCount(0);
    await expect(page.getByText(/Not shown because not yet verified against a document:/)).toBeVisible();
    await expect(page.getByText("To be confirmed").first()).toBeVisible();

    // Approximate-location static map, no canvas, no images, never a full postcode.
    await expect(page.getByRole("img", { name: /Approximate location of/ })).toBeVisible();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator("main img")).toHaveCount(0);
    expect(await page.locator("main").innerText()).not.toMatch(/\bPE\d\s?\d[A-Z]{2}\b/);

    // Prominent enquiry action carrying only the public reference.
    const enquire = page.getByRole("link", { name: "Ask about this property on WhatsApp" }).first();
    await expect(enquire).toBeVisible();
    const href = await enquire.getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/447300856675\?text=/);
    expect(decodeURIComponent(href ?? "")).toContain("ref RB-345");
    expect(errors).toEqual([]);
  });

  test("an occupied home shows Currently let, no rent and no availability date", async ({ page }) => {
    await page.goto(`/properties/${LET_SLUG}`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Terraced house on Ellindon");
    await expect(page.getByText("Currently let").first()).toBeVisible();
    await expect(page.getByText("Rent on application").first()).toBeVisible();
    await expect(page.getByText(/occupied and not available to view/)).toBeVisible();
    const costs = page.getByRole("table", { name: /Costs and verified facts/ });
    for (const label of ["Tenancy deposit", "Holding deposit", "Council tax band"]) {
      await expect(costs.getByRole("rowheader", { name: label })).toHaveCount(0);
    }
  });

  test("unknown slug is a 404, not an error", async ({ page }) => {
    const response = await page.goto("/properties/does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("axe finds no serious or critical violations on the detail page", async ({ page }) => {
    await page.goto(`/properties/${LET_SLUG}`);
    await expectNoSeriousAxeViolations(page);
  });
});

test.describe("homepage preview components (internal showcase)", () => {
  test("render the property, appraisal and move-in-cost previews without a canvas", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/experiments/phase2-previews");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Homes to rent across Peterborough" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Featured properties" }).locator("article")).toHaveCount(3);
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
