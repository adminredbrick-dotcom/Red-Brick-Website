# Controlled build prompts

Give Claude one phase at a time. Do not send the next phase until the previous one has been reviewed.

## Phase 0 — architecture and traceability

Inspect the entire Red Brick handoff and current repository. Do not implement the finished website yet.

Produce the final sitemap, homepage order, desktop/mobile wireframe descriptions, component architecture, CMS model, repository/adaptor boundaries, animation/loading strategy and a requirements-traceability checklist. Separate confirmed facts, illustrative demo content, unavailable information and future integrations.

Ask only questions that genuinely prevent Phase 1. Otherwise use the recommended default and record it. End with the precise Phase 1 plan and wait for approval.

## Phase 1 — foundations

Implement the approved Next.js foundation, brand tokens, fonts, responsive grid, header, navigation, footer, buttons, cards, form controls, central business configuration and global accessibility behaviour.

Create every route with semantic placeholder sections. Do not add the advanced 3D scene, scroll film or live map yet. Add an owner-decision register and `.env.example`.

Verify route links, mobile navigation, keyboard behaviour, visible focus, contrast and 320px reflow. Report evidence and stop for review.

## Phase 2 — complete static vertical slice

Build the polished static version of the homepage plus one property search, one property detail and one illustrative rental-report result.

Homepage must include the hero, audience choice, trust introduction, static house-story fallback, map/list preview fallback, tools, maintenance process, insights and closing CTAs. Make this version good enough to ship without advanced motion.

Use only supplied facts and clearly marked illustrative properties. Inspect desktop, mobile and reduced-motion states. Report evidence and stop for review.

## Phase 3 — cinematic hero and 3D story

Add the progressive scroll-film hero and role-based React Three Fiber house story using GSAP ScrollTrigger.

Preserve native scrolling, semantic HTML and immediate CTAs. Add loading, failed-video, failed-WebGL, reduced-motion, mobile-lite and static fallbacks. Pause rendering offscreen and do not put essential text in the canvas.

Measure the effect on loading and interaction. List any final video or 3D assets still required. Report evidence and stop for review.

## Phase 4 — properties and Peterborough map

Build `/properties` and `/properties/[slug]` using the supplied typed illustrative data through a replaceable repository adapter.

Add the MapTiler/MapLibre experience with synchronised map markers and cards, approximate public locations, clustered markers, mobile List/Map switching and useful filters. If the map key is missing, render a complete static/list fallback rather than an error.

Label every sample listing “Illustrative example — not currently available.” Test map keyboard behaviour, list equivalence, empty results and missing configuration. Stop for review.

## Phase 5 — appraisal and move-in tools

Build the indicative rental-estimate journey and tenant move-in cost calculator.

Keep completed-sale history, rental trends and scenarios visually and semantically separate. Include source, geography, observation date, retrieval date, quality and confidence fields in the adapter models. Use honest unavailable states; do not manufacture evidence.

End the landlord result with “Request a verified rental appraisal.” Test validation, low-evidence and data-unavailable cases. Stop for review.

## Phase 6 — maintenance, CMS and forms

Build the maintenance experience, repair-report UI, landlord page, tenant page, Sanity-backed Insights pages, article template, contact flow and social metadata.

Forms need accessible validation and honest success/failure behaviour. If no endpoint exists, state that online submission is not yet active and provide WhatsApp. Do not publish unconfirmed business or regulatory facts.

Document how Red Brick edits pages, listings and articles. Stop for review.

## Phase 7 — independent production review

Audit and polish the full project. Use a fresh verifier/subagent where available rather than relying only on the implementation notes.

Test at 320, 375, 768, 1024 and 1440 CSS pixels. Test keyboard-only use, 200% zoom, reduced motion, slow loading, failed media, no WebGL, no map key, empty listings and all form errors. Check console/network output, links, metadata, sitemap, structured data and privacy defaults.

Target Lighthouse: Accessibility 95+, Best Practices 90+, SEO 90+, mobile Performance 80+ while preserving the approved experience.

Fix problems before calling the build complete. Deliver the setup guide, content-editing guide, placeholder register, test summary, launch checklist and screenshots.

