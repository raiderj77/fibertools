---
name: ft-audit
description: Audit FiberTools work or claims with independent review, verification, and direct evidence.
---

# FiberTools audit

Use for TRUTHMODE, final review, progress, or next-action decisions.

1. Read the complete root `AGENTS.md` and `.codex/TASK.md` when present.
2. Verify repository identity, current `origin/main`, task base, current head, open pull requests, branch protection, and available checks.
3. Classify risk and read every exact source, test, feature, manifest, environment, publication, commercial, security, and release record required by the task.
4. Inspect the complete diff, affected execution paths, relevant tests, user-visible behavior, and evidence for each acceptance criterion.
5. Use `ft_reviewer` for substantial medium-risk work. Use `ft_reviewer` and `ft_verifier` for high-risk or final release-sensitive work. Wait for both and resolve conflicts using source, tests, current primary documentation, or provider evidence.
6. Report P0 and P1 findings first with exact file and line or symbol, failure mode, impact, and narrow repair.
7. Separate `Verified`, `Inferred`, `Unknown`, `Blocked`, and `Not tested`.
8. Include material P2 findings, missing evidence, exact commands observed, residual risk, current release stage, and one safest next action.
9. Never infer merge from checks, deployment from merge, production from preview, or provider readiness, payment, delivery, customers, demand, or revenue from code or configuration.

Keep the report concise, but never omit a material defect or missing proof to save tokens.
