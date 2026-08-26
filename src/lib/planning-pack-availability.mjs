import { normalizeCheckoutUrl } from "./offer-links.mjs";

const EXPECTED_PRODUCT_NAME = "Fiber Project Planning Pack";
const EXPECTED_CREATION_DATE = "2026-08-25";
const EXPECTED_EDITION_ID = "FT-PP-V2-2026-08-25";
const EXPECTED_PAGE_COUNT = 12;
const EXPECTED_PRICE_USD = 17;
const SHA256_PATTERN = /^[a-f0-9]{64}$/;

function isUsableCheckoutUrl(value) {
  const normalized = normalizeCheckoutUrl(value);
  if (!normalized) return null;

  const url = new URL(normalized);
  const hostname = url.hostname.toLowerCase();
  const placeholderHost =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".invalid") ||
    hostname.endsWith(".test") ||
    hostname.endsWith(".example");
  const placeholderText = /replace[_-]?me|placeholder/i.test(normalized);

  return placeholderHost || placeholderText ? null : normalized;
}

function isRecordedApproval(value, now) {
  if (typeof value !== "string" || !value) return false;
  const recordedAt = Date.parse(value);
  const currentTime = now instanceof Date ? now.getTime() : Date.parse(now);
  return Number.isFinite(recordedAt) && Number.isFinite(currentTime) && recordedAt <= currentTime;
}

/**
 * Return the checkout URL only when the immutable release record, server-side
 * confirmations, exact artifact binding, and owner approval all agree.
 */
export function getPlanningPackCheckoutUrl({ manifest, env = {}, now = new Date() }) {
  const edition = manifest?.edition ?? {};
  const historical = manifest?.historicallyPublicEdition ?? {};
  const artifact = manifest?.privateArtifact ?? {};
  const approval = manifest?.ownerApproval ?? {};
  const checksum = artifact.sha256;
  const checkoutUrl = isUsableCheckoutUrl(env.NEXT_PUBLIC_PLANNING_PACK_CHECKOUT_URL);

  const releaseRecordMatches =
    manifest?.publicProductName === EXPECTED_PRODUCT_NAME &&
    manifest?.creationDate === EXPECTED_CREATION_DATE &&
    manifest?.priceUsd === EXPECTED_PRICE_USD &&
    edition.id === EXPECTED_EDITION_ID &&
    edition.pageCount === EXPECTED_PAGE_COUNT &&
    edition.id !== historical.id &&
    manifest?.editionDifferenceStatus === "CONFIRMED" &&
    manifest?.publicCopyStatus === "CONFIRMED";

  const artifactMatches =
    typeof checksum === "string" &&
    SHA256_PATTERN.test(checksum) &&
    artifact.expectedSha256 === checksum &&
    typeof historical.sha256 === "string" &&
    SHA256_PATTERN.test(historical.sha256) &&
    historical.sha256 !== checksum &&
    env.PLANNING_PACK_EDITION_ID === edition.id &&
    env.PLANNING_PACK_PRIVATE_FILE_SHA256 === checksum;

  const privateDeliveryReady =
    artifact.uploadStatus === "UPLOADED" &&
    manifest?.privateUploadStatus === "UPLOADED" &&
    manifest?.privateDeliveryStatus === "CONFIRMED" &&
    env.PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED === "true" &&
    env.PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED === "true";

  const ownerApproved =
    manifest?.ownerVerificationStatus === "VERIFIED" &&
    approval.status === "APPROVED" &&
    approval.editionId === edition.id &&
    approval.artifactSha256 === checksum &&
    isRecordedApproval(approval.recordedAt, now) &&
    env.PLANNING_PACK_OWNER_APPROVAL_CONFIRMED === "true";

  const activationEnabled =
    manifest?.releaseStatus === "ENABLED" &&
    manifest?.checkoutActivationStatus === "ENABLED";

  return releaseRecordMatches &&
    artifactMatches &&
    privateDeliveryReady &&
    ownerApproved &&
    activationEnabled
    ? checkoutUrl
    : null;
}
