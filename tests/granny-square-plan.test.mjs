import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  calculateGrannySquarePlan,
  COMMON_GRANNY_BLANKET_TARGETS,
  MAX_GRANNY_COLORS,
  MAX_GRANNY_DIMENSION_INCHES,
  MAX_GRANNY_YARDS_PER_SQUARE,
} from "../src/lib/granny-square-plan.mjs";

function plan(overrides = {}) {
  return calculateGrannySquarePlan({
    targetWidthInches: 50,
    targetHeightInches: 60,
    squareSizeInches: 6,
    numberOfColors: 1,
    yarnPerSquareYards: null,
    ...overrides,
  });
}

test("rounds each positive target axis up and keeps at least one square", () => {
  const typical = plan();
  const smallerThanOneSquare = plan({ targetWidthInches: 2, targetHeightInches: 3 });

  assert.equal(typical.status, "ready");
  assert.deepEqual(
    {
      squaresWide: typical.squaresWide,
      squaresTall: typical.squaresTall,
      totalSquares: typical.totalSquares,
      nominalGridWidthInches: typical.nominalGridWidthInches,
      nominalGridHeightInches: typical.nominalGridHeightInches,
    },
    {
      squaresWide: 9,
      squaresTall: 10,
      totalSquares: 90,
      nominalGridWidthInches: 54,
      nominalGridHeightInches: 60,
    },
  );
  assert.equal(smallerThanOneSquare.status, "ready");
  assert.equal(smallerThanOneSquare.squaresWide, 1);
  assert.equal(smallerThanOneSquare.squaresTall, 1);
});

test("counts every unique internal seam once", () => {
  const result = plan({ targetWidthInches: 18, targetHeightInches: 12 });

  assert.equal(result.status, "ready");
  assert.equal(result.squaresWide, 3);
  assert.equal(result.squaresTall, 2);
  assert.equal(result.internalSeamSegments, 7);
  assert.equal(result.internalSeamLengthInches, 42);

  const oneSquare = plan({ targetWidthInches: 4, targetHeightInches: 4 });
  assert.equal(oneSquare.status, "ready");
  assert.equal(oneSquare.internalSeamSegments, 0);
  assert.equal(oneSquare.internalSeamLengthInches, 0);
});

test("uses measured per-square yarn without inventing joining yarn", () => {
  const result = plan({
    targetWidthInches: 18,
    targetHeightInches: 12,
    numberOfColors: 4,
    yarnPerSquareYards: 10,
  });

  assert.equal(result.status, "ready");
  assert.equal(result.totalSquareYarnYards, 60);
  assert.equal(result.averageSquareYarnPerColorYards, 15);
  assert.equal("joiningYards" in result, false);
  assert.equal("grandTotal" in result, false);
});

test("rejects non-finite, non-positive, fractional-color, and unsafe inputs", () => {
  for (const overrides of [
    { targetWidthInches: Number.NaN },
    { targetHeightInches: Number.POSITIVE_INFINITY },
    { squareSizeInches: 0 },
    { targetWidthInches: -1 },
    { targetWidthInches: MAX_GRANNY_DIMENSION_INCHES + 1 },
    { numberOfColors: 1.5 },
    { numberOfColors: MAX_GRANNY_COLORS + 1 },
    { yarnPerSquareYards: 0 },
    { yarnPerSquareYards: MAX_GRANNY_YARDS_PER_SQUARE + 1 },
    { targetWidthInches: 10_000, targetHeightInches: 10_000, squareSizeInches: 0.01 },
  ]) {
    assert.equal(plan(overrides).status, "invalid");
  }
});

test("all example target rows use the same ceiling-based grid contract", () => {
  const expected = [
    ["Lovey", 2, 2, 4],
    ["Baby", 5, 6, 30],
    ["Stroller", 6, 8, 48],
    ["Throw", 9, 10, 90],
    ["Twin", 11, 15, 165],
    ["Full/Double", 14, 15, 210],
    ["Queen", 15, 17, 255],
    ["King", 18, 17, 306],
  ];

  assert.deepEqual(
    COMMON_GRANNY_BLANKET_TARGETS.map((target) => {
      const result = calculateGrannySquarePlan({
        targetWidthInches: target.widthInches,
        targetHeightInches: target.heightInches,
        squareSizeInches: 6,
        numberOfColors: 1,
        yarnPerSquareYards: null,
      });
      assert.equal(result.status, "ready");
      return [target.label, result.squaresWide, result.squaresTall, result.totalSquares];
    }),
    expected,
  );
});

test("the UI labels every input and keeps nominal dimensions separate from finished size", () => {
  const source = fs.readFileSync("src/app/granny-square-planner/GrannySquarePlannerTool.tsx", "utf8");
  const page = fs.readFileSync("src/app/granny-square-planner/page.tsx", "utf8");

  for (const id of [
    "granny-blanket-width",
    "granny-blanket-height",
    "granny-square-size",
    "granny-number-colors",
    "granny-yarn-per-square",
  ]) {
    assert.match(source, new RegExp(`htmlFor=["']${id}["']`));
    assert.match(source, new RegExp(`id=["']${id}["']`));
  }

  assert.match(source, /nominal grid span before joining effects/i);
  assert.match(source, /seam distance, not joining-yarn yardage/i);
  assert.match(source, /planning average per color if use is divided equally/i);
  assert.doesNotMatch(source, /joiningYards|grandTotal|finished size|actualWidth|actualHeight/i);
  assert.doesNotMatch(page, /exact count|yarn budget for the entire project|joining yarn estimates/i);
});
