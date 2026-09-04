import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(scriptPath), "..", "..");

const REQUIRED_SECTIONS = [
  "Policies and records",
  "Context set",
  "Scope",
  "Excluded",
  "Failure modes and rollback",
  "Acceptance and coverage",
  "Steps",
  "Independent checks",
  "Readiness",
  "Next",
];

function getSection(source, name) {
  const marker = `## ${name}`;
  const start = source.indexOf(marker);
  if (start < 0) return null;
  const bodyStart = start + marker.length;
  const rest = source.slice(bodyStart).replace(/^\r?\n/, "");
  const next = rest.search(/\r?\n##\s+/);
  return (next < 0 ? rest : rest.slice(0, next)).trim();
}

export function validateTask(source, { requireReady = false } = {}) {
  const normalized = source.replace(/\r\n/g, "\n").trim();
  const errors = [];
  const warnings = [];

  if (!/^#\s+\S.+$/m.test(normalized)) errors.push("missing a descriptive H1 outcome");

  const words = normalized ? normalized.split(/\s+/).length : 0;
  if (words > 900) errors.push(`task has ${words} words; limit is 900`);

  const status = normalized.match(/^Status:\s*(Draft|Ready|In progress|Blocked|Complete)\s*$/m)?.[1];
  if (!status) errors.push("Status must be Draft, Ready, In progress, Blocked, or Complete");

  const risk = normalized.match(/^Risk:\s*(Low|Medium|High)\s*$/m)?.[1];
  if (!risk) errors.push("Risk must be Low, Medium, or High");

  if (!/^Base:\s*[0-9a-f]{40}\s*$/m.test(normalized)) {
    errors.push("Base must contain a full 40-character origin/main SHA");
  }

  const sections = new Map();
  for (const name of REQUIRED_SECTIONS) {
    const body = getSection(normalized, name);
    if (body === null) errors.push(`missing section: ${name}`);
    else if (!body) errors.push(`empty section: ${name}`);
    sections.set(name, body ?? "");
  }

  const acceptanceRows = [];
  const acceptanceIds = new Set();
  for (const line of sections.get("Acceptance and coverage").split("\n")) {
    const match = line.match(/^\|\s*(A\d+)\s*\|\s*(.+?)\s*\|\s*(\d+)\s*\|\s*(.+?)\s*\|$/);
    if (!match) continue;
    const [, id, result, step, evidence] = match;
    if (acceptanceIds.has(id)) errors.push(`duplicate acceptance ID: ${id}`);
    acceptanceIds.add(id);
    acceptanceRows.push({ id, result, step: Number(step), evidence });
  }
  if (!acceptanceRows.length) errors.push("acceptance table has no A-numbered coverage row");

  const acceptanceNumbers = [...acceptanceIds].map((id) => Number(id.slice(1))).sort((a, b) => a - b);
  acceptanceNumbers.forEach((value, index) => {
    if (value !== index + 1) errors.push("acceptance IDs must be sequential from A1");
  });

  const steps = new Map();
  for (const line of sections.get("Steps").split("\n")) {
    const match = line.match(/^(\d+)\.\s+(.+)$/);
    if (!match) continue;
    const step = Number(match[1]);
    if (steps.has(step)) errors.push(`duplicate step number: ${step}`);
    else steps.set(step, match[2]);
  }
  if (!steps.size) errors.push("Steps has no numbered implementation step");

  const stepNumbers = [...steps.keys()].sort((a, b) => a - b);
  stepNumbers.forEach((value, index) => {
    if (value !== index + 1) errors.push("step numbers must be sequential from 1");
  });

  for (const row of acceptanceRows) {
    if (!steps.has(row.step)) errors.push(`${row.id} maps to missing step ${row.step}`);
    if (!row.result.trim() || !row.evidence.trim()) errors.push(`${row.id} lacks a result or proving evidence`);
  }
  for (const step of steps.keys()) {
    if (!acceptanceRows.some((row) => row.step === step)) {
      errors.push(`step ${step} is not mapped to an acceptance item`);
    }
  }

  const contextCount = sections
    .get("Context set")
    .split("\n")
    .filter((line) => /^-\s+/.test(line)).length;
  if (["Medium", "High"].includes(risk) && contextCount === 0) {
    errors.push(`${risk}-risk work requires an evidence-based context set`);
  }
  if (contextCount > 12) {
    warnings.push(`initial context set has ${contextCount} files; confirm each is required by evidence`);
  }

  if (risk === "High") {
    if (!/docs\/codex\//.test(sections.get("Policies and records"))) {
      errors.push("High-risk work must list at least one matching docs/codex policy");
    }
    const checks = sections.get("Independent checks");
    if (!/ft_reviewer/.test(checks) || !/ft_verifier/.test(checks)) {
      errors.push("High-risk work requires ft_reviewer and ft_verifier");
    }
  }

  if (requireReady && status !== "Ready") errors.push("task must have Status: Ready");
  if (status === "Ready" && !/^Ready\b/m.test(sections.get("Readiness"))) {
    errors.push("Ready task must state Ready in the Readiness section");
  }

  if (["Ready", "In progress", "Complete"].includes(status)) {
    const placeholders = [
      /\[Outcome\]/,
      /\[origin\/main SHA\]/,
      /\[exact path or current primary source\]/,
      /\[path\]/,
      /\[why it is needed\]/,
      /\[Included behavior and files\]/,
      /\[Explicit exclusions\]/,
      /\[Material risks/,
      /\[Observable result\]/,
      /\[command or inspection\]/,
      /\[Bounded step/,
      /\[none \|/,
      /\[Ready \|/,
      /\[One exact action\]/,
      /\b(?:TBD|TODO|TBC)\b/i,
    ];
    for (const pattern of placeholders) {
      if (pattern.test(normalized)) errors.push(`unresolved template placeholder: ${pattern}`);
    }
  }

  return { errors: [...new Set(errors)], warnings, words, status, risk };
}

function fail(message) {
  console.error(`Task check failed: ${message}`);
  process.exit(1);
}

function runCli() {
  const argv = process.argv.slice(2);
  const args = new Set(argv);
  const fileIndex = argv.indexOf("--file");
  if (fileIndex >= 0 && !argv[fileIndex + 1]) fail("--file requires a repository-relative path");

  const relativePath = fileIndex >= 0 ? argv[fileIndex + 1] : ".codex/TASK.md";
  const taskPath = path.resolve(root, relativePath);
  const relativeToRoot = path.relative(root, taskPath);
  if (relativeToRoot === ".." || relativeToRoot.startsWith(`..${path.sep}`) || path.isAbsolute(relativeToRoot)) {
    fail("task file must stay inside the repository");
  }

  const requireReady = args.has("--ready");
  const required = requireReady || args.has("--required");
  if (!existsSync(taskPath)) {
    if (required) fail(`missing ${path.relative(root, taskPath)}`);
    console.log("No active .codex/TASK.md.");
    return;
  }

  const result = validateTask(readFileSync(taskPath, "utf8"), { requireReady });
  for (const warning of result.warnings) console.warn(`Task warning: ${warning}`);
  if (result.errors.length) {
    console.error("Task check failed:");
    for (const error of result.errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Task check passed: ${result.status}, ${result.risk}, ${result.words} words.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === scriptPath) runCli();
