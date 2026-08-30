import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (file) => fs.readFileSync(file, "utf8");

const spinningFiles = [
  "src/app/spinning-ratio-calculator/SpinningCalculatorTool.tsx",
  "src/app/spinning-ratio-calculator/page.tsx",
  "src/app/weaving-tools/page.tsx",
  "src/lib/tools.ts",
  "src/lib/faqs.ts",
  "src/lib/toolContent.ts",
  "src/lib/guides.ts",
  "public/llms.txt",
  "public/llms-full.txt",
];

const blockingFiles = [
  "src/app/blocking-calculator/BlockingCalculatorTool.tsx",
  "src/app/blocking-calculator/page.tsx",
  "src/app/page.tsx",
  "src/app/knitting-tools/page.tsx",
  "src/app/cast-on-calculator/page.tsx",
  "src/app/cast-on-calculator/CastOnCalculatorTool.tsx",
  "src/app/abbreviation-glossary/AbbreviationGlossaryTool.tsx",
  "src/app/wpi-calculator/page.tsx",
  "src/lib/tools.ts",
  "src/lib/faqs.ts",
  "src/lib/toolContent.ts",
  "src/lib/guides.ts",
  "public/llms.txt",
  "public/llms-full.txt",
];

test("active spinning consumers stay within the geometric-ratio contract", () => {
  const source = spinningFiles.map(read).join("\n");

  for (const unsupported of [
    /per treadle/i,
    /treadle cycle/i,
    /matchingWeight/,
    /suggested plying twist/i,
    /reference chart matches whorl ratios/i,
    /plan fiber quantities for a target yarn weight/i,
    /supports scotch tension, double drive/i,
  ]) {
    assert.doesNotMatch(source, unsupported);
  }

  assert.match(source, /ideal geometric ratio/i);
  assert.match(source, /wheel manual/i);
  assert.match(source, /effective (?:drive-)?wheel band-path diameter/i);
  assert.match(source, /outside or flange diameters|outside flanges|outer flange/i);
  assert.match(source, /does not determine twists per inch/i);
});

test("active blocking consumers stay within arithmetic, care-instruction, and swatch limits", () => {
  const source = blockingFiles.map(read).join("\n");

  for (const unsupported of [
    /stretch feasibility ratings/i,
    /get the right blocking method/i,
    /recommended blocking method/i,
    /fiber lookup table maps each fiber/i,
    /block every square/i,
    /steam for acrylic/i,
    /natural fibers (?:like [^.]+ )?(?:grow|can increase).*\d/i,
    /spray blocking is the safest/i,
  ]) {
    assert.doesNotMatch(source, unsupported);
  }

  assert.match(source, /signed percentage change/i);
  assert.match(source, /representative swatch/i);
  assert.match(source, /care instructions/i);
  assert.match(source, /does not (?:choose|recommend) a finishing method/i);
});
