import Link from "next/link";

import { showFor } from "@/components/home/audience";
import { AudienceSwitch } from "@/components/home/audience-switch";
import { HouseIllustration } from "@/components/home/house-illustration";
import { WhatsAppLink } from "@/components/layout/whatsapp-link";
import { Button } from "@/components/ui/button";
import { closingCopy } from "@/content/approved-copy";
import { finaleActions } from "@/content/home-copy";
import { cn } from "@/lib/utils";

/**
 * Finale: the assembled house on a warm cream surface with one clear,
 * audience-personalised action. WhatsApp stays visible but secondary.
 * All three actions are server-rendered; the wrapper attribute picks one.
 */
export function HomeFinale({ id }: { id: string }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="scroll-mt-4 border-t border-stone-light bg-cream"
    >
      <div className="container-rb py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="order-last lg:order-none">
            <HouseIllustration
              stage={5}
              className="mx-auto max-w-md lg:max-w-none"
              label="Illustration: the finished Red Brick house, warmly lit, on its Peterborough ground plane."
            />
          </div>

          <div>
            <p className="text-eyebrow text-brick">Next step</p>
            <h2 id={`${id}-heading`} className="text-section mt-3 max-w-2xl">
              {closingCopy.heading}
            </h2>
            <p className="measure-body mt-4 text-lg text-stone">{closingCopy.body}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {(["landlord", "tenant", "none"] as const).map((audience) => (
                <Button key={audience} asChild size="lg" className={cn(showFor[audience])}>
                  <Link href={finaleActions[audience].href}>{finaleActions[audience].label}</Link>
                </Button>
              ))}
              <WhatsAppLink
                variant="button"
                className="min-h-14 border-2 border-ink bg-transparent px-7 py-3.5 text-lg text-ink hover:bg-sand"
              />
            </div>

            <AudienceSwitch returnTo={id} className="mt-8" />
          </div>
        </div>
      </div>
    </section>
  );
}
