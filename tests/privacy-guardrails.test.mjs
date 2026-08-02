import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

test("GPC overrides a previously stored analytics grant", () => {
  const consent = read("src/components/CookieConsent.tsx");
  assert.match(consent, /detectGPCClient\(\)/);
  assert.match(consent, /empire_gpc=1/);
  assert.match(consent, /localStorage\.setItem\(CONSENT_STORAGE_KEY, JSON\.stringify\(deniedConsent\)\)/);
  assert.match(consent, /updateGoogleAnalyticsConsent\("denied"\)/);
  assert.match(consent, /clearGoogleAnalyticsCookies\(\)/);
  assert.match(consent, /blocked=\{gpcActive !== false\}/);
});

test("analytics permission does not silently grant advertising permission", () => {
  const consent = read("src/components/CookieConsent.tsx");
  assert.match(consent, /analytics: "granted",\s+timestamp:/);
  assert.doesNotMatch(consent, /parsed\.ads|consent\.ads|ads: "granted"/);
  assert.doesNotMatch(consent, /ad_storage:|ad_user_data:|ad_personalization:/);
  assert.doesNotMatch(consent, /googlesyndication\.com/);
  assert.match(consent, /personalization_storage: "denied"/);
  assert.match(consent, /Advertising remains off while certified privacy controls are being prepared/);
  assert.match(consent, /hasCurrentGdprAnalyticsGrant/);
  assert.match(consent, /consent\.version === 2/);
  assert.match(consent, /version: 2/);
});

test("a removed GPC signal cannot leave a stale server-observed cookie", () => {
  const middleware = read("src/middleware.ts");
  assert.match(middleware, /request\.cookies\.has\('empire_gpc'\)/);
  assert.match(middleware, /response\.cookies\.delete\('empire_gpc'\)/);
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
