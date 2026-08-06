import assert from "node:assert/strict";
import fs from "node:fs";
import matter from "gray-matter";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

const sitemap = read("src/app/sitemap.ts");
const toolsSource = read("src/lib/tools.ts");

const socialMetadataPages = [
  {
    slug: "gauge-calculator",
    title: "Knitting Gauge Calculator, Stitches Per Inch",
    description:
      "Enter your swatch measurements and get stitches per inch, row gauge, and resized stitch counts instantly. Free knitting and crochet gauge tool.",
  },
  {
    slug: "wpi-calculator",
    title: "WPI to Yarn Weight Converter",
    description:
      "Enter wraps per inch to identify yarn weight, recommended needles, hooks, gauge range, and project ideas. Free WPI tool.",
  },
  {
    slug: "c2c-calculator",
    title: "C2C Blanket Calculator",
    description:
      "Plan your corner-to-corner crochet blanket with block counts, diagonal rows, and yardage estimates from your gauge swatch.",
  },
  {
    slug: "hat-calculator",
    title: "Hat Size Calculator",
    description:
      "Get cast-on count, crown decrease schedule, and yardage for any head size, preemie to large adult with ease adjustments.",
  },
  {
    slug: "granny-square-planner",
    title: "Granny Square Blanket Planner",
    description:
      "Plan your granny square blanket with grid layout, total squares, per-color yardage, and joining yarn estimates.",
  },
  {
    slug: "raglan-calculator",
    title: "Raglan Sweater Calculator",
    description:
      "Calculate neck cast-on, stitch distribution, and increase rounds for a top-down raglan sweater construction.",
  },
  {
    slug: "blocking-calculator",
    title: "Blocking Calculator & Fiber Guide",
    description:
      "Get the right blocking method for your fiber type with stretch feasibility ratings and step-by-step instructions.",
  },
  {
    slug: "stash-estimator",
    title: "Yarn Stash Estimator",
    description:
      "Estimate remaining yardage in partial skeins by weight, plus a yardage reference table for unlabeled yarn by weight category.",
  },
];

test("sitemap includes every ready canonical tool without fabricated modification dates", () => {
  assert.match(sitemap, /\.filter\(\(t\) => t\.ready\)/);
  assert.doesNotMatch(sitemap, /NOINDEX_TOOL_SLUGS|TODAY/);
  assert.equal((sitemap.match(/lastModified:/g) ?? []).length, 1);
  assert.match(sitemap, /lastModified: new Date\(g\.date\)/);

  const readyTools = [
    ...toolsSource.matchAll(
      /\{\s*slug:\s*"([^"]+)"[\s\S]*?ready:\s*(true|false),[\s\S]*?\},/g,
    ),
  ]
    .filter((match) => match[2] === "true")
    .map((match) => match[1]);

  assert.ok(readyTools.length > 0);
  for (const slug of readyTools) {
    const pagePath = `src/app/${slug}/page.tsx`;
    assert.ok(fs.existsSync(pagePath), `${slug} must have a public page`);
    assert.match(
      read(pagePath),
      new RegExp(`canonical: ["']/${slug}["']`),
      `${slug} must declare its canonical URL`,
    );
  }
});

test("audited tool pages expose matching page-specific Open Graph and Twitter metadata", () => {
  for (const { slug, title, description } of socialMetadataPages) {
    const page = read(`src/app/${slug}/page.tsx`);
    assert.match(page, /openGraph:\s*\{/);
    assert.match(page, /twitter:\s*\{/);
    assert.ok(page.split(title).length - 1 >= 3, `${slug} must reuse its page title`);
    assert.ok(
      page.split(description).length - 1 >= 3,
      `${slug} must reuse its page description`,
    );
    assert.match(page, new RegExp(`url: "https://fibertools\\.app/${slug}"`));
    assert.match(page, /card: "summary_large_image"/);
    assert.match(page, /images: \["https:\/\/fibertools\.app\/og-image\.png"\]/);
  }
});

test("global help and navigation links use the canonical guides route", () => {
  const header = read("src/components/Header.tsx");
  const footer = read("src/components/Footer.tsx");
  const structuredData = read("src/components/StructuredData.tsx");

  for (const navigation of [header, footer]) {
    assert.doesNotMatch(navigation, /href: "\/blog"/);
    assert.match(navigation, /href: "\/guides", label: "Guides"/);
  }

  assert.doesNotMatch(structuredData, /https:\/\/fibertools\.app\/blog/);
  assert.match(structuredData, /url: "https:\/\/fibertools\.app\/guides"/);
});

test("all published blog frontmatter parses before static page generation", () => {
  for (const file of fs.readdirSync("content/published")) {
    if (!file.endsWith(".md")) continue;
    assert.doesNotThrow(
      () => matter(read(`content/published/${file}`)),
      `${file} must contain valid YAML frontmatter`,
    );
  }
});
