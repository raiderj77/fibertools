import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { verifyPlanningPackReadiness } from "../scripts/verify-planning-pack-readiness.mjs";
import { CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID } from "../src/lib/planning-pack-delivery.mjs";

const read = (relativePath) => readFile(new URL(relativePath, import.meta.url), "utf8");

async function releaseFixture() {
  const [manifestText, publicPageSource] = await Promise.all([
    read("../config/planning-pack-release-manifest.json"),
    read("../src/app/fiber-project-planning-pack/page.tsx"),
  ]);
  return { manifest: JSON.parse(manifestText), publicPageSource };
}

test("planning-pack manifest records the validated private upload but stays disabled", async () => {
  const { manifest } = await releaseFixture();

  assert.equal(manifest.edition.id, "FT-PP-V2-2026-08-25");
  assert.equal(manifest.edition.pageCount, 12);
  assert.equal(manifest.publicProductName, "Fiber Project Planning Pack");
  assert.equal(manifest.creationDate, "2026-08-25");
  assert.equal(
    manifest.privateArtifact.sha256,
    "e5407e856ce539b1e751f8e36388c3d66d3151a649e6e61a97036ce9cbdd89a6"
  );
  assert.equal(manifest.privateArtifact.byteSize, 134356);
  assert.equal(manifest.privateArtifact.uploadStatus, "UPLOADED");
  assert.equal(manifest.privateUploadStatus, "UPLOADED");
  assert.equal(manifest.privateDeliveryStatus, "PENDING");
  assert.equal(manifest.editionDifferenceStatus, "CONFIRMED");
  assert.equal(manifest.publicCopyStatus, "CONFIRMED");
  assert.equal(manifest.ownerVerificationStatus, "PENDING");
  assert.equal(manifest.ownerApproval.status, "PENDING");
  assert.equal(manifest.releaseStatus, "DISABLED");
  assert.equal(manifest.checkoutActivationStatus, "DISABLED");
});

test("planning-pack readiness evaluates exactly twelve fail-closed conditions", async () => {
  const report = await verifyPlanningPackReadiness({
    env: {
      PLANNING_PACK_EDITION_ID: "FT-PP-V2-2026-08-25",
      PLANNING_PACK_PRIVATE_FILE_SHA256:
        "e5407e856ce539b1e751f8e36388c3d66d3151a649e6e61a97036ce9cbdd89a6",
    },
  });

  assert.equal(report.checks.length, 12);
  assert.equal(report.ready, false);
  assert.equal(
    report.checks.find((check) => check.id === "private-checksum")?.status,
    "PASS"
  );
  for (const blockedId of [
    "private-delivery-confirmed",
    "private-upload-confirmed",
    "valid-https-checkout-url",
    "checkout-url-has-no-credentials",
    "owner-approval-recorded",
  ]) {
    assert.equal(report.checks.find((check) => check.id === blockedId)?.status, "BLOCKED");
  }
});

test("planning-pack readiness binds approval to the exact private artifact", async () => {
  const { manifest, publicPageSource } = await releaseFixture();
  const approvedManifest = structuredClone(manifest);
  approvedManifest.releaseStatus = "ENABLED";
  approvedManifest.checkoutActivationStatus = "ENABLED";
  approvedManifest.privateArtifact.uploadStatus = "UPLOADED";
  approvedManifest.privateUploadStatus = "UPLOADED";
  approvedManifest.privateDeliveryStatus = "CONFIRMED";
  approvedManifest.editionDifferenceStatus = "CONFIRMED";
  approvedManifest.publicCopyStatus = "CONFIRMED";
  approvedManifest.ownerVerificationStatus = "VERIFIED";
  approvedManifest.ownerApproval = {
    status: "APPROVED",
    editionId: approvedManifest.edition.id,
    artifactSha256: approvedManifest.privateArtifact.sha256,
    recordedAt: "2026-08-25T20:00:00.000Z",
  };
  const env = {
    PLANNING_PACK_PRIVATE_DELIVERY_CONFIRMED: "true",
    PLANNING_PACK_PRIVATE_UPLOAD_CONFIRMED: "true",
    PLANNING_PACK_OWNER_APPROVAL_CONFIRMED: "true",
    PLANNING_PACK_EDITION_ID: approvedManifest.edition.id,
    PLANNING_PACK_PRIVATE_FILE_SHA256: approvedManifest.privateArtifact.sha256,
    PLANNING_PACK_STRIPE_PAYMENT_LINK_URL: "https://buy.stripe.com/test_unitfixture123",
    NEXT_PUBLIC_SITE_URL: "https://fibertools.app",
    STRIPE_MODE: "test",
    STRIPE_SECRET_KEY: "sk_test_unitfixture",
    FIBERTOOLS_STRIPE_ACCOUNT_ID: CANONICAL_FIBERTOOLS_STRIPE_ACCOUNT_ID,
    PLANNING_PACK_STRIPE_PAYMENT_LINK_ID: "plink_unitfixture",
    PLANNING_PACK_STRIPE_PRICE_ID: "price_unitfixture",
    SUPABASE_URL: "https://unitfixture.supabase.co",
    SUPABASE_SECRET_KEY: "sb_secret_unitfixture",
    PLANNING_PACK_STORAGE_BUCKET: "planning-pack-private",
    PLANNING_PACK_STORAGE_OBJECT_PATH:
      "releases/FT-PP-V2-2026-08-25/fiber-project-planning-pack.pdf",
  };

  const ready = await verifyPlanningPackReadiness({
    env,
    manifest: approvedManifest,
    publicPageSource,
  });
  assert.equal(ready.ready, true);
  assert.ok(ready.checks.every((check) => check.status === "PASS"));

  approvedManifest.ownerApproval.artifactSha256 =
    approvedManifest.historicallyPublicEdition.sha256;
  const staleApproval = await verifyPlanningPackReadiness({
    env,
    manifest: approvedManifest,
    publicPageSource,
  });
  assert.equal(staleApproval.ready, false);
  assert.equal(
    staleApproval.checks.find((check) => check.id === "owner-approval-recorded")?.status,
    "BLOCKED"
  );
});

test("planning-pack readiness rejects embedded checkout credentials", async () => {
  const { manifest, publicPageSource } = await releaseFixture();
  const candidate = structuredClone(manifest);
  candidate.releaseStatus = "ENABLED";
  candidate.checkoutActivationStatus = "ENABLED";

  const report = await verifyPlanningPackReadiness({
    env: {
      PLANNING_PACK_STRIPE_PAYMENT_LINK_URL:
        "https://operator:password@buy.stripe.com/test_unitfixture123",
      PLANNING_PACK_EDITION_ID: candidate.edition.id,
      PLANNING_PACK_PRIVATE_FILE_SHA256: candidate.privateArtifact.sha256,
    },
    manifest: candidate,
    publicPageSource,
  });

  assert.equal(
    report.checks.find((check) => check.id === "checkout-url-has-no-credentials")?.status,
    "BLOCKED"
  );
});

test("planning-pack readiness rejects documented placeholder destinations", async () => {
  const { manifest, publicPageSource } = await releaseFixture();
  const candidate = structuredClone(manifest);
  candidate.releaseStatus = "ENABLED";
  candidate.checkoutActivationStatus = "ENABLED";

  const report = await verifyPlanningPackReadiness({
    env: {
      PLANNING_PACK_STRIPE_PAYMENT_LINK_URL: "https://checkout.example.invalid/planning-pack",
      PLANNING_PACK_EDITION_ID: candidate.edition.id,
      PLANNING_PACK_PRIVATE_FILE_SHA256: candidate.privateArtifact.sha256,
    },
    manifest: candidate,
    publicPageSource,
  });

  assert.equal(
    report.checks.find((check) => check.id === "valid-https-checkout-url")?.status,
    "BLOCKED"
  );
});
