import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { normalizeAnalyticsConsent } from "../src/lib/analytics-consent.mjs";
import {
  detectGPCClient,
  hasGPCConsentCookie,
} from "../src/lib/gpc-client.mjs";
import {
  buildAnalyticsPageContext,
  buildInitialAnalyticsConfig,
  buildSafeToolShareCampaign,
  GOOGLE_MEASUREMENT_ID,
  recordSanitizedPageView,
} from "../src/lib/analytics-page-context.mjs";

const cookieConsent = fs.readFileSync("src/components/CookieConsent.tsx", "utf8");
const middleware = fs.readFileSync("src/middleware.ts", "utf8");
const pageViews = fs.readFileSync("src/components/SanitizedPageViewTracker.tsx", "utf8");
const fixedAnalytics = fs.readFileSync("src/lib/fixed-analytics.ts", "utf8");
const stitchProofAnalytics = fs.readFileSync("src/lib/stitchproof-analytics.ts", "utf8");
const affiliateTracker = fs.readFileSync("src/components/AffiliateClickTracker.tsx", "utf8");
const affiliateLink = fs.readFileSync("src/components/AffiliateLink.tsx", "utf8");
const toolCompletion = fs.readFileSync("src/lib/useToolCompletion.ts", "utf8");

test("the analytics-only action never grants advertising consent", () => {
  const accept = cookieConsent.split("function handleAccept()")[1].split("function handleDecline()")[0];
  assert.doesNotMatch(accept, /ads:\s*"granted"/);
  assert.match(accept, /ads:\s*"denied"/);
  assert.match(accept, /updateGoogleConsent\("granted", "denied"\)/);
});

test("migrates historical choices without creating an advertising grant", () => {
  for (const version of [undefined, 2]) {
    for (const analytics of ["granted", "denied"]) {
      for (const ads of ["granted", "denied"]) {
        const stored = { version, analytics, ads, timestamp: "2026-01-01T00:00:00Z" };
        const normalized = normalizeAnalyticsConsent(stored);
        assert.deepEqual(normalized, { version: 2, analytics, ads: "denied", timestamp: stored.timestamp });
        assert.deepEqual(normalizeAnalyticsConsent(normalized), normalized, "migration must be idempotent");
        assert.equal(stored.ads, ads, "do not mutate the caller's record");
      }
    }
  }
});

test("malformed or unknown-version consent cannot authorize Google services", () => {
  for (const value of [null, [], true, "granted", {}, { analytics: "yes", ads: "granted" },
    { analytics: "granted" }, { analytics: "granted", ads: "yes" },
    { version: 99, analytics: "granted", ads: "granted" }]) {
    assert.equal(normalizeAnalyticsConsent(value), null);
  }
});

test("initialization, cross-tab updates and inline scripts reject ambiguous ad permission", () => {
  assert.match(cookieConsent, /normalizeAnalyticsConsent\(JSON\.parse\(stored\)\)/);
  assert.match(cookieConsent, /normalizeAnalyticsConsent\(JSON\.parse\(event\.newValue\)\)/);
  assert.match(cookieConsent, /event\.key !== CONSENT_STORAGE_KEY && event\.key !== null/);
  assert.match(cookieConsent, /var adsAllowed = false/);
  assert.doesNotMatch(cookieConsent, /storedConsent\.ads === 'granted'/);
});

test("the inline event boundary honors current denial despite stale granted storage", () => {
  // Execute both actual emitted gtag wrappers, not a second implementation of the guard.
  const wrappers = [...cookieConsent.matchAll(/window\.gtag = (?:window\.gtag \|\| )?function\(\)\{([\s\S]*?)\n            \};/g)];
  assert.equal(wrappers.length, 2);
  for (const [, body] of wrappers) {
    const window = { dataLayer: [], fibertoolsAnalyticsAllowed: true,
      navigator: { globalPrivacyControl: false }, location: { origin: "https://example.test", pathname: "/test" } };
    const document = { cookie: "" };
    vm.runInNewContext(`window.gtag = function(){${body}\n};`, { window, document });
    window.gtag("event", "test_event", {});
    assert.equal(window.dataLayer.length, 1);
    window.fibertoolsAnalyticsAllowed = false;
    window.gtag("event", "test_after_denial", {});
    assert.equal(window.dataLayer.length, 1, "in-memory denial blocks events even if persistence failed");
    window.gtag("consent", "update", { analytics_storage: "denied" });
    assert.equal(window.dataLayer.length, 2, "the denial command itself must still reach Google");
    window.fibertoolsAnalyticsAllowed = true;
    window.navigator.globalPrivacyControl = true;
    window.gtag("event", "test_gpc", {});
    assert.equal(window.dataLayer.length, 2);
    window.navigator.globalPrivacyControl = false;
    document.cookie = "empire_gpc=1";
    window.gtag("event", "test_gpc_cookie", {});
    assert.equal(window.dataLayer.length, 2);
  }
  assert.match(cookieConsent, /window\.fibertoolsAnalyticsAllowed = analytics === "granted"/);
});

test("delayed Google initialization cannot undo an in-memory withdrawal", () => {
  const source = cookieConsent.match(/const currentConsentCheck = `([\s\S]*?)`;/)[1]
    .replaceAll("${CONSENT_STORAGE_KEY}", "cookie_consent");
  for (const allowed of [false, undefined, true]) {
    const context = { window: { fibertoolsAnalyticsAllowed: allowed,
      navigator: { globalPrivacyControl: false }, localStorage: {
        getItem: () => JSON.stringify({ analytics: "granted", ads: "granted" }),
      } }, document: { cookie: "" } };
    vm.runInNewContext(source, context);
    assert.equal(context.analyticsAllowed, allowed === true);
    assert.equal(context.adsAllowed, false);
  }
});

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

test("configures app-controlled page views with a sanitized path", () => {
  assert.match(cookieConsent, /send_page_view:\s*false/);
  assert.match(cookieConsent, /ignore_referrer:\s*true/);
  assert.match(cookieConsent, /buildInitialAnalyticsConfig\(window\.location\)/);
  assert.match(cookieConsent, /page_location:\s*window\.location\.origin \+ window\.location\.pathname/);
  assert.match(cookieConsent, /page_referrer:\s*''/);
  assert.match(cookieConsent, /storedConsent\.analytics === 'granted'/);
  assert.match(cookieConsent, /window\.navigator\.globalPrivacyControl === true/);
  assert.match(cookieConsent, /part\.trim\(\) === 'empire_gpc=1'/);
  assert.match(cookieConsent, /if \(!analyticsAllowed\)/);
  assert.match(pageViews, /recordSanitizedPageView/);
  assert.match(pageViews, /initialPathnameRef\.current === pathname/);
  assert.match(pageViews, /analyticsAllowed:\s*hasCurrentAnalyticsConsent\(\)/);
  assert.ok(
    cookieConsent.indexOf("window.gtag('config'") <
      cookieConsent.indexOf("window.gtag('event', 'page_view'"),
  );
  assert.doesNotMatch(pageViews, /useSearchParams|location\.search|document\.referrer/);
});

test("removes query strings and referrers from the context inherited by every analytics event", () => {
  assert.deepEqual(
    buildAnalyticsPageContext({
      origin: "https://fibertools.app",
      pathname: "/color-pooling-calculator",
      search: "?email=private%40example.com&yards=1200",
      hash: "#result",
    }),
    {
      page_path: "/color-pooling-calculator",
      page_location: "https://fibertools.app/color-pooling-calculator",
      page_referrer: "",
    },
  );
  assert.equal(
    buildAnalyticsPageContext({
      origin: "https://fibertools.app/?email=private%40example.com",
      pathname: "/color-pooling-calculator",
    }),
    null,
  );
  assert.equal(
    buildAnalyticsPageContext({
      origin: "https://fibertools.app",
      pathname: "/color-pooling-calculator?email=private%40example.com",
    }),
    null,
  );
});

test("preserves only the fixed calculator-share campaign contract", () => {
  const slugs = [
    "blanket-calculator",
    "cast-on-calculator",
    "sock-calculator",
    "yarn-calculator",
    "yarn-weight-calculator",
  ];

  for (const slug of slugs) {
    const search = `?utm_source=tool_share&utm_medium=referral&utm_campaign=calculator_result&utm_content=${slug}`;
    assert.deepEqual(buildSafeToolShareCampaign(search), {
      campaign_source: "tool_share",
      campaign_medium: "referral",
      campaign_name: "calculator_result",
      campaign_content: slug,
    });
  }

  for (const search of [
    "?utm_source=TOOL_SHARE&utm_medium=referral&utm_campaign=calculator_result&utm_content=yarn-calculator",
    "?utm_source=tool_share&utm_medium=referral&utm_content=yarn-calculator",
    "?utm_source=tool_share&utm_medium=referral&utm_campaign=calculator_result&utm_content=unknown-tool",
    "?utm_source=tool_share&utm_source=tool_share&utm_medium=referral&utm_campaign=calculator_result&utm_content=yarn-calculator",
  ]) {
    assert.deepEqual(buildSafeToolShareCampaign(search), {});
  }
});

test("ignores sensitive and arbitrary query values while retaining safe share attribution", () => {
  const config = buildInitialAnalyticsConfig({
    origin: "https://fibertools.app",
    pathname: "/yarn-calculator",
    search: "?email=private%40example.com&yards=1200&utm_source=tool_share&utm_medium=referral&utm_campaign=calculator_result&utm_content=yarn-calculator",
    hash: "#result",
  });
  assert.deepEqual(config, {
    page_path: "/yarn-calculator",
    page_location: "https://fibertools.app/yarn-calculator",
    page_referrer: "",
    campaign_source: "tool_share",
    campaign_medium: "referral",
    campaign_name: "calculator_result",
    campaign_content: "yarn-calculator",
  });
  assert.doesNotMatch(JSON.stringify(config), /private|example|email|yards|1200|\?|#result/);
});

test("queues one sanitized config update before one app-controlled page view", () => {
  const commands = [];
  const sent = recordSanitizedPageView({
    location: {
      origin: "https://fibertools.app",
      pathname: "/sock-calculator",
      search: "?email=private%40example.com",
    },
    analyticsAllowed: true,
    gtag: (...args) => commands.push(args),
  });

  assert.equal(sent, true);
  assert.deepEqual(commands, [
    ["config", GOOGLE_MEASUREMENT_ID, {
      page_path: "/sock-calculator",
      page_location: "https://fibertools.app/sock-calculator",
      page_referrer: "",
      ignore_referrer: true,
      send_page_view: false,
      update: true,
    }],
    ["event", "page_view", {
      page_path: "/sock-calculator",
      page_location: "https://fibertools.app/sock-calculator",
      page_referrer: "",
    }],
  ]);
});

test("queues no page-view commands without current permission or a valid page context", () => {
  for (const input of [
    { analyticsAllowed: false, location: { origin: "https://fibertools.app", pathname: "/" } },
    { analyticsAllowed: true, location: { origin: "javascript:alert(1)", pathname: "/" } },
    { analyticsAllowed: true, location: { origin: "https://fibertools.app", pathname: "/?email=private" } },
  ]) {
    const commands = [];
    assert.equal(recordSanitizedPageView({ ...input, gtag: (...args) => commands.push(args) }), false);
    assert.deepEqual(commands, []);
  }
});

test("reacts to cross-tab consent revocation and fails closed", () => {
  assert.match(cookieConsent, /window\.addEventListener\("storage", syncConsentFromAnotherTab\)/);
  assert.match(cookieConsent, /updateGoogleConsent\(parsed\.analytics, parsed\.ads\)/);
  assert.match(cookieConsent, /if \(parsed\.analytics === "denied"\) clearGoogleAnalyticsCookies\(\)/);
  assert.match(cookieConsent, /updateGoogleConsent\("denied", "denied"\)/);
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

test("rechecks GPC for each calculator completion event", () => {
  assert.match(toolCompletion, /getGpcActive: \(\) => detectGPCClient\(\)/);
});
