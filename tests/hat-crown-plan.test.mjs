import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  HAT_CROWN_SECTIONS,
  MAX_HAT_CROWN_STITCHES,
  planEightSectionHatCrown,
  roundHatCastOnToSections,
} from "../src/lib/hat-crown-plan.mjs";

test("rounds the unrounded gauge product directly to the nearest eight-section count", () => {
  assert.deepEqual(roundHatCastOnToSections(75.6), {
    status: "ready",
    rawCastOn: 75.6,
    castOn: 72,
  });
  assert.equal(roundHatCastOnToSections(79.2).castOn, 80);
  assert.equal(roundHatCastOnToSections(Number.POSITIVE_INFINITY).status, "invalid");
});

test("every decrease round consumes the current count and removes eight stitches down to eight", () => {
  const result = planEightSectionHatCrown(80);

  assert.equal(result.status, "ready");
  assert.equal(result.decreaseRoundCount, 9);
  assert.equal(result.finalStitches, 8);
  assert.deepEqual(
    result.decreaseSteps.map(({ beforeStitches, afterStitches }) => [beforeStitches, afterStitches]),
    [[80, 72], [72, 64], [64, 56], [56, 48], [48, 40], [40, 32], [32, 24], [24, 16], [16, 8]],
  );

  for (const step of result.decreaseSteps) {
    const consumedPerRepeat = step.knitBeforeDecrease + 2;
    assert.equal(consumedPerRepeat * HAT_CROWN_SECTIONS, step.beforeStitches);
    assert.equal(step.afterStitches, step.beforeStitches - HAT_CROWN_SECTIONS);
  }

  assert.match(result.schedule[0], /\*K8, K2tog\* repeat 8 times \(72 sts remain\)/);
  assert.match(result.decreaseSteps.at(-1).instruction, /\*K2tog\* repeat 8 times \(8 sts remain\)/);
  assert.doesNotMatch(result.schedule.join("\n"), /K0|K-\d/);
});

test("supports the minimum and bounded maximum schedules", () => {
  const minimum = planEightSectionHatCrown(16);
  assert.equal(minimum.status, "ready");
  assert.equal(minimum.decreaseRoundCount, 1);
  assert.equal(minimum.schedule.length, 2);

  const maximum = planEightSectionHatCrown(MAX_HAT_CROWN_STITCHES);
  assert.equal(maximum.status, "ready");
  assert.equal(maximum.decreaseRoundCount, MAX_HAT_CROWN_STITCHES / 8 - 1);
  assert.equal(maximum.finalStitches, 8);
});

test("rejects non-integers, non-multiples, and unsupported ranges before allocating a schedule", () => {
  for (const castOn of [8, 15, 17, 81, 16.5, Number.NaN, Number.POSITIVE_INFINITY, MAX_HAT_CROWN_STITCHES + 8]) {
    const result = planEightSectionHatCrown(castOn);
    assert.equal(result.status, "invalid");
    assert.equal("schedule" in result, false);
  }
});

test("the Hat UI delegates crown arithmetic to the pure bounded helper", () => {
  const source = fs.readFileSync("src/app/hat-calculator/HatCalculatorTool.tsx", "utf8");
  assert.match(source, /planEightSectionHatCrown/);
  assert.match(source, /roundHatCastOnToSections/);
  assert.match(source, /crownPlan\.status !== "ready"/);
  assert.match(source, /actualCirc/);
  assert.match(source, /if \(sizePreset\) return SIZES\.find/);
  assert.doesNotMatch(source, /Match custom circ to closest size/);
  assert.doesNotMatch(source, /Math\.round\(rawCastOn \/ 8\)/);
  assert.doesNotMatch(source, /for \(let i = decreaseRounds/);
});

test("public Hat copy describes a bounded reference without promising yardage or universal fit", () => {
  const tool = fs.readFileSync("src/app/hat-calculator/HatCalculatorTool.tsx", "utf8");
  const page = fs.readFileSync("src/app/hat-calculator/page.tsx", "utf8");
  assert.match(page, /starting reference/);
  assert.match(page, /does not establish a universal fit/);
  assert.doesNotMatch(`${tool}\n${page}`, /yardage/i);
  assert.doesNotMatch(page, /complete hat blueprint|for any head size/i);
});
