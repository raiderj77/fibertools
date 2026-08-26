import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";


const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTES = [
  { route: "blanket-calculator", component: "BlanketCalculatorTool", marker: 'id="blanket-yarn-weight"' },
  { route: "yarn-calculator", component: "YarnCalculatorTool", marker: 'id="yarn-project-type"' },
  { route: "circle-calculator", component: "CircleCalculatorTool", marker: 'id="circle-rounds"' },
  { route: "amigurumi-shapes", component: "AmigurumiShapesTool", marker: 'id="shape-total-rounds"' },
  { route: "cast-on-calculator", component: "CastOnCalculatorTool", marker: 'aria-label="Desired width in inches"' },
  { route: "sock-calculator", component: "SockCalculatorTool", marker: 'aria-label="Foot circumference in inches"' },
];


function count(haystack, needle) {
  return haystack.toLowerCase().split(needle.toLowerCase()).length - 1;
}


function visibleMarkup(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
}


function visibleText(html) {
  return visibleMarkup(html)
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/<!--.*?-->/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}


test("six route sources use the focused two-child contract", () => {
  for (const { route, component } of ROUTES) {
    const source = readFileSync(resolve(ROOT, `src/app/${route}/page.tsx`), "utf8");
    assert.match(source, /<ToolLayout[\s\S]*?\bfocused\b/);
    const answerIndex = source.indexOf("<AnswerBlock");
    const calculatorIndex = source.indexOf(`<${component}`);
    assert(answerIndex >= 0, `${route}: missing AnswerBlock`);
    assert(calculatorIndex > answerIndex, `${route}: calculator must follow AnswerBlock`);
    assert.match(source, /nextAction=\{\{/);
  }
});


test("focused ToolLayout keeps education, FAQ, next action, then affiliate order", () => {
  const source = readFileSync(resolve(ROOT, "src/components/ToolLayout.tsx"), "utf8");
  assert.match(source, /focusedCore = focused \? childItems\.slice\(0, 2\) : children/);
  const markers = [
    "Formula and calculation method",
    "Worked example",
    "Assumptions and limitations",
    "{focusedReferences}",
    'heading="Frequently Asked Questions"',
    "Next step",
    "<ToolAffiliateRecommendations slug={slug}",
  ];
  let previous = -1;
  for (const marker of markers) {
    const index = source.indexOf(marker, previous + 1);
    assert(index > previous, `ToolLayout marker out of order: ${marker}`);
    previous = index;
  }
  assert.match(source, /\{!focused && \([\s\S]*?<ToolAffiliateRecommendations/);
});


for (const { route, marker } of ROUTES) {
  test(`${route} built HTML has one focused journey in the required order`, () => {
    const htmlPath = resolve(ROOT, `.next/server/app/${route}.html`);
    assert(existsSync(htmlPath), `Missing built output: ${htmlPath}`);
    const html = readFileSync(htmlPath, "utf8");
    const markup = visibleMarkup(html);
    const text = visibleText(html);

    const ordered = [
      'aria-label="Quick Answer"',
      marker,
      "Formula and calculation method",
      "Worked example",
      "Assumptions and limitations",
      "References",
      "Frequently Asked Questions",
      "Next step",
      "Project-ready supplies",
    ];
    let previous = -1;
    for (const value of ordered) {
      const index = markup.toLowerCase().indexOf(value.toLowerCase(), previous + 1);
      assert(index > previous, `${route}: missing or out-of-order marker ${value}`);
      previous = index;
    }

    for (const once of [
      'aria-label="Quick Answer"',
      "Formula and calculation method",
      "Worked example",
      "Assumptions and limitations",
      "Frequently Asked Questions",
      "Next step",
      "Project-ready supplies",
    ]) {
      const surface = once.startsWith("aria-label") ? markup : text;
      assert.equal(count(surface, once), 1, `${route}: expected one ${once}`);
    }

    for (const absent of [
      "When to Use This Calculator",
      "Common Mistakes to Avoid",
      "References and Industry Standards",
      "Explore Related Fiber Arts Tools",
      "Track This Project",
      "Continue Exploring FiberTools",
    ]) {
      assert.equal(count(text, absent), 0, `${route}: old generic section rendered: ${absent}`);
    }
  });
}
