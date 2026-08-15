import type { FigureKind, FigureMeta, FigureQuality } from "@/data/contracts/rental-report";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const qualityLabels: Record<FigureQuality, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  unavailable: "Not assessed",
};

const kindLabels: Record<FigureKind, string> = {
  factual: "Factual",
  modelled: "Modelled",
  illustrative: "Illustrative sample",
};

interface SourceMetaProps {
  meta: FigureMeta;
  className?: string;
}

/**
 * Prints the DATA-SOURCE-PLAN metadata that every figure must carry:
 * source · geography · observed · retrieved · quality · kind.
 */
export function SourceMeta({ meta, className }: SourceMetaProps) {
  const items: { term: string; detail: React.ReactNode }[] = [
    {
      term: "Source",
      detail: meta.sourceUrl ? (
        <a href={meta.sourceUrl} className="underline underline-offset-4" rel="noopener noreferrer">
          {meta.sourceName}
        </a>
      ) : (
        meta.sourceName
      ),
    },
    { term: "Geography", detail: meta.geography },
    { term: "Observed", detail: formatDate(meta.observationDate, "Not recorded") },
    { term: "Retrieved", detail: formatDate(meta.retrievalDate, "Not recorded") },
    { term: "Quality", detail: qualityLabels[meta.quality] },
    { term: "Kind", detail: kindLabels[meta.kind] },
  ];
  if (meta.licence) items.push({ term: "Licence", detail: meta.licence });
  if (meta.modelVersion) items.push({ term: "Model", detail: meta.modelVersion });
  if (meta.lastReviewed) {
    items.push({ term: "Last reviewed", detail: formatDate(meta.lastReviewed) });
  }

  return (
    <dl
      className={cn(
        "flex flex-wrap gap-x-4 gap-y-1 border-t border-stone-light pt-3 text-sm text-stone",
        className,
      )}
    >
      {items.map((item) => (
        <div key={item.term} className="inline">
          <dt className="inline font-bold">{item.term}: </dt>
          <dd className="inline">{item.detail}</dd>
        </div>
      ))}
    </dl>
  );
}
