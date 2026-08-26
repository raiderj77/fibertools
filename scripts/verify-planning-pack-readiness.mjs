import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const DEFAULT_REPOSITORY_ROOT = fileURLToPath(new URL("../", import.meta.url));
const MANIFEST_PATH = "config/planning-pack-release-manifest.json";
const PUBLIC_COPY_PATH = "src/app/fiber-project-planning-pack/page.tsx";
const EXPECTED_EDITION_ID = "FT-PP-V2-2026-08-25";
const EXPECTED_PAGE_COUNT = 12;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function result(id, label, passed, detail) {
  return {
    id,
    label,
    status: passed ? "PASS" : "BLOCKED",
    detail,
  };
}

function parseCheckoutUrl(value) {
  if (typeof value !== "string" || value.length === 0) return null;
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const placeholderHost =
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".invalid") ||
      hostname.endsWith(".test") ||
      hostname.endsWith(".example");
    return placeholderHost || /replace[_-]?me|placeholder/i.test(url.toString())
      ? null
      : url;
  } catch {
    return null;
  }
}

function validApprovalTimestamp(value) {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));
}

async function loadDefaultInputs(repositoryRoot) {
  const [manifestText, publicPageSource] = await Promise.all([
    readFile(path.join(repositoryRoot, MANIFEST_PATH), "utf8"),
    readFile(path.join(repositoryRoot, PUBLIC_COPY_PATH), "utf8"),
  ]);

  return {
    manifest: JSON.parse(manifestText),
    publicPageSource,
  };
}

export async function verifyPlanningPackReadiness(options = {}) {
  const repositoryRoot = options.repositoryRoot ?? DEFAULT_REPOSITORY_ROOT;
  const env = options.env ?? process.env;

  let manifest = options.manifest;
  let publicPageSource = options.publicPageSource;
  let loadError = null;

  if (!manifest || typeof publicPageSource !== "string") {
    try {
      const defaults = await loadDefaultInputs(repositoryRoot);
      manifest ??= defaults.manifest;
      publicPageSource ??= defaults.publicPageSource;
    } catch {
      loadError = "The release manifest or public offer source could not be read.";
      manifest ??= {};
      publicPageSource ??= "";
    }
  }

  const edition = manifest.edition ?? {};
  const historical = manifest.historicallyPublicEdition ?? {};
  const privateArtifact = manifest.privateArtifact ?? {};
  const ownerApproval = manifest.ownerApproval ?? {};
  const checkoutUrl = parseCheckoutUrl(env.NEXT_PUBLIC_PLANNING_PACK_CHECKOUT_URL);
  const privateChecksum = privateArtifact.sha256;
  const historicalChecksum = historical.sha256;
  const checksumReady =
    typeof privateChecksum === "string" && SHA256_PATTERN.test(privateChecksum);
  const historicalChecksumRecorded =
    typeof historicalChecksum === "string" && SHA256_PATTERN.test(historicalChecksum);
  const editionIsNew =
    manifest.publicProductName === "Fiber Project Planning Pack" &&
    manifest.creationDate === "2026-08-25" &&
    edition.id === EXPECTED_EDITION_ID &&
    edition.pageCount === EXPECTED_PAGE_COUNT &&
    edition.id !== historical.id &&
    env.PLANNING_PACK_EDITION_ID === edition.id;
  const pageCountCopy = `${edition.pageCount}-page`;
  const priceCopy = `$${manifest.priceUsd} one-time purchase`;

  const checks = [
    result(
      "private-delivery-confirmed",
      "Private delivery is confirmed",
      manifest.privateDeliveryStatus === "CONFIRMED" &&
        env.PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED === "true",
      "Requires matching manifest and server-environment confirmation."
    ),
    result(
      "new-edition-id",
      "The release identifies the new 12-page v2 edition",
      editionIsNew,
      "The edition ID must be v2, differ from the historical edition, and declare 12 pages."
    ),
    result(
      "private-checksum",
      "A private artifact SHA-256 checksum is recorded",
      checksumReady &&
        privateArtifact.expectedSha256 === privateChecksum &&
        env.PLANNING_PACK_PRIVATE_FILE_SHA256 === privateChecksum,
      "Requires matching manifest and environment SHA-256 values; placeholders are rejected."
    ),
    result(
      "private-upload-confirmed",
      "Private artifact upload is confirmed",
      privateArtifact.uploadStatus === "UPLOADED" &&
        manifest.privateUploadStatus === "UPLOADED" &&
        env.PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED === "true",
      "The manifest must record an owner-verified private upload."
    ),
    result(
      "valid-https-checkout-url",
      "Checkout uses a valid HTTPS URL and is enabled in the manifest",
      manifest.releaseStatus === "ENABLED" &&
        manifest.checkoutActivationStatus === "ENABLED" &&
        checkoutUrl?.protocol === "https:",
      "Checkout remains blocked until the release is enabled and an HTTPS destination is configured."
    ),
    result(
      "checkout-url-has-no-credentials",
      "Checkout URL contains no embedded credentials",
      checkoutUrl !== null && !checkoutUrl.username && !checkoutUrl.password,
      "Embedded URL usernames and passwords are always rejected."
    ),
    result(
      "edition-differs-from-public-history",
      "The sellable edition differs from the historically public artifact",
      manifest.editionDifferenceStatus === "CONFIRMED" &&
        editionIsNew &&
        checksumReady &&
        historicalChecksumRecorded &&
        privateChecksum !== historicalChecksum,
      "Requires an explicit manifest confirmation plus a new edition ID and different checksum."
    ),
    result(
      "public-copy-matches-edition",
      "Public offer copy matches the approved edition",
      manifest.publicCopyStatus === "CONFIRMED" &&
        publicPageSource.includes(pageCountCopy) &&
        publicPageSource.includes(priceCopy) &&
        !/output\/pdf|fibertools-project-planning-pack\.pdf/i.test(publicPageSource),
      "The manifest confirmation, page count, price, and absence of a public artifact link must agree."
    ),
    result(
      "owner-approval-recorded",
      "Owner approval is recorded for this exact edition and checksum",
      env.PLANNING_PACK_OWNER_APPROVAL_CONFIRMED === "true" &&
        manifest.ownerVerificationStatus === "VERIFIED" &&
        ownerApproval.status === "APPROVED" &&
        ownerApproval.editionId === edition.id &&
        checksumReady &&
        ownerApproval.artifactSha256 === privateChecksum &&
        validApprovalTimestamp(ownerApproval.recordedAt),
      "Approval must be explicit in both the manifest and environment and bind to the exact artifact."
    ),
  ];

  return {
    offer: "Fiber Project Planning Pack",
    manifestPath: MANIFEST_PATH,
    ready: !loadError && checks.every((check) => check.status === "PASS"),
    loadError,
    checks,
  };
}

function printReport(report) {
  console.log(`${report.offer} readiness: ${report.ready ? "READY" : "BLOCKED"}`);
  if (report.loadError) console.log(`[BLOCKED] inputs: ${report.loadError}`);
  for (const check of report.checks) {
    console.log(`[${check.status}] ${check.label}: ${check.detail}`);
  }
}

function isDirectExecution() {
  if (!process.argv[1]) return false;
  return import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
}

if (isDirectExecution()) {
  const report = await verifyPlanningPackReadiness();
  printReport(report);
  if (!report.ready) process.exitCode = 1;
}
