# Codex Agent OS verification

## Acceptance-criteria matrix

| Criterion | Evidence or command | Status | Result |
| --- | --- | --- | --- |
| Authority and critical boundaries | Inspect `AGENTS.md`; structural test | Verified | `CLAUDE.md` authority, protected paths, main-branch block, truth, privacy, publication, release, and review rules are present |
| Project config boundaries | Python `tomllib`; structural test | Verified | Parsed with only `features` and `agents`; no provider, profile, auth, notification, telemetry, or key assignment |
| Safe session-start hook | JSON parse; direct Node execution; structural test | Verified | Exit 0; emitted 601 characters; active spec detected; no protected or secret file read |
| Four custom agents | Python `tomllib`; structural test | Verified | Four unique valid TOML files with explorer, implementer, reviewer, and verifier roles |
| Six workflow skills | Frontmatter inspection; structural test | Verified | Six unique names and descriptions for every required workflow |
| Agent OS structure | YAML parse; structural test | Verified | Four indexed standards, three product files, four templates, and durable spec lifecycle |
| Optional router safeguards | Guide inspection; structural test | Verified | Third-party boundary, dry-run-first procedure, environment credential, stop conditions, and trusted-model review present |
| Read-only doctor | Static inspection; structural test | Verified | Contains no push, commit, checkout, switch, merge, reset, clean, PR-create, PR-merge, or PR-close command; blocks `main` |
| Automated structural test | `node --test tests/codex-operating-layer.test.mjs` | Verified | 10 tests passed, 0 failed |
| Additive scope only | Inventory and temporary staged Git diff inspection | Verified | 35 UTF-8 text files, all in approved operating paths; no secret-pattern hit; `git diff --cached --check` exit 0 |
| Remote branch ancestry | GitHub compare `946de9069...46f919c9` | Verified | Branch is one commit ahead, zero behind, with the recorded base as merge base |
| Draft pull request | GitHub PR #61 metadata | Verified | Open draft against `main`; 35 changed files, 2,019 additions, 0 deletions; no merge |

## Commands run

| Command | Exit status | Observed result |
| --- | ---: | --- |
| `node --test tests/codex-operating-layer.test.mjs` | 0 | 10 passed, 0 failed |
| Python TOML, JSON, and YAML parse | 0 | Five TOML files, hooks JSON, and four-entry standards index parsed |
| `node .codex/hooks/session-start.mjs` | 0 | Valid hook payload; active spec detected |
| Temporary-repository `git diff --cached --check` | 0 | No whitespace error |
| `npx -y node@24 --test tests/codex-operating-layer.test.mjs` | Timed out | No Node 24 result; remote repository checks remain the Node 24 authority |
| GitHub compare recorded base to implementation commit | 0 | One commit ahead, zero behind; 35 added files and no deletions |
| GitHub PR #61 creation | 0 | Open draft pull request against `main` |
| Initial remote check inspection | 0 | Public-file compliance and Vercel preview comments succeeded; build and quality gate remained in progress at inspection time |

## Review

Reviewer: Separate parent-agent adversarial pass
Result: No P0 or P1 finding identified

### Findings

- The verifier role originally used a read-only sandbox, which would block build tools that write generated artifacts. It now uses `workspace-write` with an explicit prohibition on tracked-file edits and a before-and-after Git-status requirement.
- The first test run found a wording mismatch in the task template. The template was corrected, and the suite passed afterward.
- PowerShell was not installed in the assembly environment. The doctor received structural inspection but no PowerShell runtime execution.
- A separate-model Codex `/review` was not available in this environment and remains a pre-merge step.

## Evidence boundaries

- Local checks do not prove pull request checks.
- A successful check on one commit does not prove a later status-only commit.
- Pull request checks do not prove merge.
- Merge does not prove deployment.
- Deployment health does not prove provider, payment, fulfillment, analytics, revenue, demand, or customer outcomes.

## Untested areas and residual risk

- Project hook trust and execution inside the user's local Codex installation
- PowerShell runtime execution of `scripts/codex/doctor.ps1`
- Node 24 local execution, pending repository checks
- Current user-level Codex feature and provider configuration
- Separate-model `/review`
- Optional OmniRoute installation, providers, credentials, terms, quotas, or reliability
- FiberTools application behavior, because no application file is in scope
- Final remote build and quality result for the status-only follow-up commit
- Merge, deployment, and production behavior
