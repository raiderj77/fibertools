import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  STRIPE_PATTERN_LIMITS,
  planStripePattern,
} from "../src/lib/stripe-pattern-plan.mjs";

const COLORS = [
  { id: "a", weight: "1" },
  { id: "b", weight: "3" },
  { id: "c", weight: "6" },
];

function build(overrides = {}) {
  return planStripePattern({
    mode: "random",
    colors: COLORS,
    totalStripes: "12",
    fixedRows: "4",
    minRows: "2",
    maxRows: "8",
    seed: 12345,
    ...overrides,
  });
}

function assertInvalid(result, field) {
  assert.equal(result.status, "invalid");
  assert.equal(result.field, field);
  assert.equal("stripes" in result, false);
}

test("sequence mode follows palette order, uses fixed rows, and ignores weights", () => {
  const result = build({
    mode: "sequence",
    colors: [{ id: "a", weight: "" }, { id: "b", weight: -1 }, { id: "c", weight: Infinity }],
    totalStripes: 5,
    fixedRows: 3,
    minRows: 99,
    maxRows: 1,
  });

  assert.equal(result.status, "ready");
  assert.equal(result.weightsApplied, false);
  assert.deepEqual(result.stripes, [
    { colorId: "a", rows: 3 },
    { colorId: "b", rows: 3 },
    { colorId: "c", rows: 3 },
    { colorId: "a", rows: 3 },
    { colorId: "b", rows: 3 },
  ]);
  assert.equal(result.totalRows, 15);
  assert.deepEqual(result.perColorRows, { a: 6, b: 6, c: 3 });
});

test("fixed and random modes are deterministic for the same seed and avoid adjacent colors", () => {
  for (const mode of ["fixed", "random"]) {
    const first = build({ mode, minRows: 9, maxRows: 4, fixedRows: 5 });
    const second = build({ mode, minRows: 9, maxRows: 4, fixedRows: 5 });
    if (mode === "random") {
      assertInvalid(first, "rowRange");
      assertInvalid(second, "rowRange");
      continue;
    }

    assert.equal(first.status, "ready");
    assert.deepEqual(first, second);
    assert.ok(first.stripes.every((stripe) => stripe.rows === 5));
    for (let index = 1; index < first.stripes.length; index += 1) {
      assert.notEqual(first.stripes[index].colorId, first.stripes[index - 1].colorId);
    }
  }

  const randomA = build();
  const randomB = build();
  assert.equal(randomA.status, "ready");
  assert.deepEqual(randomA, randomB);
  for (let index = 0; index < randomA.stripes.length; index += 1) {
    assert.ok(randomA.stripes[index].rows >= 2 && randomA.stripes[index].rows <= 8);
    if (index > 0) assert.notEqual(randomA.stripes[index].colorId, randomA.stripes[index - 1].colorId);
  }
});

test("seeded weighted modes have stable golden row plans", () => {
  const colors = [{ id: "a", weight: 1 }, { id: "b", weight: 1 }, { id: "c", weight: 2 }];
  const fixed = build({ mode: "fixed", colors, totalStripes: 6, fixedRows: 3, seed: 1 });
  const random = build({ mode: "random", colors, totalStripes: 6, minRows: 2, maxRows: 4, seed: 1 });

  assert.equal(fixed.status, "ready");
  assert.deepEqual(fixed.stripes, [
    { colorId: "a", rows: 3 },
    { colorId: "c", rows: 3 },
    { colorId: "b", rows: 3 },
    { colorId: "c", rows: 3 },
    { colorId: "a", rows: 3 },
    { colorId: "c", rows: 3 },
  ]);
  assert.equal(fixed.totalRows, 18);

  assert.equal(random.status, "ready");
  assert.deepEqual(random.stripes, [
    { colorId: "a", rows: 3 },
    { colorId: "c", rows: 4 },
    { colorId: "a", rows: 3 },
    { colorId: "c", rows: 3 },
    { colorId: "a", rows: 3 },
    { colorId: "b", rows: 3 },
  ]);
  assert.equal(random.totalRows, 19);
});

test("only the row fields used by the selected mode affect generation", () => {
  assert.equal(build({ mode: "random", fixedRows: "" }).status, "ready");
  assert.equal(build({ mode: "fixed", fixedRows: 4, minRows: 90, maxRows: 1 }).status, "ready");
  assert.equal(build({ mode: "sequence", fixedRows: 4, minRows: "", maxRows: "" }).status, "ready");
});

test("two randomized colors alternate after the seeded first pick because repeats are excluded", () => {
  const result = build({
    mode: "fixed",
    colors: [{ id: "a", weight: 1 }, { id: "b", weight: 100 }],
    totalStripes: 6,
    fixedRows: 2,
    seed: 1,
  });
  assert.equal(result.status, "ready");
  for (let index = 2; index < result.stripes.length; index += 1) {
    assert.equal(result.stripes[index].colorId, result.stripes[index - 2].colorId);
  }
});

test("cleared, fractional, nonfinite, reversed, and out-of-range row inputs fail before allocation", () => {
  for (const [overrides, field] of [
    [{ totalStripes: "" }, "totalStripes"],
    [{ totalStripes: "2.5" }, "totalStripes"],
    [{ totalStripes: Infinity }, "totalStripes"],
    [{ totalStripes: STRIPE_PATTERN_LIMITS.maximumStripes + 1 }, "totalStripes"],
    [{ minRows: "" }, "rowRange"],
    [{ minRows: 9, maxRows: 4 }, "rowRange"],
    [{ minRows: 1, maxRows: STRIPE_PATTERN_LIMITS.maximumRowsPerStripe + 1 }, "rowRange"],
    [{ mode: "fixed", fixedRows: "" }, "fixedRows"],
    [{ mode: "sequence", fixedRows: 1.2 }, "fixedRows"],
    [{ seed: Number.NaN }, "seed"],
  ]) {
    assertInvalid(build(overrides), field);
  }
});

test("randomized modes require bounded whole relative weights and valid color identities", () => {
  for (const colors of [
    [{ id: "a", weight: "" }, { id: "b", weight: 1 }],
    [{ id: "a", weight: 1.5 }, { id: "b", weight: 1 }],
    [{ id: "a", weight: STRIPE_PATTERN_LIMITS.maximumRelativeWeight + 1 }, { id: "b", weight: 1 }],
  ]) {
    assertInvalid(build({ colors }), "weights");
  }

  assertInvalid(build({ colors: [{ id: "a", weight: 1 }] }), "colors");
  assertInvalid(build({ colors: [{ id: "same", weight: 1 }, { id: "same", weight: 2 }] }), "colors");
});

test("totals exactly equal the generated bounded stripe rows", () => {
  const result = build({ totalStripes: STRIPE_PATTERN_LIMITS.maximumStripes });
  assert.equal(result.status, "ready");
  assert.equal(result.stripes.length, STRIPE_PATTERN_LIMITS.maximumStripes);
  assert.equal(result.totalRows, result.stripes.reduce((sum, stripe) => sum + stripe.rows, 0));
  assert.equal(
    Object.values(result.perColorRows).reduce((sum, rows) => sum + rows, 0),
    result.totalRows,
  );
});

test("the component delegates generation and public copy makes no yarn-use promise", () => {
  const tool = fs.readFileSync("src/app/stripe-generator/StripeGeneratorTool.tsx", "utf8");
  const page = fs.readFileSync("src/app/stripe-generator/page.tsx", "utf8");
  assert.match(tool, /planStripePattern/);
  assert.match(tool, /aria-pressed=\{stripeMode === mode\.id\}/);
  assert.doesNotMatch(tool, /parseInt\(/);
  assert.doesNotMatch(`${tool}\n${page}`, /per-color yardage|yardage breakdown|yardage estimates/i);
  assert.match(page, /does not estimate yarn use/);
});
