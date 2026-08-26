# Designer Pattern Preflight pilot operations

## Architecture decision

The pilot uses Stripe Checkout, private Supabase tables, and customer-controlled HTTPS share links. It intentionally does not create a file bucket, customer account system, authenticated admin UI, automated report engine, or automatic refund workflow.

Operational events are written to `designer_preflight_outbox` in the same database transaction as payment-state changes. A worker claim contains only an outbox ID, submission ID, event type, Stripe mode, attempt count, and short-lived lease token; it never exposes a Stripe event ID. The table must never contain names, email addresses, pattern titles, comments, report findings, share links, or provider messages. No notification provider consumes the outbox yet; that remains an explicit owner/provider decision.

## Required configuration

Set these server-side values in local `.env.local` and the deployment provider. Never expose Stripe or Supabase secrets to the browser.

- `DESIGNER_PREFLIGHT_ACTION_MODE`: defaults safely to inquiry for every value except exact `checkout`. Set `checkout` only after the migration, provider, webhook, and fulfillment gates below are complete.
- `DESIGNER_PREFLIGHT_INQUIRY_URL`: optional HTTPS or `mailto:` inquiry destination. Invalid or missing values fall back to the FiberTools support email. The inquiry route must not solicit pattern files, private share links, or payment details.
- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` locally; `https://fibertools.app` in production.
- `STRIPE_MODE`: exactly `test` or `live`. Test and live requests, rows, webhooks, outbox events, and watchdog runs are segregated by this value.
- `STRIPE_SECRET_KEY`: a key whose mode matches `STRIPE_MODE`.
- `STRIPE_WEBHOOK_SECRET`: signing secret for the matching-mode `/api/stripe/webhook` endpoint.
- `SUPABASE_URL`: project URL.
- `SUPABASE_SECRET_KEY`: backend-only Supabase secret key. A legacy service-role key also works, but neither belongs in client code.
- `PREFLIGHT_RETENTION_BATCH_SIZE`: optional watchdog batch size from 1 to 500; defaults to 100.
- `DESIGNER_PREFLIGHT_OPS_APPLY_CONFIRM`: unset for planning. A mutating test run requires exactly `apply-designer-preflight-test`; a mutating live run requires exactly `apply-designer-preflight-live`, in addition to the `--apply` CLI flag.

The hardening migration is an **unapplied draft whose remote migration baseline has not been verified**. Before applying either environment, reconcile its Supabase migration ledger and confirm the base migration is present exactly once; do not use a blind migration push. After that verification, the intended phase-1 order is:

1. `supabase/migrations/20260816_designer_pattern_preflight.sql`
2. `supabase/migrations/20260818_designer_pattern_preflight_ops_hardening.sql`

Phase 1 is intentionally additive for compatibility: existing rows with unknown Stripe mode remain `NULL`, and the v1 webhook RPC remains callable by the current deployment. The phase-1 migration redefines v1 with explicit required-argument/NULL guards and a safe search path, but its signature still cannot enforce Stripe mode. Phase 1 alone is not database-enforced mode isolation. Do not guess unknown modes or refunded amounts. Reconcile legacy rows only from provider evidence.

After mode-aware application code is deployed to **every** Production and Preview writer, the owner must separately review and run `docs/designer-preflight-mode-enforcement-phase2.sql`. That owner-gated SQL adds `NOT VALID` checks that reject new/updated NULL-mode submission and Stripe-event rows while allowing inventoried legacy rows, revokes the v1 RPC, and revokes direct `service_role` insert/update/delete access to the Stripe-event table because v2 is the mutation boundary. Later validate each constraint only when that table's legacy NULL count is zero. Do not place phase 2 in the same automatic rollout as phase 1.

The original unique `request_id` constraint remains the idempotency boundary. The application refuses cross-mode or unknown-mode reuse. It reuses only a same-mode pending Checkout URL and session ID with a future Stripe expiration. A same-mode pending row created within the last hour with neither a stored session ID nor URL may retry through the original Stripe idempotency key to recover from a pre-session or database-save failure. Older unlinked rows require reconciliation. Any row with a stored session ID or URL is never overwritten; a locally stale/missing expiration requires reconciliation, and only after a verified Stripe terminal event does the client discard that request ID and use a fresh one.

Phase 2 does not revoke direct `service_role` CRUD on `designer_preflight_submissions`: the current application still creates and reads submission rows directly. Replacing that access with narrow create/read RPCs is a separate least-privilege rollout and must precede any future submission-table DML revocation.

Prefer separate Supabase projects for test and live. If one project is intentionally shared, every operator query and RPC call must include the explicit `stripe_livemode` value.

## Stripe test-mode setup

1. Set `STRIPE_MODE=test` and use only Stripe test keys.
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and copy the displayed test signing secret into `.env.local`.
3. Run `npm run dev` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
4. Submit a supported private share link and complete Checkout with Stripe test payment data.
5. Verify the submission records `stripe_livemode = false`, changes from `awaiting_payment`/`pending` to `paid`/`paid`, and creates one Stripe event plus one `payment_paid` outbox row.
6. Replay the same event. The endpoint should return HTTP 200, with no second Stripe event, state transition, or `payment_paid` outbox row.
7. Exercise partial and full test refunds, async-payment failure, and dispute fixtures before changing production subscriptions.
8. Open the success and cancel routes and verify that only a Stripe-retrieved session whose mode matches `STRIPE_MODE` displays “Payment confirmed.”

For production, subscribe the live endpoint at `https://fibertools.app/api/stripe/webhook` to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`
- `checkout.session.expired`
- `charge.refunded`
- `charge.dispute.created`
- `charge.dispute.updated`
- `charge.dispute.closed`

The product and $39 one-time price are created inline by the server. No recurring price or subscription is created. The checkout API remains unavailable unless `DESIGNER_PREFLIGHT_ACTION_MODE=checkout`, every required Stripe, Supabase, webhook, and site value is valid, and the documented migration, database, retention, outbox, exact webhook-event, notification-delivery, durable-abuse-protection, and fulfillment-capacity attestations all pass the shared runtime readiness contract. Documented fake values and reserved example destinations are rejected.

## Durable outbox and notification boundary

The database transaction creates privacy-safe outbox events for paid orders, payment failures, expirations, partial/full refunds, disputes, delivery, retention, and queue-watchdog conditions. Dedupe keys use only internal submission IDs plus semantic terminal state, cumulative partial-refund cents, or an allowlisted dispute status. Stripe event IDs are written only to the private Stripe-event table; after phase 2, its only `service_role` mutation path is the insert-only v2 processing RPC. Other Checkout, PaymentIntent, charge, and dispute references remain only in private submission/event records. Provider delivery is deliberately separate from Stripe webhook acknowledgement.

A future worker uses RPCs only; direct service-role insert/update/delete access to the outbox table is revoked. It must:

1. Claim a small matching-mode batch with `claim_designer_preflight_outbox(worker_id, stripe_livemode, limit)`.
2. Resolve only the minimum owner-facing context inside the trusted worker. Do not send pattern data or share links to the notification provider.
3. Mark success with `complete_designer_preflight_outbox(...)`, echoing the matching mode and one-time lease token.
4. Mark failure with `fail_designer_preflight_outbox(...)`, echoing that mode/token and using a privacy-safe error code plus a bounded retry delay rather than a timestamp or raw provider message.

Until an owner approves and configures a delivery provider and scheduler, the outbox is durable evidence—not a delivered alert. Continue checking Stripe and Supabase manually after payments.

## Manual fulfillment queue

There is no admin authentication in the repository, so use the Supabase dashboard table editor with owner-only account access.

1. Filter `designer_preflight_submissions` by the intended `stripe_livemode`, `payment_status = paid`, and `status = paid`.
2. Verify the payment in the matching Stripe mode before opening the pattern link.
3. Acknowledge the paid row with `acknowledge_designer_preflight_paid_order(...)` so the stale-paid watchdog stops repeating alerts.
4. Confirm the share link grants `jason@fibertools.app` view access and contains exactly one submitted version of one crochet pattern with no more than 10 pages. If access, scope, or information is missing, email the customer; do not move to `in_review` until it is resolved.
5. Call `start_designer_preflight_review(...)` with the owner-calculated due time. It records access and acknowledgement using database time, validates the due time against a 30-day maximum, and sets `status = in_review`. The database does not guess holidays.
6. Review manually using `docs/designer-pattern-preflight-report-template.md`.
7. Save the editable source and one written PDF report outside the public repository, call `mark_designer_preflight_report_ready(...)`, and email that report manually from `jason@fibertools.app`. Do not add rewriting, grading, ownership transfer, ongoing consultation, or revision rounds to the fulfillment scope.
8. Call `mark_designer_preflight_delivered(...)`. Database time atomically sets `status = delivered`, `delivered_at`, and the fixed 30-day `retention_delete_by` deadline.
9. Record aggregate time and supported/unsupported requests in the validation ledger without copying customer or pattern content.

Do not fulfill while `payment_status` is `refunded`, `disputed`, or `dispute_lost`. A partial refund is deliberately distinct and creates an owner-review outbox event; the owner decides whether fulfillment continues.

## Queue watchdog and retention

`npm run ops:designer-preflight-watchdog` is plan-only by default: it calls `plan_designer_preflight_ops_watchdog` for the explicit `STRIPE_MODE` and returns aggregate counts without changing rows. Mutation requires both `--apply` and the matching exact `DESIGNER_PREFLIGHT_OPS_APPLY_CONFIRM` value. Any live apply remains an owner-authorized production-data action; this repository change did not run it.

The watchdog:

- emits `checkout_reconciliation_due` when a pending checkout passes its recorded expiration, or is 48 hours old without one; local time never changes Stripe payment state;
- transitions no pending payment: only verified `checkout.session.expired` or `checkout.session.async_payment_failed` webhooks may close an unpaid row;
- plans and, only under the dual apply guards, anonymizes a seven-day-old pending row that has neither a stored Stripe session ID nor Checkout URL; this safe orphan cleanup leaves fulfillment/payment state unchanged and never touches a session-linked pending payment;
- gives unpaid expired/failed submissions a seven-day cleanup grace period;
- repairs a missing delivered-row deadline to `delivered_at + 30 days`;
- anonymizes due rows in bounded batches;
- emits daily deduplicated events for unacknowledged paid orders, overdue fulfillment, and overdue retention.

Anonymization clears the customer name, email, pattern title/type details, comments, share URL, Checkout URL, and internal notes. It retains the random request ID, consent timestamp, Stripe references, aggregate cents, mode, and event history as the minimum accounting/audit record. The Stripe event foreign key is `ON DELETE RESTRICT`; use anonymization instead of deleting the payment record.

Automated anonymization requires a due deadline plus a delivered/terminal state, except for the narrowly classified seven-day-old pending orphan with no stored session ID or Checkout URL. Other abandoned cleanup requires a Stripe-verified `expired` or `failed` unpaid state. Active paid/review work and every session-linked pending payment are always refused. For a terminal refund/dispute overlay on unfinished work, the owner may explicitly call `resolve_designer_preflight_adverse_case(..., 'cancelled')`; it records the prior fulfillment status, moves work to the distinct terminal `cancelled` status, and starts a fixed 30-day clock. For already-delivered work, `fulfilled_before_adverse_event` preserves `delivered` and `delivered_at`. An approved privacy request additionally requires `anonymize_designer_preflight_submission(..., 'owner_request', true)`. Never run live and test watchdogs from one invocation. A scheduler is not configured by this change.

## Refunds, failures, and disputes

- Refunds remain owner actions performed in Stripe. The website does not issue a refund.
- `charge.refunded` records Stripe's authoritative aggregate refunded amount. A partial refund becomes `partially_refunded`; when it arrives before the paid webhook, it also promotes a pending `awaiting_payment` row to the paid fulfillment queue and emits both semantic paid and partial-refund notifications. The later paid event preserves the partial-refund overlay. A full refund becomes `refunded` and blocks further fulfillment. Refund state is an overlay: `in_review`, `report_ready`, `delivered`, and `delivered_at` history is preserved; only pre-fulfillment `awaiting_payment`/`paid` status maps to `refunded`.
- `checkout.session.async_payment_failed` becomes `failed`, closes the unpaid row, and schedules retention.
- Dispute creation and intermediate updates block fulfillment. Closure records `dispute_won` or `dispute_lost`; neither automatically resumes delivery. Dispute state is an overlay and never replaces fulfillment status or `delivered_at`. Late intermediate events cannot reopen a terminal refund/dispute state.
- PaymentIntent metadata is retrieved server-side for refund/dispute ownership. Events for another FiberTools service are acknowledged and ignored.
- Same-event replays are idempotent by Stripe event ID inside the private Stripe-event table. Outbox dedupe is semantic and provider-ID-free: terminal payment/dispute states dedupe by submission and state, while partial refunds also include Stripe's authoritative cumulative refunded cents.
- Run a periodic matching-mode watchdog and reconcile adverse outbox events against Stripe before changing customer-facing status manually.

## Failure handling

- A webhook database error returns HTTP 500 so Stripe can retry; the event insert, state transition, and outbox insert share one transaction.
- Invalid signatures, cross-mode events, and invalid owned-service metadata return HTTP 400.
- Supported events for another service return HTTP 200 with `handled = false` so they do not retry indefinitely.
- An outbox delivery failure must not fail or replay the Stripe webhook. Use the claim/fail retry workflow.
- Never log or store raw provider errors where they could include customer data. Use bounded error codes.

## Privacy controls

- No direct uploads or public bucket exist.
- Submitted content and share links never enter analytics, Stripe metadata, or the outbox.
- Database tables have RLS enabled and direct public, anonymous, and authenticated access revoked.
- Patterns are not used for AI training, marketing, public examples, or product development without separate written permission.
- `delivered_at` is the report-delivery source of truth. Repeat purchases require distinct paid rows in the private database; anonymous browser analytics are not validation evidence.

## Pre-deployment gate

Do not apply phase 1 until the target's remote migration baseline is reconciled. Keep `DESIGNER_PREFLIGHT_ACTION_MODE` in its default inquiry state until the verified phase-1 migration is applied to the matching environment, `STRIPE_MODE` and its matching key are set explicitly, the subscribed event list is updated in the matching Stripe mode, and the test matrix passes. Switching the action mode to checkout is an owner/provider configuration action. Apply owner-gated phase 2 only after every writer runs mode-aware code. Provider decisions still required before relying on automated operations:

- owner-notification delivery provider and destination;
- scheduler/worker provider, authentication, cadence, and alert ownership;
- business-day calendar and escalation window;
- treatment of legacy rows with unknown Stripe mode;
- policy for partial refunds and dispute-won fulfillment resumption.

Any live purchase, refund, provider configuration, migration application, or production deployment remains a separate owner-authorized action.
