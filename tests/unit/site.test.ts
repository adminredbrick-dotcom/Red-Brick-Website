import { describe, expect, it } from "vitest";

import { footerNav, primaryNav, routes, staticPaths } from "@/config/site";

const CORE_ROUTES = [
  "/",
  "/properties",
  "/properties/[slug]",
  "/landlords",
  "/rental-appraisal",
  "/tenants",
  "/maintenance",
  "/insights",
  "/insights/[slug]",
  "/about",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
];

describe("route registry", () => {
  it("declares exactly the locked core routes", () => {
    const declared = Object.values(routes).map((route) => route.path);
    expect(declared.sort()).toEqual([...CORE_ROUTES].sort());
  });

  it("has unique paths and titles", () => {
    const paths = Object.values(routes).map((route) => route.path);
    const titles = Object.values(routes).map((route) => route.title);
    expect(new Set(paths).size).toBe(paths.length);
    expect(new Set(titles).size).toBe(titles.length);
  });

  it("gives every route a non-empty description", () => {
    for (const route of Object.values(routes)) {
      expect(route.description.length).toBeGreaterThan(20);
    }
  });

  it("keeps primary navigation in the wireframe order", () => {
    expect(primaryNav).toEqual([
      "properties",
      "landlords",
      "tenants",
      "maintenance",
      "insights",
      "about",
    ]);
  });

  it("links every legal page from the footer", () => {
    expect(footerNav.Legal).toEqual(["privacy", "cookies", "terms"]);
  });

  it("exposes 12 concrete static paths (14 routes minus 2 dynamic)", () => {
    expect(staticPaths).toHaveLength(12);
    expect(staticPaths).not.toContain("/properties/[slug]");
    expect(staticPaths).not.toContain("/insights/[slug]");
  });
});
