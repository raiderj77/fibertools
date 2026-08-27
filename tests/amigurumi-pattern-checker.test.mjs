import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkPattern, MAX_FREE_ROUNDS } from "../src/lib/amigurumi-pattern-checker.mjs";

test("checks standard amigurumi increase rounds", () => {
  const checked = checkPattern("Round 7: (4 sc, inc) x 6 [36]\nRound 8: (5 sc, inc) x 6 [42]", 30);
  assert.equal(checked.error, null);
  assert.deepEqual(
    checked.results.map(({ status, startingCount, consumed, created, writtenTotal }) => ({ status, startingCount, consumed, created, writtenTotal })),
    [
      { status: "correct", startingCount: 30, consumed: 30, created: 36, writtenTotal: 36 },
      { status: "correct", startingCount: 36, consumed: 36, created: 42, writtenTotal: 42 },
    ],
  );
});

test("finds an incorrect written stitch total", () => {
  const [result] = checkPattern("Round 8: (5 sc, inc) x 6 [40]", 36).results;
  assert.equal(result.status, "incorrect");
  assert.equal(result.created, 42);
  assert.equal(result.difference, 2);
  assert.match(result.message, /2 stitches too low/);
});

test("uses accurate singular wording for one-stitch findings", () => {
  const [writtenTotal] = checkPattern("Round 3: (sc, inc) x 6 [17]", 12).results;
  const [consumption] = checkPattern("Round 4: 11 sc [11]", 12).results;
  assert.match(writtenTotal.message, /1 stitch too low/);
  assert.doesNotMatch(writtenTotal.message, /1 stitches/);
  assert.match(consumption.message, /1 stitch from the starting count is not used/);
});

test("checks magic-ring setup and decrease rounds", () => {
  const checked = checkPattern("Rnd 1: 6 sc in magic ring (6)\nRnd 2: inc x 6 (12)\nRnd 3: (sc, dec) x 4 (8)");
  assert.deepEqual(checked.results.map((result) => result.status), ["correct", "correct", "correct"]);
  assert.equal(checked.results[2].consumed, 12);
  assert.equal(checked.results[2].created, 8);
});

test("supports even rounds, loop modifiers, chains, and joining slip stitches", () => {
  const checked = checkPattern("Round 2: ch 1, BLO sc in each st around, sl st to join [12]", 12);
  const [result] = checked.results;
  assert.equal(result.status, "correct");
  assert.equal(result.consumed, 12);
  assert.equal(result.created, 12);
  assert.equal(result.notes.length, 2);
});

test("refuses unsupported notation instead of guessing", () => {
  const [result] = checkPattern("Round 4: popcorn in each st [18]", 18).results;
  assert.equal(result.status, "unsupported");
  assert.match(result.message, /Unsupported instruction/);
});

test("does not reuse a stale count after an unsupported round", () => {
  const checked = checkPattern([
    "Round 1: 6 sc in magic ring [6]",
    "Round 2: popcorn in each st [6]",
    "Round 3: 6 sc [6]",
  ].join("\n"));

  assert.equal(checked.results[1].status, "unsupported");
  assert.equal(checked.results[2].startingCount, null);
  assert.equal(checked.results[2].status, "unsupported");
});

test("requires a starting count for a pasted middle round", () => {
  const [result] = checkPattern("Round 8: (5 sc, inc) x 6 [42]").results;
  assert.equal(result.status, "unsupported");
  assert.match(result.message, /Enter the stitch count/);
});

test("does not invent a fallback identity for an unsafe explicit round number", () => {
  const [result] = checkPattern("Round 9007199254740993: 1 sc [1]", 1).results;
  assert.equal(result.round, null);
  assert.equal(result.status, "unsupported");
  assert.match(result.message, /Round number is outside the supported whole-number range/);
});

test("limits the free preview to a bounded number of rounds", () => {
  const pattern = Array.from({ length: MAX_FREE_ROUNDS + 1 }, (_, index) => `Round ${index + 1}: sc [1]`).join("\n");
  const checked = checkPattern(pattern, 1);
  assert.match(checked.error, /up to 20 rounds/);
  assert.equal(checked.results.length, 0);
});

test("keeps pattern contents out of storage, network calls, and analytics", () => {
  const component = readFileSync(
    new URL("../src/app/amigurumi-pattern-checker/AmigurumiPatternCheckerTool.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(component, /\bfetch\s*\(|localStorage|sessionStorage/);
  assert.match(component, /trackFixedEvent\("pattern_check_run", \{ slug: "amigurumi-pattern-checker" \}\)/);
  assert.doesNotMatch(component, /round_count|correct_rounds|incorrect_rounds|calculated_rounds|unsupported_rounds/);
});
