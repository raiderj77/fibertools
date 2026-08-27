import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  analyzePublicationState,
  appRouteFromPagePath,
  collectPublicationState,
  extractRegistrySlugs,
  isAppRouterPagePath,
  isMonitoredPublicSourcePath,
  isPagesRouterPublicPath,
  isPriceBearingSource,
  pagesRouteFromPagePath,
  readPublicationManifest,
} from "../scripts/publication-freeze.mjs";


const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NOW = new Date("2026-08-26T12:00:00Z");


function snapshot(value) {
  return structuredClone(value);
}


function listSha256(values) {
  return createHash("sha256")
    .update([...new Set(values)].sort((a, b) => a.localeCompare(b)).join("\n"), "utf8")
    .digest("hex");
}


test("current publication state passes with its owner-approved exception", () => {
  const violations = analyzePublicationState(
    readPublicationManifest(ROOT),
    collectPublicationState(ROOT),
    NOW,
  );
  assert.deepEqual(violations, []);
});


test("publication approval is narrow and time-bound", () => {
  const manifest = readPublicationManifest(ROOT);
  assert.deepEqual(manifest.approvals, [{
    route: "/amigurumi-pattern-checker/designer",
    contentType: "PAID_OFFER",
    title: "StitchProof Designer Report and Version Compare",
    ownerApprovalDate: "2026-08-26",
    reason: "Owner-approved private browser-local Designer Report: $9 per pattern project, including revisions and report exports, with no subscription or pattern uploads. Checkout remains disabled until payment, recovery, and non-customer delivery verification pass.",
    approvalReference: "Owner-approved Codex build prompt and explicit per-project purchase-scope confirmation dated 2026-08-26; production activation requires separate verified release evidence",
    reviewOrExpirationDate: "2026-09-25",
    indexingApproved: true,
  }]);
});


test("alternate App Router page extensions remain part of public route inventory", () => {
  for (const file of [
    "synthetic/page.tsx",
    "synthetic/page.ts",
    "synthetic/page.jsx",
    "synthetic/page.js",
  ]) {
    assert.equal(isAppRouterPagePath(file), true);
    assert.equal(appRouteFromPagePath(file), "/synthetic");
  }
  assert.equal(isAppRouterPagePath("synthetic/homepage.tsx"), false);
});


test("new Pages Router files map to public inventory while framework and API files do not", () => {
  assert.equal(isPagesRouterPublicPath("index.js"), true);
  assert.equal(pagesRouteFromPagePath("index.js"), "/");
  assert.equal(isPagesRouterPublicPath("archive/index.jsx"), true);
  assert.equal(pagesRouteFromPagePath("archive/index.jsx"), "/archive");
  assert.equal(isPagesRouterPublicPath("guides/[slug].tsx"), true);
  assert.equal(pagesRouteFromPagePath("guides/[slug].tsx"), "/guides/[slug]");
  for (const file of ["api/checkout.ts", "_app.tsx", "_document.js", "_error.jsx"]) {
    assert.equal(isPagesRouterPublicPath(file), false);
  }
});


test("registry inventory accepts static quote styles and rejects computed slugs", () => {
  const parsed = extractRegistrySlugs(`
    slug: "double-quoted",
    slug: 'single-quoted',
    slug: \`backtick-quoted\`,
    slug: makeSlug(),
    slug: PREFIX + "computed",
  `, "synthetic-registry");

  assert.deepEqual(parsed.slugs, ["double-quoted", "single-quoted", "backtick-quoted"]);
  assert.equal(parsed.violations.length, 2);
  assert(parsed.violations.every((message) => message.includes("unsupported nonliteral slug")));

  const manifest = readPublicationManifest(ROOT);
  const state = snapshot(collectPublicationState(ROOT));
  state.registrySlugViolations.push(...parsed.violations);
  assert(
    analyzePublicationState(manifest, state, NOW)
      .some((message) => message.includes("unsupported nonliteral slug")),
  );
});


test("price-bearing JS, JSX, TS, and TSX source extensions are monitored", () => {
  const extensions = [".js", ".jsx", ".ts", ".tsx"];
  for (const extension of extensions) {
    assert.equal(isMonitoredPublicSourcePath(`paid-offer/component${extension}`), true);
  }
  assert.equal(isMonitoredPublicSourcePath("paid-offer/component.mdx"), false);
  assert.equal(isPriceBearingSource('const price = "$17";'), true);
  assert.equal(isPriceBearingSource("const unpriced = true;"), false);
});


test("reproduces and blocks the removed duplicate blanket article", () => {
  const manifest = readPublicationManifest(ROOT);
  const state = snapshot(collectPublicationState(ROOT));
  state.articles.push({
    file: "2026-08-25-how-much-yarn-for-a-blanket.md",
    slug: "how-much-yarn-for-a-blanket",
    title: "how much yarn for a blanket?",
    canonical: "https://fibertools.app/blog/how-much-yarn-for-a-blanket",
    date: "2026-08-25",
    route: "/blog/how-much-yarn-for-a-blanket",
  });
  state.articles.push({
    file: "synthetic-canonical-collision.md",
    slug: "synthetic-canonical-collision",
    title: "synthetic canonical collision",
    canonical: "https://fibertools.app/blog/how-much-yarn-for-a-blanket",
    date: "2026-08-25",
    route: "/blog/synthetic-canonical-collision",
  });

  const violations = analyzePublicationState(manifest, state, NOW);
  assert(violations.some((message) => message.includes('Duplicate article slug "how-much-yarn-for-a-blanket"')));
  assert(violations.some((message) => message.includes('Duplicate article title "how much yarn for a blanket?"')));
  assert(violations.some((message) => message.includes("Duplicate article canonical")));
  assert(violations.some((message) => message.includes("dated inside the freeze")));
});


test("blocks an unapproved calculator route and permits a complete approval record", () => {
  const manifest = readPublicationManifest(ROOT);
  const state = snapshot(collectPublicationState(ROOT));
  state.publicRoutes.push("/synthetic-calculator");
  state.toolSlugs.push("synthetic-calculator");

  const blocked = analyzePublicationState(manifest, state, NOW);
  assert(blocked.some((message) => message.startsWith("Public route inventory changed")));
  assert(blocked.some((message) => message.startsWith("Calculator/tool registry changed")));

  manifest.approvals.push({
    route: "/synthetic-calculator",
    contentType: "CALCULATOR",
    title: "Synthetic Calculator",
    ownerApprovalDate: "2026-08-25",
    reason: "Synthetic test fixture",
    approvalReference: "tests/publication-freeze.test.mjs",
    reviewOrExpirationDate: "2026-11-20",
    indexingApproved: true,
  });
  assert.deepEqual(analyzePublicationState(manifest, state, NOW), []);
});


test("decision date does not lift the freeze without an explicit owner decision", () => {
  const manifest = readPublicationManifest(ROOT);
  manifest.approvals = [];
  const state = snapshot(collectPublicationState(ROOT));
  state.publicRoutes.push("/synthetic-after-decision-date");

  for (const now of [
    new Date("2026-11-20T12:00:00Z"),
    new Date("2026-12-01T12:00:00Z"),
  ]) {
    assert(
      analyzePublicationState(manifest, state, now)
        .some((message) => message.startsWith("Public route inventory changed")),
    );
  }

  manifest.freeze.status = "LIFTED";
  manifest.freeze.ownerDecision = {
    action: "LIFT",
    ownerDecisionDate: "2026-11-20",
    reason: "Synthetic owner decision fixture",
    approvalReference: "tests/publication-freeze.test.mjs",
  };
  assert.deepEqual(
    analyzePublicationState(manifest, state, new Date("2026-11-20T12:00:00Z")),
    [],
  );
});


test("approvals cannot be future-dated, expired, or indexable without approval", () => {
  const baseManifest = readPublicationManifest(ROOT);
  const state = snapshot(collectPublicationState(ROOT));
  state.publicRoutes.push("/synthetic-time-bound-approval");
  state.toolSlugs.push("synthetic-time-bound-approval");
  const approval = {
    route: "/synthetic-time-bound-approval",
    contentType: "TOOL",
    title: "Synthetic Time-Bound Approval",
    ownerApprovalDate: "2026-08-25",
    reason: "Synthetic test fixture",
    approvalReference: "tests/publication-freeze.test.mjs",
    reviewOrExpirationDate: "2026-09-01",
    indexingApproved: true,
  };

  const future = snapshot(baseManifest);
  future.approvals.push({ ...approval, ownerApprovalDate: "2026-08-27" });
  assert(
    analyzePublicationState(future, state, NOW)
      .some((message) => message.includes("ownerApprovalDate cannot be in the future")),
  );

  const expired = snapshot(baseManifest);
  expired.approvals.push(approval);
  assert(
    analyzePublicationState(expired, state, new Date("2026-09-02T12:00:00Z"))
      .some((message) => message.includes("approval is expired")),
  );

  const indexingDenied = snapshot(baseManifest);
  indexingDenied.approvals.push({ ...approval, indexingApproved: false });
  assert(
    analyzePublicationState(indexingDenied, state, NOW)
      .some((message) => message.includes("indexingApproved must be true")),
  );
});


test("the origin-main publication baseline cannot self-authorize by changing its hashes", () => {
  const manifest = readPublicationManifest(ROOT);
  const state = snapshot(collectPublicationState(ROOT));
  state.publicRoutes.push("/synthetic-baked-into-baseline");
  manifest.baseline.publicRouteCount = new Set(state.publicRoutes).size;
  manifest.baseline.publicRouteSha256 = listSha256(state.publicRoutes);

  assert(
    analyzePublicationState(manifest, state, NOW)
      .some((message) => message.includes("Pinned publication baseline digest mismatch")),
  );
});


test("blocks a scheduled content workflow that can push directly to main", () => {
  const manifest = readPublicationManifest(ROOT);
  const state = snapshot(collectPublicationState(ROOT));
  state.scheduledDirectMainWorkflows.push(".github/workflows/synthetic-publisher.yml");
  assert(
    analyzePublicationState(manifest, state, NOW)
      .some((message) => message.includes("can write directly to main")),
  );
});
