# Landing-page experiment brief

Every candidate builds one landing page for Red Brick Lettings at `/experiments/candidate-0N`.
`CLAUDE.md` at the repository root applies in full. This brief narrows it for the experiment.
Where this brief and a downloaded skill disagree, this brief wins.

## Locked facts (use these and nothing more)

The typed source is `src/content/experiments/shared-copy.ts`, which reads from
`src/config/business.ts`. Do not retype numbers or names.

- Name: **Red Brick Lettings** — always the full name; always "we", "our", "us"
- **Established in 2012**
- **Residential lettings and property management across Peterborough**
- Tagline (exact): **"Property cared for. People looked after."**
- Service journey: **Let, Manage and Care**
- Meetings by appointment
- Contact: WhatsApp — via `experimentActions.whatsapp` (built from the existing business
  configuration and `whatsappHref()`); never retype the number

## Locked actions (label → route)

| Label | Route |
|---|---|
| I’m a landlord | `/landlords` |
| I’m looking for a home | `/properties` |
| View properties | `/properties` |
| Request a rental appraisal | `/rental-appraisal` |
| Already rent with us? Report a repair. | `/maintenance` |
| Message us on WhatsApp (final action) | `whatsappHref()` |

Labels must appear with these exact words (typographic apostrophe preferred; a straight
apostrophe is accepted by the contract). Each must be a real `<a>` / `Link` in semantic HTML.

## Required story beats — every candidate, in this order

1. Clear hero with landlord, tenant and property choices
2. Short Red Brick introduction
3. Visual scrolling-story placeholder (static in round one; shows where the story will live)
4. Landlord and tenant paths
5. Let, Manage and Care
6. A house / property-care journey
7. Peterborough / local knowledge (facts only: since 2012, across Peterborough)
8. Maintenance and property care (Report → Triage → Arrange → Update → Resolve; no time promises)
9. Verified trust based only on approved facts
10. Final WhatsApp action

Each beat is a semantic section with a real heading. The page must read fully without images,
JavaScript or motion, and remain fully understandable under `prefers-reduced-motion`.

## Explicitly prohibited

- Testimonials or reviews (real, invented or "coming soon")
- Current portfolio totals ("X properties managed", "hundreds of landlords")
- Response-time promises ("we reply within…", "same-day")
- 24/7, emergency-cover or out-of-hours claims
- "Best", "leading", "cheapest", "most affordable", "excellent", "guaranteed" or similar
- Fictional properties, rents, prices (£ figures of any kind), market statistics, forecasts or
  crime figures
- Unverified memberships, schemes, awards, accreditations or legal/regulatory claims
- Staff portraits, tenants, house numbers, vehicle plates or any personal information
- Purple (or coral) anywhere in the palette
- Remote images, remote fonts beyond the existing `next/font` setup, or copyrighted assets from
  reference sites (Igloo, Resider or any other)
- Live maps, WebGL, Three.js, React Three Fiber, canvas effects, video, GSAP or **any new runtime
  dependency** during round one

## Allowed

- CSS (Tailwind + the existing tokens), semantic HTML, the existing `components/ui` and
  `components/shared` primitives, locally created inline SVG illustration in the brick / cream /
  ink / sand / stone palette
- CSS-only transitions and hover/focus states; sticky positioning bounded to a section
- The shared header and footer, used unchanged (or a candidate-local variant inside the
  candidate's own component folder)
- Reading Igloo/Resider for *principles* per `brief/REFERENCE-NOTES.md`; never their assets,
  wording or layouts

## Voice

Warm, plain, useful UK English. Short headings. Lead with the reader's outcome. Explain what
happens next. No sales pressure, no fake urgency, no jargon. See
`brief/BUSINESS-FACTS-AND-COPY.md` for approved starter copy — it may be used verbatim.

## Non-negotiables inherited from Phase 1

Semantic landmarks, one `<h1>`, no heading-level skips, labelled controls, 44px targets, visible
focus (never removed), 4.5:1 text contrast, no colour-only meaning, 320px reflow without
horizontal scroll, site-wide `noindex` preserved (add `robots: { index: false, follow: false }`
to the candidate route metadata as well), no console errors.
