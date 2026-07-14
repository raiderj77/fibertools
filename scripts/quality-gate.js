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

assert.doesNotMatch(layout, /clarity\.ms|microsoft-clarity/i, "Clarity must remain disabled");
assert.doesNotMatch(
  layout,
  /googletagmanager\.com|googlesyndication\.com/,
  "Google scripts and connection hints must not load from the server layout before consent",
);
const consentControls = read("src/components/CookieConsent.tsx");
assert.match(
  consentControls,
  /consent\?\.analytics === "granted"/,
  "Google Analytics must require a stored or explicit grant",
);
assert.match(
  consentControls,
  /adsenseEnabled && consent\.ads === "granted"/,
  "AdSense must require both production enablement and consent",
);
assert.match(
  consentControls,
  /calculator inputs and email addresses are never included/i,
  "The consent notice must disclose the affiliate measurement boundary",
);
assert.match(
  layout,
  /NEXT_PUBLIC_ADSENSE_ENABLED === "true"/,
  "AdSense must be explicitly enabled after site approval",
);
assert.doesNotMatch(sitemap, /getAllMarkdownPosts|\/blog/, "quarantined articles must stay out of the sitemap");
assert.doesNotMatch(homepage, /blogPosts|href="\/blog"/, "homepage must not link to quarantined articles");
assert.match(blogLoader, /APPROVED_BLOG_SLUGS = new Set<string>\(\)/, "blog allowlist must default to empty");
const legacyBlogRedirect = /source: ['"]\/blog\/:path\*['"][\s\S]*?destination: ['"]\/guides['"]/;
assert.match(nextConfig, legacyBlogRedirect, "all legacy blog routes must redirect to maintained content");
assert.doesNotMatch(privacy, /Microsoft Clarity/i, "privacy wording must match the deployed trackers");

console.log("Quality gate passed: unapproved ads are gated and legacy articles remain quarantined.");
