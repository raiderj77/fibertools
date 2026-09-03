---
name: ft-audit
description: Review FiberTools work or claims with independent evidence and concise findings.
---

# FiberTools audit

Use for TRUTHMODE, final review, progress, or next-action decisions.

1. Read `AGENTS.md`.
2. Read `.codex/TASK.md` when present, then the diff, relevant tests, and only the exact policy or feature sections needed.
3. Verify repository identity, base SHA, current head, open pull requests, and available checks.
4. For sensitive or substantial work, run one independent `ft_reviewer`. Do not let the implementer validate its own conclusions.
5. Check acceptance criteria against direct evidence. Separate `Verified`, `Inferred`, `Unknown`, `Blocked`, and `Not tested`.
6. Report P0 and P1 findings first with file and line or symbol, failure mode, impact, and narrow repair.
7. Keep the report short. Include only material P2 findings, missing evidence, exact tests observed, current release stage, and one safest next action.
8. Never infer merge from checks, deployment from merge, production from preview, or customers, demand, revenue, payment, delivery, or provider readiness from code or configuration.
