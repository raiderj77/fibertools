---
name: ft-audit
description: Use for TRUTHMODE, readiness, convergence, final review, evidence audit, progress, or next actions.
---

# FiberTools audit

This skill is read-only unless the owner separately authorizes a repair.

1. Read the complete root `AGENTS.md` and `.codex/TASK.md` when present.
2. Classify risk and load every matching `docs/codex/` policy and exact feature, manifest, environment, release, source, and test record.
3. Verify repository identity, current `origin/main`, task base, current head, open pull requests, branch protection, and available checks.
4. Inspect the complete diff, affected execution paths, tests, user-visible behavior, and evidence.
5. For pre-implementation readiness, find duplicate, conflicting, ambiguous, or uncovered requirements. Confirm every acceptance item maps to a step and proving test, every step maps to an acceptance item, dependencies are ordered, and edge, failure, rollback, and fail-closed behavior are covered.
6. For post-implementation convergence, classify each acceptance item as `Satisfied`, `Partial`, `Missing`, `Contradicts`, or `Not tested`. Report material `Unrequested` work separately. The result is `Converged` only when every required item is Satisfied and no unresolved P0 or P1 finding remains.
7. Use `ft_reviewer` for substantial medium-risk work. Use `ft_reviewer` and `ft_verifier` for high-risk or final release-sensitive work. Wait for both, resolve conflicts from direct evidence, and close them after capturing results.
8. Report P0 and P1 findings first with exact file and line or symbol, failure mode, impact, and narrow repair. Group repetitive P2 findings, but never hide a material defect.
9. Include coverage counts, missing proof, exact commands observed, residual risk, release stage, and one safest next action. Separate `Verified`, `Inferred`, `Unknown`, `Blocked`, and `Not tested`.
10. Never infer merge from checks, deployment from merge, production from preview, or provider readiness, payment, delivery, customers, demand, or revenue from code or configuration.

Keep the report compact. Never omit a material defect or missing proof to save tokens.
