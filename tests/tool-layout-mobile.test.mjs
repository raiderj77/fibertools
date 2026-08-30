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

test("uses the maintained internal stitch counter instead of an external service claim", () => {
  assert.match(source, /href="\/stitch-counter"/);
  assert.match(source, /Open stitch counter/);
  assert.match(source, /local project notes/);
  assert.doesNotMatch(source, /MyCrochetKit|Try It Free|never lose count again/i);
});
