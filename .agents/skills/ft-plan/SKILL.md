---
name: ft-plan
description: Create one compact task file for risky, unclear, or multi-file FiberTools work.
---

# FiberTools plan

Use only when direct work would be unsafe or unclear.

1. Read `AGENTS.md`.
2. Verify the repository, current `origin/main` SHA, branch, worktree, relevant commits, and overlapping pull requests.
3. Search before reading broadly. Open only the affected code, tests, and relevant sections of `CLAUDE.md` or exact feature records.
4. Create or replace `.codex/TASK.md` with this compact format:

```md
# [Outcome]
Status: Active
Base: [origin/main SHA]

## Scope
[Included files and behavior]

## Excluded
[Explicit exclusions]

## Risks
[Only material risks and protected boundaries]

## Acceptance
- [Observable result]

## Steps
1. [Small bounded step with file ownership]

## Tests
- `[focused command]`
- `[broad command, once after stabilization]`

## Next
[One exact action]
```

Keep the file under 700 words. Do not copy whole policy documents into it. Link to exact paths instead.

Use one main agent. Delegate only an independent read-only investigation when it avoids polluting the main context. Stop before implementation if a sensitive boundary or acceptance criterion remains unresolved.
