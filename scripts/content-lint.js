/**
 * content-lint.js — Content compliance linter for fibertools.app
 * Scans content/**\/*.{md,mdx} and src/**\/*.{tsx,ts} for:
 *   - Personal name exposure (site owner)
 *   - UK crochet terminology misuse (fibertools-specific)
 *   - Incorrect yarn weight naming outside CYC standard
 * Exit code 1 on failure, 0 on pass.
 */

import { readFileSync, readdirSync, existsSync, statSync } from "fs";
import { resolve, dirname, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let failures = 0;

function fail(file, line, msg) {
  const rel = relative(ROOT, file);
  console.error(`  ❌ ${rel}:${line} — ${msg}`);
  failures++;
}

function getFiles(dir, extensions) {
  const results = [];
  if (!existsSync(dir)) return results;
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Rules
// ---------------------------------------------------------------------------

// Pages where "Jason Ramirez" is intentionally present for E-E-A-T / AdSense compliance.
const PERSONAL_NAME_EXEMPT = [
  "src/app/about/page.tsx",
  "src/app/about/jason-ramirez/page.tsx",
];

/**
 * Check for personal name exposure.
 * The site owner's name must never appear in public content or code,
 * except on pages listed in PERSONAL_NAME_EXEMPT.
 */
function checkPersonalName(file, lines) {
  const rel = relative(ROOT, file).replace(/\\/g, "/");
  if (PERSONAL_NAME_EXEMPT.some((exempt) => rel.endsWith(exempt))) return;

  const namePattern = /\bJason\s+Ramirez\b/i;
  for (let i = 0; i < lines.length; i++) {
    if (namePattern.test(lines[i])) {
      fail(file, i + 1, "Personal name detected — never expose site owner's name");
    }
  }
}

/**
 * Check for UK crochet terminology in content files.
 * FiberTools uses US terminology exclusively.
 */
function checkUKTerminology(file, lines) {
  if (!file.endsWith(".md") && !file.endsWith(".mdx")) return;

  // Skip files that explicitly discuss UK/US conversion
  const content = lines.join("\n").toLowerCase();
  if (
    content.includes("uk to us") ||
    content.includes("us to uk") ||
    content.includes("uk vs us") ||
    content.includes("uk-us") ||
    content.includes("us-uk") ||
    content.includes("british crochet") ||
    content.includes("uk crochet terms")
  ) {
    return;
  }

  const ukPatterns = [
    {
      pattern: /\bUK\s+double\s+crochet\b/i,
      msg: 'UK term "double crochet" used — use US "single crochet" (sc)',
    },
    {
      pattern: /\bUK\s+treble\b/i,
      msg: 'UK term "treble" used — use US "double crochet" (dc)',
    },
    {
      pattern: /\bhalf\s+treble\b/i,
      msg: 'UK term "half treble" used — use US "half double crochet" (hdc)',
    },
    {
      pattern: /\bdouble\s+treble\b/i,
      msg: 'UK term "double treble" used — use US "treble crochet" (tr)',
    },
    {
      pattern: /\btriple\s+treble\b/i,
      msg: 'UK term "triple treble" used — use US "double treble crochet" (dtr)',
    },
    {
      pattern: /\btension\s+square\b/i,
      msg: 'UK term "tension square" used — use US "gauge swatch"',
    },
    {
      pattern: /\bmiss\s+a?\s*stitch\b/i,
      msg: 'UK term "miss a stitch" used — use US "skip a stitch"',
    },
  ];

  // Contextual words that indicate comparison/education, not instructional use
  const contextWords = /\b(not|means|equivalent|same\s+as|which\s+is|confuse|mixing\s+up|versus|vs|difference|convert)/i;

  for (let i = 0; i < lines.length; i++) {
    for (const { pattern, msg } of ukPatterns) {
      if (pattern.test(lines[i]) && !contextWords.test(lines[i])) {
        fail(file, i + 1, msg);
      }
    }
  }
}

/**
 * Check yarn weight references follow CYC standard naming.
 */
function checkYarnWeights(file, lines) {
  if (!file.endsWith(".md") && !file.endsWith(".mdx")) return;

  const wrongWeights = [
    { pattern: /\bLace\s*\(\s*[^0)]\s*\)/i, msg: "Lace weight should be CYC 0" },
    { pattern: /\bFingering\s*\(\s*[^1)]\s*\)/i, msg: "Fingering weight should be CYC 1" },
    { pattern: /\bSport\s*\(\s*[^2)]\s*\)/i, msg: "Sport weight should be CYC 2" },
    { pattern: /\bDK\s*\(\s*[^3)]\s*\)/i, msg: "DK weight should be CYC 3" },
    { pattern: /\bWorsted\s*\(\s*[^4)]\s*\)/i, msg: "Worsted weight should be CYC 4" },
    { pattern: /(?<!Super\s)(?<!Super )Bulky\s*\(\s*[^5)]\s*\)/i, msg: "Bulky weight should be CYC 5" },
    { pattern: /\bSuper\s+Bulky\s*\(\s*[^6)]\s*\)/i, msg: "Super Bulky weight should be CYC 6" },
    { pattern: /\bJumbo\s*\(\s*[^7)]\s*\)/i, msg: "Jumbo weight should be CYC 7" },
  ];

  for (let i = 0; i < lines.length; i++) {
    for (const { pattern, msg } of wrongWeights) {
      if (pattern.test(lines[i])) {
        fail(file, i + 1, msg);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

console.log("🧶 FiberTools content lint\n");

const contentFiles = getFiles(resolve(ROOT, "content"), [".md", ".mdx"]);
const srcFiles = getFiles(resolve(ROOT, "src"), [".tsx", ".ts"]);
const allFiles = [...contentFiles, ...srcFiles];

console.log(`  Scanning ${contentFiles.length} content files and ${srcFiles.length} source files...\n`);

for (const file of allFiles) {
  const content = readFileSync(file, "utf-8");
  const lines = content.split("\n");

  checkPersonalName(file, lines);
  checkUKTerminology(file, lines);
  checkYarnWeights(file, lines);
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log("\n" + "=".repeat(50));
if (failures > 0) {
  console.error(`\n💥 ${failures} content issue(s) found — fix before deploying.\n`);
  process.exit(1);
} else {
  console.log("\n🎉 All content checks passed.\n");
  process.exit(0);
}
