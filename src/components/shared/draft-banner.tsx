/**
 * Marks legal/regulatory pages as unreviewed drafts. Must remain visible
 * until the page content has been professionally reviewed and approved
 * (DoD: privacy placeholders visibly not launch-ready).
 */
export function DraftBanner() {
  return (
    <div className="border-b-2 border-attention bg-sand">
      <div className="container-rb py-4">
        <p className="font-bold text-ink">
          Draft placeholder — not yet reviewed for publication.
        </p>
        <p className="text-ink/80">
          This page will be completed and professionally reviewed before the website launches. It
          is not current legal information.
        </p>
      </div>
    </div>
  );
}
