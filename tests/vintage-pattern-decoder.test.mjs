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
    "Make a tension square before starting.",
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
      "Make a gauge square before starting.",
    ].join("\n"),
  );
  assert.equal(result.substitutionCount, 4);
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

test("spelled-out terms nested in ordinary prose are preserved conservatively", () => {
  const input = "Work double crochet across, then use treble crochet cluster; keep half double crochet.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
});

test("unsupported compound and attached-count abbreviations are preserved", () => {
  const result = decodeVintagePattern(
    "dc2tog, tr3tog, dtr2tog, 2dc; 3 tr.",
    "uk",
  );

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "dc2tog, tr3tog, dtr2tog, 2dc; 3 double crochet (dc).",
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
  const input = "Work dc in same dc; work tr in second dc from hook; repeat in previous tr; Ch 3 counts as dc; work 1 dc between dc stitches; work 1 dc over dc below.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(
    result.output,
    "Work single crochet (sc) in same single crochet (sc); work double crochet (dc) in second single crochet (sc) from hook; repeat in previous double crochet (dc); Ch 3 counts as single crochet (sc); work 1 single crochet (sc) between single crochet (sc) stitches; work 1 single crochet (sc) over single crochet (sc) below.",
  );
  assert.equal(result.substitutionCount, 10);
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

test("older wording remains unchanged and is reported only as a review clue", () => {
  const input = "Miss one, cast off, work straight, then wool forward.";
  const result = decodeVintagePattern(input, "uk");

  assert.equal(result.status, "ready");
  assert.equal(result.output, input);
  assert.equal(result.substitutionCount, 0);
  assert.ok(result.signals.length >= 2);
});

test("input length is accepted at the exact boundary and rejected above it", () => {
  const atLimit = "x".repeat(MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  const accepted = decodeVintagePattern(atLimit, "unknown");
  const rejected = decodeVintagePattern(`${atLimit}x`, "unknown");

  assert.equal(accepted.status, "ready");
  assert.equal(accepted.output.length, MAX_VINTAGE_PATTERN_TEXT_LENGTH);
  assert.equal(rejected.status, "invalid");
  assert.match(rejected.message, new RegExp(MAX_VINTAGE_PATTERN_TEXT_LENGTH.toLocaleString()));
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
    "Pattern No. 123. Repeat motif no. 2 three times.",
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
  assert.match(source, /inputTooLong/);
  assert.match(source, /disabled=\{!input\.trim\(\) \|\| inputTooLong\}/);
  assert.match(source, /Unknown \/ not established/);
  assert.match(source, /US terms/);
  assert.match(source, /UK terms/);
  assert.match(source, /await navigator\.clipboard\.writeText/);
  assert.match(source, /role="status"/);
  assert.match(source, /aria-live="polite"/);
  assert.match(source, /Could not copy/);
  assert.match(source, /\{term\.count\}/);
  assert.doesNotMatch(source, /term\.count > 1[\s\S]*?,\s*"/);
  assert.doesNotMatch(
    source,
    /pdfjs|pdf\.js|cdnjs|type="file"|FileReader|getDocument|arrayBuffer|PDFJS_|useEffect|useRef/i,
  );
});

test("public decoder copy states its limited, non-diagnostic boundary", () => {
  const page = fs.readFileSync("src/app/vintage-pattern-decoder/page.tsx", "utf8");
  const content = fs.readFileSync("src/lib/toolContent.ts", "utf8");
  const decoderContent = content.slice(content.indexOf('"vintage-pattern-decoder": {'));
  const faqs = fs.readFileSync("src/lib/faqs.ts", "utf8");
  const decoderFaqs = faqs.slice(
    faqs.indexOf('"vintage-pattern-decoder": ['),
    faqs.indexOf('"fabric-substitute": ['),
  );

  assert.match(page, /Unknown and US modes preserve the text/);
  assert.match(page, /does not validate the pattern or determine its age, origin, sizing, or yarn requirements/);
  assert.match(page, /craftyarncouncil\.com\/standards\/crochet-abbreviations/);
  assert.match(decoderContent, /Unknown and US preserve the input exactly/);
  assert.match(decoderFaqs, /does not establish its terminology convention/);
  assert.doesNotMatch(
    `${page}\n${decoderContent}\n${decoderFaqs}`,
    /era detection|translates all|all UK-to-US|most vintage crochet patterns used British|high confidence/i,
  );
});
