import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';
import * as jsx from 'react/jsx-runtime';
import * as thread from '../src/lib/thread-conversion.mjs';

function render(path, state) {
  let index=0;
  const exports={};
  const code=ts.transpileModule(readFileSync(path,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  vm.runInNewContext(code,{exports,require:(name)=>name==='react'?{useState:()=>[state[index++],()=>{}],useMemo:fn=>fn()}:name==='react/jsx-runtime'?jsx:name.includes('thread-conversion')?thread:{default:()=>null}});
  return exports.default();
}
function nodes(root) { return !root||typeof root!=='object'?[]:[root,...[root.props?.children].flat(Infinity).flatMap(nodes)]; }
function text(root) { return root==null||typeof root==='boolean'?'':typeof root!=='object'?String(root):[root.props?.children].flat(Infinity).map(text).join(''); }

for(const [slug,name,mode,inputId] of [['wpi-calculator','WpiCalculator','wpi','wpi-reference-input'],['yarn-weight-calculator','YarnWeightCalculator','wpi','wpi-input'],['yarn-weight-calculator','YarnWeightCalculator','gauge','gauge-input']]) {
 test(`${slug} ${mode} keeps status mounted for valid, invalid, cleared and unmatched values`,()=>{
  const path=`src/app/${slug}/${name}Tool.tsx`;
  for(const [value,expected,invalid] of [['12',/Possible/,false],['61',/above 0.*60/,true],['-1',/above 0.*60/,true],['',/No measurement entered/,false],[mode==='wpi'?'4.5':'40.5',/No category.*reference ranges/,false]]) {
   const tree=render(path,slug==='wpi-calculator'?[value]:[mode,mode==='wpi'?value:'',mode==='gauge'?value:'']);
   const all=nodes(tree),input=all.find(n=>n.props?.id===inputId);
   const status=all.find(n=>n.props?.id===input.props['aria-describedby']);
   assert.ok(status,`${value}: linked status exists`);
   assert.equal(status.props['aria-live'],'polite');
   assert.equal(input.props['aria-invalid'],invalid);
   assert.match(text(status),expected);
  }
 });
}
test('Anchor lookup describes chart pairings without reversing the source direction',()=>{
 const tree=render('src/app/thread-converter/ThreadConverterTool.tsx',['anchor','400']);
 const rows=nodes(tree).filter(n=>n.type==='p'&&n.props.className==='result-card');
 assert.equal(rows.length,2);
 for(const row of rows) { assert.match(text(row),/DMC.*Anchor 400/);assert.doesNotMatch(text(row),/→/); }
});
test('hook tooltip does not limit manufacturer letter labels to B through S',()=>{
 const source=readFileSync('src/app/needle-converter/NeedleConverterTool.tsx','utf8');
 assert.doesNotMatch(source,/B through S/);
 assert.match(source,/Letter labels vary by manufacturer/);
});
