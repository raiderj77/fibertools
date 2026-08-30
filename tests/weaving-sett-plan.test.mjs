import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_REED_SETT_EPI,
  MAX_WEAVING_WPI,
  SUPPORTED_REED_DENTS,
  calculateReedSleying,
  calculateWarpEstimate,
  estimateSettFromWpi,
} from "../src/lib/weaving-sett-plan.mjs";

test("uses the documented WPI and interlacement starting formula", () => {
  const plain = estimateSettFromWpi({
    wpi: 30,
    warpThreads: 2,
    interlacements: 2,
  });
  const twill = estimateSettFromWpi({
    wpi: 30,
    warpThreads: 4,
    interlacements: 2,
  });
  const satin = estimateSettFromWpi({
    wpi: 30,
    warpThreads: 5,
    interlacements: 2,
  });

  assert.equal(plain.ok, true);
  assert.equal(plain.factor, 1 / 2);
  assert.equal(plain.startingEpi, 15);

  assert.equal(twill.ok, true);
  assert.equal(twill.factor, 2 / 3);
  assert.equal(twill.startingEpi, 20);

  assert.equal(satin.ok, true);
  assert.equal(satin.factor, 5 / 7);
  assert.equal(satin.startingEpi, 21);
});

test("rejects nonfinite and unsupported sett-estimate inputs", () => {
  for (const input of [
    { wpi: 0, warpThreads: 2, interlacements: 2 },
    { wpi: Infinity, warpThreads: 2, interlacements: 2 },
    { wpi: MAX_WEAVING_WPI + 1, warpThreads: 2, interlacements: 2 },
    { wpi: 20, warpThreads: 0, interlacements: 2 },
    { wpi: 20, warpThreads: 4.5, interlacements: 2 },
    { wpi: 20, warpThreads: 4, interlacements: NaN },
  ]) {
    assert.equal(estimateSettFromWpi(input).ok, false);
  }
});

test("returns the exact published-style repeats for a 12-dent reed", () => {
  const cases = new Map([
    [4, [0, 0, 1]],
    [6, [0, 1]],
    [8, [0, 1, 1]],
    [10, [0, 1, 1, 1, 1, 1]],
    [12, [1]],
    [15, [1, 1, 1, 2]],
    [20, [1, 2, 2]],
    [24, [2]],
  ]);

  for (const [sett, expected] of cases) {
    const result = calculateReedSleying({ sett, reedDent: 12 });
    assert.equal(result.ok, true);
    assert.deepEqual(result.sequence, expected);
    assert.equal(result.actualEpi, sett);
  }
});

test("sleying repeats satisfy exact bounded invariants for every supported input", () => {
  const gcd = (first, second) => {
    let a = first;
    let b = second;
    while (b !== 0) [a, b] = [b, a % b];
    return a;
  };

  for (const reedDent of SUPPORTED_REED_DENTS) {
    for (let sett = 1; sett <= MAX_REED_SETT_EPI; sett += 1) {
      const result = calculateReedSleying({ sett, reedDent });
      assert.equal(result.ok, true);

      const divisor = gcd(sett, reedDent);
      assert.equal(result.periodDents, reedDent / divisor);
      assert.equal(result.periodEnds, sett / divisor);
      assert.equal(result.sequence.length, result.periodDents);
      assert.equal(
        result.sequence.reduce((sum, ends) => sum + ends, 0),
        result.periodEnds,
      );
      assert.equal(
        result.sequence.reduce((sum, ends) => sum + ends, 0) * reedDent,
        sett * result.periodDents,
      );

      const lower = Math.floor(sett / reedDent);
      const upper = Math.ceil(sett / reedDent);
      assert.equal(result.sequence.every((ends) => ends === lower || ends === upper), true);
      assert.ok(Math.max(...result.sequence) - Math.min(...result.sequence) <= 1);
    }
  }
});

test("rejects fractional, nonfinite, out-of-range, and unsupported reed inputs", () => {
  for (const input of [
    { sett: 0, reedDent: 12 },
    { sett: 8.5, reedDent: 12 },
    { sett: Infinity, reedDent: 12 },
    { sett: MAX_REED_SETT_EPI + 1, reedDent: 12 },
    { sett: 8, reedDent: 7 },
    { sett: 8, reedDent: NaN },
  ]) {
    assert.equal(calculateReedSleying(input).ok, false);
  }
});

test("keeps the warp estimate finite and rejects unsafe inputs", () => {
  const imperial = calculateWarpEstimate({
    projectLength: 72,
    projectWidth: 8,
    loomWaste: 27,
    sampling: 6,
    epi: 12,
    yardsPerUnit: 220,
    lengthAllowancePercent: 10,
    units: "imperial",
  });
  const metric = calculateWarpEstimate({
    projectLength: 72 * 2.54,
    projectWidth: 8 * 2.54,
    loomWaste: 27 * 2.54,
    sampling: 6 * 2.54,
    epi: 12,
    yardsPerUnit: 220,
    lengthAllowancePercent: 10,
    units: "metric",
  });

  assert.equal(imperial.ok, true);
  assert.deepEqual(
    {
      totalWarpLengthIn: imperial.totalWarpLengthIn,
      totalEnds: imperial.totalEnds,
      warpYards: imperial.warpYards,
      weftYards: imperial.weftYards,
      skeinsNeeded: imperial.skeinsNeeded,
    },
    {
      totalWarpLengthIn: 112.2,
      totalEnds: 96,
      warpYards: 299,
      weftYards: 211,
      skeinsNeeded: 3,
    },
  );
  assert.equal(metric.ok, true);
  assert.equal(metric.totalWarpLengthIn, imperial.totalWarpLengthIn);
  assert.equal(metric.totalEnds, imperial.totalEnds);
  assert.equal(metric.warpYards, imperial.warpYards);

  const base = {
    projectLength: 72,
    projectWidth: 8,
    loomWaste: 27,
    sampling: 6,
    epi: 12,
    yardsPerUnit: 220,
    lengthAllowancePercent: 10,
    units: "imperial",
  };
  for (const patch of [
    { projectLength: Infinity },
    { projectWidth: 0 },
    { loomWaste: -1 },
    { sampling: NaN },
    { epi: -1 },
    { yardsPerUnit: Infinity },
    { lengthAllowancePercent: 101 },
    { units: "yards" },
  ]) {
    assert.equal(calculateWarpEstimate({ ...base, ...patch }).ok, false);
  }

  assert.equal(calculateWarpEstimate({
    ...base,
    projectWidth: 0.01,
    epi: 0.01,
  }).ok, false);
});
