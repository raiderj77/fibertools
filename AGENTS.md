# FiberTools Codex

Repo: `raiderj77/fibertools`
Production branch: `main`
Runtime: Node.js 24.x, npm

Correctness, safety, and complete evidence outrank token savings. Keep context focused, but never skip a relevant rule, test, source, or independent check to reduce usage.

## Before edits

- Verify the root and `origin`. Fetch current `origin/main`, record its SHA, then inspect the branch, worktree, recent relevant commits, and overlapping pull requests.
- Work on a clean branch or worktree from current `origin/main`. Never push to `main`.
- Preserve unrelated owner work. Define the goal, affected behavior, scope, exclusions, acceptance criteria, and validation before editing.
- Stop when identity, scope, ownership, approval, or a protected boundary is unclear.

## Context by risk

- Use one main agent for ordinary work.
- Search exact paths, symbols, references, and tests first. Read the smallest useful ranges.
- Low risk: read this file, affected code, and focused tests.
- Medium risk or unfamiliar behavior: also read the relevant sections of `CLAUDE.md` and exact feature records. Use `$ft-plan` or `$ft-debug`.
- High risk or release-sensitive work: read all of `CLAUDE.md`, then the exact manifests, environment contracts, release records, source, and tests before editing. High risk includes formulas and canonical data, public claims or structured data, accessibility, privacy, analytics, security, publication, payments, providers, delivery, StitchProof, deployment, and production.
- Use current primary documentation when framework, API, legal, provider, or platform behavior is material and time-sensitive.
- Never open or summarize `docs/stitchproof-distribution-kit.md` or protected StitchProof experiment, attribution, distribution, or outcome records without exact owner authorization.

## Workflow

- Handle a clear, low-risk correction directly.
- Use `$ft-plan` for unclear, risky, multi-file, cross-cutting, or multi-session work.
- Use `$ft-debug` when the failure mode or root cause is not proven.
- Use `$ft-run` to execute an approved `.codex/TASK.md`.
- Use `$ft-audit` for TRUTHMODE, final review, progress, or next-action decisions.
- A bug fix must reproduce the defect and add a failing regression test first when practical. If not practical, record why and use the strongest available alternate evidence.
- Make the smallest complete change. Reuse verified patterns. Avoid unrelated cleanup and new dependencies.
- Use no more than two spawned agents, excluding the primary. For substantial work, one read-only explorer is allowed before implementation. For high-risk or final work, use `ft_reviewer` and `ft_verifier`. Never give writers overlapping files or let an implementer approve its own work.
- Resolve reviewer and verifier disagreements against direct evidence before reporting completion.

## Boundaries

- Do not inspect, expose, or commit real `.env*` values, credentials, private artifacts, personal or payment data, provider payloads, calculator inputs, recovery data, or free-form user text.
- Preserve the publication freeze, content quarantine, browser-local calculator promise, privacy and consent behavior, Global Privacy Control, standard and embed security-header split, accessibility, and fail-closed commercial gates in current FiberTools records.
- Do not merge, deploy, publish, change DNS, activate ads, billing, checkout, providers, delivery, real payments, production data, or user contact without exact owner authorization.
- Do not weaken tests, manifests, allowlists, review dates, security controls, or gates to make work pass.
- Never invent tests, sources, dates, approvals, provider readiness, deployment state, customers, demand, revenue, or outcomes.

## Validate and report

- Run the smallest relevant test while editing.
- Run each broad suite once after stabilization. Repeat after a relevant change or failure.
- Treat `.github/workflows/empire-check.yml` as the full CI authority.
- High-risk work requires focused regression coverage, `ft_reviewer`, `ft_verifier`, and all applicable required checks.
- Record exact commands and observed results. Mark skipped, blocked, timed-out, and untested work.
- Inspect the final diff for unrelated files, secrets, generated private products, and protected records.
- Report local change, focused tests, pushed branch, pull request checks, merge, SHA-tied deployment, and direct production verification separately.

## Code Review Rules

- P0: block secret or protected-record exposure, data loss, unauthorized access, irreversible financial action, or unapproved production, payment, provider, publication, delivery, or DNS activation.
- P1: block incorrect behavior, formula or claim mismatches, publication bypass, privacy, consent, security, or accessibility regressions, missing material regression tests, and false release-stage or business claims.
- P2: report maintainability, recovery-state, documentation, performance, or test gaps when they create a material future risk. Ignore style-only preferences.

Done means acceptance criteria are proven, applicable reviews and checks pass, the diff contains no unrelated work, residual risks are stated, and the exact release stage is clear. Code complete does not mean merged, deployed, activated, delivered, or production-verified.
