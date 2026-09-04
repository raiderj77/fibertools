import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SUPPORTED_CODEX_VERSIONS = new Set(["0.144.1", "0.153.0"]);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function fail(message) {
  console.error(`Codex config validation failed: ${message}`);
  process.exit(1);
}

const expectedIndex = process.argv.indexOf("--expected-version");
const expectedVersion = expectedIndex >= 0 ? process.argv[expectedIndex + 1] : "";
if (!SUPPORTED_CODEX_VERSIONS.has(expectedVersion)) {
  fail(`--expected-version must be one of: ${[...SUPPORTED_CODEX_VERSIONS].join(", ")}`);
}

const codex = resolveCodexCommand();
const version = spawnSync(codex.command, [...codex.prefixArgs, "--version"], { cwd: root, encoding: "utf8" });
if (version.status !== 0) fail(version.stderr.trim() || `could not run ${codex.command}`);
const actualVersion = version.stdout.trim().match(/^codex-cli\s+(\d+\.\d+\.\d+)$/)?.[1] || "";
if (actualVersion !== expectedVersion) {
  fail(`expected Codex CLI ${expectedVersion}, received ${version.stdout.trim()}`);
}

const gitCommonDir = spawnSync("git", ["rev-parse", "--path-format=absolute", "--git-common-dir"], {
  cwd: root,
  encoding: "utf8",
});
if (gitCommonDir.status !== 0) fail(gitCommonDir.stderr.trim() || "could not resolve the Git common directory");

const canonicalRoot = path.resolve(path.dirname(gitCommonDir.stdout.trim()));
const trustRoot = process.platform === "win32" ? canonicalRoot.toLowerCase() : canonicalRoot;
if (trustRoot.includes("'")) fail("repository path contains an unsupported single quote");

const validationHome = mkdtempSync(path.join(tmpdir(), "fibertools-codex-config-"));
writeFileSync(
  path.join(validationHome, "config.toml"),
  `[projects.'${trustRoot}']\ntrust_level = "trusted"\n`,
  "utf8",
);

const child = spawn(
  codex.command,
  [...codex.prefixArgs, "app-server", "--strict-config", "--listen", "ws://127.0.0.1:0"],
  {
    cwd: root,
    env: { ...process.env, CODEX_HOME: validationHome },
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  },
);

let output = "";
let outcome = null;
let forceKillTimeout = null;
const timeout = setTimeout(
  () => requestStop(false, "app server did not reach its listening state within 15 seconds"),
  15_000,
);

child.stdout.on("data", inspect);
child.stderr.on("data", inspect);
child.on("error", (error) => requestStop(false, error.message));
child.on("close", (code) => {
  clearTimeout(timeout);
  clearTimeout(forceKillTimeout);
  if (!outcome) {
    outcome = {
      ok: false,
      reason: output.trim() || `app server exited before validation completed (exit ${code})`,
    };
  }
  rmSync(validationHome, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  if (!outcome.ok) {
    console.error(
      `Codex config validation failed: ${outcome.reason || output.trim() || "strict parser did not confirm the project configuration"}`,
    );
    process.exitCode = 1;
    return;
  }
  console.log(`Codex project config passed strict validation with CLI ${expectedVersion}.`);
});

function inspect(chunk) {
  output += chunk.toString();
  if (/project-local config[\s\S]*disabled/i.test(output)) {
    requestStop(false, "project-local configuration was not trusted and therefore was not loaded");
  } else if (/config could not be loaded|unrecognized (?:field|key)|unknown (?:field|key)/i.test(output)) {
    requestStop(false, output.trim());
  } else if (/listening on:\s*ws:\/\/127\.0\.0\.1:/i.test(output)) {
    requestStop(true);
  }
}

function requestStop(ok, reason = "") {
  if (outcome) return;
  outcome = { ok, reason };
  clearTimeout(timeout);
  signalChild("SIGTERM");
  forceKillTimeout = setTimeout(() => signalChild("SIGKILL"), 3_000);
}

function resolveCodexCommand() {
  for (const directory of (process.env.PATH || "").split(path.delimiter)) {
    if (!directory) continue;
    const packageScript = path.resolve(directory, "..", "@openai", "codex", "bin", "codex.js");
    if (existsSync(packageScript)) return { command: process.execPath, prefixArgs: [packageScript] };
  }

  return { command: process.platform === "win32" ? "codex.exe" : "codex", prefixArgs: [] };
}

function signalChild(signal) {
  if (child.exitCode !== null) return;
  try {
    if (process.platform === "win32") child.kill(signal);
    else process.kill(-child.pid, signal);
  } catch (error) {
    if (error?.code !== "ESRCH") throw error;
  }
}
