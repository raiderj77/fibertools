import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  calculateMeasuredSkeinPurchase,
  calculateMeasuredSwatchYarn,
  calculatePartialSkeinLength,
  YARN_ESTIMATE_LIMITS,
} from "../src/lib/yarn-swatch-estimate.mjs";

const tool = readFileSync(
  new URL("../src/app/yarn-calculator/YarnCalculatorTool.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../src/app/yarn-calculator/page.tsx", import.meta.url),
  "utf8",
);

test("scales measured swatch consumption by flat area and lists allowance separately", () => {
  assert.deepEqual(
    calculateMeasuredSwatchYarn({
      targetWidth: 50,
      targetLength: 60,
      swatchWidth: 4,
      swatchLength: 4,
      swatchYarnLength: 20,
      allowancePercent: 10,
    }),
    {
      targetArea: 3000,
      swatchArea: 16,
      areaRatio: 187.5,
      baseLength: 3750,
      plannedLength: 4125,
      allowancePercent: 10,
    },
  );

  assert.equal(
    calculateMeasuredSwatchYarn({
      targetWidth: 8,
      targetLength: 10,
      swatchWidth: 4,
      swatchLength: 5,
      swatchYarnLength: 12,
      allowancePercent: 0,
    })?.plannedLength,
    48,
  );
});

test("uses a dimensionless area ratio so consistent metric inputs produce the same scale", () => {
  const metric = calculateMeasuredSwatchYarn({
    targetWidth: 127,
    targetLength: 152.4,
    swatchWidth: 10.16,
    swatchLength: 10.16,
    swatchYarnLength: 18.288,
    allowancePercent: 10,
  });

  assert.ok(metric);
  assert.ok(Math.abs(metric.areaRatio - 187.5) < 1e-10);
  assert.ok(Math.abs(metric.plannedLength - 3771.9) < 1e-9);
});

test("rejects blank, nonfinite, nonpositive, and out-of-contract estimate inputs", () => {
  const valid = {
    targetWidth: 50,
    targetLength: 60,
    swatchWidth: 4,
    swatchLength: 4,
    swatchYarnLength: 20,
    allowancePercent: 10,
  };

  for (const [field, value] of [
    ["targetWidth", ""],
    ["targetLength", "   "],
    ["swatchWidth", 0],
    ["swatchLength", -1],
    ["swatchYarnLength", Number.POSITIVE_INFINITY],
    ["targetWidth", YARN_ESTIMATE_LIMITS.dimension + 1],
    ["allowancePercent", -1],
    ["allowancePercent", YARN_ESTIMATE_LIMITS.allowancePercent + 1],
  ]) {
    assert.equal(calculateMeasuredSwatchYarn({ ...valid, [field]: value }), null, `${field}: ${value}`);
  }

  assert.equal(
    calculateMeasuredSwatchYarn({
      ...valid,
      targetWidth: YARN_ESTIMATE_LIMITS.dimension,
      targetLength: YARN_ESTIMATE_LIMITS.dimension,
      swatchWidth: 0.01,
      swatchLength: 0.01,
      swatchYarnLength: YARN_ESTIMATE_LIMITS.yarnLength,
    }),
    null,
    "results beyond the supported output ceiling must fail closed",
  );
});

test("converts the measured length to a bounded whole-skein purchase", () => {
  assert.deepEqual(
    calculateMeasuredSkeinPurchase({
      lengthNeeded: 4125,
      skeinLength: 220,
      skeinWeight: 3.5,
      units: "imperial",
    }),
    { skeins: 19, displayLength: 220, grams: 1885, ounces: 66.5 },
  );

  assert.deepEqual(
    calculateMeasuredSkeinPurchase({
      lengthNeeded: 3771.9,
      skeinLength: 201.17,
      skeinWeight: 100,
      units: "metric",
    }),
    { skeins: 19, displayLength: 201.17, grams: 1900, ounces: 67 },
  );

  for (const input of [
    { lengthNeeded: 0, skeinLength: 220, skeinWeight: 3.5, units: "imperial" },
    { lengthNeeded: 100, skeinLength: "", skeinWeight: 3.5, units: "imperial" },
    { lengthNeeded: 100, skeinLength: 220, skeinWeight: Number.NaN, units: "imperial" },
    { lengthNeeded: 100, skeinLength: 220, skeinWeight: 3.5, units: "unknown" },
  ]) {
    assert.equal(calculateMeasuredSkeinPurchase(input), null);
  }
});

test("partial-skein math rejects a remnant heavier than its full skein", () => {
  assert.deepEqual(
    calculatePartialSkeinLength({
      partialWeight: 40,
      fullWeight: 100,
      fullLength: 200,
      units: "metric",
    }),
    {
      remainingDisplayLength: 80,
      yards: 87.48906386701662,
      meters: 80,
      percentRemaining: 40,
    },
  );

  assert.equal(
    calculatePartialSkeinLength({
      partialWeight: 101,
      fullWeight: 100,
      fullLength: 200,
      units: "metric",
    }),
    null,
  );
  assert.equal(
    calculatePartialSkeinLength({
      partialWeight: 100,
      fullWeight: 100,
      fullLength: 200,
      units: "metric",
    })?.remainingDisplayLength,
    200,
  );
});

test("the UI publishes the bounded measured-swatch contract and accessible partial disclosure", () => {
  assert.match(tool, /from "@\/lib\/yarn-swatch-estimate\.mjs"/);
  assert.match(tool, /Measured-swatch estimate for flat rectangular fabric/);
  assert.match(tool, /same yarn, stitch pattern, tools, and tension/);
  assert.match(tool, /aria-expanded=\{showPartial\}/);
  assert.match(tool, /aria-controls="yarn-partial-panel"/);
  assert.match(tool, /Partial weight cannot be greater than the full-skein weight/);
  assert.doesNotMatch(tool, /ydsPerSqIn|gaugeRatio|STITCH_PATTERNS|Adjust for non-rectangular/);

  assert.match(page, /proportional estimate for flat rectangular fabric/i);
  assert.match(page, /does not model garments, shaping, seams, borders, or three-dimensional pieces/i);
  assert.doesNotMatch(page, /any knitting or crochet project|coverage factor|Cables consume|Brioche|Ravelry.*database/is);
});
