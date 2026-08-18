/**
 * Structured guidance shown on the Landlords and Tenants pages: the standing
 * legal requirements for a rented home in England (with GOV.UK sources) and
 * the tenant journey. Guidance, not advice; every item carries the date it was
 * checked. Nothing here describes Red Brick's fees or service levels — those
 * remain "to be published once confirmed" (owner register).
 */
import type { Source } from "./types";

export const guidanceReviewedOn = "2026-08-18";

export interface GuidanceItem {
  readonly id: string;
  readonly title: string;
  readonly text: string;
  readonly source: Source;
}

const src = (label: string, href: string): Source => ({ label, href, retrievedOn: guidanceReviewedOn });

/** What a landlord in England must have in place — a checklist with the official source for each line. */
export const landlordRequirements: readonly GuidanceItem[] = [
  {
    id: "gas",
    title: "Annual gas safety check",
    text: "Every gas appliance and flue you provide is checked each year by a Gas Safe registered engineer, and the tenant is given a copy of the record.",
    source: src("GOV.UK — Landlord safety responsibilities", "https://www.gov.uk/private-renting/your-landlords-safety-responsibilities"),
  },
  {
    id: "eicr",
    title: "Electrical installation condition report",
    text: "The fixed electrical installation is inspected and tested at least every five years by a qualified person; tenants get a copy of the report.",
    source: src(
      "GOV.UK — Electrical safety standards in the private rented sector",
      "https://www.gov.uk/government/publications/electrical-safety-standards-in-the-private-rented-sector-guidance-for-landlords-tenants-and-local-authorities",
    ),
  },
  {
    id: "alarms",
    title: "Smoke and carbon monoxide alarms",
    text: "A working smoke alarm on every storey with living accommodation and a carbon monoxide alarm in any room with a fixed combustion appliance (gas cookers excepted), repaired or replaced once you are told they are faulty.",
    source: src("GOV.UK — Smoke and carbon monoxide alarms: booklet for landlords", "https://www.gov.uk/government/publications/smoke-and-carbon-monoxide-alarms-explanatory-booklet-for-landlords"),
  },
  {
    id: "epc",
    title: "Energy Performance Certificate",
    text: "A valid EPC, and generally a rating of E or better to let the home unless an exemption is registered. Certificates are on the public register.",
    source: src(
      "GOV.UK — Minimum energy efficiency standard: landlord guidance",
      "https://www.gov.uk/guidance/domestic-private-rented-property-minimum-energy-efficiency-standard-landlord-guidance",
    ),
  },
  {
    id: "deposit",
    title: "Deposit protection",
    text: "The tenancy deposit (capped at five weeks' rent under £50,000 a year) is protected in a government-approved scheme within 30 days and the tenant receives the prescribed information.",
    source: src("GOV.UK — Tenancy deposit protection", "https://www.gov.uk/tenancy-deposit-protection"),
  },
  {
    id: "right-to-rent",
    title: "Right to rent checks",
    text: "Every adult who will live in the home has their right to rent checked before the tenancy starts.",
    source: src("GOV.UK — Check your tenant's right to rent", "https://www.gov.uk/check-tenant-right-to-rent-documents"),
  },
  {
    id: "how-to-rent",
    title: "The How to Rent guide",
    text: "The tenant is given the current government How to Rent guide at the start of the tenancy.",
    source: src("GOV.UK — How to rent", "https://www.gov.uk/government/publications/how-to-rent"),
  },
  {
    id: "licensing",
    title: "Selective licensing (parts of Peterborough)",
    text: "Rented homes inside the council's designated selective-licensing areas need a licence. Whether a home is inside the scheme depends on its address — check the council's page or ask us.",
    source: src("Peterborough City Council — Selective licensing", "https://www.peterborough.gov.uk/residents/housing/private-rented-property/selective-licensing"),
  },
];

export interface JourneyStep {
  readonly heading: string;
  readonly body: string;
  readonly link?: { readonly label: string; readonly href: string };
}

/** The tenant journey — mirrors the homepage story and the site's real routes. */
export const tenantJourney: readonly JourneyStep[] = [
  { heading: "Find", body: "Search by area, rent, type and availability. Street and area only, never a house number; facts appear once confirmed.", link: { label: "View available properties", href: "/properties?availability=now" } },
  { heading: "Ask", body: "Message us about a home. Every listing starts the WhatsApp message for you with the property reference.", link: { label: "How to arrange a viewing", href: "/insights/what-to-expect-at-a-viewing" } },
  { heading: "View", body: "Arranged in advance and met at the door — the home shown room by room, with time for the practical questions." },
  { heading: "Apply", body: "If you want to go ahead we explain the application and referencing steps for that home. Nothing is due before you sign; any holding deposit is capped at one week's rent." },
  { heading: "Move in", body: "Rent in advance (at most one month), a protected deposit (capped by law), the inventory, keys and the How to Rent guide.", link: { label: "Move-in costs explained", href: "#move-in-costs" } },
  { heading: "Live", body: "Know how to reach us and how repairs are handled: report, triage, arrange, update, resolve.", link: { label: "Get maintenance help", href: "/maintenance" } },
];

/** The landlord journey — the approved Let / Manage / Care architecture, described as process, not packages. */
export const landlordJourney: readonly JourneyStep[] = [
  { heading: "Let your property", body: "Preparation and the safety paperwork, an honest listing with street and area only, enquiries answered, viewings in person, referencing, the agreement, deposit protection and move-in." },
  { heading: "Manage your tenancy", body: "Rent administration, clear communication with the tenant, inspections and compliance dates kept in view — so you know where things stand." },
  { heading: "Care for your property", body: "Maintenance coordination through one route: report, triage, arrange, update, resolve — with approvals and costs handled the way we agreed with you.", link: { label: "How maintenance works", href: "/maintenance#landlords" } },
];
