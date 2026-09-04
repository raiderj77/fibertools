# FiberTools Codex Workflow

`AGENTS.md` is the complete root Codex instruction file. Detailed policies under `docs/codex/` load only when a task touches their subject. Open Codex from the repository root so instruction discovery remains predictable.

## Context routing

| Work | Additional policy |
| --- | --- |
| Calculators, formulas, data, public copy, SEO, content, publication | `PRODUCT_PUBLICATION.md` |
| Privacy, analytics, consent, secrets, security, APIs, accessibility | `PRIVACY_SECURITY_ACCESSIBILITY.md` |
| Affiliates, ads, offers, payments, providers, delivery, StitchProof, deployment, production | `COMMERCIAL_RELEASE.md` |

Cross-category work loads every matching policy and exact feature or release records.

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
Use $ft-audit in readiness mode
Use $ft-audit in convergence mode
```

Validate an active plan without model reasoning:

```bash
node scripts/codex/task-check.mjs --ready
```

Use `/status` before and after representative tasks to observe the active model, approvals, token usage, and loaded instruction sources. Review any global Codex instructions shown there. Use `/side` for throwaway research that should not clutter the main thread. A side conversation protects main-thread context but still consumes model tokens.

Run the repository-owned context report with:

```bash
node scripts/codex/context-budget.mjs
```

The project caps automatically loaded instruction files through `project_doc_max_bytes`. It does not set a hard `tool_output_token_limit` because middle diagnostics can be lost even when truncation keeps the beginning and end. Prefer focused commands, concise reporters, and saved local logs over blind truncation.

## Quality controls

- Plans include a small evidence-based context set and acceptance-to-test coverage matrix.
- A deterministic task checker catches malformed or incomplete plans before implementation.
- Plans do not become Ready until a read-only consistency pass succeeds.
- A read-only convergence pass compares implementation against every acceptance item before completion.
- One main agent handles ordinary work.
- A read-only explorer is temporary and closes after handoff.
- Substantial medium-risk work receives independent review.
- High-risk and final release-sensitive work receives separate high-effort reviewer and verifier passes.
- Bug repairs reproduce the problem and add regression evidence before repair when practical.
- GitHub required checks remain the remote authority.
- Merge, deployment, publication, providers, payments, delivery, DNS, production data, spending, and user contact remain owner-controlled.

## GitHub research decisions

- Adopted from the official Codex repository: an instruction byte budget, explicit status monitoring, side-thread isolation, hooks, and bounded subagents.
- Adapted from GitHub Spec Kit: pre-implementation consistency analysis and post-implementation convergence against acceptance criteria.
- Adapted from Aider's repository-map approach: begin with a small symbol, import, reference, route, and test context set, then expand only from evidence.
- Serena is an optional pilot for repeated cross-file symbol navigation and refactoring. Keep it user-level, test it on public or synthetic work, and retain it only when first-pass quality stays equal or improves while file reads, retries, and measured token use fall.
- Repomix is useful for occasional token inventories, not as a default full-repository prompt.
- Context7 is optional for version-specific library documentation. Verify material claims against the official primary source.
- GitHub CodeQL is a separate quality upgrade worth evaluating in its own pull request. It adds deterministic security analysis without spending model tokens during each coding task.

Do not install third-party MCP servers or repository-wide agent frameworks by default. Benchmark them first with the same low, medium, and high-risk tasks. Compare first-pass test success, defects found after review, files read, tool calls, retries, and `/status` token usage.

## Token controls

- The root file contains durable rules and routing, not every task-specific detail.
- Policy files load only when relevant.
- Skills have narrow descriptions to limit accidental invocation.
- One local `.codex/TASK.md` carries multi-turn state without entering Git.
- The resume hook stays silent during normal startup.
- Focused tests run while editing. Broad suites run after stabilization.
- Raw logs stay out of the task file and main chat.
- Correctness, safety, accessibility, and evidence always outrank token savings.
