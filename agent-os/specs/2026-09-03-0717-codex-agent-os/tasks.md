# Codex Agent OS tasks

Status legend: Pending, In progress, Blocked, Complete

## Task 1: Save and verify the specification

Status: Complete
Owner: Parent agent
Files:
- `agent-os/specs/2026-09-03-0717-codex-agent-os/spec.md`
- `agent-os/specs/2026-09-03-0717-codex-agent-os/tasks.md`
- `agent-os/specs/2026-09-03-0717-codex-agent-os/verification.md`
- `agent-os/specs/2026-09-03-0717-codex-agent-os/status.md`

Dependencies: None

Acceptance criteria:
- Current base SHA, open work, scope, constraints, risks, acceptance criteria, and release boundaries are recorded.
- Protected paths and unknown branch-protection status are explicit.

Checks:
- Manual spec review

## Task 2: Add Codex authority and project configuration

Status: Complete
Owner: Parent agent
Files:
- `AGENTS.md`
- `.codex/config.toml`
- `.codex/hooks.json`
- `.codex/hooks/session-start.mjs`

Dependencies:
- Task 1

Acceptance criteria:
- `CLAUDE.md` remains authoritative.
- Critical boundaries load at session start and after compaction.
- No provider or credential settings enter the repository.

Checks:
- Structural test
- TOML and JSON parse
- Hook execution

## Task 3: Add bounded agents and reusable skills

Status: Complete
Owner: Parent agent
Files:
- `.codex/agents/*.toml`
- `.agents/skills/*/SKILL.md`

Dependencies:
- Task 1

Acceptance criteria:
- Four non-overlapping roles exist.
- Six workflow skills exist with valid names and descriptions.
- Parallel writing requires exclusive ownership.

Checks:
- Structural test
- TOML parse
- Skill-frontmatter inspection

## Task 4: Add Agent OS context, standards, and templates

Status: Complete
Owner: Parent agent
Files:
- `agent-os/product/*`
- `agent-os/standards/*`
- `agent-os/templates/spec/*`
- `agent-os/specs/README.md`

Dependencies:
- Task 1

Acceptance criteria:
- Product context stays concise and subordinate to `CLAUDE.md`.
- Standards are indexed.
- Every spec records acceptance criteria, tasks, verification, and status.

Checks:
- Structural test
- Standards-index parse

## Task 5: Add operator guide, optional routing guide, doctor, and tests

Status: Complete
Owner: Parent agent
Files:
- `docs/CODEX_AGENT_OS.md`
- `docs/CODEX_OMNIROUTE_OPTIONAL.md`
- `scripts/codex/doctor.ps1`
- `tests/codex-operating-layer.test.mjs`

Dependencies:
- Tasks 2 through 4

Acceptance criteria:
- First-use instructions are explicit.
- Optional routing remains separate, dry-run-first, and credential-safe.
- Doctor is read-only and blocks direct work on `main`.
- Tests cover the critical operating boundaries.

Checks:
- `node --test tests/codex-operating-layer.test.mjs`

## Task 6: Integrate and review

Status: Complete
Owner: Parent agent

Dependencies:
- Task 5

Acceptance criteria:
- Complete diff remains additive and within scope.
- No existing runtime, content, dependency, environment, protected, provider, or deployment file changed.
- No unresolved P0 or P1 finding remains in the separate adversarial review pass.
- Every acceptance criterion maps to evidence.
- A local Codex `/review` remains required before merge because a separate model review was not available in the assembly environment.

Checks:
- Changed-file inspection
- Independent review
- Acceptance-criteria matrix

## Task 7: Commit to isolated branch and open draft pull request

Status: Pending
Owner: Parent agent

Dependencies:
- Task 6

Acceptance criteria:
- The implementation commit is based on recorded current `main`; a status-only follow-up commit is allowed.
- Branch is `chore/codex-agent-os`.
- A draft pull request targets `main`.
- No merge or deployment occurs.

Checks:
- GitHub commit, branch, pull request, diff, and check evidence
