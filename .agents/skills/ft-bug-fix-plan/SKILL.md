---
name: ft-bug-fix-plan
description: Investigate a FiberTools defect and save a bounded root-cause and regression plan before editing. Use for reproducible bugs, failed checks, regressions, incorrect calculations, or unclear production behavior.
---

# FiberTools Bug Fix Plan

## Investigate first

1. Read `AGENTS.md` and `CLAUDE.md`.
2. Verify the repository, branch, base SHA, working tree, recent commits, and overlapping pull requests.
3. Use `ft_explorer` for read-only reproduction and reference discovery.
4. Define the observed behavior, expected behavior, impact, affected paths, and evidence quality.
5. Reproduce with the smallest safe command, test, or local interaction.
6. Trace the likely root cause through code and existing tests.
7. Identify whether the failure involves formulas, claims, privacy, security, accessibility, publication controls, payment gates, provider behavior, or deployment state.

Do not edit while the root cause remains speculative. Do not inspect protected records, secrets, private artifacts, or live user data.

## Save the plan

Create or update a spec folder using the standard templates. Include:

- reproduction steps and evidence;
- root cause, or ranked hypotheses when unresolved;
- regression-test-first task;
- smallest repair task;
- verification matrix;
- excluded scope;
- rollback or fail-closed behavior;
- residual unknowns.

A production symptom does not prove the source root cause. A passing local test does not prove production repair.

Return the spec path, reproduced status, root-cause confidence, proposed test, proposed repair, and blockers.
