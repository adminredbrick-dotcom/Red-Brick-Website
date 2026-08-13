# Red Brick Lettings — master build brief

## Goal

Design and build a polished, production-ready website for Red Brick Lettings that makes the company memorable while keeping every landlord and tenant task straightforward.

The central concept is:

> **Start with a choice. Build trust. Reveal how care holds a home together.**

Use Igloo’s cinematic, object-led pacing for the emotional homepage story and Resider’s clear categorisation, map/list search, progressive property detail and appraisal flow for functional pages. Do not copy either site’s code, layouts, content, imagery or branded assets.

## Audience promise

The opening asks: **What would you like help with?**

- “I’m a landlord” personalises later homepage content and points to the rental appraisal.
- “I’m looking for a home” personalises later content and points to available properties.
- “Already rent with us? Report a repair” remains a visible utility route.
- A visible “Switch view” control allows the selected journey to change.

Landlords should leave feeling that their property will be in capable hands. Tenants should leave feeling respected, informed and at ease.

## Homepage

### 1. Cinematic hero

- Eyebrow: “Peterborough lettings, since 2012”
- H1: “Property cared for. People looked after.”
- Supporting copy: “We provide residential lettings and property management across Peterborough, with clear guidance for landlords and tenants.”
- Actions: “Let or manage my property”, “Find a home”, “Report a repair”
- Use a short, muted, scroll-responsive property/Peterborough film with an optimised poster.
- All text and controls remain accessible HTML over the media.
- The initial shell must be useful before video or JavaScript loads.

### 2. Local trust

Show only verified points:

- Established in 2012
- Focused on Peterborough
- Support for landlords and tenants

Do not invent numerical proof.

### 3. Role-based 3D house story

Place this after the introduction. A warm stylised brick house begins as an exploded cutaway and assembles with scroll progress.

Landlord chapters:

1. Prepare — appraisal, presentation and readiness
2. Let — marketing, enquiries and tenancy setup
3. Manage — administration, communication and compliance support
4. Care — maintenance coordination and ongoing oversight
5. Confidence — “Your property is in good hands.”

Tenant chapters:

1. Find — clear search and honest information
2. Understand — costs, features and next steps
3. Move — a calm, explained tenancy journey
4. Live — repairs, updates and practical help
5. At ease — “A good property should feel easy to live in.”

If no route is selected, tell the shared story of property, people, communication, care and home.

Keep all explanations outside the canvas. Use CSS/static artwork until a final GLB is supplied. Provide a no-WebGL, mobile-lite and reduced-motion form of the same story.

### 4. Peterborough properties

- City-wide map with clustered property markers
- Synchronised map/list selection
- 2D default with an optional gentle 3D tilt
- Desktop split view; mobile List/Map switch
- Complete semantic list alternative
- Wheel zoom disabled until deliberate activation
- Approximate public locations by default

### 5. Useful tools

Landlords: **What could your property rent for?**

Tenants: **Understand your move-in costs.**

The tools should feel useful even with demo adapters, but must never simulate a live result without clearly stating that it is illustrative.

### 6. Maintenance

Explain **Report → Triage → Arrange → Update → Resolve** with separate landlord and tenant routes. Do not promise fixed times, emergency attendance or 24/7 service.

### 7. Insights

Feature articles for Landlords, Tenants, Peterborough, Maintenance and Property Guidance. Articles require reviewed dates, sources where relevant, share metadata and a branded social image.

### 8. Finale

Return to the chosen journey:

- Landlord: “Request a rental appraisal”
- Tenant: “View available properties”
- General: “Talk to Red Brick”

WhatsApp remains available without competing with the main action.

## Properties

### Search

Launch filters:

- Area or postcode
- Minimum/maximum monthly rent
- Bedrooms
- Property type
- Availability

Do not create Resider-level filter density before inventory justifies it.

### Detail page

Use progressive sections:

1. Gallery and key facts
2. Overview
3. Features
4. Costs
5. Location
6. Enquire or request a viewing

Only display verified rent, deposit, availability, furnishing, council tax, EPC and material information. Include the listing’s reviewed date. Images must have useful alt text.

## Landlords

- Explain the landlord challenge in plain English
- Present Let, Manage and Care as an understandable journey
- Avoid invented packages or prices
- Explain maintenance coordination honestly
- Lead into the indicative rental estimate and human-confirmed appraisal

## Tenants

- Find a property
- Understand the application and move-in process
- See costs clearly
- Understand how repairs and communication work
- Reach current-tenant help quickly

Do not write discriminatory restrictions or imply that benefit income or children make applicants unsuitable.

## Indicative rental estimate

Collect:

- Address or postcode
- Property type
- Bedrooms and bathrooms
- Condition
- Furnishing
- Parking and garden
- Optional details

Design the result for:

- Indicative monthly range
- Evidence count and confidence explanation
- Peterborough rental trend
- Completed-sale context, visually separate from rent
- Rental demand context
- Licensing-area caution flag
- Neutral crime categories and trend with limitations
- Amenities and transport
- Property strengths and practical considerations
- Optional one-year and three-year low/central/high scenarios
- Request for a Red Brick-confirmed appraisal

Use this wording pattern:

> **Indicative rent: £X–£Y per calendar month**  
> Based on comparable properties and market data available on [date]. This is an estimate, not a formal valuation or guarantee of achievable rent. Property condition, specification, demand, tenancy terms and legal requirements can affect the final figure. Red Brick Lettings will confirm its recommendation after reviewing the property.

Never create a single “good/bad area” score. Crime data does not prove a home is safe or unsafe. Demographic and benefit data must never affect rent or tenant selection.

## Maintenance form

Potential fields:

- Tenant or landlord route
- Name and safe contact details
- Property reference rather than public full address where possible
- Issue category
- Urgency selected from clearly explained options
- Description
- Images
- Permission to contact

Until a real endpoint is configured, do not pretend a report has been submitted. Provide the confirmed WhatsApp option and mark integration as pending.

## Content editing

Use Sanity for:

- Global business configuration
- Standard pages and flexible sections
- Property listings
- Blog articles and sources
- FAQs
- Alerts/notices
- Reviewed dates and SEO/share fields

Unknown contact or regulatory facts belong in private configuration/placeholder registers, never public filler.

## Motion rules

- Native scrolling; no scroll hijacking
- Pinning only where it improves comprehension
- GSAP/ScrollTrigger is the single page choreography system
- Shorter motion on mobile
- `prefers-reduced-motion` returns ordinary vertical content
- No autoplay sound
- Clean up all timelines, observers and WebGL resources
- Pause the house scene while the map is active
- Never bake essential words into video or canvas

## Deliverables

- Responsive website and reusable components
- Central tokens and typed business configuration
- Sanity schemas and clearly labelled demo content
- Replaceable listing, map, CMS and market-data adapters
- `.env.example` without secrets
- Setup, editing and deployment documentation
- Complete placeholder/owner-decision register
- Automated tests for navigation, role selection, filters and forms
- Desktop/mobile/reduced-motion visual evidence
- Accessibility, performance, console and broken-link results

Work through the supplied phases. Do not attempt the entire product in one generation.

