import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { calculateDriveRatio } from "../src/lib/spinning-ratio.mjs";

test("calculates the ideal geometric pulley ratio", () => {
  const result = calculateDriveRatio({
    driveWheelDiameter: 22,
    drivenPulleyDiameter: 2.5,
  });

  assert.equal(result.status, "ready");
  assert.equal(result.ratio, 8.8);
});

test("accepts any matching measurement unit", () => {
  const inches = calculateDriveRatio({ driveWheelDiameter: 22, drivenPulleyDiameter: 2.5 });
  const centimeters = calculateDriveRatio({ driveWheelDiameter: 55.88, drivenPulleyDiameter: 6.35 });

  assert.equal(inches.status, "ready");
  assert.equal(centimeters.status, "ready");
  assert.ok(Math.abs(inches.ratio - centimeters.ratio) < 1e-12);
});

test("rejects non-finite and non-positive measurements", () => {
  for (const inputs of [
    { driveWheelDiameter: Number.NaN, drivenPulleyDiameter: 2.5 },
    { driveWheelDiameter: Number.POSITIVE_INFINITY, drivenPulleyDiameter: 2.5 },
    { driveWheelDiameter: 22, drivenPulleyDiameter: 0 },
    { driveWheelDiameter: -22, drivenPulleyDiameter: 2.5 },
  ]) {
    assert.equal(calculateDriveRatio(inputs).status, "invalid");
  }
});

test("the UI exposes one bounded ratio result instead of yarn inference tabs", () => {
  const source = fs.readFileSync("src/app/spinning-ratio-calculator/SpinningCalculatorTool.tsx", "utf8");

  assert.match(source, /calculateDriveRatio/);
  assert.match(source, /driven-component rotations per full drive-wheel revolution/i);
  assert.match(source, /does not determine twists per inch, yarn weight/i);
  assert.match(source, /effective or pitch diameter/i);
  assert.match(source, /outer flange/i);
  assert.doesNotMatch(source, /YARN_TARGETS|matchingWeight|balancedTwist|TPI Calculator|Fiber Guide/);
});
