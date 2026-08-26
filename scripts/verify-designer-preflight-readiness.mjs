import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import {
  DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDERS,
  DESIGNER_PREFLIGHT_REQUIRED_MIGRATION_VERSION,
  DESIGNER_PREFLIGHT_WEBHOOK_EVENTS,
  getDesignerPreflightEnvironmentReadiness,
} from "../src/lib/designer-preflight-readiness.mjs";

export {
  DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDERS,
  DESIGNER_PREFLIGHT_WEBHOOK_EVENTS,
};

const DEFAULT_REPOSITORY_ROOT = fileURLToPath(new URL("../", import.meta.url));

const REQUIRED_FUNCTIONS = [
  "enqueue_designer_preflight_outbox",
  "save_designer_preflight_checkout",
  "process_designer_preflight_stripe_event_v2",
  "acknowledge_designer_preflight_paid_order",
  "start_designer_preflight_review",
  "mark_designer_preflight_report_ready",
  "mark_designer_preflight_delivered",
  "anonymize_designer_preflight_submission",
  "resolve_designer_preflight_adverse_case",
  "run_designer_preflight_retention",
  "enqueue_designer_preflight_watchdog_events",
  "plan_designer_preflight_ops_watchdog",
  "run_designer_preflight_ops_watchdog",
  "claim_designer_preflight_outbox",
  "complete_designer_preflight_outbox",
  "fail_designer_preflight_outbox",
];

const REQUIRED_TABLES = [
  "designer_preflight_submissions",
  "designer_preflight_stripe_events",
  "designer_preflight_outbox",
];

const REQUIRED_RETENTION_FIELDS = [
  "retention_delete_by",
  "delivered_at",
  "fulfillment_due_at",
  "anonymized_at",
  "anonymization_reason",
];

const REQUIRED_OUTBOX_FIELDS = [
  "dedupe_key",
  "event_type",
  "submission_id",
  "stripe_livemode",
  "available_at",
  "claimed_at",
  "claimed_by",
  "lease_token",
  "attempt_count",
  "delivered_at",
  "last_error_code",
  "created_at",
];

const SOURCE_PATHS = Object.freeze({
  availability: "src/lib/designer-preflight-availability.ts",
  readiness: "src/lib/designer-preflight-readiness.mjs",
  service: "src/lib/designer-preflight-service.mjs",
  validation: "src/lib/designer-preflight-validation.mjs",
  checkoutServer: "src/lib/designer-preflight-server.ts",
  submissionRoute: "src/app/api/designer-preflight/submissions/route.ts",
  offerPage: "src/app/designer-pattern-preflight/page.tsx",
  offerForm: "src/app/designer-pattern-preflight/DesignerPreflightForm.tsx",
  operations: "docs/designer-pattern-preflight-operations.md",
  baseMigration: "supabase/migrations/20260816_designer_pattern_preflight.sql",
  opsMigration: "supabase/migrations/20260818_designer_pattern_preflight_ops_hardening.sql",
});

function check(id, label, status, detail) {
  return { id, label, status, detail };
}

function passed(id, label, condition, detail) {
  return check(id, label, condition ? "PASS" : "BLOCKED", detail);
}

function externalCheck(id, label, condition, detail) {
  return check(id, label, condition ? "PASS" : "UNVERIFIED", detail);
}

function hasEvery(source, values) {
  return values.every((value) => source.includes(value));
}

async function loadSources(repositoryRoot) {
  const entries = await Promise.all(
    Object.entries(SOURCE_PATHS).map(async ([name, relativePath]) => [
      name,
      await readFile(path.join(repositoryRoot, relativePath), "utf8"),
    ])
  );
  const sources = Object.fromEntries(entries);
  const apiRoot = path.join(repositoryRoot, "src/app/api/designer-preflight");
  const apiEntries = await readdir(apiRoot, { recursive: true });
  const apiFiles = apiEntries
    .filter((entry) => /\.(?:js|mjs|ts|tsx)$/.test(entry))
    .map((entry) => path.join(apiRoot, entry));
  const apiContents = await Promise.all(apiFiles.map((file) => readFile(file, "utf8")));
  sources.preflightApiInventory = apiFiles
    .map((file) => path.relative(apiRoot, file).replaceAll("\\", "/"))
    .join("\n");
  sources.preflightApiSource = apiContents.join("\n");
  return sources;
}

export async function verifyDesignerPreflightReadiness(options = {}) {
  const repositoryRoot = options.repositoryRoot ?? DEFAULT_REPOSITORY_ROOT;
  const env = options.env ?? process.env;
  let sources = options.sources;
  let loadError = null;

  if (!sources) {
    try {
      sources = await loadSources(repositoryRoot);
    } catch {
      sources = Object.fromEntries(Object.keys(SOURCE_PATHS).map((name) => [name, ""]));
      loadError = "One or more required source files could not be read.";
    }
  }

  const combinedMigrations = `${sources.baseMigration}\n${sources.opsMigration}`;
  const combinedScopeCopy = [
    sources.offerPage,
    sources.offerForm,
    sources.checkoutServer,
    sources.operations,
  ].join("\n");
  const environmentReadiness = getDesignerPreflightEnvironmentReadiness(env);
  const environmentChecks = environmentReadiness.checks;
  const runtimeUsesSharedGate = sources.availability.includes(
    "isDesignerPreflightCheckoutEnvironmentReady(process.env)"
  );
  const durableAbuseSourceReady = hasEvery(sources.readiness, [
    "DESIGNER_PREFLIGHT_ABUSE_PROTECTION_PROVIDER",
    "DESIGNER_PREFLIGHT_ABUSE_PROTECTION_CONFIRMED",
    "SUPABASE_DURABLE_LIMIT",
    "VERCEL_WAF",
    "OTHER_VERIFIED_PROVIDER",
  ]);
  const durableAbuseReady =
    environmentChecks.durableAbuseProtection &&
    durableAbuseSourceReady &&
    runtimeUsesSharedGate;

  const checks = [
    passed(
      "action-mode",
      "Action mode is exactly checkout",
      environmentChecks.actionMode && runtimeUsesSharedGate,
      "Whitespace, case variants, missing values, and inquiry all keep checkout closed."
    ),
    passed(
      "stripe-mode",
      "Stripe mode is explicitly test or live",
      environmentChecks.stripeMode,
      "A mode must be selected explicitly; it is never inferred from another value."
    ),
    passed(
      "stripe-key-mode",
      "Stripe key prefix matches the explicit mode",
      environmentChecks.stripeKeyMode,
      "The key must match the selected mode and must not equal the documented fake value; it is never reported."
    ),
    passed(
      "webhook-secret-format",
      "Stripe webhook secret has the expected format",
      environmentChecks.webhookSecretFormat,
      "The secret must have the supported prefix and must not equal the documented fake value; it is never reported."
    ),
    passed(
      "supabase-origin",
      "Supabase is configured with a credential-free HTTPS origin and server credential",
      environmentChecks.supabaseOrigin,
      "Documented fake values, reserved example destinations, URL credentials, paths, queries, fragments, and non-HTTPS origins are rejected."
    ),
    passed(
      "site-origin",
      "The site URL is a supported origin",
      environmentChecks.siteOrigin,
      "Production requires a non-example HTTPS origin; local development may use localhost HTTP."
    ),
    externalCheck(
      "required-migration-version",
      "The required operations migration is present and externally confirmed applied",
      sources.opsMigration.includes("Designer Pattern Preflight operational hardening") &&
        environmentChecks.migrationVersion &&
        runtimeUsesSharedGate,
      `Requires an explicit target-database attestation for ${DESIGNER_PREFLIGHT_REQUIRED_MIGRATION_VERSION}.`
    ),
    externalCheck(
      "required-db-functions",
      "All required database functions are defined and externally confirmed",
      hasEvery(sources.opsMigration, REQUIRED_FUNCTIONS) &&
        environmentChecks.dbFunctions &&
        runtimeUsesSharedGate,
      "Source definitions alone do not prove the functions exist in the target database."
    ),
    externalCheck(
      "required-tables",
      "All required private tables are defined and externally confirmed",
      hasEvery(combinedMigrations, REQUIRED_TABLES) &&
        environmentChecks.dbTables &&
        runtimeUsesSharedGate,
      "Requires target-database confirmation for submissions, Stripe events, and outbox tables."
    ),
    externalCheck(
      "retention-fields",
      "Required retention fields are defined and externally confirmed",
      hasEvery(combinedMigrations, REQUIRED_RETENTION_FIELDS) &&
        environmentChecks.retentionSchema &&
        runtimeUsesSharedGate,
      "Source declarations are not evidence that the target retention schema is applied."
    ),
    externalCheck(
      "outbox-fields",
      "The privacy-safe durable outbox fields are defined and externally confirmed",
      hasEvery(sources.opsMigration, REQUIRED_OUTBOX_FIELDS) &&
        environmentChecks.outboxSchema &&
        runtimeUsesSharedGate,
      "The target outbox schema must be verified before relying on notifications."
    ),
    externalCheck(
      "webhook-event-list",
      "The exact required Stripe event list exists in source and is externally confirmed",
      hasEvery(sources.service, DESIGNER_PREFLIGHT_WEBHOOK_EVENTS) &&
        environmentChecks.webhookEvents &&
        runtimeUsesSharedGate,
      "The attestation must list exactly the eight required event types as comma-separated values."
    ),
    externalCheck(
      "notification-delivery",
      "Owner notification delivery is confirmed",
      environmentChecks.notificationDelivery && runtimeUsesSharedGate,
      "Durable outbox records alone do not prove notification delivery."
    ),
    externalCheck(
      "durable-abuse-protection",
      "A durable abuse-protection provider is explicitly verified",
      durableAbuseReady,
      durableAbuseReady
        ? "A supported durable provider and matching confirmation are recorded."
        : "UNVERIFIED: checkout remains blocked until a supported durable provider is confirmed."
    ),
    externalCheck(
      "fulfillment-capacity",
      "Manual fulfillment capacity is explicitly confirmed",
      environmentChecks.fulfillmentCapacity &&
        sources.readiness.includes(
          "DESIGNER_PREFLIGHT_FULFILLMENT_CAPACITY_CONFIRMED"
        ) &&
        runtimeUsesSharedGate,
      "Capacity approval is an owner operational attestation, not a source-code inference."
    ),
    passed(
      "price",
      "The one-time price is exactly $39",
      /PREFLIGHT_AMOUNT_CENTS\s*=\s*3900/.test(sources.service) &&
        /\$39/.test(combinedScopeCopy),
      "Both the server amount and customer-facing scope must agree."
    ),
    passed(
      "page-limit",
      "The service is capped at 10 pages",
      /up to 10 pages/i.test(sources.offerPage) &&
        /up to 10 pages/i.test(sources.offerForm) &&
        /up to 10 pages/i.test(sources.checkoutServer),
      "The page, consent text, and checkout description must carry the same cap."
    ),
    passed(
      "one-report-scope",
      "The service promises exactly one written report",
      /one written report/i.test(sources.offerPage) &&
        /one written report/i.test(sources.offerForm) &&
        /one manual preflight report/i.test(sources.checkoutServer),
      "The public offer, consent text, and checkout description must stay bounded."
    ),
    passed(
      "inquiry-fallback",
      "A safe inquiry fallback remains implemented",
      sources.availability.includes('mode: "inquiry"') &&
        sources.availability.includes("safeInquiryUrl") &&
        sources.availability.includes("DEFAULT_INQUIRY_URL"),
      "Any failed checkout prerequisite must still return the inquiry action."
    ),
    passed(
      "no-public-file-upload",
      "The Preflight path has no public file-upload route",
      sources.validation.includes("File uploads are not accepted") &&
        !/(?:^|\/)upload(?:\/|$)/im.test(sources.preflightApiInventory ?? "") &&
        !(sources.preflightApiSource ?? sources.submissionRoute).includes(
          "request.formData()"
        ) &&
        !(sources.preflightApiSource ?? sources.submissionRoute).includes(
          "multipart/form-data"
        ) &&
        /Direct uploads are not enabled/i.test(sources.offerPage),
      "The pilot accepts supported private share links only."
    ),
  ];

  return {
    offer: "Designer Pattern Preflight",
    ready: !loadError && checks.length === 20 && checks.every((item) => item.status === "PASS"),
    loadError,
    abuseProtectionProvider: environmentReadiness.abuseProtectionProvider,
    checks,
  };
}

function printReport(report) {
  console.log(`${report.offer} readiness: ${report.ready ? "READY" : "BLOCKED"}`);
  if (report.loadError) console.log(`[BLOCKED] inputs: ${report.loadError}`);
  for (const item of report.checks) {
    console.log(`[${item.status}] ${item.label}: ${item.detail}`);
  }
}

function isDirectExecution() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

if (isDirectExecution()) {
  const report = await verifyDesignerPreflightReadiness();
  printReport(report);
  if (!report.ready) process.exitCode = 1;
}
