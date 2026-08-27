# StitchProof Managed Payments: review handoff

Prepared for the owner's 2026-08-27 approval of a **local integration for review**, using the proposed 24-country scope. This is not enrollment, acceptance of terms, approval of provider fees, a production migration, deployment, or authorization to open checkout. No test activity represents customer demand or revenue.

Later on August 27, the owner authorized the technical fixes and release work needed to make the website operate reliably. That authority covers the repaired release pipeline and this fail-closed implementation; it does not supply missing product-tax facts, accept Stripe's terms, or establish that protected provider tests passed. Public Managed Payments activation remains gated by the evidence below.

## Scope and defaults

- Use only FiberTools account `acct_1U5HWnD2Of3MIt94`.
- The base offer remains US$9 once per project and its revisions; free analysis and recovery JSON remain free. There is no subscription or pattern upload.
- New managed offer: `STITCHPROOF-PROJECT-MANAGED-V1`. Existing `STITCHPROOF-PROJECT-V1` purchases retain their stored contract and fresh-payment verification.
- The fake environment template keeps checkout and managed confirmations false. No real environment, account, Product, Price, key, webhook or bank settings are changed by this implementation.
- Planning Pack, manual Preflight, the free math engine and protected distribution/experiment records remain outside this change.

## Approved market policy

`STITCHPROOF-MARKETS-2026-08-27` contains exactly:

| Region grouping | Country codes |
| --- | --- |
| North America | US, CA |
| United Kingdom and Europe | GB, AT, BE, DK, FI, FR, DE, IS, IE, IT, LU, NL, NO, PT, ES, SE, CH |
| Asia and Oceania | JP, SG, KR, AU, NZ |

The shared source list supplies names to a native country selector with no default selection. The selected country is a checkout-only declaration, not verified location. It is not saved in a draft, recovery file or analytics. The server binds it to a private attempt alongside the policy version and owner-confirmed Product tax code. Access/recovery verification does not require a country.

## Payment contract

Managed Checkout requests set `managed_payments.enabled=true` and omit unsupported tax, adaptive-pricing and payment-method parameters. The request uses the documented hosted-page mode, the exact active one-time USD 900-cent Price, quantity one, fixed return URLs, disabled promotions/recovery sessions and no requested phone collection. Stripe may collect billing details required by its service. Product tax classification and inclusive/exclusive price treatment require owner verification. [Stripe integration contract](https://docs.stripe.com/payments/managed-payments/update-checkout), [Checkout creation API](https://docs.stripe.com/api/checkout/sessions/create).

Managed Payments controls localization. The verifier compares Session and PaymentIntent amounts in the integration currency; it does not mistake a localized amount for USD cents or calculate an exchange rate. When present, Session, PaymentIntent and Charge presentment tuples must agree. The exact Charge/refund serialization still requires a protected provider test. Manually localized Price currency options are not supported by this implementation. [Adaptive Pricing reporting](https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing?payment-ui=stripe-hosted).

Both Session and PaymentIntent must explicitly indicate Managed Payments. Opaque identity and managed-contract metadata are checked across Session, PaymentIntent and Charge. A paid, captured, successful charge must match the entire verified total, including `amount_captured`; fresh refund/dispute reads still control access. Unsupported or inconsistent responses fail closed.

For the documented pre-tax subtotal model, exclusive pricing requires subtotal 900 and total 900 plus tax; inclusive pricing requires total 900 and subtotal plus included tax equal to 900. No tax rate is invented. These managed assertions need real nonzero-tax fixtures before live activation; synthetic passing fixtures do not establish provider serialization. The legacy tax verifier is not silently reinterpreted. [Session amounts](https://docs.stripe.com/api/checkout/sessions/object), [Price tax behavior](https://docs.stripe.com/tax/products-prices-tax-codes-tax-behavior).

## Country enforcement is a provider release gate

Stripe documents custom Radar blocking using the declared billing country for Managed Payments. It requires Radar for Fraud Teams; do not upgrade or accept charges under this review approval. The billing country is customer-declared, not independently verified. [Country-block guidance](https://support.stripe.com/questions/block-payments-from-tax-unsupported-countries-using-radar?locale=en-GB).

**Draft only, not installed or provider-validated:** a rule must be scoped to this managed offer so other FiberTools payment flows are not changed. The following candidate uses payment metadata, not customer/pattern data:

```text
Block if ::service:: = 'stitchproof_designer_project'
  and ::offer_version:: = 'STITCHPROOF-PROJECT-MANAGED-V1'
  and (is_missing(:billing_address_country:)
    or :billing_address_country: not in ('US','CA','GB','AU','NZ','AT','BE','DK','FI','FR','DE','IS','IE','IT','LU','NL','NO','PT','ES','SE','CH','JP','SG','KR'))
```

Before using it, validate syntax, payment-metadata availability and actual blocking in the correct account. Review every existing Allow rule: an Allow can bypass subsequent Block rules. A Review rule is not a payment block. Missing-country handling is explicit. Do not change account-wide rules or remove unrelated controls without separate authority. [Radar evaluation and metadata syntax](https://docs.stripe.com/radar/rules/reference).

Custom-rule support varies by payment method. Stripe Support can request a configuration without local methods; cards, card-backed wallets and Link remain. This application will not expose a managed Checkout URL if its returned methods extend beyond card/Link, but that check does **not** prove Radar coverage. Obtain provider confirmation and test every remaining method, including Link funding sources, before live sales. [Method configuration](https://support.stripe.com/questions/payment-method-configurations-for-managed-payments?locale=en-GB), [Custom-rule method coverage](https://docs.stripe.com/radar/supported-payment-methods).

Do not replace pre-charge controls with post-payment country rejection and withheld delivery. The first-party selection alone does not enforce billing location. Do not broaden the 24-country scope to make a test pass. If full pre-charge coverage cannot be established, leave managed live checkout off and ask the owner to choose a different supported approach.

## Additive database and recovery

The original applied migration is unchanged. New local file `20260827_stitchproof_managed_payments.sql` adds only the managed contract to the existing project/attempt ledger and v2 snapshot/load/reserve/readiness RPCs. No separate ledger permits parallel purchases. Existing attachment, verification and event processing are shared.

The adapter uses v1 RPCs until the applied-version configuration explicitly selects v2. After a separately authorized application, retain v2 configuration even when closing sales or changing tax mode, so historical managed attempts remain readable. Do not blindly replay the original migration; reconcile the actual project's migration history first.

A changed country or offer cannot reuse an unresolved payable attempt. An existing paid project remains accessible even when the new offer closes. Replacement requires a freshly verified unpaid expiry and the existing expected-attempt comparison. Failed creation/attachment and old unresolved reservations retain their original idempotency identity; no timeout authorizes a new charge. A country change also invalidates an in-flight browser checkout response without replacing the project/recovery identity.

## Required activation evidence, not completed by this review

1. Owner/provider confirmation of account eligibility, terms, actual fees, eligible Product tax code, inclusive/exclusive treatment and applicable business obligations. No legal or tax facts may be guessed.
2. Exact approved additive migration applied and verified in the correct private project; forced RLS, service-only RPCs and historical recovery tested. No production schema application is included here.
3. Dedicated signed webhook delivery, durable abuse protection and privacy-safe operational handling verified. Preserve existing payment integrations and secrets.
4. Support-confirmed method configuration and the scoped country rule, including missing/out-of-list billing-country negatives and Allow-rule bypass review. Verify no effect on other offers.
5. Protected **Stripe test-mode** fixtures for zero and nonzero tax, the chosen price behavior, USD and a localized currency, full/partial refund and dispute handling, retries, expired sessions, signed webhook replay, project recovery, CSV/print exports and provider outages. Test all enabled methods. Test-mode exceptions for the three managed live gates only permit this validation; they are not evidence of it.
6. Explicit release/production approval, then exact SHA and configuration verification. No live charge/refund without separate explicit payment authorization. Never treat owner, household, declined or synthetic activity as revenue.

The environment inventory describes each gate. `STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED`, `STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED` and `STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED` remain false until their evidence is recorded; all three are mandatory in live mode.

## Review validation

Review branch: `codex/fibertools-managed-payments-review-2026-08-27`, fast-forwarded without losing the pending integration changes to fetched `origin/main` at `25b08a62b17e997e622f539fafb772c54bb04707` after the independently released publication repair. The integration's PR records its source-release status. No Stripe enrollment, payment configuration, production migration, or live payment test was performed during this validation.

| Check on 2026-08-27 | Verified result |
| --- | --- |
| Focused purchase, UI, math, analytics, environment, accessibility and publication suite | 465 passed; 0 failed; 0 skipped. Includes the 223 managed cases, 13 additive SQL checks, one real-adapter/PGlite integration test and 15 publication checks, not additional counts. |
| Selected privacy tests | 5 passed. The protected experiment-document test was not selected or read. |
| Compiled page checks | Focused page output 8/8, review dates 4/4 and yarn-weight page output 2/2 passed. |
| Focused ESLint and TypeScript | Passed with zero lint warnings. |
| Quality, security and affiliate checks | Passed; affiliate check covered 10 monetized tools. |
| Content and predeployment release guards | Passed after the separate PR #50 repair. The previous 5 content findings and 4 predeployment findings are resolved without changing the pinned manifest or weakening guards. |
| Normal `npm run build` | Passed on the repaired base, including all prebuild guards, lint/type checks, 101 generated pages and all 14 postbuild page checks. |
| Working diff | Whitespace check passed; protected records, content and publication guards are unchanged by this work. |

The focused suite command was:

```text
node --test --test-reporter=spec tests/stitchproof-purchase*.test.mjs tests/stitchproof-designer-ui.test.mjs tests/amigurumi-pattern-checker.test.mjs tests/stitchproof-designer-core.test.mjs tests/stitchproof-analytics.test.mjs tests/environment-docs.test.mjs tests/ui-accessibility.test.mjs tests/publication-freeze.test.mjs
```

Local production-style browser checks verified closed-checkout behavior and a free four-round example: three correct rounds, one mismatch, with round 3 calculated as 18 against the written 17. Unpaid print/PDF and issue CSV remained disabled. A loopback-only synthetic managed fixture verified the exact 24-country selector plus its blank default, a disabled prepare action without a country, stale-response rejection for US to CA to US, a synthetic URL only after a stable request, URL removal after changing country, and access verification without a country. The fixture accepted two checkout requests and one access request with zero rejected payloads; it made no Stripe or database calls. At a 390 by 844 viewport, the country control was 48 pixels high and no horizontal overflow was detected. The temporary tab was closed, the viewport reset, and both local servers stopped.

The initial browser download-event wait timed out. A follow-up browser test used a unique synthetic title, verified the previously nonexistent recovery file appeared in Downloads, and parsed the saved file with the actual recovery parser. It retained the expected title, three synthetic rounds and valid identity shape without country fields in the draft or identity; no key value was printed. This resolves the physical-save access gap, not the protected provider delivery/export requirement. The earlier checkout-control test used a simulated backup acknowledgment. No real Checkout URL was followed and no payment occurred.

**Separately resolved publication blocker:** base commit `742ac25` added a duplicate crochet-hooks article without a matching freeze approval. [PR #50](https://github.com/raiderj77/fibertools/pull/50) preserved it in tracked `content/quarantine/` with `status: draft`, added recurrence tests and retained the pinned manifest/guards. It merged as `25b08a62b17e997e622f539fafb772c54bb04707`; Vercel deployment `dpl_7u8KaQWW5a9Qeik7jCXeJiVHb4VD` was verified READY for that SHA with both production domains. Main now requires a PR, up-to-date app-bound build/quality and public-file checks, including administrators, with force pushes/deletion blocked. The external publisher implementation was not identified or changed.

**Provider findings on August 27:** the exact FiberTools Stripe account displayed the Managed Payments setup wizard, a 3.5% transaction add-on fee, and the required product-category step before checkout/finish setup. No category was selected and no terms accepted; the page was handed to the owner. Vercel's complete 39-entry environment metadata response contained no `STITCHPROOF_*` names; credential values were not inspected or printed. The Planning Pack's existing first-party checkout returned a 303 redirect to `buy.stripe.com` without following the link, while StitchProof availability remained false. Neither response proves fulfillment, tax readiness, or revenue.

The public checkout-availability endpoint was read without creating a session: at `2026-08-27T14:58:50.4938002Z`, it returned HTTP 200 with `{"available":false}`, `Cache-Control: no-store, max-age=0` and `Referrer-Policy: no-referrer`. This verifies only that response, not the production SHA, account enrollment, tax configuration, or every revenue path.

Unit/PGlite and local browser tests prove only the exercised application behavior, not enrollment, tax compliance, provider event delivery, international acceptance, or live revenue. Provider-dependent requirements above remain open regardless of local test counts. The full repository suite was not run.

## Local change inventory and next decision

The review contains 20 intended files: the shared market policy; purchase configuration, service, server adapter and client; the Designer workspace; the additive migration; privacy and terms pages; the fake environment template and two deployment documents; seven focused test files; and this handoff. The disposable `tmp/managed-payments-ui-review.mjs` fixture is ignored and is not part of a future pull request. No dependency or original migration changes are included.

The release blocker is repaired. The next activation action is the owner's verified product-category and terms/fee decision in Stripe, followed by the protected provider setup and tests above. Do not activate checkout merely because this local review or its code release passes. Stage only the intended integration files after reviewing the diff; do not stage protected records, unrelated work or local fixtures.

Rollback is to close new sales and retain the immutable purchase records, correct applied schema version and historical verifier. Closing the switch does not expire previously issued provider sessions. Expiring a specific session requires separate exact-target authority; never delete records or issue refunds as an implicit rollback.
