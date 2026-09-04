---
name: ft-debug
description: Reproduce and repair FiberTools defects with root-cause and regression evidence.
---

# FiberTools debug

1. Read the complete root `AGENTS.md` and classify the defect by risk. Use `$ft-plan` when it is multi-file, cross-cutting, high risk, or likely to span sessions.
2. Record observed behavior, expected behavior, exact reproduction steps, environment, affected path, and evidence quality.
3. Search narrowly, then trace the real execution path, references, and existing tests. Use one read-only explorer only when the area is unfamiliar.
4. Rank hypotheses. Do not edit production code until evidence supports a root cause or a narrow experiment is defined.
5. Add a failing regression test first when practical. Confirm it fails for the expected reason. When a test is not practical, record why and define the strongest repeatable alternate proof.
6. Apply the smallest repair that addresses the proven cause without weakening a test, gate, manifest, allowlist, or safety control.
7. Run the regression test, adjacent focused tests, and applicable broad suites after stabilization.
8. Use `ft_reviewer` for substantial fixes. Use both `ft_reviewer` and `ft_verifier` for high-risk fixes. Resolve findings before reporting completion.
9. Report root cause, changed files, exact tests and results, untested areas, residual risk, and current release stage.

A disappearing symptom is not proof of root-cause repair. A local pass is not proof of pull-request, deployment, or production success.
