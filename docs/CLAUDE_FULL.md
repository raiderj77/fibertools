# FiberTools repository instructions

> Current operating source of truth. Last verified: 2026-08-25.

## Repository identity gate

Before changing anything, verify all of the following:

- repository root: `C:\Users\jason\Documents\fibertools` or an explicitly created FiberTools worktree;
- remote: `https://github.com/raiderj77/fibertools.git`;
- default and production branch: `main`;
- intended base SHA is the current fetched `origin/main`;
- `git status --short --branch` has been reviewed and unrelated owner changes will be preserved.

Do not work from a similarly named repository or assume that a successful homepage response identifies the source checkout or deployed commit.

`docs/stitchproof-distribution-kit.md` and all StitchProof experiment, attribution, and outcome state are protected owner records. Do not open, modify, stage, summarize, or reinterpret them unless the owner explicitly authorizes that exact work.

## Product contract

FiberTools is a privacy-first collection of free, deterministic fiber-arts calculators and references. Public self-service calculators:

- require no account or email address;
- process project inputs in the browser unless a page explicitly says otherwise;
- show calculations as planning aids, not guaranteed project outcomes;
- remain free, including when optional paid products or services are offered;
- preserve accessible labels, keyboard operation, visible focus, responsive reflow, and clear limitations.

The homepage organizes visitors around three jobs:

1. calculate yarn and materials;
2. fix gauge, sizing, and stitch counts;
3. plan a crochet or knitting project.

The featured calculator order is Blanket, Yarn, Circle, Amigurumi Shapes, and Cast-on. Sock Calculator is the secondary featured tool. Keep the remaining ready tools available through the server-rendered directory.

## Current commercial boundaries

- Amazon product links may use Associates tag `ytearnings-20` only when the destination genuinely helps the task. Put a clear affiliate disclosure before the first paid link, use `rel="nofollow sponsored"`, and keep privacy-notice destinations untagged.
- AdSense is disabled unless `NEXT_PUBLIC_ADSENSE_ENABLED=true` and a valid public publisher ID is deliberately configured. Do not infer approval from source configuration.
- The $17 Fiber Project Planning Pack checkout is disabled. Its public-history artifact is not an approved private sellable revision. Do not enable its link until the owner confirms a new private delivery source and separately approves activation.
- Designer Pattern Preflight is a $39 bounded pilot and is inquiry-only by default. Missing, invalid, or mismatched provider configuration must fail closed to inquiry.
- The $149/year and $299/year white-label descriptions are interest tests only. They are not active subscriptions, checkout offers, tenant provisioning, or promises of availability.
- Embeds remain free, branded, `noindex`, isolated from site chrome and monetization, and frameable only under the dedicated embed security policy.

Never invent revenue, demand, conversion, customer, affiliate-performance, delivery, inventory, approval, or provider-readiness claims.

## Publication freeze

No new public calculator, general tool, article, guide, paid service, or major feature before November 20, 2026 unless an explicit owner-approved publication record exists. Bug fixes, security fixes, legal corrections, factual corrections, and broken-link repairs remain permitted.

Markdown under `content/published` is quarantined unless the application allowlist and an explicit owner-approved publication record make it public. Do not treat a filename or `status: published` front matter as approval. Do not create doorway pages, duplicate programmatic pages, generic AI articles, scraped content, link schemes, or unsourced fiber-arts claims.

## Identity and editorial truth

The current public About page intentionally identifies FiberTools' owner and describes his actual relationship to the project. Personal-name publication is not categorically prohibited. Preserve intentional, owner-approved attribution, but never expose private contact, identity, payment, tax, account, or provider data.

Do not claim 30+ years of fiber-arts expertise, professional fiber-arts credentials, instructor consensus, popularity, universal availability, exact project outcomes, or other credentials or superlatives without directly verifiable evidence. Visible claims and JSON-LD must agree. A review date may change only when the represented content or destinations were actually reviewed.

Use US crochet terminology and Craft Yarn Council weight labels Lace (0) through Jumbo (7). Keep formulas deterministic, documented, accessible, and covered by focused regression tests.

## Technology and route behavior

- Framework: Next.js App Router under `src/app`.
- Language: TypeScript and JavaScript.
- Styling: Tailwind CSS and repository styles.
- Package manager: npm.
- Deployment: Vercel from `main`.
- Standard pages use `X-Frame-Options: SAMEORIGIN` plus the standard CSP.
- `/embed/*` routes omit `X-Frame-Options`, use a dedicated `frame-ancestors` CSP, and return `X-Robots-Tag: noindex, nofollow`.
- `/blog/*` is redirected to current tool or guide destinations; quarantined Markdown is not a public blog.

Do not replace the intentional standard/embed header split with a blanket `DENY` rule. Do not weaken either policy without focused security and embed tests.

## Privacy and analytics

- Never place calculator inputs, form contents, email addresses, provider payloads, credentials, or free-form user text in analytics or reports.
- New analytics must use fixed allowlisted event names and non-sensitive values.
- Recheck consent and Global Privacy Control before affiliate or analytics sends.
- Newsletter and paid-service flows are separate disclosed server workflows; do not describe every site interaction as browser-only.
- Collect only what a feature needs, retain it only for the documented period, and preserve deletion/retention operations.

## Environment and owner operations

The canonical environment inventory, safe defaults, activation gates, and release procedure are in `docs/fibertools-deployment-environment.md`. `.env.example` must contain fake placeholders only. Every active application or offer environment reference must appear in both places and is enforced by `tests/environment-docs.test.mjs`.

Never copy provider values into source, documentation, tests, terminal reports, issues, or pull requests. Do not inspect or expose `.env*` values. Configuration being present is not proof that the provider, webhook, database migration, retention operation, or fulfillment path is production-ready.

## Release procedure

Use an isolated clean worktree based on fetched `origin/main`. Keep a change narrowly scoped, add focused tests, and run the relevant gates. The minimum documentation/environment gate is:

```bash
node --test tests/environment-docs.test.mjs
```

For application work, also run the affected focused suite, TypeScript, security/quality/content checks, and `npm run build`. Use `docs/fibertools-owner-activation-checklist.md` before any offer activation.

Keep these stages distinct in reports:

1. local change;
2. focused tests;
3. commit and pushed branch;
4. pull request and required checks;
5. merge;
6. production deployment tied to the expected SHA;
7. direct production verification.

A green scheduled production monitor does not prove that a newer source commit builds. A READY deployment does not prove checkout, fulfillment, webhook, analytics, or customer outcomes. Report verified, inferred, and unknown states separately.

Do not push directly to `main`. Branch protection and required GitHub checks are owner-controlled safeguards and should remain enabled once configured.

## Protected and prohibited actions

Without explicit owner authorization, do not:

- alter StitchProof protected state;
- merge, deploy, publish, send outreach, change DNS, spend money, or enable billing;
- activate checkout, ads, subscriptions, provider accounts, or customer delivery;
- fabricate credentials, citations, standards, test results, dates, testimonials, or endorsements;
- remove legal, accessibility, privacy, consent, security, or affiliate-disclosure protections;
- add mandatory sister-site links or remove links merely to satisfy an obsolete portfolio rule.

Preserve unrelated local changes and never stage files outside the approved scope.
