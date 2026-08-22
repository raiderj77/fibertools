import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");
const blanketTool = read("src/app/blanket-calculator/BlanketCalculatorTool.tsx");
const blanketPage = read("src/app/blanket-calculator/page.tsx");
const blanketGuide = read("src/lib/guides.ts");
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

test("does not publish the unsupported FiberTools audience and sales statistics", () => {
  assert.doesNotMatch(homepage, /45 million Americans|\$3 billion/);
  assert.doesNotMatch(toolContent, /38 million Americans/);
});

test("uses swatch consumption instead of a generic blanket coverage factor", () => {
  assert.doesNotMatch(blanketTool, /ydsPerSqIn|gaugeRatio/);
  assert.match(blanketTool, /swatchWeight \* areaRatio \* 1\.1/);
  assert.match(blanketPage, /finished area ÷ swatch area × measured swatch grams × 1\.10 buffer/);
});

test("keeps the blanket guide aligned with the measured-swatch calculator", () => {
  assert.doesNotMatch(blanketGuide, /Figure out exactly how much yarn to buy for any blanket size/);
  assert.match(blanketGuide, /Estimate how much yarn to buy for a blanket from a measured swatch/);
  assert.match(blanketGuide, /90 × 100 inches for a queen/);
  assert.match(blanketGuide, /108 × 100 inches for a king/);
  assert.doesNotMatch(blanketGuide, /queen comes in at 90 × 90 inches/);
  assert.match(blanketGuide, /cannot derive yarn use reliably from gauge, blanket dimensions, and yarn-weight category alone/);
  assert.match(blanketGuide, /scales the grams used by a measured swatch made in your actual stitch pattern/);
  assert.match(blanketGuide, /yarn label's length and weight convert that result to total yardage and whole skeins/);
  assert.match(blanketGuide, /Gauge is used separately for stitch and row counts/);
  assert.match(blanketTool, /Yarn use cannot be derived reliably from gauge or yarn weight alone/);
});

test("links to the current Craft Yarn Council reference routes", () => {
  assert.match(blanketPage, /standards\/yarn-weight-system/);
  assert.match(toolLayout, /standards\/hooks-and-needles/);
  assert.doesNotMatch(toolLayout, /standards\/needle-hook-sizes/);
});

test("keeps the yarn calculator example aligned with its default quick estimate", () => {
  assert.match(yarnTool, /worsted:.*ydsPerSqIn: 1\.3/);
  assert.match(toolContent, /3,900 base yards/);
  assert.match(toolContent, /4,290 yards/);
  assert.match(toolContent, /20 skeins/);
  assert.doesNotMatch(toolContent, /0\.018 yards per square inch|2,160 yards|2,376 yards/);
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
  assert.match(sockPage, /heel-turn guidance/);
  assert.match(tools, /"blanket-calculator": \["cast-on-calculator", "yarn-calculator"/);
});

test("keeps the contextual yarn, cast-on, sock, and raglan journey connected", () => {
  for (const path of [
    "/yarn-calculator",
    "/cast-on-calculator",
    "/sock-calculator",
    "/raglan-calculator",
  ]) {
    assert.match(knittingToolsPage, new RegExp(`href="${path}"`));
  }

  assert.match(yarnPage, /href="\/raglan-calculator"/);
  assert.match(castOnPage, /href="\/sock-calculator"/);
  assert.match(sockPage, /href="\/cast-on-calculator"/);
  assert.match(raglanPage, /href="\/yarn-calculator"/);
  assert.match(raglanPage, /href="\/cast-on-calculator"/);
});
