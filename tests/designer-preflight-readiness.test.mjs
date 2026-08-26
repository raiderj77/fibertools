import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

import {
  DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDERS,
  DESIGNER_PREFLIGHT_WEBHOOK_EVENTS,
  verifyDesignerPreflightReadiness,
} from "../scripts/verify-designer-preflight-readiness.mjs";
import {
  getDesignerPreflightEnvironmentReadiness,
  isDesignerPreflightCheckoutEnvironmentReady,
} from "../src/lib/designer-preflight-readiness.mjs";

const readinessEnv = () => ({
  DESIGNER_PREFLIGHT_ACTION_MODE: "checkout",
  STRIPE_MODE: "test",
  STRIPE_SECRET_KEY: "sk_test_nonsecret_fixture",
  STRIPE_WEBHOOK_SECRET: "whsec_nonsecret_fixture",
  SUPABASE_URL: "https://synthetic-fixture.supabase.co",
  SUPABASE_SECRET_KEY: "nonsecret-test-fixture",
  NEXT_PUBLIC_SITE_URL: "https://fibertools.app",
  DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION:
    "20260818_designer_pattern_preflight_ops_hardening",
  DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED: "true",
  DESIGNER_PREFLIGHT_DB_TABLES_CONFIRMED: "true",
  DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED: "true",
  DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED: "true",
  DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED:
    DESIGNER_PREFLIGHT_WEBHOOK_EVENTS.join(","),
  DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED: "true",
  DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER: "SUPABASE_DURABLE_LIMIT",
  DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED: "true",
  DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED: "true",
});

async function loadAvailabilityModule() {
  const source = await readFile(
    new URL("../src/lib/designer-preflight-availability.ts", import.meta.url),
    "utf8"
  );
  return source
    .replace('import "server-only";', "")
    .replace(
      /import \{ isDesignerPreflightCheckoutEnvironmentReady \} from "\.\/designer-preflight-readiness\.mjs";\r?\n/,
      ""
    )
    .replace(/export type DesignerPreflightAction =[\s\S]*?;\r?\n\r?\n/, "")
    .replace(/\s+as const/g, "")
    .replace(/\bexport\s+/g, "")
    .replace(/:\s*(?:string \| undefined|DesignerPreflightAction|boolean|string)/g, "")
    .replace(/!\.trim\(\)/g, ".trim()");
}

function evaluateAvailability(source, env) {
  return vm.runInNewContext(`${source}\ngetDesignerPreflightAction();`, {
    process: { env },
    URL,
    Set,
    isDesignerPreflightCheckoutEnvironmentReady,
  });
}

test("preflight verifier covers exactly the requested twenty checks", async () => {
  const report = await verifyDesignerPreflightReadiness({ env: {} });

  assert.equal(report.checks.length, 20);
  assert.equal(new Set(report.checks.map((check) => check.id)).size, 20);
  assert.equal(report.ready, false);
  assert.equal(report.abuseProtectionProvider, "UNVERIFIED");
  assert.equal(
    report.checks.find((check) => check.id === "durable-abuse-protection")?.status,
    "UNVERIFIED"
  );
});

test("preflight verifier passes only with all source and external attestations", async () => {
  const ready = await verifyDesignerPreflightReadiness({ env: readinessEnv() });

  assert.equal(ready.ready, true);
  assert.ok(ready.checks.every((check) => check.status === "PASS"));

  const missingNotification = readinessEnv();
  delete missingNotification.DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED;
  const blocked = await verifyDesignerPreflightReadiness({ env: missingNotification });
  assert.equal(blocked.ready, false);
  assert.equal(
    blocked.checks.find((check) => check.id === "notification-delivery")?.status,
    "UNVERIFIED"
  );

  const missingSupabaseCredential = readinessEnv();
  delete missingSupabaseCredential.SUPABASE_SECRET_KEY;
  const missingCredential = await verifyDesignerPreflightReadiness({
    env: missingSupabaseCredential,
  });
  assert.equal(missingCredential.ready, false);
  assert.equal(
    missingCredential.checks.find((check) => check.id === "supabase-origin")?.status,
    "BLOCKED"
  );

  const documentedPlaceholder = readinessEnv();
  documentedPlaceholder.STRIPE_SECRET_KEY = "sk_test_replace_me_server_only";
  const placeholderReport = await verifyDesignerPreflightReadiness({
    env: documentedPlaceholder,
  });
  assert.equal(placeholderReport.ready, false);
  assert.equal(
    placeholderReport.checks.find((check) => check.id === "stripe-key-mode")?.status,
    "BLOCKED"
  );
});

test("shared runtime gate binds every documented activation attestation", () => {
  const ready = readinessEnv();
  assert.equal(isDesignerPreflightCheckoutEnvironmentReady(ready), true);

  const failClosedOverrides = [
    { DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION: "not_configured" },
    { DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_DB_TABLES_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER: "UNVERIFIED" },
    { DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED: "false" },
  ];

  for (const override of failClosedOverrides) {
    assert.equal(
      isDesignerPreflightCheckoutEnvironmentReady({ ...ready, ...override }),
      false
    );
  }
});

test("documented fake provider values and reserved example destinations are rejected", () => {
  const ready = readinessEnv();
  const rejectedOverrides = [
    { STRIPE_SECRET_KEY: "sk_test_replace_me_server_only" },
    { STRIPE_WEBHOOK_SECRET: "whsec_replace_me_server_only" },
    { SUPABASE_URL: "https://example-project.supabase.co" },
    { SUPABASE_SECRET_KEY: "sb_secret_replace_me_server_only" },
    { SUPABASE_URL: "https://project.supabase.example" },
    { SUPABASE_URL: "https://example.com" },
    { NEXT_PUBLIC_SITE_URL: "https://fibertools.invalid" },
    { NEXT_PUBLIC_SITE_URL: "https://fibertools.test" },
  ];

  for (const override of rejectedOverrides) {
    const report = getDesignerPreflightEnvironmentReadiness({ ...ready, ...override });
    assert.equal(report.ready, false);
  }
});

test("preflight abuse provider vocabulary is closed and UNVERIFIED fails closed", async () => {
  assert.deepEqual(DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDERS, [
    "SUPABASE_DURABLE_LIMIT",
    "VERCEL_WAF",
    "OTHER_VERIFIED_PROVIDER",
    "UNVERIFIED",
  ]);

  for (const provider of ["UNVERIFIED", "UNKNOWN_PROVIDER", "vercel_waf"]) {
    const env = readinessEnv();
    env.DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER = provider;
    const report = await verifyDesignerPreflightReadiness({ env });
    assert.equal(report.ready, false);
    assert.equal(
      report.checks.find((check) => check.id === "durable-abuse-protection")?.status,
      "UNVERIFIED"
    );
  }
});

test("runtime availability requires exact mode, durable abuse protection, and capacity", async () => {
  const availabilitySource = await loadAvailabilityModule();
  const base = readinessEnv();

  assert.equal(evaluateAvailability(availabilitySource, base).mode, "checkout");

  for (const override of [
    { DESIGNER_PREFLIGHT_ACTION_MODE: "CHECKOUT" },
    { DESIGNER_PREFLIGHT_ACTION_MODE: " checkout " },
    { DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER: "UNVERIFIED" },
    { DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED: "false" },
    { DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED: "false" },
  ]) {
    assert.equal(
      evaluateAvailability(availabilitySource, { ...base, ...override }).mode,
      "inquiry"
    );
  }
});

test("runtime availability rejects non-origin provider URLs and preserves inquiry fallback", async () => {
  const availabilitySource = await loadAvailabilityModule();
  const base = readinessEnv();

  const action = evaluateAvailability(availabilitySource, {
    ...base,
    SUPABASE_URL: "https://synthetic-fixture.supabase.co/rest/v1",
    DESIGNER_PREFLIGHT_INQUIRY_URL: "javascript:alert(1)",
  });
  assert.equal(action.mode, "inquiry");
  assert.match(action.inquiryUrl, /^mailto:/);
});
