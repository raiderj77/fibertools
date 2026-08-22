import assert from "node:assert/strict";
import test from "node:test";
import { calculateGaugeResize } from "../src/lib/gauge-calculations.mjs";

test("resizes stitch and row counts to preserve the pattern dimensions", () => {
  const result = calculateGaugeResize({
    originalGaugeStitches: 18,
    originalGaugeRows: 24,
    actualGaugeStitches: 20,
    actualGaugeRows: 26,
    originalStitches: 120,
    originalRows: 160,
  });

  assert.equal(result.resizedStitches, 133);
  assert.equal(result.resizedRows, 173);
});

test("keeps the original count when an optional row gauge is incomplete", () => {
  const result = calculateGaugeResize({
    originalGaugeStitches: 20,
    originalGaugeRows: 0,
    actualGaugeStitches: 20,
    actualGaugeRows: 0,
    originalStitches: 100,
    originalRows: 80,
  });

  assert.equal(result.resizedStitches, 100);
  assert.equal(result.resizedRows, 80);
});
