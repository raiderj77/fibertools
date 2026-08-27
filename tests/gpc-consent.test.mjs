import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  detectGPCClient,
  hasGPCConsentCookie,
} from "../src/lib/gpc-client.mjs";

const cookieConsent = fs.readFileSync("src/components/CookieConsent.tsx", "utf8");
const middleware = fs.readFileSync("src/middleware.ts", "utf8");
const pageViews = fs.readFileSync("src/components/SanitizedPageViewTracker.tsx", "utf8");
const fixedAnalytics = fs.readFileSync("src/lib/fixed-analytics.ts", "utf8");
const stitchProofAnalytics = fs.readFileSync("src/lib/stitchproof-analytics.ts", "utf8");
const affiliateTracker = fs.readFileSync("src/components/AffiliateClickTracker.tsx", "utf8");
const affiliateLink = fs.readFileSync("src/components/AffiliateLink.tsx", "utf8");

test("recognizes only the explicit FiberTools GPC cookie", () => {
  assert.equal(hasGPCConsentCookie("empire_gpc=1"), true);
  assert.equal(hasGPCConsentCookie("theme=dark; empire_gpc=1; session=abc"), true);
  assert.equal(hasGPCConsentCookie("empire_gpc=0"), false);
  assert.equal(hasGPCConsentCookie("not_empire_gpc=1"), false);
});

test("honors either the browser GPC property or the server-set cookie", () => {
  assert.equal(
    detectGPCClient({ navigatorObject: { globalPrivacyControl: true }, cookieString: "" }),
    true,
  );
  assert.equal(
    detectGPCClient({ navigatorObject: { globalPrivacyControl: false }, cookieString: "empire_gpc=1" }),
    true,
  );
  assert.equal(
    detectGPCClient({ navigatorObject: { globalPrivacyControl: false }, cookieString: "empire_gpc=0" }),
    false,
  );
});

test("forces denial before reading a stored grant and gates Google services", () => {
  const initialGPCCheck = cookieConsent.indexOf("if (detectGPCClient())");
  const storedConsentRead = cookieConsent.indexOf("localStorage.getItem(CONSENT_STORAGE_KEY)");

  assert.ok(initialGPCCheck >= 0 && initialGPCCheck < storedConsentRead);
  assert.match(cookieConsent, /updateGoogleConsent\("denied", "denied"\)/);
  assert.match(cookieConsent, /clearGoogleAnalyticsCookies\(\)/);
  assert.match(
    cookieConsent,
    /consent !== "loading" && !gpcActive && consent\?\.analytics === "granted"/,
  );
});

test("rechecks GPC before accepting and does not offer a grant while active", () => {
  assert.match(
    cookieConsent,
    /function handleAccept\(\) \{\s*if \(detectGPCClient\(\)\) \{\s*enforceGPC\(\);\s*return;/,
  );
  assert.match(cookieConsent, /\{!gpcActive \? \(\s*<button[\s\S]*?Allow analytics/);
});

test("keeps the server bridge cookie aligned with the current GPC signal", () => {
  assert.match(middleware, /if \(gpc\) \{[\s\S]*response\.cookies\.set\('empire_gpc', '1'/);
  assert.match(
    middleware,
    /else if \(request\.cookies\.has\('empire_gpc'\)\) \{[\s\S]*response\.cookies\.delete\('empire_gpc'\)/,
  );
});

test("disables automatic query-bearing page views and sends a sanitized path", () => {
  assert.match(cookieConsent, /send_page_view:\s*false/);
  assert.match(cookieConsent, /ignore_referrer:\s*true/);
  assert.match(pageViews, /page_path:\s*pathname/);
  assert.match(pageViews, /page_location:\s*`\$\{window\.location\.origin\}\$\{pathname\}`/);
  assert.match(pageViews, /page_referrer:\s*""/);
  assert.doesNotMatch(pageViews, /useSearchParams|location\.search|document\.referrer/);
});

test("rechecks stored consent and GPC before every affiliate analytics event", () => {
  assert.match(fixedAnalytics, /export function hasCurrentAnalyticsConsent/);
  assert.match(fixedAnalytics, /if \(detectGPCClient\(\)\) return false/);
  assert.match(fixedAnalytics, /analytics === "granted"/);
  for (const source of [affiliateTracker, affiliateLink]) {
    assert.match(source, /hasCurrentAnalyticsConsent\(\)/);
    assert.ok(source.indexOf("hasCurrentAnalyticsConsent()") < source.indexOf('window.gtag("event"'));
  }
});

test("rechecks GPC for each StitchProof event instead of trusting initial consent", () => {
  assert.match(stitchProofAnalytics, /getGpcActive: \(\) => detectGPCClient\(\)/);
  assert.match(stitchProofAnalytics, /getStorage: \(\) => window\.localStorage/);
  assert.match(stitchProofAnalytics, /recordStitchProofBrowserEvent/);
});
