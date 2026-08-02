const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

function read(relativePath) {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const layout = read("src/app/layout.tsx");
const sitemap = read("src/app/sitemap.ts");
const homepage = read("src/app/page.tsx");
const blogLoader = read("src/lib/blog-markdown.ts");
const privacy = read("src/app/privacy/page.tsx");
const nextConfig = read("next.config.mjs");
const consentControls = read("src/components/CookieConsent.tsx");
const googleCmp = read("src/components/GoogleCmp.tsx");
const adUnit = read("src/components/AdUnit.tsx");
const policyScriptBoundary = read("src/components/PolicyScriptBoundary.tsx");

assert.doesNotMatch(layout, /clarity\.ms|microsoft-clarity/i, "Clarity must remain disabled");
assert.doesNotMatch(
  layout,
  /googletagmanager\.com|googlesyndication\.com/,
  "Google scripts and connection hints must remain behind the client privacy controller",
);
assert.match(
  consentControls,
  /consent\?\.analytics === "granted"/,
  "Google Analytics must require a stored or explicit grant",
);
assert.match(
  layout,
  /NEXT_PUBLIC_GOOGLE_CMP_ENABLED === "true"/,
  "Google's certified privacy message must have a separate release switch",
);
assert.match(
  googleCmp,
  /const active = enabled && !blocked && !policyPath/,
  "The Google CMP bootstrap must be enabled explicitly and blocked by GPC and policy routes",
);
assert.match(
  googleCmp,
  /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=/,
  "The published Google message must use the reviewed publisher bootstrap",
);
assert.match(
  adUnit,
  /NEXT_PUBLIC_ADSENSE_ENABLED === "true"/,
  "Manual AdSense inventory must have a separate activation switch",
);
assert.match(
  adUnit,
  /tcData\.purpose\?\.consents\?\.\[1\] === true/,
  "Manual EEA ad requests must wait for affirmative TCF Purpose 1 consent",
);
assert.match(
  nextConfig,
  /adsenseEnabled && !googleCmpEnabled/,
  "The build must reject advertising without the certified CMP switch",
);
assert.match(
  nextConfig,
  /Manual AdSense activation is blocked until strict nonce CSP is implemented and verified/,
  "Manual ads must stay blocked while the current domain-allowlist CSP is unsupported",
);
assert.match(
  policyScriptBoundary,
  /isGooglePolicyPath\(pathname\)[\s\S]*window\.location\.reload\(\)/,
  "Policy-page navigation must clear consent-requiring scripts retained by the App Router",
);
assert.match(
  consentControls,
  /calculator inputs and email addresses are never included/i,
  "The consent notice must disclose the affiliate measurement boundary",
);
assert.match(
  nextConfig,
  /Content-Security-Policy/,
  "The CMP preparation must not silently remove the enforced CSP",
);
assert.doesNotMatch(sitemap, /getAllMarkdownPosts|\/blog/, "quarantined articles must stay out of the sitemap");
assert.doesNotMatch(homepage, /blogPosts|href="\/blog"/, "homepage must not link to quarantined articles");
assert.match(blogLoader, /APPROVED_BLOG_SLUGS = new Set<string>\(\)/, "blog allowlist must default to empty");
const legacyBlogRedirect = /source: ['"]\/blog\/:path\*['"][\s\S]*?destination: ['"]\/guides['"]/;
assert.match(nextConfig, legacyBlogRedirect, "all legacy blog routes must redirect to maintained content");
assert.doesNotMatch(privacy, /Microsoft Clarity/i, "privacy wording must match the deployed trackers");

console.log("Quality gate passed: the CMP bootstrap and manual ad inventory are separately gated, and legacy articles remain quarantined.");
