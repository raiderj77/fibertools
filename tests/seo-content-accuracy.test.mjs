import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getToolBySlug } from "../src/lib/tools.ts";

const read = (path) => fs.readFileSync(path, "utf8");
const blanketTool = read("src/app/blanket-calculator/BlanketCalculatorTool.tsx");
const blanketPage = read("src/app/blanket-calculator/page.tsx");
const castOnPage = read("src/app/cast-on-calculator/page.tsx");
const homepage = read("src/app/page.tsx");
const knittingToolsPage = read("src/app/knitting-tools/page.tsx");
const raglanPage = read("src/app/raglan-calculator/page.tsx");
const sockPage = read("src/app/sock-calculator/page.tsx");
const toolContent = read("src/lib/toolContent.ts");
const toolLayout = read("src/components/ToolLayout.tsx");
const tools = read("src/lib/tools.ts");
const yarnPage = read("src/app/yarn-calculator/page.tsx");
const yarnTool = read("src/app/yarn-calculator/YarnCalculatorTool.tsx");

test("describes yarn quantities as estimates in the shared tool registry", () => {
  assert.equal(
    getToolBySlug("yarn-calculator")?.description,
    "Scale yarn measured in a representative swatch to a flat rectangular target, then convert the planning total to whole skeins.",
  );
});

test("describes spinning functions without an unsupported exclusivity claim", () => {
  assert.equal(
    getToolBySlug("spinning-ratio-calculator")?.description,
    "Calculate the ideal geometric ratio between a drive wheel and its connected pulley.",
  );
});

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

test("keeps the yarn calculator blank until measured-swatch and label values are entered", () => {
  assert.match(yarnTool, /\[targetWidth, setTargetWidth\] = useState\("50"\)/);
  assert.match(yarnTool, /\[targetLength, setTargetLength\] = useState\("60"\)/);
  assert.match(yarnTool, /\[swatchWidth, setSwatchWidth\] = useState\(""\)/);
  assert.match(yarnTool, /\[swatchLength, setSwatchLength\] = useState\(""\)/);
  assert.match(yarnTool, /\[swatchYarnLength, setSwatchYarnLength\] = useState\(""\)/);
  assert.match(yarnTool, /\[allowancePercent, setAllowancePercent\] = useState\("10"\)/);
  assert.match(yarnTool, /\[skeinLength, setSkeinLength\] = useState\(""\)/);
  assert.match(yarnTool, /\[skeinWeight, setSkeinWeight\] = useState\(""\)/);
  assert.match(toolContent, /measured base estimate of 3,750 yards/);
  assert.match(toolContent, /4,125 planned yards/);
  assert.match(toolContent, /19 skeins/);
  assert.doesNotMatch(yarnTool, /ydsPerSqIn|gaugeRatio/);
});

test("keeps Search Console quick-win copy mapped to the correct canonical tools", () => {
  assert.match(blanketPage, /Blanket Yarn Calculator: Yards & Skeins by Size/);
  assert.match(blanketPage, /pageTitle="Blanket Yarn & Size Calculator"/);
  assert.match(blanketPage, /How many yards of yarn do you need for a throw or queen blanket\?/);
  assert.match(blanketPage, /throw, queen, or custom blanket/);
  assert.match(blanketPage, /href="\/cast-on-calculator"/);
  assert.match(toolLayout, /pageTitle \? \{ \.\.\.tool, name: pageTitle \} : tool/);
  assert.match(castOnPage, /Cast On Calculator: Stitches for Any Width/);
  assert.match(castOnPage, /how many stitches to cast on/);
  assert.match(sockPage, /Sock Circumference Stitch Calculator/);
  assert.match(sockPage, /does not infer cuff, heel, gusset, toe, foot length, or pull-on fit/);
  assert.match(tools, /"blanket-calculator": \["cast-on-calculator", "yarn-calculator"/);
});

test("keeps contextual journeys connected without sending shaped garments to the flat-panel estimator", () => {
  for (const path of [
    "/yarn-calculator",
    "/cast-on-calculator",
    "/sock-calculator",
    "/raglan-calculator",
  ]) {
    assert.match(knittingToolsPage, new RegExp(`href="${path}"`));
  }

  assert.match(yarnPage, /href: "\/project-cost-calculator"/);
  assert.match(castOnPage, /href="\/sock-calculator"/);
  assert.match(sockPage, /href: "\/gauge-calculator"/);
  assert.doesNotMatch(sockPage, /href: "\/yarn-calculator"/);
  assert.doesNotMatch(raglanPage, /href="\/yarn-calculator"/);
  assert.match(raglanPage, /href="\/sleeve-calculator"/);
});
