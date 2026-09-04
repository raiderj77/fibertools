---
name: ft-run
description: Execute an approved Ready .codex/TASK.md with focused tests, independent review, and verification.
---

# FiberTools run

1. Read the complete root `AGENTS.md` and `.codex/TASK.md`. Stop if the task is absent, not `Ready`, or no longer matches the owner's request.
2. Reverify repository identity, current `origin/main`, branch, worktree, overlapping pull requests, protection, required checks, risk, policies, context set, and assumptions.
3. Confirm every acceptance item maps to a step and proving test or inspection. Add missing context only when imports, references, tests, failures, or changed behavior justify it.
4. If a defect lacks reproduction or root-cause evidence, stop and use `$ft-debug`.
5. Set task status to `In progress`. Make the smallest complete change. Preserve unrelated work, existing gates, and owner-controlled boundaries.
6. Run focused tests during implementation. After stabilization, run each applicable broad suite once. Repeat only after a relevant change or failure.
7. Record completed steps, exact commands, observed results, unresolved risks, and one next action in `.codex/TASK.md`. Keep raw logs out.
8. Before a pull-request or release decision, inspect the complete diff and run every applicable required check. Use `ft_reviewer` for substantial medium-risk work. Use both `ft_reviewer` and `ft_verifier` for high-risk or final release-sensitive work. Resolve conflicts from direct evidence and close both agents after capturing results.
9. Run `$ft-audit` in convergence mode. For each acceptance item classify the implementation as `Satisfied`, `Partial`, `Missing`, `Contradicts`, or `Not tested`. Identify material unrequested work separately. Do not mark complete while any required item is Partial, Missing, Contradicts, or Not tested.
10. Preserve final decisions and evidence in the pull request or proper tracked record, then delete `.codex/TASK.md`.
11. Report local work, branch, pull-request checks, merge, deployment, and production verification separately.

Never perform an owner-controlled release or production action without exact authorization.
