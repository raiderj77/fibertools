import { readFile, writeFile } from 'node:fs/promises';

const projects = JSON.parse(await readFile(new URL('./pack-math.json', import.meta.url), 'utf8'));
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const table = (headers, rows, cls = '') => `<table class="${cls}"><thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const blanks = (count, cols) => Array.from({ length: count }, () => Array(cols).fill('&nbsp;'));
const field = (label) => `<div class="field">${esc(label)}<span class="write-line"></span></div>`;
const page = (id, title, body, cover = false) => `<section id="${id}" class="page${cover ? ' cover' : ''}"><${cover ? 'h1' : 'h2'}>${esc(title)}</${cover ? 'h1' : 'h2'}>${body}</section>`;
const limits = 'Whole stitches only; color boundaries can land inside a stitch. No foundation-chain or turning-chain consumption is modeled. Tension, joins, edges, and repeat variation change real fabric. The grid is an idealized planning aid, not a guaranteed pooling outcome.';
const reasons = {
 P1: 'A one-stitch step makes the argyle drift.',
 P2: 'Shift 0 stacks colors into plaid columns in the sequence; turned rows mirror the fabric as shown below.',
 P3: 'A two-stitch step makes a faster stair-step that wraps the repeat every 8 rows.'
};
// Text colors chosen for these authoritative section colors; no model values are recalculated.
const darkText = new Set(['#E2725B', '#F2E8C9', '#D9A441', '#7FB2D9', '#F5F5F0']);
function worked(p) {
 const m = p.math;
 const colors = new Map(p.sections.map(s => [s.code, s]));
 const grid = `<table class="pool-grid" aria-label="${esc(p.name)} expected pattern"><tbody>${p.gridCodes.map((row, i) => `<tr><th scope="row">${i + 1}</th>${row.map(code => { const s = colors.get(code); if (!s || !/^#[\dA-F]{6}$/i.test(s.hex)) throw new Error('Invalid grid color'); return `<td style="background:${s.hex};color:${darkText.has(s.hex) ? '#111' : '#fff'}">${esc(code)}</td>`; }).join('')}</tr>`).join('')}</tbody></table>`;
 return page(p.id, p.name, `<p>${esc(p.name)} · ${esc(p.weight)} · ${esc(p.stitch)}</p>
 <p class="honesty">Worked planning example: every stitch number below was computed with the FiberTools pooling model; the swatch yardage is an example measurement — replace it with your own swatch numbers.</p>
 ${table(['Color', 'Name', 'Hex', 'Whole stitches'], p.sections.map(s => [`<span class="chip" style="background:${esc(s.hex)}"></span> ${esc(s.code)}`, esc(s.name), esc(s.hex), esc(s.stitches)]))}
 <p><strong>Total repeat: ${esc(p.totalRepeat)} stitches</strong></p>
 ${table(['Adjustment', 'Row width', 'Shift per row'], p.trials.map(t => [esc(t.adjustment), esc(t.rowWidth), esc(t.shift)]), 'trials')}
 <p>Chosen adjustment: <strong>${esc(p.chosenAdjustment)}</strong>; row width: ${esc(p.rowWidth)}; shift per row: ${esc(p.shiftPerRow)}. ${reasons[p.id]}</p>
 <h3>Expected pattern grid</h3>${grid}
 <p class="small">Odd zero-based rows (printed rows 2, 4, 6, …) are worked back across (turned), so the fabric mirrors while the sequence keeps consuming in order. Row start offsets: ${p.rowStartOffsets.map(esc).join(', ')}.</p>
 <div class="yardage"><h3>Yardage, step by step</h3>
 <p>Example swatch: ${m.swatchRows} rows use ${m.swatchYards} yards.<br>
 Yards per row = ${m.swatchYards} ÷ ${m.swatchRows} = ${m.yardsPerRow} yards/row.<br>
 Planned rows = ${m.projectRows} rows × ${m.panels} panel(s) = ${m.rowsTotal} rows.<br>
 Total stitches = ${p.rowWidth} × ${m.rowsTotal} = ${m.totalStitches} stitches.<br>
 Total yarn = ${m.yardsPerRow} × ${m.rowsTotal} = ${m.totalYards} yards.<br>
 With ${m.overagePct}% overage = ${m.totalYards} × (1 + ${m.overagePct}/100) = ${m.withOverage} yards.<br>
 Skeins = round up (${m.withOverage} ÷ ${m.skeinYards}) = <strong>${m.skeinsNeeded} skein(s)</strong> of ${m.skeinYards} yards each.</p></div>`);
}
const checklist = [
 'Buy all the yarn for the project before you start — pooling eats the sequence in order and a mid-project reorder can change the repeat.',
 'Check the dye-lot number on every label matches; photograph the labels with the first swatch.',
 'Buy the swatch-math yardage plus the overage (15-20 percent, or one extra skein on narrow pieces) from the SAME lot.',
 'Compare each skein: unwind a few yards and confirm the color sequence and section lengths look the same before you wind it into your project.',
 'Keep one full label and the receipt with the project until it is finished.',
 'If a skein runs out mid-row, start the new skein at a color-section boundary, not mid-color.',
 'If you are forced to change dye lots, hide the change at a seam, an edge, or a panel break — expect the repeat lengths to differ slightly.'
];
const trouble = [
 ['Pattern drifts diagonally but I wanted straight columns', 'Shift per row is not 0 — the row width is not the repeat', 'Set adjustment so row width equals the repeat exactly (shift 0).'],
 ['Columns stack, then slowly creep sideways after many rows', 'Tension changes across the row or between sessions', 'Re-swatch at project width; keep the measuring routine identical; note the row where creep starts in the trial log.'],
 ['Pattern breaks suddenly at one point in a row', 'A factory join interrupted the color sequence', 'Cut the yarn at the join and restart at the beginning of the color sequence.'],
 ['New skein starts in the middle of a color', 'Skeins do not all start at the same sequence point', 'Wind off or cut forward to the start of a color section before joining.'],
 ['My edges eat stitches the preview does not show', 'Setup and turning chains consume part of the repeat', 'The model assumes no chain consumption — measure sections in worked stitches only and treat chain stitches as outside the repeat.'],
 ['One color band keeps getting wider or narrower', 'Repeat length varies between skeins or dye lots', 'Measure the new skein sections before joining; if they differ, reserve that skein for a separate panel.'],
 ['Color boundaries look fuzzy or split', 'A boundary lands within a stitch instead of between stitches', 'Count sections in whole stitches only and re-measure at a clean boundary; the grid is idealized.'],
 ['Pooling worked in the swatch but not in the piece', 'Gauge or tension at project width differs from the swatch', 'Swatch at the full project width; adjust hook size before adjusting the stitch counts.']
];
const body = [
 page('cover', 'Planned Pooling Project Pack', `<p class="subtitle">Worksheets, three worked projects, and a dye-lot buying checklist for planned color pooling</p><p>A printable companion to the free Planned Color Pooling Calculator at FiberTools — the calculators stay free; this pack is the paper bridge from preview to finished piece.</p>`, true),
 page('how-to', 'How pooling math works here', `<p>A color repeat is the ordered whole-stitch counts of one full color sequence.</p><p><strong>Row width = repeat + adjustment</strong></p><p><strong>Shift per row = row width mod repeat</strong></p><p>Shift 0 stacks colors into columns in the sequence. Shift 1 steps the pattern one stitch per row (argyle drift); larger shifts step faster. These describe sequence offsets; the grid shows the turned fabric.</p><p>Turned rows are worked back across, so the fabric mirrors while the sequence keeps consuming in order.</p><h3>Measure, preview, then swatch</h3><p>Record one complete sequence, try nearby widths, and work a swatch at the planned width. Keep the trial that suits your real fabric and use its measured yarn consumption for your project plan.</p><h3>Limits</h3><p>${limits}</p>`),
 page('W1', 'W1 — Yarn and Repeat Record', ['Yarn brand / line', 'Weight (CYC)', 'Dye lot', 'Skein yardage', 'Hook / needle'].map(field).join('') + table(['Color', 'Hex', 'Whole stitches'], blanks(10, 3)) + field('Total repeat (whole stitches)')),
 page('W2', 'W2 — Trial Width Log', '<p>Use a fresh swatch at each trial width and record what the fabric actually did.</p>' + table(['Adjustment', 'Row width', 'Shift per row', 'What the swatch did', 'Keep?'], blanks(8, 5), 'trial-log')),
 page('W3', 'W3 — Blank Pooling Grid', '<p>30 rows × 40 columns. Mark your colors and direction of work.</p>' + `<table class="blank-grid" aria-label="Blank pooling grid, 30 rows by 40 columns"><tbody>${Array.from({length:30}, (_, i) => `<tr><th scope="row">${i+1}</th>${'<td></td>'.repeat(40)}</tr>`).join('')}</tbody></table>` + '<h3>Color key</h3>' + table(['Code / mark', 'Color', 'Hex'], blanks(4, 3))),
 page('W4', 'W4 — Project Plan and Yardage', '<h3>Measured swatch</h3>' + ['Rows worked', 'Yarn used (yards)', 'Yards per row = yarn used ÷ rows worked'].map(field).join('') + '<h3>Project</h3>' + ['Planned rows (include all panels)', 'Total yards = yards per row × planned rows', 'Overage %', 'Yards to buy = total yards × (1 + overage % / 100)', 'Skein size (yards)', 'Skeins = round up (yards to buy ÷ skein size)', 'Dye lot'].map(field).join('')),
 page('W5', 'W5 — Row Tracker', '<p>Check each row as you finish it.</p><div class="tracker">' + Array.from({length:120}, (_, i) => `<div><span class="box"></span> ${i+1}</div>`).join('') + '</div>'),
 ...projects.map(worked),
 page('checklist', 'Dye-Lot Buying Checklist', '<ul class="checklist">' + checklist.map(s => `<li><span class="box"></span>${esc(s)}</li>`).join('') + '</ul>'),
 page('troubleshooting', 'Troubleshooting Grid', table(['Symptom', 'Likely cause', 'Fix'], trouble.map(row => row.map(esc)), 'troubleshooting')),
 page('closing', 'From preview to finished piece', '<ol><li>Measure one full color sequence in whole stitches and record your yarn and dye lot.</li><li>Try widths in the free calculator, then swatch at project width and log the result.</li><li>Measure swatch yardage, scale to all planned rows, add overage, and round up skeins from the same lot.</li><li>Track your rows and check tension, sequence boundaries, and each new skein as you work.</li></ol>' + `<p>${limits}</p><p>The free Planned Color Pooling Calculator and all other FiberTools calculators are at fibertools.app — they stay free.</p>`)
].join('\n');
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Planned Pooling Project Pack</title><style>
@page { size: Letter; margin: 0.75in; }
* { box-sizing: border-box; }
body { margin: 0; color: #182c30; background: white; font: 10pt/1.4 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.page { break-before: page; page-break-before: always; }
.cover { break-before: auto; page-break-before: auto; padding-top: 1in; }
h1 { font-size: 32pt; line-height: 1.15; } h2 { font-size: 21pt; line-height: 1.2; margin: 0 0 16pt; } h3 { font-size: 12pt; margin: 14pt 0 6pt; break-after: avoid; }
.subtitle { font-size: 18pt; } p { margin: 8pt 0; } table { border-collapse: collapse; width: 100%; margin: 10pt 0; table-layout: fixed; } th, td { border: 1px solid #b9c4c5; padding: 7pt; vertical-align: top; overflow-wrap: anywhere; } th { text-align: left; background: #eef3f2; } thead { display: table-header-group; } tr, .yardage { break-inside: avoid; }
.field { margin: 10pt 0; } .write-line { display: block; min-height: 22pt; border-bottom: 1px solid #829397; } .trial-log td { height: 42pt; } .chip { display: inline-block; width: 14pt; height: 14pt; border: 1px solid #555; vertical-align: middle; }
.pool-grid, .blank-grid { table-layout: fixed; } .pool-grid th, .pool-grid td { padding: 2pt 0; text-align: center; font-size: 7pt; height: 17pt; } .pool-grid th { width: 22pt; } .blank-grid th, .blank-grid td { padding: 0; text-align: center; height: 12pt; font-size: 7pt; } .blank-grid th { width: 20pt; }
.pool-grid td, .chip, th { print-color-adjust: exact; -webkit-print-color-adjust: exact; } .small { font-size: 8pt; } .honesty { border-left: 3pt solid #37666b; padding-left: 9pt; } .tracker { display: grid; grid-auto-flow: column; grid-template-rows: repeat(24, 1fr); grid-template-columns: repeat(5, 1fr); gap: 8pt 14pt; } .box { display: inline-block; width: 10pt; height: 10pt; border: 1px solid #52666b; margin-right: 6pt; vertical-align: baseline; flex-shrink: 0; } .checklist { list-style: none; padding: 0; } .checklist li { display: flex; align-items: baseline; margin: 18pt 0; } ol li { margin: 16pt 0; } .troubleshooting { font-size: 9pt; }
@media screen { body { max-width: 8.5in; margin: auto; padding: 0.75in; } .page { margin-bottom: 48pt; } }
</style></head><body><main>${body}</main></body></html>\n`;
await writeFile(new URL('./planned-pooling-project-pack.html', import.meta.url), html);
console.log(`Generated planned-pooling-project-pack.html (${Buffer.byteLength(html)} bytes)`);
