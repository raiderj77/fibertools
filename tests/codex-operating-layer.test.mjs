import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testFile = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(testFile), "..");

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function filesIn(relativePath, suffix) {
  const directory = path.join(root, relativePath);
  return readdirSync(directory)
    .map((name) => path.join(directory, name))
    .filter((entry) => statSync(entry).isFile() && entry.endsWith(suffix));
}

const requiredFiles = [
  "AGENTS.md",
  ".codex/config.toml",
  ".codex/hooks.json",
  ".codex/hooks/session-start.mjs",
  ".codex/agents/ft-explorer.toml",
  ".codex/agents/ft-implementer.toml",
  ".codex/agents/ft-reviewer.toml",
  ".codex/agents/ft-verifier.toml",
  ".agents/skills/ft-shape-spec/SKILL.md",
  ".agents/skills/ft-execute-spec/SKILL.md",
  ".agents/skills/ft-progress-report/SKILL.md",
  ".agents/skills/ft-bug-fix-plan/SKILL.md",
  ".agents/skills/ft-next-actions/SKILL.md",
  ".agents/skills/ft-truth-review/SKILL.md",
  "agent-os/product/mission.md",
  "agent-os/product/roadmap.md",
  "agent-os/product/tech-stack.md",
  "agent-os/standards/index.yml",
  "agent-os/standards/global/truth-and-claims.md",
  "agent-os/standards/global/testing-and-release.md",
  "agent-os/standards/frontend/accessibility.md",
  "agent-os/standards/security/privacy-and-secrets.md",
  "agent-os/templates/spec/spec.md",
  "agent-os/templates/spec/tasks.md",
  "agent-os/templates/spec/verification.md",
  "agent-os/templates/spec/status.md",
  "agent-os/specs/README.md",
  "agent-os/specs/2026-09-03-0717-codex-agent-os/spec.md",
  "agent-os/specs/2026-09-03-0717-codex-agent-os/tasks.md",
  "agent-os/specs/2026-09-03-0717-codex-agent-os/verification.md",
  "agent-os/specs/2026-09-03-0717-codex-agent-os/status.md",
  "docs/CODEX_AGENT_OS.md",
  "docs/CODEX_OMNIROUTE_OPTIONAL.md",
  "scripts/codex/doctor.ps1",
  "tests/codex-operating-layer.test.mjs",
];

test("all Codex Agent OS files exist", () => {
  for (const relativePath of requiredFiles) {
    assert.equal(existsSync(path.join(root, relativePath)), true, relativePath);
  }
});

test("AGENTS.md is a complete FiberTools Codex contract", () => {
  const agents = read("AGENTS.md");

  for (const pattern of [
    /Read `CLAUDE\.md` before analysis, planning, or editing/,
    /follow `CLAUDE\.md`/,
    /docs\/stitchproof-distribution-kit\.md/,
    /Never push directly to `main`/,
    /no more than four concurrent subagents/,
    /Never assign two writing agents to the same file/,
    /Do not invent test results/,
    /Do not inspect or expose `\.env\*` values/,
    /publication freeze/,
    /standard-page and embed security-header split/,
    /Report each stage separately/,
    /## Code Review Rules/,
    /## 12\. Definition of done/,
    /P0, block immediately/,
    /P1, block merge/,
  ]) {
    assert.match(agents, pattern);
  }

  assert.doesNotMatch(agents, /\b(?:sk|rk|whsec|sbp)_[A-Za-z0-9_-]{12,}\b/);
});

test("project config enables bounded features without machine-local provider settings", () => {
  const config = read(".codex/config.toml");

  assert.match(config, /^\[features\]$/m);
  assert.match(config, /^multi_agent\s*=\s*true$/m);
  assert.match(config, /^hooks\s*=\s*true$/m);
  assert.match(config, /^goals\s*=\s*true$/m);
  assert.match(config, /^\[agents\]$/m);
  assert.match(config, /^max_concurrent_threads_per_session\s*=\s*4$/m);

  assert.doesNotMatch(
    config,
    /^\s*(model|model_provider|base_url|api_key|env_key|profile|notify|telemetry)\s*=/m,
  );
  assert.doesNotMatch(
    config,
    /^\s*\[(model_providers|profiles|notifications|otel|telemetry)(?:\.|\])/m,
  );
  assert.doesNotMatch(config, /\b(?:sk|rk|whsec|sbp)_[A-Za-z0-9_-]{12,}\b/);
});

test("custom agents have distinct roles and required fields", () => {
  const agentFiles = filesIn(".codex/agents", ".toml");
  assert.equal(agentFiles.length, 4);

  const names = new Set();

  for (const agentFile of agentFiles) {
    const source = readFileSync(agentFile, "utf8");
    const name = source.match(/^name\s*=\s*"([^"]+)"$/m)?.[1];

    assert.ok(name, `${agentFile}: missing name`);
    assert.match(source, /^description\s*=\s*"[^"]+"$/m);
    assert.match(source, /^sandbox_mode\s*=\s*"(?:read-only|workspace-write)"$/m);
    assert.match(source, /^developer_instructions\s*=\s*"""/m);
    assert.match(source, /Read AGENTS\.md/);
    assert.equal(names.has(name), false, `duplicate agent name: ${name}`);
    names.add(name);
  }

  assert.deepEqual(
    [...names].sort(),
    ["ft_explorer", "ft_implementer", "ft_reviewer", "ft_verifier"],
  );
});

test("skills use valid frontmatter and unique names", () => {
  const skillsRoot = path.join(root, ".agents", "skills");
  const skillFiles = readdirSync(skillsRoot)
    .map((folder) => path.join(skillsRoot, folder, "SKILL.md"))
    .filter((entry) => existsSync(entry));

  assert.equal(skillFiles.length, 6);

  const names = new Set();

  for (const skillFile of skillFiles) {
    const source = readFileSync(skillFile, "utf8");
    const frontmatter = source.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/);

    assert.ok(frontmatter, `${skillFile}: missing frontmatter`);

    const name = frontmatter[1].match(/^name:\s*(\S+)\s*$/m)?.[1];
    const description = frontmatter[1].match(/^description:\s*(.+)\s*$/m)?.[1];

    assert.ok(name, `${skillFile}: missing name`);
    assert.ok(description && description.length >= 40, `${skillFile}: weak description`);
    assert.equal(names.has(name), false, `duplicate skill name: ${name}`);
    names.add(name);
  }

  assert.deepEqual(
    [...names].sort(),
    [
      "ft-bug-fix-plan",
      "ft-execute-spec",
      "ft-next-actions",
      "ft-progress-report",
      "ft-shape-spec",
      "ft-truth-review",
    ],
  );
});

test("session hook is valid JSON and emits bounded safe context", () => {
  const hooks = JSON.parse(read(".codex/hooks.json"));
  const sessionStart = hooks?.hooks?.SessionStart;

  assert.ok(Array.isArray(sessionStart) && sessionStart.length === 1);
  assert.equal(sessionStart[0].matcher, "startup|resume|clear|compact");
  assert.equal(sessionStart[0].hooks[0].type, "command");
  assert.match(sessionStart[0].hooks[0].command, /session-start\.mjs/);
  assert.match(sessionStart[0].hooks[0].commandWindows, /session-start\.mjs/);
  assert.ok(sessionStart[0].hooks[0].additionalContextLimit <= 900);

  const execution = spawnSync(
    process.execPath,
    [path.join(root, ".codex", "hooks", "session-start.mjs")],
    { cwd: root, encoding: "utf8" },
  );

  assert.equal(execution.status, 0, execution.stderr);
  const payload = JSON.parse(execution.stdout);
  const context = payload?.hookSpecificOutput?.additionalContext ?? "";

  assert.equal(payload.continue, true);
  assert.match(context, /Read AGENTS\.md, then CLAUDE\.md/);
  assert.match(context, /Active spec:/);
  assert.match(context, /protected StitchProof/);
  assert.doesNotMatch(context, /BEGIN [A-Z ]*PRIVATE KEY/);
  assert.ok(context.length < 1_500);
});

test("Agent OS index points to existing standards and product context", () => {
  const index = read("agent-os/standards/index.yml");
  const matches = [...index.matchAll(/^\s*path:\s*(\S+)\s*$/gm)].map(
    (match) => match[1],
  );

  assert.equal(matches.length, 4);

  for (const relativePath of matches) {
    assert.equal(existsSync(path.join(root, relativePath)), true, relativePath);
    assert.match(read(relativePath), /CLAUDE\.md|Preserve|Keep|Never|Do not/);
  }

  for (const productFile of [
    "agent-os/product/mission.md",
    "agent-os/product/roadmap.md",
    "agent-os/product/tech-stack.md",
  ]) {
    assert.match(read(productFile), /CLAUDE\.md/);
  }
});

test("spec templates preserve planning and release evidence", () => {
  assert.match(read("agent-os/templates/spec/spec.md"), /## Acceptance criteria/);
  assert.match(read("agent-os/templates/spec/spec.md"), /## Release boundaries/);
  assert.match(read("agent-os/templates/spec/tasks.md"), /explicit files/i);
  assert.match(
    read("agent-os/templates/spec/verification.md"),
    /Acceptance-criteria matrix/,
  );
  assert.match(read("agent-os/templates/spec/status.md"), /Production verification/);
  assert.match(
    read("agent-os/specs/README.md"),
    /completed implementation spec does not imply merge or deployment/i,
  );
});

test("optional routing guide is isolated and credential safe", () => {
  const guide = read("docs/CODEX_OMNIROUTE_OPTIONAL.md");

  assert.match(guide, /optional third-party infrastructure/i);
  assert.match(guide, /diegosouzapw\/OmniRoute/);
  assert.match(guide, /version `3\.8\.51`/);
  assert.match(guide, /setup-codex --dry-run/);
  assert.match(guide, /run codex --dry-run --json/);
  assert.match(guide, /OMNIROUTE_API_KEY/);
  assert.match(guide, /Never commit them/);
  assert.match(guide, /strongest trusted OpenAI model/i);
  assert.doesNotMatch(guide, /\b(?:sk|rk|whsec|sbp)_[A-Za-z0-9_-]{12,}\b/);
});

test("doctor is read-only and blocks direct work on main", () => {
  const doctor = read("scripts/codex/doctor.ps1");

  assert.match(doctor, /\$branch -eq "main"/);
  assert.match(doctor, /exit 2/);
  assert.match(doctor, /ls-remote/);
  assert.match(doctor, /status --porcelain/);
  assert.match(doctor, /gh pr list/);
  assert.match(doctor, /node --test tests\/codex-operating-layer\.test\.mjs/);
  assert.doesNotMatch(
    doctor,
    /git\s+(?:push|commit|checkout|switch|merge|reset|clean)\b/i,
  );
  assert.doesNotMatch(doctor, /gh\s+pr\s+(?:create|merge|close)\b/i);
});
