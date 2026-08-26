import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { REVIEW_DATES } from "../src/lib/review-dates.mjs";


const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const homeSource = readFileSync(resolve(ROOT, "src/app/page.tsx"), "utf8");
const sitemapSource = readFileSync(resolve(ROOT, "src/app/sitemap.ts"), "utf8");
const beginnerYarnSource = readFileSync(resolve(ROOT, "src/app/best-yarn-for-beginners/page.tsx"), "utf8");
const blanketYarnSource = readFileSync(resolve(ROOT, "src/app/best-yarn-for-blankets/page.tsx"), "utf8");


test("central registry preserves substantive homepage and FAQ review dates", () => {
  assert.deepEqual(REVIEW_DATES.homepage, { iso: "2026-08-22", label: "August 22, 2026" });
  assert.deepEqual(REVIEW_DATES.homepageFaq, { iso: "2026-04-16", label: "April 16, 2026" });
  assert.match(homeSource, /dateModified: REVIEW_DATES\.homepage\.iso/);
  assert.match(homeSource, /dateModified: REVIEW_DATES\.homepageFaq\.iso/);
  assert.doesNotMatch(homeSource, /BreadcrumbList[\s\S]{0,500}dateModified/);
});


test("visible homepage review label and sitemap use the same reviewed-date registry", () => {
  assert.match(homeSource, /Last updated: \{REVIEW_DATES\.homepage\.label\}/);
  assert.match(sitemapSource, /path: "", priority: 1\.0, freq: "weekly", lastModified: REVIEW_DATES\.homepage\.iso/);
  assert.doesNotMatch(sitemapSource, /new Date\(\)/);
});

test("materially updated buyer guides use the substantiated August 25 review date", () => {
  assert.deepEqual(REVIEW_DATES.bestYarnForBeginners, { iso: "2026-08-25", label: "August 25, 2026" });
  assert.deepEqual(REVIEW_DATES.bestYarnForBlankets, { iso: "2026-08-25", label: "August 25, 2026" });
  assert.match(beginnerYarnSource, /dateModified: REVIEW_DATES\.bestYarnForBeginners\.iso/);
  assert.match(beginnerYarnSource, /Last updated: \{REVIEW_DATES\.bestYarnForBeginners\.label\}/);
  assert.match(blanketYarnSource, /dateModified: REVIEW_DATES\.bestYarnForBlankets\.iso/);
  assert.match(blanketYarnSource, /Last updated: \{REVIEW_DATES\.bestYarnForBlankets\.label\}/);
});


test("built homepage exposes two Aug 22 product dates and retains the older FAQ date", (t) => {
  const htmlPath = resolve(ROOT, ".next/server/app/index.html");
  if (!existsSync(htmlPath)) {
    if (process.env.REQUIRE_BUILD_OUTPUT === "1") assert.fail(`Missing built homepage: ${htmlPath}`);
    t.skip("Build output is checked by postbuild after next build.");
    return;
  }

  const html = readFileSync(htmlPath, "utf8");
  assert.match(html, /Last updated: <!-- -->August 22, 2026|Last updated: August 22, 2026/);
  const productDates = html.match(/"dateModified":"2026-08-22"/g) || [];
  const faqDates = html.match(/"dateModified":"2026-04-16"/g) || [];
  assert.equal(productDates.length, 2, "WebApplication and CollectionPage must use Aug 22");
  assert.equal(faqDates.length, 1, "FAQ must retain its independently supported Apr 16 date");
});
