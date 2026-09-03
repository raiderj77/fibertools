---
name: ft-run
description: Execute an approved FiberTools task with focused context, tests, review, and verification.
---

# FiberTools run

1. Read `AGENTS.md` and `.codex/TASK.md`.
2. Reverify the repository, current `origin/main`, branch, worktree, overlapping pull requests, risk level, and task assumptions.
3. Load context by risk. High-risk work requires all of `CLAUDE.md` and the exact feature, manifest, environment, release, source, and test records.
4. If a reported defect lacks reproduction or regression evidence, stop implementation and use `$ft-debug`.
5. Make the smallest complete change. Preserve unrelated work, current gates, and owner-controlled boundaries.
6. Run the focused test during implementation. After the change stabilizes, run each applicable broad suite once. Repeat only after a relevant change or failure.
7. Update `.codex/TASK.md` with completed steps, exact commands, observed results, unresolved risks, and the next action. Do not paste raw logs.
8. Before the pull request decision:
   - inspect the complete diff;
   - run all applicable required checks;
   - use `ft_reviewer` for substantial medium-risk work;
   - use both `ft_reviewer` and `ft_verifier` for high-risk work;
   - wait for both independent results and resolve disagreements against direct evidence.
9. Copy final decisions and evidence into the pull request or exact tracked feature record before deleting `.codex/TASK.md`.
10. Report local work, branch, pull request checks, merge, deployment, and production verification as separate stages.

Never merge, deploy, publish, activate commercial paths, change production, or perform real payment, provider, delivery, DNS, data, or user-contact actions without exact owner authorization.
