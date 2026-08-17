# Production skills — lock file

Staged 17/08/2026 into `.claude/skills/` of the `feature/homepage-production` worktree only. That
path is excluded from Git (`.git/info/exclude`: `.claude/skills/`) so no skill copy is ever
committed. Skills are read as reference material subordinate to `CLAUDE.md`, the storyboard v3
and the brand rules; **nothing inside them is executed** — no hooks, no `npx`, no global
installer, no repository-wide installation. Fetched with `git fetch --depth 1 <commit>` and
copied path-only (GitHub tarball endpoints were rate-limited during this session).

| Skill folder | Repository | Commit | Path copied | Role |
|---|---|---|---|---|
| `impeccable/` | https://github.com/pbakaus/impeccable | `7b646bafd60b9dd9828ce5c4c1a25691702c9e92` (2026-08-14) — same pin as `docs/landing-experiments/PINS.md` | `plugin/skills/impeccable` | Visual authority (its `scripts/*.mjs` are present in the folder but not run; `hooks/` not copied) |
| `frontend-ui-engineering/` | https://github.com/addyosmani/agent-skills | `df1edb2e05487d0aa6d93c747141e0aed1187f25` (2026-08-14) | `skills/frontend-ui-engineering` | Implementation |
| `react-best-practices/` | https://github.com/vercel-labs/agent-skills | `b8caa260a420a73042e35521de4b5c8baf6446cc` (main, 2026-08-12) | `skills/react-best-practices` | Vercel React best practices |
| `gsap-core/` `gsap-timeline/` `gsap-scrolltrigger/` `gsap-react/` `gsap-performance/` | https://github.com/greensock/gsap-skills | `aed9cfd3277740755f6bfc1155c7aa645403b760` (2026-04-21) | `skills/gsap-*` | GSAP core, timeline, ScrollTrigger, React, performance |
| `fixing-accessibility/` | https://github.com/ibelick/ui-skills | `179e9e990a3ebc18620959e134f2b597819e0d50` (main, 2026-08-13) | `skills/fixing-accessibility` | Accessibility fixes |
| `fixing-motion-performance/` | https://github.com/ibelick/ui-skills | `179e9e990a3ebc18620959e134f2b597819e0d50` | `skills/fixing-motion-performance` | Motion performance |
| `verification-before-completion/` | https://github.com/obra/superpowers | `b36e0829c6d0140e93cfef2ca599b1b07d4a7797` (2026-08-12) | `skills/verification-before-completion` | Evidence before claims |

Not used: any community Three.js / React Three Fiber skill. 3D work follows the current official
documentation — https://threejs.org/docs/ and https://r3f.docs.pmnd.rs/ (React Three Fiber),
https://drei.docs.pmnd.rs/ (Drei) — pinned by the package versions in `package.json`.

Precedence where guidance conflicts: `CLAUDE.md` and the brand rules → storyboard v3 → the
committed D+B visual world (e.g. its display eyebrows and brick-course chapter markers stay
even though Impeccable's craft floor defaults against eyebrows) → skill guidance.
