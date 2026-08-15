# Design direction — Red Brick Lettings website

The shared visual language for every page. Agents and phases build to this; the brand
guidelines PDF and CLAUDE.md always win if anything here conflicts.

## Feel

Warm, calm, cinematic, locally grounded. Igloo's confidence and pacing (negative space, one
object as the story spine, strong chapter contrast) with Resider's usability (clear
categorisation, practical list/map, progressive disclosure). Original composition — never
either site's layout, wording or branding. No luxury-property gloss, glassmorphism, neon
gradients or "AI template" card grids.

## Surfaces and rhythm

- Default reading surface: cream `bg-cream` with ink text; alternate sections in white
  `bg-white` for lift. Dark chapters (`bg-ink` or `bg-brick-deep`, add `data-surface="dark"`
  so focus rings invert) are used sparingly for cinematic moments: the hero, the story finale,
  the closing CTA.
- Vertical rhythm: sections `py-14 md:py-20 lg:py-24`; hero taller. Use `container-rb`.
- Radii: cards `rounded-lg` (16), controls `rounded-md` (12), chips `rounded-sm` (8).
- Shadow: only `shadow-soft`. No borders + shadows together; prefer one.
- Sand `bg-sand` for warm supporting panels/chips; stone-light `border-stone-light` for
  dividers.

## Type

- Hero H1 `text-hero`; section H2 `text-section`; H3 `text-xl`/`text-2xl`.
- Eyebrows `text-eyebrow text-brick` (Roboto Condensed, uppercase, 1–5 words only). On dark
  surfaces use `text-sand`.
- Body 18px/1.6 (default), measure `measure-body` (≈65ch). Stone `text-stone` for supporting
  copy, ink for primary.
- Numbers (rent, ranges) in bold ink, tabular where in tables.

## Colour usage

- Brick `bg-brick` = primary action and brand signal only. Deep brick = hover/dark panels.
- Never purple, coral, gradients as decoration. A subtle warm radial glow on dark hero panels
  is acceptable if it is clearly light, not a colour gradient.
- Attention `#C76B21` only for warnings/labels (illustrative badge). Success only for status.

## Components (reuse, don't re-create)

- `Button` variants: primary (brick), secondary (ink), outline, ghost, link. `size="lg"` for
  hero/CTA. On dark surfaces use `className="bg-white text-ink hover:bg-sand"`.
- `Card`, `Badge`, `Input`, `Textarea`, `Label`, `Dialog`, `Accordion` in `components/ui`.
- `PageIntro`, `PendingSection` (h3 default), `DraftBanner` in `components/shared`.
- `PropertyCard`, `IllustrativeBadge`, `PropertyPlaceholderImage`, `StaticMapPreview` in
  `components/properties`.
- `WhatsAppLink` (button/icon/inline) in `components/layout`.

## Imagery

No photographs exist yet. Use original inline SVG illustration (brick/cream/ink/sand palette,
rounded geometry, soft daylight) — the house, locality plane, abstract textures. Mark every
image slot honestly ("Illustrative placeholder"). No stock, no AI imagery.

## Motion (Phase 2)

None beyond hover/focus colour transitions. Position: sticky is allowed for a story panel on
desktop only, bounded to its chapter. GSAP/ScrollTrigger and R3F arrive in Phase 3.
`prefers-reduced-motion` already neutralises transitions globally.

## Accessibility

Semantic landmarks, one h1 per page, no heading level skips, 44px targets, visible focus,
labels on every control, no colour-only meaning, works without JS/images, 320px reflow.

## Honesty markers

Demonstration content always carries the visible label from `src/content/demo-labels.ts`.
Estimates are "Indicative", never valuations. Nothing unconfirmed is presented as fact.
