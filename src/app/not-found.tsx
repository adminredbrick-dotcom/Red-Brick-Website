import Link from "next/link";

import { Button } from "@/components/ui/button";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { routes } from "@/config/site";

export default function NotFound() {
  return (
    <section className="container-rb py-16 md:py-24">
      <p className="text-eyebrow text-brick">Page not found</p>
      <h1 className="text-section mt-3">We could not find that page.</h1>
      <p className="measure-body mt-4 text-lg text-stone">
        The page may have moved, or the link may be out of date. The routes below should help you
        find the right place.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href={routes.home.path}>Go to the homepage</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={routes.properties.path}>View properties</Link>
        </Button>
        <WhatsAppLink variant="inline" className="self-center" />
      </div>
    </section>
  );
}
