---
name: ft-debug
description: Use when observed FiberTools behavior lacks a proven root cause or regression test.
---

# FiberTools debug

1. Read the complete root `AGENTS.md`. Classify risk and load every matching `docs/codex/` policy and exact record.
2. Use `$ft-plan` when the defect is multi-file, cross-cutting, high risk, or likely to span sessions.
3. Record observed behavior, expected behavior, reproduction steps, environment, affected path, and evidence quality.
4. Start with no more than 12 likely relevant files found through exact symbols, imports, references, routes, and tests. Expand only when evidence requires it. This is not a hard cap.
5. Trace the real execution path and existing tests. One read-only explorer is allowed for unfamiliar code. Close it after handoff.
6. Rank hypotheses. Do not edit production code until evidence supports a root cause or a narrow experiment.
7. Add a failing regression test first when practical. Confirm it fails for the expected reason. Otherwise record why and define repeatable alternate proof.
8. Apply the smallest repair to the proven cause without weakening a test, gate, manifest, allowlist, or safety control.
9. Run the regression test, adjacent focused tests, and applicable broad suites after stabilization.
10. Use `ft_reviewer` for substantial fixes and both `ft_reviewer` and `ft_verifier` for high-risk fixes. Resolve findings before completion.
11. Report root cause, files, exact tests and results, untested areas, residual risk, and release stage.

A disappearing symptom is not root-cause proof. A local pass is not pull-request, deployment, or production proof.
