import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(child) : [child];
  });
}

function normalizePathname(href) {
  const pathname = href.split(/[?#]/u)[0] || "/";
  return pathname.length > 1 ? pathname.replace(/\/+$/u, "") : pathname;
}

function routePattern(pagePath) {
  let route = `/${path.relative("src/app", path.dirname(pagePath)).replaceAll("\\", "/")}`;
  route = route
    .split("/")
    .filter((segment) => segment && !/^\(.+\)$/u.test(segment) && !segment.startsWith("@"))
    .join("/");
  route = `/${route}`.replace(/\/{2,}/gu, "/");

  const escaped = route
    .replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")
    .replace(/\\\[\\\[\\\.\\\.\\\.[^\]]+\\\]\\\]/gu, "(?:/.*)?")
    .replace(/\\\[\\\.\\\.\\\.[^\]]+\\\]/gu, ".+")
    .replace(/\\\[[^\]]+\\\]/gu, "[^/]+");
  return new RegExp(`^${escaped || "/"}$`, "u");
}

test("all literal internal page links resolve to an app route or public file", () => {
  const sourceFiles = [...walk("src/app"), ...walk("src/components")]
    .filter((file) => /\.(?:ts|tsx)$/u.test(file));
  const pagePatterns = walk("src/app")
    .filter((file) => file.endsWith(`${path.sep}page.tsx`))
    .map(routePattern);
  const hrefs = new Set();

  for (const file of sourceFiles) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/href\s*=\s*["'](\/[A-Za-z0-9_./#?=&%-]*)["']/gu)) {
      hrefs.add(match[1]);
    }
    for (const match of source.matchAll(/href\s*:\s*["'](\/[A-Za-z0-9_./#?=&%-]*)["']/gu)) {
      hrefs.add(match[1]);
    }
    for (const match of source.matchAll(/link\s*:\s*["'](\/[A-Za-z0-9_./#?=&%-]*)["']/gu)) {
      hrefs.add(match[1]);
    }
  }

  const unresolved = [...hrefs]
    .map(normalizePathname)
    .filter((pathname) => {
      const publicPath = path.join("public", pathname.replace(/^\/+/, ""));
      return !fs.existsSync(publicPath) && !pagePatterns.some((pattern) => pattern.test(pathname));
    })
    .sort();

  assert.deepEqual(unresolved, []);
});
