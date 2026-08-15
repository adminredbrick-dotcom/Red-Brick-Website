const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/** £1,100 */
export function formatGbp(amount: number): string {
  return gbp.format(amount);
}

/** £1,100 pcm */
export function formatRentPcm(amount: number): string {
  return `${formatGbp(amount)} pcm`;
}

/** 13 August 2026 (en-GB long) or "Not published" for null. */
export function formatDate(iso: string | null, fallback = "Not published"): string {
  if (!iso) return fallback;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return fallback;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(
    date,
  );
}

export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
