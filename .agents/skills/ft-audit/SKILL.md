---
name: ft-audit
description: Use for explicit TRUTHMODE, final review, evidence audit, progress, or next-action ranking.
---

# FiberTools audit

1. Read the complete root `AGENTS.md` and `.codex/TASK.md` when present.
2. Classify risk and load every matching `docs/codex/` policy and exact feature, manifest, environment, release, source, and test record.
3. Verify repository identity, current `origin/main`, task base, current head, open pull requests, branch protection, and available checks.
4. Inspect the complete diff, execution paths, tests, user-visible behavior, and evidence for each acceptance criterion.
5. Use `ft_reviewer` for substantial medium-risk work. Use `ft_reviewer` and `ft_verifier` for high-risk or final release-sensitive work. Wait for both, resolve conflicts from direct evidence, and close them after capturing the results.
6. Report P0 and P1 findings first with exact file and line or symbol, failure mode, impact, and narrow repair.
7. Separate `Verified`, `Inferred`, `Unknown`, `Blocked`, and `Not tested`.
8. Include material P2 findings, missing proof, exact commands observed, residual risk, release stage, and one safest next action.
9. Never infer merge from checks, deployment from merge, production from preview, or provider readiness, payment, delivery, customers, demand, or revenue from code or configuration.

Keep the report concise. Never omit a material defect or missing proof to save tokens.
