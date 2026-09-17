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

const example={useCustom:true,customW:"40",customL:"60",gaugeStitches:"16",gaugeRows:"20",stitchMultiple:"6",multipleExtra:"2"};
test("actual form preserves selected baseline, rows and synthetic target-area yarn",()=>{
  const r=calculate({...example,swatchWidth:"4",swatchHeight:"4",swatchGrams:"10"});
  assert.equal(r.stitches,158);assert.equal(r.rows,300);assert.equal(r.widthPlan.atOrAbove,164);
  assert.equal(r.widthPlan.nearestWidthIn,39.5);assert.equal(r.widthPlan.aboveWidthIn,41);
  assert.equal(r.widthPlan.belowTarget,true);assert.equal(r.modeledLengthIn,60);
  assert.equal(r.grams,1650);assert.equal(r.yards,3630);assert.equal(r.skeins,17);
  const noYarn=calculate(example);assert.equal(noYarn.yards,null);assert.equal(noYarn.skeins,null);
});
for(const [width,nearest,above]of [[41,164,164],[40.5,164,164],[40.75,164,164],[41.05,164,170],[40.25,164,164],[40.2,164,164]]){
  test(`actual callback raw boundary ${width}`,()=>{const r=calculate({...example,customW:String(width)});assert.equal(r.stitches,nearest);assert.equal(r.widthPlan.atOrAbove,above);assert.equal(r.rows,300)});
}
test("metric dimensions and gauge span produce equivalent repeat plans",()=>{
 const r=calculate({...example,units:"metric",customW:"101.6",customL:"152.4",gaugeOver:"10.16"});
 assert.equal(r.stitches,158);assert.equal(r.widthPlan.atOrAbove,164);assert.equal(r.rows,300);
 assert.equal(helpers.formatBlanketDimension(r.widthPlan.nearestWidthIn,"metric"),"100.33");
 assert.equal(helpers.formatBlanketDimension(r.widthPlan.aboveWidthIn,"metric"),"104.14");
});
test("target modifiers preserve baseline and target-area consumption",()=>{
 const r=calculate({...example,overhang:"2",pillowTuck:true,swatchWidth:"4",swatchHeight:"4",swatchGrams:"10"});
 assert.equal(r.baseWidthIn,40);assert.equal(r.baseLengthIn,60);assert.equal(r.widthIn,44);assert.equal(r.lengthIn,82);
 assert.equal(r.stitches,176);assert.equal(r.rows,410);assert.equal(r.widthPlan.atOrAbove,176);
 assert.equal(r.grams,2481);assert.equal(r.yards,5457);assert.equal(r.skeins,25);
});
test("optional repeats omitted or explicit zero offset remain supported",()=>{
 assert.equal(calculate({...example,stitchMultiple:"",multipleExtra:""}).stitches,160);
 assert.equal(calculate({...example,multipleExtra:""}).stitches,162);
 assert.equal(calculate({...example,multipleExtra:"0"}).stitches,162);
 assert.equal(calculate({...example,multipleExtra:"8"}).stitches,158);
});
for(const invalid of [{customW:""},{customW:"0",overhang:"2"},{customW:"-1"},{customW:"Infinity"},{gaugeStitches:""},{gaugeStitches:"0"},{gaugeStitches:"NaN"},{gaugeRows:""},{gaugeOver:"0"},{stitchMultiple:"0"},{stitchMultiple:"-2"},{stitchMultiple:"2.5"},{stitchMultiple:"text"},{stitchMultiple:"1000001"},{stitchMultiple:"",multipleExtra:"0"},{multipleExtra:"2.5"},{multipleExtra:"-1"},{multipleExtra:"1000001"}]){
 test(`reject invalid supplied form ${JSON.stringify(invalid)}`,()=>assert.equal(calculate({...example,...invalid}),null));
}
test("valid yarn can still be calculated with both gauge fields omitted",()=>{
 const r=calculate({...example,gaugeStitches:"",gaugeRows:"",swatchWidth:"4",swatchHeight:"4",swatchGrams:"10"});
 assert.equal(r.widthPlan,null);assert.equal(r.modeledLengthIn,null);assert.equal(r.yards,3630);
});
