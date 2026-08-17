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
  PREFLIGHT_SERVICE_KEY,
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

test("checkout creation uses one $9 payment and internal-only metadata inputs", async () => {
  let checkoutInput;
  let idempotencyKey;
  const repository = {
    findByRequestId: async () => null,
    create: async () => ({ id: submissionId, checkoutUrl: null }),
    isDuplicateRequestError: () => false,
    saveCheckout: async () => undefined,
  };
  const checkout = {
    createSession: async (input, key) => {
      checkoutInput = input;
      idempotencyKey = key;
      return { id: "cs_test_123", url: "https://checkout.stripe.com/c/pay/cs_test_123" };
    },
  };

  const result = await createPreflightCheckout(validPayload(), { repository, checkout });
  assert.equal(result.ok, true);
  assert.equal(checkoutInput.amountCents, PREFLIGHT_AMOUNT_CENTS);
  assert.equal(checkoutInput.amountCents, 900);
  assert.equal(checkoutInput.serviceKey, PREFLIGHT_SERVICE_KEY);
  assert.equal(checkoutInput.submissionId, submissionId);
  assert.equal(Object.hasOwn(checkoutInput, "secureShareUrl"), false);
  assert.match(idempotencyKey, new RegExp(requestId));
});

test("duplicate form submission reuses its saved Checkout Session", async () => {
  let checkoutCalls = 0;
  const result = await createPreflightCheckout(validPayload(), {
    repository: {
      findByRequestId: async () => ({ id: submissionId, checkoutUrl: "https://checkout.stripe.com/existing" }),
      isDuplicateRequestError: () => false,
    },
    checkout: { createSession: async () => { checkoutCalls += 1; } },
  });
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
  assert.equal(result.checkoutUrl, "https://checkout.stripe.com/existing");
  assert.equal(checkoutCalls, 0);
});

test("webhook rejects a missing or invalid signature before database work", async () => {
  let repositoryCalls = 0;
  const repository = { recordStripeEvent: async () => { repositoryCalls += 1; return true; } };
  const missing = await handlePreflightWebhook("{}", "", { constructEvent: () => ({}), repository });
  const invalid = await handlePreflightWebhook("{}", "bad", { constructEvent: () => { throw new Error("bad signature"); }, repository });
  assert.equal(missing.status, 400);
  assert.equal(invalid.status, 400);
  assert.equal(repositoryCalls, 0);
});

test("paid webhook passes a valid internal ID to one atomic repository call", async () => {
  let recorded;
  const event = {
    id: "evt_paid_1",
    type: "checkout.session.completed",
    data: { object: {
      id: "cs_test_paid",
      payment_status: "paid",
      payment_intent: "pi_test_paid",
      metadata: { service: PREFLIGHT_SERVICE_KEY, submission_id: submissionId },
    } },
  };
  const result = await handlePreflightWebhook("raw", "valid", {
    constructEvent: () => event,
    repository: { recordStripeEvent: async (input) => { recorded = input; return true; } },
  });
  assert.equal(result.ok, true);
  assert.equal(result.handled, true);
  assert.equal(recorded.paymentStatus, "paid");
  assert.equal(recorded.submissionId, submissionId);
});

test("duplicate webhook delivery is acknowledged without repeat fulfillment", async () => {
  const event = {
    id: "evt_duplicate",
    type: "checkout.session.completed",
    data: { object: {
      id: "cs_test_duplicate",
      payment_status: "paid",
      payment_intent: null,
      metadata: { service: PREFLIGHT_SERVICE_KEY, submission_id: submissionId },
    } },
  };
  const result = await handlePreflightWebhook("raw", "valid", {
    constructEvent: () => event,
    repository: { recordStripeEvent: async () => false },
  });
  assert.equal(result.ok, true);
  assert.equal(result.duplicate, true);
});

test("webhook rejects invalid submission IDs and ignores unpaid completion events", async () => {
  let calls = 0;
  const repository = { recordStripeEvent: async () => { calls += 1; return true; } };
  const invalidId = await handlePreflightWebhook("raw", "valid", {
    constructEvent: () => ({ id: "evt_1", type: "checkout.session.completed", data: { object: { id: "cs_1", payment_status: "paid", metadata: { service: PREFLIGHT_SERVICE_KEY, submission_id: "not-a-uuid" } } } }),
    repository,
  });
  const unpaid = await handlePreflightWebhook("raw", "valid", {
    constructEvent: () => ({ id: "evt_2", type: "checkout.session.completed", data: { object: { id: "cs_2", payment_status: "unpaid", metadata: { service: PREFLIGHT_SERVICE_KEY, submission_id: submissionId } } } }),
    repository,
  });
  assert.equal(invalidId.status, 400);
  assert.equal(unpaid.handled, false);
  assert.equal(calls, 0);
});

test("production routes preserve Stripe metadata, raw webhook verification, and server-verified success", async () => {
  const server = await readFile(new URL("../src/lib/designer-preflight-server.ts", import.meta.url), "utf8");
  const webhook = await readFile(new URL("../src/app/api/stripe/webhook/route.ts", import.meta.url), "utf8");
  const success = await readFile(new URL("../src/app/designer-pattern-preflight/success/page.tsx", import.meta.url), "utf8");
  const cancel = await readFile(new URL("../src/app/designer-pattern-preflight/cancel/page.tsx", import.meta.url), "utf8");
  assert.match(server, /metadata: \{ service: input\.serviceKey, submission_id: input\.submissionId \}/);
  assert.match(server, /idempotencyKey/);
  assert.match(webhook, /request\.text\(\)/);
  assert.doesNotMatch(webhook, /request\.json\(\)/);
  assert.match(webhook, /constructEvent/);
  assert.match(success, /checkout\.sessions\.retrieve/);
  assert.match(success, /payment_status === "paid"/);
  assert.match(cancel, /You were not charged/);
});

test("database migration enables RLS, blocks browser roles, and creates no storage bucket", async () => {
  const migration = await readFile(new URL("../supabase/migrations/20260816_designer_pattern_preflight.sql", import.meta.url), "utf8");
  assert.match(migration, /enable row level security/g);
  assert.match(migration, /revoke all on table public\.designer_preflight_submissions from public, anon, authenticated/);
  assert.match(migration, /stripe_event_id text primary key/);
  assert.match(migration, /security definer/);
  assert.doesNotMatch(migration, /storage\.buckets|insert into storage/i);
});

test("analytics helper sends only a constant service slug and never form data", async () => {
  const analytics = await readFile(new URL("../src/lib/designer-preflight-analytics.ts", import.meta.url), "utf8");
  const form = await readFile(new URL("../src/app/designer-pattern-preflight/DesignerPreflightForm.tsx", import.meta.url), "utf8");
  assert.match(analytics, /service_slug: "designer-pattern-preflight"/);
  assert.doesNotMatch(analytics, /email|patternTitle|secureShareUrl|comments|fileName/);
  assert.doesNotMatch(form, /trackDesignerPreflightEvent\([^)]*,/);
});
