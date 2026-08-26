import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";


const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = resolve(SCRIPT_DIR, "..");
const MANIFEST_PATH = "config/publication-approval-manifest.json";
const CONTENT_TYPES = new Set(["CALCULATOR", "TOOL", "ARTICLE", "GUIDE", "PAID_OFFER", "OTHER"]);
const FREEZE_STATUSES = new Set(["ACTIVE", "LIFTED"]);
const PINNED_BASELINE_COMMIT = "e67c27714f5353b14e6ae13f6b1291f677fdbaf3";
const PINNED_BASELINE_SHA256 = "ca20511506aefd76fd3d27d117bdc785bfe4354e2c3c776c6726a68494a8cc30";
const NEXT_PAGE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];


function normalizedPath(value) {
  return value.split(sep).join("/");
}


function sortedUnique(values) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}


function sha256List(values) {
  return createHash("sha256").update(sortedUnique(values).join("\n"), "utf8").digest("hex");
}


function canonicalValue(value) {
  if (Array.isArray(value)) return value.map(canonicalValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalValue(value[key])]),
    );
  }
  return value;
}


function sha256Object(value) {
  return createHash("sha256")
    .update(JSON.stringify(canonicalValue(value)), "utf8")
    .digest("hex");
}


function filesUnder(root, extensions) {
  if (!existsSync(root)) return [];
  const results = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = resolve(root, entry.name);
    if (entry.isDirectory()) results.push(...filesUnder(full, extensions));
    else if (extensions.some((extension) => entry.name.endsWith(extension))) results.push(full);
  }
  return results;
}


export function isAppRouterPagePath(file) {
  return /(^|\/)page\.(?:tsx|ts|jsx|js)$/.test(normalizedPath(file));
}


export function isMonitoredPublicSourcePath(file) {
  const normalized = normalizedPath(file);
  return NEXT_PAGE_EXTENSIONS.some((extension) => normalized.endsWith(extension));
}


export function isPriceBearingSource(source) {
  return /\$[0-9]/.test(source);
}


export function appRouteFromPagePath(file) {
  const rel = normalizedPath(file).replace(/(^|\/)page\.(?:tsx|ts|jsx|js)$/, "");
  return rel ? `/${rel}` : "/";
}


function routeFromPageFile(root, file) {
  const appRoot = resolve(root, "src", "app");
  return appRouteFromPagePath(relative(appRoot, file));
}


export function isPagesRouterPublicPath(file) {
  const rel = normalizedPath(file);
  if (!NEXT_PAGE_EXTENSIONS.some((extension) => rel.endsWith(extension))) return false;
  if (rel.startsWith("api/")) return false;
  return !/^_(?:app|document|error)\.(?:tsx|ts|jsx|js)$/.test(rel);
}


export function pagesRouteFromPagePath(file) {
  const rel = normalizedPath(file).replace(/\.(?:tsx|ts|jsx|js)$/, "");
  if (rel === "index") return "/";
  return `/${rel.replace(/\/index$/, "")}`;
}


function routeFromPagesFile(root, file) {
  const pagesRoot = resolve(root, "src", "pages");
  return pagesRouteFromPagePath(relative(pagesRoot, file));
}


function sourceRoute(root, file) {
  const appRoot = resolve(root, "src", "app");
  const rel = normalizedPath(relative(appRoot, file));
  if (rel.startsWith("../")) return routeFromPagesFile(root, file);
  const parts = rel.split("/");
  parts.pop();
  return parts.length ? `/${parts.join("/")}` : "/";
}


export function extractRegistrySlugs(source, label = "registry") {
  const slugs = [];
  const violations = [];
  for (const [index, line] of source.split(/\r?\n/).entries()) {
    const property = line.match(/^\s*slug\s*:\s*(.*?)\s*$/);
    if (!property) continue;

    const expression = property[1].replace(/\s*,\s*(?:\/\/.*)?$/, "").trim();
    if (expression === "string;") continue;

    const literal = expression.match(/^(["'`])([a-z0-9][a-z0-9-]*)\1$/);
    if (literal && !(literal[1] === "`" && literal[2].includes("${"))) {
      slugs.push(literal[2]);
      continue;
    }
    violations.push(`${label}:${index + 1} has an unsupported nonliteral slug definition.`);
  }
  return { slugs, violations };
}


function extractSlugs(root, file) {
  const label = normalizedPath(relative(root, file));
  return extractRegistrySlugs(readFileSync(file, "utf8"), label);
}


function normalizeFrontMatterValue(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === "string" ? value.trim() : "";
}


function collectArticles(root) {
  const directory = resolve(root, "content", "published");
  return filesUnder(directory, [".md", ".mdx"]).map((file) => {
    const raw = readFileSync(file, "utf8");
    const { data } = matter(raw);
    const filename = relative(directory, file);
    const fallbackSlug = filename.replace(/\.mdx?$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
    const slug = normalizeFrontMatterValue(data.slug) || fallbackSlug;
    return {
      file: normalizedPath(filename),
      slug,
      title: normalizeFrontMatterValue(data.title).toLowerCase(),
      canonical: (normalizeFrontMatterValue(data.canonical) || normalizeFrontMatterValue(data.canonicalUrl)).toLowerCase(),
      date: normalizeFrontMatterValue(data.date),
      route: `/blog/${slug}`,
    };
  });
}


function collectScheduledDirectMainWorkflows(root) {
  const workflowDirectory = resolve(root, ".github", "workflows");
  return filesUnder(workflowDirectory, [".yml", ".yaml"])
    .filter((file) => {
      const source = readFileSync(file, "utf8");
      const scheduled = /^\s*schedule:\s*$/m.test(source);
      const writesRepository = /contents:\s*write|git\s+commit|git\s+push/i.test(source);
      const contentProcess = /content[\\/]published|publish(?:er|ing)?|article|guide/i.test(source);
      const pushesMain = /git\s+push[^\n]*(?:\bmain\b|HEAD:main)/i.test(source) || /branches?:\s*\[?\s*main/i.test(source);
      return scheduled && writesRepository && contentProcess && pushesMain;
    })
    .map((file) => normalizedPath(relative(root, file)));
}


export function readPublicationManifest(root = DEFAULT_ROOT) {
  return JSON.parse(readFileSync(resolve(root, MANIFEST_PATH), "utf8"));
}


export function collectPublicationState(root = DEFAULT_ROOT) {
  const appRoot = resolve(root, "src", "app");
  const pagesRoot = resolve(root, "src", "pages");
  const pageFiles = filesUnder(appRoot, NEXT_PAGE_EXTENSIONS)
    .filter((file) => isAppRouterPagePath(relative(appRoot, file)));
  const pagesRouterFiles = filesUnder(pagesRoot, NEXT_PAGE_EXTENSIONS)
    .filter((file) => isPagesRouterPublicPath(relative(pagesRoot, file)));
  const pricedSourceFiles = [
    ...filesUnder(appRoot, NEXT_PAGE_EXTENSIONS),
    ...pagesRouterFiles,
  ]
    .filter((file) => isPriceBearingSource(readFileSync(file, "utf8")))
    .map((file) => normalizedPath(relative(root, file)));
  const toolRegistry = extractSlugs(root, resolve(root, "src", "lib", "tools.ts"));
  const guideRegistry = extractSlugs(root, resolve(root, "src", "lib", "guides.ts"));

  return {
    publicRoutes: [
      ...pageFiles.map((file) => routeFromPageFile(root, file)),
      ...pagesRouterFiles.map((file) => routeFromPagesFile(root, file)),
    ],
    toolSlugs: toolRegistry.slugs,
    guideSlugs: guideRegistry.slugs,
    registrySlugViolations: [...toolRegistry.violations, ...guideRegistry.violations],
    articles: collectArticles(root),
    priceBearingSourceFiles: pricedSourceFiles,
    priceBearingSourceRoutes: Object.fromEntries(
      pricedSourceFiles.map((file) => [file, sourceRoute(root, resolve(root, file))]),
    ),
    scheduledDirectMainWorkflows: collectScheduledDirectMainWorkflows(root),
  };
}


function isIsoDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}


function validApproval(approval, freeze, today, violations, index) {
  const prefix = `Approval ${index + 1}`;
  if (typeof approval.route !== "string" || !approval.route.startsWith("/")) violations.push(`${prefix}: route must start with /.`);
  if (!CONTENT_TYPES.has(approval.contentType)) violations.push(`${prefix}: invalid contentType.`);
  if (typeof approval.title !== "string" || !approval.title.trim()) violations.push(`${prefix}: title is required.`);
  if (!isIsoDate(approval.ownerApprovalDate)) violations.push(`${prefix}: ownerApprovalDate must be YYYY-MM-DD.`);
  if (typeof approval.reason !== "string" || !approval.reason.trim()) violations.push(`${prefix}: reason is required.`);
  if (typeof approval.approvalReference !== "string" || !approval.approvalReference.trim()) violations.push(`${prefix}: approvalReference is required.`);
  if (!isIsoDate(approval.reviewOrExpirationDate)) violations.push(`${prefix}: reviewOrExpirationDate must be YYYY-MM-DD.`);
  if (typeof approval.indexingApproved !== "boolean") violations.push(`${prefix}: indexingApproved must be boolean.`);
  if (isIsoDate(approval.ownerApprovalDate) && approval.ownerApprovalDate < freeze.startsOn) violations.push(`${prefix}: approval predates the freeze.`);
  if (isIsoDate(approval.ownerApprovalDate) && approval.ownerApprovalDate > today) violations.push(`${prefix}: ownerApprovalDate cannot be in the future.`);
  if (
    isIsoDate(approval.ownerApprovalDate) &&
    isIsoDate(approval.reviewOrExpirationDate) &&
    approval.reviewOrExpirationDate < approval.ownerApprovalDate
  ) {
    violations.push(`${prefix}: reviewOrExpirationDate cannot precede ownerApprovalDate.`);
  }
  if (isIsoDate(approval.reviewOrExpirationDate) && approval.reviewOrExpirationDate < today) violations.push(`${prefix}: approval is expired.`);
  if (approval.indexingApproved !== true) violations.push(`${prefix}: indexingApproved must be true because route noindex is not verified by this gate.`);
  return violations.length === 0;
}


function validateFreezeDecision(freeze, today, violations) {
  if (!FREEZE_STATUSES.has(freeze.status)) {
    violations.push("Freeze status must be ACTIVE or LIFTED.");
    return;
  }
  if (freeze.status === "ACTIVE") {
    if (freeze.ownerDecision !== null) violations.push("An ACTIVE freeze must not contain an ownerDecision.");
    return;
  }

  const decision = freeze.ownerDecision;
  if (!decision || typeof decision !== "object") {
    violations.push("A LIFTED freeze requires an explicit ownerDecision record.");
    return;
  }
  if (decision.action !== "LIFT") violations.push("Freeze ownerDecision action must be LIFT.");
  if (!isIsoDate(decision.ownerDecisionDate)) {
    violations.push("Freeze ownerDecisionDate must be YYYY-MM-DD.");
  } else {
    if (decision.ownerDecisionDate < freeze.decisionDate) violations.push("Freeze cannot be lifted before its decision date.");
    if (decision.ownerDecisionDate > today) violations.push("Freeze ownerDecisionDate cannot be in the future.");
  }
  if (typeof decision.reason !== "string" || !decision.reason.trim()) violations.push("Freeze ownerDecision reason is required.");
  if (typeof decision.approvalReference !== "string" || !decision.approvalReference.trim()) {
    violations.push("Freeze ownerDecision approvalReference is required.");
  }
}


function duplicateViolations(articles, field, allowances) {
  const counts = new Map();
  for (const article of articles) {
    const value = article[field];
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  const violations = [];
  for (const [value, count] of counts) {
    const allowed = allowances[value] || 1;
    if (count > allowed) violations.push(`Duplicate article ${field} "${value}" appears ${count} times; baseline allows ${allowed}.`);
  }
  return violations;
}


function baselineMismatch(label, currentValues, expectedCount, expectedHash) {
  const values = sortedUnique(currentValues);
  if (values.length === expectedCount && sha256List(values) === expectedHash) return null;
  return `${label} changed during the publication freeze without a matching owner-approved record (expected ${expectedCount}, found ${values.length}).`;
}


export function analyzePublicationState(manifest, state, now = new Date()) {
  const violations = [];
  const { freeze, baseline } = manifest;
  if (!freeze || !baseline || !Array.isArray(manifest.approvals)) return ["Publication manifest schema is incomplete."];
  if (!isIsoDate(freeze.startsOn) || !isIsoDate(freeze.decisionDate)) violations.push("Freeze dates must be YYYY-MM-DD.");

  const today = now.toISOString().slice(0, 10);
  validateFreezeDecision(freeze, today, violations);
  if (baseline.capturedFromCommit !== PINNED_BASELINE_COMMIT) {
    violations.push(`Publication baseline must remain pinned to ${PINNED_BASELINE_COMMIT}.`);
  }
  if (sha256Object(baseline) !== PINNED_BASELINE_SHA256) {
    violations.push("Pinned publication baseline digest mismatch; add an owner approval instead of rewriting the baseline.");
  }

  manifest.approvals.forEach((approval, index) => {
    const local = [];
    validApproval(approval, freeze, today, local, index);
    violations.push(...local);
  });
  violations.push(...(state.registrySlugViolations ?? []));
  if (violations.length) return violations;

  const active = today >= freeze.startsOn && freeze.status === "ACTIVE";
  const approvals = manifest.approvals;
  const approvedRoutes = new Set(approvals.map((approval) => approval.route));
  const approvedToolSlugs = new Set(approvals
    .filter((approval) => approval.contentType === "CALCULATOR" || approval.contentType === "TOOL")
    .map((approval) => approval.route.replace(/^\//, "")));
  const approvedGuideSlugs = new Set(approvals
    .filter((approval) => approval.contentType === "GUIDE" && approval.route.startsWith("/guides/"))
    .map((approval) => approval.route.slice("/guides/".length)));
  const approvedArticleRoutes = new Set(approvals
    .filter((approval) => approval.contentType === "ARTICLE")
    .map((approval) => approval.route));
  const approvedPaidRoutes = new Set(approvals
    .filter((approval) => approval.contentType === "PAID_OFFER")
    .map((approval) => approval.route));

  if (active) {
    const routeMismatch = baselineMismatch(
      "Public route inventory",
      state.publicRoutes.filter((route) => !approvedRoutes.has(route)),
      baseline.publicRouteCount,
      baseline.publicRouteSha256,
    );
    if (routeMismatch) violations.push(routeMismatch);

    const toolMismatch = baselineMismatch(
      "Calculator/tool registry",
      state.toolSlugs.filter((slug) => !approvedToolSlugs.has(slug)),
      baseline.toolSlugCount,
      baseline.toolSlugSha256,
    );
    if (toolMismatch) violations.push(toolMismatch);

    const guideMismatch = baselineMismatch(
      "Guide registry",
      state.guideSlugs.filter((slug) => !approvedGuideSlugs.has(slug)),
      baseline.guideSlugCount,
      baseline.guideSlugSha256,
    );
    if (guideMismatch) violations.push(guideMismatch);

    const articleMismatch = baselineMismatch(
      "Quarantined article inventory",
      state.articles.filter((article) => !approvedArticleRoutes.has(article.route)).map((article) => article.file),
      baseline.quarantinedArticleFileCount,
      baseline.quarantinedArticleFileSha256,
    );
    if (articleMismatch) violations.push(articleMismatch);

    const paidSourceMismatch = baselineMismatch(
      "Price-bearing source inventory",
      state.priceBearingSourceFiles.filter((file) => !approvedPaidRoutes.has(state.priceBearingSourceRoutes[file])),
      baseline.priceBearingSourceFileCount,
      baseline.priceBearingSourceFileSha256,
    );
    if (paidSourceMismatch) violations.push(paidSourceMismatch);
  }

  for (const article of state.articles) {
    if (
      isIsoDate(article.date) &&
      article.date >= freeze.startsOn &&
      article.date < freeze.decisionDate &&
      !approvedArticleRoutes.has(article.route)
    ) {
      violations.push(`Article ${article.file} is dated inside the freeze without owner approval.`);
    }
  }

  violations.push(...duplicateViolations(state.articles, "slug", baseline.duplicateAllowances.slug));
  violations.push(...duplicateViolations(state.articles, "title", baseline.duplicateAllowances.title));
  violations.push(...duplicateViolations(state.articles, "canonical", baseline.duplicateAllowances.canonical));

  for (const workflow of state.scheduledDirectMainWorkflows) {
    violations.push(`Scheduled content workflow ${workflow} can write directly to main.`);
  }
  return violations;
}


export function getPublicationFreezeViolations(root = DEFAULT_ROOT, now = new Date()) {
  return analyzePublicationState(readPublicationManifest(root), collectPublicationState(root), now);
}


function runCli() {
  const violations = getPublicationFreezeViolations();
  if (violations.length) {
    console.error("Publication freeze verification failed:");
    for (const violation of violations) console.error(`  - ${violation}`);
    process.exitCode = 1;
    return;
  }
  console.log("Publication freeze verification passed: no unapproved public growth or duplicate growth detected.");
}


if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) runCli();
