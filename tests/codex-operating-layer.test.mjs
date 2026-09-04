import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateTask } from "../scripts/codex/task-check.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8").replace(/\r\n/g, "\n");
const legacyName = ["CLA", "UDE.md"].join("");

function writeCommandShim(directory, name, scriptPath) {
  if (process.platform === "win32") {
    const shim = path.join(directory, `${name}.cmd`);
    writeFileSync(shim, `@echo off\r\n"${process.execPath}" "${scriptPath}" %*\r\n`, "utf8");
    return shim;
  }

  const shim = path.join(directory, name);
  writeFileSync(shim, `#!/bin/sh\nexec "${process.execPath}" "${scriptPath}" "$@"\n`, "utf8");
  chmodSync(shim, 0o755);
  return shim;
}

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
  "scripts/codex/validate-config.mjs",
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
  assert.match(config, /^max_threads\s*=\s*2$/m);
  assert.doesNotMatch(config, /^max_concurrent_threads_per_session\s*=/m);
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

test("task checker enforces exact ordered sections and preamble metadata without model tokens", () => {
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

  const prefixedHeading = valid.replace("## Scope\n", "## Scoped exclusions\n");
  assert.ok(validateTask(prefixedHeading).errors.includes("missing section: Scope"));

  const duplicateHeading = valid.replace("## Scope\n", "## Scope\nDuplicate scope.\n\n## Scope\n");
  assert.ok(validateTask(duplicateHeading).errors.includes("duplicate section: Scope"));

  const reorderedHeadings = valid
    .replace("## Scope\nReject unsafe gauge input.", "## Excluded\nReject unsafe gauge input.")
    .replace("## Excluded\nNo page redesign.", "## Scope\nNo page redesign.");
  assert.ok(validateTask(reorderedHeadings).errors.includes("required sections are out of order"));

  const malformedHeading = valid.replace("## Scope\n", "### Scope\n");
  assert.ok(validateTask(malformedHeading).errors.includes("missing section: Scope"));

  const fencedHeading = valid.replace("## Scope\nReject unsafe gauge input.\n", "```md\n## Scope\nFake scope.\n```\n");
  assert.ok(validateTask(fencedHeading).errors.includes("missing section: Scope"));

  const misplacedStatus = valid.replace("Status: Ready\n", "").replace("## Scope\n", "## Scope\nStatus: Ready\n");
  assert.ok(validateTask(misplacedStatus).errors.some((error) => error.includes("Status must be")));

  const duplicateStatus = valid.replace("Status: Ready\n", "Status: Ready\nStatus: Ready\n");
  assert.ok(validateTask(duplicateStatus).errors.includes("duplicate Status metadata"));

  const fencedOutcome = valid.replace("# Bound gauge input\n", "```md\n# Bound gauge input\n```\n");
  assert.ok(validateTask(fencedOutcome).errors.includes("missing a descriptive H1 outcome"));

  const fencedAcceptance = valid.replace(
    "| A1 | Unsafe input is rejected | 1 | `node --test tests/gauge.test.mjs` |",
    "```md\n| A1 | Unsafe input is rejected | 1 | `node --test tests/gauge.test.mjs` |\n```",
  );
  assert.ok(validateTask(fencedAcceptance).errors.includes("acceptance table has no A-numbered coverage row"));

  const fencedStep = valid.replace(
    "1. Add bounded validation and its regression case.",
    "```md\n1. Add bounded validation and its regression case.\n```",
  );
  assert.ok(validateTask(fencedStep).errors.includes("Steps has no numbered implementation step"));

  const commentedTask = valid.replace("# Bound gauge input\n", "# Bound gauge input\n<!--\n") + "-->\n";
  const commentedErrors = validateTask(commentedTask).errors;
  assert.ok(commentedErrors.some((error) => error.includes("Status must be")));
  assert.ok(commentedErrors.includes("missing section: Scope"));

  const sameLineComment = valid.replace("Status: Ready\n", "<!-- Status: Ready -->\n");
  assert.ok(validateTask(sameLineComment).errors.some((error) => error.includes("Status must be")));

  const secondAcceptance = "| A2 | Safe input remains accepted | 2 | `node --test tests/gauge.test.mjs` |";
  const secondStep = "2. Verify safe input remains accepted.";
  const twoStepTask = valid
    .replace(
      "| A1 | Unsafe input is rejected | 1 | `node --test tests/gauge.test.mjs` |",
      "| A1 | Unsafe input is rejected | 1 | `node --test tests/gauge.test.mjs` |\n" + secondAcceptance,
    )
    .replace(
      "1. Add bounded validation and its regression case.",
      "1. Add bounded validation and its regression case.\n" + secondStep,
    );
  assert.deepEqual(validateTask(twoStepTask).errors, []);

  const reorderedAcceptance = twoStepTask.replace(
    "| A1 | Unsafe input is rejected | 1 | `node --test tests/gauge.test.mjs` |\n" + secondAcceptance,
    secondAcceptance + "\n| A1 | Unsafe input is rejected | 1 | `node --test tests/gauge.test.mjs` |",
  );
  assert.ok(validateTask(reorderedAcceptance).errors.includes("acceptance IDs must be sequential from A1"));

  const reorderedSteps = twoStepTask.replace(
    "1. Add bounded validation and its regression case.\n" + secondStep,
    secondStep + "\n1. Add bounded validation and its regression case.",
  );
  assert.ok(validateTask(reorderedSteps).errors.includes("step numbers must be sequential from 1"));

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
  assert.match(guide, /validates parser acceptance/);
  assert.match(guide, /does not prove that every Desktop or MultiAgentV2 host enforces/);
});

test("required workflow enforces native Codex config and PowerShell runtime gates", () => {
  const workflow = read(".github/workflows/empire-check.yml");
  const publication = workflow.indexOf("npm run test:publication-freeze");
  const codex = workflow.indexOf("node --test tests/codex-operating-layer.test.mjs");
  assert.ok(publication >= 0 && codex > publication);
  assert.match(workflow, /Validate Codex PowerShell syntax/);
  assert.match(workflow, /Validate Codex project config/);
  assert.match(workflow, /Validate Codex project config\n\s+timeout-minutes:\s+3/);
  assert.match(workflow, /npm exec --yes --no-audit --package=@openai\/codex@0\.144\.1/);
  assert.match(workflow, /npm exec --yes --no-audit --package=@openai\/codex@0\.153\.0/);
  assert.match(workflow, /Run Codex doctor under PowerShell/);
  assert.match(workflow, /doctor\.ps1 -RunChecks/);
  assert.match(workflow, /^\s+pull-requests:\s+read$/m);
  assert.match(workflow, /fetch-depth:\s+0/);
});

test("resume hook is silent at startup and tiny after compaction", () => {
  const hooks = JSON.parse(read(".codex/hooks.json"));
  const entry = hooks.hooks.SessionStart[0];
  assert.equal(entry.matcher, "resume|compact");
  assert.ok(entry.hooks[0].additionalContextLimit <= 80);
  const tempRoot = mkdtempSync(path.join(tmpdir(), "fibertools-codex-hook-"));
  try {
    const init = spawnSync("git", ["init", "--quiet"], { cwd: tempRoot, encoding: "utf8" });
    assert.equal(init.status, 0, init.stderr);

    const inactive = spawnSync(process.execPath, [path.join(root, ".codex", "hooks", "resume.mjs")], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    assert.equal(inactive.status, 0, inactive.stderr);
    assert.equal(inactive.stdout, "");

    mkdirSync(path.join(tempRoot, ".codex"));
    writeFileSync(path.join(tempRoot, ".codex", "TASK.md"), "# Synthetic active task\n", "utf8");
    const active = spawnSync(process.execPath, [path.join(root, ".codex", "hooks", "resume.mjs")], {
      cwd: tempRoot,
      encoding: "utf8",
    });
    assert.equal(active.status, 0, active.stderr);
    const output = JSON.parse(active.stdout);
    assert.equal(Object.hasOwn(output, "suppressOutput"), false);
    assert.ok(output.hookSpecificOutput.additionalContext.length <= 40);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("doctor blocks unsafe starts, detects global instructions, and validates task state", () => {
  const source = read("scripts/codex/doctor.ps1");
  assert.match(source, /Get-Command git -CommandType Application/);
  assert.match(source, /function Invoke-Git/);
  assert.doesNotMatch(source, /function Git\b/);
  assert.doesNotMatch(source, /& git\b/i);
  assert.match(source, /Get-Command gh -CommandType Application/);
  assert.match(source, /GitHub CLI is required/);
  assert.match(source, /could not inspect branch protection/);
  assert.match(source, /could not list pull requests/);
  const originGuard = source.indexOf('$origin -notin $allowedOrigins');
  assert.ok(originGuard >= 0 && originGuard < source.indexOf('"ls-remote"'));
  assert.ok(originGuard < source.indexOf('Write-Host "Origin:'));
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

test("doctor rejects an unexpected origin before network lookup or output", () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "fibertools-codex-doctor-origin-"));
  try {
    const gitLog = path.join(tempRoot, "git-calls.jsonl");
    const fakeGit = path.join(tempRoot, "fake-git.mjs");
    writeFileSync(
      fakeGit,
      `import { appendFileSync } from "node:fs";
const args = process.argv.slice(2);
appendFileSync(process.env.FIBERTOOLS_GIT_LOG, JSON.stringify(args) + "\\n");
if (args.join(" ") === "rev-parse --show-toplevel") process.stdout.write(process.env.FIBERTOOLS_TEST_ROOT);
else if (args.join(" ") === "remote get-url origin") process.stdout.write("https://synthetic-user:synthetic-secret@example.invalid/repo.git");
else process.exit(90);
`,
      "utf8",
    );
    writeCommandShim(tempRoot, "git", fakeGit);

    const run = spawnSync(
      process.platform === "win32" ? "pwsh.exe" : "pwsh",
      ["-NoProfile", "-File", path.join(root, "scripts", "codex", "doctor.ps1")],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${tempRoot}${path.delimiter}${process.env.PATH || ""}`,
          FIBERTOOLS_GIT_LOG: gitLog,
          FIBERTOOLS_TEST_ROOT: root,
        },
        timeout: 30_000,
      },
    );
    const combined = `${run.stdout}\n${run.stderr}`;
    assert.notEqual(run.status, 0);
    assert.match(combined, /Unexpected origin/);
    assert.doesNotMatch(combined, /synthetic-user|synthetic-secret|doctor passed/);
    const calls = readFileSync(gitLog, "utf8").trim().split("\n").map(JSON.parse);
    assert.deepEqual(calls, [
      ["rev-parse", "--show-toplevel"],
      ["remote", "get-url", "origin"],
    ]);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("doctor fails closed when GitHub evidence cannot be read", () => {
  const tempRoot = mkdtempSync(path.join(tmpdir(), "fibertools-codex-doctor-gh-"));
  try {
    const fakeGit = path.join(tempRoot, "fake-git.mjs");
    writeFileSync(
      fakeGit,
      `const args = process.argv.slice(2);
const key = args.join(" ");
const sha = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
if (key === "rev-parse --show-toplevel") process.stdout.write(process.env.FIBERTOOLS_TEST_ROOT);
else if (key === "remote get-url origin") process.stdout.write("https://github.com/raiderj77/fibertools.git");
else if (key === "branch --show-current") process.stdout.write("codex/runtime-test");
else if (key === "rev-parse HEAD") process.stdout.write(sha);
else if (key === "status --porcelain") process.exit(0);
else if (key === "ls-remote origin refs/heads/main") process.stdout.write(sha + "\\trefs/heads/main");
else if (key === "status --short --branch") process.stdout.write("## codex/runtime-test");
else if (args[0] === "cat-file" && args[1] === "-e") process.exit(0);
else if (args[0] === "merge-base") process.stdout.write(sha);
else process.exit(91);
`,
      "utf8",
    );
    const fakeGh = path.join(tempRoot, "fake-gh.mjs");
    writeFileSync(fakeGh, `process.stderr.write("synthetic GitHub failure\\n"); process.exit(1);\n`, "utf8");
    writeCommandShim(tempRoot, "git", fakeGit);
    writeCommandShim(tempRoot, "gh", fakeGh);

    const run = spawnSync(
      process.platform === "win32" ? "pwsh.exe" : "pwsh",
      ["-NoProfile", "-File", path.join(root, "scripts", "codex", "doctor.ps1")],
      {
        cwd: root,
        encoding: "utf8",
        env: {
          ...process.env,
          PATH: `${tempRoot}${path.delimiter}${process.env.PATH || ""}`,
          FIBERTOOLS_TEST_ROOT: root,
        },
        timeout: 30_000,
      },
    );
    const combined = `${run.stdout}\n${run.stderr}`;
    assert.notEqual(run.status, 0);
    assert.match(combined, /could not inspect branch protection/);
    assert.doesNotMatch(combined, /doctor passed/);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
});
