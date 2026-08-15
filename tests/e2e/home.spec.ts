import { expect, test, type Page } from "@playwright/test";

const H1 = "Property cared for. People looked after.";
const LANDLORD_CHAPTER = "Start with a clear picture.";
const TENANT_CHAPTER = "Find the right next step.";
const SHARED_CHAPTER = "It starts with the building.";
const DEMO_LABEL = "Illustrative example — not currently available";

const chapter = (page: Page, name: string) => page.getByRole("heading", { level: 3, name });

/** Resolves once React has hydrated the audience choice buttons. */
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const button = document.querySelector("button[name='audience']");
    return !!button && Object.keys(button).some((key) => key.startsWith("__reactFiber"));
  });
}

test.describe("homepage", () => {
  test("shows the H1 and the three approved actions", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();

    const hero = page.locator("#hero");
    await expect(hero.getByRole("link", { name: "Let or manage my property" })).toBeVisible();
    await expect(hero.getByRole("link", { name: "Find a home", exact: true })).toBeVisible();
    await expect(hero.getByRole("link", { name: "Report a repair" })).toBeVisible();

    // The audience question and both substantial choices.
    await expect(
      page.getByRole("heading", { level: 2, name: "What would you like help with?" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "I'm a landlord" })).toBeVisible();
    await expect(page.getByRole("button", { name: "I'm looking for a home" })).toBeVisible();
  });

  test("default view tells the shared story", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute("data-audience", "none");
    await expect(chapter(page, SHARED_CHAPTER)).toBeVisible();
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeHidden();
    await expect(chapter(page, TENANT_CHAPTER)).toBeHidden();
    // Shared story ends with both actions.
    const story = page.locator("#house-story");
    await expect(story.getByRole("link", { name: "Request a rental appraisal" })).toBeVisible();
    await expect(story.getByRole("link", { name: "View available properties" })).toBeVisible();
  });

  test("?audience=landlord shows the landlord chapters and hides the tenant ones", async ({
    page,
  }) => {
    await page.goto("/?audience=landlord");
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute(
      "data-audience",
      "landlord",
    );
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeVisible();
    await expect(chapter(page, "Your property is in good hands.")).toBeVisible();
    await expect(chapter(page, TENANT_CHAPTER)).toBeHidden();
    await expect(chapter(page, SHARED_CHAPTER)).toBeHidden();
    // Personalisation never removes the other route entirely.
    await expect(page.getByRole("button", { name: "I'm looking for a home" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 3, name: "Understand your move-in costs" }),
    ).toBeVisible();
    // Finale action follows the choice.
    const finale = page.locator("#next-step");
    await expect(finale.getByRole("link", { name: "Request a rental appraisal" })).toBeVisible();
    await expect(finale.getByRole("link", { name: "View available properties" })).toBeHidden();
    await expect(finale.getByRole("link", { name: "Talk to Red Brick" })).toBeHidden();
  });

  test("?audience=tenant shows the tenant chapters and hides the landlord ones", async ({
    page,
  }) => {
    await page.goto("/?audience=tenant");
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute("data-audience", "tenant");
    await expect(chapter(page, TENANT_CHAPTER)).toBeVisible();
    await expect(chapter(page, "A good property should feel easy to live in.")).toBeVisible();
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeHidden();
    await expect(chapter(page, SHARED_CHAPTER)).toBeHidden();
    await expect(page.getByRole("button", { name: "I'm a landlord" })).toBeVisible();
    const finale = page.locator("#next-step");
    await expect(finale.getByRole("link", { name: "View available properties" })).toBeVisible();
    await expect(finale.getByRole("link", { name: "Request a rental appraisal" })).toBeHidden();
  });

  test("an unknown audience value falls back to the shared story", async ({ page }) => {
    await page.goto("/?audience=owner");
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute("data-audience", "none");
    await expect(chapter(page, SHARED_CHAPTER)).toBeVisible();
  });

  test("choosing an audience personalises in place and Switch view swaps it", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    await page.evaluate(() => {
      (window as unknown as { __rbMarker: number }).__rbMarker = 1;
    });

    await page.getByRole("button", { name: "I'm a landlord" }).click();

    await expect(page.getByTestId("home-audience-root")).toHaveAttribute(
      "data-audience",
      "landlord",
    );
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeVisible();
    await expect(chapter(page, TENANT_CHAPTER)).toBeHidden();
    await expect(page.getByText("Selected view").first()).toBeVisible();

    // No full navigation happened: the in-page marker survived.
    expect(
      await page.evaluate(() => (window as unknown as { __rbMarker?: number }).__rbMarker),
    ).toBe(1);
    // The URL is kept in step so the view can be shared.
    await expect(page).toHaveURL(/\?audience=landlord$/);
    // Session-only storage, no cookies.
    expect(await page.evaluate(() => window.sessionStorage.getItem("rb-audience"))).toBe(
      "landlord",
    );
    expect(await page.evaluate(() => document.cookie)).toBe("");

    // Switch view → Tenant.
    const switcher = page.getByRole("group", { name: "Switch view" }).first();
    await switcher.getByRole("link", { name: "Tenant" }).click();
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute("data-audience", "tenant");
    await expect(chapter(page, TENANT_CHAPTER)).toBeVisible();
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeHidden();
    await expect(switcher.getByRole("link", { name: "Tenant" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(
      await page.evaluate(() => (window as unknown as { __rbMarker?: number }).__rbMarker),
    ).toBe(1);

    // Switch view → Both restores the shared story and clears the stored choice.
    await switcher.getByRole("link", { name: "Both" }).click();
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute("data-audience", "none");
    await expect(chapter(page, SHARED_CHAPTER)).toBeVisible();
    expect(await page.evaluate(() => window.sessionStorage.getItem("rb-audience"))).toBeNull();
  });

  test("a session choice is restored on the next visit without a parameter", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    await page.getByRole("button", { name: "I'm looking for a home" }).click();
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute("data-audience", "tenant");

    await page.goto("/");
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute("data-audience", "tenant");
    await expect(chapter(page, TENANT_CHAPTER)).toBeVisible();
  });

  test("Skip the story points at an existing section", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: "Skip the story" });
    await expect(skip).toBeVisible();
    const href = await skip.getAttribute("href");
    expect(href).toMatch(/^#.+/);
    await expect(page.locator(href as string)).toHaveCount(1);
  });

  test("renders three labelled illustrative property cards and the demo notice", async ({
    page,
  }) => {
    await page.goto("/");
    const cards = page.locator("#peterborough-properties [data-listing-id]");
    await expect(cards).toHaveCount(3);
    for (let i = 0; i < 3; i += 1) {
      await expect(cards.nth(i)).toContainText(DEMO_LABEL);
    }
    await expect(page.locator("#peterborough-properties")).toContainText("Demonstration content.");
    await expect(page.getByRole("link", { name: "View all properties" })).toBeVisible();
  });

  test("logs no console errors on the default and personalised views", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await waitForHydration(page);
    await page.goto("/?audience=tenant");
    await waitForHydration(page);
    await page.getByRole("button", { name: "I'm a landlord" }).click();
    await expect(page.getByTestId("home-audience-root")).toHaveAttribute(
      "data-audience",
      "landlord",
    );

    expect(errors).toEqual([]);
  });
});

test.describe("homepage without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("both audience choices and the shared story render, and a choice still works", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: H1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "I'm a landlord" })).toBeVisible();
    await expect(page.getByRole("button", { name: "I'm looking for a home" })).toBeVisible();
    await expect(chapter(page, SHARED_CHAPTER)).toBeVisible();
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeHidden();
    await expect(chapter(page, TENANT_CHAPTER)).toBeHidden();

    // Plain GET form submission personalises via the URL.
    await page.getByRole("button", { name: "I'm a landlord" }).click();
    await expect(page).toHaveURL(/\?audience=landlord/);
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeVisible();
    await expect(chapter(page, TENANT_CHAPTER)).toBeHidden();

    // Switch view links reload with the other audience.
    await page
      .getByRole("group", { name: "Switch view" })
      .first()
      .getByRole("link", { name: "Tenant" })
      .click();
    await expect(page).toHaveURL(/\?audience=tenant/);
    await expect(chapter(page, TENANT_CHAPTER)).toBeVisible();
    await expect(chapter(page, LANDLORD_CHAPTER)).toBeHidden();

    // The map preview disclosure is a native <details>.
    await expect(page.locator("#peterborough-properties details summary")).toHaveCount(1);
  });
});
