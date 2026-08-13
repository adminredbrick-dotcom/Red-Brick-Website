# Sitemap and user flows

## Primary navigation

- Properties
- Landlords
- Tenants
- Maintenance
- Insights
- About
- Contact

Persistent utility actions:

- View properties
- Message us on WhatsApp

## Route map

```text
/
├── /properties
│   └── /properties/[slug]
├── /landlords
│   └── /rental-appraisal
├── /tenants
├── /maintenance
├── /insights
│   └── /insights/[slug]
├── /about
├── /contact
├── /privacy
├── /cookies
└── /terms
```

No separate area directory at launch. Peterborough/area context appears inside property search, property pages and rental reports.

## Landlord flow

```text
Homepage audience choice
    → landlord-personalised story
    → Let / Manage / Care explanation
    → indicative rental-estimate form
    → estimate range and evidence context
    → request a Red Brick-confirmed appraisal
    → WhatsApp or configured form destination
```

## Prospective tenant flow

```text
Homepage audience choice
    → available properties
    → filters + list/map
    → property detail
    → costs, availability and features
    → enquire/request a viewing
```

## Current tenant flow

```text
Header/hero “Report a repair”
    → choose issue type and urgency
    → read relevant immediate guidance
    → submit through configured workflow
       or use WhatsApp before integration exists
    → honest confirmation and next-step message
```

## Blog-to-social flow

```text
Draft article in Sanity
    → review facts, sources and date
    → publish web article
    → generate/assign branded social preview
    → use approved social caption
    → social post links to the article
```

## Audience-selection behaviour

- Selection personalises the order and wording of later homepage sections.
- It must not hide the other audience route.
- “Switch view” remains visible.
- Store the preference only for the current session unless consent/policy supports longer storage.
- If JavaScript is unavailable, both paths remain visible and usable.

