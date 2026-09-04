import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  MAX_VINTAGE_PATTERN_TEXT_LENGTH,
  SUPPORTED_VINTAGE_UK_TERMS,
  decodeVintagePattern,
} from "../src/lib/vintage-pattern-decoder.mjs";

test("unknown convention preserves valid US double-crochet text byte-for-byte", () => {
  const input = "Row 1: Double crochet in each stitch; dc in the last stitch.\nKeep punctuation.";
  const startedAt = performance.now();
  const result = decodeVintagePattern(input, "unknown");
  const elapsed = performance.now() - startedAt;

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
  assert.deepEqual(result.substitutions, []);
  assert.deepEqual(result.segments, [{ type: "text", content: input }]);
  assert.ok(elapsed < 2_000, `expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("US convention never rewrites double crochet or dc", () => {
  const input = "Double crochet, dc, 2dc in next stitch, and a US treble crochet.";
  const result = decodeVintagePattern(input, "us");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
});

test("only explicit UK mode maps the supported UK terms", () => {
  const input = "Double crochet, dc; treble crochet, tr; half treble crochet; tension square.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "single crochet (sc), single crochet (sc); double crochet (dc), double crochet (dc); half double crochet (hdc); gauge square.",
  );
  assert.equal(result.substitutionCount, 6);
  assert.equal(result.substitutions.find((term) => term.label === "Double crochet")?.count, 2);
});

test("plain bounded Work commands preserve the complete public result contract", () => {
  for (const [input, expected, count] of [
    [
      "Work dc in next stitch.",
      "Work single crochet (sc) in next stitch.",
      1,
    ],
    [
      "Work dc and tr in next stitch.",
      "Work single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "WORK DOUBLE CROCHET AND TREBLE CROCHET INTO THE SAME SPACE!",
      "WORK single crochet (sc) AND double crochet (dc) INTO THE SAME SPACE!",
      2,
    ],
    [
      "   Work\thtr and dtr into every stitch?\t",
      "   Work\thalf double crochet (hdc) and treble crochet (tr) into every stitch?\t",
      2,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.status, "ready", input);
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    assert.equal(result.segments.filter(({ type }) => type === "sub").length, count, input);
    assert.equal(result.substitutions.reduce((sum, item) => sum + item.count, 0), count, input);
    assert.deepEqual(result.signals, [], input);
  }

  for (const code of [
    "\tWork dc and tr in next stitch.",
    "    Work dc and tr in next stitch.",
    ">     Work dc and tr in next stitch.",
  ]) {
    for (const convention of ["uk", "unknown"]) {
      const codeResult = decodeVintagePattern(code, convention);
      assert.equal(codeResult.output, code, `${convention}: ${code}`);
      assert.equal(codeResult.substitutionCount, 0, `${convention}: ${code}`);
      assert.deepEqual(codeResult.signals, [], `${convention}: ${code}`);
    }
  }

  const prose = "Work dc and tr in next stitch as a glossary example.";
  const proseResult = decodeVintagePattern(prose, "uk");
  assert.equal(proseResult.output, prose);
  assert.equal(proseResult.substitutionCount, 0);

  const linked = "Work [dc](a) and tr in next stitch.";
  const linkedResult = decodeVintagePattern(linked, "uk");
  assert.equal(
    linkedResult.output,
    "Work [single crochet (sc)](a) and double crochet (dc) in next stitch.",
  );
  assert.equal(linkedResult.substitutionCount, 2);
});

test("closed fast paths preserve strict list, prose, group, and contamination contracts", () => {
  const verticalInputLines = [
    "double treble crochet",
    "double treble",
    "dtr",
    "half treble crochet",
    "half treble",
    "htr",
    "treble crochet",
    "treble",
    "tr",
    "double crochet",
    "dc",
    "tension square",
  ];
  const verticalOutputLines = [
    "treble crochet (tr)",
    "treble crochet (tr)",
    "treble crochet (tr)",
    "half double crochet (hdc)",
    "half double crochet (hdc)",
    "half double crochet (hdc)",
    "double crochet (dc)",
    "double crochet (dc)",
    "double crochet (dc)",
    "single crochet (sc)",
    "single crochet (sc)",
    "gauge square",
  ];

  const startedAt = performance.now();
  for (const newline of ["\n", "\r\n"]) {
    const input = verticalInputLines.join(newline);
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, verticalOutputLines.join(newline));
    assert.equal(result.substitutionCount, 12);
  }

  for (const [input, expected, count] of [
    [
      "Round 2: dc, tr, dtr.",
      "Round 2: single crochet (sc), double crochet (dc), treble crochet (tr).",
      3,
    ],
    [
      "Work (dc, tr) in next stitch.",
      "Work (single crochet (sc), double crochet (dc)) in next stitch.",
      2,
    ],
    [
      "This says dc and tr in a glossary.",
      "This says dc and tr in a glossary.",
      0,
    ],
    [
      "This says dc and tr in a glossary. Work htr in next stitch.",
      "This says dc and tr in a glossary. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch. This says dc and tr in a glossary.",
      "Work half double crochet (hdc) in next stitch. This says dc and tr in a glossary.",
      1,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected closed fast-path matrix under 2,000 ms, received ${elapsed.toFixed(1)} ms`);

  for (const indent of ["\t", "    "]) {
    const code = verticalInputLines.map((line) => `${indent}${line}`).join("\n");
    const result = decodeVintagePattern(code, "uk");
    assert.equal(result.output, code, JSON.stringify(indent));
    assert.equal(result.substitutionCount, 0, JSON.stringify(indent));
  }

  for (const input of [
    "Round 2: dc, widget, dtr.",
    "Round 2: dc, tr, dtr appear in the glossary.",
    "Work (dc, widget, tr) in next stitch.",
    "Work (front post dc, tr) in next stitch.",
    "Work (dc, tr) in next stitch as an example.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  for (const tail of [
    "widget", "metadata", "notes", "theory", "journal", "record", "label", "example",
  ]) {
    const input = `Work dc in first dc, ${tail}.`;
    for (const convention of ["uk", "unknown"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, input, `${convention}: ${input}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${input}`);
      assert.deepEqual(result.signals, [], `${convention}: ${input}`);
    }
  }
});

test("optimized bounded decisions remain explicit public contracts", () => {
  for (const [input, expected, count] of [
    [
      "double treble crochet, double treble crochet",
      "treble crochet (tr), treble crochet (tr)",
      2,
    ],
    [
      "1) htr in first dc",
      "1) half double crochet (hdc) in first dc",
      1,
    ],
    [
      "1) dc and tr.",
      "1) dc and tr.",
      0,
    ],
    [
      "1) dc and tr in next stitch.",
      "1) single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "999999999) HTR in first dc!",
      "999999999) half double crochet (hdc) in first dc!",
      1,
    ],
    [
      "dc. , tr?",
      "dc. , tr?",
      0,
    ],
    [
      "1) Work half treble alone.",
      "1) Work half treble alone.",
      0,
    ],
    [
      "Work [double treble crochet](docs/guide), or double treble alone.",
      "Work [double treble crochet](docs/guide), or double treble alone.",
      0,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const input of [
    "1) Setup round= double crochet across",
    "### Sleeve: dc",
    "1. Crown➜ dc",
    "1. Begin here＝ htr in first dc",
  ]) {
    const result = decodeVintagePattern(input, "unknown");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
    assert.ok(
      result.signals.some(({ title }) => title === "Crochet convention not established"),
      input,
    );
  }
});

test("numbered shared lists with an ambiguous alone target fail closed consistently", () => {
  const startedAt = performance.now();
  for (const input of [
    "1. DC and TR alone.",
    "1) DC and TR alone.",
    "(1) DC and TR alone.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 1_000, `expected numbered alone denial under 1,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("numbered bare shared lists without a target fail closed atomically", () => {
  const startedAt = performance.now();
  for (const input of [
    "1. DOUBLE CROCHET, HALF TREBLE CROCHET.",
    "1) DOUBLE CROCHET, TREBLE CROCHET.",
    "(1) DC, TR.",
    "999999999) DTR, HTR?",
    "1. DOUBLE CROCHET AND HALF TREBLE CROCHET.",
    "1) DOUBLE CROCHET OR TREBLE CROCHET.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 1_000, `expected numbered bare-list denial under 1,000 ms, received ${elapsed.toFixed(1)} ms`);

  const targetStartedAt = performance.now();
  for (const [input, expected, count] of [
    [
      "1. DOUBLE CROCHET, HALF TREBLE CROCHET in next stitch.",
      "1. single crochet (sc), half double crochet (hdc) in next stitch.",
      2,
    ],
    [
      "1) DC, TR across.",
      "1) single crochet (sc), double crochet (dc) across.",
      2,
    ],
    [
      "(1) 2 DC, 3 HTR in each stitch.",
      "(1) 2 single crochet (sc), 3 half double crochet (hdc) in each stitch.",
      2,
    ],
    [
      "1. DC, HTR in first dc.",
      "1. single crochet (sc), half double crochet (hdc) in first dc.",
      2,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }
  const targetElapsed = performance.now() - targetStartedAt;
  assert.ok(targetElapsed < 1_000, `expected numbered target-list mapping under 1,000 ms, received ${targetElapsed.toFixed(1)} ms`);
});

test("numbered single-term instructions preserve supported marker parity", () => {
  const startedAt = performance.now();
  for (const marker of [
    "1.",
    "9.",
    "10.",
    "999999999.",
    "١.",
    "1)",
    "(1)",
    "999999999)",
    "(999999999)",
    "> 1.",
  ]) {
    const input = `${marker}\tHTR in first dc!`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${marker}\thalf double crochet (hdc) in first dc!`, input);
    assert.equal(result.substitutionCount, 1, input);
  }

  for (const [input, expected, count] of [
    ["1. HTR.", "1. half double crochet (hdc).", 1],
    ["1. HTR alone.", "1. half double crochet (hdc) alone.", 1],
    ["1. half treble alone.", "1. half treble alone.", 0],
    ["1. 2 DC in each stitch.", "1. 2 single crochet (sc) in each stitch.", 1],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 1_000, `expected supported numbered-marker parity under 1,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("overlong numbered markers fail closed locally within a bounded time", () => {
  const deniedInputs = [
    "1000000000) DTR, HTR?",
    "1000000000. DTR, HTR in next stitch.",
    "1000000000.Work DTR and HTR in next stitch.",
    "1000000000)Work DTR and HTR in next stitch.",
    "(1000000000)Work DTR and HTR in next stitch.",
    "(1000000000) Work DTR and HTR in next stitch.",
    "> 1000000000)\tDOUBLE CROCHET, HALF TREBLE CROCHET.",
    "> 1000000000.Work DOUBLE CROCHET and HALF TREBLE CROCHET.",
    ">1000000000.Work DOUBLE CROCHET and HALF TREBLE CROCHET.",
    "١٢٣٤٥٦٧٨٩٠) DC, TR across.",
  ];
  const startedAt = performance.now();
  for (const input of deniedInputs) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 1_000, `expected overlong numbered-marker denial under 1,000 ms, received ${elapsed.toFixed(1)} ms`);

  const valid = "Work dc in next stitch.";
  const mapped = "Work single crochet (sc) in next stitch.";
  for (const denied of [
    "1000000000) DTR, HTR?",
    "1000000000. HTR in first dc!",
    "1000000000. DC, HTR in next stitch.",
  ]) {
    for (const separator of [" ", "\n", "\r\n"]) {
      for (const [input, expected] of [
        [`${denied}${separator}${valid}`, `${denied}${separator}${mapped}`],
        [`${valid}${separator}${denied}`, `${mapped}${separator}${denied}`],
      ]) {
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, expected, input);
        assert.equal(result.substitutionCount, 1, input);
      }
    }
  }
});

test("fully quoted instructions fail closed locally within a bounded time", () => {
  const quotedControls = [
    "\"1. HTR in first dc!\"",
    "'1. HTR in first dc!'",
    "“1. HTR in first dc!”",
    "‘1. HTR in first dc!’",
    "> \"1. DC, HTR in next stitch.\"",
    "\"Work dc in next stitch.\"",
    "\"1. HTR in first dc\"",
  ];
  const startedAt = performance.now();
  for (const input of quotedControls) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
  for (const input of [
    "abc\"Work dc in next stitch.\"def",
    "abc“Work dc in next stitch.”def",
    "abc'1. HTR in first dc!'def",
    "abc\\\"Work dc in next stitch.\\\"def",
    "\"Work dc in next stitch.",
    "Work dc in next stitch.\"",
    "abc”Work dc in next stitch.",
    "Work dc \"HTR\" and tr in next stitch.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
  for (const [input, expected] of [
    [
      "Work dc \"HTR\" and tr in next stitch. Work htr in next stitch.",
      "Work dc \"HTR\" and tr in next stitch. Work half double crochet (hdc) in next stitch.",
    ],
    [
      "Work htr in next stitch. Work dc \"HTR\" and tr in next stitch.",
      "Work half double crochet (hdc) in next stitch. Work dc \"HTR\" and tr in next stitch.",
    ],
    [
      "Work dc \"HTR\" and tr in next stitch.\nWork htr in next stitch.",
      "Work dc \"HTR\" and tr in next stitch.\nWork half double crochet (hdc) in next stitch.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }
  for (const [input, expected] of [
    [
      "Rnd. 2: Work dc in next stitch. \"1. HTR in first dc!\" > 1. ### **R. 1**: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch. \"1. HTR in first dc!\" > 1. ### **R. 1**: Work treble crochet (tr) in next stitch.",
    ],
    [
      "Rnd. 2: Work dc in next stitch. \"1. HTR in first dc!\". **Rnd. 3**: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch. \"1. HTR in first dc!\". **Rnd. 3**: Work treble crochet (tr) in next stitch.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 2, input);
  }

  const valid = "Work dc in next stitch.";
  const mapped = "Work single crochet (sc) in next stitch.";
  for (const quoted of quotedControls.slice(0, 4)) {
    for (const separator of [" ", "\n", "\r\n"]) {
      for (const [input, expected] of [
        [`${quoted}${separator}${valid}`, `${quoted}${separator}${mapped}`],
        [`${valid}${separator}${quoted}`, `${mapped}${separator}${quoted}`],
      ]) {
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, expected, input);
        assert.equal(result.substitutionCount, 1, input);
      }
    }
  }
  for (const [input, expected] of [
    [`${quotedControls[0]}. ${valid}`, `${quotedControls[0]}. ${mapped}`],
    [`${valid}. ${quotedControls[0]}`, `${mapped}. ${quotedControls[0]}`],
    [`\"1. HTR in first dc\" ${valid}`, `\"1. HTR in first dc\" ${mapped}`],
    [`${valid} \"1. HTR in first dc\"`, `${mapped} \"1. HTR in first dc\"`],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected quoted-instruction isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("quoted block markers and gauge definitions stay local to neighboring instructions", () => {
  const startedAt = performance.now();
  for (const [input, expected, substitutionCount] of [
    [
      "Rnd. 4: Work dc in first dc, widget.\n> \"1. HTR in first dc!\"",
      "Rnd. 4: Work dc in first dc, widget.\n> \"1. HTR in first dc!\"",
      0,
    ],
    [
      "Rnd. 2: Work dc in next stitch. > \"1. DC, HTR in next stitch.\" **Rnd. 3**: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch. > \"1. DC, HTR in next stitch.\" **Rnd. 3**: Work treble crochet (tr) in next stitch.",
      2,
    ],
    [
      "Work dc in next stitch. \"Tension square: 20 dc = 4 inches\". Rnd. 2: Work htr in next stitch.",
      "Work single crochet (sc) in next stitch. \"Tension square: 20 dc = 4 inches\". Rnd. 2: Work half double crochet (hdc) in next stitch.",
      2,
    ],
    [
      "Work dc in next stitch. “Tension square: 20 dc = 4 inches”! **Rnd. 3**: Work dtr in next stitch.",
      "Work single crochet (sc) in next stitch. “Tension square: 20 dc = 4 inches”! **Rnd. 3**: Work treble crochet (tr) in next stitch.",
      2,
    ],
    [
      "Rnd. 4: Work dc in first dc, widget.\n> * \"1. HTR in first dc!\"",
      "Rnd. 4: Work dc in first dc, widget.\n> * \"1. HTR in first dc!\"",
      0,
    ],
    [
      "Rnd. 2: Work dc in next stitch. > * \"1. HTR in first dc!\" > 1. ### **R. 1**: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch. > * \"1. HTR in first dc!\" > 1. ### **R. 1**: Work treble crochet (tr) in next stitch.",
      2,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, substitutionCount, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected quoted boundary isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("outer Markdown emphasis around quoted instructions remains protected", () => {
  const startedAt = performance.now();
  for (const [input, expected, substitutionCount] of [
    [
      "Rnd. 4: Work dc in first dc, widget.\n> **\"1. HTR in first dc!\"**",
      "Rnd. 4: Work dc in first dc, widget.\n> **\"1. HTR in first dc!\"**",
      0,
    ],
    [
      "Rnd. 2: Work dc in next stitch.. > **\"1. HTR in first dc!\"**. **Rnd. 3**: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch.. > **\"1. HTR in first dc!\"**. **Rnd. 3**: Work treble crochet (tr) in next stitch.",
      2,
    ],
    [
      "> 1. ### **\"1. DC, HTR in next stitch.\"** Rnd. 2: Work dc in next stitch.",
      "> 1. ### **\"1. DC, HTR in next stitch.\"** Rnd. 2: Work single crochet (sc) in next stitch.",
      1,
    ],
    [
      "Rnd. 2: Work dc in next stitch. >> ___“1. HTR in first dc!”___; Rnd. 3: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch. >> ___“1. HTR in first dc!”___; Rnd. 3: Work treble crochet (tr) in next stitch.",
      2,
    ],
    [
      "Rnd. 4: Work dc in first dc, widget. > **\"1. HTR in first dc!\"*",
      "Rnd. 4: Work dc in first dc, widget. > **\"1. HTR in first dc!\"*",
      0,
    ],
    [
      "Rnd. 2: Work dc in next stitch. >> ___“1. HTR in first dc!”__; Rnd. 3: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch. >> ___“1. HTR in first dc!”__; Rnd. 3: Work treble crochet (tr) in next stitch.",
      2,
    ],
    [
      "Rnd. 4: Work dc in first dc, widget.\n> \\*\"1. HTR in first dc!\"*",
      "Rnd. 4: Work dc in first dc, widget.\n> \\*\"1. HTR in first dc!\"*",
      0,
    ],
    [
      "Rnd. 2: Work dc in next stitch. > ****\"1. HTR in first dc!\"____; Rnd. 3: Work dtr in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch. > ****\"1. HTR in first dc!\"____; Rnd. 3: Work treble crochet (tr) in next stitch.",
      2,
    ],
    [
      `Rnd. 4: Work dc in first dc, widget.\n> *\\"1. HTR in first dc!\\"*`,
      `Rnd. 4: Work dc in first dc, widget.\n> *\\"1. HTR in first dc!\\"*`,
      0,
    ],
    [
      `> *\\"1. HTR in first dc!\\"* Rnd. 2: Work dc in next stitch.`,
      `> *\\"1. HTR in first dc!\\"* Rnd. 2: Work single crochet (sc) in next stitch.`,
      1,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, substitutionCount, input);
  }
  const delimiterSlashes = "\\".repeat(4);
  const escapedSmartQuote = `> ****${delimiterSlashes}“1. HTR in first dc!${delimiterSlashes}”____; **Rnd. 3**: Work dtr in next stitch.`;
  const escapedSmartResult = decodeVintagePattern(escapedSmartQuote, "uk");
  assert.equal(
    escapedSmartResult.output,
    `> ****${delimiterSlashes}“1. HTR in first dc!${delimiterSlashes}”____; **Rnd. 3**: Work treble crochet (tr) in next stitch.`,
  );
  assert.equal(escapedSmartResult.substitutionCount, 1);

  const mismatchedQuote = `> ****\\“1. HTR in first dc!${"\\".repeat(2)}”____`;
  const mismatchedInput = `${mismatchedQuote}\nRnd. 2: Work dc in next stitch.`;
  const mismatchedResult = decodeVintagePattern(mismatchedInput, "uk");
  assert.equal(
    mismatchedResult.output,
    `${mismatchedQuote}\nRnd. 2: Work single crochet (sc) in next stitch.`,
  );
  assert.equal(mismatchedResult.substitutionCount, 1);

  const oddSlashQuote = `> ****\\“1. HTR in first dc!\\”____`;
  const multipleRangeInput = `${oddSlashQuote}\r\nRnd. 4: Work dc in first dc, widget.\n\nRnd. 4: Work dc in first dc, widget. ${oddSlashQuote}`;
  const multipleRangeResult = decodeVintagePattern(multipleRangeInput, "uk");
  assert.equal(multipleRangeResult.output, multipleRangeInput);
  assert.equal(multipleRangeResult.substitutionCount, 0);
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected emphasized quote isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("formatted instruction headings use the bounded Work fast path", () => {
  const startedAt = performance.now();
  for (const [input, expected] of [
    [
      "Rnd. 2: Work dc in next stitch.",
      "Rnd. 2: Work single crochet (sc) in next stitch.",
    ],
    [
      "**Rnd. 3**: Work dtr in next stitch.",
      "**Rnd. 3**: Work treble crochet (tr) in next stitch.",
    ],
    [
      "> 1. ### **R. 1**: Work dtr in next stitch.",
      "> 1. ### **R. 1**: Work treble crochet (tr) in next stitch.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }
  const denied = "Rnd. 2: Work dc in first dc, widget.";
  const deniedResult = decodeVintagePattern(denied, "uk");
  assert.equal(deniedResult.output, denied);
  assert.equal(deniedResult.substitutionCount, 0);
  for (const [input, expected] of [
    [
      "Rnd. 2: Work dc in first dc, widget.. Rnd. 2: Work dc in next stitch.",
      "Rnd. 2: Work dc in first dc, widget.. Rnd. 2: Work single crochet (sc) in next stitch.",
    ],
    [
      "Rnd. 2: Work dc in next stitch.. Rnd. 2: Work htr in first dc, widget.",
      "Rnd. 2: Work single crochet (sc) in next stitch.. Rnd. 2: Work htr in first dc, widget.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 1_000, `expected formatted heading handling under 1,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("punctuated strict term lists fail closed without a global policy scan", () => {
  const startedAt = performance.now();
  for (const input of [
    "dc. , tr?",
    "double crochet!; half treble crochet.",
    "dtr, htr?; tension square.",
    "dc, tr?.",
    "dc, tr!;",
    "double treble crochet, , double treble crochet",
    "DTR,\t,\tHTR",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 1_000, `expected punctuated-list denial under 1,000 ms, received ${elapsed.toFixed(1)} ms`);

  for (const [input, expected, count] of [
    ["dc, tr?", "single crochet (sc), double crochet (dc)?", 2],
    [
      "double crochet;\thalf treble crochet.",
      "single crochet (sc);\thalf double crochet (hdc).",
      2,
    ],
    ["tension square, dc.", "gauge square, single crochet (sc).", 2],
    [
      "Round 2: dc, tr.",
      "Round 2: single crochet (sc), double crochet (dc).",
      2,
    ],
    [
      "Work dc, then tr in next stitch.",
      "Work single crochet (sc), then double crochet (dc) in next stitch.",
      2,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const input of [
    "dc, widget?.",
    "Source: dc, tr?.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

});

test("glossary term lists containing tension square remain prose", () => {
  const glossaryLines = [
    "The glossary lists tension square, double crochet.",
    "The glossary lists double crochet; tension square.",
    "The glossary lists tension square; double crochet.",
    "THE GLOSSARY LISTS TENSION\tSQUARE, DOUBLE\tCROCHET!",
  ];
  for (const input of glossaryLines) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  const glossary = glossaryLines[1];
  const firstCommand = "Rnd. 2: Work htr in next stitch.";
  const firstConverted = "Rnd. 2: Work half double crochet (hdc) in next stitch.";
  const secondCommand = "> 1. ### **R. 1**: Work dtr in next stitch.";
  const secondConverted = "> 1. ### **R. 1**: Work treble crochet (tr) in next stitch.";
  for (const separator of [" ", "\n", "\r\n"]) {
    for (const [input, expected, count] of [
      [`${glossary}${separator}${firstCommand}`, `${glossary}${separator}${firstConverted}`, 1],
      [`${firstCommand}${separator}${glossary}`, `${firstConverted}${separator}${glossary}`, 1],
      [
        `${firstCommand}${separator}${glossary}${separator}${secondCommand}`,
        `${firstConverted}${separator}${glossary}${separator}${secondConverted}`,
        2,
      ],
    ]) {
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, input);
      assert.equal(result.substitutionCount, count, input);
    }
  }

  const glossaryOnly = glossaryLines.join("\r\n");
  assert.equal(decodeVintagePattern(glossaryOnly, "uk").output, glossaryOnly);
  assert.equal(decodeVintagePattern(glossaryOnly, "uk").substitutionCount, 0);

  for (const separator of ["\n", "\r\n"]) {
    const malformedFollowing = "Work htr in next stitch. 1) DC and TR alone, then Work dcx in next stitch.";
    const expectedFollowing = "Work half double crochet (hdc) in next stitch. 1) DC and TR alone, then Work dcx in next stitch.";
    const result = decodeVintagePattern(`${glossary}${separator}${malformedFollowing}`, "uk");
    assert.equal(result.output, `${glossary}${separator}${expectedFollowing}`);
    assert.equal(result.substitutionCount, 1);
  }

  for (const [input, expected, count] of [
    ["tension square, double crochet.", "gauge square, single crochet (sc).", 2],
    [
      "Tension square: 20 dc = 4 inches",
      "gauge square: 20 single crochet (sc) = 4 inches",
      2,
    ],
    ["TENSION\n20 sts = 4 in", "gauge\n20 sts = 4 in", 1],
    ["Glossary: Work dc in next stitch.", "Glossary: Work dc in next stitch.", 0],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }
});

test("malformed glossary terminators isolate neighboring Work instructions", () => {
  const declarative = "This says dc and tr in a glossary.;";
  const termList = "The glossary lists double crochet; tension square.;";
  const command = "Work htr in next stitch.";
  const converted = "Work half double crochet (hdc) in next stitch.";
  const startedAt = performance.now();
  for (const [input, expected, count] of [
    [declarative, declarative, 0],
    [termList, termList, 0],
    [`${declarative} ${command}`, `${declarative} ${converted}`, 1],
    [`${command} ${declarative}`, `${converted} ${declarative}`, 1],
    [`${termList}\n${command}`, `${termList}\n${converted}`, 1],
    [`${command}\r\n${termList}`, `${converted}\r\n${termList}`, 1],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected malformed glossary isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("known denied clauses remain local beside valid Work instructions", () => {
  const deniedClauses = [
    "1. DC and TR alone.",
    "1) DC and TR alone.",
    "(1) DC and TR alone.",
    "dc. , tr?",
    "double crochet!; half treble crochet.",
    "dtr, htr?; tension square.",
    "dc, tr?.",
    "dc, tr!;",
    "double treble crochet, , double treble crochet.",
    "1. DOUBLE CROCHET, HALF TREBLE CROCHET.",
  ];
  const firstCommand = "Rnd. 2: Work htr in next stitch.";
  const firstConverted = "Rnd. 2: Work half double crochet (hdc) in next stitch.";
  const secondCommand = "> 1. ### **R. 1**: Work dtr in next stitch.";
  const secondConverted = "> 1. ### **R. 1**: Work treble crochet (tr) in next stitch.";

  for (const denied of deniedClauses) {
    for (const separator of [" ", "\n"]) {
      for (const [input, expected, count] of [
        [
          `${denied}${separator}${firstCommand}`,
          `${denied}${separator}${firstConverted}`,
          1,
        ],
        [
          `${firstCommand}${separator}${denied}`,
          `${firstConverted}${separator}${denied}`,
          1,
        ],
        [
          `${firstCommand}${separator}${denied}${separator}${secondCommand}`,
          `${firstConverted}${separator}${denied}${separator}${secondConverted}`,
          2,
        ],
      ]) {
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, expected, input);
        assert.equal(result.substitutionCount, count, input);
      }
    }
  }

  const crlf = `${deniedClauses[4]}\r\n${firstCommand}`;
  assert.equal(
    decodeVintagePattern(crlf, "uk").output,
    `${deniedClauses[4]}\r\n${firstConverted}`,
  );

  const deniedOnly = deniedClauses.join("\n");
  assert.equal(decodeVintagePattern(deniedOnly, "uk").output, deniedOnly);
  assert.equal(decodeVintagePattern(deniedOnly, "uk").substitutionCount, 0);

  for (const [input, expected] of [
    [
      "Work htr in next stitch, then 1) DC and TR alone.",
      "Work half double crochet (hdc) in next stitch, then 1) DC and TR alone.",
    ],
    [
      "1) DC and TR alone, then Work htr in next stitch.",
      "1) DC and TR alone, then Work half double crochet (hdc) in next stitch.",
    ],
    [
      "Work htr in next stitch!; Work dtr in next stitch.",
      "Work half double crochet (hdc) in next stitch!; Work treble crochet (tr) in next stitch.",
    ],
    [
      "Work htr in next stitch.... , Work dtr in next stitch.",
      "Work half double crochet (hdc) in next stitch.... , Work treble crochet (tr) in next stitch.",
    ],
    [
      "Work htr in next stitch. 1) DC and TR alone, then Work dcx in next stitch.",
      "Work half double crochet (hdc) in next stitch. 1) DC and TR alone, then Work dcx in next stitch.",
    ],
  ]) {
    assert.equal(decodeVintagePattern(input, "uk").output, expected, input);
  }

  for (const indent of ["\t", "    ", ">     "]) {
    const code = `${indent}Work dc in next stitch.`;
    const input = `${code}\n${firstCommand}`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${code}\n${firstConverted}`, JSON.stringify(indent));
    assert.equal(result.substitutionCount, 1, JSON.stringify(indent));
  }

  const unknown = decodeVintagePattern(`${deniedClauses[0]}\n${firstCommand}`, "unknown");
  assert.equal(unknown.output, `${deniedClauses[0]}\n${firstCommand}`);
  assert.equal(unknown.substitutionCount, 0);
  assert.ok(unknown.signals.some(({ title }) => title === "Crochet convention not established"));
});

test("segmented Work ceilings remain physical-line scoped", () => {
  const command = "Work dc and tr in next stitch.";
  const converted = "Work single crochet (sc) and double crochet (dc) in next stitch.";
  const line64 = Array.from({ length: 64 }, () => command).join(" ");
  const expected64 = Array.from({ length: 64 }, () => converted).join(" ");
  const twoLines = `${line64}\n${line64}`;
  const result = decodeVintagePattern(twoLines, "uk");
  assert.equal(result.output, `${expected64}\n${expected64}`);
  assert.equal(result.substitutionCount, 256);

  const line65 = Array.from({ length: 65 }, () => command).join(" ");
  const overflow = `${line65}\nRnd. 1: Work htr in next stitch.`;
  const overflowResult = decodeVintagePattern(overflow, "uk");
  assert.equal(overflowResult.output, overflow);
  assert.equal(overflowResult.substitutionCount, 0);
});

test("whole indented-code documents are preserved by the bounded fast path", () => {
  const terms = [
    "double treble crochet",
    "double treble",
    "dtr",
    "half treble crochet",
    "half treble",
    "htr",
    "treble crochet",
    "treble",
    "tr",
    "double crochet",
    "dc",
    "tension square",
  ];
  const inputs = [
    terms.map((term) => `\t${term}`).join("\n"),
    terms.map((term) => `    ${term}`).join("\n"),
    terms.map((term) => `\t${term}`).join("\r\n"),
    terms.map((term) => `    ${term}`).join("\r\n"),
    terms.map((term, index) => `${index % 3 === 0 ? ">     " : index % 2 === 0 ? "    " : "\t"}${term}`).join("\n"),
    `${terms.map((term) => `\t${term}`).join("\n")}\n\n`,
  ];
  const startedAt = performance.now();
  for (const input of inputs) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input);
    assert.equal(result.substitutionCount, 0);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 1_000, `expected indented-code denial under 1,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("segmented glossary and malformed emphasis clauses isolate later dotted headings", () => {
  for (const [input, expected, count] of [
    [
      "This says dc and tr in a glossary. Rnd. 2: Work htr in next stitch.",
      "This says dc and tr in a glossary. Rnd. 2: Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Rnd. 2: Work htr in next stitch. This says dc and tr in a glossary. Rnd. 2: Work dtr in next stitch.",
      "Rnd. 2: Work half double crochet (hdc) in next stitch. This says dc and tr in a glossary. Rnd. 2: Work treble crochet (tr) in next stitch.",
      2,
    ],
    [
      "Work *dc and tr in next stitch. Row 1: Work htr in next stitch.",
      "Work *dc and tr in next stitch. Row 1: Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Row 1: Work htr in next stitch. Work *dc and tr in next stitch.",
      "Row 1: Work half double crochet (hdc) in next stitch. Work *dc and tr in next stitch.",
      1,
    ],
    [
      "This says dc and tr in a glossary. > 1. ### **R. 2**: Work htr in next stitch.",
      "This says dc and tr in a glossary. > 1. ### **R. 2**: Work half double crochet (hdc) in next stitch.",
      1,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }
});

test("every advertised UK source term has one finite context-bounded mapping", () => {
  for (const entry of SUPPORTED_VINTAGE_UK_TERMS) {
    for (const term of entry.terms) {
      const input = entry.label === "Tension" ? `${term} square` : term;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.status, "ready", term);
      assert.equal(
        result.output,
        entry.label === "Tension" ? `${entry.replacement} square` : entry.replacement,
        term,
      );
      assert.equal(result.substitutionCount, 1, term);
    }
  }
});

test("tension maps only in recognizable gauge contexts", () => {
  const input = [
    "Maintain an even tension throughout.",
    "Do not tighten the yarn tension.",
    "Tension: 20 stitches and 28 rows to 10 cm.",
    "Tension 20 tr = 4 inches.",
    "Pattern tension: 16 dc = 4 inches.",
    "Make a tension square before starting.",
    "Maintain tension\n20 stitches remain.",
    "Keep tension\nSquare the edges.",
  ].join("\n");
  const startedAt = performance.now();
  const result = decodeVintagePattern(input, "uk");
  const elapsed = performance.now() - startedAt;

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    [
      "Maintain an even tension throughout.",
      "Do not tighten the yarn tension.",
      "gauge: 20 stitches and 28 rows to 10 cm.",
      "gauge 20 double crochet (dc) = 4 inches.",
      "Pattern gauge: 16 single crochet (sc) = 4 inches.",
      "Make a gauge square before starting.",
      "Maintain tension\n20 stitches remain.",
      "Keep tension\nSquare the edges.",
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 6);
  assert.ok(elapsed < 2_000, `expected tension review under 2,000 ms, received ${elapsed.toFixed(1)} ms`);

  for (const prose of [
    "The phrase tension square appears in the glossary.",
    "Use tension square as a label.",
    "The words tension square are British wording.",
  ]) {
    const proseResult = decodeVintagePattern(prose, "uk");
    assert.equal(proseResult.output, prose, prose);
    assert.equal(proseResult.substitutionCount, 0, prose);
  }

  assert.equal(
    decodeVintagePattern("Tension square: 20 sts = 4 in.", "uk").output,
    "gauge square: 20 sts = 4 in.",
  );

  for (const separator of [", ", " / ", " and "]) {
    const grouped = [
      "Definitions:",
      `dc stitch${separator}tr stitch = color markers`,
      "Body:",
      "Work dc stitch; tr stitch; dc; tr.",
    ].join("\n");
    const groupedResult = decodeVintagePattern(grouped, "uk");
    assert.equal(
      groupedResult.output,
      [
        "Definitions:",
        `dc stitch${separator}tr stitch = color markers`,
        "Body:",
        "Work dc stitch; tr stitch; single crochet (sc); double crochet (dc).",
      ].join("\n"),
      separator,
    );
    assert.equal(groupedResult.substitutionCount, 2, separator);
  }

  const groupedTable = [
    "| Meaning | Abbreviation |",
    "| --- | --- |",
    "| color markers | `dc stitch, tr stitch` |",
    "Body:",
    "Work dc stitch; tr stitch; dc; tr.",
  ].join("\n");
  assert.equal(
    decodeVintagePattern(groupedTable, "uk").output,
    [
      "| Meaning | Abbreviation |",
      "| --- | --- |",
      "| color markers | `dc stitch, tr stitch` |",
      "Body:",
      "Work dc stitch; tr stitch; single crochet (sc); double crochet (dc).",
    ].join("\n"),
  );

  const mixed = [
    "Definitions:",
    "dc stitch, tr = color markers",
    "Body:",
    "Work dc stitch; dc; tr.",
  ].join("\n");
  assert.equal(
    decodeVintagePattern(mixed, "uk").output,
    [
      "Definitions:",
      "dc stitch, tr = color markers",
      "Body:",
      "Work dc stitch; single crochet (sc); tr.",
    ].join("\n"),
  );

  for (const separator of ["－", "﹣"]) {
    const fullwidthDefinition = [
      "Definitions:",
      `dc stitch ${separator} drop color`,
      "Body:",
      "Work dc stitch; then dc.",
    ].join("\n");
    const fullwidthResult = decodeVintagePattern(fullwidthDefinition, "uk");
    assert.equal(
      fullwidthResult.output,
      [
        "Definitions:",
        `dc stitch ${separator} drop color`,
        "Body:",
        "Work dc stitch; then single crochet (sc).",
      ].join("\n"),
      separator,
    );
    assert.equal(fullwidthResult.substitutionCount, 1, separator);

    const attached = `Work dc${separator}motif; then dc.`;
    assert.equal(
      decodeVintagePattern(attached, "uk").output,
      `Work dc${separator}motif; then single crochet (sc).`,
      attached,
    );
  }

  const wrappedKeyUse = [
    "Definitions:",
    "dc stitch = drop color",
    "Body:",
    "Work dc",
    "stitch; then dc.",
  ].join("\n");
  assert.equal(
    decodeVintagePattern(wrappedKeyUse, "uk").output,
    [
      "Definitions:",
      "dc stitch = drop color",
      "Body:",
      "Work dc",
      "stitch; then single crochet (sc).",
    ].join("\n"),
  );

  const separatedKeyWords = [
    "Definitions:",
    "dc stitch = drop color",
    "Body:",
    "Work dc",
    "",
    "stitch; then dc.",
  ].join("\n");
  assert.equal(
    decodeVintagePattern(separatedKeyWords, "uk").output,
    [
      "Definitions:",
      "dc stitch = drop color",
      "Body:",
      "Work single crochet (sc)",
      "",
      "stitch; then single crochet (sc).",
    ].join("\n"),
  );
});

test("longest source term wins and generated text is not converted again", () => {
  const result = decodeVintagePattern(
    "double treble crochet; treble crochet; double crochet; dtr tr dc",
    "uk",
  );

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "treble crochet (tr); double crochet (dc); single crochet (sc); treble crochet (tr) double crochet (dc) single crochet (sc)",
  );
  assert.equal(result.substitutionCount, 6);
});

test("supported multi-word terms tolerate copied spacing without changing surrounding text", () => {
  const result = decodeVintagePattern("Row 1: double   crochet, then check this note.", "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, "Row 1: single crochet (sc), then check this note.");
  assert.equal(result.substitutionCount, 1);
});

test("counted spelled-out stitch instructions convert without consuming the count", () => {
  const input = "Row 1: 2 double crochet, then 1 treble crochet. Work 2 double crochet in next stitch, then 1 treble crochet across row.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, "Row 1: 2 single crochet (sc), then 1 double crochet (dc). Work 2 single crochet (sc) in next stitch, then 1 double crochet (dc) across row.");
  assert.equal(result.substitutionCount, 4);
});

test("trailing repetition counts distinguish instructions from prose", () => {
  const input = [
    "Work double crochet twice.",
    "Repeat treble crochet twice.",
    "Make half treble three times.",
    "Work double treble 4 times.",
    "Row 1: double crochet twice.",
  ].join("\n");
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    [
      "Work single crochet (sc) twice.",
      "Repeat double crochet (dc) twice.",
      "Make half double crochet (hdc) three times.",
      "Work treble crochet (tr) 4 times.",
      "Row 1: single crochet (sc) twice.",
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 5);

  for (const prose of [
    "Use dc twice as a label.",
    "Work tr twice in the sentence.",
    "Repeat htr three times in the glossary.",
    "Use double crochet twice as a label.",
    "Work treble crochet twice in the sentence.",
  ]) {
    const proseResult = decodeVintagePattern(prose, "uk");
    assert.equal(proseResult.output, prose, prose);
    assert.equal(proseResult.substitutionCount, 0, prose);
  }

  assert.equal(
    decodeVintagePattern("Use dc twice.\nWork tr twice in next stitch.", "uk").substitutionCount,
    2,
  );
});

test("asterisk repeat markers delimit supported spelled-out instructions", () => {
  const result = decodeVintagePattern("*double crochet in next stitch, repeat from *", "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, "*single crochet (sc) in next stitch, repeat from *");
  assert.equal(result.substitutionCount, 1);
});

test("multiline definitions stop before structural and qualified instruction headings", () => {
  const input = "Abbreviations:\nxy = drop color\nzz = turn right\nGauge: 20 dc = 4 inches\nSize: adult\nNotes: Work tr across.\nBody: Work dc in next stitch.\nSleeve: Work tr across.\nSkirt: Work dc in next stitch.\nCrown: Work tr across.\nRibbing: Work dc in next stitch.\nBegin here: Work tr across.\nMotif A: dc in next stitch.\nMotif B: *tr across.\nShape armholes: Work dc in next stitch.\nSetup Row: Work dc in next stitch.\nFoundation Row: Work tr across.\nStep 1: Work dc in next stitch.\nRow 1: Work dc in next stitch.\nRound 2: Work tr across.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "Abbreviations:\nxy = drop color\nzz = turn right\nGauge: 20 single crochet (sc) = 4 inches\nSize: adult\nNotes: Work double crochet (dc) across.\nBody: Work single crochet (sc) in next stitch.\nSleeve: Work double crochet (dc) across.\nSkirt: Work single crochet (sc) in next stitch.\nCrown: Work double crochet (dc) across.\nRibbing: Work single crochet (sc) in next stitch.\nBegin here: Work double crochet (dc) across.\nMotif A: single crochet (sc) in next stitch.\nMotif B: *double crochet (dc) across.\nShape armholes: Work single crochet (sc) in next stitch.\nSetup Row: Work single crochet (sc) in next stitch.\nFoundation Row: Work double crochet (dc) across.\nStep 1: Work single crochet (sc) in next stitch.\nRow 1: Work single crochet (sc) in next stitch.\nRound 2: Work double crochet (dc) across.",
  );
  assert.equal(result.substitutionCount, 16);
});

test("explicit custom source keys override supported terms throughout the pattern", () => {
  const cases = [
    ["Abbreviations:", "dc", "drop color"],
    ["Pattern key:", "dc", "drop color"],
    ["Special abbreviations:", "tr", "turn right"],
    ["Stitch guide:", "tr", "turn right"],
    ["Legend:", "dc", "drop color"],
    ["Explanations:", "tr", "turn right"],
    ["Terms used:", "dc", "drop color"],
  ];

  for (const [heading, term, definition] of cases) {
    const input = `${heading}\n${term} = ${definition}\nRow 1: ${term}, then turn.`;
    const result = decodeVintagePattern(input, "uk");
    const unknown = decodeVintagePattern(input, "unknown");

    assert.equal(result.output, input, heading);
    assert.equal(result.substitutionCount, 0, heading);
    assert.equal(
      unknown.signals.some(({ title }) => title === "Crochet convention not established"),
      false,
      heading,
    );
  }

  const sameLine = "Definitions: dc = drop color; tr = turn right\nRow 1: dc, then tr.";
  const sameLineResult = decodeVintagePattern(sameLine, "uk");
  assert.equal(sameLineResult.output, sameLine);
  assert.equal(sameLineResult.substitutionCount, 0);

  const definitionThenInstruction = "Definitions: xy = drop color; Row 1: Work dc in next stitch.";
  const definitionThenInstructionResult = decodeVintagePattern(definitionThenInstruction, "uk");
  assert.equal(
    definitionThenInstructionResult.output,
    "Definitions: xy = drop color; Row 1: Work single crochet (sc) in next stitch.",
  );
  assert.equal(definitionThenInstructionResult.substitutionCount, 1);

  const standardKey = "Abbreviations:\ndc = double crochet\nRow 1: dc in next stitch.";
  const standardKeyResult = decodeVintagePattern(standardKey, "uk");
  assert.equal(
    standardKeyResult.output,
    "Abbreviations:\ndc = double crochet\nRow 1: single crochet (sc) in next stitch.",
  );
  assert.equal(standardKeyResult.substitutionCount, 1);

  for (const qualifiedValue of ["double crochet (UK)", "double crochet stitch"]) {
    const qualifiedKey = `Abbreviations:\ndc - ${qualifiedValue}\nRow 1: dc in next stitch.`;
    const qualifiedResult = decodeVintagePattern(qualifiedKey, "uk");
    assert.equal(
      qualifiedResult.output,
      `Abbreviations:\ndc - ${qualifiedValue}\nRow 1: single crochet (sc) in next stitch.`,
    );
  }

  for (const customDefinition of [
    "Abbreviations - dc = drop color\nRow 1: dc in next stitch.",
    "Abbreviations — dc = drop color\nRow 1: dc in next stitch.",
    "Definitions: dc means drop color\nRow 1: dc in next stitch.",
    "Abbreviations:\ndc-drop color\nRow 1: dc in next stitch.",
    "Abbreviations:\ndc–drop color\nRow 1: dc in next stitch.",
    "Abbreviations:\ndc—drop color\nRow 1: dc in next stitch.",
  ]) {
    const customResult = decodeVintagePattern(customDefinition, "uk");
    assert.equal(customResult.output, customDefinition);
    assert.equal(customResult.substitutionCount, 0);
  }

  for (const [heading, definition] of [
    ["ABBREVIATIONS", "dc = drop color"],
    ["ABBREVIATIONS.", "dc = drop color"],
    ["Pattern Key.", "dc = drop color"],
    ["SPECIAL STITCHES;", "dc = drop color"],
    ["## Abbreviations:", "dc = drop color"],
    ["Abbreviations (continued):", "dc = drop color"],
    ["Stitch Key:", "dc = drop color"],
    ["Abbreviation Key:", "dc = drop color"],
    ["Pattern Abbreviations:", "dc = drop color"],
    ["Special Terms:", "dc = drop color"],
    ["Crochet Key:", "dc = drop color"],
    ["Abbreviations:", "• dc = drop color"],
    ["Abbreviations:", "* dc = drop color"],
    ["Abbreviations:", "· dc = drop color"],
    ["Abbreviations:", "1. dc = drop color"],
    ["Abbreviations:", "(dc) = drop color"],
    ["Abbreviations:", "dc (custom) = drop color"],
  ]) {
    const input = `${heading}\n${definition}\nRow 1: dc in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, `${heading} / ${definition}`);
    assert.equal(result.substitutionCount, 0, `${heading} / ${definition}`);
  }

  const customTension = "Abbreviations:\ntension = yarn pull\nTension: 20 dc = 4 inches.";
  const customTensionResult = decodeVintagePattern(customTension, "uk");
  assert.equal(
    customTensionResult.output,
    "Abbreviations:\ntension = yarn pull\nTension: 20 single crochet (sc) = 4 inches.",
  );
  assert.equal(customTensionResult.substitutionCount, 1);
});

test("explicit compound custom keys protect only the complete defined phrase", () => {
  const inline = [
    "Definitions:",
    "dc stitch = drop color",
    "Body:",
    "Work dc stitch; then dc in next stitch.",
  ].join("\n");
  const inlineResult = decodeVintagePattern(inline, "uk");
  assert.equal(
    inlineResult.output,
    [
      "Definitions:",
      "dc stitch = drop color",
      "Body:",
      "Work dc stitch; then single crochet (sc) in next stitch.",
    ].join("\n"),
  );
  assert.equal(inlineResult.substitutionCount, 1);

  const table = [
    "| Meaning | Abbreviation |",
    "| --- | --- |",
    "| drop color | `dc stitch` |",
    "Body:",
    "Work dc stitch; then dc in next stitch.",
  ].join("\n");
  const tableResult = decodeVintagePattern(table, "uk");
  assert.equal(
    tableResult.output,
    [
      "| Meaning | Abbreviation |",
      "| --- | --- |",
      "| drop color | `dc stitch` |",
      "Body:",
      "Work dc stitch; then single crochet (sc) in next stitch.",
    ].join("\n"),
  );
  assert.equal(tableResult.substitutionCount, 1);

  const tension = [
    "Special terms:",
    "tension square = stress marker",
    "Body:",
    "Make tension square.",
    "Tension: 20 sts",
  ].join("\n");
  const tensionResult = decodeVintagePattern(tension, "uk");
  assert.equal(
    tensionResult.output,
    [
      "Special terms:",
      "tension square = stress marker",
      "Body:",
      "Make tension square.",
      "gauge: 20 sts",
    ].join("\n"),
  );
  assert.equal(tensionResult.substitutionCount, 1);

  assert.equal(
    decodeVintagePattern("Work dc stitch.", "uk").output,
    "Work single crochet (sc) stitch.",
  );
  assert.equal(
    decodeVintagePattern("Tension square: 20 sts = 4 in.", "uk").output,
    "gauge square: 20 sts = 4 in.",
  );
});

test("custom stitch definitions preserve instruction-shaped values", () => {
  for (const [definition, expectedDefinition] of [
    ["Long cluster: Work 5 dc in next stitch.", "Long cluster: Work 5 dc in next stitch."],
    ["Crab stitch: Work dc from left to right.", "Crab stitch: Work dc from left to right."],
    ["Fancy motif — Work dc, tr, dc.", "Fancy motif — Work dc, tr, dc."],
    ["Join stitch: Work dc in next stitch.", "Join stitch: Work dc in next stitch."],
    ["Increase stitch — work 2 dc in next stitch.", "Increase stitch — work 2 dc in next stitch."],
    ["Foundation row: dc in next stitch.", "Foundation row: dc in next stitch."],
    ["Crab stitch—Work dc from left to right.", "Crab stitch—Work dc from left to right."],
    ["Long cluster—Work 5 dc in next stitch.", "Long cluster—Work 5 dc in next stitch."],
    ["Fancy motif–Work dc, tr, dc.", "Fancy motif–Work dc, tr, dc."],
    ["X stitch-Work dc in next stitch.", "X stitch-Work dc in next stitch."],
    ["Motif A: Work dc.", "Motif A: Work dc."],
  ]) {
    const input = `Special stitches:\n${definition}\nRow 1: Work dc in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Special stitches:\n${expectedDefinition}\nRow 1: Work single crochet (sc) in next stitch.`,
    );
    assert.equal(result.substitutionCount, 1);
  }

  for (const heading of ["Named stitches:", "Motifs:"]) {
    const input = `${heading}\nMotif A: Work dc.\nRow 1: dc.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${heading}\nMotif A: Work dc.\nRow 1: single crochet (sc).`,
    );
    assert.equal(result.substitutionCount, 1);
  }
});

test("definition blocks stop at common construction headings", () => {
  for (const heading of [
    "Divide for armholes",
    "Fasten off",
    "Make up",
    "Continue in pattern",
    "Decrease for armhole",
    "Armhole shaping",
    "Work even",
    "Next section",
    "To finish",
    "Join shoulder seams",
    "Cast off",
    "Commence shaping",
    "Foundation chain",
    "Set-up row",
    "Rows 2-10",
  ]) {
    const input = `Abbreviations:\nxy = custom\n${heading}: Work dc in next stitch.\nRow 1: Work dc in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Abbreviations:\nxy = custom\n${heading}: Work single crochet (sc) in next stitch.\nRow 1: Work single crochet (sc) in next stitch.`,
      heading,
    );
    assert.equal(result.substitutionCount, 2, heading);
  }
});

test("abbreviation lists convert through their final instruction item", () => {
  const cases = [
    ["Row 1: dc, tr", "Row 1: single crochet (sc), double crochet (dc)", 2],
    ["[dc, tr]", "[single crochet (sc), double crochet (dc)]", 2],
    ["Row 1: ch 1, dc.", "Row 1: ch 1, single crochet (sc).", 1],
    ["dc, turn.", "single crochet (sc), turn.", 1],
    ["dc.", "single crochet (sc).", 1],
    ["- dc", "- single crochet (sc)", 1],
    ["[dc]", "[single crochet (sc)]", 1],
  ];
  for (const [input, expected, count] of cases) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected);
    assert.equal(result.substitutionCount, count);
  }

  const isolatedLines = decodeVintagePattern("Instructions follow below.\ndc.\ntr.\nhtr.\ndtr.\nTurn.", "uk");
  assert.equal(
    isolatedLines.output,
    "Instructions follow below.\nsingle crochet (sc).\ndouble crochet (dc).\nhalf double crochet (hdc).\ntreble crochet (tr).\nTurn.",
  );
  assert.equal(isolatedLines.substitutionCount, 4);
});

test("clear spelled-out imperatives map while compound phrases remain conservative", () => {
  const input = "Work double crochet across, then use treble crochet cluster; keep half double crochet.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "Work single crochet (sc) across, then use treble crochet cluster; keep half double crochet.",
  );
  assert.equal(result.substitutionCount, 1);
});

test("unsupported compound and attached-count abbreviations are preserved", () => {
  const result = decodeVintagePattern(
    "dc2tog, tr3tog, dtr2tog, 2dc; dc shell; tr bobble; dc popcorn; htr puff; Row 1: dc inc, dc dec, dc cl, dc sh, tr bo, dc BLO, dc 2 tog, dc tog; 3 tr.",
    "uk",
  );

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "dc2tog, tr3tog, dtr2tog, 2dc; dc shell; tr bobble; dc popcorn; htr puff; Row 1: dc inc, dc dec, dc cl, dc sh, tr bo, dc BLO, dc 2 tog, dc tog; 3 double crochet (dc).",
  );
  assert.equal(result.substitutionCount, 1);
});

test("hyphenated compound stitch names are preserved", () => {
  const input = [
    "half-double crochet",
    "front-post dc",
    "front post-dc",
    "front-post-dc",
    "extended-dc",
    "dc-cluster",
    "dc-through-back-loop",
    "dc-stitch",
    "back-loop-dc",
    "dc—motif",
    "edge–tr",
  ].join("; ");
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
});

test("attached dashes delimit command clauses but not compound stitch names", () => {
  const instruction = decodeVintagePattern(
    "Row 1: dc—turn. Work dc—then turn and tr across.",
    "uk",
  );
  assert.equal(
    instruction.output,
    "Row 1: single crochet (sc)—turn. Work single crochet (sc)—then turn and double crochet (dc) across.",
  );
  assert.equal(instruction.substitutionCount, 3);

  const compounds = "Row 1: dc—motif. Row 2: dc-cluster.";
  assert.equal(decodeVintagePattern(compounds, "uk").output, compounds);
});

test("supported stitches inside parenthesized instruction groups are converted together", () => {
  const input = "(dc, tr) in next stitch; repeat (htr / dtr); (double crochet / treble crochet).";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "(single crochet (sc), double crochet (dc)) in next stitch; repeat (half double crochet (hdc) / treble crochet (tr)); (single crochet (sc) / double crochet (dc)).",
  );
  assert.equal(result.substitutionCount, 6);
});

test("single-stitch parenthesized instructions are converted outside custom labels", () => {
  const input = "(dc) in the next stitch; (tr in next stitch); Work (htr) twice.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "(single crochet (sc)) in the next stitch; (double crochet (dc) in next stitch); Work (half double crochet (hdc)) twice.",
  );
  assert.equal(result.substitutionCount, 3);
});

test("recognized term and abbreviation pairs are converted atomically", () => {
  const result = decodeVintagePattern(
    "double crochet (dc); treble (tr); half treble (htr); dtr (double treble); Work double crochet (dc) in each stitch",
    "uk",
  );

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "single crochet (sc); double crochet (dc); half double crochet (hdc); treble crochet (tr); Work single crochet (sc) in each stitch",
  );
  assert.equal(result.substitutionCount, 5);
});

test("positional instruction words do not suppress supported abbreviations", () => {
  const input = "Work dc in same dc; work tr in second dc from hook; repeat in previous tr; Ch 3 counts as dc; work 1 dc between dc stitches; work 1 dc over dc below; work dc on following dc; repeat dc until dc remains; work dc in 3rd dc; work tr in 7th dc.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "Work single crochet (sc) in same single crochet (sc); work double crochet (dc) in second single crochet (sc) from hook; repeat in previous double crochet (dc); Ch 3 counts as single crochet (sc); work 1 single crochet (sc) between single crochet (sc) stitches; work 1 single crochet (sc) over single crochet (sc) below; work single crochet (sc) on following single crochet (sc); repeat single crochet (sc) until single crochet (sc) remains; work single crochet (sc) in 3rd single crochet (sc); work double crochet (dc) in 7th single crochet (sc).",
  );
  assert.equal(result.substitutionCount, 18);
});

test("command-like prose does not authorize positional stitch terms", () => {
  for (const prose of [
    "Work journal cites first dc.",
    "Work journal cites first DC.",
    "Work journal cites first double crochet of previous row.",
    "Work journal cites first dc made.",
    "Work journal cites first DC worked.",
    "Work journal cites first dc of previous row.",
    "Work history mentions next dc.",
    "Work notes list first dc, then stop.",
    "Work journal notes previous dc/DC.",
    "Work journal notes previous dc/dc.",
    "Join records cite first dc/DC.",
    "Repeat notes cite previous tr/TR.",
    "Work journal notes DC and DC in next stitch.",
    "Work journal notes DC and dc in next stitch.",
    "Work journal entry on first dc.",
    "Work journal entry on first DC.",
    "Make journal notes on first dc.",
    "Make journal notes on first DC.",
    "Work journal cites first dc, second dc, and third dc.",
    "Work journal cites first DC, second TR, and third HTR.",
    "Crochet journal cites first dc.",
    "Crochet journal cites first DC.",
    "Work journal discussion on second dc.",
    "Work journal discussion on second DC.",
    "Join records list first dc, second tr.",
    "Repeat notes list previous tr, next dc.",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    assert.equal(result.output, prose, prose);
    assert.equal(result.substitutionCount, 0, prose);
  }

  for (const [input, expected, count = 1] of [
    ["Work carefully in first DC.", "Work carefully in first single crochet (sc)."],
    ["Work stitches evenly in first dc.", "Work stitches evenly in first single crochet (sc)."],
    ["Work 1 dc in first dc.", "Work 1 single crochet (sc) in first single crochet (sc).", 2],
    ["Work dc in ch-1 space, sl st to first dc.", "Work single crochet (sc) in ch-1 space, sl st to first single crochet (sc).", 2],
    ["> - Work in first DC of previous row.", "> - Work in first single crochet (sc) of previous row."],
    ["Work in second DC.", "Work in second single crochet (sc)."],
    ["Join to second DC.", "Join to second single crochet (sc)."],
    ["Repeat in previous TR.", "Repeat in previous double crochet (dc)."],
    ["Work dc in first dc; work tr in second dc.", "Work single crochet (sc) in first single crochet (sc); work double crochet (dc) in second single crochet (sc).", 4],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }
});

test("bounded chain and chain-space targets remain instruction context", () => {
  for (const [input, expected] of [
    ["Work dc into ch-1 space.", "Work single crochet (sc) into ch-1 space."],
    ["Work DC in chain-1 space.", "Work single crochet (sc) in chain-1 space."],
    ["Work tr into ch–2 spaces!", "Work double crochet (dc) into ch–2 spaces!"],
    ["Work htr in chain — 3 spaces.", "Work half double crochet (hdc) in chain — 3 spaces."],
    ["Work dtr into ch 4 sp.", "Work treble crochet (tr) into ch 4 sp."],
    ["Work double crochet into the ch-1 space.", "Work single crochet (sc) into the ch-1 space."],
    ["Work dc into ch.", "Work single crochet (sc) into ch."],
    ["Work dc in chain space, then turn.", "Work single crochet (sc) in chain space, then turn."],
    ["- Work dc in ch-1 space.", "- Work single crochet (sc) in ch-1 space."],
    ["> Work double crochet in ch-1 space.", "> Work single crochet (sc) in ch-1 space."],
    ["> - Work dc in ch-1 space.", "> - Work single crochet (sc) in ch-1 space."],
    ["> 1. Work double crochet in ch-1 space.", "> 1. Work single crochet (sc) in ch-1 space."],
    ["> > Work DC in ch-1 space.", "> > Work single crochet (sc) in ch-1 space."],
    ["Work dc in ch-1 space, ch 1.", "Work single crochet (sc) in ch-1 space, ch 1."],
    ["Work dc in ch-1 space and turn.", "Work single crochet (sc) in ch-1 space and turn."],
    ["2 DC into ch-1 space.", "2 single crochet (sc) into ch-1 space."],
    ["2 DC into ch-1 space, ch 1.", "2 single crochet (sc) into ch-1 space, ch 1."],
    ["> - 2 DC into ch-1 space.", "> - 2 single crochet (sc) into ch-1 space."],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }

  for (const prose of [
    "Use dc in ch-1 space as a label.",
    "Work dc in chain-1 space in the glossary.",
    "Work dc in chain-1 space-cluster.",
    "Work dc in chain-1 space_label.",
    "Work dc in chain-1 space‍label.",
    "Work dc in chain-1 space.txt",
    "Work dc in chain-1 space/example.",
    "Work dc in chain-1 spacer.",
    "Work dc in ch-foo space.",
    "Work dc in chain-id space.",
    "Work dc in ch-1-space.",
    "long dc in ch-1 space.",
    "front-post dc in ch-1 space.",
    "dc-cluster in ch-1 space.",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    assert.equal(result.output, prose, prose);
    assert.equal(result.substitutionCount, 0, prose);
  }
});

test("bounded targets require complete same-line instruction continuations", () => {
  for (const [input, expected, count = 1] of [
    ["Work dc in ch-1 space, 1 ch.", "Work single crochet (sc) in ch-1 space, 1 ch."],
    ["Work dc in ch-1 space and then turn.", "Work single crochet (sc) in ch-1 space and then turn."],
    ["Work dc in ch-1 space, and then turn.", "Work single crochet (sc) in ch-1 space, and then turn."],
    ["Work dc in ch-1 space, sl st to first dc.", "Work single crochet (sc) in ch-1 space, sl st to first single crochet (sc).", 2],
    ["Work dc in ch-1 space, sk next stitch.", "Work single crochet (sc) in ch-1 space, sk next stitch."],
    ["Work dc in ch-1 space, yo and pull through.", "Work single crochet (sc) in ch-1 space, yo and pull through."],
    ["Work dc in ch-1 space, place marker.", "Work single crochet (sc) in ch-1 space, place marker."],
    ["Work dc in ch-1 space and add marker.", "Work single crochet (sc) in ch-1 space and add marker."],
    ["Work dc in ch-1 space, start next round.", "Work single crochet (sc) in ch-1 space, start next round."],
    ["Work dc in ch-1 space, use next color.", "Work single crochet (sc) in ch-1 space, use next color."],
    ["Work dc in ch-1 space, crochet across.", "Work single crochet (sc) in ch-1 space, crochet across."],
    ["Work dc in ch-1 space, increase in next stitch.", "Work single crochet (sc) in ch-1 space, increase in next stitch."],
    ["Work dc in ch-1 space, decrease in next stitch.", "Work single crochet (sc) in ch-1 space, decrease in next stitch."],
    ["Work dc in ch-1 space, insert hook in next stitch.", "Work single crochet (sc) in ch-1 space, insert hook in next stitch."],
    ["Work dc in ch-1 space, pull through both loops.", "Work single crochet (sc) in ch-1 space, pull through both loops."],
    ["2 DC in next stitch and DC in next stitch.", "2 single crochet (sc) in next stitch and single crochet (sc) in next stitch.", 2],
    ["2 DC in next stitch, then 3 HTR in each stitch.", "2 single crochet (sc) in next stitch, then 3 half double crochet (hdc) in each stitch.", 2],
    ["Work dc in ch-1 space, ch 1, turn.", "Work single crochet (sc) in ch-1 space, ch 1, turn."],
    ["2 DC in next stitch, 3 TR in following stitch, turn.", "2 single crochet (sc) in next stitch, 3 double crochet (dc) in following stitch, turn.", 2],
    ["2 DC in next stitch; then TR in following stitch; repeat.", "2 single crochet (sc) in next stitch; then double crochet (dc) in following stitch; repeat.", 2],
    ["2 DC in next stitch, work 3 TR in following stitch.", "2 single crochet (sc) in next stitch, work 3 double crochet (dc) in following stitch.", 2],
    ["2 DC in next stitch and work 3 TR in following stitch.", "2 single crochet (sc) in next stitch and work 3 double crochet (dc) in following stitch.", 2],
    ["2 DC in next stitch, make 3 HTR in following stitch.", "2 single crochet (sc) in next stitch, make 3 half double crochet (hdc) in following stitch.", 2],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const prose of [
    "2 DC in next stitch and DC is a label.",
    "2 DC in next stitch, DC is the abbreviation.",
    "2 DC in next stitch and 3 DC labels appear.",
    "2 DC in next stitch and chain is the topic.",
    "2 DC in next stitch and work is difficult.",
    "2 DC in next stitch; repeat is a label.",
    "2 DC in next stitch, turn is the example.",
    "Work dc in ch-1 space, ch-debug is metadata.",
    "Work dc in ch-1 space, chain-id is metadata.",
    "Work dc in ch-1 space, dc.txt is metadata.",
    "Work dc in ch-1 space and dc.txt is metadata.",
    "Work dc in ch-1 space, dc/debug is metadata.",
    "Work dc in ch-1 space, dc\\debug is metadata.",
    "Work dc in ch-1 space, ch is metadata.",
    "Work dc in ch-1 space, work is discussed.",
    "Work dc in ch-1 space, join is described.",
    "Work dc in ch-1 space, place marker is discussed.",
    "Work dc in ch-1 space, use next color theory.",
    "Join to first dc made, ch-debug is metadata.",
    "Join to first dc made, place marker is discussed.",
    "Work in first dc of row, dc.txt is metadata.",
    "Ch 3 counts as first DC of row, work is discussed.",
    "Work DC in next stitch, dc and tr are labels.",
    "Work double crochet in next stitch, dc/tr is metadata.",
    "Work dc in next stitch as a label.",
    "Work dc across as a label.",
    "Work dc around history.",
    "Work dc on next stitch as metadata.",
    "Work dc over previous stitch is a label.",
    "Work dc under each stitch was described.",
    "Work dc between next stitches are words.",
    "Work dc in next space in the glossary.",
    "Work dc into same loop.example.",
    "Work dc at marked stitch] as a label.",
    "Work dc within next row as prose.",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    assert.equal(result.output, prose, prose);
    assert.equal(result.substitutionCount, 0, prose);
  }
});

test("generic targets accept only complete bounded continuations", () => {
  const prefixes = ["", "- ", "> - "];
  const wordSeparators = [" and ", " or ", " and then ", " then "];
  const initials = [
    ["Work dc in ch-1 space", "Work single crochet (sc) in ch-1 space"],
    ["Work dc in next stitch", "Work single crochet (sc) in next stitch"],
    ["Work dc across", "Work single crochet (sc) across"],
    ["Work 2 dc in next stitch", "Work 2 single crochet (sc) in next stitch"],
    ["Make 2 dc in next stitch", "Make 2 single crochet (sc) in next stitch"],
  ];
  const continuations = [
    ["3 TR in following stitch.", "3 double crochet (dc) in following stitch."],
    ["work 3 HTR in following stitch.", "work 3 half double crochet (hdc) in following stitch."],
    ["skip next TR.", "skip next double crochet (dc)."],
  ];

  for (const prefix of prefixes) {
    for (const separator of wordSeparators) {
      for (const [initial, mappedInitial] of initials) {
        for (const [continuation, mappedContinuation] of continuations) {
          const input = `${prefix}${initial}${separator}${continuation}`;
          const result = decodeVintagePattern(input, "uk");
          assert.equal(
            result.output,
            `${prefix}${mappedInitial}${separator}${mappedContinuation}`,
            input,
          );
          assert.equal(result.substitutionCount, 2, input);
        }
      }
    }
  }

  for (const prefix of prefixes) {
    for (const separator of [", ", ", then ", "; ", "; then ", " and ", " or ", " then "]) {
      const input = `${prefix}2 DC in next stitch${separator}pull through next TR.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(
        result.output,
        `${prefix}2 single crochet (sc) in next stitch${separator}pull through next double crochet (dc).`,
        input,
      );
      assert.equal(result.substitutionCount, 2, input);
    }
  }

  const invalidInitials = [
    "Work dc in next stitch",
    "Work dc across",
    "Work 2 dc in next stitch",
    "Make 2 dc in next stitch",
  ];
  const invalidTails = [
    ", work is discussed.",
    ", turn is optional.",
    ", place marker is discussed.",
    ", start next round is optional.",
    ", use next color is suggested.",
    ", crochet across is discussed.",
    ", increase in next stitch is hard.",
    ", insert hook in next stitch is described.",
    ", pull through both loops is shown.",
    ", dc/debug is metadata.",
    ", dc\\debug is metadata.",
    ", chain-id is metadata.",
    ", ch-debug is metadata.",
    ", dc.txt is metadata.",
    ", and work is difficult.",
    ", then work is difficult.",
    "; work is difficult.",
    " and work is difficult.",
    " or work is difficult.",
    " then work is difficult.",
  ];

  for (const prefix of prefixes) {
    for (const initial of invalidInitials) {
      for (const tail of invalidTails) {
        const prose = `${prefix}${initial}${tail}`;
        const result = decodeVintagePattern(prose, "uk");
        assert.equal(result.output, prose, prose);
        assert.equal(result.substitutionCount, 0, prose);
      }
    }
  }
});

test("bounded shared-target stitch lists map atomically", () => {
  for (const [input, expected, count] of [
    [
      "Work double crochet and treble crochet in next stitch.",
      "Work single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Work 2 double crochet and treble crochet in next stitch.",
      "Work 2 single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Work double crochet or half treble crochet in next stitch.",
      "Work single crochet (sc) or half double crochet (hdc) in next stitch.",
      2,
    ],
    [
      "Work double crochet, then treble crochet in next stitch.",
      "Work single crochet (sc), then double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Make double crochet and treble crochet in next stitch.",
      "Make single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "> - Work double crochet and treble crochet in next stitch.",
      "> - Work single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Work double crochet, treble crochet, and half treble crochet in next stitch.",
      "Work single crochet (sc), double crochet (dc), and half double crochet (hdc) in next stitch.",
      3,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const unsupported of [
    "Work both DC and DC in next stitch.",
    "Work front DC and DC in next stitch.",
    "Work carefully DC and DC in next stitch.",
    "Work red DC and DC in next stitch.",
    "Work alternate DC and DC in next stitch.",
    "Work both double crochet and treble crochet in next stitch.",
    "Work carefully double crochet and treble crochet in next stitch.",
    "Work journal mentions double crochet and treble crochet in next stitch.",
  ]) {
    const result = decodeVintagePattern(unsupported, "uk");
    assert.equal(result.output, unsupported, unsupported);
    assert.equal(result.substitutionCount, 0, unsupported);
  }
});

test("shared stitch lists use one bounded atomic decision", () => {
  for (const [input, expected, count] of [
    [
      "Work double crochet and treble crochet in ch-1 space.",
      "Work single crochet (sc) and double crochet (dc) in ch-1 space.",
      2,
    ],
    [
      "Work 2 double crochet and 3 treble crochet in next stitch.",
      "Work 2 single crochet (sc) and 3 double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Make a double crochet or a half treble crochet in next stitch.",
      "Make a single crochet (sc) or a half double crochet (hdc) in next stitch.",
      2,
    ],
    [
      "Row 1: Work the double crochet, treble crochet, and half treble crochet in next stitch.",
      "Row 1: Work the single crochet (sc), double crochet (dc), and half double crochet (hdc) in next stitch.",
      3,
    ],
    [
      "Body: Work double crochet and treble crochet in next stitch.",
      "Body: Work single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Motif A: Make double crochet or treble crochet in next stitch.",
      "Motif A: Make single crochet (sc) or double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Work color A double crochet and treble crochet in next stitch.",
      "Work color A single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Work color B double crochet and treble crochet in next stitch.",
      "Work color B single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "> 1. Make yarn over, double crochet; then treble crochet in next stitch.",
      "> 1. Make yarn over, single crochet (sc); then double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Work [2 double crochet / 3 treble crochet] in next stitch.",
      "Work [2 single crochet (sc) / 3 double crochet (dc)] in next stitch.",
      2,
    ],
    [
      "Work (double crochet; treble crochet) in next stitch.",
      "Work (single crochet (sc); double crochet (dc)) in next stitch.",
      2,
    ],
    [
      "Work {double crochet, treble crochet, and half treble crochet} in next stitch, then turn.",
      "Work {single crochet (sc), double crochet (dc), and half double crochet (hdc)} in next stitch, then turn.",
      3,
    ],
    [
      "Work **double crochet and treble crochet** and place marker.",
      "Work **single crochet (sc) and double crochet (dc)** and place marker.",
      2,
    ],
    [
      "Work (double crochet and treble crochet) twice.",
      "Work (single crochet (sc) and double crochet (dc)) twice.",
      2,
    ],
    [
      "Work (double crochet and treble crochet) is worked in next stitch.",
      "Work (single crochet (sc) and double crochet (dc)) is worked in next stitch.",
      2,
    ],
    [
      "Work double crochet and treble crochet in next stitch and 3 TR in following stitch.",
      "Work single crochet (sc) and double crochet (dc) in next stitch and 3 double crochet (dc) in following stitch.",
      3,
    ],
    [
      "Use special yarn and work (dc, tr) in next stitch.",
      "Use special yarn and work (single crochet (sc), double crochet (dc)) in next stitch.",
      2,
    ],
    [
      "Work __double crochet and treble crochet__ in next stitch.",
      "Work __single crochet (sc) and double crochet (dc)__ in next stitch.",
      2,
    ],
    [
      "Work (double crochet and treble crochet) twenty-one times.",
      "Work (single crochet (sc) and double crochet (dc)) twenty-one times.",
      2,
    ],
    [
      "Work [double crochet and treble crochet](https://example.com/pattern) in next stitch.",
      "Work [single crochet (sc) and double crochet (dc)](https://example.com/pattern) in next stitch.",
      2,
    ],
    [
      "Work (double crochet and treble crochet) in next stitch; repeat (htr / dtr); (double crochet / treble crochet).",
      "Work (single crochet (sc) and double crochet (dc)) in next stitch; repeat (half double crochet (hdc) / treble crochet (tr)); (single crochet (sc) / double crochet (dc)).",
      6,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const prose of [
    "(double crochet and treble crochet) are labels.",
    "The article mentions 2 double crochet and treble crochet in next stitch.",
    "The article mentions 2 double crochet in next stitch.",
    "The article mentions (double crochet and treble crochet) in next stitch.",
    "The article mentions [double crochet and treble crochet] in next stitch.",
    "The article mentions (double crochet; treble crochet) in next stitch.",
    "The article mentions (double crochet and treble crochet).",
    "Work both double crochet and treble crochet in next stitch.",
    "Work carefully (double crochet and treble crochet).",
    "Work yarn journal mentions double crochet and treble crochet in next stitch.",
    "Work marker notes list DC and TR in next stitch.",
    "Work color A journal notes double crochet and treble crochet in next stitch.",
    "Work yarn over, notes double crochet and treble crochet in next stitch.",
    "Work [double crochet and treble crochet) in next stitch.",
    "Work double crochet and treble crochet in next stitch as labels.",
    "Work double crochet and treble crochet in next stitch, work is discussed.",
    "Work double crochet and treble crochet in next stitch, dc.txt is metadata.",
    "Work (double crochet and treble crochet); (these are labels).",
    "Work (double crochet and treble crochet); [metadata follows].",
    "Work (double crochet and treble crochet); __labels appear__.",
    "Work (double crochet and treble crochet); double crochet is metadata.",
    "Work (double crochet and treble crochet) in next stitch; repeat (these are labels).",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    assert.equal(result.output, prose, prose);
    assert.equal(result.substitutionCount, 0, prose);
  }

  const custom = "Definitions:\ndc = drop color\nBody:\nWork dc and tr in next stitch.";
  const customResult = decodeVintagePattern(custom, "uk");
  assert.equal(customResult.output, custom);
  assert.equal(customResult.substitutionCount, 0);

  const customWithoutTarget = "Definitions:\ndc = drop color\nBody:\nWork dc and tr.";
  const customWithoutTargetResult = decodeVintagePattern(customWithoutTarget, "uk");
  assert.equal(customWithoutTargetResult.output, customWithoutTarget);
  assert.equal(customWithoutTargetResult.substitutionCount, 0);
});

test("shared-list adversarial boundaries remain all-or-none", () => {
  for (const [input, expected, count = 2] of [
    [
      "Work double crochet and treble crochet twenty-one times.",
      "Work single crochet (sc) and double crochet (dc) twenty-one times.",
    ],
    [
      "Work **double crochet and treble crochet** seventy-seven times.",
      "Work **single crochet (sc) and double crochet (dc)** seventy-seven times.",
    ],
    [
      "Work __half treble crochet and double crochet__ in next stitch.",
      "Work __half double crochet (hdc) and single crochet (sc)__ in next stitch.",
    ],
    [
      "Work __half treble crochet, double treble crochet, and double crochet__ in next stitch.",
      "Work __half double crochet (hdc), treble crochet (tr), and single crochet (sc)__ in next stitch.",
      3,
    ],
    [
      "Work double crochet and treble crochet across and 3 TR in following stitch.",
      "Work single crochet (sc) and double crochet (dc) across and 3 double crochet (dc) in following stitch.",
      3,
    ],
    [
      "Using your working yarn and then work dc and tr in next stitch.",
      "Using your working yarn and then work single crochet (sc) and double crochet (dc) in next stitch.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const input of [
    "Use journal notes and work double crochet and treble crochet in next stitch.",
    "Using metadata records and then work dc and tr in next stitch.",
    "Work color double crochet and treble crochet in next stitch.",
    "Work colour double crochet and treble crochet in next stitch.",
    "Work dc and journal and tr in next stitch.",
    "Work [dc](a) and widget and tr in next stitch.",
    "Row 1: Work [dc](a) and widget and tr in next stitch.",
    "> 1. Work [dc](a) and widget and tr in next stitch.",
    "> 1. Work [dc][a] and widget and tr in next stitch.\n[a]: a",
    "Work [dc](a) and tr-id in next stitch.",
    "Work [dc](a) and tr.txt in next stitch.",
    "Work [dc](a) and tr/debug in next stitch.",
    "Work [dc](a) and tr\\debug in next stitch.",
    "Work [dc](a) and tr—id in next stitch.",
    "Row 1: Work [dc](a) and tr-id in next stitch.",
    "> 1. Work [dc](a) and tr-id in next stitch.",
    "> 1. Work [dc][a] and tr-id in next stitch.\n[a]: a",
    "Work double crochet, widget, and treble crochet in next stitch.",
    "Work dc then foo then tr in next stitch.",
    "Work dc / blob / tr in next stitch.",
    "Work dc; note; tr in next stitch.",
    "Work dc-id and tr in next stitch.",
    "Work dc2 and tr in next stitch.",
    "Work dc2foo and tr in next stitch.",
    "Work dcα and tr in next stitch.",
    "Work dc.txt and tr in next stitch.",
    "Work dc/debug and tr in next stitch.",
    "Work dc\\debug and tr in next stitch.",
    "Work dc and tr-id in next stitch.",
    "Work dc and tr.txt in next stitch.",
    "![double crochet and treble crochet](https://example.com/image.png) in next stitch.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  for (const [input, expected] of [
    [
      'Work [dc](a "and widget and") and tr in next stitch.',
      'Work [single crochet (sc)](a "and widget and") and double crochet (dc) in next stitch.',
    ],
    [
      "Work [dc][and widget and] and tr in next stitch.\n[and widget and]: a",
      "Work [single crochet (sc)][and widget and] and double crochet (dc) in next stitch.\n[and widget and]: a",
    ],
    [
      'Work [dc](a "tr-id") and tr in next stitch.',
      'Work [single crochet (sc)](a "tr-id") and double crochet (dc) in next stitch.',
    ],
    [
      "Work [dc][tr-id] and tr in next stitch.\n[tr-id]: a",
      "Work [single crochet (sc)][tr-id] and double crochet (dc) in next stitch.\n[tr-id]: a",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 2, input);
  }

  for (const termCount of [9, 10, 11]) {
    const terms = Array.from(
      { length: termCount },
      (_, index) => index % 2 === 0 ? "double crochet" : "treble crochet",
    );
    const input = `Work ${terms.join(", ")} in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  for (const [input, expected, count] of [
    [
      "Work `[dc](a) and tr` in next stitch.",
      "Work `[dc](a) and tr` in next stitch.",
      0,
    ],
    [
      "Work `dc and tr` in first tr.",
      "Work `dc and tr` in first double crochet (dc).",
      1,
    ],
    ["Work ``dc and tr`` in next stitch.", "Work ``dc and tr`` in next stitch.", 0],
    ["Work ```dc and tr``` in next stitch.", "Work ```dc and tr``` in next stitch.", 0],
    [
      "Row 1: Work `[dc](a) and tr` in next stitch.",
      "Row 1: Work `[dc](a) and tr` in next stitch.",
      0,
    ],
    [
      "> 1. Work `[dc](a) and tr` in next stitch.",
      "> 1. Work `[dc](a) and tr` in next stitch.",
      0,
    ],
    [
      "Work `[dc](a) and tr` in next stitch. Work htr in next stitch.",
      "Work `[dc](a) and tr` in next stitch. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch. Work `[dc](a) and tr` in next stitch.",
      "Work half double crochet (hdc) in next stitch. Work `[dc](a) and tr` in next stitch.",
      1,
    ],
  ]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `${input} took ${elapsed.toFixed(1)} ms`);
  }
});

test("inline-code Work lists own bounded opacity and target authority", () => {
  for (const [input, expected, count] of [
    [
      "Work `dc and tr` in first htr.",
      "Work `dc and tr` in first half double crochet (hdc).",
      1,
    ],
    [
      "Work `dc and tr` in first htr;",
      "Work `dc and tr` in first half double crochet (hdc);",
      1,
    ],
    [
      "Work `dc and tr` in first htr.;",
      "Work `dc and tr` in first half double crochet (hdc).;",
      1,
    ],
    [
      "Work `dc and tr` in first htr!?;",
      "Work `dc and tr` in first half double crochet (hdc)!?;",
      1,
    ],
    ["Work `widget` in first tr.", "Work `widget` in first tr.", 0],
    ["Work ` ` in first tr.", "Work ` ` in first tr.", 0],
    ["Work `tension` in first tr.", "Work `tension` in first tr.", 0],
    ["Work `tension square` in first tr.", "Work `tension square` in first tr.", 0],
    ["Work `[widget](dc)` in first tr.", "Work `[widget](dc)` in first tr.", 0],
    ["Work `[widget][dc]` in first tr.", "Work `[widget][dc]` in first tr.", 0],
    [
      "Work `[dc](widget)` in first tr.",
      "Work `[dc](widget)` in first double crochet (dc).",
      1,
    ],
    ["Work `dc`x in first tr.", "Work `dc`x in first tr.", 0],
    ["Work (`dc`) in first tr.", "Work (`dc`) in first tr.", 0],
    [
      "Work `dc` and tr in first htr.",
      "Work `dc` and double crochet (dc) in first half double crochet (hdc).",
      2,
    ],
    [
      "Work `dc` and tr in first htr;",
      "Work `dc` and double crochet (dc) in first half double crochet (hdc);",
      2,
    ],
    [
      "Work `widget` and tr in first htr.",
      "Work `widget` and double crochet (dc) in first half double crochet (hdc).",
      2,
    ],
    [
      "Work dc and `tr` in first htr.",
      "Work dc and `tr` in first half double crochet (hdc).",
      1,
    ],
    [
      "Work dc and `widget` and tr in first htr.",
      "Work dc and `widget` and double crochet (dc) in first half double crochet (hdc).",
      2,
    ],
    [
      "Work `widget` and dc and tr in first htr.",
      "Work `widget` and dc and tr in first half double crochet (hdc).",
      1,
    ],
    [
      "Work `dc` and widget and tr in first htr.",
      "Work `dc` and widget and tr in first htr.",
      0,
    ],
    [
      "Work `dc`, then tr in first htr.",
      "Work `dc`, then double crochet (dc) in first half double crochet (hdc).",
      2,
    ],
    [
      "Work ``[dc](a) and `tr` `` in first htr.",
      "Work ``[dc](a) and `tr` `` in first half double crochet (hdc).",
      1,
    ],
  ]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected, input);
    assert.ok(Array.isArray(result.signals), input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `${input} took ${elapsed.toFixed(1)} ms`);
  }

  for (const [slashCount, count] of [[1, 0], [2, 1], [32, 1], [33, 0], [34, 0]]) {
    const slashes = "\\".repeat(slashCount);
    const input = `Work ${slashes}\`dc and tr${slashes}\` in first htr.`;
    const expectedTarget = count === 1 ? "half double crochet (hdc)" : "htr";
    const expected = `Work ${slashes}\`dc and tr${slashes}\` in first ${expectedTarget}.`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    assert.ok(performance.now() - startedAt < 2_000, input);
  }

  for (const [delimiterLength, count] of [[1, 1], [2, 1], [3, 1], [16, 1], [17, 0]]) {
    const delimiter = "`".repeat(delimiterLength);
    const input = `Work ${delimiter}dc and tr${delimiter} in first htr.`;
    const expectedTarget = count === 1 ? "half double crochet (hdc)" : "htr";
    const expected = `Work ${delimiter}dc and tr${delimiter} in first ${expectedTarget}.`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    assert.ok(performance.now() - startedAt < 2_000, input);
  }
});

test("inline-code Work spans isolate malformed syntax and real neighbors", () => {
  const invalid = "Work `[dc](a) and tr` in next stitch.";
  const converted = "Work half double crochet (hdc) in next stitch.";
  for (const separator of [". ", "! ", "? ", "; "]) {
    const invalidFirst = `${invalid.slice(0, -1)}${separator}${converted.replace(
      "half double crochet (hdc)",
      "htr",
    )}`;
    const expectedInvalidFirst = `${invalid.slice(0, -1)}${separator}${converted}`;
    const validFirst = `${converted.replace(
      "half double crochet (hdc)",
      "htr",
    ).slice(0, -1)}${separator}${invalid}`;
    const expectedValidFirst = `${converted.slice(0, -1)}${separator}${invalid}`;
    for (const [input, expected] of [
      [invalidFirst, expectedInvalidFirst],
      [validFirst, expectedValidFirst],
    ]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, input);
      assert.equal(result.substitutionCount, 1, input);
      assert.equal(result.segments.map(({ content }) => content).join(""), expected, input);
      assert.ok(performance.now() - startedAt < 2_000, input);
    }
  }

  for (const [input, expected, count] of [
    ["Work `[dc](a) and tr in next stitch.", "Work `[dc](a) and tr in next stitch.", 0],
    ["Work ``[dc](a) and tr` in next stitch.", "Work ``[dc](a) and tr` in next stitch.", 0],
    ["Work `[dc](a) and tr`` in next stitch.", "Work `[dc](a) and tr`` in next stitch.", 0],
    [
      "Work `[dc](a) and tr in next stitch. Work htr in next stitch.",
      "Work `[dc](a) and tr in next stitch. Work htr in next stitch.",
      0,
    ],
    [
      "Work htr in next stitch. Work `[dc](a) and tr in next stitch.",
      "Work half double crochet (hdc) in next stitch. Work `[dc](a) and tr in next stitch.",
      1,
    ],
    [
      "Work `[dc](a). Work tr in next stitch.`. Work htr in next stitch.",
      "Work `[dc](a). Work tr in next stitch.`. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "> 1. Body: Work dc in next stitch. Work `[dc](a) and tr` in next stitch.",
      "> 1. Body: Work single crochet (sc) in next stitch. Work `[dc](a) and tr` in next stitch.",
      1,
    ],
    [
      "Work `[widget](foo)` in next stitch. Work htr in next stitch.",
      "Work `[widget](foo)` in next stitch. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work `[dc](a) and tr` in next stitch, then Work htr in next stitch.",
      "Work `[dc](a) and tr` in next stitch, then Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch, then Work `[dc](a) and tr` in next stitch.",
      "Work half double crochet (hdc) in next stitch, then Work `[dc](a) and tr` in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch, then Work dc_id in next stitch. Work `dc` in first tr.",
      "Work htr in next stitch, then Work dc_id in next stitch. Work `dc` in first double crochet (dc).",
      1,
    ],
    [
      "Work `dc` in first tr. Work htr in next stitch, then Work dc_id in next stitch.",
      "Work `dc` in first double crochet (dc). Work htr in next stitch, then Work dc_id in next stitch.",
      1,
    ],
    [
      "Work `dc` in first tr, then Work htr in next stitch, then Work dc_id in next stitch.",
      "Work `dc` in first double crochet (dc), then Work htr in next stitch, then Work dc_id in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch, then Work dc_id in next stitch, then Work `dc` in first tr.",
      "Work htr in next stitch, then Work dc_id in next stitch, then Work `dc` in first double crochet (dc).",
      1,
    ],
    [
      "Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch.",
      "Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch.",
      0,
    ],
    [
      "Work [dc_id](a-`opaque`) in next stitch, then Work htr in next stitch.",
      "Work [dc_id](a-`opaque`) in next stitch, then Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch. Work tr in next stitch.",
      "Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch. Work double crochet (dc) in next stitch.",
      1,
    ],
    [
      "Work tr in next stitch. Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch.",
      "Work double crochet (dc) in next stitch. Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch.",
      1,
    ],
    [
      "> 1. Body: Work [dc_id](a-`opaque`) in next stitch, then Work htr in next stitch.",
      "> 1. Body: Work [dc_id](a-`opaque`) in next stitch, then Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "> 1. Body: Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch.",
      "> 1. Body: Work htr in next stitch, then Work [dc_id](a-`opaque`) in next stitch.",
      0,
    ],
    [
      "> 1. Body: Work [dc_id](a-`opaque`) in next stitch,\u00a0then\u00a0Work htr in next stitch.",
      "> 1. Body: Work [dc_id](a-`opaque`) in next stitch,\u00a0then\u00a0Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "> 1. Body: Work htr in next stitch,\u2003then\u2003Work [dc_id](a-`opaque`) in next stitch.",
      "> 1. Body: Work htr in next stitch,\u2003then\u2003Work [dc_id](a-`opaque`) in next stitch.",
      0,
    ],
    [
      "> 1. Body: Work `[dc](a) and tr` in next stitch, then Work htr in next stitch.",
      "> 1. Body: Work `[dc](a) and tr` in next stitch, then Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work `[dc](a) and tr` in next stitch,\u00a0then\u00a0Work htr in next stitch.",
      "Work `[dc](a) and tr` in next stitch,\u00a0then\u00a0Work half double crochet (hdc) in next stitch.",
      1,
    ],
  ]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected, input);
    assert.ok(performance.now() - startedAt < 2_000, input);
  }
});

test("inline-code comma chains honor the atomic 64-command ceiling", () => {
  const unit = "Work `widget` in next stitch, then ";
  for (const [separatorCount, accepted] of [[63, true], [64, false], [570, false]]) {
    const input = `${unit.repeat(separatorCount)}Work htr in next stitch.`;
    const expected = accepted
      ? `${unit.repeat(separatorCount)}Work half double crochet (hdc) in next stitch.`
      : input;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, `${separatorCount} separators`);
    assert.equal(result.substitutionCount, accepted ? 1 : 0, `${separatorCount} separators`);
    assert.equal(
      result.segments.map(({ content }) => content).join(""),
      expected,
      `${separatorCount} separators`,
    );
    assert.deepEqual(result.signals, [], `${separatorCount} separators`);
    assert.ok(
      performance.now() - startedAt < 2_000,
      `${separatorCount} inline-code separators should stay bounded`,
    );
  }

  const periodUnit = "Work `widget` in next stitch. ";
  for (const [label, input, accepted] of [
    ["62 commas plus one period", `${unit.repeat(62)}${periodUnit}Work htr in next stitch.`, true],
    ["63 commas plus one period", `${unit.repeat(63)}${periodUnit}Work htr in next stitch.`, false],
    ["63 periods", `${periodUnit.repeat(63)}Work htr in next stitch.`, true],
    ["64 periods", `${periodUnit.repeat(64)}Work htr in next stitch.`, false],
  ]) {
    const expected = accepted
      ? input.replace(
        /Work htr in next stitch\.$/u,
        "Work half double crochet (hdc) in next stitch.",
      )
      : input;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, label);
    assert.equal(result.substitutionCount, accepted ? 1 : 0, label);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
    assert.deepEqual(result.signals, [], label);
    assert.ok(performance.now() - startedAt < 2_000, `${label} should stay bounded`);
  }

  const overflowLine = `${unit.repeat(64)}Work htr in next stitch.`;
  const validLine = "Work htr in next stitch.";
  const expectedValidLine = "Work half double crochet (hdc) in next stitch.";
  for (const [separatorCount, accepted] of [[62, true], [63, true], [64, false]]) {
    const input = `Rnd. 2: ${unit.repeat(separatorCount)}${validLine}`;
    const expected = accepted
      ? `Rnd. 2: ${unit.repeat(separatorCount)}${expectedValidLine}`
      : input;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, `standalone Rnd.:${separatorCount}`);
    assert.equal(result.substitutionCount, accepted ? 1 : 0, `standalone Rnd.:${separatorCount}`);
  }
  for (const eol of ["\n", "\r\n"]) {
    for (const overflowFirst of [true, false]) {
      const input = overflowFirst
        ? `${overflowLine}${eol}${validLine}`
        : `${validLine}${eol}${overflowLine}`;
      const expected = overflowFirst
        ? `${overflowLine}${eol}${expectedValidLine}`
        : `${expectedValidLine}${eol}${overflowLine}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, `${JSON.stringify(eol)}:${overflowFirst}`);
      assert.equal(result.substitutionCount, 1, `${JSON.stringify(eol)}:${overflowFirst}`);
      assert.equal(
        result.segments.map(({ content }) => content).join(""),
        expected,
        `${JSON.stringify(eol)}:${overflowFirst}`,
      );
      assert.deepEqual(result.signals, [], `${JSON.stringify(eol)}:${overflowFirst}`);
      assert.ok(
        performance.now() - startedAt < 2_000,
        `${JSON.stringify(eol)}:${overflowFirst} should stay physically scoped`,
      );
    }

    for (const [label, block, expectedBlock, count] of [
      [
        "source",
        "Source: https://example.test/`dc`" + eol + validLine,
        "Source: https://example.test/`dc`" + eol + expectedValidLine,
        1,
      ],
      [
        "prose",
        "This note mentions dc in passing." + eol + validLine,
        "This note mentions dc in passing." + eol + expectedValidLine,
        1,
      ],
      [
        "custom definition",
        "Abbreviations:" + eol + "htr = half turn" + eol + "Row 1: Work htr in next stitch.",
        "Abbreviations:" + eol + "htr = half turn" + eol + "Row 1: Work htr in next stitch.",
        0,
      ],
      [
        "reference definition",
        "[ref]: /url" + eol + "Work [htr][ref] in next stitch.",
        "[ref]: /url" + eol + "Work [half double crochet (hdc)][ref] in next stitch.",
        1,
      ],
    ]) {
      const input = `${overflowLine}${eol}${block}`;
      const expected = `${overflowLine}${eol}${expectedBlock}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, `${JSON.stringify(eol)}:${label}`);
      assert.equal(result.substitutionCount, count, `${JSON.stringify(eol)}:${label}`);
      assert.equal(
        result.segments.map(({ content }) => content).join(""),
        expected,
        `${JSON.stringify(eol)}:${label}`,
      );
      assert.deepEqual(result.signals, [], `${JSON.stringify(eol)}:${label}`);
    }

    for (const [validLineCount, accepted] of [[63, true], [64, false]]) {
      const validLines = Array(validLineCount).fill(validLine).join(eol);
      const expectedValidLines = Array(validLineCount).fill(expectedValidLine).join(eol);
      for (const terminalEol of ["", eol]) {
        const input = `${overflowLine}${eol}${validLines}${terminalEol}`;
        const expected = accepted
          ? `${overflowLine}${eol}${expectedValidLines}${terminalEol}`
          : input;
        const result = decodeVintagePattern(input, "uk");
        const label = `${JSON.stringify(eol)}:${validLineCount}:${Boolean(terminalEol)}`;
        assert.equal(result.output, expected, label);
        assert.equal(result.substitutionCount, accepted ? validLineCount : 0, label);
        assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
        assert.deepEqual(result.signals, [], label);
      }
    }

    for (const [separatorCount, accepted] of [[62, true], [63, true], [64, false]]) {
      const markedLine = `> 1. Body: ${unit.repeat(separatorCount)}${validLine}`;
      const expectedMarkedLine = accepted
        ? `> 1. Body: ${unit.repeat(separatorCount)}${expectedValidLine}`
        : markedLine;
      const input = `${markedLine}${eol}${validLine}`;
      const expected = `${expectedMarkedLine}${eol}${expectedValidLine}`;
      const result = decodeVintagePattern(input, "uk");
      const label = `${JSON.stringify(eol)}:marked:${separatorCount}`;
      assert.equal(result.output, expected, label);
      assert.equal(result.substitutionCount, accepted ? 2 : 1, label);
      assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
      assert.deepEqual(result.signals, [], label);

      const abbreviatedLine = `Rnd. 2: ${unit.repeat(separatorCount)}${validLine}`;
      const expectedAbbreviatedLine = accepted
        ? `Rnd. 2: ${unit.repeat(separatorCount)}${expectedValidLine}`
        : abbreviatedLine;
      const abbreviatedInput = `${abbreviatedLine}${eol}${validLine}`;
      const abbreviatedExpected = `${expectedAbbreviatedLine}${eol}${expectedValidLine}`;
      const abbreviatedStartedAt = performance.now();
      const abbreviatedResult = decodeVintagePattern(abbreviatedInput, "uk");
      const abbreviatedElapsed = performance.now() - abbreviatedStartedAt;
      const abbreviatedLabel = `${JSON.stringify(eol)}:Rnd.:${separatorCount}`;
      assert.equal(abbreviatedResult.output, abbreviatedExpected, abbreviatedLabel);
      assert.equal(abbreviatedResult.substitutionCount, accepted ? 2 : 1, abbreviatedLabel);
      assert.equal(
        abbreviatedResult.segments.map(({ content }) => content).join(""),
        abbreviatedExpected,
        abbreviatedLabel,
      );
      assert.deepEqual(abbreviatedResult.signals, [], abbreviatedLabel);
      assert.ok(
        abbreviatedElapsed < 2_000,
        `${abbreviatedLabel} should stay on the bounded document path`,
      );
    }
  }
});

test("source lines containing code markers stay opaque beside bounded instructions", () => {
  for (const newline of ["\n", "\r\n"]) {
    const input = `Source: https://example.com/\`dc-and-tr\`${newline}Work htr in next stitch.`;
    const expected = `Source: https://example.com/\`dc-and-tr\`${newline}Work half double crochet (hdc) in next stitch.`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected, input);
    assert.ok(performance.now() - startedAt < 2_000, input);
  }
});

test("heading-prefixed unsafe shared-list leads remain atomic", () => {
  for (const heading of ["Row 1:", "Round 2:", "### Row 3:"]) {
    for (const lead of [
      "Work both",
      "Work front",
      "Work carefully",
      "Work red",
      "Work alternate",
      "Work journal mentions",
      "Work color A journal notes",
      "Work yarn over, notes",
    ]) {
      const input = `${heading} ${lead} double crochet and treble crochet in next stitch.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }
  }
});

test("bounded long-form action bridges preserve shared-target conversion", () => {
  for (const [input, expected] of [
    [
      "Work double crochet, place marker, and treble crochet in next stitch.",
      "Work single crochet (sc), place marker, and double crochet (dc) in next stitch.",
    ],
    [
      "Work double crochet, turn, and treble crochet in next stitch.",
      "Work single crochet (sc), turn, and double crochet (dc) in next stitch.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 2, input);
  }
});

test("unknown explicit-clause middles deny the containing instruction", () => {
  const middles = [
    "widget", "place metadata", "skip notes", "join records", "keep journal",
    "fasten record", "use next color theory",
  ];
  for (const prefix of ["", "Row 1: ", "### Row 3: "]) {
    for (const [firstTerm, secondTerm] of [["dc", "tr"], ["double crochet", "treble crochet"]]) {
      for (const middle of middles) {
        for (const [firstTarget, secondTarget] of [
          ["in first dc", "in second dc"],
          ["in next stitch", "in next stitch"],
        ]) {
          const input = `${prefix}Work ${firstTerm} ${firstTarget}, ${middle}, then ${secondTerm} ${secondTarget}.`;
          const result = decodeVintagePattern(input, "uk");
          assert.equal(result.output, input, input);
          assert.equal(result.substitutionCount, 0, input);
        }
      }
    }
  }
});

test("recognized action prefixes require an exact middle-clause boundary", () => {
  for (const [firstTerm, secondTerm] of [["dc", "tr"], ["double crochet", "treble crochet"]]) {
    for (const middle of [
      "join to first dc theory",
      "keep dc notes",
      "repeat from * notes",
      "ch 1 notes",
      "yo and pull through notes",
    ]) {
      const input = `Work ${firstTerm} in first dc, ${middle}, then ${secondTerm} in second dc.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }
  }
});

test("contaminated instructions are isolated from same-line valid instructions", () => {
  for (const delimiter of [". ", "; ", "! ", "? "]) {
    const invalid = "Work dc in first dc, widget, then tr in second dc";
    const valid = "Work htr in next stitch.";
    const converted = "Work half double crochet (hdc) in next stitch.";

    const invalidFirst = `${invalid}${delimiter}${valid}`;
    const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
    assert.equal(invalidFirstResult.output, `${invalid}${delimiter}${converted}`, invalidFirst);
    assert.equal(invalidFirstResult.substitutionCount, 1, invalidFirst);

    const validFirst = `${valid.slice(0, -1)}${delimiter}${invalid}.`;
    const validFirstResult = decodeVintagePattern(validFirst, "uk");
    assert.equal(validFirstResult.output, `${converted.slice(0, -1)}${delimiter}${invalid}.`, validFirst);
    assert.equal(validFirstResult.substitutionCount, 1, validFirst);
  }

  for (const delimiter of [". ", "; ", "! ", "? "]) {
    const invalid = "Work dc in first dc, widget";
    const valid = "Work htr in next stitch.";
    const converted = "Work half double crochet (hdc) in next stitch.";
    for (const input of [
      `${invalid}${delimiter}${valid}`,
      `${valid.slice(0, -1)}${delimiter}${invalid}.`,
    ]) {
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input.replace("htr", "half double crochet (hdc)"), input);
      assert.equal(result.substitutionCount, 1, input);
    }
  }

  for (const invalid of [
    "Row 1: Work dc in first dc, widget, then tr in second dc.",
    "Row 1: Work dc in next stitch, use next color theory, then tr in next stitch.",
    "Row 1: Work dc and widget and tr in next stitch.",
  ]) {
    const valid = "Row 2: Work htr in next stitch.";
    const converted = "Row 2: Work half double crochet (hdc) in next stitch.";

    const invalidFirst = `${invalid} ${valid}`;
    const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
    assert.equal(invalidFirstResult.output, `${invalid} ${converted}`, invalidFirst);
    assert.equal(invalidFirstResult.substitutionCount, 1, invalidFirst);

    const validFirst = `${valid} ${invalid}`;
    const validFirstResult = decodeVintagePattern(validFirst, "uk");
    assert.equal(validFirstResult.output, `${converted} ${invalid}`, validFirst);
    assert.equal(validFirstResult.substitutionCount, 1, validFirst);
  }
});

test("contaminated instructions do not suppress neighboring command forms", () => {
  const invalid = "Work dc in first dc, widget, then tr in second dc";
  const validCommands = [
    ["Join to first tr made.", "Join to first double crochet (dc) made.", 1],
    ["Ch 3 counts as first dc of row.", "Ch 3 counts as first single crochet (sc) of row.", 1],
    ["2 DC in next stitch.", "2 single crochet (sc) in next stitch.", 1],
    ["Repeat in previous TR.", "Repeat in previous double crochet (dc).", 1],
    [
      "Work (dc, tr) in next stitch.",
      "Work (single crochet (sc), double crochet (dc)) in next stitch.",
      2,
    ],
    ["Work double crochet (dc) in next stitch.", "Work single crochet (sc) in next stitch.", 1],
    ["Work treble (tr) in next stitch.", "Work double crochet (dc) in next stitch.", 1],
    ["Work half treble (htr) in next stitch.", "Work half double crochet (hdc) in next stitch.", 1],
    ["Work dtr (double treble) in next stitch.", "Work treble crochet (tr) in next stitch.", 1],
    ["Work dc (double crochet) in next stitch.", "Work single crochet (sc) in next stitch.", 1],
    ["Work tr (treble crochet) in next stitch.", "Work double crochet (dc) in next stitch.", 1],
  ];

  for (const delimiter of [". ", "; ", "! ", "? "]) {
    for (const [valid, converted, count] of validCommands) {
      const invalidFirst = `${invalid}${delimiter}${valid}`;
      const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
      assert.equal(invalidFirstResult.output, `${invalid}${delimiter}${converted}`, invalidFirst);
      assert.equal(invalidFirstResult.substitutionCount, count, invalidFirst);

      const validFirst = `${valid.slice(0, -1)}${delimiter}${invalid}.`;
      const validFirstResult = decodeVintagePattern(validFirst, "uk");
      assert.equal(
        validFirstResult.output,
        `${converted.slice(0, -1)}${delimiter}${invalid}.`,
        validFirst,
      );
      assert.equal(validFirstResult.substitutionCount, count, validFirst);
    }
  }
});

test("construction headings isolate neighboring valid and contaminated commands", () => {
  for (const heading of ["Body", "Sleeve", "Chart", "Motif A", "Crown", "Ribbing"]) {
    for (const delimiter of [". ", "; "]) {
      const invalid = `${heading}: Work dc in first dc, widget, then tr in second dc`;
      const valid = `${heading}: Work htr in next stitch.`;
      const converted = `${heading}: Work half double crochet (hdc) in next stitch.`;

      const invalidFirst = `${invalid}${delimiter}${valid}`;
      const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
      assert.equal(invalidFirstResult.output, `${invalid}${delimiter}${converted}`, invalidFirst);
      assert.equal(invalidFirstResult.substitutionCount, 1, invalidFirst);

      const validFirst = `${valid.slice(0, -1)}${delimiter}${invalid}.`;
      const validFirstResult = decodeVintagePattern(validFirst, "uk");
      assert.equal(
        validFirstResult.output,
        `${converted.slice(0, -1)}${delimiter}${invalid}.`,
        validFirst,
      );
      assert.equal(validFirstResult.substitutionCount, 1, validFirst);
    }
  }
});

test("construction headings recognize direct long-form stitch commands", () => {
  const commands = [
    [
      "Work double crochet in next stitch.",
      "Work single crochet (sc) in next stitch.",
      1,
    ],
    [
      "Make half treble crochet in next stitch.",
      "Make half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work double crochet and treble crochet in next stitch.",
      "Work single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "Make dc and tr in next stitch.",
      "Make single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
    [
      "double crochet and treble crochet in next stitch.",
      "single crochet (sc) and double crochet (dc) in next stitch.",
      2,
    ],
  ];

  for (const heading of [
    "Body",
    "Sleeve",
    "Chart",
    "Motif A",
    "Crown",
    "Ribbing",
    "Shape armholes",
  ]) {
    for (const [command, converted, count] of commands) {
      const input = `${heading}: ${command}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, `${heading}: ${converted}`, input);
      assert.equal(result.substitutionCount, count, input);
    }
  }

  const namedDefinition = "Special stitches:\nSleeve stitch:\nWork double crochet and treble crochet in next stitch.\nBody:\nWork dc and tr in next stitch.";
  const namedDefinitionResult = decodeVintagePattern(namedDefinition, "uk");
  assert.equal(
    namedDefinitionResult.output,
    "Special stitches:\nSleeve stitch:\nWork double crochet and treble crochet in next stitch.\nBody:\nWork single crochet (sc) and double crochet (dc) in next stitch.",
  );
  assert.equal(namedDefinitionResult.substitutionCount, 2);
});

test("construction headings retain bounded positional command grammar", () => {
  const headings = [
    "Body",
    "Sleeve",
    "Chart",
    "Motif A",
    "Crown",
    "Ribbing",
    "Shape armholes",
  ];
  const validActions = [
    "Join to first {term} made.",
    "sl st to first {term}.",
    "Ch 3 counts as first {term} of row.",
    "Repeat in previous {term}.",
    "Work in first {term} of previous row, ch 1.",
    "insert hook into next {term}.",
    "pull through next {term}.",
    "sk next {term}.",
    "miss next {term}.",
    "increase in next {term}.",
    "decrease in next {term}.",
  ];

  for (const heading of headings) {
    for (const [term, replacement] of [
      ["double crochet", "single crochet (sc)"],
      ["dc", "single crochet (sc)"],
    ]) {
      for (const action of validActions) {
        const input = `${heading}: ${action.replace("{term}", term)}`;
        const result = decodeVintagePattern(input, "uk");
        assert.equal(
          result.output,
          `${heading}: ${action.replace("{term}", replacement)}`,
          input,
        );
        assert.equal(result.substitutionCount, 1, input);
      }
    }
  }

  for (const heading of headings) {
    for (const prose of [
      "Join records cite first double crochet.",
      "sl st records cite first double crochet.",
      "Ch 3 notes cite first double crochet of row.",
      "Repeat notes cite previous double crochet.",
      "Work journal mentions first double crochet.",
      "insert hook notes cite next double crochet.",
      "pull through notes cite next double crochet.",
      "sk notes cite next double crochet.",
      "miss notes cite next double crochet.",
      "increase notes cite next double crochet.",
      "decrease notes cite next double crochet.",
      "Work in first double crochet as a label.",
      "Join to first double crochet theory.",
      "Join to first front post double crochet.",
    ]) {
      const input = `${heading}: ${prose}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }
  }
});

test("construction headings preserve bounded positional action bridges", () => {
  const headings = [
    "Body",
    "Sleeve",
    "Chart",
    "Motif A",
    "Crown",
    "Ribbing",
    "Shape armholes",
  ];
  const termSets = [
    ["dc", "tr", "single crochet (sc)", "double crochet (dc)"],
    [
      "double crochet",
      "treble crochet",
      "single crochet (sc)",
      "double crochet (dc)",
    ],
  ];

  for (const heading of headings) {
    for (const [first, second, mappedFirst, mappedSecond] of termSets) {
      for (const [bridge, mappedBridge, bridgeCount] of [
        ["place marker", "place marker", 0],
        [`join to first ${first}`, `join to first ${mappedFirst}`, 1],
        [`keep ${first}`, `keep ${mappedFirst}`, 1],
      ]) {
        const input = `${heading}: Work ${first} in first ${first}, ${bridge}, then ${second} in second ${first}.`;
        const result = decodeVintagePattern(input, "uk");
        assert.equal(
          result.output,
          `${heading}: Work ${mappedFirst} in first ${mappedFirst}, ${mappedBridge}, then ${mappedSecond} in second ${mappedFirst}.`,
          input,
        );
        assert.equal(result.substitutionCount, 4 + bridgeCount, input);
      }

      for (const invalidBridge of [
        `join to first ${first} theory`,
        `keep ${first} notes`,
        "place marker is discussed",
        "yo and pull through notes",
      ]) {
        const input = `${heading}: Work ${first} in first ${first}, ${invalidBridge}, then ${second} in second ${first}.`;
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, input, input);
        assert.equal(result.substitutionCount, 0, input);
      }
    }
  }
});

test("construction headings distinguish bounded numeric instructions from numeric prose", () => {
  for (const [input, expected, count] of [
    [
      "Body: Work 1 double crochet in 101st double crochet.",
      "Body: Work 1 single crochet (sc) in 101st single crochet (sc).",
      2,
    ],
    ["Body: 2 DC in 3rd stitch.", "Body: 2 single crochet (sc) in 3rd stitch.", 1],
    [
      "Body: Work carefully in 3rd DC.",
      "Body: Work carefully in 3rd single crochet (sc).",
      1,
    ],
    [
      "Body: Work stitches evenly in 21st dc.",
      "Body: Work stitches evenly in 21st single crochet (sc).",
      1,
    ],
    [
      "Body: Work 2 dc into ch-1 space.",
      "Body: Work 2 single crochet (sc) into ch-1 space.",
      1,
    ],
    [
      "Body: Work DC in next stitch.",
      "Body: Work single crochet (sc) in next stitch.",
      1,
    ],
    [
      "Body: Work dc in first dc, ch 1, then tr in second dc.",
      "Body: Work single crochet (sc) in first single crochet (sc), ch 1, then double crochet (dc) in second single crochet (sc).",
      4,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const heading of [
    "Body",
    "Sleeve",
    "Chart",
    "Motif A",
    "Crown",
    "Ribbing",
    "Shape armholes",
    "> 1. Body",
  ]) {
    const input = `${heading}: yo, 3 dc in 4th stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${heading}: yo, 3 single crochet (sc) in 4th stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 1, input);
  }

  for (const context of ["", "Row 1: ", "Body: ", "> 1. Body: "]) {
    for (const prose of [
      "add 2 notes cite 3 dc.",
      "sl st 12 records list 21 DC.",
      "yo, 3 dc theory.",
      "Work dc theory.",
      "Work dc in next stitch theory.",
      "3 dc across label.",
    ]) {
      const input = `${context}${prose}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }
  }
});

test("bare command-like prose cannot authorize positional stitch terms", () => {
  for (const lead of [
    "add",
    "begin",
    "commence",
    "complete",
    "continue",
    "crochet",
    "decrease",
    "finish",
    "increase",
    "join",
    "make",
    "miss",
    "place",
    "repeat",
    "skip",
    "start",
    "turn",
    "use",
    "using",
    "work",
    "sl st",
    "insert hook",
    "pull through",
    "sk",
    "yo",
    "beg",
    "rep",
    "cont",
    "2 ch",
    "miss",
    "increase",
    "decrease",
  ]) {
    for (const term of ["dc", "DC", "double crochet"]) {
      for (const prose of [
        `${lead} records cite first ${term}.`,
        `${lead} notes mention following ${term}.`,
      ]) {
        const result = decodeVintagePattern(prose, "uk");
        assert.equal(result.output, prose, prose);
        assert.equal(result.substitutionCount, 0, prose);
      }
    }
  }

  for (const prose of [
    "Ch 3 notes cite first dc.",
    "Chain 3 records mention first DC.",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    assert.equal(result.output, prose, prose);
    assert.equal(result.substitutionCount, 0, prose);
  }

  for (const [input, expected] of [
    ["sl st to first dc.", "sl st to first single crochet (sc)."],
    ["insert hook into next double crochet.", "insert hook into next single crochet (sc)."],
    ["pull through next dc.", "pull through next single crochet (sc)."],
    ["sk next dc.", "sk next single crochet (sc)."],
    ["miss next dc.", "miss next single crochet (sc)."],
    ["increase in next dc.", "increase in next single crochet (sc)."],
    ["decrease in next dc.", "decrease in next single crochet (sc)."],
    ["beg DC in next stitch.", "beg single crochet (sc) in next stitch."],
    ["rep DC in next stitch.", "rep single crochet (sc) in next stitch."],
    ["cont DC in next stitch.", "cont single crochet (sc) in next stitch."],
    ["2 ch, DC in next stitch.", "2 ch, single crochet (sc) in next stitch."],
    ["Ch 3 counts as first dc of row.", "Ch 3 counts as first single crochet (sc) of row."],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }
});

test("command authority rejects safe-looking prose leads across explicit contexts", () => {
  const leads = [
    "add", "begin", "commence", "complete", "continue", "crochet", "decrease",
    "finish", "increase", "join", "make", "miss", "place", "repeat", "skip",
    "start", "turn", "use", "using", "work", "sl st", "insert hook", "pull through",
    "sk", "yo", "beg", "rep", "cont", "2 ch", "Ch 3",
  ];
  const proseBodies = [
    "carefully records first",
    "hook notes cite first",
    "2 notes cite first",
    "stitches journal mentions following",
    "marker history lists previous",
  ];
  const contexts = ["", "Row 1: ", "> 1. Body: "];

  for (const context of contexts) {
    for (const lead of leads) {
      for (const body of proseBodies) {
        for (const term of ["dc", "DC", "double crochet"]) {
          const input = `${context}${lead} ${body} ${term}.`;
          const result = decodeVintagePattern(input, "uk");
          assert.equal(result.output, input, input);
          assert.equal(result.substitutionCount, 0, input);
        }
      }
    }
  }

  const positiveBodies = [
    ...leads.slice(0, 20).map((lead) => `${lead} dc in next stitch.`),
    "sl st to first dc.",
    "insert hook into next dc.",
    "pull through next dc.",
    "sk next dc.",
    "yo, dc in next stitch.",
    "beg dc in next stitch.",
    "rep dc in next stitch.",
    "cont dc in next stitch.",
    "2 ch, dc in next stitch.",
    "Ch 3 counts as first dc of row.",
  ];
  for (const context of contexts) {
    for (const body of positiveBodies) {
      const input = `${context}${body}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input.replace("dc", "single crochet (sc)"), input);
      assert.equal(result.substitutionCount, 1, input);
    }
  }
});

test("bounded shorthand commands isolate contaminated same-line neighbors", () => {
  const invalid = "Work dc in first dc, widget, then tr in second dc";
  const validCommands = [
    ["sl st to first htr.", "sl st to first half double crochet (hdc)."],
    [
      "sk next stitch, Work htr in next stitch.",
      "sk next stitch, Work half double crochet (hdc) in next stitch.",
    ],
    [
      "beg next row, Work htr in next stitch.",
      "beg next row, Work half double crochet (hdc) in next stitch.",
    ],
    ["cont, Work htr in next stitch.", "cont, Work half double crochet (hdc) in next stitch."],
    ["rep, Work htr in next stitch.", "rep, Work half double crochet (hdc) in next stitch."],
  ];

  for (const delimiter of [". ", "; ", "! ", "? "]) {
    for (const [valid, converted] of validCommands) {
      const invalidFirst = `${invalid}${delimiter}${valid}`;
      const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
      assert.equal(
        invalidFirstResult.output,
        `${invalid}${delimiter}${converted}`,
        invalidFirst,
      );
      assert.equal(invalidFirstResult.substitutionCount, 1, invalidFirst);

      const validFirst = `${valid.slice(0, -1)}${delimiter}${invalid}.`;
      const validFirstResult = decodeVintagePattern(validFirst, "uk");
      assert.equal(
        validFirstResult.output,
        `${converted.slice(0, -1)}${delimiter}${invalid}.`,
        validFirst,
      );
      assert.equal(validFirstResult.substitutionCount, 1, validFirst);
    }
  }

  for (const invalidShorthand of [
    "sl st to first htr theory.",
    "sk next stitch notes, Work htr in next stitch.",
    "beg next row notes, Work htr in next stitch.",
    "cont notes, Work htr in next stitch.",
    "rep notes, Work htr in next stitch.",
  ]) {
    const input = `${invalid}. ${invalidShorthand}`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
});

test("Markdown-linked shared stitch lists convert visible terms atomically", () => {
  for (const [input, expected] of [
    [
      "Work [double crochet](https://example.com/dc/tr?q=dc) and treble crochet in next stitch.",
      "Work [single crochet (sc)](https://example.com/dc/tr?q=dc) and double crochet (dc) in next stitch.",
    ],
    [
      "Work double crochet and [treble crochet](https://example.com/tr/dc?q=tr) in next stitch.",
      "Work single crochet (sc) and [double crochet (dc)](https://example.com/tr/dc?q=tr) in next stitch.",
    ],
    [
      "Work [double crochet](https://example.com/a) and [treble crochet](https://example.com/b) in next stitch.",
      "Work [single crochet (sc)](https://example.com/a) and [double crochet (dc)](https://example.com/b) in next stitch.",
    ],
    [
      "Work [double crochet][dc-ref] and treble crochet in next stitch.\n[dc-ref]: https://example.com/dc/tr",
      "Work [single crochet (sc)][dc-ref] and double crochet (dc) in next stitch.\n[dc-ref]: https://example.com/dc/tr",
    ],
    [
      "Work double crochet and [treble crochet][] in next stitch.",
      "Work single crochet (sc) and [double crochet (dc)][] in next stitch.",
    ],
    [
      "Work [double crochet][dc-ref] and [treble crochet][tr-ref] in next stitch.\n[dc-ref]: https://example.com/dc\n[tr-ref]: https://example.com/tr",
      "Work [single crochet (sc)][dc-ref] and [double crochet (dc)][tr-ref] in next stitch.\n[dc-ref]: https://example.com/dc\n[tr-ref]: https://example.com/tr",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 2, input);
  }

  for (const input of [
    "Work [double crochet](https://example.com/open and treble crochet in next stitch.",
    "Work [double crochet](https://example.com/dc/tr) and widget and treble crochet in next stitch.",
    "Work ![double crochet](https://example.com/a) and treble crochet in next stitch.",
    "Work [front post double crochet](https://example.com/a) and treble crochet in next stitch.",
    "Work [double crochet](https://example.com/a) and treble crochet-id in next stitch.",
    "Work `[double crochet](https://example.com/a) and treble crochet` in next stitch.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
});

test("Markdown-linked Work lists retain bounded stitch targets on the fast path", () => {
  for (const [input, expected, count, enforceFastPath = false] of [
    [
      "Work [dc][ref] and htr.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc).",
      2,
      true,
    ],
    [
      "Work [dc][ref] and htr in first tr.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) in first double crochet (dc).",
      3,
      true,
    ],
    [
      "Work [tr][ref] and dtr in second htr.",
      "Work [double crochet (dc)][ref] and treble crochet (tr) in second half double crochet (hdc).",
      3,
      true,
    ],
    [
      "Work [double crochet][ref] and half treble crochet in first treble crochet.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) in first double crochet (dc).",
      3,
      true,
    ],
    ...["a", "", "https://e/a_(b)", "https://e/a\\)b", "<https://e/a>", 'https://e/a "title. Work dc"'].map((destination) => [
      `Work [dc and htr](${destination}) in first tr.`,
      `Work [single crochet (sc) and half double crochet (hdc)](${destination}) in first double crochet (dc).`,
      3,
      true,
    ]),
    [
      "Work [dc][ref] and htr in first stitch.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) in first stitch.",
      2,
      true,
    ],
    [
      "Work [dc][ref] and htr in first widget.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) in first widget.",
      2,
    ],
    [
      "Work [dc][ref] and htr in first tr, widget.",
      "Work [dc][ref] and htr in first double crochet (dc), widget.",
      1,
    ],
    [
      "Work [dc][ref] and htr alone.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) alone.",
      2,
    ],
    ["Work [double crochet][ref] alone.", "Work [double crochet][ref] alone.", 0],
  ]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    const elapsed = performance.now() - startedAt;
    if (enforceFastPath) {
      assert.ok(elapsed < 2_000, `${input} took ${elapsed.toFixed(1)} ms`);
    }
  }
});

test("mixed emphasis in linked stitch lists stays valid while malformed emphasis fails closed", () => {
  for (const [input, expected] of [
    [
      "Work [*dc* and tr](a) in next stitch.",
      "Work [*single crochet (sc)* and double crochet (dc)](a) in next stitch.",
    ],
    [
      "Work [**dc** and _tr_](a) in next stitch.",
      "Work [**single crochet (sc)** and _double crochet (dc)_](a) in next stitch.",
    ],
    [
      "Work [_dc_ and _tr_][ref] in next stitch.\n[ref]: a",
      "Work [_single crochet (sc)_ and _double crochet (dc)_][ref] in next stitch.\n[ref]: a",
    ],
    [
      "Work [___dc___ and **tr**][] in next stitch.",
      "Work [___single crochet (sc)___ and **double crochet (dc)**][] in next stitch.",
    ],
    [
      "Work _2 dc_ and tr in next stitch.",
      "Work _2 single crochet (sc)_ and double crochet (dc) in next stitch.",
    ],
    [
      "Work __the dc__ and tr in next stitch.",
      "Work __the single crochet (sc)__ and double crochet (dc) in next stitch.",
    ],
    [
      "Work ___dc___ and tr in next stitch.",
      "Work ___single crochet (sc)___ and double crochet (dc) in next stitch.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 2, input);
  }

  for (const malformed of [
    "Work [*dc and tr](a) in next stitch.",
    "Work [**dc* and tr](a) in next stitch.",
    "Work [_dc__ and tr](a) in next stitch.",
  ]) {
    const result = decodeVintagePattern(malformed, "uk");
    assert.equal(result.output, malformed, malformed);
    assert.equal(result.substitutionCount, 0, malformed);
  }

  for (const identifier of ["foo_dc_bar", "dc_id", "α_dc_β", "dc\u200Did"]) {
    const result = decodeVintagePattern(identifier, "unknown");
    assert.equal(result.output, identifier, identifier);
    assert.deepEqual(result.signals, [], identifier);
  }
});

test("malformed emphasized identifiers keep connector-bearing stitch lists atomic", () => {
  const startedAt = performance.now();
  for (const wrapper of ["*", "**", "***", "_", "__", "___"]) {
    for (const suffix of ["α", "\u0301", "\u200D"]) {
      for (const input of [
        `Work ${wrapper}dc${suffix}${wrapper} and tr in next stitch.`,
        `Work tr and ${wrapper}dc${suffix}${wrapper} in next stitch.`,
      ]) {
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, input, input);
        assert.equal(result.substitutionCount, 0, input);
      }
    }
  }

  for (const input of [
    "Work dc\u200D and tr in next stitch.",
    "Work tr and dc\u200D in next stitch.",
    "Work [dc\u200D](a) and tr in next stitch.",
    "Work tr and [dc\u200D](a) in next stitch.",
    "Work [dc\u200D and tr](a) in next stitch.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }
  assert.ok(performance.now() - startedAt < 2_000);
});

test("fast Work paths preserve source, Markdown, and neighboring-command boundaries", () => {
  const cases = [
    [
      "Work [dc and tr](https://example.com/pattern.v1?size=2,3#row-1).",
      "Work [single crochet (sc) and double crochet (dc)](https://example.com/pattern.v1?size=2,3#row-1).",
      2,
    ],
    [
      "Work [dc and tr](https://example.com/a bad title) in next stitch.",
      "Work [dc and tr](https://example.com/a bad title) in next stitch.",
      0,
    ],
    [
      "Source: https://example.com. Work dc and tr in next stitch.",
      "Source: https://example.com. Work dc and tr in next stitch.",
      0,
    ],
    [
      "Work dc_id in next stitch. Work htr in next stitch.",
      "Work dc_id in next stitch. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch. Work dc_id in next stitch.",
      "Work half double crochet (hdc) in next stitch. Work dc_id in next stitch.",
      1,
    ],
    [
      "Work *dcα* in next stitch. Work htr in next stitch.",
      "Work *dcα* in next stitch. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work dc_id in next stitch, then Work htr in next stitch.",
      "Work dc_id in next stitch, then Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work dc_id in next stitch,\tthen\tWork htr in next stitch.",
      "Work dc_id in next stitch,\tthen\tWork half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work dc_id in next stitch,\u00a0then\u00a0Work htr in next stitch.",
      "Work dc_id in next stitch,\u00a0then\u00a0Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work dc_id in next stitch,\u2003then\u2003Work htr in next stitch.",
      "Work dc_id in next stitch,\u2003then\u2003Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch, then Work dc_id in next stitch.",
      "Work htr in next stitch, then Work dc_id in next stitch.",
      0,
    ],
    [
      "Work htr in next stitch,\tthen\tWork dc_id in next stitch.",
      "Work htr in next stitch,\tthen\tWork dc_id in next stitch.",
      0,
    ],
    [
      "Work htr in next stitch,\u00a0then\u00a0Work dc_id in next stitch.",
      "Work htr in next stitch,\u00a0then\u00a0Work dc_id in next stitch.",
      0,
    ],
    [
      "Work htr in next stitch,\u2003then\u2003Work dc_id in next stitch.",
      "Work htr in next stitch,\u2003then\u2003Work dc_id in next stitch.",
      0,
    ],
    [
      "Work htr in next stitch, then Work dc\u200D in next stitch.",
      "Work htr in next stitch, then Work dc\u200D in next stitch.",
      0,
    ],
    [
      "Work htr in next stitch, then Work dc_id in next stitch, then Work tr in next stitch.",
      "Work htr in next stitch, then Work dc_id in next stitch, then Work tr in next stitch.",
      0,
    ],
    [
      "Work tr in next stitch. Work htr in next stitch, then Work dc_id in next stitch.",
      "Work double crochet (dc) in next stitch. Work htr in next stitch, then Work dc_id in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch, then Work dc_id in next stitch. Work tr in next stitch.",
      "Work htr in next stitch, then Work dc_id in next stitch. Work double crochet (dc) in next stitch.",
      1,
    ],
    [
      "Work dc\u200D and tr in next stitch, then Work htr in next stitch.",
      "Work dc\u200D and tr in next stitch, then Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work htr in next stitch, then Work dc\u200D and tr in next stitch.",
      "Work half double crochet (hdc) in next stitch, then Work dc\u200D and tr in next stitch.",
      1,
    ],
    [
      "1. Work dc_id in next stitch. Work htr in next stitch.",
      "1. Work dc_id in next stitch. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "1. Work dc in first dc, widget. Work htr in next stitch.",
      "1. Work dc in first dc, widget. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work [dc\u200D](a) in next stitch. Work htr in next stitch.",
      "Work [dc\u200D](a) in next stitch. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work dc in next stitch, then Work [dc\u200D](a) in next stitch. Work htr in next stitch.",
      "Work dc in next stitch, then Work [dc\u200D](a) in next stitch. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work dc in next stitch, then Work dc in first dc, widget. Work htr in next stitch.",
      "Work dc in next stitch, then Work dc in first dc, widget. Work half double crochet (hdc) in next stitch.",
      1,
    ],
    [
      "Work dc in next stitch, then Work dc_id in next stitch, then Work htr in next stitch. Work tr in next stitch.",
      "Work dc in next stitch, then Work dc_id in next stitch, then Work htr in next stitch. Work double crochet (dc) in next stitch.",
      1,
    ],
    [
      "Work dc in next stitch, then Work [dc\u200D](a) in next stitch, then Work htr in next stitch. Work tr in next stitch.",
      "Work dc in next stitch, then Work [dc\u200D](a) in next stitch, then Work htr in next stitch. Work double crochet (dc) in next stitch.",
      1,
    ],
    [
      "Work dc in next stitch, then Work dc in first dc, widget, then Work htr in next stitch. Work tr in next stitch.",
      "Work dc in next stitch, then Work dc in first dc, widget, then Work htr in next stitch. Work double crochet (dc) in next stitch.",
      1,
    ],
  ];
  for (const [input, expected, count] of cases) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
    assert.deepEqual(result.signals, [], input);
  }

  for (const prefix of [
    "Row 1: ",
    "Rows 1: ",
    "Round 2: ",
    "Rnd 2: ",
    "Rnd. 2: ",
    "Step 1: ",
    "R. 1: ",
    "**R. 1**: ",
    "## Row 1: ",
    "Row 1. ",
    "RS Row 1: ",
    "Row 1 (RS): ",
    "Row 1, WS: ",
    "Next row: ",
    "Following 2 rows: ",
    "Last round: ",
    "Final row: ",
    "First round: ",
    "Second rnd: ",
    "Third row: ",
    "Fourth row: ",
    "Fifth row: ",
    "Foundation row: ",
    "Setup row: ",
    "Set-up row: ",
    "Repeat row: ",
    "Odd row: ",
    "Even row: ",
    "Alternate row: ",
    "Every other row: ",
    "RS: ",
    "WS: ",
    "Setup: ",
    "Set-up: ",
    "Body: ",
    "Sleeve: ",
    "Sleeves: ",
    "Chart: ",
    "Motif A: ",
    "Motif Ω: ",
    "Skirt: ",
    "Crown: ",
    "Ribbing: ",
    "Ribing: ",
    "Shape armhole: ",
    "Shape armholes: ",
    "Begin here: ",
    "> Row 1: ",
    "> 1. Row 1: ",
    "1. Row 1: ",
  ]) {
    const control = `${prefix}Work htr in next stitch, then Work dc_id in next stitch.`;
    const extended = `${prefix}Work htr in next stitch, then Work dc_id in next stitch, then Work dtr in next stitch.`;
    const linkedControl = `${prefix}Work htr in next stitch, then Work [dc\u200D](a) in next stitch.`;
    const linkedExtended = `${prefix}Work htr in next stitch, then Work [dc\u200D](a) in next stitch, then Work dtr in next stitch.`;
    for (const input of [control, extended, linkedControl, linkedExtended]) {
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }

    const contaminated = `${prefix}Work htr in next stitch, then Work dc in first dc, widget, then Work dtr in next stitch.`;
    const contaminatedResult = decodeVintagePattern(contaminated, "uk");
    assert.equal(
      contaminatedResult.output,
      `${prefix}Work half double crochet (hdc) in next stitch, then Work dc in first dc, widget, then Work treble crochet (tr) in next stitch.`,
      contaminated,
    );
    assert.equal(contaminatedResult.substitutionCount, 2, contaminated);
  }

  const assertUnchanged = (input) => {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  };
  const assertPositiveHeading = (heading) => {
    const input = `${heading}Work htr in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${heading}Work half double crochet (hdc) in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 1, input);
  };
  const assertHeadingPoison = (heading, bad) => {
    assertUnchanged(`${heading}Work htr in next stitch, then ${bad}.`);
    assertUnchanged(`${heading}Work htr in next stitch, then ${bad}, then Work dtr in next stitch.`);
    assertPositiveHeading(heading);
  };
  const headingDelimiters = [":", "=", "：", "＝", "→", "⇒", "➜", ".", ")", "-", "—", "−", "－"];
  for (const delimiter of headingDelimiters) {
    for (const bad of [
      "Work dc_id in next stitch",
      "Work [dc_id](a) in next stitch",
    ]) {
      assertHeadingPoison(`Rnd. 2${delimiter} `, bad);
    }
  }

  const headingPrefixes = [
    "> ",
    ">> ",
    "1. ",
    "1) ",
    "(1) ",
    "> 1. ",
    "> (٢) ",
    "### ",
    "> 1. ### ",
  ];
  for (const headingPrefix of headingPrefixes) {
    for (const wrapper of ["", "**", "__", "*", "_"]) {
      assertHeadingPoison(
        `${headingPrefix}${wrapper}Rnd. 2${wrapper}: `,
        "Work dc_id in next stitch",
      );
    }
    for (const wrapper of ["**", "__", "*", "_"]) {
      assertHeadingPoison(
        `${headingPrefix}${wrapper}R. 1${wrapper}: `,
        "Work dc_id in next stitch",
      );
    }
  }

  for (const sideQualifier of [" (RS)", " [WS]", ", right side", " wrong side"]) {
    assertHeadingPoison(
      `Rnd. 2${sideQualifier}: `,
      "Work dc_id in next stitch",
    );
  }

  for (const [input, expected, count] of [
    ["_2 dc_?", "_2 dc_?", 0],
    ["dc and dc.", "dc and single crochet (sc).", 1],
    ["double crochet alone.", "double crochet alone.", 0],
    ["Row 1: dc and tr.", "Row 1: dc and double crochet (dc).", 1],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const term of [
    "double treble crochet",
    "half treble crochet",
    "double treble",
    "treble crochet",
    "half treble",
    "double crochet",
  ]) {
    for (const count of ["", "two "]) {
      const input = `Work ${count}${term} alone.`;
      for (const convention of ["unknown", "uk"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, input, `${convention}: ${input}`);
        assert.equal(result.substitutionCount, 0, `${convention}: ${input}`);
        assert.deepEqual(result.signals, [], `${convention}: ${input}`);
      }
    }
  }

  for (const prefix of ["", " ", "  ", "   "]) {
    for (const [inputBody, expectedBody] of [
      ["htr in first dc.", "half double crochet (hdc) in first dc."],
      ["dtr in second tr.", "treble crochet (tr) in second tr."],
    ]) {
      const input = `${prefix}${inputBody}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, `${prefix}${expectedBody}`, input);
      assert.equal(result.substitutionCount, 1, input);
    }
  }

  const startedAt = performance.now();
  for (const [input] of cases.filter(([input]) => !input.startsWith("Source:"))) {
    decodeVintagePattern(input, "uk");
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("Markdown image contaminants cannot suppress a neighboring valid command", () => {
  const invalid = "Work ![dc](a) and tr in next stitch.";
  const valid = "Work htr in next stitch.";
  const converted = "Work half double crochet (hdc) in next stitch.";
  for (const marker of ["", "1. ", "1) ", "(1) ", "> 1. "]) {
    for (const delimiter of [". ", "; ", "! ", "? "]) {
      const validFirst = `${marker}${valid.slice(0, -1)}${delimiter}${invalid}`;
      const validFirstResult = decodeVintagePattern(validFirst, "uk");
      assert.equal(
        validFirstResult.output,
        `${marker}${converted.slice(0, -1)}${delimiter}${invalid}`,
        validFirst,
      );
      assert.equal(validFirstResult.substitutionCount, 1, validFirst);

      const invalidFirst = `${marker}${invalid.slice(0, -1)}${delimiter}${valid}`;
      const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
      assert.equal(
        invalidFirstResult.output,
        `${marker}${invalid.slice(0, -1)}${delimiter}${converted}`,
        invalidFirst,
      );
      assert.equal(invalidFirstResult.substitutionCount, 1, invalidFirst);
    }
  }
});

test("complex Markdown destinations preserve bytes while visible stitch lists convert atomically", () => {
  const destinations = [
    "",
    " \"title\"",
    " 'title'",
    "<>",
    "https://example.com/a_(b)",
    "https://example.com/a((b))",
    "<https://example.com/a(b)>",
    "https://example.com/a \"title (detail)\"",
    "https://example.com/a 'title (detail)'",
    "https://example.com/a \"title. Work htr in next stitch\"",
    "https://example.com/a 'title; Work htr in next stitch'",
    String.raw`https://example.com/a\)b`,
    String.raw`https://example.com/a\(b\)`,
    "<../patterns/(dc)/tr>",
  ];
  for (const destination of destinations) {
    const input = `Work [double crochet](${destination}) and treble crochet in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Work [single crochet (sc)](${destination}) and double crochet (dc) in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 2, input);
  }

  const punctuatedTitleNeighbor = "Work [double crochet](https://example.com/a \"title. Work htr in next stitch\") and treble crochet in next stitch. Work dtr in next stitch.";
  const punctuatedTitleNeighborResult = decodeVintagePattern(punctuatedTitleNeighbor, "uk");
  assert.equal(
    punctuatedTitleNeighborResult.output,
    "Work [single crochet (sc)](https://example.com/a \"title. Work htr in next stitch\") and double crochet (dc) in next stitch. Work treble crochet (tr) in next stitch.",
  );
  assert.equal(punctuatedTitleNeighborResult.substitutionCount, 3);

  const punctuatedReferenceNeighbor = "Work [dc][title. Work htr in next stitch] and tr in next stitch. Work dtr in next stitch.";
  const punctuatedReferenceNeighborResult = decodeVintagePattern(
    punctuatedReferenceNeighbor,
    "uk",
  );
  assert.equal(
    punctuatedReferenceNeighborResult.output,
    "Work [single crochet (sc)][title. Work htr in next stitch] and double crochet (dc) in next stitch. Work treble crochet (tr) in next stitch.",
  );
  assert.equal(punctuatedReferenceNeighborResult.substitutionCount, 3);

  const repeatedTerminalPunctuation = "Work [double crochet]() and treble crochet in next stitch.; Work htr in next stitch.";
  const repeatedTerminalStartedAt = performance.now();
  const repeatedTerminalResult = decodeVintagePattern(repeatedTerminalPunctuation, "uk");
  assert.equal(
    repeatedTerminalResult.output,
    "Work [single crochet (sc)]() and double crochet (dc) in next stitch.; Work half double crochet (hdc) in next stitch.",
  );
  assert.equal(repeatedTerminalResult.substitutionCount, 3);
  const repeatedTerminalElapsed = performance.now() - repeatedTerminalStartedAt;
  assert.ok(
    repeatedTerminalElapsed < 2_000,
    `expected repeated-terminal Markdown isolation under 2,000 ms, received ${repeatedTerminalElapsed.toFixed(1)} ms`,
  );

  for (const wrapper of ["*", "**", "***", "_", "__", "___"]) {
    const input = `Work [${wrapper}double crochet${wrapper}](https://example.com/dc) and ${wrapper}treble crochet${wrapper} in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Work [${wrapper}single crochet (sc)${wrapper}](https://example.com/dc) and ${wrapper}double crochet (dc)${wrapper} in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 2, input);
  }
});

test("malformed Markdown stitch lists fail closed as one byte-preserved unit", () => {
  for (const input of [
    "Work [double crochet](https://example.com/open and treble crochet in next stitch.",
    "Work [double crochet(https://example.com/a) and treble crochet in next stitch.",
    "Work [double crochet][ref and treble crochet in next stitch.",
    "Work [double crochet][] and [treble crochet][ref in next stitch.",
    "Work [double crochet]](https://example.com/a) and treble crochet in next stitch.",
    "Work [double crochet]ref] and treble crochet in next stitch.",
    "Work [double crochet]((https://example.com/a) and treble crochet in next stitch.",
    "Work [double crochet](https://example.com/a)) and treble crochet in next stitch.",
    "Work [double crochet][ref]] and treble crochet in next stitch.",
    "Work [double crochet](https://example.com/a and [treble crochet](https://example.com/b) in next stitch.",
    "Work [double crochet](https://example.com/a bad title) and treble crochet in next stitch.",
    "Work [double crochet](<https://example.com/a b>) and treble crochet in next stitch.",
    "Work [double crochet](https://example.com/a \"unclosed title) and treble crochet in next stitch.",
    "Work [double crochet](https://example.com/a 'unclosed title) and treble crochet in next stitch.",
    "Work [double crochet](https://example.com/a \"mismatched title') and treble crochet in next stitch.",
    "Work [double crochet](<https://example.com/a> garbage) and treble crochet in next stitch.",
    "Work [double crochet]( \"unclosed title) and treble crochet in next stitch.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  const resolvedCollapsed = "Work [double crochet][] and treble crochet in next stitch.\n[double crochet]: https://example.com/dc";
  const collapsedResult = decodeVintagePattern(resolvedCollapsed, "uk");
  assert.equal(collapsedResult.output, resolvedCollapsed);
  assert.equal(collapsedResult.substitutionCount, 0);
});

test("unsupported compound and invalid slash middles deny the complete stitch list", () => {
  const contexts = ["", "Row 1: ", "Body: ", "> 1. Body: "];
  const modifiers = ["front post", "back post", "long", "spike", "waistcoat", "back loop"];
  for (const context of contexts) {
    for (const modifier of modifiers) {
      for (const input of [
        `${context}Work ${modifier} double crochet and treble crochet in next stitch.`,
        `${context}Work ${modifier} dc and tr in next stitch.`,
        `${context}Work double crochet and ${modifier} treble crochet in next stitch.`,
        `${context}Work dc and ${modifier} tr in next stitch.`,
        `${context}Work double crochet, ${modifier} treble crochet, and half treble crochet in next stitch.`,
        `${context}Work dc, ${modifier} tr, and htr in next stitch.`,
      ]) {
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, input, input);
        assert.equal(result.substitutionCount, 0, input);
        const elapsed = performance.now() - startedAt;
        assert.ok(elapsed < 2_000, `${input} took ${elapsed.toFixed(1)} ms`);
      }
    }
  }

  for (const context of contexts) {
    const unsupportedAfterLink = `${context}Work [dc](a) and front post tr in next stitch.`;
    const unsupportedStartedAt = performance.now();
    const unsupportedResult = decodeVintagePattern(unsupportedAfterLink, "uk");
    assert.equal(unsupportedResult.output, unsupportedAfterLink, unsupportedAfterLink);
    assert.equal(unsupportedResult.substitutionCount, 0, unsupportedAfterLink);
    const unsupportedElapsed = performance.now() - unsupportedStartedAt;
    assert.ok(
      unsupportedElapsed < 2_000,
      `${unsupportedAfterLink} took ${unsupportedElapsed.toFixed(1)} ms`,
    );

    const opaqueReferenceId = `${context}Work [dc and tr][front post htr] in next stitch.`;
    const referenceStartedAt = performance.now();
    const referenceResult = decodeVintagePattern(opaqueReferenceId, "uk");
    assert.equal(
      referenceResult.output,
      `${context}Work [single crochet (sc) and double crochet (dc)][front post htr] in next stitch.`,
      opaqueReferenceId,
    );
    assert.equal(referenceResult.substitutionCount, 2, opaqueReferenceId);
    assert.deepEqual(
      referenceResult.segments.filter((segment) => segment.type === "sub").map((segment) => segment.original),
      ["dc", "tr"],
      opaqueReferenceId,
    );
    const referenceElapsed = performance.now() - referenceStartedAt;
    assert.ok(referenceElapsed < 2_000, `${opaqueReferenceId} took ${referenceElapsed.toFixed(1)} ms`);
  }

  for (const separator of [" / ", " ／ "]) {
    for (const middle of [
      "join to first dc theory",
      "yo and pull through notes",
      "keep dc notes",
    ]) {
      const input = `Work dc${separator}${middle}${separator}tr in next stitch.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }
  }

  const validSlashList = decodeVintagePattern("Work dc / tr in next stitch.", "uk");
  assert.equal(
    validSlashList.output,
    "Work single crochet (sc) / double crochet (dc) in next stitch.",
  );
  assert.equal(validSlashList.substitutionCount, 2);
});

test("malformed Markdown emphasis keeps shared stitch lists byte-preserved", () => {
  for (const input of [
    "Work *double crochet** and treble crochet in next stitch.",
    "Work _double crochet__ and treble crochet in next stitch.",
    "Work *double crochet and treble crochet** in next stitch.",
    "Work _double crochet and treble crochet__ in next stitch.",
    "Work double crochet and treble crochet* in next stitch.",
    "Work [*double crochet**](https://example.com/a) and treble crochet in next stitch.",
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  for (const wrapper of ["*", "**", "***", "_", "__", "___"]) {
    const input = `Work ${wrapper}double crochet and treble crochet${wrapper} in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Work ${wrapper}single crochet (sc) and double crochet (dc)${wrapper} in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 2, input);
  }
});

test("repeat markers remain distinct from malformed Markdown emphasis", () => {
  for (const [input, expected, count] of [
    [
      "*dc, tr in next stitch, repeat from *",
      "*single crochet (sc), double crochet (dc) in next stitch, repeat from *",
      2,
    ],
    [
      "Work *dc, tr in next stitch; repeat from *.",
      "Work *single crochet (sc), double crochet (dc) in next stitch; repeat from *.",
      2,
    ],
    [
      "Work *dc in first dc, tr in second dc; repeat from *.",
      "Work *single crochet (sc) in first single crochet (sc), double crochet (dc) in second single crochet (sc); repeat from *.",
      4,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }

  const identifier = "Work foo_dc_bar and tr in next stitch.";
  const identifierResult = decodeVintagePattern(identifier, "uk");
  assert.equal(identifierResult.output, identifier);
  assert.equal(identifierResult.substitutionCount, 0);

  const contaminated = "Work *dc, tr in next stitch, work dc in next stitch, prose repeat from *.";
  const contaminatedResult = decodeVintagePattern(contaminated, "uk");
  assert.equal(contaminatedResult.output, contaminated);
  assert.equal(contaminatedResult.substitutionCount, 0);
});

test("markup wrappers cannot manufacture safe stitch-token boundaries", () => {
  const unsafeBodies = [
    "Work foo[dc](a) and tr in next stitch.",
    "Work [dc](a)id and tr in next stitch.",
    "Work [dc](a).txt and tr in next stitch.",
    "Work [dc](a)2 and tr in next stitch.",
    "Work [dc](a)_id and tr in next stitch.",
    "Work [double crochet](a)-id and tr in next stitch.",
    "Work [double crochet](a)b) and treble crochet in next stitch.",
    "Work foo[dc][ref] and tr in next stitch.",
    "Work [dc][ref]id and tr in next stitch.",
    "Work [dc][]2 and tr in next stitch.",
    "Work foo**dc** and tr in next stitch.",
    "Work **dc**.txt and tr in next stitch.",
    "Work foo[dc] and tr in next stitch.",
    "Work [dc]id and tr in next stitch.",
    "Work [dc].txt and tr in next stitch.",
    "Work dc and foo[tr] in next stitch.",
    "Work [dc] and tr in next stitch.",
    "Work [2 dc] and tr in next stitch.",
    "Work [dc note] and tr in next stitch.",
    "Work [2 dc][ref]id and tr in next stitch.",
    "Work [dc][[ref]] and tr in next stitch.",
    "Work [[2 dc]] and tr in next stitch.",
    "Work [dc2][ref] and tr in next stitch.",
    "Work [double crochetα](a) and tr in next stitch.",
    "Work [2dc](a) and tr in next stitch.",
    "Work [αdc][ref] and tr in next stitch.",
    "Work [\u0301dc][] and tr in next stitch.",
    "Work dc and [αtr](a) in next stitch.",
    "Work [dc][ref][] and tr in next stitch.",
    "Work [dc](a)[ref] and tr in next stitch.",
    "Work foo**[dc](a)** and tr in next stitch.",
    "Work **[dc](a)**id and tr in next stitch.",
    "Work [dc](a)**id** and tr in next stitch.",
    "Work foo([dc](a)) and tr in next stitch.",
    "Work ([dc](a))id and tr in next stitch.",
    "Work (([dc](a))) and tr in next stitch.",
    "Work [dc](a)} and tr in next stitch.",
    "Work [dc][ref]) and tr in next stitch.",
    "Work [dc][]} and tr in next stitch.",
    "Work dc and ([tr](a) in next stitch.",
    "Work dc and {[tr][ref] in next stitch.",
    "Work dc and ([tr](a)} in next stitch.",
  ];
  for (const context of ["", "Row 1: ", "Body: ", "> 1. Body: "]) {
    for (const body of unsafeBodies) {
      const input = `${context}${body}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
      const elapsed = performance.now() - startedAt;
      assert.ok(elapsed < 2_000, `${input} took ${elapsed.toFixed(1)} ms`);
    }
  }

  const malformed = "Work [double crochet](a)b) and treble crochet in next stitch.";
  const neighboring = `${malformed} Work htr in next stitch.`;
  const neighboringResult = decodeVintagePattern(neighboring, "uk");
  assert.equal(
    neighboringResult.output,
    `${malformed} Work half double crochet (hdc) in next stitch.`,
  );
  assert.equal(neighboringResult.substitutionCount, 1);

  const wholeSquareList = "Work [dc and tr] in next stitch.";
  const wholeSquareListResult = decodeVintagePattern(wholeSquareList, "uk");
  assert.equal(
    wholeSquareListResult.output,
    "Work [single crochet (sc) and double crochet (dc)] in next stitch.",
  );
  assert.equal(wholeSquareListResult.substitutionCount, 2);

  for (const [input, expected] of [
    [
      "Work [2 dc](a) and tr in next stitch.",
      "Work [2 single crochet (sc)](a) and double crochet (dc) in next stitch.",
    ],
    [
      "Work [2 dc][ref] and tr in next stitch.",
      "Work [2 single crochet (sc)][ref] and double crochet (dc) in next stitch.",
    ],
    [
      "Work [2 dc and tr] in next stitch.",
      "Work [2 single crochet (sc) and double crochet (dc)] in next stitch.",
    ],
    [
      "Work [**2 dc**][ref] and 3 tr in next stitch.",
      "Work [**2 single crochet (sc)**][ref] and 3 double crochet (dc) in next stitch.",
    ],
    [
      "Work [2 **dc**][ref] and 3 tr in next stitch.",
      "Work [2 **single crochet (sc)**][ref] and 3 double crochet (dc) in next stitch.",
    ],
    [
      "Work [2 **dc**](a) and 3 tr in next stitch.",
      "Work [2 **single crochet (sc)**](a) and 3 double crochet (dc) in next stitch.",
    ],
    [
      "Work [the *double crochet*](a) and tr in next stitch.",
      "Work [the *single crochet (sc)*](a) and double crochet (dc) in next stitch.",
    ],
    [
      "Work **[dc](a)** and tr in next stitch.",
      "Work **[single crochet (sc)](a)** and double crochet (dc) in next stitch.",
    ],
    [
      "Work _[dc][ref]_ and tr in next stitch.",
      "Work _[single crochet (sc)][ref]_ and double crochet (dc) in next stitch.",
    ],
    [
      "Work **_[2 dc][]_** and tr in next stitch.",
      "Work **_[2 single crochet (sc)][]_** and double crochet (dc) in next stitch.",
    ],
    [
      "Work ([dc](a)) and tr in next stitch.",
      "Work ([single crochet (sc)](a)) and double crochet (dc) in next stitch.",
    ],
    [
      "Work {_[dc][ref]_} and tr in next stitch.",
      "Work {_[single crochet (sc)][ref]_} and double crochet (dc) in next stitch.",
    ],
    [
      "Work dc and {**[tr][]**} in next stitch.",
      "Work single crochet (sc) and {**[double crochet (dc)][]**} in next stitch.",
    ],
    [
      "Work ([dc](a) and tr) in next stitch.",
      "Work ([single crochet (sc)](a) and double crochet (dc)) in next stitch.",
    ],
    [
      "Work (dc and [tr](a)) in next stitch.",
      "Work (single crochet (sc) and [double crochet (dc)](a)) in next stitch.",
    ],
    [
      "Work {dc and [tr][ref]} in next stitch.",
      "Work {single crochet (sc) and [double crochet (dc)][ref]} in next stitch.",
    ],
    [
      "Work [dc and tr][ref] in next stitch.",
      "Work [single crochet (sc) and double crochet (dc)][ref] in next stitch.",
    ],
    [
      "Work [dc and tr][] in next stitch.",
      "Work [single crochet (sc) and double crochet (dc)][] in next stitch.",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 2, input);
  }

  for (const [body, converted] of [
    [
      "Work [dc](a) and tr in next stitch.",
      "Work [single crochet (sc)](a) and double crochet (dc) in next stitch.",
    ],
    [
      "Work dc and [tr](a) in next stitch.",
      "Work single crochet (sc) and [double crochet (dc)](a) in next stitch.",
    ],
    [
      "Work [2 **dc**](a) and 3 tr in next stitch.",
      "Work [2 **single crochet (sc)**](a) and 3 double crochet (dc) in next stitch.",
    ],
    [
      "Work [dc][ref] and tr in next stitch.",
      "Work [single crochet (sc)][ref] and double crochet (dc) in next stitch.",
    ],
    [
      "Work dc and [tr][ref] in next stitch.",
      "Work single crochet (sc) and [double crochet (dc)][ref] in next stitch.",
    ],
    [
      "Work (dc and [tr](a)) in next stitch.",
      "Work (single crochet (sc) and [double crochet (dc)](a)) in next stitch.",
    ],
  ]) {
    const input = `> 1. Body: ${body}`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `> 1. Body: ${converted}`, input);
    assert.equal(result.substitutionCount, 2, input);
  }

  const referenceLabelTerm = "> 1. Body: Work [htr][tr] in next stitch.";
  const referenceLabelTermResult = decodeVintagePattern(referenceLabelTerm, "uk");
  assert.equal(
    referenceLabelTermResult.output,
    "> 1. Body: Work [half double crochet (hdc)][tr] in next stitch.",
  );
  assert.equal(referenceLabelTermResult.substitutionCount, 1);
});

test("unbalanced linked-list punctuation stays atomic without suppressing valid neighbors", () => {
  for (const malformed of [
    "Work [double crochet](a)b) and treble crochet in next stitch.",
    "Work [dc](a)} and tr in next stitch.",
    "Work [dc][ref]) and tr in next stitch.",
    "Work [dc][]} and tr in next stitch.",
    "Work dc and ([tr](a) in next stitch.",
    "Work dc and {[tr][ref] in next stitch.",
    "Work dc and ([tr](a)} in next stitch.",
  ]) {
    const startedAt = performance.now();
    const input = `${malformed} Work htr in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${malformed} Work half double crochet (hdc) in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 1, input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `expected linked-list isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
  }

  for (const malformed of [
    "Work [dc](https://example.com/open and tr in next stitch.",
    "Work [dc][open and tr in next stitch.",
  ]) {
    const startedAt = performance.now();
    const input = `${malformed}; Work htr in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${malformed}; Work half double crochet (hdc) in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 1, input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `expected unclosed-link isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
  }

  for (const separator of [" ", "; "]) {
    const malformed = "Work [dc](https://example.com/open and tr in next stitch.";
    const input = `${malformed}${separator}Work [htr](ok) in next stitch.`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${malformed}${separator}Work [half double crochet (hdc)](ok) in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 1, input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `expected linked-neighbor isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
  }

  for (const malformed of [
    "Work [double crochet](broken.",
    "Work [double crochet][broken.",
  ]) {
    for (const [neighbor, converted] of [
      ["Work [htr](a) in next stitch.", "Work [half double crochet (hdc)](a) in next stitch."],
      ["Work [htr][a] in next stitch.", "Work [half double crochet (hdc)][a] in next stitch."],
    ]) {
      const input = `${malformed} ${neighbor}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, `${malformed} ${converted}`, input);
      assert.equal(result.substitutionCount, 1, input);
      const elapsed = performance.now() - startedAt;
      assert.ok(elapsed < 2_000, `expected truncated-link isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
    }
  }

  for (const malformed of [
    "Work [dc](https://example.com/a \"unclosed title) and tr in next stitch.",
    "Work [dc](https://example.com/a 'unclosed title) and tr in next stitch.",
    "Work [dc](https://example.com/a \"mismatched title') and tr in next stitch.",
  ]) {
    for (const boundary of [" ", "! ", "? ", "; "]) {
      const input = `${malformed}${boundary}Work htr in next stitch.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(
        result.output,
        `${malformed}${boundary}Work half double crochet (hdc) in next stitch.`,
        input,
      );
      assert.equal(result.substitutionCount, 1, input);

      const terminal = boundary.trimEnd();
      const reverseInput = `Work htr in next stitch. ${malformed}${terminal}`;
      const reverseResult = decodeVintagePattern(reverseInput, "uk");
      assert.equal(
        reverseResult.output,
        `Work half double crochet (hdc) in next stitch. ${malformed}${terminal}`,
        reverseInput,
      );
      assert.equal(reverseResult.substitutionCount, 1, reverseInput);
    }
  }

  for (const malformed of ["Work [dc](broken.", "Work [dc][broken."]) {
    const input = `Work htr in next stitch. ${malformed} Work dtr in next stitch.`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Work half double crochet (hdc) in next stitch. ${malformed} Work treble crochet (tr) in next stitch.`,
      input,
    );
    assert.equal(result.substitutionCount, 2, input);
    assert.deepEqual(
      result.segments.filter((segment) => segment.type === "sub").map((segment) => segment.original),
      ["htr", "dtr"],
      input,
    );
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `expected malformed-link sandwich isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
  }

  const repeatedBoundaryLine = 'Work [dc](https://x/a "unclosed title) and tr in next stitch.! Work [htr](ok) in next stitch.! Work [dtr][ref] in next stitch.';
  for (const input of [
    repeatedBoundaryLine,
    `${repeatedBoundaryLine}\n[ref]: /url`,
    `[ref]: /url\r\n${repeatedBoundaryLine}`,
  ]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    const expectedLine = 'Work [dc](https://x/a "unclosed title) and tr in next stitch.! Work [half double crochet (hdc)](ok) in next stitch.! Work [treble crochet (tr)][ref] in next stitch.';
    assert.equal(result.output, input.replace(repeatedBoundaryLine, expectedLine), input);
    assert.equal(result.substitutionCount, 2, input);
    assert.deepEqual(
      result.segments.filter((segment) => segment.type === "sub").map((segment) => segment.original),
      ["htr", "dtr"],
      input,
    );
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `expected repeated-boundary isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
  }

  const unsafeSuffixWithComplexNeighbor = 'Work [dc](a)id and tr in next stitch. Work htr in next stitch. Work [dtr](https://e/a "title. Work dc; tr") in next stitch.';
  const complexNeighborStartedAt = performance.now();
  const complexNeighborResult = decodeVintagePattern(unsafeSuffixWithComplexNeighbor, "uk");
  assert.equal(
    complexNeighborResult.output,
    'Work [dc](a)id and tr in next stitch. Work half double crochet (hdc) in next stitch. Work [treble crochet (tr)](https://e/a "title. Work dc; tr") in next stitch.',
  );
  assert.equal(complexNeighborResult.substitutionCount, 2);
  assert.deepEqual(
    complexNeighborResult.segments.filter((segment) => segment.type === "sub").map((segment) => segment.original),
    ["htr", "dtr"],
  );
  const complexNeighborElapsed = performance.now() - complexNeighborStartedAt;
  assert.ok(
    complexNeighborElapsed < 2_000,
    `expected complex-link neighbor isolation under 2,000 ms, received ${complexNeighborElapsed.toFixed(1)} ms`,
  );

  const nestedDestinationNeighbors = 'Work [dc](a)id and tr in next stitch. Work [dtr](https://e/a "title. Work dc; tr") in next stitch. Work [tr](https://e/a_(b) "title!?; Work htr") in first dc.';
  const nestedDestinationStartedAt = performance.now();
  const nestedDestinationResult = decodeVintagePattern(nestedDestinationNeighbors, "uk");
  assert.equal(
    nestedDestinationResult.output,
    'Work [dc](a)id and tr in next stitch. Work [treble crochet (tr)](https://e/a "title. Work dc; tr") in next stitch. Work [double crochet (dc)](https://e/a_(b) "title!?; Work htr") in first single crochet (sc).',
  );
  assert.equal(nestedDestinationResult.substitutionCount, 3);
  assert.deepEqual(
    nestedDestinationResult.segments.filter((segment) => segment.type === "sub").map((segment) => segment.original),
    ["dtr", "tr", "dc"],
  );
  const nestedDestinationElapsed = performance.now() - nestedDestinationStartedAt;
  assert.ok(
    nestedDestinationElapsed < 2_000,
    `expected nested-link neighbor isolation under 2,000 ms, received ${nestedDestinationElapsed.toFixed(1)} ms`,
  );
});

test("reference labels honor the CommonMark 999-character boundary", () => {
  for (const length of [257, 300, 999]) {
    const reference = "r".repeat(length);
    const valid = `Work [dc][${reference}] and tr in next stitch.`;
    const validResult = decodeVintagePattern(valid, "uk");
    assert.equal(
      validResult.output,
      `Work [single crochet (sc)][${reference}] and double crochet (dc) in next stitch.`,
      `${length}`,
    );
    assert.equal(validResult.substitutionCount, 2, `${length}`);

    for (const input of [
      `Work foo[dc][${reference}] and tr in next stitch.`,
      `Work [dc][${reference}]id and tr in next stitch.`,
    ]) {
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, `${length}`);
      assert.equal(result.substitutionCount, 0, `${length}`);
    }
  }

  const overlongReference = "r".repeat(1_000);
  const overlong = `Work [dc][${overlongReference}] and tr in next stitch.`;
  const overlongResult = decodeVintagePattern(overlong, "uk");
  assert.equal(overlongResult.output, overlong);
  assert.equal(overlongResult.substitutionCount, 0);

  for (const length of [500, 999]) {
    const reference = "😀".repeat(length);
    const valid = `Work [dc][${reference}] and tr in next stitch.`;
    const result = decodeVintagePattern(valid, "uk");
    assert.equal(
      result.output,
      `Work [single crochet (sc)][${reference}] and double crochet (dc) in next stitch.`,
      `${length} astral characters`,
    );
    assert.equal(result.substitutionCount, 2, `${length} astral characters`);
  }

  const overlongAstralReference = "😀".repeat(1_000);
  const overlongAstral = `Work [dc][${overlongAstralReference}] and tr in next stitch.`;
  const overlongAstralResult = decodeVintagePattern(overlongAstral, "uk");
  assert.equal(overlongAstralResult.output, overlongAstral);
  assert.equal(overlongAstralResult.substitutionCount, 0);

  const escapedReference = "Row 1: Work [dc][r\\[] and tr in next stitch.\n[r\\[]: /url";
  const escapedReferenceResult = decodeVintagePattern(escapedReference, "uk");
  assert.equal(
    escapedReferenceResult.output,
    "Row 1: Work [single crochet (sc)][r\\[] and double crochet (dc) in next stitch.\n[r\\[]: /url",
  );
  assert.equal(escapedReferenceResult.substitutionCount, 2);

  for (const label of [
    "ref",
    "Work htr .; \"dc tr\"",
    "r".repeat(999),
    "😀".repeat(999),
  ]) {
    for (const eol of ["\n", "\r\n"]) {
      const instruction = `Work [dc][${label}] and htr in next stitch.`;
      const expectedInstruction = `Work [single crochet (sc)][${label}] and half double crochet (hdc) in next stitch.`;
      const definition = `[${label}]: /patterns/dc/tr`;
      for (const definitionFirst of [false, true]) {
        const input = definitionFirst
          ? `${definition}${eol}${instruction}`
          : `${instruction}${eol}${definition}`;
        const expected = definitionFirst
          ? `${definition}${eol}${expectedInstruction}`
          : `${expectedInstruction}${eol}${definition}`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, expected, JSON.stringify(input));
        assert.equal(result.substitutionCount, 2, JSON.stringify(input));
        const elapsed = performance.now() - startedAt;
        assert.ok(
          elapsed < 2_000,
          `${JSON.stringify(input)} resolved reference took ${elapsed.toFixed(1)} ms`,
        );
      }
    }
  }
});

test("resolved shortcut references remain atomic with neighboring stitch terms", () => {
  for (const context of ["", "Row 1: ", "Body: ", "> 1. Body: "]) {
    for (const body of [
      "Work [dc] and tr in next stitch.",
      "Work foo[dc] and tr in next stitch.",
      "Work [dc]id and tr in next stitch.",
      "Work [dc].txt and tr in next stitch.",
      "Work [2 dc] and tr in next stitch.",
      "Work [dc stitch] and tr in next stitch.",
    ]) {
      const label = body.includes("[2 dc]")
        ? "2 dc"
        : (body.includes("[dc stitch]") ? "dc stitch" : "dc");
      const input = `${context}${body}\n[${label}]: https://example.com/dc`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }

    const normalized = `${context}Work [double   crochet][] and tr in next stitch.\n[DOUBLE crochet]: /url`;
    const normalizedResult = decodeVintagePattern(normalized, "uk");
    assert.equal(normalizedResult.output, normalized, normalized);
    assert.equal(normalizedResult.substitutionCount, 0, normalized);
  }
});

test("two-line reference definitions preserve inline-link precedence and localized shortcut denies", () => {
  for (const eol of ["\n", "\r\n"]) {
    for (const definitionFirst of [false, true]) {
      const definition = "[dc]: /url";
      const inlineInstruction = "Work [dc](a) and tr in next stitch.";
      const expectedInlineInstruction = "Work [single crochet (sc)](a) and double crochet (dc) in next stitch.";
      const inlineInput = definitionFirst
        ? `${definition}${eol}${inlineInstruction}`
        : `${inlineInstruction}${eol}${definition}`;
      const expectedInline = definitionFirst
        ? `${definition}${eol}${expectedInlineInstruction}`
        : `${expectedInlineInstruction}${eol}${definition}`;
      const inlineResult = decodeVintagePattern(inlineInput, "uk");
      assert.equal(inlineResult.output, expectedInline, JSON.stringify(inlineInput));
      assert.equal(inlineResult.substitutionCount, 2, JSON.stringify(inlineInput));

      for (const shortcut of ["[dc]", "[dc][]"]) {
        for (const command of [
          `Work ${shortcut}. Work htr in next stitch.`,
          `Work ${shortcut}; Work htr in next stitch.`,
          `Work ${shortcut} and tr in next stitch. Work htr in next stitch.`,
        ]) {
          const expectedCommand = command.replace(
            "Work htr in next stitch.",
            "Work half double crochet (hdc) in next stitch.",
          );
          const input = definitionFirst
            ? `${definition}${eol}${command}`
            : `${command}${eol}${definition}`;
          const expected = definitionFirst
            ? `${definition}${eol}${expectedCommand}`
            : `${expectedCommand}${eol}${definition}`;
          const result = decodeVintagePattern(input, "uk");
          assert.equal(result.output, expected, JSON.stringify(input));
          assert.equal(result.substitutionCount, 1, JSON.stringify(input));
        }
      }
    }
  }
});

test("two-line reference fast paths restore exact offsets and reject invalid reference structure", () => {
  for (const eol of ["\n", "\r\n"]) {
    for (const definitionFirst of [false, true]) {
      const longLabel = `dc tr before ${"😀".repeat(986)}`;
      const definition = `[${longLabel}]: /url`;
      const instruction = `Work htr, [dc][${longLabel}], [tr][other], and dtr in next stitch.`;
      const expectedInstruction = `Work half double crochet (hdc), [single crochet (sc)][${longLabel}], [double crochet (dc)][other], and treble crochet (tr) in next stitch.`;
      const input = definitionFirst
        ? `${definition}${eol}${instruction}`
        : `${instruction}${eol}${definition}`;
      const expected = definitionFirst
        ? `${definition}${eol}${expectedInstruction}`
        : `${expectedInstruction}${eol}${definition}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, JSON.stringify({ eol, definitionFirst }));
      assert.equal(result.substitutionCount, 4, JSON.stringify({ eol, definitionFirst }));
      const elapsed = performance.now() - startedAt;
      assert.ok(
        elapsed < 2_000,
        `long offset restoration took ${elapsed.toFixed(1)} ms`,
      );

      const mismatchInstruction = "Work [dc][other] and htr in next stitch.";
      const expectedMismatchInstruction = "Work [single crochet (sc)][other] and half double crochet (hdc) in next stitch.";
      const mismatchDefinition = "[ref]: /url";
      const mismatchInput = definitionFirst
        ? `${mismatchDefinition}${eol}${mismatchInstruction}`
        : `${mismatchInstruction}${eol}${mismatchDefinition}`;
      const expectedMismatch = definitionFirst
        ? `${mismatchDefinition}${eol}${expectedMismatchInstruction}`
        : `${expectedMismatchInstruction}${eol}${mismatchDefinition}`;
      const mismatchResult = decodeVintagePattern(mismatchInput, "uk");
      assert.equal(mismatchResult.output, expectedMismatch, JSON.stringify(mismatchInput));
      assert.equal(mismatchResult.substitutionCount, 2, JSON.stringify(mismatchInput));

      for (const shortcut of ["[dc]", "[note]", "[ ]"]) {
        const shortcutInstruction = `Work ${shortcut} and htr in next stitch.`;
        const shortcutInput = definitionFirst
          ? `${mismatchDefinition}${eol}${shortcutInstruction}`
          : `${shortcutInstruction}${eol}${mismatchDefinition}`;
        const shortcutResult = decodeVintagePattern(shortcutInput, "uk");
        assert.equal(shortcutResult.output, shortcutInput, JSON.stringify(shortcutInput));
        assert.equal(shortcutResult.substitutionCount, 0, JSON.stringify(shortcutInput));
      }

      const collapsedInstruction = "Work [dc][] and htr in next stitch.";
      const expectedCollapsedInstruction = "Work [single crochet (sc)][] and half double crochet (hdc) in next stitch.";
      const collapsedInput = definitionFirst
        ? `${mismatchDefinition}${eol}${collapsedInstruction}`
        : `${collapsedInstruction}${eol}${mismatchDefinition}`;
      const expectedCollapsed = definitionFirst
        ? `${mismatchDefinition}${eol}${expectedCollapsedInstruction}`
        : `${expectedCollapsedInstruction}${eol}${mismatchDefinition}`;
      const collapsedResult = decodeVintagePattern(collapsedInput, "uk");
      assert.equal(collapsedResult.output, expectedCollapsed, JSON.stringify(collapsedInput));
      assert.equal(collapsedResult.substitutionCount, 2, JSON.stringify(collapsedInput));

      const matchingDefinition = "[DOUBLE crochet]: /url";
      const matchingCollapsedInstruction = "Work [double   crochet][] and tr in next stitch.";
      const matchingCollapsedInput = definitionFirst
        ? `${matchingDefinition}${eol}${matchingCollapsedInstruction}`
        : `${matchingCollapsedInstruction}${eol}${matchingDefinition}`;
      const matchingCollapsedResult = decodeVintagePattern(matchingCollapsedInput, "uk");
      assert.equal(
        matchingCollapsedResult.output,
        matchingCollapsedInput,
        JSON.stringify(matchingCollapsedInput),
      );
      assert.equal(
        matchingCollapsedResult.substitutionCount,
        0,
        JSON.stringify(matchingCollapsedInput),
      );
    }
  }

  for (const label of ["r".repeat(1_000), "😀".repeat(1_000)]) {
    for (const definitionFirst of [false, true]) {
      const instruction = `Work [dc][${label}] and htr in next stitch.`;
      const definition = `[${label}]: /url`;
      const input = definitionFirst
        ? `${definition}\n${instruction}`
        : `${instruction}\n${definition}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, `${label.length}:${definitionFirst}`);
      assert.equal(result.substitutionCount, 0, `${label.length}:${definitionFirst}`);
      const elapsed = performance.now() - startedAt;
      assert.ok(elapsed < 2_000, `overlong reference took ${elapsed.toFixed(1)} ms`);
    }
  }
});

test("opaque reference IDs cannot change target or gauge command authority", () => {
  for (const label of [
    "ref",
    "tr",
    "Work htr .; dc tr",
    "Work htr .; \"dc tr\"",
    "\"Body: Body: Body: Body: Work htr\"",
    "😀".repeat(999),
  ]) {
    for (const eol of ["\n", "\r\n"]) {
      for (const definitionFirst of [false, true]) {
        const definition = `[${label}]: /url`;
        for (const [instruction, expectedInstruction, count] of [
          [
            `Work [dc][${label}] and htr in first tr.`,
            `Work [single crochet (sc)][${label}] and half double crochet (hdc) in first double crochet (dc).`,
            3,
          ],
          [
            `Work [dc][${label}] in first tr.`,
            `Work [single crochet (sc)][${label}] in first double crochet (dc).`,
            2,
          ],
          [
            `Work [dc][${label}] and htr. tension square.`,
            `Work [single crochet (sc)][${label}] and half double crochet (hdc). gauge square.`,
            3,
          ],
        ]) {
          const input = definitionFirst
            ? `${definition}${eol}${instruction}`
            : `${instruction}${eol}${definition}`;
          const expected = definitionFirst
            ? `${definition}${eol}${expectedInstruction}`
            : `${expectedInstruction}${eol}${definition}`;
          const startedAt = performance.now();
          const result = decodeVintagePattern(input, "uk");
          assert.equal(result.output, expected, JSON.stringify({ label, eol, definitionFirst }));
          assert.equal(result.substitutionCount, count, JSON.stringify({ label, eol, definitionFirst }));
          const elapsed = performance.now() - startedAt;
          assert.ok(
            elapsed < 2_000,
            `${JSON.stringify({ labelLength: label.length, eol, definitionFirst })} took ${elapsed.toFixed(1)} ms`,
          );
        }
      }
    }
  }

  const quotedOverflowLabel = "\"Body: Body: Body: Body: Work htr\"";
  for (const [input, expected] of [
    [
      `Work [dc][${quotedOverflowLabel}] in next stitch.`,
      `Work [single crochet (sc)][${quotedOverflowLabel}] in next stitch.`,
    ],
    [
      `Work [dc][${quotedOverflowLabel}] in next stitch.\n[${quotedOverflowLabel}]: /url`,
      `Work [single crochet (sc)][${quotedOverflowLabel}] in next stitch.\n[${quotedOverflowLabel}]: /url`,
    ],
    [
      `[${quotedOverflowLabel}]: /url\r\nWork [dc][${quotedOverflowLabel}] in next stitch.`,
      `[${quotedOverflowLabel}]: /url\r\nWork [single crochet (sc)][${quotedOverflowLabel}] in next stitch.`,
    ],
  ]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected, input);
    assert.deepEqual(result.signals, [], input);
    assert.ok(performance.now() - startedAt < 2_000, `${input} should stay bounded`);
  }

  for (const label of [
    quotedOverflowLabel,
    "“Body: Body: Body: Body: Work htr”",
    "‘Body: Body: Body: Body: Work htr’",
    "\\\"Body: Body: Body: Body: Work htr\\\"",
  ]) {
    const input = `Work [dc][${label}] in next stitch.`;
    const expected = `Work [single crochet (sc)][${label}] in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, label);
    assert.equal(result.substitutionCount, 1, label);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
  }

  const referenceCommand = `Work [dc][${quotedOverflowLabel}] in next stitch`;
  const mappedReferenceCommand = `Work [single crochet (sc)][${quotedOverflowLabel}] in next stitch`;
  const neighbor = "Work tr in next stitch";
  const mappedNeighbor = "Work double crochet (dc) in next stitch";
  for (const delimiter of [".", ";"]) {
    for (const spacing of [" ", "\t", "\u00a0", "\u1680", "\u2003", "\u202f", "\u3000"]) {
      for (const referenceFirst of [true, false]) {
        const input = referenceFirst
          ? `${referenceCommand}${delimiter}${spacing}${neighbor}.`
          : `${neighbor}${delimiter}${spacing}${referenceCommand}.`;
        const expected = referenceFirst
          ? `${mappedReferenceCommand}${delimiter}${spacing}${mappedNeighbor}.`
          : `${mappedNeighbor}${delimiter}${spacing}${mappedReferenceCommand}.`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        const elapsed = performance.now() - startedAt;
        const label = `${delimiter}:${spacing.codePointAt(0).toString(16)}:${referenceFirst}`;
        assert.equal(result.output, expected, label);
        assert.equal(result.substitutionCount, 2, label);
        assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
        assert.deepEqual(result.signals, [], label);
        assert.ok(elapsed < 2_000, `${label} took ${elapsed.toFixed(1)} ms`);
      }
    }
  }

  const maximumQuotedOverflowLabel = `"${"x".repeat(
    999 - quotedOverflowLabel.length
  )}${quotedOverflowLabel.slice(1)}`;
  const overlongQuotedOverflowLabel = `"${"x".repeat(
    1_000 - quotedOverflowLabel.length
  )}${quotedOverflowLabel.slice(1)}`;
  for (const [label, accepted] of [
    [maximumQuotedOverflowLabel, true],
    [overlongQuotedOverflowLabel, false],
  ]) {
    const input = `Work [dc][${label}] in next stitch.`;
    const expected = accepted
      ? `Work [single crochet (sc)][${label}] in next stitch.`
      : input;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    const elapsed = performance.now() - startedAt;
    assert.equal(result.output, expected, `${label.length}:${accepted}`);
    assert.equal(result.substitutionCount, accepted ? 1 : 0, `${label.length}:${accepted}`);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected);
    assert.ok(elapsed < 2_000, `${label.length}:${accepted} took ${elapsed.toFixed(1)} ms`);
  }

  for (const input of [
    "Work [\"dc\"][ref] in next stitch.",
    "Work [dc][\"Body: Body: Body: Body: Work htr\" in next stitch.",
    "Work [dc][\"Body: Body: [nested] Body: Body: Work htr\"] in next stitch.",
    `"Work tr in next stitch [dc][${quotedOverflowLabel}] then htr."`,
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
    assert.equal(result.segments.map(({ content }) => content).join(""), input);
  }

  const titledDestination = "Work [dc](https://example.com \"Body: Body: Body: Body: Work htr\") in next stitch.";
  const expectedTitledDestination = "Work [single crochet (sc)](https://example.com \"Body: Body: Body: Body: Work htr\") in next stitch.";
  const titledDestinationResult = decodeVintagePattern(titledDestination, "uk");
  assert.equal(titledDestinationResult.output, expectedTitledDestination);
  assert.equal(titledDestinationResult.substitutionCount, 1);
  assert.equal(
    titledDestinationResult.segments.map(({ content }) => content).join(""),
    expectedTitledDestination,
  );

  const quotedMarkupCommands = [
    `"Work [dc][ref] in next stitch."`,
    `“Work [dc][ref] in next stitch.”`,
    `‘Work [dc][ref] in next stitch.’`,
    `**"Work [dc][ref] in next stitch."**`,
    `"Work [dc](https://example.com) in next stitch."`,
    `“Work [dc](https://example.com \"Body: Work htr\") in next stitch.”`,
    `"Work [dc][${maximumQuotedOverflowLabel}] in next stitch."`,
  ];
  const outsideCommand = "Work htr in next stitch.";
  const mappedOutsideCommand = "Work half double crochet (hdc) in next stitch.";
  for (const quotedCommand of quotedMarkupCommands) {
    for (const separator of [" ", "\t", "\u00a0", ". ", "; "]) {
      for (const quotedFirst of [true, false]) {
        const input = quotedFirst
          ? `${quotedCommand}${separator}${outsideCommand}`
          : `${outsideCommand}${separator}${quotedCommand}`;
        const expected = quotedFirst
          ? `${quotedCommand}${separator}${mappedOutsideCommand}`
          : `${mappedOutsideCommand}${separator}${quotedCommand}`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        const elapsed = performance.now() - startedAt;
        const label = `${quotedCommand.slice(0, 20)}:${JSON.stringify(separator)}:${quotedFirst}`;
        assert.equal(result.output, expected, label);
        assert.equal(result.substitutionCount, 1, label);
        assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
        assert.deepEqual(result.signals, [], label);
        assert.ok(elapsed < 2_000, `${label} took ${elapsed.toFixed(1)} ms`);
      }
    }
  }
});

test("two-line reference fast paths isolate exact standalone tension-square segments", () => {
  for (const label of ["ref", "Work htr .; \"dc tr\"", "😀".repeat(999)]) {
    for (const gaugeFirst of [false, true]) {
      for (const separator of ["\n", "\r\n"]) {
        for (const terminalEol of ["", separator]) {
          for (const definitionFirst of [false, true]) {
            const work = `Work [dc][${label}] and htr.`;
            const expectedWork = `Work [single crochet (sc)][${label}] and half double crochet (hdc).`;
            const instruction = gaugeFirst
              ? `tension square. ${work}`
              : `${work} tension square.`;
            const expectedInstruction = gaugeFirst
              ? `gauge square. ${expectedWork}`
              : `${expectedWork} gauge square.`;
            const definition = `[${label}]: /url`;
            const input = definitionFirst
              ? `${definition}${separator}${instruction}${terminalEol}`
              : `${instruction}${separator}${definition}${terminalEol}`;
            const expected = definitionFirst
              ? `${definition}${separator}${expectedInstruction}${terminalEol}`
              : `${expectedInstruction}${separator}${definition}${terminalEol}`;
            const startedAt = performance.now();
            const result = decodeVintagePattern(input, "uk");
            assert.equal(
              result.output,
              expected,
              JSON.stringify({ labelLength: label.length, gaugeFirst, separator, terminalEol, definitionFirst }),
            );
            assert.equal(result.substitutionCount, 3);
            assert.equal(
              result.signals.some(({ title }) => title === "Wording that may follow UK conventions"),
              true,
            );
            const elapsed = performance.now() - startedAt;
            assert.ok(elapsed < 2_000, `tension-square fast path took ${elapsed.toFixed(1)} ms`);
          }
        }
      }
    }
  }

  for (const [instruction, expectedInstruction, count] of [
    [
      "Work [dc][ref] and htr. tension square widget.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc). gauge square widget.",
      3,
    ],
    [
      "Work [dc][ref] and htr. tension square..",
      "Work [single crochet (sc)][ref] and half double crochet (hdc). gauge square..",
      3,
    ],
    [
      "Work [dc][ref] and htr. tension square as a label.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc). tension square as a label.",
      2,
    ],
    [
      "Work [dc][ref] and htr, then tension square.",
      "Work [single crochet (sc)][ref] and half double crochet (hdc), then gauge square.",
      3,
    ],
  ]) {
    const input = `${instruction}\n[ref]: /url`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${expectedInstruction}\n[ref]: /url`, input);
    assert.equal(result.substitutionCount, count, input);
  }
});

test("escaped reference-ID brackets remain opaque to shortcut detection", () => {
  for (const label of [String.raw`r\[dc`, String.raw`r\[note`, String.raw`r\]dc`]) {
    for (const eol of ["\n", "\r\n"]) {
      for (const definitionFirst of [false, true]) {
        const instruction = `Work [tr][${label}] and htr in next stitch.`;
        const expectedInstruction = `Work [double crochet (dc)][${label}] and half double crochet (hdc) in next stitch.`;
        const definition = `[${label}]: /url`;
        const input = definitionFirst
          ? `${definition}${eol}${instruction}`
          : `${instruction}${eol}${definition}`;
        const expected = definitionFirst
          ? `${definition}${eol}${expectedInstruction}`
          : `${expectedInstruction}${eol}${definition}`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, expected, JSON.stringify(input));
        assert.equal(result.substitutionCount, 2, JSON.stringify(input));
        const elapsed = performance.now() - startedAt;
        assert.ok(elapsed < 2_000, `escaped reference ID took ${elapsed.toFixed(1)} ms`);
      }
    }
  }
});

test("inline-link destinations remain opaque to two-line shortcut detection", () => {
  for (const destination of [
    "https://example.com/[dc]",
    "https://example.com/a[dc]b",
    "a(inside)[dc]",
    "https://example.com/path \"title [dc]\"",
  ]) {
    for (const eol of ["\n", "\r\n"]) {
      for (const definitionFirst of [false, true]) {
        const instruction = `Work [tr](${destination}) and htr in next stitch.`;
        const expectedInstruction = `Work [double crochet (dc)](${destination}) and half double crochet (hdc) in next stitch.`;
        const definition = "[dc]: /url";
        const input = definitionFirst
          ? `${definition}${eol}${instruction}`
          : `${instruction}${eol}${definition}`;
        const expected = definitionFirst
          ? `${definition}${eol}${expectedInstruction}`
          : `${expectedInstruction}${eol}${definition}`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, expected, JSON.stringify(input));
        assert.equal(result.substitutionCount, 2, JSON.stringify(input));
        const elapsed = performance.now() - startedAt;
        assert.ok(elapsed < 2_000, `inline destination took ${elapsed.toFixed(1)} ms`);
      }
    }
  }
});

test("linked Work review clues preserve exact signals, opacity, and bounded decisions", () => {
  const signalTitles = (result) => result.signals.map(({ title }) => title);
  const reconstructInput = (result) => result.segments.map((segment) => (
    segment.type === "sub" ? segment.original : segment.content
  )).join("");
  const hiddenClues = "work straight wool forward No. 9 needles 2 oz";
  const linkedCommands = [
    {
      command: `Work [dc][${hiddenClues}] in next stitch`,
      expected: `Work [single crochet (sc)][${hiddenClues}] in next stitch`,
    },
    {
      command: `Work [dc](a(inside) "${hiddenClues}") in next stitch`,
      expected: `Work [single crochet (sc)](a(inside) "${hiddenClues}") in next stitch`,
    },
  ];
  const reviewClues = [
    "Miss 1 stitch",
    "Cast off",
    "Work straight",
    "Wool forward",
    "wl fwd",
    "wf",
    "wb",
    "Use No. 9 needles",
    "Crochet hook size 4",
    "Use 6 oz wool",
  ];

  for (const { command, expected } of linkedCommands) {
    for (const clue of reviewClues) {
      for (const workFirst of [true, false]) {
        for (const separator of [". ", ";\t", ".\u00a0"]) {
          const input = workFirst
            ? `${command}${separator}${clue}.`
            : `${clue}${separator}${command}.`;
          const expectedOutput = workFirst
            ? `${expected}${separator}${clue}.`
            : `${clue}${separator}${expected}.`;
          const control = workFirst
            ? `Work dc in next stitch${separator}${clue}.`
            : `${clue}${separator}Work dc in next stitch.`;
          const controlResult = decodeVintagePattern(control, "uk");
          const startedAt = performance.now();
          const result = decodeVintagePattern(input, "uk");
          const elapsed = performance.now() - startedAt;

          assert.equal(result.output, expectedOutput, JSON.stringify(input));
          assert.equal(result.substitutionCount, 1, JSON.stringify(input));
          assert.deepEqual(result.signals, controlResult.signals, JSON.stringify(input));
          assert.equal(reconstructInput(result), input, JSON.stringify(input));
          assert.ok(elapsed < 2_000, `${JSON.stringify(input)} took ${elapsed.toFixed(1)} ms`);
        }
      }
    }
  }

  const allHorizontalSpaces = [
    "\t",
    ...[
      0x20,
      0xa0,
      0x1680,
      0x2000,
      0x2001,
      0x2002,
      0x2003,
      0x2004,
      0x2005,
      0x2006,
      0x2007,
      0x2008,
      0x2009,
      0x200a,
      0x202f,
      0x205f,
      0x3000,
    ].map((codePoint) => String.fromCodePoint(codePoint)),
  ];
  for (const space of allHorizontalSpaces) {
    const input = `Work [dc][ref] in next stitch.${space}hooks${space}No.${space}4.`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    const elapsed = performance.now() - startedAt;
    assert.equal(
      result.output,
      `Work [single crochet (sc)][ref] in next stitch.${space}hooks${space}No.${space}4.`,
      JSON.stringify(space),
    );
    assert.equal(result.substitutionCount, 1, JSON.stringify(space));
    assert.deepEqual(signalTitles(result), ["Numbered needle or hook size"], JSON.stringify(space));
    assert.ok(elapsed < 2_000, `U+${space.codePointAt(0).toString(16)} took ${elapsed.toFixed(1)} ms`);
  }

  for (const { clue, expectedClue, count } of [
    { clue: "Tension: 20 stitches.", expectedClue: "gauge: 20 stitches.", count: 2 },
    { clue: "The tension is 20 stitches.", expectedClue: "The gauge is 20 stitches.", count: 2 },
    { clue: "Tension square.", expectedClue: "gauge square.", count: 2 },
    { clue: "Tension square widget.", expectedClue: "gauge square widget.", count: 2 },
    { clue: "Tension square as a label.", expectedClue: "Tension square as a label.", count: 1 },
  ]) {
    const input = `Work [dc][ref] in next stitch. ${clue}`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    const elapsed = performance.now() - startedAt;
    assert.equal(
      result.output,
      `Work [single crochet (sc)][ref] in next stitch. ${expectedClue}`,
      input,
    );
    assert.equal(result.substitutionCount, count, input);
    assert.deepEqual(signalTitles(result), ["Wording that may follow UK conventions"], input);
    assert.equal(reconstructInput(result), input, input);
    assert.ok(elapsed < 2_000, `${input} took ${elapsed.toFixed(1)} ms`);
  }

  const gaugeUnits = [
    ["dc", "single crochet (sc)"],
    ["tr", "double crochet (dc)"],
    ["htr", "half double crochet (hdc)"],
    ["dtr", "treble crochet (tr)"],
    ["double crochet", "single crochet (sc)"],
    ["treble crochet", "double crochet (dc)"],
    ["half treble crochet", "half double crochet (hdc)"],
    ["double treble crochet", "treble crochet (tr)"],
  ];
  for (const [unit, expectedUnit] of gaugeUnits) {
    for (const linkedWork of [true, false]) {
      const work = linkedWork
        ? "Work [htr](a) in next stitch"
        : "Work htr in next stitch";
      const expectedWork = linkedWork
        ? "Work [half double crochet (hdc)](a) in next stitch"
        : "Work half double crochet (hdc) in next stitch";
      for (const gaugeFirst of [true, false]) {
        for (const separator of [". ", "; ", ".\u2003"]) {
          const gauge = `Tension: 20 ${unit}`;
          const expectedGauge = `gauge: 20 ${expectedUnit}`;
          const input = gaugeFirst
            ? `${gauge}${separator}${work}.`
            : `${work}${separator}${gauge}.`;
          const expectedOutput = gaugeFirst
            ? `${expectedGauge}${separator}${expectedWork}.`
            : `${expectedWork}${separator}${expectedGauge}.`;
          const startedAt = performance.now();
          const result = decodeVintagePattern(input, "uk");
          const elapsed = performance.now() - startedAt;
          assert.equal(result.output, expectedOutput, JSON.stringify(input));
          assert.equal(result.substitutionCount, 3, JSON.stringify(input));
          assert.deepEqual(
            signalTitles(result),
            ["Wording that may follow UK conventions"],
            JSON.stringify(input),
          );
          assert.equal(reconstructInput(result), input, JSON.stringify(input));
          assert.ok(elapsed < 2_000, `${JSON.stringify(input)} took ${elapsed.toFixed(1)} ms`);
        }
      }
    }
  }

  const referenceUses = [
    `Work [dc][${hiddenClues}] in next stitch.\n[${hiddenClues}]: /url`,
    `[${hiddenClues}]: /url\r\nWork [dc][${hiddenClues}] in next stitch.\r\n`,
  ];
  for (const input of referenceUses) {
    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, convention);
      const elapsed = performance.now() - startedAt;
      const expectedOutput = convention === "uk"
        ? input.replace("[dc]", "[single crochet (sc)]")
        : input;
      assert.equal(result.output, expectedOutput, `${convention}: ${JSON.stringify(input)}`);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        signalTitles(result),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(reconstructInput(result), input, `${convention}: ${JSON.stringify(input)}`);
      assert.ok(elapsed < 2_000, `${convention} reference use took ${elapsed.toFixed(1)} ms`);
    }
  }

  const maximumLengthBase = "Work [dc][ref] in next stitch. Miss 1 stitch.";
  for (const trailingSpace of [" ", "\t", "\u00a0"]) {
    const input = maximumLengthBase + trailingSpace.repeat(
      MAX_VINTAGE_PATTERN_TEXT_LENGTH - maximumLengthBase.length,
    );
    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, convention);
      const elapsed = performance.now() - startedAt;
      const expectedOutput = convention === "uk"
        ? input.replace("[dc]", "[single crochet (sc)]")
        : input;
      const expectedSignals = convention === "unknown"
        ? ["Crochet convention not established", "Wording that may follow UK conventions"]
        : ["Wording that may follow UK conventions"];
      assert.equal(result.output, expectedOutput, `${convention}: ${JSON.stringify(trailingSpace)}`);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(signalTitles(result), expectedSignals);
      assert.equal(reconstructInput(result), input);
      assert.ok(
        elapsed < 2_000,
        `${convention} maximum-length trailing whitespace took ${elapsed.toFixed(1)} ms`,
      );
    }
  }
});

test("linked Work signal fallbacks preserve malformed, definition, and source priority", () => {
  const signalTitles = (result) => result.signals.map(({ title }) => title);
  const reconstructInput = (result) => result.segments.map((segment) => (
    segment.type === "sub" ? segment.original : segment.content
  )).join("");
  for (const { input, expectedSignals } of [
    {
      input: "Work [dc](a \"bad in next stitch. Work straight.",
      expectedSignals: [],
    },
    {
      input: "Work [dc](a) and tr-id in next stitch. Work straight.",
      expectedSignals: ["Wording that may follow UK conventions"],
    },
    {
      input: "Source: \"Work [dc](a) in next stitch.\" Work tr in next stitch.",
      expectedSignals: [],
    },
    {
      input: "Abbreviations: dc = Work [dc](a) in next stitch. Work straight.",
      expectedSignals: [],
    },
  ]) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, input, `${convention}: ${input}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${input}`);
      assert.deepEqual(signalTitles(result), expectedSignals, `${convention}: ${input}`);
    }
  }

  const hiddenOnly = "Work [widget][tension dc htr] in next stitch.\n[tension dc htr]: /url";
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(hiddenOnly, convention);
    assert.equal(result.output, hiddenOnly, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, [], convention);
  }

  for (const label of ["Root path", "Relative path", "Windows path", "UNC path"]) {
    for (const delimiter of [":", "=", "-", "‐", "‑", "‒", "–", "—"]) {
      const input = `${label}${delimiter} Miss 1 dc.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, input, `${convention}: ${input}`);
        assert.equal(result.substitutionCount, 0, `${convention}: ${input}`);
        assert.deepEqual(result.signals, [], `${convention}: ${input}`);
        assert.equal(reconstructInput(result), input, `${convention}: ${input}`);
      }
    }
  }

  const sourcePrefixes = [
    "",
    "> ",
    ">> ",
    "- ",
    "1. ",
    "### ",
    "> 1. ",
    "> ### ",
    "> - ",
    "> > ",
    "• ",
    "· ",
    "▪ ",
    "◦ ",
    "‣ ",
    "> • ",
    "> · ",
    "> 1. ### ",
  ];
  const sourceWrappers = ["", "*", "**", "_", "__"];
  const quoteFamilies = [
    ["\"", "\""],
    ["'", "'"],
    ["“", "”"],
    ["‘", "’"],
  ];
  for (const prefix of sourcePrefixes) {
    for (const label of ["Source", "File", "Path", "Reference", "URL"]) {
      for (const wrapper of sourceWrappers) {
        for (const [openQuote, closeQuote] of quoteFamilies) {
          const wrappedLabel = `${wrapper}${label}${wrapper}`;
          const sourceLine = `${prefix}${wrappedLabel}: ${openQuote}Work [dc](a) in next stitch.${closeQuote} Work tr in next stitch.`;
          for (const convention of ["uk", "unknown", "us"]) {
            const result = decodeVintagePattern(sourceLine, convention);
            assert.equal(result.output, sourceLine, `${convention}: ${sourceLine}`);
            assert.equal(result.substitutionCount, 0, `${convention}: ${sourceLine}`);
            assert.deepEqual(result.signals, [], `${convention}: ${sourceLine}`);
            assert.equal(reconstructInput(result), sourceLine, `${convention}: ${sourceLine}`);
          }

          for (const eol of ["\n", "\r\n"]) {
            const input = `${sourceLine}${eol}Work htr in next stitch.`;
            const expected = `${sourceLine}${eol}Work half double crochet (hdc) in next stitch.`;
            const result = decodeVintagePattern(input, "uk");
            assert.equal(result.output, expected, JSON.stringify(input));
            assert.equal(result.substitutionCount, 1, JSON.stringify(input));
            assert.deepEqual(result.signals, [], JSON.stringify(input));
            assert.equal(reconstructInput(result), input, JSON.stringify(input));
          }
        }
      }
    }
  }

  for (const prefix of ["", "> ", "• ", "### ", "> 1. ### "]) {
    for (const label of ["Filename", "File name", "Website", "Web site", "Webaddress", "Web address"]) {
      for (const wrapper of ["", "*", "***", "_", "___"]) {
        for (const [openQuote, closeQuote] of quoteFamilies) {
          const sourceLine = `${prefix}${wrapper}${label}${wrapper}: ${openQuote}Work [dc](a) in next stitch.${closeQuote} Work tr in next stitch.`;
          const input = `${sourceLine}\nWork htr in next stitch.`;
          const result = decodeVintagePattern(input, "uk");
          assert.equal(
            result.output,
            `${sourceLine}\nWork half double crochet (hdc) in next stitch.`,
            JSON.stringify(input),
          );
          assert.equal(result.substitutionCount, 1, JSON.stringify(input));
          assert.deepEqual(result.signals, [], JSON.stringify(input));
          assert.equal(reconstructInput(result), input, JSON.stringify(input));
        }
      }
    }
  }

  for (const label of ["FilenameX", "WebsiteX", "WebaddressX"]) {
    const input = `${label}: \"Work [dc](a) in next stitch.\" Work tr in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${label}: \"Work [dc](a) in next stitch.\" Work double crochet (dc) in next stitch.`,
      label,
    );
    assert.equal(result.substitutionCount, 1, label);
    assert.deepEqual(result.signals, [], label);
    assert.equal(reconstructInput(result), input, label);
  }

  for (const delimiter of [":", "=", "-", "‐", "‑", "‒", "–", "—"]) {
    const sourceLine = `> 1. ### *File${delimiter} ‘Work [dc](a) in next stitch.’ Work tr in next stitch.`;
    const input = `${sourceLine}\nWork htr in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, convention);
      const elapsed = performance.now() - startedAt;
      assert.equal(
        result.output,
        convention === "uk"
          ? `${sourceLine}\nWork half double crochet (hdc) in next stitch.`
          : input,
        `${convention}: ${JSON.stringify(input)}`,
      );
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        signalTitles(result),
        convention === "unknown" ? ["Crochet convention not established"] : [],
        `${convention}: ${JSON.stringify(input)}`,
      );
      assert.equal(reconstructInput(result), input, `${convention}: ${JSON.stringify(input)}`);
      assert.ok(
        elapsed < 2_000,
        `${convention} source delimiter ${JSON.stringify(delimiter)} took ${elapsed.toFixed(1)} ms`,
      );
    }
  }

  for (const prefix of ["• ", "· ", "▪ ", "◦ ", "‣ ", "> • ", "> · "]) {
    for (const label of ["Source", "File", "Path", "Reference", "URL"]) {
      for (const eol of ["\n", "\r\n"]) {
        const sourceLine = `${prefix}${label}: Work dc in next stitch.`;
        const input = `${sourceLine}${eol}Work htr in next stitch.`;
        const result = decodeVintagePattern(input, "uk");
        assert.equal(
          result.output,
          `${sourceLine}${eol}Work half double crochet (hdc) in next stitch.`,
          JSON.stringify(input),
        );
        assert.equal(result.substitutionCount, 1, JSON.stringify(input));
        assert.deepEqual(result.signals, [], JSON.stringify(input));
        assert.equal(reconstructInput(result), input, JSON.stringify(input));
      }
    }
  }

  for (const malformedLabel of [
    "*Source**",
    "**Source*",
    "*Source",
    "Source*",
    "_Source__",
    "__Source_",
    "*Source_",
  ]) {
    const quoted = `\"Work [dc](a) in next stitch.\"`;
    const input = `${malformedLabel}: ${quoted} Work tr in next stitch.\nWork htr in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${malformedLabel}: ${quoted} Work tr in next stitch.\nWork half double crochet (hdc) in next stitch.`,
      malformedLabel,
    );
    assert.equal(result.substitutionCount, 1, malformedLabel);
    assert.deepEqual(result.signals, [], malformedLabel);
    assert.equal(reconstructInput(result), input, malformedLabel);

    const unquotedInput = `${malformedLabel}: Work dc in next stitch.\nWork htr in next stitch.`;
    const unquotedResult = decodeVintagePattern(unquotedInput, "uk");
    assert.equal(
      unquotedResult.output,
      `${malformedLabel}: Work dc in next stitch.\nWork half double crochet (hdc) in next stitch.`,
      malformedLabel,
    );
    assert.equal(unquotedResult.substitutionCount, 1, malformedLabel);
    assert.deepEqual(unquotedResult.signals, [], malformedLabel);
    assert.equal(reconstructInput(unquotedResult), unquotedInput, malformedLabel);
  }

  const sourceTermReview = "Work [dc][ref] in next stitch. Miss 1 dc.";
  const sourceTermResult = decodeVintagePattern(sourceTermReview, "uk");
  assert.equal(
    sourceTermResult.output,
    "Work [single crochet (sc)][ref] in next stitch. Miss 1 single crochet (sc).",
  );
  assert.equal(sourceTermResult.substitutionCount, 2);
  assert.deepEqual(signalTitles(sourceTermResult), ["Wording that may follow UK conventions"]);

  const malformedSlashExpectedTail = "Miss 1 single crochet (sc).";
  for (const label of ["Relative path", "WidgetX"]) {
    for (const gap of ["", " ", "\t", "\u00a0", "\u2003"]) {
      for (const delimiter of [":", "=", "：", "＝", "→", "⇒", "➜"]) {
        const prefix = `${label}/${gap}${delimiter}`;
        const input = `${prefix} \"Work [dc](a) in next stitch.\" Work tr in next stitch. Miss 1 dc.`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        const elapsed = performance.now() - startedAt;
        const expectedMiddle = delimiter === ":"
          ? "Work double crochet (dc) in next stitch."
          : "Work tr in next stitch.";
        assert.equal(
          result.output,
          `${prefix} \"Work [dc](a) in next stitch.\" ${expectedMiddle} ${malformedSlashExpectedTail}`,
          JSON.stringify(prefix),
        );
        assert.equal(result.substitutionCount, delimiter === ":" ? 2 : 1, JSON.stringify(prefix));
        assert.deepEqual(
          signalTitles(result),
          ["Wording that may follow UK conventions"],
          JSON.stringify(prefix),
        );
        assert.equal(reconstructInput(result), input, JSON.stringify(prefix));
        assert.ok(elapsed < 2_000, `${JSON.stringify(prefix)} took ${elapsed.toFixed(1)} ms`);
      }
    }
  }

  for (const [openQuote, closeQuote] of [["\"", "\""], ["'", "'"], ["“", "”"], ["‘", "’"]]) {
    for (const gap of [" ", "\t", "\u00a0", "\u2003"]) {
      const legitimateDefinition = `Label${gap}=${gap}${openQuote}Work [dc](a) in next stitch.${closeQuote} Work tr in next stitch. Miss 1 dc.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const startedAt = performance.now();
        const legitimateDefinitionResult = decodeVintagePattern(legitimateDefinition, convention);
        const elapsed = performance.now() - startedAt;
        assert.equal(legitimateDefinitionResult.output, legitimateDefinition);
        assert.equal(legitimateDefinitionResult.substitutionCount, 0);
        assert.deepEqual(legitimateDefinitionResult.signals, []);
        assert.equal(reconstructInput(legitimateDefinitionResult), legitimateDefinition);
        assert.ok(
          elapsed < 2_000,
          `${convention} quoted definition took ${elapsed.toFixed(1)} ms`,
        );
      }
    }
  }

  for (const delimiter of [
    ":", " : ", "：", " ： ", "＝", " ＝ ", "→", " → ",
    "⇒", " ⇒ ", "➜", " ➜ ", " means ", " stands for ", " is ",
  ]) {
    const legitimateDefinition = `Miss? stitch${delimiter}“Work [dc](a) in next stitch.” Work tr in next stitch. Miss 1 dc.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(legitimateDefinition, convention);
      assert.equal(result.output, legitimateDefinition, `${convention}: ${JSON.stringify(delimiter)}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${JSON.stringify(delimiter)}`);
      assert.deepEqual(result.signals, [], `${convention}: ${JSON.stringify(delimiter)}`);
      assert.equal(
        reconstructInput(result),
        legitimateDefinition,
        `${convention}: ${JSON.stringify(delimiter)}`,
      );
    }
  }

  for (const label of [
    "Wave stitch (RS)",
    "Wave stitch [WS]",
    "Wave stitch, right side",
    "Wave stitch, wrong side",
    "**Wave stitch (RS)**",
    "**Wave stitch** (RS)",
    "*Wave stitch*",
    "***Wave stitch***",
    "****Wave stitch****",
    "******Wave stitch******",
    "_Wave stitch_",
    "___Wave stitch___",
    "____Wave stitch____",
    "__*Wave stitch*__",
    "\"\"Wave stitch\"\"",
    "''Wave stitch''",
    "““Wave stitch””",
    "‘‘Wave stitch’’",
    "“\"Wave stitch\"”",
    "**““Wave stitch””**",
    "(““Wave stitch””) (RS)",
    "Miss metadata. stitch [WS]",
  ]) {
    const legitimateDefinition = `${label}: "Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(legitimateDefinition, convention);
      assert.equal(result.output, legitimateDefinition, `${convention}: ${label}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${label}`);
      assert.deepEqual(result.signals, [], `${convention}: ${label}`);
      assert.equal(reconstructInput(result), legitimateDefinition, `${convention}: ${label}`);
    }
  }

  const nestedSmartDefinition = "““Wave stitch””: “Work [dc](a) in next stitch.” Work tr in next stitch. Miss 1 dc.";
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(nestedSmartDefinition, convention);
    assert.equal(result.output, nestedSmartDefinition, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, [], convention);
    assert.equal(reconstructInput(result), nestedSmartDefinition, convention);
  }

  for (const definition of [
    'Wave stitch: "Work dc." "Miss 1 dc."',
    "Wave stitch: “Work dc.” “Miss 1 dc.”",
    'Wave stitch: "Setup." "Miss 1 dc."',
    "Wave stitch: “Setup.” “Miss 1 dc.”",
    'Label = "Work dc." "Miss 1 dc."',
    "Label = “Setup.” “Miss 1 dc.”",
    'Wave stitch: "Work dc." "Miss 1 dc; keep straight."',
  ]) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(definition, convention);
      assert.equal(result.output, definition, `${convention}: ${definition}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${definition}`);
      assert.deepEqual(result.signals, [], `${convention}: ${definition}`);
      assert.equal(reconstructInput(result), definition, `${convention}: ${definition}`);
    }
  }

  const releasedMultiQuoteDefinition = 'Wave stitch: "Work dc." "Miss 1 dc."; Work htr in next stitch.';
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(releasedMultiQuoteDefinition, convention);
    assert.equal(
      result.output,
      convention === "uk"
        ? 'Wave stitch: "Work dc." "Miss 1 dc."; Work half double crochet (hdc) in next stitch.'
        : releasedMultiQuoteDefinition,
      convention,
    );
    assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
    assert.deepEqual(
      signalTitles(result),
      convention === "unknown" ? ["Crochet convention not established"] : [],
      convention,
    );
    assert.equal(reconstructInput(result), releasedMultiQuoteDefinition, convention);
  }

  for (const signalNeighbors of [
    'Work straight. Wave stitch: "Work dc." "Miss 1 dc."; Needles No. 4.',
    'Work straight. Wave stitch: "Setup." "Miss 1 dc."; Needles No. 4.',
    "Work straight. Wave stitch: 'Work dc.'; Needles No. 4.",
    "Work straight. Wave stitch: ‘Work dc.’; Needles No. 4.",
  ]) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(signalNeighbors, convention);
      assert.equal(result.output, signalNeighbors, convention);
      assert.equal(result.substitutionCount, 0, convention);
      assert.deepEqual(
        signalTitles(result),
        ["Wording that may follow UK conventions", "Numbered needle or hook size"],
        convention,
      );
      assert.equal(reconstructInput(result), signalNeighbors, convention);
    }
  }

  const chainedDefinitions = 'Wave stitch: "Work dc."; Fan stitch: "Miss 1 tr."; Work htr in next stitch.';
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(chainedDefinitions, convention);
    assert.equal(
      result.output,
      convention === "uk"
        ? 'Wave stitch: "Work dc."; Fan stitch: "Miss 1 tr."; Work half double crochet (hdc) in next stitch.'
        : chainedDefinitions,
      convention,
    );
    assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
    assert.deepEqual(
      signalTitles(result),
      convention === "unknown" ? ["Crochet convention not established"] : [],
      convention,
    );
    assert.equal(reconstructInput(result), chainedDefinitions, convention);
  }

  const sizeThenDefinition = 'Needles No. 4. Wave stitch: "Work dc." "Miss 1 dc."; Work htr in next stitch.';
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(sizeThenDefinition, convention);
    assert.equal(
      result.output,
      convention === "uk"
        ? 'Needles No. 4. Wave stitch: "Work dc." "Miss 1 dc."; Work half double crochet (hdc) in next stitch.'
        : sizeThenDefinition,
      convention,
    );
    assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
    assert.deepEqual(
      signalTitles(result),
      convention === "unknown"
        ? ["Numbered needle or hook size", "Crochet convention not established"]
        : ["Numbered needle or hook size"],
      convention,
    );
    assert.equal(reconstructInput(result), sizeThenDefinition, convention);
  }

  const shortQuotedDefinition = 'Wave stitch: "dc."; ';
  for (const definitionCount of [64, 65]) {
    const input = `${shortQuotedDefinition.repeat(definitionCount)}Work htr in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      definitionCount === 64
        ? `${shortQuotedDefinition.repeat(definitionCount)}Work half double crochet (hdc) in next stitch.`
        : input,
      definitionCount,
    );
    assert.equal(result.substitutionCount, definitionCount === 64 ? 1 : 0, definitionCount);
    assert.deepEqual(result.signals, [], definitionCount);
    assert.equal(reconstructInput(result), input, definitionCount);
  }

  for (const label of ["Wave stitch", "““Wave stitch””"]) {
    for (const wrapper of ["****", "______", "*".repeat(64), "*".repeat(65)]) {
      const definition = `${label}: ${wrapper}"Work [dc](a) in next stitch."${wrapper} Work tr in next stitch. Miss 1 dc.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(definition, convention);
        assert.equal(result.output, definition, `${convention}: ${label}: ${wrapper.length}`);
        assert.equal(result.substitutionCount, 0, `${convention}: ${label}: ${wrapper.length}`);
        assert.deepEqual(result.signals, [], `${convention}: ${label}: ${wrapper.length}`);
        assert.equal(
          reconstructInput(result),
          definition,
          `${convention}: ${label}: ${wrapper.length}`,
        );
      }
    }
  }

  for (const tailSegments of [64, 65, 128]) {
    const definition = `Wave stitch: "Work [dc](a) in next stitch." ${"Miss. ".repeat(tailSegments)}Work tr in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(definition, convention);
      assert.equal(result.output, definition, `${convention}: ${tailSegments}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${tailSegments}`);
      assert.deepEqual(result.signals, [], `${convention}: ${tailSegments}`);
      assert.equal(reconstructInput(result), definition, `${convention}: ${tailSegments}`);
    }
  }

  const nestedArbitraryColon = "““FilenameX””: “Work [dc](a) in next stitch.” Work tr in next stitch. Miss 1 dc.";
  const nestedArbitraryColonResult = decodeVintagePattern(nestedArbitraryColon, "uk");
  assert.equal(
    nestedArbitraryColonResult.output,
    "““FilenameX””: “Work [dc](a) in next stitch.” Work double crochet (dc) in next stitch. Miss 1 single crochet (sc).",
  );
  assert.equal(nestedArbitraryColonResult.substitutionCount, 2);
  assert.deepEqual(
    signalTitles(nestedArbitraryColonResult),
    ["Wording that may follow UK conventions"],
  );
  assert.equal(reconstructInput(nestedArbitraryColonResult), nestedArbitraryColon);

  const nestedStrongDefinition = "““Label”” = “Work [dc](a) in next stitch.” Work tr in next stitch. Miss 1 dc.";
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(nestedStrongDefinition, convention);
    assert.equal(result.output, nestedStrongDefinition, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, [], convention);
    assert.equal(reconstructInput(result), nestedStrongDefinition, convention);
  }

  for (const layers of [64, 65, 66]) {
    const label = `${"(".repeat(layers)}Wave stitch${")".repeat(layers)}`;
    const legitimateDefinition = `${label}: "Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(legitimateDefinition, convention);
      const elapsed = performance.now() - startedAt;
      assert.equal(result.output, legitimateDefinition, `${convention}: ${layers}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${layers}`);
      assert.deepEqual(result.signals, [], `${convention}: ${layers}`);
      assert.equal(reconstructInput(result), legitimateDefinition, `${convention}: ${layers}`);
      assert.ok(elapsed < 2_000, `${convention}: ${layers} layers took ${elapsed.toFixed(1)} ms`);
    }
  }

  for (const dash of ["-", "‐", "‑", "‒", "–", "—", "―", "−", "﹣", "－"]) {
    for (const delimiter of [` ${dash} `, dash]) {
      const legitimateDefinition = `Miss? stitch${delimiter}"Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(legitimateDefinition, convention);
        assert.equal(result.output, legitimateDefinition, `${convention}: ${JSON.stringify(delimiter)}`);
        assert.equal(result.substitutionCount, 0, `${convention}: ${JSON.stringify(delimiter)}`);
        assert.deepEqual(result.signals, [], `${convention}: ${JSON.stringify(delimiter)}`);
        assert.equal(
          reconstructInput(result),
          legitimateDefinition,
          `${convention}: ${JSON.stringify(delimiter)}`,
        );
      }
    }
  }

  for (const label of [
    `L${"a".repeat(64)}`,
    "Label.with punctuation / note?",
    "double crochet. stitch",
    "dc? stitch",
    "my dc. stitch",
  ]) {
    const legitimateDefinition = `${label}\t＝\t“Work [dc](a) in next stitch.” Work tr in next stitch. Miss 1 dc.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(legitimateDefinition, convention);
      assert.equal(result.output, legitimateDefinition, `${convention}: ${label}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${label}`);
      assert.deepEqual(result.signals, [], `${convention}: ${label}`);
      assert.equal(reconstructInput(result), legitimateDefinition, `${convention}: ${label}`);
    }
  }

  for (const label of [
    "Miss? stitch",
    "Miss metadata. stitch",
    "Miss 1 dc metadata. stitch",
    "Work straight metadata? stitch",
    "Work dc metadata. stitch",
    "Work dc as metadata. stitch",
    "Work dc as an example. stitch",
    "Work [dc]( in next stitch. stitch",
    "Work [dc][ref in next stitch. stitch",
    "*Work dc in next stitch. stitch",
    "No. 4. stitch",
    "Needles No. 4. stitch",
    "Needles No. 4. stitch (RS)",
    "Needles No. 4. stitch [RS]",
    "Needles No. 4. stitch, RS",
    "Needles No. 4. stitch (right side)",
    "Needles No. 4. stitch, wrong side",
    "**Needles No. 4. stitch (RS)**",
    "**Needles No. 4. stitch** (RS)",
    "\"Needles No. 4. stitch (custom)\" (RS)",
    "(Needles No. 4. stitch (local)) [WS]",
    "{Needles No. 4. stitch (pattern)}, right side",
    "**\"Needles No. 4. stitch (source)\"** (wrong side)",
    "Needles No. metadata. stitch",
  ]) {
    const legitimateDefinition = `${label} = "Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(legitimateDefinition, convention);
      assert.equal(result.output, legitimateDefinition, `${convention}: ${label}`);
      assert.equal(result.substitutionCount, 0, `${convention}: ${label}`);
      assert.deepEqual(result.signals, [], `${convention}: ${label}`);
      assert.equal(reconstructInput(result), legitimateDefinition, `${convention}: ${label}`);
    }
  }

  const maximumDefinitionTail = '\t=\t“Work [dc](a) in next stitch.” Work tr in next stitch. Miss 1 dc.';
  const maximumDefinition = `L${"a".repeat(
    MAX_VINTAGE_PATTERN_TEXT_LENGTH - maximumDefinitionTail.length - 1,
  )}${maximumDefinitionTail}`;
  for (const convention of ["uk", "unknown", "us"]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(maximumDefinition, convention);
    const elapsed = performance.now() - startedAt;
    assert.equal(result.output, maximumDefinition, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, [], convention);
    assert.equal(reconstructInput(result), maximumDefinition, convention);
    assert.ok(elapsed < 2_000, `${convention} maximum quoted definition took ${elapsed.toFixed(1)} ms`);
  }

  const maximumArbitraryColonTail = ': "Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.';
  const maximumArbitraryColonKey = `L${"a".repeat(
    MAX_VINTAGE_PATTERN_TEXT_LENGTH - maximumArbitraryColonTail.length - 1,
  )}`;
  const maximumArbitraryColon = `${maximumArbitraryColonKey}${maximumArbitraryColonTail}`;
  const maximumArbitraryColonStartedAt = performance.now();
  const maximumArbitraryColonResult = decodeVintagePattern(maximumArbitraryColon, "uk");
  const maximumArbitraryColonElapsed = performance.now() - maximumArbitraryColonStartedAt;
  assert.equal(
    maximumArbitraryColonResult.output,
    `${maximumArbitraryColonKey}: "Work [dc](a) in next stitch." Work double crochet (dc) in next stitch. Miss 1 single crochet (sc).`,
  );
  assert.equal(maximumArbitraryColonResult.substitutionCount, 2);
  assert.deepEqual(
    signalTitles(maximumArbitraryColonResult),
    ["Wording that may follow UK conventions"],
  );
  assert.equal(reconstructInput(maximumArbitraryColonResult), maximumArbitraryColon);
  assert.ok(
    maximumArbitraryColonElapsed < 2_000,
    `maximum arbitrary colon release took ${maximumArbitraryColonElapsed.toFixed(1)} ms`,
  );

  for (const slash of ["/", "／"]) {
    const maximumSlashColonTail = `${slash}: "Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.`;
    const maximumSlashColonKey = `L${"a".repeat(
      MAX_VINTAGE_PATTERN_TEXT_LENGTH - maximumSlashColonTail.length - 1,
    )}${slash}`;
    const maximumSlashColon = `${maximumSlashColonKey}: "Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.`;
    const maximumSlashColonStartedAt = performance.now();
    const maximumSlashColonResult = decodeVintagePattern(maximumSlashColon, "uk");
    const maximumSlashColonElapsed = performance.now() - maximumSlashColonStartedAt;
    assert.equal(
      maximumSlashColonResult.output,
      `${maximumSlashColonKey}: "Work [dc](a) in next stitch." Work double crochet (dc) in next stitch. Miss 1 single crochet (sc).`,
      slash,
    );
    assert.equal(maximumSlashColonResult.substitutionCount, 2, slash);
    assert.deepEqual(
      signalTitles(maximumSlashColonResult),
      ["Wording that may follow UK conventions"],
      slash,
    );
    assert.equal(reconstructInput(maximumSlashColonResult), maximumSlashColon, slash);
    assert.ok(
      maximumSlashColonElapsed < 2_000,
      `maximum slash colon release ${slash} took ${maximumSlashColonElapsed.toFixed(1)} ms`,
    );
  }

  const maximumNamedColonTail = ' Wave stitch: "Work [dc](a) in next stitch." Work tr in next stitch. Miss 1 dc.';
  const maximumNamedColon = `L${"a".repeat(
    MAX_VINTAGE_PATTERN_TEXT_LENGTH - maximumNamedColonTail.length - 1,
  )}${maximumNamedColonTail}`;
  const maximumNamedColonStartedAt = performance.now();
  const maximumNamedColonResult = decodeVintagePattern(maximumNamedColon, "uk");
  const maximumNamedColonElapsed = performance.now() - maximumNamedColonStartedAt;
  assert.equal(maximumNamedColonResult.output, maximumNamedColon);
  assert.equal(maximumNamedColonResult.substitutionCount, 0);
  assert.deepEqual(maximumNamedColonResult.signals, []);
  assert.equal(reconstructInput(maximumNamedColonResult), maximumNamedColon);
  assert.ok(
    maximumNamedColonElapsed < 2_000,
    `maximum named colon definition took ${maximumNamedColonElapsed.toFixed(1)} ms`,
  );

  const maximumAtomicNamedKey = `L${"a".repeat(
    MAX_VINTAGE_PATTERN_TEXT_LENGTH - maximumArbitraryColonTail.length - "Lstitch".length,
  )}stitch`;
  const maximumAtomicNamed = `${maximumAtomicNamedKey}${maximumArbitraryColonTail}`;
  for (const convention of ["uk", "unknown", "us"]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(maximumAtomicNamed, convention);
    const elapsed = performance.now() - startedAt;
    assert.equal(result.output, maximumAtomicNamed, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, [], convention);
    assert.equal(reconstructInput(result), maximumAtomicNamed, convention);
    assert.ok(
      elapsed < 2_000,
      `${convention} maximum atomic named definition took ${elapsed.toFixed(1)} ms`,
    );
  }

  for (const keyLength of [512, 513]) {
    const key = `L${"a".repeat(keyLength - 1)}`;
    const input = `${key}${maximumArbitraryColonTail}`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `${key}: "Work [dc](a) in next stitch." Work double crochet (dc) in next stitch. Miss 1 single crochet (sc).`,
      keyLength,
    );
    assert.equal(result.substitutionCount, 2, keyLength);
    assert.deepEqual(signalTitles(result), ["Wording that may follow UK conventions"], keyLength);
    assert.equal(reconstructInput(result), input, keyLength);
  }

  for (const suffix of [
    "stitch", "cluster", "motif", "shell", "bobble", "puff",
    "popcorn", "fan", "picot", "sequence", "variant",
  ]) {
    for (const keyLength of [512, 513]) {
      const key = `L${"a".repeat(keyLength - suffix.length - 1)}${suffix}`;
      const input = `${key}${maximumArbitraryColonTail}`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, input, `${convention}: ${suffix}: ${keyLength}`);
        assert.equal(result.substitutionCount, 0, `${convention}: ${suffix}: ${keyLength}`);
        assert.deepEqual(result.signals, [], `${convention}: ${suffix}: ${keyLength}`);
        assert.equal(
          reconstructInput(result),
          input,
          `${convention}: ${suffix}: ${keyLength}`,
        );
      }
    }
  }

  for (const slash of ["/", "／"]) {
    const key = `L${"a".repeat(511)}${slash}`;
    const input = `${key}${maximumArbitraryColonTail}`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(
        result.output,
        convention === "uk"
          ? `${key}: "Work [dc](a) in next stitch." Work double crochet (dc) in next stitch. Miss 1 single crochet (sc).`
          : input,
        `${convention}: ${slash}`,
      );
      assert.equal(result.substitutionCount, convention === "uk" ? 2 : 0);
      assert.deepEqual(
        signalTitles(result),
        convention === "unknown"
          ? ["Crochet convention not established", "Wording that may follow UK conventions"]
          : ["Wording that may follow UK conventions"],
        `${convention}: ${slash}`,
      );
      assert.equal(reconstructInput(result), input, `${convention}: ${slash}`);
    }
  }

  for (const releasedTail of [
    " Tension square: 10 dc = 4 in. Work tr in next stitch.",
    " Gauge: 10 dc = 4 in. Work tr in next stitch.",
    " Work tr in next stitch. 2+2=4.",
    " Label means dc. Work tr in next stitch.",
    " Label stands for dc. Work tr in next stitch.",
  ]) {
    for (const keyLength of [512, 513]) {
      for (const terminal of ["", "/", "／"]) {
        const key = `${"A".repeat(keyLength - terminal.length)}${terminal}`;
        const input = `${key}: "Work [dc](a) in next stitch."${releasedTail}`;
        for (const convention of ["uk", "unknown", "us"]) {
          const result = decodeVintagePattern(input, convention);
          assert.equal(
            result.output,
            input,
            `${convention}: ${keyLength}: ${terminal}: ${releasedTail}`,
          );
          assert.equal(result.substitutionCount, 0, `${convention}: ${releasedTail}`);
          assert.deepEqual(result.signals, [], `${convention}: ${releasedTail}`);
          assert.equal(reconstructInput(result), input, `${convention}: ${releasedTail}`);
        }
      }
    }
  }

  for (const definitionLabel of ["Wave stitch", "Gauge", "Tension square"]) {
    for (const delimiter of ["：", "→", "⇒", "➜"]) {
      const releasedDefinition = ` ${definitionLabel} ${delimiter} Work dc in next stitch.`;
      for (const keyLength of [512, 513]) {
        for (const terminal of ["", "/", "／"]) {
          const key = `${"A".repeat(keyLength - terminal.length)}${terminal}`;
          const input = `${key}: "Work [dc](a) in next stitch."${releasedDefinition}`;
          for (const convention of ["uk", "unknown", "us"]) {
            const result = decodeVintagePattern(input, convention);
            assert.equal(
              result.output,
              input,
              `${convention}: ${definitionLabel}: ${delimiter}: ${keyLength}: ${terminal}`,
            );
            assert.equal(result.substitutionCount, 0, `${definitionLabel}: ${delimiter}`);
            assert.deepEqual(result.signals, [], `${definitionLabel}: ${delimiter}`);
            assert.equal(reconstructInput(result), input, `${definitionLabel}: ${delimiter}`);
          }
        }
      }
    }
  }

  for (const wordDelimiter of [
    "stand for",
    "stands for",
    "stand\tfor",
    "stands\tfor",
    "stand\u00a0for",
    "stands\u00a0for",
    "stand\u2003for",
    "stands\u2003for",
  ]) {
    const releasedDefinition = ` Wave stitch ${wordDelimiter} Work dc in next stitch.`;
    for (const keyLength of [512, 513]) {
      for (const terminal of ["", "/", "／"]) {
        const key = `${"A".repeat(keyLength - terminal.length)}${terminal}`;
        const input = `${key}: "Work [dc](a) in next stitch."${releasedDefinition}`;
        for (const convention of ["uk", "unknown", "us"]) {
          const result = decodeVintagePattern(input, convention);
          assert.equal(
            result.output,
            input,
            `${convention}: ${JSON.stringify(wordDelimiter)}: ${keyLength}: ${terminal}`,
          );
          assert.equal(result.substitutionCount, 0, JSON.stringify(wordDelimiter));
          assert.deepEqual(result.signals, [], JSON.stringify(wordDelimiter));
          assert.equal(reconstructInput(result), input, JSON.stringify(wordDelimiter));
        }
      }
    }
  }

  for (const [open, close] of [["\"", "\""], ["'", "'"], ["“", "”"], ["‘", "’"]]) {
    const adjacentDefinition = ` Fan stitch:${open}Miss 1 dc.${close} Work tr in next stitch.`;
    for (const keyLength of [511, 512, 513]) {
      for (const terminal of ["", "/", "／"]) {
        const key = `${"A".repeat(keyLength - terminal.length)}${terminal}`;
        const input = `${key}: "Work [dc](a) in next stitch."${adjacentDefinition}`;
        for (const convention of ["uk", "unknown", "us"]) {
          const result = decodeVintagePattern(input, convention);
          assert.equal(
            result.output,
            input,
            `${convention}: ${open}${close}: ${keyLength}: ${terminal}`,
          );
          assert.equal(result.substitutionCount, 0, `${open}${close}: ${keyLength}`);
          assert.deepEqual(result.signals, [], `${open}${close}: ${keyLength}`);
          assert.equal(reconstructInput(result), input, `${open}${close}: ${keyLength}`);
        }
      }
    }
  }

  for (const [open, close] of [["\"", "\""], ["'", "'"], ["“", "”"], ["‘", "’"]]) {
    for (const recordSeparator of [";", "; ", " ; ", "\u00a0;\u2003"]) {
      const body = `: "Work dc in next stitch."${recordSeparator}Fan stitch:${open}Miss 1 dc.${close} Work htr in next stitch.`;
      for (const keyLength of [
        511,
        512,
        513,
        1_024,
        MAX_VINTAGE_PATTERN_TEXT_LENGTH - body.length,
      ]) {
        const key = "A".repeat(keyLength);
        const input = `${key}${body}`;
        for (const convention of ["uk", "unknown", "us"]) {
          const result = decodeVintagePattern(input, convention);
          assert.equal(
            result.output,
            input,
            `${convention}: ${open}${close}: ${JSON.stringify(recordSeparator)}: ${keyLength}`,
          );
          assert.equal(result.substitutionCount, 0, `${convention}: ${keyLength}`);
          assert.deepEqual(result.substitutions, [], `${convention}: ${keyLength}`);
          assert.deepEqual(result.signals, [], `${convention}: ${keyLength}`);
          assert.equal(reconstructInput(result), input, `${convention}: ${keyLength}`);
        }
      }
    }
  }

  for (const [open, close] of [["\"", "\""], ["'", "'"], ["“", "”"], ["‘", "’"]]) {
    for (const namedDefinitionSeparator of [";", "; ", " ; "]) {
      for (const releasesFollowingWork of [false, true]) {
        const releaseSeparator = releasesFollowingWork ? ";" : "";
        const body = `: "Work dc."; Work htr in next stitch${namedDefinitionSeparator}fan stitch:${open}Miss 1 tr.${close}${releaseSeparator} Work dc in next stitch.`;
        for (const keyLength of [
          511,
          512,
          513,
          1_024,
          MAX_VINTAGE_PATTERN_TEXT_LENGTH - body.length,
        ]) {
          const key = "A".repeat(keyLength);
          const input = `${key}${body}`;
          for (const convention of ["uk", "unknown", "us"]) {
            const result = decodeVintagePattern(input, convention);
            assert.equal(
              result.output,
              convention === "uk"
                ? `${key}: "Work dc."; Work half double crochet (hdc) in next stitch${namedDefinitionSeparator}fan stitch:${open}Miss 1 tr.${close}${releaseSeparator} Work ${releasesFollowingWork ? "single crochet (sc)" : "dc"} in next stitch.`
                : input,
              `${convention}: ${open}${close}: ${JSON.stringify(namedDefinitionSeparator)}: ${releasesFollowingWork}: ${keyLength}`,
            );
            assert.equal(
              result.substitutionCount,
              convention === "uk" ? (releasesFollowingWork ? 2 : 1) : 0,
              `${convention}: ${keyLength}`,
            );
            assert.deepEqual(
              signalTitles(result),
              convention === "unknown" ? ["Crochet convention not established"] : [],
              `${convention}: ${keyLength}`,
            );
            assert.equal(reconstructInput(result), input, `${convention}: ${keyLength}`);
          }
        }
      }
    }
  }

  for (const [releasedTail, mappedTail, substitutionCount] of [
    [
      ' Work tr in next stitch. Fan stitch:"Miss 1 dc." Work htr in next stitch.',
      ' Work double crochet (dc) in next stitch. Fan stitch:"Miss 1 dc." Work htr in next stitch.',
      1,
    ],
    [
      ' Fan stitch:"Miss 1 dc."; Work htr in next stitch.',
      ' Fan stitch:"Miss 1 dc."; Work half double crochet (hdc) in next stitch.',
      1,
    ],
  ]) {
    for (const keyLength of [512, 513]) {
      const key = "A".repeat(keyLength);
      const input = `${key}: "Work [dc](a) in next stitch."${releasedTail}`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk"
            ? `${key}: "Work [dc](a) in next stitch."${mappedTail}`
            : input,
          `${convention}: ${keyLength}: ${releasedTail}`,
        );
        assert.equal(
          result.substitutionCount,
          convention === "uk" ? substitutionCount : 0,
          `${convention}: ${keyLength}`,
        );
        assert.deepEqual(
          signalTitles(result),
          convention === "unknown" ? ["Crochet convention not established"] : [],
          `${convention}: ${keyLength}`,
        );
        assert.equal(reconstructInput(result), input, `${convention}: ${keyLength}`);
      }
    }
  }

  for (const tensionDelimiter of [
    ":", " : ", " - ", " ‐ ", " ‑ ", " ‒ ", " – ", " — ", " ― ", " − ", " ﹣ ", " － ",
  ]) {
    const releasedTension = ` Tension${tensionDelimiter}Work dc in next stitch.`;
    for (const keyLength of [511, 512, 513]) {
      for (const terminal of ["", "/", "／"]) {
        const key = `${"A".repeat(keyLength - terminal.length)}${terminal}`;
        const input = `${key}: "Work [dc](a) in next stitch."${releasedTension}`;
        for (const convention of ["uk", "unknown", "us"]) {
          const result = decodeVintagePattern(input, convention);
          assert.equal(
            result.output,
            input,
            `${convention}: ${JSON.stringify(tensionDelimiter)}: ${keyLength}: ${terminal}`,
          );
          assert.equal(result.substitutionCount, 0, JSON.stringify(tensionDelimiter));
          assert.deepEqual(
            signalTitles(result),
            ["Wording that may follow UK conventions"],
            `${convention}: ${JSON.stringify(tensionDelimiter)}: ${keyLength}`,
          );
          assert.equal(reconstructInput(result), input, JSON.stringify(tensionDelimiter));
        }
      }
    }
  }

  for (const keyLength of [511, 512, 513]) {
    const key = "A".repeat(keyLength);
    const input = `${key}: "Miss 1 dc." Work tr in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(
        result.output,
        convention === "uk"
          ? `${key}: "Miss 1 dc." Work double crochet (dc) in next stitch.`
          : input,
        `${convention}: ${keyLength}`,
      );
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
      assert.deepEqual(
        signalTitles(result),
        convention === "unknown"
          ? ["Crochet convention not established", "Wording that may follow UK conventions"]
          : ["Wording that may follow UK conventions"],
        `${convention}: ${keyLength}`,
      );
      assert.equal(reconstructInput(result), input, `${convention}: ${keyLength}`);
    }
  }

  for (const releasedTail of [
    " [ref]: /url?! Work dc in next stitch.",
    " [ref]: /url!? Work dc in next stitch.",
    " [ref]: /url?? Work dc in next stitch.",
    " [ref]: /url!! Work dc in next stitch.",
    " [ref]: /url?! Work dc unknown tail. Work tr in next stitch.",
    " source: /url?! Work dc in next stitch.",
    " **source**: /url?! Work dc in next stitch.",
  ]) {
    const body = `: "Work [dc](a) in next stitch."${releasedTail}`;
    for (const keyLength of [511, 512, 513, MAX_VINTAGE_PATTERN_TEXT_LENGTH - body.length]) {
      const key = "A".repeat(keyLength);
      const input = `${key}${body}`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, input, `${convention}: ${keyLength}: ${releasedTail}`);
        assert.equal(result.substitutionCount, 0, `${convention}: ${releasedTail}`);
        assert.deepEqual(result.substitutions, [], `${convention}: ${releasedTail}`);
        assert.deepEqual(result.signals, [], `${convention}: ${releasedTail}`);
        assert.equal(reconstructInput(result), input, `${convention}: ${releasedTail}`);
      }
    }
  }

  for (const {
    releasedTail,
    releasedUkTail,
    ukCount,
    signalsByConvention,
  } of [
    {
      releasedTail: " [ref]: /url; Work dc in next stitch.",
      releasedUkTail: " [ref]: /url; Work dc in next stitch.",
      ukCount: 0,
      signalsByConvention: { uk: [], unknown: [], us: [] },
    },
    {
      releasedTail: " Source: /dc/tr; Work htr in next stitch.",
      releasedUkTail: " Source: /dc/tr; Work htr in next stitch.",
      ukCount: 0,
      signalsByConvention: { uk: [], unknown: [], us: [] },
    },
    {
      releasedTail: " Path: C:\\dc\\tr.txt; Tension square: 10 dc = 4 in.",
      releasedUkTail: " Path: C:\\dc\\tr.txt; gauge square: 10 single crochet (sc) = 4 in.",
      ukCount: 2,
      signalsByConvention: {
        uk: ["Wording that may follow UK conventions"],
        unknown: [
          "Crochet convention not established",
          "Wording that may follow UK conventions",
        ],
        us: ["Wording that may follow UK conventions"],
      },
    },
  ]) {
    const body = `: "Work [dc](a) in next stitch."${releasedTail}`;
    for (const keyLength of [
      512,
      513,
      1_024,
      MAX_VINTAGE_PATTERN_TEXT_LENGTH - body.length,
    ]) {
      const key = "A".repeat(keyLength);
      const input = `${key}${body}`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk"
            ? `${key}: "Work [dc](a) in next stitch."${releasedUkTail}`
            : input,
          `${convention}: ${keyLength}: ${releasedTail}`,
        );
        assert.equal(
          result.substitutionCount,
          convention === "uk" ? ukCount : 0,
          `${convention}: ${keyLength}: ${releasedTail}`,
        );
        assert.equal(
          result.substitutions.length,
          convention === "uk" ? ukCount : 0,
          `${convention}: ${keyLength}: ${releasedTail}`,
        );
        assert.deepEqual(
          signalTitles(result),
          signalsByConvention[convention],
          `${convention}: ${keyLength}: ${releasedTail}`,
        );
        assert.equal(
          reconstructInput(result),
          input,
          `${convention}: ${keyLength}: ${releasedTail}`,
        );
      }
    }
  }

  for (const releasedTail of [
    " Work [dc][ref] in next stitch.",
    " Work [dc](https://example.com/a_(b)) in next stitch.",
  ]) {
    const body = `: "Work [dc](a) in next stitch."${releasedTail}`;
    const key = "A".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH - body.length);
    const input = `${key}${body}`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(
        result.output,
        convention === "uk"
          ? `${key}: "Work [dc](a) in next stitch."${releasedTail.replace("dc", "single crochet (sc)")}`
          : input,
        `${convention}: ${releasedTail}`,
      );
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
      assert.deepEqual(
        signalTitles(result),
        convention === "unknown" ? ["Crochet convention not established"] : [],
        `${convention}: ${releasedTail}`,
      );
      assert.equal(reconstructInput(result), input, `${convention}: ${releasedTail}`);
    }
  }

  for (const suffix of ["stitchB", "clusterB", "variantB"]) {
    const body = ': "Work [dc](a) in next stitch." Work tr in next stitch.';
    for (const keyLength of [512, 513, MAX_VINTAGE_PATTERN_TEXT_LENGTH - body.length]) {
      const key = `${"A".repeat(keyLength - suffix.length)}${suffix}`;
      const input = `${key}${body}`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk"
            ? `${key}: "Work [dc](a) in next stitch." Work double crochet (dc) in next stitch.`
            : input,
          `${convention}: ${suffix}: ${keyLength}`,
        );
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
        assert.deepEqual(
          signalTitles(result),
          convention === "unknown" ? ["Crochet convention not established"] : [],
          `${convention}: ${suffix}: ${keyLength}`,
        );
        assert.equal(reconstructInput(result), input, `${convention}: ${suffix}: ${keyLength}`);
      }
    }
  }

  for (const lead of ["dXc", "eXc"]) {
    const key = `${lead}${"dc".repeat(126)}${"A".repeat(258)}`;
    assert.equal(key.length, 513, lead);
    const input = `${key}: "Work [dc](a) in next stitch." Work tr in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(
        result.output,
        convention === "uk"
          ? `${key}: "Work [dc](a) in next stitch." Work double crochet (dc) in next stitch.`
          : input,
        `${convention}: ${lead}`,
      );
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
      assert.deepEqual(
        signalTitles(result),
        convention === "unknown" ? ["Crochet convention not established"] : [],
        `${convention}: ${lead}`,
      );
      assert.equal(reconstructInput(result), input, `${convention}: ${lead}`);
    }
  }

  for (const releasedTail of [
    " Wave stitch: Work dc in next stitch.",
    " Wave stitch - Work dc in next stitch.",
    " Wave stitch — Work dc in next stitch.",
    " Wave stitch is Work dc in next stitch.",
    " Row 1: Work dc in next stitch.",
  ]) {
    for (const keyLength of [512, 513]) {
      const key = "A".repeat(keyLength);
      const input = `${key}: "Work [dc](a) in next stitch."${releasedTail}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(
        result.output,
        `${key}: "Work [dc](a) in next stitch."${releasedTail.replace("dc", "single crochet (sc)")}`,
        `${keyLength}: ${releasedTail}`,
      );
      assert.equal(result.substitutionCount, 1, `${keyLength}: ${releasedTail}`);
      assert.deepEqual(result.signals, [], `${keyLength}: ${releasedTail}`);
      assert.equal(reconstructInput(result), input, `${keyLength}: ${releasedTail}`);
    }
  }

  for (const precedingSentenceCount of [63, 64]) {
    const input = `${"A. ".repeat(precedingSentenceCount)}Work dc in next stitch. Wave stitch: “Work [dc](a) in next stitch. Miss 1 dc.”`;
    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, convention);
      const elapsed = performance.now() - startedAt;
      const expected = convention === "uk" && precedingSentenceCount === 63
        ? `${"A. ".repeat(precedingSentenceCount)}Work single crochet (sc) in next stitch. Wave stitch: “Work [dc](a) in next stitch. Miss 1 dc.”`
        : input;
      assert.equal(result.output, expected, `${convention}: ${precedingSentenceCount}`);
      assert.equal(
        result.substitutionCount,
        convention === "uk" && precedingSentenceCount === 63 ? 1 : 0,
        `${convention}: ${precedingSentenceCount}`,
      );
      assert.deepEqual(
        signalTitles(result),
        convention === "unknown" && precedingSentenceCount === 63
          ? ["Crochet convention not established"]
          : [],
        `${convention}: ${precedingSentenceCount}`,
      );
      assert.equal(reconstructInput(result), input, `${convention}: ${precedingSentenceCount}`);
      assert.ok(
        elapsed < 2_000,
        `${convention}: ${precedingSentenceCount} pre-definition boundaries took ${elapsed.toFixed(1)} ms`,
      );
    }
  }

  const releasedDefinition = 'Label = "Work [dc](a) in next stitch."; Work dc in next stitch.';
  const releasedDefinitionResult = decodeVintagePattern(releasedDefinition, "uk");
  assert.equal(
    releasedDefinitionResult.output,
    'Label = "Work [dc](a) in next stitch."; Work single crochet (sc) in next stitch.',
  );
  assert.equal(releasedDefinitionResult.substitutionCount, 1);
  assert.equal(reconstructInput(releasedDefinitionResult), releasedDefinition);

  for (const label of ["Label", "*Label*", "**Label**", "### Label"]) {
    const precedingCommand = `Work dc in next stitch. ${label} = \"Work [dc](a) in next stitch.\"`;
    const precedingCommandResult = decodeVintagePattern(precedingCommand, "uk");
    assert.equal(
      precedingCommandResult.output,
      `Work single crochet (sc) in next stitch. ${label} = \"Work [dc](a) in next stitch.\"`,
      label,
    );
    assert.equal(precedingCommandResult.substitutionCount, 1, label);
    assert.equal(reconstructInput(precedingCommandResult), precedingCommand, label);
  }

  for (const prefix of [
    "RS: Work dc in next stitch.",
    "WS: Work dc in next stitch.",
    "Setup: Work dc in next stitch.",
    "Rnd. 1: Work dc in next stitch.",
    "R. 1: Work dc in next stitch.",
    "R 1: Work dc in next stitch.",
    "Note. Work dc in next stitch.",
    "Metadata. Work dc in next stitch.",
    "Note! Work htr in next stitch.",
    "Note? Miss 1 dc.",
    "Miss 1 stitch.",
    "RS: Work straight for 2 rows.",
    "*Work dc in next stitch.*",
    "**Work htr in next stitch.**",
    "### Work dc in next stitch.",
    "Work [dc](a) in next stitch.",
    "Work [dc][ref] in next stitch.",
    "> 1. ### Body: Work dc in next stitch.",
    "Needles No. 4.",
    "Hooks no. 7.",
    "Needles No.\u00a04.",
    "Note. Needles No. 4.",
  ]) {
    const definition = `${prefix} Label = \"Work [dc](a) in next stitch.\"`;
    const standalone = decodeVintagePattern(prefix, "uk");
    const result = decodeVintagePattern(definition, "uk");
    assert.equal(
      result.output,
      `${standalone.output} Label = \"Work [dc](a) in next stitch.\"`,
      prefix,
    );
    assert.equal(result.substitutionCount, standalone.substitutionCount, prefix);
    assert.deepEqual(result.signals, standalone.signals, prefix);
    assert.equal(reconstructInput(result), definition, prefix);
  }

  for (const convention of ["uk", "unknown", "us"]) {
    const prefix = "Needles No. 4.";
    const definition = `${prefix} Label = "Work [dc](a) in next stitch."`;
    const standalone = decodeVintagePattern(prefix, convention);
    const result = decodeVintagePattern(definition, convention);
    assert.equal(result.output, definition, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, standalone.signals, convention);
    assert.equal(reconstructInput(result), definition, convention);
  }

  const emphasizedDefinition = 'Label = **"Work [dc](a) in next stitch."** Work tr in next stitch. Miss 1 dc.';
  const emphasizedDefinitionResult = decodeVintagePattern(emphasizedDefinition, "uk");
  assert.equal(emphasizedDefinitionResult.output, emphasizedDefinition);
  assert.equal(emphasizedDefinitionResult.substitutionCount, 0);
  assert.deepEqual(emphasizedDefinitionResult.signals, []);
  assert.equal(reconstructInput(emphasizedDefinitionResult), emphasizedDefinition);
});

test("one terminal EOL cannot change two-line reference decisions", () => {
  const cases = [
    {
      instruction: "Work [dc][Work htr .; \"dc tr\"] and htr in first tr.",
      expectedInstruction: "Work [single crochet (sc)][Work htr .; \"dc tr\"] and half double crochet (hdc) in first double crochet (dc).",
      definition: "[ref]: /url",
      count: 3,
    },
    {
      instruction: "Work [dc][ref] and htr in next stitch.",
      expectedInstruction: "Work [single crochet (sc)][ref] and half double crochet (hdc) in next stitch.",
      definition: "[ref]: /url",
      count: 2,
    },
    {
      instruction: "Work [dc][] and tr in next stitch.",
      expectedInstruction: "Work [dc][] and tr in next stitch.",
      definition: "[dc]: /url",
      count: 0,
    },
    {
      instruction: "Work [dc][] and tr in next stitch.",
      expectedInstruction: "Work [single crochet (sc)][] and double crochet (dc) in next stitch.",
      definition: "[ref]: /url",
      count: 2,
    },
    {
      instruction: "Work [dc]. Work htr in next stitch.",
      expectedInstruction: "Work [dc]. Work half double crochet (hdc) in next stitch.",
      definition: "[dc]: /url",
      count: 1,
    },
  ];
  for (const separator of ["\n", "\r\n"]) {
    for (const terminalEol of ["\n", "\r\n"]) {
      for (const definitionFirst of [false, true]) {
        for (const { instruction, expectedInstruction, definition, count } of cases) {
          const input = definitionFirst
            ? `${definition}${separator}${instruction}${terminalEol}`
            : `${instruction}${separator}${definition}${terminalEol}`;
          const expected = definitionFirst
            ? `${definition}${separator}${expectedInstruction}${terminalEol}`
            : `${expectedInstruction}${separator}${definition}${terminalEol}`;
          const result = decodeVintagePattern(input, "uk");
          assert.equal(result.output, expected, JSON.stringify(input));
          assert.equal(result.substitutionCount, count, JSON.stringify(input));
        }
      }
    }
  }
});

test("valid maximum reference labels do not inherit a whole-document 4096 cliff", () => {
  const label = "😀".repeat(999);
  const instruction = `Work [dc][${label}] and htr in first tr.`;
  const expectedInstruction = `Work [single crochet (sc)][${label}] and half double crochet (hdc) in first double crochet (dc).`;
  const reconstructInput = (result) => result.segments.map((segment) => (
    segment.type === "sub" ? segment.original : segment.content
  )).join("");
  const totalLengthBase = `${instruction}\n[${label}]: /`.length;
  const payloadLengths = new Set([
    4_095 - totalLengthBase,
    4_096 - totalLengthBase,
    4_097 - totalLengthBase,
    64,
    2_048,
  ]);
  for (const payloadLength of payloadLengths) {
    assert.ok(payloadLength >= 0);
    const definition = `[${label}]: /${"a".repeat(payloadLength)}`;
    for (const separator of ["\n", "\r\n"]) {
      for (const terminalEol of ["", separator]) {
        for (const definitionFirst of [false, true]) {
          const input = definitionFirst
            ? `${definition}${separator}${instruction}${terminalEol}`
            : `${instruction}${separator}${definition}${terminalEol}`;
          const expected = definitionFirst
            ? `${definition}${separator}${expectedInstruction}${terminalEol}`
            : `${expectedInstruction}${separator}${definition}${terminalEol}`;
          const startedAt = performance.now();
          const result = decodeVintagePattern(input, "uk");
          assert.equal(
            result.output,
            expected,
            JSON.stringify({ payloadLength, separator, terminalEol, definitionFirst }),
          );
          assert.equal(result.substitutionCount, 3);
          const elapsed = performance.now() - startedAt;
          assert.ok(
            elapsed < 2_000,
            `${JSON.stringify({ payloadLength, separator, terminalEol, definitionFirst })} took ${elapsed.toFixed(1)} ms`,
          );
        }
      }
    }
  }

  for (const boundaryLabel of ["a".repeat(999), "😀".repeat(999)]) {
    const boundaryInstruction = `Work [dc][${boundaryLabel}] and htr in first tr.`;
    const boundaryExpectedInstruction = `Work [single crochet (sc)][${boundaryLabel}] and half double crochet (hdc) in first double crochet (dc).`;
    const definitionPrefix = `[${boundaryLabel}]: /`;

    for (const definitionLineLength of [4_096, 4_097]) {
      const payloadLength = definitionLineLength - definitionPrefix.length;
      assert.ok(payloadLength > 0);
      const definition = `${definitionPrefix}${"a".repeat(payloadLength)}`;
      assert.equal(definition.length, definitionLineLength);
      for (const separator of ["\n", "\r\n"]) {
        for (const definitionFirst of [false, true]) {
          const input = definitionFirst
            ? `${definition}${separator}${boundaryInstruction}`
            : `${boundaryInstruction}${separator}${definition}`;
          const expected = definitionFirst
            ? `${definition}${separator}${boundaryExpectedInstruction}`
            : `${boundaryExpectedInstruction}${separator}${definition}`;
          const result = decodeVintagePattern(input, "uk");
          assert.equal(
            result.output,
            expected,
            JSON.stringify({ definitionLineLength, separator, definitionFirst }),
          );
          assert.equal(result.substitutionCount, 3);
          assert.equal(reconstructInput(result), input);
        }
      }
    }

    for (const separator of ["\n", "\r\n"]) {
      for (const terminalEol of ["", separator]) {
        for (const definitionFirst of [false, true]) {
          const payloadLength = MAX_VINTAGE_PATTERN_TEXT_LENGTH
            - boundaryInstruction.length
            - separator.length
            - definitionPrefix.length
            - terminalEol.length;
          assert.ok(payloadLength > 0);
          const definition = `${definitionPrefix}${"a".repeat(payloadLength)}`;
          const input = definitionFirst
            ? `${definition}${separator}${boundaryInstruction}${terminalEol}`
            : `${boundaryInstruction}${separator}${definition}${terminalEol}`;
          const expected = definitionFirst
            ? `${definition}${separator}${boundaryExpectedInstruction}${terminalEol}`
            : `${boundaryExpectedInstruction}${separator}${definition}${terminalEol}`;
          assert.equal(input.length, MAX_VINTAGE_PATTERN_TEXT_LENGTH);

          const startedAt = performance.now();
          const result = decodeVintagePattern(input, "uk");
          assert.equal(
            result.output,
            expected,
            JSON.stringify({ separator, terminalEol, definitionFirst }),
          );
          assert.equal(result.substitutionCount, 3);
          assert.equal(reconstructInput(result), input);
          assert.ok(
            performance.now() - startedAt < 2_000,
            JSON.stringify({ separator, terminalEol, definitionFirst }),
          );

          for (const convention of ["unknown", "us"]) {
            const preserved = decodeVintagePattern(input, convention);
            assert.equal(preserved.output, input, convention);
            assert.equal(preserved.substitutionCount, 0, convention);
            assert.equal(reconstructInput(preserved), input, convention);
          }
        }
      }
    }
  }
});

test("plain and structurally marked explicit-reference Work commands stay on the bounded fast path", () => {
  for (const marker of [
    "",
    "> * ",
    "> ",
    ">> ",
    "> > ",
    "* ",
    "- ",
    "+ ",
    "• ",
    "· ",
    "▪ ",
    "◦ ",
    "‣ ",
    ">> - ",
    ">\u00a0*\u00a0",
    ">\u2003",
    "•\u2009",
    "1. ",
    "1) ",
    "(1) ",
    "> 1. ",
  ]) {
    for (const [command, expectedCommand, count] of [
      [
        "Work [dc][ref] and htr in next stitch.",
        "Work [single crochet (sc)][ref] and half double crochet (hdc) in next stitch.",
        2,
      ],
      [
        "Work [dc][ref] and htr in first tr.",
        "Work [single crochet (sc)][ref] and half double crochet (hdc) in first double crochet (dc).",
        3,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space.",
        2,
      ],
      [
        "Work [htr][ref] and dc into the chain — 3 spaces.",
        "Work [half double crochet (hdc)][ref] and single crochet (sc) into the chain — 3 spaces.",
        2,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space, then turn.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space, then turn.",
        2,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space, ch 1.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space, ch 1.",
        2,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space, ch 1, turn.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space, ch 1, turn.",
        2,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space and turn.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space and turn.",
        2,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space and then turn.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space and then turn.",
        2,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space; Work htr in next stitch.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space; Work half double crochet (hdc) in next stitch.",
        3,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space. Work htr in next stitch.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space. Work half double crochet (hdc) in next stitch.",
        3,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space! Work htr in next stitch.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space! Work half double crochet (hdc) in next stitch.",
        3,
      ],
      [
        "Work [tr][ref] and dtr in ch-1 space? Work htr in next stitch.",
        "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space? Work half double crochet (hdc) in next stitch.",
        3,
      ],
    ]) {
      for (const separator of ["\n", "\r\n"]) {
        for (const terminalEol of ["", separator]) {
          for (const definitionFirst of [false, true]) {
            const instruction = `${marker}${command}`;
            const expectedInstruction = `${marker}${expectedCommand}`;
            const definition = "[ref]: /url";
            const input = definitionFirst
              ? `${definition}${separator}${instruction}${terminalEol}`
              : `${instruction}${separator}${definition}${terminalEol}`;
            const expected = definitionFirst
              ? `${definition}${separator}${expectedInstruction}${terminalEol}`
              : `${expectedInstruction}${separator}${definition}${terminalEol}`;
            const startedAt = performance.now();
            const result = decodeVintagePattern(input, "uk");
            assert.equal(result.output, expected, JSON.stringify(input));
            assert.equal(result.substitutionCount, count, JSON.stringify(input));
            const elapsed = performance.now() - startedAt;
            assert.ok(elapsed < 2_000, `marked reference command took ${elapsed.toFixed(1)} ms`);
          }
        }
      }
    }
  }

  for (const [instruction, expectedInstruction] of [
    [
      "> * Work\u00a0[tr][ref] and dtr in ch-1 space.",
      "> * Work\u00a0[double crochet (dc)][ref] and treble crochet (tr) in ch-1 space.",
    ],
    [
      "> * Work [tr][ref] and\u00a0dtr in ch-1 space.",
      "> * Work [double crochet (dc)][ref] and\u00a0treble crochet (tr) in ch-1 space.",
    ],
    [
      "> * Work [tr][ref] and dtr in\u00a0ch-1\u00a0space.",
      "> * Work [double crochet (dc)][ref] and treble crochet (tr) in\u00a0ch-1\u00a0space.",
    ],
  ]) {
    const input = `${instruction}\n[ref]: /url`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${expectedInstruction}\n[ref]: /url`, input);
    assert.equal(result.substitutionCount, 2, input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `Unicode-space reference command took ${elapsed.toFixed(1)} ms`);
  }

  for (const neighborCount of [8, 19]) {
    const first = "Work [tr][ref] and dtr in ch-1 space.";
    const firstExpected = "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space.";
    const neighbor = "Work htr in next stitch.";
    const neighborExpected = "Work half double crochet (hdc) in next stitch.";
    const instruction = [first, ...Array(neighborCount).fill(neighbor)].join(" ");
    const expectedInstruction = [
      firstExpected,
      ...Array(neighborCount).fill(neighborExpected),
    ].join(" ");
    const input = `${instruction}\n[ref]: /url`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${expectedInstruction}\n[ref]: /url`, input);
    assert.equal(result.substitutionCount, neighborCount + 2, input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `${neighborCount + 1} neighboring Work clauses took ${elapsed.toFixed(1)} ms`);
  }

  const mixedSeparators = [". ", "! ", "? ", "; "];
  let oneOverFormerFastPath = `Work [tr][ref] and dtr in ch-1 space${mixedSeparators[0]}`;
  let oneOverFormerFastPathExpected = `Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space${mixedSeparators[0]}`;
  for (let index = 1; index < 20; index += 1) {
    oneOverFormerFastPath += "Work htr in next stitch";
    oneOverFormerFastPathExpected += "Work half double crochet (hdc) in next stitch";
    const separator = index === 19 ? "." : mixedSeparators[index % mixedSeparators.length];
    oneOverFormerFastPath += separator;
    oneOverFormerFastPathExpected += separator;
  }
  oneOverFormerFastPath += " ";
  oneOverFormerFastPathExpected += " ";
  assert.equal(oneOverFormerFastPath.length, 513);
  for (const marker of ["", "> * "]) {
    const input = `${marker}${oneOverFormerFastPath}\n[ref]: /url`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${marker}${oneOverFormerFastPathExpected}\n[ref]: /url`, input);
    assert.equal(result.substitutionCount, 21, input);
    const elapsed = performance.now() - startedAt;
    assert.ok(elapsed < 2_000, `513-character neighboring Work line took ${elapsed.toFixed(1)} ms`);
  }

  for (const [instruction, expectedInstruction, count] of [
    [
      "Work [dc][ref] and htr in first tr. Work dtr in next stitch;",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) in first double crochet (dc). Work treble crochet (tr) in next stitch;",
      4,
    ],
    [
      "Work [dc][ref] and htr in first tr. Work dtr in next stitch; ",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) in first double crochet (dc). Work treble crochet (tr) in next stitch; ",
      4,
    ],
    [
      "Work [dc][ref] and htr in first tr;",
      "Work [single crochet (sc)][ref] and half double crochet (hdc) in first double crochet (dc);",
      3,
    ],
  ]) {
    for (const marker of ["", "> * "]) {
      const input = `${marker}${instruction}\n[ref]: /url`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, `${marker}${expectedInstruction}\n[ref]: /url`, input);
      assert.equal(result.substitutionCount, count, input);
      const elapsed = performance.now() - startedAt;
      assert.ok(elapsed < 2_000, `terminal-semicolon Work line took ${elapsed.toFixed(1)} ms`);
    }
  }

  for (const separatorSpace of ["\u00a0", "\u2003", "\u2009", "\u202f", "\u3000"]) {
    for (const terminal of [".", "!", "?", ";"]) {
      const input = `Work dc in next stitch${terminal}${separatorSpace}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, `Work single crochet (sc) in next stitch${terminal}${separatorSpace}`, input);
      assert.equal(result.substitutionCount, 1, input);
      const elapsed = performance.now() - startedAt;
      assert.ok(elapsed < 2_000, `Unicode trailing-space Work line took ${elapsed.toFixed(1)} ms`);
    }

    const neighboringInput = `Work dc in next stitch. Work htr in next stitch;${separatorSpace}`;
    const neighboringStartedAt = performance.now();
    const neighboringResult = decodeVintagePattern(neighboringInput, "uk");
    assert.equal(
      neighboringResult.output,
      `Work single crochet (sc) in next stitch. Work half double crochet (hdc) in next stitch;${separatorSpace}`,
      neighboringInput,
    );
    assert.equal(neighboringResult.substitutionCount, 2, neighboringInput);
    assert.ok(
      performance.now() - neighboringStartedAt < 2_000,
      "Unicode trailing-space neighboring Work line should remain bounded",
    );
  }

  for (const separator of ["\n", "\r\n"]) {
    for (const definitionFirst of [false, true]) {
      const instruction = "Row 1: Work [dc][ref] and htr in first tr;";
      const expectedInstruction = "Row 1: Work [single crochet (sc)][ref] and half double crochet (hdc) in first double crochet (dc);";
      const definition = "[ref]: /url";
      const input = definitionFirst
        ? `${definition}${separator}${instruction}`
        : `${instruction}${separator}${definition}`;
      const expected = definitionFirst
        ? `${definition}${separator}${expectedInstruction}`
        : `${expectedInstruction}${separator}${definition}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, input);
      assert.equal(result.substitutionCount, 3, input);
      const elapsed = performance.now() - startedAt;
      assert.ok(elapsed < 2_000, `heading terminal-semicolon Work line took ${elapsed.toFixed(1)} ms`);
    }
  }

  for (const heading of ["Row 1: ", "Body: ", ""]) {
    for (const punctuation of [".", "!", "?"]) {
      const denied = `${heading}Work dc and tr theory${punctuation};`;
      const valid = "Work htr in next stitch.";
      const input = `${denied} ${valid}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(
        result.output,
        `${denied} Work half double crochet (hdc) in next stitch.`,
        input,
      );
      assert.equal(result.substitutionCount, 1, input);
      assert.ok(
        performance.now() - startedAt < 2_000,
        "malformed punctuation-semicolon boundary should remain bounded",
      );
    }

    const cleanDenied = `${heading}Work dc and tr theory;`;
    const cleanValid = "Work htr in next stitch.";
    const cleanInput = `${cleanDenied} ${cleanValid}`;
    const cleanStartedAt = performance.now();
    const cleanResult = decodeVintagePattern(cleanInput, "uk");
    assert.equal(
      cleanResult.output,
      `${cleanDenied} Work half double crochet (hdc) in next stitch.`,
      cleanInput,
    );
    assert.equal(cleanResult.substitutionCount, 1, cleanInput);
    assert.ok(
      performance.now() - cleanStartedAt < 2_000,
      "arbitrary-tail neighbor should remain locally denied and bounded",
    );
  }

  for (const heading of ["Glossary: ", "Abbreviations: ", "Definitions: ", "Keys: "]) {
    const input = `${heading}Work dc in next stitch. Work htr in next stitch.`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
    assert.ok(
      performance.now() - startedAt < 2_000,
      "definition-heading Work prose should fail closed on the bounded path",
    );
  }

  const contaminatedNeighbor = "Work dc in first dc, widget, then tr in second dc.";
  const validContaminationNeighbor = "Work dc in next stitch.";
  const mappedContaminationNeighbor = "Work single crochet (sc) in next stitch.";
  for (const [input, expected] of [
    [
      `${contaminatedNeighbor} ${validContaminationNeighbor}`,
      `${contaminatedNeighbor} ${mappedContaminationNeighbor}`,
    ],
    [
      `${validContaminationNeighbor} ${contaminatedNeighbor}`,
      `${mappedContaminationNeighbor} ${contaminatedNeighbor}`,
    ],
  ]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
    assert.ok(
      performance.now() - startedAt < 2_000,
      "contaminated Work neighbor should remain locally denied and bounded",
    );
  }

  const boundaryFirst = "Work [tr][ref] and dtr in ch-1 space.";
  const boundaryFirstExpected = "Work [double crochet (dc)][ref] and treble crochet (tr) in ch-1 space.";
  const boundaryNeighbor = "Work htr in next stitch.";
  const boundaryNeighborExpected = "Work half double crochet (hdc) in next stitch.";
  const sixtyFourCommands = [boundaryFirst, ...Array(63).fill(boundaryNeighbor)].join(" ");
  const sixtyFourExpected = [
    boundaryFirstExpected,
    ...Array(63).fill(boundaryNeighborExpected),
  ].join(" ");
  const sixtyFourInput = `${sixtyFourCommands}\n[ref]: /url`;
  const sixtyFourStartedAt = performance.now();
  const sixtyFourResult = decodeVintagePattern(sixtyFourInput, "uk");
  assert.equal(sixtyFourResult.output, `${sixtyFourExpected}\n[ref]: /url`);
  assert.equal(sixtyFourResult.substitutionCount, 65);
  assert.ok(
    performance.now() - sixtyFourStartedAt < 2_000,
    "64 neighboring Work commands should remain on the bounded fast path",
  );

  const sixtyFiveCommands = [boundaryFirst, ...Array(64).fill(boundaryNeighbor)].join(" ");
  const sixtyFiveInput = `${sixtyFiveCommands}\n[ref]: /url`;
  const sixtyFiveResult = decodeVintagePattern(sixtyFiveInput, "uk");
  assert.equal(sixtyFiveResult.output, sixtyFiveInput);
  assert.equal(sixtyFiveResult.substitutionCount, 0);

  for (const [instruction, expectedInstruction, count] of [
    [
      "1000000000. Work [dc][ref] and htr in next stitch.",
      "1000000000. Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "> 1000000000. Work [dc][ref] and htr in next stitch.",
      "> 1000000000. Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "1000000000.Work [dc][ref] and htr in next stitch.",
      "1000000000.Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "> 1000000000.Work [dc][ref] and htr in next stitch.",
      "> 1000000000.Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      ">1000000000.Work [dc][ref] and htr in next stitch.",
      ">1000000000.Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "1000000000)Work [dc][ref] and htr in next stitch.",
      "1000000000)Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "(1000000000)Work [dc][ref] and htr in next stitch.",
      "(1000000000)Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      ">* Work [dc][ref] and htr in next stitch.",
      ">* Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      ">Work [dc][ref] and htr in next stitch.",
      ">Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      ">>*Work [dc][ref] and htr in next stitch.",
      ">>*Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "> *Work [dc][ref] and htr in next stitch.",
      "> *Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "> >Work [dc][ref] and htr in next stitch.",
      "> >Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "*Work [dc][ref] and htr in next stitch.",
      "*Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "1)Work [dc][ref] and htr in next stitch.",
      "1)Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "(1)Work [dc][ref] and htr in next stitch.",
      "(1)Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "> 1)Work [dc][ref] and htr in next stitch.",
      "> 1)Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "> (1)Work [dc][ref] and htr in next stitch.",
      "> (1)Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      ">1. Work [dc][ref] and htr in next stitch.",
      ">1. Work [single crochet (sc)][ref] and half double crochet (hdc) in next stitch.",
      2,
    ],
    [
      "1.Work [dc][ref] and htr in next stitch.",
      "1.Work [single crochet (sc)][ref] and half double crochet (hdc) in next stitch.",
      2,
    ],
    [
      "> 1.Work [dc][ref] and htr in next stitch.",
      "> 1.Work [single crochet (sc)][ref] and half double crochet (hdc) in next stitch.",
      2,
    ],
    [
      "# Work [dc][ref] and htr in next stitch.",
      "# Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "> # Work [dc][ref] and htr in next stitch.",
      "> # Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      ">#Work [dc][ref] and htr in next stitch.",
      ">#Work [dc][ref] and htr in next stitch.",
      0,
    ],
    [
      "1. Work [double crochet][ref] and htr alone.",
      "1. Work [single crochet (sc)][ref] and half double crochet (hdc) alone.",
      2,
    ],
    [
      "1. Work [dc][ref] and htr in first tr, widget.",
      "1. Work [dc][ref] and htr in first tr, widget.",
      0,
    ],
    [
      "1. Work [dc][ref] and htr theory.",
      "1. Work [dc][ref] and htr theory.",
      0,
    ],
  ]) {
    const input = `${instruction}\n[ref]: /url`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${expectedInstruction}\n[ref]: /url`, input);
    assert.equal(result.substitutionCount, count, input);
  }

  for (const marker of [
    "1000000000.",
    "1000000000)",
    "(1000000000)",
    "> 1000000000.",
    "> 1000000000)",
    "> (1000000000)",
    ">1000000000.",
    ">1000000000)",
  ]) {
    for (const separator of ["\n", "\r\n"]) {
      for (const definitionFirst of [false, true]) {
        const instruction = `${marker}Work [dc][ref] and htr in next stitch.`;
        const definition = "[ref]: /url";
        const input = definitionFirst
          ? `${definition}${separator}${instruction}`
          : `${instruction}${separator}${definition}`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, input, input);
        assert.equal(result.substitutionCount, 0, input);
        const elapsed = performance.now() - startedAt;
        assert.ok(elapsed < 2_000, `overlong attached marker took ${elapsed.toFixed(1)} ms`);
      }
    }
  }

  const validNeighbor = "Work htr in next stitch.";
  const mappedNeighbor = "Work half double crochet (hdc) in next stitch.";
  for (const deniedAttached of [
    "1000000000.Work [dc][ref] and htr in next stitch.",
    "1000000000)Work [dc][ref] and htr in next stitch.",
    "(1000000000)Work [dc][ref] and htr in next stitch.",
  ]) {
    for (const [instruction, expectedInstruction] of [
      [`${deniedAttached} ${validNeighbor}`, `${deniedAttached} ${mappedNeighbor}`],
      [`${validNeighbor} ${deniedAttached}`, `${mappedNeighbor} ${deniedAttached}`],
    ]) {
      const input = `${instruction}\n[ref]: /url`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, `${expectedInstruction}\n[ref]: /url`, input);
      assert.equal(result.substitutionCount, 1, input);
      const elapsed = performance.now() - startedAt;
      assert.ok(elapsed < 2_000, `neighboring overlong attached marker took ${elapsed.toFixed(1)} ms`);
    }
  }
});

test("instruction headings reject arbitrary tails at every segment boundary", () => {
  for (const heading of ["Body: ", "Row 1: ", "> 1. Body: "]) {
    for (const suffix of ["", "\n", ";"]) {
      const input = `${heading}Work dc theory${suffix}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, JSON.stringify(input));
      assert.equal(result.substitutionCount, 0, JSON.stringify(input));
    }

    const neighboring = `${heading}Work dc theory; Work htr in next stitch.`;
    const neighboringResult = decodeVintagePattern(neighboring, "uk");
    assert.equal(
      neighboringResult.output,
      `${heading}Work dc theory; Work half double crochet (hdc) in next stitch.`,
      neighboring,
    );
    assert.equal(neighboringResult.substitutionCount, 1, neighboring);

    for (const input of [
      `${heading}Work dc theory, then Work htr in next stitch.`,
      `${heading}Work htr in next stitch, then Work dc theory.`,
      `${heading}Work dc in first dc, widget, then Work htr in next stitch.`,
      `${heading}Work htr in next stitch, then Work dc in first dc, widget.`,
    ]) {
      const result = decodeVintagePattern(input, "uk");
      const expected = input.replace("htr", "half double crochet (hdc)");
      assert.equal(result.output, expected, input);
      assert.equal(result.substitutionCount, 1, input);
    }

    const repetition = `${heading}Work dc twice;`;
    const repetitionResult = decodeVintagePattern(repetition, "uk");
    assert.equal(
      repetitionResult.output,
      `${heading}Work single crochet (sc) twice;`,
      repetition,
    );
    assert.equal(repetitionResult.substitutionCount, 1, repetition);
  }
});

test("nested construction headings remain bounded instruction sections", () => {
  const headings = [
    "Body",
    "Sleeve",
    "Chart",
    "Motif A",
    "Crown",
    "Ribbing",
    "Shape armholes",
  ];
  for (const marker of ["> - ", "> 1. ", "> > ", ">> ", "> > - ", "> - ### "]) {
    for (const heading of headings) {
      const input = `${marker}${heading}: Work double crochet in next stitch.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(
        result.output,
        `${marker}${heading}: Work single crochet (sc) in next stitch.`,
        input,
      );
      assert.equal(result.substitutionCount, 1, input);

      const prose = `${marker}${heading}: Work journal mentions first double crochet.`;
      const proseResult = decodeVintagePattern(prose, "uk");
      assert.equal(proseResult.output, prose, prose);
      assert.equal(proseResult.substitutionCount, 0, prose);
    }
  }
});

test("nested structural prefixes have an atomic three-prefix ceiling", () => {
  const instruction = "Work htr in next stitch.";
  const mappedInstruction = "Work half double crochet (hdc) in next stitch.";
  for (const [prefixCount, accepted] of [[3, true], [4, false], [64, false], [3_000, false]]) {
    const prefix = "Body: ".repeat(prefixCount);
    const input = `${prefix}${instruction}`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    const expected = accepted ? `${prefix}${mappedInstruction}` : input;
    assert.equal(result.output, expected, `${prefixCount} prefixes`);
    assert.equal(result.substitutionCount, accepted ? 1 : 0, `${prefixCount} prefixes`);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected);
    assert.deepEqual(result.signals, []);
    assert.ok(
      performance.now() - startedAt < 2_000,
      `${prefixCount} structural prefixes should stay bounded`,
    );
  }

  const overflowInstruction = `${"Body: ".repeat(4)}${instruction}`;
  const validNeighbor = "Work tr in next stitch.";
  const mappedNeighbor = "Work double crochet (dc) in next stitch.";
  for (const overflowFirst of [true, false]) {
    const input = overflowFirst
      ? `${overflowInstruction} ${validNeighbor}`
      : `${validNeighbor} ${overflowInstruction}`;
    const expected = overflowFirst
      ? `${overflowInstruction} ${mappedNeighbor}`
      : `${mappedNeighbor} ${overflowInstruction}`;
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    const elapsed = performance.now() - startedAt;
    assert.equal(result.output, expected, `same-line:${overflowFirst}`);
    assert.equal(result.substitutionCount, 1, `same-line:${overflowFirst}`);
    assert.equal(result.segments.map(({ content }) => content).join(""), expected);
    assert.deepEqual(result.signals, []);
    assert.ok(elapsed < 2_000, `same-line:${overflowFirst} should stay bounded`);
  }
  const markedNeighborInput = `${overflowInstruction}\t> - ${validNeighbor}`;
  const markedNeighborExpected = `${overflowInstruction}\t> - ${mappedNeighbor}`;
  const markedNeighborStartedAt = performance.now();
  const markedNeighborResult = decodeVintagePattern(markedNeighborInput, "uk");
  const markedNeighborElapsed = performance.now() - markedNeighborStartedAt;
  assert.equal(markedNeighborResult.output, markedNeighborExpected);
  assert.equal(markedNeighborResult.substitutionCount, 1);
  assert.equal(
    markedNeighborResult.segments.map(({ content }) => content).join(""),
    markedNeighborExpected,
  );
  assert.deepEqual(markedNeighborResult.signals, []);
  assert.ok(
    markedNeighborElapsed < 2_000,
    `tab-prefixed marked neighbor took ${markedNeighborElapsed.toFixed(1)} ms`,
  );
  for (const [openQuote, closeQuote] of [["\"", "\""], ["“", "”"], ["‘", "’"]]) {
    const quotedOverflow = `${openQuote}Note. ${overflowInstruction}${closeQuote}`;
    for (const quotedFirst of [true, false]) {
      const input = quotedFirst
        ? `${quotedOverflow} ${validNeighbor}`
        : `${validNeighbor} ${quotedOverflow}`;
      const expected = quotedFirst
        ? `${quotedOverflow} ${mappedNeighbor}`
        : `${mappedNeighbor} ${quotedOverflow}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, `${openQuote}:${quotedFirst}`);
      assert.equal(result.substitutionCount, 1, `${openQuote}:${quotedFirst}`);
      assert.equal(result.segments.map(({ content }) => content).join(""), expected);
      assert.deepEqual(result.signals, []);
    }
  }
  for (const slashCount of [1, 2, 3, 4]) {
    const slashes = "\\".repeat(slashCount);
    const escapedQuotedOverflow = `"Note. ${slashes}"Aside.${slashes}" ${overflowInstruction}"`;
    for (const quotedFirst of [true, false]) {
      const input = quotedFirst
        ? `${escapedQuotedOverflow} ${validNeighbor}`
        : `${validNeighbor} ${escapedQuotedOverflow}`;
      const expected = quotedFirst
        ? `${escapedQuotedOverflow} ${mappedNeighbor}`
        : `${mappedNeighbor} ${escapedQuotedOverflow}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      const elapsed = performance.now() - startedAt;
      const label = `escaped:${slashCount}:${quotedFirst}`;
      assert.equal(result.output, expected, label);
      assert.equal(result.substitutionCount, 1, label);
      assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
      assert.deepEqual(result.signals, [], label);
      assert.ok(elapsed < 2_000, `${label} took ${elapsed.toFixed(1)} ms`);
    }
  }
  const nestedQuotedOverflow = `"Note. \u2018${overflowInstruction}\u2019"`;
  for (const spacing of [" ", "\t", "\u00a0", "\u1680", "\u2003", "\u202f", "\u3000"]) {
    for (const quotedFirst of [true, false]) {
      const input = quotedFirst
        ? `${nestedQuotedOverflow}${spacing}${validNeighbor}`
        : `${validNeighbor}${spacing}${nestedQuotedOverflow}`;
      const expected = quotedFirst
        ? `${nestedQuotedOverflow}${spacing}${mappedNeighbor}`
        : `${mappedNeighbor}${spacing}${nestedQuotedOverflow}`;
      const result = decodeVintagePattern(input, "uk");
      const label = `nested:${spacing.codePointAt(0).toString(16)}:${quotedFirst}`;
      assert.equal(result.output, expected, label);
      assert.equal(result.substitutionCount, 1, label);
      assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
      assert.deepEqual(result.signals, [], label);
    }
  }
  for (const headingPrefix of ["Rnd. 2: ", "R. 2: "]) {
    const punctuatedOverflow = `${headingPrefix.repeat(4)}${instruction}`;
    for (const overflowFirst of [true, false]) {
      const input = overflowFirst
        ? `${punctuatedOverflow} ${validNeighbor}`
        : `${validNeighbor} ${punctuatedOverflow}`;
      const expected = overflowFirst
        ? `${punctuatedOverflow} ${mappedNeighbor}`
        : `${mappedNeighbor} ${punctuatedOverflow}`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      const elapsed = performance.now() - startedAt;
      assert.equal(result.output, expected, `${headingPrefix}:${overflowFirst}`);
      assert.equal(result.substitutionCount, 1, `${headingPrefix}:${overflowFirst}`);
      assert.ok(elapsed < 2_000, `${headingPrefix}:${overflowFirst} should stay bounded`);
    }
  }
  const overflowStem = `${"Body: ".repeat(4)}Work htr in next stitch`;
  const validNeighborStem = "Work tr in next stitch";
  const mappedNeighborStem = "Work double crochet (dc) in next stitch";
  for (const delimiter of [".", "!", "?", ";"]) {
    for (const spacing of ["\u00a0", "\u1680", "\u2003", "\u202f", "\u3000"]) {
      for (const overflowFirst of [true, false]) {
        const input = overflowFirst
          ? `${overflowStem}${delimiter}${spacing}${validNeighbor}.`
          : `${validNeighborStem}${delimiter}${spacing}${overflowInstruction}`;
        const expected = overflowFirst
          ? `${overflowStem}${delimiter}${spacing}${mappedNeighbor}.`
          : `${mappedNeighborStem}${delimiter}${spacing}${overflowInstruction}`;
        const result = decodeVintagePattern(input, "uk");
        const label = `${delimiter}:${spacing.codePointAt(0).toString(16)}:${overflowFirst}`;
        assert.equal(result.output, expected, label);
        assert.equal(result.substitutionCount, 1, label);
        assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
        assert.deepEqual(result.signals, [], label);
      }
    }
  }
  const semicolonNeighborForms = [
    [
      "> - Work tr in next stitch",
      "> - Work double crochet (dc) in next stitch",
    ],
    [
      "Work [tr](https://example.com) in next stitch",
      "Work [double crochet (dc)](https://example.com) in next stitch",
    ],
    [
      "Work [tr][ref] in next stitch",
      "Work [double crochet (dc)][ref] in next stitch",
    ],
  ];
  const semicolonBoundaries = [
    ...[" ", "\t", "\u00a0", "\u1680", "\u2003", "\u202f", "\u3000"]
      .map((spacing) => [";", spacing]),
    ...[".;", "!?;", ";;", "; ;"]
      .flatMap((delimiter) => [[delimiter, "\t"], [delimiter, "\u00a0"]]),
  ];
  for (const [delimiter, spacing] of semicolonBoundaries) {
    for (const [neighborStem, mappedStem] of semicolonNeighborForms) {
      for (const overflowFirst of [true, false]) {
        const input = overflowFirst
          ? `${overflowStem}${delimiter}${spacing}${neighborStem}.`
          : `${neighborStem}${delimiter}${spacing}${overflowInstruction}`;
        const expected = overflowFirst
          ? `${overflowStem}${delimiter}${spacing}${mappedStem}.`
          : `${mappedStem}${delimiter}${spacing}${overflowInstruction}`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        const elapsed = performance.now() - startedAt;
        const label = `${delimiter}:${spacing.codePointAt(0).toString(16)}:${neighborStem}:${overflowFirst}`;
        assert.equal(result.output, expected, label);
        assert.equal(result.substitutionCount, 1, label);
        assert.equal(result.segments.map(({ content }) => content).join(""), expected, label);
        assert.deepEqual(result.signals, [], label);
        assert.ok(elapsed < 2_000, `${label} took ${elapsed.toFixed(1)} ms`);
      }
    }
  }
  for (const eol of ["\n", "\r\n"]) {
    for (const overflowFirst of [true, false]) {
      const input = overflowFirst
        ? `${overflowInstruction}${eol}${validNeighbor}`
        : `${validNeighbor}${eol}${overflowInstruction}`;
      const expected = overflowFirst
        ? `${overflowInstruction}${eol}${mappedNeighbor}`
        : `${mappedNeighbor}${eol}${overflowInstruction}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, expected, `${JSON.stringify(eol)}:${overflowFirst}`);
      assert.equal(result.substitutionCount, 1, `${JSON.stringify(eol)}:${overflowFirst}`);
      assert.equal(result.segments.map(({ content }) => content).join(""), expected);
      assert.deepEqual(result.signals, []);
    }

    const referenceInput = [
      "[ref]: /url",
      overflowInstruction,
      "Work [tr][ref] in next stitch.",
    ].join(eol);
    const referenceExpected = [
      "[ref]: /url",
      overflowInstruction,
      "Work [double crochet (dc)][ref] in next stitch.",
    ].join(eol);
    const referenceResult = decodeVintagePattern(referenceInput, "uk");
    assert.equal(referenceResult.output, referenceExpected, JSON.stringify(eol));
    assert.equal(referenceResult.substitutionCount, 1, JSON.stringify(eol));

    const definitionInput = [
      "Abbreviations:",
      "htr = half turn",
      overflowInstruction,
      instruction,
    ].join(eol);
    const definitionResult = decodeVintagePattern(definitionInput, "uk");
    assert.equal(definitionResult.output, definitionInput, JSON.stringify(eol));
    assert.equal(definitionResult.substitutionCount, 0, JSON.stringify(eol));
  }
});

test("numbered list markers isolate ordinary commands but preserve explicit headings", () => {
  for (const quote of ["", "> ", ">> "]) {
    for (const [firstMarker, secondMarker] of [["1.", "2."], ["1)", "2)"], ["(1)", "(2)"]]) {
      const contaminated = `${quote}${firstMarker} Work dc in first dc, widget.\n${quote}${secondMarker} Work htr in next stitch.`;
      const contaminatedResult = decodeVintagePattern(contaminated, "uk");
      assert.equal(
        contaminatedResult.output,
        `${quote}${firstMarker} Work dc in first dc, widget.\n${quote}${secondMarker} Work half double crochet (hdc) in next stitch.`,
        contaminated,
      );
      assert.equal(contaminatedResult.substitutionCount, 1, contaminated);

      const valid = `${quote}${firstMarker} Work dc in next stitch.\n${quote}${secondMarker} Work htr in next stitch.`;
      const validResult = decodeVintagePattern(valid, "uk");
      assert.equal(
        validResult.output,
        `${quote}${firstMarker} Work single crochet (sc) in next stitch.\n${quote}${secondMarker} Work half double crochet (hdc) in next stitch.`,
        valid,
      );
      assert.equal(validResult.substitutionCount, 2, valid);

      const linked = `${quote}${firstMarker} Work [dc](a) and tr in next stitch.`;
      const linkedResult = decodeVintagePattern(linked, "uk");
      assert.equal(
        linkedResult.output,
        `${quote}${firstMarker} Work [single crochet (sc)](a) and double crochet (dc) in next stitch.`,
        linked,
      );
      assert.equal(linkedResult.substitutionCount, 2, linked);

      for (const sameLine of [
        `${quote}${firstMarker} Work dc in first dc, widget. Work htr in next stitch.`,
        `${quote}${firstMarker} Work htr in next stitch. Work dc in first dc, widget.`,
      ]) {
        const sameLineResult = decodeVintagePattern(sameLine, "uk");
        assert.equal(sameLineResult.substitutionCount, 1, sameLine);
        assert.match(sameLineResult.output, /half double crochet \(hdc\)/u, sameLine);
        assert.match(sameLineResult.output, /Work dc in first dc, widget\./u, sameLine);
      }

      for (const delimiter of [". ", "! ", "? "]) {
        for (const identifier of ["dc_id", "htr_value", "DC_label", "α_dc_β"]) {
          const validFirst = `${quote}${firstMarker} Work htr in next stitch${delimiter}Work ${identifier} in next stitch.`;
          const validFirstResult = decodeVintagePattern(validFirst, "uk");
          assert.equal(
            validFirstResult.output,
            `${quote}${firstMarker} Work half double crochet (hdc) in next stitch${delimiter}Work ${identifier} in next stitch.`,
            validFirst,
          );
          assert.equal(validFirstResult.substitutionCount, 1, validFirst);

          const invalidFirst = `${quote}${firstMarker} Work ${identifier} in next stitch${delimiter}Work htr in next stitch.`;
          const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
          assert.equal(
            invalidFirstResult.output,
            `${quote}${firstMarker} Work ${identifier} in next stitch${delimiter}Work half double crochet (hdc) in next stitch.`,
            invalidFirst,
          );
          assert.equal(invalidFirstResult.substitutionCount, 1, invalidFirst);
        }

        for (const identifier of [
          "DC_label",
          "TR_value",
          "HTR_key_with_dc_id",
          "DTR_2",
          "dc_id",
          "label_DC",
        ]) {
          const validFirst = `${quote}${firstMarker} Work htr in next stitch${delimiter}${identifier} in next stitch.`;
          const validFirstResult = decodeVintagePattern(validFirst, "uk");
          assert.equal(
            validFirstResult.output,
            `${quote}${firstMarker} Work half double crochet (hdc) in next stitch${delimiter}${identifier} in next stitch.`,
            validFirst,
          );
          assert.equal(validFirstResult.substitutionCount, 1, validFirst);

          const invalidFirst = `${quote}${firstMarker} ${identifier} in next stitch${delimiter}Work htr in next stitch.`;
          const invalidFirstResult = decodeVintagePattern(invalidFirst, "uk");
          assert.equal(
            invalidFirstResult.output,
            `${quote}${firstMarker} ${identifier} in next stitch${delimiter}Work half double crochet (hdc) in next stitch.`,
            invalidFirst,
          );
          assert.equal(invalidFirstResult.substitutionCount, 1, invalidFirst);
        }
      }
    }
  }

  for (const heading of [
    "1. Row 2: Work dc in next stitch.",
    "1. Body: Work dc in next stitch.",
    "> 1. ### Body: Work dc in next stitch.",
    "1) Row 2: Work dc in next stitch.",
    "(1) Body: Work dc in next stitch.",
    "> 1) ### Body: Work dc in next stitch.",
    "> (1) ### Body: Work dc in next stitch.",
  ]) {
    const result = decodeVintagePattern(heading, "uk");
    assert.equal(
      result.output,
      heading.replace("dc", "single crochet (sc)"),
      heading,
    );
    assert.equal(result.substitutionCount, 1, heading);
  }

  const headingNeighbor = "1. Row 2: Work dc in first dc, widget.\n2. Work htr in next stitch.";
  const headingNeighborResult = decodeVintagePattern(headingNeighbor, "uk");
  assert.equal(
    headingNeighborResult.output,
    "1. Row 2: Work dc in first dc, widget.\n2. Work half double crochet (hdc) in next stitch.",
  );
  assert.equal(headingNeighborResult.substitutionCount, 1);
});

test("sentence boundaries cannot turn command-like journal prose into instructions", () => {
  for (const prose of [
    "Version 1. Work journal cites first dc.",
    "Intro. Work journal cites first dc.",
    "Work htr in next stitch. Work journal cites first dc.",
    "Work journal cites first dc. Work htr in next stitch.",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    const expected = prose.replace("Work htr in next stitch", "Work half double crochet (hdc) in next stitch");
    assert.equal(result.output, expected, prose);
    assert.equal(result.substitutionCount, prose.includes("Work htr") ? 1 : 0, prose);
  }

  const realCommand = "Version 1. Work htr in next stitch.";
  const realCommandResult = decodeVintagePattern(realCommand, "uk");
  assert.equal(
    realCommandResult.output,
    "Version 1. Work half double crochet (hdc) in next stitch.",
  );
  assert.equal(realCommandResult.substitutionCount, 1);
});

test("ribbing and armhole headings release named-stitch definition bodies", () => {
  for (const heading of ["Ribbing", "Shape armholes"]) {
    for (const marker of ["", "> - "]) {
      const input = `Special stitches:\nWave stitch:\nWork dc.\n${marker}${heading}:\nWork dc in next stitch.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(
        result.output,
        `Special stitches:\nWave stitch:\nWork dc.\n${marker}${heading}:\nWork single crochet (sc) in next stitch.`,
        input,
      );
      assert.equal(result.substitutionCount, 1, input);
    }
  }

  for (const label of ["Ribbing stitch", "Shape armholes stitch", "Motif A"]) {
    for (const marker of ["", "> - "]) {
      const input = `Special stitches:\n${marker}${label}:\nWork double crochet and treble crochet in next stitch.\nBody:\nWork dc and tr in next stitch.`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(
        result.output,
        `Special stitches:\n${marker}${label}:\nWork double crochet and treble crochet in next stitch.\nBody:\nWork single crochet (sc) and double crochet (dc) in next stitch.`,
        input,
      );
      assert.equal(result.substitutionCount, 2, input);
    }
  }
});

test("instruction-heading target tails require bounded crochet grammar", () => {
  const invalidTails = [
    " is metadata.",
    " are labels.",
    " as a label.",
    ".txt is metadata.",
    ", dc.txt is metadata.",
    ", ch-debug is metadata.",
    " and work is difficult.",
    ", place marker is discussed.",
    ", use next color theory.",
    " in the glossary.",
    " in metadata.",
    " history.",
    " journal.",
    ", dc/debug is metadata.",
    ", dc\\debug is metadata.",
    ", chain-id is metadata.",
    ", ch is metadata.",
    ", join is described.",
  ];

  for (const tail of invalidTails) {
    const input = `Row 1: Work dc in ch-1 space${tail}`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  for (const prefix of ["", "- ", "> ", "> - ", "1. ", "> 1. ", "Row 1: "]) {
    for (const initial of [
      "Work dc in next stitch",
      "Work dc across",
      "Work 2 dc in next stitch",
    ]) {
      for (const tail of [", use next color theory.", " in metadata.", ", ch is metadata."]) {
        const input = `${prefix}${initial}${tail}`;
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, input, input);
        assert.equal(result.substitutionCount, 0, input);
      }
    }
  }
});

test("positional clause chains map every supported action and target term", () => {
  for (const separator of [", ", "; ", " and ", " or ", " then ", ", then ", "; then "]) {
    const input = `Work dc in first dc${separator}tr in second dc.`;
    const expected = `Work single crochet (sc) in first single crochet (sc)${separator}double crochet (dc) in second single crochet (sc).`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 4, input);
  }

  const longInput = "Work double crochet in first double crochet, treble crochet in second double crochet.";
  const longResult = decodeVintagePattern(longInput, "uk");
  assert.equal(
    longResult.output,
    "Work single crochet (sc) in first single crochet (sc), double crochet (dc) in second single crochet (sc).",
  );
  assert.equal(longResult.substitutionCount, 4);

  const compoundInput = "Row 1: front post dc, back post tr; dc, tr.";
  const compoundResult = decodeVintagePattern(compoundInput, "uk");
  assert.equal(
    compoundResult.output,
    "Row 1: front post dc, back post tr; single crochet (sc), double crochet (dc).",
  );
  assert.equal(compoundResult.substitutionCount, 2);

  for (const [compound, term, replacement] of [
    ["front post dc", "dc", "single crochet (sc)"],
    ["back post tr", "tr", "double crochet (dc)"],
    ["long dc", "dc", "single crochet (sc)"],
    ["spike dc", "tr", "double crochet (dc)"],
    ["waistcoat dc", "htr", "half double crochet (hdc)"],
    ["back loop dc", "dc", "single crochet (sc)"],
  ]) {
    for (const prefix of ["Row 1: ", "Work ", "Row 1: Work ", "### Row 3: Work "]) {
      for (const separator of [", ", "; ", " and ", " or ", " then ", ", then ", "; then ", " and then "]) {
        const input = `${prefix}${compound}${separator}${term} in next stitch.`;
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, input, `${input} (${replacement})`);
        assert.equal(result.substitutionCount, 0, input);
      }
    }
  }

  for (const [input, expected, count] of [
    [
      "Work dc in first dc, place marker, then tr in second dc.",
      "Work single crochet (sc) in first single crochet (sc), place marker, then double crochet (dc) in second single crochet (sc).",
      4,
    ],
    [
      "Work dc in first dc, join to first dc, then tr in second dc.",
      "Work single crochet (sc) in first single crochet (sc), join to first single crochet (sc), then double crochet (dc) in second single crochet (sc).",
      5,
    ],
    [
      "Work dc in first dc, keep dc, then tr in second dc.",
      "Work single crochet (sc) in first single crochet (sc), keep single crochet (sc), then double crochet (dc) in second single crochet (sc).",
      5,
    ],
    [
      "Work double crochet in first double crochet, keep double crochet, then treble crochet in second double crochet.",
      "Work single crochet (sc) in first single crochet (sc), keep single crochet (sc), then double crochet (dc) in second single crochet (sc).",
      5,
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, count, input);
  }
});

test("bare line-start counts can introduce bounded uppercase stitch instructions", () => {
  for (const [input, expected] of [
    ["2 DC in next stitch.", "2 single crochet (sc) in next stitch."],
    ["1 HTR in each stitch", "1 half double crochet (hdc) in each stitch"],
    ["3 TR into the same stitch!", "3 double crochet (dc) into the same stitch!"],
    ["4 DTR in the previous stitches.", "4 treble crochet (tr) in the previous stitches."],
    ["2 DC in the next st.", "2 single crochet (sc) in the next st."],
    ["2 DC on next stitch.", "2 single crochet (sc) on next stitch."],
    ["2 DC over previous stitch.", "2 single crochet (sc) over previous stitch."],
    ["2 DC under each stitch.", "2 single crochet (sc) under each stitch."],
    ["2 DC between next stitches.", "2 single crochet (sc) between next stitches."],
    ["2 DC in next space.", "2 single crochet (sc) in next space."],
    ["2 DC into the same loop.", "2 single crochet (sc) into the same loop."],
    ["2 DC in next row.", "2 single crochet (sc) in next row."],
    ["2 DC across.", "2 single crochet (sc) across."],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }

  const multiline = decodeVintagePattern("2 DC in next stitch.\n1 HTR in each stitch.", "uk");
  assert.equal(
    multiline.output,
    "2 single crochet (sc) in next stitch.\n1 half double crochet (hdc) in each stitch.",
  );
  assert.equal(multiline.substitutionCount, 2);

  const sameLine = decodeVintagePattern("2 DC in next stitch, DC in next stitch.", "uk");
  assert.equal(
    sameLine.output,
    "2 single crochet (sc) in next stitch, single crochet (sc) in next stitch.",
  );
  assert.equal(sameLine.substitutionCount, 2);

  for (const prose of [
    "Model 2 DC in next stitch.",
    "1940 DC in next edition.",
    "Row 1: Model 2 DC in next stitch.",
    "Row 1: 1940 DC in next edition.",
    "2 DC Thomson books.",
    "2 DC in next stitch as a label.",
    "2 DC in next stitch are shown in the glossary.",
    "2 DC in next stitch_id.",
    "2 DC-tog in next stitch.",
    "2 DC in 2020.",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    assert.equal(result.output, prose, prose);
    assert.equal(result.substitutionCount, 0, prose);
  }

  for (const [input, expected] of [
    ["Row 1: DC.", "Row 1: single crochet (sc)."],
    ["Row 1: DC in next stitch.", "Row 1: single crochet (sc) in next stitch."],
    ["Row 1: 2 DC in next stitch.", "Row 1: 2 single crochet (sc) in next stitch."],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }

  for (const convention of ["us", "unknown"]) {
    const source = "2 DC in next stitch.\n1 HTR in each stitch.";
    assert.equal(decodeVintagePattern(source, convention).output, source, convention);
  }
});

test("bounded post-target qualifiers remain instruction context", () => {
  const input = [
    "Join to first dc made.",
    "Work in corresponding dc of previous row.",
    "Join to first DC worked!",
    "Join to first treble crochet made, then turn.",
    "Work in corresponding half treble of the next round.",
    "- Work in first double crochet of previous row, ch 1.",
  ].join("\n");
  const result = decodeVintagePattern(input, "uk");
  assert.equal(
    result.output,
    [
      "Join to first single crochet (sc) made.",
      "Work in corresponding single crochet (sc) of previous row.",
      "Join to first single crochet (sc) worked!",
      "Join to first double crochet (dc) made, then turn.",
      "Work in corresponding half double crochet (hdc) of the next round.",
      "- Work in first single crochet (sc) of previous row, ch 1.",
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 6);

  for (const prose of [
    "Join to first dc made history.",
    "Join to first dc made in 2020.",
    "Join to first dc made, according to the glossary.",
    "Join to first dc made) as a label.",
    "Join to first dc made.txt",
    "Work in corresponding dc of previous prose.",
    "Work in corresponding dc of previous row as a label.",
    "Work in corresponding dc of previous row] as a label.",
    "Work in corresponding dc of previous row.example",
    "Use dc of previous row as a label.",
  ]) {
    const proseResult = decodeVintagePattern(prose, "uk");
    assert.equal(proseResult.output, prose, prose);
    assert.equal(proseResult.substitutionCount, 0, prose);
  }
});

test("unqualified row and round targets require strong positional instructions", () => {
  for (const [input, expected] of [
    ["Ch 3 counts as first dc of row.", "Ch 3 counts as first single crochet (sc) of row."],
    ["Ch 3 counts as first DC of round.", "Ch 3 counts as first single crochet (sc) of round."],
    ["Ch 3 counts as the first dc of row.", "Ch 3 counts as the first single crochet (sc) of row."],
    ["Chain 1 counts as the first double crochet of the round.", "Chain 1 counts as the first single crochet (sc) of the round."],
    ["Ch-3 counts as first dc of row.", "Ch-3 counts as first single crochet (sc) of row."],
    ["Ch — 3 counts as first DC of round.", "Ch — 3 counts as first single crochet (sc) of round."],
    ["Ch 3 counts as 1st dc of row.", "Ch 3 counts as 1st single crochet (sc) of row."],
    ["- Ch 3 counts as first dc of row.", "- Ch 3 counts as first single crochet (sc) of row."],
    ["> - Ch 3 counts as first dc of row.", "> - Ch 3 counts as first single crochet (sc) of row."],
    ["1. Ch 3 counts as first double crochet of row.", "1. Ch 3 counts as first single crochet (sc) of row."],
    ["Row 1: Ch 3 counts as first double crochet of row.", "Row 1: Ch 3 counts as first single crochet (sc) of row."],
    ["Work in first tr of the row.", "Work in first double crochet (dc) of the row."],
    ["Join to third DTR of the round!", "Join to third treble crochet (tr) of the round!"],
    ["Work in corresponding half treble of row.", "Work in corresponding half double crochet (hdc) of row."],
    ["Join to first treble crochet of round; then turn.", "Join to first double crochet (dc) of round; then turn."],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }

  for (const prose of [
    "The glossary counts as first dc of row.",
    "Use dc of row as a label.",
    "Work in first dc of row as a label.",
    "Work in first dc of row.example",
    "Work in first dc of row] as a label.",
    "Work in first dc of row one.",
    "Work in first dc of rows.",
    "Work in first dc of rounds.",
    "Work in first dc of space.",
    "Work in first dc of stitch.",
    "The first dc of row was decorative.",
    "Work journal cites first dc of row.",
  ]) {
    const result = decodeVintagePattern(prose, "uk");
    assert.equal(result.output, prose, prose);
    assert.equal(result.substitutionCount, 0, prose);
  }

  for (const convention of ["us", "unknown"]) {
    const source = "Ch 3 counts as first dc of row.";
    assert.equal(decodeVintagePattern(source, convention).output, source, convention);
  }
});

test("source references, paths, URL-like tokens, and email addresses are preserved byte-for-byte", () => {
  const input = [
    "Source: https://example.com/dc/pattern",
    "Chart: https://site.test/?st=tr",
    "Mirror: www.example.test/htr",
    "Bare: example.test/dtr",
    "Query: example.test?st=tr",
    "Fragment: example.test#tr",
    "Contact: dc@example.com",
    "Root path: /patterns/dc/tr/example",
    "Relative path: ../patterns/htr/draft.txt",
    "Windows path: C:\\patterns\\dc\\draft.txt",
    "UNC path: \\\\server\\patterns\\tr\\draft.txt",
    "App link: ravelry://patterns/dc/tr",
    "Local link: http://localhost:3000/patterns/dc",
    "IP link: http://127.0.0.1:3000/patterns/tr",
    "Markdown: [chart](/patterns/dc/tr)",
    "Bare relative: patterns/dc/tr.pdf",
    "Relative Windows: patterns\\dc\\tr.txt",
    "See (patterns/dc/tr)",
    "Markdown relative: [chart](patterns/dc/tr)",
    "Bare no extension: patterns/dc/tr",
    "Protocol relative: //example.com/dc/tr",
    "URN: urn:example:dc/tr",
    "Path: dc/tr/htr",
    "File: dc/tr",
    "URL: dc/tr",
    "Reference: dc/tr",
    "Link: dc/tr",
    "Publisher: DC Thomson",
    "Location: Washington, DC",
    "Pattern #123 — DC and Sons",
    "Work dc in next stitch.",
  ].join("\n");
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    input.replace("Work dc in next stitch.", "Work single crochet (sc) in next stitch."),
  );
  assert.equal(result.substitutionCount, 1);

  const unknown = decodeVintagePattern("https://example.com/dc/pattern example.test?st=tr example.test#tr /patterns/dc/tr C:\\patterns\\dc\\draft.txt", "unknown");
  assert.equal(unknown.signals.some(({ title }) => title === "Crochet convention not established"), false);

  const properNouns = decodeVintagePattern("DC Thomson; Washington, DC; Washington, DC in 1960.", "unknown");
  assert.equal(properNouns.signals.some(({ title }) => title === "Crochet convention not established"), false);

  for (const [instruction, expected] of [
    ["Row 1: dc/tr/htr", "Row 1: single crochet (sc)/double crochet (dc)/half double crochet (hdc)"],
    ["Row 1: dc/tr/htr in next stitch", "Row 1: single crochet (sc)/double crochet (dc)/half double crochet (hdc) in next stitch"],
    ["Work dc/tr/htr across.", "Work single crochet (sc)/double crochet (dc)/half double crochet (hdc) across."],
  ]) {
    const instructionResult = decodeVintagePattern(instruction, "uk");
    assert.equal(instructionResult.output, expected);
    assert.equal(instructionResult.substitutionCount, 3);
  }

  for (const [instruction, expected] of [
    ["Chart: dc/tr/htr", "Chart: single crochet (sc)/double crochet (dc)/half double crochet (hdc)"],
    ["See dc/tr/htr in next stitch.", "See single crochet (sc)/double crochet (dc)/half double crochet (hdc) in next stitch."],
  ]) {
    const instructionResult = decodeVintagePattern(instruction, "uk");
    assert.equal(instructionResult.output, expected);
    assert.equal(instructionResult.substitutionCount, 3);
  }

  const markdownTargets = decodeVintagePattern(
    "[pattern](dc/tr); [pattern](dc); [dc](tr); ![chart](dc/tr)",
    "uk",
  );
  assert.equal(
    markdownTargets.output,
    "[pattern](dc/tr); [pattern](dc); [single crochet (sc)](tr); ![chart](dc/tr)",
  );
  assert.equal(markdownTargets.substitutionCount, 1);
});

test("uppercase stitch instructions after marker labels remain convertible", () => {
  for (const [input, expected] of [
    ["Row 1: At marker A, DC in next stitch.", "Row 1: At marker A, single crochet (sc) in next stitch."],
    ["Row 1: With color A, DC in next stitch.", "Row 1: With color A, single crochet (sc) in next stitch."],
    ["Row 1: In space A, TR across.", "Row 1: In space A, double crochet (dc) across."],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected);
    assert.equal(result.substitutionCount, 1);
  }

  const properNoun = decodeVintagePattern("Washington, DC; Washington, DC in 1960.", "uk");
  assert.equal(properNoun.output, "Washington, DC; Washington, DC in 1960.");
  assert.equal(properNoun.substitutionCount, 0);

  for (const prose of [
    "The DC Thomson Collection.",
    "A TR monogram appears on the cover.",
    "University of DC Press.",
  ]) {
    const proseResult = decodeVintagePattern(prose, "uk");
    assert.equal(proseResult.output, prose, prose);
    assert.equal(proseResult.substitutionCount, 0, prose);
  }

  for (const metadata of [
    "© 1940 DC and Sons",
    "Copyright 1940 DC and Sons",
    "Printed 1940 DC and Sons",
    "Catalog 1940 DC and Sons",
    "Pattern 1940 DC and Sons",
    "Vol. 2 DC and Sons",
    "No. 5 DC and Sons",
    "Page 5 DC and Sons",
  ]) {
    const metadataResult = decodeVintagePattern(metadata, "uk");
    assert.equal(metadataResult.output, metadata, metadata);
    assert.equal(metadataResult.substitutionCount, 0, metadata);
  }

  const countedInstruction = decodeVintagePattern("Work 3 DC in next stitch.", "uk");
  assert.equal(countedInstruction.output, "Work 3 single crochet (sc) in next stitch.");
  assert.equal(countedInstruction.substitutionCount, 1);

  for (const [input, expected] of [
    ["Ch 3 counts as DC.", "Ch 3 counts as single crochet (sc)."],
    ["Skip next DC.", "Skip next single crochet (sc)."],
    ["Work in first DC.", "Work in first single crochet (sc)."],
    ["Repeat last TR.", "Repeat last double crochet (dc)."],
    ["Work into each HTR.", "Work into each half double crochet (hdc)."],
    ["Join to third DTR.", "Join to third treble crochet (tr)."],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }
});

test("uppercase instructions remain bounded under row, construction, and numbered headings", () => {
  const instructionCases = [
    ["DC.", "single crochet (sc).", 1],
    ["DC in next stitch.", "single crochet (sc) in next stitch.", 1],
    ["DC in ch-1 space.", "single crochet (sc) in ch-1 space.", 1],
    ["DC in first dc.", "single crochet (sc) in first single crochet (sc).", 2],
    ["At marker A, DC in next stitch.", "At marker A, single crochet (sc) in next stitch.", 1],
    ["With color A, DC in next stitch.", "With color A, single crochet (sc) in next stitch.", 1],
    ["In space A, TR across.", "In space A, double crochet (dc) across.", 1],
  ];
  for (const context of ["Row 1: ", "Body: ", "> 1. Body: ", "> 1) Body: ", "> (1) Body: "]) {
    for (const [body, expectedBody, count] of instructionCases) {
      const input = `${context}${body}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, `${context}${expectedBody}`, input);
      assert.equal(result.substitutionCount, count, input);
    }
  }

  for (const context of ["Row 1: ", "Body: ", "> 1. Body: ", "> 1) Body: ", "> (1) Body: "]) {
    for (const body of [
      "Model 2 DC in next stitch.",
      "1940 DC in next edition.",
      "Theory DC in next chapter.",
      "DC Thomson collection.",
      "DC_label in next stitch.",
      "DC-tog in next stitch.",
      "DC in next stitch as a label.",
      "DC in ch-1 space appears in the glossary.",
    ]) {
      const input = `${context}${body}`;
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.output, input, input);
      assert.equal(result.substitutionCount, 0, input);
    }
  }
});

test("parenthesized abbreviations in unsupported phrases are preserved", () => {
  const input = [
    "front post double crochet (dc)",
    "front post dc (double crochet)",
    "custom cluster (tr in next stitch)",
    "custom label (double crochet)",
    "custom label (double crochet (dc))",
    "custom stitch (dc in next stitch)",
    "special stitch (tr (treble))",
    "Special stitch: (dc in next stitch)",
    "Special stitches (dc in next stitch)",
    "Definitions: (dc means drop color)",
    "Abbreviations — (tr means turn right)",
    "Custom stitch: Bobble = double crochet (dc)",
    "Definitions: dc = drop color",
  ].join("; ");
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
});

test("unsupported multiword stitch names are preserved rather than partially rewritten", () => {
  const input = [
    "half double crochet",
    "front post double crochet",
    "triple treble crochet",
    "double crochet three together",
    "treble crochet cluster",
    "front post double treble crochet",
    "front post half treble crochet",
  ].join("; ");
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
});

test("Unicode letters and numbers beside a supported token keep the prose unchanged", () => {
  const input = "très bien; dcé; htrø; trβ; dtr٣; tr alone.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, "très bien; dcé; htrø; trβ; dtr٣; double crochet (dc) alone.");
  assert.equal(result.substitutionCount, 1);

  const unknown = decodeVintagePattern("très bien; dcé; htrø; trβ; dtr٣", "unknown");
  assert.equal(unknown.status, "ready");
  assert.equal(unknown.output, "très bien; dcé; htrø; trβ; dtr٣");
  assert.equal(unknown.signals.some((signal) => signal.title === "Crochet convention not established"), false);
});

test("connector and format characters beside a supported token keep identifiers unchanged", () => {
  const input = "dc_sp; foo_dc_bar; tr\u200Dlabel; htr\u200Cnote; dc alone.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, "dc_sp; foo_dc_bar; tr\u200Dlabel; htr\u200Cnote; single crochet (sc) alone.");
  assert.equal(result.substitutionCount, 1);

  const unknown = decodeVintagePattern("dc_sp; tr\u200Dlabel", "unknown");
  assert.equal(unknown.status, "ready");
  assert.equal(unknown.signals.some((signal) => signal.title === "Crochet convention not established"), false);
});

test("unlisted whitespace modifiers are preserved while instruction grammar still converts", () => {
  const input = "long dc; spike dc; waistcoat dc; work dc, then tr; dtr tr dc; Instructions\ndc in next stitch.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "long dc; spike dc; waistcoat dc; work single crochet (sc), then double crochet (dc); treble crochet (tr) double crochet (dc) single crochet (sc); Instructions\nsingle crochet (sc) in next stitch.",
  );
  assert.equal(result.substitutionCount, 6);
});

test("ordinary parenthesized instructions are not suppressed by distant descriptive words", () => {
  const input = "Use special yarn and work (dc, tr) in next stitch.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, "Use special yarn and work (single crochet (sc), double crochet (dc)) in next stitch.");
  assert.equal(result.substitutionCount, 2);
});

test("decomposed Unicode marks beside a supported token keep the prose unchanged", () => {
  const input = "dc\u0301; htr\u0308; tr alone.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, "dc\u0301; htr\u0308; double crochet (dc) alone.");
  assert.equal(result.substitutionCount, 1);

  const unknown = decodeVintagePattern("dc\u0301; htr\u0308", "unknown");
  assert.equal(unknown.status, "ready");
  assert.equal(unknown.output, "dc\u0301; htr\u0308");
  assert.equal(unknown.signals.some((signal) => signal.title === "Crochet convention not established"), false);
});

test("source-specific wording remains unchanged and is reported only as a review clue", () => {
  const input = "Miss one, cast off, work straight, then wool forward.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
  assert.ok(result.signals.length >= 2);

  const straight = decodeVintagePattern("Work straight.", "uk");
  assert.equal(straight.output, "Work straight.");
  assert.ok(straight.signals.some(({ title }) => title === "Wording that may follow UK conventions"));

  for (const prose of ["The straight edge is even.", "product_dc_label", "ultramarine thread"]) {
    const proseResult = decodeVintagePattern(prose, "unknown");
    assert.equal(proseResult.output, prose, prose);
    assert.deepEqual(proseResult.signals, [], prose);
  }
});

test("custom supported keys are recognized across bounded glossary formats", () => {
  const customInputs = [
    "a) “dc” → drop color\nRow 1: dc.",
    "dc / tr ⇒ alternate colors\nRow 1: dc, tr.",
    "Abbreviations： dc＝drop color\nRow 1: dc.",
    "UK Abbreviations:\ndc drop stitch\nRow 1: dc.",
    "British Terms:\ntr turn right\nRow 1: tr.",
    "Glossary:\ndc drop color\nRow 1: dc.",
    "Abbrev.:\ndc drop color\nRow 1: dc.",
    "Abbreviations:\n+ dc = drop stitch\nBody:\nRow 1: dc.",
    "dc and tr stand for drop color\nRow 1: dc, tr.",
    "dc/tr stand for drop color\nRow 1: dc, tr.",
    "dc & tr stand for drop color\nRow 1: dc, tr.",
    "Abbreviations:\ndc／tr = drop ridge\nBody:\nRow 1: dc, tr.",
    "Abbreviations:\ndc ＆ tr = drop ridge\nBody:\nRow 1: dc, tr.",
    "| Abbreviation | Meaning |\n|---|---|\n| dc | drop color |\n| tr | turn right |\n\nRow 1: dc, tr.",
    "| Symbol | Meaning |\n|---|---|\n| dc | drop color |\n\nRow 1: dc.",
    "| Symbols | Meaning |\n|---|---|\n| tr | turn right |\n\nRow 1: tr.",
    "| `Abbreviation` | Meaning |\n|---|---|\n| `dc` | drop cluster |\n\nBody:\nRow 1: dc.",
    "| Meaning | Abbreviation |\n|---|---|\n| drop cluster | dc |\n\nBody:\nRow 1: dc.",
  ];

  for (const input of customInputs) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.status, "ready", input);
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  for (const [input, expected] of [
    [
      "\"dc\" - drop color\nBody:\nRow 1: dc.\nRow 2: htr.",
      "\"dc\" - drop color\nBody:\nRow 1: dc.\nRow 2: half double crochet (hdc).",
    ],
    [
      "Abbreviations:\n> 1. “dc” → drop color\nBody:\nRow 1: dc.\nRow 2: htr.",
      "Abbreviations:\n> 1. “dc” → drop color\nBody:\nRow 1: dc.\nRow 2: half double crochet (hdc).",
    ],
    [
      "Abbreviations:\n### \"dc\" - drop color\nBody:\nRow 1: dc.\nRow 2: htr.",
      "Abbreviations:\n### \"dc\" - drop color\nBody:\nRow 1: dc.\nRow 2: half double crochet (hdc).",
    ],
    [
      "\"dc\" is drop color\nBody:\nRow 1: dc.\nRow 2: htr.",
      "\"dc\" is drop color\nBody:\nRow 1: dc.\nRow 2: half double crochet (hdc).",
    ],
    [
      "\"dc\" drop color\nBody:\nRow 1: dc.\nRow 2: htr.",
      "\"dc\" drop color\nBody:\nRow 1: dc.\nRow 2: half double crochet (hdc).",
    ],
    [
      "“dc” drop color\nBody:\nRow 1: dc.\nRow 2: htr.",
      "“dc” drop color\nBody:\nRow 1: dc.\nRow 2: half double crochet (hdc).",
    ],
    [
      "'dc' drop color\nBody:\nRow 1: dc.\nRow 2: htr.",
      "'dc' drop color\nBody:\nRow 1: dc.\nRow 2: half double crochet (hdc).",
    ],
  ]) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, input);
    assert.equal(result.substitutionCount, 1, input);
  }

  const standardTable = [
    "| Abbreviation | Meaning |",
    "|---|---|",
    "| dc | double crochet |",
    "",
    "Row 1: dc.",
  ].join("\n");
  const standardResult = decodeVintagePattern(standardTable, "uk");
  assert.equal(
    standardResult.output,
    standardTable.replace("Row 1: dc.", "Row 1: single crochet (sc)."),
  );
  assert.equal(standardResult.substitutionCount, 1);
});

test("glossary discussion prose stays local to independent Work instructions", () => {
  const startedAt = performance.now();
  for (const eol of ["\n", "\r\n"]) {
    const input = [
      "The glossary discusses dc and tr.",
      "Row 1: Work htr in next stitch.",
      "Row 2: Work dc in next stitch.",
    ].join(eol);
    const expected = [
      "The glossary discusses dc and tr.",
      "Row 1: Work half double crochet (hdc) in next stitch.",
      "Row 2: Work single crochet (sc) in next stitch.",
    ].join(eol);
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, expected, eol === "\n" ? "LF" : "CRLF");
    assert.equal(result.substitutionCount, 2);

    const contaminated = [
      "The glossary discusses dc and tr, then Work htr in next stitch, widget.",
      "Row 2: Work dc in next stitch.",
    ].join(eol);
    const contaminatedResult = decodeVintagePattern(contaminated, "uk");
    assert.equal(
      contaminatedResult.output,
      [
        "The glossary discusses dc and tr, then Work htr in next stitch, widget.",
        "Row 2: Work single crochet (sc) in next stitch.",
      ].join(eol),
    );
    assert.equal(contaminatedResult.substitutionCount, 1);

    for (const glossaryTerm of ["[dc](https://example.com)", "`dc`"]) {
      const markedUp = `The glossary discusses ${glossaryTerm} and tr.${eol}Row 1: Work htr in next stitch.`;
      const markedUpResult = decodeVintagePattern(markedUp, "uk");
      assert.equal(
        markedUpResult.output,
        `The glossary discusses ${glossaryTerm} and tr.${eol}Row 1: Work half double crochet (hdc) in next stitch.`,
      );
      assert.equal(markedUpResult.substitutionCount, 1);
    }

    const codeLine = `<code>dc and tr</code>${eol}Row 1: Work htr in next stitch.`;
    const codeLineResult = decodeVintagePattern(codeLine, "uk");
    assert.equal(
      codeLineResult.output,
      `<code>dc and tr</code>${eol}Row 1: Work half double crochet (hdc) in next stitch.`,
    );
    assert.equal(codeLineResult.substitutionCount, 1);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected glossary discussion isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("definition fast paths retain established denied-line fallthrough", () => {
  const input = [
    "Abbreviations:",
    "> 1. “dc” → drop color",
    "Body:",
    "Row 1: htr in first dc.",
    "Row 2: htr widget.",
    "Row 3: tension.",
    "Row 4: htr-cluster.",
    "Foundation: htr.",
    "Row 5: dc.",
    "Row 6: htr and tr.",
  ].join("\n");
  const expected = [
    "Abbreviations:",
    "> 1. “dc” → drop color",
    "Body:",
    "Row 1: half double crochet (hdc) in first dc.",
    "Row 2: htr widget.",
    "Row 3: tension.",
    "Row 4: htr-cluster.",
    "Foundation: htr.",
    "Row 5: dc.",
    "Row 6: htr and double crochet (dc).",
  ].join("\n");
  const startedAt = performance.now();
  const result = decodeVintagePattern(input, "uk");
  const elapsed = performance.now() - startedAt;
  assert.equal(result.output, expected);
  assert.equal(result.substitutionCount, 2);
  assert.ok(elapsed < 2_000, `expected definition fallthrough under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("headerless is-predicates remain prose and cannot suppress later instructions", () => {
  for (const prose of [
    "dc is common in this book.",
    "dc is used throughout.",
    "dc is required here.",
    "dc is one of the abbreviations.",
  ]) {
    const input = `${prose}\nRow 1: dc.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${prose}\nRow 1: single crochet (sc).`, prose);
    assert.equal(result.substitutionCount, 1, prose);
  }

  for (const custom of [
    "Abbreviations:\ndc is drop color\nBody:\nRow 1: dc.",
    "Abbreviations: dc is drop color\nBody:\nRow 1: dc.",
  ]) {
    const result = decodeVintagePattern(custom, "uk");
    assert.equal(result.output, custom, custom);
    assert.equal(result.substitutionCount, 0, custom);
  }
});

test("multiline definition bodies tolerate leading blank lines but release later sections", () => {
  const glossary = "Abbreviations:\n\ndc drop color\nBody:\nRow 1: dc, tr.";
  const glossaryResult = decodeVintagePattern(glossary, "uk");
  assert.equal(
    glossaryResult.output,
    "Abbreviations:\n\ndc drop color\nBody:\nRow 1: dc, double crochet (dc).",
  );
  assert.equal(glossaryResult.substitutionCount, 1);

  const named = "Special stitches:\n\nWave:\n\nWork dc.\nBody:\nRow 1: tr.";
  const namedResult = decodeVintagePattern(named, "uk");
  assert.equal(
    namedResult.output,
    "Special stitches:\n\nWave:\n\nWork dc.\nBody:\nRow 1: double crochet (dc).",
  );
  assert.equal(namedResult.substitutionCount, 1);
});

test("named stitch bodies release unambiguous main-section headings", () => {
  for (const heading of [
    "Begin here:",
    "Setup Row:",
    "Continue:",
    "Chart:",
    "Chart A:",
    "Pattern A:",
    "Section A:",
    "Part A:",
  ]) {
    const input = `Special stitches:\nWave:\nWork dc.\n${heading}\nRow 1: tr.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Special stitches:\nWave:\nWork dc.\n${heading}\nRow 1: double crochet (dc).`,
      heading,
    );
    assert.equal(result.substitutionCount, 1, heading);
  }
});

test("Markdown-wrapped definition headers, labels, and delimiters preserve custom bodies", () => {
  for (const header of ["*Motifs:*", "_Motifs:_", "***Motifs:***", "___Motifs:___"]) {
    const input = `${header}\nWave:\nWork dc.\nBody:\nRow 1: tr.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${header}\nWave:\nWork dc.\nBody:\nRow 1: double crochet (dc).`, header);
    assert.equal(result.substitutionCount, 1, header);
  }

  for (const label of ["**Wave:**", "*Wave:*", "_Wave:_", "***Wave:***", "`Wave:`"]) {
    const input = `Special stitches:\n${label}\nWork dc.\nBody:\nRow 1: tr.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `Special stitches:\n${label}\nWork dc.\nBody:\nRow 1: double crochet (dc).`, label);
    assert.equal(result.substitutionCount, 1, label);
  }

  for (const entry of ["**dc:**", "*dc:*", "__dc:__", "_dc:_", "`dc:`", "**dc =**"]) {
    const input = `Abbreviations:\n${entry} drop stitch\nBody:\nRow 1: dc, tr.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Abbreviations:\n${entry} drop stitch\nBody:\nRow 1: dc, double crochet (dc).`,
      entry,
    );
    assert.equal(result.substitutionCount, 1, entry);
  }
});

test("named stitch bodies stop at construction headings without exposing custom rows", () => {
  const cases = [
    [
      "Special stitches:\nWave:\nWork dc.\nLeft front:\nRow 1: tr.",
      "Special stitches:\nWave:\nWork dc.\nLeft front:\nRow 1: double crochet (dc).",
    ],
    [
      "Special stitches:\nFoundation row:\nWork dc.\n\nBody:\nRow 1: tr.",
      "Special stitches:\nFoundation row:\nWork dc.\n\nBody:\nRow 1: double crochet (dc).",
    ],
    [
      "Special stitches:\nJoin stitch (RS):\nWork dc.\n\nButtonhole band:\nRow 1: tr.",
      "Special stitches:\nJoin stitch (RS):\nWork dc.\n\nButtonhole band:\nRow 1: double crochet (dc).",
    ],
    [
      "Special stitches:\nWave stitch: Worked over 2 rows.\nRow 1: dc.\nRow 2: tr.\n\nBody:\nRow 1: dc.",
      "Special stitches:\nWave stitch: Worked over 2 rows.\nRow 1: dc.\nRow 2: tr.\n\nBody:\nRow 1: single crochet (sc).",
    ],
    [
      "Special stitches:\nWave stitch: Worked over two rows.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: dc.",
      "Special stitches:\nWave stitch: Worked over two rows.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: single crochet (sc).",
    ],
    [
      "Special stitches:\nWave stitch: Worked over three rounds.\nRound 1: dc.\nRound 2: tr.\nBody:\nRow 1: dc.",
      "Special stitches:\nWave stitch: Worked over three rounds.\nRound 1: dc.\nRound 2: tr.\nBody:\nRow 1: single crochet (sc).",
    ],
    [
      "Special stitches:\nWave stitch: Worked over the next two rows.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: dc.",
      "Special stitches:\nWave stitch: Worked over the next two rows.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: single crochet (sc).",
    ],
    [
      "Special stitches:\nWave stitch: Repeat the following two rows.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: dc.",
      "Special stitches:\nWave stitch: Repeat the following two rows.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: single crochet (sc).",
    ],
    [
      "Special stitches:\nWave stitch: Two rows repeat.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: dc.",
      "Special stitches:\nWave stitch: Two rows repeat.\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 1: single crochet (sc).",
    ],
  ];

  for (const [input, output] of cases) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, output, input);
    assert.equal(result.substitutionCount, 1, input);
  }
});

test("named multirow definitions use semantic row cues without a number-word cap", () => {
  for (const value of [
    "Worked over eleven rows.",
    "Worked over twenty rows.",
    "Worked over the following rows.",
    "Worked over several rows.",
    "Worked over multiple rows.",
    "Worked over a dozen rows.",
    "Worked across three rows.",
    "Worked through three rows.",
    "Worked for three rows.",
    "Worked during three rounds.",
    "Repeat the following rows.",
    "Repeat these two rows.",
    "Repeat these rows twice.",
    "Repeat Rows 1–3.",
    "A twelve-row repeat.",
  ]) {
    const input = `Special stitches:\nWave stitch: ${value}\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 3: htr.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `Special stitches:\nWave stitch: ${value}\nRow 1: dc.\nRow 2: tr.\nBody:\nRow 3: half double crochet (hdc).`,
      value,
    );
    assert.equal(result.substitutionCount, 1, value);
  }
});

test("source syntax, markup, and path variants remain byte-preserved", () => {
  const preserved = [
    "C:dc/tr,",
    "${HOME}/dc,tr",
    "${USERPROFILE}\\dc,tr",
    "file:dc,tr",
    "File: \"dc/tr\"",
    "File: \"Archive dc/tr\"",
    "Filename: \"Archive dc/tr htr pattern.txt\"",
    "File name: \"Archive dc/tr htr pattern.txt\"",
    "Path: \"My folder dc/tr\"",
    "Reference: “Book dc/tr”",
    "Citation: \"Book dc/tr htr\"",
    "Document: \"Archive dc/tr htr\"",
    "Folder: \"Archive dc/tr htr\"",
    "Directory: \"Archive dc/tr htr\"",
    "URL = \"dc/tr\"",
    "URI: \"https://example.test/dc/tr htr\"",
    "Web site: \"https://example.test/dc/tr htr\"",
    "Web address: \"https://example.test/dc/tr htr\"",
    "Link: <dc/tr>",
    "<a href=\"dc/tr\" title=\"tr/dc\">label</a>",
    "<code>dc/tr</code>",
    "<pre>dc, tr</pre>",
    "<!-- dc/tr -->",
    "<![CDATA[dc,tr]]>",
  ];

  for (const input of preserved) {
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, input);
    assert.equal(result.substitutionCount, 0, input);
  }

  for (const destination of ["patterns/dc/tr", "/dc/tr", "../dc/tr", "foo/bar/baz", "https://x.test/dc"]) {
    const result = decodeVintagePattern(`[dc](${destination})`, "uk");
    assert.equal(result.output, `[single crochet (sc)](${destination})`, destination);
    assert.equal(result.substitutionCount, 1, destination);
  }
});

test("strong source labels preserve unquoted path values without hiding later instructions", () => {
  const startedAt = performance.now();
  const input = [
    "File: Archive dc tr htr pattern.txt",
    "Path: C:\\Archive dc\\tr htr pattern.txt",
    "Row 1: dc.",
  ].join("\n");
  const result = decodeVintagePattern(input, "uk");

  assert.equal(
    result.output,
    [
      "File: Archive dc tr htr pattern.txt",
      "Path: C:\\Archive dc\\tr htr pattern.txt",
      "Row 1: single crochet (sc).",
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 1);

  for (const eol of ["\n", "\r\n"]) {
    const sourceAndWork = `Source: C:\\patterns\\dc-and-tr.txt${eol}Row 1: Work htr in next stitch.`;
    const sourceAndWorkResult = decodeVintagePattern(sourceAndWork, "uk");
    assert.equal(
      sourceAndWorkResult.output,
      `Source: C:\\patterns\\dc-and-tr.txt${eol}Row 1: Work half double crochet (hdc) in next stitch.`,
    );
    assert.equal(sourceAndWorkResult.substitutionCount, 1);
  }

  for (const sourceLine of [
    "Root path: /patterns/dc/tr/example",
    "Relative path: ../patterns/htr/draft.txt",
    "Windows path: C:\\patterns\\dc\\draft.txt",
    "UNC path: \\\\server\\patterns\\tr\\draft.txt",
  ]) {
    const sourceAndWork = `${sourceLine}\nRnd. 2: Work dc in next stitch.`;
    const sourceAndWorkResult = decodeVintagePattern(sourceAndWork, "uk");
    assert.equal(
      sourceAndWorkResult.output,
      `${sourceLine}\nRnd. 2: Work single crochet (sc) in next stitch.`,
      sourceLine,
    );
    assert.equal(sourceAndWorkResult.substitutionCount, 1, sourceLine);
  }
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected strong source isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("smart closing punctuation stays ordinary content in source values", () => {
  for (const sourceValue of ["Maker’s Guide", "Maker”s Guide", "Maker’s “Guide”"]) {
    const input = `dc stitch: "Miss 1 tr."; Source: ${sourceValue}; Work htr in next stitch.`;
    const expected = `dc stitch: "Miss 1 tr."; Source: ${sourceValue}; Work half double crochet (hdc) in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, convention === "uk" ? expected : input);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("escaped delimiters still select bounded source-record isolation", () => {
  for (const sourceValue of [
    "Maker\\'s Guide",
    "Maker\\\"s Guide",
    "Maker\\`s Guide",
    "Maker\\“s Guide",
    "Maker\\‘s Guide",
  ]) {
    const input = `dc stitch: "Miss 1 tr."; Source: ${sourceValue}; Work htr in next stitch.`;
    const expected = `dc stitch: "Miss 1 tr."; Source: ${sourceValue}; Work half double crochet (hdc) in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, convention === "uk" ? expected : input);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("escaped source separators honor backslash parity", () => {
  for (const separator of [" ", "\t", "\u00a0"]) {
    for (const backslashCount of [0, 1, 2, 3, 4]) {
      const backslashes = "\\".repeat(backslashCount);
      const sourcePrefix = `Source: Book${backslashes}`;
      const sourceOwnedWork = "Work dc in next stitch";
      const input = `fan stitch: "Miss 1 tr."; ${sourcePrefix};${separator}${sourceOwnedWork}; Work htr in next stitch.`;
      const escapedSeparator = backslashCount % 2 === 1;
      const expected = escapedSeparator
          ? `fan stitch: "Miss 1 tr."; ${sourcePrefix};${separator}${sourceOwnedWork}; Work half double crochet (hdc) in next stitch.`
          : `fan stitch: "Miss 1 tr."; ${sourcePrefix};${separator}Work single crochet (sc) in next stitch; Work half double crochet (hdc) in next stitch.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk" ? expected : input,
          JSON.stringify({ separator, backslashCount, convention }),
        );
        assert.equal(
          result.substitutionCount,
          convention === "uk" ? (escapedSeparator ? 1 : 2) : 0,
        );
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("quoted-definition release separators honor backslash parity", () => {
  const definitions = [
    'fan stitch: "Miss 1 tr."',
    'dc stitch: **"Miss 1 tr."**',
    'dc stitch = "Miss 1 tr."',
  ];
  for (const definition of definitions) {
    for (const separator of [" ", "\t", "\u00a0"]) {
      for (const backslashCount of [0, 1, 2, 3, 4]) {
        const backslashes = "\\".repeat(backslashCount);
        const input = `${definition}${backslashes};${separator}Work htr in next stitch.`;
        const escapedSeparator = backslashCount % 2 === 1;
        const converted = escapedSeparator
          ? input
          : `${definition}${backslashes};${separator}Work half double crochet (hdc) in next stitch.`;
        for (const convention of ["uk", "unknown", "us"]) {
          const result = decodeVintagePattern(input, convention);
          const label = JSON.stringify({ definition, separator, backslashCount, convention });
          assert.equal(result.status, "ready", label);
          assert.equal(result.output, convention === "uk" ? converted : input, label);
          assert.equal(
            result.substitutionCount,
            convention === "uk" && !escapedSeparator ? 1 : 0,
            label,
          );
          assert.deepEqual(
            result.signals.map(({ title }) => title),
            convention === "unknown" && !escapedSeparator
              ? ["Crochet convention not established"]
              : [],
            label,
          );
          assert.equal(
            result.segments.map((segment) => (
              segment.type === "sub" ? segment.original : segment.content
            )).join(""),
            input,
            label,
          );
        }
      }
    }
  }
});

test("source labels inside Markdown code cannot split neighboring instructions", () => {
  for (const delimiter of ["`", "``", "```"]) {
    const opaqueWork = `Work ${delimiter}htr; Source: dc; q${delimiter} in next stitch`;
    const input = `fan stitch: "Miss 1 tr."; ${opaqueWork}; Work dc in next stitch.`;
    const expected = `fan stitch: "Miss 1 tr."; ${opaqueWork}; Work single crochet (sc) in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, convention === "uk" ? expected : input);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("unclosed inline backtick runs remain literal before source records", () => {
  for (const delimiter of ["`", "``", "```"]) {
    const input = `dc stitch: "Miss 1 tr."; Note ${delimiter}unclosed; Source: archive; Work htr in next stitch.`;
    const expected = `dc stitch: "Miss 1 tr."; Note ${delimiter}unclosed; Source: archive; Work half double crochet (hdc) in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, convention === "uk" ? expected : input);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("source-looking labels inside protected markup cannot split neighboring instructions", () => {
  const cases = [
    {
      input: 'fan stitch: "Miss 1 tr."; Work [htr](https://x.test/a "x; Source: dc; q") in next stitch; Work dc in next stitch.',
      expected: 'fan stitch: "Miss 1 tr."; Work [half double crochet (hdc)](https://x.test/a "x; Source: dc; q") in next stitch; Work single crochet (sc) in next stitch.',
      substitutionCount: 2,
    },
    {
      input: 'fan stitch: "Miss 1 tr."; Work [htr][x; Source: dc; q] in next stitch; Work dc in next stitch.',
      expected: 'fan stitch: "Miss 1 tr."; Work [half double crochet (hdc)][x; Source: dc; q] in next stitch; Work single crochet (sc) in next stitch.',
      substitutionCount: 2,
    },
    {
      input: 'fan stitch: "Miss 1 tr."; Work <span title="x; Source: dc; q">htr</span> in next stitch; Work dc in next stitch.',
      expected: 'fan stitch: "Miss 1 tr."; Work <span title="x; Source: dc; q">htr</span> in next stitch; Work single crochet (sc) in next stitch.',
      substitutionCount: 1,
    },
    {
      input: 'fan stitch: "Miss 1 tr."; Work <code>htr; Source: dc; q</code> in next stitch; Work dc in next stitch.',
      expected: 'fan stitch: "Miss 1 tr."; Work <code>htr; Source: dc; q</code> in next stitch; Work single crochet (sc) in next stitch.',
      substitutionCount: 1,
    },
  ];
  for (const { input, expected, substitutionCount } of cases) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, convention === "uk" ? expected : input);
      assert.equal(result.substitutionCount, convention === "uk" ? substitutionCount : 0);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("source records remain authoritative when their values contain protected markup", () => {
  const sourceRecord = 'Source: [Maker](https://x.test/a "x; Work dc in next stitch")';
  const input = `dc stitch: "Miss 1 tr."; ${sourceRecord}; Work htr in next stitch.`;
  const expected = `dc stitch: "Miss 1 tr."; ${sourceRecord}; Work half double crochet (hdc) in next stitch.`;
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(input, convention);
    assert.equal(result.output, convention === "uk" ? expected : input);
    assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
    assert.deepEqual(
      result.signals.map(({ title }) => title),
      convention === "unknown" ? ["Crochet convention not established"] : [],
    );
    assert.equal(
      result.segments.map((segment) => (
        segment.type === "sub" ? segment.original : segment.content
      )).join(""),
      input,
    );
  }
});

test("spaced absolute paths remain intact without turning instruction slashes into paths", () => {
  const startedAt = performance.now();
  for (const path of [
    "C:\\Archive dc\\tr htr pattern.txt",
    "/home/me/Archive dc/tr htr pattern.txt",
    "../Archive dc/tr htr pattern.txt",
    "\\\\server\\share\\Archive dc\\tr htr pattern.txt",
  ]) {
    const input = `${path}\nRow 1: dc.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, `${path}\nRow 1: single crochet (sc).`, path);
    assert.equal(result.substitutionCount, 1, path);
  }
  const pathElapsed = performance.now() - startedAt;
  assert.ok(pathElapsed < 2_000, `expected whole-line path isolation under 2,000 ms, received ${pathElapsed.toFixed(1)} ms`);

  const instruction = "Row 1: dc/tr; work htr. See note.txt";
  const instructionStartedAt = performance.now();
  const instructionResult = decodeVintagePattern(instruction, "uk");
  assert.equal(
    instructionResult.output,
    "Row 1: single crochet (sc)/double crochet (dc); work half double crochet (hdc). See note.txt",
  );
  assert.equal(instructionResult.substitutionCount, 3);
  const instructionElapsed = performance.now() - instructionStartedAt;
  assert.ok(instructionElapsed < 2_000, `expected slash/Work instruction under 2,000 ms, received ${instructionElapsed.toFixed(1)} ms`);
});

test("HTML raw-text elements remain byte-preserved while following instructions convert", () => {
  const startedAt = performance.now();
  const input = [
    "<script>const note = \"Work dc in next stitch\";</script>",
    "<style>.dc { content: \"tr in next stitch\"; }</style>",
    "Row 1: htr.",
  ].join("\n");
  const result = decodeVintagePattern(input, "uk");

  assert.equal(
    result.output,
    [
      "<script>const note = \"Work dc in next stitch\";</script>",
      "<style>.dc { content: \"tr in next stitch\"; }</style>",
      "Row 1: half double crochet (hdc).",
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 1);
  const elapsed = performance.now() - startedAt;
  assert.ok(elapsed < 2_000, `expected raw-text isolation under 2,000 ms, received ${elapsed.toFixed(1)} ms`);

  for (const eol of ["\n", "\r\n"]) {
    for (const rawLine of [
      "<code>dc/tr</code>",
      "<pre>Work htr in next stitch.</pre>",
      "<script>const note = \"Work dc in next stitch\";</script>",
      "<style>.dc { content: \"tr\"; }</style>",
    ]) {
      for (const rawFirst of [false, true]) {
        const instruction = "Rnd. 2: Work dc in next stitch.";
        const mappedInstruction = "Rnd. 2: Work single crochet (sc) in next stitch.";
        const candidate = rawFirst
          ? `${rawLine}${eol}${instruction}`
          : `${instruction}${eol}${rawLine}`;
        const expected = rawFirst
          ? `${rawLine}${eol}${mappedInstruction}`
          : `${mappedInstruction}${eol}${rawLine}`;
        const candidateStartedAt = performance.now();
        const candidateResult = decodeVintagePattern(candidate, "uk");
        assert.equal(candidateResult.output, expected, candidate);
        assert.equal(candidateResult.substitutionCount, 1, candidate);
        const candidateElapsed = performance.now() - candidateStartedAt;
        assert.ok(
          candidateElapsed < 2_000,
          `expected raw-text order isolation under 2,000 ms, received ${candidateElapsed.toFixed(1)} ms`,
        );
      }
    }
  }
});

test("line-wrapped stitch phrases convert atomically only in instruction contexts", () => {
  const instruction = [
    "Row 1: treble\ncrochet.",
    "Row 2: double\ncrochet in next stitch.",
    "Row 3: double treble\ncrochet.",
    "Row 4: half treble\ncrochet.",
    "Row 5: double crochet\n(dc) in next stitch.",
  ].join("\n");
  const result = decodeVintagePattern(instruction, "uk");
  assert.equal(
    result.output,
    [
      "Row 1: double crochet (dc).",
      "Row 2: single crochet (sc) in next stitch.",
      "Row 3: treble crochet (tr).",
      "Row 4: half double crochet (hdc).",
      "Row 5: single crochet (sc) in next stitch.",
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 5);

  const prose = "A discussion of double\ntreble crochet in history.";
  const metadata = "Publisher: Double crochet\n(dc).\nTitle: Half treble\ncrochet.";
  assert.equal(decodeVintagePattern(prose, "uk").output, prose);
  assert.equal(decodeVintagePattern(metadata, "uk").output, metadata);
});

test("bounded imperatives and side-qualified rows convert while prose examples remain unchanged", () => {
  const instructions = [
    "Crochet DC.",
    "Start DC.",
    "Use DC in the next stitch.",
    "- 3 DC.",
    "1. 3 DC.",
    "Work double crochet in next stitch.",
    "Continue double crochet in next stitch.",
    "Row 1 RS: dc.",
    "Row 2 right side: tr.",
    "WS Row 3: htr.",
  ].join("\n");
  const instructionResult = decodeVintagePattern(instructions, "uk");
  assert.equal(instructionResult.substitutionCount, 10);
  assert.equal(
    instructionResult.output,
    [
      "Crochet single crochet (sc).",
      "Start single crochet (sc).",
      "Use single crochet (sc) in the next stitch.",
      "- 3 single crochet (sc).",
      "1. 3 single crochet (sc).",
      "Work single crochet (sc) in next stitch.",
      "Continue single crochet (sc) in next stitch.",
      "Row 1 RS: single crochet (sc).",
      "Row 2 right side: double crochet (dc).",
      "WS Row 3: half double crochet (hdc).",
    ].join("\n"),
  );

  const proseCases = [
    "The office is in DC in the next building.",
    "Travel to DC on the following day.",
    "Travel to DC in the next row.",
    "DC is used as an abbreviation for District of Columbia.",
    "TR is commonly used in addresses.",
    "The DC is used in this code.",
    "dc and tr are abbreviations.",
    "dc, tr, and htr are UK terms.",
    "dc and tr have different meanings.",
    "dc and tr appear in the glossary.",
    "dc and tr both occur in this paragraph.",
    "dc and tr also appear in the glossary.",
    "dc and tr commonly refer to stitches.",
    "dc and tr usually mean different stitches.",
    "dc and tr simply look similar.",
    "dc and tr (but not htr) are abbreviations.",
    "dc and tr, unlike htr, have different meanings.",
    "dc and tr (UK terms) appear here.",
    "dc and tr, for example, appear here.",
    "dc and tr differ between systems.",
    "dc and tr vary by convention.",
    "dc and tr indicate stitches.",
    "dc and tr represent abbreviations.",
    "dc and tr stand for stitches.",
    "dc and tr correspond to different stitches.",
    "dc and tr require context.",
    "dc and tr depend on convention.",
    "A history of dc.",
    "An explanation of dc.",
    "Examples of dc abbreviations.",
    "A discussion of tr in old books.",
    "A guide to dc.",
    "An article on dc.",
    "A discussion around dc.",
    "Research into dc.",
    "A chapter with dc.",
    "A comparison between dc and tr.",
    "Notes on dc and tr.",
    "A list of dc and tr.",
    "The meaning of dc and tr.",
    "Use dc as a label.",
    "Make dc the example.",
    "Place dc in the title.",
    "Start dc in the documentation.",
    "Work dc into the sentence.",
    "Repeat dc in the glossary.",
    "Skip dc in this discussion.",
    "Continue dc as the label.",
    "I saw dc, tr, and htr.",
    "The glossary lists dc, tr, and htr.",
    "Examples include dc, tr, and htr.",
    "This article discusses dc, tr, and htr.",
    "A note mentions dc and tr.",
    "The book uses dc and tr.",
    "The labels dc/tr/htr are abbreviations.",
    "We compare double crochet, treble crochet, and half treble crochet.",
    "Examples: dc, tr, htr.",
    "Example — dc, tr, htr.",
    "Example = dc, tr, htr.",
    "The examples are: dc, tr, htr.",
    "List: dc, tr, htr.",
    "For example (dc, tr, htr).",
    "Examples include (dc, tr, htr).",
    "A note [dc, tr, htr] appears here.",
    "I saw (dc).",
    "I saw {dc}.",
    "I saw [dc](https://example.test).",
    "I saw *dc*.",
    "Use *dc* as a label.",
    "Work _dc_ into the sentence.",
    "Make **tr** the example.",
    "Repeat *htr* in the glossary.",
    "Use [dc](https://x.test) as a label.",
    "Use (dc) as a label.",
    "Work [dc] into the sentence.",
    "Make {tr} the example.",
    "Repeat (htr) in the glossary.",
    "Work double crochet into the sentence.",
    "Use (treble crochet) as a label.",
    "Use *double crochet* as a label.",
    "double crochet and treble crochet have different meanings.",
  ];
  for (const prose of proseCases) {
    const proseResult = decodeVintagePattern(prose, "uk");
    assert.equal(proseResult.output, prose, prose);
    assert.equal(proseResult.substitutionCount, 0, prose);
  }

  const passive = "dc is always worked into the next stitch.\nRow 1: dc in next stitch.";
  assert.equal(decodeVintagePattern(passive, "uk").substitutionCount, 2);
  assert.equal(
    decodeVintagePattern("DC is worked into the next stitch.", "uk").output,
    "single crochet (sc) is worked into the next stitch.",
  );
  assert.equal(
    decodeVintagePattern("Use dc in the next stitch. Work tr across. Make htr. Repeat dtr twice.", "uk").substitutionCount,
    4,
  );
});

test("Markdown instruction formatting maps visible terms without touching code fences", () => {
  const formatted = [
    "Row 1: __dc__.",
    "Row 2: _tr_.",
    "**Row 3:** dc.",
    "__Row 4:__ tr.",
    "> Row 5: dc.",
    "- Row 6: tr.",
    "1. Row 7: dc.",
    "### Row 8: tr.",
    "Row 9→dc.",
  ].join("\n");
  const formattedResult = decodeVintagePattern(formatted, "uk");
  assert.equal(formattedResult.substitutionCount, 9);
  assert.match(formattedResult.output, /Row 1: __single crochet \(sc\)__\./u);
  assert.match(formattedResult.output, /__Row 4:__ double crochet \(dc\)\./u);
  assert.match(formattedResult.output, /Row 9→single crochet \(sc\)\./u);

  const emphasizedInstructions = [
    "*Row 1:* DC.",
    "_Round 2:_ TR.",
    "Work *dc*.",
    "Work **dc**.",
    "Work _dc_.",
    "Use *dc* in next stitch.",
    "Make **tr** in next stitch.",
    "- Work *dc*.",
    "1. Work _tr_.",
    "Use (dc) in next stitch.",
    "Work [tr] across.",
    "Row 3: {dc}.",
    "Work *double crochet* in next stitch.",
    "Row 4: *double crochet*.",
  ].join("\n");
  const emphasizedResult = decodeVintagePattern(emphasizedInstructions, "uk");
  assert.equal(emphasizedResult.substitutionCount, 14);
  assert.match(emphasizedResult.output, /Work \*single crochet \(sc\)\*\./u);
  assert.match(emphasizedResult.output, /Make \*\*double crochet \(dc\)\*\* in next stitch\./u);

  for (const fence of ["```", "~~~"]) {
    const input = [
      `${fence}text`,
      `example ${fence} dc in prose`,
      "tr",
      fence,
      "Row 1: dc.",
    ].join("\n");
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      input.replace("Row 1: dc.", "Row 1: single crochet (sc)."),
      fence,
    );
    assert.equal(result.substitutionCount, 1, fence);
  }

  const inlineCode = "``literal ``` tr``\nRow 1: dc.";
  const inlineResult = decodeVintagePattern(inlineCode, "uk");
  assert.equal(
    inlineResult.output,
    "``literal ``` tr``\nRow 1: single crochet (sc).",
  );
  assert.equal(inlineResult.substitutionCount, 1);

  for (const code of [
    "    Work dc in next stitch.\n\nRow 1: tr.",
    "\tWork dc in next stitch.\nRow 1: tr.",
    ">     Work dc in next stitch.\nRow 1: tr.",
    "> ~~~text\n> Work dc in next stitch.\n> ~~~\nRow 1: tr.",
  ]) {
    const codeResult = decodeVintagePattern(code, "uk");
    assert.equal(codeResult.output, code.replace("Row 1: tr.", "Row 1: double crochet (dc)."), code);
    assert.equal(codeResult.substitutionCount, 1, code);
  }
});

test("complete inline named definitions release later instructions while label-only bodies remain local", () => {
  const complete = "Special stitches:\nPuff stitch: yarn over four times.\n- dc in next stitch.";
  assert.equal(
    decodeVintagePattern(complete, "uk").output,
    "Special stitches:\nPuff stitch: yarn over four times.\n- single crochet (sc) in next stitch.",
  );

  const labelOnly = "Special stitches:\nPuff stitch\n- dc in next stitch.\nBody:\nRow 1: dc.";
  const labelOnlyResult = decodeVintagePattern(labelOnly, "uk");
  assert.equal(
    labelOnlyResult.output,
    "Special stitches:\nPuff stitch\n- dc in next stitch.\nBody:\nRow 1: single crochet (sc).",
  );
  assert.equal(labelOnlyResult.substitutionCount, 1);

  const motif = "Special stitches:\nMotif A:\nWork dc.\nBody:\nRow 1: tr.";
  const motifResult = decodeVintagePattern(motif, "uk");
  assert.equal(
    motifResult.output,
    "Special stitches:\nMotif A:\nWork dc.\nBody:\nRow 1: double crochet (dc).",
  );
  assert.equal(motifResult.substitutionCount, 1);
});

test("a line-wrapped numeric tension heading maps without treating prose as gauge", () => {
  const heading = decodeVintagePattern("## TENSION\r\n20 sts and 24 rows = 4 in", "uk");
  assert.equal(heading.output, "## gauge\r\n20 sts and 24 rows = 4 in");
  assert.equal(heading.substitutionCount, 1);
  assert.equal(decodeVintagePattern("The tension was high.", "uk").output, "The tension was high.");
});

test("repeated named-stitch headers stay within the maximum-input performance bound", () => {
  const input = "Motif\nFan\n".repeat(2_000).slice(0, MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  for (const convention of ["unknown", "uk"]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, convention);
    const elapsed = performance.now() - startedAt;
    assert.equal(result.output, input);
    assert.ok(elapsed < 2_000, `${convention} expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
  }
});

test("quoted source-path tails preserve semantics and offsets within the public input bound", () => {
  const head = 'FilenameX: "dc.";';
  const reconstructInput = (result) => result.segments.map((segment) => (
    segment.type === "sub" ? segment.original : segment.content
  )).join("");
  for (const sourceRecords of [
    "Source: /dc;tr",
    "Path: C:\\dc;tr.txt",
    "Source: https://example.test/dc;tr; Path: C:\\dc;tr.txt",
    "**Source**:\t/dc;tr",
    "Path:\u00a0/😀dc;tr",
    "Path: C:\\Archive dc\\tr.txt",
    "Source: /archive dc/tr.txt",
    "File: pattern.pdf",
    "Document: release_notes 1.pdf",
    "File: README",
    "Source: book citation",
  ]) {
    const tail = ` Work htr in next stitch; ${sourceRecords}; fan stitch: "Miss 1 tr."; Work dc in next stitch.`;
    const convertedTail = ` Work half double crochet (hdc) in next stitch; ${sourceRecords}; fan stitch: "Miss 1 tr."; Work single crochet (sc) in next stitch.`;
    for (const inputLength of [511, 512, 513, 1_024, MAX_VINTAGE_PATTERN_TEXT_LENGTH]) {
      const padding = " ".repeat(inputLength - head.length - tail.length);
      const input = `${head}${padding}${tail}`;
      assert.equal(input.length, inputLength);
      for (const convention of ["uk", "unknown", "us"]) {
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk" ? `${head}${padding}${convertedTail}` : input,
          JSON.stringify({ sourceRecords, inputLength, convention }),
        );
        assert.equal(result.substitutionCount, convention === "uk" ? 2 : 0);
        assert.equal(reconstructInput(result), input);
        assert.ok(
          performance.now() - startedAt < 2_000,
          JSON.stringify({ sourceRecords, inputLength, convention }),
        );
      }
    }
  }
});

test("released quoted definitions isolate source paths between outside Work clauses", () => {
  for (const [definitionLead, definitionClose] of [
    ['fan stitch: "', '"'],
    ["fan stitch: '", "'"],
    ["fan stitch: “", "”"],
  ]) {
    for (const sourceRecord of [
      "Path: C:\\dc;tr.txt",
      "File: C:\\dc;tr.txt",
      "Windows path: C:\\dc;tr.txt",
      "Source: /dc;tr",
      "Path: C:\\Archive dc\\tr.txt",
      "File: pattern.pdf",
      "File: README",
      "Source: book citation",
    ]) {
      const definition = `${definitionLead}Miss 1 tr.${definitionClose}`;
      for (const [tail, expectedTail, expectedCount] of [
        [
          `${sourceRecord}; Work htr in next stitch.`,
          `${sourceRecord}; Work half double crochet (hdc) in next stitch.`,
          1,
        ],
        [
          `Work htr in next stitch; ${sourceRecord}.`,
          `Work half double crochet (hdc) in next stitch; ${sourceRecord}.`,
          1,
        ],
        [
          `Work htr in next stitch; ${sourceRecord}; Work dc in next stitch.`,
          `Work half double crochet (hdc) in next stitch; ${sourceRecord}; Work single crochet (sc) in next stitch.`,
          2,
        ],
      ]) {
        const input = `${definition}; ${tail}`;
        const expected = `${definition}; ${expectedTail}`;
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, expected, JSON.stringify({ definition, sourceRecord, tail }));
        assert.equal(result.substitutionCount, expectedCount);
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
        assert.ok(performance.now() - startedAt < 2_000);

        for (const convention of ["unknown", "us"]) {
          const preservedStartedAt = performance.now();
          const preserved = decodeVintagePattern(input, convention);
          assert.equal(preserved.output, input, convention);
          assert.equal(preserved.substitutionCount, 0, convention);
          assert.ok(
            performance.now() - preservedStartedAt < 2_000,
            JSON.stringify({ definition, sourceRecord, tail, convention }),
          );
        }
      }
    }
  }
});

test("released quoted definitions preserve valid linked Work after source paths", () => {
  for (const definition of [
    'fan stitch: "Miss 1 tr."',
    "fan stitch: 'Miss 1 tr.'",
    "fan stitch: “Miss 1 tr.”",
  ]) {
    for (const sourceRecord of [
      "Source: /dc;tr",
      "Path: C:\\dc;tr.txt",
      "Path: C:\\Archive dc\\tr.txt",
      "File: pattern.pdf",
      "File: README",
    ]) {
      for (const [work, convertedWork] of [
        ["Work [dc](a) in next stitch.", "Work [single crochet (sc)](a) in next stitch."],
        ["Work [tr][ref] in next stitch.", "Work [double crochet (dc)][ref] in next stitch."],
      ]) {
        const input = `${definition}; ${sourceRecord}; ${work}`;
        const result = decodeVintagePattern(input, "uk");
        assert.equal(result.output, `${definition}; ${sourceRecord}; ${convertedWork}`);
        assert.equal(result.substitutionCount, 1);
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );

        const unknown = decodeVintagePattern(input, "unknown");
        assert.equal(unknown.output, input);
        assert.equal(unknown.substitutionCount, 0);
        assert.deepEqual(
          unknown.signals.map(({ title }) => title),
          ["Crochet convention not established"],
        );

        const us = decodeVintagePattern(input, "us");
        assert.equal(us.output, input);
        assert.equal(us.substitutionCount, 0);
        assert.deepEqual(us.signals, []);
      }
    }
  }
});

test("reference-link punctuation inside released source values cannot hide later Work", () => {
  for (const definition of [
    'fan stitch: "Miss 1 tr."',
    'dc stitch: "Miss 1 tr."',
  ]) {
    for (const sourceLabel of ["Source", "Path", "File"]) {
      for (const punctuation of [";", ".", "!", "?"]) {
        for (const lineBreak of ["\n", "\r\n"]) {
          for (const definitionFirst of [true, false]) {
            const instruction = `${definition}; ${sourceLabel}: [Maker${punctuation} note][ref]; Work htr in next stitch.`;
            const convertedInstruction = `${definition}; ${sourceLabel}: [Maker${punctuation} note][ref]; Work half double crochet (hdc) in next stitch.`;
            const reference = "[ref]: /x";
            const input = definitionFirst
              ? `${instruction}${lineBreak}${reference}`
              : `${reference}${lineBreak}${instruction}`;
            const converted = definitionFirst
              ? `${convertedInstruction}${lineBreak}${reference}`
              : `${reference}${lineBreak}${convertedInstruction}`;
            for (const convention of ["uk", "unknown", "us"]) {
              const result = decodeVintagePattern(input, convention);
              const label = JSON.stringify({
                definition,
                sourceLabel,
                punctuation,
                lineBreak,
                definitionFirst,
                convention,
              });
              assert.equal(result.status, "ready", label);
              assert.equal(result.output, convention === "uk" ? converted : input, label);
              assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, label);
              assert.deepEqual(
                result.signals.map(({ title }) => title),
                convention === "unknown" ? ["Crochet convention not established"] : [],
                label,
              );
              assert.equal(
                result.segments.map((segment) => (
                  segment.type === "sub" ? segment.original : segment.content
                )).join(""),
                input,
                label,
              );
            }
          }
        }
      }
    }
  }
});

test("released source links keep reference and image forms structurally opaque", () => {
  const cases = [
    { use: "[Maker; note][ref]", reference: "[ref]: /x" },
    { use: "[Maker; note][]", reference: "[Maker; note]: /x" },
    { use: "[Maker; note]", reference: "[Maker; note]: /x" },
    { use: "![Maker; note][ref]", reference: "[ref]: /x" },
    { use: "![Maker; note][]", reference: "[Maker; note]: /x" },
    { use: "![Maker; note]", reference: "[Maker; note]: /x" },
  ];
  for (const { use, reference } of cases) {
    const instruction = `fan stitch: "Miss 1 tr."; Source: ${use}; Work htr in next stitch.`;
    const convertedInstruction = `fan stitch: "Miss 1 tr."; Source: ${use}; Work half double crochet (hdc) in next stitch.`;
    for (const lineBreak of ["\n", "\r\n"]) {
      for (const gap of [lineBreak, lineBreak.repeat(2), `${lineBreak}   ${lineBreak}`]) {
        for (const definitionFirst of [true, false]) {
          const input = definitionFirst
            ? `${instruction}${gap}${reference}`
            : `${reference}${gap}${instruction}`;
          const converted = definitionFirst
            ? `${convertedInstruction}${gap}${reference}`
            : `${reference}${gap}${convertedInstruction}`;
          for (const convention of ["uk", "unknown", "us"]) {
            const result = decodeVintagePattern(input, convention);
            const label = JSON.stringify({ use, gap, definitionFirst, convention });
            assert.equal(result.output, convention === "uk" ? converted : input, label);
            assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, label);
            assert.deepEqual(
              result.signals.map(({ title }) => title),
              convention === "unknown" ? ["Crochet convention not established"] : [],
              label,
            );
            assert.equal(
              result.segments.map((segment) => (
                segment.type === "sub" ? segment.original : segment.content
              )).join(""),
              input,
              label,
            );
          }
        }
      }
    }
  }
});

test("unrelated reference definitions cannot change a released source-link decision", () => {
  const instruction = 'fan stitch: "Miss 1 tr."; Source: [Maker; note][ref]; Work htr in next stitch.';
  const convertedInstruction = 'fan stitch: "Miss 1 tr."; Source: [Maker; note][ref]; Work half double crochet (hdc) in next stitch.';
  const reference = "[ref]: /x";
  const unrelated = "[other tr]: /dc";
  const permutations = [
    [instruction, reference, unrelated],
    [instruction, unrelated, reference],
    [reference, instruction, unrelated],
    [reference, unrelated, instruction],
    [unrelated, instruction, reference],
    [unrelated, reference, instruction],
  ];
  for (const lineBreak of ["\n", "\r\n"]) {
    for (const lines of permutations) {
      const input = lines.join(lineBreak);
      const converted = lines.map((line) => (
        line === instruction ? convertedInstruction : line
      )).join(lineBreak);
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        const label = JSON.stringify({ lineBreak, lines, convention });
        assert.equal(result.status, "ready", label);
        assert.equal(result.output, convention === "uk" ? converted : input, label);
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, label);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
          label,
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
          label,
        );
      }
    }
  }
});

test("harmless prose placement cannot change a released source-link decision", () => {
  const instruction = 'fan stitch: "Miss 1 tr."; Source: [Maker; note][ref]; Work htr in next stitch.';
  const convertedInstruction = 'fan stitch: "Miss 1 tr."; Source: [Maker; note][ref]; Work half double crochet (hdc) in next stitch.';
  const reference = "[ref]: /x";
  for (const context of [
    "This discussion stays prose.",
    "Notes",
    "# Notes",
    "Body:",
    "<!-- editorial comment -->",
  ]) {
    for (const lineBreak of ["\n", "\r\n"]) {
      for (let contextIndex = 0; contextIndex <= 2; contextIndex += 1) {
        const lines = [instruction, reference];
        lines.splice(contextIndex, 0, context);
        const input = lines.join(lineBreak);
        const converted = lines.map((line) => (
          line === instruction ? convertedInstruction : line
        )).join(lineBreak);
        for (const convention of ["uk", "unknown", "us"]) {
          const result = decodeVintagePattern(input, convention);
          const label = JSON.stringify({ context, lineBreak, contextIndex, convention });
          assert.equal(result.status, "ready", label);
          assert.equal(result.output, convention === "uk" ? converted : input, label);
          assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, label);
          assert.deepEqual(
            result.signals.map(({ title }) => title),
            convention === "unknown" ? ["Crochet convention not established"] : [],
            label,
          );
          assert.equal(
            result.segments.map((segment) => (
              segment.type === "sub" ? segment.original : segment.content
            )).join(""),
            input,
            label,
          );
        }
      }
    }
  }
});

test("released reference documents retain independent Work lines", () => {
  const sourceInstruction = 'fan stitch: "Miss 1 tr."; Source: [Maker; note][ref]; Work htr in next stitch.';
  const convertedSourceInstruction = 'fan stitch: "Miss 1 tr."; Source: [Maker; note][ref]; Work half double crochet (hdc) in next stitch.';
  const independentInstruction = "Work tr in next stitch.";
  const convertedIndependentInstruction = "Work double crochet (dc) in next stitch.";
  const reference = "[ref]: /x";
  for (const lineBreak of ["\n", "\r\n"]) {
    for (const lines of [
      [sourceInstruction, reference, independentInstruction],
      [sourceInstruction, independentInstruction, reference],
      [reference, sourceInstruction, independentInstruction],
      [reference, independentInstruction, sourceInstruction],
      [independentInstruction, sourceInstruction, reference],
      [independentInstruction, reference, sourceInstruction],
    ]) {
      const input = lines.join(lineBreak);
      const converted = lines.map((line) => {
        if (line === sourceInstruction) return convertedSourceInstruction;
        if (line === independentInstruction) return convertedIndependentInstruction;
        return line;
      }).join(lineBreak);
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        const label = JSON.stringify({ lineBreak, lines, convention });
        assert.equal(result.status, "ready", label);
        assert.equal(result.output, convention === "uk" ? converted : input, label);
        assert.equal(result.substitutionCount, convention === "uk" ? 2 : 0, label);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
          label,
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
          label,
        );
      }
    }
  }
});

test("released multiline source regions retain independent Work lines", () => {
  const sourceInstruction = 'fan stitch: "Miss 1 tr."; Source: (Maker; note); Work htr in next stitch.';
  const convertedSourceInstruction = 'fan stitch: "Miss 1 tr."; Source: (Maker; note); Work half double crochet (hdc) in next stitch.';
  const independentInstruction = "Work tr in next stitch.";
  const convertedIndependentInstruction = "Work double crochet (dc) in next stitch.";
  const notes = "Notes";
  for (const lineBreak of ["\n", "\r\n"]) {
    for (const lines of [
      [sourceInstruction, independentInstruction, notes],
      [sourceInstruction, notes, independentInstruction],
      [independentInstruction, sourceInstruction, notes],
      [independentInstruction, notes, sourceInstruction],
      [notes, sourceInstruction, independentInstruction],
      [notes, independentInstruction, sourceInstruction],
    ]) {
      const input = lines.join(lineBreak);
      const converted = lines.map((line) => {
        if (line === sourceInstruction) return convertedSourceInstruction;
        if (line === independentInstruction) return convertedIndependentInstruction;
        return line;
      }).join(lineBreak);
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        const label = JSON.stringify({ lineBreak, lines, convention });
        assert.equal(result.status, "ready", label);
        assert.equal(result.output, convention === "uk" ? converted : input, label);
        assert.equal(result.substitutionCount, convention === "uk" ? 2 : 0, label);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
          label,
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
          label,
        );
      }
    }
  }
});

test("balanced parenthesized source values cannot hide a later Work clause", () => {
  const sourceValues = [
    "(Maker; note)",
    "(Maker (archive; card); note)",
    "(Maker; note) revised edition",
  ];
  for (const definition of [
    'fan stitch: "Miss 1 tr."',
    'dc stitch: "Miss 1 tr."',
  ]) {
    for (const sourceLabel of ["Source", "Path", "File"]) {
      for (const sourceValue of sourceValues) {
        for (const separator of [" ", "\t", "\u00a0"]) {
          const input = `${definition}; ${sourceLabel}: ${sourceValue};${separator}Work htr in next stitch.`;
          const converted = `${definition}; ${sourceLabel}: ${sourceValue};${separator}Work half double crochet (hdc) in next stitch.`;
          for (const convention of ["uk", "unknown", "us"]) {
            const result = decodeVintagePattern(input, convention);
            const label = JSON.stringify({
              definition,
              sourceLabel,
              sourceValue,
              separator,
              convention,
            });
            assert.equal(result.status, "ready", label);
            assert.equal(result.output, convention === "uk" ? converted : input, label);
            assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, label);
            assert.deepEqual(
              result.signals.map(({ title }) => title),
              convention === "unknown" ? ["Crochet convention not established"] : [],
              label,
            );
            assert.equal(
              result.segments.map((segment) => (
                segment.type === "sub" ? segment.original : segment.content
              )).join(""),
              input,
              label,
            );
          }
        }
      }
    }
  }

  for (const malformed of [
    'fan stitch: "Miss 1 tr."; Source: (Maker; note; Work htr in next stitch.',
    'fan stitch: "Miss 1 tr."; Source: Maker; note); Work htr in next stitch.',
  ]) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(malformed, convention);
      assert.equal(result.output, malformed, `${malformed}: ${convention}`);
      assert.equal(result.substitutionCount, 0, `${malformed}: ${convention}`);
      assert.deepEqual(result.signals, [], `${malformed}: ${convention}`);
    }
  }
});

test("balanced parenthetical asides cannot split custom-definition Work clauses", () => {
  for (const aside of [
    "(note; more)",
    "(note (archive; card); more)",
    "(note. more)",
    "(note! more)",
    "(note? more)",
  ]) {
    const denied = `Work tr ${aside} and dc in next stitch`;
    const input = `dc stitch: "Miss 1 tr."; ${denied}; Work htr in next stitch.`;
    const converted = `dc stitch: "Miss 1 tr."; ${denied}; Work half double crochet (hdc) in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.status, "ready", `${aside}: ${convention}`);
      assert.equal(result.output, convention === "uk" ? converted : input, `${aside}: ${convention}`);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, `${aside}: ${convention}`);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
        `${aside}: ${convention}`,
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
        `${aside}: ${convention}`,
      );
    }
  }

  const isolated = 'dc stitch: "Miss 1 tr."; Work tr (note; more) and dc in next stitch.';
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(isolated, convention);
    assert.equal(result.output, isolated, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, [], convention);
  }
});

test("line-leading source records remain wholly opaque across embedded quoted definitions", () => {
  for (const sourceLead of [
    "Source: /dc;tr",
    "  Path: C:\\dc;tr.txt",
    "> Source: /dc;tr",
    "File: archive",
  ]) {
    for (const quotedDefinition of [
      'dc stitch: "Miss 1 tr."',
      "dc stitch: 'Miss 1 tr.'",
      "dc stitch: “Miss 1 tr.”",
    ]) {
      const input = `${sourceLead}; Work htr in next stitch; ${quotedDefinition}; Work dc in next stitch.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, input, JSON.stringify({ sourceLead, quotedDefinition, convention }));
        assert.equal(result.substitutionCount, 0);
        assert.deepEqual(result.signals, []);
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("source paths do not widen a neighboring malformed Markdown clause denial", () => {
  const malformedClause = 'Work [dc](https://x/a "unclosed title) and tr in next stitch.';
  for (const sourceRecord of ["Source: /dc;tr", "Path: C:\\dc;tr.txt"]) {
    for (const [input, expected] of [
      [
        `${malformedClause} Work htr in next stitch; ${sourceRecord}`,
        `${malformedClause} Work half double crochet (hdc) in next stitch; ${sourceRecord}`,
      ],
      [
        `${malformedClause.slice(0, -1)}; ${sourceRecord}; Work htr in next stitch.`,
        `${malformedClause.slice(0, -1)}; ${sourceRecord}; Work half double crochet (hdc) in next stitch.`,
      ],
    ]) {
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, convention === "uk" ? expected : input, convention);
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("released quoted definitions keep same-line source spacing out of Markdown code semantics", () => {
  const malformedWork = 'Work [dc](https://x/a "unclosed title) and tr in next stitch';
  for (const gap of [" ", "   ", "    ", "\t", "\u00a0"]) {
    for (const sourceRecord of ["Source: /😀dc;tr", "Path: C:\\😀dc;tr.txt"]) {
      const input = `dc stitch: "Miss 1 tr.";${gap}${sourceRecord}; ${malformedWork}; Work htr in next stitch.`;
      const expected = `dc stitch: "Miss 1 tr.";${gap}${sourceRecord}; ${malformedWork}; Work half double crochet (hdc) in next stitch.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, convention === "uk" ? expected : input, JSON.stringify({ gap, sourceRecord, convention }));
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("safe source-record separators preserve valid Work on both sides", () => {
  for (const separator of [" ", "\t", "\u00a0", "   "]) {
    for (const sourceRecord of ["Source: dc file", "Path: C:\\Archive dc\\tr.txt"]) {
      const input = `fan stitch: "Miss 1 tr."; Work htr in next stitch; ${sourceRecord};${separator}Work dc in next stitch.`;
      const expected = `fan stitch: "Miss 1 tr."; Work half double crochet (hdc) in next stitch; ${sourceRecord};${separator}Work single crochet (sc) in next stitch.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(result.output, convention === "uk" ? expected : input, JSON.stringify({ separator, sourceRecord, convention }));
        assert.equal(result.substitutionCount, convention === "uk" ? 2 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("Unicode space separators isolate malformed source-neighbor clauses", () => {
  const malformedWork = 'Work [dc](a "x) in next stitch';
  for (const separator of ["\u00a0", "\u2003", "\u3000"]) {
    for (const sourceRecord of ["File: x", "Source: /dc;tr"]) {
      const input = `dc stitch: "Miss 1 tr."; ${sourceRecord};${separator}${malformedWork};${separator}Work htr in next stitch.`;
      const expected = `dc stitch: "Miss 1 tr."; ${sourceRecord};${separator}${malformedWork};${separator}Work half double crochet (hdc) in next stitch.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk" ? expected : input,
          JSON.stringify({ separator, sourceRecord, convention }),
        );
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("quoted source values preserve stable decisions across fast-path thresholds", () => {
  const head = 'FilenameX: "dc.";';
  for (const sourceValue of [
    "[dc;tr",
    "dc];tr",
    "*dc;tr",
    "_dc;tr",
    "dc\u200dtr",
    "not-a-path;dc;tr",
    "/dc_[x];tr",
    '\"/dc;tr',
    "`/dc;tr",
    "</dc;tr",
  ]) {
    const tail = ` Work htr in next stitch; Source: ${sourceValue}; fan stitch: "Miss 1 tr."; Work dc in next stitch.`;
    let expectedSuffix;
    let expectedCount;
    for (const inputLength of [511, 512, 513, 1_024]) {
      const padding = " ".repeat(inputLength - head.length - tail.length);
      const input = `${head}${padding}${tail}`;
      const result = decodeVintagePattern(input, "uk");
      const suffix = result.output.slice(head.length + padding.length);
      expectedSuffix ??= suffix;
      expectedCount ??= result.substitutionCount;
      assert.equal(suffix, expectedSuffix, JSON.stringify({ sourceValue, inputLength }));
      assert.equal(result.substitutionCount, expectedCount);
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("strong source records isolate unsafe markup within the public performance bound", () => {
  const head = 'FilenameX: "dc."; Work htr in next stitch; File: ';
  const suffix = '; fan stitch: "Miss 1 tr."; Work dc in next stitch.';
  for (const marker of ["<dc;tr", "[dc;tr", "/dc_[x];tr", "dc\u200dtr", "`/dc;tr"]) {
    for (const inputLength of [511, 512, 513, 4_096, MAX_VINTAGE_PATTERN_TEXT_LENGTH]) {
      const value = `${"a".repeat(inputLength - head.length - suffix.length - marker.length)}${marker}`;
      const input = `${head}${value}${suffix}`;
      assert.equal(input.length, inputLength);
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      assert.equal(result.substitutionCount, 2, JSON.stringify({ marker, inputLength }));
      assert.equal(
        result.output,
        `FilenameX: "dc."; Work half double crochet (hdc) in next stitch; File: ${value}; fan stitch: "Miss 1 tr."; Work single crochet (sc) in next stitch.`,
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
      assert.ok(
        performance.now() - startedAt < 2_000,
        JSON.stringify({ marker, inputLength }),
      );
    }
  }
});

test("protected Markdown metadata does not consume visible source-term density", () => {
  for (const unit of [
    '![dc stitch:"tr";](img);',
    '[x](u "dc stitch:\'tr\';");',
  ]) {
    for (const metadataCount of [64, 65]) {
      const protectedPrefix = unit.repeat(metadataCount);
      const input = `${protectedPrefix}\nWork htr in next stitch.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk"
            ? `${protectedPrefix}\nWork half double crochet (hdc) in next stitch.`
            : input,
          `${JSON.stringify(unit)}: ${metadataCount}: ${convention}`,
        );
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("Markdown destination brackets do not alter quoted-definition ownership", () => {
  for (const title of ["title [", "title [x]"]) {
    const input = `fan stitch: 'Miss 1 [tr](https://x/a "${title}").' Work dc in next stitch.\nNotes`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, input, `${JSON.stringify(title)}: ${convention}`);
      assert.equal(result.substitutionCount, 0);
      assert.deepEqual(result.substitutions, []);
      assert.deepEqual(result.signals, []);
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("maximum-length protected Markdown metadata stays bounded and byte-stable", () => {
  const head = 'FilenameX: "dc."; Work htr in next stitch; ';
  const tail = '; File: README; fan stitch: "Miss 1 tr."; Work dc in next stitch.';
  const validHead = 'FilenameX: "dc."; Work half double crochet (hdc) in next stitch; ';
  const validTail = '; File: README; fan stitch: "Miss 1 tr."; Work single crochet (sc) in next stitch.';
  const cases = [
    { label: "inline link", unit: '[note](https://x/a "t; Source: archive") ', valid: true },
    { label: "reference use", unit: "[note][t; Source: archive] ", valid: true },
    {
      label: "overlapping markup",
      unit: '[note](https://x/a "<b>`t; Source: archive`</b>") ',
      valid: true,
    },
    {
      label: "closing parenthesis inside title",
      unit: '[note](https://x/a "title ) remains; Source: archive") ',
      valid: true,
    },
    {
      label: "nested destination",
      unit: '[note](https://x/a(b(c)d)e "t; Source: archive") ',
      valid: true,
    },
    {
      label: "link-shaped text inside title",
      unit: '[note](https://x/a "[x](y); Source: archive") ',
      valid: true,
    },
    {
      label: "image",
      unit: '![note](https://x/a "t; Source: archive") ',
      valid: true,
    },
    {
      label: "unclosed title",
      unit: '[note](https://x/a "t; Source: archive) ',
      valid: false,
    },
  ];

  for (const { label, unit, valid } of cases) {
    const available = MAX_VINTAGE_PATTERN_TEXT_LENGTH - head.length - tail.length;
    let body = "";
    while (body.length + unit.length <= available) body += unit;
    body += " ".repeat(available - body.length);
    const input = `${head}${body}${tail}`;
    assert.equal(input.length, MAX_VINTAGE_PATTERN_TEXT_LENGTH);

    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, convention);
      const elapsed = performance.now() - startedAt;
      assert.equal(
        result.output,
        valid && convention === "uk" ? `${validHead}${body}${validTail}` : input,
        `${label}: ${convention}`,
      );
      assert.equal(
        result.substitutionCount,
        valid && convention === "uk" ? 2 : 0,
        `${label}: ${convention}`,
      );
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        valid && convention === "unknown"
          ? ["Crochet convention not established"]
          : [],
        `${label}: ${convention}`,
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
        `${label}: ${convention}`,
      );
      assert.ok(
        elapsed < 2_000,
        `${label}: ${convention} expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`,
      );
    }
  }
});

test("protected Markdown metadata keeps named definition signals invariant across parser ceilings", () => {
  const head = 'FilenameX: "dc."; Work htr in next stitch; ';
  const tail = '; File: README; fan stitch: "Miss 1 tr."; Work dc in next stitch.';
  const convertedHead = 'FilenameX: "dc."; Work half double crochet (hdc) in next stitch; ';
  const convertedTail = '; File: README; fan stitch: "Miss 1 tr."; Work single crochet (sc) in next stitch.';
  const units = [
    ["inline link", '[note](https://x/a "t; Source: archive") '],
    ["reference use", "[note][t; Source: archive] "],
    ["overlapping markup", '[note](https://x/a "<b>`t; Source: archive`</b>") '],
  ];
  const assertInvariant = (label, body, input) => {
    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, convention);
      const elapsed = performance.now() - startedAt;
      assert.equal(result.status, "ready", `${label}: ${convention}`);
      assert.equal(
        result.output,
        convention === "uk" ? `${convertedHead}${body}${convertedTail}` : input,
        `${label}: ${convention}`,
      );
      assert.equal(
        result.substitutionCount,
        convention === "uk" ? 2 : 0,
        `${label}: ${convention}`,
      );
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
        `${label}: ${convention}`,
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
        `${label}: ${convention}`,
      );
      assert.ok(
        elapsed < 2_000,
        `${label}: ${convention} expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`,
      );
    }
  };

  for (const [unitLabel, unit] of units) {
    for (const inputLength of [511, 512, 513, 2_048, 2_049, 4_095, 4_096, 4_097, MAX_VINTAGE_PATTERN_TEXT_LENGTH]) {
      const available = inputLength - head.length - tail.length;
      const repetitions = Math.floor(available / unit.length);
      const body = `${unit.repeat(repetitions)}${" ".repeat(
        available - repetitions * unit.length,
      )}`;
      const input = `${head}${body}${tail}`;
      assert.equal(input.length, inputLength, `${unitLabel}: ${inputLength}`);
      assertInvariant(`${unitLabel}: ${inputLength}`, body, input);
    }
  }

  const inlineUnit = units[0][1];
  for (const count of [63, 64, 65]) {
    const body = inlineUnit.repeat(count);
    assertInvariant(`inline link count ${count}`, body, `${head}${body}${tail}`);
  }
});

test("definition-first protected metadata retains fail-closed released-tail routing", () => {
  const input = 'dc stitch: "Miss 1 tr.";\t[note](https://x/a "t; Source: archive");\u00a0Document: release_notes 1.pdf;\tWork dc and tr in next stitch;\u00a0[note](https://x/a "t; Source: archive").';
  for (const convention of ["uk", "unknown", "us"]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, convention);
    const elapsed = performance.now() - startedAt;
    assert.equal(result.status, "ready", convention);
    assert.equal(result.output, input, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.substitutions, [], convention);
    assert.deepEqual(result.signals, [], convention);
    assert.deepEqual(result.segments, [{ type: "text", content: input }], convention);
    assert.ok(
      elapsed < 2_000,
      `${convention} expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`,
    );
  }
});

test("definition-first protected metadata keeps multiple released Work clauses bounded", () => {
  const input = 'dc stitch: "Miss 1 tr."; [note](https://x/a "t; Source: archive"); Document: release_notes 1.pdf; Work htr in next stitch; Work tr in next stitch; [note](https://x/a "t; Source: archive").';
  const converted = 'dc stitch: "Miss 1 tr."; [note](https://x/a "t; Source: archive"); Document: release_notes 1.pdf; Work half double crochet (hdc) in next stitch; Work double crochet (dc) in next stitch; [note](https://x/a "t; Source: archive").';

  for (const convention of ["uk", "unknown", "us"]) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, convention);
    const elapsed = performance.now() - startedAt;
    assert.equal(result.status, "ready", convention);
    assert.equal(result.output, convention === "uk" ? converted : input, convention);
    assert.equal(result.substitutionCount, convention === "uk" ? 2 : 0, convention);
    assert.deepEqual(
      result.signals.map(({ title }) => title),
      convention === "unknown" ? ["Crochet convention not established"] : [],
      convention,
    );
    assert.equal(
      result.segments.map((segment) => (
        segment.type === "sub" ? segment.original : segment.content
      )).join(""),
      input,
      convention,
    );
    assert.ok(
      elapsed < 2_000,
      `${convention} expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`,
    );
  }
});

test("custom quoted definitions isolate only affected wrapped Work clauses", () => {
  const prefix = 'dc stitch: "Miss 1 tr."; [note](https://x/a "t; Source: archive"); Document: release_notes 1.pdf; ';
  const suffix = ' [note](https://x/a "t; Source: archive").';
  const lfFiller = Array(63).fill("x").join("\n");
  const crlfFiller = Array(63).fill("x").join("\r\n");
  const overflowingCustomLine = `${Array(65).fill("Work dc in next stitch").join("; ")}.`;
  const cases = [
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; Work htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; Work half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; This discussion stays prose; Work htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; This discussion stays prose; Work half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc and tr in next stitch; Work htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work dc and tr in next stitch; Work half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work [dc; tr](a) in next stitch; Work htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work [dc; tr](a) in next stitch; Work half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work tr ("note; split") and dc in next stitch; Work htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work tr ("note; split") and dc in next stitch; Work half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work tr <!-- x; y -->and dc in next stitch; Work htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work tr <!-- x; y -->and dc in next stitch; Work half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work tr ![x; y][img] and dc in next stitch; Work htr in next stitch.\n[img]: /x',
      converted: 'dc stitch: "Miss 1 tr."; Work tr ![x; y][img] and dc in next stitch; Work half double crochet (hdc) in next stitch.\n[img]: /x',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Source: archive\\\\; Work tr in next stitch; Work dc in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Source: archive\\\\; Work double crochet (dc) in next stitch; Work dc in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc in next stitch;\u00a0Work htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work dc in next stitch;\u00a0Work half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc in next stitch;\nWork htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work dc in next stitch;\nWork half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc in next stitch.\r\nWork htr in next stitch.',
      converted: 'dc stitch: "Miss 1 tr."; Work dc in next stitch.\r\nWork half double crochet (hdc) in next stitch.',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; Work htr in next stitch.\nNotes',
      converted: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; Work half double crochet (hdc) in next stitch.\nNotes',
    },
    {
      input: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; Work htr in next stitch.\r\n# Notes',
      converted: 'dc stitch: "Miss 1 tr."; Work dc in next stitch; Work half double crochet (hdc) in next stitch.\r\n# Notes',
    },
    {
      input: `dc stitch: "Miss 1 tr."; Work dc in next stitch;\n${lfFiller}\nWork htr in next stitch.`,
      converted: `dc stitch: "Miss 1 tr."; Work dc in next stitch;\n${lfFiller}\nWork half double crochet (hdc) in next stitch.`,
    },
    {
      input: `dc stitch: "Miss 1 tr."; Work dc in next stitch;\r\n${crlfFiller}\r\nWork htr in next stitch.`,
      converted: `dc stitch: "Miss 1 tr."; Work dc in next stitch;\r\n${crlfFiller}\r\nWork half double crochet (hdc) in next stitch.`,
    },
    {
      input: `dc stitch: "Miss 1 tr."; ${overflowingCustomLine}\nWork htr in next stitch.`,
      converted: `dc stitch: "Miss 1 tr."; ${overflowingCustomLine}\nWork half double crochet (hdc) in next stitch.`,
    },
    {
      input: `dc stitch: "Miss 1 tr."; ${overflowingCustomLine}\r\nWork htr in next stitch.`,
      converted: `dc stitch: "Miss 1 tr."; ${overflowingCustomLine}\r\nWork half double crochet (hdc) in next stitch.`,
    },
    {
      input: `${prefix}Work htr in next stitch;${suffix}`,
      converted: `${prefix}Work half double crochet (hdc) in next stitch;${suffix}`,
    },
    {
      input: `${prefix}Work dc and tr in next stitch; Work htr in next stitch;${suffix}`,
      converted: `${prefix}Work dc and tr in next stitch; Work half double crochet (hdc) in next stitch;${suffix}`,
    },
  ];

  for (const { input, converted } of cases) {
    for (const convention of ["uk", "unknown", "us"]) {
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.status, "ready", convention);
      assert.equal(result.output, convention === "uk" ? converted : input, convention);
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
        convention,
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
        convention,
      );
      assert.ok(performance.now() - startedAt < 2_000, convention);
    }
  }
});

test("custom quoted definitions do not create convention signals by themselves", () => {
  const inputs = [
    'dc stitch: "Miss 1 tr."; Work dc in next stitch.',
    'dc stitch: "Miss 1 tr."; Work [dc; tr](a) in next stitch.',
    'dc stitch: "Miss 1 tr."; Work tr ("note; split") and dc in next stitch.',
    'dc stitch: "Miss 1 tr."; Work tr <!-- x; y -->and dc in next stitch.',
    'dc stitch: "Miss 1 tr."; Work tr ![x; y][img] and dc in next stitch.\n[img]: /x',
    'dc stitch: "Miss 1 tr."; Work tr [x; y][ref] and dc in next stitch.\n[ref]: /x',
    'dc stitch: "Miss 1 tr."; Work tr ![x; y][] and dc in next stitch.\n[x; y]: /x',
    'dc stitch: "Miss 1 tr."; Work tr ![x; y] and dc in next stitch.\n[x; y]: /x',
    'dc stitch: "Miss 1 tr."; Source: archive\\; Work tr in next stitch; Work dc in next stitch.',
  ];

  for (const input of inputs) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.status, "ready", convention);
      assert.equal(result.output, input, convention);
      assert.equal(result.substitutionCount, 0, convention);
      assert.deepEqual(result.substitutions, [], convention);
      assert.deepEqual(result.signals, [], convention);
      assert.deepEqual(result.segments, [{ type: "text", content: input }], convention);
    }
  }
});

test("protected metadata between quoted definitions retains established middle-region routing", () => {
  const input = 'dc stitch: "Miss 1 tr."; [note](https://x/a "t; Source: archive"); Document: release_notes 1.pdf; Work dc and tr in next stitch; [note](https://x/a "t; Source: archive"); fan stitch: "Miss 1 tr."; Work htr in next stitch.';
  const converted = 'dc stitch: "Miss 1 tr."; [note](https://x/a "t; Source: archive"); Document: release_notes 1.pdf; Work dc and tr in next stitch; [note](https://x/a "t; Source: archive"); fan stitch: "Miss 1 tr."; Work half double crochet (hdc) in next stitch.';
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(input, convention);
    assert.equal(result.status, "ready", convention);
    assert.equal(result.output, convention === "uk" ? converted : input, convention);
    assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0, convention);
    assert.deepEqual(
      result.signals.map(({ title }) => title),
      convention === "unknown" ? ["Crochet convention not established"] : [],
      convention,
    );
    assert.equal(
      result.segments.map((segment) => (
        segment.type === "sub" ? segment.original : segment.content
      )).join(""),
      input,
      convention,
    );
  }
});

test("multiline named quoted definitions require an explicit same-line release separator", () => {
  const definition = 'fan stitch: "Miss 1 tr."';
  const cases = [
    {
      label: "same-line tail stays owned without a semicolon",
      input: `${definition} Work htr in next stitch.\nNotes`,
      converted: `${definition} Work htr in next stitch.\nNotes`,
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "same-line semicolon releases Work",
      input: `${definition}; Work htr in next stitch.\nNotes`,
      converted: `${definition}; Work half double crochet (hdc) in next stitch.\nNotes`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "same-line tabs around a semicolon release Work",
      input: `${definition}\t;\tWork htr in next stitch.\nNotes`,
      converted: `${definition}\t;\tWork half double crochet (hdc) in next stitch.\nNotes`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "same-line wide spacing after a semicolon releases Work",
      input: `${definition};    Work htr in next stitch.\nNotes`,
      converted: `${definition};    Work half double crochet (hdc) in next stitch.\nNotes`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "a tab-indented code line remains opaque after a definition",
      input: `${definition};\n\tWork htr in next stitch.`,
      converted: `${definition};\n\tWork htr in next stitch.`,
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "a space-indented code line remains opaque after a definition",
      input: `${definition};\n    Work htr in next stitch.`,
      converted: `${definition};\n    Work htr in next stitch.`,
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "a new line releases Work",
      input: `${definition}\nWork htr in next stitch.`,
      converted: `${definition}\nWork half double crochet (hdc) in next stitch.`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "only a later line is released",
      input: `${definition} Work htr in next stitch.\nWork dc in next stitch.`,
      converted: `${definition} Work htr in next stitch.\nWork single crochet (sc) in next stitch.`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "a later same-line semicolon releases only what follows it",
      input: `${definition} Work htr in next stitch; Work dc in next stitch.\nNotes`,
      converted: `${definition} Work htr in next stitch; Work single crochet (sc) in next stitch.\nNotes`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "emphasis does not implicitly release the definition tail",
      input: 'dc stitch: **"Miss 1 tr."** Work htr in next stitch.\nNotes',
      converted: 'dc stitch: **"Miss 1 tr."** Work htr in next stitch.\nNotes',
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "a semicolon after emphasized definition text releases Work",
      input: 'dc stitch: **"Miss 1 tr."**; Work htr in next stitch.\nNotes',
      converted: 'dc stitch: **"Miss 1 tr."**; Work half double crochet (hdc) in next stitch.\nNotes',
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "equals definition tail stays owned without a semicolon",
      input: 'dc stitch = "Miss 1 tr." Work htr in next stitch.\nNotes',
      converted: 'dc stitch = "Miss 1 tr." Work htr in next stitch.\nNotes',
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "dash definition tail stays owned without a semicolon",
      input: 'dc stitch — "Miss 1 tr." Work htr in next stitch.\nNotes',
      converted: 'dc stitch — "Miss 1 tr." Work htr in next stitch.\nNotes',
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "word definition tail stays owned without a semicolon",
      input: 'dc stitch means "Miss 1 tr." Work htr in next stitch.\nNotes',
      converted: 'dc stitch means "Miss 1 tr." Work htr in next stitch.\nNotes',
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "overlapping definitions own the line until their release semicolon",
      input: 'dc stitch: "Miss 1 tr.". fan stitch: "Miss 1 dc."; Work htr in next stitch.\nNotes',
      converted: 'dc stitch: "Miss 1 tr.". fan stitch: "Miss 1 dc."; Work half double crochet (hdc) in next stitch.\nNotes',
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "an instruction before the owned definition tail remains released",
      input: `Work htr in next stitch. ${definition} Work dc in next stitch.\nNotes`,
      converted: `Work half double crochet (hdc) in next stitch. ${definition} Work dc in next stitch.\nNotes`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "three leading spaces do not create an indented code block",
      input: `   ${definition}; Work htr in next stitch.\nNotes`,
      converted: `   ${definition}; Work half double crochet (hdc) in next stitch.\nNotes`,
      ukCount: 1,
      unknownSignals: ["Crochet convention not established"],
    },
    {
      label: "four leading spaces keep the complete line opaque as code",
      input: `    ${definition}; Work htr in next stitch.\nNotes`,
      converted: `    ${definition}; Work htr in next stitch.\nNotes`,
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "a leading tab keeps the complete line opaque as code",
      input: `\t${definition}; Work htr in next stitch.\nNotes`,
      converted: `\t${definition}; Work htr in next stitch.\nNotes`,
      ukCount: 0,
      unknownSignals: [],
    },
    {
      label: "blockquote-indented code keeps the complete line opaque",
      input: `>     ${definition}; Work htr in next stitch.\nNotes`,
      converted: `>     ${definition}; Work htr in next stitch.\nNotes`,
      ukCount: 0,
      unknownSignals: [],
    },
  ];

  for (const { label, input, converted, ukCount, unknownSignals } of cases) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.status, "ready", `${label}: ${convention}`);
      assert.equal(
        result.output,
        convention === "uk" ? converted : input,
        `${label}: ${convention}`,
      );
      assert.equal(
        result.substitutionCount,
        convention === "uk" ? ukCount : 0,
        `${label}: ${convention}`,
      );
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? unknownSignals : [],
        `${label}: ${convention}`,
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
        `${label}: ${convention}`,
      );
    }
  }
});

test("quoted-definition boundary overflow stays atomic when another line has a valid record", () => {
  const definition = 'Wave stitch: "dc."; ';
  const overflowLine = `${definition.repeat(65)}Work htr in next stitch.`;
  const protectedInput = `${overflowLine}\nFan stitch: "Miss 1 tr.";`;

  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(protectedInput, convention);
    assert.equal(result.status, "ready", convention);
    assert.equal(result.output, protectedInput, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.substitutions, [], convention);
    assert.deepEqual(result.signals, [], convention);
    assert.equal(
      result.segments.map((segment) => (
        segment.type === "sub" ? segment.original : segment.content
      )).join(""),
      protectedInput,
      convention,
    );
  }

  for (const separator of ["\n", "\r\n"]) {
    for (const definitionFirst of [true, false]) {
      const work = "Work dc in next stitch.";
      const input = definitionFirst
        ? `${overflowLine}${separator}${work}`
        : `${work}${separator}${overflowLine}`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk"
            ? input.replace(work, "Work single crochet (sc) in next stitch.")
            : input,
          `${JSON.stringify(separator)}: ${definitionFirst}: ${convention}`,
        );
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("quoted-definition syntax inside code ranges remains fully opaque", () => {
  const protectedCases = [
    '```\ndc stitch: "Miss 1 tr."; Work dc in next stitch.\n```\nNotes',
    '~~~\ndc stitch: "Miss 1 tr."; Work dc in next stitch.\n~~~\nNotes',
    '```\ndc stitch: "Miss 1 tr."; Work dc in next stitch.\nNotes',
    '> ```\n> dc stitch: "Miss 1 tr."; Work dc in next stitch.\n> ```\nNotes',
    '`dc stitch: "Miss 1 tr."; Work dc in next stitch.`\nNotes',
    '<code>dc stitch: "Miss 1 tr."; Work dc in next stitch.</code>',
    '<pre>dc stitch: "Miss 1 tr."; Work dc in next stitch.</pre>',
    '<!-- dc stitch: "Miss 1 tr."; Work dc in next stitch. -->',
  ];
  for (const input of protectedCases) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(result.output, input, `${convention}: ${JSON.stringify(input)}`);
      assert.equal(result.substitutionCount, 0, convention);
      assert.deepEqual(result.substitutions, [], convention);
      assert.deepEqual(result.signals, [], convention);
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
        convention,
      );
    }
  }

  const releasedCases = [
    '`dc stitch: "Miss 1 tr."`; Work htr in next stitch.',
    '<code>dc stitch: "Miss 1 tr."</code>; Work htr in next stitch.',
    '<!-- dc stitch: "Miss 1 tr." -->; Work htr in next stitch.',
    '```\ndc stitch: "Miss 1 tr."\n```\nWork htr in next stitch.',
    '    dc stitch: "Miss 1 tr."\nWork htr in next stitch.',
    'dc stitch: "Miss 1 tr."\n```\nfan stitch: "Miss 1 dc."; Work dc in next stitch.\n```\nWork htr in next stitch.',
    'dc stitch: "Miss 1 tr."\nBefore `fan stitch: "Miss 1 dc."; Work dc in next stitch.` after.\nWork htr in next stitch.',
  ];
  for (const input of releasedCases) {
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(
        result.output,
        convention === "uk"
          ? input.replace(
            /Work htr in next stitch\.$/u,
            "Work half double crochet (hdc) in next stitch.",
          )
          : input,
        convention,
      );
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }

  for (const inlineCodeCount of [64, 65]) {
    const protectedPrefix = '`dc stitch:"tr"`;'.repeat(inlineCodeCount);
    const input = `${protectedPrefix}\nWork htr in next stitch.`;
    for (const convention of ["uk", "unknown", "us"]) {
      const result = decodeVintagePattern(input, convention);
      assert.equal(
        result.output,
        convention === "uk"
          ? `${protectedPrefix}\nWork half double crochet (hdc) in next stitch.`
          : input,
        `${convention}: ${inlineCodeCount}`,
      );
      assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
      assert.deepEqual(
        result.signals.map(({ title }) => title),
        convention === "unknown" ? ["Crochet convention not established"] : [],
      );
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
    }
  }
});

test("malformed inline-link complexity is capped per physical line", () => {
  const unit = '[note](https://x/a "t; Source: archive) ';
  const buildLine = (count) => (
    `Work htr in next stitch; ${unit.repeat(count)}; Work dc in next stitch.`
  );
  const atLimit = buildLine(64);
  const overLimit = buildLine(65);
  const splitAcrossLines = `${buildLine(64)}\n${buildLine(64)}`;

  for (const convention of ["uk", "unknown", "us"]) {
    const atLimitResult = decodeVintagePattern(atLimit, convention);
    assert.equal(atLimitResult.substitutionCount, convention === "uk" ? 1 : 0, convention);
    assert.deepEqual(
      atLimitResult.signals.map(({ title }) => title),
      convention === "unknown" ? ["Crochet convention not established"] : [],
      convention,
    );

    const overLimitResult = decodeVintagePattern(overLimit, convention);
    assert.equal(overLimitResult.output, overLimit, convention);
    assert.equal(overLimitResult.substitutionCount, 0, convention);
    assert.deepEqual(overLimitResult.signals, [], convention);

    const splitResult = decodeVintagePattern(splitAcrossLines, convention);
    assert.equal(splitResult.substitutionCount, convention === "uk" ? 2 : 0, convention);
    assert.deepEqual(
      splitResult.signals.map(({ title }) => title),
      convention === "unknown" ? ["Crochet convention not established"] : [],
      convention,
    );
  }
});

test("dense protected metadata falls back atomically for every nonempty clause", () => {
  const metadata = '[note](https://x/a "t; Source: archive") '.repeat(65);
  const prefix = `FilenameX: "dc."; Work htr in next stitch; ${metadata}; `;
  const cases = [
    {
      label: "malformed linked command",
      suffix: 'Work [htr](https://x/a "unclosed) and tr in next stitch; Work dc in next stitch.',
      substitutionCount: 0,
      expectedTail: null,
      signals: [],
    },
    {
      label: "prose clause",
      suffix: "This discussion stays prose; Work dc in next stitch.",
      substitutionCount: 2,
      expectedTail: "This discussion stays prose; Work single crochet (sc) in next stitch.",
      signals: [],
    },
    {
      label: "definition clause",
      suffix: 'fan stitch: "Miss 1 tr."; Work dc in next stitch.',
      substitutionCount: 2,
      expectedTail: 'fan stitch: "Miss 1 tr."; Work single crochet (sc) in next stitch.',
      signals: [],
    },
    {
      label: "visible linked command",
      suffix: 'Work [htr](https://x/a "title") in next stitch; Work dc in next stitch.',
      substitutionCount: 3,
      expectedTail: 'Work [half double crochet (hdc)](https://x/a "title") in next stitch; Work single crochet (sc) in next stitch.',
      signals: [],
    },
  ];

  for (const {
    label,
    suffix,
    substitutionCount,
    expectedTail,
    signals,
  } of cases) {
    const input = `${prefix}${suffix}`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.substitutionCount, substitutionCount, label);
    if (expectedTail === null) {
      assert.equal(result.output, input, label);
    } else {
      assert.ok(
        result.output.startsWith(
          'FilenameX: "dc."; Work half double crochet (hdc) in next stitch; ',
        ),
        label,
      );
      assert.ok(result.output.endsWith(expectedTail), label);
    }
    assert.deepEqual(result.signals.map(({ title }) => title), signals, label);
    assert.equal(
      result.segments.map((segment) => (
        segment.type === "sub" ? segment.original : segment.content
      )).join(""),
      input,
      label,
    );
  }
});

test("an unclosed metadata link cannot manufacture a review signal", () => {
  const input = 'Work htr in next stitch; [note](https://x/a "unclosed; Source: z) Miss 1 tr.';
  for (const convention of ["uk", "unknown", "us"]) {
    const result = decodeVintagePattern(input, convention);
    assert.equal(result.output, input, convention);
    assert.equal(result.substitutionCount, 0, convention);
    assert.deepEqual(result.signals, [], convention);
    assert.equal(
      result.segments.map((segment) => (
        segment.type === "sub" ? segment.original : segment.content
      )).join(""),
      input,
      convention,
    );
  }
});

test("backtick source values cannot expose source instructions", () => {
  for (const sourceRecord of [
    "File: `archive; Work dc in next stitch.`",
    'File: "archive `code`; Work dc in next stitch."',
    'File: `archive "note; Work dc in next stitch."`',
  ]) {
    const input = `dc stitch: "Miss 1 tr."; ${sourceRecord}; Work htr in next stitch.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(
      result.output,
      `dc stitch: "Miss 1 tr."; ${sourceRecord}; Work half double crochet (hdc) in next stitch.`,
    );
    assert.equal(result.substitutionCount, 1);
    assert.equal(
      result.segments.map((segment) => (
        segment.type === "sub" ? segment.original : segment.content
      )).join(""),
      input,
    );
  }
});

test("backslashes stay literal while closing source code spans", () => {
  for (const delimiterLength of [1, 2, 3]) {
    const delimiter = "`".repeat(delimiterLength);
    for (const backslashCount of [1, 2, 3, 4]) {
      const sourceRecord = `Source: ${delimiter}Book${"\\".repeat(backslashCount)}${delimiter}`;
      const note = `Note: ${delimiter}tail${delimiter}`;
      const input = `fan stitch: "Miss 1 tr."; ${sourceRecord}; Work dc in next stitch; ${note}; Work htr in next stitch.`;
      const expected = `fan stitch: "Miss 1 tr."; ${sourceRecord}; Work single crochet (sc) in next stitch; ${note}; Work half double crochet (hdc) in next stitch.`;
      for (const convention of ["uk", "unknown", "us"]) {
        const result = decodeVintagePattern(input, convention);
        assert.equal(
          result.output,
          convention === "uk" ? expected : input,
          JSON.stringify({ delimiterLength, backslashCount, convention }),
        );
        assert.equal(result.substitutionCount, convention === "uk" ? 2 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(
          result.segments.map((segment) => (
            segment.type === "sub" ? segment.original : segment.content
          )).join(""),
          input,
        );
      }
    }
  }
});

test("quoted source-path record chains fail closed at the segment ceiling", () => {
  for (const lead of ['Note: "Miss 1 dc.";', "“Miss 1 dc.”;"]) {
    for (const recordCount of [63, 64, 65]) {
      const sourceRecords = Array.from(
        { length: recordCount },
        (_, index) => `Source: /r${index}/a;b`,
      ).join("; ");
      const input = `${lead} Work htr in next stitch; ${sourceRecords}; fan stitch: "Miss 1 tr."; Work dc in next stitch.`;
      const startedAt = performance.now();
      const result = decodeVintagePattern(input, "uk");
      const withinSegmentCeiling = recordCount <= 63;
      assert.equal(result.substitutionCount, withinSegmentCeiling ? 2 : 1);
      assert.equal(result.output.includes("single crochet (sc) stitch:"), false);
      assert.equal(
        result.output.includes("Work half double crochet (hdc) in next stitch;"),
        withinSegmentCeiling,
      );
      assert.equal(result.output.endsWith("Work single crochet (sc) in next stitch."), true);
      assert.equal(
        result.segments.map((segment) => (
          segment.type === "sub" ? segment.original : segment.content
        )).join(""),
        input,
      );
      assert.ok(
        performance.now() - startedAt < 2_000,
        JSON.stringify({ lead, recordCount }),
      );
    }
  }
});

test("maximum-length quoted record chains stay bounded across separator padding", () => {
  const record = 'FilenameX: "dc."';
  const finalInstruction = "Work htr in next stitch.";
  const expectedFinalInstruction = "Work half double crochet (hdc) in next stitch.";
  const reconstructInput = (result) => result.segments.map((segment) => (
    segment.type === "sub" ? segment.original : segment.content
  )).join("");

  for (const recordCount of [63, 64]) {
    const paddingLength = MAX_VINTAGE_PATTERN_TEXT_LENGTH
      - (recordCount * (record.length + 1))
      - finalInstruction.length;
    const sharedPadding = Math.floor(paddingLength / recordCount);
    const extraPadding = paddingLength % recordCount;
    for (const paddingPosition of ["before", "after"]) {
      let input = "";
      for (let index = 0; index < recordCount; index += 1) {
        const padding = " ".repeat(sharedPadding + (index < extraPadding ? 1 : 0));
        input += paddingPosition === "before"
          ? `${record}${padding};`
          : `${record};${padding}`;
      }
      input += finalInstruction;
      assert.equal(input.length, MAX_VINTAGE_PATTERN_TEXT_LENGTH);

      for (const convention of ["uk", "unknown", "us"]) {
        const startedAt = performance.now();
        const result = decodeVintagePattern(input, convention);
        const elapsed = performance.now() - startedAt;
        assert.equal(
          result.output,
          convention === "uk"
            ? `${input.slice(0, -finalInstruction.length)}${expectedFinalInstruction}`
            : input,
          `${recordCount}: ${paddingPosition}: ${convention}`,
        );
        assert.equal(result.substitutionCount, convention === "uk" ? 1 : 0);
        assert.deepEqual(
          result.signals.map(({ title }) => title),
          convention === "unknown" ? ["Crochet convention not established"] : [],
        );
        assert.equal(reconstructInput(result), input);
        assert.ok(
          elapsed < 2_000,
          `${recordCount}: ${paddingPosition}: ${convention} expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`,
        );
      }
    }
  }
});

test("overlong same-line command chains fail closed without partial conversion", () => {
  const chunk = "Work dc and tr in next stitch; ";
  const input = chunk
    .repeat(Math.ceil(MAX_VINTAGE_PATTERN_TEXT_LENGTH / chunk.length))
    .slice(0, MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
});

test("same-line command segmentation has an atomic 64-command ceiling", () => {
  const validCommand = "Work dc and tr in next stitch";
  for (const commandCount of [63, 64]) {
    const input = `${Array(commandCount).fill(validCommand).join("; ")}.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.substitutionCount, commandCount * 2, `${commandCount} commands`);
  }

  const oversized = `${Array(65).fill(validCommand).join("; ")}.`;
  const oversizedResult = decodeVintagePattern(oversized, "uk");
  assert.equal(oversizedResult.output, oversized);
  assert.equal(oversizedResult.substitutionCount, 0);

  const invalid = "Work dc in first dc, widget, then tr in second dc";
  for (const invalidIndex of [0, 32, 64]) {
    const commands = Array(65).fill("Work htr in next stitch");
    commands[invalidIndex] = invalid;
    const input = `${commands.join(". ")}.`;
    const result = decodeVintagePattern(input, "uk");
    assert.equal(result.output, input, `invalid segment ${invalidIndex + 1}`);
    assert.equal(result.substitutionCount, 0, `invalid segment ${invalidIndex + 1}`);
  }
});

test("per-line source-term density preserves the supported ceiling and denies overflow", () => {
  const eightTermCommand = "Work dc, tr, htr, dtr, double crochet, treble crochet, half treble crochet, and double treble crochet in next stitch";
  const atLimit = `${Array(16).fill(eightTermCommand).join("; ")}.`;
  const atLimitResult = decodeVintagePattern(atLimit, "uk");
  assert.equal(atLimitResult.substitutionCount, 128);

  const overLimit = `${atLimit.slice(0, -1)} dc.`;
  const overLimitResult = decodeVintagePattern(overLimit, "uk");
  assert.equal(overLimitResult.output, overLimit);
  assert.equal(overLimitResult.substitutionCount, 0);
  assert.deepEqual(overLimitResult.signals, []);

  const signalText = " Use No. 9 needles.";
  const oddEscapes = `${"\\dc ".repeat(129)}${signalText}`;
  const oddEscapeResult = decodeVintagePattern(oddEscapes, "unknown");
  assert.deepEqual(oddEscapeResult.signals, []);

  const evenEscapes = `${"\\\\dc ".repeat(129)}${signalText}`;
  const evenEscapeResult = decodeVintagePattern(evenEscapes, "unknown");
  assert.deepEqual(evenEscapeResult.signals, []);

  const splitAcrossLines = `${"dc ".repeat(100)}\r\n${"tr ".repeat(100)}${signalText}`;
  const splitResult = decodeVintagePattern(splitAcrossLines, "unknown");
  assert.ok(splitResult.signals.some(({ title }) => title === "Numbered needle or hook size"));

  const identifierTerms = `${"αdc ".repeat(129)}${signalText}`;
  const identifierResult = decodeVintagePattern(identifierTerms, "unknown");
  assert.deepEqual(identifierResult.signals, []);

  const boundedIdentifiers = `${"αdc ".repeat(128)}${signalText}`;
  const boundedIdentifierResult = decodeVintagePattern(boundedIdentifiers, "unknown");
  assert.ok(
    boundedIdentifierResult.signals.some(({ title }) => title === "Numbered needle or hook size"),
  );

  const unclosedInlineCodeOverflow = `\`${"dc ".repeat(129)}\nWork htr in next stitch.`;
  const unclosedInlineCodeOverflowResult = decodeVintagePattern(
    unclosedInlineCodeOverflow,
    "uk",
  );
  assert.equal(unclosedInlineCodeOverflowResult.output, unclosedInlineCodeOverflow);
  assert.equal(unclosedInlineCodeOverflowResult.substitutionCount, 0);
  assert.deepEqual(unclosedInlineCodeOverflowResult.signals, []);
});

test("input length is accepted at the exact boundary and rejected above it", () => {
  const atLimit = "x".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  const accepted = decodeVintagePattern(atLimit, "unknown");
  const rejected = decodeVintagePattern(`${atLimit}x`, "unknown");

  assert.equal(accepted.status, "ready");
  assert.equal(accepted.output.length, MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  assert.equal(rejected.status, "invalid");
  assert.match(rejected.message, new RegExp(MAX_VINTAGE_PATTERN_TEXT_LENGTH.toLocaleString()));

  const nestedParentheses = "(".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  const nestedResult = decodeVintagePattern(nestedParentheses, "uk");
  assert.equal(nestedResult.status, "ready");
  assert.equal(nestedResult.output, nestedParentheses);
});

test("maximum-length decomposed Unicode input is processed within a bounded time", () => {
  const input = "d\u0301".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH / 2);
  const startedAt = performance.now();
  const result = decodeVintagePattern(input, "uk");
  const elapsed = performance.now() - startedAt;

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.ok(elapsed < 2_000, `expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`);
});

test("maximum-length unmatched Markdown brackets are processed within a bounded time", () => {
  const denseTerms = "dc and tr ".repeat(2_000).slice(0, MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  const cappedBrackets = `${"[".repeat(64)}${denseTerms}`
    .slice(0, MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  const inputs = [
    "[".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH),
    "]".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH),
    "[dc and tr ".repeat(2_000).slice(0, MAX_VINTAGE_PATTERN_TEXT_LENGTH),
    `dc${"[".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH - 2)}`,
    denseTerms,
    cappedBrackets,
  ];
  for (const input of inputs) {
    const startedAt = performance.now();
    const result = decodeVintagePattern(input, "uk");
    const elapsed = performance.now() - startedAt;

    assert.equal(result.status, "ready");
    assert.equal(result.output, input);
    assert.ok(
      elapsed < 2_000,
      `expected under 2,000 ms, received ${elapsed.toFixed(1)} ms`,
    );
  }

  const balanced = Array(80).fill("Work [dc](a) and tr in next stitch.").join("\n");
  const balancedResult = decodeVintagePattern(balanced, "uk");
  assert.equal(balancedResult.substitutionCount, 160);
});

test("blank, non-string, and invalid-convention requests fail closed", () => {
  assert.equal(decodeVintagePattern("   ", "unknown").status, "invalid");
  assert.equal(decodeVintagePattern(null, "unknown").status, "invalid");
  assert.equal(decodeVintagePattern("double crochet", "automatic").status, "invalid");
});

test("possible signals avoid era and origin conclusions", () => {
  const result = decodeVintagePattern(
    "Tension: 20 stitches. Use No. 9 needles and 6 oz wool. Wool forward before next stitch.",
    "unknown",
  );

  assert.equal(result.status, "ready");
  assert.ok(result.signals.length >= 3);
  const signalText = result.signals.map(({ title, note }) => `${title} ${note}`).join(" ");
  assert.doesNotMatch(signalText, /likely|appears to be|originated|19\d{2}s/i);
  assert.match(signalText, /does not establish|does not identify/i);
});

test("numbered-size signals require explicit needle or hook grammar", () => {
  const ordinaryNumbers = decodeVintagePattern(
    "Pattern No. 123. Repeat motif no. 2 three times. Pattern No. 123 uses knitting needles. Catalog No. 4 steel crochet hooks are pictured.",
    "unknown",
  );
  const toolNumbers = decodeVintagePattern(
    "Use No. 9 steel knitting needles. Crochet hook size 4.",
    "unknown",
  );

  assert.equal(ordinaryNumbers.status, "ready");
  assert.equal(toolNumbers.status, "ready");
  assert.equal(
    ordinaryNumbers.signals.some(({ title }) => title === "Numbered needle or hook size"),
    false,
  );
  assert.equal(
    toolNumbers.signals.some(({ title }) => title === "Numbered needle or hook size"),
    true,
  );
});

test("the UI is text-only, bounded, convention-gated, and reports clipboard outcomes", () => {
  const source = fs.readFileSync(
    "src/app/vintage-pattern-decoder/VintagePatternDecoderTool.tsx",
    "utf8",
  );

  assert.match(source, /nextInput\.length > MAX_VINTAGE_PATTERN_TEXT_LENGTH/);
  assert.match(source, /not accepted or stored/);
  assert.match(source, /previous text is unchanged/);
  assert.match(source, /setInputRejected\(false\);[\s\S]*resetResult\(\);/);
  assert.doesNotMatch(
    source.slice(source.indexOf("function resetResult"), source.indexOf("function handleInputChange")),
    /setInputRejected|setError/,
  );
  assert.doesNotMatch(source, /\.slice\([\s\S]*MAX_VINTAGE_PATTERN_TEXT_LENGTH \+ 1/);
  assert.doesNotMatch(source, /const inputTooLong/);
  assert.match(source, /disabled=\{!input\.trim\(\)\}/);
  assert.doesNotMatch(source, /aria-invalid=\{inputRejected\}/);
  const reviewHandler = source.slice(
    source.indexOf("function handleReview"),
    source.indexOf("function handleClear"),
  );
  assert.match(reviewHandler, /setInputRejected\(false\)/);
  assert.match(source, /Unknown \/ not established/);
  assert.match(source, /US terms/);
  assert.match(source, /UK terms/);
  assert.match(source, /await navigator\.clipboard\.writeText/);
  assert.match(source, /copyAttemptRef\.current === attempt/);
  assert.match(source, /key=\{copyFeedback\.attempt\}/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /Could not copy/);
  assert.match(source, /\[overflow-wrap:anywhere\]/);
  assert.match(source, /<h2[^>]*>What this review does<\/h2>/);
  assert.doesNotMatch(source, /<h3[^>]*>What this review does<\/h3>/);
  assert.match(source, /No supported mappings were applied/);
  assert.doesNotMatch(source, /No supported UK terms were found/);
  assert.match(source, /placeholder:text-bark-400/);
  assert.match(source, /hover:bg-amber-700/);
  assert.doesNotMatch(
    fs.readFileSync("src/lib/vintage-pattern-decoder.mjs", "utf8"),
    /stack\.some/,
  );
  assert.match(source, /\{term\.count\}/);
  assert.doesNotMatch(source, /term\.count > 1[\s\S]*?,\s*"/);
  assert.doesNotMatch(
    source,
    /pdfjs|pdf\.js|cdnjs|type="file"|FileReader|getDocument|arrayBuffer|PDFJS_/i,
  );
});

test("public decoder copy states its limited, non-diagnostic boundary", () => {
  const page = fs.readFileSync("src/app/vintage-pattern-decoder/page.tsx", "utf8");
  const content = fs.readFileSync("src/lib/toolContent.ts", "utf8");
  const decoderContent = content.slice(content.indexOf('"vintage-pattern-decoder": {'));
  const faqs = fs.readFileSync("src/lib/faqs.ts", "utf8");
  const tools = fs.readFileSync("src/lib/tools.ts", "utf8");
  const registryEntry = tools.slice(tools.indexOf('slug: "vintage-pattern-decoder"'));
  const decoderFaqs = faqs.slice(
    faqs.indexOf('"vintage-pattern-decoder": ['),
    faqs.indexOf('"fabric-substitute": ['),
  );

  assert.match(page, /Unknown and US modes preserve the text/);
  assert.match(page, /does not validate the pattern or determine its age, origin, sizing, or yarn requirements/);
  assert.match(page, /craftyarncouncil\.com\/standards\/crochet-abbreviations/);
  assert.match(page, /lastUpdated="2026-08-30"/);
  assert.match(page, /Possible Source Signals are limited research prompts and may overlap terms/);
  assert.doesNotMatch(page, /Possible Source Signals stays unchanged/);
  assert.match(decoderContent, /Unknown and US preserve the input exactly/);
  assert.match(registryEntry, /name: "Vintage Pattern Term Review"/);
  assert.match(registryEntry, /shortName: "Term Review"/);
  assert.doesNotMatch(registryEntry, /name: "Vintage Pattern Decoder"|shortName: "Pattern Decoder"/);
  assert.match(decoderFaqs, /does not establish its terminology convention/);
  assert.match(decoderFaqs, /Cast off and bind off name the same finishing operation/);
  assert.doesNotMatch(decoderFaqs, /Treat it as older wording/);
  assert.doesNotMatch(
    `${page}\n${decoderContent}\n${decoderFaqs}`,
    /era detection|translates all|all UK-to-US|most vintage crochet patterns used British|high confidence/i,
  );
});
