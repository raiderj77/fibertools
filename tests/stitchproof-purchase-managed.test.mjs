import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import Stripe from "stripe";

import {
  STITCHPROOF_MANAGED_OFFER_VERSION, STITCHPROOF_MANAGED_SCHEMA_VERSION,
  STITCHPROOF_OFFER_VERSION, STITCHPROOF_SERVICE, STITCHPROOF_STRIPE_ACCOUNT_ID,
  getStitchProofConfiguration, getStitchProofEnvironmentReadiness,
} from "../src/lib/stitchproof-purchase-config.mjs";
import { STITCHPROOF_MARKETS, STITCHPROOF_MARKET_POLICY_VERSION,
  isStitchProofPurchaseCountry } from "../src/lib/stitchproof-markets.mjs";
import {
  buildStitchProofCheckoutParameters, getStitchProofCheckoutAvailability,
  handleStitchProofAccessRequest, handleStitchProofCheckoutRequest,
  handleStitchProofWebhookRequest, readStitchProofClaim, verifyStitchProofPurchase,
} from "../src/lib/stitchproof-purchase-service.mjs";

// Independent, entirely synthetic fixtures. No provider requests, customer data,
// legal tax classification, live activation, or real currency conversion occurs.
// These test the proposed contract; protected Stripe tax/FX/method tests remain
// mandatory. txcd_00000000 is a syntax-only sentinel, not a recommended tax code.
const NOW = new Date("2026-08-27T18:00:00.000Z");
const ORIGIN = "http://localhost:3000";
const TAX_CODE = "txcd_00000000";
const WEBHOOK_SECRET = "whsec_synthetic_managed_audit_only";
const PRIVATE_SENTINEL = "SYNTHETIC_PRIVATE_PROVIDER_PAYLOAD";
const IDENTITY = Object.freeze({ projectId: "44444444-4444-4444-8444-444444444444", claimSecret: "d".repeat(64) });
const ATTEMPT_ID = "55555555-5555-4555-8555-555555555555";
const OTHER_PROJECT = "66666666-6666-4666-8666-666666666666";
const CLAIM_HASH = createHash("sha256").update(IDENTITY.claimSecret, "utf8").digest("hex");
const clone = (value) => structuredClone(value);
const webhookSdk = new Stripe("sk_test_synthetic_managed_audit");

function environment(overrides = {}) {
  return {
    STRIPE_MODE: "test", STRIPE_SECRET_KEY: "sk_test_synthetic_managed_audit",
    FIBERTOOLS_STRIPE_ACCOUNT_ID: STITCHPROOF_STRIPE_ACCOUNT_ID,
    NEXT_PUBLIC_SITE_URL: ORIGIN, NODE_ENV: "test", VERCEL_ENV: "development",
    SUPABASE_URL: "https://synthetic-managed-audit.supabase.co", SUPABASE_SECRET_KEY: "synthetic-unit-role",
    STITCHPROOF_CHECKOUT_ENABLED: "true", STITCHPROOF_STRIPE_PRODUCT_ID: "prod_ManagedAudit",
    STITCHPROOF_STRIPE_PRICE_ID: "price_ManagedAudit", STITCHPROOF_STRIPE_WEBHOOK_SECRET: WEBHOOK_SECRET,
    STITCHPROOF_APPLIED_MIGRATION_VERSION: STITCHPROOF_MANAGED_SCHEMA_VERSION,
    STITCHPROOF_SCHEMA_CONFIRMED: "true", STITCHPROOF_WEBHOOK_CONFIRMED: "true",
    STITCHPROOF_ABUSE_PROTECTION_PROVIDER: "OTHER_VERIFIED_PROVIDER", STITCHPROOF_ABUSE_PROTECTION_CONFIRMED: "true",
    STITCHPROOF_TAX_MODE: "managed", STITCHPROOF_TAX_BEHAVIOR: "exclusive",
    STITCHPROOF_TAX_CONFIGURATION_CONFIRMED: "true", STITCHPROOF_MANAGED_PAYMENTS_CONFIRMED: "true",
    STITCHPROOF_MANAGED_TAX_CODE: TAX_CODE, STITCHPROOF_MANAGED_COUNTRY_POLICY: STITCHPROOF_MARKET_POLICY_VERSION,
    STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED: "true",
    STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED: "true", STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED: "true",
    ...overrides,
  };
}

const liveEnvironment = (overrides = {}) => environment({
  STRIPE_MODE: "live", STRIPE_SECRET_KEY: "sk_live_synthetic_managed_audit",
  NEXT_PUBLIC_SITE_URL: "https://fibertools.app", NODE_ENV: "production", VERCEL_ENV: "production", ...overrides,
});

function contract({ managed = true, country = "US", taxBehavior = "exclusive" } = {}) {
  return {
    stripeAccountId: STITCHPROOF_STRIPE_ACCOUNT_ID, productId: managed ? "prod_ManagedAudit" : "prod_LegacyAudit",
    priceId: managed ? "price_ManagedAudit" : "price_LegacyAudit",
    offerVersion: managed ? STITCHPROOF_MANAGED_OFFER_VERSION : STITCHPROOF_OFFER_VERSION,
    amountCents: 900, currency: "usd", taxMode: managed ? "managed" : "none",
    taxBehavior: managed ? taxBehavior : "not_applicable",
    ...(managed ? { purchaseCountry: country, marketPolicyVersion: STITCHPROOF_MARKET_POLICY_VERSION, productTaxCode: TAX_CODE } : {}),
  };
}

function metadata(purchase) {
  const attempt = purchase.attempt;
  return {
    service: STITCHPROOF_SERVICE, offer_version: attempt.offerVersion, project_id: purchase.projectId,
    attempt_id: attempt.id, claim_sha256: purchase.claimSha256,
    ...(attempt.taxMode === "managed" ? { purchase_country: attempt.purchaseCountry,
      market_policy_version: attempt.marketPolicyVersion, product_tax_code: attempt.productTaxCode } : {}),
  };
}

function priceFor(attempt) {
  return {
    id: attempt.priceId, object: "price", currency: "usd", unit_amount: 900, type: "one_time",
    recurring: null, livemode: false, active: true, tax_behavior: attempt.taxMode === "none" ? "unspecified" : attempt.taxBehavior,
    currency_options: {}, product: { id: attempt.productId, object: "product", livemode: false, active: true,
      tax_code: attempt.productTaxCode ?? null,
      metadata: { service: STITCHPROOF_SERVICE, offer_version: attempt.offerVersion } },
  };
}

function providerObjects(purchase, { paid = true, tax = 0, status = paid ? "complete" : "open" } = {}) {
  const attempt = purchase.attempt;
  const managed = attempt.taxMode === "managed";
  const suffix = attempt.id.replaceAll("-", "");
  const sessionId = `cs_test_ManagedAudit${suffix}`;
  const paymentId = `pi_ManagedAudit${suffix}`;
  const chargeId = `ch_ManagedAudit${suffix}`;
  const inclusive = attempt.taxBehavior === "inclusive";
  // Deliberately independent fixture construction; do not use the production
  // parameter builder or verifier to manufacture the expected response.
  const total = inclusive ? 900 : 900 + tax;
  const subtotal = managed && inclusive ? 900 - tax : 900;
  const session = {
    id: sessionId, object: "checkout.session", livemode: false, mode: "payment", status,
    payment_status: paid ? "paid" : "unpaid", payment_intent: paid ? paymentId : null,
    client_reference_id: purchase.projectId, metadata: metadata(purchase), allow_promotion_codes: false,
    payment_method_types: managed ? ["card", "link"] : ["card"], currency: "usd",
    amount_subtotal: subtotal, amount_total: total,
    total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: tax },
    automatic_tax: { enabled: managed, status: managed && paid ? "complete" : null },
    ...(managed ? { managed_payments: { enabled: true } } : {}),
    line_items: { has_more: false, data: [{ quantity: 1, currency: "usd", amount_subtotal: subtotal,
      amount_total: total, amount_discount: 0, amount_tax: tax, price: priceFor(attempt) }] },
    expires_at: NOW.getTime() / 1000 + 3600, url: `https://checkout.stripe.com/c/pay/${sessionId}`,
    success_url: `${ORIGIN}/amigurumi-pattern-checker/designer?stitchproof=return`,
    cancel_url: `${ORIGIN}/amigurumi-pattern-checker/designer?stitchproof=cancel`,
  };
  const payment = { id: paymentId, object: "payment_intent", livemode: false, status: "succeeded",
    currency: "usd", amount: total, amount_received: total, latest_charge: chargeId, metadata: metadata(purchase),
    ...(managed ? { managed_payments: { enabled: true } } : {}) };
  const charge = { id: chargeId, object: "charge", livemode: false, status: "succeeded", paid: true, captured: true,
    currency: "usd", amount: total, amount_captured: total, amount_refunded: 0, refunded: false, disputed: false,
    payment_intent: paymentId, payment_method_details: { type: "card" }, metadata: metadata(purchase) };
  return { session, payment, charge };
}

function fixture({ managed = true, paid = true, attached = true, known = true,
  country = "US", taxBehavior = "exclusive", tax = 0, status } = {}) {
  const purchase = { projectId: IDENTITY.projectId, claimSha256: CLAIM_HASH, stripeLivemode: false,
    attempt: { ...contract({ managed, country, taxBehavior }), id: ATTEMPT_ID,
      status: attached ? (status === "expired" ? "expired" : paid ? "paid" : "pending") : "creating",
      checkoutSessionId: null, paymentIntentId: null, createdAt: NOW.toISOString() } };
  const initial = providerObjects(purchase, { paid, tax, ...(status ? { status } : {}) });
  if (attached) {
    purchase.attempt.checkoutSessionId = initial.session.id;
    purchase.attempt.paymentIntentId = paid ? initial.payment.id : null;
  }
  const state = {
    purchase, known, ...initial, price: priceFor(contract({ taxBehavior })), schema: STITCHPROOF_MANAGED_SCHEMA_VERSION,
    account: { id: STITCHPROOF_STRIPE_ACCOUNT_ID, charges_enabled: true },
    sessions: new Map(), payments: new Map(), charges: new Map(), attempts: new Map([[ATTEMPT_ID, clone(purchase)]]),
    refunds: { has_more: false, data: [] }, disputes: { has_more: false, data: [] },
    calls: [], reservations: [], records: [], createKeys: [], seenEvents: new Set(), createdByKey: new Map(),
    providerCreates: 0, failOn: null, failAttachCount: 0, verificationSaved: true,
    createPaid: paid, createTax: tax, mutateCreatedSession: null,
    event: { id: "evt_ManagedAudit", object: "event", type: "checkout.session.completed", livemode: false,
      data: { object: clone(initial.session) } },
  };
  const install = (objects) => {
    Object.assign(state, objects);
    state.sessions.set(objects.session.id, objects.session);
    state.payments.set(objects.payment.id, objects.payment);
    state.charges.set(objects.charge.id, objects.charge);
  };
  install(initial);
  const call = (name, value) => {
    state.calls.push({ name, value: clone(value) });
    if (state.failOn === name) throw new Error(PRIVATE_SENTINEL);
  };
  const sameClaim = (value) => value.projectId === state.purchase.projectId
    && value.claimSha256 === state.purchase.claimSha256 && value.stripeLivemode === state.purchase.stripeLivemode;
  const saveObservation = (value) => {
    state.records.push(clone(value));
    if (value.attemptId === state.purchase.attempt.id) {
      state.purchase.attempt.status = value.status;
      state.attempts.set(value.attemptId, clone(state.purchase));
    }
  };
  const dependencies = {
    repository: {
      async verifySchema() { call("verifySchema"); return state.schema; },
      async loadPurchase(value) { call("loadPurchase", value); return state.known && sameClaim(value) ? clone(state.purchase) : null; },
      async reserveAttempt(value) {
        call("reserveAttempt", value); state.reservations.push(clone(value));
        if (!sameClaim(value)) return null;
        if (state.known && value.expectedAttemptId === null) return clone(state.purchase);
        if (state.known && (value.expectedAttemptId !== state.purchase.attempt.id
          || state.purchase.attempt.status !== "expired" || !state.purchase.attempt.checkoutSessionId)) return null;
        state.attempts.set(state.purchase.attempt.id, clone(state.purchase));
        state.purchase = { projectId: value.projectId, claimSha256: value.claimSha256, stripeLivemode: value.stripeLivemode,
          attempt: { ...clone(value.contract), id: value.attemptId, status: "creating", createdAt: NOW.toISOString(),
            checkoutSessionId: null, paymentIntentId: null } };
        state.known = true; state.attempts.set(value.attemptId, clone(state.purchase));
        return clone(state.purchase);
      },
      async attachCheckout(value) {
        call("attachCheckout", value);
        if (state.failAttachCount-- > 0) throw new Error(PRIVATE_SENTINEL);
        if (value.projectId !== state.purchase.projectId || value.attemptId !== state.purchase.attempt.id) return false;
        if (state.purchase.attempt.checkoutSessionId && state.purchase.attempt.checkoutSessionId !== value.sessionId) return false;
        Object.assign(state.purchase.attempt, { checkoutSessionId: value.sessionId, paymentIntentId: value.paymentIntentId });
        state.attempts.set(value.attemptId, clone(state.purchase)); return true;
      },
      async recordVerification(value) {
        call("recordVerification", value); if (!state.verificationSaved) return false;
        saveObservation(value); return true;
      },
      async loadWebhookAttempt(value) {
        call("loadWebhookAttempt", value);
        const found = value.attemptId === state.purchase.attempt.id ? state.purchase : state.attempts.get(value.attemptId);
        return found && found.projectId === value.projectId && found.claimSha256 === value.claimSha256
          && found.stripeLivemode === value.stripeLivemode ? clone(found) : null;
      },
      async hasWebhookEvent(value) { call("hasWebhookEvent", value); return state.seenEvents.has(value.eventId); },
      async recordWebhookEvent(value) {
        call("recordWebhookEvent", value); if (state.seenEvents.has(value.eventId)) return false;
        if (!state.verificationSaved) throw new Error(PRIVATE_SENTINEL);
        state.seenEvents.add(value.eventId); saveObservation(value); return true;
      },
    },
    stripe: {
      async retrieveAccount() { call("retrieveAccount"); return clone(state.account); },
      async retrievePrice() { call("retrievePrice"); return clone(state.price); },
      async retrieveCheckoutSession(id) { call("retrieveCheckoutSession", id); return clone(state.sessions.get(id)); },
      async retrievePaymentIntent(id) { call("retrievePaymentIntent", id); return clone(state.payments.get(id)); },
      async retrieveCharge(id) { call("retrieveCharge", id); return clone(state.charges.get(id)); },
      async listRefunds(id) { call("listRefunds", id); return clone(state.refunds); },
      async listDisputes(id) { call("listDisputes", id); return clone(state.disputes); },
      async createCheckoutSession(input, key) {
        call("createCheckoutSession", input); state.createKeys.push(key);
        if (!state.createdByKey.has(key)) {
          state.providerCreates++;
          const objects = providerObjects(input.purchase, { paid: state.createPaid, tax: state.createTax });
          if (state.mutateCreatedSession) state.mutateCreatedSession(objects.session);
          install(objects); state.createdByKey.set(key, objects.session);
        }
        return clone(state.createdByKey.get(key));
      },
      constructWebhookEvent(body, signature, configuration) {
        call("constructWebhookEvent", { bytes: Buffer.byteLength(body), signaturePresent: Boolean(signature) });
        // Offline SDK HMAC verification, not a mocked successful signature.
        return webhookSdk.webhooks.constructEvent(body, signature, configuration.webhookSecret);
      },
    },
  };
  const request = (path, body, headers = {}) => new Request(`${ORIGIN}/api/stitchproof/${path}`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: ORIGIN, "Sec-Fetch-Site": "same-origin", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  const env = (overrides = {}) => environment({ STITCHPROOF_TAX_BEHAVIOR: taxBehavior, ...overrides });
  return { state, dependencies, request,
    verify: (overrides = {}) => verifyStitchProofPurchase(state.purchase, getStitchProofConfiguration(env(overrides)), dependencies),
    access: (body = IDENTITY, overrides = {}) => handleStitchProofAccessRequest({
      request: request("access", body), env: env(overrides), dependencies, now: NOW }),
    checkout: (body = { ...IDENTITY, country }, overrides = {}) => handleStitchProofCheckoutRequest({
      request: request("checkout", body), env: env(overrides), dependencies, now: NOW }),
    availability: (overrides = {}) => getStitchProofCheckoutAvailability({ env: env(overrides), dependencies }),
    webhook: ({ secret = WEBHOOK_SECRET, headers = {}, env: overrides = {}, timestamp } = {}) => {
      const body = JSON.stringify(state.event);
      const signature = webhookSdk.webhooks.generateTestHeaderString({ payload: body, secret,
        timestamp: timestamp ?? Math.floor(Date.now() / 1000) });
      return handleStitchProofWebhookRequest({ request: request("webhook", body, { "Stripe-Signature": signature, ...headers }),
        env: env(overrides), dependencies, now: NOW });
    },
  };
}

const accessStatus = async (f, ...args) => (await (await f.access(...args)).json()).status;
const noCheckout = async (response) => {
  const body = await response.json(); assert.equal(body.checkoutUrl, undefined); assert.notEqual(body.status, "paid");
  return body;
};
const refundFor = (f, overrides = {}) => ({ id: "re_ManagedAudit", object: "refund", currency: "usd", amount: 1,
  payment_intent: f.state.payment.id, charge: f.state.charge.id, status: "succeeded", ...overrides });
const disputeFor = (f, overrides = {}) => ({ id: "dp_ManagedAudit", object: "dispute", currency: "usd", livemode: false,
  amount: 900, payment_intent: f.state.payment.id, charge: f.state.charge.id, status: "needs_response", ...overrides });

test("managed markets are exactly the approved 24 codes, immutable and never coerced", () => {
  const expected = ["US", "CA", "GB", "AU", "NZ", "AT", "BE", "DK", "FI", "FR", "DE", "IS", "IE", "IT", "LU", "NL", "NO", "PT", "ES", "SE", "CH", "JP", "SG", "KR"];
  assert.deepEqual(STITCHPROOF_MARKETS.map(({ code }) => code), expected);
  assert.equal(new Set(expected).size, 24); assert.ok(Object.isFrozen(STITCHPROOF_MARKETS));
  for (const entry of STITCHPROOF_MARKETS) { assert.ok(Object.isFrozen(entry)); assert.ok(entry.name); assert.equal(isStitchProofPurchaseCountry(entry.code), true); }
  for (const invalid of ["", "us", " US", "US ", "UK", "USA", "BR", "IN", "CN", "ZZ", null, undefined, 1, true, ["US"], { toString: () => "US" }]) {
    assert.equal(isStitchProofPurchaseCountry(invalid), false);
  }
});

test("managed parser permits only credentials plus an explicit valid checkout country; access has no extras", async () => {
  const f = fixture(); const config = getStitchProofConfiguration(environment());
  for (const { code } of STITCHPROOF_MARKETS) {
    assert.deepEqual(await readStitchProofClaim(f.request("checkout", { ...IDENTITY, country: code }), config, { checkout: true }),
      { projectId: IDENTITY.projectId, claimSha256: CLAIM_HASH, country: code });
  }
  assert.deepEqual(await readStitchProofClaim(f.request("access", IDENTITY), config), { projectId: IDENTITY.projectId, claimSha256: CLAIM_HASH });
  for (const body of [{ ...IDENTITY, country: "US" }, { ...IDENTITY, patternText: PRIVATE_SENTINEL },
    { ...IDENTITY, claimSecret: [IDENTITY.claimSecret] }, { ...IDENTITY, projectId: [IDENTITY.projectId] }, [], null]) {
    assert.equal(await readStitchProofClaim(f.request("access", body), config), null);
  }
  for (const country of ["GB ", "us", "BR", null, ["US"], { value: "US" }]) {
    assert.equal(await readStitchProofClaim(f.request("checkout", { ...IDENTITY, country }), config, { checkout: true }), null);
  }
  assert.equal(await readStitchProofClaim(f.request("checkout", { ...IDENTITY, country: "US", patternText: PRIVATE_SENTINEL }), config, { checkout: true }), null);
  for (const headers of [{ Origin: "https://unrelated.invalid" }, { "Sec-Fetch-Site": "cross-site" }, { "Content-Type": "text/plain" }]) {
    assert.equal(await readStitchProofClaim(f.request("checkout", { ...IDENTITY, country: "US" }, headers), config, { checkout: true }), null);
  }
});

test("managed live release gates reject missing, false and truthy-looking values individually", async (t) => {
  assert.ok(getStitchProofConfiguration(liveEnvironment(), { checkout: true }));
  for (const key of ["STITCHPROOF_CHECKOUT_ENABLED", "STITCHPROOF_SCHEMA_CONFIRMED", "STITCHPROOF_WEBHOOK_CONFIRMED",
    "STITCHPROOF_ABUSE_PROTECTION_CONFIRMED", "STITCHPROOF_TAX_CONFIGURATION_CONFIRMED", "STITCHPROOF_MANAGED_PAYMENTS_CONFIRMED",
    "STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED", "STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED", "STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED"]) {
    await t.test(key, () => {
      for (const value of [undefined, "false", "TRUE", "1", true]) {
        assert.equal(getStitchProofConfiguration(liveEnvironment({ [key]: value }), { checkout: true }), null);
      }
    });
  }
  for (const overrides of [{ STITCHPROOF_MANAGED_COUNTRY_POLICY: "unknown" }, { STITCHPROOF_MANAGED_TAX_CODE: "" },
    { STITCHPROOF_MANAGED_TAX_CODE: "txcd_not_a_code" }, { STITCHPROOF_MANAGED_TAX_CODE: [TAX_CODE] },
    { STITCHPROOF_APPLIED_MIGRATION_VERSION: "20260826_stitchproof_project_entitlements" },
    { STITCHPROOF_TAX_BEHAVIOR: "unspecified" }]) assert.equal(getStitchProofConfiguration(liveEnvironment(overrides), { checkout: true }), null);
});

test("protected test configuration permits prerequisite QA without claiming the three live attestations", () => {
  const overrides = { STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED: undefined,
    STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED: "false", STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED: undefined };
  assert.equal(getStitchProofEnvironmentReadiness(environment(overrides)).ready, true);
  assert.ok(getStitchProofConfiguration(environment(overrides), { checkout: true }));
  assert.equal(getStitchProofConfiguration(liveEnvironment(overrides), { checkout: true }), null);
  assert.equal(getStitchProofConfiguration(environment({ ...overrides, VERCEL_ENV: "production" }), { checkout: true }), null);
  assert.equal(getStitchProofConfiguration(environment({ ...overrides, NEXT_PUBLIC_SITE_URL: "https://fibertools.app" }), { checkout: true }), null);
});

test("managed availability verifies account, schema and the current tax-coded USD-only price without writes", async () => {
  const f = fixture();
  assert.deepEqual(await f.availability(), { available: true, checkoutMode: "managed", marketPolicyVersion: STITCHPROOF_MARKET_POLICY_VERSION });
  assert.deepEqual(f.state.calls.map(({ name }) => name), ["retrieveAccount", "verifySchema", "retrievePrice"]);
  assert.equal(f.state.reservations.length, 0); assert.equal(f.state.providerCreates, 0);
  f.state.price.currency_options = { usd: { unit_amount: 900, tax_behavior: "exclusive" } };
  f.state.price.product.tax_code = { id: TAX_CODE, object: "tax_code" };
  assert.equal((await f.availability()).available, true);
});

test("managed availability rejects independent account, product, tax, currency-option and schema mismatches", async (t) => {
  const mutations = {
    "wrong account": (s) => { s.account.id = "acct_OtherAudit"; },
    "charges disabled": (s) => { s.account.charges_enabled = false; },
    "charges unknown": (s) => { delete s.account.charges_enabled; },
    "old schema": (s) => { s.schema = "20260826_stitchproof_project_entitlements"; },
    "wrong price ID": (s) => { s.price.id = "price_OtherAudit"; },
    "wrong product ID": (s) => { s.price.product.id = "prod_OtherAudit"; },
    "product unexpanded": (s) => { s.price.product = s.price.product.id; },
    "inactive product": (s) => { s.price.product.active = false; },
    "inactive price": (s) => { s.price.active = false; },
    "product wrong mode": (s) => { s.price.product.livemode = true; },
    "price wrong mode": (s) => { s.price.livemode = true; },
    "product wrong offer": (s) => { s.price.product.metadata.offer_version = STITCHPROOF_OFFER_VERSION; },
    "product wrong service": (s) => { s.price.product.metadata.service = "unrelated"; },
    "wrong tax code": (s) => { s.price.product.tax_code = "txcd_99999999"; },
    "missing tax code": (s) => { delete s.price.product.tax_code; },
    "wrong behavior": (s) => { s.price.tax_behavior = "inclusive"; },
    "unspecified behavior": (s) => { s.price.tax_behavior = "unspecified"; },
    "wrong base amount": (s) => { s.price.unit_amount = 901; },
    "wrong currency": (s) => { s.price.currency = "eur"; },
    "recurring price": (s) => { s.price.type = "recurring"; s.price.recurring = { interval: "month" }; },
    "currency options missing expansion": (s) => { delete s.price.currency_options; },
    "currency options null": (s) => { s.price.currency_options = null; },
    "currency options array": (s) => { s.price.currency_options = []; },
    "currency options string": (s) => { s.price.currency_options = "usd"; },
    "manual local currency": (s) => { s.price.currency_options = { usd: {}, eur: { unit_amount: 900 } }; },
    "uppercase currency option": (s) => { s.price.currency_options = { USD: {} }; },
  };
  for (const [name, mutate] of Object.entries(mutations)) await t.test(name, async () => {
    const f = fixture(); mutate(f.state); assert.deepEqual(await f.availability(), { available: false });
    assert.equal(f.state.providerCreates, 0); assert.equal(f.state.reservations.length, 0);
  });
  for (const name of ["retrieveAccount", "verifySchema", "retrievePrice"]) {
    const f = fixture(); f.state.failOn = name; assert.deepEqual(await f.availability(), { available: false });
  }
});

test("managed builder omits unsupported options and binds only allowlisted metadata with hosted_page", () => {
  const f = fixture(); const config = getStitchProofConfiguration(environment());
  const purchase = { ...f.state.purchase, claimSecret: IDENTITY.claimSecret, patternText: PRIVATE_SENTINEL, email: PRIVATE_SENTINEL };
  const params = buildStitchProofCheckoutParameters({ purchase, successUrl: config.successUrl, cancelUrl: config.cancelUrl });
  assert.equal(params.ui_mode, "hosted_page"); assert.equal(params.mode, "payment");
  assert.deepEqual(params.managed_payments, { enabled: true });
  assert.deepEqual(params.line_items, [{ price: "price_ManagedAudit", quantity: 1, adjustable_quantity: { enabled: false } }]);
  assert.equal(params.allow_promotion_codes, false);
  assert.deepEqual(params.after_expiration, { recovery: { enabled: false } });
  assert.deepEqual(params.phone_number_collection, { enabled: false });
  assert.deepEqual(Object.keys(params).sort(), ["after_expiration", "allow_promotion_codes", "cancel_url", "client_reference_id", "expand",
    "line_items", "managed_payments", "metadata", "mode", "payment_intent_data", "phone_number_collection", "submit_type", "success_url", "ui_mode"].sort());
  for (const key of ["automatic_tax", "adaptive_pricing", "tax_id_collection", "excluded_payment_method_types", "payment_method_types",
    "payment_method_configuration", "payment_method_options", "customer_update", "shipping_address_collection", "shipping_options", "invoice_creation"]) {
    assert.equal(Object.hasOwn(params, key), false, key);
  }
  assert.deepEqual(Object.keys(params.payment_intent_data).sort(), ["capture_method", "metadata"]);
  assert.equal(params.payment_intent_data.capture_method, "automatic");
  assert.deepEqual(params.metadata, metadata(f.state.purchase));
  assert.deepEqual(params.payment_intent_data.metadata, params.metadata);
  assert.deepEqual(Object.keys(params.metadata).sort(), ["attempt_id", "claim_sha256", "market_policy_version", "offer_version",
    "product_tax_code", "project_id", "purchase_country", "service"]);
  assert.doesNotMatch(JSON.stringify(params), new RegExp(`${PRIVATE_SENTINEL}|${IDENTITY.claimSecret}`));
  assert.doesNotMatch(params.success_url + params.cancel_url, /claim|projectId|cs_|44444444/);
  const legacy = fixture({ managed: false });
  const oldParams = buildStitchProofCheckoutParameters({ purchase: legacy.state.purchase, successUrl: config.successUrl, cancelUrl: config.cancelUrl });
  assert.equal(oldParams.managed_payments, undefined); assert.equal(oldParams.ui_mode, "hosted");
  assert.deepEqual(oldParams.payment_method_types, ["card"]); assert.deepEqual(oldParams.adaptive_pricing, { enabled: false });
});

test("managed paid baseline refreshes the full financial chain and persists only a minimal observation", async () => {
  const f = fixture(); f.state.session.customer_details = { email: PRIVATE_SENTINEL, address: { line1: PRIVATE_SENTINEL } };
  const response = await f.access(); assert.deepEqual(await response.json(), { status: "paid" });
  assert.match(response.headers.get("cache-control"), /no-store/); assert.equal(response.headers.get("referrer-policy"), "no-referrer");
  assert.match(response.headers.get("x-robots-tag"), /noindex/);
  assert.deepEqual(f.state.calls.map(({ name }) => name), ["retrieveAccount", "loadPurchase", "retrieveCheckoutSession",
    "retrievePaymentIntent", "retrieveCharge", "listRefunds", "listDisputes", "recordVerification"]);
  assert.deepEqual(Object.keys(f.state.records[0]).sort(), ["attemptId", "paymentIntentId", "projectId", "sessionId", "status", "stripeLivemode", "verifiedAt"]);
  assert.doesNotMatch(JSON.stringify(f.state.calls), new RegExp(`${PRIVATE_SENTINEL}|${IDENTITY.claimSecret}`));
});

test("managed tax arithmetic accepts independent inclusive/exclusive zero and nonzero fixtures", async (t) => {
  for (const taxBehavior of ["exclusive", "inclusive"]) for (const tax of [0, 1, 74, 900]) {
    await t.test(`${taxBehavior} tax ${tax}`, async () => {
      const f = fixture({ taxBehavior, tax });
      assert.equal(await accessStatus(f), "paid");
      assert.equal(f.state.session.amount_subtotal, taxBehavior === "inclusive" ? 900 - tax : 900);
      assert.equal(f.state.session.amount_total, taxBehavior === "inclusive" ? 900 : 900 + tax);
      assert.equal(f.state.charge.amount_captured, f.state.session.amount_total);
    });
  }
});

test("managed tax and line totals reject misbalanced, truncated and unsafe financial input", async (t) => {
  const mutations = {
    "old inclusive subtotal assumption": (s) => { s.session.amount_subtotal = s.session.line_items.data[0].amount_subtotal = 900; },
    "subtotal off by one": (s) => { s.session.amount_subtotal++; s.session.line_items.data[0].amount_subtotal++; },
    "line subtotal mismatch": (s) => { s.session.line_items.data[0].amount_subtotal++; },
    "line total mismatch": (s) => { s.session.line_items.data[0].amount_total++; },
    "line tax mismatch": (s) => { s.session.line_items.data[0].amount_tax++; },
    "tax exceeds inclusive price": (s) => { s.session.total_details.amount_tax = s.session.line_items.data[0].amount_tax = 901; },
    "negative tax": (s) => { s.session.total_details.amount_tax = -1; },
    "fractional tax": (s) => { s.session.total_details.amount_tax = 0.5; },
    "string tax": (s) => { s.session.total_details.amount_tax = "74"; },
    "unsafe tax": (s) => { s.session.total_details.amount_tax = Number.MAX_SAFE_INTEGER + 1; },
    "unsafe total": (s) => { s.session.amount_total = Number.MAX_SAFE_INTEGER + 1; },
    "negative subtotal": (s) => { s.session.amount_subtotal = -1; },
    "string subtotal": (s) => { s.session.amount_subtotal = "826"; },
    "NaN subtotal": (s) => { s.session.amount_subtotal = NaN; },
    "discount": (s) => { s.session.total_details.amount_discount = 1; },
    "shipping": (s) => { s.session.total_details.amount_shipping = 1; },
    "line discount": (s) => { s.session.line_items.data[0].amount_discount = 1; },
    "quantity changed": (s) => { s.session.line_items.data[0].quantity = 2; },
    "extra line": (s) => { s.session.line_items.data.push(clone(s.session.line_items.data[0])); },
    "paginated lines": (s) => { s.session.line_items.has_more = true; },
    "wrong line currency": (s) => { s.session.line_items.data[0].currency = "eur"; },
    "wrong line price": (s) => { s.session.line_items.data[0].price.id = "price_OtherAudit"; },
    "wrong price tax behavior": (s) => { s.session.line_items.data[0].price.tax_behavior = "exclusive"; },
    "tax computation failed": (s) => { s.session.automatic_tax.status = "failed"; },
    "tax location incomplete": (s) => { s.session.automatic_tax.status = "requires_location_inputs"; },
    "unknown tax status": (s) => { s.session.automatic_tax.status = "new_unknown_status"; },
  };
  for (const [name, mutate] of Object.entries(mutations)) await t.test(name, async () => {
    const f = fixture({ taxBehavior: "inclusive", tax: 74 }); mutate(f.state);
    assert.notEqual(await accessStatus(f), "paid");
  });
  const exclusive = fixture({ tax: 74 });
  exclusive.state.session.amount_total = exclusive.state.session.line_items.data[0].amount_total = 900;
  exclusive.state.payment.amount = exclusive.state.payment.amount_received = 900;
  exclusive.state.charge.amount = exclusive.state.charge.amount_captured = 900;
  assert.notEqual(await accessStatus(exclusive), "paid");
  assert.notEqual(await accessStatus(fixture({ tax: Number.MAX_SAFE_INTEGER })), "paid");
});

test("managed flags must be real true booleans on both Session and PaymentIntent", async (t) => {
  for (const object of ["session", "payment"]) for (const value of [undefined, null, {}, { enabled: false }, { enabled: "true" }, { enabled: 1 }]) {
    await t.test(`${object}: ${JSON.stringify(value)}`, async () => {
      const f = fixture(); f.state[object].managed_payments = value;
      assert.notEqual(await accessStatus(f), "paid");
    });
  }
});

test("managed metadata binds every immutable identity/offer/country field across all three objects", async (t) => {
  const changes = { service: "unrelated_service", offer_version: STITCHPROOF_OFFER_VERSION,
    project_id: OTHER_PROJECT, attempt_id: OTHER_PROJECT, claim_sha256: "e".repeat(64), purchase_country: "CA",
    market_policy_version: "UNKNOWN-MARKET-POLICY", product_tax_code: "txcd_99999999" };
  for (const object of ["session", "payment", "charge"]) for (const [key, value] of Object.entries(changes)) {
    await t.test(`${object}.${key}`, async () => {
      const f = fixture(); f.state[object].metadata[key] = value; assert.notEqual(await accessStatus(f), "paid");
      delete f.state[object].metadata[key]; assert.notEqual(await accessStatus(f), "paid");
    });
  }
});

test("managed financial chain rejects wrong references, incomplete capture, amounts, modes and methods", async (t) => {
  const mutations = {
    "session ID": (s) => { s.session.id = "cs_test_OtherAudit"; },
    "session object": (s) => { s.session.object = "payment_intent"; },
    "session livemode": (s) => { s.session.livemode = true; },
    "session currency": (s) => { s.session.currency = "eur"; },
    "wrong client reference": (s) => { s.session.client_reference_id = OTHER_PROJECT; },
    "wrong historical intent": (s) => { s.purchase.attempt.paymentIntentId = "pi_OtherAudit"; },
    "intent missing reference": (s) => { s.session.payment_intent = null; },
    "intent ID": (s) => { s.payment.id = "pi_OtherAudit"; },
    "intent object": (s) => { s.payment.object = "charge"; },
    "intent livemode": (s) => { s.payment.livemode = true; },
    "intent processing": (s) => { s.payment.status = "processing"; },
    "intent currency": (s) => { s.payment.currency = "eur"; },
    "intent amount": (s) => { s.payment.amount = 899; },
    "intent received amount": (s) => { s.payment.amount_received = 899; },
    "latest charge missing": (s) => { s.payment.latest_charge = null; },
    "charge ID": (s) => { s.charge.id = "ch_OtherAudit"; },
    "charge wrong intent": (s) => { s.charge.payment_intent = "pi_OtherAudit"; },
    "charge livemode": (s) => { s.charge.livemode = true; },
    "charge currency": (s) => { s.charge.currency = "eur"; },
    "charge amount": (s) => { s.charge.amount = 899; },
    "charge captured amount": (s) => { s.charge.amount_captured = 1; },
    "capture amount missing": (s) => { delete s.charge.amount_captured; },
    "charge not captured": (s) => { s.charge.captured = false; },
    "charge not paid": (s) => { s.charge.paid = false; },
    "charge pending": (s) => { s.charge.status = "pending"; },
    "unsupported actual method": (s) => { s.charge.payment_method_details.type = "bancontact"; },
    "method not in session": (s) => { s.session.payment_method_types = ["card"]; s.charge.payment_method_details.type = "link"; },
    "unknown refunded amount": (s) => { s.charge.amount_refunded = undefined; },
    "unknown refunded flag": (s) => { s.charge.refunded = undefined; },
    "unknown disputed flag": (s) => { s.charge.disputed = undefined; },
  };
  for (const [name, mutate] of Object.entries(mutations)) await t.test(name, async () => {
    const f = fixture(); mutate(f.state); assert.notEqual(await accessStatus(f), "paid");
  });
  const expanded = fixture();
  expanded.state.session.payment_intent = { id: expanded.state.payment.id };
  expanded.state.payment.latest_charge = { id: expanded.state.charge.id };
  expanded.state.charge.payment_intent = { id: expanded.state.payment.id };
  assert.equal(await accessStatus(expanded), "paid");
  const link = fixture(); link.state.charge.payment_method_details.type = "link";
  assert.equal(await accessStatus(link), "paid");
});

test("managed complete-but-unpaid or processing state never authorizes or offers another checkout", async () => {
  for (const paymentStatus of ["unpaid", "no_payment_required", "unknown", null]) {
    const f = fixture(); f.state.session.payment_status = paymentStatus;
    assert.notEqual(await accessStatus(f), "paid"); await noCheckout(await f.checkout()); assert.equal(f.state.providerCreates, 0);
  }
  const contradictory = fixture(); contradictory.state.session.status = "open";
  assert.notEqual(await accessStatus(contradictory), "paid"); await noCheckout(await contradictory.checkout());
});

test("managed presentment accepts absent details or identical tuples without inventing FX conversions", async () => {
  for (const details of [undefined, null, { presentment_currency: "usd", presentment_amount: 900 },
    { presentment_currency: "eur", presentment_amount: 831 }, { presentment_currency: "jpy", presentment_amount: 1350 }]) {
    const f = fixture();
    for (const object of ["session", "payment", "charge"]) f.state[object].presentment_details = clone(details);
    assert.equal(await accessStatus(f), "paid");
    assert.equal(f.state.payment.amount, 900); assert.equal(f.state.charge.currency, "usd");
  }
  const mixedAbsent = fixture(); mixedAbsent.state.payment.presentment_details = null;
  assert.equal(await accessStatus(mixedAbsent), "paid");
});

test("managed presentment rejects malformed, absent-on-one-object and disagreeing tuples", async (t) => {
  const invalid = [[], "eur", {}, { presentment_currency: "eur" }, { presentment_amount: 831 },
    { presentment_currency: "EUR", presentment_amount: 831 }, { presentment_currency: "eu", presentment_amount: 831 },
    { presentment_currency: "euro", presentment_amount: 831 }, { presentment_currency: "eur", presentment_amount: "831" },
    { presentment_currency: "eur", presentment_amount: 0 }, { presentment_currency: "eur", presentment_amount: -1 },
    { presentment_currency: "eur", presentment_amount: 0.5 }, { presentment_currency: "eur", presentment_amount: NaN },
    { presentment_currency: "eur", presentment_amount: Infinity },
    { presentment_currency: "eur", presentment_amount: Number.MAX_SAFE_INTEGER + 1 },
    { presentment_currency: "usd", presentment_amount: 901 }];
  for (const object of ["session", "payment", "charge"]) await t.test(object, async () => {
    for (const details of invalid) {
      const f = fixture(); f.state[object].presentment_details = clone(details);
      assert.notEqual(await accessStatus(f), "paid");
    }
    for (const replacement of [undefined, null, { presentment_currency: "cad", presentment_amount: 831 },
      { presentment_currency: "eur", presentment_amount: 832 }]) {
      const f = fixture();
      for (const target of ["session", "payment", "charge"]) f.state[target].presentment_details = { presentment_currency: "eur", presentment_amount: 831 };
      f.state[object].presentment_details = clone(replacement);
      assert.notEqual(await accessStatus(f), "paid");
    }
  });
});

test("managed checkout rejects unsupported or duplicate method lists before exposing a payable URL", async (t) => {
  for (const methods of [undefined, [], ["link"], ["card", "card"], ["card", "link", "link"], ["card", "bancontact"],
    ["card", "cashapp"], ["card", "pix"], ["card", "upi"], ["CARD"], "card", ["card", null]]) {
    await t.test(JSON.stringify(methods) ?? "missing methods", async () => {
      const fresh = fixture({ paid: false, attached: false, known: false });
      fresh.state.mutateCreatedSession = (session) => { session.payment_method_types = clone(methods); };
      await noCheckout(await fresh.checkout());
      assert.equal(fresh.state.calls.some(({ name }) => name === "attachCheckout"), false);
      const paid = fixture(); paid.state.session.payment_method_types = clone(methods);
      assert.notEqual(await accessStatus(paid), "paid");
    });
  }
  for (const methods of [["card"], ["card", "link"], ["link", "card"]]) {
    const f = fixture({ paid: false, attached: false, known: false });
    f.state.mutateCreatedSession = (session) => { session.payment_method_types = methods; };
    const response = await f.checkout(); assert.equal(response.status, 200); assert.ok((await response.json()).checkoutUrl);
  }
});

test("managed partial, full and pending refunds revoke access even when the ledger still says paid", async () => {
  for (const status of ["pending", "requires_action", "succeeded"]) {
    const f = fixture(); f.state.refunds.data = [refundFor(f, { status })];
    assert.equal((await f.verify()).status, "refunded"); assert.equal(await accessStatus(f), "unavailable");
    await noCheckout(await f.checkout()); assert.equal(f.state.providerCreates, 0);
  }
  const partial = fixture(); partial.state.charge.amount_refunded = 1; partial.state.charge.refunded = false;
  assert.equal((await partial.verify()).status, "refunded");
  const full = fixture(); full.state.charge.amount_refunded = 900; full.state.charge.refunded = true;
  assert.equal((await full.verify()).status, "refunded");
  for (const status of ["failed", "canceled"]) {
    const f = fixture(); f.state.refunds.data = [refundFor(f, { status })]; assert.equal(await accessStatus(f), "paid");
  }
});

test("managed dispute freshness uses current resolution instead of historical charge.disputed alone", async () => {
  for (const status of ["won", "warning_closed", "prevented"]) {
    const f = fixture(); f.state.charge.disputed = true; f.state.disputes.data = [disputeFor(f, { status })];
    assert.equal(await accessStatus(f), "paid");
  }
  for (const status of ["needs_response", "under_review", "lost", "warning_needs_response", "warning_under_review", "unknown"]) {
    const f = fixture(); f.state.disputes.data = [disputeFor(f, { status })];
    assert.equal((await f.verify()).status, "disputed"); assert.equal(await accessStatus(f), "unavailable");
  }
  const missing = fixture(); missing.state.charge.disputed = true;
  assert.equal((await missing.verify()).status, "disputed");
});

test("managed financial lists reject truncation, foreign references, unknown currency and malformed entries", async (t) => {
  const mutations = {
    "refund pagination": (f) => { f.state.refunds.has_more = true; },
    "refunds absent": (f) => { f.state.refunds = null; },
    "dispute pagination": (f) => { f.state.disputes.has_more = true; },
    "disputes absent": (f) => { f.state.disputes = null; },
    "refund wrong charge": (f) => { f.state.refunds.data = [refundFor(f, { charge: "ch_OtherAudit" })]; },
    "refund wrong intent": (f) => { f.state.refunds.data = [refundFor(f, { payment_intent: "pi_OtherAudit" })]; },
    "refund currency": (f) => { f.state.refunds.data = [refundFor(f, { currency: "eur", status: "failed" })]; },
    "refund wrong mode": (f) => { f.state.refunds.data = [refundFor(f, { livemode: true })]; },
    "refund unknown status": (f) => { f.state.refunds.data = [refundFor(f, { status: "unknown" })]; },
    "refund negative amount": (f) => { f.state.refunds.data = [refundFor(f, { amount: -1 })]; },
    "refund over charge": (f) => { f.state.refunds.data = [refundFor(f, { amount: 901 })]; },
    "refund string amount": (f) => { f.state.refunds.data = [refundFor(f, { amount: "1" })]; },
    "dispute wrong charge": (f) => { f.state.disputes.data = [disputeFor(f, { charge: "ch_OtherAudit", status: "won" })]; },
    "dispute wrong intent": (f) => { f.state.disputes.data = [disputeFor(f, { payment_intent: "pi_OtherAudit", status: "won" })]; },
    "dispute currency": (f) => { f.state.disputes.data = [disputeFor(f, { currency: "eur", status: "won" })]; },
    "dispute wrong mode": (f) => { f.state.disputes.data = [disputeFor(f, { livemode: true, status: "won" })]; },
    "dispute unsafe amount": (f) => { f.state.disputes.data = [disputeFor(f, { amount: Number.MAX_SAFE_INTEGER + 1, status: "won" })]; },
  };
  for (const [name, mutate] of Object.entries(mutations)) await t.test(name, async () => {
    const f = fixture(); mutate(f); assert.equal(await accessStatus(f), "unavailable");
  });
});

test("managed provider failures and rejected verification writes never unlock or expose private errors", async () => {
  for (const name of ["retrieveAccount", "loadPurchase", "retrieveCheckoutSession", "retrievePaymentIntent", "retrieveCharge", "listRefunds", "listDisputes", "recordVerification"]) {
    const f = fixture(); f.state.failOn = name;
    const response = await f.access(); const body = await response.text();
    assert.deepEqual(JSON.parse(body), { status: "unavailable" }); assert.doesNotMatch(body, new RegExp(PRIVATE_SENTINEL));
  }
  const stale = fixture(); stale.state.verificationSaved = false;
  assert.equal(await accessStatus(stale), "unavailable"); await noCheckout(await stale.checkout());
  const fresh = fixture(); assert.equal(await accessStatus(fresh), "paid"); fresh.state.charge.amount_refunded = 1;
  assert.equal(await accessStatus(fresh), "unavailable");
  assert.equal(fresh.state.calls.filter(({ name }) => name === "retrieveCharge").length, 2);
});

test("managed checkout requires country for new sales but never sends a raw secret or pattern data onward", async () => {
  for (const body of [IDENTITY, { ...IDENTITY, country: "BR" }, { ...IDENTITY, country: ["US"] },
    { ...IDENTITY, country: "US", patternText: PRIVATE_SENTINEL }]) {
    const f = fixture({ paid: false, attached: false, known: false }); await noCheckout(await f.checkout(body));
    assert.equal(f.state.reservations.length, 0); assert.equal(f.state.providerCreates, 0);
  }
  for (const { code } of STITCHPROOF_MARKETS) {
    const f = fixture({ paid: false, attached: false, known: false });
    const response = await f.checkout({ ...IDENTITY, country: code }); assert.equal(response.status, 200);
    const body = await response.json(); assert.deepEqual(Object.keys(body), ["checkoutUrl"]);
    assert.equal(f.state.purchase.attempt.purchaseCountry, code);
    assert.equal(f.state.reservations[0].contract.marketPolicyVersion, STITCHPROOF_MARKET_POLICY_VERSION);
    assert.equal(f.state.reservations[0].contract.productTaxCode, TAX_CODE);
    assert.equal(f.state.session.metadata.purchase_country, code);
    assert.doesNotMatch(JSON.stringify(f.state.calls), new RegExp(`${IDENTITY.claimSecret}|${PRIVATE_SENTINEL}`));
  }
});

test("managed retries cannot mutate a live attempt's country, price or immutable offer", async () => {
  const f = fixture({ paid: false }); const original = clone(f.state.purchase.attempt);
  const response = await f.checkout({ ...IDENTITY, country: "CA" }); assert.equal(response.status, 409);
  await noCheckout(response); assert.equal(f.state.providerCreates, 0); assert.equal(f.state.reservations.length, 0);
  assert.equal(f.state.purchase.attempt.purchaseCountry, original.purchaseCountry);
  const newPrice = fixture({ paid: false }); newPrice.state.price.id = "price_NewerAudit";
  newPrice.state.price.product.id = "prod_NewerAudit";
  const changed = await newPrice.checkout({ ...IDENTITY, country: "US" }, {
    STITCHPROOF_STRIPE_PRICE_ID: "price_NewerAudit", STITCHPROOF_STRIPE_PRODUCT_ID: "prod_NewerAudit" });
  assert.equal(changed.status, 409); await noCheckout(changed); assert.equal(newPrice.state.providerCreates, 0);
  const creating = fixture({ paid: false, attached: false });
  await noCheckout(await creating.checkout({ ...IDENTITY, country: "CA" })); assert.equal(creating.state.providerCreates, 0);
});

test("managed parallel same-country requests retain one reservation and one provider idempotency key", async () => {
  const f = fixture({ paid: false, attached: false, known: false });
  const responses = await Promise.all([f.checkout(), f.checkout(), f.checkout()]);
  const bodies = await Promise.all(responses.map((response) => response.json()));
  assert.ok(bodies.every((body) => body.checkoutUrl)); assert.equal(new Set(bodies.map((body) => body.checkoutUrl)).size, 1);
  assert.equal(f.state.providerCreates, 1); assert.equal(new Set(f.state.createKeys).size, 1);
  assert.equal(f.state.session.metadata.attempt_id, f.state.purchase.attempt.id);
  const competing = fixture({ paid: false, attached: false, known: false });
  const results = await Promise.all([competing.checkout({ ...IDENTITY, country: "US" }), competing.checkout({ ...IDENTITY, country: "CA" })]);
  assert.deepEqual(results.map((result) => result.status).sort(), [200, 409]); assert.equal(competing.state.providerCreates, 1);
});

test("managed lost-attachment retries recover the same checkout, including an already-paid response", async () => {
  for (const paid of [false, true]) {
    const f = fixture({ paid, attached: false }); f.state.failAttachCount = 1;
    const first = await f.checkout(); assert.equal(first.status, 503); await noCheckout(first);
    const second = await f.checkout(); assert.equal(second.status, 200);
    const result = await second.json(); if (paid) assert.deepEqual(result, { status: "paid" }); else assert.ok(result.checkoutUrl);
    assert.equal(f.state.providerCreates, 1); assert.equal(new Set(f.state.createKeys).size, 1);
    assert.equal(f.state.purchase.attempt.checkoutSessionId, f.state.session.id);
  }
  const aged = fixture({ paid: false, attached: false });
  aged.state.purchase.attempt.createdAt = new Date(NOW.getTime() - 3_600_001).toISOString();
  await noCheckout(await aged.checkout()); assert.equal(aged.state.providerCreates, 0);
});

test("only a verified expired predecessor permits a new managed reservation and country", async () => {
  for (const managed of [false, true]) {
    const f = fixture({ managed, paid: false, status: "expired" }); const oldId = f.state.purchase.attempt.id;
    const response = await f.checkout({ ...IDENTITY, country: "CA" }); assert.equal(response.status, 200);
    assert.ok((await response.json()).checkoutUrl); assert.equal(f.state.providerCreates, 1);
    assert.notEqual(f.state.purchase.attempt.id, oldId); assert.equal(f.state.reservations[0].expectedAttemptId, oldId);
    assert.equal(f.state.purchase.attempt.offerVersion, STITCHPROOF_MANAGED_OFFER_VERSION);
    assert.equal(f.state.purchase.attempt.taxMode, "managed"); assert.equal(f.state.purchase.attempt.purchaseCountry, "CA");
  }
  const unavailable = fixture({ paid: false, status: "expired" }); unavailable.state.session.amount_subtotal = 899;
  await noCheckout(await unavailable.checkout()); assert.equal(unavailable.state.reservations.length, 0);
});

test("legacy unpaid sessions and creating reservations cannot reopen under the managed offer", async () => {
  for (const attached of [true, false]) {
    const f = fixture({ managed: false, paid: false, attached });
    const response = await f.checkout(); assert.equal(response.status, 409); await noCheckout(response);
    assert.equal(f.state.providerCreates, 0); assert.equal(f.state.reservations.length, 0);
  }
});

test("legacy and managed paid access survives closed sales, changed current offers and managed attestations", async () => {
  const overrides = { STITCHPROOF_CHECKOUT_ENABLED: "false", STITCHPROOF_MANAGED_PAYMENTS_CONFIRMED: "false",
    STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED: "false", STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED: "false",
    STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED: "false", STITCHPROOF_MANAGED_COUNTRY_POLICY: "changed",
    STITCHPROOF_MANAGED_TAX_CODE: "", STITCHPROOF_TAX_CONFIGURATION_CONFIRMED: "false",
    STITCHPROOF_STRIPE_PRODUCT_ID: "prod_NewerAudit", STITCHPROOF_STRIPE_PRICE_ID: "price_NewerAudit" };
  for (const managed of [false, true]) {
    const f = fixture({ managed }); f.state.account.charges_enabled = false;
    f.state.session.line_items.data[0].price.active = false;
    Object.assign(f.state.session.line_items.data[0].price.product, { active: false, tax_code: "txcd_99999999", metadata: {} });
    assert.equal(await accessStatus(f, IDENTITY, overrides), "paid");
    assert.deepEqual(await (await f.checkout(IDENTITY, overrides)).json(), { status: "paid" });
    assert.equal(f.state.calls.some(({ name }) => ["verifySchema", "retrievePrice", "reserveAttempt", "createCheckoutSession"].includes(name)), false);
  }
});

test("billing address is not persisted or used to revoke an already-completed managed purchase", async () => {
  const f = fixture(); f.state.session.customer_details = { address: { country: "BR", line1: PRIVATE_SENTINEL }, email: PRIVATE_SENTINEL };
  assert.equal(await accessStatus(f), "paid");
  assert.doesNotMatch(JSON.stringify(f.state.records), new RegExp(`BR|${PRIVATE_SENTINEL}|billing|customer`));
  // This does NOT demonstrate that an out-of-policy charge can be accepted in
  // production. Provider-side pre-payment market enforcement is a release gate.
});

test("managed stored contracts reject malformed, mixed legacy and wrong-owner attempts", async (t) => {
  const changes = { id: OTHER_PROJECT.replace("4666", "1666"), stripeAccountId: "acct_OtherAudit",
    productId: "bad_product", priceId: "bad_price", offerVersion: STITCHPROOF_OFFER_VERSION, amountCents: 899,
    currency: "eur", taxMode: "none", taxBehavior: "not_applicable", purchaseCountry: "BR",
    marketPolicyVersion: "UNKNOWN-POLICY", productTaxCode: "not_a_tax_code" };
  for (const [key, value] of Object.entries(changes)) await t.test(key, async () => {
    const f = fixture(); f.state.purchase.attempt[key] = value;
    assert.equal(await accessStatus(f), "unavailable"); assert.equal(f.state.calls.some(({ name }) => name === "retrieveCheckoutSession"), false);
  });
  for (const key of ["purchaseCountry", "marketPolicyVersion", "productTaxCode"]) {
    const f = fixture(); delete f.state.purchase.attempt[key]; assert.equal(await accessStatus(f), "unavailable");
    const legacy = fixture({ managed: false }); legacy.state.purchase.attempt[key] = contract()[key];
    assert.equal(await accessStatus(legacy), "unavailable");
  }
  for (const identity of [{ ...IDENTITY, projectId: OTHER_PROJECT }, { ...IDENTITY, claimSecret: "f".repeat(64) }]) {
    const f = fixture(); assert.equal(await accessStatus(f, identity), "unavailable");
  }
  const foreign = fixture(); foreign.dependencies.repository.loadPurchase = async () => ({ ...clone(foreign.state.purchase), projectId: OTHER_PROJECT });
  assert.equal(await accessStatus(foreign), "unavailable"); await noCheckout(await foreign.checkout());
});

test("managed signed webhook reads fresh finances and commits a minimal receipt once", async () => {
  const f = fixture(); f.state.charge.amount_refunded = 1;
  const first = await f.webhook(); assert.equal(first.status, 200);
  assert.deepEqual(await first.json(), { received: true, handled: true, duplicate: false });
  assert.equal(f.state.records[0].status, "refunded"); assert.equal(f.state.seenEvents.size, 1);
  assert.ok(f.state.calls.some(({ name }) => name === "listRefunds")); assert.ok(f.state.calls.some(({ name }) => name === "listDisputes"));
  const second = await f.webhook(); assert.equal(second.status, 200); assert.equal((await second.json()).duplicate, true);
  assert.equal(f.state.records.length, 1);
  assert.deepEqual(Object.keys(f.state.records[0]).sort(), ["attemptId", "eventId", "eventType", "paymentIntentId", "projectId",
    "sessionId", "status", "stripeLivemode", "verifiedAt"]);
  assert.doesNotMatch(JSON.stringify(f.state.records), new RegExp(`country|claimSecret|${IDENTITY.claimSecret}|${PRIVATE_SENTINEL}`));
});

test("managed webhook verifies the SDK signature, timestamp, mode and correct account before ledger work", async () => {
  for (const options of [{ secret: "whsec_synthetic_wrong_audit" }, { headers: { "Stripe-Signature": "" } },
    { timestamp: Math.floor(Date.now() / 1000) - 1000 }]) {
    const f = fixture(); assert.equal((await f.webhook(options)).status, 400);
    assert.equal(f.state.calls.some(({ name }) => name === "retrieveAccount"), false); assert.equal(f.state.records.length, 0);
  }
  for (const mutate of [(s) => { s.event.livemode = true; }, (s) => { s.event.account = "acct_OtherAudit"; },
    (s) => { s.event.data.object.livemode = true; }]) {
    const f = fixture(); mutate(f.state); assert.equal((await f.webhook()).status, 400); assert.equal(f.state.records.length, 0);
  }
  const oversized = fixture(); oversized.state.event.data.object.patternText = PRIVATE_SENTINEL.repeat(50_000);
  assert.equal((await oversized.webhook()).status, 413);
  assert.equal(oversized.state.calls.some(({ name }) => name === "constructWebhookEvent"), false);
});

test("managed webhook rejects malformed binding metadata and ignores unrelated services", async (t) => {
  for (const [key, value] of Object.entries({ offer_version: "UNKNOWN-OFFER", project_id: "not-a-uuid", attempt_id: OTHER_PROJECT,
    claim_sha256: "f".repeat(64), purchase_country: "BR", market_policy_version: "UNKNOWN-POLICY", product_tax_code: "not-a-tax-code" })) {
    await t.test(key, async () => {
      const f = fixture(); f.state.event.data.object.metadata[key] = value;
      assert.equal((await f.webhook()).status, 503); assert.equal(f.state.records.length, 0); assert.equal(f.state.seenEvents.size, 0);
    });
  }
  const foreign = fixture(); foreign.state.event.data.object.metadata.service = "unrelated_service";
  assert.deepEqual(await (await foreign.webhook()).json(), { received: true, handled: false }); assert.equal(foreign.state.records.length, 0);
  const eventType = fixture(); eventType.state.event.type = "customer.updated";
  assert.deepEqual(await (await eventType.webhook()).json(), { received: true, handled: false }); assert.equal(eventType.state.records.length, 0);
});

test("managed signed webhook recovers lost attachment without a new checkout or live sales flags", async () => {
  const f = fixture({ attached: false });
  const response = await f.webhook({ env: { STITCHPROOF_CHECKOUT_ENABLED: "false", STITCHPROOF_MANAGED_PAYMENTS_CONFIRMED: "false",
    STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED: "false", STITCHPROOF_MANAGED_PAYMENT_METHODS_CONFIRMED: "false",
    STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED: "false" } });
  assert.equal(response.status, 200); assert.equal(f.state.purchase.attempt.checkoutSessionId, f.state.session.id);
  assert.equal(f.state.records[0].status, "paid"); assert.equal(f.state.providerCreates, 0);
  assert.equal(f.state.calls.some(({ name }) => name === "retrievePrice"), false);
  const wrongCurrent = fixture({ attached: false }); wrongCurrent.state.session.metadata.purchase_country = "CA";
  assert.equal((await wrongCurrent.webhook()).status, 503);
  assert.equal(wrongCurrent.state.purchase.attempt.checkoutSessionId, null); assert.equal(wrongCurrent.state.seenEvents.size, 0);
});

test("managed financial webhooks resolve metadata through the current PaymentIntent, not stale event status", async () => {
  for (const eventType of ["refund.failed", "charge.refunded", "charge.dispute.closed"]) {
    const f = fixture();
    f.state.event.type = eventType;
    f.state.event.data.object = eventType === "charge.refunded" ? clone(f.state.charge)
      : eventType.startsWith("refund") ? refundFor(f, { status: "failed" }) : disputeFor(f, { status: "won" });
    f.state.refunds.data = [refundFor(f, { status: "pending" })];
    const response = await f.webhook(); assert.equal(response.status, 200); assert.equal(f.state.records[0].status, "refunded");
  }
  const chargeFallback = fixture(); chargeFallback.state.event.type = "refund.updated";
  chargeFallback.state.event.data.object = refundFor(chargeFallback, { payment_intent: null, status: "succeeded" });
  chargeFallback.state.charge.amount_refunded = 1;
  assert.equal((await chargeFallback.webhook()).status, 200); assert.equal(chargeFallback.state.records[0].status, "refunded");
});

test("managed webhook provider/persistence failure is retryable and never commits an unverified receipt", async () => {
  for (const name of ["retrieveAccount", "loadWebhookAttempt", "retrieveCheckoutSession", "retrievePaymentIntent", "retrieveCharge",
    "listRefunds", "listDisputes", "recordWebhookEvent"]) {
    const f = fixture(); f.state.failOn = name;
    const response = await f.webhook(); assert.equal(response.status, 503);
    const body = await response.text(); assert.deepEqual(JSON.parse(body), { received: false });
    assert.doesNotMatch(body, new RegExp(PRIVATE_SENTINEL)); assert.equal(f.state.seenEvents.size, 0);
  }
  const stale = fixture(); stale.state.verificationSaved = false;
  assert.equal((await stale.webhook()).status, 503); assert.equal(stale.state.records.length, 0); assert.equal(stale.state.seenEvents.size, 0);
  stale.state.verificationSaved = true; assert.equal((await stale.webhook()).status, 200); assert.equal(stale.state.seenEvents.size, 1);
});

test("managed server adapter expands currency options and preserves private versioned RPC boundaries", async () => {
  const source = await readFile(new URL("../src/lib/stitchproof-purchase-server.ts", import.meta.url), "utf8");
  assert.match(source, /import "server-only"/);
  assert.match(source, /expand: configuration\.taxMode === "managed" \? \["product", "currency_options"\] : \["product"\]/);
  assert.match(source, /STITCHPROOF_APPLIED_MIGRATION_VERSION === STITCHPROOF_MANAGED_SCHEMA_VERSION/);
  assert.match(source, /purchaseRpc\("stitchproof_purchase_load"\)/);
  assert.match(source, /purchaseRpc\("stitchproof_purchase_reserve"\)/);
  assert.match(source, /constructEvent\(rawBody, signature, configuration\.webhookSecret\)/);
  assert.doesNotMatch(source, /console\.|customer_details|patternText|claimSecret|\.from\(/);
});
