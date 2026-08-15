import { expect, test, type Page } from "@playwright/test";

const PATH = "/rental-appraisal";
const REPORT_PATH = "/rental-appraisal?report=1";

const STEP_LEGENDS = [
  "Property location",
  "Property facts",
  "Condition and features",
  "Optional contact for confirmation",
];

function collectConsoleErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function fillForm(page: Page) {
  await page.getByLabel("Address or postcode").fill("PE1 (test)");
  await page.getByLabel("Property type").selectOption("semi-detached-house");
  await page.getByLabel("Bedrooms").selectOption("3");
  await page.getByLabel("Bathrooms").selectOption("1");
  await page.getByLabel("Condition", { exact: true }).selectOption("good");
  await page.getByLabel("Furnishing", { exact: true }).selectOption("unfurnished");
  await page.getByRole("group", { name: "Parking" }).getByLabel("Yes").check();
  await page.getByRole("group", { name: "Garden" }).getByLabel("Yes").check();
  await page.getByLabel("Optional details").fill("Test submission");
}

test.describe("rental appraisal journey", () => {
  test("renders the H1, the four numbered step legends and the demonstration notice", async ({
    page,
  }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(PATH);

    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { level: 1, name: "What could your property rent for?" }),
    ).toBeVisible();

    const form = page.locator("form#appraisal-form");
    await expect(form).toHaveAttribute("method", /get/i);
    // Exactly four top-level step fieldsets, each with a numbered legend.
    await expect(form.locator(":scope > div > fieldset")).toHaveCount(4);
    for (const [index, title] of STEP_LEGENDS.entries()) {
      const legend = form.locator("legend", { hasText: title }).first();
      await expect(legend).toBeVisible();
      await expect(legend).toContainText(`Step ${index + 1} of 4`);
    }

    // The honesty notice is visible BEFORE anything is submitted.
    await expect(page.getByText("This is a demonstration")).toBeVisible();
    await expect(page.getByText("does not yet calculate a live estimate")).toBeVisible();
    await expect(page.getByRole("button", { name: "Show an illustrative report" })).toBeVisible();

    // No report yet.
    await expect(page.locator("#illustrative-report")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test("every form control has an accessible label", async ({ page }) => {
    await page.goto(PATH);
    const unlabelled = await page.$$eval(
      "form#appraisal-form input:not([type=hidden]), form#appraisal-form select, form#appraisal-form textarea",
      (nodes) =>
        nodes
          .filter((node) => {
            const el = node as HTMLElement;
            const id = el.id;
            const hasFor = id ? document.querySelector(`label[for="${id}"]`) !== null : false;
            const wrapped = el.closest("label") !== null;
            return !(
              hasFor ||
              wrapped ||
              el.getAttribute("aria-label") ||
              el.getAttribute("aria-labelledby")
            );
          })
          .map((node) => (node as HTMLElement).outerHTML.slice(0, 80)),
    );
    expect(unlabelled).toEqual([]);
  });

  test("submitting the form (JavaScript on) shows the illustrative report", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(PATH);
    await fillForm(page);
    await page.getByRole("button", { name: "Show an illustrative report" }).click();

    await expect(page).toHaveURL(/report=1/);
    const report = page.locator("#illustrative-report");
    await expect(report).toBeVisible();
    await expect(
      report.getByText(/^Demonstration report\. Every figure below is illustrative sample data/),
    ).toBeVisible();
    await expect(report.getByText(/Indicative rent:/)).toBeVisible();
    await expect(report.getByText(/not a formal valuation/).first()).toBeVisible();

    // The form keeps the submitted property values (continuous journey), never contact fields.
    await expect(page.getByLabel("Address or postcode")).toHaveValue("PE1 (test)");
    await expect(page.getByLabel("Property type")).toHaveValue("semi-detached-house");
    expect(errors).toEqual([]);
  });

  test("?report=1 shows the report directly with the exact result wording", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    await page.goto(REPORT_PATH);

    const report = page.locator("#illustrative-report");
    await expect(report).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(
      report.getByRole("heading", { level: 2, name: "Illustrative report" }),
    ).toBeVisible();
    await expect(
      report.getByText("Indicative rent: £950–£1,100 per calendar month", { exact: true }),
    ).toBeVisible();
    await expect(
      report.getByText(
        /Based on comparable properties and market data available on .+ This is an estimate, not a formal valuation or guarantee of achievable rent\. Property condition, specification, demand, tenancy terms and legal requirements can affect the final figure\. Red Brick Lettings will confirm its recommendation after reviewing the property\./,
      ),
    ).toBeVisible();
    await expect(report.getByText("6 comparable properties considered")).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("completed-sale context is separate and explicitly not rent", async ({ page }) => {
    await page.goto(REPORT_PATH);
    const sales = page.locator("#report-completed-sales");
    await expect(
      sales.getByRole("heading", { level: 3, name: "Completed-sale context" }),
    ).toBeVisible();
    await expect(
      sales.getByText("Sold prices are shown for context only and are not rent."),
    ).toBeVisible();
    // Sold prices never appear inside the indicative rent module.
    await expect(page.locator("#report-rent")).not.toContainText("£235,000");
    await expect(sales).toContainText("£235,000");
  });

  test("crime context is neutral: categories, limitations, no safe/unsafe label", async ({
    page,
  }) => {
    await page.goto(REPORT_PATH);
    const crime = page.locator("#report-crime");
    await expect(
      crime.getByRole("heading", { level: 3, name: "Neutral crime context" }),
    ).toBeVisible();
    await expect(crime.getByText(/does not prove/)).toBeVisible();
    await expect(crime.getByText(/approximate/).first()).toBeVisible();
    await expect(crime.getByRole("table")).toBeVisible();

    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Safe area");
    expect(body).not.toContain("Unsafe");
    expect(body).not.toMatch(/\bgood area\b|\bbad area\b|\bscore\b/i);
  });

  test("scenarios are labelled illustrative, not forecasts", async ({ page }) => {
    await page.goto(REPORT_PATH);
    const scenarios = page.locator("#report-scenarios");
    await expect(
      scenarios.getByText(/not forecasts, guarantees, returns or financial advice/),
    ).toBeVisible();
    await expect(scenarios.getByRole("table")).toBeVisible();
    await expect(scenarios.getByRole("rowheader", { name: "One year" })).toBeVisible();
    await expect(scenarios.getByRole("rowheader", { name: "Three years" })).toBeVisible();
  });

  test("the result ends with a verified-appraisal WhatsApp CTA and human review state", async ({
    page,
  }) => {
    await page.goto(REPORT_PATH);
    const cta = page.getByRole("link", { name: "Request a verified rental appraisal" });
    await expect(cta).toBeVisible();
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me/447300856675");
    expect(href).toContain(encodeURIComponent("request a rental appraisal"));
    await expect(page.locator("#report-next-step")).toContainText("Not yet requested");
    await expect(page.locator("#report-next-step")).toContainText(
      "Meetings are available by appointment.",
    );
  });

  test("an unavailable module renders its honest state", async ({ page }) => {
    await page.goto(REPORT_PATH);
    const demand = page.locator("#report-demand");
    await expect(demand.getByText("Not available")).toBeVisible();
    await expect(demand.getByText(/No configured data source/)).toBeVisible();
  });

  test("licensing shows the cautious flag and the council link", async ({ page }) => {
    await page.goto(REPORT_PATH);
    const licensing = page.locator("#report-licensing");
    await expect(licensing.getByText("This property may require a licence")).toBeVisible();
    const link = licensing.getByRole("link", { name: /selective-licensing guidance/ });
    await expect(link).toHaveAttribute(
      "href",
      "https://www.peterborough.gov.uk/residents/housing/selective-licensing/selective-licensing-overview",
    );
    await expect(licensing).toContainText("cannot be definitive");
  });

  test("every figure prints its source metadata line", async ({ page }) => {
    await page.goto(REPORT_PATH);
    const metaLines = page.locator("#illustrative-report dl", { hasText: "Source:" });
    expect(await metaLines.count()).toBeGreaterThanOrEqual(6);
    const first = metaLines.first();
    await expect(first).toContainText("Illustrative sample data");
    await expect(first).toContainText("Geography:");
    await expect(first).toContainText("Observed:");
    await expect(first).toContainText("Retrieved:");
    await expect(first).toContainText("Quality:");
    await expect(first).toContainText("Kind:");
  });

  test("heading hierarchy has no skips with the report shown", async ({ page }) => {
    await page.goto(REPORT_PATH);
    const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (nodes) =>
      nodes.map((node) => Number(node.tagName.slice(1))),
    );
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect((levels[i] ?? 0) - (levels[i - 1] ?? 0)).toBeLessThanOrEqual(1);
    }
  });
});

test.describe("rental appraisal at 320px", () => {
  test.use({ viewport: { width: 320, height: 720 } });

  test("no horizontal overflow with the report shown", async ({ page }) => {
    await page.goto(REPORT_PATH);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("rental appraisal without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("submitting the plain GET form still shows the illustrative report", async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByText("This is a demonstration")).toBeVisible();
    await fillForm(page);
    await page.getByRole("button", { name: "Show an illustrative report" }).click();
    await page.waitForURL(/report=1/);

    const report = page.locator("#illustrative-report");
    await expect(report).toBeVisible();
    await expect(report.getByText(/Indicative rent:/)).toBeVisible();
    await expect(report.getByText(/not a formal valuation/).first()).toBeVisible();
    await expect(
      page.locator("#report-demand").getByText(/No configured data source/),
    ).toBeVisible();
  });
});
