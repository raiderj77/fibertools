import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { calculateBacking, calculateBatting, calculateBinding, calculateBorder } from "../src/lib/quilting-planning.mjs";

test("calculates all approved worked examples", () => {
  const backing = calculateBacking({ width: 84, length: 96, overhang: 4 });
  assert.equal(backing.status, "ready");
  assert.deepEqual([backing.backingWidth, backing.backingLength], [92, 104]);
  assert.deepEqual(backing.options.filter(({ fabricWidth }) => fabricWidth === 44 || fabricWidth === 108).map(({ fabricWidth, panels, yardage }) => ({ fabricWidth, panels, yardage })), [{ fabricWidth: 44, panels: 3, yardage: 8.75 }, { fabricWidth: 108, panels: 1, yardage: 3 }]);
  const pricedBacking = calculateBacking({ width: 84, length: 96, overhang: 4, prices: { 44: 12, 90: 18, 108: 20 } });
  assert.equal(pricedBacking.cheapest.fabricWidth, 108);
  assert.equal(pricedBacking.options.find(({ fabricWidth }) => fabricWidth === 44).cost, 105);
  assert.equal(pricedBacking.options.find(({ fabricWidth }) => fabricWidth === 108).cost, 60);
  const binding = calculateBinding({ width: 84, length: 96, stripWidth: 2.5, fabricWidth: 44 });
  assert.deepEqual(binding, { status: "ready", perimeter: 360, bindingLength: 370, strips: 9, yardage: 0.75 });
  const border = calculateBorder({ width: 60, length: 72, borderWidth: 6, fabricWidth: 44 });
  assert.deepEqual([border.finishedWidth, border.finishedLength, border.lengthwise.yardage, border.crosswise.yardage], [72, 84, 2.5, 1.5]);
  assert.equal(calculateBatting({ width: 84, length: 96, overhang: 4 }).packaged.name, "King");
  assert.equal(calculateBatting({ width: 60, length: 72, overhang: 4 }).packaged.name, "Twin");
  assert.equal(calculateBatting({ width: 92, length: 72, overhang: 4 }).packaged.name, "Queen");
});

test("declines blank-equivalent, unsafe, and unusable inputs", () => {
  for (const result of [
    calculateBacking({ width: Number.NaN, length: 96, overhang: 4 }),
    calculateBinding({ width: 0, length: 96, stripWidth: 2.5, fabricWidth: 44 }),
    calculateBorder({ width: 60, length: 72, borderWidth: -1, fabricWidth: 44 }),
    calculateBatting({ width: 60, length: 72, overhang: 4, rollWidth: 1e20 }),
  ]) assert.equal(result.status, "invalid");
  assert.equal(calculateBatting({ width: 60, length: 72, overhang: 4, rollWidth: 50 }).rollYardage, null);
});

test("routes retain static accessibility, copy, and retailer contracts", () => {
  const calculator = fs.readFileSync("src/app/quilting/PlanningCalculator.tsx", "utf8");
  const shared = fs.readFileSync("src/app/quilting/CalculatorPage.tsx", "utf8");
  const batting = fs.readFileSync("src/app/quilting/batting-calculator/page.tsx", "utf8") + shared;
  const retailer = fs.readFileSync("src/lib/quilting-retailers.ts", "utf8");
  assert.match(calculator, /<label[^>]+htmlFor=/);
  assert.match(calculator, /aria-live="polite"/);
  assert.match(calculator, /min="0\.01"/);
  assert.match(shared, /<AnswerBlock/);
  for (const heading of ["How it works", "Worked example", "Frequently asked questions", "Assumptions and limits"]) assert.match(shared, new RegExp(heading, "i"));
  assert.match(batting, /common packaged sizes/i);
  assert.match(fs.readFileSync("src/lib/quilting-planning.mjs", "utf8"), /manufacturer size-chart fetch was unavailable/i);
  assert.match(retailer, /OWNER: replace with Awin Fat Quarter Shop affiliate URLs after approval\./);
  assert.match(retailer, /fatquartershop\.com/);
  assert.doesNotMatch(retailer, /amazon/i);
  assert.match(shared, /quiltingRetailers\.fatQuarterShopWideback/);
  assert.match(shared, /Amazon links are affiliate links and cost the reader nothing extra\. The Fat Quarter Shop link is a regular retailer link, not an affiliate link\./);
  assert.match(fs.readFileSync("src/app/quilting/page.tsx", "utf8"), /Amazon links are affiliate links and cost the reader nothing extra\. The Fat Quarter Shop link is a regular retailer link, not an affiliate link\./);
  assert.match(shared, /rel="nofollow noopener noreferrer"/);
  assert.doesNotMatch(shared, /rel="[^"]*sponsored[^"]*"/);
  assert.match(calculator, /price per yard \(optional, USD\)/);
  assert.match(calculator, /lowest cost/);
  assert.match(calculator, /wideback saves/);
  assert.match(calculator, /aria-invalid=\{invalid\}/);
  assert.match(shared, /Related Fiber Arts Tools/);
});
