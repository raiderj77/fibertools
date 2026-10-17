import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("calculator pages add the requested contextual yarn chart links", () => {
  const yarn = read("src/app/yarn-calculator/page.tsx");
  const blanket = read("src/app/blanket-calculator/page.tsx");
  const castOn = read("src/app/cast-on-calculator/page.tsx");
  const converter = read("src/app/needle-converter/page.tsx");

  assert.match(yarn, /href="\/yarn-weight-chart"[\s\S]*?>\s*yarn weight chart\s*</);
  assert.match(blanket, /href="\/yarn-weight-chart"[\s\S]*?>\s*yarn weight reference\s*</);
  assert.match(converter, /href="\/yarn-weight-chart"[\s\S]*?>\s*yarn weight categories\s*</);
  assert.doesNotMatch(castOn, /href="\/yarn-weight-chart"/);
});

test("every existing guide that discusses yarn-weight categories links the chart in body copy", () => {
  const guides = read("src/lib/guides.ts");
  for (const slug of [
    "reading-yarn-labels",
    "blanket-yarn-guide",
    "wpi-guide",
    "yarn-stash-management-guide",
    "vintage-knitting-patterns",
    "fiber-content-guide",
  ]) {
    const start = guides.indexOf(`slug: "${slug}"`);
    const end = guides.indexOf("\n  {\n    slug:", start + 1);
    const section = guides.slice(start, end === -1 ? undefined : end);
    assert.match(section, /\]\(\/yarn-weight-chart\)/, `${slug} needs a body-copy chart link`);
  }
});

test("guide template suppresses a duplicate bottom CTA when body copy already links the same tool", () => {
  const guidePage = read("src/app/guides/[slug]/page.tsx");
  assert.match(guidePage, /const hasInlineToolLink = Boolean/);
  assert.match(guidePage, /tool && !hasInlineToolLink/);
});
