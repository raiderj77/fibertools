# FiberTools Codex

Repository: `raiderj77/fibertools`
Production branch: `main`
Runtime: Node.js 24.x and npm

## Start

- Verify the root and `origin`, fetch current `origin/main`, record its SHA, then inspect the branch, worktree, and relevant open pull requests.
- Work on a clean branch or worktree from current `origin/main`. Never push directly to `main`.
- Preserve unrelated owner work. Stop when identity, scope, file ownership, or a protected boundary is unclear.

## Keep context lean

- Use one main agent by default.
- Search exact paths, symbols, and tests first. Read the smallest useful ranges.
- Make the smallest complete change. Avoid unrelated cleanup and new dependencies.
- For ordinary code work, read this file plus affected code and tests.
- For product rules, formulas, public copy, SEO, publication, privacy, analytics, accessibility, security, payments, providers, StitchProof, deployment, or production, search `CLAUDE.md` and read only the relevant section and exact feature documents. Those records control FiberTools facts and release gates.
- Never open or summarize `docs/stitchproof-distribution-kit.md` or protected StitchProof experiment, attribution, distribution, or outcome records without exact owner authorization.

## Use the lightest workflow

- Handle a clear, low-risk correction directly.
- Use `$ft-plan` for unclear, risky, or multi-file work. It creates one temporary `.codex/TASK.md`.
- Use `$ft-run` to execute an approved task.
- Use `$ft-audit` for TRUTHMODE, sensitive work, final review, progress, or next actions.
- Use at most one read-only `ft_reviewer` unless independent workstreams and speed justify more agents. Never give writers overlapping files. An implementer never approves its own work.

## Boundaries

- Do not inspect, expose, or commit real `.env*` values, credentials, private artifacts, personal or payment data, provider payloads, calculator inputs, or free-form user text.
- Preserve the publication freeze, content quarantine, browser-local calculator promise, consent and Global Privacy Control behavior, standard and embed security split, accessibility, and fail-closed commercial gates in current FiberTools records.
- Do not merge, deploy, publish, change DNS, enable billing, activate ads, checkout, providers, or delivery, perform real payment or production-data actions, or contact users without exact owner authorization.
- Do not weaken tests, manifests, allowlists, review dates, or gates to make work pass.
- Never invent tests, citations, approvals, provider readiness, deployment state, customers, demand, revenue, or outcomes.

## Validate

- Run the smallest relevant test while editing.
- Run each broad suite once after the change stabilizes and before the pull request or merge decision. Repeat only after a relevant change or failure.
- Use `.github/workflows/empire-check.yml` as the full CI authority.
- Record exact commands and observed results. Mark skipped, blocked, timed-out, and untested work.
- Report local change, focused tests, pushed branch, pull request checks, merge, deployment tied to a SHA, and direct production verification separately.

Done means acceptance criteria pass, the diff has no unrelated work, material risks received review, and the exact release stage is stated. Code complete does not mean merged, deployed, activated, delivered, or verified in production.
