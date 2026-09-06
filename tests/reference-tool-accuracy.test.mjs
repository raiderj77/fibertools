import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
const source = (slug, name) => readFileSync(new URL(`../src/app/${slug}/${name}Tool.tsx`, import.meta.url), 'utf8');
const needlesSource = source('needle-converter', 'NeedleConverter');
const needles = vm.runInNewContext(needlesSource.match(/const needleSizes: NeedleSize\[\] = ([\s\S]*?\n\]);/)[1]);
test('Japanese sizes use exact Clover diameters, without rounding to US equivalents', () => {
  for (let jp = 0; jp <= 15; jp++) {
    const row = needles.find(n => n.japanese === String(jp));
    assert.ok(row, `JP ${jp} must be represented`);
    assert.equal(row.mm, Math.round((2.1 + jp * 0.3) * 10) / 10, `JP ${jp}`);
  }
  assert.equal(needles.find(n => n.us === '17').mm, 12.75);
});
test('numeric yarn references do not truncate measurements or apply knitting gauge to crochet', () => {
  for (const [slug, name] of [['wpi-calculator','WpiCalculator'],['yarn-weight-calculator','YarnWeightCalculator']]) {
    const text = source(slug, name);
    assert.doesNotMatch(text, /parseInt\(/);
    assert.match(text, /Number\.isFinite/);
    assert.doesNotMatch(text, /Knit or crochet a 4-inch/);
    assert.match(text, /stockinette/i);
  }
});
test('stitch references distinguish joining slips and left-leaning SK2P', () => {
  assert.doesNotMatch(source('stitch-quick-reference','StitchQuickReference'), /Does not count as a stitch\./);
  const glossary = source('abbreviation-glossary','AbbreviationGlossary');
  const sk2p = glossary.match(/abbr: "SK2P"[\s\S]*?\},/)[0];
  assert.doesNotMatch(sk2p, /centered/);
});
test('crochet operation summaries count every yarn over and pull through', () => {
  const text = source('stitch-quick-reference','StitchQuickReference');
  const stitches = vm.runInNewContext(text.match(/const STITCHES: StitchRef\[\] = ([\s\S]*?\n\]);/)[1]);
  for (const [abbr, yo, pt] of [['SC',2,2],['HDC',3,2],['DC',4,3],['TR',6,4],['DTR',8,5]]) {
    const stitch = stitches.find(s => s.abbr === abbr);
    assert.equal(stitch.yarnOvers, yo, `${abbr} yarn overs`);
    assert.equal(stitch.pullThrus, pt, `${abbr} pull throughs`);
    assert.equal(stitch.totalSteps, stitch.steps.length, `${abbr} displayed steps`);
  }
});
test('hook letters do not invent CYC equivalents at 12mm or knitting-style numbers', () => {
  const hooks = vm.runInNewContext(needlesSource.match(/const hookSizes: HookSize\[\] = ([\s\S]*?\n\]);/)[1]);
  for (const [mm, letter, number] of [[2.5,'–','–'],[3,'–','–'],[11.5,'P','16'],[12,'–','–'],[15,'P/Q','–'],[16,'Q','–'],[19,'S','–'],[25,'T/U/X','–']]) {
    const hook = hooks.find(h=>h.mm===mm);
    assert.equal(hook.usLetter,letter, `${mm}mm letter`);
    assert.equal(hook.usNumber,number, `${mm}mm number`);
  }
});

test("SC2tog describes the standard decrease and all three pull-through operations", () => {
 const entry = source("abbreviation-glossary", "AbbreviationGlossary").match(/abbr: "SC2tog"[\s\S]*?\},/)[0];
 assert.match(entry, /yarnOvers: 3, pullThrus: 3/);
 assert.match(entry, /Standard single crochet decrease/);
});
