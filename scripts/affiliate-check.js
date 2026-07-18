const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const sourceFiles = walk(path.join(root, "src")).filter((file) => /\.(ts|tsx|js|jsx)$/.test(file));
const source = sourceFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
const tagMatches = source.match(/ytearnings-20/g) || [];
assert(tagMatches.length === 1, "Amazon Associates tag must appear only in the central affiliate config");

const recommendationSource = read("src/components/ToolAffiliateRecommendations.tsx");
const recommendationLayout = read("src/components/AffiliateRecommendations.tsx");
const configuredTools = [...recommendationSource.matchAll(/^  "([a-z0-9-]+)": \{$/gm)].map((match) => match[1]);
assert(configuredTools.length === 10, `Expected 10 monetized tools, found ${configuredTools.length}`);

for (const slug of configuredTools) {
  assert(fs.existsSync(path.join(root, "src", "app", slug, "page.tsx")), `Missing page for ${slug}`);
}

const clickTracker = read("src/components/AffiliateLink.tsx") + read("src/components/AffiliateClickTracker.tsx");
for (const field of ["page_path", "placement", "content_type", "merchant", "product_category"]) {
  assert(clickTracker.includes(field), `Affiliate click tracking is missing ${field}`);
}

assert(
  recommendationLayout.indexOf("<AffiliateDisclosure compact />") <
    recommendationLayout.indexOf("items.map"),
  "Amazon disclosure must appear before the first affiliate link",
);
assert(!clickTracker.includes("calculator_input"), "Affiliate events must not include calculator inputs");
assert(!clickTracker.includes("email"), "Affiliate events must not include email addresses");

const yarnCalculator = read("src/app/yarn-calculator/YarnCalculatorTool.tsx");
assert(!yarnCalculator.includes("ft_calc_unlocked"), "Calculator results must not depend on localStorage unlocks");
assert(!yarnCalculator.includes("Unlock your full breakdown"), "Calculator results must not be email gated");

assert(fs.existsSync(path.join(root, "src", "app", "affiliate-disclosure", "page.tsx")), "Affiliate disclosure page is missing");
assert(!source.includes("other affiliate programs"), "Privacy copy must not claim unverified affiliate programs");

for (const retiredAsin of ["B000XZS3AO", "B000XZSGEU", "B000XZS3RQ"]) {
  assert(!source.includes(retiredAsin), `Retired Amazon product ${retiredAsin} must not remain linked`);
}
for (const currentAsin of ["B0CBPXTSB8", "B00CB39PYQ", "B00114TCMQ"]) {
  assert(source.includes(currentAsin), `Verified Amazon product ${currentAsin} is missing`);
}
for (const retiredUrl of [
  "craftyarncouncil.com/standards/how-to-measure-gauge",
  "craftyarncouncil.com/standards/stitch-symbols",
  "craftyarncouncil.com/quick-guide-to-yarn",
  "yarnspirations.com/blogs/ideas-and-inspiration",
  "craftyarncouncil.com/standards/hat-sizing",
  "craftyarncouncil.com/standards/needle-hook-chart",
  "interweave.com/article/knitting/sock-knitting-101",
  "ads.google.com/settings",
]) {
  assert(!source.includes(retiredUrl), `Retired external destination ${retiredUrl} must not remain linked`);
}

console.log(`Affiliate checks passed for ${configuredTools.length} monetized tools.`);
