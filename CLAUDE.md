# Red Brick Lettings project rules

## Mission

Build an original, warm, cinematic and highly usable lettings website for Red Brick Lettings. Igloo is a storytelling reference and Resider is a product-UX reference; neither is a template to copy.

## Confirmed business facts

- Exact public name: Red Brick Lettings
- Established in 2012
- Residential lettings and property management across Peterborough
- Always write as “we”, “our” and “us”
- Tagline: “Property cared for. People looked after.”
- Primary contact: WhatsApp 07300 856675
- Meetings may be offered by appointment
- Domain, permanent email, opening hours and regulatory details are unconfirmed
- The future PMS is a separate product and must not be marketed here

## Brand rules

- Brick `#A63D2F`; deep brick `#70291F`; ink `#1D1B1A`
- Cream `#F7F2EA`; sand `#E8D7C6`; stone `#716B64`; white `#FFFFFF`
- No purple and no competing coral palette
- Inter for body; Roboto Condensed only for short display text
- Body text at least 16px, preferably 18px; line-height about 1.6
- Warm, calm, approachable, locally grounded and easy to read
- Avoid generic luxury-property styling, glassmorphism overload, neon gradients and “AI template” layouts

## Locked stack

- Next.js App Router, React and strict TypeScript
- Tailwind CSS plus shadcn/ui and Radix primitives
- React Three Fiber and Drei for one 3D house story
- GSAP and ScrollTrigger as the only primary choreography engine
- Sanity for editable pages, listings and articles
- MapTiler SDK / MapLibre for the Peterborough map
- Vitest and Playwright for important behaviours

Do not add Mantine, Anime.js, Framer Motion, Watermelon UI or another overlapping design or animation system. Kokonut may supply at most a few restyled components with competing motion removed.

## Architecture rules

- Prefer Server Components; create small client islands only for interaction
- Keep navigation, headings, copy, forms and CTAs in semantic HTML
- Treat video, map and 3D as progressive enhancement
- Store confirmed business details in one typed configuration module
- Use typed repository/adaptor boundaries for listings, maps, CMS and market data
- Include `.env.example`; never commit secrets
- Keep mock data visibly labelled as illustrative

## Core routes

- `/`
- `/properties`
- `/properties/[slug]`
- `/landlords`
- `/rental-appraisal`
- `/tenants`
- `/maintenance`
- `/insights`
- `/insights/[slug]`
- `/about`
- `/contact`
- privacy, cookie and terms pages

No separate area directory at launch. Peterborough insight belongs in search, property pages and the rental report.

## Experience rules

- Hero: fast orientation, audience choice and direct actions
- 3D house: later on the homepage, never a barrier
- Landlord story: Prepare → Let → Manage → Care
- Tenant story: Find → Understand → Move → Live
- Property search: practical list/map experience; 2D first, optional 3D
- Rental result: “Indicative rental estimate”, never a guaranteed valuation
- Maintenance: Report → Triage → Arrange → Update → Resolve
- Blog: landlord, tenant, Peterborough, maintenance and property guidance

## Never invent or imply

- Reviews, testimonials, awards, memberships or ratings
- Live properties, prices or availability
- Current portfolio size or retention figures
- Opening hours, response times or 24/7 cover
- Cheapest, best, guaranteed, excellent or risk-free outcomes
- Exact rent, crime or future-growth results without a configured source
- Email address, domain, walk-in office or staff identities
- Regulatory credentials or schemes not explicitly supplied

Use an honest unavailable state or an obvious placeholder in admin/configuration. Never expose fake facts as public content.

## Listings and privacy

- Actual listing photos must be of that property; never use AI or stock substitutes
- Default to approximate locations for occupied homes
- Never expose access notes, security information or restricted address fields
- Do not use tenant/landlord personal data in development or prompts
- Use synthetic records only

## Accessibility and performance

- Target WCAG 2.2 AA
- Full keyboard operation, visible focus and useful labels
- Honour `prefers-reduced-motion`
- Provide poster, static-house and static-map fallbacks
- No scroll hijacking, autoplay sound or essential canvas text
- Disable map wheel zoom until deliberate interaction; always provide a list alternative
- Lazy-load video, map and 3D; pause rendering when offscreen
- Do not keep the R3F scene and map WebGL canvases actively rendering together
- Support 320px width without horizontal overflow

## Working method

- Inspect before editing
- Work in the approved phases; do not generate the entire site in one unreviewable pass
- Preserve existing user work
- Make reasonable low-risk assumptions and record them
- Stop only for genuinely irreversible or scope-changing decisions
- After every phase, run relevant tests and inspect desktop, mobile, keyboard and reduced-motion states
- Ground completion claims in test/browser evidence
- Report completed work, assumptions, tests and next review points

