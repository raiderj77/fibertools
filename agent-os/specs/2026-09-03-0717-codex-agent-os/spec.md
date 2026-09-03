# Codex Agent OS specification

Status: In progress
Owner: Parent Codex agent
Created: 2026-09-03
Base branch: main
Base SHA: `946de9069f62aeb62e89b1c104f46fc372a55b73`

## Outcome

Add a repository-scoped Codex operating layer that improves context recovery, spec-driven planning, safe parallel work, independent review, and reproducible verification without changing the FiberTools application, public content, dependencies, provider settings, or production state.

## Current behavior

Verified on 2026-09-03:

- `CLAUDE.md` is the current repository contract.
- FiberTools has extensive Claude-oriented agents and commands, but no root `AGENTS.md`, project `.codex/` configuration, repository-scoped Codex skills, or `agent-os/` structure.
- Current `main` is `946de9069f62aeb62e89b1c104f46fc372a55b73`.
- Open pull requests 60, 38, 28, and 27 were reviewed for overlap. This work adds new Codex and Agent OS paths and does not modify their application or documentation paths.
- The branch-protection endpoint was unavailable to the connected integration. Branch-protection status remains unknown.
- No GitHub ruleset was returned by the repository rulesets endpoint.

## Requested behavior

Codex should:

- load concise FiberTools rules at repository entry and after compaction;
- defer to `CLAUDE.md` instead of creating a conflicting rule source;
- save substantial work as a spec before implementation;
- use bounded parallel agents with exclusive write ownership;
- separate implementation, review, and verification;
- generate evidence-based progress, bug-fix, next-action, and TRUTHMODE reports;
- keep provider routing optional and outside repository configuration.

## Included scope

- Root `AGENTS.md`
- Project `.codex/config.toml`
- Session-start hook
- Four FiberTools custom agents
- Six reusable FiberTools skills
- Product context, standards index, and focused standards
- Spec templates and this implementation spec
- Codex operating guide
- Optional OmniRoute evaluation guide
- Read-only PowerShell doctor
- Automated structural tests

## Excluded scope

- Application source, routes, components, calculator logic, public content, dependencies, lockfiles, environments, payments, analytics, providers, DNS, Vercel, deployment, publication, merge, and production verification
- Protected StitchProof distribution, experiment, attribution, or outcome records
- Automatic installation or configuration of OmniRoute
- Committed model, profile, API-key, notification, or telemetry settings

## Authority and constraints

- `CLAUDE.md` remains authoritative.
- No direct push to `main`.
- Work must remain additive and isolated.
- No protected-record access.
- No secrets or private artifacts.
- No false claims about tests, checks, approval, merge, deployment, provider readiness, revenue, demand, customers, or outcomes.
- Parallelism is limited to four agents with one writer per file.
- Provider routing is machine-local and optional.
- Strong independent review remains required for security, privacy, payment, legal, claims, and release-sensitive work.

## References

- Repository contract: `CLAUDE.md`
- Product and validation context: `README.md`, `package.json`
- Existing session pattern: `.claude/commands/session-start.md`
- External reference: Builder Methods Agent OS, standards and shape-spec workflow
- External reference: OpenAI Codex documentation for `AGENTS.md`, project configuration, hooks, skills, subagents, goals, worktrees, and `/review`
- External reference: OmniRoute Codex CLI integration, used only as an optional routing reference

## Decisions

| Decision | Reason | Evidence |
| --- | --- | --- |
| Keep `AGENTS.md` concise and make `CLAUDE.md` authoritative | Avoid duplicate rules and stale conflicts | Current repository already has a detailed operating contract |
| Use six on-demand skills | Load workflow detail only when needed | Codex skills support progressive disclosure |
| Limit concurrency to four | Reduce conflicts and review burden | FiberTools work often touches shared routes, tests, claims, and gates |
| Use four narrow agent roles | Separate exploration, writing, review, and verification | Independent roles reduce self-validation |
| Use a session-start hook | Restore critical context after startup, resume, clear, or compaction | Codex hooks support additional session context |
| Keep providers out of project config | Avoid secrets, machine coupling, and ignored project keys | Codex project config excludes provider and auth settings |
| Keep OmniRoute optional | Gain bounded low-cost routing without changing trusted defaults | It is third-party infrastructure with separate terms and reliability risk |
| Add structural tests | Prevent silent drift in the operating layer | The change otherwise has no application runtime path |

## Assumptions and unknowns

| Item | Type | Resolution or stop condition |
| --- | --- | --- |
| Project hooks will require local trust review | Verified platform behavior | Run `/hooks` and approve the repository hook locally |
| Custom agents inherit the user's current model | Intended configuration | No model is committed in agent files |
| Branch protection is enabled | Unknown | Do not claim it. Continue using a separate branch and draft pull request |
| OmniRoute provider availability and free-tier totals | Time-sensitive and external | Recheck its current repository and provider terms before any installation |
| Codex feature flags remain stable | Time-sensitive | Recheck official Codex docs before future structural changes |

## Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Duplicate instructions conflict | Wrong repository behavior | `AGENTS.md` states `CLAUDE.md` wins |
| Too much context reduces performance | Slower or less focused sessions | Keep root instructions concise and load details through skills |
| Parallel agents overwrite work | Lost or conflicting changes | Four-agent limit, exclusive write ownership, parent integration |
| Hook reads sensitive data | Privacy or secret exposure | Hook reads only spec status and emits fixed instructions |
| Optional router weakens review quality | Incorrect high-risk changes | Keep it optional and require trusted-model review for sensitive work |
| Workflow files drift or break | Codex silently loses protections | Add a built-in Node structural test and read-only doctor |

## Acceptance criteria

1. Root `AGENTS.md` names `CLAUDE.md` as authority and preserves all critical repository, protected-record, truth, privacy, publication, release, and review boundaries.
2. `.codex/config.toml` enables hooks, goals, and multi-agent support, limits concurrency to four, and contains no provider, profile, auth, notification, telemetry, or key values.
3. The session-start hook emits concise context for startup, resume, clear, and compaction without reading protected or secret files.
4. Four valid custom agents separate read-only exploration, bounded implementation, independent review, and independent verification.
5. Six valid skills support shape-spec, execute-spec, progress-report, bug-fix-plan, next-actions, and TRUTHMODE workflows.
6. `agent-os/` contains concise product context, an indexed standards library, reusable spec templates, and a durable spec lifecycle.
7. The optional OmniRoute guide requires dry-run review, environment-held credentials, bounded use, and independent verification.
8. The PowerShell doctor is read-only by default, blocks work on `main`, checks repository identity, reports recent work, and runs only the operating-layer test when asked.
9. A built-in Node test validates required files, instruction authority, configuration boundaries, agent and skill structure, hook execution, and optional-router safeguards.
10. No existing application, public content, dependency, lockfile, environment, protected record, provider, or deployment file changes.

## Validation plan

- `node --test tests/codex-operating-layer.test.mjs`
- Parse all TOML with Python `tomllib`
- Parse `.codex/hooks.json`
- Execute `.codex/hooks/session-start.mjs`
- Inspect the complete changed-file list
- Review the draft pull request diff and remote checks separately

## Release boundaries

This specification authorizes an additive branch and draft pull request only. It does not authorize merge, deployment, publication, billing, provider configuration, offer activation, customer delivery, or production changes.
