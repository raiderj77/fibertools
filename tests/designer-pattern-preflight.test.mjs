import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  isAllowedSecureShareUrl,
  validatePreflightSubmission,
} from "../src/lib/designer-preflight-validation.mjs";
import {
  createPreflightCheckout,
  handlePreflightWebhook,
  PREFLIGHT_AMOUNT_CENTS,
  PREFLIGHT_ORPHAN_RETRY_MAX_AGE_MS,
  PREFLIGHT_SERVICE_KEY,
  stripeSecretKeyLivemode,
} from "../src/lib/designer-preflight-service.mjs";

const requestId = "1f6f8042-b253-4d79-9f7f-6428d81f4377";
const submissionId = "83eefaf2-12ed-4450-a38c-6d90920331b4";

function validPayload(overrides = {}) {
  return {
    requestId,
    name: "Jane Designer",
    email: "JANE@example.com",
    patternTitle: "Northwind Cowl",
    terminology: "us",
    skillLevel: "intermediate",
    patternType: "accessory",
    comments: "Please look closely at the joining rounds.",
    secureShareUrl: "https://drive.google.com/file/d/example/view",
    scopeAgreed: true,
    website: "",
    ...overrides,
  };
}

function preflightMetadata() {
  return { service: PREFLIGHT_SERVICE_KEY, submission_id: submissionId };
}

function webhookDependencies(event, repository, overrides = {}) {
  return {
    constructEvent: () => event,
    expectedLivemode: false,
    repository,
    retrievePaymentIntent: async () => ({ id: "pi_test_paid", livemode: false, metadata: preflightMetadata() }),
    retrieveCharge: async () => ({ id: "ch_test_paid", livemode: false, payment_intent: "pi_test_paid" }),
    ...overrides,
  };
}

test("submission validation normalizes the allowed minimum payload", () => {
  const result = validatePreflightSubmission(validPayload());
  assert.equal(result.success, true);
  assert.equal(result.data.email, "jane@example.com");
  assert.equal(result.data.scopeAgreed, true);
});

test("submission validation rejects missing consent and oversized comments", () => {
  const result = validatePreflightSubmission(validPayload({ scopeAgreed: false, comments: "x".repeat(1001) }));
  assert.equal(result.success, false);
  assert.match(result.errors.scopeAgreed, /Agree/);
  assert.match(result.errors.comments, /1,000/);
});

test("file payloads are rejected because this MVP has no upload path", () => {
  const result = validatePreflightSubmission(validPayload({ fileName: "pattern.pdf", mimeType: "application/pdf" }));
  assert.equal(result.success, false);
  assert.match(result.errors.secureShareUrl, /File uploads are not accepted/);
});

test("share-link validation permits supported private providers and rejects unsafe URLs", () => {
  assert.equal(isAllowedSecureShareUrl("https://www.dropbox.com/s/example/pattern.pdf"), true);
  assert.equal(isAllowedSecureShareUrl("https://1drv.ms/b/example"), true);
  assert.equal(isAllowedSecureShareUrl("http://drive.google.com/file/example"), false);
  assert.equal(isAllowedSecureShareUrl("https://drive.google.com.evil.example/file"), false);
  assert.equal(isAllowedSecureShareUrl("https://user:secret@drive.google.com/file/example"), false);
  assert.equal(isAllowedSecureShareUrl("javascript:alert(1)"), false);
});

test("Stripe secret and restricted key prefixes resolve mode without exposing the key", () => {
  assert.equal(stripeSecretKeyLivemode("sk_test_synthetic"), false);
  assert.equal(stripeSecretKeyLivemode("rk_test_synthetic"), false);
  assert.equal(stripeSecretKeyLivemode("sk_live_synthetic"), true);
  assert.equal(stripeSecretKeyLivemode("rk_live_synthetic"), true);
  assert.throws(
    () => stripeSecretKeyLivemode("pk_test_not_server_secret"),
    /supported secret or restricted key/
  );
});

test("checkout creation segregates test/live state and saves expiration", async () => {
  let checkoutInput;
  let idempotencyKey;
  let createdMode;
  let savedCheckout;
  const repository = {
    findByRequestId: async () => null,
    create: async (_data, liveMode) => {
      createdMode = liveMode;
      return { id: submissionId, checkoutUrl: null };
    },
    isDuplicateRequestError: () => false,
    saveCheckout: async (...args) => { savedCheckout = args; },
  };
  const checkout = {
    configuredLivemode: false,
    createSession: async (input, key) => {
      checkoutInput = input;
      idempotencyKey = key;
      return {
        id: "cs_test_123",
        url: "https://checkout.stripe.com/c/pay/cs_test_123",
        liveMode: false,
        expiresAt: "2026-08-20T00:00:00.000Z",
      };
    },
  };

  const result = await createPreflightCheckout(validPayload(), {
    repository,
    checkout,
    expectedLivemode: false,
  });
  assert.equal(result.ok, true);
  assert.equal(checkoutInput.amountCents, PREFLIGHT_AMOUNT_CENTS);
  assert.equal(checkoutInput.amountCents, 900);
  assert.equal(checkoutInput.serviceKey, PREFLIGHT_SERVICE_KEY);
  assert.equal(checkoutInput.submissionId, submissionId);
  assert.equal(Object.hasOwn(checkoutInput, "secureShareUrl"), false);
  assert.equal(createdMode, false);
  assert.match(idempotencyKey, new RegExp(`test-${requestId}`));
  assert.deepEqual(savedCheckout, [
    submissionId,
    "cs_test_123",
    "https://checkout.stripe.com/c/pay/cs_test_123",
    false,
    "2026-08-20T00:00:00.000Z",
  ]);
});

test("duplicate form submission reuses only its mode-bound Checkout Session", async () => {
  let checkoutCalls = 0;
  let requestedId;
  const result = await createPreflightCheckout(validPayload(), {
    expectedLivemode: true,
    repository: {
      findByRequestId: async (requestId) => {
        requestedId = requestId;
        return {
          id: submissionId,
          checkoutUrl: "https://checkout.stripe.com/existing",
          checkoutExpiresAt: "2099-01-01T00:00:00.000Z",
          checkoutSessionId: "cs_live_existing",
          paymentStatus: "pending",
          stripeLivemode: true,
        };
      },
      isDuplicateRequestError: () => false,
    },
    checkout: { configuredLivemode: true, createSession: async () => { checkoutCalls += 1; } },
  });
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
  assert.equal(result.checkoutUrl, "https://checkout.stripe.com/existing");
  assert.equal(requestedId, requestId);
  assert.equal(checkoutCalls, 0);
});

test("request idempotency refuses cross-mode and unknown-mode reuse", async () => {
  for (const stripeLivemode of [true, null]) {
    await assert.rejects(
      createPreflightCheckout(validPayload(), {
        expectedLivemode: false,
        repository: {
          findByRequestId: async () => ({ id: submissionId, checkoutUrl: null, stripeLivemode }),
        },
        checkout: {
          configuredLivemode: false,
          createSession: async () => { throw new Error("should not create"); },
        },
      }),
      stripeLivemode === null ? /owner reconciliation/ : /other Stripe mode/
    );
  }
});

test("checkout creation rejects a provider session from the wrong Stripe mode", async () => {
  await assert.rejects(
    createPreflightCheckout(validPayload(), {
      expectedLivemode: false,
      repository: {
        findByRequestId: async () => null,
        create: async () => ({ id: submissionId, checkoutUrl: null }),
        isDuplicateRequestError: () => false,
      },
      checkout: {
        configuredLivemode: false,
        createSession: async () => ({
          id: "cs_live_wrong",
          url: "https://checkout.stripe.com/c/pay/cs_live_wrong",
          liveMode: true,
          expiresAt: null,
        }),
      },
    }),
    /wrong Stripe mode/
  );
});

test("checkout provider mode mismatch fails before any provider call", async () => {
  let providerCalls = 0;
  await assert.rejects(
    createPreflightCheckout(validPayload(), {
      expectedLivemode: false,
      repository: { findByRequestId: async () => { throw new Error("repository should not run"); } },
      checkout: {
        configuredLivemode: true,
        createSession: async () => { providerCalls += 1; },
      },
    }),
    /configuration does not match/
  );
  assert.equal(providerCalls, 0);
});

test("stale Checkout URLs require reconciliation and never create an overwriting session", async () => {
  let providerCalls = 0;
  const result = await createPreflightCheckout(validPayload(), {
    expectedLivemode: false,
    repository: {
      findByRequestId: async () => ({
        id: submissionId,
        checkoutUrl: "https://checkout.stripe.com/stale",
        checkoutExpiresAt: "2020-01-01T00:00:00.000Z",
        checkoutSessionId: "cs_test_stale",
        paymentStatus: "pending",
        stripeLivemode: false,
      }),
    },
    checkout: {
      configuredLivemode: false,
      createSession: async () => {
        providerCalls += 1;
      },
    },
  });
  assert.equal(result.ok, false);
  assert.equal(result.kind, "reconciliation");
  assert.equal(result.code, "checkout_reconciliation_required");
  assert.equal(providerCalls, 0);
});

test("a recent same-mode pre-session orphan retries with the original Stripe idempotency key", async () => {
  let providerCalls = 0;
  let idempotencyKey;
  let savedCheckout;
  const result = await createPreflightCheckout(validPayload(), {
    expectedLivemode: false,
    repository: {
      findByRequestId: async () => ({
        id: submissionId,
        checkoutUrl: null,
        checkoutExpiresAt: null,
        checkoutSessionId: null,
        paymentStatus: "pending",
        stripeLivemode: false,
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      }),
      saveCheckout: async (...args) => { savedCheckout = args; },
    },
    checkout: {
      configuredLivemode: false,
      createSession: async (_input, key) => {
        providerCalls += 1;
        idempotencyKey = key;
        return {
          id: "cs_test_recovered",
          url: "https://checkout.stripe.com/c/pay/cs_test_recovered",
          liveMode: false,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        };
      },
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
  assert.equal(providerCalls, 1);
  assert.equal(idempotencyKey, `designer-preflight-test-${requestId}-initial`);
  assert.equal(savedCheckout[0], submissionId);
  assert.equal(savedCheckout[1], "cs_test_recovered");
});

test("an old same-mode row without a stored session requires reconciliation", async () => {
  let providerCalls = 0;
  const result = await createPreflightCheckout(validPayload(), {
    expectedLivemode: false,
    repository: {
      findByRequestId: async () => ({
        id: submissionId,
        checkoutUrl: null,
        checkoutExpiresAt: null,
        checkoutSessionId: null,
        paymentStatus: "pending",
        stripeLivemode: false,
        createdAt: new Date(Date.now() - PREFLIGHT_ORPHAN_RETRY_MAX_AGE_MS - 1).toISOString(),
      }),
    },
    checkout: {
      configuredLivemode: false,
      createSession: async () => { providerCalls += 1; },
    },
  });
  assert.equal(result.kind, "reconciliation");
  assert.equal(providerCalls, 0);
});

test("duplicate-insert races recover a recent unlinked row through the same idempotency key", async () => {
  let reads = 0;
  let providerCalls = 0;
  let idempotencyKey;
  let saved = false;
  const duplicateError = Object.assign(new Error("duplicate"), { code: "23505" });
  const result = await createPreflightCheckout(validPayload(), {
    expectedLivemode: false,
    repository: {
      findByRequestId: async () => {
        reads += 1;
        return reads === 1
          ? null
          : {
              id: submissionId,
              checkoutUrl: null,
              checkoutExpiresAt: null,
              checkoutSessionId: null,
              paymentStatus: "pending",
              stripeLivemode: false,
              createdAt: new Date(Date.now() - 1000).toISOString(),
            };
      },
      create: async () => { throw duplicateError; },
      isDuplicateRequestError: (error) => error === duplicateError,
      saveCheckout: async () => { saved = true; },
    },
    checkout: {
      configuredLivemode: false,
      createSession: async (_input, key) => {
        providerCalls += 1;
        idempotencyKey = key;
        return {
          id: "cs_test_race",
          url: "https://checkout.stripe.com/c/pay/cs_test_race",
          liveMode: false,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        };
      },
    },
  });
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
  assert.equal(providerCalls, 1);
  assert.equal(idempotencyKey, `designer-preflight-test-${requestId}-initial`);
  assert.equal(saved, true);
});

test("webhook rejects a missing or invalid signature before database work", async () => {
  let repositoryCalls = 0;
  const repository = { recordStripeEvent: async () => { repositoryCalls += 1; return true; } };
  const missing = await handlePreflightWebhook("{}", "", { constructEvent: () => ({}), repository });
  const invalid = await handlePreflightWebhook("{}", "bad", {
    constructEvent: () => { throw new Error("bad signature"); },
    expectedLivemode: false,
    repository,
  });
  assert.equal(missing.status, 400);
  assert.equal(invalid.status, 400);
  assert.equal(repositoryCalls, 0);
});

test("paid webhook passes mode, amount, and internal IDs to one atomic repository call", async () => {
  let recorded;
  const event = {
    id: "evt_paid_1",
    type: "checkout.session.completed",
    livemode: false,
    data: { object: {
      id: "cs_test_paid",
      payment_status: "paid",
      payment_intent: "pi_test_paid",
      amount_total: 900,
      metadata: preflightMetadata(),
    } },
  };
  const result = await handlePreflightWebhook("raw", "valid", webhookDependencies(event, {
    recordStripeEvent: async (input) => { recorded = input; return true; },
  }));
  assert.equal(result.ok, true);
  assert.equal(result.handled, true);
  assert.equal(recorded.paymentState, "paid");
  assert.equal(recorded.stripeLivemode, false);
  assert.equal(recorded.amountPaidCents, 900);
  assert.equal(recorded.submissionId, submissionId);
});

test("duplicate webhook delivery is acknowledged without a second state transition", async () => {
  const event = {
    id: "evt_duplicate",
    type: "checkout.session.completed",
    livemode: false,
    data: { object: {
      id: "cs_test_duplicate",
      payment_status: "paid",
      payment_intent: null,
      amount_total: 900,
      metadata: preflightMetadata(),
    } },
  };
  const result = await handlePreflightWebhook("raw", "valid", webhookDependencies(event, {
    recordStripeEvent: async () => false,
  }));
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
});

test("webhook rejects cross-mode events and ignores unrelated Checkout Sessions", async () => {
  let calls = 0;
  const repository = { recordStripeEvent: async () => { calls += 1; return true; } };
  const crossMode = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_live_wrong",
    type: "checkout.session.completed",
    livemode: true,
    data: { object: { id: "cs_live_wrong", payment_status: "paid", metadata: preflightMetadata() } },
  }, repository));
  const unrelated = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_other",
    type: "checkout.session.completed",
    livemode: false,
    data: { object: { id: "cs_test_other", payment_status: "paid", metadata: { service: "other" } } },
  }, repository));
  assert.equal(crossMode.status, 400);
  assert.equal(unrelated.handled, false);
  assert.equal(calls, 0);
});

test("webhook rejects invalid owned metadata and ignores an unpaid completion", async () => {
  let calls = 0;
  const repository = { recordStripeEvent: async () => { calls += 1; return true; } };
  const invalidId = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_1",
    type: "checkout.session.completed",
    livemode: false,
    data: { object: { id: "cs_1", payment_status: "paid", metadata: { service: PREFLIGHT_SERVICE_KEY, submission_id: "not-a-uuid" } } },
  }, repository));
  const unpaid = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_2",
    type: "checkout.session.completed",
    livemode: false,
    data: { object: { id: "cs_2", payment_status: "unpaid", metadata: preflightMetadata() } },
  }, repository));
  assert.equal(invalidId.status, 400);
  assert.equal(unpaid.handled, false);
  assert.equal(calls, 0);
});

test("async payment failure closes the payment path with a privacy-safe failure code", async () => {
  let recorded;
  const result = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_async_failed",
    type: "checkout.session.async_payment_failed",
    livemode: false,
    data: { object: {
      id: "cs_test_async_failed",
      payment_status: "unpaid",
      payment_intent: "pi_test_failed",
      metadata: preflightMetadata(),
    } },
  }, { recordStripeEvent: async (input) => { recorded = input; return true; } }));
  assert.equal(result.handled, true);
  assert.equal(recorded.paymentState, "failed");
  assert.equal(recorded.failureCode, "async_payment_failed");
});

test("refund events distinguish partial and full aggregate refunds", async () => {
  const recorded = [];
  const repository = { recordStripeEvent: async (input) => { recorded.push(input); return true; } };
  const partial = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_partial_refund",
    type: "charge.refunded",
    livemode: false,
    data: { object: {
      id: "ch_test_partial",
      payment_intent: "pi_test_paid",
      amount: 900,
      amount_refunded: 300,
      refunded: false,
    } },
  }, repository));
  const full = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_full_refund",
    type: "charge.refunded",
    livemode: false,
    data: { object: {
      id: "ch_test_full",
      payment_intent: "pi_test_paid",
      amount: 900,
      amount_refunded: 900,
      refunded: true,
    } },
  }, repository));
  assert.equal(partial.handled, true);
  assert.equal(full.handled, true);
  assert.equal(recorded[0].paymentState, "partially_refunded");
  assert.equal(recorded[0].amountRefundedCents, 300);
  assert.equal(recorded[1].paymentState, "refunded");
  assert.equal(recorded[1].amountRefundedCents, 900);
});

test("dispute events resolve PaymentIntent metadata and keep intermediate/won/lost states explicit", async () => {
  const recorded = [];
  const repository = { recordStripeEvent: async (input) => { recorded.push(input); return true; } };
  const created = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_dispute_created",
    type: "charge.dispute.created",
    livemode: false,
    data: { object: {
      id: "dp_test_created",
      payment_intent: "pi_test_paid",
      amount: 900,
      status: "needs_response",
    } },
  }, repository));
  const closed = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_dispute_closed",
    type: "charge.dispute.closed",
    livemode: false,
    data: { object: {
      id: "dp_test_closed",
      charge: "ch_test_paid",
      amount: 900,
      status: "won",
    } },
  }, repository));
  const updated = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_dispute_updated",
    type: "charge.dispute.updated",
    livemode: false,
    data: { object: {
      id: "dp_test_updated",
      payment_intent: "pi_test_paid",
      amount: 900,
      status: "under_review",
    } },
  }, repository));
  assert.equal(created.handled, true);
  assert.equal(closed.handled, true);
  assert.equal(updated.handled, true);
  assert.equal(recorded[0].paymentState, "disputed");
  assert.equal(recorded[1].paymentState, "dispute_won");
  assert.equal(recorded[1].paymentIntentId, "pi_test_paid");
  assert.equal(recorded[2].paymentState, "disputed");
  assert.equal(recorded[2].disputeStatus, "under_review");
});

test("owned dispute events reject unknown statuses before database mutation", async () => {
  let calls = 0;
  const result = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_dispute_unknown",
    type: "charge.dispute.updated",
    livemode: false,
    data: { object: {
      id: "dp_test_unknown",
      payment_intent: "pi_test_paid",
      amount: 900,
      status: "future_provider_status",
    } },
  }, { recordStripeEvent: async () => { calls += 1; return true; } }));
  assert.equal(result.status, 400);
  assert.equal(calls, 0);
});

test("financial events for another service are acknowledged and ignored", async () => {
  let calls = 0;
  const result = await handlePreflightWebhook("raw", "valid", webhookDependencies({
    id: "evt_other_refund",
    type: "charge.refunded",
    livemode: false,
    data: { object: {
      id: "ch_other",
      payment_intent: "pi_other",
      amount: 900,
      amount_refunded: 900,
      refunded: true,
    } },
  }, { recordStripeEvent: async () => { calls += 1; return true; } }, {
    retrievePaymentIntent: async () => ({ id: "pi_other", livemode: false, metadata: { service: "other" } }),
  }));
  assert.equal(result.handled, false);
  assert.equal(calls, 0);
});

test("production routes preserve raw verification, mode segregation, and server-verified success", async () => {
  const server = await readFile(new URL("../src/lib/designer-preflight-server.ts", import.meta.url), "utf8");
  const service = await readFile(new URL("../src/lib/designer-preflight-service.mjs", import.meta.url), "utf8");
  const webhook = await readFile(new URL("../src/app/api/stripe/webhook/route.ts", import.meta.url), "utf8");
  const success = await readFile(new URL("../src/app/designer-pattern-preflight/success/page.tsx", import.meta.url), "utf8");
  const cancel = await readFile(new URL("../src/app/designer-pattern-preflight/cancel/page.tsx", import.meta.url), "utf8");
  assert.match(server, /metadata: \{ service: input\.serviceKey, submission_id: input\.submissionId \}/);
  assert.match(server, /STRIPE_MODE/);
  assert.match(service, /sk_test_|rk_test_/);
  assert.match(service, /sk_live_|rk_live_/);
  assert.match(server, /STRIPE_SECRET_KEY does not match STRIPE_MODE/);
  assert.match(server, /process_designer_preflight_stripe_event_v2/);
  assert.match(webhook, /request\.text\(\)/);
  assert.doesNotMatch(webhook, /request\.json\(\)/);
  assert.match(webhook, /constructEvent/);
  assert.match(webhook, /retrievePaymentIntent/);
  assert.doesNotMatch(webhook, /error instanceof Error|error\.message/);
  const submissionRoute = await readFile(new URL("../src/app/api/designer-preflight/submissions/route.ts", import.meta.url), "utf8");
  assert.doesNotMatch(submissionRoute, /error instanceof Error|error\.message/);
  assert.match(success, /checkout\.sessions\.retrieve/);
  assert.match(success, /session\.livemode === getExpectedStripeLivemode\(\)/);
  assert.match(success, /payment_status === "paid"/);
  assert.match(cancel, /You were not charged/);
});

test("database migrations enforce private durable ops, executable retention, and mode-safe reconciliation", async () => {
  const baseMigration = await readFile(new URL("../supabase/migrations/20260816_designer_pattern_preflight.sql", import.meta.url), "utf8");
  const opsMigration = await readFile(new URL("../supabase/migrations/20260818_designer_pattern_preflight_ops_hardening.sql", import.meta.url), "utf8");
  const phase2 = await readFile(new URL("../docs/designer-preflight-mode-enforcement-phase2.sql", import.meta.url), "utf8");
  assert.match(baseMigration, /enable row level security/g);
  assert.match(baseMigration, /revoke all on table public\.designer_preflight_submissions from public, anon, authenticated/);
  assert.match(baseMigration, /stripe_event_id text primary key/);
  assert.doesNotMatch(baseMigration, /storage\.buckets|insert into storage/i);

  assert.match(opsMigration, /create table if not exists public\.designer_preflight_outbox/);
  assert.match(opsMigration, /\bbegin;[\s\S]*\bcommit;\s*$/);
  assert.match(opsMigration, /stripe_livemode boolean not null/);
  assert.match(opsMigration, /on delete restrict/);
  assert.match(opsMigration, /alter column secure_share_url drop not null/);
  assert.match(opsMigration, /process_designer_preflight_stripe_event_v2/);
  assert.match(
    opsMigration,
    /create or replace function public\.process_designer_preflight_stripe_event\([\s\S]*?p_payment_status is null or p_payment_status not in/
  );
  assert.match(opsMigration, /'partially_refunded', 'refunded', 'disputed', 'dispute_won', 'dispute_lost'/);
  assert.match(opsMigration, /run_designer_preflight_retention/);
  assert.match(opsMigration, /run_designer_preflight_ops_watchdog/);
  assert.match(opsMigration, /plan_designer_preflight_ops_watchdog/);
  assert.match(opsMigration, /start_designer_preflight_review/);
  assert.match(opsMigration, /mark_designer_preflight_report_ready/);
  assert.match(opsMigration, /claim_designer_preflight_outbox/);
  assert.match(opsMigration, /customer_name = null/);
  assert.match(opsMigration, /designer_preflight_submissions_anonymized_pii_check/);
  assert.match(opsMigration, /checkout_reconciliation_due/);
  assert.match(opsMigration, /safe_orphan_cleanup_due/);
  assert.match(opsMigration, /created_at <= effective_now - interval '7 days'/);
  assert.match(opsMigration, /stripe_checkout_session_id is null\s+and checkout_url is null/);
  assert.match(opsMigration, /lease_token uuid/);
  assert.match(opsMigration, /claim_designer_preflight_outbox\(\s*p_worker_id text,\s*p_stripe_livemode boolean/);
  assert.match(opsMigration, /complete_designer_preflight_outbox\([\s\S]*?p_lease_token uuid,[\s\S]*?p_stripe_livemode boolean/);
  assert.match(opsMigration, /revoke all on table public\.designer_preflight_outbox from public, anon, authenticated, service_role/);
  assert.match(opsMigration, /anonymize_designer_preflight_submission\(uuid, boolean, text, boolean\)/g);
  assert.doesNotMatch(opsMigration, /drop constraint if exists designer_preflight_submissions_request_id_key/);
  assert.doesNotMatch(opsMigration, /designer_preflight_submissions_request_mode_key/);
  assert.doesNotMatch(opsMigration, /amount_refunded_cents integer not null default 0/);
  assert.doesNotMatch(opsMigration, /set search_path = public, pg_temp/);
  assert.doesNotMatch(opsMigration, /\bp_now\b/);
  assert.doesNotMatch(opsMigration, /outbox_dedupe_key\s*:=\s*[^;]*p_event_id/);
  assert.doesNotMatch(opsMigration, /outbox_dedupe_key\s*:=\s*'stripe:/);
  assert.match(opsMigration, /':refund:partial:' \|\| p_amount_refunded_cents::text/);
  assert.match(opsMigration, /p_payment_state = 'partially_refunded'[\s\S]*?when status = 'awaiting_payment'[\s\S]*?'payment_paid'/);
  assert.match(opsMigration, /':dispute:' \|\| p_dispute_status/);
  assert.match(opsMigration, /p_payment_state is null/);
  assert.match(opsMigration, /p_limit is null or p_limit < 1/);
  assert.match(opsMigration, /p_worker_id is null or p_worker_id !~/);
  assert.match(opsMigration, /p_error_code is null or p_error_code !~/);
  assert.match(opsMigration, /p_retry_seconds is null or p_retry_seconds < 60/);
  assert.match(opsMigration, /stripe_checkout_session_id = p_checkout_session_id[\s\S]*checkout_url = p_checkout_url/);

  const securityDefinerCount = (opsMigration.match(/security definer/g) || []).length;
  const emptySearchPathCount = (opsMigration.match(/set search_path = ''/g) || []).length;
  assert.equal(securityDefinerCount, emptySearchPathCount);

  assert.match(phase2, /OWNER-GATED POST-DEPLOY PHASE 2/);
  assert.match(phase2, /check \(stripe_livemode is not null\) not valid/);
  assert.match(phase2, /designer_preflight_stripe_events_stripe_mode_required/);
  assert.match(phase2, /revoke execute on function public\.process_designer_preflight_stripe_event/);
  assert.match(phase2, /revoke insert, update, delete on table public\.designer_preflight_stripe_events from service_role/);
  assert.match(phase2, /service_role still has direct CRUD on[\s\S]*designer_preflight_submissions/);

  const outboxDefinition = opsMigration.slice(
    opsMigration.indexOf("create table if not exists public.designer_preflight_outbox"),
    opsMigration.indexOf("comment on table public.designer_preflight_outbox")
  );
  assert.doesNotMatch(outboxDefinition, /customer_name|customer_email|secure_share_url|pattern_title|comments|payload|stripe_event_id/i);
});

test("watchdog runner is plan-only by default and requires dual guards for mutation", async () => {
  const script = await readFile(new URL("../scripts/designer-preflight-ops-watchdog.mjs", import.meta.url), "utf8");
  assert.match(script, /STRIPE_MODE/);
  assert.match(script, /plan_designer_preflight_ops_watchdog/);
  assert.match(script, /run_designer_preflight_ops_watchdog/);
  assert.match(script, /--apply/);
  assert.match(script, /DESIGNER_PREFLIGHT_OPS_APPLY_CONFIRM/);
  assert.match(script, /apply-designer-preflight-live/);
  assert.match(script, /stripeMode/);
  assert.doesNotMatch(script, /p_now/);
  assert.doesNotMatch(script, /customer_name|customer_email|secure_share_url|pattern_title|comments/);
});

test("analytics helper sends only a constant service slug and never form data", async () => {
  const analytics = await readFile(new URL("../src/lib/designer-preflight-analytics.ts", import.meta.url), "utf8");
  const form = await readFile(new URL("../src/app/designer-pattern-preflight/DesignerPreflightForm.tsx", import.meta.url), "utf8");
  assert.match(analytics, /service_slug: "designer-pattern-preflight"/);
  assert.doesNotMatch(analytics, /email|patternTitle|secureShareUrl|comments|fileName/);
  assert.doesNotMatch(form, /trackDesignerPreflightEvent\([^)]*,/);
});
