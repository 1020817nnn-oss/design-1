# AGENTS.md

## Safety Rules

Do not bulk-delete files or directories.

Do not use:

- `del /s`
- `rd /s`
- `rmdir /s`
- `Remove-Item -Recurse`
- `rm -rf`

When deleting is necessary, delete only one explicit file path at a time.

Correct example:

```powershell
Remove-Item "C:\path\to\file.txt"
```

If a task appears to require bulk deletion, stop and ask the user to delete those files manually.

## Project Overview

This folder contains a lightweight static webpage project. The current page is an Interface Craft-inspired five-card interaction replica, and the approved direction is to evolve it into an industrial design content library.

The site should become:

- A curated industrial design content library.
- A portfolio-capable site where detailed work pages carry formal case studies.
- A research notebook for process, inspiration, experiments, and methods.
- A static-first project that can run directly from `index.html`.

## Current Project Structure

- `index.html`
  - Single-file static page with embedded CSS and vanilla JavaScript.
  - Contains the five-card hero interaction.
  - Current card labels are still Interface Craft replica labels.
  - JavaScript controls selected/minimized card states and Escape reset behavior.
- `tests/card-replica.test.js`
  - Node.js test file using `node:test` and `node:assert/strict`.
  - Verifies five cards, geometry/motion hooks, hover support, reduced motion, and click interaction hooks.
- `docs/superpowers/specs/2026-05-17-industrial-design-library-design.md`
  - Approved product/design specification.
  - Defines positioning, information architecture, content model, page templates, MVP scope, roadmap, and success criteria.
- `docs/superpowers/plans/2026-05-17-industrial-design-library-implementation.md`
  - Implementation plan generated from the approved spec.
  - Contains task-by-task TDD steps for turning the current page into the industrial design library.
  - This file may be untracked if the previous session stopped before committing it.
- `.gitignore`
  - Ignores `.codex/`, `node_modules/`, PNG screenshot/reference captures, and common OS/editor noise.
- `*.png`
  - Local reference and QA screenshots.
  - These are ignored by git and should not be modified unless the user explicitly asks.

## Important Context

The approved content-library direction uses five primary sections:

- `Works`: finished projects and formal case studies.
- `Process`: research, sketches, CAD, prototypes, tests, and iteration logs.
- `Inspiration`: product observations, materials, structures, exhibitions, brands, and trend notes.
- `Experiments`: concepts, AI-assisted studies, parametric trials, CMF tests, and unfinished ideas.
- `Methods`: design methods, toolchain notes, manufacturing lessons, and judgment frameworks.

The first implementation should preserve the current opening card interaction and extend below it with curated content modules.

## Recommended Architecture

Keep the first version simple:

- Continue using a single `index.html` unless the user asks for a larger restructure.
- Store initial sample content in embedded JavaScript data.
- Use hash routes such as `#category/works` and `#item/modular-lamp-handle-study`.
- Avoid CMS, authentication, newsletter signup, and complex full-text search in the first version.
- Prefer incremental updates with tests after each task.

## Content Model

Every content item should include:

- `title`
- `slug`
- `category`
- `summary`
- `cover`
- `date`
- `status`
- `tags`
- `body`
- optional `materials`
- optional `tools`
- optional `related`

Detail templates:

- `case-study` for Works.
- `research-note` for Process, Inspiration, and Methods.
- `experiment-log` for Experiments.

## Development Commands

Run tests from the project root:

```powershell
node --test tests/card-replica.test.js
```

Open the page directly in a browser:

```text
file:///C:/Users/Administrator/Desktop/ppt/index.html
```

Fast file search:

```powershell
rg --files
rg -n "pattern"
```

Check git state before and after edits:

```powershell
git status --short
```

## Testing Expectations

Before claiming implementation work is complete:

- Run `node --test tests/card-replica.test.js`.
- Confirm all tests pass.
- Check the page visually on desktop and mobile widths.
- Confirm the five-card hero still renders and animates.
- Confirm click selection, minimized card states, and Escape reset still work.
- Confirm reduced-motion support remains present.
- Confirm no horizontal overflow appears on mobile.

## Frontend Implementation Notes

- Preserve the current card geometry classes: `working`, `demo`, `ai`, `methods`, and `kit`.
- Preserve `cardEnter`, `cardFloat`, hover/focus behavior, `prefers-reduced-motion`, and `aria-pressed` behavior.
- If a card click is extended into navigation, keep the first click as a card reveal and use a later action or link for navigation.
- Keep page sections image-led and editorial rather than dense dashboard UI.
- Do not add a marketing landing page. The first screen should remain the usable content-library entry.
- Avoid heavy framework setup unless the user explicitly asks for it.
- Keep cards and content modules responsive with stable dimensions.
- Use concise comments only when they clarify non-obvious behavior.

## Git and Workspace Rules

- Always inspect `git status --short` before editing.
- Do not revert user changes unless the user explicitly asks.
- Do not touch ignored PNG reference captures unless requested.
- Do not use destructive git commands such as `git reset --hard` or `git checkout --` without explicit user approval.
- Keep commits focused if the user asks for commits.
- If git writes fail because of sandbox permissions, request escalation for the specific git command.

## Planning Documents

Use these documents as source of truth for future implementation:

1. `docs/superpowers/specs/2026-05-17-industrial-design-library-design.md`
2. `docs/superpowers/plans/2026-05-17-industrial-design-library-implementation.md`

If these documents conflict with a newer direct user instruction, follow the newer user instruction and update the relevant document when appropriate.
