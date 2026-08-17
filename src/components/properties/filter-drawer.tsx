"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface FilterDrawerProps {
  /** Number of active filters, shown on the trigger. */
  activeCount: number;
  /** The server-rendered FilterForm instance for the drawer. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile filter drawer (Radix Dialog: focus trap, Esc, visible close). Shown
 * below the desktop breakpoint; the desktop sidebar renders the same form
 * inline. Without JavaScript the trigger is inert, so the properties page
 * also renders the plain form inside <noscript> for small screens —
 * filtering never depends on this island.
 */
export function FilterDrawer({ activeCount, children, className }: FilterDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const label = activeCount > 0 ? `Filters (${activeCount} active)` : "Filters";

  return (
    <div className={className}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline">
            <SlidersHorizontal aria-hidden="true" />
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent closeLabel="Close filters" className="max-w-md">
          <DialogTitle className="text-eyebrow text-brick">Filter properties</DialogTitle>
          <DialogDescription className="mt-2 text-stone">
            Choose an area, rent range, bedrooms, type and availability, then apply.
          </DialogDescription>
          <div className="mt-6">{children}</div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
