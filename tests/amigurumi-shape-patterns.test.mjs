import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  AMIGURUMI_SHAPE_LIMITS,
  generateAmigurumiShapePlan,
  generateCone,
  generateCylinder,
  generateOval,
  generateSphere,
} from "../src/lib/amigurumi-shape-patterns.mjs";

const tool = readFileSync(
  new URL("../src/app/amigurumi-shapes/AmigurumiShapesTool.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../src/app/amigurumi-shapes/page.tsx", import.meta.url),
  "utf8",
);

function roundCounts(lines) {
  return lines
    .filter((line) => /^Rnd \d+:/.test(line))
    .map((line) => Number(line.match(/\((\d+)\)$/)?.[1]));
}

test("sphere count schedules increase, hold, and decrease symmetrically", () => {
  assert.deepEqual(roundCounts(generateSphere(6)), [6, 12, 18, 18, 12, 6]);
  assert.deepEqual(roundCounts(generateSphere(7)), [6, 12, 18, 18, 18, 12, 6]);
  assert.equal(roundCounts(generateSphere(30)).length, 30);
});

test("cone schedules add six stitches only on alternating rounds", () => {
  assert.deepEqual(roundCounts(generateCone(8)), [6, 12, 12, 18, 18, 24, 24, 30]);
  assert.match(generateCone(8)[3], /\*sc 1, inc\* x6\. \(18\)$/);
});

test("cylinder schedules build the selected base and never exceed total rounds", () => {
  assert.deepEqual(roundCounts(generateCylinder(6, 4)), [6, 12, 18, 24, 24, 24]);
  assert.deepEqual(roundCounts(generateCylinder(6, 1)), [6, 6, 6, 6, 6, 6]);
  assert.throws(() => generateCylinder(6, 7), /base rounds cannot exceed total rounds/i);

  const invalidPlan = generateAmigurumiShapePlan({
    shape: "cylinder",
    totalRounds: 6,
    baseRounds: 7,
    ovalChain: 6,
    ovalRounds: 4,
  });
  assert.equal(invalidPlan.ok, false);
  assert.equal("lines" in invalidPlan, false);
});

test("oval setup text and round-one count agree with the entered foundation chain", () => {
  const sixChain = generateOval(6, 4);
  assert.equal(sixChain[0], "Ch 6.");
  assert.match(sixChain[1], /sc in next 4 ch/);
  assert.match(sixChain[1], /underside, sc in next 3 ch/);
  assert.deepEqual(roundCounts(sixChain), [12, 18, 24, 30]);

  const eightChain = generateOval(8, 2);
  assert.equal(eightChain[0], "Ch 8.");
  assert.deepEqual(roundCounts(eightChain), [16, 22]);
  assert.notDeepEqual(eightChain, sixChain);
});

test("rejects invalid controls before generating any instruction array", () => {
  const invalidCalls = [
    () => generateSphere(AMIGURUMI_SHAPE_LIMITS.maxTotalRounds + 1),
    () => generateSphere(Number.POSITIVE_INFINITY),
    () => generateCone(5),
    () => generateCone(6.5),
    () => generateCylinder(6, 0),
    () => generateCylinder(31, 4),
    () => generateOval(3, 4),
    () => generateOval(6, 0),
    () => generateOval(6, AMIGURUMI_SHAPE_LIMITS.maxOvalRounds + 1),
  ];
  for (const call of invalidCalls) assert.throws(call, /integer|at least|at most/i);

  const unsupported = generateAmigurumiShapePlan({
    shape: "cube",
    totalRounds: 12,
    baseRounds: 4,
    ovalChain: 6,
    ovalRounds: 4,
  });
  assert.deepEqual(unsupported, { ok: false, error: "Choose a supported basic shape." });
});

test("every supported maximum stays within the instruction-line ceiling", () => {
  for (const lines of [
    generateSphere(AMIGURUMI_SHAPE_LIMITS.maxTotalRounds),
    generateCone(AMIGURUMI_SHAPE_LIMITS.maxTotalRounds),
    generateCylinder(
      AMIGURUMI_SHAPE_LIMITS.maxTotalRounds,
      AMIGURUMI_SHAPE_LIMITS.maxBaseRounds,
    ),
    generateOval(
      AMIGURUMI_SHAPE_LIMITS.maxOvalChain,
      AMIGURUMI_SHAPE_LIMITS.maxOvalRounds,
    ),
  ]) {
    assert.ok(lines.length <= AMIGURUMI_SHAPE_LIMITS.maxInstructionLines);
  }
});

test("the selected shape controls feed the bounded helper and remain labeled", () => {
  assert.match(tool, /generateAmigurumiShapePlan\(\{[\s\S]*shape,[\s\S]*totalRounds,[\s\S]*baseRounds,[\s\S]*ovalChain,[\s\S]*ovalRounds/);
  assert.match(tool, /aria-pressed=\{shape === s\.key\}/);
  for (const id of [
    "shape-total-rounds",
    "shape-base-rounds",
    "shape-oval-chain",
    "shape-oval-rounds",
  ]) {
    assert.match(tool, new RegExp(`id="${id}"`));
    assert.match(tool, new RegExp(`htmlFor="${id}"`));
  }
  assert.match(tool, /<label htmlFor=\{htmlFor\}/);
  assert.match(tool, /max=\{maximum\}/);
});

test("tool and page label output as arithmetic references rather than guaranteed shapes", () => {
  assert.match(tool, /Basic single-crochet count references/);
  assert.match(tool, /do not[\s\S]*determine a guaranteed sphere, cone, cylinder, or oval/i);
  assert.match(tool, /Basic stitch-count reference/);
  assert.match(page, /They do not guarantee a finished geometric shape/i);
  assert.doesNotMatch(page, /complete round-by-round pattern instantly|come out clean and symmetrical every time|true sphere/i);
  assert.doesNotMatch(tool, /Great for horns|Pattern output|Stuff firmly before closing/);
});
