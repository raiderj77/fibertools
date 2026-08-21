const test = require("node:test");
const assert = require("node:assert/strict");
const {
  BUYING_GUIDE_PATHS,
  CALCULATOR_PATHS,
  MONETIZED_PATHS,
  validateDelegatedTrackingSource,
  validateRevenuePage,
} = require("../scripts/revenue-path-check");

const path = "/blanket-calculator";

function affiliateLink({ tag = "ytearnings-20", rel = "sponsored nofollow noopener" } = {}) {
  return `<a href="https://www.amazon.com/s?k=blanket+yarn&amp;tag=${tag}" rel="${rel}" data-affiliate-tracked="true" data-affiliate-placement="tool-project-supplies" data-affiliate-category="yarn">View options</a>`;
}

function validPage(overrides = {}) {
  return {
    path,
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8", "x-robots-tag": "" },
    html: `
      <html><head><link rel="canonical" href="https://fibertools.app${path}"></head><body>
      <p>FiberTools may earn a commission if you buy through these links. As an Amazon Associate I earn from qualifying purchases.</p>
      ${affiliateLink()}${affiliateLink()}${affiliateLink()}
      </body></html>
    `,
    ...overrides,
  };
}

function validDelegatedTrackingSource() {
  return {
    layoutSource: "<html><body><AffiliateClickTracker /></body></html>",
    trackerSource: `
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.dataset.affiliateTracked === "true") return;
      const destination = new URL(link.href);
      if (destination.protocol !== "https:") return;
      if (destination.hostname !== "www.amazon.com") return;
      if (destination.searchParams.get("tag") !== AMAZON_ASSOCIATE_TAG) return;
      window.gtag("event", "affiliate_click", {
        page_path: window.location.pathname,
        placement: "editorial-product-link",
        content_type: "article",
        merchant: "amazon",
        product_category: "editorial-product",
      });
    `,
  };
}

test("accepts a healthy rendered revenue path", () => {
  assert.deepEqual(validateRevenuePage(validPage()), {
    path,
    affiliateLinks: 3,
    tracking: "link-metadata",
  });
});

test("monitors all ten calculators and five live buying guides", () => {
  assert.equal(CALCULATOR_PATHS.length, 10);
  assert.deepEqual(BUYING_GUIDE_PATHS, [
    "/best-crochet-hooks",
    "/best-knitting-needles",
    "/best-yarn-for-amigurumi",
    "/best-yarn-for-beginners",
    "/best-yarn-for-blankets",
  ]);
  assert.equal(MONETIZED_PATHS.length, 15);
  assert.ok(!MONETIZED_PATHS.includes("/blog/crochet-hook-size-chart"));
});

test("accepts complete guide links handled by the global delegated tracker", () => {
  const guidePath = BUYING_GUIDE_PATHS[0];
  const page = validPage({ path: guidePath });
  page.html = page.html
    .replaceAll(path, guidePath)
    .replaceAll(' data-affiliate-tracked="true"', "")
    .replaceAll(' data-affiliate-placement="tool-project-supplies"', "")
    .replaceAll(' data-affiliate-category="yarn"', "");

  assert.deepEqual(validateRevenuePage(page), {
    path: guidePath,
    affiliateLinks: 3,
    tracking: "delegated",
  });
});

test("rejects partially marked guide tracking metadata", () => {
  const guidePath = BUYING_GUIDE_PATHS[0];
  const page = validPage({ path: guidePath });
  page.html = page.html
    .replaceAll(path, guidePath)
    .replaceAll(' data-affiliate-placement="tool-project-supplies"', "")
    .replaceAll(' data-affiliate-category="yarn"', "");

  assert.throws(() => validateRevenuePage(page), /placement label is missing/);
});

test("requires the delegated Amazon tracker before guides skip link metadata", () => {
  assert.equal(validateDelegatedTrackingSource(validDelegatedTrackingSource()), true);

  const withoutMountedTracker = validDelegatedTrackingSource();
  withoutMountedTracker.layoutSource = "<html><body></body></html>";
  assert.throws(
    () => validateDelegatedTrackingSource(withoutMountedTracker),
    /must remain mounted/,
  );

  const withoutTagGuard = validDelegatedTrackingSource();
  withoutTagGuard.trackerSource = withoutTagGuard.trackerSource.replace(
    'destination.searchParams.get("tag") !== AMAZON_ASSOCIATE_TAG',
    'destination.searchParams.get("tag") !== "anything"',
  );
  assert.throws(
    () => validateDelegatedTrackingSource(withoutTagGuard),
    /must require the approved Associate tag/,
  );

  const withoutHostGuard = validDelegatedTrackingSource();
  withoutHostGuard.trackerSource = withoutHostGuard.trackerSource.replace(
    'destination.hostname !== "www.amazon.com"',
    'destination.hostname !== "example.com"',
  );
  assert.throws(
    () => validateDelegatedTrackingSource(withoutHostGuard),
    /must require the Amazon host/,
  );

  const withoutHttpsGuard = validDelegatedTrackingSource();
  withoutHttpsGuard.trackerSource = withoutHttpsGuard.trackerSource.replace(
    'destination.protocol !== "https:"',
    'destination.protocol !== "http:"',
  );
  assert.throws(
    () => validateDelegatedTrackingSource(withoutHttpsGuard),
    /must require HTTPS/,
  );

  const withoutDirectTrackingGuard = validDelegatedTrackingSource();
  withoutDirectTrackingGuard.trackerSource = withoutDirectTrackingGuard.trackerSource.replace(
    'link.dataset.affiliateTracked === "true"',
    'link.dataset.affiliateTracked === "false"',
  );
  assert.throws(
    () => validateDelegatedTrackingSource(withoutDirectTrackingGuard),
    /must avoid double-counting/,
  );
});

test("rejects a page that becomes noindex", () => {
  const page = validPage();
  page.html = page.html.replace("<head>", '<head><meta name="robots" content="noindex, follow">');
  assert.throws(() => validateRevenuePage(page), /robots meta tag blocks indexing/);
});

test("rejects an incorrect affiliate tag", () => {
  const page = validPage();
  page.html = page.html.replace(/ytearnings-20/g, "wrong-tag-20");
  assert.throws(() => validateRevenuePage(page), /affiliate tag is missing or incorrect/);
});

test("rejects a disclosure placed after the affiliate links", () => {
  const page = validPage();
  const disclosure = "<p>FiberTools may earn a commission if you buy through these links. As an Amazon Associate I earn from qualifying purchases.</p>";
  page.html = page.html.replace(disclosure, "").replace("</body>", `${disclosure}</body>`);
  assert.throws(() => validateRevenuePage(page), /disclosure must precede affiliate links/);
});

test("rejects an Amazon statement without a clear paid-link disclosure", () => {
  const page = validPage();
  page.html = page.html.replace("FiberTools may earn a commission if you buy through these links. ", "");
  assert.throws(() => validateRevenuePage(page), /paid-link disclosure is missing/);
});

test("rejects untracked affiliate links", () => {
  const page = validPage();
  page.html = page.html.replace(' data-affiliate-tracked="true"', "");
  assert.throws(() => validateRevenuePage(page), /click tracking marker is missing/);
});

test("rejects affiliate links without noopener", () => {
  const page = validPage();
  page.html = page.html.replace(/ noopener/g, "");
  assert.throws(() => validateRevenuePage(page), /affiliate link is missing rel=noopener/);
});
