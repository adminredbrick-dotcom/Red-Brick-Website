/**
 * Copy for the indicative rental estimate journey and illustrative report.
 *
 * Wording rules (CLAUDE.md, prompts/MASTER-BUILD-BRIEF.md, data/DATA-SOURCE-PLAN.md):
 * "indicative", "estimate", "illustrative" — never a valuation, guarantee,
 * forecast or return; crime context is never a safe/unsafe label or a score.
 * The result wording pattern below is the approved one and must be kept.
 */

export const appraisalIntroCopy = {
  eyebrow: "Indicative rental estimate",
  heading: "What could your property rent for?",
  lede: "An indicative rental estimate is a starting point, not a valuation. We confirm our recommendation after reviewing the property, its condition and the current market.",
  exampleLink: "See an example report",
  exampleLinkHint: "Skip the form and view the illustrative sample report.",
} as const;

export const appraisalFormCopy = {
  heading: "Tell us about the property",
  intro:
    "Four short steps. Only the property facts are needed for an estimate; contact details are optional and only matter if you would like us to confirm the figure.",
  steps: [
    {
      title: "Property location",
      hint: "An address or postcode is enough. We only ever show an approximate area publicly.",
    },
    {
      title: "Property facts",
      hint: "Type, bedrooms and bathrooms shape the comparables we would look at.",
    },
    {
      title: "Condition and features",
      hint: "Honest condition and features help us explain the range, not just quote it.",
    },
    {
      title: "Optional contact for confirmation",
      hint: "Leave this blank if you only want to see the sample report.",
    },
  ],
  demoNotice: {
    title: "This is a demonstration",
    body: "The tool does not yet calculate a live estimate. Whatever you enter, submitting the form returns the same illustrative sample report so that you can see the format. Nothing is calculated, no enquiry reaches us and contact details typed here are not stored. To ask us for a real appraisal, use the WhatsApp link at the end of the report.",
  },
  submit: "Show an illustrative report",
  reset: "Clear the form",
} as const;

export const reportCopy = {
  heading: "Illustrative report",
  sampleNote:
    "This sample report describes a fixed illustrative property — a three-bedroom semi-detached house in good condition, unfurnished, with parking and a garden — not the details you entered.",
  backToForm: "Back to the form",
  modules: {
    indicativeRent: "Indicative rent",
    rentTrend: "Peterborough rental trend",
    completedSales: "Completed-sale context",
    demand: "Rental demand context",
    licensing: "Licensing",
    crime: "Neutral crime context",
    amenities: "Amenities and transport",
    considerations: "Property strengths and practical considerations",
    scenarios: "Illustrative one-year and three-year scenarios",
    nextStep: "Next step",
  },
  /**
   * Approved result wording pattern (MASTER-BUILD-BRIEF, "Indicative rental estimate").
   * The lead line carries "£X–£Y"; `evidenceDate` replaces "[date]".
   */
  indicativeRentWording: (evidenceDate: string) =>
    `Based on comparable properties and market data available on ${evidenceDate}. This is an estimate, not a formal valuation or guarantee of achievable rent. Property condition, specification, demand, tenancy terms and legal requirements can affect the final figure. Red Brick Lettings will confirm its recommendation after reviewing the property.`,
  indicativeRentLead: (range: string) => `Indicative rent: ${range} per calendar month`,
  comparables: (count: number) =>
    `${count} comparable ${count === 1 ? "property" : "properties"} considered`,
  confidenceLabel: "Confidence",
  rentTrendIntro:
    "How typical rents for similar homes have moved over recent periods. In this sample every point is a placeholder.",
  completedSalesIntro:
    "Recent completed sales nearby give a sense of the local housing market. They are a separate kind of evidence from rent.",
  completedSalesRule: "Sold prices are shown for context only and are not rent.",
  demandIntro:
    "How quickly similar homes let and how many enquiries they attract, once a licensed source is connected.",
  licensingFlags: {
    "may-require-licence": "This property may require a licence",
    unlikely: "A licence looks unlikely to be required",
    unknown: "We could not check licensing automatically",
  },
  licensingLink: "Peterborough City Council selective-licensing guidance",
  crimeIntro: "Separate categories with a count and a trend word, shown as neutral context only.",
  /** Mandatory limitations disclaimer — a product rule, not adapter data. */
  crimeDisclaimer:
    "Crime data does not prove a home is safe or unsafe. We never turn it into a single grade or label for an area, and it plays no part in our rent recommendations or tenant selection.",
  amenitiesIntro:
    "Everyday places nearby, with rough walking or bus times. Illustrative in this sample.",
  strengthsHeading: "Strengths",
  practicalHeading: "Practical considerations",
  scenariosIntro:
    "Three simple paths for the central figure over one and three years, so a landlord can see the shape of the range rather than a single number.",
  assumptionsHeading: "Assumptions",
  nextStep: {
    lead: "A verified appraisal is our confirmed recommendation. We review the property, the comparables and the legal position, then confirm it with you.",
    cta: "Request a verified rental appraisal",
    whatsappMessage: "Hello, I'd like to request a rental appraisal",
    reviewLabel: "Human review",
  },
  humanReviewStates: {
    "not-requested": "Not yet requested",
    requested: "Requested — awaiting our review",
    confirmed: "Confirmed by Red Brick Lettings",
  },
} as const;

export const howThisWillWorkCopy = {
  heading: "How this will work",
  paragraphs: [
    "A production estimate will combine three things: our own de-identified achieved-rent records, a licensed feed of current comparable rentals, and review by a member of our team — especially for unusual, converted, shared or poorly presented homes.",
    "Public context such as official rent trends, completed-sale records, council licensing guidance and neutral crime categories will carry their source, geography, dates and a quality flag, so you can always see where a figure came from.",
    "When the evidence is weak we will say so and suppress the range rather than show a number we cannot support. Demographic and benefit data never affect the rent we suggest or how we consider tenants.",
  ],
} as const;
