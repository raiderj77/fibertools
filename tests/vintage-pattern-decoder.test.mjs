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
  const result = decodeVintagePattern(input, "unknown");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
  assert.deepEqual(result.substitutions, []);
  assert.deepEqual(result.segments, [{ type: "text", content: input }]);
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
  const result = decodeVintagePattern(input, "uk");

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

test("bounded post-target qualifiers remain instruction context", () => {
  const input = [
    "Join to first dc made.",
    "Work in corresponding dc of previous row.",
    "Join to first DC worked!",
    "Join to first treble crochet made, then turn.",
    "Work in corresponding half treble of the next round.",
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
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 5);

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
});

test("spaced absolute paths remain intact without turning instruction slashes into paths", () => {
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

  const instruction = "Row 1: dc/tr; work htr. See note.txt";
  assert.equal(
    decodeVintagePattern(instruction, "uk").output,
    "Row 1: single crochet (sc)/double crochet (dc); work half double crochet (hdc). See note.txt",
  );
});

test("HTML raw-text elements remain byte-preserved while following instructions convert", () => {
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
