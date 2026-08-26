import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { normalizeCheckoutUrl } from "../src/lib/offer-links.mjs";
import {
  getPlanningPackCheckoutUrl,
  PLANNING_PACK_CHECKOUT_ROUTE,
} from "../src/lib/planning-pack-availability.mjs";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("planning-pack checkout links fail closed unless they use HTTPS", () => {
  assert.equal(normalizeCheckoutUrl(undefined), null);
  assert.equal(normalizeCheckoutUrl(""), null);
  assert.equal(normalizeCheckoutUrl("not a url"), null);
  assert.equal(normalizeCheckoutUrl("http://checkout.example/pack"), null);
  assert.equal(normalizeCheckoutUrl("https://user:secret@checkout.example/pack"), null);
  assert.equal(normalizeCheckoutUrl("javascript:alert(1)"), null);
  assert.equal(
    normalizeCheckoutUrl(" https://checkout.example/pack "),
    "https://checkout.example/pack"
  );
});

test("planning-pack page presents the $17 product without exposing its tracked PDF", async () => {
  const page = await read("../src/app/fiber-project-planning-pack/page.tsx");
  const actions = await read("../src/app/fiber-project-planning-pack/PlanningPackActions.tsx");

  assert.match(page, /\$17 one-time purchase/);
  assert.match(page, /12-page/);
  for (const item of [
    "Project brief",
    "Swatch record",
    "Yarn-lot log",
    "Gauge worksheet",
    "Project-cost sheet",
    "Finishing checklist",
    "Troubleshooting notes",
  ]) {
    assert.match(page, new RegExp(item));
  }
  assert.doesNotMatch(page, /output\/pdf|fibertools-project-planning-pack\.pdf/i);
  assert.match(page, /planning-pack-release-manifest\.json/);
  assert.match(page, /getPlanningPackCheckoutUrl/);
  assert.match(page, /checkoutUrl[\s\S]*offers/);
  assert.match(actions, /planning_pack_page_view/);
  assert.match(actions, /planning_pack_purchase_click/);
  assert.match(actions, /planning_pack_interest_click/);
  assert.match(actions, /trackFixedEvent/);
  assert.doesNotMatch(actions, /email|name|query|amount|value/);
});

test("planning-pack runtime binds checkout to every release and artifact gate", async () => {
  const manifest = JSON.parse(await read("../config/planning-pack-release-manifest.json"));
  const checksum = manifest.privateArtifact.sha256;
  const env = {
    PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED: "true",
    PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED: "true",
    PLANNING_PACK_OWNER_APPROVAL_CONFIRMED: "true",
    PLANNING_PACK_EDITION_ID: manifest.edition.id,
    PLANNING_PACK_PRIVATE_FILE_SHA256: checksum,
    STRIPE_MODE: "test",
    STRIPE_SECRET_KEY: "sk_test_unitfixture",
    FIBERTOOLS_STRIPE_ACCOUNT_ID: "acct_1U5HWnD2Of3MIt94",
    PLANNING_PACK_STRIPE_PAYMENT_LINK_ID: "plink_unitfixture",
    PLANNING_PACK_STRIPE_PAYMENT_LINK_URL: "https://buy.stripe.com/test_unitfixture123",
    PLANNING_PACK_STRIPE_PRICE_ID: "price_unitfixture",
    NEXT_PUBLIC_SITE_URL: "https://fibertools.app",
    SUPABASE_URL: "https://unitfixture.supabase.co",
    SUPABASE_SECRET_KEY: "sb_secret_unitfixture",
    PLANNING_PACK_STORAGE_BUCKET: "planning-pack-private",
    PLANNING_PACK_STORAGE_OBJECT_PATH: "releases/planning-pack-v2.pdf",
  };

  assert.equal(
    getPlanningPackCheckoutUrl({ manifest, env, now: new Date("2026-08-26T00:00:00.000Z") }),
    null,
    "environment confirmations cannot override a disabled or unapproved manifest"
  );

  const approved = structuredClone(manifest);
  approved.releaseStatus = "ENABLED";
  approved.checkoutActivationStatus = "ENABLED";
  approved.privateArtifact.uploadStatus = "UPLOADED";
  approved.privateUploadStatus = "UPLOADED";
  approved.privateDeliveryStatus = "CONFIRMED";
  approved.ownerVerificationStatus = "VERIFIED";
  approved.ownerApproval = {
    status: "APPROVED",
    editionId: approved.edition.id,
    artifactSha256: checksum,
    recordedAt: "2026-08-25T20:00:00.000Z",
  };

  assert.equal(
    getPlanningPackCheckoutUrl({ manifest: approved, env, now: new Date("2026-08-26T00:00:00.000Z") }),
    PLANNING_PACK_CHECKOUT_ROUTE
  );

  for (const mutate of [
    (candidate) => { candidate.privateArtifact.uploadStatus = "NOT_UPLOADED"; },
    (candidate) => { candidate.privateArtifact.sha256 = candidate.historicallyPublicEdition.sha256; },
    (candidate) => { candidate.ownerApproval.artifactSha256 = candidate.historicallyPublicEdition.sha256; },
    (candidate) => { candidate.ownerApproval.recordedAt = "2026-08-27T00:00:00.000Z"; },
    (candidate) => { candidate.publicCopyStatus = "PENDING"; },
  ]) {
    const candidate = structuredClone(approved);
    mutate(candidate);
    assert.equal(
      getPlanningPackCheckoutUrl({ manifest: candidate, env, now: new Date("2026-08-26T00:00:00.000Z") }),
      null
    );
  }

  assert.equal(
    getPlanningPackCheckoutUrl({
      manifest: approved,
      env: { ...env, PLANNING_PACK_STRIPE_PAYMENT_LINK_URL: "https://evil.com/pack" },
      now: new Date("2026-08-26T00:00:00.000Z"),
    }),
    null
  );

  for (const requiredBinding of [
    "STRIPE_SECRET_KEY",
    "FIBERTOOLS_STRIPE_ACCOUNT_ID",
    "PLANNING_PACK_STRIPE_PAYMENT_LINK_ID",
    "PLANNING_PACK_STRIPE_PAYMENT_LINK_URL",
    "PLANNING_PACK_STRIPE_PRICE_ID",
    "NEXT_PUBLIC_SITE_URL",
    "SUPABASE_URL",
    "SUPABASE_SECRET_KEY",
    "PLANNING_PACK_STORAGE_BUCKET",
    "PLANNING_PACK_STORAGE_OBJECT_PATH",
  ]) {
    const incompleteEnvironment = { ...env };
    delete incompleteEnvironment[requiredBinding];
    assert.equal(
      getPlanningPackCheckoutUrl({
        manifest: approved,
        env: incompleteEnvironment,
        now: new Date("2026-08-26T00:00:00.000Z"),
      }),
      null,
      `${requiredBinding} must fail closed before the Buy action is shown`
    );
  }
});

test("preflight defaults to inquiry and the API gates checkout before reading customer data", async () => {
  const availability = await read("../src/lib/designer-preflight-availability.ts");
  const readiness = await read("../src/lib/designer-preflight-readiness.mjs");
  const route = await read("../src/app/api/designer-preflight/submissions/route.ts");
  const page = await read("../src/app/designer-pattern-preflight/page.tsx");
  const form = await read("../src/app/designer-pattern-preflight/DesignerPreflightForm.tsx");
  const cta = await read("../src/app/designer-pattern-preflight/DesignerPreflightCta.tsx");
  const service = await read("../src/lib/designer-preflight-service.mjs");
  const successAnalytics = await read("../src/app/designer-pattern-preflight/success/PaymentSuccessAnalytics.tsx");

  assert.match(availability, /import "server-only"/);
  assert.match(availability, /isDesignerPreflightCheckoutEnvironmentReady\(process\.env\)/);
  assert.match(availability, /mode: "inquiry"/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_ACTION_MODE === "checkout"/);
  assert.match(readiness, /\^\(sk\|rk\)_test_/);
  assert.match(readiness, /startsWith\("whsec_"\)/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_APPLIED_MIGRATION_VERSION/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_DB_FUNCTIONS_CONFIRMED/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_RETENTION_SCHEMA_CONFIRMED/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_OUTBOX_SCHEMA_CONFIRMED/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_WEBHOOK_EVENTS_CONFIRMED/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_NOTIFICATION_DELIVERY_CONFIRMED/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED/);
  assert.match(readiness, /DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED/);
  assert.match(readiness, /isDocumentedDesignerPreflightPlaceholder/);
  assert.match(readiness, /isReservedExampleDestination/);
  assert.ok(route.indexOf("canAcceptDesignerPreflightCheckout()") < route.indexOf("request.json()"));
  assert.match(service, /PREFLIGHT_AMOUNT_CENTS = 3900/);
  assert.match(page, /one pattern, one version, up to 10 pages/i);
  assert.match(page, /one written report/i);
  assert.match(page, /ownership transfer/i);
  assert.match(page, /Clinical, legal, copyright, or business advice/);
  assert.match(form, /\$39 pilot scope/);
  assert.match(cta, /designer_preflight_inquiry_click/);
  assert.doesNotMatch([page, form, cta].join("\n"), /\$9\b/);
  assert.doesNotMatch(successAnalytics, /localStorage|repeat_purchase|paid_count/);
});

test("planning-pack promotion appears only after relevant full-calculator results", async () => {
  const cta = await read("../src/components/PlanningPackResultCta.tsx");
  const blanket = await read("../src/app/blanket-calculator/BlanketCalculatorTool.tsx");
  const yarn = await read("../src/app/yarn-calculator/YarnCalculatorTool.tsx");
  const gauge = await read("../src/app/gauge-calculator/GaugeCalculatorTool.tsx");
  const cost = await read("../src/app/project-cost-calculator/ProjectCostCalculatorTool.tsx");

  assert.match(cta, /href="\/fiber-project-planning-pack"/);
  assert.match(cta, /See the \$17 planning pack/);
  assert.match(blanket, /!embedded && result\.hasSwatchUsage \? <PlanningPackResultCta/);
  assert.match(yarn, /!embedded \? <PlanningPackResultCta/);
  assert.match(gauge, /!embedded && \([\s\S]*?tab === "swatch" && swatchResult[\s\S]*?<PlanningPackResultCta/);
  assert.match(cost, /result\.totalCost > 0 \? <PlanningPackResultCta/);
});

test("preflight operations and report template carry the bounded fulfillment scope", async () => {
  const operations = await read("../docs/designer-pattern-preflight-operations.md");
  const report = await read("../docs/designer-pattern-preflight-report-template.md");

  assert.match(operations, /\$39 one-time price/);
  assert.match(operations, /exactly one submitted version of one crochet pattern with no more than 10 pages/);
  assert.match(operations, /owner\/provider configuration action/);
  assert.match(report, /one submitted version of one crochet pattern up to 10 pages/);
  assert.match(report, /one written report/);
  assert.match(report, /No AI analysis, AI training, or AI-generated pattern content/);
});
