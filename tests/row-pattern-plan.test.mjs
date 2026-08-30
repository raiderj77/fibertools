import assert from "node:assert/strict";
import test from "node:test";

import {
  MAX_ROW_PLANNER_SECTIONS,
  MAX_ROW_REPEAT,
  MAX_TARGET_SECTION_ROWS,
  buildRowPatternPlan,
} from "../src/lib/row-pattern-plan.mjs";

test("rounds every target up to at least one complete row repeat", () => {
  const result = buildRowPatternPlan([
    { id: 1, stitch: "Four-row pattern", rowRepeat: 4, targetRows: 1 },
    { id: 2, stitch: "Exact pattern", rowRepeat: 4, targetRows: 8 },
    { id: 3, stitch: "Next repeat", rowRepeat: 4, targetRows: 9 },
  ]);

  assert.equal(result.ok, true);
  assert.deepEqual(
    result.sections.map(({ fullRepeats, actualRows, addedRows }) => ({ fullRepeats, actualRows, addedRows })),
    [
      { fullRepeats: 1, actualRows: 4, addedRows: 3 },
      { fullRepeats: 2, actualRows: 8, addedRows: 0 },
      { fullRepeats: 3, actualRows: 12, addedRows: 3 },
    ],
  );
  assert.equal(result.totalTargetRows, 18);
  assert.equal(result.totalActualRows, 24);
});

test("rejects malformed, fractional, negative, duplicate, and excessive input before planning", () => {
  const base = [{ id: 1, stitch: "Section", rowRepeat: 4, targetRows: 20 }];
  const failures = [
    [],
    Array.from({ length: MAX_ROW_PLANNER_SECTIONS + 1 }, (_, index) => ({
      id: index + 1,
      stitch: "",
      rowRepeat: 1,
      targetRows: 1,
    })),
    [{ ...base[0], rowRepeat: 0 }],
    [{ ...base[0], rowRepeat: -1 }],
    [{ ...base[0], rowRepeat: 1.5 }],
    [{ ...base[0], rowRepeat: MAX_ROW_REPEAT + 1 }],
    [{ ...base[0], targetRows: 0 }],
    [{ ...base[0], targetRows: Infinity }],
    [{ ...base[0], targetRows: MAX_TARGET_SECTION_ROWS + 1 }],
    [base[0], { ...base[0] }],
  ];

  for (const sections of failures) assert.equal(buildRowPatternPlan(sections).ok, false);
});

test("the UI delegates row arithmetic and exposes bounded labeled controls", async () => {
  const { readFile } = await import("node:fs/promises");
  const component = await readFile(
    new URL("../src/app/stitch-pattern-calculator/StitchPatternCalculatorTool.tsx", import.meta.url),
    "utf8",
  );

  assert.match(component, /from "@\/lib\/row-pattern-plan\.mjs"/);
  assert.match(component, /buildRowPatternPlan/);
  assert.doesNotMatch(component, /Math\.round\(s\.targetRows \/ s\.rowRepeat\)/);
  assert.match(component, /htmlFor=\{`planner-row-repeat-\$\{section\.id\}`\}/);
  assert.match(component, /htmlFor=\{`planner-target-rows-\$\{section\.id\}`\}/);
  assert.match(component, /aria-label=\{`Remove section/);
});
