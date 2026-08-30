import assert from "node:assert/strict";
import test from "node:test";
import {
  GAUGE_LIMITS,
  calculateGaugeDimensionPlan,
  calculateGaugeResize,
  calculateSwatchGauge,
  convertGaugeMeasurementInput,
  convertStandardGaugeInput,
  getGaugeDisplayLimits,
  roundGaugeCountToRepeat,
} from "../src/lib/gauge-calculations.mjs";

test("calculates swatch gauge over the selected standard span", () => {
  const result = calculateSwatchGauge({ width: 4, height: 4, stitches: 18, rows: 24, standardSpan: 4 });
  assert.equal(result.ok, true);
  assert.equal(result.stitchesPerUnit, 4.5);
  assert.equal(result.rowsPerStandard, 24);
});

test("resizes complete stitch and row groups and preserves repeat compatibility", () => {
  const result = calculateGaugeResize({
    originalGaugeStitches: 18,
    originalGaugeRows: 24,
    actualGaugeStitches: 20,
    actualGaugeRows: 26,
    originalStitches: 120,
    originalRows: 160,
    stitchMultiple: 6,
    multipleExtra: 1,
  });

  assert.equal(result.ok, true);
  assert.equal(result.unadjustedStitches, 133);
  assert.equal(result.resizedStitches, 133);
  assert.equal(result.resizedRows, 173);
});

test("chooses the repeat nearest the exact proportional count", () => {
  const result = calculateGaugeResize({
    originalGaugeStitches: 100,
    originalGaugeRows: null,
    actualGaugeStitches: 9.6,
    actualGaugeRows: null,
    originalStitches: 100,
    originalRows: null,
    stitchMultiple: 4,
  });
  assert.equal(result.ok, true);
  assert.equal(result.proportionalStitches, 9.6);
  assert.equal(result.unadjustedStitches, 10);
  assert.equal(result.resizedStitches, 8);
});

test("rejects a partially entered optional row resize group", () => {
  const result = calculateGaugeResize({
    originalGaugeStitches: 20,
    originalGaugeRows: null,
    actualGaugeStitches: 20,
    actualGaugeRows: null,
    originalStitches: 100,
    originalRows: 80,
  });
  assert.equal(result.ok, false);
  assert.match(result.error, /rows/i);
});

test("rejects a proportional row result that rounds to zero", () => {
  const result = calculateGaugeResize({
    originalGaugeStitches: null,
    originalGaugeRows: 1_000,
    actualGaugeStitches: null,
    actualGaugeRows: 0.01,
    originalStitches: null,
    originalRows: 1,
  });
  assert.equal(result.ok, false);
  assert.match(result.error, /outside the supported range/i);
});

test("validates and bounds optional original dimensions in the resize helper", () => {
  const base = {
    originalGaugeStitches: 20,
    originalGaugeRows: null,
    actualGaugeStitches: 22,
    actualGaugeRows: null,
    originalStitches: 100,
    originalRows: null,
  };
  assert.equal(calculateGaugeResize({ ...base, originalWidth: 0 }).ok, false);
  assert.equal(calculateGaugeResize({ ...base, originalWidth: GAUGE_LIMITS.maximumMeasurement + 1 }).ok, false);
  assert.equal(calculateGaugeResize({ ...base, originalHeight: 10 }).ok, false);

  const valid = calculateGaugeResize({ ...base, originalWidth: 10 });
  assert.equal(valid.ok, true);
  assert.equal(valid.originalWidth, 10);
  assert.ok(valid.modeledWidth > 9 && valid.modeledWidth < 10);
});

test("rejects zero and fractional whole-count fields instead of treating them as blank", () => {
  const base = {
    originalGaugeStitches: 20,
    originalGaugeRows: null,
    actualGaugeStitches: 22,
    actualGaugeRows: null,
    originalStitches: 100,
    originalRows: null,
  };
  assert.equal(calculateGaugeResize({ ...base, originalStitches: 0 }).ok, false);
  assert.equal(calculateGaugeResize({ ...base, originalStitches: 100.5 }).ok, false);
  assert.equal(calculateGaugeResize({ ...base, originalGaugeRows: 0 }).ok, false);
});

test("rejects repeat inputs when only a row group is present", () => {
  const rowsOnly = {
    originalGaugeStitches: null,
    originalGaugeRows: 24,
    actualGaugeStitches: null,
    actualGaugeRows: 26,
    originalStitches: null,
    originalRows: 160,
  };
  assert.equal(calculateGaugeResize({ ...rowsOnly, stitchMultiple: -1 }).ok, false);
  assert.equal(calculateGaugeResize({ ...rowsOnly, multipleExtra: 0.5 }).ok, false);
  assert.equal(calculateGaugeResize({ ...rowsOnly, stitchMultiple: 6 }).ok, false);
});

test("rounds target-width plans upward so the modeled width does not undershoot", () => {
  const result = calculateGaugeDimensionPlan({
    gaugeStitches: 20,
    gaugeRows: 28,
    gaugeSpan: 4,
    targetWidth: 10.1,
    targetHeight: 12,
    stitchMultiple: 6,
    multipleExtra: 1,
    edgeStitches: 2,
    turningChains: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(result.stitches, 55);
  assert.equal(result.totalCastOn, 57);
  assert.equal(result.rows, 84);
  assert.ok(result.modeledWidth >= 10.1);
  assert.equal((result.stitches - 1) % 6, 0);
});

test("requires at least one full repeat and complete optional groups", () => {
  const base = {
    gaugeStitches: 20,
    gaugeRows: null,
    gaugeSpan: 4,
    targetWidth: 10,
    targetHeight: null,
  };
  assert.equal(calculateGaugeDimensionPlan({ ...base, targetHeight: 12 }).ok, false);
  assert.equal(calculateGaugeDimensionPlan({ ...base, multipleExtra: 2 }).ok, false);
  assert.equal(roundGaugeCountToRepeat({ count: 1, multiple: 6, extra: 1 }).count, 7);
  assert.equal(roundGaugeCountToRepeat({ count: 50, multiple: 4.5, extra: 0 }).ok, false);
});

test("rejects nonfinite and excessive values", () => {
  assert.equal(calculateSwatchGauge({ width: Infinity, height: 4, stitches: 18, rows: 24, standardSpan: 4 }).ok, false);
  assert.equal(calculateGaugeDimensionPlan({
    gaugeStitches: GAUGE_LIMITS.maximumGaugeCount + 1,
    gaugeRows: null,
    gaugeSpan: 4,
    targetWidth: 10,
    targetHeight: null,
  }).ok, false);
});

test("converts length fields and standardized gauge counts when units change", () => {
  assert.equal(convertGaugeMeasurementInput("4", "imperial", "metric"), "10.16");
  assert.equal(convertGaugeMeasurementInput("10.16", "metric", "imperial"), "4");
  assert.equal(convertStandardGaugeInput("20", "imperial", "metric"), "19.685");
  assert.equal(convertStandardGaugeInput("19.685", "metric", "imperial"), "20");
  assert.equal(convertGaugeMeasurementInput("", "imperial", "metric"), "");
});

test("uses unit-aware display bounds so supported edge values survive conversion", () => {
  const imperial = getGaugeDisplayLimits("imperial");
  const metric = getGaugeDisplayLimits("metric");
  assert.equal(imperial.maximumMeasurement, 1_000);
  assert.equal(metric.maximumMeasurement, 2_540);
  assert.equal(convertGaugeMeasurementInput("1000", "imperial", "metric"), "2540");
  assert.equal(convertGaugeMeasurementInput("2540", "metric", "imperial"), "1000");
  assert.equal(convertStandardGaugeInput("1000", "imperial", "metric"), String(metric.maximumStandardGaugeCount));
  assert.equal(convertStandardGaugeInput(String(metric.maximumStandardGaugeCount), "metric", "imperial"), "1000");
  assert.equal(calculateSwatchGauge({
    width: 2_540,
    height: 2_540,
    stitches: 1_000,
    rows: 1_000,
    standardSpan: 10,
    unitSystem: "metric",
  }).ok, true);
  assert.equal(calculateGaugeResize({
    originalGaugeStitches: metric.maximumStandardGaugeCount,
    originalGaugeRows: null,
    actualGaugeStitches: metric.maximumStandardGaugeCount,
    actualGaugeRows: null,
    originalStitches: 100,
    originalRows: null,
    unitSystem: "metric",
  }).ok, true);
});
