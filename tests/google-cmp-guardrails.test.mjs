import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const read = (relativePath) => fs.readFileSync(relativePath, "utf8");

let configImport = 0;

async function importNextConfig({ cmp, ads, publisherId }) {
  const names = [
    "NEXT_PUBLIC_GOOGLE_CMP_ENABLED",
    "NEXT_PUBLIC_ADSENSE_ENABLED",
    "NEXT_PUBLIC_ADSENSE_ID",
  ];
  const previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));

  process.env.NEXT_PUBLIC_GOOGLE_CMP_ENABLED = String(cmp);
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED = String(ads);
  process.env.NEXT_PUBLIC_ADSENSE_ID = publisherId;

  const url = pathToFileURL(path.resolve("next.config.mjs"));
  url.searchParams.set("cmp-test", String(configImport++));

  try {
    return await import(url.href);
  } finally {
    for (const name of names) {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    }
  }
}

test("CMP bootstrap is separate, GPC-blocked, and absent from policy pages", () => {
  const cmp = read("src/components/GoogleCmp.tsx");
  const layout = read("src/app/layout.tsx");
  const services = read("src/lib/google-services.ts");
  const boundary = read("src/components/PolicyScriptBoundary.tsx");
  const policyDocumentLink = read("src/components/PolicyDocumentLink.tsx");
  const footer = read("src/components/Footer.tsx");

  assert.match(layout, /NEXT_PUBLIC_GOOGLE_CMP_ENABLED === "true"/);
  assert.match(layout, /googleCmpEnabled=\{googleCmpEnabled\}/);
  assert.match(cmp, /const policyPath = isGooglePolicyPath\(pathname\)/);
  assert.match(cmp, /const active = enabled && !blocked && !policyPath/);
  assert.match(cmp, /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=/);
  assert.match(cmp, /strategy="afterInteractive"/);
  assert.match(cmp, /CONSENT_API_READY/);
  assert.match(cmp, /window\.__tcfapi\?\.\("addEventListener", 0/);
  assert.match(cmp, /"removeEventListener"/);
  assert.match(layout, /<PolicyScriptBoundary \/>/);
  assert.match(boundary, /isGooglePolicyPath\(pathname\)/);
  assert.match(boundary, /window\.location\.reload\(\)/);
  assert.match(policyDocumentLink, /window\.location\.assign\(href\)/);
  assert.match(footer, /policyPage: true/);
  assert.match(footer, /<PolicyDocumentLink/);
  for (const route of ["/privacy", "/cookies", "/do-not-sell", "/terms"]) {
    assert.match(services, new RegExp(route.replaceAll("/", "\\/")));
  }
});

test("legacy local analytics consent can never activate advertising", () => {
  const consent = read("src/components/CookieConsent.tsx");
  const lazyAd = read("src/components/LazyAdUnit.tsx");

  assert.doesNotMatch(consent, /parsed\.ads|consent\.ads|ads: "granted"/);
  assert.doesNotMatch(consent, /googlesyndication\.com|adsbygoogle/);
  assert.doesNotMatch(lazyAd, /localStorage|cookie_consent|consent\.ads|consent-changed/);
});

test("manual ad requests fail closed until GPC and TCF checks pass", () => {
  const adUnit = read("src/components/AdUnit.tsx");

  assert.match(adUnit, /detectGPCClient\(\) \|\| hasGpcCookie \|\| !window\.__tcfapi/);
  assert.match(adUnit, /tcData\.gdprApplies === false/);
  assert.match(adUnit, /tcData\.purpose\?\.consents\?\.\[1\] === true/);
  assert.match(adUnit, /!success \|\| !tcData[\s\S]*setCanRequestAd\(false\)/);
  assert.match(adUnit, /"removeEventListener"/);
  assert.match(adUnit, /if \(!canRequestAd \|\| isGooglePolicyPath\(pathname\)\) return;/);
  assert.match(adUnit, /!canRequestAd \|\|\s+isGooglePolicyPath\(pathname\)/);

  const appSources = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (/\.(?:ts|tsx)$/.test(entry.name)) appSources.push(read(fullPath));
    }
  };
  visit("src/app");
  assert.doesNotMatch(
    appSources.join("\n"),
    /<(?:Lazy)?AdUnit\b|components\/(?:Lazy)?AdUnit/,
    "manual ad inventory requires reviewed slot IDs and placement",
  );
});

test("the footer can reopen Google's certified consent flow", () => {
  const button = read("src/components/GoogleAdChoicesButton.tsx");

  assert.match(button, /CONSENT_API_READY/);
  assert.match(button, /tcData\?\.gdprApplies/);
  assert.match(button, /!googleCmpEnabled \|\| policyPath/);
  assert.match(button, /googlefc\.callbackQueue\.push\(googlefc\.showRevocationMessage\)/);
  assert.match(button, /Privacy and cookie settings/);
});

test("build configuration retains CSP and blocks ads pending nonce migration", async () => {
  await assert.rejects(
    importNextConfig({
      cmp: false,
      ads: true,
      publisherId: "ca-pub-7171402107622932",
    }),
    /requires NEXT_PUBLIC_GOOGLE_CMP_ENABLED=true/,
  );

  await assert.rejects(
    importNextConfig({ cmp: true, ads: false, publisherId: "ca-pub-wrong" }),
    /must match the publisher authorized in public\/ads\.txt/,
  );

  await assert.rejects(
    importNextConfig({
      cmp: true,
      ads: true,
      publisherId: "ca-pub-7171402107622932",
    }),
    /blocked until strict nonce CSP is implemented and verified/,
  );

  const { default: config } = await importNextConfig({
    cmp: true,
    ads: false,
    publisherId: "ca-pub-7171402107622932",
  });
  const routes = await config.headers();
  const headers = routes.flatMap((route) => route.headers);
  assert.ok(headers.some((header) => header.key === "Content-Security-Policy"));
  assert.ok(headers.some((header) => header.key === "Strict-Transport-Security"));
});

test("policies document the certified TCF v2.3 release boundary", () => {
  const cookies = read("src/app/cookies/page.tsx");
  const privacy = read("src/app/privacy/page.tsx");
  const terms = read("src/app/terms/page.tsx");
  const doNotSell = read("src/app/do-not-sell/page.tsx");
  const checklist = read("docs/google-cmp-release-checklist.md");
  const policyText = [cookies, privacy, terms, doNotSell].join("\n");

  assert.match(policyText, /TCF v2\.3/);
  assert.match(privacy, /IP address/);
  assert.match(privacy, /business\.safety\.google\/privacy/);
  assert.match(privacy, /policies\.google\.com\/technologies\/partner-sites/);
  assert.doesNotMatch(privacy, /same consent choice/);
  assert.match(cookies, /empire_gpc/);
  assert.doesNotMatch(cookies, /_gid|_gat/);
  assert.match(doNotSell, /US state regulations message/);
  assert.match(checklist, /GPP signaling/);
  assert.match(checklist, /Auto ads off/);
  assert.match(checklist, /known CSP blocker/);
  assert.match(checklist, /domain-allowlist policy is not a supported AdSense launch state/);
  assert.match(checklist, /Never click live ads/);
});
