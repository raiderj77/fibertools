import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT_ROOT = fileURLToPath(new URL("../", import.meta.url));
const SOURCE_DIRECTORIES = ["src", "scripts"];
const SOURCE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx"]);
const RUNTIME_MANAGED_NAMES = new Set(["NODE_ENV", "PATH"]);

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(target);
      return entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name)) ? [target] : [];
    })
  );
  return nested.flat();
}

export function extractEnvironmentNames(source) {
  const names = new Set();
  const directPatterns = [
    /process\.env\.([A-Z][A-Z0-9_]*)/g,
    /process\.env\[\s*["']([A-Z][A-Z0-9_]*)["']\s*\]/g,
  ];

  for (const pattern of directPatterns) {
    for (const match of source.matchAll(pattern)) names.add(match[1]);
  }

  // Fail-closed offer gates commonly keep names in a typed array and read
  // process.env[name]. Include those arrays so dynamic access is not missed.
  const requirementArrays =
    /(?:const|export\s+const)\s+[A-Z][A-Z0-9_]*(?:REQUIREMENTS|ENV_NAMES)\s*(?::[^=]+)?=\s*\[([\s\S]*?)\]\s*(?:as\s+const)?/g;
  for (const block of source.matchAll(requirementArrays)) {
    for (const match of block[1].matchAll(/["']([A-Z][A-Z0-9_]*)["']/g)) {
      names.add(match[1]);
    }
  }

  return names;
}

export async function collectActiveEnvironmentNames(root = PROJECT_ROOT) {
  const files = (
    await Promise.all(SOURCE_DIRECTORIES.map((directory) => sourceFiles(path.join(root, directory))))
  ).flat();
  const names = new Set();

  for (const file of files) {
    const source = await readFile(file, "utf8");
    for (const name of extractEnvironmentNames(source)) {
      if (!RUNTIME_MANAGED_NAMES.has(name)) names.add(name);
    }
  }

  return [...names].sort();
}

export function parseEnvironmentExample(source) {
  const values = new Map();
  for (const line of source.split(/\r?\n/)) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (match) values.set(match[1], match[2]);
  }
  return values;
}

export function documentedEnvironmentNames(source) {
  return new Set([...source.matchAll(/`([A-Z][A-Z0-9_]*)`/g)].map((match) => match[1]));
}
