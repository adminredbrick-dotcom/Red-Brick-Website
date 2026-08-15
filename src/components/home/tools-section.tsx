import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { tools } from "@/content/home-copy";

/**
 * Two useful tools. Personalisation only reorders which card comes first —
 * both remain visible.
 */
export function ToolsSection({ id }: { id: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-4 bg-cream">
      <div className="container-rb py-14 md:py-20 lg:py-24">
        <p className="text-eyebrow text-brick">Useful tools</p>
        <h2 id={`${id}-heading`} className="text-section mt-3 max-w-2xl">
          Two useful tools
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Landlord: indicative rental estimate — never a valuation. */}
          <Card className="flex flex-col p-8 in-data-[audience=tenant]:order-last">
            <p className="text-eyebrow text-brick">{tools.landlord.eyebrow}</p>
            <CardTitle className="mt-3 text-2xl">{tools.landlord.heading}</CardTitle>
            <CardContent className="mt-3 flex-1 p-0 text-stone">
              <p>{tools.landlord.body}</p>
              <p className="mt-3">{tools.landlord.note}</p>
            </CardContent>
            <div className="mt-6">
              <Button asChild>
                <Link href={tools.landlord.href}>{tools.landlord.cta}</Link>
              </Button>
            </div>
          </Card>

          {/* Tenant: move-in cost calculator — honest pending state. */}
          <Card className="flex flex-col p-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-eyebrow text-brick">{tools.tenant.eyebrow}</p>
              <Badge variant="outline">{tools.tenant.status}</Badge>
            </div>
            <CardTitle className="mt-3 text-2xl">{tools.tenant.heading}</CardTitle>
            <CardContent className="mt-3 flex-1 p-0 text-stone">
              <p>{tools.tenant.body}</p>
            </CardContent>
            <div className="mt-6">
              <Button asChild variant="secondary">
                <Link href={tools.tenant.href}>{tools.tenant.cta}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
