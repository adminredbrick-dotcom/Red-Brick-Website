import { expect, test } from "@playwright/test";

test.describe("mobile navigation drawer", () => {
  test.use({ viewport: { width: 375, height: 800 } });

  test("opens, traps focus, lists every route and closes with Escape", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: "Open menu" });
    await expect(trigger).toBeVisible();
    await trigger.click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();

    for (const label of [
      "Properties",
      "Landlords",
      "Tenants",
      "Maintenance",
      "Insights",
      "About",
      "Contact",
    ]) {
      await expect(dialog.getByRole("link", { name: label, exact: true })).toBeVisible();
    }

    // Visible close control.
    await expect(dialog.getByRole("button", { name: "Close menu" })).toBeVisible();

    // Focus is inside the dialog.
    const focusInDialog = await page.evaluate(() => {
      const dialogEl = document.querySelector("[role='dialog']");
      return dialogEl?.contains(document.activeElement) ?? false;
    });
    expect(focusInDialog).toBe(true);

    // Escape closes and returns focus to the trigger.
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("navigating from the drawer closes it and loads the page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: "Maintenance" }).click();
    await expect(page).toHaveURL(/\/maintenance$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("keyboard access", () => {
  test("skip link is the first tab stop and is visible when focused", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to main content" });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();
  });

  test("desktop primary navigation is keyboard reachable", async ({ page }) => {
    await page.goto("/");
    // Tab through: skip link → logo → nav links.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    const properties = page.getByRole("navigation", { name: "Primary" }).getByRole("link", {
      name: "Properties",
    });
    await expect(properties).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/properties$/);
  });
});
