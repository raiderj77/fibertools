import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

const layout = read("src/app/layout.tsx");
const header = read("src/components/Header.tsx");
const homeDirectory = read("src/components/HomeToolDirectory.tsx");
const newsletter = read("src/components/BeehiivSignup.tsx");
const cookieConsent = read("src/components/CookieConsent.tsx");
const printShare = read("src/components/PrintShareButtons.tsx");
const globals = read("src/app/globals.css");
const blanket = read("src/app/blanket-calculator/BlanketCalculatorTool.tsx");
const circle = read("src/app/circle-calculator/CircleCalculatorTool.tsx");
const shapes = read("src/app/amigurumi-shapes/AmigurumiShapesTool.tsx");
const yarn = read("src/app/yarn-calculator/YarnCalculatorTool.tsx");
const gauge = read("src/app/gauge-calculator/GaugeCalculatorTool.tsx");
const tooltip = read("src/components/Tooltip.tsx");
const projectCost = read("src/app/project-cost-calculator/ProjectCostCalculatorTool.tsx");
const embedShell = read("src/components/EmbedCalculatorShell.tsx");
const embedCodeCard = read("src/components/EmbedCodeCard.tsx");
const weaving = read("src/app/weaving-sett-calculator/WeavingSettCalculatorTool.tsx");
const abbreviations = read("src/app/abbreviation-glossary/AbbreviationGlossaryTool.tsx");
const stitchReference = read("src/app/stitch-quick-reference/StitchQuickReferenceTool.tsx");
const yarnWeights = read("src/app/yarn-weight-chart/YarnWeightChartTool.tsx");
const needleGuide = read("src/app/needle-guide/NeedleGuideTool.tsx");
const castOn = read("src/app/cast-on-calculator/CastOnCalculatorTool.tsx");
const sock = read("src/app/sock-calculator/SockCalculatorTool.tsx");
const sleeve = read("src/app/sleeve-calculator/SleeveCalculatorTool.tsx");
const unitToggle = read("src/components/UnitToggle.tsx");
const patternChecker = read("src/app/amigurumi-pattern-checker/page.tsx");
const knittingNeedles = read("src/app/best-knitting-needles/page.tsx");

function tsxFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return tsxFiles(path);
    return entry.isFile() && entry.name.endsWith(".tsx") ? [path] : [];
  });
}

test("provides a focusable main landmark and keyboard-operable mobile navigation", () => {
  assert.match(layout, /<main id="main-content" tabIndex=\{-1\}/);
  for (const path of tsxFiles("src/app").filter((path) => path !== "src/app/layout.tsx")) {
    assert.doesNotMatch(read(path), /<\/?main\b/, `${path} must use the root layout's main landmark`);
  }
  assert.match(header, /e\.key === "Escape"/);
  assert.match(header, /aria-controls="mobile-navigation"/);
  assert.match(header, /mobileOpen \? "Close menu" : "Open menu"/);
  assert.match(header, /min-h-11 min-w-11/);
});

test("labels the newsletter, cookie choices, and high-traffic calculator controls", () => {
  assert.match(newsletter, /htmlFor={`newsletter-email-\${source}`}/);
  assert.match(newsletter, /id={`newsletter-email-\${source}`}/);
  assert.match(cookieConsent, /aria-describedby="cookie-consent-description"/);

  for (const id of [
    "blanket-overhang",
    "blanket-yarn-weight",
    "blanket-gauge-stitches",
    "blanket-gauge-rows",
    "blanket-gauge-over",
    "blanket-swatch-width",
    "blanket-swatch-height",
    "blanket-swatch-grams",
    "blanket-stitch-multiple",
    "blanket-multiple-extra",
    "blanket-skein-length",
    "blanket-skein-grams",
  ]) {
    assert.match(blanket, new RegExp(`htmlFor="${id}"`));
    assert.match(blanket, new RegExp(`id="${id}"`));
  }

  assert.match(circle, /htmlFor="circle-rounds"/);
  assert.match(circle, /id="circle-rounds"/);
  assert.match(shapes, /htmlFor="shape-total-rounds"/);
  assert.match(shapes, /id="shape-total-rounds"/);
});

test("exposes selected choices and usable touch targets", () => {
  assert.match(blanket, /aria-pressed=\{i === sizeIdx\}/);
  assert.match(circle, /aria-pressed=\{stitchKey === st\.key\}/);
  assert.match(shapes, /aria-pressed=\{shape === s\.key\}/);
  assert.match(yarn, /role="group" aria-label="Calculation method"/);
  assert.match(yarn, /aria-pressed=\{mode === "quick"\}/);
  assert.match(yarn, /aria-pressed=\{mode === "precise"\}/);
  assert.match(unitToggle, /didInitialize\.current/);
  assert.match(unitToggle, /aria-pressed=\{value === "imperial"\}/);
  assert.match(unitToggle, /aria-pressed=\{value === "metric"\}/);
  assert.match(printShare, /min-h-11/);
  assert.match(circle, /className="h-11 w-full accent-sage-600"/);
  assert.match(shapes, /className="h-11 w-full accent-sage-600"/);
  assert.match(globals, /w-6 h-6 rounded-full/);
});

test("bases blanket yarn estimates on measured swatch use and both yarn-label values", () => {
  assert.match(blanket, /parseFloat\(skeinYards\)/);
  assert.match(blanket, /parseFloat\(skeinGrams\)/);
  assert.match(blanket, /parseFloat\(swatchGrams\)/);
  assert.match(blanket, /finished area|widthIn \* lengthIn/);
  assert.doesNotMatch(blanket, /ydsPerSqIn/);
  assert.match(blanket, /Math\.max\(skeinsByLength, skeinsByWeight\)/);
  assert.match(blanket, /skeinYards, skeinGrams/);
  assert.match(blanket, /10% planning buffer/);
});

test("announces copy, share, success, and error feedback", () => {
  assert.match(printShare, /aria-live="polite"/);
  assert.match(circle, /aria-live="polite"/);
  assert.match(shapes, /aria-live="polite"/);
  assert.match(newsletter, /role="status"/);
  assert.match(newsletter, /role="alert"/);
});

test("names filters and makes horizontally scrolling reference tables keyboard accessible", () => {
  assert.match(homeDirectory, /htmlFor="home-tool-search"/);
  assert.match(homeDirectory, /id="home-tool-search"/);
  assert.match(homeDirectory, /role="group" aria-label="Filter the tool directory by project need"/);
  assert.match(homeDirectory, /aria-pressed=\{activeFilter === filter\.value\}/);
  assert.match(homeDirectory, /aria-live="polite"/);

  for (const id of ["yarn-project-type", "yarn-project-size", "yarn-weight", "yarn-stitch-pattern"]) {
    assert.match(yarn, new RegExp(`htmlFor="${id}"`));
    assert.match(yarn, new RegExp(`id="${id}"`));
  }

  for (const id of [
    "weaving-yarn-weight",
    "weaving-structure",
    "weaving-custom-wpi",
    "weaving-project-width",
    "weaving-project-length",
    "weaving-length-allowance",
    "weaving-reed-dent",
  ]) {
    assert.match(weaving, new RegExp(`htmlFor="${id}"`));
    assert.match(weaving, new RegExp(`id="${id}"`));
  }

  assert.match(abbreviations, /aria-label="Filter abbreviations by craft"/);
  assert.match(abbreviations, /aria-label="Filter abbreviations by category"/);
  assert.match(stitchReference, /aria-label="Filter stitches by craft"/);
  assert.match(stitchReference, /aria-label="Search stitches"/);
  assert.match(abbreviations, /aria-label="Search knitting and crochet abbreviations"/);
  assert.match(abbreviations, /aria-label="Pattern line to translate"/);
  assert.match(yarnWeights, /aria-label="Search yarn weights"/);
  assert.match(needleGuide, /aria-label="Search needle types"/);
  assert.match(castOn, /aria-label="Desired width in inches"/);
  assert.match(sock, /aria-label="Foot circumference in inches"/);
  assert.match(sleeve, /aria-label="Upper arm circumference in inches"/);
  assert.match(patternChecker, /tabIndex=\{0\} aria-label="Pattern instruction reference table"/);
  assert.match(knittingNeedles, /tabIndex=\{0\} aria-label="Beginner knitting needle comparison table"/);
});

test("associates every audited Yarn and Gauge field with its visible label", () => {
  const yarnIds = [
    "yarn-custom-width",
    "yarn-custom-length",
    "yarn-gauge-stitches",
    "yarn-gauge-rows",
    "yarn-gauge-over",
    "yarn-skein-length",
    "yarn-skein-weight",
    "yarn-partial-weight",
    "yarn-partial-full-weight",
    "yarn-partial-full-length",
  ];
  const gaugeIds = [
    "gauge-swatch-width",
    "gauge-swatch-height",
    "gauge-swatch-stitches",
    "gauge-swatch-rows",
    "gauge-pattern-stitches",
    "gauge-pattern-rows",
    "gauge-actual-stitches",
    "gauge-actual-rows",
    "gauge-pattern-count",
    "gauge-pattern-row-count",
    "gauge-resize-multiple",
    "gauge-resize-extra",
    "gauge-original-width",
    "gauge-original-height",
    "gauge-dimension-stitches",
    "gauge-dimension-rows",
    "gauge-dimension-over",
    "gauge-desired-width",
    "gauge-desired-height",
    "gauge-dimension-multiple",
    "gauge-dimension-extra",
    "gauge-edge-stitches",
    "gauge-turning-chains",
  ];

  for (const id of yarnIds) {
    assert.match(yarn, new RegExp(`htmlFor="${id}"`));
    assert.match(yarn, new RegExp(`id="${id}"`));
  }
  for (const id of gaugeIds) {
    assert.match(gauge, new RegExp(`htmlFor="${id}"`));
    assert.match(gauge, new RegExp(`id="${id}"`));
  }
});

test("labels every Project Cost field and names row removal controls", () => {
  for (const id of [
    "project-cost-currency",
    "project-cost-total-stitches",
    "project-cost-stitches-per-minute",
    "project-cost-selling-price",
  ]) {
    assert.match(projectCost, new RegExp(`htmlFor="${id}"`));
    assert.match(projectCost, new RegExp(`id="${id}"`));
  }

  for (const id of [
    "project-cost-yarn-${yarnIndex}-name",
    "project-cost-yarn-${yarnIndex}-skeins",
    "project-cost-yarn-${yarnIndex}-price",
    "project-cost-notion-${notionIndex}-name",
    "project-cost-notion-${notionIndex}-price",
  ]) {
    assert.ok(projectCost.includes(`htmlFor={\`${id}\`}`), `missing label association for ${id}`);
    assert.ok(projectCost.includes(`id={\`${id}\`}`), `missing control id for ${id}`);
  }

  assert.match(projectCost, /aria-label=\{`Remove yarn entry \$\{yarnIndex \+ 1\}`\}/);
  assert.match(projectCost, /aria-label=\{`Remove notion or extra \$\{notionIndex \+ 1\}`\}/);
  assert.ok(projectCost.includes('<span className="sr-only">Yarn {yarnIndex + 1} </span>Skeins'));
  assert.ok(projectCost.includes('<span className="sr-only">Yarn {yarnIndex + 1} </span>{sym}/skein'));
});

test("exposes selected Gauge tabs and keyboard-usable embed controls", () => {
  assert.match(gauge, /role="tablist" aria-label="Gauge calculation mode"/);
  assert.match(gauge, /role="tab"/);
  assert.match(gauge, /aria-selected=\{tab === key\}/);
  assert.match(gauge, /tabIndex=\{tab === key \? 0 : -1\}/);
  assert.match(gauge, /ArrowRight/);
  assert.match(gauge, /ArrowLeft/);
  assert.match(gauge, /event\.key === "Home"/);
  assert.match(gauge, /event\.key === "End"/);
  assert.match(gauge, /role="tabpanel"/);
  assert.match(embedShell, /min-h-11/);
  assert.match(embedShell, /target="_blank"/);
  assert.match(embedCodeCard, /tabIndex=\{0\}/);
  assert.match(embedCodeCard, /aria-live="polite"/);
});

test("keeps Gauge help controls outside field labels and relates open tooltips", () => {
  for (const id of [
    "gauge-pattern-count",
    "gauge-resize-multiple",
    "gauge-resize-extra",
    "gauge-dimension-multiple",
    "gauge-edge-stitches",
    "gauge-turning-chains",
  ]) {
    assert.match(gauge, new RegExp(`htmlFor="${id}"[^>]*>[^<]+<\\/label>\\s*<Tooltip`));
  }
  assert.match(tooltip, /aria-describedby=\{show \? tooltipId : undefined\}/);
  assert.match(tooltip, /id=\{tooltipId\} role="tooltip"/);
  assert.match(tooltip, /onMouseEnter=\{\(\) => setShow\(true\)\}/);
  assert.match(tooltip, /onMouseLeave=\{\(\) => setShow\(false\)\}/);
  assert.match(tooltip, /event\.key === "Escape"/);
});

test("announces Gauge clipboard success and failure without an unhandled rejection", () => {
  assert.match(gauge, /await navigator\.clipboard\.writeText\(text\)/);
  assert.match(gauge, /Gauge result copied/);
  assert.match(gauge, /Could not copy the gauge result/);
  assert.match(gauge, /role=\{copyFeedback\.ok \? "status" : "alert"\}/);
});

test("uses a native button only while the mobile sticky result control is visible", () => {
  const source = read("src/components/StickyResult.tsx");

  assert.match(source, /visible && showBar/);
  assert.match(source, /<button[\s\S]*?type="button"/);
  assert.match(source, /aria-label=\{"Return to calculator result: " \+ summary\}/);
  assert.doesNotMatch(source, /role="button"|tabIndex=\{0\}|onKeyDown=/);
});
