import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MapPin, MessageCircle } from "lucide-react";

import { IllustrativeBadge } from "@/components/properties/illustrative-badge";
import { publishedText } from "@/components/properties/listing-display";
import { PropertyBreadcrumb } from "@/components/properties/property-breadcrumb";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCostsTable } from "@/components/properties/property-costs-table";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertyKeyFacts } from "@/components/properties/property-key-facts";
import { PropertySectionNav } from "@/components/properties/property-section-nav";
import {
  PropertySummaryCard,
  listingEnquiryHref,
} from "@/components/properties/property-summary-card";
import { StaticMapPreview } from "@/components/properties/static-map-preview";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { DEMO_LISTING_LABEL } from "@/content/demo-labels";
import { getListingsRepository } from "@/data/repositories/listings";
import { formatDate, formatRentPcm } from "@/lib/format";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const repo = await getListingsRepository();
  const listings = await repo.list();
  return listings.map((listing) => ({ slug: listing.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const repo = await getListingsRepository();
  const listing = await repo.bySlug(slug);
  if (!listing) {
    return { title: "Property not found" };
  }
  return {
    title: `${listing.title}, ${listing.location.publicArea}`,
    description: listing.summary,
    // Demonstration records must never be indexed, whatever the site-wide setting.
    ...(listing.demoOnly ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * Property detail. Progressive sections in document order (Overview,
 * Features, Costs, Location, Enquire) with an anchor nav, a sticky summary on
 * desktop and a slim, non-obscuring enquiry bar on small screens.
 */
export default async function PropertyDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const repo = await getListingsRepository();
  const listing = await repo.bySlug(slug);
  if (!listing) notFound();

  const others = (await repo.list()).filter((other) => other.id !== listing.id).slice(0, 2);
  const enquiryHref = listingEnquiryHref(listing);

  const materialInfo: { label: string; value: string }[] = [
    { label: "EPC rating", value: publishedText(listing.materialInformation.epcRating) },
    ...(listing.materialInformation.parkingNote
      ? [{ label: "Parking", value: listing.materialInformation.parkingNote }]
      : []),
    ...(listing.materialInformation.broadbandNote
      ? [{ label: "Broadband", value: listing.materialInformation.broadbandNote }]
      : []),
    ...(listing.materialInformation.mobileSignalNote
      ? [{ label: "Mobile signal", value: listing.materialInformation.mobileSignalNote }]
      : []),
  ];

  return (
    <>
      <article aria-labelledby="listing-title">
        <div className="container-rb pt-6 md:pt-10">
          <PropertyBreadcrumb current={listing.title} />

          {listing.demoOnly ? <IllustrativeBadge layout="block" className="mt-4" /> : null}

          <header className="mt-6 flex flex-col gap-4">
            <div>
              <h1 id="listing-title" className="text-section break-words">
                {listing.title}
              </h1>
              <p className="mt-2 flex items-start gap-1.5 text-lg text-stone">
                <MapPin className="mt-1.5 size-4 shrink-0" aria-hidden="true" />
                <span>
                  {listing.location.publicArea} · {listing.location.outwardPostcode}{" "}
                  <span className="whitespace-nowrap">(approximate area)</span>
                </span>
              </p>
            </div>
            <p className="text-3xl font-bold tabular-nums md:text-4xl">
              {formatRentPcm(listing.pricing.rentPcm)}
            </p>
            <PropertyKeyFacts listing={listing} />
          </header>

          <div className="mt-8">
            <PropertyGallery listing={listing} />
          </div>
        </div>

        <div className="container-rb pb-12 pt-8 md:pb-16 md:pt-10">
          <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-10">
            <PropertySummaryCard
              listing={listing}
              className="lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1"
            />

            <div className="mt-8 flex min-w-0 flex-col gap-12 lg:col-start-1 lg:row-start-1 lg:mt-0">
              <PropertySectionNav />

              <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-6">
                <h2 id="overview-heading" className="text-2xl md:text-3xl">
                  Overview
                </h2>
                <p className="measure-body mt-4 text-lg">{listing.summary}</p>
                <p className="measure-body mt-3 text-stone">{listing.description}</p>

                <h3 className="mt-8 text-xl">Material information</h3>
                <dl className="mt-3 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {materialInfo.map((item) => (
                    <div key={item.label}>
                      <dt className="text-sm text-stone">{item.label}</dt>
                      <dd className="break-words font-bold">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section id="features" aria-labelledby="features-heading" className="scroll-mt-6">
                <h2 id="features-heading" className="text-2xl md:text-3xl">
                  Features
                </h2>
                {listing.features.length > 0 ? (
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {listing.features.map((feature) => (
                      <li key={feature} className="rounded-md bg-white px-4 py-3 shadow-soft">
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-stone">No verified features have been published.</p>
                )}
              </section>

              <section id="costs" aria-labelledby="costs-heading" className="scroll-mt-6">
                <h2 id="costs-heading" className="text-2xl md:text-3xl">
                  Costs
                </h2>
                <div className="mt-4">
                  <PropertyCostsTable listing={listing} />
                </div>
                <p className="measure-body mt-4 text-base text-stone">
                  {listing.demoOnly
                    ? "Figures shown for demonstration records are illustrative and do not describe any real tenancy. A real listing shows verified figures only."
                    : "Only verified figures are shown. Ask us if anything is unclear before you apply."}
                </p>
              </section>

              <section id="location" aria-labelledby="location-heading" className="scroll-mt-6">
                <h2 id="location-heading" className="text-2xl md:text-3xl">
                  Location
                </h2>
                <p className="measure-body mt-4">
                  {listing.location.publicArea} ({listing.location.outwardPostcode}). We show an
                  approximate area for every home rather than the exact address.
                </p>
                <div className="mt-4 max-w-2xl">
                  <StaticMapPreview
                    compact
                    listings={[listing]}
                    selectedId={listing.id}
                    caption="Approximate position only — not the exact address. The interactive Peterborough map arrives in a later stage."
                  />
                </div>
                <p className="measure-body mt-3 text-base text-stone">
                  Local amenity and transport information is not published for demonstration
                  records.
                </p>
              </section>

              <section id="enquire" aria-labelledby="enquire-heading" className="scroll-mt-6">
                <h2 id="enquire-heading" className="text-2xl md:text-3xl">
                  Enquire
                </h2>
                <div className="mt-4 rounded-lg bg-white p-6 shadow-soft md:p-8">
                  {listing.demoOnly ? (
                    <p className="font-bold text-ink">
                      {listing.publishing.label ?? DEMO_LISTING_LABEL}. This example exists to
                      demonstrate the page and cannot be viewed or applied for.
                    </p>
                  ) : null}
                  <p className="measure-body mt-3 text-stone">
                    Online enquiry and viewing requests are not yet active on this site. To ask
                    about a home, message us on WhatsApp — the message opens with this listing’s
                    reference ({listing.id}) already filled in. {business.meetings}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <Button asChild>
                      <a href={enquiryHref}>
                        <MessageCircle aria-hidden="true" />
                        Ask about this property on WhatsApp
                      </a>
                    </Button>
                    <span className="text-stone">{business.whatsapp.displayNumber}</span>
                  </div>
                  <p className="mt-6 text-sm text-stone">
                    Listing reviewed: {formatDate(listing.publishing.reviewedAt)}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Small screens: one slim persistent enquiry action. It sits inside the
            article, so it scrolls away with the article and never covers the
            related examples or the footer. */}
        <div className="sticky bottom-0 z-10 border-t border-stone-light bg-cream/95 lg:hidden">
          <div className="container-rb flex items-center justify-between gap-3 py-2.5">
            <span className="min-w-0 truncate font-bold tabular-nums">
              {formatRentPcm(listing.pricing.rentPcm)}
            </span>
            <Button asChild size="sm">
              <a href={enquiryHref}>
                <MessageCircle aria-hidden="true" />
                Ask on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </article>

      {others.length > 0 ? (
        <section aria-labelledby="related-heading" className="bg-white">
          <div className="container-rb py-14 md:py-20">
            <h2 id="related-heading" className="text-2xl md:text-3xl">
              Other illustrative examples
            </h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {others.map((other) => (
                <li key={other.id}>
                  <PropertyCard listing={other} className="h-full bg-cream" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
