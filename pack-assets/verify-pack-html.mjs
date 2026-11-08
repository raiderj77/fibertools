import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = name => readFile(new URL(name, import.meta.url), 'utf8');
const projects = JSON.parse(await read('./pack-math.json'));
const html = await read('./planned-pooling-project-pack.html');
assert.doesNotMatch(html, /<script\b|<nav\b/i);
assert.match(html, /@page\s*\{ size: Letter; margin: 0.75in;/);
const luminance = hex => { const rgb = hex.slice(1).match(/../g).map(v => parseInt(v, 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722; };
const section = id => { const match = html.match(new RegExp(`<section id="${id}"[^>]*>([\\s\\S]*?)</section>`)); assert.ok(match, id); return match[1]; };
for (const p of projects) {
 const output = section(p.id);
 assert.ok(output.includes(p.name));
 for (const t of p.trials) assert.ok(output.includes(`<tr><td>${t.adjustment}</td><td>${t.rowWidth}</td><td>${t.shift}</td></tr>`), `${p.id} trial ${t.adjustment}`);
 const grid = output.match(/<table class="pool-grid"[^>]*><tbody>([\s\S]*?)<\/tbody>/)[1];
 const rows = [...grid.matchAll(/<tr>([\s\S]*?)<\/tr>/g)];
 assert.equal(rows.length, 12);
 rows.forEach((row, i) => {
  const cells = [...row[1].matchAll(/<td style="background:(#[\dA-F]{6});color:(#[\da-f]+)">([A-Z]{2})<\/td>/g)];
  assert.deepEqual(cells.map(c => c[3]), p.gridCodes[i]);
  cells.forEach(c => {
   assert.equal(c[1], p.sections.find(s => s.code === c[3]).hex);
   const fg = c[2] === '#fff' ? '#FFFFFF' : '#111111';
   const a = luminance(fg), b = luminance(c[1]);
   assert.ok((Math.max(a,b)+0.05)/(Math.min(a,b)+0.05) >= 4.5, `Low contrast: ${c[1]}`);
  });
 });
 const m = p.math;
 for (const equation of [
  `${m.swatchYards} ÷ ${m.swatchRows} = ${m.yardsPerRow}`,
  `${m.projectRows} rows × ${m.panels} panel(s) = ${m.rowsTotal}`,
  `${p.rowWidth} × ${m.rowsTotal} = ${m.totalStitches}`,
  `${m.yardsPerRow} × ${m.rowsTotal} = ${m.totalYards}`,
  `${m.totalYards} × (1 + ${m.overagePct}/100) = ${m.withOverage}`,
  `round up (${m.withOverage} ÷ ${m.skeinYards}) = <strong>${m.skeinsNeeded} skein(s)`
 ]) assert.ok(output.includes(equation), `${p.id}: ${equation}`);
 assert.ok(output.includes(p.rowStartOffsets.join(', ')));
 console.log(`${p.id}: ${p.name}; all ${p.trials.length} trials, 12 grid rows, offsets and yardage equations verified; ${m.skeinsNeeded} skein(s)`);
}
assert.equal(projects[1].math.withOverage, 607.2);
assert.deepEqual(projects[2].rowStartOffsets.slice(0, 9), [0,2,4,6,8,10,12,14,0]);
assert.equal((section('W1').match(/<tr>/g) || []).length, 11);
assert.equal((section('W2').match(/<tr>/g) || []).length, 9);
const blank = section('W3').match(/<table class="blank-grid"[^>]*><tbody>([\s\S]*?)<\/tbody>/)[1];
assert.equal([...blank.matchAll(/<tr>/g)].length, 30);
assert.equal([...blank.matchAll(/<td><\/td>/g)].length, 1200);
const tracker = section('W5');
for (let i = 1; i <= 120; i++) assert.ok(tracker.includes(`<span class="box"></span> ${i}</div>`));
assert.equal((section('checklist').match(/<li>/g) || []).length, 7);
assert.equal((section('troubleshooting').match(/<tr>/g) || []).length, 9);
assert.equal((html.match(/<section /g) || []).length, 13);
console.log(`PASS: worksheets, 120 tracker rows, checklist, troubleshooting, 13 sections, print CSS, no scripts/navigation; ${Buffer.byteLength(html)} bytes`);
