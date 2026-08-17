/** UK-locale formatting helpers (en-GB, GBP, dd Month yyyy). */

const gbp = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

/** £1,150 */
export function formatGbp(amount: number): string {
  return gbp.format(amount);
}

/** £1,150 pcm */
export function formatRentPcm(amount: number): string {
  return `${formatGbp(amount)} pcm`;
}

/** 3 September 2026 (input: ISO yyyy-mm-dd) — timezone-safe. */
export function formatUkDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/** "2 bedrooms" / "1 bedroom" */
export function pluralise(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
