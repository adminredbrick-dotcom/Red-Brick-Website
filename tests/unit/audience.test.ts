import { describe, expect, it } from "vitest";

import {
  AUDIENCE_STORAGE_KEY,
  audienceAnnouncement,
  audienceHref,
  parseAudience,
  parseStoredAudience,
  showFor,
} from "@/components/home/audience";
import { HOUSE_PARTS, HOUSE_STAGES } from "@/components/home/house-illustration";
import { introductionCopy } from "@/content/approved-copy";
import { trustIntro } from "@/content/home-copy";
import { landlordStory, sharedStory, storySets, tenantStory } from "@/content/house-story";

describe("parseAudience", () => {
  it("accepts the two explicit choices", () => {
    expect(parseAudience("landlord")).toBe("landlord");
    expect(parseAudience("tenant")).toBe("tenant");
  });

  it("falls back to the shared story for anything else", () => {
    expect(parseAudience(undefined)).toBe("none");
    expect(parseAudience("")).toBe("none");
    expect(parseAudience("owner")).toBe("none");
    expect(parseAudience("LANDLORD")).toBe("none");
    expect(parseAudience(42)).toBe("none");
  });

  it("uses the first value when the parameter is repeated", () => {
    expect(parseAudience(["tenant", "landlord"])).toBe("tenant");
    expect(parseAudience([])).toBe("none");
  });
});

describe("parseStoredAudience", () => {
  it("only trusts the two explicit choices from storage", () => {
    expect(parseStoredAudience("landlord")).toBe("landlord");
    expect(parseStoredAudience("tenant")).toBe("tenant");
    expect(parseStoredAudience("none")).toBeNull();
    expect(parseStoredAudience(null)).toBeNull();
    expect(parseStoredAudience("anything")).toBeNull();
  });

  it("uses a session-only key, never a cookie", () => {
    expect(AUDIENCE_STORAGE_KEY).toBe("rb-audience");
  });
});

describe("audienceHref", () => {
  it("builds the no-JavaScript links", () => {
    expect(audienceHref("landlord")).toBe("/?audience=landlord");
    expect(audienceHref("tenant", "house-story")).toBe("/?audience=tenant#house-story");
    expect(audienceHref("none", "#next-step")).toBe("/#next-step");
  });
});

describe("audienceAnnouncement", () => {
  it("always says the other route stays available", () => {
    expect(audienceAnnouncement("landlord")).toContain("tenant route stays available");
    expect(audienceAnnouncement("tenant")).toContain("landlord route stays available");
    expect(audienceAnnouncement("none")).toContain("both routes");
  });
});

describe("showFor visibility classes", () => {
  it("hides each set for exactly the other two states", () => {
    expect(showFor.none).toContain("in-data-[audience=landlord]:hidden");
    expect(showFor.none).toContain("in-data-[audience=tenant]:hidden");
    expect(showFor.none).not.toContain("in-data-[audience=none]:hidden");

    expect(showFor.landlord).toContain("in-data-[audience=none]:hidden");
    expect(showFor.landlord).toContain("in-data-[audience=tenant]:hidden");
    expect(showFor.landlord).not.toContain("in-data-[audience=landlord]:hidden");

    expect(showFor.tenant).toContain("in-data-[audience=none]:hidden");
    expect(showFor.tenant).toContain("in-data-[audience=landlord]:hidden");
    expect(showFor.tenant).not.toContain("in-data-[audience=tenant]:hidden");
  });
});

describe("house story content", () => {
  it("has the storyboard's exact landlord and tenant chapters", () => {
    expect(landlordStory.chapters.map((c) => c.heading)).toEqual([
      "Start with a clear picture.",
      "Present the home clearly.",
      "Keep the tenancy connected.",
      "Look after what happens next.",
    ]);
    expect(landlordStory.closing.heading).toBe("Your property is in good hands.");
    expect(landlordStory.closing.actions[0]?.label).toBe("Request a rental appraisal");

    expect(tenantStory.chapters.map((c) => c.heading)).toEqual([
      "Find the right next step.",
      "Know the home before you commit.",
      "Make the move clearer.",
      "Know how to reach us.",
    ]);
    expect(tenantStory.closing.heading).toBe("A good property should feel easy to live in.");
    expect(tenantStory.closing.actions[0]?.label).toBe("View available properties");
  });

  it("gives the shared story four neutral chapters and both actions", () => {
    expect(sharedStory.chapters.map((c) => c.name)).toEqual([
      "Property",
      "People",
      "Communication",
      "Care",
    ]);
    expect(sharedStory.closing.actions).toHaveLength(2);
  });

  it("maps chapters to house stages 1–4 and closings to stage 5", () => {
    for (const set of storySets) {
      expect(set.chapters.map((c) => c.stage)).toEqual([1, 2, 3, 4]);
      expect(set.closing.stage).toBe(5);
    }
  });

  it("never uses banned claims", () => {
    const banned = /best|leading|excellent|cheapest|guarantee|24\/7|award|review/i;
    for (const set of storySets) {
      for (const chapter of set.chapters) {
        expect(`${chapter.heading} ${chapter.body}`).not.toMatch(banned);
      }
      expect(`${set.closing.heading} ${set.closing.body ?? ""}`).not.toMatch(banned);
    }
  });
});

describe("house illustration stages", () => {
  it("places every part in every stage", () => {
    for (const stage of [0, 1, 2, 3, 4, 5] as const) {
      for (const part of HOUSE_PARTS) {
        expect(HOUSE_STAGES[stage][part]).toBeDefined();
      }
    }
  });

  it("is exploded at stage 0 and fully assembled by stage 4", () => {
    const exploded = HOUSE_STAGES[0];
    expect(exploded.roof.y).toBeLessThan(0);
    expect(exploded.walls.x).not.toBe(0);
    expect(exploded.lights.opacity).toBe(0);

    for (const part of HOUSE_PARTS) {
      if (part === "halo" || part === "markers") continue;
      expect(HOUSE_STAGES[4][part]).toEqual({ x: 0, y: 0, opacity: 1 });
      expect(HOUSE_STAGES[5][part]).toEqual({ x: 0, y: 0, opacity: 1 });
    }
    expect(HOUSE_STAGES[5].halo.opacity).toBe(1);
  });
});

describe("home copy", () => {
  it("splits the approved introduction without changing a word", () => {
    expect(`${trustIntro.heading} ${trustIntro.body}`).toBe(introductionCopy);
  });
});
