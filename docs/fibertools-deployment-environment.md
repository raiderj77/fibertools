# FiberTools deployment and environment contract

Last verified: 2026-08-25 (America/Los_Angeles).

This document records the source/deployment identity, safe configuration defaults, offer gates, and release evidence required to operate FiberTools without exposing credentials or accidentally enabling a commercial flow.

## Repository and production identity

- Canonical repository: `raiderj77/fibertools`
- Remote: `https://github.com/raiderj77/fibertools.git`
- Default and production branch: `main`
- Production platform: Vercel
- Production domains: `fibertools.app` and `www.fibertools.app`

Always fetch first and compare the intended worktree base with `origin/main`. A local directory name, reachable domain, or READY deployment does not establish repository identity by itself.

### Verified release snapshot

The following is a dated record, not a promise about future state:

- PR #40, **Focus FiberTools traffic and revenue paths**, merged as `691f9dfd9453c68ae36d7e8780b8f1daa3b0771d`.
- PR #41, **fix: label project cost calculator controls**, merged as `791b10d1ca960695b03496831040e43ea6505974`.
- PR #42, **Fix stale Amazon product link and restore release build**, merged as `e67c27714f5353b14e6ae13f6b1291f677fdbaf3`.
- Vercel deployment `dpl_EbDxqPo6occUQtSYv4J9aQ1Qm174` was READY for production from commit `e67c27714f5353b14e6ae13f6b1291f677fdbaf3` and held the production aliases.
- Direct checks returned 200 for the live homepage and the two #42 buyer pages. The two pages used tagged Amazon search destinations and no longer contained retired ASIN `B0CBPXTSB8`.
- Main's checks were green after #42. The prior direct-main article commit had failed the duplicate-slug content gate; a green live revenue monitor during that failure described the older live deployment, not source deployability.

Production readiness remains narrower than offer readiness. This snapshot does not verify live purchase success, delivery, webhook behavior, provider credentials, database migration state, retention execution, rate limiting, customer activity, or revenue.

## Environment inventory

`.env.example` is the canonical fake-value template. Values containing `replace_me`, `example.invalid`, the all-zero publisher ID, or an example Supabase project are placeholders. Never put real values in source, documentation, test fixtures, terminal reports, issues, or pull requests.

| Variable | Exposure | Safe default or purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Local application origin. Designer Preflight also requires an HTTPS production value, with local HTTP allowed only for localhost. |
| `FIBERTOOLS_BASE_URL` | Process-only check input | Base URL used by the revenue-path checker; it does not activate a feature. |
| `BEEHIIV_API_KEY` | Server-only | Optional newsletter API credential. Missing configuration must fail without collecting more data. |
| `BEEHIIV_PUBLICATION_ID` | Server-only | Optional newsletter publication identifier. |
| `RAVELRY_API_USERNAME` | Server-only | Optional Ravelry pattern-lookup credential. |
| `RAVELRY_API_PASSWORD` | Server-only | Optional Ravelry pattern-lookup credential. |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | Public | Keep `false` unless the owner separately approves ads and consent readiness. |
| `NEXT_PUBLIC_ADSENSE_ID` | Public | Public publisher identifier used only when ads are enabled. The example value is fake. |
| `INDEXNOW_API_KEY` | Server-only optional placeholder | Retained in the release contract for operator parity. Current application code does not read it; do not infer that a provider credential is configured. |
| `PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED` | Server-only owner gate | Keep `false` or unset until a paid non-customer session has successfully returned the exact expected bytes and checksum through the protected delivery route. |
| `PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED` | Server-only upload gate | Set `true` only after the exact object name, MIME type, expected size, and non-public bucket have been verified in the approved storage provider. This records upload placement, not successful delivery or checksum retrieval. |
| `PLANNING_PACK_OWNER_APPROVAL_CONFIRMED` | Server-only owner gate | Keep `false` or unset until the owner records explicit activation approval after every delivery and customer-operations prerequisite. |
| `PLANNING_PACK_EDITION_ID` | Server-only artifact binding | Must equal the approved public release manifest edition ID. The example is deliberately non-ready. |
| `PLANNING_PACK_PRIVATE_FILE_SHA256` | Server-only artifact binding | Must equal the lowercase SHA-256 in the release manifest. The example is a non-ready placeholder. |
| `FIBERTOOLS_STRIPE_ACCOUNT_ID` | Server-only provider binding | Must equal the code-bound public canonical FiberTools account ID. The endpoint retrieves the current account represented by the configured key and fails closed unless both values match the canonical binding. This is an account identifier, never a secret key. |
| `PLANNING_PACK_STRIPE_PAYMENT_LINK_ID` | Server-only offer binding | Exact Stripe Payment Link ID expected on the paid Checkout Session. The fake example is rejected. |
| `PLANNING_PACK_STRIPE_PAYMENT_LINK_URL` | Server-only offer binding | Exact `buy.stripe.com` URL returned only by the verified first-party checkout gate. It must match the Payment Link retrieved from the intended Stripe account. |
| `PLANNING_PACK_STRIPE_PRICE_ID` | Server-only offer binding | Exact one-time Stripe Price ID expected on the sole Checkout line item. The fake example is rejected. |
| `PLANNING_PACK_STORAGE_BUCKET` | Server-only delivery binding | Exact private Supabase Storage bucket containing the approved artifact. A public bucket is not acceptable. |
| `PLANNING_PACK_STORAGE_OBJECT_PATH` | Server-only delivery binding | Exact private PDF object path. Client input never selects or changes this path. |
| `DESIGNER_PREFLIGHT_ACTION_MODE` | Server-only action gate | Keep `inquiry`; only exact `checkout` requests activation and all provider checks must still pass. |
| `DESIGNER_PREFLIGHT_INQUIRY_URL` | Server-only rendering input | Optional HTTPS or `mailto:` destination. Invalid input falls back to the public FiberTools inquiry address. |
| `DESIGNER_PREFLIGHT_OPS_APPLY_CONFIRM` | Server-only mutation confirmation | Do not pre-populate with the watchdog's required confirmation. Set only for one explicitly authorized operation. |
| `PREFLIGHT_RETENTION_BATCH_SIZE` | Server-only operations input | Positive integer batch size; current default is 100. |
| `DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION` | Server-only activation evidence | Exact owner-verified production migration version; keep `not_configured` until verified. |
| `DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED` | Server-only activation evidence | Keep `false` until required production database functions are verified. |
| `DESIGNER_PREFLIGHT_DB_TABLES_CONFIRMED` | Server-only activation evidence | Keep `false` until required production tables are verified. |
| `DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED` | Server-only activation evidence | Keep `false` until the retention schema and authorized deletion path are verified. |
| `DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED` | Server-only activation evidence | Keep `false` until the outbox schema is verified in the intended production project. |
| `DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED` | Server-only activation evidence | Keep `false` until verified, then set the exact comma-separated eight-event list printed in the Preflight operations contract. Boolean `true`, missing events, duplicates, and extra events remain non-ready. |
| `DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED` | Server-only activation evidence | Keep `false` until non-customer notification delivery and failure handling are verified. |
| `DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER` | Server-only activation evidence | One of `SUPABASE_DURABLE_LIMIT`, `VERCEL_WAF`, `OTHER_VERIFIED_PROVIDER`, or `UNVERIFIED`; keep `UNVERIFIED` until evidence exists. |
| `DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED` | Server-only activation evidence | Keep `false` until application/provider rate limiting and bot protection are directly verified. |
| `DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED` | Server-only activation evidence | Keep `false` until the owner verifies capacity and operating responsibility for the bounded pilot. |
| `STRIPE_MODE` | Server-only | `test` or `live`; the key prefix must match. Presence alone is not provider verification. |
| `STRIPE_SECRET_KEY` | Server-only secret | Mode-matched restricted or secret Stripe key. Never expose or inspect in reports. |
| `STRIPE_WEBHOOK_SECRET` | Server-only secret | Endpoint signing secret beginning with `whsec_`. Presence does not prove event delivery. |
| `SUPABASE_URL` | Server-only provider URL | HTTPS project URL used by the Preflight service. |
| `SUPABASE_SECRET_KEY` | Server-only secret | Server credential used by the Preflight service and operations. |

`NODE_ENV` is supplied by the runtime and is intentionally not copied into `.env.example`. `INDEXNOW_API_KEY` is retained only because the owner-supplied completion contract requires it; the current application does not read it, so no active provider credential should be inferred.

Run the parity contract after adding, removing, or renaming an environment reference:

```bash
node --test tests/environment-docs.test.mjs
```

The test discovers active `process.env` references under `src` and `scripts`, including named requirement arrays, and fails when a non-runtime variable is absent from either `.env.example` or this document.

## Offer activation gates

### Fiber Project Planning Pack

Current state: **source release owner-approved and enabled; production availability remains runtime-gated**.

All of these environment values are necessary but not sufficient:

- `PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED=true`
- `PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED=true`
- `PLANNING_PACK_OWNER_APPROVAL_CONFIRMED=true`
- `PLANNING_PACK_EDITION_ID=FT-PP-V2-2026-08-25`
- `PLANNING_PACK_PRIVATE_FILE_SHA256=<exact manifest checksum>`
- `FIBERTOOLS_STRIPE_ACCOUNT_ID=<verified account ID>`
- `PLANNING_PACK_STRIPE_PAYMENT_LINK_ID=<exact Payment Link ID>`
- `PLANNING_PACK_STRIPE_PAYMENT_LINK_URL=<exact buy.stripe.com URL>`
- `PLANNING_PACK_STRIPE_PRICE_ID=<exact one-time Price ID>`
- `PLANNING_PACK_STORAGE_BUCKET=<exact private bucket>`
- `PLANNING_PACK_STORAGE_OBJECT_PATH=<exact private PDF object path>`
- mode-matched `STRIPE_MODE` and `STRIPE_SECRET_KEY`
- verified `SUPABASE_URL` and `SUPABASE_SECRET_KEY`

Edition `FT-PP-V2-2026-08-25` was generated and validated outside Git. Its exact private object and non-public bucket were verified, and a protected non-customer paid-session retrieval returned the manifest-bound byte count and checksum. The owner approved the existing customer-operations scope and production activation for that exact edition and checksum on `2026-08-26T15:14:43.614Z`. The release manifest therefore records enabled release and checkout states plus confirmed delivery and owner approval. These source records do not bypass the request-time environment and provider gates. The public-history PDF is not an approved private product.

`GET /api/planning-pack/checkout` is the only public checkout destination. Before redirecting, it retrieves the configured Stripe account and Payment Link and requires the exact account, live/test mode, active link, `buy.stripe.com` URL, immediate card payments only, one-time USD $17 Price, fixed quantity one, disabled promotion codes, release metadata, and after-completion return URL. `GET /api/planning-pack/download?session_id={CHECKOUT_SESSION_ID}` independently verifies the account and exact paid Checkout Session, permits verified applicable tax without permitting a lower base price or discount, retrieves only the configured object from a non-public Supabase bucket, and rechecks its exact byte size and SHA-256 before returning it as a PDF attachment. Public checkout and the Buy action remain unavailable while any release, delivery-confirmation, owner-approval, activation, provider, or artifact gate is absent. Fulfillment for an exact already-paid session can remain available while sales are disabled, but only after the private-upload gate and every immutable provider, purchase, storage, byte-size, and checksum check pass. Responses are non-cacheable, no-referrer, and noindex; application code does not log the session ID or provider payload. Configuration and a successful build are not provider or delivery verification.

### Designer Pattern Preflight

Current state: **inquiry-only**.

Checkout requires exact `DESIGNER_PREFLIGHT_ACTION_MODE=checkout`, every provider variable in the inventory, a Stripe key whose test/live prefix matches `STRIPE_MODE`, an endpoint signing secret, HTTPS production URLs, the exact verified migration version and webhook event list, and every activation confirmation above. Runtime availability and the readiness verifier use the same environment contract. Any missing, false, documented placeholder, reserved example destination, or invalid value fails closed to inquiry.

Provider readiness, migration state, webhook delivery, retention operations, rate limiting/bot protection, fulfillment capacity, and one owner-authorized disposable live purchase/refund must be verified separately. Never use customer data for an activation test.

### White-label embeds

Current state: **interest-only**.

The displayed annual prices measure interest. Do not create checkout, contracts, tenants, unbranded builds, billing, provisioning, or availability promises without a new owner-approved scope and publication record.

## Release procedure

1. Fetch the correct remote and create an isolated worktree from exact `origin/main`.
2. Review branch, SHA, remote, worktrees, and dirty state. Preserve unrelated changes and the protected StitchProof record.
3. Make the smallest scoped change and add focused regression coverage.
4. Run the relevant focused tests, documentation parity, TypeScript, quality, security, content/predeploy checks, and production build.
5. Open a narrow pull request. Do not push directly to `main`.
6. Require the GitHub build/quality check before merge. Branch protection is an owner-controlled repository setting.
7. After an authorized merge, match the READY production deployment to the expected commit and aliases.
8. Verify the changed routes directly on desktop and mobile. For commercial paths, verify disclosures and fail-closed state without submitting personal data or creating a charge unless separately authorized.
9. Report source, checks, merge, deployment, route behavior, provider state, and business outcomes as separate evidence.

The Vercel build observed on the 2026-08-25 snapshot selected Node 24 because the package engine was broad while GitHub CI used Node 20. Aligning the production runtime with CI remains a release-hardening action. Module-type warnings for the JavaScript lint scripts were non-blocking but remain maintenance work.

## Publication freeze and November decision

No new public calculator, general tool, article, guide, paid service, or major feature before November 20, 2026 unless an explicit owner-approved publication record exists. Bug fixes, security fixes, legal corrections, factual corrections, and broken-link repairs remain permitted.

November 20, 2026 is the next decision date for reconsidering the freeze. Reconsideration is not automatic approval: review verified qualified traffic, repeat use, consented offer events, affiliate results, support load, provider readiness, privacy risk, and operating capacity before recording an owner decision.

## Remaining owner actions

- Enable branch protection for `main` and require the build/quality gate.
- Decide whether to align the Vercel Node runtime with CI.
- Configure the exact approved Planning Pack production bindings and attestations, then verify the resulting production checkout and delivery routes against the deployed SHA without exposing provider values.
- Keep Designer Pattern Preflight inquiry-only until every provider, abuse-protection, retention, fulfillment, and disposable-live-test gate is verified.
- Keep white-label offers interest-only until the owner approves a product, contract, billing, and provisioning scope.
- Revisit the publication freeze on November 20, 2026 using verified evidence rather than assumed demand or revenue.
