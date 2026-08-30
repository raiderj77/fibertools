import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const page = fs.readFileSync("src/app/sleeve-calculator/page.tsx", "utf8");

test("sleeve page describes the bounded paired-decrease model and exact example", () => {
  assert.match(page, /Sleeve Taper Arithmetic Reference/);
  assert.match(page, /rounds each result to\s+the nearest whole stitch count/);
  assert.match(page, /rounded stitch-count difference is odd/);
  assert.match(page, /more paired-decrease events than shaping rows/);
  assert.match(page, /at most one paired event per row/);
  assert.match(page, /Cuff length may be zero/);
  assert.match(page, /60 stitches at the upper arm and 40 stitches at the cuff/);
  assert.match(page, /80 shaping rows/);
  assert.match(page, /every 8 rows, 10 times/);
  assert.match(page, /does not design a sleeve or validate fit/);
});

test("sleeve page excludes superseded universal and contradictory claims", () => {
  assert.doesNotMatch(page, /rounds both results to even/i);
  assert.doesNotMatch(page, /hmm/i);
  assert.doesNotMatch(page, /visual difference.*invisible/i);
  assert.doesNotMatch(page, /keeps the underarm seam straight/i);
  assert.doesNotMatch(page, /fits more precisely/i);
  assert.doesNotMatch(page, /easier to knit/i);
  assert.doesNotMatch(page, /the stitch counts and row intervals are identical/i);
  assert.doesNotMatch(page, /the calculator uses 1 inch as the standard/i);
});
