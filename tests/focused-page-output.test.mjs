import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { getToolBySlug } from "../src/lib/tools.ts";
import revenuePathCheck from "../scripts/revenue-path-check.js";


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

test("built purchase help and gift previews describe existing downloads", () => {
  const pack = readFileSync(resolve(ROOT, ".next/server/app/fiber-project-planning-pack.html"), "utf8");
  const newsletter = readFileSync(resolve(ROOT, ".next/server/app/newsletter.html"), "utf8");
  assert.match(visibleText(pack), /do not buy the pack again/);
  assert.match(pack, /href="mailto:hello@fibertools\.app"/);
  const schemas = [...pack.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
  const answer = schemas.find(s => s["@type"] === "FAQPage").mainEntity.find(q => q.name === "How is it delivered?").acceptedAnswer.text;
  assert.ok(visibleText(pack).includes(answer));
  assert.match(answer, /checks your payment and starts the PDF download/);
  assert.match(visibleText(newsletter), /gift preview, not a newsletter issue/);
  for (const page of [5, 7]) {
    assert.ok(newsletter.includes(`href="/survival-kit.pdf#page=${page}"`));
    assert.ok(newsletter.includes(`survival-kit-page-${page}.png`));
    const png = readFileSync(resolve(ROOT, `public/images/newsletter/survival-kit-page-${page}.png`));
    assert.equal(png.subarray(1, 4).toString(), "PNG");
    assert.equal(png.readUInt32BE(16), 928);
    assert.equal(png.readUInt32BE(20), 1200);
  }
  assert.equal(createHash("sha256").update(readFileSync(resolve(ROOT, "public/survival-kit.pdf"))).digest("hex"), "e0f3db048c2f188009db6cc395230ace250ac73d4c1957ba6b2785d250af534f");
});

test("built measured-swatch FAQ agrees with its structured answer and skein explanation", () => {
  const html = readFileSync(resolve(ROOT, ".next/server/app/index.html"), "utf8");
  const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
  const answer = faq.mainEntity.find((item) => item.name === "How does the yarn calculator estimate yarn quantities?");
  assert.ok(answer);
  assert.ok(visibleText(html).includes(answer.acceptedAnswer.text));
  assert.match(answer.acceptedAnswer.text, /measured yarn length.*project area divided by swatch area/);
  assert.doesNotMatch(html, /tool identifies whether your yarn/);
  const formula = visibleText(readFileSync(resolve(ROOT, ".next/server/app/formula-library.html"), "utf8"));
  assert.match(formula, /purchase weight = whole skeins × label weight per skein/);
  assert.doesNotMatch(formula, /uses the larger whole-skein result/);
});

test("built hook guide satisfies the route-specific revenue contract", () => {
  const html = readFileSync(resolve(ROOT, ".next/server/app/best-crochet-hooks.html"), "utf8");
  assert.deepEqual(revenuePathCheck.validateRevenuePage({
    path: "/best-crochet-hooks", status: 200, headers: { "content-type": "text/html" }, html,
  }), { path: "/best-crochet-hooks", affiliateLinks: 2, tracking: "delegated" });
});

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

test("bundled fonts preserve verified bytes, licenses, CSS coverage, and Latin preloads", () => {
  const manifest = JSON.parse(readFileSync(resolve(ROOT, "src/data/local-fonts.json"), "utf8"));
  const css = readFileSync(resolve(ROOT, "src/app/fonts.css"), "utf8");
  const layout = readFileSync(resolve(ROOT, "src/app/layout.tsx"), "utf8");
  const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
  assert.equal(manifest.assets.length, 13);
  assert.equal(manifest.licenses.length, 3);
  for (const asset of manifest.assets) {
    const bytes = readFileSync(resolve(ROOT, "public/fonts", asset.file));
    assert.equal(digest(bytes), asset.sha256, asset.file);
    assert.equal(bytes.length, asset.bytes);
    assert.equal(bytes.toString("ascii", 0, 4), "wOF2");
    assert.match(asset.sourceUrl, /^https:\/\/fonts\.gstatic\.com\//);
    assert.ok(css.includes(`/fonts/${asset.file}`));
  }
  for (const license of manifest.licenses) {
    const bytes = readFileSync(resolve(ROOT, "public/fonts", license.file));
    assert.equal(digest(bytes.toString().replace(/\r\n/g, "\n")), license.textSha256);
    assert.match(bytes.toString(), /SIL OPEN FONT LICENSE Version 1\.1/);
    assert.ok(license.sourceUrl.includes(`/${manifest.licenseRepositoryCommit}/`));
  }
  assert.equal(digest(css.replace(/\r\n/g, "\n")), manifest.cssSha256);
  assert.doesNotMatch(layout, /next\/font\/google/);
  assert.match(layout, /import "\.\/fonts\.css"/);
  const html = readFileSync(resolve(ROOT, ".next/server/app/index.html"), "utf8");
  const preloads = html.match(/<link\b[^>]*rel="preload"[^>]*>/g) || [];
  const fontPreloads = preloads.filter((link) => /as="font"/.test(link));
  assert.equal(fontPreloads.length, 3);
  for (const asset of manifest.assets.filter((font) => font.preload)) {
    const link = fontPreloads.find((link) => link.includes(`/fonts/${asset.file}`));
    assert.ok(link, `${asset.family}: Latin preload`);
    assert.match(link, /type="font\/woff2"/);
    assert.match(link, /crossorigin="anonymous"/);
  }
});
