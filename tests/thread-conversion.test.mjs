import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  THREAD_BATCH_LIMITS,
  THREAD_CONVERSION_TABLE,
  THREAD_REFERENCE_METADATA,
  convertThreadBatch,
  lookupThreadCode,
  searchThreadTable,
} from "../src/lib/thread-conversion.mjs";

test("the included table has 80 deterministic rows and unique DMC keys", () => {
  assert.equal(THREAD_CONVERSION_TABLE.length, 80);
  assert.equal(new Set(THREAD_CONVERSION_TABLE.map((entry) => entry.dmc.toLowerCase())).size, 80);

  const blanc = lookupThreadCode("dmc", "BLANC");
  assert.equal(blanc.status, "found");
  assert.deepEqual(blanc.entry, {
    dmc: "blanc",
    anchor: "2",
    cosmo: "100",
    hex: "#FFFFFF",
    name: "White",
  });

  const snowWhite = lookupThreadCode("dmc", "b5200");
  assert.equal(snowWhite.status, "found");
  assert.equal(snowWhite.entry.anchor, "1");
  assert.equal(snowWhite.entry.name, "Snow White");
});

test("the legacy bundled table exposes its unverified provenance", () => {
  assert.deepEqual(THREAD_REFERENCE_METADATA, {
    version: "fibertools-bundled-2026-08-29",
    provenance: "Legacy bundled table; original source not recorded",
    manufacturerVerified: false,
  });
});

test("exact lookup returns found, unknown, invalid, or ambiguous without nearest-color inference", () => {
  const black = lookupThreadCode("dmc", "310");
  assert.equal(black.status, "found");
  assert.equal(black.entry.anchor, "403");
  assert.equal(black.entry.cosmo, "600");

  const cosmo = lookupThreadCode("cosmo", "346a");
  assert.equal(cosmo.status, "found");
  assert.equal(cosmo.entry.dmc, "666");

  assert.equal(lookupThreadCode("dmc", "31").status, "unknown");
  assert.equal(lookupThreadCode("sulky", "1001").status, "invalid");
  assert.equal(lookupThreadCode("dmc", "").status, "invalid");

  const anchor400 = lookupThreadCode("anchor", "400");
  assert.equal(anchor400.status, "ambiguous");
  assert.deepEqual(anchor400.matches.map((entry) => [entry.dmc, entry.cosmo]), [
    ["414", "895"],
    ["317", "896"],
  ]);

  const cosmo100 = lookupThreadCode("cosmo", "100");
  assert.equal(cosmo100.status, "ambiguous");
  assert.deepEqual(cosmo100.matches.map((entry) => entry.dmc), ["blanc", "b5200"]);
});

test("bounded discovery search differs explicitly from exact lookup", () => {
  assert.deepEqual(
    searchThreadTable("31", "dmc", 30).map((entry) => entry.dmc),
    ["310", "318", "317"],
  );
  assert.equal(lookupThreadCode("dmc", "31").status, "unknown");
  assert.deepEqual(searchThreadTable("", "any", 30), []);
  assert.deepEqual(searchThreadTable("31", "sulky", 30), []);
  assert.deepEqual(searchThreadTable("31", "dmc", 0), []);
});

test("batch lookup preserves input order, duplicates, unknowns, and ambiguity", () => {
  const batch = convertThreadBatch({
    input: "310, 400;\n999 400",
    sourceBrand: "anchor",
  });
  assert.equal(batch.status, "ready");
  assert.deepEqual(batch.results.map((result) => [result.input, result.lookup.status]), [
    ["310", "found"],
    ["400", "ambiguous"],
    ["999", "unknown"],
    ["400", "ambiguous"],
  ]);
});

test("batch input is bounded before result generation", () => {
  const tooMany = Array.from({ length: THREAD_BATCH_LIMITS.maximumCodes + 1 }, () => "310").join(",");
  const tooLong = "3".repeat(THREAD_BATCH_LIMITS.maximumCharacters + 1);

  for (const result of [
    convertThreadBatch({ input: tooMany, sourceBrand: "dmc" }),
    convertThreadBatch({ input: tooLong, sourceBrand: "dmc" }),
    convertThreadBatch({ input: "310", sourceBrand: "sulky" }),
    convertThreadBatch({ input: null, sourceBrand: "dmc" }),
  ]) {
    assert.equal(result.status, "invalid");
    assert.equal("results" in result, false);
  }

  assert.deepEqual(convertThreadBatch({ input: "", sourceBrand: "dmc" }), {
    status: "empty",
    results: [],
  });
});

test("component and page expose included-table semantics and accessible controls", () => {
  const tool = fs.readFileSync("src/app/thread-converter/ThreadConverterTool.tsx", "utf8");
  const page = fs.readFileSync("src/app/thread-converter/page.tsx", "utf8");
  assert.match(tool, /aria-pressed=\{viewMode === mode\.id\}/);
  assert.match(tool, /htmlFor="thread-table-search"/);
  assert.match(tool, /htmlFor="thread-bulk-input"/);
  assert.match(tool, /does not support Sulky, calculate nearest colors/);
  assert.match(tool, /original source was not\s*recorded and the rows are not manufacturer-verified/);
  assert.doesNotMatch(`${tool}\n${page}`, /closest match|near-perfect|trust the result|works beautifully/i);
  assert.match(page, /exact rows in the included table/);
});
