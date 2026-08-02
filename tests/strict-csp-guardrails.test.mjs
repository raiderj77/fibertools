import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

import {
  buildAdSenseStrictCsp,
  createCspNonce,
  getStrictCspMode,
} from "../src/lib/strict-csp.mjs";

const read = (relativePath) => fs.readFileSync(relativePath, "utf8");

function findFiles(directory, pattern) {
  const matches = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) matches.push(...findFiles(fullPath, pattern));
    else if (pattern.test(entry.name)) matches.push(fullPath);
  }
  return matches;
}

test("nonce mode is default-off, bounded, and rejects invalid values", () => {
  assert.equal(getStrictCspMode({}), "off");
  assert.equal(
    getStrictCspMode({ FIBERTOOLS_NONCE_CSP_MODE: "report-only" }),
    "report-only",
  );
  assert.throws(
    () => getStrictCspMode({ FIBERTOOLS_NONCE_CSP_MODE: "enforce" }),
    /must be either 'off' or 'report-only'/,
  );
});

test("nonce generation is cryptographic-shaped and unique per request", () => {
  const first = createCspNonce();
  const second = createCspNonce();
  assert.match(first, /^[A-Za-z0-9+/]{22}==$/);
  assert.match(second, /^[A-Za-z0-9+/]{22}==$/);
  assert.notEqual(first, second);
});

test("report-only policy uses Google's documented strict AdSense script-src", () => {
  const nonce = "MDEyMzQ1Njc4OWFiY2RlZg==";
  const policy = buildAdSenseStrictCsp(nonce);

  assert.match(
    policy,
    new RegExp(
      `script-src 'nonce-${nonce}' 'unsafe-inline' 'unsafe-eval' 'strict-dynamic' https: http:`,
    ),
  );
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /base-uri 'none'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /form-action 'self'/);
  assert.throws(() => buildAdSenseStrictCsp("predictable"), /16 random bytes/);
});

test("middleware mints and forwards the nonce without weakening default CSP", () => {
  const middleware = read("src/middleware.ts");
  const nextConfig = read("next.config.mjs");
  const requestNonce = read("src/lib/request-nonce.ts");

  assert.match(middleware, /requestHeaders\.set\('x-nonce', nonce\)/);
  assert.match(
    middleware,
    /requestHeaders\.delete\('Content-Security-Policy'\)/,
  );
  assert.match(
    middleware,
    /requestHeaders\.set\('Content-Security-Policy-Report-Only', strictCsp\)/,
  );
  assert.match(middleware, /Content-Security-Policy-Report-Only/);
  assert.match(middleware, /private, no-store/);
  assert.match(middleware, /CDN-Cache-Control', 'no-store'/);
  assert.match(middleware, /Vercel-CDN-Cache-Control', 'no-store'/);
  assert.match(middleware, /x-fibertools-nonce-csp/);
  assert.doesNotMatch(middleware, /next-router-prefetch|purpose.*prefetch/);
  assert.match(middleware, /sec-gpc/);
  assert.match(middleware, /response\.cookies\.set\('empire_gpc'/);
  assert.match(middleware, /response\.cookies\.delete\('empire_gpc'/);
  assert.match(nextConfig, /Content-Security-Policy/);
  assert.match(nextConfig, /getStrictCspMode\(\)/);
  assert.match(
    requestNonce,
    /if \(getStrictCspMode\(\) === "off"\)/,
  );
  assert.match(requestNonce, /await headers\(\)/);
  assert.match(requestNonce, /requestHeaders\.get\("rsc"\) === "1"/);
});

test("all active scripts flow through a nonce-aware owner", () => {
  const structuredData = read("src/components/StructuredData.tsx");
  const cookieConsent = read("src/components/CookieConsent.tsx");
  const googleCmp = read("src/components/GoogleCmp.tsx");
  const decoder = read(
    "src/app/vintage-pattern-decoder/VintagePatternDecoderTool.tsx",
  );

  const appScripts = findFiles("src/app", /\.tsx$/)
    .map((file) => `${file}\n${fs.readFileSync(file, "utf8")}`)
    .join("\n");
  assert.doesNotMatch(appScripts, /<script\b/i);
  assert.match(structuredData, /nonce=\{nonce\}/);
  assert.match(structuredData, /if \(isRscRequest\) return null/);
  assert.match(structuredData, /replace\(\/<\/g, "\\\\u003c"\)/);

  const nextScriptCount =
    (cookieConsent.match(/<Script\b/g) || []).length +
    (googleCmp.match(/<Script\b/g) || []).length;
  const explicitNonceCount =
    (cookieConsent.match(/nonce=\{nonce\}/g) || []).length +
    (googleCmp.match(/nonce=\{nonce\}/g) || []).length;
  assert.equal(nextScriptCount, 4);
  assert.equal(
    explicitNonceCount,
    6,
    "four scripts plus the GoogleCmp and GoogleAnalytics prop handoffs",
  );
  assert.match(decoder, /querySelector<HTMLScriptElement>/);
  assert.match(decoder, /if \(documentNonce\) script\.nonce = documentNonce/);
});

test("quarantined Markdown cannot reintroduce opaque script tags", () => {
  const blogLoader = read("src/lib/blog-markdown.ts");
  assert.match(blogLoader, /function assertNoEmbeddedScripts/);
  assert.match(blogLoader, /\/<script\\b\/i/);
  assert.match(blogLoader, /nonce-aware JsonLd component/);
  assert.match(blogLoader, /assertNoEmbeddedScripts\(content, slug\)/);
});

test("service-worker transition cannot retain nonce HTML", () => {
  const registration = read("src/components/ServiceWorkerRegistration.tsx");
  const worker = read("public/sw.js");

  assert.match(registration, /mode=\$\{mode\}&v=2/);
  assert.match(registration, /updateViaCache: "none"/);
  assert.match(worker, /fibertools-v2-/);
  assert.match(worker, /if \(!NONCE_CSP_MODE\) PRECACHE_URLS\.unshift\("\/"\)/);
  assert.match(worker, /fetch\(request, \{ cache: "no-store" \}\)/);
  assert.match(worker, /isNonceHtml\(response\)/);
  assert.match(worker, /cache\.delete\(url\.pathname\)/);
  assert.match(worker, /cache\.match\("\/offline\.html"\)/);
});

test("report-only spike cannot bypass the AdSense activation gate", () => {
  const nextConfig = read("next.config.mjs");
  const environment = read(".env.example");

  assert.match(
    nextConfig,
    /Manual AdSense activation is blocked until strict nonce CSP is implemented and verified/,
  );
  assert.match(environment, /FIBERTOOLS_NONCE_CSP_MODE=off/);
  assert.doesNotMatch(environment, /FIBERTOOLS_NONCE_CSP_MODE=report-only/);
});
