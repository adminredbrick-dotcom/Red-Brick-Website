# Technical implementation specification

## Framework

- Next.js App Router
- React
- Strict TypeScript
- Server Components by default
- Client Components only for navigation state, filters, forms, video, GSAP, R3F and map interactions

Use the current mutually compatible stable versions at project creation. Record exact versions in `package.json` and the setup guide. Do not upgrade blindly during the build.

## Design system

- Tailwind CSS using the supplied Red Brick tokens
- shadcn/ui and Radix primitives for accessible behaviour
- CSS custom properties as the canonical runtime tokens
- Inter body; Roboto Condensed for short display/eyebrow use only
- 8px spacing basis; 16px mobile gutters; 48–80px large-screen gutters
- Minimum 44px production target for primary controls

Do not add Mantine or a second comprehensive UI system.

## Motion and 3D

- React Three Fiber + Drei
- GSAP + ScrollTrigger
- One 3D house scene, lazy-loaded near its chapter
- Normal page scroll; avoid smooth-scroll dependencies initially
- Keep camera/object state driven by a small chapter timeline, not dozens of unrelated triggers
- Clean up timelines, observers, textures, geometry and renderer resources
- Cap device pixel ratio and pause `frameloop` when offscreen
- Provide static markup/image fallback before loading the scene

Do not add Anime.js, Framer Motion or competing page-motion systems.

## Scroll-film hero

Prototype in order of preference:

1. Optimised video with scroll-controlled current time where browser support/performance is acceptable
2. Short frame sequence only if testing proves it is efficient
3. Simple autoplay-muted loop with an ordinary scroll transition

Requirements:

- Poster image and fixed aspect ratio
- Muted and no essential audio
- Media lazy/deferred without delaying H1/actions
- Reduced-motion/static replacement
- Mobile-specific source/crop
- No large media download before visitor intent on constrained connections where detectable

## Map

- `@maptiler/sdk`, based on MapLibre, in a client-only lazy component
- MapTiler Cloud is the proposed production tile/style provider
- Use a static/list fallback if no public map key exists
- Cooperative gestures and keyboard enabled
- 2D default; optional 3D tilt around 42–48 degrees on deliberate selection
- Required attribution always visible
- DOM buttons for a few interactive markers; GeoJSON layers/clusters for larger sets
- Approximate locations for occupied homes by default
- Duplicate every marker’s meaningful content/action in the semantic list
- Pause/unmount the R3F scene while the map is active

MapTiler’s current commercial pricing must be checked before purchase. Mapbox requires a separate production real-estate commercial licence and is not the default.

## Content and data

- Sanity for pages, properties, articles, FAQs, global settings and notices
- Typed repository interfaces isolate the frontend from Sanity and demo JSON
- Keep lead/contact data outside the market-analytics store
- Server-side adapters protect API credentials
- Every market figure includes source and freshness metadata
- Demo/adaptor failures return honest unavailable states

## Forms

- Server-side validation in addition to accessible client feedback
- Consent/privacy copy appropriate to the configured destination
- Rate limiting and spam controls before launch
- Do not show a success state unless the server confirms submission
- Never log sensitive form bodies or uploaded media by default

## SEO and sharing

- Per-route metadata
- Canonical URLs once domain is known
- `sitemap.xml` and `robots.txt`
- Open Graph/social images
- Property structured data only when accurate and appropriate
- Blog article structured data with reviewed dates
- No demo listing in public sitemap or indexable production content

## Performance budgets

Initial production targets:

- Useful H1/actions rendered without waiting for 3D, map or CMS client JavaScript
- Keep landing-page client JavaScript deliberately small outside the lazy chapters
- Hero poster normally under 250KB where quality permits
- Card images normally under 150KB where quality permits
- Compressed GLB/textures and only required scene assets
- Responsive AVIF/WebP plus fallback
- Explicit image dimensions and below-fold lazy loading
- No two continuously animated WebGL canvases at once
- Mobile Lighthouse performance target 80+ with accessibility 95+

## Tests

- Unit tests for calculations, filters, business configuration and data mapping
- Component tests for form error/success/unavailable states
- Playwright for navigation, audience selection, property filtering and key forms
- Accessibility scan plus manual keyboard/zoom/reduced-motion inspection
- Browser console/network checks
- Visual screenshots at required breakpoints

## Proposed source layout

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── home/
│   ├── properties/
│   ├── appraisal/
│   └── maintenance/
├── config/
├── content/
├── data/
│   ├── contracts/
│   ├── repositories/
│   └── adapters/
├── lib/
├── sanity/
├── styles/
└── tests/
```

