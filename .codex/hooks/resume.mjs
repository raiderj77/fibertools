import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

let root = process.cwd();
try {
  root = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {}

const active = existsSync(path.join(root, ".codex", "TASK.md"));
const output = {
  continue: true,
  suppressOutput: true,
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: active ? "Resume from .codex/TASK.md." : "",
  },
};

process.stdout.write(JSON.stringify(output));
