---
name: ft-run
description: Execute an existing approved .codex/TASK.md with focused tests, independent review, and verification.
---

# FiberTools run

1. Read the complete root `AGENTS.md` and `.codex/TASK.md`. Stop if the task file is absent or unapproved.
2. Reverify repository identity, current `origin/main`, branch, worktree, overlapping pull requests, protection, required checks, risk, and assumptions.
3. Confirm every matching `docs/codex/` policy and exact record is listed and read. Add missing context before editing.
4. If a defect lacks reproduction or root-cause evidence, stop and use `$ft-debug`.
5. Make the smallest complete change. Preserve unrelated work, existing gates, and owner-controlled boundaries.
6. Run focused tests during implementation. After stabilization, run each applicable broad suite once. Repeat after a relevant change or failure.
7. Update `.codex/TASK.md` with completed steps, exact commands, observed results, unresolved risks, and one next action. Do not paste raw logs.
8. Before a pull-request or release decision:
   - inspect the complete diff;
   - run every applicable required check;
   - use `ft_reviewer` for substantial medium-risk work;
   - use both `ft_reviewer` and `ft_verifier` for high-risk or final release-sensitive work;
   - resolve conflicts against direct evidence and close both agents after their results are captured.
9. Preserve final decisions and evidence in the pull request or proper tracked record, then delete `.codex/TASK.md`.
10. Report local work, branch, pull-request checks, merge, deployment, and production verification separately.

Never perform an owner-controlled release or production action without exact authorization.
