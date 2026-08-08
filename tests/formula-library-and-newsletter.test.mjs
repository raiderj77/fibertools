import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { recordNewsletterSignupSuccess } from "../src/lib/newsletter-analytics.mjs";

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
  const analytics = read("src/lib/newsletter-analytics.mjs");
  const page = read("src/app/newsletter/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const footer = read("src/components/Footer.tsx");

  assert.match(page, /canonical: "\/newsletter"/);
  assert.match(page, /Swatch Signal/);
  assert.match(page, /No affiliate links inside the email/);
  assert.match(signup, /href="\/survival-kit\.pdf"/);
  assert.match(signup, /recordNewsletterSignupSuccess/);
  assert.match(analytics, /newsletter_signup_success/);
  assert.match(analytics, /signup_source: source/);
  assert.doesNotMatch(`${signup}\n${analytics}`, /gtag[^\n]+email|email[^\n]+gtag/);
  assert.match(sitemap, /\/newsletter/);
  assert.match(footer, /\/newsletter/);
});

function consentStorage(status) {
  return {
    getItem() {
      return JSON.stringify({ analytics: status, ads: status });
    },
  };
}

test("newsletter success measurement requires current consent and honors GPC", () => {
  const calls = [];
  const getGtag = () => (...args) => calls.push(args);

  assert.equal(
    recordNewsletterSignupSuccess({
      source: "newsletter_page",
      storage: consentStorage("denied"),
      gpcActive: false,
      getGtag,
    }),
    false,
  );
  assert.equal(
    recordNewsletterSignupSuccess({
      source: "newsletter_page",
      storage: consentStorage("granted"),
      gpcActive: true,
      getGtag,
    }),
    false,
  );
  assert.deepEqual(calls, []);

  assert.equal(
    recordNewsletterSignupSuccess({
      source: "newsletter_page",
      storage: consentStorage("granted"),
      gpcActive: false,
      getGtag,
    }),
    true,
  );
  assert.deepEqual(calls, [
    ["event", "newsletter_signup_success", { signup_source: "newsletter_page" }],
  ]);
});
