# FiberTools Commercial and Release Policy

Load this file for affiliates, ads, offers, checkout, payments, providers, delivery, databases, retention, StitchProof, deployment, or production work. Also load `docs/codex/PRIVACY_SECURITY_ACCESSIBILITY.md` for any server, personal-data, payment, provider, delivery, or analytics path. The root `AGENTS.md` remains controlling. Exact manifests, environment contracts, migrations, release records, source, tests, and current provider evidence control bounded current facts.

## Current commercial boundaries

### Amazon

Amazon links may use tag `ytearnings-20` only when useful. Place a disclosure before the first paid link, use `rel="nofollow sponsored"`, keep privacy-notice destinations untagged, and verify the live destination.

### AdSense

AdSense remains disabled unless the owner approves activation and the current account, consent, Global Privacy Control, density, legal, security, and production requirements pass. Configuration or `ads.txt` does not authorize serving ads.

### Planning Pack

The $17 Planning Pack applies only to the exact checksum-bound private edition in its approved release record. Checkout and delivery fail closed unless the artifact, checksum, private storage, Stripe, environment, owner, and delivery gates agree. A tracked public-history artifact is never eligible for paid private delivery.

### Designer Pattern Preflight

The $39 Designer Pattern Preflight remains inquiry-only by default. Checkout requires every documented provider, mode, database, migration, webhook, retention, notification, abuse-protection, fulfillment, URL, security, and owner-approval gate.

### StitchProof

- StitchProof is $9 once per pattern project, including revisions and report exports.
- No subscription and no pattern upload.
- Free checking, preview, and recovery JSON remain free.
- New checkout stays disabled by default.
- Paid status requires current provider and private-ledger evidence. A return URL, local flag, imported backup, configured value, or guessed session or purchase ID never proves payment.
- Closing new sales must preserve valid historical purchases.
- Do not market the local flow as tamper-proof DRM.
- Never count owner, developer, household, synthetic, declined, refunded, duplicate, or test-mode activity as demand or revenue.

Never open, summarize, modify, stage, or reinterpret `docs/stitchproof-distribution-kit.md` or protected StitchProof experiment, attribution, distribution, or outcome records without exact owner authorization.

### White-label and embeds

The $149/year and $299/year white-label descriptions are interest tests only. They are not active subscriptions, checkout, tenant accounts, unbranded builds, provisioning, or promises of availability.

Embeds remain free, branded, `noindex`, isolated from site chrome and monetization, and frameable only under the dedicated embed security policy.

## Required records

Before changing an offer, environment reference, payment, provider, delivery, recovery, database, webhook, retention, activation, deployment, or production path, search and read every applicable exact record. This includes, when relevant:

- `docs/fibertools-deployment-environment.md`
- `docs/fibertools-owner-activation-checklist.md`
- `docs/stitchproof-purchase-release.md`
- exact product manifests and checksums
- exact database migrations and SQL contracts
- exact provider and webhook source
- exact readiness verifiers and focused tests
- current branch protection, required checks, provider mode, and deployment evidence

Do not assume this list is complete. Search references before editing. If current records disagree, stop and report the conflict.

## Fail-closed rules

- Keep secrets and provider calls server-side.
- Bind payment and delivery to the exact current identity, product, amount, currency, mode, artifact, and authorization record.
- Preserve idempotency, adverse-payment handling, webhook verification, duplicate prevention, current-state checks, retention, deletion, recovery, and generic public errors.
- Do not enable a public path when an artifact, checksum, environment value, migration, provider, webhook, database, storage, email, fulfillment, abuse-control, or owner gate is missing, stale, ambiguous, or contradictory.
- Do not replace durable provider or ledger evidence with browser state, query parameters, cookies, local storage, or user-entered identifiers.
- Do not send a real charge, refund, email, report, artifact, or provider mutation during ordinary testing.
- Never modify production data, DNS, billing, providers, checkout, delivery, or deployment without exact owner authorization for that action.

## Release evidence

Track these as separate stages:

1. local change;
2. focused tests;
3. commit and pushed branch;
4. pull request and required checks;
5. merge;
6. deployment tied to the expected commit SHA;
7. direct production verification;
8. separately authorized payment, provider, delivery, or customer-path verification.

A build, preview, URL, dashboard, redirect, configured value, or READY deployment does not prove checkout, provider readiness, delivery, customers, demand, or revenue.

## Required checks

Use focused tests while iterating. Before promotion, run every applicable current script and required workflow. Common checks include:

```bash
npm run test:affiliate
npm run test:gpc-consent
npm run test:pattern-checker
npm run test:stitchproof-purchase
npm run test:designer-preflight
npm run test:stitchproof-distribution
npm run test:focus-revenue
npm run test:revenue-path
npm run test:offer-readiness
npm run test:planning-pack-delivery
npm run verify:planning-pack-readiness
npm run verify:designer-preflight-readiness
npm run test:environment-docs
npm run test:security
npx tsc --noEmit --incremental false
npm run build
```

Run only the suites applicable to the change, then every required pull-request check. Provider and production verification require a separately approved safe procedure. The current `package.json`, exact feature records, and `.github/workflows/empire-check.yml` are the command authorities.
