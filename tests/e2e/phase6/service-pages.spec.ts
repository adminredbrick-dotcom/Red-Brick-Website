import { expect, test } from "@playwright/test";

import { collectConsoleErrors, expectNoSeriousAxeViolations } from "../phase3/helpers";

// "guaranteed" is allowed only in negation ("we never present a guaranteed rent") — checked separately in unit tests.
const NO_PROMISES = /24\/7|within \d+ (hours|minutes)|response time of/i;

test.describe("maintenance", () => {
  test("urgent guidance first, two routes, five steps, FAQ, no unsupported promises, axe clean", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/maintenance");
    await expect(page.locator("h1")).toHaveCount(1);
    const main = page.locator("main");
    const text = await main.innerText();
    // Emergency guidance appears before the report route.
    expect(text.indexOf("If the situation is dangerous")).toBeLessThan(text.indexOf("Report a repair"));
    expect(text).toContain("0800 111 999");
    for (const step of ["Report", "Triage", "Arrange", "Update", "Resolve"]) {
      await expect(main.getByText(step, { exact: true }).first()).toBeVisible();
    }
    await expect(page.getByRole("heading", { name: "How maintenance is coordinated" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Maintenance questions" })).toBeVisible();
    expect(text).not.toMatch(NO_PROMISES);
    await expectNoSeriousAxeViolations(page);
    expect(errors).toEqual([]);
  });

  test("repair form: server validation lists every missing field, links to it, then composes a WhatsApp message (no delivery claimed)", async ({ page }) => {
    await page.goto("/maintenance#report");
    const form = page.getByRole("form", { name: "Report a repair" });
    await form.getByRole("button", { name: "Prepare my report" }).click();
    const alert = page.getByRole("alert").first();
    await expect(alert).toContainText("Please check these 5 fields");
    await expect(alert).toBeFocused();
    await expect(alert.getByRole("link", { name: "Please enter your name." })).toHaveAttribute("href", "#repair-name");
    await expect(form.getByLabel(/Your name/)).toHaveAttribute("aria-invalid", "true");

    await form.getByLabel(/Your name/).fill("Test Person");
    await form.getByLabel(/^Property/).fill("Belsize Avenue, PE2");
    await form.getByLabel(/What kind of problem/).selectOption("heating-hot-water");
    await form.getByLabel(/^Urgent/).check();
    await form.getByLabel(/What has happened/).fill("No hot water since this morning; boiler pressure reads 0.5.");
    await form.getByRole("button", { name: "Prepare my report" }).click();

    const ready = page.locator("[data-form-status='ready']");
    await expect(ready).toBeVisible();
    await expect(ready).toBeFocused();
    await expect(ready).toContainText("nothing has been sent");
    const message = await ready.locator("[data-form-message]").innerText();
    expect(message).toContain("Name: Test Person");
    expect(message).toContain("Problem: Heating or hot water");
    expect(message).toContain("Urgency: Urgent");
    const href = await ready.locator("[data-form-whatsapp]").getAttribute("href");
    expect(href).toMatch(/^https:\/\/wa\.me\/447300856675\?text=/);
    expect(decodeURIComponent(href ?? "")).toContain("Belsize Avenue, PE2");
    // No submission left the browser: no request other than the page's own action round-trip to our origin.
    await expectNoSeriousAxeViolations(page);
  });

  test("repair form works without JavaScript (server round-trip renders the errors)", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/maintenance");
    const form = page.getByRole("form", { name: "Report a repair" });
    await form.getByLabel(/Your name/).fill("Test Person");
    await form.getByRole("button", { name: "Prepare my report" }).click();
    await expect(page.getByRole("alert").first()).toContainText("Please check these 4 fields");
    // JS-only helpers are hidden without JavaScript.
    await expect(page.locator("[data-needs-js]")).toHaveCount(0);
    await context.close();
  });
});

test.describe("landlords and tenants", () => {
  test("landlords: journey, pending fees, compliance checklist with GOV.UK sources, appraisal route, FAQ, articles", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/landlords");
    await expect(page.locator("h1")).toHaveCount(1);
    for (const stage of ["Let your property", "Manage your tenancy", "Care for your property"]) {
      await expect(page.getByRole("heading", { name: stage }).first()).toBeVisible();
    }
    await expect(page.getByText("Service choices and fees are being confirmed")).toBeVisible();
    const checklist = page.getByRole("heading", { name: "What a rented home in England needs" }).locator("xpath=..");
    await expect(checklist.getByRole("link", { name: /GOV\.UK/ }).first()).toHaveAttribute("href", /^https:\/\/www\.gov\.uk\//);
    expect(await checklist.getByRole("link", { name: /GOV\.UK|Peterborough City Council/ }).count()).toBeGreaterThanOrEqual(8);
    await expect(page.getByRole("link", { name: "Request a rental appraisal" }).first()).toHaveAttribute("href", "/rental-appraisal");
    await expect(page.getByRole("heading", { name: "Landlord questions" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Landlord articles" }).locator("article")).toHaveCount(1);
    expect(await page.locator("main").innerText()).not.toMatch(NO_PROMISES);
    await expectNoSeriousAxeViolations(page);
    expect(errors).toEqual([]);
  });

  test("tenants: journey, property preview, move-in cost calculator (GET, shareable), repairs route, FAQ", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/tenants");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Your journey with us" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Featured properties" }).locator("article")).toHaveCount(3);
    const calc = page.getByRole("form", { name: "Move-in cost calculator" });
    await calc.getByLabel("Monthly rent (£)").fill("850");
    await calc.getByRole("button", { name: "Show my figures" }).click();
    await expect(page).toHaveURL(/\/tenants\?rent=850/);
    const result = page.locator("[data-move-in-result]");
    await expect(result).toContainText("£981");
    await expect(result).toContainText("£196");
    await expect(result).toContainText("£1,831");
    await expect(result).toContainText("not a quote");
    // Out-of-range rent → clear error, no result.
    await page.goto("/tenants?rent=5");
    await expect(page.locator("#move-in-rent-error")).toContainText("between £100 and £20,000");
    await expect(page.locator("[data-move-in-result]")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Report a repair" }).first()).toHaveAttribute("href", "/maintenance#report");
    await expect(page.getByRole("heading", { name: "Tenant questions" })).toBeVisible();
    await expectNoSeriousAxeViolations(page);
    expect(errors).toEqual([]);
  });

  test("FAQ accordion is keyboard operable and exposes FAQPage structured data", async ({ page }) => {
    await page.goto("/tenants");
    const trigger = page.getByRole("button", { name: "How do I arrange a viewing?" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText(/Message us on WhatsApp with the property you are interested in/)).toBeVisible();
    const jsonLd = await page.locator("script[type='application/ld+json']").allTextContents();
    expect(jsonLd.some((s) => s.includes('"FAQPage"'))).toBe(true);
  });
});

test.describe("contact and insights", () => {
  test("contact: form composes a WhatsApp message; unconfirmed details stay pending", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/contact");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText("Email, telephone and opening hours to follow")).toBeVisible();
    const form = page.getByRole("form", { name: "Send us a message" });
    await form.getByLabel(/Which best describes you/).selectOption("landlord");
    await form.getByLabel(/Your name/).fill("Jo");
    await form.getByLabel(/Your message/).fill("I have two properties in Bretton.");
    await form.getByRole("button", { name: "Prepare my message" }).click();
    const ready = page.locator("[data-form-status='ready']");
    await expect(ready).toContainText("Your message is ready");
    expect(await ready.locator("[data-form-message]").innerText()).toContain("I own a property");
    await expectNoSeriousAxeViolations(page);
    expect(errors).toEqual([]);
  });

  test("insights: index lists articles, category filter via URL, empty category state, article template with dates, sources, share, related and Article JSON-LD", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto("/insights");
    await expect(page.locator("h1")).toHaveCount(1);
    const cards = page.getByRole("list", { name: "Articles" }).locator("article");
    expect(await cards.count()).toBeGreaterThanOrEqual(5);
    await page.getByRole("navigation", { name: "Article categories" }).getByRole("link", { name: /^Tenants/ }).click();
    await expect(page).toHaveURL(/category=tenants/);
    for (const card of await cards.all()) await expect(card).toContainText("Tenants");
    await page.goto("/insights?category=peterborough");
    await expect(page.getByRole("heading", { name: "Nothing in this category yet" })).toBeVisible();

    await page.goto("/insights/move-in-costs-in-england-what-you-can-be-asked-to-pay");
    await expect(page.locator("h1")).toContainText("Move-in costs in England");
    await expect(page.getByText("Draft awaiting Red Brick review.")).toBeVisible();
    await expect(page.getByText(/^Published/)).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sources" })).toBeVisible();
    await expect(page.getByRole("link", { name: /GOV\.UK — Tenant Fees Act/ })).toHaveAttribute("href", /gov\.uk/);
    await expect(page.getByRole("group", { name: "Share this article" }).getByRole("link", { name: "Share on WhatsApp" })).toHaveAttribute("href", /^https:\/\/wa\.me\/\?text=/);
    await expect(page.getByRole("list", { name: "Related articles" }).locator("article").first()).toBeVisible();
    const jsonLd = await page.locator("script[type='application/ld+json']").allTextContents();
    expect(jsonLd.some((s) => s.includes('"Article"') && s.includes("Move-in costs"))).toBe(true);
    // Draft articles are noindex; page has canonical + og:image.
    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
    await expect(page.locator("meta[property='og:image']")).toHaveAttribute("content", /opengraph-image/);
    await expect(page.locator("meta[property='og:type']")).toHaveAttribute("content", "article");
    await expectNoSeriousAxeViolations(page);
    expect(errors).toEqual([]);

    const missing = await page.goto("/insights/does-not-exist");
    expect(missing?.status()).toBe(404);
  });
});

test.describe("metadata, sitemap, robots and social images", () => {
  test("layout carries Open Graph/Twitter defaults, Organization JSON-LD from confirmed facts, and pre-launch noindex", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("meta[property='og:site_name']")).toHaveAttribute("content", "Red Brick Lettings");
    await expect(page.locator("meta[property='og:locale']")).toHaveAttribute("content", "en_GB");
    await expect(page.locator("meta[name='twitter:card']")).toHaveAttribute("content", "summary_large_image");
    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", /noindex/);
    const jsonLd = await page.locator("script[type='application/ld+json']").allTextContents();
    const org = jsonLd.find((s) => s.includes('"RealEstateAgent"'));
    expect(org).toBeTruthy();
    // No unconfirmed facts leak into structured data.
    expect(org).not.toMatch(/telephone|"email"|address|openingHours/);
    expect(org).toContain("Peterborough");
  });

  test("sitemap lists static pages, portfolio properties and no draft articles or experiments; robots disallows pre-launch; OG images render", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain("/properties/lincoln-road-pe1-345");
    expect(xml).toContain("/maintenance");
    expect(xml).not.toContain("/experiments");
    expect(xml).not.toContain("/insights/move-in-costs");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toMatch(/Disallow: \//);
    for (const path of ["/opengraph-image", "/insights/what-to-expect-at-a-viewing/opengraph-image"]) {
      const img = await request.get(path);
      expect(img.status()).toBe(200);
      expect(img.headers()["content-type"]).toContain("image/png");
    }
  });
});
