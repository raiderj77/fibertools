import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { generateSphere } from "../src/lib/amigurumi-shape-patterns.mjs";


function numberedRounds(pattern) {
  return pattern.filter((line) => /^Rnd \d+:/.test(line));
}

test("sphere generator emits exactly the selected total for even and odd values", () => {
  for (const total of [6, 7, 12, 13, 30]) {
    const rounds = numberedRounds(generateSphere(total));
    assert.equal(rounds.length, total, `expected ${total} numbered rounds`);
    assert.match(rounds.at(-1), new RegExp(`^Rnd ${total}:`));
  }
});

test("sphere generator rejects unsupported totals", () => {
  assert.throws(() => generateSphere(5), /at least 6/);
  assert.throws(() => generateSphere(12.5), /integer/);
});

test("12-round explanation distinguishes the foundation from increase rounds", () => {
  const content = readFileSync(new URL("../src/lib/toolContent.ts", import.meta.url), "utf8");
  assert.match(content, /six buildup rounds ending at 36 stitches/);
  assert.match(content, /one even round at 36, and five decrease rounds ending at six stitches/);
  assert.doesNotMatch(content, /six increase rounds/);
});
