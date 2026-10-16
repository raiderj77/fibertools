import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const guideSource = readFileSync(
  "src/app/blog/stitch-counter-guide/page.tsx",
  "utf8",
);
const termsSource = readFileSync("src/app/terms/page.tsx", "utf8");

test("the retired MyCrochetKit service is not presented as a current FiberTools resource", () => {
  assert.doesNotMatch(guideSource, /MyCrochetKit|mycrochetkit\.com/i);
  assert.doesNotMatch(termsSource, /MyCrochetKit|mycrochetkit\.com/i);
});

test("the guide uses one review date for visible and structured data", () => {
  assert.match(guideSource, /dateModified: REVIEW_DATE\.iso/);
  assert.match(guideSource, /Last reviewed: \{REVIEW_DATE\.label\}/);
  assert.match(guideSource, /iso: "2026-10-15"/);
  assert.match(guideSource, /label: "October 15, 2026"/);
});

test("the visible and structured row-counter answers use one qualified source", () => {
  assert.match(guideSource, /text: ROW_COUNTER_ANSWER/);
  assert.match(guideSource, />\{ROW_COUNTER_ANSWER\}<\/p>/);
  assert.match(
    guideSource,
    /browser support, network requirements, and audio processing vary by device/,
  );
  assert.doesNotMatch(guideSource, /voice works offline|works offline/i);
});
