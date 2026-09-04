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

function parseMarkdown(source) {
  const rawLines = source.split("\n");
  const lines = [...rawLines];
  const visible = Array(lines.length).fill(true);
  const headings = [];
  let fence = null;
  let htmlComment = false;

  for (const [lineIndex, rawLine] of rawLines.entries()) {
    if (fence) {
      visible[lineIndex] = false;
      lines[lineIndex] = "";
      const close = rawLine.match(/^ {0,3}(`{3,}|~{3,})[ \t]*$/);
      if (close && close[1][0] === fence.character && close[1].length >= fence.length) fence = null;
      continue;
    }

    let line = "";
    let remaining = rawLine;
    while (remaining) {
      if (htmlComment) {
        const closeIndex = remaining.indexOf("-->");
        if (closeIndex < 0) {
          remaining = "";
          break;
        }
        htmlComment = false;
        remaining = remaining.slice(closeIndex + 3);
        continue;
      }

      const openIndex = remaining.indexOf("<!--");
      if (openIndex < 0) {
        line += remaining;
        break;
      }
      line += remaining.slice(0, openIndex);
      htmlComment = true;
      remaining = remaining.slice(openIndex + 4);
    }
    lines[lineIndex] = line;
    if (!line.trim()) {
      visible[lineIndex] = false;
      continue;
    }

    const open = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (open) {
      visible[lineIndex] = false;
      lines[lineIndex] = "";
      fence = { character: open[1][0], length: open[1].length };
      continue;
    }

    const heading = line.match(/^##[ \t]+(.+?)[ \t]*$/);
    if (heading) headings.push({ name: heading[1], lineIndex });
  }

  return { lines, visible, headings };
}

function getSection(document, name) {
  const matches = document.headings.filter((heading) => heading.name === name);
  if (!matches.length) return { body: null, count: 0, index: -1 };

  const first = matches[0];
  const next = document.headings.find((heading) => heading.lineIndex > first.lineIndex);
  const bodyStart = first.lineIndex + 1;
  const bodyEnd = next?.lineIndex ?? document.lines.length;
  return {
    body: document.lines
      .slice(bodyStart, bodyEnd)
      .map((line, offset) => (document.visible[bodyStart + offset] ? line : ""))
      .join("\n")
      .trim(),
    count: matches.length,
    index: first.lineIndex,
  };
}

function getPreambleMatches(document, pattern) {
  const firstHeading = document.headings[0]?.lineIndex ?? document.lines.length;
  const matches = [];
  for (let index = 0; index < firstHeading; index += 1) {
    if (!document.visible[index]) continue;
    const match = document.lines[index].match(pattern);
    if (match) matches.push(match);
  }
  return matches;
}

export function validateTask(source, { requireReady = false } = {}) {
  const normalized = source.replace(/\r\n/g, "\n").trim();
  const document = parseMarkdown(normalized);
  const errors = [];
  const warnings = [];

  const firstHeading = document.headings[0]?.lineIndex ?? document.lines.length;
  const preambleLines = document.lines
    .slice(0, firstHeading)
    .filter((line, index) => document.visible[index] && line.trim());
  const h1Lines = preambleLines.filter((line) => /^#[ \t]+\S.+$/.test(line));
  if (!h1Lines.length || !/^#[ \t]+\S.+$/.test(preambleLines[0] ?? "")) {
    errors.push("missing a descriptive H1 outcome");
  } else if (h1Lines.length > 1) {
    errors.push("duplicate H1 outcome");
  }

  const words = normalized ? normalized.split(/\s+/).length : 0;
  if (words > 900) errors.push(`task has ${words} words; limit is 900`);

  const statusMatches = getPreambleMatches(document, /^Status:\s*(Draft|Ready|In progress|Blocked|Complete)\s*$/);
  const status = statusMatches[0]?.[1];
  if (!status) errors.push("Status must be Draft, Ready, In progress, Blocked, or Complete in the preamble");
  else if (statusMatches.length > 1) errors.push("duplicate Status metadata");

  const riskMatches = getPreambleMatches(document, /^Risk:\s*(Low|Medium|High)\s*$/);
  const risk = riskMatches[0]?.[1];
  if (!risk) errors.push("Risk must be Low, Medium, or High in the preamble");
  else if (riskMatches.length > 1) errors.push("duplicate Risk metadata");

  const baseMatches = getPreambleMatches(document, /^Base:\s*([0-9a-f]{40})\s*$/);
  if (!baseMatches.length) errors.push("Base must contain a full 40-character origin/main SHA in the preamble");
  else if (baseMatches.length > 1) errors.push("duplicate Base metadata");

  const sections = new Map();
  const sectionIndexes = [];
  for (const name of REQUIRED_SECTIONS) {
    const section = getSection(document, name);
    if (section.count === 0) errors.push(`missing section: ${name}`);
    else if (section.count > 1) errors.push(`duplicate section: ${name}`);
    if (section.body !== null && !section.body) errors.push(`empty section: ${name}`);
    sections.set(name, section.body ?? "");
    if (section.index >= 0) sectionIndexes.push(section.index);
  }
  if (sectionIndexes.some((value, index) => index > 0 && value < sectionIndexes[index - 1])) {
    errors.push("required sections are out of order");
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

  const acceptanceNumbers = acceptanceRows.map(({ id }) => Number(id.slice(1)));
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

  const stepNumbers = [...steps.keys()];
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
