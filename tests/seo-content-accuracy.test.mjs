import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { getToolBySlug } from "../src/lib/tools.ts";
import { getGuideBySlug } from "../src/lib/guides.ts";

const read = (path) => fs.readFileSync(path, "utf8");
const blanketTool = read("src/app/blanket-calculator/BlanketCalculatorTool.tsx");
const blanketPage = read("src/app/blanket-calculator/page.tsx");
const bestCrochetHooksPage = read("src/app/best-crochet-hooks/page.tsx");
const bestKnittingNeedlesPage = read("src/app/best-knitting-needles/page.tsx");
const castOnPage = read("src/app/cast-on-calculator/page.tsx");
const gaugePage = read("src/app/gauge-calculator/page.tsx");
const grannyPlannerPage = read("src/app/granny-square-planner/page.tsx");
const homepage = read("src/app/page.tsx");
const layout = read("src/app/layout.tsx");
const knittingToolsPage = read("src/app/knitting-tools/page.tsx");
const raglanPage = read("src/app/raglan-calculator/page.tsx");
const sockPage = read("src/app/sock-calculator/page.tsx");
const toolContent = read("src/lib/toolContent.ts");
const toolLayout = read("src/components/ToolLayout.tsx");
const tools = read("src/lib/tools.ts");
const yarnPage = read("src/app/yarn-calculator/page.tsx");
const yarnTool = read("src/app/yarn-calculator/YarnCalculatorTool.tsx");
const yarnWeightChartPage = read("src/app/yarn-weight-chart/page.tsx");

test("describes yarn quantities as estimates in the shared tool registry", () => {
  assert.equal(
    getToolBySlug("yarn-calculator")?.description,
    "Scale yarn measured in a representative swatch to a flat rectangular target, then convert the planning total to whole skeins.",
  );
});

test("describes spinning functions without an unsupported exclusivity claim", () => {
  assert.equal(
    getToolBySlug("spinning-ratio-calculator")?.description,
    "Calculate the simplified geometric ratio between entered effective drive-wheel and connected-pulley band-path diameters.",
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
  assert.match(blanketPage, /How Much Yarn for a Blanket\? Calculator \(Yards & Skeins\)/);
  assert.match(blanketPage, /pageTitle="Blanket Yarn & Size Calculator"/);
  assert.match(blanketPage, /How many yards of yarn do you need for a throw or queen blanket\?/);
  assert.match(blanketPage, /throw, queen, king or custom blanket/);
  assert.match(blanketPage, /href="\/cast-on-calculator"/);
  assert.match(toolLayout, /pageTitle \? \{ \.\.\.tool, name: pageTitle \} : tool/);
  assert.match(castOnPage, /Cast On Calculator: Stitches for Any Width/);
  assert.match(castOnPage, /how many stitches to cast on/);
  assert.match(sockPage, /Sock Circumference Stitch Calculator/);
  assert.match(sockPage, /does not infer cuff, heel, gusset, toe, foot length, or pull-on fit/);
  assert.match(tools, /"blanket-calculator": \["cast-on-calculator", "yarn-calculator"/);
});

test("keeps priority search snippets specific to what each existing page delivers", () => {
  assert.match(layout, /30\+ Free Knitting & Crochet Calculators \| FiberTools/);
  assert.match(layout, /30\+ free calculators for knitting, crochet, weaving, spinning & embroidery/);

  assert.match(yarnWeightChartPage, /Yarn Weight Chart: Sizes 0–7, Gauge & Substitutions/);
  assert.match(yarnWeightChartPage, /all 8 CYC categories/);
  assert.match(yarnWeightChartPage, /Compare substitutes, then swatch/);

  assert.match(bestKnittingNeedlesPage, /Best Knitting Needles \(2026\): Beginner to Pro Picks \| FiberTools/);
  assert.match(bestKnittingNeedlesPage, /Bamboo straights for learning, ChiaoGoo circulars for everything else/);
  assert.doesNotMatch(bestKnittingNeedlesPage, /Lab[- ]tested|Hands[- ]on tested/i);

  assert.match(blanketPage, /Enter your swatch to estimate yards and whole skeins/);
  assert.doesNotMatch(blanketPage, /get exact yards/);

  assert.match(gaugePage, /Knitting Gauge Calculator: Swatch to Stitch Counts/);
  assert.match(gaugePage, /scale one entered stitch or row count/);
  assert.doesNotMatch(gaugePage, /for any pattern size/);

  assert.match(yarnPage, /Yarn Calculator: How Many Skeins Do I Need\?/);
  assert.match(yarnPage, /estimate yardage and whole-skein counts/);
  assert.doesNotMatch(yarnPage, /get exact yardage/);

  assert.match(bestCrochetHooksPage, /Best Crochet Hooks \(2026\): Beginner to Pro Picks \| FiberTools/);
  assert.match(bestCrochetHooksPage, /Ergonomic, aluminum & steel/);
});

test("expands the existing granny-square guide without adding a competing route", () => {
  const guide = getGuideBySlug("granny-square-blanket-guide");
  assert.ok(guide);
  assert.equal(guide.title, "Granny Square Blanket Guide: Squares, Yarn & Joining");
  assert.equal(guide.modifiedDate, "2026-09-25");

  const copy = guide.sections.map((section) => `${section.heading}\n${section.content}`).join("\n");
  const wordCount = copy.replace(/https?:\/\/\S+/gu, " ").match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)?.length ?? 0;
  assert.ok(wordCount >= 1200, `expected at least 1,200 words, found ${wordCount}`);

  for (const required of [
    "Baby, 30 × 36 in",
    "Throw, 50 × 60 in",
    "Twin, 66 × 90 in",
    "Queen, 90 × 100 in",
    "King, 108 × 100 in",
    "Whipstitch",
    "Slip-stitch join",
    "Join-as-you-go",
    "Block Squares Before Final Assembly",
    "https://fibertools.app/granny-square-planner",
    "https://fibertools.app/blanket-calculator",
  ]) assert.match(copy, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "i"));

  assert.match(homepage, /href="\/guides\/granny-square-blanket-guide"/);
  assert.match(grannyPlannerPage, /href="\/guides\/granny-square-blanket-guide"/);
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
