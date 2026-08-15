/**
 * Homepage audience personalisation — pure logic shared by the server page,
 * the client island and the unit tests.
 *
 * The chosen audience only reorders and emphasises later homepage sections;
 * it never hides the other route entirely (SITEMAP-AND-USER-FLOWS.md,
 * "Audience-selection behaviour"). The value lives in the URL (`?audience=`)
 * for the no-JavaScript path and in sessionStorage for the current session
 * only — never in a cookie.
 */

export const AUDIENCES = ["landlord", "tenant", "none"] as const;
export type Audience = (typeof AUDIENCES)[number];

/** Query-string parameter read by the server page (`/?audience=landlord`). */
export const AUDIENCE_PARAM = "audience";

/** sessionStorage key — session-only preference, no cookie. */
export const AUDIENCE_STORAGE_KEY = "rb-audience";

/** Attribute set on the homepage wrapper; CSS attribute rules key off it. */
export const AUDIENCE_ATTRIBUTE = "data-audience";

/**
 * Normalises any query value into a safe audience. Unknown, missing or
 * repeated values fall back to "none" (the shared story).
 */
export function parseAudience(value: unknown): Audience {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "landlord" || candidate === "tenant") return candidate;
  return "none";
}

/** Reads a stored session preference; only the two explicit choices count. */
export function parseStoredAudience(value: string | null | undefined): Audience | null {
  if (value === "landlord" || value === "tenant") return value;
  return null;
}

/**
 * Builds the no-JavaScript href for a switch/choice control. "none" clears
 * the parameter so the shared story returns; a hash keeps the visitor at the
 * section they were reading.
 */
export function audienceHref(audience: Audience, hash?: string): string {
  const query = audience === "none" ? "" : `?${AUDIENCE_PARAM}=${audience}`;
  const fragment = hash ? `#${hash.replace(/^#/, "")}` : "";
  return `/${query}${fragment}`;
}

/** Polite live-region wording after a choice is made with JavaScript. */
export function audienceAnnouncement(audience: Audience): string {
  switch (audience) {
    case "landlord":
      return "Showing the landlord view. The tenant route stays available — use Switch view to change.";
    case "tenant":
      return "Showing the tenant view. The landlord route stays available — use Switch view to change.";
    default:
      return "Showing the shared view with both routes.";
  }
}

/**
 * Tailwind classes that show an element only for the given audiences.
 * Kept as complete literal strings so Tailwind's scanner sees them.
 * Default (no choice, no JavaScript, no parameter) is "none".
 */
export const showFor = {
  /** Visible only in the shared / no-selection state. */
  none: "in-data-[audience=landlord]:hidden in-data-[audience=tenant]:hidden",
  landlord: "in-data-[audience=none]:hidden in-data-[audience=tenant]:hidden",
  tenant: "in-data-[audience=none]:hidden in-data-[audience=landlord]:hidden",
  /** Visible whenever a specific audience has been chosen. */
  chosen: "in-data-[audience=none]:hidden",
} as const satisfies Record<string, string>;
