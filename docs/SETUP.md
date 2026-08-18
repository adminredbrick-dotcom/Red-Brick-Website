# Setup guide — Red Brick Lettings website

## Requirements

- Node.js 20 or newer (built and verified with Node v24.18.0, npm 11.16.0)
- Git

## First run

```powershell
Set-Location -LiteralPath 'D:\4. Website\Red-Brick-Fable-Handoff'
npm install
npm run dev
```

The site runs at http://localhost:3000. Playwright serves the production build on its own port per branch (`playwright.config.ts`: 3111 for the hybrid/3D work, 3112 for `experiment/phase2-new-flow`, **3113 for `feature/homepage-production`**) so worktrees never collide.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end tests (run `npm run build` first; the suite serves that build itself) |
| `npm run format` | Prettier over `src/` and `tests/` |

Before the first `npm run test:e2e`, install the browser once:

```powershell
npx playwright install chromium
```

## Environment variables

Copy `.env.example` to `.env.local` and fill values as they become available. Never commit
`.env.local`. Every key is optional — the site runs with none set. Two matter at launch:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata, sitemap and JSON-LD (falls back to the Vercel host, then localhost) |
| `NEXT_PUBLIC_SITE_INDEXING` | Leave unset pre-launch (every page `noindex`, robots disallow-all). Set to `on` at launch and redeploy to allow indexing (experiments stay disallowed); inlined at build time so static and dynamic routes agree |

## Deployment (Vercel)

The GitHub repository `adminredbrick-dotcom/Red-Brick-Website` (`origin`) is connected to the
Vercel project `red-brick-website`. Every push builds a deployment; the production domain
follows the branch set as **Production Branch** in Vercel → Settings → Git (currently expected to
be `feature/homepage-production` until `main` is merged) — or promote a specific deployment.
Build command `npm run build`, output default, Node 20+. Add the environment variables above in
Vercel → Settings → Environment Variables. After changing `SITE_INDEXING` or `NEXT_PUBLIC_SITE_URL`
redeploy (both are inlined at build time).

## Audits

`node scripts/audit/run-lighthouse.mjs http://localhost:3113` — Lighthouse (installed Chrome) over the
key pages, mobile + desktop, writing `docs/evidence/phase-7/lighthouse/summary.md`. Run it against a
launch-mode build (`NEXT_PUBLIC_SITE_INDEXING=on NEXT_PUBLIC_SITE_URL=http://localhost:3113 npm run build`,
then `npx next start -p 3113`) so the SEO category reflects launch, not the pre-launch noindex.

## Pinned versions

Exact versions are pinned in `package.json` (no `^` ranges). Key versions at creation
(2026-08-13): Next.js 16.3.0 · React 19.2.8 · Tailwind CSS 4.3.3 · TypeScript 7.0.2 ·
ESLint 10.8.1 · Vitest 4.1.10 · Playwright 1.62.1. Do not upgrade blindly mid-build
(technical spec rule); upgrade deliberately between phases if needed.

## Project layout

- `src/app` — App Router routes (Server Components by default)
- `src/components` — `ui/` primitives, `layout/` shell, `shared/` page helpers
- `src/config` — `business.ts` (single source of confirmed facts), `site.ts` (route registry)
- `src/content` — approved copy modules
- `src/lib` — helpers (WhatsApp link, class names)
- `src/styles/tokens.css` — canonical brand tokens (ported from `brand/red-brick-tokens.css`)
- `docs/OWNER-DECISIONS.md` — placeholder/owner-decision register
- `tests/unit`, `tests/e2e` — Vitest and Playwright suites

The original handoff folders (`brief/`, `brand/`, `data/`, `design/`, `prompts/`, `technical/`,
`acceptance/`, `assets/`) are preserved untouched as the source of truth.
