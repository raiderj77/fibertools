import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  MAX_UK_US_TEXT_LENGTH,
  UK_TO_US_MAPPINGS,
  US_TO_UK_MAPPINGS,
  convertUkUsTerms,
} from "../src/lib/uk-us-converter.mjs";

test("golden-converts every mapped UK source term to its US term", () => {
  for (const { from, to } of UK_TO_US_MAPPINGS) {
    const result = convertUkUsTerms(from, "uk-to-us");
    assert.equal(result.status, "ready", from);
    assert.equal(result.output, to, from);
    assert.equal(result.replacementCount, 1, from);
  }
});

test("golden-converts every canonical US source term to its UK term", () => {
  for (const { from, to } of US_TO_UK_MAPPINGS) {
    const result = convertUkUsTerms(from, "us-to-uk");
    assert.equal(result.status, "ready", from);
    assert.equal(result.output, to, from);
    assert.equal(result.replacementCount, 1, from);
  }
});

test("longest tokens are replaced once without cascading through generated output", () => {
  const uk = convertUkUsTerms(
    "double treble crochet; treble crochet; double crochet; dtr tr dc; tension square; tension",
    "uk-to-us",
  );
  assert.equal(uk.status, "ready");
  assert.equal(
    uk.output,
    "treble crochet; double crochet; single crochet; tr dc sc; gauge swatch; gauge",
  );
  assert.equal(uk.replacementCount, 8);

  const us = convertUkUsTerms("treble crochet; double crochet; single crochet; tr dc sc", "us-to-uk");
  assert.equal(us.status, "ready");
  assert.equal(us.output, "double treble crochet; treble crochet; double crochet; dtr tr dc");
});

test("converts the bare double-treble term advertised by the UI", () => {
  const result = convertUkUsTerms("Work a double treble in next stitch", "uk-to-us");
  assert.equal(result.status, "ready");
  assert.equal(result.output, "Work a treble crochet in next stitch");
  assert.equal(result.replacementCount, 1);
});

test("preserves non-mapped text, punctuation, count prefixes, and case", () => {
  const input = "Row 1: 1DC, 2htr, dc2tog; CH 3. Keep this note exactly.\nTension Square.";
  const result = convertUkUsTerms(input, "uk-to-us");
  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "Row 1: 1SC, 2hdc, sc2tog; CH 3. Keep this note exactly.\nGauge Swatch.",
  );
  assert.equal(result.replacementCount, 4);
});

test("invalid direction or non-string input fails closed", () => {
  assert.equal(convertUkUsTerms("dc", "sideways").status, "invalid");
  assert.equal(convertUkUsTerms(null, "uk-to-us").status, "invalid");
  assert.equal(convertUkUsTerms("x".repeat(MAX_UK_US_TEXT_LENGTH + 1), "uk-to-us").status, "invalid");
});

test("the converter UI imports the pure one-pass helper", () => {
  const source = fs.readFileSync("src/app/uk-to-us-converter/UKToUSConverterTool.tsx", "utf8");
  assert.match(source, /convertUkUsTerms/);
  assert.match(source, /replacementCount/);
  assert.match(source, /maxLength=\{MAX_UK_US_TEXT_LENGTH\}/);
  assert.doesNotMatch(source, /for \(const pair of pairs\)/);
});

test("public converter copy is crochet-scoped and does not promise full translation", () => {
  const tool = fs.readFileSync("src/app/uk-to-us-converter/UKToUSConverterTool.tsx", "utf8");
  const page = fs.readFileSync("src/app/uk-to-us-converter/page.tsx", "utf8");
  assert.match(page, /Text outside its term map stays unchanged/);
  assert.match(page, /not as a complete pattern translation or validation/);
  assert.doesNotMatch(page, /Knitting & Crochet Terms Converter|automatic pattern text conversion/);
  assert.doesNotMatch(tool, /every term gets swapped|handles the full chain/i);
});
