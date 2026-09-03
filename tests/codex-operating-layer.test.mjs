import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFileSync(path.join(root, file), "utf8");

const required = [
  "AGENTS.md",
  "CLAUDE.md",
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
  "scripts/codex/doctor.ps1",
];

test("focused operating files exist and redundant layer is absent", () => {
  for (const file of required) {
    assert.equal(existsSync(path.join(root, file)), true, file);
  }
  for (const file of [
    "agent-os",
    "docs/CODEX_AGENT_OS.md",
    "docs/CODEX_OMNIROUTE_OPTIONAL.md",
    ".codex/agents/ft-explorer.toml",
    ".codex/agents/ft-implementer.toml",
  ]) {
    assert.equal(existsSync(path.join(root, file)), false, file);
  }
  assert.match(read(".gitignore"), /^\/\.codex\/TASK\.md$/m);
});

test("AGENTS.md keeps focused context without lowering the quality floor", () => {
  const agents = read("AGENTS.md");
  assert.ok(Buffer.byteLength(agents, "utf8") <= 6000);
  assert.match(agents, /Correctness, safety, and complete evidence outrank token savings/);
  assert.match(agents, /High risk or release-sensitive work: read all of `CLAUDE\.md`/);
  assert.match(agents, /A bug fix must reproduce the defect and add a failing regression test first when practical/);
  assert.match(agents, /use `ft_reviewer` and `ft_verifier`/);
  assert.match(agents, /Resolve reviewer and verifier disagreements against direct evidence/);
  assert.match(agents, /Never push to `main`/);
  assert.match(agents, /docs\/stitchproof-distribution-kit\.md/);
  assert.match(agents, /## Code Review Rules/);
  assert.match(agents, /Report local change/);
  assert.doesNotMatch(agents, /\b(?:sk|rk|whsec|sbp)_[A-Za-z0-9_-]{12,}\b/);
});

test("project config allows two independent checks without provider settings", () => {
  const config = read(".codex/config.toml");
  assert.match(config, /^multi_agent\s*=\s*true$/m);
  assert.match(config, /^hooks\s*=\s*true$/m);
  assert.match(config, /^max_concurrent_threads_per_session\s*=\s*2$/m);
  assert.doesNotMatch(config, /model|provider|api_key|base_url|profile|telemetry/i);
});

test("reviewer and verifier are independent, high-effort, and bounded", () => {
  const files = readdirSync(path.join(root, ".codex", "agents"))
    .filter((name) => name.endsWith(".toml"))
    .sort();
  assert.deepEqual(files, ["ft-reviewer.toml", "ft-verifier.toml"]);

  const reviewer = read(".codex/agents/ft-reviewer.toml");
  assert.match(reviewer, /^name\s*=\s*"ft_reviewer"$/m);
  assert.match(reviewer, /^model_reasoning_effort\s*=\s*"high"$/m);
  assert.match(reviewer, /^sandbox_mode\s*=\s*"read-only"$/m);
  assert.match(reviewer, /Do not edit files/);

  const verifier = read(".codex/agents/ft-verifier.toml");
  assert.match(verifier, /^name\s*=\s*"ft_verifier"$/m);
  assert.match(verifier, /^model_reasoning_effort\s*=\s*"high"$/m);
  assert.match(verifier, /^sandbox_mode\s*=\s*"workspace-write"$/m);
  assert.match(verifier, /Do not edit tracked files/);
  assert.match(verifier, /Record git status before and after verification/);
});

test("four focused skills route planning, execution, debugging, and audit", () => {
  const skillRoot = path.join(root, ".agents", "skills");
  const folders = readdirSync(skillRoot).sort();
  assert.deepEqual(folders, ["ft-audit", "ft-debug", "ft-plan", "ft-run"]);

  for (const folder of folders) {
    const source = read(`.agents/skills/${folder}/SKILL.md`);
    const frontmatter = source.match(/^---\n([\s\S]+?)\n---\n/);
    assert.ok(frontmatter, folder);
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1] ?? "";
    assert.ok(description.length > 20 && description.length <= 110, folder);
  }

  assert.match(read(".agents/skills/ft-plan/SKILL.md"), /high risk: read all of `CLAUDE\.md`/);
  assert.match(read(".agents/skills/ft-debug/SKILL.md"), /Add a failing regression test first when practical/);
  assert.match(read(".agents/skills/ft-run/SKILL.md"), /both `ft_reviewer` and `ft_verifier`/);
  assert.match(read(".agents/skills/ft-audit/SKILL.md"), /Keep the report concise, but never omit a material defect/);
});

test("resume hook is silent at startup and tiny after compaction", () => {
  const hooks = JSON.parse(read(".codex/hooks.json"));
  const entry = hooks.hooks.SessionStart[0];
  assert.equal(entry.matcher, "resume|compact");
  assert.ok(entry.hooks[0].additionalContextLimit <= 80);
  assert.doesNotMatch(entry.matcher, /startup|clear/);

  const run = spawnSync(
    process.execPath,
    [path.join(root, ".codex", "hooks", "resume.mjs")],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(run.status, 0, run.stderr);
  const output = JSON.parse(run.stdout);
  const context = output.hookSpecificOutput.additionalContext;
  assert.ok(context.length <= 40);
});

test("doctor blocks unsafe starts and enforces focused context without mutating Git", () => {
  const doctor = read("scripts/codex/doctor.ps1");
  assert.match(doctor, /\$branch -eq "main"/);
  assert.match(doctor, /exit 2/);
  assert.match(doctor, /Working tree is not clean/);
  assert.match(doctor, /cat-file/);
  assert.match(doctor, /merge-base/);
  assert.match(doctor, /gh pr list/);
  assert.match(doctor, /6000-byte focused-context ceiling/);
  assert.doesNotMatch(
    doctor,
    /git\s+(?:push|commit|checkout|switch|merge|reset|clean|fetch|pull)\b/i,
  );
  assert.doesNotMatch(doctor, /gh\s+pr\s+(?:create|merge|close)\b/i);
});
