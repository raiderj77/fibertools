import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { SOCK_PLAN_LIMITS, buildSockCircumferencePlan } from "../src/lib/sock-plan.mjs";

test("builds a transparent circumference checkpoint and reports rounding effects", () => {
  const result = buildSockCircumferencePlan({
    footCircumference: 8,
    easePercent: 10,
    gaugeStitches: 32,
    gaugeSpan: 4,
    stitchMultiple: 4,
  });
  assert.equal(result.ok, true);
  assert.equal(result.rawStitches, 57.6);
  assert.equal(result.adjustedStitches, 56);
  assert.equal(result.modeledCircumference, 7);
  assert.equal(result.effectiveEasePercent, 12.5);
  assert.equal(result.halfRoundStitches, 28);
});

test("uses a documented nearest-multiple tie-up rule", () => {
  const result = buildSockCircumferencePlan({
    footCircumference: 6,
    easePercent: 0,
    gaugeStitches: 6,
    gaugeSpan: 1,
    stitchMultiple: 8,
  });
  assert.equal(result.ok, true);
  assert.equal(result.rawStitches, 36);
  assert.equal(result.adjustedStitches, 40);
});

test("rejects nonfinite, fractional-multiple, and out-of-range inputs", () => {
  const base = { footCircumference: 8, easePercent: 10, gaugeStitches: 32, gaugeSpan: 4, stitchMultiple: 4 };
  for (const patch of [
    { footCircumference: 0 },
    { footCircumference: Infinity },
    { easePercent: -1 },
    { easePercent: SOCK_PLAN_LIMITS.maximumEasePercent + 1 },
    { gaugeStitches: NaN },
    { gaugeSpan: 0 },
    { stitchMultiple: 4.5 },
    { stitchMultiple: SOCK_PLAN_LIMITS.maximumMultiple + 1 },
  ]) assert.equal(buildSockCircumferencePlan({ ...base, ...patch }).ok, false);
});

test("Sock UI delegates to the bounded helper and excludes inferred heel or toe instructions", () => {
  const source = fs.readFileSync("src/app/sock-calculator/SockCalculatorTool.tsx", "utf8");
  assert.match(source, /buildSockCircumferencePlan/);
  assert.match(source, /modeled circumference/);
  assert.match(source, /effective ease/);
  assert.doesNotMatch(source, /heel flap|gusset pickup|toe increase|short-row heel/i);
});
