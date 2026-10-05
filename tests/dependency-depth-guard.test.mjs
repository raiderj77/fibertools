import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";

const require = createRequire(import.meta.url);
const consumer = createRequire(require.resolve("micromatch/package.json"));
const braces = consumer("braces");

test("the actual build consumer uses the exact reviewed depth-guard artifact", () => {
  const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
  const entries = Object.entries(lock.packages).filter(([path]) => path.endsWith("/braces"));
  assert.equal(entries.length, 2);
  for (const [, entry] of entries) {
    assert.equal(entry.name, "@dieub/braces-depth-guard");
    assert.equal(entry.version, "3.0.3-pn.3");
    assert.equal(entry.integrity, "sha512-QY+Uq4s42STyIMPoRkBuUZfYyvz0uZuwuUburLwMx5N+lWqnHHaBxcKPtgKVKjTyFnS1q4ivKu9Wxi4VG7FE9Q==");
  }
  for (const name of ["micromatch", "chokidar"]) {
    const fromConsumer = createRequire(require.resolve(`${name}/package.json`));
    assert.equal(fromConsumer("braces/package.json").name, "@dieub/braces-depth-guard");
  }
});

test("ordinary build globs and ranges retain their behavior", () => {
  assert.deepEqual(braces.expand("src/**/*.{ts,tsx}"), ["src/**/*.ts", "src/**/*.tsx"]);
  assert.deepEqual(braces.expand("{a,b{1..2}}"), ["a", "b1", "b2"]);
  assert.equal(braces.compile("a/{b,c}/d"), "a/(b|c)/d");
});

test("deep strings fail with a deliberate bound before stack exhaustion", () => {
  for (const [open, close] of [["{", "}"], ["(", ")"], ["{(", ")}"]]) {
    for (const method of ["parse", "compile", "expand", "stringify"]) {
      assert.throws(() => braces[method](open.repeat(2000) + "x" + close.repeat(2000)), /exceeds max depth/);
    }
  }
});

test("direct ASTs and options cannot bypass the depth bound", () => {
  let ast = { type: "text", value: "x" };
  for (let i = 0; i < 1000; i++) ast = { type: "brace", open: true, close: true, commas: 1, nodes: [ast] };
  for (const method of ["compile", "expand", "stringify"]) {
    assert.throws(() => braces[method]({ type: "root", nodes: [ast] }), /exceeds max depth/);
  }
  for (const maxDepth of [Infinity, NaN, 10000, "10000", false]) {
    assert.throws(() => braces.compile("{".repeat(101) + "x" + "}".repeat(101), { maxDepth }), /exceeds max depth/);
  }
});
