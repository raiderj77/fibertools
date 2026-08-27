import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  STITCHPROOF_OFFER_VERSION, STITCHPROOF_SCHEMA_VERSION, STITCHPROOF_SERVICE,
  STITCHPROOF_STRIPE_ACCOUNT_ID, getStitchProofConfiguration, getStitchProofEnvironmentReadiness,
} from "../src/lib/stitchproof-purchase-config.mjs";
import {
  buildStitchProofCheckoutParameters, getStitchProofCheckoutAvailability,
  handleStitchProofCheckoutRequest, validatedStitchProofCheckoutUrl, verifyStitchProofPurchase,
} from "../src/lib/stitchproof-purchase-service.mjs";

function environment(overrides = {}) {
  return {
    STRIPE_MODE: "test", STRIPE_SECRET_KEY: "sk_test_syntheticUnitFixture",
    FIBERTOOLS_STRIPE_ACCOUNT_ID: STITCHPROOF_STRIPE_ACCOUNT_ID,
    NEXT_PUBLIC_SITE_URL: "http://localhost:3000", NODE_ENV: "test", VERCEL_ENV: "development",
    SUPABASE_URL: "https://synthetic-unit.supabase.co", SUPABASE_SECRET_KEY: "synthetic-only-service-role",
    STITCHPROOF_CHECKOUT_ENABLED: "true", STITCHPROOF_STRIPE_PRODUCT_ID: "prod_SyntheticOnly",
    STITCHPROOF_STRIPE_PRICE_ID: "price_SyntheticOnly", STITCHPROOF_STRIPE_WEBHOOK_SECRET: "whsec_syntheticOnly",
    STITCHPROOF_APPLIED_MIGRATION_VERSION: STITCHPROOF_SCHEMA_VERSION,
    STITCHPROOF_SCHEMA_CONFIRMED: "true", STITCHPROOF_WEBHOOK_CONFIRMED: "true",
    STITCHPROOF_ABUSE_PROTECTION_PROVIDER: "VERCEL_WAF", STITCHPROOF_ABUSE_PROTECTION_CONFIRMED: "true",
    STITCHPROOF_TAX_MODE: "none", STITCHPROOF_TAX_BEHAVIOR: "not_applicable",
    STITCHPROOF_TAX_CONFIGURATION_CONFIRMED: "true", ...overrides,
  };
}

function availableFixture() {
  const state = { calls: [], account: { id: STITCHPROOF_STRIPE_ACCOUNT_ID, charges_enabled: true }, schema: STITCHPROOF_SCHEMA_VERSION,
    price: { id: "price_SyntheticOnly", object: "price", type: "one_time", recurring: null, active: true,
      livemode: false, currency: "usd", unit_amount: 900, tax_behavior: "unspecified",
      product: { id: "prod_SyntheticOnly", object: "product", active: true, livemode: false,
        metadata: { service: STITCHPROOF_SERVICE, offer_version: STITCHPROOF_OFFER_VERSION } } } };
  const dependencies = {
    stripe: {
      async retrieveAccount() { state.calls.push("account"); return state.account; },
      async retrievePrice() { state.calls.push("price"); return state.price; },
      async createCheckoutSession() { throw new Error("Availability must not create a payment."); },
    },
    repository: {
      async verifySchema() { state.calls.push("schema"); return state.schema; },
      async reserveAttempt() { throw new Error("Availability must not write a purchase."); },
    },
  };
  return { state, dependencies };
}

test("sales default disabled and every independent readiness boundary fails closed", () => {
  assert.equal(getStitchProofConfiguration({}, { checkout: true }), null);
  assert.equal(getStitchProofEnvironmentReadiness(environment()).ready, true);
  for (const key of ["STITCHPROOF_CHECKOUT_ENABLED", "STITCHPROOF_SCHEMA_CONFIRMED", "STITCHPROOF_WEBHOOK_CONFIRMED",
    "STITCHPROOF_ABUSE_PROTECTION_CONFIRMED", "STITCHPROOF_TAX_CONFIGURATION_CONFIRMED"]) {
    for (const value of [undefined, "false", "TRUE", "1"]) assert.equal(getStitchProofConfiguration(environment({ [key]: value }), { checkout: true }), null);
  }
  for (const overrides of [
    { FIBERTOOLS_STRIPE_ACCOUNT_ID: "acct_Other" }, { STRIPE_MODE: "" }, { STRIPE_SECRET_KEY: "sk_live_syntheticOnly" },
    { STITCHPROOF_STRIPE_PRODUCT_ID: "prod_replace_me" }, { STITCHPROOF_STRIPE_PRICE_ID: "price_replace_me" },
    { STITCHPROOF_STRIPE_WEBHOOK_SECRET: "whsec_replace_me" }, { STITCHPROOF_APPLIED_MIGRATION_VERSION: "unknown" },
    { STITCHPROOF_ABUSE_PROTECTION_PROVIDER: "IN_MEMORY" }, { SUPABASE_URL: "https://example-project.supabase.co" },
    { SUPABASE_SECRET_KEY: "replace_me" }, { STITCHPROOF_TAX_MODE: "unconfigured" },
    { STITCHPROOF_TAX_MODE: "automatic", STITCHPROOF_TAX_BEHAVIOR: "not_applicable" },
  ]) assert.equal(getStitchProofConfiguration(environment(overrides), { checkout: true }), null);
});

test("canonical production is live-only while explicitly configured protected preview supports test mode", () => {
  for (const overrides of [{ VERCEL_ENV: "production" }, { NEXT_PUBLIC_SITE_URL: "https://fibertools.app" },
    { NEXT_PUBLIC_SITE_URL: "https://fibertools.app/", VERCEL_ENV: "preview" }]) {
    assert.equal(getStitchProofConfiguration(environment(overrides)), null);
  }
  assert.ok(getStitchProofConfiguration(environment({ NODE_ENV: "production", VERCEL_ENV: "preview",
    NEXT_PUBLIC_SITE_URL: "https://synthetic-preview.vercel.app" })));
  assert.ok(getStitchProofConfiguration(environment({ NODE_ENV: "production", VERCEL_ENV: "development" })));
  assert.ok(getStitchProofConfiguration(environment({ NODE_ENV: "production", VERCEL_ENV: "production",
    STRIPE_MODE: "live", STRIPE_SECRET_KEY: "sk_live_syntheticOnly", NEXT_PUBLIC_SITE_URL: "https://fibertools.app" })));
  for (const site of ["https://unrelated.example.org", "http://fibertools.app", "https://fibertools.app.evil.invalid", "https://synthetic-preview.vercel.app/path"]) {
    assert.equal(getStitchProofConfiguration(environment({ NEXT_PUBLIC_SITE_URL: site })), null);
  }
});

test("existing purchase configuration is independent of sales flags and current price/tax setup", () => {
  const env = environment({ STITCHPROOF_CHECKOUT_ENABLED: "false", STITCHPROOF_SCHEMA_CONFIRMED: "false",
    STITCHPROOF_WEBHOOK_CONFIRMED: "false", STITCHPROOF_STRIPE_PRICE_ID: "", STITCHPROOF_STRIPE_PRODUCT_ID: "",
    STITCHPROOF_TAX_MODE: "unconfigured", STITCHPROOF_TAX_BEHAVIOR: "unconfigured",
    STITCHPROOF_TAX_CONFIGURATION_CONFIRMED: "false", STITCHPROOF_ABUSE_PROTECTION_CONFIRMED: "false" });
  assert.ok(getStitchProofConfiguration(env));
  assert.equal(getStitchProofConfiguration(env, { checkout: true }), null);
  assert.ok(getStitchProofConfiguration(env, { webhook: true }));
  assert.equal(getStitchProofConfiguration({ ...env, STITCHPROOF_STRIPE_WEBHOOK_SECRET: "" }, { webhook: true }), null);
});

test("availability performs real account/schema/product/price reads but no purchase mutation", async () => {
  const f = availableFixture();
  const result = await handleStitchProofCheckoutRequest({ request: new Request("http://localhost:3000/api/stitchproof/checkout"),
    env: environment(), dependencies: f.dependencies });
  assert.deepEqual(await result.json(), { available: true });
  assert.deepEqual(f.state.calls, ["account", "schema", "price"]);
  assert.match(result.headers.get("cache-control"), /no-store/);
  assert.equal(result.headers.get("referrer-policy"), "no-referrer");
  assert.match(result.headers.get("x-robots-tag"), /noindex/);
  f.state.calls.length = 0;
  assert.deepEqual(await getStitchProofCheckoutAvailability({ env: environment({ STITCHPROOF_CHECKOUT_ENABLED: "false" }), dependencies: f.dependencies }), { available: false });
  assert.deepEqual(f.state.calls, []);
});

test("new-sale availability rejects provider failures, disabled charges, wrong or inactive contracts", async (t) => {
  const mutations = {
    "wrong account": (f) => { f.state.account.id = "acct_Other"; },
    "charges disabled": (f) => { f.state.account.charges_enabled = false; },
    "charges unverified": (f) => { delete f.state.account.charges_enabled; },
    "wrong schema": (f) => { f.state.schema = "unverified"; },
    "inactive price": (f) => { f.state.price.active = false; },
    "wrong amount": (f) => { f.state.price.unit_amount = 901; },
    "wrong price": (f) => { f.state.price.id = "price_Other"; },
    "wrong product": (f) => { f.state.price.product.id = "prod_Other"; },
    "unexpanded product": (f) => { f.state.price.product = "prod_SyntheticOnly"; },
    "inactive product": (f) => { f.state.price.product.active = false; },
    "wrong offer metadata": (f) => { f.state.price.product.metadata.offer_version = "unknown"; },
    "wrong mode": (f) => { f.state.price.livemode = true; },
    "currency mismatch": (f) => { f.state.price.currency = "eur"; },
    "subscription": (f) => { f.state.price.type = "recurring"; f.state.price.recurring = { interval: "month" }; },
    "provider unavailable": (f) => { f.dependencies.stripe.retrievePrice = async () => { throw new Error("synthetic only"); }; },
  };
  for (const [name, mutate] of Object.entries(mutations)) await t.test(name, async () => {
    const f = availableFixture(); mutate(f);
    assert.deepEqual(await getStitchProofCheckoutAvailability({ env: environment(), dependencies: f.dependencies }), { available: false });
  });
});

test("tax activation requires an explicit matching price behavior and never guesses the legal mode", async () => {
  for (const behavior of ["inclusive", "exclusive"]) {
    const f = availableFixture();
    const env = environment({ STITCHPROOF_TAX_MODE: "automatic", STITCHPROOF_TAX_BEHAVIOR: behavior });
    assert.deepEqual(await getStitchProofCheckoutAvailability({ env, dependencies: f.dependencies }), { available: false });
    f.state.price.tax_behavior = behavior;
    assert.deepEqual(await getStitchProofCheckoutAvailability({ env, dependencies: f.dependencies }), { available: true });
  }
});

test("exact Checkout parameters disable currency conversion, adjusted quantity, discounts, phone and recovery checkouts", () => {
  const purchase = { projectId: "10000000-0000-4000-8000-000000000001", claimSha256: "b".repeat(64),
    attempt: { id: "20000000-0000-4000-8000-000000000001", offerVersion: STITCHPROOF_OFFER_VERSION,
      priceId: "price_SyntheticOnly", taxMode: "none" },
    // Extra input fields must never be forwarded by the provider parameter builder.
    claimSecret: "c".repeat(64), patternText: "SYNTHETIC PRIVATE PATTERN" };
  const config = getStitchProofConfiguration(environment());
  const params = buildStitchProofCheckoutParameters({ purchase, successUrl: config.successUrl, cancelUrl: config.cancelUrl });
  assert.equal(params.mode, "payment");
  assert.equal(params.ui_mode, "hosted");
  assert.deepEqual(params.line_items, [{ price: "price_SyntheticOnly", quantity: 1, adjustable_quantity: { enabled: false } }]);
  assert.deepEqual(params.payment_method_types, ["card"]);
  assert.equal(params.allow_promotion_codes, false);
  assert.deepEqual(params.automatic_tax, { enabled: false });
  assert.deepEqual(params.adaptive_pricing, { enabled: false });
  assert.deepEqual(params.after_expiration, { recovery: { enabled: false } });
  assert.deepEqual(params.phone_number_collection, { enabled: false });
  assert.equal(params.payment_intent_data.capture_method, "automatic");
  assert.deepEqual(Object.keys(params.metadata).sort(), ["attempt_id", "claim_sha256", "offer_version", "project_id", "service"]);
  assert.deepEqual(params.payment_intent_data.metadata, params.metadata);
  assert.equal(params.client_reference_id, purchase.projectId);
  assert.doesNotMatch(params.success_url + params.cancel_url, /cs_|claim|projectId|10000000/);
  assert.doesNotMatch(JSON.stringify(params), /SYNTHETIC PRIVATE PATTERN|cccccccccccccccc|customer_email|customer_creation|expires_at|subscription_data/);
  purchase.attempt.taxMode = "automatic";
  assert.deepEqual(buildStitchProofCheckoutParameters({ purchase, successUrl: config.successUrl, cancelUrl: config.cancelUrl }).automatic_tax, { enabled: true });
});

test("current financial verification uses the stored inclusive/exclusive tax contract and exact charged total", async () => {
  for (const taxBehavior of ["inclusive", "exclusive"]) {
    const configuration = getStitchProofConfiguration(environment());
    const purchase = { projectId: "10000000-0000-4000-8000-000000000001", claimSha256: "b".repeat(64), stripeLivemode: false,
      attempt: { id: "20000000-0000-4000-8000-000000000001", stripeAccountId: STITCHPROOF_STRIPE_ACCOUNT_ID,
        priceId: "price_Historical", productId: "prod_Historical", offerVersion: STITCHPROOF_OFFER_VERSION,
        amountCents: 900, currency: "usd", taxMode: "automatic", taxBehavior,
        checkoutSessionId: "cs_test_Taxed", paymentIntentId: "pi_Taxed" } };
    const amount = taxBehavior === "inclusive" ? 900 : 974;
    const metadata = { service: STITCHPROOF_SERVICE, offer_version: STITCHPROOF_OFFER_VERSION,
      project_id: purchase.projectId, attempt_id: purchase.attempt.id, claim_sha256: purchase.claimSha256 };
    const session = { id: "cs_test_Taxed", object: "checkout.session", livemode: false, mode: "payment", status: "complete",
      payment_status: "paid", payment_intent: "pi_Taxed", metadata, client_reference_id: purchase.projectId,
      payment_method_types: ["card"], allow_promotion_codes: false, currency: "usd", amount_subtotal: 900, amount_total: amount,
      total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 74 }, automatic_tax: { enabled: true, status: "complete" },
      line_items: { has_more: false, data: [{ quantity: 1, currency: "usd", amount_subtotal: 900, amount_total: amount,
        amount_discount: 0, amount_tax: 74,
        price: { id: "price_Historical", object: "price", type: "one_time", recurring: null, currency: "usd", unit_amount: 900,
          livemode: false, tax_behavior: taxBehavior, product: "prod_Historical" } }] } };
    const payment = { id: "pi_Taxed", object: "payment_intent", livemode: false, status: "succeeded", currency: "usd",
      amount, amount_received: amount, metadata, latest_charge: "ch_Taxed" };
    const charge = { id: "ch_Taxed", object: "charge", livemode: false, status: "succeeded", paid: true, captured: true,
      currency: "usd", amount, amount_refunded: 0, refunded: false, disputed: false, payment_intent: "pi_Taxed",
      payment_method_details: { type: "card" } };
    const dependencies = { stripe: {
      retrieveCheckoutSession: async () => session, retrievePaymentIntent: async () => payment, retrieveCharge: async () => charge,
      listRefunds: async () => ({ has_more: false, data: [] }), listDisputes: async () => ({ has_more: false, data: [] }),
    } };
    assert.equal((await verifyStitchProofPurchase(purchase, configuration, dependencies)).status, "paid");
    session.automatic_tax.status = "requires_location_inputs";
    assert.equal((await verifyStitchProofPurchase(purchase, configuration, dependencies)).status, "unavailable");
    session.automatic_tax.status = "complete";
    payment.amount_received -= 1;
    assert.equal((await verifyStitchProofPurchase(purchase, configuration, dependencies)).status, "unavailable");
    payment.amount_received += 1;
    session.line_items.data[0].price.tax_behavior = taxBehavior === "inclusive" ? "exclusive" : "inclusive";
    assert.equal((await verifyStitchProofPurchase(purchase, configuration, dependencies)).status, "unavailable");
  }
});

test("checkout redirect validation accepts only the exact Stripe-hosted session URL", () => {
  const config = getStitchProofConfiguration(environment());
  const id = "cs_test_SyntheticOnly";
  assert.equal(validatedStitchProofCheckoutUrl({ id, url: `https://checkout.stripe.com/c/pay/${id}#opaque` }, config), `https://checkout.stripe.com/c/pay/${id}#opaque`);
  for (const url of [`https://checkout.stripe.com.evil.invalid/c/pay/${id}`, `http://checkout.stripe.com/c/pay/${id}`,
    `https://user:password@checkout.stripe.com/c/pay/${id}`, `https://checkout.stripe.com:8443/c/pay/${id}`,
    "https://checkout.stripe.com/c/pay/cs_test_Other", `https://checkout.stripe.com/redirect?next=${id}`]) {
    assert.equal(validatedStitchProofCheckoutUrl({ id, url }, config), null);
  }
  assert.equal(validatedStitchProofCheckoutUrl({ id: "cs_live_SyntheticOnly", url: "https://checkout.stripe.com/c/pay/cs_live_SyntheticOnly" }, config), null);
});

test("server adapter is isolated from other payment flows, uses constrained RPCs and scopes financial lists to the charge", async () => {
  const source = await readFile(new URL("../src/lib/stitchproof-purchase-server.ts", import.meta.url), "utf8");
  assert.match(source, /import "server-only"/);
  assert.match(source, /buildStitchProofCheckoutParameters\(input\)/);
  assert.match(source, /checkout\.sessions\.create\(parameters, \{ idempotencyKey \}\)/);
  assert.match(source, /refunds\.list\(\{ charge: chargeId, limit: 100 \}\)/);
  assert.match(source, /disputes\.list\(\{ charge: chargeId, limit: 100 \}\)/);
  assert.match(source, /constructEvent\(rawBody, signature, configuration\.webhookSecret\)/);
  assert.doesNotMatch(source, /console\.|\.from\(|designer_preflight|planning.pack|STRIPE_WEBHOOK_SECRET/);
  for (const route of ["checkout", "access", "webhook"]) {
    const routeSource = await readFile(new URL(`../src/app/api/stitchproof/${route}/route.ts`, import.meta.url), "utf8");
    assert.match(routeSource, /runtime = "nodejs"/);
    assert.match(routeSource, /dynamic = "force-dynamic"/);
    assert.match(routeSource, /createStitchProofPurchaseDependencies/);
    assert.doesNotMatch(routeSource, /console\.|customer|claimSecret|patternText/);
  }
});
