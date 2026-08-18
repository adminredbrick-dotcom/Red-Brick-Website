/**
 * Enquiry, repair-report and landlord-maintenance forms — the shared,
 * side-effect-free layer: field definitions, validation and the WhatsApp
 * message each form composes.
 *
 * Why WhatsApp: no form-delivery endpoint or inbox has been confirmed yet
 * (docs/OWNER-DECISIONS.md row 52), and CLAUDE.md requires an honest state
 * rather than a fake "sent" message. So the forms validate on the server,
 * then hand the visitor a ready-made WhatsApp message they send themselves —
 * the confirmed contact route. Nothing is stored or logged here.
 *
 * When a real destination exists, `src/lib/forms/actions.ts` gains a delivery
 * step and this file does not change.
 */

export type FormKind = "repair" | "landlord-maintenance" | "contact";

export interface FieldOption {
  readonly value: string;
  readonly label: string;
}

export interface FieldDef {
  readonly name: string;
  readonly label: string;
  readonly kind: "text" | "textarea" | "select" | "radio";
  readonly required?: boolean;
  readonly hint?: string;
  readonly placeholder?: string;
  readonly options?: readonly FieldOption[];
  readonly autoComplete?: string;
  readonly maxLength?: number;
  /** Message shown when the field is required and empty. */
  readonly requiredMessage?: string;
}

export interface FormSpec {
  readonly kind: FormKind;
  readonly heading: string;
  readonly intro: string;
  readonly submitLabel: string;
  readonly fields: readonly FieldDef[];
  /** Privacy wording shown under the form (CMS "Maintenance → Privacy wording"). */
  readonly privacyNote: string;
}

export const repairCategories: readonly FieldOption[] = [
  { value: "heating-hot-water", label: "Heating or hot water" },
  { value: "leak-plumbing", label: "Leak, drain or plumbing" },
  { value: "electrics", label: "Electrics or lighting" },
  { value: "doors-windows-locks", label: "Doors, windows or locks" },
  { value: "damp-mould", label: "Damp, mould or condensation" },
  { value: "appliance", label: "Appliance provided with the home" },
  { value: "roof-gutters-external", label: "Roof, gutters or outside" },
  { value: "other", label: "Something else" },
];

export const urgencyOptions: readonly FieldOption[] = [
  { value: "urgent", label: "Urgent — no heating or hot water, an active leak, no power or water, or the home is not secure" },
  { value: "soon", label: "Needs attention soon — it affects daily use but the home is safe" },
  { value: "routine", label: "Routine — general wear, minor faults, something to check" },
];

export const contactRoles: readonly FieldOption[] = [
  { value: "landlord", label: "I own a property" },
  { value: "tenant", label: "I rent with Red Brick" },
  { value: "looking", label: "I am looking for a home" },
  { value: "other", label: "Something else" },
];

export const repairFormSpec: FormSpec = {
  kind: "repair",
  heading: "Report a repair",
  intro:
    "Tell us what has happened, where, and how urgent it feels. We check the details and agree the right priority with you — the exact response depends on the issue and the arrangements for the property.",
  submitLabel: "Prepare my report",
  fields: [
    { name: "name", label: "Your name", kind: "text", required: true, autoComplete: "name", maxLength: 80, requiredMessage: "Please enter your name." },
    {
      name: "property",
      label: "Property",
      kind: "text",
      required: true,
      hint: "The street and postcode of the home you rent, so we know which property this is about.",
      autoComplete: "street-address",
      maxLength: 120,
      requiredMessage: "Please tell us which property this is about (street and postcode).",
    },
    { name: "category", label: "What kind of problem is it?", kind: "select", required: true, options: repairCategories, requiredMessage: "Please choose the kind of problem." },
    { name: "urgency", label: "How urgent does it feel?", kind: "radio", required: true, options: urgencyOptions, requiredMessage: "Please choose how urgent it feels." },
    {
      name: "description",
      label: "What has happened?",
      kind: "textarea",
      required: true,
      hint: "Where in the home, when it started, and anything you have already tried. Photos help — you can attach them in WhatsApp.",
      maxLength: 1500,
      requiredMessage: "Please describe what has happened.",
    },
    {
      name: "access",
      label: "Access and contact",
      kind: "textarea",
      hint: "When it is convenient to visit and how you prefer to be contacted (optional).",
      maxLength: 400,
    },
  ],
  privacyNote:
    "Your answers are checked by this website and turned into a WhatsApp message that you send to Red Brick yourself, so you can review it first; nothing is stored or forwarded. Do not include alarm codes, key-safe numbers or bank details.",
};

export const landlordMaintenanceFormSpec: FormSpec = {
  kind: "landlord-maintenance",
  heading: "Ask about maintenance on your property",
  intro:
    "Tell us which property and what you would like to raise — a repair you have been told about, a planned improvement, or a question about how coordination works.",
  submitLabel: "Prepare my message",
  fields: [
    { name: "name", label: "Your name", kind: "text", required: true, autoComplete: "name", maxLength: 80, requiredMessage: "Please enter your name." },
    { name: "property", label: "Property", kind: "text", required: true, hint: "Street and postcode.", autoComplete: "street-address", maxLength: 120, requiredMessage: "Please tell us which property (street and postcode)." },
    { name: "description", label: "What would you like to raise?", kind: "textarea", required: true, maxLength: 1500, requiredMessage: "Please tell us what you would like to raise." },
  ],
  privacyNote:
    "Your message is checked by this website and opens in WhatsApp for you to review and send; nothing is stored or forwarded.",
};

export const contactFormSpec: FormSpec = {
  kind: "contact",
  heading: "Send us a message",
  intro: "Tell us who you are and what you need help with. We will pick it up on WhatsApp.",
  submitLabel: "Prepare my message",
  fields: [
    { name: "role", label: "Which best describes you?", kind: "select", required: true, options: contactRoles, requiredMessage: "Please choose which best describes you." },
    { name: "name", label: "Your name", kind: "text", required: true, autoComplete: "name", maxLength: 80, requiredMessage: "Please enter your name." },
    { name: "message", label: "Your message", kind: "textarea", required: true, maxLength: 1500, requiredMessage: "Please enter your message." },
  ],
  privacyNote:
    "Your message is checked by this website and opens in WhatsApp for you to review and send; nothing is stored or forwarded.",
};

export const formSpecs: Record<FormKind, FormSpec> = {
  repair: repairFormSpec,
  "landlord-maintenance": landlordMaintenanceFormSpec,
  contact: contactFormSpec,
};

export type FormValues = Record<string, string>;
export type FormErrors = Record<string, string>;

/**
 * Result of a form submission. "ready" means the message was validated and
 * composed — it has NOT been delivered anywhere (no endpoint is configured);
 * the visitor sends it via WhatsApp. When a delivery integration exists,
 * a "sent" status is added and the UI shows a success message only after
 * confirmed delivery (DoD: Maintenance and forms).
 */
export interface FormResult {
  readonly status: "idle" | "invalid" | "ready";
  readonly values: FormValues;
  readonly errors: FormErrors;
  readonly message: string | null;
  readonly whatsappHref: string | null;
}

export const idleFormResult: FormResult = { status: "idle", values: {}, errors: {}, message: null, whatsappHref: null };

/** Read the fields of a spec from a FormData (or plain record) into trimmed strings. */
export function readValues(spec: FormSpec, source: FormData | Record<string, unknown>): FormValues {
  const out: FormValues = {};
  for (const f of spec.fields) {
    const raw = source instanceof FormData ? source.get(f.name) : source[f.name];
    out[f.name] = typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim() : "";
  }
  return out;
}

/** Validate against the spec. Errors are short, specific and keyed by field name. */
export function validate(spec: FormSpec, values: FormValues): FormErrors {
  const errors: FormErrors = {};
  for (const f of spec.fields) {
    const v = values[f.name] ?? "";
    if (f.required && v.length === 0) {
      errors[f.name] = f.requiredMessage ?? `Please ${f.kind === "select" || f.kind === "radio" ? "choose" : "enter"} ${f.label.toLowerCase().replace(/\?$/, "")}.`;
      continue;
    }
    if (v.length === 0) continue;
    if (f.options && !f.options.some((o) => o.value === v)) {
      errors[f.name] = "Please choose one of the listed options.";
      continue;
    }
    if (f.maxLength && v.length > f.maxLength) {
      errors[f.name] = `Please keep this under ${f.maxLength} characters.`;
      continue;
    }
    if (f.name === "name" && !/[A-Za-z]/.test(v)) errors[f.name] = "Please enter your name.";
  }
  return errors;
}

function optionLabel(options: readonly FieldOption[] | undefined, value: string): string {
  return options?.find((o) => o.value === value)?.label ?? value;
}

/** The WhatsApp message for a validated form. Plain text, one field per line, no markup. */
export function composeMessage(spec: FormSpec, values: FormValues): string {
  const lines: string[] = [];
  switch (spec.kind) {
    case "repair":
      lines.push(`Hello Red Brick, I'd like to report a repair.`);
      lines.push(`Name: ${values.name}`);
      lines.push(`Property: ${values.property}`);
      lines.push(`Problem: ${optionLabel(repairCategories, values.category ?? "")}`);
      lines.push(`Urgency: ${optionLabel(urgencyOptions, values.urgency ?? "").split(" — ")[0]}`);
      lines.push(`What has happened: ${values.description}`);
      if (values.access) lines.push(`Access and contact: ${values.access}`);
      break;
    case "landlord-maintenance":
      lines.push(`Hello Red Brick, I'd like to raise a maintenance question about my property.`);
      lines.push(`Name: ${values.name}`);
      lines.push(`Property: ${values.property}`);
      lines.push(`Details: ${values.description}`);
      break;
    case "contact":
      lines.push(`Hello Red Brick, ${optionLabel(contactRoles, values.role ?? "").replace(/^I /, "I ")}.`);
      lines.push(`Name: ${values.name}`);
      lines.push(`Message: ${values.message}`);
      break;
  }
  return lines.join("\n");
}
