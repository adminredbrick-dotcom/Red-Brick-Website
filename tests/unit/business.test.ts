import { describe, expect, it } from "vitest";

import { business } from "@/config/business";

describe("business configuration (single source of confirmed facts)", () => {
  it("uses the exact public name", () => {
    expect(business.name).toBe("Red Brick Lettings");
  });

  it("uses the exact tagline", () => {
    expect(business.tagline).toBe("Property cared for. People looked after.");
  });

  it("records establishment in 2012 and the Peterborough scope", () => {
    expect(business.establishedYear).toBe(2012);
    expect(business.serviceArea).toBe("Peterborough");
  });

  it("holds the confirmed WhatsApp number in both display and E.164 forms", () => {
    expect(business.whatsapp.displayNumber).toBe("07300 856675");
    expect(business.whatsapp.e164).toBe("+447300856675");
  });

  it("never contains the obsolete brand name", () => {
    const serialized = JSON.stringify(business).toLowerCase();
    expect(serialized).not.toContain("lets move");
  });

  it("keeps unconfirmed facts null rather than invented", () => {
    expect(business.email).toBeNull();
    expect(business.telephone).toBeNull();
    expect(business.domain).toBeNull();
    expect(business.openingHours).toBeNull();
    expect(business.address).toBeNull();
    expect(Object.values(business.regulatory).every((value) => value === null)).toBe(true);
  });
});
