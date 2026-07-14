import assert from "node:assert/strict";
import test from "node:test";
import { pagePathToUrl, pathsToIndexNowUrls } from "../scripts/indexnow-urls.mjs";

test("maps static App Router pages to their public URLs", () => {
  assert.equal(pagePathToUrl("src/app/page.tsx"), "https://fibertools.app/");
  assert.equal(
    pagePathToUrl("src/app/amigurumi-pattern-checker/page.tsx"),
    "https://fibertools.app/amigurumi-pattern-checker",
  );
  assert.equal(
    pagePathToUrl("src/app/(marketing)/crochet/tools/page.tsx"),
    "https://fibertools.app/crochet/tools",
  );
});

test("excludes dynamic, private, and non-page files", () => {
  assert.equal(pagePathToUrl("src/app/guides/[slug]/page.tsx"), null);
  assert.equal(pagePathToUrl("src/app/@modal/contact/page.tsx"), null);
  assert.equal(pagePathToUrl("src/app/_internal/page.tsx"), null);
  assert.equal(pagePathToUrl("src/lib/tools.ts"), null);
});

test("keeps the homepage and de-duplicates changed static pages", () => {
  assert.deepEqual(
    pathsToIndexNowUrls([
      "docs/revenue-experiment-ledger.md",
      "src/app/amigurumi-pattern-checker/page.tsx",
      "src/app/amigurumi-pattern-checker/page.tsx",
    ]),
    ["https://fibertools.app/", "https://fibertools.app/amigurumi-pattern-checker"],
  );
});
