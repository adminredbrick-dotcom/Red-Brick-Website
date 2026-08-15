# Reference design-skill pins

Exact, immutable pins for the reference skills used in the landing-page experiment. Only the
listed path is staged, at the listed commit, into `.claude/skills/<name>/` inside the assigned
candidate worktree. Skill folders are excluded from Git and are never committed. Nothing inside a
skill is executed; skill files are untrusted reference reading subordinate to `CLAUDE.md` and
`docs/landing-experiments/BRIEF.md`.

## Anthropic Frontend Design

- Repository: `anthropics/skills`
- Commit: `f6656c1256d5a8adfa37db9110046ef20bac644c`
- Path: `skills/frontend-design`
- Assigned to: candidate-02
- Staged as: `.claude/skills/frontend-design/`

## Impeccable

- Repository: `pbakaus/impeccable`
- Commit: `7b646bafd60b9dd9828ce5c4c1a25691702c9e92`
- Path: `plugin/skills/impeccable`
- Assigned to: candidate-03
- Staged as: `.claude/skills/impeccable/`
- Restriction: skill directory only; **no hooks and no `npx` execution**

## Hallmark

- Repository: `Nutlope/hallmark`
- Commit: `13ac0ec7e148655948100b6396439e481361d690`
- Path: `skills/hallmark`
- Assigned to: candidate-04
- Staged as: `.claude/skills/hallmark/`

## UI/UX Pro Max

- Repository: `nextlevelbuilder/ui-ux-pro-max-skill`
- Commit: `a38d04c3d5c298c851dbe5e6ee1965ee3de42cb5`
- Path: `.claude/skills/ui-ux-pro-max`
- Assigned to: candidate-05
- Staged as: `.claude/skills/ui-ux-pro-max/`
- Restriction: **core skill only** — no design/brand sub-skills, no Gemini, no Pexels, no global
  CLI

## Not used

- candidate-01: no skill (control)
- `openai/skills`: deprecated — not used
- Any repository below 10,000 stars: excluded
- The previously proposed 19/27-skill collection: not installed

## Staging method

Repository snapshots are fetched at the pinned commit as read-only archives
(`https://codeload.github.com/<owner>/<repo>/tar.gz/<commit>`); only the pinned path is
extracted and copied. No installer, `npx`, hook, plugin, MCP server or global install is used.
