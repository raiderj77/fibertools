import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import * as blanket from "../src/lib/blanket-gauge.mjs";

import {
  calculateBlanketGaugeCounts,
  convertBlanketMeasurementInput,
  roundBlanketStitchesToMultiple,
} from "../src/lib/blanket-gauge.mjs";

const throwDimensions = { widthIn: 50, lengthIn: 60 };

test("repeat alternatives preserve staged baseline and use unrounded target", () => {
  for (const [raw,nearest,above] of [[160,158,164],[164,164,164],[162,164,164],[163,164,164],[164.2,164,170],[161,164,164],[160.8,164,164],[2,8,8]]) {
    const result=blanket.planBlanketStitchWidths({raw,stitchesPerInch:4,nearest:roundBlanketStitchesToMultiple(Math.round(raw),6,2),multiple:6,extra:2});
    assert.equal(result.nearest,nearest);assert.equal(result.atOrAbove,above);
    assert.equal(result.nearestWidthIn,nearest/4);assert.equal(result.aboveWidthIn,above/4);
    assert.equal(result.belowTarget,nearest<raw);
  }
});

test("alternative bounds, precision, offsets and omitted constraint", () => {
  const plan=(raw,multiple=6,extra=2)=>blanket.planBlanketStitchWidths({raw,stitchesPerInch:4,nearest:roundBlanketStitchesToMultiple(Math.round(raw),multiple,extra),multiple,extra});
  assert.equal(plan(164+Number.EPSILON*164).atOrAbove,164);
  assert.equal(plan(164.00000001).atOrAbove,170);
  assert.equal(plan(163.99999999).atOrAbove,164);
  assert.equal(plan(160,6,0).atOrAbove,162);
  assert.equal(plan(160,6,8).atOrAbove,164);
  assert.equal(plan(999999,6,2).atOrAbove,null);
  assert.equal(plan(160,0,0).atOrAbove,null);
  for(const raw of [0,-1,NaN,Infinity])assert.equal(plan(raw),null);
});

test("declines unsafe and zero-output blanket counts", () => {
  for (const gaugeOver of [1e-300, 1e300]) {
    assert.equal(calculateBlanketGaugeCounts({ ...throwDimensions, gaugeStitches: 18,
      gaugeRows: 24, gaugeOver, units: "imperial" }), null);
  }
});

test("repeat count must include at least one complete repeat and supported whole extras", () => {
  assert.equal(roundBlanketStitchesToMultiple(2, 6, 5), 11);
  assert.equal(roundBlanketStitchesToMultiple(225, 2.5, 0), null);
  assert.equal(roundBlanketStitchesToMultiple(225, 0, 2), null);
});

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
  assert.match(
    component,
    /<UnitToggle value=\{units\} onChange=\{handleUnitsChange\} persist=\{!embedded\} \/>/,
  );
  assert.match(component, /roundBlanketStitchesToMultiple\(stitchesNeeded, mult, extra\)/);
});

test("sub-display deficits remain explained without changing raw ceiling", () => {
  const target=41.0000000001;
  const plan=blanket.planBlanketStitchWidths({raw:target*4,stitchesPerInch:4,nearest:164,multiple:6,extra:2});
  assert.equal(plan.belowTarget,true);assert.equal(plan.atOrAbove,170);
  assert.equal(blanket.formatBlanketDimension(target,'imperial'),'41');
  assert.equal(blanket.formatBlanketShortfall(target-plan.nearestWidthIn,'imperial'),'less than 0.0001');
  assert.equal(blanket.formatBlanketShortfall(target-plan.nearestWidthIn,'metric'),'less than 0.0001');
  assert.equal(blanket.formatBlanketShortfall(0.5,'imperial'),'approximately 0.5');
  assert.equal(blanket.formatBlanketShortfall(0.5,'metric'),'approximately 1.27');
});
