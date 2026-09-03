import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

function repositoryRoot() {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return process.cwd();
  }
}

function currentSpec(root) {
  const specsRoot = path.join(root, "agent-os", "specs");
  if (!existsSync(specsRoot)) {
    return "none";
  }

  const folders = readdirSync(specsRoot)
    .map((name) => path.join(specsRoot, name))
    .filter((entry) => statSync(entry).isDirectory())
    .sort()
    .reverse();

  for (const folder of folders) {
    const statusPath = path.join(folder, "status.md");
    if (!existsSync(statusPath)) {
      continue;
    }

    const statusText = readFileSync(statusPath, "utf8");
    const match = statusText.match(/^Status:\s*(.+)$/im);
    const status = match?.[1]?.trim() ?? "unknown";

    if (!/^(complete|completed|archived)$/i.test(status)) {
      return `${path.relative(root, folder)} (${status})`;
    }
  }

  return "none";
}

const root = repositoryRoot();
const activeSpec = currentSpec(root);
const context = [
  "FiberTools Codex session context:",
  "- Read AGENTS.md, then CLAUDE.md. CLAUDE.md is the repository authority.",
  "- Verify repository identity, current origin/main, branch, and worktree before edits.",
  "- Keep all protected StitchProof distribution and experiment records outside scope unless the owner authorizes the exact work.",
  `- Use a saved spec for substantial work. Active spec: ${activeSpec}.`,
  "- Separate verified, inferred, and unknown states. Never claim tests, approval, merge, deployment, provider readiness, revenue, or customer outcomes without evidence.",
].join("\n");

process.stdout.write(
  JSON.stringify({
    continue: true,
    suppressOutput: true,
    hookSpecificOutput: {
      hookEventName: "SessionStart",
      additionalContext: context,
    },
  }),
);
