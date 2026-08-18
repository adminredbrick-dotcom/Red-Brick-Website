"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { business } from "@/config/business";
import { idleFormResult, type FieldDef, type FormResult, type FormSpec } from "@/lib/forms/messages";
import { cn } from "@/lib/utils";

type FormAction = (prev: FormResult, formData: FormData) => Promise<FormResult>;

interface ComposerFormProps {
  spec: FormSpec;
  action: FormAction;
  /** Unique id prefix so two forms on one page never share ids. */
  idPrefix: string;
  headingLevel?: "h2" | "h3";
  className?: string;
}

/**
 * A validated form that composes a WhatsApp message (see src/lib/forms).
 * Progressive enhancement: the server action runs on a plain POST without
 * JavaScript and the page re-renders with errors or the ready message; with
 * JavaScript the same state arrives in place via useActionState. Errors are
 * announced (role="alert"), linked to their fields (aria-describedby,
 * aria-invalid) and listed at the top with links that move focus.
 */
export function ComposerForm({ spec, action, idPrefix, headingLevel = "h2", className }: ComposerFormProps) {
  const [state, formAction, pending] = React.useActionState(action, idleFormResult);
  const Heading = headingLevel;
  const id = (name: string) => `${idPrefix}-${name}`;
  const summaryRef = React.useRef<HTMLDivElement>(null);
  const readyRef = React.useRef<HTMLDivElement>(null);
  const errorEntries = Object.entries(state.errors);

  React.useEffect(() => {
    if (state.status === "invalid") summaryRef.current?.focus();
    if (state.status === "ready") readyRef.current?.focus();
  }, [state]);

  if (state.status === "ready" && state.message && state.whatsappHref) {
    return (
      <div
        ref={readyRef}
        tabIndex={-1}
        className={cn("rounded-lg bg-white p-6 shadow-soft md:p-8", className)}
        role="region"
        aria-labelledby={id("ready-heading")}
        data-form-status="ready"
      >
        <p className="text-eyebrow text-brick">Ready to send</p>
        <Heading id={id("ready-heading")} className="mt-2 text-2xl">
          Your message is ready — send it on WhatsApp
        </Heading>
        <p className="mt-3 text-stone">
          Online delivery from this website is not active yet, so nothing has been sent. Review the
          message below, then send it to Red Brick on WhatsApp {business.whatsapp.displayNumber}.
        </p>
        <pre className="mt-4 whitespace-pre-wrap rounded-md bg-cream p-4 font-sans text-base text-ink" data-form-message>
          {state.message}
        </pre>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <a href={state.whatsappHref} data-form-whatsapp>
              <MessageCircle aria-hidden="true" />
              Send on WhatsApp
            </a>
          </Button>
          <CopyButton text={state.message} />
        </div>
        <p className="mt-4 text-sm text-stone">{spec.privacyNote}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      aria-labelledby={id("heading")}
      className={cn("rounded-lg bg-white p-6 shadow-soft md:p-8", className)}
      data-form-status={state.status}
    >
      <Heading id={id("heading")} className="text-2xl">
        {spec.heading}
      </Heading>
      <p className="mt-2 text-stone">{spec.intro}</p>

      {state.status === "invalid" && errorEntries.length > 0 ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="mt-5 rounded-md border-l-4 border-error bg-white px-4 py-3"
        >
          <p className="font-bold text-ink">Please check {errorEntries.length === 1 ? "this field" : `these ${errorEntries.length} fields`}:</p>
          <ul className="mt-1 list-disc pl-5">
            {errorEntries.map(([name, message]) => (
              <li key={name}>
                <a href={`#${id(name)}`} className="text-brick underline underline-offset-4">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-5">
        {spec.fields.map((field) => (
          <Field key={field.name} field={field} id={id(field.name)} value={state.values[field.name] ?? ""} error={state.errors[field.name]} />
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Checking…" : spec.submitLabel}
        </Button>
        <p className="text-sm text-stone">Next step: the message opens in WhatsApp for you to send.</p>
      </div>
      <p className="mt-4 text-sm text-stone">{spec.privacyNote}</p>
    </form>
  );
}

function Field({ field, id, value, error }: { field: FieldDef; id: string; value: string; error?: string }) {
  const hintId = field.hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  const labelClass = "block text-base font-bold text-ink";
  const common = {
    id,
    name: field.name,
    "aria-describedby": describedBy,
    "aria-invalid": error ? true : undefined,
    required: field.required,
    defaultValue: value,
  } as const;

  if (field.kind === "radio") {
    return (
      <fieldset aria-describedby={describedBy} aria-invalid={error ? true : undefined}>
        <legend className={labelClass}>
          {field.label}
          {field.required ? <span className="text-stone"> (required)</span> : null}
        </legend>
        {field.hint ? (
          <p id={hintId} className="mt-1 text-sm text-stone">
            {field.hint}
          </p>
        ) : null}
        <div className="mt-2 flex flex-col gap-2" id={id}>
          {field.options?.map((o) => (
            <label key={o.value} className="flex cursor-pointer items-start gap-3 rounded-md border border-stone-light bg-white px-3 py-2 has-[:checked]:border-brick">
              <input
                type="radio"
                name={field.name}
                value={o.value}
                defaultChecked={value === o.value}
                className="mt-1 size-5 accent-brick"
                aria-describedby={errorId}
              />
              <span className="text-base text-ink">{o.label}</span>
            </label>
          ))}
        </div>
        {error ? (
          <p id={errorId} className="mt-2 text-base font-bold text-error">
            {error}
          </p>
        ) : null}
      </fieldset>
    );
  }

  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {field.label}
        {field.required ? <span className="text-stone"> (required)</span> : <span className="text-stone"> (optional)</span>}
      </label>
      {field.hint ? (
        <p id={hintId} className="mt-1 text-sm text-stone">
          {field.hint}
        </p>
      ) : null}
      {field.kind === "select" ? (
        <Select {...common} className="mt-1.5">
          <option value="">Please choose</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ) : field.kind === "textarea" ? (
        <Textarea {...common} className="mt-1.5" maxLength={field.maxLength} placeholder={field.placeholder} />
      ) : (
        <Input {...common} type="text" className="mt-1.5" maxLength={field.maxLength} placeholder={field.placeholder} autoComplete={field.autoComplete} />
      )}
      {error ? (
        <p id={errorId} className="mt-2 text-base font-bold text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** JS-only convenience: copies the composed message (hidden without JavaScript). */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <span data-needs-js className="inline-flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          } catch {
            setCopied(false);
          }
        }}
      >
        Copy message
      </Button>
      <span role="status" aria-live="polite" className="text-sm text-stone">
        {copied ? "Copied" : ""}
      </span>
    </span>
  );
}
