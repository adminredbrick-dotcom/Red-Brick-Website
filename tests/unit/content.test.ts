import { describe, expect, it } from "vitest";

import { articles } from "@/lib/content/articles";
import { faqGroups } from "@/lib/content/faqs";
import { landlordRequirements, tenantJourney } from "@/lib/content/guidance";
import { LocalContentRepository, articleIndexable, contentRepository } from "@/lib/content/repository";
import { articleCategories } from "@/lib/content/types";
import { calculateMoveInCosts } from "@/lib/appraisal/move-in-costs";

// "within 30 days" is the deposit-protection law, not a service promise — days are allowed, hours/minutes are not.
const BANNED = /24\/7|guarantee|best price|cheapest|no.?risk|award|testimonial|rated \d|within \d+ (hours|minutes)/i;

describe("articles", () => {
  it("have unique slugs, valid categories, ISO dates, sources with retrieval dates and no banned claims", () => {
    expect(articles.length).toBeGreaterThanOrEqual(5);
    expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
    for (const a of articles) {
      expect(articleCategories).toContain(a.category);
      expect(a.publishedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(a.author).toBe("Red Brick Lettings");
      expect(a.cover).toBeNull(); // no stock/AI cover images
      for (const s of a.sources) {
        expect(s.href).toMatch(/^https:\/\//);
        expect(s.retrievedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
      const text = JSON.stringify(a);
      expect(text).not.toMatch(BANNED);
      // Related slugs must exist.
      for (const r of a.related) expect(articles.some((x) => x.slug === r)).toBe(true);
    }
    // Everything is a draft until Red Brick reviews it — and drafts are never indexable.
    for (const a of articles.filter((x) => x.reviewStatus === "draft")) expect(articleIndexable(a)).toBe(false);
  });

  it("the move-in worked example in the article matches the calculator", () => {
    const c = calculateMoveInCosts(850);
    expect(Math.round(c.tenancyDepositCap)).toBe(981);
    expect(Math.round(c.holdingDepositCap)).toBe(196);
    expect(Math.round(c.illustrativeTotal)).toBe(1831);
    const article = articles.find((a) => a.slug.startsWith("move-in-costs"))!;
    const example = JSON.stringify(article.body);
    expect(example).toContain("£981");
    expect(example).toContain("£196");
    expect(example).toContain("£1,831");
  });
});

describe("content repository", () => {
  it("lists newest first, filters by category, finds by slug and fills related to the limit", async () => {
    const repo = new LocalContentRepository();
    const all = await repo.articles();
    expect(all.length).toBe(articles.length);
    for (let i = 1; i < all.length; i += 1) expect(all[i - 1]!.publishedOn >= all[i]!.publishedOn).toBe(true);
    const tenants = await repo.articles("tenants");
    expect(tenants.every((a) => a.category === "tenants")).toBe(true);
    const one = await repo.article(all[0]!.slug);
    expect(one?.slug).toBe(all[0]!.slug);
    expect(await repo.article("nope")).toBeNull();
    const related = await repo.related(all[0]!, 3);
    expect(related.length).toBeLessThanOrEqual(3);
    expect(related.every((r) => r.slug !== all[0]!.slug)).toBe(true);
    expect(await contentRepository.faqs("tenants")).not.toBeNull();
    expect(await contentRepository.faqs("landlords")).not.toBeNull();
  });
});

describe("faqs and guidance", () => {
  it("every FAQ has a basis and no banned claims; guidance items carry sources", () => {
    for (const g of faqGroups) {
      expect(g.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Set(g.items.map((i) => i.id)).size).toBe(g.items.length);
      for (const item of g.items) {
        expect(item.basis.length).toBeGreaterThan(5);
        expect(item.answer).not.toMatch(BANNED);
      }
    }
    for (const item of landlordRequirements) expect(item.source.href).toMatch(/^https:\/\//);
    expect(tenantJourney.length).toBe(6);
  });
});
