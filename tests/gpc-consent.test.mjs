import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  detectGPCClient,
  hasGPCConsentCookie,
} from "../src/lib/gpc-client.mjs";

const cookieConsent = fs.readFileSync("src/components/CookieConsent.tsx", "utf8");
const middleware = fs.readFileSync("src/middleware.ts", "utf8");

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
