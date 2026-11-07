import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildColorCombination,
  buildPaletteShareQuery,
  parsePaletteShareQuery,
  COLOR_COMBINATION_LIMITS,
  contrastRatio,
  describeColor,
  relativeLuminance,
} from "../src/lib/color-combinations.mjs";
import { extractPhotoPalette } from "../src/lib/photo-palette.mjs";

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

test("photo extraction returns dominant colors with shares and skips transparent pixels", () => {
  const pixels = [];
  const push = (r, g, b, a, times) => {
    for (let index = 0; index < times; index += 1) pixels.push(r, g, b, a);
  };
  push(200, 30, 30, 255, 100);
  push(30, 30, 200, 255, 50);
  push(255, 255, 255, 0, 40);
  const extracted = extractPhotoPalette(new Uint8ClampedArray(pixels));
  assert.equal(extracted.ok, true);
  assert.deepEqual(extracted.colors, [
    { hex: "#C81E1E", sharePercent: 67 },
    { hex: "#1E1EC8", sharePercent: 33 },
  ]);
});

test("photo extraction merges near-identical colors and rejects unreadable input", () => {
  const pixels = [];
  const push = (r, g, b, times) => {
    for (let index = 0; index < times; index += 1) pixels.push(r, g, b, 255);
  };
  push(205, 32, 32, 60);
  push(198, 28, 28, 55);
  push(40, 140, 70, 30);
  const extracted = extractPhotoPalette(new Uint8ClampedArray(pixels));
  assert.equal(extracted.ok, true);
  assert.equal(extracted.colors.length, 2);
  assert.equal(extractPhotoPalette(new Uint8ClampedArray([])).ok, false);
  assert.equal(extractPhotoPalette(new Uint8ClampedArray([1, 2, 3])).ok, false);
  assert.equal(extractPhotoPalette(new Uint8ClampedArray([9, 9, 9, 0])).ok, false);
});

test("palette share links round-trip supported values and drop unsupported ones", () => {
  const query = buildPaletteShareQuery({
    baseColor: "#3B6EA5",
    mode: "standard",
    project: "blanket",
    colorCount: 4,
    yarnForm: "solids",
  });
  assert.equal(query, "c=3B6EA5&m=standard&p=blanket&n=4&y=solids");
  assert.deepEqual(parsePaletteShareQuery("?c=3B6EA5&m=wild&p=quilt&n=5&y=one-variegated"), {
    baseColor: "#3B6EA5",
    mode: "wild",
    project: "quilt",
    colorCount: 5,
    yarnForm: "one-variegated",
  });
  assert.deepEqual(parsePaletteShareQuery("?c=ZZZZZZ&m=nope&n=9&y=plaid"), {});
  assert.equal(buildPaletteShareQuery({ baseColor: "blue" }), "");
});

test("the grayscale preview re-encodes luminance to sRGB so neutral grays stay unchanged", () => {
  const gray = buildColorCombination({ baseColor: "#808080", mode: "standard", colorCount: 3 });
  assert.equal(gray.ok, true);
  assert.equal(gray.palette[0].grayscaleHex, "#808080");
  const white = buildColorCombination({ baseColor: "#FFFFFF", mode: "standard", colorCount: 3 });
  assert.equal(white.palette[0].grayscaleHex, "#FFFFFF");
  const black = buildColorCombination({ baseColor: "#000000", mode: "standard", colorCount: 3 });
  assert.equal(black.palette[0].grayscaleHex, "#000000");
  const blue = buildColorCombination({ baseColor: "#3B6EA5", mode: "standard", colorCount: 3 });
  assert.notEqual(blue.palette[0].grayscaleHex, "#272727");
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
  assert.match(tool, /useToolCompletion\("color-combination-generator", result, !embedded && Boolean\(result\)\)/);
  assert.doesNotMatch(tool, /guaranteed to match|perfect palette/i);
});

test("the UI supports embed mode, photo starts, surprise picks, and palette sharing", () => {
  assert.match(tool, /\{ embedded = false \}: \{ embedded\?: boolean \}/);
  assert.match(tool, /id="combo-photo"/);
  assert.match(tool, /extractPhotoPalette/);
  assert.match(tool, /The photo stayed on your device/);
  assert.match(tool, /Surprise me with a different main color/);
  assert.match(tool, /Copy palette link/);
  assert.match(tool, /parsePaletteShareQuery\(window\.location\.search\)/);
  assert.match(tool, /\{!embedded \? \([\s\S]*?Copy palette/);
  const engine = readFileSync(new URL("../src/lib/color-combinations.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(engine, /Math\.random/);
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
