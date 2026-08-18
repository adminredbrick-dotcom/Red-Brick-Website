# Launch checklist — Red Brick Lettings website

Prepared 18/08/2026 at the end of Phase 7 (independent production review). Two lists: what is
ready now, and what blocks a public launch (legal, content, integration). Owner rows refer to
`docs/OWNER-DECISIONS.md`.

## Ready now (verified on `feature/homepage-production`)
- [x] Production homepage: hero (poster-first, live HTML actions), audience choice (session-only),
      introduction and stock-footage story, six-chapter 3D house with static/reduced-motion/no-JS/
      no-WebGL fallbacks, previews, maintenance, insights, WhatsApp close.
- [x] Properties: 46 portfolio homes, street + district only, verified-only facts, filters, static
      schematic map, mobile drawer, keyboard, empty state; detail pages with one enquiry route.
- [x] Landlords, Tenants, Maintenance (repair form → WhatsApp), Contact (form → WhatsApp), Insights
      (six sourced articles, drafts flagged), About, Privacy/Cookies/Terms placeholders (draft banner).
- [x] Rental estimate journey with honest weak-evidence / unavailable states and the "Request a
      verified rental appraisal" route; move-in cost calculator.
- [x] Accessibility: axe WCAG 2.2 AA (no serious/critical) on every page; keyboard focus visible;
      skip link; reduced motion honoured; 320–1440 px and 200 % zoom without horizontal overflow.
- [x] Privacy defaults: no cookies, no analytics, no third-party requests, forms store nothing,
      no personal data in URLs; sitemap/robots/social metadata/JSON-LD from confirmed facts only.
- [x] Tests: Vitest + Playwright suites green (see PHASE-7-REPORT.md); Lighthouse summary recorded.
- [x] Deployment: Vercel builds from GitHub `origin`; `NEXT_PUBLIC_SITE_INDEXING` switch and `NEXT_PUBLIC_SITE_URL`
      documented in `.env.example` and `docs/SETUP.md`.

## Blockers before public launch
### Legal / regulatory (owner)
- [ ] Privacy notice, cookie policy and terms — professionally reviewed and replaced (draft banners
      stay until then).
- [ ] Regulatory footer facts: company name/number, registered address, redress scheme, client-money
      protection, deposit scheme (`business.regulatory` — rows 8–13 area).
- [ ] Article and FAQ review (rows 72–74): set `reviewStatus: "reviewed"` per article.
- [ ] Landlord/tenant page copy and the 3D-chapter copy sign-off (rows 45, 56, 63, 79).

### Content / data (owner)
- [ ] Domain confirmed → set `NEXT_PUBLIC_SITE_URL`, then `NEXT_PUBLIC_SITE_INDEXING=on` and redeploy (AS-10, row 78).
- [ ] Email address, telephone, opening hours, address (`business.ts` nulls).
- [ ] Portfolio confirmations: six assumed-let homes (row 65), the two available homes' rent/status
      (row 66), Oxclose EPC renewal (row 67), bedrooms/bathrooms/photographs (row 69).
- [ ] Media: video derivatives once an encoder is available (row 57), managed masters folder (row 58),
      Pexels creator names (row 59), 3D house/story approval (rows 62–63).

### Integrations (owner decision + technical)
- [ ] Form delivery destination (rows 52, 71) — then add the delivery step in
      `src/lib/forms/actions.ts` and show success only after confirmed delivery.
- [ ] Sanity project (row 28) — implement `ContentRepository` adapter, migrate the local content.
- [ ] Rental-estimate data provider (row 51) — replace the demonstration adapter; the honest states
      already exist for weak/unavailable evidence.
- [ ] MapTiler key (row 29) only if a live map is wanted later — the static schematic map ships now.
- [ ] Vercel: promote the latest deployment / set the production branch, add env vars, then run
      Lighthouse once more on the live domain.

## Launch-day steps
1. Set `NEXT_PUBLIC_SITE_URL=https://<confirmed-domain>` and `NEXT_PUBLIC_SITE_INDEXING=on` in Vercel → redeploy.
2. Confirm `/robots.txt` allows `/` and `<meta name="robots">` reads `index, follow`.
3. Submit `/sitemap.xml` in Google Search Console; check the social preview with the OG image.
4. Re-run `npx playwright test` against the live URL (set `PLAYWRIGHT_BASE_URL`) and
   `node scripts/audit/run-lighthouse.mjs https://<domain>`.
