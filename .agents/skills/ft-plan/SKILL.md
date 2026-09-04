---
name: ft-plan
description: Use for medium or high-risk, unclear, multi-file, cross-cutting, or multi-session FiberTools work.
---

# FiberTools plan

1. Read the complete root `AGENTS.md`.
2. Classify risk and every policy category touched.
3. Load each matching `docs/codex/` policy, then the smallest exact feature, manifest, environment, release, source, and test records required by those policies.
4. Verify repository identity, current `origin/main`, branch, worktree, recent relevant commits, overlapping pull requests, branch protection, and required checks.
5. Build an initial context set of no more than 12 files, each with a reason. Start from exact symbols, imports, references, routes, and tests. Expand only when evidence requires it. Twelve is a starting target, never a reason to omit required context.
6. One read-only explorer may map unfamiliar code. Close it after handoff. The parent owns decisions.
7. Do not overwrite an active `.codex/TASK.md` until its evidence is preserved or the owner authorizes replacement.
8. Create `.codex/TASK.md`:

```md
# [Outcome]
Status: Draft
Risk: Low | Medium | High
Base: [origin/main SHA]

## Policies and records
- `[exact path or current primary source]`

## Context set
- `[path]`: [why it is needed]

## Scope
[Included behavior and files]

## Excluded
[Explicit exclusions]

## Failure modes and rollback
[Material risks, stop conditions, rollback or fail-closed behavior]

## Acceptance and coverage
| ID | Observable result | Step | Test or evidence |
| --- | --- | --- | --- |
| A1 | [result] | 1 | `[command or inspection]` |

## Steps
1. [Bounded step and file owner]

## Independent checks
[none | ft_reviewer | ft_reviewer and ft_verifier]

## Readiness
[Ready | Blocked, with unresolved items]

## Next
[One exact action]
```

Keep the task under 900 words and link to paths instead of copying policy.

Before marking `Ready`, perform a read-only consistency pass. Resolve duplicate or conflicting requirements, vague acceptance criteria, unmapped steps, missing tests, invalid dependency order, and uncovered edge or failure states. Every acceptance item must map to a step and proving test or inspection. Every step must map back to an acceptance item. High-risk work requires both independent agents and every applicable required check.

Stop when a material fact, boundary, criterion, owner, rollback path, or approval remains unresolved. The owner's explicit request to use `$ft-run` after reviewing a Ready task authorizes implementation only, never merge, deployment, publication, payment, provider, delivery, DNS, production, spending, or user contact.
