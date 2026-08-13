# Definition of done

The project is not complete because it looks attractive in one desktop screenshot. Claude must verify the following.

## Brand and content

- [ ] Exact name is Red Brick Lettings everywhere
- [ ] “Lets Move” and the obsolete telephone number appear nowhere
- [ ] Approved brick/cream/ink palette is used; no purple/coral system
- [ ] Tagline is exact
- [ ] Copy consistently uses “we”
- [ ] Established 2012 and Peterborough scope are accurate
- [ ] WhatsApp 07300 856675 is consistent
- [ ] No invented reviews, awards, metrics, properties, prices or service promises
- [ ] All placeholders are recorded and cannot masquerade as live content

## Navigation and journeys

- [ ] Every primary route works
- [ ] Properties and repair help are never buried by the cinematic story
- [ ] Landlord/Tenant selection works and can be switched
- [ ] Both paths remain usable without JavaScript
- [ ] Mobile navigation is keyboard and screen-reader usable
- [ ] WhatsApp link uses a valid international link format while displaying the UK number

## Homepage

- [ ] H1 and primary actions render before video/3D
- [ ] Hero poster works when video fails
- [ ] 3D story is after orientation/trust content
- [ ] Essential text remains HTML
- [ ] Landlord and Tenant chapters are understandable without animation
- [ ] Scroll behaviour stays native and visitors can skip the story
- [ ] R3F stops expensive rendering when offscreen

## Properties

- [ ] Desktop list/map and mobile List/Map toggle work
- [ ] Filters have labels, keyboard support and useful empty state
- [ ] Map information is duplicated in the list
- [ ] Map scroll zoom is not a trap
- [ ] Approximate locations are respected
- [ ] Demo listings visibly say “Illustrative example — not currently available”
- [ ] Demo listings are not indexable as genuine inventory
- [ ] Property facts display only when present/verified

## Rental report

- [ ] Public label is “Indicative rental estimate”
- [ ] Rent, completed sales and scenarios are visually separate
- [ ] Every figure supports source/geography/date/quality metadata
- [ ] Data-unavailable and weak-evidence states work
- [ ] No safe/unsafe or good/bad area score
- [ ] Crime disclaimer explains approximation and limitations
- [ ] Scenarios are labelled illustrative, not forecasts or guarantees
- [ ] Result routes to a human-confirmed appraisal

## Maintenance and forms

- [ ] Landlord and Tenant routes are clear
- [ ] Process is Report → Triage → Arrange → Update → Resolve
- [ ] No unsupported 24/7/fixed-time promise
- [ ] Required fields and errors are clear
- [ ] Server validation exists for active forms
- [ ] A success message appears only after confirmed delivery
- [ ] Missing integration sends visitors to the honest WhatsApp alternative
- [ ] Sensitive form data is not logged by default

## Accessibility

- [ ] WCAG 2.2 AA target
- [ ] Entire interface works by keyboard
- [ ] Visible focus is never removed
- [ ] Correct landmarks/headings/labels
- [ ] Normal text contrast at least 4.5:1
- [ ] Meaningful control/icon contrast at least 3:1
- [ ] No colour-only meaning
- [ ] 200% text zoom remains usable
- [ ] 320px reflow has no horizontal reading requirement
- [ ] Reduced-motion mode removes scroll scrubbing/camera travel
- [ ] Informative images have purposeful alt text; decorative images have empty alt
- [ ] Video meaning is available without sound

## Resilience and performance

- [ ] Useful content works with JavaScript enhancement delayed
- [ ] Video failure has a poster
- [ ] WebGL failure has a static-house narrative
- [ ] Missing map key has a list/static fallback
- [ ] Empty CMS/data source has a useful state
- [ ] Images use responsive formats and explicit dimensions
- [ ] Map and house canvases do not animate simultaneously
- [ ] No console errors, unhandled rejections or broken links
- [ ] No material layout shift from fonts/media

## SEO, privacy and operations

- [ ] Unique page titles/descriptions
- [ ] Canonicals configured only when the domain is known
- [ ] Sitemap/robots are correct
- [ ] Social preview metadata works
- [ ] Demo properties excluded from production indexing
- [ ] Analytics/cookies remain off until configured and consent-reviewed
- [ ] No secrets in the client bundle or repository
- [ ] Privacy, cookie and terms placeholders are visibly not launch-ready until reviewed
- [ ] Editing and deployment documentation is complete

## Required evidence

- [ ] Automated tests pass
- [ ] Screenshots at 320, 375, 768, 1024 and 1440px
- [ ] Keyboard-only test notes
- [ ] Reduced-motion screenshot/test notes
- [ ] Failed-video, failed-WebGL, absent-map-key and empty-data evidence
- [ ] Lighthouse targets: Accessibility 95+, Best Practices 90+, SEO 90+, mobile Performance 80+
- [ ] Complete owner-decision/placeholder register

