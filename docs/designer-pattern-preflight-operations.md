# Designer Pattern Preflight pilot operations

## Architecture decision

The repository had no Stripe, Supabase, secure upload, transactional email, or authenticated admin system. This pilot therefore uses Stripe Checkout, a private Supabase database table, and customer-controlled HTTPS share links. It intentionally does not create a file bucket, account system, admin UI, or automated report engine.

## Required configuration

Set these server-side values in local `.env.local` and the deployment provider. Never expose the Stripe or Supabase secrets to the browser.

- `NEXT_PUBLIC_SITE_URL`: `http://localhost:3000` locally; `https://fibertools.app` in production.
- `STRIPE_SECRET_KEY`: Stripe test or live secret key.
- `STRIPE_WEBHOOK_SECRET`: signing secret for `/api/stripe/webhook`.
- `SUPABASE_URL`: project URL.
- `SUPABASE_SECRET_KEY`: backend-only Supabase secret key (a legacy service-role key also works, but never use either in client code).

Apply `supabase/migrations/20260816_designer_pattern_preflight.sql` before starting checkout.

## Stripe test-mode setup

1. Use a Stripe account in test mode and copy its secret key into `.env.local`.
2. Run `stripe listen --forward-to localhost:3000/api/stripe/webhook` and copy the displayed `whsec_...` value into `.env.local`.
3. Run `npm run dev` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
4. Submit a supported private share link and complete Checkout with Stripe's test card `4242 4242 4242 4242`, a future expiry, and any CVC/postal code.
5. Verify one row changes from `awaiting_payment`/`pending` to `paid`/`paid`, one Stripe event row exists, and a repeated event does not create a second event or repeat fulfillment.
6. Open the success and cancel routes and verify that only a Stripe-retrieved paid session displays “Payment confirmed.”
7. In production, create a webhook endpoint at `https://fibertools.app/api/stripe/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, and `checkout.session.expired`, then use its live signing secret.

The product and $9 one-time price are created inline by the server. No recurring price or subscription is created.

## Manual fulfillment queue

There is no admin authentication in the current repository, so use the Supabase dashboard table editor with owner-only account access.

1. Filter `designer_preflight_submissions` to `payment_status = paid` and `status = paid`.
2. Verify the Stripe payment in Stripe before opening the pattern link.
3. Confirm the share link grants `jason@fibertools.app` view access. If access or information is missing, email the customer; do not move to `in_review` until access works.
4. Update `status` to `in_review` and review manually using `docs/designer-pattern-preflight-report-template.md`.
5. Update `status` to `report_ready`, save the final editable source and PDF outside the public repository, and email the report manually from `jason@fibertools.app`.
6. Set `status = delivered`, `delivered_at`, and `retention_delete_by = delivered_at + 30 days`. Record time spent and any supported/unsupported requests in the validation ledger without copying pattern content.
7. After any clarification, remove access to the customer file where possible. On or before `retention_delete_by`, clear `secure_share_url`, `customer_comments`, and `internal_notes`, then delete or anonymize customer contact data unless a lawful accounting or dispute need requires limited retention. Record only the Stripe payment reference and minimum accounting record separately.
8. Use `refunded` and `closed` only after confirming the corresponding owner action in Stripe. No code issues refunds.

## Temporary notification process

No transactional email provider exists in the app. The customer sees a server-verified success page and Stripe can send its payment receipt. The owner must check Stripe/Supabase after each payment and manually send access confirmation, report delivery, and any follow-up from `jason@fibertools.app`. Do not use Beehiiv for customer or pattern data.

## Handling edge cases

- Abandoned checkout: the Stripe expiration event records `payment_status = expired`; do not review or contact as a paid customer.
- Duplicate submit: the browser request ID and database unique constraint reuse the existing Checkout Session.
- Duplicate webhook: the Stripe event ID primary key makes processing idempotent.
- Delayed confirmation: the success page retrieves the Checkout Session from Stripe; the webhook remains the only process that updates the database.
- Missing access: keep paid, request access, and start the delivery target only after access works.
- Invalid IDs or signatures: reject the event; never trust a query string or client payment claim.
- Refund: perform only in Stripe after an owner decision, then manually reconcile `payment_status` and `status`.

## Privacy controls

- No direct uploads or public bucket exist.
- Submitted content and share links never enter analytics or Stripe metadata.
- The database has RLS enabled and grants access only to the backend service role.
- Pattern content is never used for AI training, marketing, public examples, or product development without separate written permission.
- Retention is manual and must be checked at least weekly; the site promises a deadline, not automatic deletion.
- Consent-aware GA events cover the public funnel only. `delivered_at` is the report-delivery source of truth, and repeat purchases are verified by distinct paid rows for the same customer email in the private database. Browser repeat-purchase analytics are anonymous device-level direction only and are not counted as validation evidence.

## Pre-deployment gate

Do not deploy until the migration is applied, test keys are configured, the complete test-mode payment/webhook flow passes, legal/customer wording is owner-approved, and a rollback owner is identified. After production configuration, repeat the flow once with a live $9 owner-controlled purchase and refund only with explicit owner authorization.
