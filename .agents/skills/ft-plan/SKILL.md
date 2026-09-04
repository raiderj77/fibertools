---
name: ft-plan
description: Use for medium or high-risk, unclear, multi-file, cross-cutting, or multi-session FiberTools work.
---

# FiberTools plan

1. Read the complete root `AGENTS.md`.
2. Classify risk and every policy category touched.
3. Load each matching file under `docs/codex/`, then the smallest exact feature, manifest, environment, release, source, and test records required by those policies.
4. Verify repository identity, current `origin/main`, branch, worktree, recent relevant commits, overlapping pull requests, branch protection, and required checks.
5. One read-only explorer may map unfamiliar code, references, and tests. Close it after its handoff. The parent owns decisions.
6. Do not overwrite an active `.codex/TASK.md` until its evidence is preserved or the owner authorizes replacement.
7. Create `.codex/TASK.md`:

```md
# [Outcome]
Status: Active
Risk: Low | Medium | High
Base: [origin/main SHA]

## Policies
- `[loaded docs/codex path]`

## Records and source
- `[exact path or current primary source]`

## Scope
[Included files and behavior]

## Excluded
[Explicit exclusions]

## Failure modes and rollback
[Material risks, stop conditions, safe rollback or fail-closed behavior]

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

Keep the task under 900 words. Link to paths instead of copying policy. High-risk work requires focused regression coverage, both independent agents, every applicable required check, and exact owner-controlled release boundaries.

Stop before implementation when a material fact, sensitive boundary, acceptance criterion, file owner, rollback path, or approval remains unresolved. Preserve final decisions and evidence in the pull request or proper tracked record before deleting the temporary task.
