---
name: ft-plan
description: Plan unclear, risky, multi-file, cross-cutting, or multi-session FiberTools work.
---

# FiberTools plan

1. Read the complete root `AGENTS.md` and classify the task as low, medium, or high risk.
2. Verify the repository, current `origin/main` SHA, branch, worktree, recent relevant commits, branch protection, required checks, and overlapping pull requests.
3. Search before reading broadly. Open affected source, tests, and every exact feature, manifest, environment, publication, commercial, security, or release record required by `AGENTS.md`.
4. For unfamiliar or cross-cutting work, one read-only explorer may map code paths, references, and tests. The parent agent owns decisions.
5. Do not overwrite an active `.codex/TASK.md` until its evidence is preserved or the owner authorizes replacement.
6. Create `.codex/TASK.md`:

```md
# [Outcome]
Status: Active
Risk: Low | Medium | High
Base: [origin/main SHA]

## Context read
- `[exact path or current source]`

## Scope
[Included files and behavior]

## Excluded
[Explicit exclusions]

## Failure modes and rollback
[Material risks, stop conditions, and safe rollback]

## Acceptance
- [Observable, testable result]

## Steps
1. [Bounded step and file owner]

## Tests
- `[focused command]`
- `[broad command after stabilization]`

## Independent checks
- [none | ft_reviewer | ft_reviewer and ft_verifier]

## Next
[One exact action]
```

Keep the task under 900 words. Link to exact paths instead of copying policy text. High-risk work must include focused regression coverage, both independent agents, every applicable required check, and exact owner-controlled release boundaries.

Stop before implementation when a sensitive boundary, current fact, acceptance criterion, file owner, or rollback path remains unresolved. Preserve approved decisions and final evidence in the pull request or proper tracked record before deleting the temporary task file.
