import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const tool = readFileSync(
  new URL("../src/app/vintage-pattern-decoder/VintagePatternDecoderTool.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../src/app/vintage-pattern-decoder/page.tsx", import.meta.url),
  "utf8",
);

test("print output stays in normal flow and removes unrelated layout branches", () => {
  assert.match(tool, /body:has\(\.vintage-print-output\)/);
  assert.match(
    tool,
    /\*:not\(\.vintage-print-output\):not\(\.vintage-print-output \*\):not\(:has\(\.vintage-print-output\)\)\s*\{\s*display: none !important;/s,
  );
  assert.match(
    tool,
    /\.vintage-print-output\s*\{[^}]*position: static !important;[^}]*max-height: none !important;[^}]*overflow: visible !important;/s,
  );
  assert.match(tool, /\.vintage-print-output > \*\s*\{[^}]*break-inside: auto !important;/s);
  assert.doesNotMatch(tool, /position:\s*fixed|\binset\s*:/);
});

test("small dark-mode text uses the higher-contrast bark palette step", () => {
  assert.doesNotMatch(tool, /dark:text-bark-(?:400|500)/);
  assert.doesNotMatch(page, /dark:text-bark-(?:400|500)/);
  assert.match(tool, /text-bark-400 dark:text-bark-300/);
  assert.match(page, /text-bark-600 dark:text-bark-300/);
});

test("the text input keeps a visible boundary and focus indicator in both themes", () => {
  assert.match(tool, /focus:ring-2 focus:ring-plum-400/);
  assert.match(tool, /dark:border-bark-300/);
  assert.match(tool, /dark:focus:ring-plum-400/);
  assert.doesNotMatch(tool, /focus:ring-plum-300|dark:focus:ring-plum-700/);
});

test("remaining-character feedback uses the singular form for exactly one", () => {
  assert.match(
    tool,
    /remainingCharacters === 1 \? "character" : "characters"/,
  );
});

test("the result summary distinguishes mapped occurrences from unique terms", () => {
  assert.match(tool, /supported .*occurrence was.*occurrences were.*mapped from UK to US wording/s);
  assert.doesNotMatch(tool, /substitutionCount\} supported UK term/);
});

test("mapped output exposes original text without hover-only guidance", () => {
  assert.match(
    tool,
    /<mark[^>]*aria-describedby=\{`\$\{descriptionId\}-original-\$\{index\}`\}/,
  );
  assert.doesNotMatch(tool, /<mark[^>]*aria-label=/);
  assert.match(
    tool,
    /<span key=\{index\} id=\{`\$\{descriptionId\}-original-\$\{index\}`\} hidden>[\s\S]*?Original pattern text: \$\{segment\.original \?\? segment\.content\}/,
  );
  assert.doesNotMatch(tool, /<mark[\s\S]*?<span className="sr-only">/);
  assert.match(tool, /Each highlight is described with its original wording for assistive technology/);
  assert.doesNotMatch(tool, /Hover over a highlight/);
});

test("the horizontally scrolling mapping table is keyboard reachable and named", () => {
  assert.match(
    tool,
    /className="overflow-x-auto rounded-xl[^"\n]*"\s*tabIndex=\{0\}\s*aria-label="Mapped pattern terms table"/,
  );
});
