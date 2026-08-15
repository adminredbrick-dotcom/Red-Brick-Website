import Image from "next/image";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { business } from "@/config/business";
import { routes, primaryNav } from "@/config/site";

export function Header() {
  return (
    <header className="border-b border-stone-light bg-cream">
      <div className="container-rb flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0 rounded-md" aria-label={`${business.name} — home`}>
          <Image
            src="/brand/red-brick-logo-horizontal.svg"
            alt=""
            width={530}
            height={130}
            className="h-10 w-auto md:h-11"
            priority
            unoptimized
          />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((key) => (
              <li key={key}>
                <Link
                  href={routes[key].path}
                  className="inline-flex min-h-11 items-center rounded-md px-3 font-bold text-ink hover:bg-sand"
                >
                  {routes[key].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <WhatsAppLink variant="icon" className="xl:hidden" />
          <WhatsAppLink variant="button" label="WhatsApp" className="hidden xl:inline-flex" />
          <Link
            href={routes.contact.path}
            className="hidden min-h-11 items-center rounded-md px-3 font-bold text-ink hover:bg-sand xl:inline-flex"
          >
            Contact
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
