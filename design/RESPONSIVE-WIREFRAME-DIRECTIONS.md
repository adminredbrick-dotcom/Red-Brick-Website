# Responsive wireframe directions

These are layout requirements, not pixel-perfect designs. Claude should propose and review low-fidelity wireframes before visual polish.

## Global shell

Desktop header:

```text
[Logo]  Properties  Landlords  Tenants  Maintenance  Insights  About
                                                [WhatsApp] [Menu/Contact]
```

Mobile header:

```text
[Logo]                                      [WhatsApp icon] [Menu]
```

The menu opens as an accessible dialog/drawer with visible close control, focus management and every primary route.

## Home — desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ Header                                                           │
├──────────────────────────────────────────────────────────────────┤
│ Hero film                                                        │
│  Eyebrow                                                         │
│  Property cared for. People looked after.                        │
│  Supporting text                                                 │
│  [Let/manage] [Find a home]    [Report a repair]                  │
├──────────────────────────────────────────────────────────────────┤
│ Three verified trust points                                      │
├──────────────────────────────────────────────────────────────────┤
│ 3D scene / static house (55%) │ Chapter copy (45%)                │
│                               │ [Switch view] [Skip story]        │
├──────────────────────────────────────────────────────────────────┤
│ Peterborough heading + area context                              │
│ Property list/cards (45%)     │ Map (55%)                         │
├──────────────────────────────────────────────────────────────────┤
│ Landlord estimate card         │ Tenant move-in-cost card         │
├──────────────────────────────────────────────────────────────────┤
│ Maintenance process                                               │
├──────────────────────────────────────────────────────────────────┤
│ Latest insights: one feature + two supporting articles           │
├──────────────────────────────────────────────────────────────────┤
│ Audience-specific closing CTA                                    │
├──────────────────────────────────────────────────────────────────┤
│ Footer                                                           │
└──────────────────────────────────────────────────────────────────┘
```

## Home — mobile

- Header and hero actions fit without tiny type
- Audience buttons stack at full available width
- Trust points become a simple vertical/scroll-safe list, not an auto-carousel
- House/story chapters become ordinary vertical sections with a static or lightweight sticky image
- Map defaults to a property-list preview with an explicit “Show map” action
- Tool cards stack
- WhatsApp does not cover important controls or cookie UI

## Properties — desktop

```text
┌──────────────────────────────────────────────────────────────────┐
│ Header + search/filter bar                                       │
├───────────────────────────────┬──────────────────────────────────┤
│ Result count + property cards │ Map                             │
│                               │                                  │
│ Cards scroll normally         │ Sticky within bounded area       │
│                               │ [2D/3D] [Map/Satellite if used]  │
└───────────────────────────────┴──────────────────────────────────┘
```

Mobile:

- Search summary and Filters button
- Segmented List / Map control
- List is the default and always available
- Filter drawer has Apply, Clear and result count
- Map view has a clear return-to-list action

## Property detail

Desktop:

- Breadcrumb
- Gallery mosaic with accessible “View all photos”
- Main information column + sticky enquiry/cost summary where space allows
- In-page section navigation: Overview, Features, Costs, Location, Enquire
- Approximate map and plain-text area information

Mobile:

- Swipeable but button-operable gallery
- Rent/availability/key facts near the top
- One persistent enquiry action that does not obscure content
- Section content in normal document order

## Rental appraisal

Use a calm stepped form only if it reduces cognitive load; do not hide the number of steps.

```text
Property location
    → property facts
    → condition/features
    → optional contact for confirmation
    → indicative report
```

The report begins with range + confidence/coverage, then evidence sections. Disclaimers stay close to the relevant result, not only in the footer.

## Maintenance

Opening choice:

- I live in a Red Brick property
- I own a property

Tenant route puts urgent safety guidance before the form. Do not call an issue “emergency” without explaining the appropriate official service/route using approved wording.

## Blog

- Category/filter controls remain simple
- Article page has category, title, standfirst, published/reviewed dates, key takeaway, contents where useful, sources, related articles and audience CTA
- Target body line length 55–75 characters

