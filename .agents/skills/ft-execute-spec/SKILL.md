---
name: ft-execute-spec
description: Execute an approved FiberTools specification through bounded tasks, parallel agents, independent review, and evidence-based verification. Use only when a saved spec has clear acceptance criteria.
---

# FiberTools Execute Spec

## Start

1. Read `AGENTS.md`, `CLAUDE.md`, and every file in the active spec folder.
2. Reverify repository identity, current `origin/main`, branch, worktree, recent commits, and overlapping pull requests.
3. Compare the saved base SHA with current `origin/main`. Update the spec before editing when the base or assumptions changed.
4. Confirm no task crosses a protected, publication, payment, provider, deployment, or activation boundary without exact approval.

## Run tasks

- The parent agent owns sequencing, integration, and the final report.
- Use no more than four concurrent agents.
- Use `ft_explorer` for independent read-only research.
- Use `ft_implementer` only for a bounded task with explicit file ownership.
- Never give two writing agents overlapping files or code paths.
- Complete dependencies before dependent tasks.
- Update `tasks.md` and `status.md` with verified progress after each integration point.
- Preserve unrelated changes. Do not clean or refactor outside scope.

## Review and verification

After implementation:

1. Inspect the integrated diff.
2. Run `ft_reviewer` independently.
3. Address all P0 and P1 findings or record a clear block.
4. Run `ft_verifier` against every acceptance criterion.
5. Record commands and observed results in `verification.md`.
6. Run `/review` for a final independent Codex review when available.
7. Keep local checks, commit, pull request checks, merge, deployment, and production verification as separate evidence.

Never claim a test, check, review, merge, deployment, provider path, revenue result, or customer outcome without direct evidence.

## Finish

Return:

- outcome;
- files changed;
- acceptance-criteria results;
- commands run and results;
- review findings and resolutions;
- residual risks and unknowns;
- current Git and release stage;
- next owner action.
