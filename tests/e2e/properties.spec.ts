import { expect, test, type Page } from "@playwright/test";

import { DEMO_DATA_NOTICE, DEMO_LISTING_LABEL } from "../../src/content/demo-labels";

const DETAIL_SLUG = "illustrative-two-bedroom-fletton-home";

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

/** Listing cards rendered by PropertyCard (article[data-listing-id]). */
function cards(page: Page) {
  return page.locator("article[data-listing-id]");
}

/** The results column (section labelled "Results"). */
function results(page: Page) {
  return page.getByRole("region", { name: "Results" });
}

test.describe("property search", () => {
  test("shows the three illustrative examples, each labelled, with the demo notice", async ({
    page,
  }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/properties");

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Properties to rent in Peterborough",
    );
    await expect(results(page).getByText(DEMO_DATA_NOTICE)).toBeVisible();

    const listingCards = cards(page);
    await expect(listingCards).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      await expect(listingCards.nth(i).getByText(DEMO_LISTING_LABEL)).toBeVisible();
    }
    await expect(results(page).getByText("3 illustrative examples match.")).toBeVisible();

    expect(errors).toEqual([]);
  });

  test("filtering by bedrooms through the form yields the three-bedroom example only", async ({
    page,
  }) => {
    await page.goto("/properties");

    await page.getByRole("combobox", { name: "Bedrooms" }).selectOption("3");
    await page.getByRole("button", { name: "Apply filters" }).click();

    await expect(page).toHaveURL(/bedrooms=3/);
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first().getByRole("heading", { level: 3 })).toContainText(
      /three-bedroom/i,
    );
    await expect(results(page).getByText("1 illustrative example matches.")).toBeVisible();
    // The submitted value is reflected back into the form.
    await expect(page.getByRole("combobox", { name: "Bedrooms" })).toHaveValue("3");
  });

  test("an out-of-range minimum rent shows the empty state with a Clear filters link", async ({
    page,
  }) => {
    await page.goto("/properties?minRent=2000");

    await expect(cards(page)).toHaveCount(0);
    await expect(results(page).getByText("No properties match these filters.")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Nothing matches these filters" }),
    ).toBeVisible();

    const clear = page.getByRole("link", { name: "Clear filters" });
    await expect(clear).toBeVisible();
    await expect(clear).toHaveAttribute("href", "/properties");

    // The empty state routes to WhatsApp rather than inventing inventory.
    await expect(page.getByRole("link", { name: "Ask us about availability" })).toHaveAttribute(
      "href",
      /wa\.me\/447300856675/,
    );
  });

  test("'Available now' honestly returns zero results for demonstration records", async ({
    page,
  }) => {
    await page.goto("/properties?availability=now");

    await expect(cards(page)).toHaveCount(0);
    await expect(results(page).getByText("No properties match these filters.")).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Availability" })).toHaveValue("now");
  });

  test("desktop map marker links select the matching listing without JavaScript magic", async ({
    page,
  }) => {
    await page.goto("/properties");

    const markers = page.getByRole("list", { name: "Approximate property positions" });
    const marker = markers.getByRole("link", { name: /Illustrative city apartment/ });
    await expect(marker).toBeVisible();
    await expect(marker).not.toHaveAttribute("aria-current", "true");

    await marker.click();
    await expect(page).toHaveURL(/selected=DEMO-RBL-003/);
    await expect(page).toHaveURL(/#listing-DEMO-RBL-003$/);

    const selectedMarker = page
      .getByRole("list", { name: "Approximate property positions" })
      .getByRole("link", { name: /Illustrative city apartment/ });
    await expect(selectedMarker).toHaveAttribute("aria-current", "true");
    await expect(page.locator("#listing-DEMO-RBL-003")).toBeVisible();
  });
});

test.describe("property search on a small screen", () => {
  test.use({ viewport: { width: 375, height: 760 } });

  test("offers a List / Map control, defaults to the list, and the map view can return", async ({
    page,
  }) => {
    await page.goto("/properties");

    const toggle = page.getByRole("group", { name: "Results view" });
    await expect(toggle).toBeVisible();
    await expect(toggle.getByRole("link", { name: "List" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(toggle.getByRole("link", { name: "Map" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(cards(page).first()).toBeVisible();

    // The filters live in a native disclosure that is closed by default.
    const filters = page.locator("details", { hasText: "Filters" }).first();
    await expect(filters.locator("summary")).toBeVisible();
    await expect(filters).not.toHaveAttribute("open", "");

    await toggle.getByRole("link", { name: "Map" }).click();
    await expect(page).toHaveURL(/view=map/);
    await expect(
      page.getByRole("group", { name: "Results view" }).getByRole("link", { name: "Map" }),
    ).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("figure")).toBeVisible();
    await expect(cards(page).first()).toBeHidden();

    const back = page.getByRole("link", { name: "Back to list" });
    await expect(back).toBeVisible();
    await back.click();
    await expect(page).toHaveURL(/\/properties$/);
    await expect(cards(page).first()).toBeVisible();
  });

  test("never overflows horizontally at 375px", async ({ page }) => {
    for (const path of ["/properties", `/properties/${DETAIL_SLUG}`]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} overflows horizontally`).toBeLessThanOrEqual(0);
    }
  });
});

test.describe("property search without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the GET filter form still filters and reflects its values", async ({ page }) => {
    await page.goto("/properties");
    await expect(cards(page)).toHaveCount(3);

    await page.getByRole("combobox", { name: "Bedrooms" }).selectOption("3");
    await page.getByRole("button", { name: "Apply filters" }).click();

    await expect(page).toHaveURL(/\/properties\?.*bedrooms=3/);
    await expect(cards(page)).toHaveCount(1);
    await expect(cards(page).first().getByRole("heading", { level: 3 })).toContainText(
      /three-bedroom/i,
    );
    await expect(page.getByRole("combobox", { name: "Bedrooms" })).toHaveValue("3");

    // Clear returns to the unfiltered list.
    await page.getByRole("link", { name: "Clear", exact: true }).click();
    await expect(page).toHaveURL(/\/properties$/);
    await expect(cards(page)).toHaveCount(3);
  });
});

test.describe("property detail", () => {
  test("renders the illustrative detail page with costs, section nav and WhatsApp enquiry", async ({
    page,
  }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto(`/properties/${DETAIL_SLUG}`);
    expect(response?.status()).toBe(200);

    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Illustrative two-bedroom home",
    );
    await expect(page.locator("h1")).toHaveCount(1);

    // The block illustrative label appears before the title.
    const blockLabel = page.locator("p", { hasText: DEMO_LISTING_LABEL }).first();
    await expect(blockLabel).toBeVisible();
    const labelBeforeTitle = await page.evaluate((label) => {
      const h1 = document.querySelector("h1");
      const strip = Array.from(document.querySelectorAll("p")).find(
        (p) => p.textContent?.trim() === label,
      );
      if (!h1 || !strip) return false;
      return Boolean(strip.compareDocumentPosition(h1) & Node.DOCUMENT_POSITION_FOLLOWING);
    }, DEMO_LISTING_LABEL);
    expect(labelBeforeTitle).toBe(true);

    // Breadcrumb.
    const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
    await expect(breadcrumb.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    await expect(breadcrumb.getByRole("link", { name: "Properties" })).toHaveAttribute(
      "href",
      "/properties",
    );

    // In-page section navigation in document order.
    const sectionNav = page.getByRole("navigation", { name: "On this page" });
    for (const label of ["Overview", "Features", "Costs", "Location", "Enquire"]) {
      await expect(sectionNav.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        `#${label.toLowerCase()}`,
      );
      await expect(page.locator(`section#${label.toLowerCase()}`)).toBeVisible();
    }

    // Costs table with the fixture rent, caption and row headers.
    const table = page.getByRole("table", { name: /Costs for this illustrative example/ });
    await expect(table).toBeVisible();
    await expect(table.getByRole("rowheader", { name: "Rent" })).toBeVisible();
    await expect(table).toContainText("£1,100");
    await expect(table.getByRole("row", { name: /Council tax band/ })).toContainText(
      "Not published",
    );

    // Availability and reviewed date are honestly unpublished.
    await expect(page.getByText("Listing reviewed: Not published")).toBeVisible();

    // WhatsApp enquiry carries the listing reference.
    const enquiry = page.getByRole("link", { name: "Ask about this property on WhatsApp" });
    await expect(enquiry).toHaveAttribute("href", /wa\.me\/447300856675/);
    await expect(enquiry).toHaveAttribute("href", /DEMO-RBL-001/);

    // Approximate-location map for this listing only.
    await expect(
      page.getByRole("list", { name: "Approximate property positions" }).getByRole("link"),
    ).toHaveCount(1);

    // Related examples exclude the current listing.
    const related = page.getByRole("region", { name: "Other illustrative examples" });
    await expect(related.locator("article[data-listing-id]")).toHaveCount(2);
    await expect(related.locator("#listing-DEMO-RBL-001")).toHaveCount(0);

    expect(errors).toEqual([]);
  });

  test("an unknown slug returns the honest 404", async ({ page }) => {
    const response = await page.goto("/properties/not-a-real-listing");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "We could not find that page." })).toBeVisible();
  });
});
