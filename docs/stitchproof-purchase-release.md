# StitchProof project purchase: release and recovery

Implementation scope approved by the owner on 2026-08-26: **$9 per pattern project, including revisions and report exports; no subscription, no pattern uploads, and the existing free checker unchanged.** This record describes implementation and release requirements, not production readiness, demand, or revenue. It does not replace or modify protected StitchProof experiment or distribution records.

## Product boundary

- The free 20-round checker and deterministic parser are unchanged.
- The Designer workspace keeps its free on-screen analysis and report preview for up to 200 rounds.
- One project purchase covers that project's professional print/PDF and CSV exports, including later revisions. JSON draft/recovery backup remains available without payment, including while pattern math is invalid.
- A new unrelated pattern requires a new project purchase. The reference identifies a local project; FiberTools cannot inspect or enforce its semantic content without violating the no-upload boundary. Do not market the local interface as DRM.
- No subscription, account, cloud pattern storage, automatic pattern upload, or new parser claims are introduced.
- Paid access has no implementation-imposed expiry. Provider availability and online payment verification are still required for a new paid export. Saved output remains usable offline.

## Recovery and data minimization

A cryptographically random project ID and recovery key are generated locally. The key is kept in browser memory until the visitor explicitly downloads a private recovery backup or saves the project on the device. Before checkout, the visitor downloads a backup and acknowledges keeping it privately. Checkout opens in a separate tab so the original unsaved workspace remains available.

The random project ID and recovery key cross the first-party payment API boundary. The separately approved Managed Payments review path adds one selected country code only to new-checkout requests; access verification remains two-field. The server stores a hash of the key, payment references, processing state and the immutable managed country/policy/tax-code contract in private purchase records. It does not store the raw key, billing address, pattern, title, nickname, corrections, notes, calculated stitch values, or report. Stripe receives opaque purchase references and that managed contract, not local project contents. Browser analytics exclude purchase references, keys and the country selection. The country is not part of a browser draft or recovery backup.

The prepayment backup can later resolve the same purchase through the private ledger, including if Stripe completed payment but the return tab never loaded. Importing a backup never establishes paid status by itself. Edits and revisions preserve the same identity; explicitly starting another project replaces the identity only after a warning, without deleting any saved project. Existing single-slot device-save replacement and restore warnings must remain in place.

If both local storage and the recovery backup are lost, automatic recovery is unavailable. Support must verify the Stripe receipt and ownership before any manual remedy; never ask the purchaser to send a pattern, exported project, or recovery key. Do not promise automatic email recovery or issue replacement access from an unverified email.

## Financial and security checks

- Use only FiberTools Stripe account `acct_1U5HWnD2Of3MIt94`. Never operate on the Your Friendly Developer account.
- Keep the $17 Planning Pack and $39 manual Preflight integrations independent.
- New Checkout must use the exact approved active one-time USD 900-cent base Price, quantity one and fixed first-party return destinations. The legacy offer is card-only with localization disabled. The separately approved managed review path has additional [provider-controlled currency, method and country gates](stitchproof-managed-payments-review.md). Owner tax configuration is a separate verification gate; do not infer tax registration or classification.
- Reserve an opaque purchase attempt durably before Stripe creation. Reuse the same idempotency key on retries; timeouts must never silently create a new payable attempt. Unresolved old attempts require reconciliation.
- Verify current Stripe payment state, including refunds and disputes, before paid exports. Do not authorize from an old webhook event, a success URL, a local flag, or a guessed session ID.
- Dedicated signed webhook handling must be idempotent, mode/account scoped, and resilient to out-of-order events. Do not repurpose customer-pattern submission records.
- APIs must bound input, accept only the exact credential fields (plus the approved country code for managed checkout), enforce same-origin browser requests, return generic errors, and use no-store/no-referrer/noindex headers. Credentials and provider payloads must not be logged.
- Private tables and privileged functions must deny anonymous/authenticated access. Durable abuse protection must be verified before enabling public checkout.
- Closing new sales must not, by itself, revoke valid historical purchases. Turning off an offer is not a refund.

The payment design follows Stripe's [idempotent fulfillment and webhook guidance](https://docs.stripe.com/checkout/fulfillment). A Charge's `disputed` flag describes dispute history, not the current outcome; reconcile the exact payment's current [dispute status](https://docs.stripe.com/api/disputes/object) rather than treating the flag alone as permanent revocation. A partial refund must not be mistaken for no refund merely because the Charge's `refunded` boolean is false.

### Provider contract to verify before activation

For the legacy offer, the active Stripe Product must carry `service=stitchproof_designer_project` and `offer_version=STITCHPROOF-PROJECT-V1` metadata. Its exact active Price must be one-time USD 900 cents and match the configured Product/Price IDs and owner-confirmed tax behavior. The application creates project-bound Checkout Sessions; a reusable Payment Link is not a substitute for this binding. Legacy currency conversion, quantity adjustment, promotions, phone collection, and Stripe-generated recovery checkouts are explicitly disabled. Do not reuse this legacy verifier/configuration as proof of Managed Payments readiness; that path uses `STITCHPROOF-PROJECT-MANAGED-V1` and the separate review handoff.

Use the dedicated `/api/stitchproof/webhook` endpoint and signing secret. Its handled events are `checkout.session.completed`, `checkout.session.expired`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`, `refund.created`, `refund.updated`, `refund.failed`, `charge.dispute.created`, `charge.dispute.updated`, and `charge.dispute.closed`. Signed delivery and reconciliation must be demonstrated, not inferred from an event subscription.

Tax mode remains `unconfigured` until the owner verifies it. If automatic tax is selected, the protected provider test must exercise the chosen [inclusive or exclusive tax behavior](https://docs.stripe.com/tax/products-prices-tax-codes-tax-behavior), including a non-zero tax calculation where applicable. Synthetic tax fixtures are not proof of the live Checkout response or the business's tax obligations.

## Local verification recorded on 2026-08-26

- Full repository test run: **431 passed, zero failed or skipped**, including **117 purchase tests**. Independent adversarial tests cover payment binding, current refunds/disputes, stale responses, duplicate attempts, and database authorization. The executable PostgreSQL tests use PGlite, not the production Supabase project.
- Lint, TypeScript, quality, security, affiliate, content, predeploy, production build, and built-page checks passed. The read-only live revenue-path check passed on all 15 existing monetized pages; this is link/disclosure evidence, not affiliate sales or checkout-fulfillment evidence.
- A browser run with a loopback-only synthetic provider verified prepayment recovery JSON download, unpaid export blocking, paid CSV download, renewed verification before export, outage blocking, and explicit device restore followed by verification while new sales were closed. The downloaded CSV contained the expected 18-versus-17 stitch mismatch and omitted instruction excerpts by default. No real Stripe checkout was followed or paid.
- The final production build was checked locally on desktop and mobile. The free report identified the same four-round synthetic example accurately; a return query did not unlock exports, checkout stayed unavailable with missing configuration, the mobile payment anchor cleared the sticky header, and the page had no horizontal overflow. API responses retained no-store/no-referrer/noindex headers; the production page CSP did not require `unsafe-eval`.
- Browser-native print/PDF output, cross-device browser file-picker restore, real Stripe delivery, production role permissions, provider abuse controls, and live tax configuration remain unverified. Unit-tested recovery parsing and a successful local CSV download do not replace those release checks.
- The free checker/parser, Designer math core, protected distribution kit, Planning Pack manifest/delivery code, and existing Stripe webhook were not changed. Synthetic and owner activity must not be counted as demand or revenue.

## Release checklist

All entries below remain required even when local checks pass:

1. Review the narrowly scoped PR and its tests; preserve unrelated owner work. Record approval before merge and production activation.
2. Verify the exact FiberTools Stripe account, mode, active Product/Price, tax configuration, and permitted card-only Checkout parameters without exposing credentials.
3. Apply and verify the dedicated private purchase migration in the intended Supabase project under explicit production-change authority. Verify tables, functions, role isolation, duplicate handling, and recovery without inspecting unrelated customer records.
4. Configure the dedicated StitchProof webhook and server-only environment bindings. Verify signed event delivery, duplicates, expiry, and adverse-payment reconciliation. Do not change the existing Planning Pack or manual Preflight webhook configuration.
5. Verify durable bot/rate protection and private operational logging. Configuration values or owner attestations alone are not evidence that these controls ran successfully.
6. Run a protected **non-customer** test of payment confirmation, project recovery, report/CSV export, and failure paths. Use injected/local providers or Stripe test mode first. Do not create a real charge or refund without a new, explicit authorization.
7. Verify wrong mode/account/price, unpaid/expired payment, partial/full refunds, disputes, duplicate delivery, stale responses after project switching, missing recovery, and provider outage behavior.
8. Only after those checks and release approval, enable new sales, deploy the exact approved SHA, and verify the production journey on desktop and mobile. A READY deployment or a reachable checkout page is not fulfillment evidence.
9. Report code, PR, deployment, payment availability, protected test results, and real revenue separately. Owner, developer, household, declined, synthetic, and test-mode activity are not customer demand or revenue.

## Rollback and retention

Close new checkout creation through the dedicated checkout switch. This does not expire previously created Stripe Checkout Sessions; they may remain payable until Stripe expires them. Any separately authorized cancellation of outstanding sessions requires exact-target provider verification. Leave the valid historical-purchase verification path intact where safe. Never delete purchase records merely to disable sales, and never replay a payment or refund as a rollback step.

Payment references and recovery-key hashes support the purchased project's ongoing access, payment reconciliation, and support. They are separate from browser-local deletion. Do not automatically delete paid purchase records on the older manual-Preflight retention schedule. Before pruning abandoned attempts or financial records, verify the applicable retention obligations and reconcile any provider-side payment; no such production deletion is part of this implementation.
