"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { routes, primaryNav } from "@/config/site";
import { whatsappHref } from "@/lib/whatsapp";

/**
 * Accessible mobile navigation drawer (Radix Dialog: focus trap, Esc to
 * close, visible close control). Lists every primary route plus Contact.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-sand xl:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} closeLabel="Close menu">
        <DialogTitle className="text-eyebrow text-brick">Menu</DialogTitle>
        <nav aria-label="Mobile" className="mt-6">
          <ul className="flex flex-col">
            {[...primaryNav, "contact" as const].map((key) => (
              <li key={key}>
                <Link
                  href={routes[key].path}
                  onClick={close}
                  className="block rounded-md px-2 py-3 text-lg font-bold text-ink hover:bg-sand"
                >
                  {routes[key].label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col gap-3">
          <Button asChild size="lg">
            <a href={whatsappHref()}>Message us on WhatsApp</a>
          </Button>
          <p className="text-center text-base text-stone">
            WhatsApp {business.whatsapp.displayNumber}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
