# FiberTools Codex Agent OS

This layer recreates the useful parts of the referenced workflow with current Codex features:

1. persistent repository instructions;
2. saved product context and standards;
3. spec-first planning;
4. bounded parallel agents;
5. progress reporting;
6. independent review and verification;
7. bug-fix planning;
8. ranked next actions;
9. optional model routing kept outside the repository.

`CLAUDE.md` remains the FiberTools authority. This layer does not replace it.

## What lives where

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Concise rules Codex loads for the repository |
| `.codex/config.toml` | Project-scoped hooks, goals, and multi-agent settings |
| `.codex/hooks/` | Context restoration at startup and after compaction |
| `.codex/agents/` | Explorer, implementer, reviewer, and verifier roles |
| `.agents/skills/` | On-demand FiberTools workflows |
| `agent-os/product/` | Concise mission, roadmap guardrails, and stack |
| `agent-os/standards/` | Indexed standards loaded only when relevant |
| `agent-os/templates/spec/` | Reusable spec, task, verification, and status files |
| `agent-os/specs/` | Durable work history |
| `scripts/codex/doctor.ps1` | Read-only repository and operating-layer check |

## First use

Start from an isolated branch or Codex worktree based on current `origin/main`. Do not work directly on `main`.

Run:

```powershell
pwsh -File scripts/codex/doctor.ps1 -RunChecks
```

Open Codex at the repository root. Then:

```text
/hooks
```

Review and approve the project hook. Project hooks should remain untrusted until you inspect them.

Confirm the installed skills:

```text
/skills
```

## Normal workflow

### Small, low-risk correction

State the outcome, file boundary, and acceptance criteria. Ask Codex to inspect the relevant patterns, make the smallest repair, run the focused test, and use `/review`.

### Substantial work

Start with:

```text
Use $ft-shape-spec for: [describe the outcome].
```

Review the saved files under `agent-os/specs/`. Then run:

```text
Use $ft-execute-spec on agent-os/specs/[folder].
```

The parent agent controls task boundaries and integration. It should use no more than four concurrent agents:

- `ft_explorer`, read-only investigation;
- `ft_implementer`, one bounded task with exclusive file ownership;
- `ft_reviewer`, independent read-only review;
- `ft_verifier`, independent evidence collection.

### Long-running work

Use `/goal` to record the outcome, constraints, and verification target. Keep the active spec as the durable implementation record. After resume or compaction, the session hook points Codex back to the current spec and authority files.

### Progress report

```text
Use $ft-progress-report for the active spec.
```

### Defect investigation

```text
Use $ft-bug-fix-plan for: [observed defect and evidence].
```

### Prioritize the next work

```text
Use $ft-next-actions after reviewing current specs, pull requests, and checks.
```

### TRUTHMODE audit

```text
Use $ft-truth-review to double and triple check: [claims, change, or decision].
```

## Parallel work rules

Use subagents for independent areas, not as extra hands on the same file.

Good parallel split:

- agent 1 maps existing implementation and tests;
- agent 2 checks privacy, security, and claims;
- agent 3 checks accessibility and UI behavior;
- agent 4 verifies acceptance criteria after integration.

Bad parallel split:

- two agents editing the same route;
- two agents changing the same test;
- an implementation agent approving its own work;
- agents merging separate assumptions without parent review.

For fully separate changes, use separate Codex worktrees or branches. Keep each pull request narrow.

## Model strategy

Use the strongest trusted OpenAI model available to the parent agent for:

- repository identity and scope decisions;
- security, privacy, payment, legal, and claims work;
- integration;
- final review;
- release decisions.

A lower-cost or routed model is suitable only for bounded, low-risk exploration, formatting, boilerplate, or test enumeration. Independently review its output before integration.

Do not commit model names, providers, API keys, profiles, notifications, or telemetry configuration to this repository. Keep those choices in the user's Codex home configuration.

## Evidence standard

Always separate:

1. local change;
2. focused tests;
3. commit and pushed branch;
4. pull request and checks;
5. merge;
6. deployment tied to the expected SHA;
7. direct production verification.

A successful build does not prove provider readiness, checkout, delivery, analytics, sales, revenue, demand, or customer outcomes.
