# FiberTools Codex Operating Standard

> Codex operating contract for `raiderj77/fibertools`.
> Last repository verification: 2026-09-03.
> Reverify current facts before every change. A dated record proves only what was checked at that time.

## 1. Authority

Read `AGENTS.md` first. Read `CLAUDE.md` before analysis, planning, or editing.

Use this order:

1. The owner's explicit instruction for the current task.
2. This file for Codex workflow, evidence, review, and safety.
3. `CLAUDE.md` for the FiberTools product and repository contract.
4. The most specific approved manifest, release record, environment contract, or feature document for the affected path.
5. Source code, tests, GitHub workflows, and current provider or deployment evidence.
6. `README.md`.
7. `EMPIRE_BUILD_STANDARDS.md` only where newer FiberTools-specific records do not contradict it.

If a lower source conflicts with a higher source, follow the higher source. When `CLAUDE.md` is the higher product source, follow `CLAUDE.md`. If current sources conflict on protected records, publication, privacy, security, payments, providers, deployment, production, or legal requirements, stop before editing and report the conflict. Never choose the less restrictive interpretation silently.

`CLAUDE.md`, `EMPIRE_BUILD_STANDARDS.md`, and `.claude/settings.local.json` are protected by the repository pre-commit hook. Do not modify them unless the owner requests that exact file change.

Never open, summarize, modify, stage, or reinterpret `docs/stitchproof-distribution-kit.md` or protected StitchProof experiment, attribution, distribution, or outcome records without exact owner authorization.

## 2. Repository identity and start gate

Canonical identity:

- Repository: `raiderj77/fibertools`
- Remote: `https://github.com/raiderj77/fibertools.git`
- Production branch: `main`
- Production platform: Vercel
- Production domains: `fibertools.app` and `www.fibertools.app`
- Local root: `C:\Users\jason\Documents\fibertools` or an explicit FiberTools worktree
- Runtime: Node.js 24.x
- Package manager: npm

Before changing a file:

1. Confirm the repository root and `origin`.
2. Fetch and record the current `origin/main` SHA.
3. Confirm branch protection and required checks.
4. Review the branch and `git status --short --branch`.
5. Review recent relevant commits and overlapping open pull requests.
6. Identify and preserve unrelated owner changes.
7. Work from a clean isolated branch or worktree based on current `origin/main`.
8. State the outcome, scope, exclusions, acceptance criteria, risks, and validation plan.

Never push directly to `main`.

As verified on 2026-09-03, `main` was protected and required `Build and quality gates` and `Public-file compliance`. Reverify this state. Use a branch and pull request even if protection is missing or misconfigured.

Stop before editing when identity, base SHA, worktree ownership, overlapping work, scope, protected boundaries, irreversible effects, or required approval remain unresolved.

## 3. Choose the workflow

### Read-only work

Use for audits, repository mapping, reviews, and recommendations.

- Do not edit files.
- Separate verified facts, inferences, and unknowns.
- Cite file paths, lines, commits, pull requests, checks, or current primary sources.
- Do not inspect secrets, private artifacts, protected records, customer data, or production data.

### Small focused correction

Use only when the desired behavior is clear, the change is narrow and reversible, and no material product, privacy, security, payment, publication, provider, deployment, legal, or architecture risk exists.

### Substantial or risky work

Use `$ft-shape-spec` before implementation for new features, multi-file behavior changes, major refactors, unclear requests, formulas, public claims, structured data, analytics, privacy, security headers, payments, delivery, publication, databases, retention, providers, or production work.

Save the spec under `agent-os/specs/`. Use `$ft-execute-spec` only after scope, risks, file ownership, acceptance criteria, and validation are explicit.

Use `$ft-bug-fix-plan` when the root cause is not proven. Reproduce first and add a failing regression test when practical.

Use `$ft-truth-review` for TRUTHMODE, audits, verification, and double or triple checks. One agent's conclusion must not validate itself.

## 4. Product contract

FiberTools is a privacy-first collection of free, deterministic fiber-arts calculators and references.

Public self-service calculators must:

- require no account or email;
- process project inputs in the browser unless a separate server workflow is clearly disclosed;
- present results as planning aids, not guaranteed outcomes;
- remain free even when optional paid products exist;
- state assumptions, units, rounding, and limitations;
- preserve labels, keyboard operation, visible focus, result announcements, and responsive reflow;
- keep calculator values and free-form text out of analytics, advertising, affiliates, logs, and unrelated services.

The homepage supports three jobs:

1. Calculate yarn and materials.
2. Fix gauge, sizing, and stitch counts.
3. Plan a crochet or knitting project.

Featured order is Blanket, Yarn, Circle, Amigurumi Shapes, and Cast-on. Sock Calculator is secondary. Keep other ready tools available through the server-rendered directory.

Use US crochet terminology and Craft Yarn Council labels Lace (0) through Jumbo (7). Keep formulas deterministic, documented, bounded, unit-aware, and covered by focused regression tests. Do not add unsourced generated facts to datasets or public copy.

## 5. Publication and commercial boundaries

### Publication freeze

The publication freeze remains in force through November 20, 2026 unless an explicit owner-approved record authorizes the exact exception. The date alone does not lift the freeze.

Before it is lifted or replaced, do not add a new public calculator, general tool, article, guide, paid service, or major feature. Bug fixes, security fixes, legal and factual corrections, accessibility repairs, and broken-link repairs remain allowed.

Markdown under `content/published` is quarantined unless both the application allowlist and an explicit owner-approved record make it public. A filename or `status: published` front matter is not approval.

Never create doorway pages, duplicate programmatic pages, generic AI articles, scraped content, link schemes, unsourced claims, fake review dates, or fabricated editorial approval.

### Offers and monetization

- Amazon links may use tag `ytearnings-20` only when useful. Place a disclosure before the first paid link, use `rel="nofollow sponsored"`, keep privacy-notice destinations untagged, and verify the live destination.
- AdSense remains disabled unless the owner approves activation and account, consent, Global Privacy Control, density, and production requirements pass.
- The $17 Planning Pack has an approved source release for the exact private edition in its manifest. Public checkout and delivery remain fail-closed against all artifact, checksum, storage, Stripe, environment, owner, and delivery gates. The tracked public-history artifact is never eligible for paid private delivery.
- The $39 Designer Pattern Preflight remains inquiry-only by default. Checkout requires every documented provider, mode, database, migration, webhook, retention, notification, abuse-protection, fulfillment, URL, and owner-approval gate.
- The StitchProof report scope is $9 once per pattern project, including revisions and exports. No subscription or pattern upload. Free checking, preview, and recovery JSON remain free. New checkout stays disabled by default. Current provider and private-ledger evidence, not a return URL, local flag, imported backup, or guessed session ID, determines paid status.
- Closing new StitchProof sales must not revoke valid historical purchases. Never market the local flow as tamper-proof DRM or count owner, developer, household, synthetic, declined, or test-mode activity as demand or revenue.
- The $149/year and $299/year white-label descriptions are interest tests only, not subscriptions, checkout, tenant accounts, unbranded builds, provisioning, or promises of availability.
- Embeds remain free, branded, `noindex`, isolated from site chrome and monetization, and frameable only under the dedicated embed policy.

Use `docs/fibertools-deployment-environment.md`, `docs/fibertools-owner-activation-checklist.md`, approved manifests, and `docs/stitchproof-purchase-release.md` for exact current release requirements. Do not expose secret values. Do not open the protected distribution kit.

A build, URL, dashboard view, redirect, configured value, or READY deployment is not proof of checkout, provider readiness, delivery, customers, demand, or revenue.

## 6. Editorial truth and public output

Public copy, metadata, JSON-LD, feeds, sitemaps, `robots.txt`, `llms.txt`, and visible behavior must agree.

Do not claim unsupported expertise, credentials, consensus, popularity, leadership, universal availability, exact outcomes, demand, customers, conversions, sales, revenue, provider approval, testimonials, or endorsements.

The public About page intentionally identifies the owner and describes his real relationship to FiberTools. Preserve approved attribution. Never expose private contact, identity, tax, payment, account, or provider data.

- Change a review date only after reviewing the represented content and destinations.
- Use current primary sources for time-sensitive claims.
- Record sources and review dates for material external facts.
- Keep canonical routes and intentional redirects.
- Keep quarantined Markdown out of public output.
- Never publish generated facts as researched facts.

## 7. Architecture and implementation

Current stack:

- Next.js App Router
- React
- TypeScript and JavaScript
- Tailwind CSS and repository styles
- npm
- Node.js 24.x
- Vercel deployment from `main`

Primary paths:

- routes: `src/app`
- components: `src/components`
- deterministic logic: `src/lib`
- canonical data: `src/data`
- tests: `tests`
- scripts: `scripts`
- public assets: `public`

Rules:

- Make the smallest complete change that meets approved acceptance criteria.
- Reuse verified patterns before adding an abstraction.
- Do not refactor or clean unrelated code.
- Do not add or upgrade dependencies without clear need, risk review, and approved scope.
- Keep server credentials and provider calls out of client bundles.
- Keep browser-local calculator behavior browser-local.
- Validate untrusted input at the boundary.
- Preserve loading, empty, success, failure, and recovery states.
- Preserve mobile behavior and public server rendering where designed.
- Use existing components and design tokens before adding variants.
- Do not weaken a test, baseline, manifest, allowlist, gate, or review date merely to make work pass.

## 8. Privacy, security, accessibility, and analytics

Do not inspect or expose `.env*` values from real environment files. Reading `.env.example` as a fake-value inventory is allowed.

Never place credentials, calculator inputs, form contents, email addresses, payment data, provider payloads, recovery keys, purchase references, customer data, personal data, private artifacts, or free-form text in source, docs, tests, issues, pull requests, screenshots, reports, analytics, advertising, affiliate events, or logs.

Analytics must use fixed allowlisted event names and non-sensitive values. Recheck consent and Global Privacy Control before analytics, affiliate, or advertising sends. Newsletter, payment, delivery, and inquiry flows are separate disclosed server workflows.

Collect only what the feature needs. Preserve documented retention and deletion. Use synthetic data unless the owner authorizes a bounded production procedure.

Preserve the standard-page and embed security-header split.

- Standard pages retain `X-Frame-Options: SAMEORIGIN` and the standard CSP.
- `/embed/*` omits `X-Frame-Options`, uses the dedicated `frame-ancestors` policy, and returns `X-Robots-Tag: noindex, nofollow`.

Do not replace this design with blanket `DENY`. Do not weaken either policy without focused tests.

Sensitive server routes must preserve documented server-only execution, exact identity binding, bounded input, same-origin controls where required, abuse protection, payment idempotency, `no-store`, `no-referrer`, `noindex`, generic errors, no sensitive logging, and fail-closed behavior.

Preserve programmatic labels, keyboard access, visible focus, logical headings and landmarks, accessible control names, field-linked errors, result announcements, responsive reflow, target size, text alternatives, reduced motion, and plain-language limits. Do not rely on color alone or hide essential instructions in placeholders.

## 9. Parallel agents and efficient context

The parent agent owns the plan, task boundaries, file ownership, integration, evidence review, and final report.

Use no more than four concurrent subagents.

- Parallelize independent exploration, documentation review, privacy, security, accessibility, claims review, and post-integration verification.
- Give each implementation agent one bounded task with explicit acceptance criteria and exclusive file ownership.
- Never assign two writing agents to the same file or overlapping code path.
- Complete prerequisite tasks before dependent tasks.
- Use `ft_explorer`, `ft_implementer`, `ft_reviewer`, and `ft_verifier` for their named roles.
- Inspect subagent output before integration.
- Never let an implementation agent approve its own work.

Keep context efficient:

- search exact routes, symbols, tests, and references before opening broad files;
- read the smallest relevant ranges;
- load standards only when they apply;
- keep one durable spec and status record for long work;
- after resume or compaction, restore identity, active spec, scope, protected boundaries, and next action.

## 10. Validation

Run the smallest relevant test while iterating, then every release-appropriate gate.

Codex operating layer:

```bash
node --test tests/codex-operating-layer.test.mjs
```

Environment references:

```bash
npm run test:environment-docs
```

Content or publication:

```bash
npm run test:publication-freeze
npm run lint:content
npm run lint:predeploy
npm run test:search-traffic
npm run test:review-dates
```

Analytics, affiliates, consent, or monetization:

```bash
npm run test:affiliate
npm run test:gpc-consent
npm run test:revenue-path
npm run test:focus-revenue
npm run test:security
```

Formula changes must test units, rounding, bounds, empty and malformed input, extreme values, displayed explanations, page output, accessibility, and mobile behavior.

Payment, delivery, provider, or offer-readiness changes require the exact feature suites, readiness verifiers, environment parity, security, TypeScript, build, and documented protected provider procedure. Never perform a real charge, refund, migration, deletion, provider mutation, or customer delivery without separate authorization.

For full CI parity, run the current command sequence in `.github/workflows/empire-check.yml`, including `npm ci`, all listed tests, and `npm run build`. Run TypeScript directly when warranted:

```bash
npx tsc --noEmit --incremental false
```

The workflow, not a copied list, is the remote-check authority.

Never claim a command passed unless it ran to completion and the result was observed. Record skipped, blocked, timed-out, and untested checks.

## 11. Git, release, and evidence

Before commit:

1. Inspect `git diff --check`.
2. Inspect every changed file.
3. Confirm no unrelated file entered the diff.
4. Confirm no secret, environment value, private artifact, protected record, or generated paid product entered the diff.
5. Run focused and release-appropriate tests.
6. Run independent review for substantial or sensitive work.

A pull request must state the outcome, changed behavior, intentional exclusions, risks, exact tests and results, checks not run, approval boundaries, rollback or fail-closed behavior, and current release stage.

Do not merge, deploy, publish, change DNS, enable billing, activate a provider, create a real charge, send outreach, or modify production data without exact owner authorization.

Report each stage separately:

1. local change;
2. focused tests;
3. commit and pushed branch;
4. pull request and required checks;
5. merge;
6. deployment tied to the expected SHA;
7. direct production verification.

Never report a later stage from evidence that proves only an earlier stage.

Use `Verified`, `Inferred`, `Unknown`, `Blocked`, and `Not tested`. A scheduled monitor may describe an older deployment. A green build does not prove provider readiness, checkout, delivery, analytics, customers, demand, or revenue.

Do not invent test results, citations, review dates, approvals, credentials, provider readiness, deployment state, revenue, demand, conversion, customers, or outcomes.

## 12. Definition of done

A change is complete only when:

- identity and base SHA were verified;
- scope and acceptance criteria are explicit;
- implementation matches scope;
- focused regression coverage exists;
- privacy, security, accessibility, publication, claims, and commercial boundaries remain intact;
- every claimed check has observed evidence;
- risks and untested areas are stated;
- the branch and pull request contain no unrelated changes;
- independent review found no unresolved P0 or P1 issue;
- the exact release stage is reported.

Code complete does not mean merged, deployed, activated, delivered, or verified in production.

## Code Review Rules

Give the exact file, line or symbol, failure mode, impact, and narrowest safe correction.

### P0, block immediately

- Protected StitchProof records were accessed outside exact authorization.
- Secrets, private artifacts, personal data, payment data, calculator inputs, recovery credentials, provider payloads, or free-form text could be exposed.
- Checkout, ads, subscriptions, delivery, billing, DNS, publication, providers, or production behavior could activate without every fail-closed gate.
- Approval, provider readiness, production verification, customers, demand, or revenue is fabricated.
- The change risks data loss, unauthorized access, irreversible financial action, or a material legal or privacy breach.

### P1, block merge

- A formula, conversion, rounding rule, bound, public claim, review date, attribution, or JSON-LD statement lacks evidence or disagrees with behavior.
- The publication freeze or content quarantine is bypassed.
- Consent, Global Privacy Control, minimization, retention, or deletion regresses.
- Standard or embed security policy regresses.
- Payment identity, idempotency, current-state verification, private-ledger authorization, adverse-payment handling, or fail-closed behavior weakens.
- Keyboard, screen-reader, focus, mobile reflow, error association, or result-announcement behavior regresses.
- Changed behavior lacks focused regression coverage.
- An early stage is reported as proof of a later release or business outcome.

### P2, fix before readiness when material

- Error, loading, empty, or recovery states are incomplete.
- A new abstraction duplicates a verified pattern.
- Documentation, metadata, tests, or environment inventory no longer match behavior.
- The diff contains unrelated cleanup or avoidable dependency growth.
- Validation misses a meaningful edge case.
- Maintainability declines in a way likely to cause correctness, privacy, security, or accessibility defects.

Ignore style-only preferences unless they create a documented correctness, accessibility, security, privacy, performance, or maintainability problem.

## 13. Final prohibitions

Without exact owner authorization, do not:

- alter protected StitchProof state;
- modify `CLAUDE.md`, `EMPIRE_BUILD_STANDARDS.md`, or `.claude/settings.local.json`;
- inspect or expose `.env*` values, secrets, private artifacts, or unrelated production data;
- publish frozen content;
- change DNS;
- enable billing, ads, subscriptions, checkout, providers, or delivery;
- perform a real charge, refund, migration, deletion, outreach, merge, or deployment;
- weaken legal, privacy, accessibility, consent, affiliate, security, testing, or fail-closed protections;
- change a manifest, test, baseline, allowlist, review date, or owner record merely to make work pass;
- remove approved links or attribution because of an obsolete portfolio-wide rule;
- fabricate evidence.

Authorization for one exact action is not blanket authorization for related actions.
