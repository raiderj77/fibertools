import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_EDGE_STITCHES_PER_SIDE,
  MAX_STITCH_COUNT,
  MAX_STITCH_LCM,
  MAX_STITCH_MULTIPLE,
  MAX_STITCH_PATTERNS,
  MAX_STITCH_RESULTS,
  deriveGaugeStitchRange,
  solveStitchPatternCounts,
} from "../src/lib/stitch-pattern-plan.mjs";

test("solves compatible modular offsets without scanning an LCM cycle", () => {
  const result = solveStitchPatternCounts({
    patterns: [
      { id: 1, name: "Four plus one", multiple: 4, plus: 1 },
      { id: 2, name: "Six plus three", multiple: 6, plus: 3 },
    ],
    minCount: 1,
    maxCount: 50,
    edgeStitchesPerSide: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(result.lcm, 12);
  assert.deepEqual(result.counts, [9, 21, 33, 45]);
  for (const count of result.counts) {
    assert.equal((count - 1) % 4, 0);
    assert.equal((count - 3) % 6, 0);
  }
});

test("reports incompatible plus offsets instead of brute-forcing", () => {
  const result = solveStitchPatternCounts({
    patterns: [
      { multiple: 2, plus: 0 },
      { multiple: 4, plus: 1 },
    ],
    minCount: 1,
    maxCount: 100,
    edgeStitchesPerSide: 0,
  });

  assert.deepEqual(
    { ok: result.ok, reason: result.reason },
    { ok: false, reason: "conflict" },
  );
});

test("preserves zero gauge tolerance exactly", () => {
  const result = deriveGaugeStitchRange({
    gaugeStitches: 18,
    gaugeSpan: 4,
    targetWidth: 50,
    tolerance: 0,
  });

  assert.deepEqual(result, {
    ok: true,
    stitchesPerInch: 4.5,
    minCount: 225,
    maxCount: 225,
    targetWidth: 50,
    tolerance: 0,
  });

  const noWholeCount = deriveGaugeStitchRange({
    gaugeStitches: 9,
    gaugeSpan: 2,
    targetWidth: 1,
    tolerance: 0,
  });
  assert.equal(noWholeCount.ok, false);
  assert.equal(noWholeCount.reason, "empty-range");
});

test("adds edge stitches once per side and solves against the pattern stitches", () => {
  const result = solveStitchPatternCounts({
    patterns: [{ multiple: 4, plus: 0 }],
    minCount: 20,
    maxCount: 30,
    edgeStitchesPerSide: 2,
  });

  assert.equal(result.ok, true);
  assert.equal(result.edgeStitchesPerSide, 2);
  assert.equal(result.totalEdgeStitches, 4);
  assert.deepEqual(result.counts, [20, 24, 28]);
  for (const count of result.counts) assert.equal((count - result.totalEdgeStitches) % 4, 0);
});

test("requires at least one full repeat instead of returning a plus-only count", () => {
  const result = solveStitchPatternCounts({
    patterns: [{ multiple: 4, plus: 1 }],
    minCount: 1,
    maxCount: 9,
    edgeStitchesPerSide: 0,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.counts, [5, 9]);
});

test("bounds pattern count, multiples, stitch ranges, edges, and unsafe values", () => {
  const base = {
    patterns: [{ multiple: 4, plus: 0 }],
    minCount: 1,
    maxCount: 100,
    edgeStitchesPerSide: 0,
  };

  for (const [patch, reason] of [
    [{ patterns: [] }, "no-patterns"],
    [{ patterns: Array.from({ length: MAX_STITCH_PATTERNS + 1 }, () => ({ multiple: 2, plus: 0 })) }, "too-many-patterns"],
    [{ patterns: [{ multiple: 0, plus: 0 }] }, "invalid-pattern"],
    [{ patterns: [{ multiple: 1.5, plus: 0 }] }, "invalid-pattern"],
    [{ patterns: [{ multiple: MAX_STITCH_MULTIPLE + 1, plus: 0 }] }, "invalid-pattern"],
    [{ patterns: [{ multiple: 2, plus: Number.MAX_SAFE_INTEGER }] }, "invalid-pattern"],
    [{ minCount: 0 }, "invalid-range"],
    [{ minCount: 101, maxCount: 100 }, "invalid-range"],
    [{ maxCount: MAX_STITCH_COUNT + 1 }, "invalid-range"],
    [{ edgeStitchesPerSide: -1 }, "invalid-edges"],
    [{ edgeStitchesPerSide: MAX_EDGE_STITCHES_PER_SIDE + 1 }, "invalid-edges"],
  ]) {
    const result = solveStitchPatternCounts({ ...base, ...patch });
    assert.equal(result.ok, false);
    assert.equal(result.reason, reason);
  }
});

test("rejects an impractically large LCM before enumerating results", () => {
  const result = solveStitchPatternCounts({
    patterns: [997, 991, 983, 977].map((multiple) => ({ multiple, plus: 0 })),
    minCount: 1,
    maxCount: MAX_STITCH_COUNT,
    edgeStitchesPerSide: 0,
  });

  assert.equal(result.ok, false);
  assert.equal(result.reason, "unsafe-lcm");
  assert.match(result.error, new RegExp(MAX_STITCH_LCM.toLocaleString().replaceAll(",", "[,]?")));
});

test("caps the number of returned matches to protect the browser", () => {
  const result = solveStitchPatternCounts({
    patterns: [{ multiple: 1, plus: 0 }],
    minCount: 1,
    maxCount: MAX_STITCH_COUNT,
    edgeStitchesPerSide: 0,
  });

  assert.equal(result.ok, true);
  assert.equal(result.counts.length, MAX_STITCH_RESULTS);
  assert.equal(result.totalMatches, MAX_STITCH_COUNT);
  assert.equal(result.truncated, true);
  assert.deepEqual(result.counts.slice(0, 3), [1, 2, 3]);
});

test("rejects unsafe gauge and width inputs", () => {
  for (const patch of [
    { gaugeStitches: 0 },
    { gaugeStitches: Infinity },
    { gaugeSpan: 0 },
    { targetWidth: 0 },
    { tolerance: -1 },
    { targetWidth: 10, tolerance: 11 },
    { gaugeStitches: 1000, gaugeSpan: 1, targetWidth: 11, tolerance: 0 },
  ]) {
    const result = deriveGaugeStitchRange({
      gaugeStitches: 18,
      gaugeSpan: 4,
      targetWidth: 50,
      tolerance: 2,
      ...patch,
    });
    assert.equal(result.ok, false);
  }
});

test("matches direct enumeration across deterministic small congruence pairs", () => {
  for (let firstMultiple = 1; firstMultiple <= 8; firstMultiple += 1) {
    for (let secondMultiple = 1; secondMultiple <= 8; secondMultiple += 1) {
      for (let firstPlus = 0; firstPlus < firstMultiple; firstPlus += 1) {
        for (let secondPlus = 0; secondPlus < secondMultiple; secondPlus += 1) {
          const patterns = [
            { multiple: firstMultiple, plus: firstPlus },
            { multiple: secondMultiple, plus: secondPlus },
          ];
          const minimumPatternCount = Math.max(
            1,
            firstPlus + firstMultiple,
            secondPlus + secondMultiple,
          );
          const expected = [];
          for (let totalCount = 1; totalCount <= 120; totalCount += 1) {
            const patternCount = totalCount - 2;
            if (
              patternCount >= minimumPatternCount
              && (patternCount - firstPlus) % firstMultiple === 0
              && (patternCount - secondPlus) % secondMultiple === 0
            ) {
              expected.push(totalCount);
            }
          }

          const result = solveStitchPatternCounts({
            patterns,
            minCount: 1,
            maxCount: 120,
            edgeStitchesPerSide: 1,
          });

          if (expected.length === 0) {
            assert.equal(result.ok, false);
            assert.equal(result.reason, "conflict");
          } else {
            assert.equal(result.ok, true);
            assert.deepEqual(result.counts, expected);
          }
        }
      }
    }
  }
});

test("matches direct enumeration across deterministic three-pattern combinations", () => {
  for (let firstMultiple = 1; firstMultiple <= 6; firstMultiple += 1) {
    for (let secondMultiple = 1; secondMultiple <= 6; secondMultiple += 1) {
      for (let thirdMultiple = 1; thirdMultiple <= 6; thirdMultiple += 1) {
        for (let firstPlus = 0; firstPlus < firstMultiple; firstPlus += 1) {
          for (let secondPlus = 0; secondPlus < secondMultiple; secondPlus += 1) {
            for (let thirdPlus = 0; thirdPlus < thirdMultiple; thirdPlus += 1) {
              const patterns = [
                { multiple: firstMultiple, plus: firstPlus },
                { multiple: secondMultiple, plus: secondPlus },
                { multiple: thirdMultiple, plus: thirdPlus },
              ];
              const minimumPatternCount = Math.max(
                1,
                ...patterns.map((pattern) => pattern.plus + pattern.multiple),
              );
              const expected = [];
              for (let count = minimumPatternCount; count <= 120; count += 1) {
                if (patterns.every((pattern) => (count - pattern.plus) % pattern.multiple === 0)) {
                  expected.push(count);
                }
              }

              const result = solveStitchPatternCounts({
                patterns,
                minCount: 1,
                maxCount: 120,
                edgeStitchesPerSide: 0,
              });

              if (expected.length === 0) {
                assert.equal(result.ok, false);
                assert.equal(result.reason, "conflict");
              } else {
                assert.equal(result.ok, true);
                assert.deepEqual(result.counts, expected);
              }
            }
          }
        }
      }
    }
  }
});

test("supports bounded plus offsets beyond the former brute-force adjustment", () => {
  const result = solveStitchPatternCounts({
    patterns: [
      { multiple: 2, plus: 5001 },
      { multiple: 3, plus: 5001 },
    ],
    minCount: 5000,
    maxCount: 5020,
    edgeStitchesPerSide: 0,
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.counts, [5007, 5013, 5019]);
});
