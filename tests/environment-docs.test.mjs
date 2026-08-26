import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  collectActiveEnvironmentNames,
  documentedEnvironmentNames,
  parseEnvironmentExample,
} from "../scripts/environment-docs.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const FREEZE_SENTENCE =
  "No new public calculator, general tool, article, guide, paid service, or major feature before November 20, 2026 unless an explicit owner-approved publication record exists. Bug fixes, security fixes, legal corrections, factual corrections, and broken-link repairs remain permitted.";

const REQUIRED_OFFER_ENVIRONMENT = [
  "PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED",
  "PLANNING_PACK_OWNER_APPROVAL_CONFIRMED",
  "FIBERTOOLS_STRIPE_ACCOUNT_ID",
  "PLANNING_PACK_STRIPE_PAYMENT_LINK_ID",
  "PLANNING_PACK_STRIPE_PAYMENT_LINK_URL",
  "PLANNING_PACK_STRIPE_PRICE_ID",
  "PLANNING_PACK_STORAGE_BUCKET",
  "PLANNING_PACK_STORAGE_OBJECT_PATH",
  "DESIGNER_PREFLIGHT_ACTION_MODE",
  "DESIGNER_PREFLIGHT_INQUIRY_URL",
  "DESIGNER_PREFLIGHT_OPS_APPLY_CONFIRM",
  "PREFLIGHT_RETENTION_BATCH_SIZE",
  "DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION",
  "DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED",
  "DESIGNER_PREFLIGHT_DB_TABLES_CONFIRMED",
  "DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED",
  "DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED",
  "DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED",
  "DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED",
  "DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER",
  "DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED",
  "DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED",
  "STRIPE_MODE",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "SUPABASE_URL",
  "SUPABASE_SECRET_KEY",
  "NEXT_PUBLIC_SITE_URL",
];

test("every active application environment reference is in the example and deployment contract", async () => {
  const [exampleSource, deploymentSource, activeNames] = await Promise.all([
    read("../.env.example"),
    read("../docs/fibertools-deployment-environment.md"),
    collectActiveEnvironmentNames(),
  ]);
  const example = parseEnvironmentExample(exampleSource);
  const documented = documentedEnvironmentNames(deploymentSource);
  const required = new Set([...activeNames, ...REQUIRED_OFFER_ENVIRONMENT]);

  assert.deepEqual(
    [...required].filter((name) => !example.has(name)).sort(),
    [],
    "active or required offer environment names missing from .env.example"
  );
  assert.deepEqual(
    [...required].filter((name) => !documented.has(name)).sort(),
    [],
    "active or required offer environment names missing from deployment documentation"
  );
});

test("example offer configuration is fake and fails closed", async () => {
  const example = parseEnvironmentExample(await read("../.env.example"));

  for (const name of [
    "PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED",
    "PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED",
    "PLANNING_PACK_OWNER_APPROVAL_CONFIRMED",
    "DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED",
    "DESIGNER_PREFLIGHT_DB_TABLES_CONFIRMED",
    "DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED",
    "DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED",
    "DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED",
    "DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED",
    "DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED",
    "DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED",
    "NEXT_PUBLIC_ADSENSE_ENABLED",
  ]) {
    assert.equal(example.get(name), "false", `${name} must default to false`);
  }

  assert.equal(example.get("DESIGNER_PREFLIGHT_ACTION_MODE"), "inquiry");
  assert.equal(example.get("DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION"), "not_configured");
  assert.equal(example.get("DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER"), "UNVERIFIED");
  assert.equal(example.get("PLANNING_PACK_EDITION_ID"), "replace_me_edition_id");
  assert.match(example.get("PLANNING_PACK_PRIVATE_FILE_SHA256") ?? "", /^0{64}$/);

  for (const name of [
    "BEEHIIV_API_KEY",
    "BEEHIIV_PUBLICATION_ID",
    "RAVELRY_API_USERNAME",
    "RAVELRY_API_PASSWORD",
    "DESIGNER_PREFLIGHT_OPS_APPLY_CONFIRM",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "SUPABASE_SECRET_KEY",
    "INDEXNOW_API_KEY",
    "FIBERTOOLS_STRIPE_ACCOUNT_ID",
    "PLANNING_PACK_STRIPE_PAYMENT_LINK_ID",
    "PLANNING_PACK_STRIPE_PAYMENT_LINK_URL",
    "PLANNING_PACK_STRIPE_PRICE_ID",
    "PLANNING_PACK_STORAGE_BUCKET",
    "PLANNING_PACK_STORAGE_OBJECT_PATH",
  ]) {
    assert.match(example.get(name) ?? "", /replace_me/, `${name} must remain an obvious fake`);
  }

  assert.match(example.get("DESIGNER_PREFLIGHT_INQUIRY_URL") ?? "", /example\.invalid/);
  assert.equal(example.get("NEXT_PUBLIC_ADSENSE_ID"), "ca-pub-0000000000000000");
});

test("current operating documents carry the publication freeze and commercial boundaries", async () => {
  const [instructions, fullInstructions, readme, deployment, checklist, implementation] =
    await Promise.all([
      read("../CLAUDE.md"),
      read("../docs/CLAUDE_FULL.md"),
      read("../README.md"),
      read("../docs/fibertools-deployment-environment.md"),
      read("../docs/fibertools-owner-activation-checklist.md"),
      read("../docs/fibertools-focus-and-revenue-implementation-2026-08-22.md"),
    ]);

  assert.equal(instructions, fullInstructions, "root and full repository instructions must stay identical");
  for (const source of [instructions, readme, deployment, checklist, implementation]) {
    assert.ok(source.includes(FREEZE_SENTENCE));
  }

  assert.match(readme, /Three starting paths/);
  assert.match(readme, /checkout is disabled/);
  assert.match(readme, /defaults to inquiry-only/);
  assert.match(readme, /interest tests only/);
  assert.equal((checklist.match(/^## \d+\./gm) ?? []).length, 6);
});

test("verified stale expertise and blanket descriptions are removed", async () => {
  const [instructions, full, summary, beginnerGuide, blanketGuide] = await Promise.all([
    read("../CLAUDE.md"),
    read("../public/llms-full.txt"),
    read("../public/llms.txt"),
    read("../src/app/best-yarn-for-beginners/page.tsx"),
    read("../src/app/best-yarn-for-blankets/page.tsx"),
  ]);
  const combined = [instructions, full, summary].join("\n");
  const buyerGuides = [beginnerGuide, blanketGuide].join("\n");

  assert.doesNotMatch(combined, /fiber arts expert with 30\+ years/i);
  assert.doesNotMatch(combined, /Expert picks for the best beginner yarn/i);
  assert.doesNotMatch(full, /baby \(30x40 in\) to king \(108x90 in\)/i);
  assert.match(full, /receiving \(30x30 in\) through king \(108x100 in\)/i);
  assert.doesNotMatch(
    buyerGuides,
    /most popular|best value|widely recommended|available (?:at )?every(?:where| craft store)|finished in a weekend|machine washability is non-negotiable|the best fiber choice for learning|vast majority of beginner patterns|calculate exactly|accurate estimate based on your exact dimensions/i
  );
});
