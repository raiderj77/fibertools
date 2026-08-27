import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

const ORIGINAL_SQL = await readFile(new URL("../supabase/migrations/20260826_stitchproof_project_entitlements.sql", import.meta.url), "utf8");
const MANAGED_SQL = await readFile(new URL("../supabase/migrations/20260827_stitchproof_managed_payments.sql", import.meta.url), "utf8");
const OLD_VERSION = "20260826_stitchproof_project_entitlements";
const NEW_VERSION = "20260827_stitchproof_managed_payments";
const COUNTRIES = ["US", "CA", "GB", "AU", "NZ", "AT", "BE", "DK", "FI", "FR", "DE", "IS", "IE", "IT", "LU", "NL", "NO", "PT", "ES", "SE", "CH", "JP", "SG", "KR"];
const PROJECT = "10000000-0000-4000-8000-000000000001";
const ATTEMPT = "20000000-0000-4000-8000-000000000001";
const HASH = "a".repeat(64);
const TIME = "2026-08-27T12:00:00.000Z";
const SESSION = "cs_test_ManagedSqlSynthetic";
const PAYMENT = "pi_ManagedSqlSynthetic";
const LEGACY = {
  stripeAccountId: "acct_1U5HWnD2Of3MIt94", productId: "prod_SyntheticOnly", priceId: "price_SyntheticOnly",
  offerVersion: "STITCHPROOF-PROJECT-V1", amountCents: 900, currency: "usd", taxMode: "none", taxBehavior: "not_applicable",
};
// Synthetic, format-only tax code; this test does not classify a real product.
const MANAGED = {
  ...LEGACY, offerVersion: "STITCHPROOF-PROJECT-MANAGED-V1", taxMode: "managed", taxBehavior: "exclusive",
  purchaseCountry: "US", marketPolicyVersion: "STITCHPROOF-MARKETS-2026-08-27", productTaxCode: "txcd_12345678",
};
const uuid = (group, n) => `${group}0000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const NEW_FUNCTIONS = [
  "stitchproof_purchase_snapshot_v2", "stitchproof_purchase_load_v2", "stitchproof_purchase_load_webhook_v2",
  "stitchproof_purchase_reserve_v2", "stitchproof_purchase_schema_version_v2",
];

async function scalar(db, sql, params = []) {
  const { rows } = await db.query(sql, params);
  return rows.length ? Object.values(rows[0])[0] : null;
}
async function withDatabase(run, { managed = true, original = true } = {}) {
  const db = new PGlite();
  try {
    await db.exec("create role anon; create role authenticated; create role service_role;");
    if (original) await db.exec(ORIGINAL_SQL);
    if (managed) await applyManaged(db);
    await run(db);
  } finally { await db.close(); }
}
async function applyManaged(db, sql = MANAGED_SQL) {
  try { await db.exec(`begin;\n${sql}\ncommit;`); }
  catch (error) { await db.exec("rollback;"); throw error; }
}
const reserve = (db, {
  project = PROJECT, hash = HASH, live = false, attempt = ATTEMPT, expected = null, contract = MANAGED, generation = 2,
} = {}) => scalar(db,
  `select public.stitchproof_purchase_reserve${generation === 2 ? "_v2" : ""}($1::uuid,$2::text,$3::boolean,$4::uuid,$5::uuid,$6::jsonb)`,
  [project, hash, live, attempt, expected, JSON.stringify(contract)]);
const load = (db, { project = PROJECT, hash = HASH, live = false, generation = 2 } = {}) => scalar(db,
  `select public.stitchproof_purchase_load${generation === 2 ? "_v2" : ""}($1::uuid,$2::text,$3::boolean)`, [project, hash, live]);
const loadWebhook = (db, { project = PROJECT, attempt = ATTEMPT, hash = HASH, live = false, generation = 2 } = {}) => scalar(db,
  `select public.stitchproof_purchase_load_webhook${generation === 2 ? "_v2" : ""}($1::uuid,$2::uuid,$3::text,$4::boolean)`,
  [project, attempt, hash, live]);
const attach = (db, { project = PROJECT, attempt = ATTEMPT, live = false, session = SESSION, payment = null } = {}) => scalar(db,
  "select public.stitchproof_purchase_attach_checkout($1::uuid,$2::boolean,$3::uuid,$4::text,$5::text,$6::timestamptz)",
  [project, live, attempt, session, payment, "2026-08-28T12:00:00.000Z"]);
const observe = (db, {
  project = PROJECT, attempt = ATTEMPT, live = false, session = SESSION, payment = PAYMENT, status = "paid", at = TIME,
} = {}) => scalar(db,
  "select public.stitchproof_purchase_record_verification($1::uuid,$2::boolean,$3::uuid,$4::text,$5::text,$6::text,$7::timestamptz)",
  [project, live, attempt, session, payment, status, at]);
const count = (db, table) => scalar(db, `select count(*)::integer from public.${table}`);
const version = (db, generation = 2) => scalar(db, `select public.stitchproof_purchase_schema_version${generation === 2 ? "_v2" : ""}()`);
async function originalFunctions(db) {
  return (await db.query(`select p.proname, pg_catalog.pg_get_functiondef(p.oid) as definition,
      p.proacl::text as privileges, p.proowner
    from pg_catalog.pg_proc p join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and starts_with(p.proname, 'stitchproof_purchase_')
      and p.proname <> all($1::text[]) order by p.proname`, [NEW_FUNCTIONS])).rows;
}
function withoutManagedFields(purchase) {
  const copy = structuredClone(purchase);
  delete copy.attempt.purchaseCountry;
  delete copy.attempt.marketPolicyVersion;
  delete copy.attempt.productTaxCode;
  return copy;
}

test("managed migration is additive and the already-applied original Git content stays immutable", () => {
  assert.equal(createHash("sha256").update(ORIGINAL_SQL.replaceAll("\r\n", "\n")).digest("hex"),
    "adef226ef10e9b0ef251c86e3349933f4d631783dbef0049bf72e36d3b8dfe21");
  assert.deepEqual([...MANAGED_SQL.matchAll(/create function public\.([a-z0-9_]+)\(/g)].map((match) => match[1]), NEW_FUNCTIONS);
  assert.doesNotMatch(MANAGED_SQL, /create\s+or\s+replace\s+function|drop\s+function|drop\s+table|truncate\s|delete\s+from|create\s+table/i);
  assert.doesNotMatch(MANAGED_SQL, /disable row level security|no force row level security|grant\s+(?:all|select|insert|update|delete)\s+on\s+(?:table\s+)?public\.stitchproof_purchase_/i);
});

test("additive migration preserves original RPC definitions, paid legacy rows and legacy callers", async () => {
  await withDatabase(async (db) => {
    const beforeFunctions = await originalFunctions(db);
    const oldSnapshots = [];
    for (const [index, contract] of [LEGACY, { ...LEGACY, taxMode: "automatic", taxBehavior: "inclusive" },
      { ...LEGACY, taxMode: "automatic", taxBehavior: "exclusive" }].entries()) {
      const project = uuid(1, index + 1), attempt = uuid(2, index + 1);
      const session = `cs_test_Legacy${index}`, payment = `pi_Legacy${index}`;
      await reserve(db, { project, attempt, contract, generation: 1 });
      assert.equal(await attach(db, { project, attempt, session, payment }), true);
      assert.equal(await observe(db, { project, attempt, session, payment }), true);
      oldSnapshots.push(await load(db, { project, generation: 1 }));
    }
    await applyManaged(db);
    assert.deepEqual(await originalFunctions(db), beforeFunctions);
    assert.equal(await version(db, 1), OLD_VERSION);
    assert.equal(await version(db), NEW_VERSION);
    for (const original of oldSnapshots) {
      const old = await load(db, { project: original.projectId, generation: 1 });
      const current = await load(db, { project: original.projectId });
      assert.deepEqual(old, original);
      assert.deepEqual(withoutManagedFields(current), original);
      for (const key of ["purchaseCountry", "marketPolicyVersion", "productTaxCode"]) assert.equal(current.attempt[key], null);
      assert.equal(await reserve(db, { project: original.projectId, attempt: uuid(2, 80), contract: MANAGED }), null);
    }
    const legacyNew = await reserve(db, { project: uuid(1, 99), attempt: uuid(2, 99), contract: LEGACY, generation: 1 });
    assert.equal(legacyNew.attempt.offerVersion, LEGACY.offerVersion);
    await assert.rejects(reserve(db, { project: uuid(1, 100), attempt: uuid(2, 100), contract: MANAGED, generation: 1 }), /Invalid purchase reservation/);
    assert.equal(await count(db, "stitchproof_purchase_attempts"), 4);
  }, { managed: false });
});

test("v2 schema keeps three forced-RLS tables, two private snapshots and service-only RPCs", async () => {
  await withDatabase(async (db) => {
    assert.equal(await version(db), NEW_VERSION);
    for (const table of ["stitchproof_purchase_projects", "stitchproof_purchase_attempts", "stitchproof_purchase_webhook_events"]) {
      const flags = (await db.query("select relrowsecurity,relforcerowsecurity from pg_catalog.pg_class where oid=$1::regclass", [`public.${table}`])).rows[0];
      assert.deepEqual(flags, { relrowsecurity: true, relforcerowsecurity: true });
      for (const role of ["anon", "authenticated", "service_role"]) {
        assert.equal(await scalar(db, "select has_table_privilege($1,$2,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER')", [role, `public.${table}`]), false);
        assert.equal(await scalar(db, "select has_any_column_privilege($1,$2,'SELECT,INSERT,UPDATE,REFERENCES')", [role, `public.${table}`]), false);
      }
    }
    const functions = (await db.query(`select p.oid,p.proname,p.prosecdef,p.proconfig from pg_catalog.pg_proc p
      join pg_catalog.pg_namespace n on n.oid=p.pronamespace
      where n.nspname='public' and starts_with(p.proname,'stitchproof_purchase_')`)).rows;
    assert.equal(functions.length, 14);
    for (const fn of functions) {
      assert.equal(fn.prosecdef, true);
      assert.ok(fn.proconfig.includes("search_path=public, pg_temp"));
      for (const role of ["anon", "authenticated", "service_role"]) {
        assert.equal(await scalar(db, "select has_function_privilege($1::text,$2::oid,'EXECUTE')", [role, fn.oid]),
          role === "service_role" && !["stitchproof_purchase_snapshot", "stitchproof_purchase_snapshot_v2"].includes(fn.proname));
      }
    }
    const columns = (await db.query("select column_name from information_schema.columns where table_schema='public' and table_name='stitchproof_purchase_attempts' order by ordinal_position")).rows.map((row) => row.column_name);
    assert.equal(columns.length, 20);
    assert.deepEqual(columns.slice(-3), ["purchase_country", "market_policy_version", "product_tax_code"]);
    assert.doesNotMatch(columns.join(" "), /email|customer|pattern|title|claim_secret|address|phone|ip_address|access_expires|raw|payload|checkout_url/);

    await reserve(db);
    for (const role of ["anon", "authenticated"]) {
      await db.exec(`begin; set local role ${role};`);
      await assert.rejects(load(db), /permission denied/);
      await db.exec("rollback;");
    }
    await db.exec("begin; set local role service_role;");
    assert.equal(await version(db), NEW_VERSION);
    assert.equal((await load(db)).attempt.purchaseCountry, "US");
    await assert.rejects(db.query("select * from public.stitchproof_purchase_attempts"), /permission denied/);
    await db.exec("rollback;");
    await db.exec("begin; set local role service_role;");
    await assert.rejects(db.query("update public.stitchproof_purchase_attempts set purchase_country='CA'"), /permission denied/);
    await db.exec("rollback;");
    await db.exec("begin; set local role service_role;");
    await assert.rejects(scalar(db, "select public.stitchproof_purchase_snapshot_v2($1::uuid,false,$2::uuid)", [PROJECT, ATTEMPT]), /permission denied/);
    await db.exec("rollback;");
  });
});

test("v2 accepts exactly the pinned managed markets and preserves both legacy tax modes", async () => {
  await withDatabase(async (db) => {
    for (const [index, purchaseCountry] of COUNTRIES.entries()) {
      const contract = { ...MANAGED, purchaseCountry, taxBehavior: index % 2 ? "inclusive" : "exclusive" };
      const purchase = await reserve(db, { project: uuid(1, index + 1), attempt: uuid(2, index + 1), contract });
      for (const [key, value] of Object.entries(contract)) assert.equal(purchase.attempt[key], value);
    }
    for (const [index, contract] of [LEGACY, { ...LEGACY, taxMode: "automatic", taxBehavior: "inclusive" },
      { ...LEGACY, taxMode: "automatic", taxBehavior: "exclusive" }].entries()) {
      const purchase = await reserve(db, { project: uuid(1, 100 + index), attempt: uuid(2, 100 + index), contract });
      assert.equal(purchase.attempt.taxMode, contract.taxMode);
      assert.equal(purchase.attempt.purchaseCountry, null);
    }
    assert.equal(await count(db, "stitchproof_purchase_attempts"), COUNTRIES.length + 3);
  });
});

test("strict null, identity, exact-key and country/tax contracts reject before creating ledger rows", async () => {
  await withDatabase(async (db) => {
    const invalidContracts = [null, [], "managed", true,
      { ...MANAGED, amountCents: "900" }, { ...MANAGED, amountCents: 901 }, { ...MANAGED, currency: "eur" },
      { ...MANAGED, stripeAccountId: "acct_Foreign" }, { ...MANAGED, productId: "prod_bad-id" },
      { ...MANAGED, priceId: "price_bad-id" }, { ...MANAGED, offerVersion: LEGACY.offerVersion },
      { ...MANAGED, taxMode: "automatic" }, { ...MANAGED, taxBehavior: "not_applicable" },
      { ...MANAGED, marketPolicyVersion: "STITCHPROOF-MARKETS-UNKNOWN" },
      { ...MANAGED, patternText: "SYNTHETIC_PRIVATE_INPUT" }, { ...LEGACY, purchaseCountry: null },
      { ...LEGACY, taxMode: "managed" }, { ...LEGACY, offerVersion: MANAGED.offerVersion },
    ];
    for (const key of Object.keys(MANAGED)) {
      const missing = { ...MANAGED }; delete missing[key];
      invalidContracts.push(missing, { ...MANAGED, [key]: null }, { ...MANAGED, [key]: [MANAGED[key]] });
    }
    for (const purchaseCountry of ["us", "US ", " US", "UK", "BR", "MX", "ZZ", "US,CA", "", 42, {}, ["US"]])
      invalidContracts.push({ ...MANAGED, purchaseCountry });
    for (const productTaxCode of ["txcd_1234567", "txcd_123456789", "txcd_abcdefgh", "TXCD_12345678", "txcd_12345678\n", "txcd_12345678 ", 12345678])
      invalidContracts.push({ ...MANAGED, productTaxCode });
    for (const contract of invalidContracts) await assert.rejects(reserve(db, { contract }), /Invalid purchase reservation/);
    for (const args of [
      { project: null }, { attempt: null }, { live: null }, { hash: null }, { hash: "A".repeat(64) }, { hash: "a".repeat(63) },
      { project: "10000000-0000-1000-8000-000000000001" }, { attempt: "20000000-0000-1000-8000-000000000001" },
      { expected: "20000000-0000-1000-8000-000000000001" },
    ]) await assert.rejects(reserve(db, args), /Invalid purchase reservation/);
    assert.equal(await count(db, "stitchproof_purchase_projects"), 0);
    assert.equal(await count(db, "stitchproof_purchase_attempts"), 0);
  });
});

test("concurrent retries preserve one immutable managed attempt and reject changed contracts", async () => {
  await withDatabase(async (db) => {
    const first = await reserve(db);
    const retries = await Promise.all(Array.from({ length: 12 }, (_, index) => reserve(db, { attempt: uuid(2, index + 10) })));
    assert.ok(retries.every((purchase) => purchase.attempt.id === first.attempt.id));
    for (const contract of [
      { ...MANAGED, purchaseCountry: "CA" }, { ...MANAGED, productTaxCode: "txcd_87654321" },
      { ...MANAGED, productId: "prod_Other" }, { ...MANAGED, priceId: "price_Other" },
      { ...MANAGED, taxBehavior: "inclusive" }, LEGACY,
    ]) assert.equal(await reserve(db, { attempt: uuid(2, 99), expected: ATTEMPT, contract }), null);
    assert.equal(await reserve(db, { hash: "b".repeat(64), attempt: uuid(2, 99) }), null);
    const legacyRetry = await reserve(db, { attempt: uuid(2, 100), contract: LEGACY, generation: 1 });
    assert.equal(legacyRetry.attempt.id, ATTEMPT);
    assert.equal(legacyRetry.attempt.offerVersion, MANAGED.offerVersion);
    assert.deepEqual(await load(db), first);
    assert.equal(await count(db, "stitchproof_purchase_attempts"), 1);
  });
});

test("only attached verified unpaid expiry permits CAS renewal with a new country", async () => {
  await withDatabase(async (db) => {
    await reserve(db);
    const next = { ...MANAGED, purchaseCountry: "CA" };
    await db.query("update public.stitchproof_purchase_attempts set status='expired' where id=$1::uuid", [ATTEMPT]);
    assert.equal(await reserve(db, { attempt: uuid(2, 2), expected: ATTEMPT, contract: next }), null);
    assert.equal(await attach(db), true);
    assert.equal(await reserve(db, { attempt: uuid(2, 2), expected: ATTEMPT, contract: next }), null);
    assert.equal(await observe(db, { status: "expired", payment: null }), true);
    assert.equal(await reserve(db, { attempt: uuid(2, 2), expected: uuid(2, 3), contract: next }), null);
    const replacement = await reserve(db, { attempt: uuid(2, 2), expected: ATTEMPT, contract: next });
    assert.equal(replacement.attempt.id, uuid(2, 2));
    assert.equal(replacement.attempt.purchaseCountry, "CA");
    const retries = await Promise.all(Array.from({ length: 8 }, (_, index) => reserve(db, {
      attempt: uuid(2, index + 10), expected: ATTEMPT, contract: next,
    })));
    assert.ok(retries.every((purchase) => purchase.attempt.id === replacement.attempt.id));
    const old = await loadWebhook(db);
    assert.equal(old.attempt.id, ATTEMPT);
    assert.equal(old.attempt.purchaseCountry, "US");
    assert.equal(old.attempt.status, "expired");
    assert.equal((await loadWebhook(db, { generation: 1 })).attempt.id, ATTEMPT);
    assert.equal(await count(db, "stitchproof_purchase_attempts"), 2);
  });
});

test("paid, adverse and ambiguous attempts never become a new charge by age or policy change", async () => {
  await withDatabase(async (db) => {
    await reserve(db);
    await db.query("update public.stitchproof_purchase_attempts set created_at=now()-interval '100 days' where id=$1::uuid", [ATTEMPT]);
    assert.equal((await reserve(db, { attempt: uuid(2, 2), expected: ATTEMPT })).attempt.id, ATTEMPT);
    await attach(db);
    for (const [index, status] of ["pending", "paid", "refunded", "disputed", "unavailable"].entries()) {
      assert.equal(await observe(db, { status, at: `2026-08-27T12:00:0${index}.000Z` }), true);
      assert.equal((await reserve(db, { attempt: uuid(2, 2), expected: ATTEMPT })).attempt.id, ATTEMPT);
      assert.equal(await reserve(db, { attempt: uuid(2, 2), expected: ATTEMPT, contract: { ...MANAGED, purchaseCountry: "CA" } }), null);
    }
    assert.equal(await count(db, "stitchproof_purchase_attempts"), 1);
  });
});

test("database constraints independently reject mixed contracts and missing managed fields", async () => {
  await withDatabase(async (db) => {
    await reserve(db);
    for (const mutation of [
      "purchase_country=null", "purchase_country='BR'", "purchase_country='us'", "market_policy_version=null",
      "market_policy_version='unknown'", "product_tax_code=null", "product_tax_code='txcd_bad'",
      "tax_mode='automatic'", "tax_behavior='not_applicable'", "offer_version='STITCHPROOF-PROJECT-V1'",
    ]) await assert.rejects(db.query(`update public.stitchproof_purchase_attempts set ${mutation} where id=$1::uuid`, [ATTEMPT]), /check constraint/);
    const legacyAttempt = uuid(2, 2);
    await reserve(db, { project: uuid(1, 2), attempt: legacyAttempt, contract: LEGACY });
    for (const mutation of ["purchase_country='US'", "market_policy_version='STITCHPROOF-MARKETS-2026-08-27'", "product_tax_code='txcd_12345678'"])
      await assert.rejects(db.query(`update public.stitchproof_purchase_attempts set ${mutation} where id=$1::uuid`, [legacyAttempt]), /check constraint/);
    assert.equal((await load(db)).attempt.purchaseCountry, "US");
  });
});

test("metadata-only v2 readiness detects column, constraint, RLS and RPC privilege drift", async () => {
  await withDatabase(async (db) => {
    for (const sql of [
      "alter table public.stitchproof_purchase_projects disable row level security",
      "alter table public.stitchproof_purchase_attempts no force row level security",
      "grant select on public.stitchproof_purchase_attempts to service_role",
      "grant select(purchase_country) on public.stitchproof_purchase_attempts to service_role",
      "alter table public.stitchproof_purchase_attempts drop column product_tax_code cascade",
      "alter table public.stitchproof_purchase_attempts drop constraint stitchproof_purchase_attempt_contract_v2; alter table public.stitchproof_purchase_attempts add constraint stitchproof_purchase_attempt_contract_v2 check(true)",
      "alter table public.stitchproof_purchase_attempts drop constraint stitchproof_purchase_attempts_offer_version_check; alter table public.stitchproof_purchase_attempts add constraint stitchproof_purchase_attempts_offer_version_check check(true)",
      "drop function public.stitchproof_purchase_load_v2(uuid,text,boolean)",
      "grant execute on function public.stitchproof_purchase_load_v2(uuid,text,boolean) to anon",
      "grant execute on function public.stitchproof_purchase_load(uuid,text,boolean) to public",
      "grant execute on function public.stitchproof_purchase_snapshot_v2(uuid,boolean,uuid) to service_role",
      "revoke execute on function public.stitchproof_purchase_reserve_v2(uuid,text,boolean,uuid,uuid,jsonb) from service_role",
      "alter function public.stitchproof_purchase_load_v2(uuid,text,boolean) security invoker",
      "alter function public.stitchproof_purchase_load_v2(uuid,text,boolean) set search_path=public",
      "alter function public.stitchproof_purchase_load_v2(uuid,text,boolean) owner to service_role",
    ]) {
      await db.exec(`begin; ${sql};`);
      assert.equal(await version(db), null, sql);
      await db.exec("rollback;");
      assert.equal(await version(db), NEW_VERSION);
    }
    await db.exec("begin transaction read only;");
    assert.equal(await version(db), NEW_VERSION);
    await db.exec("commit;");
    assert.equal(await count(db, "stitchproof_purchase_projects"), 0);
  });
});

test("unchanged shared financial RPCs preserve atomic events, stale refusal and managed contract binding", async () => {
  await withDatabase(async (db) => {
    await reserve(db); await attach(db);
    const event = ({ id = "evt_ManagedSqlPaid", status = "paid", at = TIME, session = SESSION } = {}) => scalar(db,
      "select public.stitchproof_purchase_record_event($1::text,'checkout.session.completed',$2::uuid,false,$3::uuid,$4::text,$5::text,$6::text,$7::timestamptz)",
      [id, PROJECT, ATTEMPT, session, PAYMENT, status, at]);
    await assert.rejects(event({ session: "cs_test_Wrong" }), /Purchase verification could not be recorded/);
    assert.equal(await count(db, "stitchproof_purchase_webhook_events"), 0);
    assert.equal(await event(), true);
    assert.equal(await event(), false);
    assert.equal(await event({ id: "evt_ManagedSqlRefund", status: "refunded", at: "2026-08-27T12:00:01.000Z" }), true);
    for (const at of [TIME, "2026-08-27T12:00:01.000Z"]) {
      assert.equal(await observe(db, { at }), false);
      await assert.rejects(event({ id: "evt_ManagedSqlStale", at }), /Purchase verification could not be recorded/);
      assert.equal(await scalar(db, "select public.stitchproof_purchase_has_event('evt_ManagedSqlStale',false)"), false);
    }
    assert.equal((await load(db)).attempt.status, "refunded");
    assert.equal(await observe(db, { at: "2028-08-27T12:00:00.000Z" }), true);
    const recovered = await load(db);
    assert.equal(recovered.attempt.id, ATTEMPT);
    assert.equal(recovered.attempt.status, "paid");
    for (const [key, value] of Object.entries(MANAGED)) assert.equal(recovered.attempt[key], value);
    assert.equal(await reserve(db, { attempt: uuid(2, 2), expected: ATTEMPT, contract: { ...MANAGED, purchaseCountry: "CA" } }), null);
    assert.equal(await count(db, "stitchproof_purchase_attempts"), 1);
  });
});

test("v2 recovery isolates claim, project and mode while sharing original session/payment uniqueness", async () => {
  await withDatabase(async (db) => {
    await reserve(db); await attach(db, { payment: PAYMENT });
    assert.equal(await load(db, { hash: "b".repeat(64) }), null);
    assert.equal(await load(db, { live: true }), null);
    assert.equal(await load(db, { live: null }), null);
    assert.equal(await loadWebhook(db, { project: uuid(1, 2) }), null);
    assert.equal(await loadWebhook(db, { attempt: uuid(2, 2) }), null);
    assert.equal(await loadWebhook(db, { hash: "b".repeat(64) }), null);
    const second = { project: uuid(1, 2), attempt: uuid(2, 2) };
    await reserve(db, second);
    await assert.rejects(attach(db, second), /unique constraint/);
    await assert.rejects(attach(db, { ...second, session: "cs_test_Second", payment: PAYMENT }), /unique constraint/);
    await reserve(db, { attempt: uuid(2, 3), live: true });
    assert.equal(await attach(db, { attempt: uuid(2, 3), live: true, session: "cs_live_ManagedSqlSynthetic" }), true);
    assert.equal((await load(db, { live: true })).attempt.id, uuid(2, 3));
    assert.equal((await load(db)).attempt.id, ATTEMPT);
  });
});

test("new migration is apply-once and transactional rollback preserves the applied original schema", async () => {
  await withDatabase(async (db) => {
    const before = await originalFunctions(db);
    const fault = MANAGED_SQL + "\nselect public.stitchproof_deliberately_missing_test_function();";
    await assert.rejects(applyManaged(db, fault), /does not exist/);
    assert.deepEqual(await originalFunctions(db), before);
    assert.equal(await version(db, 1), OLD_VERSION);
    assert.equal(await scalar(db, "select to_regprocedure('public.stitchproof_purchase_schema_version_v2()')"), null);
    assert.equal(await scalar(db, "select count(*)::integer from information_schema.columns where table_schema='public' and table_name='stitchproof_purchase_attempts'"), 17);
    await applyManaged(db);
    await assert.rejects(applyManaged(db), /already exists/);
    assert.equal(await version(db), NEW_VERSION);
    assert.deepEqual(await originalFunctions(db), before);
  }, { managed: false });
  await withDatabase(async (db) => {
    await assert.rejects(applyManaged(db), /does not exist/);
    assert.equal(await scalar(db, "select to_regclass('public.stitchproof_purchase_attempts')"), null);
  }, { original: false, managed: false });
});
