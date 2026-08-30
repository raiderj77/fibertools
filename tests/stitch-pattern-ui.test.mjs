import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const component = fs.readFileSync(
  "src/app/stitch-pattern-calculator/StitchPatternCalculatorTool.tsx",
  "utf8",
);
const page = fs.readFileSync("src/app/stitch-pattern-calculator/page.tsx", "utf8");

test("wires the calculator to the bounded solver without user-sized scans", () => {
  assert.match(component, /from "@\/lib\/stitch-pattern-plan\.mjs"/);
  assert.match(component, /deriveGaugeStitchRange/);
  assert.match(component, /solveStitchPatternCounts/);
  assert.doesNotMatch(
    component,
    /function lcm|findCompatibleCounts|candidate < step|while \(start < searchMin\)/,
  );
  assert.match(component, /disabled=\{entries\.length >= MAX_STITCH_PATTERNS\}/);
  assert.match(component, /max=\{MAX_STITCH_MULTIPLE\}/);
  assert.match(component, /max=\{MAX_STITCH_COUNT\}/);
  assert.match(component, /max=\{MAX_EDGE_STITCHES_PER_SIDE\}/);
});

test("surfaces validation and describes per-side edge arithmetic", () => {
  assert.match(component, /role="alert"/);
  assert.match(component, /Edge Stitches per Side/);
  assert.match(component, /twice this number/);
  assert.match(component, /calcResults\.totalEdgeStitches/);
  assert.match(component, /Arithmetic Results/);
  assert.match(component, /They do not validate a pattern/);
  assert.match(component, /calcResults\.totalMatches/);
  assert.match(component, /Showing the first/);
});

test("page copy states finite limits and avoids former guarantees", () => {
  assert.match(page, /up to eight entered/);
  assert.match(page, /from 1 through 10,000/);
  assert.match(page, /plus values from 0 through 10,000/);
  assert.match(page, /5,000 stitches per side/);
  assert.match(page, /at most the first 500 matches/);
  assert.match(page, /plus offsets cannot share a solution/);
  assert.match(page, /Edge stitches are entered per side and added twice/);
  assert.match(page, /At least one full repeat is required/);
  assert.doesNotMatch(page, /50\+ stitch patterns|calculate the LCM instantly/);
  assert.doesNotMatch(page, /smallest stitch count that divides evenly|ensures every pattern/);
});
