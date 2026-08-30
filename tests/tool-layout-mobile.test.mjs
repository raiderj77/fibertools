import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync("src/components/ToolLayout.tsx", "utf8");

test("stacks the shared title actions below the small-screen breakpoint", () => {
  assert.match(
    source,
    /flex flex-col items-start gap-3 mb-2 sm:flex-row sm:items-center sm:justify-between/,
  );
  assert.match(source, /flex min-w-0 items-center gap-3/);
});

test("does not guarantee an external tracking service's price or persistence", () => {
  assert.match(source, /Review its current features, pricing, privacy, and storage terms/);
  assert.match(source, /Visit MyCrochetKit/);
  assert.doesNotMatch(source, /Try It Free|never lose count again|save your progress/i);
});
