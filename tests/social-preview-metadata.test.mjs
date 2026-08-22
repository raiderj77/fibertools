import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const pages = [
  ["blocking-calculator", "Blocking Calculator & Fiber Guide"],
  ["c2c-calculator", "C2C Blanket Calculator"],
  ["gauge-calculator", "Knitting Gauge Calculator, Stitches Per Inch"],
  ["granny-square-planner", "Granny Square Blanket Planner"],
  ["hat-calculator", "Hat Size Calculator"],
  ["raglan-calculator", "Raglan Sweater Calculator"],
  ["stash-estimator", "Yarn Stash Estimator"],
  ["wpi-calculator", "WPI to Yarn Weight Converter"],
];

function readPage(slug) {
  return readFileSync(join(process.cwd(), "src", "app", slug, "page.tsx"), "utf8");
}

test("shareable calculator pages provide page-specific Open Graph and Twitter cards", () => {
  for (const [slug, title] of pages) {
    const source = readPage(slug);
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    assert.match(source, /openGraph:\s*\{/u, `${slug} is missing Open Graph metadata`);
    assert.match(source, /twitter:\s*\{/u, `${slug} is missing Twitter card metadata`);
    assert.match(source, new RegExp(`url: "https://fibertools\\.app/${slug}"`, "u"));
    assert.match(source, new RegExp(`title: "${escapedTitle}"`, "u"));
    assert.match(source, /images: \[(?:\{ )?url: "\/og-image\.png"/u);
  }
});

test("social cards use large-image previews without changing canonical URLs", () => {
  for (const [slug] of pages) {
    const source = readPage(slug);

    assert.match(source, /card: "summary_large_image"/u);
    assert.match(source, new RegExp(`alternates: \\{ canonical: "/${slug}" \\}`, "u"));
  }
});

test("navigation keeps formulas discoverable and tool help points to the canonical guide hub", () => {
  const header = readFileSync(join(process.cwd(), "src", "components", "Header.tsx"), "utf8");
  const footer = readFileSync(join(process.cwd(), "src", "components", "Footer.tsx"), "utf8");
  const structuredData = readFileSync(
    join(process.cwd(), "src", "components", "StructuredData.tsx"),
    "utf8",
  );

  assert.doesNotMatch(header, /href: "\/blog"/u);
  assert.doesNotMatch(footer, /href: "\/blog"/u);
  assert.match(header, /href: "\/formula-library"/u);
  assert.match(footer, /href: "\/guides"/u);
  assert.match(structuredData, /softwareHelp:\s*\{[\s\S]*?url: "https:\/\/fibertools\.app\/guides"/u);
});
