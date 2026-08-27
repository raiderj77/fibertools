import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

import { STITCHPROOF_SCHEMA_VERSION } from "../src/lib/stitchproof-purchase-config.mjs";

const MIGRATION = new URL("../supabase/migrations/20260826_stitchproof_project_entitlements.sql", import.meta.url);
const PROJECT = "10000000-0000-4000-8000-000000000001";
const PROJECT_TWO = "10000000-0000-4000-8000-000000000002";
const PROJECT_THREE = "10000000-0000-4000-8000-000000000003";
const ATTEMPT = "20000000-0000-4000-8000-000000000001";
const ATTEMPT_TWO = "20000000-0000-4000-8000-000000000002";
const ATTEMPT_THREE = "20000000-0000-4000-8000-000000000003";
const HASH = "a".repeat(64);
const CONTRACT = {
  stripeAccountId: "acct_1U5HWnD2Of3MIt94", productId: "prod_SyntheticOnly", priceId: "price_SyntheticOnly",
  offerVersion: "STITCHPROOF-PROJECT-V1", amountCents: 900, currency: "usd", taxMode: "none", taxBehavior: "not_applicable",
};
const TIME = "2026-08-26T20:00:00.000Z";

async function scalar(db, sql, params = []) {
  const { rows } = await db.query(sql, params);
  return rows.length ? Object.values(rows[0])[0] : null;
}
const reserve = (db, { project = PROJECT, attempt = ATTEMPT, hash = HASH, live = false, expected = null, contract = CONTRACT } = {}) =>
  scalar(db, "select public.stitchproof_purchase_reserve($1::uuid, $2::text, $3::boolean, $4::uuid, $5::uuid, $6::jsonb)",
    [project, hash, live, attempt, expected, JSON.stringify(contract)]);
const attach = (db, { project = PROJECT, attempt = ATTEMPT, live = false, session = "cs_test_SyntheticOnly", payment = null } = {}) =>
  scalar(db, "select public.stitchproof_purchase_attach_checkout($1::uuid, $2::boolean, $3::uuid, $4::text, $5::text, $6::timestamptz)",
    [project, live, attempt, session, payment, "2026-08-27T20:00:00.000Z"]);
const observe = (db, { project = PROJECT, attempt = ATTEMPT, live = false, session = "cs_test_SyntheticOnly", payment = "pi_SyntheticOnly", status = "paid", at = TIME } = {}) =>
  scalar(db, "select public.stitchproof_purchase_record_verification($1::uuid, $2::boolean, $3::uuid, $4::text, $5::text, $6::text, $7::timestamptz)",
    [project, live, attempt, session, payment, status, at]);
const load = (db, { project = PROJECT, hash = HASH, live = false } = {}) =>
  scalar(db, "select public.stitchproof_purchase_load($1::uuid, $2::text, $3::boolean)", [project, hash, live]);

async function withDatabase(run) {
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role;");
    await db.exec(await readFile(MIGRATION, "utf8"));
    await run(db);
  } finally { await db.close(); }
}

test("purchase migration executes with forced RLS, RPC-only service access and no customer/pattern fields", async () => {
  await withDatabase(async (db) => {
    assert.equal(await scalar(db, "select public.stitchproof_purchase_schema_version()"), STITCHPROOF_SCHEMA_VERSION);
    const tables = ["stitchproof_purchase_projects", "stitchproof_purchase_attempts", "stitchproof_purchase_webhook_events"];
    for (const table of tables) {
      const { rows } = await db.query("select relrowsecurity, relforcerowsecurity from pg_catalog.pg_class where oid = $1::regclass", [`public.${table}`]);
      assert.deepEqual(rows[0], { relrowsecurity: true, relforcerowsecurity: true });
      for (const role of ["anon", "authenticated", "service_role"]) {
        for (const operation of ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE"]) {
          assert.equal(await scalar(db, "select pg_catalog.has_table_privilege($1::text, $2::text, $3::text)", [role, `public.${table}`, operation]), false);
        }
      }
    }
    const functions = await db.query("select p.oid, p.proname, p.prosecdef, p.proconfig from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid=p.pronamespace where n.nspname='public' and p.proname like 'stitchproof_purchase_%'");
    assert.equal(functions.rows.length, 9);
    for (const fn of functions.rows) {
      assert.equal(fn.prosecdef, true);
      assert.ok(fn.proconfig.includes("search_path=public, pg_temp"));
      for (const role of ["anon", "authenticated", "service_role"]) {
        assert.equal(await scalar(db, "select pg_catalog.has_function_privilege($1::text, $2::oid, 'EXECUTE')", [role, fn.oid]),
          role === "service_role" && fn.proname !== "stitchproof_purchase_snapshot");
      }
    }
    const columns = await db.query("select column_name from information_schema.columns where table_schema='public' and table_name like 'stitchproof_purchase_%'");
    assert.doesNotMatch(columns.rows.map((row) => row.column_name).join(" "), /email|customer|pattern|title|claim_secret|address|phone|ip_address|access_expires|raw|payload|checkout_url/);

    await db.exec("begin; set local role anon;");
    await assert.rejects(db.query("select public.stitchproof_purchase_load($1::uuid, $2::text, false)", [PROJECT, HASH]), /permission denied/);
    await db.exec("rollback;");
    await db.exec("begin; set local role service_role;");
    assert.equal(await scalar(db, "select public.stitchproof_purchase_schema_version()"), STITCHPROOF_SCHEMA_VERSION);
    await assert.rejects(db.query("select * from public.stitchproof_purchase_projects"), /permission denied/);
    await db.exec("rollback;");

    await db.exec("begin; grant select on public.stitchproof_purchase_projects to anon;");
    assert.equal(await scalar(db, "select public.stitchproof_purchase_schema_version()"), null);
    await db.exec("rollback;");
  });
});

test("durable reservation reuses one attempt, isolates modes and cannot overwrite a different claimant", async () => {
  await withDatabase(async (db) => {
    const first = await reserve(db);
    assert.equal(first.attempt.id, ATTEMPT);
    assert.equal(first.attempt.status, "creating");
    assert.equal(first.claimSha256, HASH);
    const requests = await Promise.all(Array.from({ length: 12 }, (_, index) => reserve(db, {
      attempt: `30000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    })));
    assert.deepEqual(new Set(requests.map((value) => value.attempt.id)), new Set([ATTEMPT]));
    assert.equal(await scalar(db, "select count(*)::integer from public.stitchproof_purchase_attempts"), 1);
    assert.equal(await reserve(db, { hash: "b".repeat(64), attempt: ATTEMPT_TWO }), null);
    assert.equal(await load(db, { hash: "b".repeat(64) }), null);
    assert.equal(await load(db, { live: true }), null);
    const live = await reserve(db, { live: true, attempt: ATTEMPT_TWO });
    assert.equal(live.stripeLivemode, true);
    assert.equal(live.attempt.id, ATTEMPT_TWO);
    assert.equal((await load(db)).attempt.id, ATTEMPT);
    assert.equal(await scalar(db, "select count(*)::integer from public.stitchproof_purchase_projects"), 2);

    // An old ambiguous reservation remains the same attempt; time alone never
    // manufactures a second payable session after Stripe idempotency expires.
    await db.query("update public.stitchproof_purchase_attempts set created_at=pg_catalog.now()-interval '100 days' where id=$1::uuid", [ATTEMPT]);
    assert.equal((await reserve(db, { expected: ATTEMPT, attempt: ATTEMPT_THREE })).attempt.id, ATTEMPT);
    assert.equal(await attach(db, { live: true }), false);
    assert.equal(await attach(db), true);
    assert.equal(await attach(db), true);
    assert.equal(await attach(db, { session: "cs_test_Replacement" }), false);
    assert.equal((await load(db)).attempt.checkoutSessionId, "cs_test_SyntheticOnly");
    assert.equal(await observe(db), true);
    assert.equal(await observe(db, { payment: "pi_Wrong" }), false);
    assert.equal(await attach(db, { payment: "pi_Wrong" }), false);
    for (const [status, at] of [["paid", TIME], ["refunded", "2026-08-26T20:00:01Z"], ["disputed", "2026-08-26T20:00:02Z"]]) {
      assert.equal(await observe(db, { status, at }), true);
      assert.equal((await reserve(db, { expected: ATTEMPT, attempt: ATTEMPT_THREE })).attempt.id, ATTEMPT);
    }
    // A current merchant-won dispute can restore the original project without
    // a new charge or a time-limited entitlement.
    assert.equal(await observe(db, { status: "paid", at: "2028-08-26T20:00:00Z" }), true);
    assert.equal((await load(db)).attempt.id, ATTEMPT);
  });
});

test("only attached verified unpaid expiry permits compare-and-swap renewal; previous attempts stay recoverable", async () => {
  await withDatabase(async (db) => {
    await reserve(db, { project: PROJECT_TWO });
    assert.equal(await observe(db, { project: PROJECT_TWO, status: "expired", payment: null }), false);
    assert.equal(await attach(db, { project: PROJECT_TWO }), true);
    assert.equal(await observe(db, { project: PROJECT_TWO, status: "expired", payment: null }), true);
    const unchanged = await reserve(db, { project: PROJECT_TWO, expected: ATTEMPT_THREE, attempt: ATTEMPT_TWO });
    assert.equal(unchanged.attempt.id, ATTEMPT);
    const replacement = await reserve(db, { project: PROJECT_TWO, expected: ATTEMPT, attempt: ATTEMPT_TWO });
    assert.equal(replacement.attempt.id, ATTEMPT_TWO);
    assert.equal(replacement.attempt.status, "creating");
    assert.equal((await reserve(db, { project: PROJECT_TWO, expected: ATTEMPT, attempt: ATTEMPT_THREE })).attempt.id, ATTEMPT_TWO);
    const old = await scalar(db, "select public.stitchproof_purchase_load_webhook($1::uuid, $2::uuid, $3::text, false)", [PROJECT_TWO, ATTEMPT, HASH]);
    assert.equal(old.attempt.id, ATTEMPT);
    assert.equal(old.attempt.status, "expired");
    assert.equal(await scalar(db, "select count(*)::integer from public.stitchproof_purchase_attempts"), 2);
  });
});

test("invalid contracts, identities, null mode and extra private fields cannot create ledger records", async () => {
  await withDatabase(async (db) => {
    for (const args of [
      { live: null }, { hash: "f".repeat(63) }, { hash: "A".repeat(64) },
      { project: "10000000-0000-1000-8000-000000000001" },
      { attempt: "20000000-0000-1000-8000-000000000001" },
      { contract: { ...CONTRACT, stripeAccountId: "acct_Other" } },
      { contract: { ...CONTRACT, amountCents: 901 } },
      { contract: { ...CONTRACT, currency: "eur" } },
      { contract: { ...CONTRACT, offerVersion: "DIFFERENT" } },
      { contract: { ...CONTRACT, taxMode: "unconfigured" } },
      { contract: { ...CONTRACT, taxMode: "automatic", taxBehavior: "not_applicable" } },
      { contract: { ...CONTRACT, patternText: "SYNTHETIC_PRIVATE_INPUT" } },
    ]) await assert.rejects(reserve(db, args), /Invalid purchase reservation|check constraint/);
    assert.equal(await scalar(db, "select count(*)::integer from public.stitchproof_purchase_projects"), 0);
    assert.equal(await scalar(db, "select count(*)::integer from public.stitchproof_purchase_attempts"), 0);
  });
});

test("webhook receipt and verified state are atomic, duplicate-safe and cannot authorize stale observations", async () => {
  await withDatabase(async (db) => {
    await reserve(db, { project: PROJECT_THREE });
    await attach(db, { project: PROJECT_THREE });
    const event = ({ id = "evt_SyntheticOnly", session = "cs_test_SyntheticOnly", payment = "pi_SyntheticOnly", status = "paid", at = TIME } = {}) =>
      scalar(db, "select public.stitchproof_purchase_record_event($1::text, 'checkout.session.completed', $2::uuid, false, $3::uuid, $4::text, $5::text, $6::text, $7::timestamptz)",
        [id, PROJECT_THREE, ATTEMPT, session, payment, status, at]);
    await assert.rejects(event({ session: "cs_test_Wrong" }), /Purchase verification could not be recorded/);
    assert.equal(await scalar(db, "select count(*)::integer from public.stitchproof_purchase_webhook_events"), 0);
    assert.equal(await event(), true);
    assert.equal(await event({ status: "refunded" }), false);
    assert.equal((await load(db, { project: PROJECT_THREE })).attempt.status, "paid");
    assert.equal(await scalar(db, "select public.stitchproof_purchase_has_event('evt_SyntheticOnly', false)"), true);
    assert.equal(await scalar(db, "select public.stitchproof_purchase_has_event('evt_SyntheticOnly', true)"), false);
    assert.equal(await event({ id: "evt_Refunded", status: "refunded", at: "2026-08-26T20:00:01.000Z" }), true);
    for (const at of [TIME, "2026-08-26T20:00:01.000Z"]) {
      assert.equal(await observe(db, { project: PROJECT_THREE, status: "paid", at }), false);
      await assert.rejects(event({ id: "evt_Stale", status: "paid", at }), /Purchase verification could not be recorded/);
      assert.equal(await scalar(db, "select public.stitchproof_purchase_has_event('evt_Stale', false)"), false);
    }
    assert.equal((await load(db, { project: PROJECT_THREE })).attempt.status, "refunded");
    assert.equal(await event({ id: "evt_Fresh", status: "paid", at: "2026-08-26T20:00:02.000Z" }), true);
    assert.equal((await load(db, { project: PROJECT_THREE })).attempt.status, "paid");
  });
});
