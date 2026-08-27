import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const packageManifest = JSON.parse(read("package.json"));
const packageLock = JSON.parse(read("package-lock.json"));
const nodeMajor = read(".nvmrc").trim();

test("the release runs on the declared Node 24 LTS major", () => {
  assert.equal(nodeMajor, "24");
  assert.equal(process.versions.node.split(".")[0], nodeMajor,
    "Use the Node major in .nvmrc before validating or building FiberTools.");
});

test("application and lockfile engines prevent an implicit future-major runtime upgrade", () => {
  assert.equal(packageManifest.engines.node, `${nodeMajor}.x`);
  assert.equal(packageLock.packages[""].engines.node, packageManifest.engines.node);
});

test("all existing Node execution workflows select the same pinned runtime source", () => {
  for (const file of ["empire-check.yml", "indexnow.yml", "revenue-path.yml"]) {
    const workflow = read(`.github/workflows/${file}`);
    assert.match(workflow, /actions\/setup-node@249970729cb0ef3589644e2896645e5dc5ba9c38/);
    assert.match(workflow, /node-version-file:\s*"\.nvmrc"/);
    assert.doesNotMatch(workflow, /\bnode-version\s*:/,
      `${file} must not override the shared runtime selection.`);
  }
});

test("normal builds and required CI enforce the runtime contract", () => {
  assert.equal(packageManifest.scripts["test:runtime"], "node --test tests/runtime-contract.test.mjs");
  assert.match(packageManifest.scripts.prebuild, /^npm run test:runtime && /);
  assert.match(read(".github/workflows/empire-check.yml"), /npm run test:runtime/);
});
