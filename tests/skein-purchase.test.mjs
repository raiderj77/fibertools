import assert from "node:assert/strict";
import test from "node:test";

import { calculateSkeinPurchase } from "../src/lib/skein-purchase.mjs";

test("uses imperial yarn-label length and weight in the purchase result", () => {
  assert.deepEqual(
    calculateSkeinPurchase({
      yardsNeeded: 4290,
      skeinLength: 220,
      skeinWeight: 3.5,
      units: "imperial",
    }),
    { skeins: 20, grams: 1984, ounces: 70, displayLength: 220 },
  );
});

test("uses metric yarn-label length and weight in the purchase result", () => {
  assert.deepEqual(
    calculateSkeinPurchase({
      yardsNeeded: 4290,
      skeinLength: 201,
      skeinWeight: 100,
      units: "metric",
    }),
    { skeins: 20, grams: 2000, ounces: 70.5, displayLength: 201 },
  );
});

test("rejects missing or non-positive yarn-label values", () => {
  assert.equal(
    calculateSkeinPurchase({
      yardsNeeded: 1000,
      skeinLength: 0,
      skeinWeight: 100,
      units: "metric",
    }),
    null,
  );
});
