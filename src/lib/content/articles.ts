/**
 * Local editorial content — the first Insights articles, prepared 18/08/2026.
 *
 * Every article restates guidance that is either already published elsewhere on
 * this site (move-in costs, the maintenance process, listing statuses, the
 * viewing chapter) or is well-established English private-rented-sector law
 * with a GOV.UK source listed. Nothing here is a promise about Red Brick's
 * service levels, response times or fees, and nothing is legal advice.
 *
 * All articles are `reviewStatus: "draft"` until Red Brick reviews them
 * (docs/OWNER-DECISIONS.md) — the article page shows that plainly.
 * When the CMS is connected these records move into it unchanged in shape.
 */
import type { Article } from "./types";

const AUTHOR = "Red Brick Lettings";
const PREPARED = "2026-08-18";

const GOV = {
  rentersRights: {
    label: "GOV.UK — Guide to the Renters' Rights Act",
    href: "https://www.gov.uk/government/publications/guide-to-the-renters-rights-act",
    retrievedOn: "2026-08-17",
  },
  tenantFees: {
    label: "GOV.UK — Tenant Fees Act 2019 guidance",
    href: "https://www.gov.uk/government/publications/tenant-fees-act-2019-guidance",
    retrievedOn: "2026-08-17",
  },
  depositProtection: {
    label: "GOV.UK — Tenancy deposit protection",
    href: "https://www.gov.uk/tenancy-deposit-protection",
    retrievedOn: PREPARED,
  },
  howToRent: {
    label: "GOV.UK — How to rent: the checklist for renting in England",
    href: "https://www.gov.uk/government/publications/how-to-rent",
    retrievedOn: PREPARED,
  },
  gasSafety: {
    label: "GOV.UK — Landlord responsibilities: gas safety",
    href: "https://www.gov.uk/private-renting/your-landlords-safety-responsibilities",
    retrievedOn: PREPARED,
  },
  electricalSafety: {
    label: "GOV.UK — Electrical safety standards in the private rented sector: guidance for landlords",
    href: "https://www.gov.uk/government/publications/electrical-safety-standards-in-the-private-rented-sector-guidance-for-landlords-tenants-and-local-authorities",
    retrievedOn: PREPARED,
  },
  alarms: {
    label: "GOV.UK — Smoke and carbon monoxide alarms: explanatory booklet for landlords",
    href: "https://www.gov.uk/government/publications/smoke-and-carbon-monoxide-alarms-explanatory-booklet-for-landlords",
    retrievedOn: PREPARED,
  },
  epcRegister: {
    label: "GOV.UK — Find an energy certificate",
    href: "https://www.gov.uk/find-energy-certificate",
    retrievedOn: PREPARED,
  },
  mees: {
    label: "GOV.UK — Domestic private rented property: minimum energy efficiency standard",
    href: "https://www.gov.uk/guidance/domestic-private-rented-property-minimum-energy-efficiency-standard-landlord-guidance",
    retrievedOn: PREPARED,
  },
  rightToRent: {
    label: "GOV.UK — Check your tenant's right to rent",
    href: "https://www.gov.uk/check-tenant-right-to-rent-documents",
    retrievedOn: PREPARED,
  },
  peterboroughLicensing: {
    label: "Peterborough City Council — Selective licensing",
    href: "https://www.peterborough.gov.uk/residents/housing/private-rented-property/selective-licensing",
    retrievedOn: PREPARED,
  },
  gasEmergency: {
    label: "National Gas — Smell gas? Call 0800 111 999",
    href: "https://www.nationalgas.com/safety-and-emergencies/gas-emergencies",
    retrievedOn: PREPARED,
  },
} as const;

export const articles: readonly Article[] = [
  {
    slug: "move-in-costs-in-england-what-you-can-be-asked-to-pay",
    title: "Move-in costs in England: what you can — and cannot — be asked to pay",
    excerpt:
      "Rent in advance, the tenancy deposit and the holding deposit are all capped by law. Here is what the current rules allow, in plain English.",
    category: "tenants",
    tags: ["move-in costs", "deposit", "holding deposit", "Tenant Fees Act", "Renters' Rights Act"],
    author: AUTHOR,
    publishedOn: PREPARED,
    reviewedOn: "2026-08-17",
    reviewStatus: "draft",
    socialCaption: "What can you legally be asked to pay before you get the keys? The caps, in plain English.",
    cover: null,
    body: [
      { type: "paragraph", text: "Moving home is expensive enough without surprises. In England the amounts a landlord or agent can ask for at the start of a tenancy are capped by law, so it is worth knowing the shape of them before you commit." },
      { type: "heading", text: "Before you sign" },
      { type: "list", items: [
        "No rent can be requested or accepted before the tenancy agreement is signed.",
        "A holding deposit — taken to reserve a home while checks happen — is capped at one week's rent. It is only credited towards your rent or deposit with your agreement, and the circumstances in which it can be kept are limited.",
      ] },
      { type: "heading", text: "After you sign, before you move in" },
      { type: "list", items: [
        "At most one month's rent can be taken in advance.",
        "The tenancy deposit is capped at five weeks' rent where the annual rent is under £50,000, and six weeks' rent at or above it. It must be protected in a government-approved scheme.",
        "Letting fees, referencing fees, inventory fees and similar admin charges are banned. The permitted payments are set out in the Tenant Fees Act.",
      ] },
      { type: "callout", title: "A worked example", text: "For a home let at £850 a month the weekly rent is about £196, so the deposit cap is about £981 (five weeks) and the holding deposit cap about £196. Together with one month's rent in advance, the most you would pay before the keys is roughly £1,831 — before any holding deposit is credited. Use the move-in cost explainer on our Tenants page for your own figures." },
      { type: "heading", text: "What we do" },
      { type: "paragraph", text: "Every Red Brick listing shows rent, deposit and what is included only once they are confirmed. If a figure reads \"to be confirmed\" or \"rent on application\", ask us and we will set it out before you commit to anything." },
      { type: "link", label: "Try the move-in cost explainer", href: "/tenants#move-in-costs" },
    ],
    sources: [GOV.rentersRights, GOV.tenantFees, GOV.depositProtection],
    related: ["what-to-expect-at-a-viewing", "what-our-property-statuses-mean"],
  },
  {
    slug: "how-to-report-a-repair-and-what-happens-next",
    title: "How to report a repair — and what happens next",
    excerpt:
      "Report, triage, arrange, update, resolve. What to tell us, what counts as urgent, and what happens after you press send.",
    category: "maintenance",
    tags: ["repairs", "maintenance", "tenants"],
    author: AUTHOR,
    publishedOn: PREPARED,
    reviewedOn: PREPARED,
    reviewStatus: "draft",
    socialCaption: "Something broken? Here is how to report it and what happens next.",
    cover: null,
    body: [
      { type: "callout", tone: "attention", title: "If the situation is dangerous", text: "If you can smell gas, call the National Gas Emergency line on 0800 111 999 and follow their advice. If there is a fire, a risk to life or a crime in progress, call 999. Tell us afterwards so we can help with what happens next at the property." },
      { type: "heading", text: "The five steps" },
      { type: "list", ordered: true, items: [
        "Report — tell us what has happened, where, and how urgent it feels.",
        "Triage — we assess the issue and agree the right priority with you.",
        "Arrange — the appropriate work is organised for the property.",
        "Update — you are kept informed about what happens next.",
        "Resolve — the issue is completed and checked.",
      ] },
      { type: "paragraph", text: "The exact response depends on the issue and the arrangements for the property, so we do not quote fixed response times. What we can promise is that you will know what is happening." },
      { type: "heading", text: "What to include" },
      { type: "list", items: [
        "Where in the home the problem is, and when it started.",
        "What you have already tried — for example, whether the boiler pressure is low or a trip switch has gone.",
        "Photos or a short video, attached in WhatsApp.",
        "When it is convenient to visit and how you prefer to be contacted.",
      ] },
      { type: "heading", text: "What counts as urgent" },
      { type: "paragraph", text: "No heating or hot water, an active leak, no power or water, or a home that is not secure are urgent. Something that affects daily use but leaves the home safe needs attention soon. General wear and minor faults are routine. Choosing honestly helps us prioritise properly for everyone." },
      { type: "link", label: "Report a repair", href: "/maintenance#report" },
    ],
    sources: [GOV.gasEmergency],
    related: ["landlord-safety-checks-the-certificates-a-rented-home-needs"],
  },
  {
    slug: "what-to-expect-at-a-viewing",
    title: "What to expect at a viewing",
    excerpt: "Arranged in advance, met at the door, room by room. How a Red Brick viewing works and the questions worth asking.",
    category: "tenants",
    tags: ["viewings", "applying", "tenants"],
    author: AUTHOR,
    publishedOn: PREPARED,
    reviewedOn: PREPARED,
    reviewStatus: "draft",
    socialCaption: "Booking a viewing? Here is how it works and what to ask while you are there.",
    cover: null,
    body: [
      { type: "paragraph", text: "A viewing is still the best way to understand a home. Ours are arranged in advance and you are met at the property in person — no scripts, just an honest look round." },
      { type: "heading", text: "On the day" },
      { type: "list", items: [
        "You are met at the door and shown through the home room by room.",
        "Look at the practical things as well as the rooms: the kitchen, storage, the heating and where the boiler and meters are.",
        "Ask what is included, what the rent covers, and about the deposit and any holding deposit — the caps are set by law.",
        "Ask about the next steps if you want to apply: what references are needed and how long things usually take for that home.",
      ] },
      { type: "heading", text: "Afterwards" },
      { type: "paragraph", text: "If you would like to go ahead, tell us and we will explain the application and referencing steps for that property. Nothing is due before you sign an agreement, and any holding deposit is capped at one week's rent." },
      { type: "link", label: "See available properties", href: "/properties?availability=now" },
    ],
    sources: [GOV.rentersRights, GOV.tenantFees],
    related: ["move-in-costs-in-england-what-you-can-be-asked-to-pay", "what-our-property-statuses-mean"],
  },
  {
    slug: "epc-ratings-explained-for-renters-and-landlords",
    title: "EPC ratings explained for renters and landlords",
    excerpt: "What an Energy Performance Certificate rating means, where to find one, and the minimum standard for a rented home in England.",
    category: "property-guidance",
    tags: ["EPC", "energy", "compliance"],
    author: AUTHOR,
    publishedOn: PREPARED,
    reviewedOn: PREPARED,
    reviewStatus: "draft",
    socialCaption: "What does an EPC rating actually tell you about a rented home?",
    cover: null,
    body: [
      { type: "paragraph", text: "An Energy Performance Certificate (EPC) rates a home's energy efficiency from A (most efficient) to G (least efficient), and lists suggested improvements. Certificates are valid for ten years and are published on the public register." },
      { type: "heading", text: "Where to find one" },
      { type: "paragraph", text: "Every certificate for a home in England and Wales is on the GOV.UK register — search by postcode. Our property pages show the rating from the register only while the certificate is in date." },
      { type: "heading", text: "The minimum standard for lettings" },
      { type: "paragraph", text: "In England, privately rented homes generally need a rating of at least E to be let, unless a valid exemption is registered. The government has consulted on raising the standard; check the GOV.UK guidance for the current position before relying on it." },
      { type: "heading", text: "What the rating does not tell you" },
      { type: "paragraph", text: "The rating is a model of the building, not a bill. Actual running costs depend on how a home is used, the tariff and the weather. Treat it as one useful signal among several." },
      { type: "link", label: "Find an energy certificate on GOV.UK", href: GOV.epcRegister.href },
    ],
    sources: [GOV.epcRegister, GOV.mees],
    related: ["landlord-safety-checks-the-certificates-a-rented-home-needs", "what-our-property-statuses-mean"],
  },
  {
    slug: "landlord-safety-checks-the-certificates-a-rented-home-needs",
    title: "Landlord safety checks: the certificates a rented home in England needs",
    excerpt: "Gas safety, electrical safety, alarms, EPC, deposit protection, right to rent and the How to Rent guide — the standing requirements, with the official sources.",
    category: "landlords",
    tags: ["compliance", "gas safety", "EICR", "deposit protection", "landlords"],
    author: AUTHOR,
    publishedOn: PREPARED,
    reviewedOn: PREPARED,
    reviewStatus: "draft",
    socialCaption: "The safety checks and paperwork every rented home in England needs — with the official sources.",
    cover: null,
    body: [
      { type: "paragraph", text: "Letting a home comes with a small set of standing legal requirements. This is a plain-English summary with the official GOV.UK sources; it is guidance, not legal advice, and requirements change — check the sources for the current position." },
      { type: "heading", text: "Safety" },
      { type: "list", items: [
        "Gas: an annual gas safety check by a Gas Safe registered engineer for every gas appliance and flue you provide, with a copy of the record given to the tenant.",
        "Electrics: an electrical installation condition report (EICR) at least every five years, with a copy given to tenants and, on request, the local authority.",
        "Alarms: a working smoke alarm on every storey used as living accommodation and a carbon monoxide alarm in any room with a fixed combustion appliance (gas cookers excepted); they must be repaired or replaced once you are told they are faulty.",
        "Energy: a valid EPC, and generally a rating of E or better to let the home unless an exemption is registered.",
      ] },
      { type: "heading", text: "Paperwork at the start of a tenancy" },
      { type: "list", items: [
        "Protect the tenancy deposit in a government-approved scheme within 30 days and give the tenant the prescribed information.",
        "Check every adult occupier's right to rent before the tenancy starts.",
        "Give the tenant the current How to Rent guide.",
      ] },
      { type: "heading", text: "Licensing in Peterborough" },
      { type: "paragraph", text: "Parts of Peterborough are covered by a selective licensing scheme, under which rented homes in the designated areas need a licence from the council. Whether a particular home is inside the scheme depends on its address — check the council's page or ask us." },
      { type: "heading", text: "How we help" },
      { type: "paragraph", text: "For managed properties we track certificate dates and coordinate renewals with you. Exact service levels and fees will be published once confirmed — until then, ask us and we will explain what we would do for your property." },
      { type: "link", label: "Request a rental appraisal", href: "/rental-appraisal" },
    ],
    sources: [GOV.gasSafety, GOV.electricalSafety, GOV.alarms, GOV.mees, GOV.depositProtection, GOV.rightToRent, GOV.howToRent, GOV.peterboroughLicensing],
    related: ["epc-ratings-explained-for-renters-and-landlords", "how-to-report-a-repair-and-what-happens-next"],
  },
  {
    slug: "what-our-property-statuses-mean",
    title: "Available, let agreed, currently let: what our property statuses mean",
    excerpt: "Why some homes on our site are marked \"Currently let\", why some facts read \"to be confirmed\", and how to be told when something suitable comes up.",
    category: "property-guidance",
    tags: ["properties", "availability", "how the site works"],
    author: AUTHOR,
    publishedOn: PREPARED,
    reviewedOn: PREPARED,
    reviewStatus: "draft",
    socialCaption: "Currently let? To be confirmed? What the labels on our property pages mean.",
    cover: null,
    body: [
      { type: "paragraph", text: "Our property pages show the homes Red Brick Lettings manages across Peterborough — not only the ones you can move into this month. A few labels explain what you are looking at." },
      { type: "list", items: [
        "Available — the home is being marketed now. Ask about a viewing.",
        "Coming soon — a home that will be marketed shortly.",
        "Let agreed — a tenancy has been agreed for this home; it is no longer available.",
        "Currently let — an occupied home in our managed portfolio, shown so you can see the kind of properties we look after. It cannot be viewed.",
      ] },
      { type: "heading", text: "Street and area only" },
      { type: "paragraph", text: "We publish the street name and the area, never a house number or a full postcode, and the map pin is the area's approximate centre. That protects the people who live in these homes." },
      { type: "heading", text: "\"To be confirmed\" and \"rent on application\"" },
      { type: "paragraph", text: "We only publish a fact once it has been checked against a document. Until then bedrooms, bathrooms or rent may read \"to be confirmed\" or \"rent on application\" rather than a guess. Photographs follow when a home is being marketed — never stock or AI images." },
      { type: "heading", text: "Hearing about the next one" },
      { type: "paragraph", text: "If a currently let home is the kind of property you are looking for, message us and we will let you know when something similar becomes available." },
      { type: "link", label: "Browse the properties", href: "/properties" },
    ],
    sources: [],
    related: ["what-to-expect-at-a-viewing", "move-in-costs-in-england-what-you-can-be-asked-to-pay"],
  },
];
