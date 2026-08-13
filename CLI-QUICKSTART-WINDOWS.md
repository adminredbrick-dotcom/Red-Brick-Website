# Claude Code CLI quick-start — Windows PowerShell

These commands use Claude Fable 5 in Claude Code, keep the handoff at the project root and give each build stage a controlled prompt.

## 1. Confirm Claude Code

```powershell
claude --version
```

The model ID used below is `claude-fable-5`.

## 2. Open the permanent project folder

All Red Brick website work lives here:

```powershell
$projectFolder = 'D:\4. Website\Red-Brick-Fable-Handoff'
Set-Location -LiteralPath $projectFolder
```

The working directory should now contain `CLAUDE.md`, `README-FIRST.md`, `brief`, `brand`, `prompts` and the other handoff folders.

Check it:

```powershell
Get-ChildItem -Force
```

## 3. Optional but strongly recommended: initialise Git

This makes every stage recoverable.

```powershell
git init
git add .
git commit -m "Add approved Red Brick website handoff"
```

If Git asks for your name/email, configure those before committing. Do not let Claude delete or rewrite the handoff files.

## 4. Start Phase 0 in plan mode

```powershell
$phasePrompt = Get-Content -LiteralPath '.\START-FABLE-PROMPT.txt' -Raw
claude --model claude-fable-5 --permission-mode plan --name red-brick-website $phasePrompt
```

Plan mode lets Fable inspect and design the architecture without immediately editing the project. Review its sitemap, wireframes, architecture and traceability checklist.

Inside Claude Code, confirm the active model with:

```text
/model
```

Do not approve implementation until the Phase 0 proposal matches the supplied brief.

## 5. Start the approved implementation

Exit Phase 0 if needed, then resume the named session with Phase 1:

```powershell
$phasePrompt = Get-Content -LiteralPath '.\prompts\phases\01-foundations.md' -Raw
claude --resume red-brick-website --permission-mode acceptEdits $phasePrompt
```

`acceptEdits` allows normal project edits while still retaining oversight for other actions. Do not use `bypassPermissions` for this project.

## 6. Run later phases one at a time

After reviewing and committing each finished phase, run the next one:

```powershell
$phasePrompt = Get-Content -LiteralPath '.\prompts\phases\02-static-vertical-slice.md' -Raw
claude --resume red-brick-website --permission-mode acceptEdits $phasePrompt
```

Then use, in order:

```text
prompts\phases\03-cinematic-and-3d.md
prompts\phases\04-properties-and-map.md
prompts\phases\05-appraisal-and-calculators.md
prompts\phases\06-maintenance-cms-and-forms.md
prompts\phases\07-production-review.md
```

Recommended between phases:

```powershell
git status
git diff --stat
```

After you have inspected and approved the phase:

```powershell
git add .
git commit -m "Complete Red Brick website phase 1"
```

Change the phase number in the commit message each time.

## 7. Resume after closing the terminal

```powershell
Set-Location -LiteralPath 'D:\4. Website\Red-Brick-Fable-Handoff'
claude --resume red-brick-website
```

Or show the session picker:

```powershell
claude --resume
```

## 8. Important working rules

- Keep `CLAUDE.md` at the root.
- Run Claude from the project root, not from `prompts` or another subfolder.
- Never paste API keys, passwords or real client records into a prompt.
- Use `.env.local` for local secrets; do not commit it.
- Do not allow demo listings to appear as genuine available homes.
- Make Fable show browser/test evidence before accepting “complete”.
- Commit after each approved phase so a poor direction is easy to reverse.

## If Fable is unavailable on your account

Run `/model` and check the available picker. Do not silently substitute another model without noting it. The same handoff can be used with the strongest model available to you, but record the change in the project notes.
