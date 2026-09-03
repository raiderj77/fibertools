---
name: ft-run
description: Execute one approved FiberTools task with narrow context and focused tests.
---

# FiberTools run

1. Read `AGENTS.md` and `.codex/TASK.md`.
2. Confirm the task base and assumptions still match current `origin/main`, the worktree, and overlapping pull requests.
3. Read only the files needed for the next step.
4. Use one main agent by default. Use one `ft_reviewer` after integration for sensitive or substantial work. Do not use parallel writers on overlapping paths.
5. Make the smallest complete change. Preserve unrelated work and existing gates.
6. Run the focused test while iterating. Run the broad suite once after the change stabilizes.
7. Update only `Status`, completed steps, evidence, and `Next` in `.codex/TASK.md`. Keep logs and raw output out of the task file.
8. Before the pull request decision, inspect the full diff, run required checks, and perform independent review when risk warrants it.
9. Report local work, pushed branch, pull request checks, merge, deployment, and production verification as separate stages.

When the task is complete, include its final evidence in the pull request or final report, then delete `.codex/TASK.md`. Never merge, deploy, publish, activate commercial paths, or change production without exact owner authorization.
