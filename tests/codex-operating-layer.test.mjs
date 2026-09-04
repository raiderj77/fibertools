import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateTask } from "../scripts/codex/task-check.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");
const legacyName = ["CLA", "UDE.md"].join("");

const policies = [
  "docs/codex/PRODUCT_PUBLICATION.md",
  "docs/codex/PRIVACY_SECURITY_ACCESSIBILITY.md",
  "docs/codex/COMMERCIAL_RELEASE.md",
];

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
  ...policies,
  "scripts/codex/context-budget.mjs",
  "scripts/codex/task-check.mjs",
  "scripts/codex/doctor.ps1",
];

test("focused standalone Codex files exist and obsolete layers are absent", () => {
  for (const file of operatingFiles) assert.equal(existsSync(path.join(root, file)), true, file);
  for (const file of [
    "agent-os",
    "docs/CODEX_AGENT_OS.md",
    "docs/CODEX_OMNIROUTE_OPTIONAL.md",
    ".codex/agents/ft-explorer.toml",
    ".codex/agents/ft-implementer.toml",
  ]) assert.equal(existsSync(path.join(root, file)), false, file);
  assert.match(read(".gitignore"), /^\/\.codex\/TASK\.md$/m);
});

test("Codex operating layer has no legacy assistant-file dependency", () => {
  for (const file of operatingFiles) assert.equal(read(file).includes(legacyName), false, file);
});

test("root instructions stay quality-first, concise, and route detail", () => {
  const agents = read("AGENTS.md");
  assert.ok(Buffer.byteLength(agents, "utf8") <= 8_000);
  for (const pattern of [
    /Correctness, safety, accessibility, and evidence outrank/,
    /docs\/codex\/PRODUCT_PUBLICATION\.md/,
    /docs\/codex\/PRIVACY_SECURITY_ACCESSIBILITY\.md/,
    /docs\/codex\/COMMERCIAL_RELEASE\.md/,
    /Do not modify this operating layer or required-check workflows/,
    /Close it after handoff before starting reviewer and verifier/,
    /Close every subagent after its result is captured/,
    /publication freeze remains active through November 20, 2026/,
    /docs\/stitchproof-distribution-kit\.md/,
    /Never push directly to `main`/,
    /## Code Review Rules/,
    /## Done/,
  ]) assert.match(agents, pattern);
  assert.doesNotMatch(agents, /\b(?:sk|rk|whsec|sbp)_[A-Za-z0-9_-]{12,}\b/);
});

test("project config caps automatic instructions without truncating tool evidence", () => {
  const config = read(".codex/config.toml");
  assert.match(config, /^project_doc_max_bytes\s*=\s*10240$/m);
  assert.match(config, /^project_doc_fallback_filenames\s*=\s*\[\]$/m);
  assert.match(config, /^multi_agent\s*=\s*true$/m);
  assert.match(config, /^hooks\s*=\s*true$/m);
  assert.match(config, /^max_concurrent_threads_per_session\s*=\s*2$/m);
  assert.doesNotMatch(config, /^codex_hooks\s*=/m);
  assert.doesNotMatch(config, /^tool_output_token_limit\s*=/m);
  assert.doesNotMatch(config, /model|provider|api_key|base_url|profile|telemetry/i);
});

test("focused policies preserve detailed product and safety rules", () => {
  for (const file of policies) assert.ok(Buffer.byteLength(read(file), "utf8") <= 7_000, file);
  assert.match(read(policies[0]), /publication freeze remains in force through November 20, 2026/);
  assert.match(read(policies[1]), /Global Privacy Control/);
  assert.match(read(policies[2]), /StitchProof is \$9 once per pattern project/);
});

test("context budget report passes and guards against hidden instruction files", () => {
  const run = spawnSync(process.execPath, [path.join(root, "scripts", "codex", "context-budget.mjs")], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(run.status, 0, run.stderr);
  assert.match(run.stdout, /routine\s+\d+ bytes/);
  assert.match(run.stdout, /sensitive-commercial\s+\d+ bytes/);
  assert.match(run.stdout, /all-policies\s+\d+ bytes/);
});

test("task checker enforces readiness and acceptance coverage without model tokens", () => {
  const valid = `# Bound gauge input
Status: Ready
Risk: High
Base: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa

## Policies and records
- \`docs/codex/PRODUCT_PUBLICATION.md\`

## Context set
- \`src/lib/gauge.ts\`: calculation path
- \`tests/gauge.test.mjs\`: regression proof

## Scope
Reject unsafe gauge input.

## Excluded
No page redesign.

## Failure modes and rollback
Fail closed and revert the isolated commit if the focused suite regresses.

## Acceptance and coverage
| ID | Observable result | Step | Test or evidence |
| --- | --- | --- | --- |
| A1 | Unsafe input is rejected | 1 | \`node --test tests/gauge.test.mjs\` |

## Steps
1. Add bounded validation and its regression case.

## Independent checks
ft_reviewer and ft_verifier

## Readiness
Ready

## Next
Run \`$ft-run\`.
`;
  assert.deepEqual(validateTask(valid, { requireReady: true }).errors, []);

  const invalid = valid.replace("Status: Ready", "Status: Draft").replace("| 1 |", "| 2 |");
  const result = validateTask(invalid, { requireReady: true });
  assert.ok(result.errors.some((error) => error.includes("missing step 2")));
  assert.ok(result.errors.includes("step 1 is not mapped to an acceptance item"));
  assert.ok(result.errors.includes("task must have Status: Ready"));

  const duplicate = valid.replace(
    "1. Add bounded validation and its regression case.",
    "1. Add bounded validation.\n1. Add its regression case.",
  );
  assert.ok(validateTask(duplicate).errors.includes("duplicate step number: 1"));

  const outside = spawnSync(
    process.execPath,
    [path.join(root, "scripts", "codex", "task-check.mjs"), "--file", "../outside.md"],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(outside.status, 1);
  assert.match(outside.stderr, /must stay inside the repository/);
});

test("every documented npm script exists in package.json", () => {
  const scripts = JSON.parse(read("package.json")).scripts ?? {};
  for (const file of ["AGENTS.md", "docs/CODEX.md", ...policies]) {
    for (const match of read(file).matchAll(/\bnpm run ([A-Za-z0-9:_-]+)/g)) {
      assert.ok(Object.hasOwn(scripts, match[1]), `${file}: ${match[1]}`);
    }
  }
});

test("reviewer and verifier are independent, high-effort, and policy-aware", () => {
  const files = readdirSync(path.join(root, ".codex", "agents"))
    .filter((name) => name.endsWith(".toml"))
    .sort();
  assert.deepEqual(files, ["ft-reviewer.toml", "ft-verifier.toml"]);
  for (const file of files) assert.match(read(`.codex/agents/${file}`), /^model_reasoning_effort\s*=\s*"high"$/m);
  assert.match(read(".codex/agents/ft-reviewer.toml"), /^sandbox_mode\s*=\s*"read-only"$/m);
  assert.match(read(".codex/agents/ft-verifier.toml"), /Do not edit tracked files/);
});

test("four narrow skills enforce context selection, readiness, debugging, and convergence", () => {
  const folders = readdirSync(path.join(root, ".agents", "skills")).sort();
  assert.deepEqual(folders, ["ft-audit", "ft-debug", "ft-plan", "ft-run"]);
  for (const folder of folders) {
    const source = read(`.agents/skills/${folder}/SKILL.md`);
    assert.match(source, /^---\n[\s\S]+?\n---\n/);
    assert.ok(Buffer.byteLength(source, "utf8") <= 3_200, folder);
  }
  assert.match(read(".agents/skills/ft-plan/SKILL.md"), /initial context set of no more than 12 files/);
  assert.match(read(".agents/skills/ft-plan/SKILL.md"), /task-check\.mjs --ready/);
  assert.match(read(".agents/skills/ft-debug/SKILL.md"), /Add a failing regression test first when practical/);
  assert.match(read(".agents/skills/ft-run/SKILL.md"), /Run `\$ft-audit` in convergence mode/);
  assert.match(read(".agents/skills/ft-audit/SKILL.md"), /Satisfied`, `Partial`, `Missing`, `Contradicts`, or `Not tested/);
});

test("human guide records native and evaluated context tools honestly", () => {
  const guide = read("docs/CODEX.md");
  assert.match(guide, /Use `\/status`/);
  assert.match(guide, /loaded instruction sources/);
  assert.match(guide, /Use `\/side`/);
  assert.match(guide, /still consumes model tokens/);
  assert.match(guide, /GitHub Spec Kit/);
  assert.match(guide, /Aider's repository-map approach/);
  assert.match(guide, /Serena is an optional pilot/);
  assert.match(guide, /GitHub CodeQL is a separate quality upgrade/);
});

test("required workflow enforces structure and PowerShell syntax after publication protection", () => {
  const workflow = read(".github/workflows/empire-check.yml");
  const publication = workflow.indexOf("npm run test:publication-freeze");
  const codex = workflow.indexOf("node --test tests/codex-operating-layer.test.mjs");
  assert.ok(publication >= 0 && codex > publication);
  assert.match(workflow, /Validate Codex PowerShell syntax/);
});

test("resume hook is silent at startup and tiny after compaction", () => {
  const hooks = JSON.parse(read(".codex/hooks.json"));
  const entry = hooks.hooks.SessionStart[0];
  assert.equal(entry.matcher, "resume|compact");
  assert.ok(entry.hooks[0].additionalContextLimit <= 80);
  const run = spawnSync(process.execPath, [path.join(root, ".codex", "hooks", "resume.mjs")], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(run.status, 0, run.stderr);
  assert.ok(JSON.parse(run.stdout).hookSpecificOutput.additionalContext.length <= 40);
});

test("doctor blocks unsafe starts, detects global instructions, and validates task state", () => {
  const source = read("scripts/codex/doctor.ps1");
  assert.match(source, /\$branch -eq "main"/);
  assert.match(source, /Working tree is not clean/);
  assert.match(source, /merge-base/);
  assert.match(source, /Global Codex instructions also load/);
  assert.match(source, /context-budget\.mjs/);
  assert.match(source, /task-check\.mjs --required/);
  assert.match(source, /Doctor checks changed tracked worktree state/);
  assert.doesNotMatch(source, /git\s+(?:push|commit|checkout|switch|merge|reset|clean|fetch|pull)\b/i);
  assert.doesNotMatch(source, /gh\s+pr\s+(?:create|merge|close)\b/i);
});
