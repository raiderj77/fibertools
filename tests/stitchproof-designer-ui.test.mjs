import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const route = readFileSync(
  new URL("../src/app/amigurumi-pattern-checker/designer/page.tsx", import.meta.url),
  "utf8",
);
const workspace = readFileSync(
  new URL("../src/app/amigurumi-pattern-checker/designer/StitchProofDesignerWorkspace.tsx", import.meta.url),
  "utf8",
);
const localStore = readFileSync(
  new URL("../src/app/amigurumi-pattern-checker/designer/local-project-store.ts", import.meta.url),
  "utf8",
);
const freeChecker = readFileSync(
  new URL("../src/app/amigurumi-pattern-checker/AmigurumiPatternCheckerTool.tsx", import.meta.url),
  "utf8",
);
const freePage = readFileSync(
  new URL("../src/app/amigurumi-pattern-checker/page.tsx", import.meta.url),
  "utf8",
);
const globalStyles = readFileSync(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);

test("adds one canonical designer workspace without replacing the free checker", () => {
  assert.match(route, /canonical: "\/amigurumi-pattern-checker\/designer"/);
  assert.match(route, /StitchProofDesignerWorkspace/);
  assert.match(freeChecker, /MAX_FREE_ROUNDS/);
  assert.match(freeChecker, /Check pattern math/);
  assert.match(freeChecker, /\/amigurumi-pattern-checker\/designer#compare/);
  assert.match(freeChecker, /href="\/amigurumi-pattern-checker\/designer"/);
  assert.match(freePage, /Check the math\. Compare the revision\. Keep the report\./);
  assert.match(freePage, /dateModified: "2026-08-26"/);
  assert.match(freePage, /lastUpdated="2026-08-26"/);
});

test("designer workspace exposes metadata, 200-round analysis, corrections, compare, and report views", () => {
  assert.match(workspace, /MAX_DESIGNER_ROUNDS/);
  assert.match(workspace, /"designer" \| "compare" \| "report"/);
  for (const label of [
    "Pattern title",
    "Designer nickname",
    "Pattern version",
    "Date reviewed",
    "Optional section labels",
    "Designer notes",
    "Round number",
    "Starting count",
    "Written total",
    "Parsed repeats",
    "Consumed",
    "Created",
    "Instruction classification",
  ]) {
    assert.match(workspace, new RegExp(label));
  }
  assert.match(workspace, /analyzeDesignerPattern/);
  assert.match(workspace, /comparePatternVersions/);
  assert.match(workspace, /createCorrection/);
  assert.match(workspace, /targetRoundNumber: targetResult\.round/);
  assert.match(workspace, /targetSource: targetResult\.source/);
  assert.match(workspace, /Before this correction:/);
  assert.match(workspace, /After this correction:/);
  assert.doesNotMatch(workspace, /<strong>Original:<\/strong>|Original: \{displayValue\(correction\.original\)\}/);
  assert.match(workspace, /Issue details/);
  assert.match(workspace, /report\.issueRows/);
});

test("report is printable and excerpts remain an explicit opt-in", () => {
  assert.match(workspace, /useState\(false\).*includeExcerpts|const \[includeExcerpts, setIncludeExcerpts\] = useState\(false\)/s);
  assert.match(workspace, /Include instruction excerpts in the report and CSV/);
  assert.match(workspace, /Off by default/);
  assert.match(workspace, /window\.print\(\)/);
  assert.match(workspace, /exportIssuesCsv/);
  assert.match(workspace, /exportProjectJson/);
  assert.match(workspace, /revisedVersion,/);
  assert.match(workspace, /setRevisedVersion\(restored\.revisedVersion/);
  assert.match(workspace, /application\/json/);
  assert.match(workspace, /text\/csv/);
  assert.match(workspace, /report\.versionChanges\.map/);
  assert.match(workspace, /Previous: \{change\.previousExcerpt\}/);
  assert.match(workspace, /Revised: \{change\.revisedExcerpt\}/);
});

test("pattern and project data remain browser-local with explicit device saving", () => {
  assert.doesNotMatch(workspace, /\bfetch\s*\(|XMLHttpRequest|sendBeacon/);
  assert.doesNotMatch(localStore, /\bfetch\s*\(|localStorage|sessionStorage/);
  assert.match(localStore, /indexedDB\.open/);
  assert.match(workspace, /Enable browser-local saving on this device/);
  assert.match(workspace, /disabled=\{!enabled\}/);
  assert.match(workspace, /Clearing browser data removes it/);
  assert.match(workspace, /Delete local project/);
  assert.match(workspace, /Restore JSON backup/);
  assert.match(workspace, /it is not uploaded/);
  assert.match(workspace, /window\.confirm\("Replace the existing saved StitchProof project/);
  assert.match(workspace, /window\.confirm\("Restore the saved project and replace the unsaved workspace/);
  assert.match(workspace, /window\.confirm\("Permanently delete the saved StitchProof project/);
  assert.match(workspace, /file\.size > 2_000_000/);
});

test("optional unsupported feedback sends only one closed category", () => {
  for (const label of [
    "Nested repeat",
    "Bobble or popcorn stitch",
    "Custom stitch",
    "Color change",
    "Back-loop or front-loop variation",
    "Chain-count rule",
    "Row worked flat",
    "Other",
  ]) {
    assert.match(workspace, new RegExp(label));
  }
  assert.match(workspace, /trackStitchProofEvent\("unsupported_result_shown", feedbackCategory\)/);
  assert.match(workspace, /Do not paste an instruction or any pattern text/);
  const feedbackStart = workspace.indexOf("unsupported-feedback-heading");
  const feedbackEnd = workspace.indexOf("<LocalProjectControls", feedbackStart);
  assert.doesNotMatch(workspace.slice(feedbackStart, feedbackEnd), /<textarea/);
});

test("commercial next actions stay truthful and separate", () => {
  assert.match(workspace, /Designer Report — proposed \$9 one-time/);
  assert.match(workspace, /Checkout is not open, no payment is being collected/);
  assert.match(workspace, /mailto:hello@fibertools\.app/);
  assert.match(workspace, /trackStitchProofEvent\("paid_report_interest_submitted"\)/);
  assert.match(workspace, /Count my \$9 report interest/);
  assert.doesNotMatch(workspace, /anonymous \$9|Anonymous \$9/);
  assert.doesNotMatch(workspace, /Buy now|Purchase now|Start checkout/);
  assert.match(workspace, /\/designer-pattern-preflight/);
  assert.match(workspace, /\$39 Designer Pattern Preflight pilot is a separate bounded manual review/);
});

test("workspace source preserves responsive and keyboard-visible controls", () => {
  assert.match(workspace, /sm:grid-cols-3/);
  assert.match(workspace, /lg:grid-cols-2/);
  assert.match(workspace, /overflow-x-auto/);
  assert.match(workspace, /focus-visible:ring-2/);
  assert.match(workspace, /min-h-12/);
  assert.match(workspace, /aria-live="polite"/);
  assert.match(workspace, /aria-label="Designer workspace views"/);
  assert.doesNotMatch(`${route}\n${workspace}\n${freeChecker}`, /(?:plum|sage)-950/);
  assert.match(workspace, /aria-label=\{`Remove correction \$\{index \+ 1\} for line/);
  assert.match(workspace, /Object\.keys\(correction\.changes\)\.join\(", "\)/);
  assert.match(workspace, /type="file"[^>]*tabIndex=\{-1\}/);
  assert.match(workspace, /type="file"[^>]*aria-hidden="true"/);
  assert.doesNotMatch(workspace, /<section[^>]*aria-live="polite"/);
  assert.match(globalStyles, /#stitchproof-report \*[\s\S]*color: black !important/);
});

test("comparison and report analytics are invalidated or deduplicated locally", () => {
  assert.match(workspace, /setPreviousVersion\(event\.target\.value\); setComparison\(null\)/);
  assert.match(workspace, /setRevisedVersion\(event\.target\.value\); setComparison\(null\)/);
  assert.match(workspace, /lastReviewedFingerprintRef/);
  assert.match(workspace, /lastTrackedComparisonRef/);
  assert.match(workspace, /hasReviewed[\s\S]*!analysis\.error[\s\S]*report_previewed/);
  assert.match(workspace, /view === "report" && hasReviewed && !analysis\.error/);
  assert.match(workspace, /comparisonMatchesDesigner/);
  assert.match(workspace, /scrollIntoView/);
});
