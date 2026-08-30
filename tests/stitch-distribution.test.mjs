import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  MAX_DISTRIBUTION_STITCHES,
  planStitchDistribution,
} from "../src/lib/stitch-distribution.mjs";

function assertExactPlan(result, current, target) {
  assert.equal(result.status, "ready");
  assert.equal(result.consumedStitches, current);
  assert.equal(result.producedStitches, target);
  assert.equal(
    result.segments.length,
    Math.abs(target - current) + (result.shape === "row" ? 1 : 0),
  );
  assert.ok(result.maximumPlainSpacing - result.minimumPlainSpacing <= 1);
}

test("even increases consume 84 source stitches and produce 96", () => {
  const result = planStitchDistribution({ mode: "increase", shape: "row", current: 84, target: 96 });
  assertExactPlan(result, 84, 96);
  assert.deepEqual(new Set(result.segments), new Set([5, 6]));
  assert.match(result.knitInstructions, /finish K6\. \(96 sts\)$/);
  assert.match(result.crochetInstructions, /finish SC 6\. \(96 sts\)$/);
});

test("even decreases account for the two stitches consumed by every decrease", () => {
  const result = planStitchDistribution({ mode: "decrease", shape: "round", current: 84, target: 72 });
  assertExactPlan(result, 84, 72);
  assert.deepEqual(new Set(result.segments), new Set([5]));
  assert.equal(result.knitInstructions, "From the round marker, work *K5, K2tog* repeat 12 times. (72 sts)");
  assert.equal(result.crochetInstructions, "From the round marker, work *SC 5, SC2tog* repeat 12 times. (72 sts)");
});

test("remainder spacing stays balanced while exact source and target counts are preserved", () => {
  const increase = planStitchDistribution({ mode: "increase", shape: "row", current: 10, target: 13 });
  assertExactPlan(increase, 10, 13);
  assert.deepEqual(increase.segments, [1, 2, 2, 2]);

  const decrease = planStitchDistribution({ mode: "decrease", shape: "row", current: 10, target: 7 });
  assertExactPlan(decrease, 10, 7);
  assert.deepEqual(decrease.segments, [1, 1, 1, 1]);
});

test("a single flat-row change is centered between two edge gaps", () => {
  const result = planStitchDistribution({ mode: "increase", shape: "row", current: 100, target: 101 });
  assertExactPlan(result, 100, 101);
  assert.deepEqual(result.segments, [49, 50]);
  assert.equal(result.knitInstructions, "Across the flat row, work K49, KFB; finish K50. (101 sts)");
});

test("mode mismatches and impossible one-pass changes fail closed", () => {
  assert.equal(planStitchDistribution({ mode: "increase", shape: "row", current: 20, target: 10 }).status, "invalid");
  assert.equal(planStitchDistribution({ mode: "decrease", shape: "row", current: 10, target: 20 }).status, "invalid");
  assert.equal(planStitchDistribution({ mode: "increase", shape: "row", current: 10, target: 21 }).status, "unsupported");
  assert.equal(planStitchDistribution({ mode: "decrease", shape: "row", current: 10, target: 4 }).status, "unsupported");
});

test("only finite bounded safe whole-number inputs can allocate a distribution", () => {
  for (const [current, target] of [
    [0, 1],
    [1.5, 2],
    [1, Number.POSITIVE_INFINITY],
    [MAX_DISTRIBUTION_STITCHES + 1, MAX_DISTRIBUTION_STITCHES],
  ]) {
    const result = planStitchDistribution({ mode: "increase", shape: "round", current, target });
    assert.equal(result.status, "invalid");
    assert.equal("segments" in result, false);
  }

  const boundary = planStitchDistribution({
    mode: "decrease",
    shape: "round",
    current: MAX_DISTRIBUTION_STITCHES,
    target: MAX_DISTRIBUTION_STITCHES / 2,
  });
  assertExactPlan(boundary, MAX_DISTRIBUTION_STITCHES, MAX_DISTRIBUTION_STITCHES / 2);
});

test("all supported counts through 64 conserve the starting and target counts", () => {
  for (let current = 1; current <= 64; current += 1) {
    for (let target = 1; target <= 64; target += 1) {
      if (current === target) continue;
      const mode = target > current ? "increase" : "decrease";
      const result = planStitchDistribution({ mode, shape: "row", current, target });
      const supported = mode === "increase" ? target <= current * 2 : target >= Math.ceil(current / 2);

      if (!supported) {
        assert.equal(result.status, "unsupported", `${current} -> ${target}`);
        continue;
      }

      assertExactPlan(result, current, target);
      assert.equal(
        result.segments.reduce((sum, count) => sum + count, 0) + result.changes * result.changeConsumes,
        current,
      );
      assert.equal(
        result.segments.reduce((sum, count) => sum + count, 0) + result.changes * result.changeProduces,
        target,
      );
    }
  }
});

test("the UI uses selected mode semantics and the pure distribution helper", () => {
  const source = fs.readFileSync("src/app/increase-decrease-calculator/IncDecCalculatorTool.tsx", "utf8");
  assert.match(source, /planStitchDistribution/);
  assert.match(source, /aria-pressed=\{mode === "increase"\}/);
  assert.match(source, /aria-pressed=\{shape === "row"\}/);
  assert.doesNotMatch(source, /const spacing = Math\.floor/);
});

test("public distribution copy limits guarantees to stitch-count arithmetic", () => {
  const tool = fs.readFileSync("src/app/increase-decrease-calculator/IncDecCalculatorTool.tsx", "utf8");
  const page = fs.readFileSync("src/app/increase-decrease-calculator/page.tsx", "utf8");
  assert.match(page, /does not guarantee invisible shaping, a flat edge, or a particular fabric appearance/);
  assert.doesNotMatch(`${tool}\n${page}`, /most invisible|prevents holes|edges stay straight/i);
});
