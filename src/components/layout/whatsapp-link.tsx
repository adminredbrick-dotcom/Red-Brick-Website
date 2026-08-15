import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { business } from "@/config/business";
import { whatsappHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface WhatsAppLinkProps {
  variant?: "button" | "icon" | "inline";
  /** Override the visible label for the button variant. */
  label?: string;
  className?: string;
}

/**
 * The confirmed primary contact. Always displays the UK number format while
 * linking with the international wa.me format (DoD: Navigation).
 */
export function WhatsAppLink({ variant = "button", label, className }: WhatsAppLinkProps) {
  const href = whatsappHref();

  if (variant === "icon") {
    return (
      <a
        href={href}
        className={cn(
          "inline-flex size-11 items-center justify-center rounded-md text-ink hover:bg-sand",
          className,
        )}
        aria-label={`Message us on WhatsApp, ${business.whatsapp.displayNumber}`}
      >
        <MessageCircle className="size-6" aria-hidden="true" />
      </a>
    );
  }

  if (variant === "inline") {
    return (
      <a href={href} className={cn("font-bold text-brick underline underline-offset-4", className)}>
        WhatsApp {business.whatsapp.displayNumber}
      </a>
    );
  }

  return (
    <Button asChild className={className}>
      <a href={href}>
        <MessageCircle aria-hidden="true" />
        {label ?? "Message us on WhatsApp"}
      </a>
    </Button>
  );
}
