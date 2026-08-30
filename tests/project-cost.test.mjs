import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import { calculateProjectCostSummary } from "../src/lib/project-cost.mjs";

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

test("ignores negative and non-finite material inputs", () => {
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

  assert.deepEqual(result, {
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
