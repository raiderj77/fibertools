const assert = require("node:assert/strict");
const fs = require("node:fs");
const pathModule = require("node:path");

const BASE_URL = (process.env.FIBERTOOLS_BASE_URL || "https://fibertools.app").replace(/\/$/, "");
const ASSOCIATE_TAG = "ytearnings-20";
const REQUIRED_DISCLOSURE = "As an Amazon Associate I earn from qualifying purchases.";
const REQUIRED_LINK_DISCLOSURE = "FiberTools may earn a commission if you buy through these links.";

const CALCULATOR_PATHS = [
  "/blanket-calculator",
  "/amigurumi-shapes",
  "/circle-calculator",
  "/yarn-calculator",
  "/sleeve-calculator",
  "/sock-calculator",
  "/weaving-sett-calculator",
  "/cast-on-calculator",
  "/raglan-calculator",
  "/color-pooling-calculator",
];

const BUYING_GUIDE_PATHS = [
  "/best-crochet-hooks",
  "/best-knitting-needles",
  "/best-yarn-for-amigurumi",
  "/best-yarn-for-beginners",
  "/best-yarn-for-blankets",
];

const MONETIZED_PATHS = [...CALCULATOR_PATHS, ...BUYING_GUIDE_PATHS];
const BUYING_GUIDE_PATH_SET = new Set(BUYING_GUIDE_PATHS);

function validateDelegatedTrackingSource({ layoutSource, trackerSource }) {
  assert.match(
    layoutSource,
    /<AffiliateClickTracker\s*\/>/,
    "Global AffiliateClickTracker must remain mounted before guides use delegated tracking",
  );
  assert.ok(
    trackerSource.includes('target.closest<HTMLAnchorElement>("a[href]")'),
    "Delegated tracker must inspect clicked links",
  );
  assert.ok(
    trackerSource.includes("new URL(link.href)"),
    "Delegated tracker must parse the clicked destination",
  );
  assert.ok(
    trackerSource.includes('destination.protocol !== "https:"'),
    "Delegated tracker must require HTTPS",
  );
  assert.ok(
    trackerSource.includes('destination.hostname !== "www.amazon.com"'),
    "Delegated tracker must require the Amazon host",
  );
  assert.ok(
    trackerSource.includes('destination.searchParams.get("tag") !== AMAZON_ASSOCIATE_TAG'),
    "Delegated tracker must require the approved Associate tag",
  );
  assert.ok(
    trackerSource.includes('link.dataset.affiliateTracked === "true"'),
    "Delegated tracker must avoid double-counting links with direct tracking",
  );
  assert.ok(
    trackerSource.includes('window.gtag("event", "affiliate_click"'),
    "Delegated tracker must emit affiliate_click",
  );
  for (const field of ["page_path", "placement", "content_type", "merchant", "product_category"]) {
    assert.ok(trackerSource.includes(field), `Delegated tracking is missing ${field}`);
  }

  return true;
}

function validateLocalDelegatedTrackingSource() {
  return validateDelegatedTrackingSource({
    layoutSource: fs.readFileSync(pathModule.join(process.cwd(), "src/app/layout.tsx"), "utf8"),
    trackerSource: fs.readFileSync(
      pathModule.join(process.cwd(), "src/components/AffiliateClickTracker.tsx"),
      "utf8",
    ),
  });
}

function decodeHtmlAttribute(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, "i"));
  return match ? decodeHtmlAttribute(match[1]) : null;
}

function validateRevenuePage({
  path,
  status,
  headers = {},
  html,
  requireTrackingMetadata = !BUYING_GUIDE_PATH_SET.has(path),
}) {
  assert.equal(status, 200, `${path}: expected HTTP 200, received ${status}`);
  assert.match(headers["content-type"] || "", /text\/html/i, `${path}: response is not HTML`);
  assert.doesNotMatch(headers["x-robots-tag"] || "", /noindex/i, `${path}: X-Robots-Tag blocks indexing`);
  assert.doesNotMatch(
    html,
    /<meta\b(?=[^>]*\bname=["']robots["'])(?=[^>]*\bcontent=["'][^"']*noindex)/i,
    `${path}: robots meta tag blocks indexing`,
  );

  const canonicalTags = html.match(/<link\b[^>]*>/gi) || [];
  const canonicalTag = canonicalTags.find((tag) => /\brel=["'][^"']*canonical/i.test(tag));
  assert.ok(canonicalTag, `${path}: canonical link is missing`);
  assert.equal(attribute(canonicalTag, "href"), `${BASE_URL}${path}`, `${path}: canonical URL is incorrect`);

  const affiliateLinks = (html.match(/<a\b[^>]*>/gi) || []).filter((tag) => {
    const href = attribute(tag, "href");
    if (!href) return false;
    try {
      return new URL(href).hostname === "www.amazon.com";
    } catch {
      return false;
    }
  });

  assert.ok(affiliateLinks.length >= 3, `${path}: expected at least 3 rendered Amazon recommendations`);

  const disclosurePosition = html.indexOf(REQUIRED_DISCLOSURE);
  const linkDisclosurePosition = html.indexOf(REQUIRED_LINK_DISCLOSURE);
  const firstAffiliatePosition = html.indexOf(affiliateLinks[0]);
  assert.ok(disclosurePosition >= 0, `${path}: Amazon disclosure is missing`);
  assert.ok(linkDisclosurePosition >= 0, `${path}: paid-link disclosure is missing`);
  assert.ok(disclosurePosition < firstAffiliatePosition, `${path}: disclosure must precede affiliate links`);
  assert.ok(
    linkDisclosurePosition < firstAffiliatePosition,
    `${path}: paid-link disclosure must precede affiliate links`,
  );

  for (const link of affiliateLinks) {
    const href = new URL(attribute(link, "href"));
    const rel = (attribute(link, "rel") || "").split(/\s+/);
    assert.equal(href.protocol, "https:", `${path}: affiliate link must use HTTPS`);
    assert.equal(href.searchParams.get("tag"), ASSOCIATE_TAG, `${path}: affiliate tag is missing or incorrect`);
    assert.ok(rel.includes("sponsored"), `${path}: affiliate link is missing rel=sponsored`);
    assert.ok(rel.includes("nofollow"), `${path}: affiliate link is missing rel=nofollow`);
    assert.ok(rel.includes("noopener"), `${path}: affiliate link is missing rel=noopener`);

    const trackingMetadata = {
      tracked: attribute(link, "data-affiliate-tracked"),
      placement: attribute(link, "data-affiliate-placement"),
      category: attribute(link, "data-affiliate-category"),
    };
    const hasAnyTrackingMetadata = Object.values(trackingMetadata).some(Boolean);
    if (requireTrackingMetadata || hasAnyTrackingMetadata) {
      assert.equal(trackingMetadata.tracked, "true", `${path}: click tracking marker is missing`);
      assert.ok(trackingMetadata.placement, `${path}: placement label is missing`);
      assert.ok(trackingMetadata.category, `${path}: category label is missing`);
    }
  }

  return {
    path,
    affiliateLinks: affiliateLinks.length,
    tracking: requireTrackingMetadata ? "link-metadata" : "delegated",
  };
}

async function fetchWithRetry(url, attempts = 2) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "FiberTools-Revenue-Monitor/1.0" },
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
      });
      if (response.status >= 500 && attempt < attempts) continue;
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function checkRevenuePath(path) {
  const response = await fetchWithRetry(`${BASE_URL}${path}`);
  const html = await response.text();
  return validateRevenuePage({
    path,
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") || "",
      "x-robots-tag": response.headers.get("x-robots-tag") || "",
    },
    html,
  });
}

async function main() {
  validateLocalDelegatedTrackingSource();

  const results = [];
  for (const path of MONETIZED_PATHS) {
    results.push(await checkRevenuePath(path));
  }

  for (const result of results) {
    console.log(
      `PASS ${result.path}: ${result.affiliateLinks} affiliate links (${result.tracking} tracking)`,
    );
  }
  console.log(`Revenue path healthy on ${results.length} monetized FiberTools pages.`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`Revenue path check failed: ${error.message}`);
    process.exitCode = 1;
  });
}

module.exports = {
  BUYING_GUIDE_PATHS,
  CALCULATOR_PATHS,
  MONETIZED_PATHS,
  validateDelegatedTrackingSource,
  validateRevenuePage,
};
