import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const component = fs.readFileSync(
  "src/app/weaving-sett-calculator/WeavingSettCalculatorTool.tsx",
  "utf8",
);
const page = fs.readFileSync("src/app/weaving-sett-calculator/page.tsx", "utf8");

test("wires every weaving calculation to bounded helpers", () => {
  assert.match(component, /from "@\/lib\/weaving-sett-plan\.mjs"/);
  assert.match(component, /estimateSettFromWpi/);
  assert.match(component, /calculateWarpEstimate/);
  assert.match(component, /calculateReedSleying/);
  assert.doesNotMatch(component, /skip every|Alternate \$\{base\}/);
  assert.match(component, /SUPPORTED_REED_DENTS\.map/);
  assert.match(component, /max=\{MAX_REED_SETT_EPI\}/);
  assert.match(component, /role="alert"/);
});

test("associates every numeric control with its visible label", () => {
  for (const id of [
    "weaving-custom-wpi",
    "weaving-project-width",
    "weaving-project-length",
    "weaving-warp-epi",
    "weaving-loom-waste",
    "weaving-sampling",
    "weaving-length-allowance",
    "weaving-yards-per-skein",
    "weaving-desired-sett",
    "weaving-reed-dent",
  ]) {
    assert.match(component, new RegExp(`htmlFor="${id}"`));
    assert.match(component, new RegExp(`id="${id}"`));
  }
  assert.doesNotMatch(
    component,
    /htmlFor="weaving-reed-dent"[\s\S]{0,120}Yards per skein/,
  );
});

test("exposes the selected calculator view and bounded estimate caveats", () => {
  assert.match(component, /role="group"/);
  assert.match(component, /aria-pressed=\{tab === key\}/);
  assert.match(component, /Starting Sett Estimate/);
  assert.match(component, /Starting formula: WPI/);
  assert.match(component, /Starting Warp Estimate/);
  assert.match(component, /Exact Sleying Arithmetic/);
  assert.match(component, /sample first/i);
  assert.match(component, /const changeUnits/);
  assert.match(component, /setProjectLength\(convert\)/);
  assert.match(component, /setProjectWidth\(convert\)/);
  assert.match(component, /Warp length allowance/);
  assert.match(component, /same yarn and put-up only/);
  assert.match(component, /applies to warp length only/);
  assert.doesNotMatch(component, /Twill \(3\/1\)|Basket Weave|Satin \(5-shaft\)/);
});

test("page copy states the exact 8-EPI repeat and preserves the yarn cross-link boundary", () => {
  assert.match(page, /8 EPI in a 12-dent reed/);
  assert.match(page, /repeat skip, 1 end, 1 end across 3 dents/);
  assert.match(page, /from 1 through 120 EPI/);
  assert.match(page, /about 192 yards in each direction/);
  assert.match(page, /provisional 10% allowance/);
  assert.match(page, /width change is not modeled/i);
  assert.match(page, /only scales measured knit or crochet swatch use to a flat rectangle/);
  assert.match(page, /it does not calculate warp or weft/);
  assert.doesNotMatch(page, /determines the correct sett|Calculate the right sett|use the full count for twill/);
});
