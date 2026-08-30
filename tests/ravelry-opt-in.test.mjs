import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const component = fs.readFileSync("src/components/RavelryPatterns.tsx", "utf8");
const privacy = fs.readFileSync("src/app/privacy/page.tsx", "utf8");
const route = fs.readFileSync("src/app/api/ravelry/patterns/route.ts", "utf8");

test("Ravelry recommendations require an explicit user request", () => {
  assert.match(component, /const \[requested, setRequested\]/);
  assert.match(component, /if \(!visible \|\| !requested\) return/);
  assert.match(component, /setLoading\(true\);[\s\S]{0,100}setRequested\(true\);/);
  assert.match(component, /Load Ravelry recommendations/);
  assert.doesNotMatch(component, /if \(!visible\) return;[\s\S]{0,300}fetch\(/);
});

test("Ravelry failures are not presented as genuine empty recommendations", () => {
  assert.match(component, /data\.configured === false \|\| data\.error \|\| !Array\.isArray\(data\.patterns\)/);
  assert.match(component, /Recommendations are unavailable right now/);
  assert.doesNotMatch(component, /<img|thumbnail/);
});

test("the credentialed Ravelry proxy accepts only the UI's closed filter vocabulary", () => {
  assert.match(route, /ALLOWED_QUERIES/);
  assert.match(route, /ALLOWED_CRAFTS/);
  assert.match(route, /ALLOWED_WEIGHTS/);
  assert.match(route, /ALLOWED_PARAMETER_NAMES/);
  assert.match(route, /searchParams\.getAll\(name\)\.length > 1/);
  assert.match(route, /requestedLimit !== "6"/);
  assert.doesNotMatch(route, /detail|String\(err\)|first_photo|thumbnail/);
});

test("privacy copy names the opt-in filters and Ravelry service", () => {
  assert.match(privacy, /select &ldquo;Load Ravelry recommendations&rdquo;/);
  assert.match(privacy, /selected yarn-weight category, craft, and project-type filter/);
  assert.match(privacy, /Ravelry Privacy Policy/);
  assert.match(privacy, /measured swatch values and calculated[\s\S]*not included/);
});
