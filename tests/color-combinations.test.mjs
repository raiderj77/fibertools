import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildColorCombination,
  COLOR_COMBINATION_LIMITS,
  contrastRatio,
  describeColor,
  relativeLuminance,
} from "../src/lib/color-combinations.mjs";

const tool = readFileSync(
  new URL("../src/app/color-combination-generator/ColorCombinationTool.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../src/app/color-combination-generator/page.tsx", import.meta.url),
  "utf8",
);

test("standard mode builds a complete four-color palette with shares and a 20-block stripe cycle", () => {
  const result = buildColorCombination({
    baseColor: "#3B6EA5",
    mode: "standard",
    project: "blanket",
    colorCount: 4,
    yarnForm: "solids",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(
    result.palette.map(({ role, hex, sharePercent }) => ({ role, hex, sharePercent })),
    [
      { role: "Main", hex: "#3B6EA5", sharePercent: 50 },
      { role: "Support", hex: "#554FBA", sharePercent: 22 },
      { role: "Accent", hex: "#C49159", sharePercent: 10 },
      { role: "Neutral", hex: "#DDE0E4", sharePercent: 18 },
    ],
  );
  assert.equal(result.palette.reduce((sum, color) => sum + color.sharePercent, 0), 100);
  assert.deepEqual(result.stripeSequence.map(({ blocks }) => blocks), [10, 4, 2, 4]);
  assert.equal(result.stripeSequence.reduce((sum, entry) => sum + entry.blocks, 0), 20);
  assert.equal(result.palette[0].contrastWithMain, 1);
  assert.equal(result.palette[3].valueLabel, "Light");
});

test("the worked example flags the main and support pair as low value contrast", () => {
  const result = buildColorCombination({
    baseColor: "#3B6EA5",
    mode: "standard",
    project: "blanket",
    colorCount: 4,
    yarnForm: "solids",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(
    result.lowContrastPairs.map(({ firstRole, secondRole, ratio }) => ({ firstRole, secondRole, ratio })),
    [{ firstRole: "Main", secondRole: "Support", ratio: 1.23 }],
  );
  assert.match(result.lowContrastPairs[0].message, /may blend in fine stripes or motifs/);
});

test("every mode returns the requested number of distinct colors", () => {
  for (const mode of ["standard", "mixed", "wild", "soft", "earthy", "monochrome"]) {
    for (const colorCount of [3, 4, 5]) {
      const result = buildColorCombination({
        baseColor: "#7A4E8C",
        mode,
        project: "garment",
        colorCount,
        yarnForm: "solids",
      });
      assert.equal(result.ok, true, mode);
      assert.equal(result.palette.length, colorCount, mode);
      assert.equal(new Set(result.palette.map(({ hex }) => hex)).size, colorCount, mode);
      assert.equal(result.palette.reduce((sum, color) => sum + color.sharePercent, 0), 100, mode);
    }
  }
});

test("wild mode changes the palette materially and gives the several-variegated warning", () => {
  const standard = buildColorCombination({
    baseColor: "#3B6EA5",
    mode: "standard",
    project: "granny-squares",
    colorCount: 5,
    yarnForm: "several-variegated",
  });
  const wild = buildColorCombination({
    baseColor: "#3B6EA5",
    mode: "wild",
    project: "granny-squares",
    colorCount: 5,
    yarnForm: "several-variegated",
  });

  assert.equal(standard.ok, true);
  assert.equal(wild.ok, true);
  assert.notDeepEqual(
    wild.palette.map(({ hex }) => hex),
    standard.palette.map(({ hex }) => hex),
  );
  assert.match(wild.yarnGuidance, /choose one to lead/);
  assert.ok(wild.avoid.some((item) => item.includes("several variegated yarns in equal shares")));
});

test("monochrome keeps an achromatic main color achromatic", () => {
  const result = buildColorCombination({
    baseColor: "#FFFFFF",
    mode: "monochrome",
    project: "garment",
    colorCount: 5,
    yarnForm: "solids",
  });

  assert.equal(result.ok, true);
  assert.deepEqual(
    result.palette.map(({ hex }) => hex),
    ["#FFFFFF", "#D3CFCF", "#ABA6A6", "#766F6F", "#3B352B"],
  );
  assert.ok(result.palette.every(({ hsl }) => hsl.s <= 16));
});

test("luminance, contrast, and color names use the documented color math", () => {
  assert.equal(relativeLuminance("#000000"), 0);
  assert.equal(relativeLuminance("#FFFFFF"), 1);
  assert.equal(Number(contrastRatio("#000000", "#FFFFFF").toFixed(2)), 21);
  assert.equal(describeColor("#3B6EA5"), "Blue");
  assert.equal(describeColor("#DDE0E4"), "Cream");
  assert.equal(describeColor("#000000"), "Black");
});

test("rejects malformed colors and unsupported options before building a palette", () => {
  const valid = {
    baseColor: "#3B6EA5",
    mode: "standard",
    project: "blanket",
    colorCount: 4,
    yarnForm: "solids",
  };
  const invalidInputs = [
    { ...valid, baseColor: "blue" },
    { ...valid, baseColor: "#12345" },
    { ...valid, mode: "random" },
    { ...valid, project: "castle" },
    { ...valid, yarnForm: "all-variegated" },
    { ...valid, colorCount: COLOR_COMBINATION_LIMITS.minColors - 1 },
    { ...valid, colorCount: COLOR_COMBINATION_LIMITS.maxColors + 1 },
    { ...valid, colorCount: 3.5 },
    { ...valid, colorCount: "4" },
  ];

  for (const input of invalidInputs) {
    const result = buildColorCombination(input);
    assert.equal(result.ok, false, JSON.stringify(input));
    assert.equal(result.palette, undefined, "invalid input must not return a palette");
  }
});

test("the UI wires every control into the deterministic palette builder", () => {
  assert.match(tool, /from "@\/lib\/color-combinations\.mjs"/);
  assert.match(tool, /buildColorCombination\(\{[\s\S]*baseColor,[\s\S]*mode,[\s\S]*project,[\s\S]*colorCount,[\s\S]*yarnForm/);
  assert.match(tool, /id="combo-base-color"/);
  assert.match(tool, /name="combo-mode"/);
  assert.match(tool, /id="combo-project"/);
  assert.match(tool, /name="combo-color-count"/);
  assert.match(tool, /id="combo-yarn-form"/);
  assert.match(tool, /Grayscale value check/);
  assert.match(tool, /Text version of the stripe cycle/);
  assert.match(tool, /useToolCompletion\("color-combination-generator", result\)/);
  assert.doesNotMatch(tool, /Math\.random|guaranteed to match|perfect palette/i);
});

test("the page states the method and limits without promising an exact fabric result", () => {
  assert.match(page, /Color Combination Generator/);
  assert.match(page, /Hue rotations, saturation and lightness changes/);
  assert.match(page, /does not prove that two dyed yarns will look the same on screen and in the project/);
  assert.match(page, /Standard is best for/);
  assert.match(page, /Wild is not for/);
  assert.match(page, /Checklist:/);
  assert.doesNotMatch(page, /best color combinations on the market|perfect for every project/i);
});
