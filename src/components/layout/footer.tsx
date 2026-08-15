import Image from "next/image";
import Link from "next/link";

import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { business } from "@/config/business";
import { routes, footerNav } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-surface="dark" className="bg-ink text-cream">
      <div className="container-rb py-12 md:py-16">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <Image
              src="/brand/red-brick-logo-horizontal-reversed.svg"
              alt={`${business.name} logo`}
              width={530}
              height={130}
              className="h-10 w-auto"
              unoptimized
            />
            <p className="mt-4 text-lg font-bold">{business.tagline}</p>
            <p className="mt-2 text-cream/80">
              Residential lettings and property management across {business.serviceArea}, since{" "}
              {business.establishedYear}.
            </p>
            <div className="mt-5">
              <WhatsAppLink variant="button" />
              <p className="mt-2 text-cream/80">WhatsApp {business.whatsapp.displayNumber}</p>
              <p className="mt-1 text-cream/80">{business.meetings}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(footerNav).map(([group, keys]) => (
              <nav key={group} aria-label={`Footer — ${group}`}>
                <h2 className="text-eyebrow text-sand">{group}</h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {keys.map((key) => (
                    <li key={key}>
                      <Link
                        href={routes[key].path}
                        className="inline-flex min-h-9 items-center rounded-sm text-cream/90 underline-offset-4 hover:underline"
                      >
                        {routes[key].label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/20 pt-6 text-base text-cream/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {business.name}. Established {business.establishedYear}.
          </p>
          <ul className="flex items-center gap-5">
            <li>
              <a
                href={business.social.facebook}
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center rounded-sm underline-offset-4 hover:underline"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href={business.social.instagram}
                rel="noopener noreferrer"
                className="inline-flex min-h-9 items-center rounded-sm underline-offset-4 hover:underline"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-4 text-sm text-cream/60">
          Email and telephone contact details will be published here once confirmed.
        </p>
      </div>
    </footer>
  );
}
