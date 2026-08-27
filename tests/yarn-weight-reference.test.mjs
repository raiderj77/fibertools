import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { YARN_WEIGHTS, compareYarnLabels, filterYarnWeights } from "../src/lib/yarn-weight-reference.mjs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const component = read("src/app/yarn-weight-chart/YarnWeightChartTool.tsx");
const page = read("src/app/yarn-weight-chart/page.tsx");
const content = read("src/lib/toolContent.ts").split('  "yarn-weight-chart": {')[1].split('  "stitch-counter": {')[0];
const faqs = read("src/lib/faqs.ts").split('  "yarn-weight-chart": [')[1].split('  "stitch-counter": [')[0];

test("all eight rows retain exact CYC knitting, needle, and hook guidelines", () => {
  // Independent fixture from the CYC yarn-weight-system reference, 2026-08-26.
  const expected = [
    ["0", "33–40", "1.5–2.25 mm", "000–1", "Steel 1.4–1.6 mm; regular 2.25 mm", "Steel 6, 7, 8; regular B/1"],
    ["1", "27–32", "2.25–3.25 mm", "1–3", "2.25–3.5 mm", "B/1–E/4"],
    ["2", "23–26", "3.25–3.75 mm", "3–5", "3.5–4.5 mm", "E/4–7"],
    ["3", "21–24", "3.75–4.5 mm", "5–7", "4.5–5.5 mm", "7–I/9"],
    ["4", "16–20", "4.5–5.5 mm", "7–9", "5.5–6.5 mm", "I/9–K/10½"],
    ["5", "12–15", "5.5–8 mm", "9–11", "6.5–9 mm", "K/10½–M/13"],
    ["6", "7–11", "8–12.75 mm", "11–17", "9–15 mm", "M/13–Q"],
    ["7", "6 or fewer", "12.75 mm and larger", "17 and larger", "15 mm and larger", "Q and larger"],
  ];
  assert.deepEqual(YARN_WEIGHTS.map((weight) => [
    weight.number, weight.knitGaugeStPer4in, weight.needleMm, weight.needleUS,
    weight.hookMm, weight.hookUS,
  ]), expected);
});

test("search distinguishes regional ply names from category numbers", () => {
  const categories = (query) => filterYarnWeights(query).map((weight) => weight.number);
  assert.equal(filterYarnWeights("  ").length, 8);
  assert.deepEqual(categories("4"), ["4"]);
  assert.deepEqual(categories("4-ply"), ["1"]);
  assert.deepEqual(categories("4 ply"), ["1"]);
  assert.deepEqual(categories("4ply"), ["1"]);
  assert.deepEqual(categories("ply 4"), ["1"]);
  assert.deepEqual(categories("1 ply"), ["0"]);
  assert.deepEqual(categories("2 ply"), ["0"]);
  assert.deepEqual(categories("3 ply"), ["1"]);
  assert.deepEqual(categories("12 ply"), ["5"]);
  assert.deepEqual(categories("14 ply"), ["6"]);
  assert.deepEqual(categories("16 ply"), ["6"]);
  assert.deepEqual(categories("0 ply"), []);
  assert.deepEqual(categories("6 ply"), []);
  assert.deepEqual(categories("  8   PLY  "), ["3"]);
  assert.deepEqual(categories("dK"), ["3"]);
  assert.deepEqual(categories("DOUBLE KNITTING"), ["3"]);
  assert.deepEqual(categories("not-a-yarn"), []);
  assert.deepEqual(categories("8"), []);
});

test("requires both valid categories, including accepting category zero", () => {
  for (const [first, second] of [["", "4"], ["4", ""], ["8", "4"], ["-1", "0"], ["0abc", "0"], [null, "4"]]) {
    assert.equal(compareYarnLabels(first, second), null);
  }
  assert.equal(compareYarnLabels("0", "0").title, "Same category — swatch required");
});

test("every category pairing requires a swatch without a compatibility score", () => {
  for (const first of YARN_WEIGHTS) {
    for (const second of YARN_WEIGHTS) {
      for (const yardages of [["", ""], ["2.2", "2.2"], ["0.1", "10"]]) {
        const result = compareYarnLabels(first.number, second.number, ...yardages);
        assert.equal(result.requiresSwatch, true);
        assert.equal(result.categoryDifference, Math.abs(Number(first.number) - Number(second.number)));
        assert.match(result.title, /swatch required/);
        assert.equal("score" in result, false);
        assert.doesNotMatch(JSON.stringify(result), /excellent|compatible substitute|% match/i);
      }
    }
  }
});

test("equal yardage never upgrades unrelated categories to an excellent match", () => {
  const result = compareYarnLabels("0", "7", "2.2", "2.2");
  assert.equal(result.title, "Different categories — swatch required");
  assert.equal(result.categoryDifference, 7);
  assert.equal(result.yardageError, "");
  assert.match(result.notes[1], /2.2 yd\/g for the pattern yarn and 2.2 yd\/g for the substitute/);
  assert.match(result.notes[1], /do not establish matching gauge/);
});

test("adjacent categories do not prescribe a needle-size change", () => {
  const result = compareYarnLabels("3", "4");
  assert.equal(result.title, "Adjacent categories — swatch required");
  assert.match(result.notes[0], /not a measured gauge difference or a needle-size adjustment/);
});

test("invalid or incomplete optional yardage is not treated as usable evidence", () => {
  for (const value of ["", " ", "0", "-1", "NaN", "Infinity", "1e309", "2.2yards", null, undefined]) {
    for (const inputs of [[value, "2.2"], ["2.2", value]]) {
      const result = compareYarnLabels("4", "4", ...inputs);
      assert.match(result.yardageError, /positive, finite yards per gram for both yarns/);
      assert.equal(result.notes.length, 1);
      assert.equal(result.requiresSwatch, true);
    }
  }
  assert.equal(compareYarnLabels("4", "4", "", "").yardageError, "");
  assert.equal(compareYarnLabels("4", "4", " 2.2 ", "2.5").yardageError, "");
});

test("the rendered component uses the tested reference and swatch-first comparison", () => {
  assert.match(component, /from "@\/lib\/yarn-weight-reference\.mjs"/);
  assert.match(component, /compareYarnLabels\(yarn1Weight, yarn2Weight, yarn1Ypg, yarn2Ypg\)/);
  assert.match(component, /filterYarnWeights\(search\)/);
  assert.match(component, /\{w\.knitGaugeStPer4in\} st/);
  assert.match(component, /\{w\.needleMm\}/);
  assert.match(component, /\{w\.hookMm\}/);
  assert.match(component, /Knitting gauge/);
  assert.match(component, /stockinette stitches per 4 inches/);
  assert.match(component, /These are not crochet gauge ranges/);
  assert.match(component, /standards\/yarn-weight-system/);
  assert.match(component, /standards\/faqs/);
  assert.doesNotMatch(component, /Compatibility:|subResult\.score|Excellent match|excellent substitute|ydsPerGram|stockinette or single crochet/);
});

test("comparison controls expose labels, selected state, and validation feedback", () => {
  for (const id of ["pattern-yarn-category", "substitute-yarn-category", "pattern-yarn-yardage", "substitute-yarn-yardage"]) {
    assert.ok(component.includes(`htmlFor="${id}"`));
    assert.ok(component.includes(`id="${id}"`));
  }
  assert.match(component, /aria-pressed=\{tab === key\}/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /id="yarn-yardage-error" role="alert"/);
  assert.match(component, /role="region" aria-label="Yarn weight reference table"/);
  assert.match(component, /aria-expanded=\{highlightWeight === w\.number\}/);
  assert.match(component, /onClick=\{\(\) => setHighlightWeight\(\(current\) => current === w\.number \? null : w\.number\)\}/);
});

test("education, FAQs, metadata, and next step agree with the corrected checker", () => {
  assert.match(content, /Every result requires a swatch/);
  assert.match(content, /gauge column is knitting only/);
  assert.match(content, /Regional ply names are approximate/);
  assert.match(faqs, /21–24 stockinette stitches per 4 inches/);
  assert.match(faqs, /ranges overlap/);
  for (const source of [component, content, faqs, page]) {
    assert.doesNotMatch(source, /will produce similar gauge|nearly the same gauge|most reliable way to compare|excellent substitute|map directly to specific CYC|go up one needle size|dark dyes especially|fabric will be loose and sloppy/);
  }
  assert.doesNotMatch(page, /Check substitution compatibility|crochet-color-trends/);
  assert.match(page, /href="\/gauge-calculator"/);
  assert.equal((page.match(/verify substitutions with a swatch/g) || []).length, 3);
});
