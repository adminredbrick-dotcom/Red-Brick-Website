import { business } from "@/config/business";

/**
 * Builds a wa.me link from an E.164 number.
 * The visible text should always be the UK display number
 * (business.whatsapp.displayNumber); the href must be international.
 */
export function whatsappHref(e164: string = business.whatsapp.e164, message?: string): string {
  const digits = e164.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
