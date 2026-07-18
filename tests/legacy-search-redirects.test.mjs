import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const config = fs.readFileSync("next.config.mjs", "utf8");

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
