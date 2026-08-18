/**
 * Frequently asked questions for the Landlords, Tenants and Maintenance pages.
 * Every answer stays inside the confirmed facts (src/config/business.ts,
 * approved copy) or cites the GOV.UK rule it restates; nothing promises a
 * fee, a service level or a response time that has not been confirmed.
 */
import type { FaqGroup } from "./types";

const REVIEWED = "2026-08-18";

export const faqGroups: readonly FaqGroup[] = [
  {
    key: "landlords",
    heading: "Landlord questions",
    reviewedOn: REVIEWED,
    items: [
      {
        id: "landlord-what-services",
        question: "What can Red Brick do for my property?",
        answer:
          "We work in three stages: Let your property (preparation, marketing, tenant-find work, inventory and tenancy set-up), Manage your tenancy (rent administration, communication, inspections and compliance support) and Care for your property (maintenance coordination and ongoing attention). Exact service levels and fees will be published once confirmed — ask us and we will explain what we would do for your property.",
        basis: "Approved service architecture (brand guidelines, section 02); fees pending (owner register).",
      },
      {
        id: "landlord-appraisal",
        question: "How do I find out what my property could rent for?",
        answer:
          "Start with the indicative rental estimate on this site — it gives you an illustrative range from a few property details. It is a starting point, never a valuation. We confirm our recommendation only after reviewing the property properly.",
        basis: "Rental appraisal journey (illustrative range; human-confirmed appraisal).",
      },
      {
        id: "landlord-certificates",
        question: "Which safety certificates does a rented home need?",
        answer:
          "In England: an annual gas safety record for any gas appliances you provide, an electrical installation condition report at least every five years, working smoke alarms on every storey and carbon monoxide alarms where there are fixed combustion appliances, and a valid EPC (generally rated E or better). See our article on landlord safety checks for the official sources.",
        basis: "GOV.UK landlord safety guidance (see the article's sources).",
      },
      {
        id: "landlord-deposit",
        question: "What happens to the tenant's deposit?",
        answer:
          "Deposits are capped by law (five weeks' rent where the annual rent is under £50,000) and must be protected in a government-approved scheme within 30 days, with the prescribed information given to the tenant. Which scheme is used for your property is confirmed in the tenancy paperwork.",
        basis: "Tenant Fees Act 2019 caps; GOV.UK tenancy deposit protection.",
      },
      {
        id: "landlord-licensing",
        question: "Does my Peterborough property need a licence?",
        answer:
          "Parts of Peterborough are covered by a selective licensing scheme, so it depends on the address. Check the council's selective licensing page or ask us to check for you.",
        basis: "Peterborough City Council selective licensing (address-dependent).",
      },
      {
        id: "landlord-maintenance",
        question: "How is maintenance handled?",
        answer:
          "Report, triage, arrange, update, resolve. Tenants report to us, we assess and agree the priority, arrange the appropriate work, keep everyone informed and check it is resolved. How approvals and costs work for your property is agreed with you when we set up management.",
        basis: "Approved maintenance copy; approval thresholds pending confirmation.",
      },
      {
        id: "landlord-meet",
        question: "Can we meet to talk it through?",
        answer: "Ask us about arranging a meeting. The quickest way to reach us is WhatsApp on 07300 856675.",
        basis: "business.meetings; confirmed WhatsApp number.",
      },
    ],
  },
  {
    key: "tenants",
    heading: "Tenant questions",
    reviewedOn: REVIEWED,
    items: [
      {
        id: "tenant-how-to-view",
        question: "How do I arrange a viewing?",
        answer:
          "Message us on WhatsApp with the property you are interested in — every listing has a button that starts the message for you. Viewings are arranged in advance and you are met at the property in person.",
        basis: "Property enquiry route (WhatsApp); viewing chapter.",
      },
      {
        id: "tenant-costs",
        question: "What will I have to pay before I move in?",
        answer:
          "In England nothing is due before you sign the agreement. After signing, at most one month's rent in advance and a deposit capped at five weeks' rent (six where the annual rent is £50,000 or more). A holding deposit, if one is taken, is capped at one week's rent. Letting and admin fees are banned. Try the move-in cost explainer for your figures.",
        basis: "Tenant Fees Act 2019; Renters' Rights Act guidance (reviewed 17/08/2026).",
      },
      {
        id: "tenant-currently-let",
        question: "Why are some homes marked \"Currently let\"?",
        answer:
          "They are occupied homes in the portfolio we manage, shown so you can see the kind of properties we look after. They cannot be viewed. If one is the kind of home you want, tell us and we will let you know when something similar becomes available.",
        basis: "Site behaviour (portfolio listings).",
      },
      {
        id: "tenant-repairs",
        question: "Something has broken — what do I do?",
        answer:
          "If it is dangerous — a smell of gas, a fire, a risk to life — call the emergency services first (gas: 0800 111 999; fire or danger: 999). Otherwise report it through the Maintenance page: tell us what has happened, where and how urgent it feels, and we will agree the priority with you.",
        basis: "Approved maintenance copy; National Gas emergency number.",
      },
      {
        id: "tenant-deposit-back",
        question: "How do I get my deposit back?",
        answer:
          "Your deposit is protected in a government-approved scheme for the tenancy. At the end, any deductions have to be agreed or resolved through the scheme's dispute process, and the scheme returns the balance. The details for your tenancy are in your paperwork.",
        basis: "GOV.UK tenancy deposit protection.",
      },
    ],
  },
  {
    key: "maintenance",
    heading: "Maintenance questions",
    reviewedOn: REVIEWED,
    items: [
      {
        id: "maint-how-fast",
        question: "How quickly will someone come out?",
        answer:
          "It depends on the issue and the arrangements for the property, so we do not quote fixed response times. Urgent problems — no heating or hot water, an active leak, no power or water, a home that is not secure — are prioritised. What we do promise is that you will know what is happening at each step.",
        basis: "Approved maintenance copy; no response-time claims (CLAUDE.md).",
      },
      {
        id: "maint-what-to-send",
        question: "What should I include when I report a repair?",
        answer:
          "Where in the home the problem is, when it started, anything you have already tried, photos or a short video, and when it is convenient to visit. The report form on this page puts it all into one WhatsApp message for you.",
        basis: "Repair form specification.",
      },
      {
        id: "maint-form-not-sent",
        question: "Why does the form open WhatsApp instead of sending?",
        answer:
          "Online form delivery is not active yet, and we would rather be clear about that than show a \"sent\" message that means nothing. The form checks your details and prepares a WhatsApp message you send yourself — WhatsApp is our confirmed route.",
        basis: "Owner register (form delivery pending); honest unavailable state.",
      },
    ],
  },
];

export function faqGroup(key: FaqGroup["key"]): FaqGroup {
  return faqGroups.find((g) => g.key === key)!;
}
