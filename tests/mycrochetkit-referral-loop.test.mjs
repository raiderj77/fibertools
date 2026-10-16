import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync("src/components/MyCrochetKitCallout.tsx", "utf8");

test("limits the companion planner callout to four relevant FiberTools journeys", () => {
  for (const slug of ["yarn-calculator", "gauge-calculator", "blanket-calculator", "stitch-counter"]) {
    assert.match(source, new RegExp(`"${slug}"`));
  }
  assert.match(source, /if \(!isSupportedTool\(slug\)\) return null/);
});

test("uses fixed privacy-safe attribution without passing calculator or planner data", () => {
  assert.match(source, /searchParams\.set\("utm_source", "fibertools"\)/);
  assert.match(source, /searchParams\.set\("utm_medium", "referral"\)/);
  assert.match(source, /searchParams\.set\("utm_campaign", "project_planner"\)/);
  assert.match(source, /searchParams\.set\("utm_content", slug\)/);
  assert.doesNotMatch(source, /window\.location|localStorage|result|projectName|yarnName|currentRow|email=/i);
});

test("describes the live planner narrowly and avoids retired-product claims", () => {
  assert.match(source, /accountless planner that stores project details in this browser/);
  assert.match(source, /export backups for projects you want to keep/);
  assert.doesNotMatch(source, /voice|cloud sync|works offline|never lose|Try It Free/i);
});
