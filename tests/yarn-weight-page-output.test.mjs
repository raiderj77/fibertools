import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const html = readFileSync(new URL("../.next/server/app/yarn-weight-chart.html", import.meta.url), "utf8");
const visible = html.replace(/<script\b[\s\S]*?<\/script>/gi, "");
const text = visible.replace(/<!--.*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
const table = visible.match(/<table\b[\s\S]*?<\/table>/)?.[0];

test("built yarn chart renders the corrected lace and open-ended jumbo guidelines", () => {
  assert.ok(table, "Yarn weight table must render in the initial HTML");
  const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)]
    .slice(1).map((match) => match[1].replace(/<!--.*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " "));
  assert.equal(rows.length, 8);
  assert.match(rows[0], /33–40 st/);
  assert.match(rows[0], /Steel 1.4–1.6 mm; regular 2.25 mm/);
  assert.match(rows[6], /8–12.75 mm/);
  assert.match(rows[6], /9–15 mm/);
  assert.match(rows[7], /12.75 mm and larger/);
  assert.match(rows[7], /15 mm and larger/);
  assert.match(rows[7], /6 or fewer st/);
  assert.doesNotMatch(rows[7], /12–25|15–25|17–50/);
});

test("built copy and FAQ schema avoid the retired substitution guarantees", () => {
  assert.match(text, /CYC knitting gauge guidelines: stockinette stitches per 4 inches/);
  assert.match(text, /These are not crochet gauge ranges/);
  assert.match(text, /Every result requires a swatch/);
  assert.match(visible, /href="https:\/\/www.craftyarncouncil.com\/standards\/faqs"/);
  assert.match(visible, /href="\/gauge-calculator"/);
  for (const source of [text, html]) {
    assert.doesNotMatch(source, /will produce similar gauge|nearly the same gauge|most reliable way to compare|excellent substitute|map directly to specific CYC|dark dyes especially|fabric will be loose and sloppy/);
  }
  const structured = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
  const faq = structured.flatMap((item) => Array.isArray(item) ? item : item["@graph"] || [item])
    .find((item) => item["@type"] === "FAQPage");
  assert.ok(faq, "FAQ structured data must remain present");
  assert.match(JSON.stringify(faq), /21–24 stockinette stitches per 4 inches/);
});
