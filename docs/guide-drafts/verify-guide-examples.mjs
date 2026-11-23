// Reproduces every worked-example number in the three draft guides in this
// folder by calling the live calculator functions. Run from the repo root:
//   node content/drafts/guides/verify-guide-examples.mjs
// Exits non-zero if any value differs from what the drafts state.
import assert from "node:assert/strict";
import { planStitchDistribution } from "../../../src/lib/stitch-distribution.mjs";
import {
  calculateCrossStitchSize,
  calculateCrossStitchFabricCut,
  calculateCrossStitchFlossPlan,
} from "../../../src/lib/cross-stitch-planning.mjs";

const show = (label, value) => console.log(label, JSON.stringify(value));

// ── Increase & Decrease guide ─────────────────────────────────────
const incRow = planStitchDistribution({ mode: "increase", shape: "row", current: 84, target: 96 });
show("inc row 84->96", incRow);
const incRound = planStitchDistribution({ mode: "increase", shape: "round", current: 84, target: 96 });
show("inc round 84->96", incRound);
const decRound = planStitchDistribution({ mode: "decrease", shape: "round", current: 84, target: 72 });
show("dec round 84->72", decRound);
const decRow = planStitchDistribution({ mode: "decrease", shape: "row", current: 84, target: 72 });
show("dec row 84->72", decRow);
const tooMany = planStitchDistribution({ mode: "increase", shape: "row", current: 40, target: 90 });
show("inc row 40->90", tooMany);
const tooFew = planStitchDistribution({ mode: "decrease", shape: "row", current: 40, target: 15 });
show("dec row 40->15", tooFew);

// ── Cross stitch guide ────────────────────────────────────────────
const dims = { widthStitches: 126, heightStitches: 98 };
for (const [fabricCount, stitchSpan] of [[11, 1], [14, 1], [16, 1], [18, 1], [28, 2], [28, 1]]) {
  show(`size ${fabricCount}-count over ${stitchSpan}`, calculateCrossStitchSize({ ...dims, fabricCount, stitchSpan }));
}
show("cut 14 over 1, 3 in margin", calculateCrossStitchFabricCut({ ...dims, fabricCount: 14, stitchSpan: 1, margin: 3, units: "imperial" }));
for (const workingStrands of [2, 3]) {
  show(`floss 5000 crosses, ${workingStrands} strands`, calculateCrossStitchFlossPlan({
    fullCrosses: 5000, fabricCount: 14, stitchSpan: 1, workingStrands,
    allowancePercent: 40, skeinLengthMeters: 8, skeinBundleStrands: 6,
  }));
}

// ── Yarn weight calculator guide (ranges copied from the tool component) ──
// The component keeps its table inside YarnWeightCalculatorTool.tsx, so the
// gauge ranges below mirror src/app/yarn-weight-calculator/YarnWeightCalculatorTool.tsx:22-119.
const GAUGE = [
  ["Lace", 33, 40], ["Fingering", 27, 32], ["Sport", 23, 26], ["DK", 21, 24],
  ["Worsted", 16, 20], ["Bulky", 12, 15], ["Super Bulky", 7, 11], ["Jumbo", 0, 6],
];
const WPI = [
  ["Lace", 30, Infinity], ["Fingering", 14, 30], ["Sport", 12, 18], ["DK", 11, 15],
  ["Worsted", 9, 12], ["Bulky", 6, 9], ["Super Bulky", 5, 6], ["Jumbo", 1, 4],
];
const match = (table, v) => table.filter(([, lo, hi]) => v >= lo && v <= hi).map(([n]) => n);
for (const g of [18, 20.5, 23]) show(`gauge ${g}`, match(GAUGE, g));
for (const w of [10]) show(`wpi ${w}`, match(WPI, w));

// ── Assertions matching the drafts' stated numbers ────────────────
assert.equal(incRow.status, "ready");
assert.deepEqual(incRow.segments, [5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 5, 6, 6]);
assert.equal(incRow.unchangedStitches, 72);
assert.equal(incRow.gapCount, 13);
assert.equal(incRow.knitInstructions,
  "Across the flat row, work K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; K5, KFB; K6, KFB; finish K6. (96 sts)");
assert.equal(incRound.knitInstructions, "From the round marker, work *K6, KFB* repeat 12 times. (96 sts)");
assert.equal(incRound.crochetInstructions, "From the round marker, work *SC 6, 2 SC in next st* repeat 12 times. (96 sts)");
assert.equal(decRound.knitInstructions, "From the round marker, work *K5, K2tog* repeat 12 times. (72 sts)");
assert.equal(decRound.crochetInstructions, "From the round marker, work *SC 5, SC2tog* repeat 12 times. (72 sts)");
assert.equal(tooMany.status, "unsupported");
assert.equal(tooFew.status, "unsupported");
const one = (v) => Number(v.toFixed(1));
const sizes = Object.fromEntries([[11, 1], [14, 1], [16, 1], [18, 1], [28, 2], [28, 1]].map(([c, s]) => {
  const r = calculateCrossStitchSize({ ...dims, fabricCount: c, stitchSpan: s });
  return [`${c}x${s}`, [one(r.widthInches), one(r.heightInches)]];
}));
assert.deepEqual(sizes, { "11x1": [11.5, 8.9], "14x1": [9, 7], "16x1": [7.9, 6.1], "18x1": [7, 5.4], "28x2": [9, 7], "28x1": [4.5, 3.5] });
const s14 = calculateCrossStitchSize({ ...dims, fabricCount: 14, stitchSpan: 1 });
assert.deepEqual([one(s14.widthCentimeters), one(s14.heightCentimeters)], [22.9, 17.8]);
const cut = calculateCrossStitchFabricCut({ ...dims, fabricCount: 14, stitchSpan: 1, margin: 3, units: "imperial" });
assert.deepEqual([cut.totalWidthInches, cut.totalHeightInches], [15, 13]);
const floss = (workingStrands) => calculateCrossStitchFlossPlan({
  fullCrosses: 5000, fabricCount: 14, stitchSpan: 1, workingStrands,
  allowancePercent: 40, skeinLengthMeters: 8, skeinBundleStrands: 6,
});
const f2 = floss(2);
assert.equal(f2.frontPathInchesPerCross.toFixed(3), "0.202");
assert.equal(one(f2.plannedWorkingPathMeters), 35.9);
assert.equal(one(f2.constituentStrandMeters), 71.8);
assert.equal(f2.skeinEquivalent.toFixed(2), "1.50");
assert.equal(f2.wholeSkeins, 2);
const f3 = floss(3);
assert.equal(one(f3.constituentStrandMeters), 107.8);
assert.equal(f3.skeinEquivalent.toFixed(2), "2.25");
assert.equal(f3.wholeSkeins, 3);
assert.deepEqual(match(GAUGE, 18), ["Worsted"]);
assert.deepEqual(match(GAUGE, 20.5), []);
assert.deepEqual(match(GAUGE, 23), ["Sport", "DK"]);
assert.deepEqual(match(WPI, 10), ["Worsted"]);
assert.equal((27 / 6) * 4, 18);
assert.equal((41 / 8) * 4, 20.5);
console.log("All draft example assertions passed.");
