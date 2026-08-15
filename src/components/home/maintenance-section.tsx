import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { maintenanceCopy } from "@/content/approved-copy";
import { maintenanceRoutes } from "@/content/home-copy";
import { cn } from "@/lib/utils";

/**
 * Maintenance: the approved five steps as a timeline (horizontal on desktop,
 * vertical on mobile) plus the two routes. No response-time or 24/7 promises.
 */
export function MaintenanceSection({ id }: { id: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-4 bg-white">
      <div className="container-rb py-14 md:py-20 lg:py-24">
        <p className="text-eyebrow text-brick">Maintenance</p>
        <h2 id={`${id}-heading`} className="text-section mt-3 max-w-2xl">
          {maintenanceCopy.heading}
        </h2>
        <p className="measure-body mt-4 text-lg text-stone">{maintenanceCopy.body}</p>

        <ol
          aria-label="Our maintenance journey"
          className="relative ml-5 mt-10 border-l-2 border-stone-light md:ml-0 md:grid md:grid-cols-5 md:gap-6 md:border-l-0 md:before:absolute md:before:left-[22px] md:before:right-[calc(20%-1.2rem-22px)] md:before:top-[21px] md:before:h-0.5 md:before:bg-stone-light md:before:content-['']"
        >
          {maintenanceCopy.steps.map((step, index) => (
            <li key={step} className="relative pb-8 pl-8 last:pb-0 md:pb-0 md:pl-0 md:pt-16">
              <span
                aria-hidden="true"
                className="absolute -left-[23px] top-0 flex size-11 items-center justify-center rounded-full bg-brick font-display text-lg font-bold text-white md:left-0"
              >
                {index + 1}
              </span>
              <span className="block pt-2 text-xl font-bold md:pt-0">
                <span className="sr-only">Step {index + 1}: </span>
                {step}
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {maintenanceRoutes.map((route) => (
            <Card
              key={route.id}
              className={cn(
                "flex flex-col p-8",
                route.id === "landlord" && "in-data-[audience=landlord]:order-first",
              )}
            >
              <p className="text-eyebrow text-brick">{route.eyebrow}</p>
              <CardTitle className="mt-3 text-2xl">{route.heading}</CardTitle>
              <CardContent className="mt-3 flex-1 p-0 text-stone">{route.body}</CardContent>
              <div className="mt-6">
                <Button asChild variant={route.id === "tenant" ? "primary" : "outline"}>
                  <Link href={route.href}>{route.cta}</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
