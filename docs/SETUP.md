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

The site runs at http://localhost:3000.

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
`.env.local`. All keys are optional in Phase 1 — the site runs with none set.

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
