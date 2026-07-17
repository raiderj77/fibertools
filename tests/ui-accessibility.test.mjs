import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

const layout = read("src/app/layout.tsx");
const header = read("src/components/Header.tsx");
const newsletter = read("src/components/BeehiivSignup.tsx");
const cookieConsent = read("src/components/CookieConsent.tsx");
const printShare = read("src/components/PrintShareButtons.tsx");
const globals = read("src/app/globals.css");
const blanket = read("src/app/blanket-calculator/BlanketCalculatorTool.tsx");
const circle = read("src/app/circle-calculator/CircleCalculatorTool.tsx");
const shapes = read("src/app/amigurumi-shapes/AmigurumiShapesTool.tsx");
const yarn = read("src/app/yarn-calculator/YarnCalculatorTool.tsx");
const weaving = read("src/app/weaving-sett-calculator/WeavingSettCalculatorTool.tsx");
const abbreviations = read("src/app/abbreviation-glossary/AbbreviationGlossaryTool.tsx");
const stitchReference = read("src/app/stitch-quick-reference/StitchQuickReferenceTool.tsx");
const patternChecker = read("src/app/amigurumi-pattern-checker/page.tsx");
const knittingNeedles = read("src/app/best-knitting-needles/page.tsx");

test("provides a focusable main landmark and keyboard-operable mobile navigation", () => {
  assert.match(layout, /<main id="main-content" tabIndex=\{-1\}/);
  assert.match(header, /e\.key === "Escape"/);
  assert.match(header, /aria-controls="mobile-navigation"/);
  assert.match(header, /mobileOpen \? "Close menu" : "Open menu"/);
  assert.match(header, /min-h-11 min-w-11/);
});

test("labels the newsletter, cookie choices, and high-traffic calculator controls", () => {
  assert.match(newsletter, /htmlFor="newsletter-email"/);
  assert.match(newsletter, /id="newsletter-email"/);
  assert.match(cookieConsent, /aria-describedby="cookie-consent-description"/);

  for (const id of [
    "blanket-overhang",
    "blanket-yarn-weight",
    "blanket-gauge-stitches",
    "blanket-gauge-rows",
    "blanket-gauge-over",
    "blanket-stitch-multiple",
    "blanket-multiple-extra",
    "blanket-skein-length",
    "blanket-skein-grams",
  ]) {
    assert.match(blanket, new RegExp(`htmlFor="${id}"`));
    assert.match(blanket, new RegExp(`id="${id}"`));
  }

  assert.match(circle, /htmlFor="circle-rounds"/);
  assert.match(circle, /id="circle-rounds"/);
  assert.match(shapes, /htmlFor="shape-total-rounds"/);
  assert.match(shapes, /id="shape-total-rounds"/);
});

test("exposes selected choices and usable touch targets", () => {
  assert.match(blanket, /aria-pressed=\{i === sizeIdx\}/);
  assert.match(circle, /aria-pressed=\{stitchKey === st\.key\}/);
  assert.match(shapes, /aria-pressed=\{shape === s\.key\}/);
  assert.match(printShare, /min-h-11/);
  assert.match(circle, /className="h-11 w-full accent-sage-600"/);
  assert.match(shapes, /className="h-11 w-full accent-sage-600"/);
  assert.match(globals, /w-6 h-6 rounded-full/);
});

test("makes both skein inputs affect the blanket recommendation", () => {
  assert.match(blanket, /parseFloat\(skeinYards\)/);
  assert.match(blanket, /parseFloat\(skeinGrams\)/);
  assert.match(blanket, /Math\.max\(skeinsByLength, skeinsByWeight\)/);
  assert.match(blanket, /skeinYards, skeinGrams, yw/);
  assert.match(blanket, /whichever\s+estimate is higher/);
});

test("announces copy, share, success, and error feedback", () => {
  assert.match(printShare, /aria-live="polite"/);
  assert.match(circle, /aria-live="polite"/);
  assert.match(shapes, /aria-live="polite"/);
  assert.match(newsletter, /role="status"/);
  assert.match(newsletter, /role="alert"/);
});

test("names filters and makes horizontally scrolling reference tables keyboard accessible", () => {
  for (const id of ["yarn-project-type", "yarn-project-size", "yarn-weight", "yarn-stitch-pattern"]) {
    assert.match(yarn, new RegExp(`htmlFor="${id}"`));
    assert.match(yarn, new RegExp(`id="${id}"`));
  }

  for (const id of ["weaving-yarn-weight", "weaving-structure", "weaving-fiber-type", "weaving-reed-dent"]) {
    assert.match(weaving, new RegExp(`htmlFor="${id}"`));
    assert.match(weaving, new RegExp(`id="${id}"`));
  }

  assert.match(abbreviations, /aria-label="Filter abbreviations by craft"/);
  assert.match(abbreviations, /aria-label="Filter abbreviations by category"/);
  assert.match(stitchReference, /aria-label="Filter stitches by craft"/);
  assert.match(patternChecker, /tabIndex=\{0\} aria-label="Pattern instruction reference table"/);
  assert.match(knittingNeedles, /tabIndex=\{0\} aria-label="Beginner knitting needle comparison table"/);
});
