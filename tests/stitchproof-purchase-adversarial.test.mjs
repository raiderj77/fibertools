import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  STITCHPROOF_AMOUNT_CENTS, STITCHPROOF_OFFER_VERSION, STITCHPROOF_SCHEMA_VERSION,
  STITCHPROOF_SERVICE, STITCHPROOF_STRIPE_ACCOUNT_ID,
} from "../src/lib/stitchproof-purchase-config.mjs";
import {
  handleStitchProofAccessRequest, handleStitchProofCheckoutRequest,
  handleStitchProofWebhookRequest,
} from "../src/lib/stitchproof-purchase-service.mjs";

// Independent synthetic fixtures: no provider, customer, pattern, or credential data.
const NOW = new Date("2026-08-26T20:00:00.000Z");
const ORIGIN = "http://localhost:3000";
const IDENTITY = Object.freeze({
  projectId: "11111111-1111-4111-8111-111111111111",
  claimSecret: "a".repeat(64),
});
const OTHER_PROJECT = "22222222-2222-4222-8222-222222222222";
const ATTEMPT = "33333333-3333-4333-8333-333333333333";
const HASH = createHash("sha256").update(IDENTITY.claimSecret).digest("hex");
const clone = (value) => structuredClone(value);
const refund = (overrides = {}) => ({ id: "re_AuditOnly", object: "refund", currency: "usd",
  payment_intent: "pi_AuditOnly", charge: "ch_AuditOnly", amount: 1, status: "succeeded", ...overrides });
const dispute = (overrides = {}) => ({ id: "dp_AuditOnly", object: "dispute", currency: "usd", livemode: false,
  payment_intent: "pi_AuditOnly", charge: "ch_AuditOnly", amount: 900, status: "needs_response", ...overrides });

function testEnvironment(overrides = {}) {
  return {
    STRIPE_MODE: "test", STRIPE_SECRET_KEY: "sk_test_synthetic_stitchproof",
    FIBERTOOLS_STRIPE_ACCOUNT_ID: STITCHPROOF_STRIPE_ACCOUNT_ID,
    NEXT_PUBLIC_SITE_URL: ORIGIN, NODE_ENV: "test", VERCEL_ENV: "development",
    SUPABASE_URL: "https://synthetic-audit.supabase.co", SUPABASE_SECRET_KEY: "synthetic-unit-role",
    STITCHPROOF_CHECKOUT_ENABLED: "true", STITCHPROOF_STRIPE_PRODUCT_ID: "prod_AuditOnly",
    STITCHPROOF_STRIPE_PRICE_ID: "price_AuditOnly", STITCHPROOF_STRIPE_WEBHOOK_SECRET: "whsec_syntheticOnly",
    STITCHPROOF_APPLIED_MIGRATION_VERSION: STITCHPROOF_SCHEMA_VERSION,
    STITCHPROOF_SCHEMA_CONFIRMED: "true", STITCHPROOF_WEBHOOK_CONFIRMED: "true",
    STITCHPROOF_ABUSE_PROTECTION_PROVIDER: "OTHER_VERIFIED_PROVIDER",
    STITCHPROOF_ABUSE_PROTECTION_CONFIRMED: "true", STITCHPROOF_TAX_MODE: "none",
    STITCHPROOF_TAX_BEHAVIOR: "not_applicable", STITCHPROOF_TAX_CONFIGURATION_CONFIRMED: "true",
    ...overrides,
  };
}

function fixture({ paid = true, attached = true, known = true } = {}) {
  const metadata = { service: STITCHPROOF_SERVICE, offer_version: STITCHPROOF_OFFER_VERSION,
    project_id: IDENTITY.projectId, attempt_id: ATTEMPT, claim_sha256: HASH };
  const price = { id: "price_AuditOnly", object: "price", currency: "usd", unit_amount: STITCHPROOF_AMOUNT_CENTS,
    type: "one_time", recurring: null, livemode: false, active: true, tax_behavior: "unspecified",
    product: { id: "prod_AuditOnly", object: "product", active: true, livemode: false,
      metadata: { service: STITCHPROOF_SERVICE, offer_version: STITCHPROOF_OFFER_VERSION } } };
  const purchase = { projectId: IDENTITY.projectId, claimSha256: HASH, stripeLivemode: false,
    attempt: { id: ATTEMPT, stripeAccountId: STITCHPROOF_STRIPE_ACCOUNT_ID,
      productId: price.product.id, priceId: price.id, offerVersion: STITCHPROOF_OFFER_VERSION,
      amountCents: STITCHPROOF_AMOUNT_CENTS, currency: "usd", taxMode: "none", taxBehavior: "not_applicable",
      status: attached ? "paid" : "creating", checkoutSessionId: attached ? "cs_test_AuditOnly" : null,
      createdAt: NOW.toISOString() } };
  const session = { id: "cs_test_AuditOnly", object: "checkout.session", mode: "payment", livemode: false,
    status: paid ? "complete" : "open", payment_status: paid ? "paid" : "unpaid", metadata,
    client_reference_id: IDENTITY.projectId, payment_method_types: ["card"], allow_promotion_codes: false,
    currency: "usd", amount_subtotal: STITCHPROOF_AMOUNT_CENTS, amount_total: STITCHPROOF_AMOUNT_CENTS,
    total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
    automatic_tax: { enabled: false }, payment_intent: paid ? "pi_AuditOnly" : null,
    url: "https://checkout.stripe.com/c/pay/cs_test_AuditOnly", expires_at: NOW.getTime() / 1000 + 3600,
    success_url: `${ORIGIN}/amigurumi-pattern-checker/designer?stitchproof=return`,
    cancel_url: `${ORIGIN}/amigurumi-pattern-checker/designer?stitchproof=cancel`,
    line_items: { has_more: false, data: [{ quantity: 1, currency: "usd", amount_subtotal: STITCHPROOF_AMOUNT_CENTS,
      amount_discount: 0, amount_tax: 0, amount_total: STITCHPROOF_AMOUNT_CENTS, price }] } };
  const payment = { id: "pi_AuditOnly", object: "payment_intent", livemode: false, status: "succeeded",
    currency: "usd", amount: STITCHPROOF_AMOUNT_CENTS, amount_received: STITCHPROOF_AMOUNT_CENTS,
    latest_charge: "ch_AuditOnly", metadata: clone(metadata) };
  const charge = { id: "ch_AuditOnly", object: "charge", livemode: false, payment_intent: payment.id,
    status: "succeeded", paid: true, captured: true, currency: "usd", amount: STITCHPROOF_AMOUNT_CENTS,
    amount_refunded: 0, refunded: false, disputed: false, payment_method_details: { type: "card" } };
  const state = { purchase, known, price, session, payment, charge, accountId: STITCHPROOF_STRIPE_ACCOUNT_ID, accountChargesEnabled: true,
    refunds: { has_more: false, data: [] }, disputes: { has_more: false, data: [] },
    event: { id: "evt_AuditOnly", type: "checkout.session.completed", livemode: false,
      data: { object: clone(session) } }, seenEvents: new Set(), calls: [], records: [], createKeys: [],
    providerCreates: 0, failAttachCount: 0, throwProvider: null };
  const call = (name, args) => { state.calls.push({ name, args: clone(args) });
    if (state.throwProvider === name) throw new Error("Synthetic provider failure; never surface this payload"); };
  const sameClaim = (value) => value.projectId === purchase.projectId
    && value.claimSha256 === purchase.claimSha256 && value.stripeLivemode === purchase.stripeLivemode;
  const createdByKey = new Map();
  const dependencies = {
    repository: {
      async verifySchema() { call("verifySchema", []); return STITCHPROOF_SCHEMA_VERSION; },
      async loadPurchase(value) { call("loadPurchase", value); return state.known && sameClaim(value) ? clone(purchase) : null; },
      async reserveAttempt(value) { call("reserveAttempt", value); if (!sameClaim(value)) return null;
        state.known = true; return clone(purchase); },
      async attachCheckout(value) { call("attachCheckout", value);
        if (state.failAttachCount-- > 0) throw new Error("Synthetic database save timeout");
        if (value.projectId !== purchase.projectId || value.attemptId !== purchase.attempt.id) return false;
        purchase.attempt.checkoutSessionId = value.sessionId; return true; },
      async recordVerification(value) { call("recordVerification", value); state.records.push(clone(value)); return true; },
      async loadWebhookAttempt(value) { call("loadWebhookAttempt", value);
        return sameClaim(value) && value.attemptId === ATTEMPT ? clone(purchase) : null; },
      async hasWebhookEvent(value) { call("hasWebhookEvent", value); return state.seenEvents.has(value.eventId); },
      async recordWebhookEvent(value) { call("recordWebhookEvent", value);
        if (state.seenEvents.has(value.eventId)) return false;
        state.seenEvents.add(value.eventId); state.records.push(clone(value)); return true; },
    },
    stripe: {
      async retrieveAccount() { call("retrieveAccount", []); return { id: state.accountId,
        ...(state.accountChargesEnabled === undefined ? {} : { charges_enabled: state.accountChargesEnabled }) }; },
      async retrievePrice() { call("retrievePrice", []); return clone(state.price); },
      async retrieveCheckoutSession(id) { call("retrieveCheckoutSession", [id]); return clone(state.session); },
      async retrievePaymentIntent(id) { call("retrievePaymentIntent", [id]); return clone(state.payment); },
      async retrieveCharge(id) { call("retrieveCharge", [id]); return clone(state.charge); },
      async listRefunds(id) { call("listRefunds", [id]); return clone(state.refunds); },
      async listDisputes(id) { call("listDisputes", [id]); return clone(state.disputes); },
      async createCheckoutSession(value, idempotencyKey) {
        call("createCheckoutSession", value); state.createKeys.push(idempotencyKey);
        if (!createdByKey.has(idempotencyKey)) { state.providerCreates += 1; createdByKey.set(idempotencyKey, clone(state.session)); }
        return clone(createdByKey.get(idempotencyKey));
      },
      constructWebhookEvent() { call("constructWebhookEvent", []); return clone(state.event); },
    },
  };
  const request = (path, body = IDENTITY, headers = {}) => new Request(`${ORIGIN}/api/stitchproof/${path}`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: ORIGIN, "Sec-Fetch-Site": "same-origin", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  return { state, dependencies, request,
    access: (body = IDENTITY, options = {}) => handleStitchProofAccessRequest({ request: request("access", body, options.headers),
      env: testEnvironment(options.env), dependencies, now: options.now ?? NOW }),
    checkout: (body = IDENTITY, options = {}) => handleStitchProofCheckoutRequest({ request: request("checkout", body, options.headers),
      env: testEnvironment(options.env), dependencies, now: NOW }),
    webhook: () => handleStitchProofWebhookRequest({ request: request("webhook", "{}", { "Stripe-Signature": "synthetic-signature" }),
      env: testEnvironment(), dependencies, now: NOW }),
  };
}

async function accessStatus(f) { return (await (await f.access()).json()).status; }

test("independent paid-access baseline checks current session, intent, charge, refunds and disputes", async () => {
  const f = fixture();
  assert.equal(await accessStatus(f), "paid");
  for (const name of ["retrieveAccount", "retrieveCheckoutSession", "retrievePaymentIntent", "retrieveCharge", "listRefunds", "listDisputes"]) {
    assert.equal(f.state.calls.filter((entry) => entry.name === name).length, 1, name);
  }
  assert.equal(f.state.records[0].status, "paid");
});

test("credential/request allowlist rejects arrays, coercion, extra source data and oversized payloads before dependency use", async (t) => {
  const cases = [
    ["project array", { ...IDENTITY, projectId: [IDENTITY.projectId] }],
    ["claim array", { ...IDENTITY, claimSecret: [IDENTITY.claimSecret] }],
    ["non-v4", { ...IDENTITY, projectId: "11111111-1111-1111-8111-111111111111" }],
    ["uppercase", { ...IDENTITY, claimSecret: "A".repeat(64) }],
    ["missing claim", { projectId: IDENTITY.projectId }],
    ["pattern extra", { ...IDENTITY, patternText: "SYNTHETIC PRIVATE PATTERN MUST NOT CROSS" }],
    ["local paid flag", { ...IDENTITY, paid: true }],
    ["oversized body", JSON.stringify({ ...IDENTITY, padding: "x".repeat(1025) })],
    ["invalid JSON", "{"], ["null", "null"], ["array", "[]"],
  ];
  for (const [label, body] of cases) await t.test(label, async () => {
    const f = fixture(); const response = await f.access(body);
    assert.equal(response.status, 400); assert.equal(f.state.calls.length, 0);
  });
  for (const headers of [{ Origin: "https://unrelated.example" }, { "Sec-Fetch-Site": "cross-site" },
    { "Content-Type": "text/plain" }, { "Content-Length": "2000" }]) {
    const f = fixture(); assert.equal((await f.checkout(IDENTITY, { headers })).status, 400);
    assert.equal(f.state.calls.length, 0);
  }
});

test("wrong project or recovery secret cannot authorize or replace the known purchase", async () => {
  for (const identity of [{ ...IDENTITY, projectId: OTHER_PROJECT }, { ...IDENTITY, claimSecret: "b".repeat(64) }]) {
    const f = fixture(); assert.notEqual((await (await f.access(identity)).json()).status, "paid");
    assert.notEqual((await (await f.checkout(identity)).json()).status, "paid");
    assert.equal(f.state.providerCreates, 0); assert.equal(f.state.records.length, 0);
    assert.equal(f.state.purchase.projectId, IDENTITY.projectId); assert.equal(f.state.purchase.claimSha256, HASH);
  }
});

test("a repository returning a different claimant cannot unlock access or reuse its payment", async () => {
  const f = fixture();
  f.dependencies.repository.loadPurchase = async () => ({ ...clone(f.state.purchase), projectId: OTHER_PROJECT });
  assert.notEqual(await accessStatus(f), "paid");
  assert.notEqual((await (await f.checkout()).json()).status, "paid");
  assert.equal(f.state.calls.some((entry) => entry.name === "retrieveCheckoutSession"), false);
  assert.equal(f.state.providerCreates, 0);
});

test("undeclared oversized request streams are canceled before provider or repository access", async () => {
  const f = fixture(); let pulls = 0; let canceled = false;
  const body = new ReadableStream({
    pull(controller) { pulls += 1; controller.enqueue(new Uint8Array(1025)); },
    cancel() { canceled = true; },
  });
  const request = new Request(`${ORIGIN}/api/stitchproof/access`, { method: "POST", body, duplex: "half",
    headers: { "Content-Type": "application/json", Origin: ORIGIN } });
  const response = await handleStitchProofAccessRequest({ request, env: testEnvironment(), dependencies: f.dependencies, now: NOW });
  assert.equal(response.status, 400); assert.equal(canceled, true); assert.ok(pulls <= 2);
  assert.equal(f.state.calls.length, 0);
});

test("only the claim hash crosses the dependency boundary; access responses do not echo provider payloads", async () => {
  const f = fixture(); const response = await f.access();
  assert.deepEqual(await response.json(), { status: "paid" });
  const calls = JSON.stringify(f.state.calls);
  assert.equal(calls.includes(IDENTITY.claimSecret), false);
  assert.equal(calls.includes(HASH), true);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
});

test("independent account, session, price and financial cross-binding tamper matrix denies access", async (t) => {
  const mutations = {
    "wrong retrieved account": (s) => { s.accountId = "acct_Unrelated"; },
    "wrong stored account": (s) => { s.purchase.attempt.stripeAccountId = "acct_Unrelated"; },
    "wrong stored mode": (s) => { s.purchase.stripeLivemode = true; },
    "wrong session ID": (s) => { s.session.id = "cs_test_Other"; },
    "wrong session mode": (s) => { s.session.livemode = true; },
    "wrong session service": (s) => { s.session.metadata.service = "other_service"; },
    "wrong project metadata": (s) => { s.session.metadata.project_id = OTHER_PROJECT; },
    "wrong claim metadata": (s) => { s.session.metadata.claim_sha256 = "f".repeat(64); },
    "wrong attempt metadata": (s) => { s.session.metadata.attempt_id = OTHER_PROJECT; },
    "wrong client reference": (s) => { s.session.client_reference_id = OTHER_PROJECT; },
    "subscription": (s) => { s.session.mode = "subscription"; },
    "non-card methods": (s) => { s.session.payment_method_types = ["card", "us_bank_account"]; },
    "promotion enabled": (s) => { s.session.allow_promotion_codes = true; },
    "wrong currency": (s) => { s.session.currency = "eur"; },
    "wrong amount": (s) => { s.session.amount_total = 899; },
    "extra line item": (s) => { s.session.line_items.data.push(clone(s.session.line_items.data[0])); },
    "truncated line items": (s) => { s.session.line_items.has_more = true; },
    "quantity two": (s) => { s.session.line_items.data[0].quantity = 2; },
    "wrong price": (s) => { s.session.line_items.data[0].price.id = "price_Other"; },
    "wrong product": (s) => { s.session.line_items.data[0].price.product.id = "prod_Other"; },
    "recurring price": (s) => { s.session.line_items.data[0].price.type = "recurring"; },
    "live price": (s) => { s.session.line_items.data[0].price.livemode = true; },
    "unpaid session": (s) => { s.session.payment_status = "unpaid"; },
    "wrong payment intent": (s) => { s.payment.id = "pi_Other"; },
    "pending payment": (s) => { s.payment.status = "processing"; },
    "live payment": (s) => { s.payment.livemode = true; },
    "under-received payment": (s) => { s.payment.amount_received = 899; },
    "wrong intent metadata": (s) => { s.payment.metadata.project_id = OTHER_PROJECT; },
    "wrong latest charge": (s) => { s.payment.latest_charge = "ch_Other"; },
    "wrong stored intent": (s) => { s.purchase.attempt.paymentIntentId = "pi_Other"; },
    "foreign charge intent": (s) => { s.charge.payment_intent = "pi_Other"; },
    "live charge": (s) => { s.charge.livemode = true; },
    "uncaptured charge": (s) => { s.charge.captured = false; },
    "unpaid charge": (s) => { s.charge.paid = false; },
    "non-card charge": (s) => { s.charge.payment_method_details.type = "us_bank_account"; },
    "invalid refunded amount": (s) => { s.charge.amount_refunded = -1; },
  };
  for (const [name, mutate] of Object.entries(mutations)) await t.test(name, async () => {
    const f = fixture(); mutate(f.state); assert.notEqual(await accessStatus(f), "paid");
  });
});

test("partial, full, pending and requires-action refunds revoke access despite an old paid record", async (t) => {
  for (const status of ["pending", "requires_action", "succeeded"]) await t.test(status, async () => {
    const f = fixture(); f.state.refunds.data = [refund({ status })];
    assert.notEqual(await accessStatus(f), "paid"); assert.equal(f.state.records.at(-1).status, "refunded");
  });
  const partial = fixture(); partial.state.charge.amount_refunded = 1; partial.state.charge.refunded = false;
  assert.notEqual(await accessStatus(partial), "paid");
  const full = fixture(); full.state.charge.amount_refunded = 900; full.state.charge.refunded = true;
  assert.notEqual(await accessStatus(full), "paid");
  for (const status of ["failed", "canceled"]) {
    const f = fixture(); f.state.refunds.data = [refund({ amount: 900, status })];
    assert.equal(await accessStatus(f), "paid");
  }
});

test("current dispute resolution controls access, not historical charge.disputed alone", async (t) => {
  for (const status of ["won", "warning_closed", "prevented"]) await t.test(`resolved ${status}`, async () => {
    const f = fixture(); f.state.charge.disputed = true;
    f.state.disputes.data = [dispute({ status })];
    assert.equal(await accessStatus(f), "paid");
  });
  for (const status of ["needs_response", "under_review", "warning_needs_response", "warning_under_review", "lost", "future_unknown_status"]) {
    const f = fixture(); f.state.disputes.data = [dispute({ status })];
    assert.notEqual(await accessStatus(f), "paid", status);
  }
  const missing = fixture(); missing.state.charge.disputed = true;
  assert.notEqual(await accessStatus(missing), "paid");
});

test("incomplete, foreign and malformed financial lists fail closed", async () => {
  const mutations = [
    (s) => { s.refunds.has_more = true; }, (s) => { s.disputes.has_more = true; },
    (s) => { delete s.refunds.has_more; }, (s) => { s.disputes.data = null; },
    (s) => { s.refunds.data = [refund({ charge: "ch_Other", status: "failed" })]; },
    (s) => { s.refunds.data = [refund({ status: "unexpected" })]; },
    (s) => { s.refunds.data = [refund({ payment_intent: "pi_Other", status: "failed" })]; },
    (s) => { s.refunds.data = [refund({ livemode: true, status: "failed" })]; },
    (s) => { s.disputes.data = [dispute({ charge: "ch_Other", status: "won" })]; },
    (s) => { s.disputes.data = [dispute({ payment_intent: "pi_Other", status: "won" })]; },
    (s) => { s.disputes.data = [dispute({ livemode: true, status: "won" })]; },
  ];
  for (const mutate of mutations) { const f = fixture(); mutate(f.state); assert.notEqual(await accessStatus(f), "paid"); }
});

test("every subsequent export check refreshes finances and provider outages never authorize", async () => {
  const f = fixture(); assert.equal(await accessStatus(f), "paid");
  f.state.charge.amount_refunded = 1;
  assert.notEqual(await accessStatus(f), "paid");
  assert.equal(f.state.calls.filter((entry) => entry.name === "retrieveCharge").length, 2);
  for (const method of ["retrieveAccount", "retrieveCheckoutSession", "retrievePaymentIntent", "retrieveCharge", "listRefunds", "listDisputes"]) {
    const failing = fixture(); failing.state.throwProvider = method;
    const response = await failing.access(); assert.deepEqual(await response.json(), { status: "unavailable" });
  }
});

test("historical purchase remains usable when sales/readiness/current offer are disabled or replaced", async () => {
  const f = fixture(); f.state.price.active = false; f.state.price.product.active = false;
  const env = { STITCHPROOF_CHECKOUT_ENABLED: "false", STITCHPROOF_STRIPE_PRODUCT_ID: "", STITCHPROOF_STRIPE_PRICE_ID: "",
    STITCHPROOF_TAX_CONFIGURATION_CONFIRMED: "false", STITCHPROOF_SCHEMA_CONFIRMED: "false",
    STITCHPROOF_WEBHOOK_CONFIRMED: "false", STITCHPROOF_ABUSE_PROTECTION_CONFIRMED: "false" };
  assert.deepEqual(await (await f.access(IDENTITY, { env })).json(), { status: "paid" });
  assert.deepEqual(await (await f.checkout(IDENTITY, { env })).json(), { status: "paid" });
  assert.equal(f.state.calls.some((entry) => entry.name === "retrievePrice" || entry.name === "createCheckoutSession"), false);
});

test("disabled or missing account charges block new sales without revoking historical paid access", async () => {
  for (const chargesEnabled of [false, undefined, "true"]) {
    const fresh = fixture({ paid: false, attached: false, known: false });
    fresh.state.accountChargesEnabled = chargesEnabled;
    const availability = await handleStitchProofCheckoutRequest({
      request: new Request(`${ORIGIN}/api/stitchproof/checkout`), env: testEnvironment(), dependencies: fresh.dependencies, now: NOW,
    });
    assert.deepEqual(await availability.json(), { available: false });
    assert.equal((await fresh.checkout()).status, 503);
    assert.equal(fresh.state.providerCreates, 0);
    assert.equal(fresh.state.calls.some((entry) => entry.name === "reserveAttempt"), false);
    const historical = fixture(); historical.state.accountChargesEnabled = chargesEnabled;
    assert.deepEqual(await (await historical.access()).json(), { status: "paid" });
    assert.deepEqual(await (await historical.checkout()).json(), { status: "paid" });
    assert.equal(historical.state.providerCreates, 0);
  }
});

test("parallel checkout requests use one durable reservation identity and one provider idempotency key", async () => {
  const f = fixture({ paid: false, attached: false, known: false });
  const responses = await Promise.all(Array.from({ length: 12 }, () => f.checkout()));
  const results = await Promise.all(responses.map((response) => response.json()));
  assert.equal(results.every((result) => result.checkoutUrl === f.state.session.url), true);
  assert.equal(new Set(f.state.createKeys).size, 1); assert.equal(f.state.providerCreates, 1);
  assert.equal(f.state.createKeys[0], `stitchproof-test-${ATTEMPT}`);
});

test("provider success followed by database attachment timeout retries the same payable checkout", async () => {
  const f = fixture({ paid: false, attached: false }); f.state.failAttachCount = 1;
  assert.equal((await f.checkout()).status, 503);
  const retry = await f.checkout(); assert.equal(retry.status, 200);
  assert.equal((await retry.json()).checkoutUrl, f.state.session.url);
  assert.equal(f.state.providerCreates, 1); assert.equal(new Set(f.state.createKeys).size, 1);
});

test("an idempotent create retry returning the original already-paid checkout recovers access", async () => {
  const f = fixture({ paid: true, attached: false });
  assert.deepEqual(await (await f.checkout()).json(), { status: "paid" });
  assert.equal(f.state.purchase.attempt.checkoutSessionId, f.state.session.id);
  assert.equal(f.state.records.at(-1).status, "paid"); assert.equal(f.state.providerCreates, 1);
});

test("failed verification persistence cannot return paid access", async () => {
  const f = fixture(); f.dependencies.repository.recordVerification = async () => false;
  assert.deepEqual(await (await f.access()).json(), { status: "unavailable" });
  assert.notEqual((await (await f.checkout()).json()).status, "paid");
});

test("old unresolved creating attempts cannot silently generate another checkout", async () => {
  const f = fixture({ paid: false, attached: false });
  f.state.purchase.attempt.createdAt = new Date(NOW.getTime() - 3_600_001).toISOString();
  assert.equal((await f.checkout()).status, 409); assert.equal(f.state.providerCreates, 0);
});

test("duplicate and out-of-order completed webhooks cannot override current refunded/disputed finances", async () => {
  const f = fixture(); f.state.charge.amount_refunded = 1;
  assert.equal((await f.webhook()).status, 200); assert.equal(f.state.records.at(-1).status, "refunded");
  assert.deepEqual(await (await f.webhook()).json(), { received: true, handled: true, duplicate: true });
  assert.equal(f.state.records.length, 1);
  f.state.event.id = "evt_AuditOlderPaid"; f.state.charge.amount_refunded = 0;
  f.state.disputes.data = [dispute({ status: "under_review" })];
  assert.equal((await f.webhook()).status, 200); assert.equal(f.state.records.at(-1).status, "disputed");
});

test("webhook wrong mode/account, missing signature and foreign project metadata cannot mutate purchase", async () => {
  for (const mutate of [
    (s) => { s.event.livemode = true; }, (s) => { s.event.account = "acct_Unrelated"; },
    (s) => { s.event.data.object.metadata.project_id = OTHER_PROJECT; },
  ]) {
    const f = fixture(); mutate(f.state); assert.notEqual((await f.webhook()).status, 200); assert.equal(f.state.records.length, 0);
  }
  const f = fixture(); const response = await handleStitchProofWebhookRequest({ request: f.request("webhook", "{}"),
    env: testEnvironment(), dependencies: f.dependencies, now: NOW });
  assert.equal(response.status, 400); assert.equal(f.state.calls.length, 0);
});

test("a lost checkout attachment is recoverable from a signed, bound session event without checkout replay", async () => {
  const f = fixture({ attached: false });
  assert.equal((await f.webhook()).status, 200);
  assert.equal(f.state.purchase.attempt.checkoutSessionId, f.state.session.id);
  assert.equal(f.state.records.at(-1).status, "paid"); assert.equal(f.state.providerCreates, 0);
  assert.equal(await accessStatus(f), "paid");
});

test("actual SQL refuses a known-stale paid observation after a newer refund verification", async () => {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role;");
    await db.exec(await readFile(new URL("../supabase/migrations/20260826_stitchproof_project_entitlements.sql", import.meta.url), "utf8"));
    const f = fixture(); const attempt = f.state.purchase.attempt;
    const contract = { stripeAccountId: attempt.stripeAccountId, productId: attempt.productId, priceId: attempt.priceId,
      offerVersion: attempt.offerVersion, amountCents: attempt.amountCents, currency: attempt.currency,
      taxMode: attempt.taxMode, taxBehavior: attempt.taxBehavior };
    await db.query("select public.stitchproof_purchase_reserve($1,$2,$3,$4,$5,$6::jsonb)",
      [IDENTITY.projectId, HASH, false, ATTEMPT, null, JSON.stringify(contract)]);
    await db.query("select public.stitchproof_purchase_attach_checkout($1,$2,$3,$4,$5,$6)",
      [IDENTITY.projectId, false, ATTEMPT, f.state.session.id, f.state.payment.id, new Date(NOW.getTime() + 3_600_000).toISOString()]);
    const persist = async (value) => {
      const result = await db.query("select public.stitchproof_purchase_record_verification($1,$2,$3,$4,$5,$6,$7) as saved",
        [value.projectId, value.stripeLivemode, value.attemptId, value.sessionId, value.paymentIntentId, value.status, value.verifiedAt]);
      return result.rows[0].saved;
    };
    assert.equal(await persist({ projectId: IDENTITY.projectId, stripeLivemode: false, attemptId: ATTEMPT,
      sessionId: f.state.session.id, paymentIntentId: f.state.payment.id, status: "refunded",
      verifiedAt: new Date(NOW.getTime() + 1).toISOString() }), true);
    // This older in-flight response must not authorize after SQL has observed a newer refund.
    f.dependencies.repository.recordVerification = persist;
    assert.notEqual(await accessStatus(f), "paid");
    assert.notEqual((await (await f.access(IDENTITY, { now: new Date(NOW.getTime() + 1) })).json()).status, "paid",
      "conflicting observations in the same millisecond must not restore refunded access");
    const row = (await db.query("select status from public.stitchproof_purchase_attempts where id=$1", [ATTEMPT])).rows[0];
    assert.equal(row.status, "refunded");
  } finally { await db.close(); }
});

test("actual SQL keeps claimant/attempt/session bindings and denies browser roles private access", async () => {
  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role;");
    await db.exec(await readFile(new URL("../supabase/migrations/20260826_stitchproof_project_entitlements.sql", import.meta.url), "utf8"));
    for (const role of ["anon", "authenticated", "service_role"]) {
      await db.exec(`set role ${role}`);
      try {
        await assert.rejects(db.query("select * from public.stitchproof_purchase_projects"), /permission denied/);
        await assert.rejects(db.query("select public.stitchproof_purchase_snapshot($1,$2,$3)",
          [IDENTITY.projectId, false, ATTEMPT]), /permission denied/);
        if (role !== "service_role") await assert.rejects(db.query("select public.stitchproof_purchase_load($1,$2,$3)",
          [IDENTITY.projectId, HASH, false]), /permission denied/);
      } finally { await db.exec("reset role"); }
    }
    const contract = { stripeAccountId: STITCHPROOF_STRIPE_ACCOUNT_ID, productId: "prod_AuditOnly", priceId: "price_AuditOnly",
      offerVersion: STITCHPROOF_OFFER_VERSION, amountCents: 900, currency: "usd", taxMode: "none", taxBehavior: "not_applicable" };
    const reserve = async (projectId, hash, attemptId, expected = null) => (await db.query(
      "select public.stitchproof_purchase_reserve($1,$2,$3,$4,$5,$6::jsonb) as purchase",
      [projectId, hash, false, attemptId, expected, JSON.stringify(contract)])).rows[0].purchase;
    // PGlite queues database queries; this verifies the real RPC's idempotent contract,
    // not distributed PostgreSQL lock timing or live provider concurrency.
    const candidates = [ATTEMPT, "44444444-4444-4444-8444-444444444444", "55555555-5555-4555-8555-555555555555"];
    const reservations = await Promise.all(candidates.map((id) => reserve(IDENTITY.projectId, HASH, id)));
    assert.equal(new Set(reservations.map((entry) => entry.attempt.id)).size, 1);
    const reservedId = reservations[0].attempt.id;
    assert.equal((await db.query("select count(*)::int as count from public.stitchproof_purchase_attempts")).rows[0].count, 1);
    assert.equal(await reserve(IDENTITY.projectId, "b".repeat(64), OTHER_PROJECT), null);
    const loadWrong = await db.query("select public.stitchproof_purchase_load($1,$2,$3) as purchase",
      [IDENTITY.projectId, "b".repeat(64), false]);
    assert.equal(loadWrong.rows[0].purchase, null);
    const expiry = new Date(NOW.getTime() + 3_600_000).toISOString();
    const attach = async (projectId, attemptId, sessionId, paymentIntentId) => (await db.query(
      "select public.stitchproof_purchase_attach_checkout($1,$2,$3,$4,$5,$6) as attached",
      [projectId, false, attemptId, sessionId, paymentIntentId, expiry])).rows[0].attached;
    assert.equal(await attach(IDENTITY.projectId, reservedId, "cs_test_First", "pi_First"), true);
    assert.equal(await attach(IDENTITY.projectId, reservedId, "cs_test_First", "pi_First"), true);
    assert.equal(await attach(IDENTITY.projectId, reservedId, "cs_test_Replacement", "pi_First"), false);
    assert.equal(await attach(IDENTITY.projectId, reservedId, "cs_test_First", "pi_Replacement"), false);
    const second = await reserve(OTHER_PROJECT, "b".repeat(64), "66666666-6666-4666-8666-666666666666");
    await assert.rejects(attach(OTHER_PROJECT, second.attempt.id, "cs_test_First", "pi_Other"), /unique constraint/);
    await assert.rejects(attach(OTHER_PROJECT, second.attempt.id, "cs_test_Other", "pi_First"), /unique constraint/);
    const event = async (id, status, verifiedAt) => (await db.query(
      "select public.stitchproof_purchase_record_event($1,$2,$3,$4,$5,$6,$7,$8,$9) as recorded",
      [id, "checkout.session.completed", IDENTITY.projectId, false, reservedId, "cs_test_First", "pi_First", status, verifiedAt])).rows[0].recorded;
    assert.equal(await event("evt_First", "paid", NOW.toISOString()), true);
    assert.equal(await event("evt_First", "refunded", new Date(NOW.getTime() + 1).toISOString()), false);
    assert.equal((await db.query("select status from public.stitchproof_purchase_attempts where id=$1", [reservedId])).rows[0].status, "paid");
    assert.equal(await event("evt_Refund", "refunded", new Date(NOW.getTime() + 1).toISOString()), true);
    await assert.rejects(event("evt_StalePaid", "paid", NOW.toISOString()), /verification could not be recorded/);
    assert.equal((await db.query("select count(*)::int as count from public.stitchproof_purchase_webhook_events")).rows[0].count, 2,
      "a rejected financial observation must roll back its webhook receipt");
    assert.equal((await db.query("select status from public.stitchproof_purchase_attempts where id=$1", [reservedId])).rows[0].status, "refunded");
    const schema = (await db.query("select public.stitchproof_purchase_schema_version() as version")).rows[0].version;
    assert.equal(schema, STITCHPROOF_SCHEMA_VERSION);
  } finally { await db.close(); }
});
