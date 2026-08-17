import Link from "next/link";

import { DemoBadge } from "@/components/properties/demo-badge";
import { StatusBadge } from "@/components/properties/status-badge";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { formatGbp, formatRentPcm, formatUkDate, pluralise } from "@/lib/format";
import { areaDisplayName } from "@/lib/listings/areas";
import { furnishingLabels, propertyTypeLabels, type Listing, type VerifiedFact } from "@/lib/listings/types";
import { whatsappHref } from "@/lib/whatsapp";

/** In-page section navigation (plain anchors; sticky on desktop only). */
export const detailSections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "costs", label: "Costs" },
  { id: "location", label: "Location" },
  { id: "enquire", label: "Enquire" },
] as const;

export function SectionNav() {
  return (
    <nav aria-label="On this page" className="border-y border-stone-light bg-cream lg:sticky lg:top-0 lg:z-10">
      <div className="container-rb">
        <ul className="-mx-2 flex gap-1 overflow-x-auto py-2">
          {detailSections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-11 items-center rounded-md px-3 font-bold text-ink hover:bg-sand"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/** Key facts strip: bedrooms, bathrooms, type, furnishing, size — text only. */
export function KeyFacts({ listing }: { listing: Listing }) {
  const facts: { label: string; value: string }[] = [
    { label: "Bedrooms", value: String(listing.property.bedrooms) },
    { label: "Bathrooms", value: String(listing.property.bathrooms) },
    { label: "Type", value: propertyTypeLabels[listing.property.type] },
  ];
  if (listing.property.receptionRooms) {
    facts.push({ label: "Reception rooms", value: String(listing.property.receptionRooms) });
  }
  if (listing.property.furnishing) {
    facts.push({ label: "Furnishing", value: furnishingLabels[listing.property.furnishing] });
  }
  if (listing.property.sizeSqM) {
    facts.push({ label: "Approximate size", value: `${listing.property.sizeSqM} m²` });
  }
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg bg-cream p-5 sm:grid-cols-3">
      {facts.map((f) => (
        <div key={f.label}>
          <dt className="text-sm font-bold uppercase tracking-wide text-stone">{f.label}</dt>
          <dd className="mt-0.5 text-lg font-bold text-ink">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function verifiedNote(fact: VerifiedFact<unknown>): string {
  return `Verified ${formatUkDate(fact.verifiedOn)} — ${fact.source}`;
}

/**
 * Costs table. Rent always; deposit, holding deposit, council-tax band and
 * EPC only when the record holds a verified fact — an unverified field is
 * omitted with an honest "not yet verified" line rather than guessed.
 */
export function CostsTable({ listing }: { listing: Listing }) {
  const rows: { label: string; value: string; note?: string }[] = [
    { label: "Rent", value: formatRentPcm(listing.pricing.rentPcm) },
    { label: "Bills", value: listing.pricing.billsIncluded ? "Some bills included — see description" : "Not included" },
  ];
  if (listing.pricing.deposit) {
    rows.push({ label: "Tenancy deposit", value: formatGbp(listing.pricing.deposit.value), note: verifiedNote(listing.pricing.deposit) });
  }
  if (listing.pricing.holdingDeposit) {
    rows.push({ label: "Holding deposit", value: formatGbp(listing.pricing.holdingDeposit.value), note: verifiedNote(listing.pricing.holdingDeposit) });
  }
  if (listing.councilTaxBand) {
    rows.push({ label: "Council tax band", value: listing.councilTaxBand.value, note: verifiedNote(listing.councilTaxBand) });
  }
  if (listing.epcRating) {
    rows.push({ label: "EPC rating", value: listing.epcRating.value, note: verifiedNote(listing.epcRating) });
  }
  const unverified = [
    !listing.pricing.deposit && "tenancy deposit",
    !listing.pricing.holdingDeposit && "holding deposit",
    !listing.councilTaxBand && "council-tax band",
    !listing.epcRating && "EPC rating",
  ].filter(Boolean) as string[];

  return (
    <div>
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">Costs and verified facts for {listing.title}</caption>
        <thead>
          <tr className="border-b border-stone-light text-sm uppercase tracking-wide text-stone">
            <th scope="col" className="py-2 pr-4 font-bold">Item</th>
            <th scope="col" className="py-2 font-bold">Detail</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-stone-light align-top">
              <th scope="row" className="py-3 pr-4 font-bold text-ink">{row.label}</th>
              <td className="py-3">
                <span className="font-bold text-ink">{row.value}</span>
                {row.note ? <span className="block text-sm text-stone">{row.note}</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {unverified.length > 0 ? (
        <p className="mt-3 text-base text-stone">
          Not shown because not yet verified against a document: {unverified.join(", ")}. We publish
          these only once checked.
        </p>
      ) : null}
      <p className="mt-3 text-base text-stone">
        Availability: <StatusBadge listing={listing} className="align-middle" />
        {listing.availableFrom && listing.status !== "let-agreed"
          ? ""
          : listing.status === "let-agreed"
            ? " — a tenancy has been agreed for this home."
            : " — the move-in date is not yet confirmed."}
      </p>
    </div>
  );
}

/** Pre-filled WhatsApp text: names only the property title and public reference — never personal data. */
export function enquiryMessage(listing: Pick<Listing, "title" | "id">): string {
  return `Hello Red Brick, I'd like to ask about ${listing.title} (ref ${listing.id}).`;
}

/** Enquiry / viewing action — WhatsApp with a message that names only the property reference. */
export function EnquirePanel({ listing }: { listing: Listing }) {
  const message = enquiryMessage(listing);
  return (
    <div className="rounded-lg bg-ink p-6 text-cream" data-surface="dark">
      <p className="text-eyebrow text-sand">Enquire or book a viewing</p>
      <p className="mt-2 text-2xl font-bold">{formatRentPcm(listing.pricing.rentPcm)}</p>
      <p className="mt-1 text-cream/80">
        {pluralise(listing.property.bedrooms, "bedroom")} · {areaDisplayName(listing.location.area)}
      </p>
      <div className="mt-5 flex flex-col gap-3">
        <Button asChild size="lg" className="bg-white text-ink hover:bg-sand">
          <a href={whatsappHref(business.whatsapp.e164, message)}>Ask about this property on WhatsApp</a>
        </Button>
        <p className="text-center text-base text-cream/80">WhatsApp {business.whatsapp.displayNumber}</p>
      </div>
      <p className="mt-4 text-sm text-cream/80">
        {business.meetings} Online enquiry forms are switched on once form delivery is configured; until
        then WhatsApp is the confirmed route.
      </p>
      {listing.demoOnly ? <DemoBadge className="mt-4 bg-cream" /> : null}
    </div>
  );
}

/** Small "back to search" crumb. */
export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav aria-label="Breadcrumb" className="text-base">
      <ol className="flex flex-wrap items-center gap-2 text-stone">
        <li>
          <Link href="/properties" className="underline underline-offset-4 hover:text-brick">
            Properties
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" className="text-ink">
          {title}
        </li>
      </ol>
    </nav>
  );
}
