import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { calculateProjectCostSummary } from "../src/lib/project-cost.mjs";

test("does not display a plausible subtotal after an invalid material input", () => {
  const result = calculateProjectCostSummary([
    { skeins: "2", pricePerSkein: "8" }, { skeins: "-1", pricePerSkein: "10" },
  ], [], "", "", "");
  assert.equal(result.valid, false);
  assert.equal(result.totalCost, 0);
});

test("declines overflow and rounds positive half cents consistently", () => {
  assert.equal(calculateProjectCostSummary([{ skeins: "1e300", pricePerSkein: "1e300" }], [], "", "", "").valid, false);
  assert.equal(calculateProjectCostSummary([{ skeins: "0.5", pricePerSkein: "2.01" }], [], "", "", "").totalCost, 1.01);
  assert.equal(calculateProjectCostSummary([{ skeins: "1.5", pricePerSkein: "6.85" }], [], "", "", "").totalCost, 10.28);
});

test("uses rounded currency inputs and unrounded time for dependent arithmetic", () => {
  const result = calculateProjectCostSummary(
    [{ skeins: "0.333", pricePerSkein: "10" }],
    [{ price: "0.005" }],
    "100",
    "25",
    "73.34",
  );

  assert.equal(result.yarnCost, 3.33);
  assert.equal(result.notionCost, 0.01);
  assert.equal(result.totalCost, 3.34);
  assert.equal(result.minutes, 4);
  assert.ok(Math.abs(result.hours - (4 / 60)) < Number.EPSILON);
  assert.equal(result.sell, 73.34);
  assert.equal(result.remainder, 70);
  assert.equal(result.hourlyRemainder, 1050);
});

test("does not silently calculate time without a positive entered rate", () => {
  const result = calculateProjectCostSummary(
    [{ skeins: "2", pricePerSkein: "8" }],
    [],
    "12000",
    "",
    "100",
  );

  assert.equal(result.totalCost, 16);
  assert.equal(result.hours, 0);
  assert.equal(result.hourlyRemainder, 0);

  const source = fs.readFileSync(
    "src/app/project-cost-calculator/ProjectCostCalculatorTool.tsx",
    "utf8",
  );
  assert.match(source, /\[stitchesPerMin, setStitchesPerMin\] = useState\(""\)/);
});

test("declines negative and non-finite material inputs", () => {
  const result = calculateProjectCostSummary(
    [
      { skeins: "-2", pricePerSkein: "8" },
      { skeins: "2", pricePerSkein: "Infinity" },
    ],
    [{ price: "-5" }],
    "-100",
    "25",
    "-1",
  );

  assert.equal(result.valid, false);
  const { valid, error, ...amounts } = result;
  assert.match(error, /Invalid entries/);
  assert.deepEqual(amounts, {
    yarnCost: 0,
    notionCost: 0,
    totalCost: 0,
    hours: 0,
    minutes: 0,
    sell: 0,
    remainder: 0,
    hourlyRemainder: 0,
  });
});
