import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

function section(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);

  assert.notEqual(startIndex, -1, `Missing section start: ${start}`);
  assert.notEqual(endIndex, -1, `Missing section end: ${end}`);
  return source.slice(startIndex, endIndex);
}

const blanketPage = read("src/app/blanket-calculator/page.tsx");
const projectCostPage = read("src/app/project-cost-calculator/page.tsx");
const projectCostTool = read("src/app/project-cost-calculator/ProjectCostCalculatorTool.tsx");
const stitchCounterTool = read("src/app/stitch-counter/StitchCounterTool.tsx");
const stitchCounterPage = read("src/app/stitch-counter/page.tsx");
const faqs = read("src/lib/faqs.ts");
const toolContent = read("src/lib/toolContent.ts");
const toolRegistry = read("src/lib/tools.ts");
const llms = read("public/llms.txt");
const llmsFull = read("public/llms-full.txt");

test("keeps the increase/decrease and sleeve examples arithmetically consistent", () => {
  assert.match(toolContent, /start with 40 stitches and set a target of 30 stitches/);
  assert.match(toolContent, /10 single-stitch decreases leaves 30 stitches/);
  assert.doesNotMatch(toolContent, /cast on 40 stitches[\s\S]{0,300}Bind off the remaining 20 stitches/);

  const sleeve = section(
    toolContent,
    '  "sleeve-calculator": {',
    '  "raglan-calculator": {',
  );
  assert.match(sleeve, /60 upper-arm stitches and 40 cuff stitches/);
  assert.match(sleeve, /six 8-row intervals and four 9-row intervals/);
  assert.match(sleeve, /6 × 8 \+ 4 × 9 = 84/);
  assert.match(sleeve, /10 events × 2 stitches = 20 stitches removed, leaving 40/);
  assert.match(sleeve, /rounds each result to the nearest whole stitch/);
  assert.match(sleeve, /does not round the counts to even numbers/);
  assert.match(sleeve, /If their difference is odd, the paired-decrease model returns an unsupported result/);
  assert.match(sleeve, /If decrease events exceed shaping rows, the model refuses the schedule/);
  assert.match(sleeve, /does not model ease, sleeve caps, armholes, pickups, compound shaping/);
  assert.doesNotMatch(sleeve, /35 at wrist|25-stitch difference|13 decrease events/);
  assert.doesNotMatch(
    sleeve,
    /smooth, professional|for any gauge|rounding both to even numbers|rounded to an even number|Decreases are always worked in pairs|reverse the instructions/,
  );
});

test("keeps sleeve FAQs within the calculator's finite paired-decrease model", () => {
  const faq = section(faqs, '  "sleeve-calculator": [', '  "raglan-calculator": [');

  assert.match(faq, /rounds each result to the nearest whole stitch/);
  assert.match(faq, /does not prescribe a universal technique/);
  assert.match(faq, /They are not universal buffer requirements/);
  assert.match(faq, /rounded stitch counts differ by an odd number/);
  assert.match(faq, /does not silently change the target or generate a zero-row interval/);
  assert.doesNotMatch(faq, /smooth transition|distributes the shaping smoothly|typically SSK/);
});

test("describes the project-cost output as entered materials and scenario arithmetic", () => {
  const content = section(
    toolContent,
    '  "project-cost-calculator": {',
    '  "color-pooling-calculator": {',
  );
  const faq = section(
    faqs,
    '  "project-cost-calculator": [',
    '  "color-pooling-calculator": [',
  );

  assert.match(content, /material subtotal is 3 × \$8 \+ \$6 = \$30/i);
  assert.match(content, /12,000 ÷ 20 ÷ 60 = 10 hours/);
  assert.match(content, /amount after materials = selling price − material subtotal/);
  assert.match(content, /neither recommends a selling price/i);
  assert.match(content, /Selecting a currency changes the displayed symbol; it does not convert amounts/);
  assert.doesNotMatch(content, /Total: \$914|Fair retail price would be|2,600 uses|materials × 2/);

  assert.match(faq, /It is a material subtotal, not a complete budget and not materials plus labor/);
  assert.match(faq, /total stitches divided by the entered stitches per minute and then by 60/);
  assert.match(faq, /does not add labor cost or determine a fair price/);
  assert.doesNotMatch(faq, /typically range from \$30|materials × 2|Beginners average/);

  assert.match(projectCostPage, /The total is entered materials only/);
  assert.match(projectCostPage, /It does not add labor cost, time setup or finishing work, determine net profit/);
  assert.match(projectCostPage, /arithmetic subtotal, not a complete project or business budget/);
  assert.doesNotMatch(
    projectCostPage,
    /realistic pricing guide|account for every supply|most honest project cost|actual per-skein costs/,
  );

  assert.match(projectCostTool, /Entered Material Subtotal/);
  assert.match(projectCostTool, /Entered materials total/);
  assert.match(projectCostTool, /Selling price minus entered materials/);
  assert.match(projectCostTool, /Hourly remainder after entered materials/);
  assert.match(projectCostTool, /It is not labor cost, net profit, or a price recommendation/);
  assert.match(projectCostTool, /calculateProjectCostSummary/);
  assert.doesNotMatch(projectCostTool, /Beginners: 15-20|Profit after materials|Effective hourly rate|Project cost:/);
});

test("qualifies stitch-counter persistence and exact-count reminder behavior", () => {
  const faq = section(faqs, '  "stitch-counter": [', '  "blanket-calculator": [');
  const content = section(toolContent, '  "stitch-counter": {', '  "blanket-calculator": {');

  assert.match(faq, /same browser and device/);
  assert.match(faq, /It does not sync to another browser or device/);
  assert.match(faq, /storage is blocked, cleared, or reset/);
  assert.match(faq, /checked only when the first counter reaches that count/);
  assert.match(faq, /do not create a repeating interval/);
  assert.match(content, /manual tracking and reminder tool, not a pattern verifier/);
  assert.match(content, /does not automatically create later reminders at the same interval/);
  assert.match(stitchCounterTool, /This browser attempts a local save/);
  assert.match(stitchCounterTool, /checked against the first counter at the exact count/);
  assert.match(stitchCounterTool, /\[\.\.\.reminders\]\.sort/);
  assert.doesNotMatch(faq, /They.ll be right where you left them/);
  assert.doesNotMatch(content, /always accessible from any device|Set row reminders on any counter|can be configured to repeat|works offline and stores state locally/);
  assert.doesNotMatch(stitchCounterTool, /counts auto-save|they&apos;ll still be here|great for decrease schedules/);
  assert.match(stitchCounterPage, /Each total reflects the taps you record/);
  assert.match(stitchCounterPage, /storage can be unavailable or cleared/);
  assert.match(stitchCounterPage, /reminders do not attach independently/);
  assert.match(stitchCounterPage, /per-counter reset is recorded as one undoable count change/);
  assert.match(stitchCounterPage, /Reset all counters to 0.*clears the undo and redo history/);
  assert.match(faq, /per-counter reset.*50-action undo\/redo history/);
  assert.match(content, /reset control on one counter is recorded as one undoable count change/);
  assert.doesNotMatch(stitchCounterPage, /Works offline|offline support|saves automatically|works without an internet connection|prevents frogging|know exactly where you are/i);
  assert.doesNotMatch(content, /There is no undo for a reset/);

  for (const publicSource of [toolRegistry, llms, llmsFull]) {
    assert.doesNotMatch(publicSource, /Stitch Counter[^\n]*offline support|stitch and row counter[^\n]*offline support/i);
  }
});

test("keeps public registry and LLM summaries aligned with corrected calculator boundaries", () => {
  for (const publicSource of [toolRegistry, llms, llmsFull]) {
    assert.match(publicSource, /entered|Total the yarn/i);
    assert.match(publicSource, /paired-decrease|paired decrease/);
    assert.doesNotMatch(publicSource, /Project Cost Calculator[^\n]*including yarn, notions, and (?:an estimate of your )?time|row-by-row (?:increase or )?decrease instructions for tapered sleeves/i);
  }
  assert.doesNotMatch(llms, /blog\/(?:project-cost-guide|project-time-estimation-guide|sleeve-calculator-guide)/);
  assert.doesNotMatch(llmsFull, /blog\/project-cost-guide/);
});

test("sends blanket users to the actual material-subtotal workflow", () => {
  assert.match(blanketPage, /href: "\/project-cost-calculator"/);
  assert.match(blanketPage, /label: "Total the entered materials"/);
  assert.match(blanketPage, /Use the whole-skein count as the yarn quantity/);
  assert.match(blanketPage, /material subtotal/);
  assert.doesNotMatch(blanketPage, /optional labor cost/);
});
