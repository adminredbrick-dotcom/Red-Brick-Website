# Portfolio listings — how the real properties reach the site

Added 18/08/2026 on `feature/homepage-production`.

## What is published
`/properties`, the detail pages and the homepage property preview now show the **Red Brick
Lettings portfolio** (46 homes) instead of the eight fictional demonstration records. Every record
carries **public-safe facts only**:

| Field | Source | Notes |
|---|---|---|
| Street name + postcode district (e.g. "Belsize Avenue, PE2") | EPC certificate address (GOV.UK register) | House number / flat letter stripped by the extractor and asserted absent by tests |
| Property type, floor area | EPC certificate | "Mid-terrace house" → terraced house, etc. |
| EPC rating | EPC certificate | Published only while the certificate is in date; carries the check date and source |
| Status | Office occupancy sheet (`ONE PAGE PLAN RED BRICK.xlsx`, sheet "1 page plan") | "Available" when the tenant column says VACANT, otherwise "Currently let"; homes with no row are assumed let and listed for confirmation (OWNER-DECISIONS row 65) |
| Rent | Occupancy sheet, **available homes only** | Occupied homes never show a rent ("Rent on application") |
| Neighbourhood | Agency's street → area assignment | Map pin = area centre + small deterministic offset; never the home |

Deliberately **not** published: house numbers, full postcodes, owners, tenants, contacts, tenancy
dates, occupied-home rents, notes, licences, deposits, council-tax bands, bedrooms/bathrooms (until
supplied — shown as "to be confirmed"), photographs (placeholder illustration until approved
photographs exist).

## Pipeline
```
D:\1. RB Properties\<Address>_P_<id>\...\EPC*\*.pdf     ┐
D:\2. RB Business Docs\...\ONE PAGE PLAN RED BRICK.xlsx  ┴─▶ scripts/listings/extract-portfolio.py
        ▶ src/lib/listings/portfolio.json          (shipped, public-safe fields only)
        ▶ scripts/listings/portfolio-audit.json    (office-only audit: source file names, status source)
src/lib/listings/portfolio-listings.ts  → maps the JSON to the `Listing` contract
src/lib/listings/repository.ts          → `listingsRepository = new InMemoryListingsRepository(portfolioListings)`
```
Re-run the extractor on the office machine whenever a certificate is renewed or availability
changes, then rebuild. The demonstration set (`demo-listings.ts`, `DemoListingsRepository`) is kept
for tests and the Phase 2 experiment pages only.

## Contract changes
- `Listing.pricing.rentPcm: number | null` ("Rent on application").
- `Listing.property.bedrooms / bathrooms: number | null` ("to be confirmed").
- New status `let` → "Currently let" (filter option, badge, ordering after available/soon/agreed).
- `Listing.source: string | null` (honesty line: where the facts came from and when checked).
- Five neighbourhoods added to `areas.ts`: Millfield, New England, Eastfield (PE1), West Town,
  Netherton (PE3).

## Tests
- `tests/unit/listings.test.ts` — portfolio set: ≥ 40 records, unique slugs, no full postcode, no
  digits in titles, no rent on occupied homes, EPC facts sourced from the register; the bound
  repository serves the portfolio.
- `tests/e2e/phase2/properties.spec.ts` — rewritten against the portfolio (46 homes, available
  first, filters, empty state, map, keyboard, axe, detail pages for an available and a let home,
  404 for unknown slugs).
