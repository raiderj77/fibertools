---
name: ft-progress-report
description: Produce an evidence-based FiberTools progress report from the active spec, Git state, pull requests, checks, and verified repository facts. Use for status updates, handoffs, or session recovery.
---

# FiberTools Progress Report

Read `AGENTS.md`, `CLAUDE.md`, the active spec, and current Git evidence. Review relevant pull requests and checks when available.

Report only what the evidence proves.

## Required sections

1. Outcome being pursued
2. Current repository, branch, base SHA, and head SHA
3. Completed tasks with file or commit evidence
4. Work in progress
5. Acceptance criteria status
6. Checks run and observed results
7. Open P0 or P1 findings
8. Risks, blockers, and unknowns
9. Release stage
10. Safest next action

Use these labels:

- Verified
- Inferred
- Unknown
- Blocked

Do not collapse these stages:

- local edits;
- focused validation;
- commit and pushed branch;
- pull request and remote checks;
- merge;
- deployment tied to a SHA;
- direct production verification.

Do not infer provider readiness, sales, fulfillment, analytics, revenue, demand, customers, or outcomes from source code or deployment health.
