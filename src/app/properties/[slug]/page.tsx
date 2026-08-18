import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DemoBadge } from "@/components/properties/demo-badge";
import {
  Breadcrumb,
  CostsTable,
  EnquirePanel,
  KeyFacts,
  SectionNav,
  enquiryMessage,
} from "@/components/properties/detail-sections";
import { PlaceholderImage } from "@/components/properties/placeholder-image";
import { StaticMap } from "@/components/properties/static-map";
import { StatusBadge } from "@/components/properties/status-badge";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { formatRentPcm } from "@/lib/format";
import { areaDisplayName, getArea } from "@/lib/listings/areas";
import { listingsRepository } from "@/lib/listings/repository";
import { whatsappHref } from "@/lib/whatsapp";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-render every published slug; unknown slugs still fall through to the honest 404. */
/** Only known slugs exist; anything else is the static 404 (rendered fully on the server, no JS needed). */
export const dynamicParams = false;

export async function generateStaticParams() {
  const all = await listingsRepository.all();
  return all.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await listingsRepository.bySlug(slug);
  if (!listing) return { title: "Property details" };
  return {
    title: `${listing.title} — ${formatRentPcm(listing.pricing.rentPcm)}`,
    description: listing.summary,
  };
}

/**
 * Property detail: Overview → Features → Costs → Location → Enquire.
 * Verified-only facts, an approximate-location static map, one prominent
 * enquiry action, and no photograph that is not of the actual property.
 */
export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const listing = await listingsRepository.bySlug(slug);
  if (!listing) notFound();

  const area = getArea(listing.location.area);

  return (
    <>
      <section className="container-rb pb-8 pt-8 md:pt-12">
        <Breadcrumb title={listing.title} />
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          <div>
            {listing.demoOnly ? <DemoBadge /> : null}
            <p className="text-eyebrow mt-4 text-brick">
              {areaDisplayName(listing.location.area)} · {listing.location.outwardPostcode}
            </p>
            <h1 className="text-section mt-2">{listing.title}</h1>
            <p className="mt-3 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-bold text-ink">{formatRentPcm(listing.pricing.rentPcm)}</span>
              <StatusBadge listing={listing} />
            </p>
            <div className="mt-6 overflow-hidden rounded-lg">
              <PlaceholderImage type={listing.property.type} alt={listing.media.cover.alt} />
            </div>
            <p className="mt-2 text-sm text-stone">
              Placeholder illustration. Real listings show approved photographs of the actual property
              only — never stock or AI imagery.
            </p>
          </div>
          <div className="lg:sticky lg:top-16 lg:self-start">
            <EnquirePanel listing={listing} />
          </div>
        </div>
      </section>

      <SectionNav />

      <div className="container-rb grid gap-12 py-10 md:py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div className="flex min-w-0 flex-col gap-12">
          <section id="overview" aria-labelledby="overview-heading" className="scroll-mt-20">
            <h2 id="overview-heading" className="text-section">
              Overview
            </h2>
            <p className="measure-body mt-4 text-lg">{listing.summary}</p>
            <div className="mt-6">
              <KeyFacts listing={listing} />
            </div>
            <p className="measure-body mt-6 text-stone">{listing.description}</p>
          </section>

          <section id="features" aria-labelledby="features-heading" className="scroll-mt-20">
            <h2 id="features-heading" className="text-section">
              Features
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {listing.features.map((feature) => (
                <li key={feature} className="rounded-md bg-cream px-4 py-3 font-bold text-ink">
                  {feature}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-base text-stone">
              Only verified features are listed. Broadband, mobile signal and parking details are
              published for real listings once checked with the relevant providers.
            </p>
          </section>

          <section id="costs" aria-labelledby="costs-heading" className="scroll-mt-20">
            <h2 id="costs-heading" className="text-section">
              Costs
            </h2>
            <div className="mt-4">
              <CostsTable listing={listing} />
            </div>
          </section>

          <section id="location" aria-labelledby="location-heading" className="scroll-mt-20">
            <h2 id="location-heading" className="text-section">
              Location
            </h2>
            <p className="measure-body mt-4 text-stone">
              {area ? `${area.name}, Peterborough (${area.outwardPostcode}).` : "Peterborough."} The
              map shows an approximate position for the area, not the exact address — the full address is
              shared with confirmed viewings only.
            </p>
            <div className="mt-6">
              <StaticMap
                size="compact"
                highlightArea={listing.location.area}
                title={`Approximate location of ${listing.title}`}
                pins={[
                  {
                    id: listing.id,
                    label: `${listing.title} — approximate position in ${areaDisplayName(listing.location.area)}`,
                    latitude: listing.location.approximateLatitude,
                    longitude: listing.location.approximateLongitude,
                  },
                ]}
              />
            </div>
          </section>

          <section id="enquire" aria-labelledby="enquire-heading" className="scroll-mt-20">
            <h2 id="enquire-heading" className="text-section">
              Enquire
            </h2>
            <p className="measure-body mt-4 text-stone">
              Ask about {listing.title}, request a viewing or check availability. WhatsApp is the
              confirmed contact route; {business.meetings.toLowerCase()}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <a href={whatsappHref(business.whatsapp.e164, enquiryMessage(listing))}>
                  Ask about this property on WhatsApp
                </a>
              </Button>
              <span className="text-stone">WhatsApp {business.whatsapp.displayNumber}</span>
            </div>
          </section>
        </div>
        <div aria-hidden="true" className="hidden lg:block" />
      </div>
    </>
  );
}
