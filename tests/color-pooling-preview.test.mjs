import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildColorPoolingPreview,
  COLOR_POOLING_LIMITS,
} from "../src/lib/color-pooling-preview.mjs";

const tool = readFileSync(
  new URL("../src/app/color-pooling-calculator/ColorPoolingCalculatorTool.tsx", import.meta.url),
  "utf8",
);
const page = readFileSync(
  new URL("../src/app/color-pooling-calculator/page.tsx", import.meta.url),
  "utf8",
);

const sections = [
  { hex: "#AA0000", stitches: 1 },
  { hex: "#00AA00", stitches: 1 },
  { hex: "#0000AA", stitches: 1 },
];

test("turned rows consume the sequence continuously and reverse visual placement on return rows", () => {
  const preview = buildColorPoolingPreview({
    sections,
    rowAdjustment: 0,
    previewRows: 3,
    rowMode: "turned",
  });

  assert.equal(preview.ok, true);
  assert.equal(preview.totalRepeat, 3);
  assert.equal(preview.rowWidth, 3);
  assert.deepEqual(preview.rowDirections, ["left-to-right", "right-to-left", "left-to-right"]);
  assert.deepEqual(preview.rowStartOffsets, [0, 0, 0]);
  assert.deepEqual(preview.grid, [
    ["#AA0000", "#00AA00", "#0000AA"],
    ["#0000AA", "#00AA00", "#AA0000"],
    ["#AA0000", "#00AA00", "#0000AA"],
  ]);
});

test("same-direction mode materially changes return-row placement", () => {
  const turned = buildColorPoolingPreview({
    sections,
    rowAdjustment: 0,
    previewRows: 2,
    rowMode: "turned",
  });
  const sameDirection = buildColorPoolingPreview({
    sections,
    rowAdjustment: 0,
    previewRows: 2,
    rowMode: "same-direction",
  });

  assert.equal(turned.ok, true);
  assert.equal(sameDirection.ok, true);
  assert.notDeepEqual(turned.grid[1], sameDirection.grid[1]);
  assert.deepEqual(sameDirection.grid[1], ["#AA0000", "#00AA00", "#0000AA"]);
});

test("row adjustment changes width, start phase, and the deterministic grid", () => {
  const input = {
    sections,
    rowAdjustment: 1,
    previewRows: 3,
    rowMode: "turned",
  };
  const first = buildColorPoolingPreview(input);
  const second = buildColorPoolingPreview(input);

  assert.equal(first.ok, true);
  assert.equal(first.rowWidth, 4);
  assert.equal(first.repeatShiftPerRow, 1);
  assert.deepEqual(first.rowStartOffsets, [0, 1, 2]);
  assert.deepEqual(first.grid, [
    ["#AA0000", "#00AA00", "#0000AA", "#AA0000"],
    ["#00AA00", "#AA0000", "#0000AA", "#00AA00"],
    ["#0000AA", "#AA0000", "#00AA00", "#0000AA"],
  ]);
  assert.deepEqual(second, first);
});

test("every color value and stitch count affects the preview", () => {
  const baseline = buildColorPoolingPreview({
    sections,
    rowAdjustment: 0,
    previewRows: 2,
    rowMode: "same-direction",
  });
  const recolored = buildColorPoolingPreview({
    sections: [{ ...sections[0], hex: "#FFFFFF" }, ...sections.slice(1)],
    rowAdjustment: 0,
    previewRows: 2,
    rowMode: "same-direction",
  });
  const resized = buildColorPoolingPreview({
    sections: [{ ...sections[0], stitches: 2 }, ...sections.slice(1)],
    rowAdjustment: 0,
    previewRows: 2,
    rowMode: "same-direction",
  });

  assert.equal(baseline.ok, true);
  assert.equal(recolored.ok, true);
  assert.equal(resized.ok, true);
  assert.notDeepEqual(recolored.grid, baseline.grid);
  assert.equal(resized.totalRepeat, baseline.totalRepeat + 1);
  assert.notDeepEqual(resized.grid, baseline.grid);
});

test("rejects malformed and out-of-bound work before allocating a grid", () => {
  const valid = {
    sections,
    rowAdjustment: 0,
    previewRows: 20,
    rowMode: "turned",
  };
  const invalidInputs = [
    { ...valid, sections: sections.slice(0, 1) },
    { ...valid, sections: Array.from({ length: COLOR_POOLING_LIMITS.maxColors + 1 }, () => sections[0]) },
    { ...valid, sections: [{ hex: "#AA0000", stitches: "" }, ...sections.slice(1)] },
    { ...valid, sections: [{ hex: "#AA0000", stitches: 1.5 }, ...sections.slice(1)] },
    { ...valid, sections: [{ hex: "red", stitches: 1 }, ...sections.slice(1)] },
    { ...valid, rowAdjustment: COLOR_POOLING_LIMITS.maxAdjustment + 1 },
    { ...valid, rowAdjustment: 0.5 },
    { ...valid, previewRows: COLOR_POOLING_LIMITS.maxRows + 1 },
    { ...valid, previewRows: "" },
    { ...valid, rowMode: "diagonal" },
    {
      ...valid,
      sections: [100, 100, 100, 100, 1].map((stitches, index) => ({
        hex: `#00000${index}`,
        stitches,
      })),
    },
    {
      ...valid,
      sections: Array.from({ length: 4 }, (_, index) => ({
        hex: `#00000${index}`,
        stitches: 100,
      })),
      rowAdjustment: 1,
    },
  ];

  for (const input of invalidInputs) {
    const result = buildColorPoolingPreview(input);
    assert.equal(result.ok, false, JSON.stringify(input));
    assert.equal(Array.isArray(result.grid), false, "invalid input must not allocate a preview grid");
  }
});

test("the UI exposes bounded controls whose selected values feed the simulator", () => {
  assert.match(tool, /from "@\/lib\/color-pooling-preview\.mjs"/);
  assert.match(tool, /buildColorPoolingPreview\(\{[\s\S]*sections,[\s\S]*rowAdjustment,[\s\S]*previewRows,[\s\S]*rowMode/);
  assert.match(tool, /id="pooling-row-mode"/);
  assert.match(tool, /Turn after every row/);
  assert.match(tool, /Start every row on the left/);
  assert.match(tool, /max=\{COLOR_POOLING_LIMITS\.maxRows\}/);
  assert.match(tool, /aria-label=\{`Remove color \$\{index \+ 1\}`\}/);
  assert.match(tool, /Text version of the placement preview/);
  assert.match(tool, /stitch \$\{columnIndex \+ 1\} \$\{color\}/);
  assert.doesNotMatch(tool, /odd-numbered return rows/);
  assert.doesNotMatch(tool, /STITCH_TYPES|Math\.random|isAligned|successful pooling|Colors should pool/);
});

test("page and tool describe an idealized swatching aid without an exact argyle promise", () => {
  assert.match(page, /bounded, idealized color-placement grid/i);
  assert.match(page, /not an exact foundation-chain calculation or a guarantee of argyle/i);
  assert.match(page, /return rows are placed from right to left/i);
  assert.match(tool, /swatching aid, not a guaranteed argyle or plaid pattern/i);
  assert.doesNotMatch(page, /Calculate exact stitch counts|Live argyle|see exactly how many stitches/i);
  assert.doesNotMatch(tool, /calculate the exact chain count|successful pooling/i);
  assert.match(page, /can scale yarn use from a representative pooled swatch/);
});
