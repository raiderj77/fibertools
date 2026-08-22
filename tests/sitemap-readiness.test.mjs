import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");
const sitemap = read("src/app/sitemap.ts");
const toolsSource = read("src/lib/tools.ts");

const standaloneToolSlugs = ["yarn-weight-calculator"];

test("sitemap includes every ready canonical tool after the dated experiment gates closed", () => {
  assert.match(
    sitemap,
    /\.filter\(\(t\) => t\.ready\)/,
  );
  assert.doesNotMatch(sitemap, /EXPERIMENT_ADJACENT_TOOL_SLUGS/);
  assert.doesNotMatch(sitemap, /NOINDEX_TOOL_SLUGS/);

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

  for (const slug of standaloneToolSlugs) {
    const pagePath = `src/app/${slug}/page.tsx`;
    assert.match(sitemap, new RegExp(`"${slug}"`));
    assert.ok(fs.existsSync(pagePath), `${slug} must have a public page`);
    assert.match(
      read(pagePath),
      new RegExp(`canonical: ["']/${slug}["']`),
      `${slug} must declare its canonical URL`,
    );
  }
});

test("sitemap includes public offers but excludes minimal embed routes", () => {
  assert.match(sitemap, /path: "\/embeds"/);
  assert.match(sitemap, /path: "\/fiber-project-planning-pack"/);
  assert.doesNotMatch(sitemap, /path: "\/embed\//);
});

test("sitemap reports only evidence-backed modification dates", () => {
  assert.doesNotMatch(sitemap, /TODAY/);
  assert.equal((sitemap.match(/lastModified:/g) ?? []).length, 1);
  assert.match(sitemap, /lastModified: new Date\(g\.date\)/);
});
