import { expect, test } from "@playwright/test";

import { collectConsoleErrors, expectNoSeriousAxeViolations } from "./helpers";

test.describe("production homepage — structure and hero", () => {
  test("renders the approved section order with live HTML text and actions", async ({ page }) => {
    const errors = collectConsoleErrors(page);
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Property cared for. People looked after.");

    // Section order (aria-labelledby ids in document order).
    const order = await page.$$eval("main section[aria-labelledby]", (nodes) => nodes.map((n) => n.getAttribute("aria-labelledby")));
    expect(order.slice(0, 8)).toEqual([
      "hero-heading",
      "intro-heading",
      "house-story-heading",
      "after-story",
      "tools-heading",
      "maintenance-heading",
      "insights-heading",
      "closing-heading",
    ]);
    await expect(page.getByRole("contentinfo")).toBeVisible();

    // The three hero actions are real HTML links, present in the server HTML.
    const html = await page.content();
    expect(html).toContain("I’m a landlord");
    expect(html).toContain("I’m looking for a home");
    expect(html).toContain("View properties");
    const actions = page.getByRole("list", { name: "Where would you like to start?" });
    await expect(actions.getByRole("link", { name: /I’m a landlord/ })).toHaveAttribute("href", "#house-story");
    await expect(actions.getByRole("link", { name: /I’m looking for a home/ })).toHaveAttribute("href", "#house-story");
    await expect(actions.getByRole("link", { name: "View properties" })).toHaveAttribute("href", "/properties");
    // Separate labelled links to the full pages.
    await expect(page.getByRole("link", { name: "Landlords page" })).toHaveAttribute("href", "/landlords");
    await expect(page.getByRole("link", { name: "Tenants page" })).toHaveAttribute("href", "/tenants");

    // Heading levels never skip.
    const levels = await page.$$eval("h1, h2, h3, h4, h5, h6", (nodes) => nodes.map((n) => Number(n.tagName.slice(1))));
    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) expect((levels[i] ?? 0) - (levels[i - 1] ?? 0)).toBeLessThanOrEqual(1);

    // Meeting wording correction applied everywhere.
    expect(html).not.toContain("Meetings are available by appointment");
    expect(html).toContain("Ask us about arranging a meeting.");
    expect(errors).toEqual([]);
  });

  test("hero media is a poster-first image (LCP) and never a looping video", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("section[aria-labelledby='hero-heading']");
    const poster = hero.locator("img").first();
    await expect(poster).toBeVisible();
    await expect(poster).toHaveAttribute("fetchpriority", "high");
    await expect(poster).toHaveAttribute("loading", "eager");
    await expect(poster).toHaveAttribute("src", /\/media\/posters\/hero-12217554\.webp/);
    // No derivatives exist yet, so no <video> anywhere; when they do, it must never loop.
    const loops = await page.$$eval("video", (v) => v.filter((x) => x.hasAttribute("loop")).length);
    expect(loops).toBe(0);
    await expect(hero.getByText("Illustrative stock footage.")).toBeVisible();
    // Never described as Peterborough / a Red Brick property / an available home.
    const captionText = (await hero.locator("figure").innerText()).toLowerCase();
    expect(captionText).not.toMatch(/peterborough|red brick property|available/);
    // No 4K master or video request.
    const requests: string[] = [];
    page.on("request", (r) => requests.push(r.url()));
    await page.reload();
    expect(requests.filter((u) => /\.(mp4|webm|mov)(\?|$)/.test(u))).toEqual([]);
  });

  test("scroll-led media story: five posters, each labelled, one active at a time controller present", async ({ page }) => {
    await page.goto("/");
    const beats = page.getByRole("list", { name: "The story in pictures" }).getByRole("listitem");
    await expect(beats).toHaveCount(5);
    for (const beat of await beats.all()) {
      await expect(beat.getByText("Illustrative stock footage.")).toBeVisible();
      await expect(beat.locator("img")).toHaveAttribute("src", /\/media\/posters\/story-\d+\.webp/);
      const state = await beat.locator("[data-media-state]").getAttribute("data-media-state");
      expect(state).toBe("poster");
    }
    // At most one video could ever be playing: there is no autoplay/loop attribute anywhere.
    expect(await page.$$eval("video[autoplay], video[loop]", (v) => v.length)).toBe(0);
  });

  test("Phase 2 previews and practical sections are wired with demonstration labels", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Homes to rent across Peterborough" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Featured properties" }).locator("article")).toHaveCount(3);
    // Portfolio records are real (street + district only): no fictional label anywhere on the page.
    await expect(page.getByText("Demonstration listing — not a real property.")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "What could your property rent for?" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Move-in costs explained" })).toBeVisible();
    await expect(page.getByText("Illustrative estimate — not a valuation.").first()).toBeVisible();
    await expect(page.getByText(/no rent can be requested or accepted before the tenancy agreement is signed/i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Guide to the Renters' Rights Act/ })).toHaveAttribute("href", /gov\.uk/);
    await expect(page.getByRole("list", { name: "Maintenance steps" }).getByRole("listitem")).toHaveCount(5);
    await expect(page.getByRole("heading", { name: "Guidance for landlords, tenants and Peterborough" })).toBeVisible();
    await expect(page.locator("section[aria-labelledby='closing-heading']").getByRole("link", { name: /Message us on WhatsApp/ })).toHaveAttribute(
      "href",
      "https://wa.me/447300856675",
    );
    // noindex retained.
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("audience choice keeps the visitor on the homepage, personalises the story and stores only the choice in sessionStorage", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#house-story");
    await expect(section).toHaveAttribute("data-story-active", "neutral");
    await page.getByRole("link", { name: /I’m a landlord/ }).click();
    await expect(page).toHaveURL(/\/#house-story$/); // in-page anchor only, no query string
    await expect(section).toHaveAttribute("data-story-active", "landlord");
    await expect(page.getByRole("heading", { name: "One house, one let — six chapters for landlords" })).toBeVisible();
    await expect(section.locator("[data-story-variant='landlord']")).toBeVisible();
    await expect(section.locator("[data-story-variant='neutral']")).toBeHidden();
    const storage = await page.evaluate(() => ({ session: Object.fromEntries(Object.entries(sessionStorage)), local: Object.keys(localStorage), cookies: document.cookie }));
    expect(storage.session).toEqual({ "rb-story": "landlord" });
    expect(storage.local).toEqual([]);
    expect(storage.cookies).toBe("");
    // Survives reload within the session.
    await page.reload();
    await expect(page.locator("#house-story")).toHaveAttribute("data-story-active", "landlord");
    // Switch story control switches and clears when neutral.
    const group = page.getByRole("group", { name: "Switch story" });
    await group.getByRole("button", { name: "Tenant" }).click();
    await expect(page.locator("#house-story")).toHaveAttribute("data-story-active", "tenant");
    await expect(group.getByRole("button", { name: "Tenant" })).toHaveAttribute("aria-pressed", "true");
    await group.getByRole("button", { name: "Neutral" }).click();
    expect(await page.evaluate(() => sessionStorage.getItem("rb-story"))).toBeNull();
    // No analytics/CRM/tracking requests were made.
    const thirdParty = await page.evaluate(() => performance.getEntriesByType("resource").map((e) => e.name).filter((n) => !n.startsWith(location.origin)));
    expect(thirdParty).toEqual([]);
  });

  test("Skip the house story is a real anchor that moves focus to the heading after the chapter", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: "Skip the house story" });
    await expect(skip).toHaveAttribute("href", "#after-story");
    await skip.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#after-story$/);
    const focused = await page.evaluate(() => document.activeElement?.id ?? null);
    expect(focused).toBe("after-story");
    await expect(page.locator("#after-story")).toHaveText("Homes to rent across Peterborough");
  });

  test("keyboard: story controls reachable, canvas never focusable, focus visible", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Skip the house story" }).focus();
    const outline = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      return { style: s.outlineStyle, width: parseFloat(s.outlineWidth) };
    });
    expect(outline.style).not.toBe("none");
    expect(outline.width).toBeGreaterThan(0);
    // Every canvas (if any) is aria-hidden and out of the tab order.
    const canvases = await page.$$eval("canvas", (cs) => cs.map((c) => ({ tabindex: c.getAttribute("tabindex"), hidden: c.closest("[aria-hidden='true']") !== null })));
    for (const c of canvases) {
      expect(c.hidden).toBe(true);
      expect(c.tabindex).toBe("-1");
    }
  });

  test("axe finds no serious or critical violations on the homepage", async ({ page }) => {
    await page.goto("/");
    await expectNoSeriousAxeViolations(page);
  });
});
