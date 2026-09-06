import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import * as helpers from "../src/lib/blanket-gauge.mjs";

// Execute the actual UI result callback with synthetic form state, not a copy
// of its formula. This covers participation of optional groups and UI defaults.
const source = fs.readFileSync("src/app/blanket-calculator/BlanketCalculatorTool.tsx", "utf8");
const tree = ts.createSourceFile("tool.tsx", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let callback, sizes;
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(tree) === "result") callback = node.initializer.arguments[0].getText(tree);
  if (ts.isVariableDeclaration(node) && node.name.getText(tree) === "BLANKET_SIZES") sizes = node.initializer.getText(tree);
  ts.forEachChild(node, visit);
}
visit(tree);
const code = ts.transpileModule(`const BLANKET_SIZES = ${sizes}; const calculate = ${callback}; result = calculate();`, {compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
function calculate(overrides = {}) {
  const state = { units:"imperial",sizeIdx:6,useCustom:false,customW:"",customL:"",pillowTuck:false,overhang:"0",
    gaugeStitches:"",gaugeRows:"",gaugeOver:"4",swatchWidth:"",swatchHeight:"",swatchGrams:"",
    skeinYards:"220",skeinGrams:"100",stitchMultiple:"",multipleExtra:"",yw:{label:"4 – Worsted"},
    ydsToM:(yards)=>Math.round(yards*0.9144), ...helpers, ...overrides };
  vm.runInNewContext(code, state);
  return state.result;
}
test("default blanket dimensions do not require optional swatch use", () => {
  const result=calculate();
  assert.equal(result.widthIn,50);assert.equal(result.lengthIn,60);
  assert.equal(result.hasSwatchUsage,false);assert.equal(result.hasGauge,false);
});
test("gauge-only blanket planning works with default skein label fields", () => {
  const result=calculate({gaugeStitches:"18",gaugeRows:"24"});
  assert.equal(result.stitches,225);assert.equal(result.rows,360);assert.equal(result.skeins,null);
});
test("started swatch group must be complete, finite, and bounded", () => {
  assert.equal(calculate({swatchWidth:"4"}),null);
  assert.equal(calculate({customW:"1e300",customL:"10",useCustom:true}),null);
  const result=calculate({swatchWidth:"4",swatchHeight:"4",swatchGrams:"5"});
  assert.equal(result.grams,1031);assert.equal(result.skeins,11);
});
