import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const bytes = (file) => Buffer.byteLength(read(file), "utf8");
const approxTokens = (value) => Math.ceil(value / 4);
const failures = [];

const documents = {
  root: { path: "AGENTS.md", max: 8_000 },
  product: { path: "docs/codex/PRODUCT_PUBLICATION.md", max: 7_000 },
  privacy: { path: "docs/codex/PRIVACY_SECURITY_ACCESSIBILITY.md", max: 7_000 },
  commercial: { path: "docs/codex/COMMERCIAL_RELEASE.md", max: 7_000 },
};

for (const [name, document] of Object.entries(documents)) {
  if (!existsSync(path.join(root, document.path))) {
    failures.push(`missing ${document.path}`);
    continue;
  }
  document.bytes = bytes(document.path);
  if (document.bytes > document.max) {
    failures.push(`${document.path} is ${document.bytes} bytes, limit ${document.max}`);
  }
}

const config = read(".codex/config.toml");
const projectLimit = Number(config.match(/^project_doc_max_bytes\s*=\s*(\d+)$/m)?.[1] ?? 0);
if (projectLimit !== 10_240) failures.push("project_doc_max_bytes must equal 10240");
if (!/^project_doc_fallback_filenames\s*=\s*\[\]$/m.test(config)) {
  failures.push("project_doc_fallback_filenames must be empty");
}
if (/^tool_output_token_limit\s*=/m.test(config)) {
  failures.push("tool_output_token_limit requires a measured quality benchmark before use");
}

if (documents.root.bytes) {
  const crlfMargin = read(documents.root.path).split("\n").length;
  if (documents.root.bytes + crlfMargin > projectLimit) {
    failures.push("project_doc_max_bytes leaves insufficient Windows line-ending margin");
  }
}

const skipDirs = new Set([".git", ".next", "node_modules", "out", "coverage", "tmp"]);
const instructionFiles = [];
function findInstructionFiles(directory, relative = "") {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const nextRelative = relative ? `${relative}/${entry.name}` : entry.name;
    const nextPath = path.join(directory, entry.name);
    if (entry.isDirectory()) findInstructionFiles(nextPath, nextRelative);
    if (entry.isFile() && /(^|\/)AGENTS(?:\.override)?\.md$/i.test(nextRelative)) {
      instructionFiles.push(nextRelative.replaceAll("\\", "/"));
    }
  }
}
findInstructionFiles(root);
instructionFiles.sort();
if (instructionFiles.length !== 1 || instructionFiles[0] !== "AGENTS.md") {
  failures.push(`unexpected Codex instruction files: ${instructionFiles.join(", ") || "none"}`);
}

const git = spawnSync("git", ["ls-files"], { cwd: root, encoding: "utf8" });
if (git.status !== 0) {
  failures.push(`git ls-files failed: ${git.stderr.trim()}`);
} else {
  const tracked = git.stdout
    .split(/\r?\n/)
    .filter((file) => /(^|\/)AGENTS(?:\.override)?\.md$/i.test(file))
    .sort();
  if (tracked.length !== 1 || tracked[0] !== "AGENTS.md") {
    failures.push(`unexpected tracked Codex instruction files: ${tracked.join(", ") || "none"}`);
  }
}

const legacyName = ["CLA", "UDE.md"].join("");
const operatingFiles = [
  "AGENTS.md",
  ".codex/config.toml",
  ".codex/hooks.json",
  ".codex/hooks/resume.mjs",
  ".codex/agents/ft-reviewer.toml",
  ".codex/agents/ft-verifier.toml",
  ".agents/skills/ft-plan/SKILL.md",
  ".agents/skills/ft-run/SKILL.md",
  ".agents/skills/ft-debug/SKILL.md",
  ".agents/skills/ft-audit/SKILL.md",
  "docs/CODEX.md",
  ...Object.values(documents).map((document) => document.path),
  "scripts/codex/doctor.ps1",
  "tests/codex-operating-layer.test.mjs",
];
for (const file of operatingFiles) {
  if (existsSync(path.join(root, file)) && read(file).includes(legacyName)) {
    failures.push(`${file} depends on a legacy assistant instruction file`);
  }
}

const scenarios = [
  ["routine", ["root"]],
  ["product", ["root", "product"]],
  ["privacy-security", ["root", "privacy"]],
  ["commercial", ["root", "commercial"]],
  ["sensitive-commercial", ["root", "privacy", "commercial"]],
  ["all-policies", ["root", "product", "privacy", "commercial"]],
];

console.log("FiberTools repository-owned context budget");
console.log("Approximate tokens use bytes / 4 and exclude system, tools, source, tests, and chat history.\n");
for (const [name, keys] of scenarios) {
  const total = keys.reduce((sum, key) => sum + (documents[key].bytes ?? 0), 0);
  console.log(`${name.padEnd(21)} ${String(total).padStart(6)} bytes  ~${String(approxTokens(total)).padStart(5)} tokens`);
}

if (failures.length) {
  console.error("\nContext budget failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
