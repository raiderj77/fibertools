import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import test from "node:test";
import ts from "typescript";
import { PGlite } from "@electric-sql/pglite";

import {
  handleStitchProofAccessRequest, handleStitchProofCheckoutRequest,
} from "../src/lib/stitchproof-purchase-service.mjs";

const require = createRequire(import.meta.url);
const ROOT = new URL("../", import.meta.url);
const OLD_VERSION = "20260826_stitchproof_project_entitlements";
const NEW_VERSION = "20260827_stitchproof_managed_payments";
const ORIGINAL_SQL = await readFile(new URL("supabase/migrations/20260826_stitchproof_project_entitlements.sql", ROOT), "utf8");
const MANAGED_SQL = await readFile(new URL("supabase/migrations/20260827_stitchproof_managed_payments.sql", ROOT), "utf8");

// Keep the actual TypeScript adapter's RPC selection and parameter construction.
// Only its server-only marker and external provider client imports are replaced
// in memory. No transpiled file, external database, HTTP server or payment exists.
function resolveImports(source, base) {
  return source.replace(/from\s+["']([^"']+)["']/g, (_, specifier) => {
    const resolved = specifier.startsWith("node:") ? specifier : specifier.startsWith(".")
      ? new URL(specifier, base).href : pathToFileURL(require.resolve(specifier)).href;
    return `from ${JSON.stringify(resolved)}`;
  });
}

async function syntheticFixtures() {
  // Reuse the independent synthetic provider definitions, not their repository
  // mock or registered tests. This bridge substitutes actual PostgreSQL RPCs.
  const sourceUrl = new URL("tests/stitchproof-purchase-managed.test.mjs", ROOT);
  const source = await readFile(sourceUrl, "utf8");
  const firstTest = source.indexOf("\ntest(");
  assert.ok(firstTest > 0, "Independent synthetic fixture definitions must precede their tests");
  const moduleSource = resolveImports(source.slice(0, firstTest), sourceUrl)
    + "\nexport { fixture, environment, contract, IDENTITY, CLAIM_HASH, ATTEMPT_ID };";
  return import(`data:text/javascript,${encodeURIComponent(moduleSource)}`);
}

const RPC_ARGUMENTS = Object.freeze({
  stitchproof_purchase_schema_version: [],
  stitchproof_purchase_load: [["p_project_id", "uuid"], ["p_claim_sha256", "text"], ["p_stripe_livemode", "boolean"]],
  stitchproof_purchase_load_webhook: [["p_project_id", "uuid"], ["p_attempt_id", "uuid"], ["p_claim_sha256", "text"], ["p_stripe_livemode", "boolean"]],
  stitchproof_purchase_reserve: [["p_project_id", "uuid"], ["p_claim_sha256", "text"], ["p_stripe_livemode", "boolean"],
    ["p_attempt_id", "uuid"], ["p_expected_attempt_id", "uuid"], ["p_contract", "jsonb"]],
  stitchproof_purchase_attach_checkout: [["p_project_id", "uuid"], ["p_stripe_livemode", "boolean"], ["p_attempt_id", "uuid"],
    ["p_session_id", "text"], ["p_payment_intent_id", "text"], ["p_expires_at", "timestamptz"]],
  stitchproof_purchase_record_verification: [["p_project_id", "uuid"], ["p_stripe_livemode", "boolean"], ["p_attempt_id", "uuid"],
    ["p_session_id", "text"], ["p_payment_intent_id", "text"], ["p_status", "text"], ["p_verified_at", "timestamptz"]],
});
const VERSIONED_RPC_NAMES = new Set([
  "stitchproof_purchase_schema_version", "stitchproof_purchase_load",
  "stitchproof_purchase_load_webhook", "stitchproof_purchase_reserve",
]);

const request = (path, body) => new Request(`http://localhost:3000/api/stitchproof/${path}`, {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "http://localhost:3000", "Sec-Fetch-Site": "same-origin" },
  body: JSON.stringify(body),
});

test("actual adapter bridges v1/v2 SQL, concurrent country binding and paid access while sales are closed", async () => {
  const { fixture, environment, contract, IDENTITY, CLAIM_HASH, ATTEMPT_ID } = await syntheticFixtures();
  const calls = [];
  let activeDatabase;
  const originalClientStub = globalThis.__stitchproofAdapterSqlClient;
  globalThis.__stitchproofAdapterSqlClient = () => ({
    rpc: async (name, parameters = {}) => {
      const base = name.replace(/_v2$/, "");
      assert.ok(Object.hasOwn(RPC_ARGUMENTS, base), `Unexpected adapter RPC: ${name}`);
      if (name.endsWith("_v2")) assert.ok(VERSIONED_RPC_NAMES.has(base), "Shared financial mutators must stay on v1");
      const args = RPC_ARGUMENTS[base];
      assert.deepEqual(Object.keys(parameters).sort(), args.map(([key]) => key).sort());
      calls.push(name);
      const placeholders = args.map(([, type], index) => `$${index + 1}::${type}`).join(",");
      const values = args.map(([key, type]) => type === "jsonb" ? JSON.stringify(parameters[key]) : parameters[key]);
      try {
        const result = await activeDatabase.query(`select public.${name}(${placeholders}) as value`, values);
        return { data: result.rows[0].value, error: null };
      } catch {
        return { data: null, error: { message: "Synthetic local SQL failure" } };
      }
    },
  });

  async function database(managed, run) {
    activeDatabase = new PGlite();
    try {
      await activeDatabase.exec("create role anon; create role authenticated; create role service_role;");
      await activeDatabase.exec(ORIGINAL_SQL);
      if (managed) await activeDatabase.exec(`begin;\n${MANAGED_SQL}\ncommit;`);
      await run();
    } finally { await activeDatabase.close(); }
  }

  try {
    const adapterUrl = new URL("src/lib/stitchproof-purchase-server.ts", ROOT);
    let adapterSource = ts.transpileModule(await readFile(adapterUrl, "utf8"), {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    assert.match(adapterSource, /^import "server-only";/m);
    assert.match(adapterSource, /import \{ createClient \} from "@supabase\/supabase-js";/);
    assert.match(adapterSource, /import Stripe from "stripe";/);
    adapterSource = adapterSource.replace(/^import "server-only";\s*/m, "")
      .replace(/import \{ createClient \} from "@supabase\/supabase-js";/,
        "const createClient=globalThis.__stitchproofAdapterSqlClient;")
      .replace(/import Stripe from "stripe";/,
        'class Stripe { constructor() { throw new Error("Real Stripe transport is forbidden in this local SQL test"); } }');
    const { createStitchProofPurchaseDependencies } = await import(
      `data:text/javascript,${encodeURIComponent(resolveImports(adapterSource, adapterUrl))}`);

    await database(false, async () => {
      const f = fixture({ managed: false, paid: true });
      const env = environment({ STITCHPROOF_APPLIED_MIGRATION_VERSION: OLD_VERSION, STITCHPROOF_CHECKOUT_ENABLED: "false" });
      const repository = createStitchProofPurchaseDependencies(env).repository;
      assert.equal(await repository.verifySchema(), OLD_VERSION);
      await repository.reserveAttempt({ projectId: IDENTITY.projectId, claimSha256: CLAIM_HASH, stripeLivemode: false,
        attemptId: ATTEMPT_ID, expectedAttemptId: null, contract: contract({ managed: false }) });
      await repository.attachCheckout({ projectId: IDENTITY.projectId, stripeLivemode: false, attemptId: ATTEMPT_ID,
        sessionId: f.state.session.id, paymentIntentId: f.state.payment.id, expiresAt: new Date(Date.now() + 3_600_000).toISOString() });
      const result = await handleStitchProofAccessRequest({ request: request("access", IDENTITY), env,
        dependencies: { repository, stripe: f.dependencies.stripe }, now: new Date() });
      assert.deepEqual(await result.json(), { status: "paid" });
      assert.equal((await repository.loadWebhookAttempt({ projectId: IDENTITY.projectId, claimSha256: CLAIM_HASH,
        stripeLivemode: false, attemptId: ATTEMPT_ID })).attempt.id, ATTEMPT_ID);
    });

    await database(true, async () => {
      const f = fixture({ known: false, attached: false, paid: false });
      const env = environment();
      const repository = createStitchProofPurchaseDependencies(env).repository;
      assert.equal(await repository.verifySchema(), NEW_VERSION);
      const create = f.dependencies.stripe.createCheckoutSession;
      f.dependencies.stripe.createCheckoutSession = async (...args) => {
        const session = await create(...args);
        session.expires_at = Math.floor(Date.now() / 1000) + 3600;
        f.state.sessions.get(session.id).expires_at = session.expires_at;
        return session;
      };
      const dependencies = { repository, stripe: f.dependencies.stripe };
      const responses = await Promise.all(["US", "CA"].map((country) => handleStitchProofCheckoutRequest({
        request: request("checkout", { ...IDENTITY, country }), env, dependencies, now: new Date(),
      })));
      const bodies = await Promise.all(responses.map((response) => response.json()));
      assert.equal(bodies.filter((body) => body.checkoutUrl).length, 1);
      assert.equal(f.state.providerCreates, 1);
      assert.equal((await activeDatabase.query("select count(*)::integer as n from public.stitchproof_purchase_attempts")).rows[0].n, 1);
      const stored = await repository.loadPurchase({ projectId: IDENTITY.projectId, claimSha256: CLAIM_HASH, stripeLivemode: false });
      const conflicting = await handleStitchProofCheckoutRequest({ request: request("checkout", { ...IDENTITY,
        country: stored.attempt.purchaseCountry === "US" ? "CA" : "US" }), env, dependencies, now: new Date(Date.now() + 1000) });
      assert.equal(conflicting.status, 409);
      assert.equal((await conflicting.json()).checkoutUrl, undefined);

      f.state.session.status = "complete";
      f.state.session.payment_status = "paid";
      f.state.session.payment_intent = f.state.payment.id;
      const closedEnv = { ...env, STITCHPROOF_CHECKOUT_ENABLED: "false", STITCHPROOF_TAX_MODE: "unconfigured",
        STITCHPROOF_TAX_BEHAVIOR: "unconfigured", STITCHPROOF_MANAGED_PAYMENTS_CONFIRMED: "false",
        STITCHPROOF_MANAGED_COUNTRY_ENFORCEMENT_CONFIRMED: "false", STITCHPROOF_MANAGED_DELIVERY_TEST_CONFIRMED: "false",
        STITCHPROOF_STRIPE_PRODUCT_ID: "prod_Changed", STITCHPROOF_STRIPE_PRICE_ID: "price_Changed" };
      const closedRepository = createStitchProofPurchaseDependencies(closedEnv).repository;
      const result = await handleStitchProofAccessRequest({ request: request("access", IDENTITY), env: closedEnv,
        dependencies: { repository: closedRepository, stripe: f.dependencies.stripe }, now: new Date(Date.now() + 2000) });
      assert.deepEqual(await result.json(), { status: "paid" });
      assert.equal(f.state.providerCreates, 1);
      assert.equal((await closedRepository.loadWebhookAttempt({ projectId: IDENTITY.projectId, claimSha256: CLAIM_HASH,
        stripeLivemode: false, attemptId: stored.attempt.id })).attempt.purchaseCountry, stored.attempt.purchaseCountry);
    });

    for (const name of VERSIONED_RPC_NAMES) {
      assert.ok(calls.includes(name), `v1 RPC must be exercised: ${name}`);
      assert.ok(calls.includes(`${name}_v2`), `v2 RPC must be exercised: ${name}_v2`);
    }
    assert.ok(calls.includes("stitchproof_purchase_attach_checkout"));
    assert.ok(calls.includes("stitchproof_purchase_record_verification"));
  } finally {
    if (originalClientStub === undefined) delete globalThis.__stitchproofAdapterSqlClient;
    else globalThis.__stitchproofAdapterSqlClient = originalClientStub;
  }
});
