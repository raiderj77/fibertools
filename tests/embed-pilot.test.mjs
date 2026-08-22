import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import nextConfig from "../next.config.mjs";
import { isEmbedPath } from "../src/lib/embed-policy.mjs";

const read = (path) => fs.readFileSync(path, "utf8");
const embedSlugs = ["blanket-calculator", "yarn-calculator", "gauge-calculator"];

test("recognizes only the dedicated embed route segment", () => {
  assert.equal(isEmbedPath("/embed"), true);
  assert.equal(isEmbedPath("/embed/blanket-calculator"), true);
  assert.equal(isEmbedPath("/embeds"), false);
  assert.equal(isEmbedPath("/embedder"), false);
  assert.equal(isEmbedPath("/blanket-calculator"), false);
});

test("creates three noindex canonical routes that reuse the canonical tools in embed mode", () => {
  for (const slug of embedSlugs) {
    const page = read(`src/app/embed/${slug}/page.tsx`);
    assert.match(page, new RegExp(`canonical: ["']/${slug}["']`));
    assert.match(page, /robots: \{ index: false, follow: false \}/);
    assert.match(page, /<EmbedCalculatorShell/);
    assert.match(page, /embedded\s*\/>/);
  }

  const shell = read("src/components/EmbedCalculatorShell.tsx");
  assert.match(shell, /FiberTools/);
  assert.match(shell, /Open full calculator/);
  assert.match(shell, /target="_blank"/);
  assert.match(shell, /rel="noopener noreferrer"/);
});

test("suppresses all site-wide trackers, storage helpers, and chrome on embed routes", () => {
  const layout = read("src/app/layout.tsx");
  const siteOnly = read("src/components/SiteOnly.tsx");
  assert.match(siteOnly, /isEmbedPath\(pathname\) \? null : children/);
  assert.match(layout, /<SiteOnly>\s*<Header \/>\s*<\/SiteOnly>/);
  assert.match(
    layout,
    /<SiteOnly>[\s\S]*?<Footer \/>[\s\S]*?<ServiceWorkerRegistration \/>[\s\S]*?<InstallPrompt \/>[\s\S]*?<CookieConsent[\s\S]*?<AffiliateClickTracker \/>[\s\S]*?<\/SiteOnly>/,
  );

  const unitToggle = read("src/components/UnitToggle.tsx");
  assert.match(unitToggle, /persist = true/);
  assert.match(unitToggle, /if \(persist\) \{[\s\S]*?localStorage\.setItem/);
  assert.match(unitToggle, /if \(!enabled\) return/);

  const blanket = read("src/app/blanket-calculator/BlanketCalculatorTool.tsx");
  const yarn = read("src/app/yarn-calculator/YarnCalculatorTool.tsx");
  const gauge = read("src/app/gauge-calculator/GaugeCalculatorTool.tsx");
  for (const source of [blanket, yarn, gauge]) {
    assert.match(source, /persist=\{!embedded\}/);
  }
  assert.match(blanket, /!embedded && Boolean\(result\?\.hasSwatchUsage\)/);
  assert.match(yarn, /!embedded && hasInteracted && Boolean\(result\)/);
  assert.match(yarn, /\{!embedded \? \([\s\S]*?<RavelryPatterns/);
  assert.match(yarn, /!embedded \? \([\s\S]*?<ResultShareButton/);
  assert.match(blanket, /!embedded \? \([\s\S]*?<ResultShareButton/);

  for (const slug of embedSlugs) {
    const source = read(`src/app/embed/${slug}/page.tsx`);
    assert.doesNotMatch(source, /CookieConsent|AdUnit|Affiliate|Newsletter|RavelryPatterns|useToolCompletion/);
  }
});

test("isolates framing headers to embed routes without weakening normal pages", async () => {
  const rules = await nextConfig.headers();
  const standard = rules.find((rule) => rule.source === "/((?!embed(?:/|$)).*)");
  const embed = rules.find((rule) => rule.source === "/embed/:path*");
  assert.ok(standard);
  assert.ok(embed);

  const standardHeaders = Object.fromEntries(standard.headers.map(({ key, value }) => [key, value]));
  const embedHeaders = Object.fromEntries(embed.headers.map(({ key, value }) => [key, value]));
  assert.equal(standardHeaders["X-Frame-Options"], "SAMEORIGIN");
  assert.equal("X-Frame-Options" in embedHeaders, false);
  assert.equal(embedHeaders["X-Robots-Tag"], "noindex, nofollow");
  assert.match(embedHeaders["Content-Security-Policy"], /frame-ancestors 'self' https:/);
  assert.match(embedHeaders["Content-Security-Policy"], /connect-src 'self'/);
  assert.doesNotMatch(embedHeaders["Content-Security-Policy"], /google|doubleclick|amazon/i);
});

test("does not set GPC cookies or use the service-worker cache for embed documents or subresources", () => {
  const middleware = read("src/middleware.ts");
  const embedReturn = middleware.indexOf("if (isEmbedPath(request.nextUrl.pathname))");
  const cookieWrite = middleware.indexOf("response.cookies.set");
  assert.ok(embedReturn >= 0 && embedReturn < cookieWrite);

  const serviceWorker = read("public/sw.js");
  const embedBypass = serviceWorker.indexOf("if (isEmbedPathname(url.pathname)) return");
  const navigationCache = serviceWorker.indexOf('request.mode === "navigate"');
  assert.ok(embedBypass >= 0 && embedBypass < navigationCache);
  assert.match(serviceWorker, /self\.clients\.get\(event\.clientId\)/);
  assert.match(serviceWorker, /isEmbedPathname\(clientUrl\.pathname\)/);
  assert.ok(serviceWorker.indexOf("await belongsToEmbedClient(event)") < serviceWorker.indexOf("await caches.match(request)"));
  assert.match(serviceWorker, /CACHE_NAME = "fibertools-v3"/);
});

test("uses only consented, GPC-safe, allowlisted fixed analytics payloads", () => {
  const analytics = read("src/lib/fixed-analytics.ts");
  assert.match(analytics, /if \(detectGPCClient\(\)\) return false/);
  assert.match(analytics, /analytics === "granted"/);
  assert.match(analytics, /Object\.keys\(payload\)\.length !== 1/);
  assert.match(analytics, /window\.gtag\("event", event, \{ content_slug: payload\.slug \}\)/);
  assert.doesNotMatch(analytics, /page_path|page_location|document\.referrer|searchParams|free.form/i);

  const cards = read("src/components/EmbedCodeCard.tsx");
  assert.match(cards, /sandbox="allow-scripts allow-same-origin/);
  assert.match(cards, /allow="clipboard-write"/);
  assert.match(cards, /trackFixedEvent\("embed_code_copy", \{ slug \}\)/);
  assert.match(cards, /trackFixedEvent\("partner_interest_click", \{ slug: "embed-program" \}\)/);

  const ravelry = read("src/components/RavelryPatterns.tsx");
  assert.match(ravelry, /trackFixedEvent\("ravelry_patterns_shown", \{ slug: "yarn-calculator" \}\)/);
  assert.match(ravelry, /trackFixedEvent\("ravelry_pattern_click", \{ slug: "yarn-calculator" \}\)/);
  assert.doesNotMatch(ravelry, /gtag|pattern: p\.name|count: list\.length/);
});
