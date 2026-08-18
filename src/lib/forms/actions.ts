"use server";

import { whatsappHref } from "@/lib/whatsapp";

import { composeMessage, formSpecs, readValues, validate, type FormKind, type FormResult } from "./messages";

/**
 * Server-side validation for every form (works with and without JavaScript
 * — a plain POST re-renders the page with this state). Deliberately does
 * NOT log the submission: repair reports and messages can contain personal
 * details (CLAUDE.md: never log sensitive form bodies by default).
 */
async function submitForm(kind: FormKind, _prev: FormResult, formData: FormData): Promise<FormResult> {
  const spec = formSpecs[kind];
  const values = readValues(spec, formData);
  const errors = validate(spec, values);
  if (Object.keys(errors).length > 0) {
    return { status: "invalid", values, errors, message: null, whatsappHref: null };
  }
  const message = composeMessage(spec, values);
  return { status: "ready", values, errors: {}, message, whatsappHref: whatsappHref(undefined, message) };
}

export async function submitRepairReport(prev: FormResult, formData: FormData): Promise<FormResult> {
  return submitForm("repair", prev, formData);
}

export async function submitLandlordMaintenance(prev: FormResult, formData: FormData): Promise<FormResult> {
  return submitForm("landlord-maintenance", prev, formData);
}

export async function submitContactMessage(prev: FormResult, formData: FormData): Promise<FormResult> {
  return submitForm("contact", prev, formData);
}
