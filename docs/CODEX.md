# FiberTools Codex Workflow

`AGENTS.md` is the complete root Codex instruction file. Detailed standalone policies under `docs/codex/` load only when a task touches their subject.

## Context routing

| Work | Additional policy |
| --- | --- |
| Calculators, formulas, data, public copy, SEO, content, publication | `PRODUCT_PUBLICATION.md` |
| Privacy, analytics, consent, secrets, security, APIs, accessibility | `PRIVACY_SECURITY_ACCESSIBILITY.md` |
| Affiliates, ads, offers, payments, providers, delivery, StitchProof, deployment, production | `COMMERCIAL_RELEASE.md` |

Cross-category work loads every matching policy and the exact feature or release records.

## Commands

Clear low-risk work runs directly.

```text
Use $ft-plan for: [medium or high-risk outcome]
Use $ft-run
```

```text
Use $ft-debug for: [observed behavior and reproduction]
```

```text
Use $ft-audit
```

## Quality controls

- One main agent handles ordinary work.
- A read-only explorer is temporary and closes after its handoff.
- Substantial medium-risk work receives independent review.
- High-risk and final release-sensitive work receives separate high-effort reviewer and verifier passes.
- Bug repairs reproduce the problem and add regression evidence before repair when practical.
- GitHub required checks remain the remote authority.
- Merge, deployment, publication, providers, payments, delivery, DNS, production data, and user contact remain owner-controlled.

## Token controls

- The root file contains durable rules and routing, not every task-specific detail.
- Policy files load only when relevant.
- Skills have narrow descriptions to limit accidental invocation.
- One local `.codex/TASK.md` carries multi-turn state without entering Git.
- The resume hook stays silent during normal startup.
- Focused tests run while editing. Broad suites run after stabilization.
- Raw logs stay out of the task file and main chat.
- Correctness, safety, accessibility, and evidence always outrank token savings.
