import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  calculateCrossStitchFabricCut,
  calculateCrossStitchFlossPlan,
  calculateCrossStitchSize,
  CROSS_STITCH_LIMITS,
  getEffectiveFabricCount,
} from "../src/lib/cross-stitch-planning.mjs";

const tool = readFileSync(
  new URL("../src/app/cross-stitch-calculator/CrossStitchCalculatorTool.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../src/app/cross-stitch-calculator/page.tsx", import.meta.url),
  "utf8",
);

test("uses one fabric-count and stitch-span rule in every mode", () => {
  assert.equal(getEffectiveFabricCount({ fabricCount: 14, stitchSpan: 1 }), 14);
  assert.equal(getEffectiveFabricCount({ fabricCount: 14, stitchSpan: 2 }), 7);
  assert.equal(getEffectiveFabricCount({ fabricCount: 28, stitchSpan: 2 }), 14);

  const aidaOverOne = calculateCrossStitchSize({
    widthStitches: 140,
    heightStitches: 200,
    fabricCount: 14,
    stitchSpan: 1,
  });
  const evenweaveOverTwo = calculateCrossStitchSize({
    widthStitches: 140,
    heightStitches: 200,
    fabricCount: 28,
    stitchSpan: 2,
  });
  const aidaOverTwo = calculateCrossStitchSize({
    widthStitches: 140,
    heightStitches: 200,
    fabricCount: 14,
    stitchSpan: 2,
  });

  assert.ok(aidaOverOne);
  assert.ok(evenweaveOverTwo);
  assert.ok(aidaOverTwo);
  assert.deepEqual(evenweaveOverTwo, aidaOverOne);
  assert.equal(aidaOverOne.widthInches, 10);
  assert.equal(aidaOverTwo.widthInches, 20);
  assert.equal(aidaOverTwo.heightInches, 200 / 7);
});

test("adds the same strictly positive margin to every side", () => {
  const imperial = calculateCrossStitchFabricCut({
    widthStitches: 140,
    heightStitches: 200,
    fabricCount: 14,
    stitchSpan: 1,
    margin: 3,
    units: "imperial",
  });
  const metric = calculateCrossStitchFabricCut({
    widthStitches: 140,
    heightStitches: 200,
    fabricCount: 14,
    stitchSpan: 1,
    margin: 7.62,
    units: "metric",
  });

  assert.ok(imperial);
  assert.ok(metric);
  assert.equal(imperial.totalWidthInches, 16);
  assert.equal(imperial.totalHeightInches, 200 / 14 + 6);
  assert.ok(Math.abs(metric.totalWidthInches - imperial.totalWidthInches) < 1e-12);
  assert.ok(Math.abs(metric.totalHeightInches - imperial.totalHeightInches) < 1e-12);

  for (const margin of [0, -1, "", " ", Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.equal(calculateCrossStitchFabricCut({
      widthStitches: 140,
      heightStitches: 200,
      fabricCount: 14,
      stitchSpan: 1,
      margin,
      units: "imperial",
    }), null, `margin ${margin}`);
  }
});

test("models front-cross geometry and entered floss assumptions without a hidden constant", () => {
  const base = calculateCrossStitchFlossPlan({
    fullCrosses: 100,
    fabricCount: 14,
    stitchSpan: 1,
    workingStrands: 2,
    allowancePercent: 0,
    skeinLengthMeters: 8,
    skeinBundleStrands: 6,
  });
  const overTwo = calculateCrossStitchFlossPlan({
    fullCrosses: 100,
    fabricCount: 14,
    stitchSpan: 2,
    workingStrands: 2,
    allowancePercent: 0,
    skeinLengthMeters: 8,
    skeinBundleStrands: 6,
  });
  const withAllowance = calculateCrossStitchFlossPlan({
    fullCrosses: 100,
    fabricCount: 14,
    stitchSpan: 1,
    workingStrands: 2,
    allowancePercent: 40,
    skeinLengthMeters: 8,
    skeinBundleStrands: 6,
  });

  assert.ok(base);
  assert.ok(overTwo);
  assert.ok(withAllowance);
  assert.ok(Math.abs(base.frontPathInchesPerCross - (2 * Math.SQRT2) / 14) < 1e-15);
  assert.ok(Math.abs(base.frontWorkingPathMeters - 100 * (2 * Math.SQRT2 / 14) * 0.0254) < 1e-15);
  assert.equal(base.availableConstituentStrandMetersPerSkein, 48);
  assert.ok(Math.abs(base.constituentStrandMeters - base.plannedWorkingPathMeters * 2) < 1e-15);
  assert.ok(Math.abs(base.skeinEquivalent - base.constituentStrandMeters / 48) < 1e-15);
  assert.equal(base.wholeSkeins, 1);
  assert.ok(Math.abs(overTwo.frontWorkingPathMeters - base.frontWorkingPathMeters * 2) < 1e-15);
  assert.ok(Math.abs(withAllowance.plannedWorkingPathMeters - base.plannedWorkingPathMeters * 1.4) < 1e-15);
});

test("rejects unsafe, nonfinite, fractional, and out-of-range inputs", () => {
  const validSize = {
    widthStitches: 140,
    heightStitches: 200,
    fabricCount: 14,
    stitchSpan: 1,
  };
  for (const [field, value] of [
    ["widthStitches", 0],
    ["heightStitches", -1],
    ["widthStitches", 1.5],
    ["heightStitches", CROSS_STITCH_LIMITS.patternStitches + 1],
    ["fabricCount", Number.POSITIVE_INFINITY],
    ["fabricCount", CROSS_STITCH_LIMITS.fabricCount + 1],
    ["stitchSpan", 3],
  ]) {
    assert.equal(calculateCrossStitchSize({ ...validSize, [field]: value }), null, `${field}: ${value}`);
  }

  const validFloss = {
    fullCrosses: 100,
    fabricCount: 14,
    stitchSpan: 1,
    workingStrands: 2,
    allowancePercent: 40,
    skeinLengthMeters: 8,
    skeinBundleStrands: 6,
  };
  for (const [field, value] of [
    ["fullCrosses", ""],
    ["fullCrosses", 1.5],
    ["fullCrosses", CROSS_STITCH_LIMITS.threadStitches + 1],
    ["workingStrands", 0],
    ["workingStrands", CROSS_STITCH_LIMITS.strands + 1],
    ["allowancePercent", -1],
    ["allowancePercent", CROSS_STITCH_LIMITS.allowancePercent + 1],
    ["skeinLengthMeters", 0],
    ["skeinLengthMeters", Number.NaN],
    ["skeinBundleStrands", 2.5],
  ]) {
    assert.equal(calculateCrossStitchFlossPlan({ ...validFloss, [field]: value }), null, `${field}: ${value}`);
  }
});

test("mode controls use native buttons with complete tab semantics", () => {
  assert.match(tool, /role="tablist" aria-label="Cross stitch calculation mode"/);
  assert.match(tool, /role="tab"/);
  assert.match(tool, /aria-selected=\{tab === key\}/);
  assert.match(tool, /aria-controls=\{`cross-stitch-panel-\$\{key\}`\}/);
  assert.match(tool, /role="tabpanel"/);
  assert.match(tool, /event\.key === "ArrowRight"/);
  assert.match(tool, /event\.key === "ArrowLeft"/);
  assert.match(tool, /type="radio"/);
  assert.match(tool, /checked=\{stitchSpan === 1\}/);
  assert.match(tool, /checked=\{stitchSpan === 2\}/);
});

test("every audited input has a native label association", () => {
  for (const id of [
    "cross-stitch-fabric-count",
    "cross-stitch-span-one",
    "cross-stitch-span-two",
    "cross-stitch-pattern-width",
    "cross-stitch-pattern-height",
    "cross-stitch-full-crosses",
    "cross-stitch-working-strands",
    "cross-stitch-allowance",
    "cross-stitch-skein-length",
    "cross-stitch-skein-strands",
    "cross-stitch-margin",
  ]) {
    assert.match(tool, new RegExp(`htmlFor="${id}"`), `${id} label`);
    assert.match(tool, new RegExp(`id="${id}"`), `${id} control`);
  }
});

test("copy exposes the planning assumptions and removes the false 472-inch exact model", () => {
  assert.match(tool, /two visible diagonals/);
  assert.match(tool, /The allowance is your planning input, not a measured or universal waste rate/);
  assert.match(page, /geometric planning model, not an exact consumption prediction/i);
  assert.match(page, /140 stitches on 14-count fabric over one[\s\S]*140 stitches on 28-count[\s\S]*both finish 10 inches/i);
  assert.doesNotMatch(tool, /FLOSS_SKEIN_INCHES|INCHES_PER_STITCH|472|Exact:/);
  assert.doesNotMatch(page, /exact dimensions and thread estimates|determines.*DMC thread amounts/i);
});
