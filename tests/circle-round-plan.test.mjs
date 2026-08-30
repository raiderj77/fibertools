import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  CIRCLE_ROUND_LIMITS,
  CIRCLE_ROUND_PRESETS,
  buildCircleRoundPlan,
} from "../src/lib/circle-round-plan.mjs";

test("exposes four explicitly named starting-count presets", () => {
  assert.deepEqual(
    Object.values(CIRCLE_ROUND_PRESETS).map(({ additionsPerRound }) => additionsPerRound),
    [6, 8, 12, 16],
  );
  for (const preset of Object.values(CIRCLE_ROUND_PRESETS)) assert.match(preset.name, /— \d+$/u);
});

test("every supported schedule preserves the selected arithmetic", () => {
  for (const preset of Object.values(CIRCLE_ROUND_PRESETS)) {
    for (let rounds = CIRCLE_ROUND_LIMITS.minimumRounds; rounds <= CIRCLE_ROUND_LIMITS.maximumRounds; rounds += 1) {
      const result = buildCircleRoundPlan({ presetKey: preset.key, rounds });
      assert.equal(result.ok, true);
      for (const entry of result.schedule) {
        assert.equal(entry.endingCount, preset.additionsPerRound * entry.round);
        if (entry.round > 1) {
          assert.equal(entry.endingCount, entry.previousCount + entry.additions);
          assert.equal(entry.consumedPerRepeat * preset.additionsPerRound, entry.previousCount);
        }
        assert.ok(Number.isSafeInteger(entry.endingCount));
      }
    }
  }
});

test("returns transparent checkpoints for representative presets", () => {
  const sc = buildCircleRoundPlan({ presetKey: "sc6", rounds: 3 });
  assert.equal(sc.ok, true);
  assert.deepEqual(sc.schedule[2], {
    round: 3,
    previousCount: 12,
    additions: 6,
    endingCount: 18,
    plainStitchesPerRepeat: 1,
    consumedPerRepeat: 2,
    instruction: "Round 3: *2 sc in next st, sc in next 1 st* repeat 6 times. (18 sc)",
  });
  assert.equal(buildCircleRoundPlan({ presetKey: "hdc8", rounds: 8 }).endingCount, 64);
  assert.equal(buildCircleRoundPlan({ presetKey: "tr16", rounds: 30 }).endingCount, 480);
});

test("rejects unknown, fractional, nonfinite, and out-of-range inputs", () => {
  for (const input of [
    { presetKey: "unknown", rounds: 8 },
    { presetKey: "sc6", rounds: NaN },
    { presetKey: "sc6", rounds: Infinity },
    { presetKey: "sc6", rounds: 3.5 },
    { presetKey: "sc6", rounds: 2 },
    { presetKey: "sc6", rounds: 31 },
  ]) assert.equal(buildCircleRoundPlan(input).ok, false);
});

test("Circle UI delegates arithmetic to the bounded helper", () => {
  const source = fs.readFileSync("src/app/circle-calculator/CircleCalculatorTool.tsx", "utf8");
  assert.match(source, /buildCircleRoundPlan/);
  assert.match(source, /common starting-count preset/i);
  assert.doesNotMatch(source, /function generatePattern|no curling|no ruffling|avoid visible lines|true round/i);
});
