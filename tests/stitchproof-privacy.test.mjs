import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const privacy = read("src/app/privacy/page.tsx");
const cookies = read("src/app/cookies/page.tsx");
const terms = read("src/app/terms/page.tsx");
const validation = read("docs/stitchproof-designer-validation.md");

test("privacy copy documents browser-local processing, opt-in storage, and exports", () => {
  assert.match(privacy, /Last updated: August 26, 2026/);
  assert.match(privacy, /Pattern text,[\s\S]*processed in your browser[\s\S]*not sent to FiberTools servers/);
  assert.match(privacy, /does not use session recording/);
  assert.match(privacy, /unless you explicitly choose to save it on[\s\S]*this device/);
  assert.match(privacy, /browser-local IndexedDB/);
  assert.match(privacy, /specific to that browser profile and device/);
  assert.match(privacy, /JSON backups, CSV issue files, printer-friendly[\s\S]*browser&apos;s print feature/);
  assert.doesNotMatch(privacy, /printer-friendly\s+HTML|JSON, CSV, HTML/);
  assert.match(privacy, /default report excludes full pattern instructions/);
  assert.match(privacy, /suppressed when Global Privacy Control is active/);
  assert.match(privacy, /never sends pattern text,[\s\S]*calculated stitch values/);
});

test("cookie copy separates explicit project storage from consent storage and exports", () => {
  assert.match(cookies, /Last updated: August 26, 2026/);
  assert.match(cookies, /empire_gpc/);
  assert.match(cookies, /IndexedDB only after you explicitly/);
  assert.match(cookies, /does not sync between devices/);
  assert.match(cookies, /clearing the site&apos;s browser data removes it/);
  assert.match(cookies, /JSON backup,[\s\S]*browser-print or PDF files are separate files/);
});

test("terms keep the $9 checkout closed and state deterministic-report limitations", () => {
  assert.match(terms, /Last updated: August 26, 2026/);
  assert.match(terms, /proposed \$9 Designer Report is[\s\S]*not currently for sale/);
  assert.match(terms, /checkout remains disabled[\s\S]*does\s+not accept payment/);
  assert.match(terms, /not professional tech editing, pattern testing,[\s\S]*certification/);
  assert.match(terms, /not independently verified/);
  assert.match(terms, /default report does[\s\S]*not reproduce the full pattern/);
});

test("validation dashboard keeps metrics evidence-led and excludes owner and sandbox activity", () => {
  for (const threshold of [
    "Designer-mode starts | 40",
    "Completed reports | 20",
    "Completed version comparisons | 10",
    "Paid-report purchase attempts | 5",
    "Paid reports or firm purchase commitments | 3",
    "Manual-preflight purchases or serious inquiries | 2",
  ]) {
    assert.match(validation, new RegExp(threshold.replace(/[|]/g, "\\|")));
  }
  assert.match(validation, /acct_1U5HWnD2Of3MIt94/);
  assert.match(validation, /proposed \$9 checkout is disabled/);
  assert.match(validation, /owner, developer, household, QA,[\s\S]*synthetic/);
  assert.match(validation, /Stripe test-mode objects and payments/);
  assert.match(validation, /UNKNOWN[\s\S]*must not be recorded as zero/);
  assert.match(validation, /Revenue is recognized only from verified settled live payments/);
});
