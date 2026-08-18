/**
 * Editorial content contract (data/CMS-AND-LISTING-MODELS.md → "Blog
 * article", "Standard page → FAQs"). The site renders from these shapes only;
 * a Sanity (or any CMS) adapter maps its documents onto them without touching
 * the pages (see `repository.ts` and docs/CONTENT-EDITING.md).
 */

export const articleCategories = ["landlords", "tenants", "peterborough", "maintenance", "property-guidance"] as const;
export type ArticleCategory = (typeof articleCategories)[number];

export const articleCategoryLabels: Record<ArticleCategory, string> = {
  landlords: "Landlords",
  tenants: "Tenants",
  peterborough: "Peterborough",
  maintenance: "Maintenance",
  "property-guidance": "Property guidance",
};

export interface Source {
  readonly label: string;
  readonly href: string;
  /** ISO date the source was last read. */
  readonly retrievedOn: string;
}

/** Portable body blocks — simple enough for any editor to produce and any renderer to show. */
export type Block =
  | { readonly type: "paragraph"; readonly text: string }
  | { readonly type: "heading"; readonly text: string; readonly id?: string }
  | { readonly type: "list"; readonly items: readonly string[]; readonly ordered?: boolean }
  | { readonly type: "callout"; readonly title: string; readonly text: string; readonly tone?: "note" | "attention" }
  | { readonly type: "link"; readonly label: string; readonly href: string; readonly text?: string };

export type ReviewStatus = "draft" | "reviewed";

export interface Article {
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly category: ArticleCategory;
  readonly tags: readonly string[];
  /** Defaults to the company name in the CMS model. */
  readonly author: string;
  /** ISO dates. */
  readonly publishedOn: string;
  readonly reviewedOn: string;
  /** "draft" renders a visible "awaiting Red Brick review" note; only "reviewed" articles are indexable at launch. */
  readonly reviewStatus: ReviewStatus;
  readonly body: readonly Block[];
  readonly sources: readonly Source[];
  readonly related: readonly string[];
  /** Short line for the social preview / share sheet. */
  readonly socialCaption: string;
  /** Cover image: null until an approved, rights-cleared image exists (never stock or AI as a stand-in). */
  readonly cover: { readonly src: string; readonly alt: string } | null;
}

export interface Faq {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  /** Where the answer came from (approved copy, GOV.UK guidance, site behaviour). */
  readonly basis: string;
}

export interface FaqGroup {
  readonly key: "landlords" | "tenants" | "maintenance";
  readonly heading: string;
  readonly reviewedOn: string;
  readonly items: readonly Faq[];
}
