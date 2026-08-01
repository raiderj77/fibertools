import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("GPC overrides a previously stored analytics grant", () => {
  const consent = read("src/components/CookieConsent.tsx");
  assert.match(consent, /detectGPCClient\(\)/);
  assert.match(consent, /empire_gpc=1/);
  assert.match(consent, /localStorage\.setItem\(CONSENT_STORAGE_KEY, JSON\.stringify\(deniedConsent\)\)/);
  assert.match(consent, /updateGoogleConsent\("denied", "denied"\)/);
  assert.match(consent, /clearGoogleAnalyticsCookies\(\)/);
});

test("analytics permission does not silently grant advertising permission", () => {
  const consent = read("src/components/CookieConsent.tsx");
  assert.match(consent, /analytics: "granted",\s+ads: "denied"/);
  assert.match(consent, /const normalizedConsent:[\s\S]*ads: "denied"/);
  assert.doesNotMatch(consent, /setConsent\(parsed as ConsentState\)/);
  assert.match(consent, /personalization_storage: "denied"/);
  assert.match(consent, /Advertising remains off/);
  assert.doesNotMatch(consent, /analytics: "granted",\s+ads: "granted"/);
});

test("newsletter fallback cannot put an email address in the URL or expose provider errors", () => {
  const signup = read("src/components/BeehiivSignup.tsx");
  const action = read("src/app/actions/subscribe.ts");
  assert.match(signup, /method="post"/);
  assert.match(action, /normalizeNewsletterEmail\(email\)/);
  assert.match(action, /allowIpAttempt/);
  assert.match(action, /allowEmailAttempt/);
  assert.doesNotMatch(action, /JSON\.stringify\(body\)|Network error:|Config error:|beehiiv:/);
});

test("pattern discovery waits for an explicit visitor request", () => {
  const patterns = read("src/components/RavelryPatterns.tsx");
  const route = read("src/app/api/ravelry/patterns/route.ts");
  const privacy = read("src/app/privacy/page.tsx");
  assert.match(patterns, /requestedKey !== requestKey/);
  assert.match(patterns, /Find patterns on Ravelry/);
  assert.match(patterns, /It does not send dimensions, gauge, results, or an email address/);
  assert.match(route, /ALLOWED_CRAFTS/);
  assert.match(route, /ALLOWED_QUERIES/);
  assert.match(route, /ALLOWED_WEIGHTS/);
  assert.match(route, /pattern_search_unavailable/);
  assert.doesNotMatch(route, /detail[,:]|String\(err\)/);
  assert.match(privacy, /Ravelry Privacy Policy/);
  assert.match(privacy, /Beehiiv Privacy Policy/);
});
