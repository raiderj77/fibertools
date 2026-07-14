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

test("requires a starting count for a pasted middle round", () => {
  const [result] = checkPattern("Round 8: (5 sc, inc) x 6 [42]").results;
  assert.equal(result.status, "unsupported");
  assert.match(result.message, /Enter the stitch count/);
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
  const analyticsParameters = component.match(/window\.gtag\("event", "pattern_check_run", \{([\s\S]*?)\n\s*\}\);/);
  assert.ok(analyticsParameters, "pattern_check_run event is missing");
  assert.doesNotMatch(analyticsParameters[1], /pattern|source|stitch|starting|created|written/i);
  assert.match(analyticsParameters[1], /round_count/);
  assert.match(analyticsParameters[1], /unsupported_rounds/);
});
