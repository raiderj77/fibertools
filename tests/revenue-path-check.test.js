const test = require("node:test");
const assert = require("node:assert/strict");
const { validateRevenuePage } = require("../scripts/revenue-path-check");

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
      <p>As an Amazon Associate, FiberTools earns from qualifying purchases.</p>
      ${affiliateLink()}${affiliateLink()}${affiliateLink()}
      </body></html>
    `,
    ...overrides,
  };
}

test("accepts a healthy rendered revenue path", () => {
  assert.deepEqual(validateRevenuePage(validPage()), { path, affiliateLinks: 3 });
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
  const disclosure = "<p>As an Amazon Associate, FiberTools earns from qualifying purchases.</p>";
  page.html = page.html.replace(disclosure, "").replace("</body>", `${disclosure}</body>`);
  assert.throws(() => validateRevenuePage(page), /disclosure must precede affiliate links/);
});

test("rejects untracked affiliate links", () => {
  const page = validPage();
  page.html = page.html.replace(' data-affiliate-tracked="true"', "");
  assert.throws(() => validateRevenuePage(page), /click tracking marker is missing/);
});
