import assert from "node:assert/strict";
import fs from "node:fs";

import { getStrictCspMode } from "../src/lib/strict-csp.mjs";

const manifest = JSON.parse(
  fs.readFileSync(".next/prerender-manifest.json", "utf8"),
);
const routes = Object.keys(manifest.routes);
const mode = getStrictCspMode();
const representativePages = ["/", "/about", "/vintage-pattern-decoder"];

if (mode === "off") {
  for (const route of representativePages) {
    assert.ok(
      routes.includes(route),
      `${route} must remain prerendered by default`,
    );
  }
  assert.ok(
    routes.length >= 80,
    `expected the static portfolio, found ${routes.length} routes`,
  );
  console.log(`Default CSP build retained ${routes.length} prerendered routes.`);
} else {
  for (const route of representativePages) {
    assert.equal(
      routes.includes(route),
      false,
      `${route} must be dynamic in nonce mode`,
    );
  }
  console.log(
    `Nonce CSP build made representative pages dynamic (${routes.length} prerendered routes remain).`,
  );
}
