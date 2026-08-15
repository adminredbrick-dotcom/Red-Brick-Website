/**
 * Route registry and navigation structure.
 * Every public route is declared here; navigation, the footer, tests and
 * (later) the sitemap derive from this single registry.
 */

export interface RouteDef {
  readonly path: string;
  readonly label: string;
  /** Unique page title (template appends the site name). */
  readonly title: string;
  readonly description: string;
}

export const routes = {
  home: {
    path: "/",
    label: "Home",
    title: "Property cared for. People looked after.",
    description:
      "Residential lettings and property management across Peterborough, with clear guidance for landlords and tenants. Established in 2012.",
  },
  properties: {
    path: "/properties",
    label: "Properties",
    title: "Properties to rent in Peterborough",
    description:
      "Browse homes to rent across Peterborough with clear costs, features and availability information.",
  },
  propertyDetail: {
    path: "/properties/[slug]",
    label: "Property details",
    title: "Property details",
    description: "Detailed information about a Red Brick Lettings property.",
  },
  landlords: {
    path: "/landlords",
    label: "Landlords",
    title: "Lettings and property management for landlords",
    description:
      "How we help Peterborough landlords let, manage and care for residential property — from preparation to ongoing maintenance coordination.",
  },
  rentalAppraisal: {
    path: "/rental-appraisal",
    label: "Rental appraisal",
    title: "What could your property rent for?",
    description:
      "Request an indicative rental estimate for your Peterborough property, confirmed by Red Brick Lettings after a proper review.",
  },
  tenants: {
    path: "/tenants",
    label: "Tenants",
    title: "Find and live in a well-cared-for home",
    description:
      "Find a home in Peterborough and understand the costs, the moving-in process and how to reach us during your tenancy.",
  },
  maintenance: {
    path: "/maintenance",
    label: "Maintenance",
    title: "Report a repair and how maintenance works",
    description:
      "Our maintenance journey: report, triage, arrange, update and resolve — with clear routes for tenants and landlords.",
  },
  insights: {
    path: "/insights",
    label: "Insights",
    title: "Insights and guidance",
    description:
      "Practical guidance for landlords and tenants, plus Peterborough property insight from Red Brick Lettings.",
  },
  insightDetail: {
    path: "/insights/[slug]",
    label: "Article",
    title: "Article",
    description: "An article from Red Brick Lettings.",
  },
  about: {
    path: "/about",
    label: "About",
    title: "About Red Brick Lettings",
    description:
      "Established in 2012, Red Brick Lettings provides residential lettings and property management across Peterborough.",
  },
  contact: {
    path: "/contact",
    label: "Contact",
    title: "Talk to Red Brick",
    description:
      "Message Red Brick Lettings on WhatsApp. Meetings are available by appointment.",
  },
  privacy: {
    path: "/privacy",
    label: "Privacy",
    title: "Privacy notice",
    description: "How Red Brick Lettings handles personal information.",
  },
  cookies: {
    path: "/cookies",
    label: "Cookies",
    title: "Cookie policy",
    description: "How this website uses cookies.",
  },
  terms: {
    path: "/terms",
    label: "Terms",
    title: "Terms of use",
    description: "Terms of use for the Red Brick Lettings website.",
  },
} as const satisfies Record<string, RouteDef>;

export type RouteKey = keyof typeof routes;

/** Primary header navigation, in wireframe order. */
export const primaryNav: readonly RouteKey[] = [
  "properties",
  "landlords",
  "tenants",
  "maintenance",
  "insights",
  "about",
];

/** Footer link groups. */
export const footerNav: Readonly<Record<string, readonly RouteKey[]>> = {
  Explore: ["properties", "landlords", "tenants", "maintenance"],
  Company: ["about", "insights", "contact", "rentalAppraisal"],
  Legal: ["privacy", "cookies", "terms"],
};

/** Concrete (non-dynamic) paths — used by tests and later the sitemap. */
export const staticPaths: readonly string[] = Object.values(routes)
  .map((r) => r.path)
  .filter((p) => !p.includes("["));
