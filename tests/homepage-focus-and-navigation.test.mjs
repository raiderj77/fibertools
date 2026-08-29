import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read = (path) => fs.readFileSync(path, "utf8");

const homepage = read("src/app/page.tsx");
const directory = read("src/components/HomeToolDirectory.tsx");
const header = read("src/components/Header.tsx");
const footer = read("src/components/Footer.tsx");
const toolsSource = read("src/lib/tools.ts");

function publicTextFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return publicTextFiles(path);
    return entry.isFile() && /\.(?:js|json|md|mjs|ts|tsx|txt)$/u.test(entry.name) ? [path] : [];
  });
}

function extractStringArray(source, name) {
  const match = source.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\] as const;`, "u"));
  assert.ok(match, `${name} must be a literal const array`);
  return [...match[1].matchAll(/"([^"]+)"/gu)].map((entry) => entry[1]);
}

test("focuses the homepage on three visitor paths and the approved calculator order", () => {
  for (const path of [
    "Calculate yarn and materials",
    "Fix gauge, sizing, and stitch counts",
    "Plan a crochet or knitting project",
  ]) {
    assert.match(homepage, new RegExp(path, "u"));
  }

  assert.deepEqual(extractStringArray(homepage, "FEATURED_TOOL_SLUGS"), [
    "blanket-calculator",
    "yarn-calculator",
    "circle-calculator",
    "amigurumi-shapes",
    "cast-on-calculator",
  ]);
  assert.match(homepage, /const SECONDARY_TOOL_SLUG = "sock-calculator" as const;/u);
  assert.equal((homepage.match(/href="#featured-calculators"/gu) ?? []).length, 1);
  assert.doesNotMatch(homepage, /tier1|tier2|tier3|Essential Fiber Arts Tools|More Fiber Arts Calculators|Specialty Fiber Arts Tools/u);
});

test("describes featured calculators without unsupported popularity claims", () => {
  assert.match(homepage, /Five calculators to help size projects, estimate materials, and work through construction math\./u);
  assert.match(homepage, />Also featured<\/p>/u);
  assert.doesNotMatch(homepage, /proven tools|most visitors|Also popular|Evidence-backed featured|Secondary proven/iu);
});

test("keeps every remaining registered tool in the complete searchable directory", () => {
  const readyTools = [
    ...toolsSource.matchAll(/\{\s*slug:\s*"([^"]+)"[\s\S]*?ready:\s*(true|false),[\s\S]*?\},/gu),
  ]
    .filter((match) => match[2] === "true")
    .map((match) => match[1]);
  const promoted = new Set([
    ...extractStringArray(homepage, "FEATURED_TOOL_SLUGS"),
    "sock-calculator",
  ]);
  const remaining = readyTools.filter((slug) => !promoted.has(slug)).sort();
  const filterMap = directory.match(/const TOOL_FILTERS:[\s\S]*?= \{([\s\S]*?)\n\};/u);
  assert.ok(filterMap, "directory filters must use one explicit audited slug map");
  const mapped = [...filterMap[1].matchAll(/"([^"]+)"/gu)].map((entry) => entry[1]).sort();

  assert.equal(readyTools.length, 34);
  assert.equal(remaining.length, 28);
  assert.deepEqual(mapped, remaining);
  assert.match(homepage, /<HomeToolDirectory tools=\{remainingTools\} \/>/u);
  assert.match(directory, /useState<DirectoryFilter>\("all"\)/u);
  assert.match(directory, /useState\(""\)/u);
  assert.match(directory, /Search calculators and references/u);
});

test("publishes the bounded free-product promise without absolute site-wide claims", () => {
  const approvedPromise = "All self-service calculators stay free. Optional professional reviews and project downloads are paid.";
  for (const path of [
    "src/app/page.tsx",
    "src/app/about/page.tsx",
    "src/app/contact/page.tsx",
    "public/llms.txt",
    "public/llms-full.txt",
  ]) {
    assert.ok(read(path).replace(/\s+/gu, " ").includes(approvedPromise), `${path} must publish the approved promise`);
  }

  const publicPromiseSources = [
    ...publicTextFiles("src/app"),
    ...publicTextFiles("src/components"),
    ...publicTextFiles("public"),
  ].map(read).join("\n");

  assert.doesNotMatch(
    publicPromiseSources,
    /Everything on FiberTools is free|Always free|completely free|Every tool is free|All tools\s+are free|FiberTools is a free service|support the free service|plan to keep the tools free/iu,
  );
});

test("uses one simplified primary navigation while preserving secondary footer routes", () => {
  const navBlock = header.match(/const navLinks = \[([\s\S]*?)\n  \];/u);
  assert.ok(navBlock, "header must keep one explicit navigation registry");
  const links = [...navBlock[1].matchAll(/\{ href: "([^"]+)", label: "([^"]+)" \}/gu)]
    .map((match) => ({ href: match[1], label: match[2] }));

  assert.deepEqual(links, [
    { href: "/#all-tools", label: "Calculators" },
    { href: "/formula-library", label: "Guides & formulas" },
    { href: "/embeds", label: "Embeds" },
    { href: "/fiber-project-planning-pack", label: "Planning Pack" },
    { href: "/designer-pattern-preflight", label: "For designers" },
    { href: "/about", label: "About" },
  ]);
  assert.doesNotMatch(header, />\s*All Tools\s*</u);

  for (const route of [
    "/crochet-tools",
    "/knitting-tools",
    "/weaving-tools",
    "/guides",
    "/formula-library",
    "/newsletter",
    "/privacy",
    "/terms",
    "/contact",
    "/accessibility",
    "/affiliate-disclosure",
  ]) {
    assert.match(footer, new RegExp(route.replaceAll("/", "\\/"), "u"));
  }
});

test("keeps newsletter and buying guidance visually secondary", () => {
  assert.doesNotMatch(homepage, /BeehiivSignup/u);
  assert.match(homepage, /Optional product guidance/u);
  assert.match(homepage, /Destination pages clearly disclose paid links/u);
  assert.match(homepage, /Optional newsletter/u);
  assert.match(homepage, /href="\/newsletter"/u);
});
