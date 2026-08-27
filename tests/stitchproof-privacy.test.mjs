import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");
const privacy = read("src/app/privacy/page.tsx");
const cookies = read("src/app/cookies/page.tsx");
const terms = read("src/app/terms/page.tsx");

test("privacy copy documents browser-local processing, opt-in storage, and exports", () => {
  assert.match(privacy, /Last updated: August 27, 2026/);
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
  assert.match(cookies, /stored in IndexedDB only when you explicitly/);
  assert.match(cookies, /does not sync between devices/);
  assert.match(cookies, /clearing the site&apos;s browser data removes it/);
  assert.match(cookies, /JSON backup,[\s\S]*browser-print or PDF files are separate files/);
});

test("terms define the approved project purchase, fail-closed sales, and deterministic-report limitations", () => {
  assert.match(terms, /Last updated: August 27, 2026/);
  assert.match(terms, /Designer Report has a \$9 base price once for one pattern[\s\S]*project, including its revisions and report exports/);
  assert.match(terms, /not a[\s\S]*subscription/);
  assert.match(terms, /checkout is unavailable,[\s\S]*cannot start a new checkout/);
  assert.match(terms, /previously opened[\s\S]*Stripe checkout may remain payable/);
  assert.match(terms, /Any applicable tax[\s\S]*final total are shown by Stripe before payment/);
  assert.match(terms, /private JSON backup remain available[\s\S]*without payment/);
  assert.match(terms, /verifies the payment online/);
  assert.match(terms, /Restoring the same project backup preserves its purchase reference/);
  assert.match(terms, /not professional tech editing, pattern testing,[\s\S]*certification/);
  assert.match(terms, /not independently verified/);
  assert.match(terms, /default report does[\s\S]*not reproduce the full pattern/);
});

test("purchase privacy separates local patterns, recovery keys, and private payment records", () => {
  assert.match(privacy, /private payment records store a hash[\s\S]*not[\s\S]*the key itself, pattern text, project title/);
  assert.match(privacy, /deleting a browser-local project does not delete them/);
  assert.match(privacy, /existing purchase is verified independently/);
  assert.match(cookies, /not an analytics cookie/);
  assert.match(cookies, /never the pattern or its metadata/);
});

test("managed purchase copy distinguishes the checkout declaration from billing data and local drafts", () => {
  assert.match(privacy, /If Managed Payments checkout is available/);
  assert.match(privacy, /selected country code[\s\S]*market-policy version, and the product tax code/);
  assert.match(privacy, /not independently verified[\s\S]*not saved in your draft,[\s\S]*recovery backup, or analytics/);
  assert.match(terms, /base price is in US dollars/);
  assert.match(terms, /may display a local-currency price/);
  assert.match(terms, /Review the seller details, currency, any applicable tax, and final total/);
});

test("validation dashboard keeps metrics evidence-led and excludes owner and sandbox activity", () => {
  // Keep protected experiment reads local to their explicitly selected test.
  const validation = read("docs/stitchproof-designer-validation.md");
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
