import { describe, expect, it } from "vitest";

import { whatsappHref } from "@/lib/whatsapp";

describe("whatsappHref", () => {
  it("builds the international wa.me link from the configured number", () => {
    expect(whatsappHref()).toBe("https://wa.me/447300856675");
  });

  it("strips all non-digits from an E.164 input", () => {
    expect(whatsappHref("+44 7300 856675")).toBe("https://wa.me/447300856675");
  });

  it("appends an encoded prefilled message when provided", () => {
    expect(whatsappHref(undefined, "Hello Red Brick")).toBe(
      "https://wa.me/447300856675?text=Hello%20Red%20Brick",
    );
  });
});
