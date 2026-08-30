import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { buildC2cPlan, C2C_LIMITS } from "../src/lib/c2c-plan.mjs";

const valid = {
  swatchBlocksWide: 5,
  swatchBlocksTall: 5,
  swatchWidth: 4,
  swatchHeight: 5,
  targetWidth: 50,
  targetHeight: 60,
  yarnPerBlock: 24,
  allowancePercent: 10,
};

test("rounds each axis to at least one block and never returns a negative diagonal count", () => {
  const tiny = buildC2cPlan({ ...valid, targetWidth: 0.1, targetHeight: 0.1, yarnPerBlock: "" });
  assert.equal(tiny.ok, true);
  assert.equal(tiny.blocksWide, 1);
  assert.equal(tiny.blocksTall, 1);
  assert.equal(tiny.totalBlocks, 1);
  assert.equal(tiny.totalDiagonalRows, 1);
  assert.equal(tiny.baseYards, null);
});

test("keeps axis-specific swatch measurements and explicit yarn allowance separate", () => {
  const result = buildC2cPlan(valid);
  assert.equal(result.ok, true);
  assert.equal(result.blockWidth, 0.8);
  assert.equal(result.blockHeight, 1);
  assert.equal(result.blocksWide, 63);
  assert.equal(result.blocksTall, 60);
  assert.equal(result.totalDiagonalRows, 122);
  assert.equal(result.baseYards, 2520);
  assert.equal(result.plannedYards, 2772);
  assert.equal(result.allowancePercent, 10);
});

test("rejects blanks, fractions where whole blocks are required, and bounded overflow before planning", () => {
  for (const input of [
    { ...valid, swatchBlocksWide: "" },
    { ...valid, swatchBlocksWide: 1.5 },
    { ...valid, swatchWidth: 0 },
    { ...valid, targetHeight: Number.POSITIVE_INFINITY },
    { ...valid, yarnPerBlock: 0 },
    { ...valid, allowancePercent: C2C_LIMITS.maxAllowancePercent + 1 },
    { ...valid, swatchWidth: 0.0001, targetWidth: C2C_LIMITS.maxDimension },
  ]) {
    const result = buildC2cPlan(input);
    assert.equal(result.ok, false, JSON.stringify(input));
    assert.equal("totalBlocks" in result, false);
  }
});

test("the component delegates arithmetic to the bounded helper and labels every input", () => {
  const source = fs.readFileSync("src/app/c2c-calculator/C2cCalculatorTool.tsx", "utf8");
  assert.match(source, /buildC2cPlan/);
  assert.doesNotMatch(source, /blocksWide = Math\.round|totalDiagonalRows = blocksWide/);
  for (const id of [
    "c2c-swatch-blocks-wide",
    "c2c-swatch-blocks-tall",
    "c2c-swatch-width",
    "c2c-swatch-height",
    "c2c-target-width",
    "c2c-target-height",
    "c2c-yarn-per-block",
    "c2c-allowance",
  ]) {
    assert.match(source, new RegExp(`htmlFor="${id}"`));
    assert.match(source, new RegExp(`id="${id}"`));
  }
});

test("public copy calls dimensions nominal and does not promise exact size or purchase quantity", () => {
  const source = fs.readFileSync("src/app/c2c-calculator/page.tsx", "utf8");
  assert.match(source, /nominal block grid/i);
  assert.match(source, /does not guarantee finished dimensions or yarn quantity/i);
  assert.doesNotMatch(source, /shows you exactly|most accurate estimate|one skein or ten/i);
});
