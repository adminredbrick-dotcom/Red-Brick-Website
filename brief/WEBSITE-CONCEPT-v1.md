# Red Brick Lettings website concept — v1

Status: concept direction for discussion, not a final visual design.

## The concept

**Start with a choice. Build trust. Reveal how care holds a home together.**

The website combines two ideas:

- Igloo's memorable, object-led storytelling for the emotional parts of the homepage.
- Resider's calm, practical map, listings, property details and appraisal flow for the useful parts of the site.

In one line: **Igloo's house-building story outside; Resider's clear letting journeys inside.**

The 3D experience should make Red Brick memorable, but it must never delay property search, repair reporting, contact details or the landlord appraisal route.

## Audience choice

The hero asks one simple question: **What would you like help with?**

Primary choices:

1. **I'm a landlord** — reveals a landlord-focused version of the homepage and leads to the rental appraisal.
2. **I'm looking for a home** — reveals a tenant-focused version and leads to available properties.

A smaller utility link serves current tenants: **Already rent with us? Report a repair.**

The selected route changes the order and wording of later homepage sections. A visible **Switch view** control lets visitors change route. The permanent navigation still exposes Properties, Landlords, Tenants, Maintenance, Insights, About and WhatsApp.

## Homepage flow

### 1. Hero — immediate clarity

- Headline: **Property cared for. People looked after.**
- Supporting line: residential lettings and property management across Peterborough, established in 2012.
- Two large audience choices and a direct View properties link.
- Background: a short, muted, scroll-controlled film using warm property details, doors, brick, light and Peterborough glimpses.
- All wording and controls remain normal HTML over the film.
- A still poster replaces motion on reduced-motion settings and lower-powered devices.

The hero should feel cinematic but remain short. Visitors should reach useful content within the first two or three scrolls.

### 2. Local trust strip

Three restrained facts:

- Established in 2012
- Focused on Peterborough
- Support for landlords and tenants

Only verified facts are shown. No invented review score, portfolio count or response-time promise.

### 3. The 3D story — a home built around care

A warm, stylised brick house appears as an exploded cutaway. Scrolling brings the parts together.

**Landlord path**

1. **Prepare** — appraisal, presentation and readiness.
2. **Let** — marketing, enquiries and tenancy setup.
3. **Manage** — rent administration, communication and compliance support.
4. **Care** — maintenance coordination and ongoing oversight.
5. **Confidence** — the finished house settles into place: *Your property is in good hands.*

**Tenant path**

1. **Find** — clear property search and honest information.
2. **Understand** — costs, features and next steps before enquiring.
3. **Move** — a calm, explained tenancy journey.
4. **Live** — repairs, updates and practical help.
5. **At ease** — the finished house becomes a lived-in home: *A good property should feel easy to live in.*

If no audience is selected, the sequence tells the shared story: property, people, communication, care and home.

### 4. Peterborough map and market chapter

- Start with a clean Peterborough-wide map.
- Show available homes as clustered Red Brick markers.
- Search view defaults to an easy 2D angle; visitors may switch to a gentle 3D tilt.
- Selecting a marker opens a compact property card and highlights the matching item in the list.
- The map can also reveal transport, parks and local amenities when the data is dependable.
- A complete list remains available beside or below the map, so the map is never the only way to browse.
- Scroll zoom stays off until the visitor deliberately activates the map.

Peterborough's building heights will often be approximate. The 3D map is an orientation tool, not a survey or legal boundary source.

### 5. Two useful tools

**For tenants: Move-in costs**

Show monthly rent, deposit, any permitted holding deposit, known bills and assumptions in one clear summary. Do not copy Resider's mortgage calculator.

**For landlords: What could your property rent for?**

Ask for address or postcode, property type, bedrooms, condition and a few useful features. Return an **indicative rental range**, local context and an invitation for Red Brick to confirm the recommendation.

### 6. Maintenance — show the care

Use a simple visible process:

**Report → Triage → Arrange → Update → Resolve**

The page has two routes:

- **I live in a Red Brick property** — report a repair and understand urgent next steps.
- **I own a property** — see how maintenance is coordinated and how communication works.

Do not promise 24/7 support, emergency attendance or fixed response times unless Red Brick formally adopts and can deliver them.

### 7. Insights and social content

Blog categories:

- Landlord guidance
- Tenant guidance
- Peterborough property
- Property care
- Legal and market updates

Each article has a clear reviewed date, sources where needed, a social-sharing image and a matching social-post template. The website is the source; social media brings people back to it.

### 8. Finale

The complete house rests on a warm cream background. The selected audience receives one clear next action:

- Landlord: **Request a rental appraisal**
- Tenant: **View available properties**
- General visitor: **Talk to Red Brick**

WhatsApp remains visible without competing with the main action.

## Page structure

### Properties

- Desktop: synchronised list and map.
- Mobile: clear List / Map toggle.
- Launch filters: area or postcode, minimum and maximum rent, bedrooms, property type and availability.
- Add more filters only when the property inventory makes them useful.

### Property detail

Progressive sections:

1. Gallery and key facts
2. Overview
3. Features
4. Costs
5. Location
6. Enquire or request a viewing

Show rent, deposit, availability, furnishing, council tax, EPC and other material details only when verified. Give every listing a last-reviewed date. Actual listing photography must never be replaced with stock or AI imagery.

### Landlords

- The landlord problem in plain language.
- Red Brick's Let, Manage and Care process.
- Service choices once confirmed.
- Evidence and working practices as they become available.
- Rental appraisal entry point.

### Tenants

- Find a property.
- Understand the application and move-in journey.
- View clear costs and common questions.
- Reach current-tenant help and repairs quickly.

### Rental estimate and area report

Recommended result modules:

- Indicative monthly rent range
- Confidence and comparable count
- Peterborough rent trend
- Nearby completed sale context, clearly separated from rent
- Demand context
- Licensing-area caution flag
- Neutral crime categories and trend, with limitations
- Local amenities and transport
- Property considerations and opportunities
- Optional one-year and three-year scenarios
- Human-confirmed appraisal action

Never create one opaque “good area” score. Crime data must not label a home safe or unsafe, and demographic or benefit data must never influence rent or tenant-selection decisions.

### Maintenance

A public explanation of the process plus an actual repair-reporting route. Until the future PMS is ready, submissions can be routed to an agreed inbox or WhatsApp workflow. The future PMS stays a separate product and brand.

### Insights

A simple editor allows Red Brick to draft, review and publish articles without changing code. Every post automatically creates the correct title, description, social preview and related-content links.

## Production stack

The agreed core stack:

- **Next.js App Router + React + TypeScript** — pages, SEO, routing and fast server-rendered content.
- **Tailwind CSS + shadcn/Radix primitives** — one accessible component and design-token system.
- **React Three Fiber + Drei** — the single persistent 3D house story.
- **GSAP + ScrollTrigger** — the one choreography engine for pinning, scrubbing and chapter transitions.
- **Kokonut UI, selectively** — at most a few components, fully restyled and with competing animation removed.
- **Haikei exports** — a small number of static SVG transitions or textures.
- **Sanity, recommended for the content layer** — a visual editor for blogs and reusable website content.

Do not load Mantine, Anime.js, Watermelon UI and another motion system on top of this stack. They overlap with the chosen component or animation layers.

### Map addition

Recommended production option: **MapTiler SDK**, which is MapLibre-based, with MapTiler Cloud. It provides a brandable vector map, 3D building extrusions and custom property markers with predictable commercial terms. The current Flex plan is listed at $30 per month for 25,000 map sessions. Confirm live pricing before purchase.

For the prototype, OpenFreeMap can demonstrate the experience without committing to a provider, but it has no service guarantee. Mapbox is technically strong, but its pricing page requires a separate commercial licence for production real-estate use, so it should not be selected without a quote.

Because the house scene and map both use WebGL, only one remains active at a time. The house scene pauses or unmounts while the map is active.

## Data plan

An honest area report can begin with:

- HM Land Registry Price Paid Data for completed sales.
- ONS private-rent and house-price series for official Peterborough trends.
- Police.uk monthly data for neutral, approximate crime context.
- Peterborough City Council sources for selective-licensing guidance.
- Government EPC data where permitted and correctly licensed.
- Open transport and amenity data where dependable.

Public data is not enough for a confident property-level rent. A production estimate should combine Red Brick's de-identified achieved-rent records, a licensed current-rental comparable feed and staff review. PropertyData or a larger supplier such as Hometrack/Zoopla can be evaluated; portal content must not be scraped.

Result wording:

> **Indicative rent: £X–£Y per calendar month**  
> Based on comparable properties and market data available on [date]. This is an estimate, not a formal valuation or guarantee of achievable rent. Property condition, specification, demand, tenancy terms and legal requirements can affect the final figure. Red Brick Lettings will confirm its recommendation after reviewing the property.

Any future figures are scenarios, not promises or guaranteed returns.

## Delivery phases

### Phase 1 — experience prototype

- Homepage structure and audience choice
- Scroll-film hero prototype
- 3D-house storyboard and low-detail test model
- Peterborough map proof of concept
- One sample property search and detail screen
- One sample rental-report result
- Mobile and reduced-motion versions

No live valuation promise is made in this phase.

### Phase 2 — launch website

- Full responsive pages
- Editable blog and website content
- Property listing administration or feed
- Enquiry and maintenance forms
- Map/list search
- Analytics, privacy, accessibility, SEO and performance QA

### Phase 3 — rental intelligence

- Licensed address lookup and current comparable data
- Red Brick historical-data cleaning
- Indicative rent model with confidence rules
- Area evidence and sourced charts
- Saved or emailed reports if desired
- Monitoring, validation and staff approval workflow

## Decisions required for v2

Short answers are enough; **use the recommended defaults** is also a valid answer.

1. Do you already have usable property or Peterborough video, or should the prototype use a branded placeholder film? Recommended: placeholder first, plan a real shoot later.
2. Should choosing Landlord or Tenant personalise the remaining homepage, open a dedicated page immediately, or do both? Recommended: personalise first, with a clear button to the full page.
3. Where will available-property data come from at launch: manual website entry, an existing portal/CRM feed, or the future PMS? Recommended: editable website records now, with an integration point for the PMS later.
4. For website listings, should we show the exact address and pin, or only the street/area and an approximate pin until someone enquires? Recommended: approximate for occupied homes; exact only when deliberately approved.
5. Should the maintenance page accept real repair reports at launch, and where should they arrive before the PMS exists? Recommended: yes, routed into one monitored Red Brick workflow.
6. For rental estimates, are you comfortable budgeting for licensed address and rental-comparable data? Recommended: prototype with public/sample data, then price the paid data before Phase 3.
7. Do Red Brick's older records include achieved rent, agreement date, bedrooms, property type, postcode and condition? These determine whether they can improve the estimate.
8. Which landlord services should be marketed at launch: tenant-find/let-only, full management, maintenance coordination, or all three? Recommended: all verified services, presented as a simple three-level journey rather than unconfirmed packages.

## Reference links

- Igloo: https://www.igloo.inc/
- Resider home: https://resider.ca/home
- Resider property search: https://resider.ca/
- Resider valuation flow: https://resider.ca/sell
- MapTiler pricing: https://www.maptiler.com/cloud/pricing/
- MapTiler 3D buildings: https://docs.maptiler.com/sdk-js/examples/3d-buildings/
- HM Land Registry Price Paid Data: https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads
- ONS private rent and house prices: https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/latest
- Police.uk data: https://data.police.uk/
- Peterborough selective licensing: https://www.peterborough.gov.uk/residents/housing/selective-licensing/selective-licensing-overview

