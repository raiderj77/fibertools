---
name: ft-plan
description: Plan unclear, risky, multi-file, cross-cutting, or multi-session FiberTools work.
---

# FiberTools plan

Use this skill when direct implementation would risk missed requirements, conflicting work, or incomplete verification.

1. Read `AGENTS.md` and classify the task as low, medium, or high risk.
2. Verify the repository, current `origin/main` SHA, branch, worktree, relevant commits, and overlapping pull requests.
3. Gather context before planning:
   - medium risk: read the relevant `CLAUDE.md` sections, source, tests, and exact feature records;
   - high risk: read all of `CLAUDE.md`, then every exact manifest, environment contract, release record, source path, and test tied to the change.
4. For unfamiliar or cross-cutting work, one read-only built-in `explorer` may map code paths, references, and tests. The parent agent owns decisions.
5. Do not overwrite an active `.codex/TASK.md` until its evidence is preserved or the owner authorizes replacement.
6. Create `.codex/TASK.md` using this compact format:

```md
# [Outcome]
Status: Active
Risk: Low | Medium | High
Base: [origin/main SHA]

## Context read
- `[exact path or source]`

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

Keep the task under 900 words. Link to source paths instead of copying policy text. High-risk work must include focused regression coverage, both independent agents, all applicable required checks, and exact owner-controlled release boundaries.

For work that must survive another machine or worktree, preserve the approved decisions and final evidence in the pull request, issue, or exact tracked feature record. Stop before implementation when a sensitive boundary, current fact, acceptance criterion, or rollback path remains unresolved.
