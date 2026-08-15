interface UnavailableModuleProps {
  reason: string;
}

/**
 * Honest unavailable state for a report module. Visibly a placeholder —
 * never styled as content, never replaced with a manufactured value.
 */
export function UnavailableModule({ reason }: UnavailableModuleProps) {
  return (
    <div className="rounded-md border-2 border-dashed border-stone-light bg-cream px-5 py-4">
      <p className="text-eyebrow text-stone">Not available</p>
      <p className="mt-1 text-ink">{reason}</p>
    </div>
  );
}
