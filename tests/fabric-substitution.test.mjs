import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  projectSuggestionsFor,
  rankFabricSubstitutes,
  scoreFabricPair,
  searchFabrics,
} from "../src/lib/fabric-matching-engine.mjs";

const fabrics = JSON.parse(readFileSync(new URL("../src/data/fabrics.json", import.meta.url), "utf8"));
const byId = new Map(fabrics.map((fabric) => [fabric.id, fabric]));
const expectedIds = [
  "rayon-challis", "cotton-lawn", "cotton-poplin", "cotton-voile", "broadcloth", "linen", "chambray", "twill", "denim", "gabardine",
  "corduroy", "canvas", "muslin", "double-gauze", "flannel", "crepe", "satin", "silk-charmeuse", "chiffon", "georgette", "organza",
  "cotton-jersey", "interlock-knit", "rib-knit", "ponte-knit", "french-terry", "fleece", "scuba-knit", "stretch-velvet", "lyocell-twill",
];

test("ships the exact 30-fabric MVP with complete, resolvable references", () => {
  assert.equal(fabrics.length, 30);
  assert.equal(new Set(fabrics.map((fabric) => fabric.id)).size, 30);
  assert.equal(new Set(fabrics.map((fabric) => fabric.slug)).size, 30);
  assert.deepEqual(fabrics.map((fabric) => fabric.id).sort(), expectedIds.sort());

  const sourceDocument = readFileSync(new URL("../docs/fabric-data-sources.md", import.meta.url), "utf8");
  for (const fabric of fabrics) {
    assert.ok(fabric.sourceReferences.length > 0, `${fabric.id} needs a source`);
    assert.match(fabric.lastReviewedDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(fabric.weightGsmMin <= fabric.weightGsmMax);
    for (const key of ["recommendedSubstitutes", "poorSubstitutes"]) {
      for (const id of fabric[key]) assert.ok(byId.has(id), `${fabric.id} has unknown ${key} ID ${id}`);
    }
    for (const source of fabric.sourceReferences) {
      assert.match(sourceDocument, new RegExp(`\\b${source.id}\\b`), `${fabric.id} source ${source.id} is not in the source registry`);
    }
  }
});

test("scores a supported double-knit pair strongly and never exceeds 100", () => {
  const result = scoreFabricPair(byId.get("ponte-knit"), byId.get("scuba-knit"));
  assert.equal(result.label, "Strong substitute");
  assert.ok(result.score >= 82 && result.score <= 100);
  assert.equal(Object.values(result.breakdown).reduce((sum, value) => sum + value, 0), result.score);
});

test("hard-penalizes a known poor substitute even when broad properties overlap", () => {
  const result = scoreFabricPair(byId.get("rayon-challis"), byId.get("canvas"));
  assert.equal(result.label, "Poor substitute");
  assert.ok(result.score < 45);
  assert.ok(result.cautions.length > 0);
});

test("gives a woven-to-knit contradiction no construction or stretch points", () => {
  const result = scoreFabricPair(byId.get("cotton-poplin"), byId.get("cotton-jersey"));
  assert.equal(result.breakdown.construction, 0);
  assert.equal(result.breakdown.stretch, 0);
  assert.equal(result.label, "Poor substitute");
});

test("ranks a known supported substitute above a known poor substitute", () => {
  const ranked = rankFabricSubstitutes(byId.get("rayon-challis"), fabrics);
  const supported = ranked.findIndex((item) => item.fabric.id === "lyocell-twill");
  const poor = ranked.findIndex((item) => item.fabric.id === "canvas");
  assert.ok(supported >= 0 && poor >= 0 && supported < poor);
});

test("similar weight, stretch, and drape score above distant values", () => {
  const source = structuredClone(byId.get("cotton-jersey"));
  source.poorSubstitutes = [];
  const close = { ...structuredClone(source), id: "close", displayName: "Close" };
  const distantWeight = { ...structuredClone(close), id: "heavy", displayName: "Heavy", weightGsmMin: 500, weightGsmMax: 650 };
  const distantStretch = { ...structuredClone(close), id: "rigid", displayName: "Rigid", horizontalStretchMin: 0, horizontalStretchMax: 5, verticalStretchMin: 0, verticalStretchMax: 2 };
  const distantDrape = { ...structuredClone(close), id: "stiff", displayName: "Stiff", drapeRating: 1 };
  assert.ok(scoreFabricPair(source, close).breakdown.weight > scoreFabricPair(source, distantWeight).breakdown.weight);
  assert.ok(scoreFabricPair(source, close).breakdown.stretch > scoreFabricPair(source, distantStretch).breakdown.stretch);
  assert.ok(scoreFabricPair(source, close).breakdown.drape > scoreFabricPair(source, distantDrape).breakdown.drape);
});

test("raised pile or brushing lowers compatibility and creates a handling caution", () => {
  const corduroy = scoreFabricPair(byId.get("denim"), byId.get("corduroy"));
  const fleece = scoreFabricPair(byId.get("french-terry"), byId.get("fleece"));
  assert.equal(corduroy.label, "Reasonable substitute");
  assert.equal(fleece.label, "Reasonable substitute");
  assert.ok(corduroy.cautions.some((item) => item.includes("raised pile")));
  assert.ok(fleece.cautions.some((item) => item.includes("raised pile")));
});

test("ranks deterministically, excludes self, and uses display name for score ties", () => {
  const source = byId.get("cotton-jersey");
  const first = rankFabricSubstitutes(source, fabrics);
  const second = rankFabricSubstitutes(source, fabrics);
  assert.deepEqual(first.map((item) => [item.fabric.id, item.score]), second.map((item) => [item.fabric.id, item.score]));
  assert.equal(first.length, 29);
  assert.ok(first.every((item) => item.fabric.id !== source.id));
  for (let index = 1; index < first.length; index += 1) {
    assert.ok(first[index - 1].score >= first[index].score);
    if (first[index - 1].score === first[index].score) {
      assert.ok(first[index - 1].fabric.displayName.localeCompare(first[index].fabric.displayName) <= 0);
    }
  }
});

test("searches display names and aliases without accepting arbitrary records", () => {
  assert.equal(searchFabrics("tencel", fabrics)[0].id, "lyocell-twill");
  assert.equal(searchFabrics("TENCEL", fabrics)[0].id, "lyocell-twill");
  assert.equal(searchFabrics("ponte roma", fabrics)[0].id, "ponte-knit");
  assert.deepEqual(searchFabrics("not a real fabric", fabrics), []);
});

test("missing optional arrays do not crash search, scoring, or project suggestions", () => {
  const incomplete = structuredClone(byId.get("cotton-lawn"));
  delete incomplete.aliases;
  delete incomplete.poorSubstitutes;
  delete incomplete.commonUses;
  delete incomplete.poorUses;
  assert.doesNotThrow(() => searchFabrics("cotton lawn", [incomplete]));
  assert.doesNotThrow(() => scoreFabricPair(incomplete, byId.get("cotton-poplin")));
  assert.deepEqual(projectSuggestionsFor(incomplete), []);
});

test("project suggestions expose suitability, limitations, lining, stretch, and behavior", () => {
  const suggestions = projectSuggestionsFor(byId.get("chiffon"));
  assert.ok(suggestions.length >= 5);
  for (const suggestion of suggestions) {
    assert.ok(suggestion.why.length > 20);
    assert.ok(suggestion.limitations.length > 10);
    assert.equal(typeof suggestion.liningUseful, "boolean");
    assert.equal(typeof suggestion.stretchImportant, "boolean");
    assert.ok(suggestion.behavior.length > 10);
  }
});

test("project suggestions do not overstate lining or stretch suitability", () => {
  const chiffon = projectSuggestionsFor(byId.get("chiffon"));
  const scarf = chiffon.find((item) => item.name === "Scarves");
  const jersey = projectSuggestionsFor(byId.get("cotton-jersey"));
  const leggings = jersey.find((item) => item.name === "Leggings");
  assert.equal(scarf.liningUseful, false);
  assert.match(scarf.limitations, /Transparency is part of the effect/);
  assert.equal(leggings.suitability, "Reasonable");
  assert.match(leggings.limitations, /required stretch and recovery/);
});

test("feature analytics source contains no raw query or free-text property", () => {
  const analytics = readFileSync(new URL("../src/lib/fabric-analytics.ts", import.meta.url), "utf8");
  assert.doesNotMatch(analytics, /query|search_text|notes|description/i);
  assert.match(analytics, /cookie_consent/);
  assert.match(analytics, /analytics === "granted"/);
  assert.match(analytics, /detectGPCClient/);
  for (const event of ["fabric_tool_viewed", "fabric_flow_selected", "fabric_selected", "substitution_results_viewed", "project_suggestions_viewed", "result_expanded", "result_helpful", "result_not_helpful", "source_information_viewed"]) {
    assert.match(analytics, new RegExp(`"${event}"`));
  }
  assert.doesNotMatch(analytics, /retailer_link_clicked/);
});

test("keeps the optional retailer list empty until a real destination is approved", () => {
  const retailerSource = readFileSync(new URL("../src/lib/fabric-retailers.ts", import.meta.url), "utf8");
  assert.match(retailerSource, /approvedFabricRetailerLinks:[^=]+\= \[\]/);
  assert.doesNotMatch(retailerSource, /https?:\/\//);
});
