import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  calculateBlanketGaugeCounts,
  convertBlanketMeasurementInput,
  roundBlanketStitchesToMultiple,
} from "../src/lib/blanket-gauge.mjs";

const throwDimensions = { widthIn: 50, lengthIn: 60 };

test("calculates imperial blanket counts from a gauge measured over inches", () => {
  assert.deepEqual(
    calculateBlanketGaugeCounts({
      ...throwDimensions,
      gaugeStitches: 18,
      gaugeRows: 24,
      gaugeOver: 4,
      units: "imperial",
    }),
    { stitches: 225, rows: 360 },
  );
});

test("converts a metric gauge span before calculating blanket counts", () => {
  assert.deepEqual(
    calculateBlanketGaugeCounts({
      ...throwDimensions,
      gaugeStitches: 18,
      gaugeRows: 24,
      gaugeOver: 10,
      units: "metric",
    }),
    { stitches: 229, rows: 366 },
  );
});

test("equivalent imperial and metric gauges produce identical counts", () => {
  const imperial = calculateBlanketGaugeCounts({
    ...throwDimensions,
    gaugeStitches: 18,
    gaugeRows: 24,
    gaugeOver: 4,
    units: "imperial",
  });
  const metric = calculateBlanketGaugeCounts({
    ...throwDimensions,
    gaugeStitches: 18,
    gaugeRows: 24,
    gaugeOver: 10.16,
    units: "metric",
  });

  assert.deepEqual(metric, imperial);
});

test("keeps the prefilled gauge equivalent when switching to metric", () => {
  const gaugeOver = convertBlanketMeasurementInput("4", 2.54);

  assert.equal(gaugeOver, "10.16");
  assert.deepEqual(
    calculateBlanketGaugeCounts({
      ...throwDimensions,
      gaugeStitches: 18,
      gaugeRows: 24,
      gaugeOver: Number(gaugeOver),
      units: "metric",
    }),
    { stitches: 225, rows: 360 },
  );
});

test("rejects incomplete, non-positive, or non-finite gauge inputs", () => {
  const valid = {
    ...throwDimensions,
    gaugeStitches: 18,
    gaugeRows: 24,
    gaugeOver: 4,
    units: "imperial",
  };

  for (const invalid of [
    { ...valid, gaugeRows: 0 },
    { ...valid, gaugeOver: 0 },
    { ...valid, gaugeOver: Number.NaN },
    { ...valid, widthIn: Number.POSITIVE_INFINITY },
  ]) {
    assert.equal(calculateBlanketGaugeCounts(invalid), null);
  }
});

test("preserves nearest stitch-multiple plus extra rounding", () => {
  assert.equal(roundBlanketStitchesToMultiple(225, 6, 1), 223);
  assert.equal(roundBlanketStitchesToMultiple(225, 0, 0), 225);
});

test("wires the tested gauge calculation into the blanket calculator", () => {
  const component = readFileSync(
    new URL("../src/app/blanket-calculator/BlanketCalculatorTool.tsx", import.meta.url),
    "utf8",
  );

  assert.match(component, /from "@\/lib\/blanket-gauge\.mjs"/);
  assert.match(component, /calculateBlanketGaugeCounts\(\{/);
  assert.match(component, /setGaugeOver\(\(value\) => convertBlanketMeasurementInput\(value, dimensionFactor\)\)/);
  assert.match(component, /<UnitToggle value=\{units\} onChange=\{handleUnitsChange\} \/>/);
  assert.match(component, /roundBlanketStitchesToMultiple\(stitchesNeeded, mult, extra\)/);
});
