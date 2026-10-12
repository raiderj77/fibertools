import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getToolBySlug } from "../src/lib/tools.ts";


const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROUTES = [
  { route: "blanket-calculator", component: "BlanketCalculatorTool", marker: 'id="blanket-yarn-weight"' },
  { route: "yarn-calculator", component: "YarnCalculatorTool", marker: 'id="yarn-project-type"' },
  { route: "gauge-calculator", component: "GaugeCalculatorTool", marker: 'id="gauge-swatch-width"' },
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

test("built homepage uses qualified tool descriptions and neutral featured labels", () => {
  const html = readFileSync(resolve(ROOT, ".next/server/app/index.html"), "utf8");
  const text = visibleText(html);

  assert.ok(text.includes("Five calculators to help size projects, estimate materials, and work through construction math."));
  assert.ok(text.includes("Also featured"));
  for (const slug of ["yarn-calculator", "spinning-ratio-calculator"]) {
    assert.ok(text.includes(getToolBySlug(slug).description), `${slug}: corrected description must be visible`);
  }
  assert.doesNotMatch(text, /Calculate exactly how much yarn you need for any project|the only online tool for spinners|proven tools|most visitors|Also popular/iu);
});

for (const slug of ["yarn-calculator", "spinning-ratio-calculator"]) {
  test(`${slug} built introduction and structured data share the qualified description`, () => {
    const html = readFileSync(resolve(ROOT, `.next/server/app/${slug}.html`), "utf8");
    const description = getToolBySlug(slug).description;
    assert.ok(visibleText(html).includes(description), `${slug}: introduction must use the shared description`);

    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gu)]
      .map((match) => JSON.parse(match[1]));
    const toolSchema = schemas.find((schema) => schema["@type"] === "WebApplication" && schema.url === `https://fibertools.app/${slug}`);
    assert.ok(toolSchema, `${slug}: missing WebApplication schema`);
    assert.equal(toolSchema.description, description);
  });
}


test("focused calculator routes use the two-child contract", () => {
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


test("built crochet hook guide keeps factual limits and FAQ answers aligned with schemas", () => {
  const html = readFileSync(resolve(ROOT, ".next/server/app/best-crochet-hooks.html"), "utf8");
  const text = visibleText(html);
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gu)]
    .map((match) => JSON.parse(match[1]));
  const article = schemas.find((schema) => schema["@type"] === "Article");
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
  assert.ok(article && faq, "Article and FAQ schemas must exist");
  assert.ok(text.includes(article.headline));
  assert.equal(article.dateModified, "2026-10-10");
  assert.ok(text.includes("Last updated: October 10, 2026"));
  assert.match(html, /<title>Crochet Hook Selection Guide: Size, Grip &amp; Gauge \| FiberTools<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/fibertools.app\/best-crochet-hooks"/);
  assert.ok(text.includes("not a hands-on product test"));
  assert.ok(text.includes("not evidence of pain relief or fatigue reduction"));
  assert.doesNotMatch(text + JSON.stringify(schemas), /best overall|top all-around|reduce[s]? (?:wrist and hand|hand) fatigue|arthritis|carpal tunnel|comfortable for hours/i);
  assert.equal(faq.mainEntity.length, 4);
  for (const item of faq.mainEntity) {
    assert.ok(text.includes(item.name), `Missing visible FAQ: ${item.name}`);
    assert.ok(text.includes(item.acceptedAnswer.text), `Schema differs from visible answer: ${item.name}`);
  }
  const paidLinks = [...visibleMarkup(html).matchAll(/<a\b[^>]*href="([^"]*amazon.com[^"]*)"[^>]*>[\s\S]*?<\/a>/g)];
  assert.equal(paidLinks.length, 2);
  for (const [link] of paidLinks) {
    assert.match(link, /rel="sponsored nofollow noopener"/);
    assert.match(link, /paid link/);
    assert.ok(text.indexOf("FiberTools may earn a commission") < text.indexOf("Search Clover Amour on Amazon"));
  }
  const sitemap = readFileSync(resolve(ROOT, ".next/server/app/sitemap.xml.body"), "utf8");
  assert.match(sitemap, /<loc>https:\/\/fibertools.app\/best-crochet-hooks<\/loc>\s*<lastmod>2026-10-10(?:T[^<]*)?<\/lastmod>/);
});
