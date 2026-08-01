import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateIncDec,
  calculateCrossStitchFloss,
  effectiveFabricCount,
  calculateRaglan,
  calculateSleeve,
  calculateSock,
  resizePatternCount,
} from "../src/lib/calculator-math.mjs";

test("increase and decrease instructions consume and produce exact stitch counts", () => {
  const knitIncrease = calculateIncDec({ mode: "increase", shape: "round", current: 84, target: 96 });
  assert.equal(knitIncrease.knitInstructions, "*K7, M1* repeat 12 times. (96 sts)");
  assert.equal(knitIncrease.crochetInstructions, "*SC 6, 2 SC in next st* repeat 12 times. (96 sts)");
  assert.equal(knitIncrease.knitConsumed, 84);
  assert.equal(knitIncrease.knitProduced, 96);

  const decrease = calculateIncDec({ mode: "decrease", shape: "round", current: 84, target: 72 });
  assert.equal(decrease.knitInstructions, "*K5, k2tog* repeat 12 times. (72 sts)");
  assert.equal(decrease.knitConsumed, 84);
  assert.equal(decrease.knitProduced, 72);

  const flat = calculateIncDec({ mode: "decrease", shape: "row", current: 10, target: 8 });
  assert.equal(flat.knitInstructions, "K2, k2tog, K2, k2tog, K2. (8 sts)");
  assert.match(calculateIncDec({ mode: "decrease", shape: "row", current: 10, target: 4 }).error, /multiple passes/);
});

test("raglan calculation starts from neck size and reaches the exact body split", () => {
  const result = calculateRaglan({
    finishedChest: 36,
    neckCircumference: 18,
    targetYokeDepth: 8,
    underarmEach: 7,
    gaugeStitches: 18,
    gaugeRows: 24,
    gaugeOver: 4,
  });
  assert.deepEqual(
    {
      castOn: result.castOn,
      front: result.frontSts,
      back: result.backSts,
      sleeve: result.sleeveStsEach,
      rounds: result.increaseRounds,
      rows: result.yokeRows,
      depth: result.yokeDepth,
      body: result.bodyAtSplit,
    },
    { castOn: 80, front: 25, back: 25, sleeve: 13, rounds: 24, rows: 48, depth: 8, body: 162 },
  );
});

test("gauge-derived counts choose the nearest valid stitch count without double rounding", () => {
  const raglan = calculateRaglan({
    finishedChest: 160.4 / 4.9,
    neckCircumference: 16,
    targetYokeDepth: 8,
    underarmEach: 7,
    gaugeStitches: 19.6,
    gaugeRows: 24,
    gaugeOver: 4,
  });
  assert.equal(raglan.castOn, 80, "78.4 neck stitches is closer to 80 than 76");
  assert.equal(raglan.chestSts, 162, "160.4 body stitches is closer to 162 than 158");

  const sleeve = calculateSleeve({
    upperArm: 13,
    wrist: 8,
    length: 18,
    cuffRibbing: 2,
    stitchesPerInch: 4.5,
    rowsPerInch: 6,
  });
  assert.equal(sleeve.upperArmSts, 58, "58.5 stitches uses the lower even count on a tie");

  const sock = calculateSock({
    footCircumference: 77 / 9,
    footLength: 10,
    gaugeStitches: 32,
    gaugeRows: 44,
  });
  assert.equal(sock.totalSts, 60, "61.6 stitches is closer to 60 than 64");
});

test("sleeve intervals are positive, balanced, and consume the shaping rows", () => {
  const even = calculateSleeve({ upperArm: 13, wrist: 8, length: 18, cuffRibbing: 2, stitchesPerInch: 4.5, rowsPerInch: 6 });
  assert.ok(even.schedule.every((row) => row % 2 === 1 && row <= even.shapingRows));
  assert.ok(even.intervals.every((value) => value >= 1));

  const uneven = calculateSleeve({ upperArm: 12, wrist: 8, length: 18, cuffRibbing: 2, stitchesPerInch: 5, rowsPerInch: 7 });
  assert.ok(uneven.schedule.every((row) => row % 2 === 1 && row <= uneven.shapingRows));
  const betweenEvents = uneven.schedule.slice(1).map((row, index) => row - uneven.schedule[index]);
  assert.ok(Math.max(...betweenEvents) - Math.min(...betweenEvents) <= 2);
  assert.ok(uneven.intervals.every((value) => value >= 1));
  assert.match(calculateSleeve({ upperArm: 20, wrist: 5, length: 4, cuffRibbing: 0, stitchesPerInch: 8, rowsPerInch: 4 }).error, /more paired decrease events/);
});

test("gauge resizing preserves physical size and over-two follows fabric policy", () => {
  assert.equal(resizePatternCount({ originalCount: 120, originalGauge: 18, actualGauge: 20 }), 133);
  assert.equal(resizePatternCount({ originalCount: 160, originalGauge: 24, actualGauge: 26 }), 173);
  assert.equal(effectiveFabricCount({ fabricCount: 14, overTwo: true, supportsOverTwo: false }), 14);
  assert.equal(effectiveFabricCount({ fabricCount: 32, overTwo: true, supportsOverTwo: true }), 16);
});

test("cross-stitch floss uses all six separable strands in an eight-meter skein", () => {
  assert.deepEqual(calculateCrossStitchFloss({ stitches: 500, strands: 2 }), {
    totalStrandInches: 1100,
    totalStrandMeters: 27.9,
    skeins: 0.58,
    skeinsRounded: 1,
  });
});

test("sock plan uses one exact toe model and never returns negative rows", () => {
  const result = calculateSock({ footCircumference: 8, footLength: 9.5, gaugeStitches: 32, gaugeRows: 44 });
  assert.deepEqual(
    {
      total: result.totalSts,
      toeEnd: result.toeEndSts,
      toeShape: result.toeShapeRounds,
      toePlain: result.toePlainRounds,
      toeRows: result.toeRows,
      topDownRows: result.footRowsBeforeToe,
      heelStart: result.heelStartTotalRows,
      toeUpPlain: result.plainRowsAfterToe,
    },
    { total: 56, toeEnd: 20, toeShape: 9, toePlain: 8, toeRows: 17, topDownRows: 74, heelStart: 91, toeUpPlain: 74 },
  );
  assert.equal(result.footRowsBeforeToe, result.plainRowsAfterToe);
  assert.ok(result.footRowsBeforeToe >= 0);
  assert.ok(result.plainRowsAfterToe >= 0);
  assert.match(calculateSock({ footCircumference: 0.5, footLength: 1, gaugeStitches: 4, gaugeRows: 4 }).error, /fewer than 8/);
});
