import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { RAGLAN_CHECKPOINT_LIMITS, buildRaglanBodyCheckpoint } from "../src/lib/raglan-plan.mjs";

test("builds only a finished-body stitch checkpoint", () => {
  const result = buildRaglanBodyCheckpoint({
    finishedBodyCircumference: 40,
    gaugeStitches: 18,
    gaugeSpan: 4,
    stitchMultiple: 4,
  });
  assert.equal(result.ok, true);
  assert.equal(result.rawBodyStitches, 180);
  assert.equal(result.bodyStitches, 180);
  assert.equal(result.modeledBodyCircumference, 40);
});

test("reports the actual circumference after nearest-multiple rounding", () => {
  const result = buildRaglanBodyCheckpoint({
    finishedBodyCircumference: 41,
    gaugeStitches: 18,
    gaugeSpan: 4,
    stitchMultiple: 8,
  });
  assert.equal(result.ok, true);
  assert.equal(result.bodyStitches, 184);
  assert.equal(result.modeledBodyCircumference, 184 / 4.5);
});

test("rejects unsafe and unsupported inputs", () => {
  const base = { finishedBodyCircumference: 40, gaugeStitches: 18, gaugeSpan: 4, stitchMultiple: 4 };
  for (const patch of [
    { finishedBodyCircumference: 0 },
    { finishedBodyCircumference: RAGLAN_CHECKPOINT_LIMITS.maximumCircumference + 1 },
    { gaugeStitches: Infinity },
    { gaugeSpan: 0 },
    { stitchMultiple: 1.5 },
    { stitchMultiple: RAGLAN_CHECKPOINT_LIMITS.maximumMultiple + 1 },
  ]) assert.equal(buildRaglanBodyCheckpoint({ ...base, ...patch }).ok, false);
});

test("Raglan UI delegates to the bounded checkpoint and excludes fabricated construction math", () => {
  const source = fs.readFileSync("src/app/raglan-calculator/RaglanCalculatorTool.tsx", "utf8");
  assert.match(source, /buildRaglanBodyCheckpoint/);
  assert.match(source, /Modeled body circumference/);
  assert.doesNotMatch(source, /neckCastOn|increaseRounds|frontStitches|backStitches|sleeveStitches|30\/30\/15\/15/);
});
