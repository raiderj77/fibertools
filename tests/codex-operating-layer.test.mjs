import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

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
  "scripts/codex/doctor.ps1",
];

test("focused standalone Codex files exist and obsolete layers are absent", () => {
  for (const file of operatingFiles) {
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

test("Codex operating layer has no legacy assistant-file dependency", () => {
  for (const file of operatingFiles) {
    assert.equal(read(file).includes(legacyName), false, file);
  }
});

test("root instructions stay quality-first, concise, and route detail", () => {
  const agents = read("AGENTS.md");
  assert.ok(Buffer.byteLength(agents, "utf8") <= 8000);
  for (const pattern of [
    /Correctness, safety, accessibility, and evidence outrank/,
    /Stack: Next\.js App Router/,
    /docs\/codex\/PRODUCT_PUBLICATION\.md/,
    /docs\/codex\/PRIVACY_SECURITY_ACCESSIBILITY\.md/,
    /docs\/codex\/COMMERCIAL_RELEASE\.md/,
    /Close it after handoff before starting reviewer and verifier/,
    /Close every subagent after its result is captured/,
    /publication freeze remains active through November 20, 2026/,
    /docs\/stitchproof-distribution-kit\.md/,
    /Keep branch protection and required checks enabled/,
    /Do not modify other assistant instruction or settings files/,
    /Never push directly to `main`/,
    /## Code Review Rules/,
    /## Done/,
  ]) {
    assert.match(agents, pattern);
  }
  for (const taskSpecific of [
    /\$17 Planning Pack/,
    /\$39 Designer Pattern Preflight/,
    /X-Frame-Options/,
    /Featured order is/,
    /ytearnings-20/,
  ]) {
    assert.doesNotMatch(agents, taskSpecific);
  }
  assert.doesNotMatch(agents, /\b(?:sk|rk|whsec|sbp)_[A-Za-z0-9_-]{12,}\b/);
});

test("focused policies preserve detailed product and safety rules", () => {
  for (const file of policies) {
    assert.ok(Buffer.byteLength(read(file), "utf8") <= 7000, file);
  }

  const product = read(policies[0]);
  assert.match(product, /Featured order is Blanket, Yarn, Circle, Amigurumi Shapes, and Cast-on/);
  assert.match(product, /Craft Yarn Council labels Lace \(0\) through Jumbo \(7\)/);
  assert.match(product, /publication freeze remains in force through November 20, 2026/);
  assert.match(product, /\/blog\/\*` remains redirected/);
  assert.match(product, /30\+ years of fiber-arts expertise/);
  assert.match(product, /mandatory sister-site links/);
  assert.match(product, /Visible copy, metadata, JSON-LD, feeds, sitemaps/);
  assert.match(product, /npm run test:publication-freeze/);

  const privacy = read(policies[1]);
  assert.match(privacy, /Global Privacy Control/);
  assert.match(privacy, /Every active application or offer environment reference/);
  assert.match(privacy, /X-Frame-Options: SAMEORIGIN/);
  assert.match(privacy, /server-only execution and secrets/);
  assert.match(privacy, /Do not rely on color alone/);
  assert.match(privacy, /npm run test:security/);

  const commercial = read(policies[2]);
  assert.match(commercial, /NEXT_PUBLIC_ADSENSE_ENABLED=true/);
  assert.match(commercial, /\$17 Planning Pack/);
  assert.match(commercial, /\$39 Designer Pattern Preflight/);
  assert.match(commercial, /fail closed to inquiry rather than checkout/);
  assert.match(commercial, /StitchProof is \$9 once per pattern project/);
  assert.match(commercial, /docs\/stitchproof-purchase-release\.md/);
  assert.match(commercial, /docs\/stitchproof-distribution-kit\.md/);
  assert.match(commercial, /tests\/environment-docs\.test\.mjs/);
  assert.match(commercial, /npm run test:stitchproof-purchase/);
});

test("every documented npm script exists in package.json", () => {
  const scripts = JSON.parse(read("package.json")).scripts ?? {};
  for (const file of ["AGENTS.md", "docs/CODEX.md", ...policies]) {
    for (const match of read(file).matchAll(/\bnpm run ([A-Za-z0-9:_-]+)/g)) {
      assert.ok(Object.hasOwn(scripts, match[1]), `${file}: ${match[1]}`);
    }
  }
});

test("project config permits two independent checks without provider settings", () => {
  const config = read(".codex/config.toml");
  assert.match(config, /^multi_agent\s*=\s*true$/m);
  assert.match(config, /^hooks\s*=\s*true$/m);
  assert.match(config, /^max_concurrent_threads_per_session\s*=\s*2$/m);
  assert.doesNotMatch(config, /model|provider|api_key|base_url|profile|telemetry/i);
});

test("reviewer and verifier are independent, high-effort, and policy-aware", () => {
  const files = readdirSync(path.join(root, ".codex", "agents"))
    .filter((name) => name.endsWith(".toml"))
    .sort();
  assert.deepEqual(files, ["ft-reviewer.toml", "ft-verifier.toml"]);

  const reviewer = read(".codex/agents/ft-reviewer.toml");
  assert.match(reviewer, /^name\s*=\s*"ft_reviewer"$/m);
  assert.match(reviewer, /^model_reasoning_effort\s*=\s*"high"$/m);
  assert.match(reviewer, /^sandbox_mode\s*=\s*"read-only"$/m);
  assert.match(reviewer, /each matching docs\/codex policy/);
  assert.match(reviewer, /Do not edit files/);

  const verifier = read(".codex/agents/ft-verifier.toml");
  assert.match(verifier, /^name\s*=\s*"ft_verifier"$/m);
  assert.match(verifier, /^model_reasoning_effort\s*=\s*"high"$/m);
  assert.match(verifier, /^sandbox_mode\s*=\s*"workspace-write"$/m);
  assert.match(verifier, /Do not edit tracked files/);
  assert.match(verifier, /Record git status before and after verification/);
});

test("four narrow skills route policy, debugging, execution, and audit", () => {
  const skillRoot = path.join(root, ".agents", "skills");
  const folders = readdirSync(skillRoot).sort();
  assert.deepEqual(folders, ["ft-audit", "ft-debug", "ft-plan", "ft-run"]);

  for (const folder of folders) {
    const source = read(`.agents/skills/${folder}/SKILL.md`);
    const frontmatter = source.match(/^---\n([\s\S]+?)\n---\n/);
    assert.ok(frontmatter, folder);
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1] ?? "";
    assert.ok(description.length > 25 && description.length <= 120, folder);
    assert.ok(Buffer.byteLength(source, "utf8") <= 2300, folder);
    assert.match(source, /root `AGENTS\.md`/);
  }

  assert.match(read(".agents/skills/ft-plan/SKILL.md"), /## Policies/);
  assert.match(read(".agents/skills/ft-plan/SKILL.md"), /Close it after its handoff/);
  assert.match(read(".agents/skills/ft-debug/SKILL.md"), /Add a failing regression test first when practical/);
  assert.match(read(".agents/skills/ft-run/SKILL.md"), /both `ft_reviewer` and `ft_verifier`/);
  assert.match(read(".agents/skills/ft-audit/SKILL.md"), /Never omit a material defect/);
});

test("required workflow enforces structure and PowerShell validation", () => {
  const workflow = read(".github/workflows/empire-check.yml");
  const publication = workflow.indexOf("npm run test:publication-freeze");
  const codex = workflow.indexOf("node --test tests/codex-operating-layer.test.mjs");
  assert.ok(publication >= 0);
  assert.ok(codex > publication);
  assert.match(workflow, /Validate Codex PowerShell syntax/);
  assert.match(workflow, /System\.Management\.Automation\.Language\.Parser/);
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
  assert.ok(output.hookSpecificOutput.additionalContext.length <= 40);
});

test("doctor blocks unsafe starts and enforces focused context without mutation", () => {
  const source = read("scripts/codex/doctor.ps1");
  assert.match(source, /\$branch -eq "main"/);
  assert.match(source, /Working tree is not clean/);
  assert.match(source, /merge-base/);
  assert.match(source, /git@github\.com:raiderj77\/fibertools/);
  assert.match(source, /gh api repos\/raiderj77\/fibertools\/branches\/main/);
  assert.match(source, /8000-byte root-context ceiling/);
  assert.match(source, /7000-byte focused-policy ceiling/);
  assert.match(source, /legacy assistant instruction file/);
  assert.match(source, /Doctor checks changed tracked worktree state/);
  assert.match(source, /git diff --check/);
  assert.match(source, /git diff --cached --check/);
  assert.doesNotMatch(
    source,
    /git\s+(?:push|commit|checkout|switch|merge|reset|clean|fetch|pull)\b/i,
  );
  assert.doesNotMatch(source, /gh\s+pr\s+(?:create|merge|close)\b/i);
});
