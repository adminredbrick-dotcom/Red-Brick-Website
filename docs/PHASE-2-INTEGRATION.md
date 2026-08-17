# Phase 2 → homepage integration guide

> **Status 17/08/2026:** integrated on `feature/homepage-production` — `src/app/page.tsx` imports
> `PropertyPreview`, `AppraisalPreview` and `MoveInCostPreview` (sections 5–6). The hybrid
> experiment route stays as the reviewed prototype. The guidance below remains valid for hosts.

Phase 2 (`experiment/phase2-new-flow`) built the practical, Resider-inspired journeys that
follow the cinematic homepage. The homepage and its 3D narrative stay owned by the
`experiment/hybrid-db` work; **this branch does not touch `src/components/experiments/hybrid-db`
or `src/app/page.tsx`**. It provides three reusable preview components and a typed data layer
that the hybrid homepage imports later. An internal showcase of the previews lives at
`/experiments/phase2-previews`.

## Components (server-safe, no client JavaScript, no canvas)

| Component | Import | What it renders | Host responsibilities |
|---|---|---|---|
| `PropertyPreview` (async) | `import { PropertyPreview } from "@/components/previews/property-preview";` | Eyebrow + heading + lede, 3 featured demonstration `PropertyCard`s (list-first), the static schematic `StaticMap`, one **View properties** action | Wrap in `<section aria-labelledby="property-preview-heading">` (or pass `headingId`); choose the surface (white); pass `headingLevel="h2"` (default) so cards become h3 |
| `AppraisalPreview` | `import { AppraisalPreview } from "@/components/previews/appraisal-preview";` | "What could your property rent for?" card with the estimate label and one **Request a rental appraisal** action → `/rental-appraisal` | Landmark + surface (sand); `headingLevel` h2/h3 |
| `MoveInCostPreview` | `import { MoveInCostPreview } from "@/components/previews/move-in-cost-preview";` | "Move-in costs explained" — worked example on a stated rent (default £1,000) using `calculateMoveInCosts`, labelled "Demonstration figures", link → `/tenants` | Landmark + surface; `exampleRentPcm` optional |

Rules the components already honour: mandatory labels from `src/content/demo-labels.ts`; no
`<img>`, `<canvas>` or `<video>`; semantic HTML; 44 px targets; brand tokens only. They contain
**no `<section>` of their own** so the host page controls the document outline and spacing.

## Suggested placement on the hybrid homepage (storyboard v3, sections 5–6)

```tsx
// src/components/experiments/hybrid-db/landing.tsx (future edit on the hybrid branch)
import { PropertyPreview } from "@/components/previews/property-preview";
import { AppraisalPreview } from "@/components/previews/appraisal-preview";
import { MoveInCostPreview } from "@/components/previews/move-in-cost-preview";

<section aria-labelledby="property-preview-heading" className={cx(styles.chapter, styles.onWhite)}>
  <div className="container-rb">
    <PropertyPreview />                     {/* storyboard §5 — after the 3D chapter */}
  </div>
</section>
<section aria-labelledby="tools-heading" className={cx(styles.chapter, styles.onSand)}>
  <div className="container-rb">
    <h2 id="tools-heading">…</h2>
    <div className="grid gap-6 lg:grid-cols-2">
      <AppraisalPreview headingLevel="h3" />   {/* storyboard §6 */}
      <MoveInCostPreview headingLevel="h3" />
    </div>
  </div>
</section>
```

Because `PropertyPreview` is an async server component, the hybrid landing must remain a server
component at the point of use (it is today) or the preview must be rendered by the page and
passed down as a node.

## Data layer to reuse

- `src/lib/listings/{types,areas,filters,repository,demo-listings}.ts` — `Listing` contract
  (public-safe fields only), `ListingsRepository` interface, `DemoListingsRepository` and the
  single binding `listingsRepository`. Replace the binding with a CMS/PMS adapter later.
- `src/lib/appraisal/{types,demo-adapter,move-in-costs}.ts` — `RentalReport` contract with
  provenance metadata, `RentalReportAdapter` interface, `DemoRentalReportAdapter`,
  `parseAppraisalRequest`, `calculateMoveInCosts`.
- `src/content/demo-labels.ts` — the exact mandated labels.
- `src/components/properties/*` — `PropertyCard`, `StaticMap`, `DemoBadge`, `StatusBadge`,
  `PlaceholderImage`, filter form/drawer, detail sections.

## Contract for the landing/hybrid tests (when the hybrid adopts the previews)

- Required landmarks: property preview (3 cards, "View properties"), appraisal preview,
  move-in-cost preview — asserted by role/heading, not by section count.
- `canvas` count must remain 0 under reduced motion; the previews never add one.
- Every demonstration figure carries its label text.
