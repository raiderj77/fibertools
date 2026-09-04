# FiberTools Codex Operating Standard

Repository: `raiderj77/fibertools`
Production branch: `main`
Platform: Vercel
Domains: `fibertools.app`, `www.fibertools.app`
Runtime: Node.js 24.x, npm

This file is the sole repository-wide operating authority for Codex. The owner's current instruction controls the task. Exact manifests, release records, environment contracts, source, tests, and current provider evidence control their bounded facts. If sources conflict on protected records, publication, privacy, security, payments, providers, deployment, production, or legal exposure, stop and report the conflict. Never silently choose the less restrictive interpretation.

Correctness, safety, accessibility, and complete evidence outrank speed and token savings.

## Start gate

Before editing:

1. Verify the Git root and canonical `origin`.
2. Fetch and record current `origin/main`.
3. Inspect the branch, worktree, recent relevant commits, overlapping pull requests, branch protection, and required checks.
4. Preserve unrelated owner work.
5. Use a clean branch or worktree based on current `origin/main`.
6. Define outcome, affected behavior, scope, exclusions, acceptance criteria, risks, rollback or fail-closed behavior, and validation.
7. Stop if identity, base SHA, scope, ownership, approval, protected boundaries, or irreversible effects remain unclear.

Never push directly to `main`.

## Product contract

FiberTools provides free, privacy-first, deterministic fiber-arts calculators and references.

Public calculators must:

- require no account or email;
- process project inputs in the browser unless a separate server workflow is disclosed;
- present results as planning aids, not guarantees;
- remain free when optional paid products exist;
- state assumptions, units, rounding, bounds, and limitations;
- preserve labels, keyboard use, visible focus, result announcements, and responsive reflow;
- keep calculator values and free-form text out of analytics, ads, affiliates, logs, and unrelated services.

Homepage jobs are: calculate yarn and materials; fix gauge, sizing, and stitch counts; plan crochet or knitting projects. Featured order is Blanket, Yarn, Circle, Amigurumi Shapes, and Cast-on. Sock Calculator is secondary. Keep other ready tools in the server-rendered directory.

Use US crochet terminology and Craft Yarn Council labels Lace (0) through Jumbo (7). Keep formulas deterministic, documented, unit-aware, bounded, explainable, and regression tested. Never place generated or unsourced facts in canonical data or public copy.

## Publication and truth

The publication freeze remains in force through November 20, 2026 unless an explicit owner-approved record authorizes the exact exception. The date alone does not lift it.

Before an explicit lift, do not add a new public calculator, general tool, article, guide, paid service, or major feature. Bug, security, legal, factual, accessibility, and broken-link repairs remain allowed.

`content/published` is quarantined unless both the application allowlist and an owner-approved publication record make an item public. A filename or `status: published` is not approval.

Do not create doorway pages, duplicate programmatic pages, generic AI articles, scraped content, link schemes, unsourced claims, fake review dates, or fabricated approval.

Preserve approved public owner attribution. Never expose private contact, identity, tax, payment, account, or provider data.

Visible copy, metadata, JSON-LD, feeds, sitemaps, `robots.txt`, `llms.txt`, redirects, and behavior must agree. Do not claim unsupported expertise, credentials, consensus, popularity, availability, outcomes, demand, customers, conversions, sales, revenue, provider approval, testimonials, or endorsements. Change a review date only after reviewing the represented content and destinations. Use current primary sources for material time-sensitive claims.

## Commercial boundaries

- Amazon links may use tag `ytearnings-20` only when helpful. Put disclosure before the first paid link, use `rel="nofollow sponsored"`, leave privacy-notice destinations untagged, and verify the destination.
- AdSense remains disabled until the owner approves activation and account, consent, Global Privacy Control, density, and production requirements pass.
- The $17 Planning Pack applies only to the exact checksum-bound private edition in its release record. Checkout and delivery fail closed unless artifact, checksum, private storage, Stripe, environment, owner, and delivery gates agree. Public-history artifacts are ineligible.
- The $39 Designer Pattern Preflight remains inquiry-only by default. Checkout requires every documented provider, database, migration, webhook, retention, notification, abuse, fulfillment, URL, and owner gate.
- StitchProof is $9 once per pattern project, including revisions and report exports. No subscription or pattern upload. Free checking, preview, and recovery JSON remain free. New checkout stays disabled by default. Paid status requires current provider and private-ledger evidence, never a return URL, local flag, imported backup, or guessed session.
- Closing new StitchProof sales must preserve valid historical purchases. Never call the local flow tamper-proof DRM or count owner, developer, household, synthetic, declined, or test activity as demand or revenue.
- The $149/year and $299/year white-label descriptions are interest tests only, not active subscriptions, checkout, tenants, builds, provisioning, or availability promises.
- Embeds remain free, branded, `noindex`, outside site chrome and monetization, and frameable only under the embed policy.

Before changing offers, environment references, payments, providers, delivery, recovery, databases, webhooks, retention, or activation, read every applicable exact record, including `docs/fibertools-deployment-environment.md`, `docs/fibertools-owner-activation-checklist.md`, `docs/stitchproof-purchase-release.md`, and the exact manifest, migration, source, and tests found through repository search.

Never open, summarize, modify, stage, or reinterpret `docs/stitchproof-distribution-kit.md` or protected StitchProof experiment, attribution, distribution, or outcome records without exact owner authorization.

A build, URL, dashboard, redirect, configured value, or READY deployment does not prove checkout, provider readiness, delivery, customers, demand, or revenue.

## Engineering rules

Stack: Next.js App Router under `src/app`, React, TypeScript and JavaScript, Tailwind CSS and repository styles, npm, Node.js 24.x, Vercel from `main`.

Key paths: `src/app`, `src/components`, `src/lib`, `src/data`, `tests`, `scripts`, `public`.

- Make the smallest complete change that meets acceptance criteria.
- Search exact paths, symbols, references, and tests before reading broadly.
- Reuse verified patterns. Avoid unrelated cleanup, refactors, renames, formatting, and dependencies.
- Keep calculator work browser-local and credentials or provider calls server-side.
- Validate untrusted input at boundaries.
- Preserve loading, empty, success, failure, timeout, and recovery states.
- Preserve mobile behavior and public server rendering where designed.
- Use existing components and design tokens before adding variants.
- Never weaken a test, baseline, manifest, allowlist, gate, review date, security control, or owner record to make work pass.

## Privacy, security, analytics, and accessibility

Do not inspect or expose real `.env*` values. `.env.example` is fake-value inventory only.

Never place credentials, environment values, calculator inputs, form contents, emails, payment data, provider payloads, recovery keys, purchase references, customer or personal data, private artifacts, or free-form text in source, docs, tests, issues, pull requests, screenshots, reports, analytics, ads, affiliate events, or logs.

Collect only what a disclosed feature needs. Preserve retention and deletion. Use synthetic data unless the owner authorizes a bounded production procedure.

Analytics must use fixed allowlisted events and non-sensitive values. Recheck consent and Global Privacy Control before analytics, affiliate, or advertising sends. Newsletter, payment, delivery, and inquiry flows are separate disclosed server workflows.

Preserve the security-header split:

- standard pages keep `X-Frame-Options: SAMEORIGIN` and the standard CSP;
- `/embed/*` omits `X-Frame-Options`, uses its `frame-ancestors` policy, and returns `X-Robots-Tag: noindex, nofollow`.

Do not replace the split with blanket `DENY` or weaken it without focused tests.

Sensitive server routes must preserve server-only execution, exact identity binding, bounded inputs, same-origin controls where required, durable abuse protection, payment idempotency, `no-store`, `no-referrer`, `noindex`, generic errors, no sensitive logging, and fail-closed behavior.

Preserve programmatic labels, keyboard access, visible focus, logical headings and landmarks, accessible names, field-linked errors, result announcements, responsive reflow, target size, text alternatives, reduced motion, and plain-language limits. Do not rely on color alone or hide essential instructions in placeholders.

## Workflow and agents

Classify work:

- Low risk: clear, narrow, reversible, with no material product, formula, data, claim, accessibility, privacy, security, commercial, publication, provider, deployment, or architecture impact.
- Medium risk: unfamiliar behavior, multi-file work, material user behavior, or meaningful regression potential.
- High risk: formulas, canonical data, public claims, structured data, accessibility, privacy, analytics, security, publication, payments, providers, delivery, databases, retention, StitchProof, deployment, production, or irreversible actions.

Use:

- direct work for clear low-risk corrections;
- `$ft-plan` for unclear, medium/high-risk, cross-cutting, multi-file, or multi-session work;
- `$ft-debug` when the failure or root cause is unproven;
- `$ft-run` to execute an approved `.codex/TASK.md`;
- `$ft-audit` for TRUTHMODE, progress, final review, or next actions.

For high-risk work, read this entire file plus every applicable exact feature, release, environment, source, and test record. Do not load unrelated documents.

A bug fix must reproduce the defect and add a failing regression test first when practical. Confirm it fails for the expected reason. If impractical, record why and define repeatable alternate proof. A disappearing symptom is not root-cause evidence.

Use one main agent normally. Spawn no more than two agents, excluding the primary. Use a read-only explorer only for independent mapping, `ft_reviewer` for substantial medium-risk work, and both `ft_reviewer` and `ft_verifier` for high-risk or final release-sensitive work. Never give writers overlapping files. The parent owns scope, file ownership, integration, and the final report. An implementer never approves its own work. Resolve reviewer and verifier disagreements against direct evidence.

Use one temporary `.codex/TASK.md` for work that must survive compaction or multiple turns. Keep it concise, link to paths instead of copying policy, preserve final evidence elsewhere, then delete it.

## Validation and release evidence

Run the smallest relevant test while iterating. Run each applicable broad suite once after stabilization. Repeat only after a relevant change or failure.

Treat `.github/workflows/empire-check.yml` as full CI authority. Core checks include:

```bash
node --test tests/codex-operating-layer.test.mjs
node --test tests/environment-docs.test.mjs
npx tsc --noEmit --incremental false
npm run build
```

Run only checks relevant to the task while iterating, then every applicable required workflow gate before promotion.

Formula changes test units, rounding, bounds, empty and malformed input, extremes, explanations, page output, accessibility, and mobile behavior. Content, publication, analytics, affiliate, payment, provider, delivery, security, and offer changes require their exact suites and records.

Never perform a real charge, refund, migration, deletion, provider mutation, customer delivery, production test, publication, DNS change, or user contact without separate exact owner authorization.

Never claim a command passed unless it completed and the result was observed. Record skipped, blocked, timed-out, flaky, and untested checks. Inspect the final diff for unrelated files, secrets, private products, artifacts, and protected records.

Before commit or promotion: inspect `git diff --check` and the complete diff; confirm scope; run required checks; complete required independent review and verification; record risks, untested areas, rollback, and owner-controlled next steps.

Report separately:

1. local change;
2. focused tests;
3. commit and pushed branch;
4. pull request and required checks;
5. merge;
6. deployment tied to the expected SHA;
7. direct production verification.

Never use an earlier stage as proof of a later stage. Use `Verified`, `Inferred`, `Unknown`, `Blocked`, and `Not tested`.

## Code Review Rules

Give the exact file, line or symbol, failure mode, impact, and narrow safe correction.

P0: block protected-record or secret exposure, personal or payment data exposure, data loss, unauthorized access, irreversible financial action, unapproved production or provider action, or fabricated approval, readiness, customers, demand, or revenue.

P1: block incorrect behavior, formulas, bounds, claims, dates, attribution, or structured data; publication bypass; privacy, consent, security, payment, or accessibility regression; missing material regression coverage; or false release-stage claims.

P2: report material recovery-state, documentation, performance, dependency, abstraction, edge-case, or maintainability risk. Ignore style-only preferences.

## Definition of done

Complete means repository identity and base were verified; scope, exclusions, acceptance criteria, risks, and validation are explicit; implementation matches scope; focused regression coverage exists; all applicable product, privacy, security, accessibility, publication, editorial, and commercial rules remain intact; claimed checks have evidence; required findings are resolved; the diff contains no unrelated work; residual risks and untested areas are stated; and the exact release stage and next owner action are clear.

Code complete does not mean merged, deployed, activated, delivered, or production-verified.
