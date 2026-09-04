---
name: ft-run
description: Execute an approved FiberTools task with focused context, tests, review, and verification.
---

# FiberTools run

1. Read the complete root `AGENTS.md` and `.codex/TASK.md`.
2. Reverify repository identity, current `origin/main`, branch, worktree, overlapping pull requests, protection, required checks, risk level, and task assumptions.
3. Read every exact source, test, feature, manifest, environment, publication, commercial, security, and release record required by the task.
4. If a reported defect lacks reproduction or root-cause evidence, stop implementation and use `$ft-debug`.
5. Make the smallest complete change. Preserve unrelated work, existing gates, and owner-controlled boundaries.
6. Run focused tests during implementation. After stabilization, run each applicable broad suite once. Repeat after a relevant change or failure.
7. Update `.codex/TASK.md` with completed steps, exact commands, observed results, unresolved risks, and one next action. Do not paste raw logs.
8. Before a pull-request or release decision:
   - inspect the complete diff;
   - run every applicable required check;
   - use `ft_reviewer` for substantial medium-risk work;
   - use both `ft_reviewer` and `ft_verifier` for high-risk or final release-sensitive work;
   - wait for independent results and resolve conflicts against direct evidence.
9. Copy final decisions and evidence into the pull request or proper tracked record before deleting `.codex/TASK.md`.
10. Report local work, pushed branch, pull-request checks, merge, deployment, and production verification as separate stages.

Never merge, deploy, publish, activate commercial paths, change production, or perform real payment, provider, delivery, DNS, data, or user-contact actions without exact owner authorization.
