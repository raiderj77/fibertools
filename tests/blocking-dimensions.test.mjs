import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { calculateBlockingDimensions } from "../src/lib/blocking-dimensions.mjs";

test("calculates signed width and length changes independently", () => {
  const result = calculateBlockingDimensions({
    currentWidth: 48,
    targetWidth: 50,
    currentLength: 60,
    targetLength: 57,
  });

  assert.equal(result.status, "ready");
  assert.equal(result.changes.length, 2);
  assert.equal(result.changes[0].axis, "width");
  assert.ok(Math.abs(result.changes[0].percentChange - 4.166666666666667) < 1e-12);
  assert.equal(result.changes[0].direction, "increase");
  assert.equal(result.changes[1].percentChange, -5);
  assert.equal(result.changes[1].direction, "decrease");
});

test("supports a width-only or length-only comparison", () => {
  const width = calculateBlockingDimensions({
    currentWidth: 40,
    targetWidth: 40,
    currentLength: null,
    targetLength: null,
  });
  const length = calculateBlockingDimensions({
    currentWidth: null,
    targetWidth: null,
    currentLength: 20,
    targetLength: 22,
  });

  assert.equal(width.status, "ready");
  assert.deepEqual(width.changes.map(({ axis, direction }) => ({ axis, direction })), [
    { axis: "width", direction: "no change" },
  ]);
  assert.equal(length.status, "ready");
  assert.equal(length.changes[0].percentChange, 10);
});

test("rejects blank, partial, non-finite, zero, and negative pairs", () => {
  for (const inputs of [
    { currentWidth: null, targetWidth: null, currentLength: null, targetLength: null },
    { currentWidth: 48, targetWidth: null, currentLength: null, targetLength: null },
    { currentWidth: Number.NaN, targetWidth: 50, currentLength: null, targetLength: null },
    { currentWidth: 0, targetWidth: 50, currentLength: null, targetLength: null },
    { currentWidth: -48, targetWidth: 50, currentLength: null, targetLength: null },
  ]) {
    assert.equal(calculateBlockingDimensions(inputs).status, "invalid");
  }
});

test("the UI reports arithmetic without a fiber lookup or feasibility verdict", () => {
  const source = fs.readFileSync("src/app/blocking-calculator/BlockingCalculatorTool.tsx", "utf8");

  assert.match(source, /calculateBlockingDimensions/);
  assert.match(source, /This is arithmetic, not a prediction/i);
  assert.match(source, /product and appliance instructions permit it/i);
  assert.doesNotMatch(source, /getFeasibility|FIBERS|Recommended method|Stretch Analysis|Fiber Blocking Reference/);
});
