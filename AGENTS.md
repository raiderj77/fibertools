# FiberTools Codex

Repo: `raiderj77/fibertools`
Branch: `main`
Runtime: Node.js 24.x, npm

## Before edits

- Verify the root and `origin`. Fetch current `origin/main`, record its SHA, then inspect the branch, worktree, and relevant open pull requests.
- Work on a clean branch or worktree from current `origin/main`. Never push to `main`.
- Preserve unrelated owner work. Stop when identity, scope, ownership, or a protected boundary is unclear.

## Token-first workflow

- Use one main agent.
- Search exact paths, symbols, and tests first. Read the smallest useful ranges.
- Make the smallest complete change. Avoid unrelated cleanup and new dependencies.
- Ordinary code work needs this file plus affected code and tests.
- For any product, formula, public-content, data, accessibility, security, commercial, provider, StitchProof, deployment, or production behavior, search `CLAUDE.md` and read only the relevant section and exact feature records. Those records control FiberTools facts and gates.
- Handle clear, low-risk work directly.
- Use `$ft-plan` for unclear, risky, or multi-file work, `$ft-run` to execute its temporary `.codex/TASK.md`, and `$ft-audit` for TRUTHMODE or final review.
- Use at most one read-only `ft_reviewer`. Do not spawn extra agents for ordinary work. Never give writers overlapping files or let an implementer approve its own work.

## Boundaries

- Never open or summarize `docs/stitchproof-distribution-kit.md` or protected StitchProof records without exact owner authorization.
- Do not inspect, expose, or commit real `.env*` values, secrets, private artifacts, personal or payment data, provider payloads, calculator inputs, or free-form user text.
- Preserve the publication freeze, content quarantine, browser-local calculator promise, privacy and consent behavior, security-header split, accessibility, and fail-closed commercial gates in current FiberTools records.
- Do not merge, deploy, publish, change DNS, activate ads, billing, checkout, providers, delivery, real payments, production data, or user contact without exact owner authorization.
- Do not weaken tests, manifests, allowlists, review dates, or gates to make work pass.
- Never invent tests, sources, approvals, provider readiness, deployment state, customers, demand, revenue, or outcomes.

## Validate

- Run the smallest relevant test while editing.
- Run each broad suite once after stabilization. Repeat only after a relevant change or failure.
- Treat `.github/workflows/empire-check.yml` as the full CI authority.
- Record exact commands and observed results. Mark skipped, blocked, timed-out, and untested work.
- Report local change, focused tests, pushed branch, pull request checks, merge, SHA-tied deployment, and direct production verification separately.

Done means acceptance criteria pass, the diff is clean, material risks received review, and the exact release stage is stated. Code complete does not mean merged, deployed, activated, delivered, or production-verified.
