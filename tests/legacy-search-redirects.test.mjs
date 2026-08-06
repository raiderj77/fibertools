import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const config = fs.readFileSync("next.config.mjs", "utf8");
const guides = fs.readFileSync("src/lib/guides.ts", "utf8");

const replacements = new Map([
  ["/yarn-weight-comparison", "/yarn-weight-chart"],
  ["/blog/knitting-abbreviations-guide", "/abbreviation-glossary"],
  ["/blog/gauge-calculator-guide", "/gauge-calculator"],
  ["/blog/needle-size-chart-guide", "/needle-converter"],
  ["/blog/spinning-wheel-guide", "/spinning-ratio-calculator"],
  ["/blog/increase-decrease-guide", "/increase-decrease-calculator"],
  ["/blog/weaving-sett-guide", "/weaving-sett-calculator"],
  ["/blog/yarn-weight-chart-guide", "/yarn-weight-chart"],
  ["/blog/color-pooling-guide", "/color-pooling-calculator"],
  ["/blog/sock-knitting-guide", "/sock-calculator"],
  ["/blog/granny-square-guide", "/guides/granny-square-blanket-guide"],
  ["/blog/sweater-yarn-estimation-guide", "/yarn-calculator"],
  ["/blog/cast-on-guide", "/cast-on-calculator"],
]);

test("maps Search Console legacy URLs to their closest live replacements", () => {
  for (const [source, destination] of replacements) {
    const sourceAt = config.indexOf(`source: '${source}'`);
    const destinationAt = config.indexOf(`destination: '${destination}'`, sourceAt);
    assert.notEqual(sourceAt, -1, `missing ${source}`);
    assert.notEqual(destinationAt, -1, `missing ${source} -> ${destination}`);
    assert.ok(destinationAt - sourceAt < 180, `${source} must map directly to ${destination}`);
  }
});

test("keeps exact legacy redirects ahead of the generic blog fallback", () => {
  const fallbackAt = config.indexOf("source: '/blog/:path*'");
  assert.notEqual(fallbackAt, -1);
  for (const source of replacements.keys()) {
    if (source.startsWith("/blog/")) {
      assert.ok(config.indexOf(`source: '${source}'`) < fallbackAt, `${source} must precede fallback`);
    }
  }
});

test("routes legacy searches only to maintained canonical pages", () => {
  for (const destination of replacements.values()) {
    if (destination.startsWith("/guides/")) {
      const slug = destination.slice("/guides/".length);
      assert.match(guides, new RegExp(`slug: ["']${slug}["']`));
      continue;
    }

    const pagePath = `src/app${destination}/page.tsx`;
    assert.ok(fs.existsSync(pagePath), `${destination} must have a public page`);
    assert.match(
      fs.readFileSync(pagePath, "utf8"),
      new RegExp(`canonical: ["']${destination}["']`),
      `${destination} must declare its canonical URL`,
    );
  }
});

test("does not force project-time intent onto the cost calculator", () => {
  assert.equal(config.indexOf("source: '/blog/project-time-estimation-guide'"), -1);
});
