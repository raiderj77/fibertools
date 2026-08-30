import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");
const sliceBetween = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));

test("Circle public surfaces describe a bounded preset schedule without shape guarantees", () => {
  const faqs = read("src/lib/faqs.ts");
  const content = read("src/lib/toolContent.ts");
  const guides = read("src/lib/guides.ts");
  const combined = [
    read("src/app/circle-calculator/page.tsx"),
    read("src/app/circle-calculator/CircleCalculatorTool.tsx"),
    sliceBetween(faqs, '"circle-calculator":', '"needle-guide":'),
    sliceBetween(content, '"circle-calculator":', '"needle-guide":'),
    sliceBetween(guides, 'slug: "flat-circle-crochet-guide"', 'slug: "sewing-craft-needle-guide"'),
    read("src/components/ToolAffiliateRecommendations.tsx"),
  ].join("\n");

  assert.match(combined, /common starting-count preset/i);
  assert.match(combined, /does not accept gauge or target diameter/i);
  assert.match(combined, /cannot guarantee flatness|does not guarantee a flat or round result/i);
  assert.doesNotMatch(combined, /perfect circle|for any stitch|true round|every time|no curling|no ruffling|works for knitting gauge|finished circle plan/i);
});

test("Circle live updates announce only the compact summary, not the full schedule", () => {
  const component = read("src/app/circle-calculator/CircleCalculatorTool.tsx");
  assert.match(component, /<p aria-live="polite" aria-atomic="true" className="sr-only">/);
  assert.doesNotMatch(component, /<div aria-live="polite" aria-atomic="true" className="space-y-4">/);
});

test("Gauge public surfaces state proportional, bounded arithmetic and explicit limits", () => {
  const faqs = read("src/lib/faqs.ts");
  const content = read("src/lib/toolContent.ts");
  const guides = read("src/lib/guides.ts");
  const combined = [
    read("src/app/gauge-calculator/page.tsx"),
    read("src/app/gauge-calculator/GaugeCalculatorTool.tsx"),
    read("src/app/embed/gauge-calculator/page.tsx"),
    sliceBetween(faqs, '"gauge-calculator":', '"yarn-weight-chart":'),
    sliceBetween(content, '"gauge-calculator":', '"yarn-weight-chart":'),
    sliceBetween(guides, 'slug: "knitting-gauge-guide"', 'slug: "blanket-yarn-guide"'),
  ].join("\n");

  assert.match(combined, /proportionally scale|proportional count/i);
  assert.match(combined, /at-or-above width/i);
  assert.match(combined, /does not regrade|do not regrade/i);
  assert.doesNotMatch(combined, /finished project comes out the right size|exact gauge|recalculate every stitch|resized project will fit|Resize Pattern|controls every dimension|controlled entirely|almost always more important/i);
});
