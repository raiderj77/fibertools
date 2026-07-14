import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const interestCard = fs.readFileSync(
  "src/app/amigurumi-pattern-checker/StitchProofInterestCard.tsx",
  "utf8",
);

test("provides three explicit, editable product-interest requests", () => {
  assert.match(interestCard, /complete_audit/);
  assert.match(interestCard, /saved_projects/);
  assert.match(interestCard, /downloadable_report/);
  assert.match(interestCard, /mailto:hello@fibertools\.app/);
  assert.match(interestCard, /Yes \/ Maybe \/ No/);
  assert.match(interestCard, /only a sent request counts/i);
});

test("tracks only a fixed interest category and page path", () => {
  assert.match(interestCard, /"stitchproof_interest_click"/);
  assert.match(interestCard, /interest_type: interestType/);
  assert.match(interestCard, /page_path: "\/amigurumi-pattern-checker"/);
  assert.doesNotMatch(interestCard, /fetch\(|localStorage|sessionStorage/);
  assert.doesNotMatch(interestCard, /pattern_text|email_address|project_name/);
});

test("links existing high-intent pages to StitchProof", () => {
  for (const file of [
    "src/app/amigurumi-shapes/page.tsx",
    "src/app/circle-calculator/page.tsx",
    "src/app/best-yarn-for-amigurumi/page.tsx",
  ]) {
    const source = fs.readFileSync(file, "utf8");
    assert.match(source, /href="\/amigurumi-pattern-checker"/, `${file} must link to StitchProof`);
  }
});
