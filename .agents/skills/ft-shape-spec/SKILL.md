---
name: ft-shape-spec
description: Shape substantial FiberTools work into a saved, evidence-based specification before implementation. Use for new features, multi-file changes, major refactors, unclear requests, or material product, privacy, security, payment, publication, or architecture risk.
---

# FiberTools Shape Spec

Create a durable specification under `agent-os/specs/YYYY-MM-DD-HHMM-short-slug/`.

## Required preparation

1. Read `AGENTS.md` and `CLAUDE.md`.
2. Verify the repository, current `origin/main`, current branch, worktree state, recent relevant commits, and overlapping pull requests.
3. Read `agent-os/product/` and `agent-os/standards/index.yml`.
4. Select only the standards relevant to the requested change.
5. Use `ft_explorer` for parallel read-only investigation when the scope spans separate areas.

Do not open protected StitchProof distribution or experiment records. Do not inspect secrets or private artifacts.

## Shape the work

Resolve and record:

- requested outcome;
- user-visible behavior;
- included and excluded scope;
- current behavior and reference implementations;
- constraints from `CLAUDE.md`;
- risks and irreversible actions;
- assumptions and unknowns;
- acceptance criteria;
- validation commands;
- file ownership for parallel tasks;
- rollback or fail-closed behavior where relevant.

Prefer evidence from the current repository. Label external facts with sources and dates. Never treat an assumption as approval.

## Save four files

Use the templates in `agent-os/templates/spec/`:

- `spec.md`
- `tasks.md`
- `verification.md`
- `status.md`

Task 1 must save or update the specification before implementation. Each later task needs one owner, explicit files, dependencies, acceptance criteria, and checks. Do not assign overlapping write ownership.

## Ready state

A spec is ready only when:

- acceptance criteria are testable;
- protected boundaries are explicit;
- unresolved unknowns are either resolved or marked as blockers;
- relevant checks are named;
- merge, deployment, publication, billing, and activation remain separate owner-controlled stages.

Return the spec path, key decisions, blockers, task order, and the exact first execution step.
