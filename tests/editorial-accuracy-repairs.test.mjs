import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

function loadTs(path, imports = {}) {
  const source = readFileSync(path, 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: (name) => imports[name] ?? {}, Date });
  return exports;
}

test('existing yarn-label guide preserves identity and declines unsupported safety claims', () => {
  const guide = loadTs('src/lib/guides.ts').guides.find(g => g.slug === 'reading-yarn-labels');
  assert.equal(guide.date, '2026-02-23');
  assert.equal(guide.title, 'The Complete Guide to Reading Yarn Labels (What Every Number Means)');
  assert.equal(guide.modifiedDate, '2026-09-05');
  const text = guide.sections.map(s => s.content).join('\n');
  assert.doesNotMatch(text, /burn testing|flame-retardant treatment|moth-resistant treatment|certified free from harmful|exactly how many skeins|making it machine washable/i);
  assert.match(text, /care label/i);
  assert.match(text, /unknown/i);
  assert.ok(guide.sources.some(s => s.url.includes('craftyarncouncil.com')));
  assert.ok(guide.sources.some(s => s.url.includes('woolmark.com')));
});

test('guide sitemap reports an actual modification date with original-date fallback', () => {
  const guides = [{ slug: 'updated', date: '2026-02-23', modifiedDate: '2026-09-05' }, { slug: 'original', date: '2026-03-06' }];
  const sitemap = loadTs('src/app/sitemap.ts', {
    '@/lib/tools': { tools: [] }, '@/lib/guides': { getAllGuides: () => guides },
    '@/lib/review-dates.mjs': { REVIEW_DATES: { homepage: { iso: '2026-03-01' } } },
  }).default();
  assert.equal(sitemap.find(p => p.url.endsWith('/updated')).lastModified.toISOString().slice(0, 10), '2026-09-05');
  assert.equal(sitemap.find(p => p.url.endsWith('/original')).lastModified.toISOString().slice(0, 10), '2026-03-06');
});

test('thread metadata promotes only the available sourced brands', () => {
  const { metadata } = loadTs('src/app/thread-converter/page.tsx');
  assert.doesNotMatch(JSON.stringify(metadata), /cosmo/i);
  assert.match(metadata.openGraph.images[0].alt, /DMC.*Anchor/);
});


test('gauge guide multiplies width by stitch density to obtain stitch count', () => {
  const guide = loadTs('src/lib/guides.ts').guides.find(g => g.slug === 'knitting-gauge-guide');
  const section = guide.sections.find(s => s.heading === 'What would preserving the width require mathematically?').content;
  assert.match(section, /40 × 6\.25 = 250 stitches/);
  assert.doesNotMatch(section, /Divide the desired finished width by your measured stitches per inch/);
  assert.match(section, /20-inch height at 7 rows per inch would require 140 rows/);
});


test('blanket stitch-pattern guide derives yarn use from measured area instead of fixed stitch percentages', () => {
 const guide=loadTs('src/lib/guides.ts').guides.find(g=>g.slug==='blanket-yarn-guide');
 const section=guide.sections.map(s=>s.content).join('\n');
 assert.doesNotMatch(section,/10–15% less|25–30% more|compresses vertically|fewer rows per inch/);
 assert.match(section,/same consumption per area/);
 assert.match(section,/3,000 ÷ 16.*187\.5/);
 assert.match(section,/187\.5 × 20 yards.*3,750 yards/);
 assert.match(section,/representative swatch/);
});

test('blanket purchase advice uses an explicit allowance and actual seller policy', () => {
 const guide=loadTs('src/lib/guides.ts').guides.find(g=>g.slug==='blanket-yarn-guide');
 const text=guide.sections.map(s=>s.content).join('\n');
 assert.ok(text.length>0);
 assert.doesNotMatch(text,/10–15%|Most yarn shops accept returns|buy 14/);
 assert.match(text,/return policy/);
 assert.match(text,/allowance/);
});

test('pricing guide and audit report describe only the implemented calculator scope', () => {
 const guide=loadTs('src/lib/guides.ts').guides.find(g=>g.slug==='pricing-handmade-guide');
 const text=guide.sections.map(s=>s.content).join('\n');
 assert.doesNotMatch(text,/Calculator combines the material, time, overhead/);
 assert.match(text,/does not calculate overhead/);
 const report=readFileSync('docs/tool-accuracy-and-article-workflow-2026-09-05.md','utf8');
 assert.doesNotMatch(report,/Raglan calculator \| Allocation conservation/);
 assert.match(report,/Raglan calculator \|.*circumference.*gauge.*checkpoint/);
});



test('linked guides describe current cast-on, sleeve, and stitch-reference capabilities', () => {
 const guides=loadTs('src/lib/guides.ts').guides;
 const content=slug=>guides.find(g=>g.slug===slug).sections.map(s=>s.content).join(' ');
 assert.doesNotMatch(content('cast-on-methods-guide'),/pattern multiple,? and edge allowance/);
 assert.match(content('cast-on-methods-guide'),/does not automatically add that offset or any edge stitches/);
 assert.match(content('cast-on-methods-guide'),/Do not add a second pair of edge stitches/);
 const sleeve=content('knitting-sleeve-shaping-guide');
 assert.doesNotMatch(sleeve,/provides cap shaping instructions|including the alternating intervals|every 12th row, 10 times|divide the total sleeve rows/);
 assert.match(sleeve,/two fixed one-inch exclusions/);
 assert.match(sleeve,/does not prescribe their order/);
 assert.doesNotMatch(content('crochet-stitch-reference-guide'),/filterable by skill level|these and many more stitch combinations/);
 assert.match(content('crochet-stitch-reference-guide'),/craft filter/);
});
