import { expect, test, type Page } from "@playwright/test";

const STATIC_PATHS = [
  "/",
  "/properties",
  "/landlords",
  "/rental-appraisal",
  "/tenants",
  "/maintenance",
  "/insights",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });
  return errors;
}

for (const path of STATIC_PATHS) {
  test(`route ${path} renders with a single h1 and no console errors`, async ({ page }) => {
    const errors = collectConsoleErrors(page);

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();

    // Shell is always present.
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();

    // Heading hierarchy never skips a level (h1 -> h2 -> h3 ...).
    const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (nodes) =>
      nodes.map((node) => Number(node.tagName.slice(1))),
    );
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      const step = (levels[i] ?? 0) - (levels[i - 1] ?? 0);
      expect(step, `heading level jumps at index ${i} (${levels.join(",")})`).toBeLessThanOrEqual(1);
    }

    expect(errors).toEqual([]);
  });
}

test("unknown property slug returns the honest branded 404", async ({ page }) => {
  const response = await page.goto("/properties/example-home");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "We could not find that page." })).toBeVisible();
});

test("unknown insight slug returns the honest branded 404", async ({ page }) => {
  const response = await page.goto("/insights/example-article");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "We could not find that page." })).toBeVisible();
});

test("WhatsApp links use the international wa.me href with the UK display number", async ({
  page,
}) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  const whatsappLink = footer.getByRole("link", { name: "Message us on WhatsApp" }).first();
  await expect(whatsappLink).toHaveAttribute("href", "https://wa.me/447300856675");
  await expect(footer.getByText("WhatsApp 07300 856675").first()).toBeVisible();
});

test("obsolete brand content never appears", async ({ page }) => {
  for (const path of ["/", "/about", "/contact"]) {
    await page.goto(path);
    const content = (await page.content()).toLowerCase();
    expect(content).not.toContain("lets move");
  }
});
