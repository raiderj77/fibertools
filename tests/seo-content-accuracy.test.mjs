import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");
const blanketTool = read("src/app/blanket-calculator/BlanketCalculatorTool.tsx");
const blanketPage = read("src/app/blanket-calculator/page.tsx");
const homepage = read("src/app/page.tsx");
const toolContent = read("src/lib/toolContent.ts");
const toolLayout = read("src/components/ToolLayout.tsx");

test("does not publish the unsupported FiberTools audience and sales statistics", () => {
  assert.doesNotMatch(homepage, /45 million Americans|\$3 billion/);
  assert.doesNotMatch(toolContent, /38 million Americans/);
});

test("uses swatch consumption instead of a generic blanket coverage factor", () => {
  assert.doesNotMatch(blanketTool, /ydsPerSqIn|gaugeRatio/);
  assert.match(blanketTool, /swatchWeight \* areaRatio \* 1\.1/);
  assert.match(blanketPage, /finished area ÷ swatch area × measured swatch grams × 1\.10 buffer/);
});

test("links to the current Craft Yarn Council reference routes", () => {
  assert.match(blanketPage, /standards\/yarn-weight-system/);
  assert.match(toolLayout, /standards\/hooks-and-needles/);
  assert.doesNotMatch(toolLayout, /standards\/needle-hook-sizes/);
});

test("keeps cross-stitch guidance aligned with the calculator's strand math", () => {
  assert.match(toolContent, /500 stitches worked with two strands use about 1,100 strand-inches/);
  assert.match(toolContent, /rounds that purchase estimate up to one skein/);
  assert.match(toolContent, /Select the fabric's named count exactly as printed/);
  assert.match(toolContent, /turn on Stitch over two and the calculator will halve that count once/);
  assert.doesNotMatch(toolContent, /500 stitches needs about 500 inches|two standard skeins/);
  assert.doesNotMatch(toolContent, /enter the thread count divided by 2/);
});
