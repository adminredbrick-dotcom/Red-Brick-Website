# Red Brick Lettings — Claude Fable build handoff

This folder is the source of truth for building the Red Brick Lettings website with Claude Fable 5. It is a production brief, not a request to generate a generic estate-agent template.

Permanent project location: `D:\4. Website\Red-Brick-Fable-Handoff`

## Best way to use it

Use Claude Fable inside **Claude Code** from `D:\4. Website\Red-Brick-Fable-Handoff`. Keep `CLAUDE.md` at that folder's root.

For the exact Windows terminal commands, start with `CLI-QUICKSTART-WINDOWS.md`.

1. Create an empty project or repository.
2. Copy this handoff folder into it.
3. Ensure `CLAUDE.md` is at the project root so Claude reads the permanent rules.
4. Open Claude Code in the project.
5. Paste the contents of `START-FABLE-PROMPT.txt`.
6. Let Claude complete Phase 0 before it writes the full website.
7. Review the Phase 0 proposal, then give it the prompts in `prompts/PHASE-PROMPTS.md` one phase at a time.

If using claude.ai instead, create a Project and upload the Markdown, JSON, logo and PDF files. Give visual screenshots directly in the chat when possible. Do not upload real tenant records, passwords, API keys, private addresses or access instructions.

## What is already decided

- Brand: Red Brick Lettings
- Established: 2012
- Service area: Peterborough
- Tagline: “Property cared for. People looked after.”
- Main journeys: landlords and tenants
- Primary contact: WhatsApp 07300 856675
- Creative approach: Igloo-inspired storytelling plus Resider-inspired property tools
- Stack: Next.js, TypeScript, Tailwind, shadcn/Radix, React Three Fiber/Drei, GSAP ScrollTrigger, Sanity and MapTiler/MapLibre

## What this pack contains

- `CLAUDE.md` — rules Claude must follow throughout the project
- `START-FABLE-PROMPT.txt` — the exact first instruction to paste
- `prompts/MASTER-BUILD-BRIEF.md` — the complete product and design brief
- `prompts/PHASE-PROMPTS.md` — prompts for each controlled build stage
- `brief/` — business facts, website concept, sitemap and reference notes
- `brand/` — official brand guide, tokens and approved logo files
- `data/` — safe illustrative properties, content models and data boundaries
- `technical/` — implementation decisions and environment-variable template
- `acceptance/` — definition of done and QA matrix
- `assets/ASSETS-TO-SUPPLY.md` — what Red Brick still needs to provide

## Important safety rule

All supplied property data is fictional and labelled as illustrative. Never give an AI builder real tenant or landlord records, tenancy agreements, identity documents, entry codes, alarm information, bank details, passwords, API keys or unapproved property photographs.

## Recommended first deliverable

The first deliverable should be a static but polished vertical slice:

- Homepage without advanced animation
- Landlord/Tenant audience selection
- One illustrative property search page
- One illustrative property detail page
- One rental-estimate result mock-up
- Mobile and reduced-motion versions

Only after this is approved should Claude add the scroll film, 3D house, live map, CMS and external data connections.
