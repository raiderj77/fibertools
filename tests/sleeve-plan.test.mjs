import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { planSleeveTaper } from "../src/lib/sleeve-plan.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const base = {
  upperArmCircumference: 12,
  wristCircumference: 8,
  sleeveLength: 18,
  cuffLength: 2,
  stitchesPerInch: 5,
  rowsPerInch: 6,
};

test("returns an exact two-interval schedule whose row spans add to the shaping zone", () => {
  const result = planSleeveTaper(base);

  assert.equal(result.status, "ready");
  assert.equal(result.upperArmSts, 60);
  assert.equal(result.cuffSts, 40);
  assert.equal(result.decreaseEvents, 10);
  assert.equal(result.shapingRows, 84);
  assert.equal(result.everyNRows, 8);
  assert.equal(result.remainder, 4);
  assert.equal(
    result.instruction,
    "Allocate the modeled shaping span as 6 blocks of 8 rows and 4 blocks of 9 rows for 10 paired-decrease events.",
  );
  assert.equal(
    (result.decreaseEvents - result.remainder) * result.everyNRows
      + result.remainder * (result.everyNRows + 1),
    result.shapingRows,
  );
});

test("rejects the live zero-row reproduction instead of producing an instruction", () => {
  const result = planSleeveTaper({
    upperArmCircumference: 16,
    wristCircumference: 6,
    sleeveLength: 5,
    cuffLength: 2,
    stitchesPerInch: 6,
    rowsPerInch: 8,
  });

  assert.equal(result.status, "unsupported");
  assert.equal(result.decreaseEvents, 30);
  assert.equal(result.shapingRows, 8);
  assert.match(result.message, /needs 30 decrease rows but only 8 shaping rows/i);
  assert.doesNotMatch(result.message, /every 0 rows/i);
  assert.equal("instruction" in result, false);
});

test("supports the boundary where one decrease event is available per shaping row", () => {
  const result = planSleeveTaper({
    ...base,
    sleeveLength: 4,
    cuffLength: 1,
    rowsPerInch: 10,
  });

  assert.equal(result.status, "ready");
  assert.equal(result.shapingRows, 10);
  assert.equal(result.decreaseEvents, 10);
  assert.equal(result.instruction, "Allocate the modeled shaping span as 10 blocks of 1 row for 10 paired-decrease events.");
});

test("rejects odd rounded stitch differences that paired decreases cannot reach", () => {
  const result = planSleeveTaper({
    ...base,
    upperArmCircumference: 12.2,
  });

  assert.equal(result.status, "unsupported");
  assert.equal(result.upperArmSts, 61);
  assert.equal(result.cuffSts, 40);
  assert.equal(result.stsToDecrease, 21);
  assert.match(result.message, /cannot reach the displayed cuff count exactly/i);
  assert.equal("instruction" in result, false);
});

test("fails closed for non-finite, non-tapering, and unavailable shaping-zone inputs", () => {
  assert.equal(planSleeveTaper({ ...base, rowsPerInch: Number.POSITIVE_INFINITY }).status, "invalid");
  assert.equal(planSleeveTaper({ ...base, upperArmCircumference: 8 }).status, "invalid");
  assert.equal(planSleeveTaper({ ...base, sleeveLength: 4, cuffLength: 2 }).status, "invalid");
  assert.equal(planSleeveTaper({ ...base, stitchesPerInch: Number.MAX_SAFE_INTEGER }).status, "invalid");
});

test("the UI gates blank required fields and renders an unsupported-plan message", () => {
  const source = fs.readFileSync(
    path.join(root, "src/app/sleeve-calculator/SleeveCalculatorTool.tsx"),
    "utf8",
  );

  assert.match(source, /hasCompleteInputs/);
  assert.match(source, /\[cuffRibbing, setCuffRibbing\] = useState\(""\)/);
  assert.match(source, /planSleeveTaper/);
  assert.match(source, /plan\?\.status === "ready"/);
  assert.match(source, /role="alert"/);
});
