import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("formula library is a canonical, source-linked, internally discoverable page", () => {
  const page = read("src/app/formula-library/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const header = read("src/components/Header.tsx");
  const footer = read("src/components/Footer.tsx");

  assert.match(page, /canonical: "\/formula-library"/);
  assert.match(page, /stitches per inch = stitches counted/);
  assert.match(page, /project grams = swatch grams/);
  assert.match(page, /craftyarncouncil\.com\/standards\/yarn-weight-system/);
  assert.match(page, /planning estimates, not promises/i);
  for (const source of [sitemap, header, footer]) assert.match(source, /\/formula-library/);
});

test("newsletter action validates input and never returns provider internals", () => {
  const action = read("src/app/actions/subscribe.ts");

  assert.match(action, /normalizedEmail/);
  assert.match(action, /Enter a valid email address/);
  assert.match(action, /temporarily unavailable/);
  assert.doesNotMatch(action, /JSON\.stringify\(body\)|Network error:|beehiiv:/);
  assert.doesNotMatch(action, /apiKey[^\n]+error|pubId[^\n]+error/);
});

test("newsletter has a shareable promise, immediate download, and privacy-safe measurement", () => {
  const signup = read("src/components/BeehiivSignup.tsx");
  const page = read("src/app/newsletter/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const footer = read("src/components/Footer.tsx");

  assert.match(page, /canonical: "\/newsletter"/);
  assert.match(page, /Swatch Signal/);
  assert.match(page, /No affiliate links inside the email/);
  assert.match(signup, /href="\/survival-kit\.pdf"/);
  assert.match(signup, /newsletter_signup_success/);
  assert.match(signup, /signup_source: source/);
  assert.doesNotMatch(signup, /gtag[^\n]+email|email[^\n]+gtag/);
  assert.match(sitemap, /\/newsletter/);
  assert.match(footer, /\/newsletter/);
});
