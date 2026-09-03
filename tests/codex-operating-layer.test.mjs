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
  ".codex/config.toml",
  ".codex/hooks.json",
  ".codex/hooks/resume.mjs",
  ".codex/agents/ft-reviewer.toml",
  ".agents/skills/ft-plan/SKILL.md",
  ".agents/skills/ft-run/SKILL.md",
  ".agents/skills/ft-audit/SKILL.md",
  "docs/CODEX.md",
  "scripts/codex/doctor.ps1",
];

test("lean operating files exist and redundant layer is absent", () => {
  for (const file of required) assert.equal(existsSync(path.join(root, file)), true, file);
  for (const file of [
    "agent-os",
    "docs/CODEX_AGENT_OS.md",
    "docs/CODEX_OMNIROUTE_OPTIONAL.md",
    ".codex/agents/ft-explorer.toml",
    ".codex/agents/ft-implementer.toml",
    ".codex/agents/ft-verifier.toml",
  ]) assert.equal(existsSync(path.join(root, file)), false, file);
  assert.match(read(".gitignore"), /^\/\.codex\/TASK\.md$/m);
});

test("AGENTS.md stays small and routes detail on demand", () => {
  const agents = read("AGENTS.md");
  assert.ok(Buffer.byteLength(agents, "utf8") <= 3200);
  assert.match(agents, /Use one main agent\./);
  assert.match(agents, /read only the relevant section/);
  assert.match(agents, /Never push to `main`/);
  assert.match(agents, /docs\/stitchproof-distribution-kit\.md/);
  assert.match(agents, /Report local change/);
  assert.doesNotMatch(agents, /Read `CLAUDE\.md` before analysis, planning, or editing/);
  assert.doesNotMatch(agents, /\b(?:sk|rk|whsec|sbp)_[A-Za-z0-9_-]{12,}\b/);
});

test("project config permits only one subagent and no provider settings", () => {
  const config = read(".codex/config.toml");
  assert.match(config, /^multi_agent\s*=\s*true$/m);
  assert.match(config, /^hooks\s*=\s*true$/m);
  assert.match(config, /^max_concurrent_threads_per_session\s*=\s*1$/m);
  assert.doesNotMatch(config, /model|provider|api_key|base_url|profile|telemetry/i);
});

test("only one custom read-only reviewer exists", () => {
  const files = readdirSync(path.join(root, ".codex", "agents")).filter((name) =>
    name.endsWith(".toml"),
  );
  assert.deepEqual(files, ["ft-reviewer.toml"]);
  const reviewer = read(".codex/agents/ft-reviewer.toml");
  assert.match(reviewer, /^name\s*=\s*"ft_reviewer"$/m);
  assert.match(reviewer, /^sandbox_mode\s*=\s*"read-only"$/m);
  assert.match(reviewer, /Do not edit files/);
});

test("only three short-discovery skills exist", () => {
  const skillRoot = path.join(root, ".agents", "skills");
  const folders = readdirSync(skillRoot).sort();
  assert.deepEqual(folders, ["ft-audit", "ft-plan", "ft-run"]);

  for (const folder of folders) {
    const source = read(`.agents/skills/${folder}/SKILL.md`);
    const frontmatter = source.match(/^---\n([\s\S]+?)\n---\n/);
    assert.ok(frontmatter, folder);
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1] ?? "";
    assert.ok(description.length > 20 && description.length <= 100, folder);
  }
});

test("resume hook is silent at startup and tiny after compaction", () => {
  const hooks = JSON.parse(read(".codex/hooks.json"));
  const entry = hooks.hooks.SessionStart[0];
  assert.equal(entry.matcher, "resume|compact");
  assert.ok(entry.hooks[0].additionalContextLimit <= 80);
  assert.doesNotMatch(entry.matcher, /startup|clear/);

  const run = spawnSync(process.execPath, [path.join(root, ".codex", "hooks", "resume.mjs")], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(run.status, 0, run.stderr);
  const output = JSON.parse(run.stdout);
  const context = output.hookSpecificOutput.additionalContext;
  assert.ok(context.length <= 40);
});

test("doctor is read-only, blocks main, and enforces the byte limit", () => {
  const doctor = read("scripts/codex/doctor.ps1");
  assert.match(doctor, /\$branch -eq "main"/);
  assert.match(doctor, /exit 2/);
  assert.match(doctor, /ls-remote/);
  assert.match(doctor, /3200-byte lean limit/);
  assert.doesNotMatch(doctor, /git\s+(?:push|commit|checkout|switch|merge|reset|clean)\b/i);
  assert.doesNotMatch(doctor, /gh\s+pr\s+(?:create|merge|close)\b/i);
});
