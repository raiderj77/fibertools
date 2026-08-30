import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(
  "src/app/stitch-counter/StitchCounterTool.tsx",
  "utf8",
);

test("reminder overlay is a named modal alert dialog with keyboard focus management", () => {
  assert.match(source, /role="alertdialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-labelledby="stitch-reminder-title"/);
  assert.match(source, /aria-describedby="stitch-reminder-description"/);
  assert.match(source, /reminderCloseRef\.current\?\.focus\(\)/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /event\.key !== "Tab"/);
  assert.match(source, /reminderReturnFocusRef\.current\?\.focus\(\)/);
});

test("settings, reminder, and per-counter controls have programmatic names", () => {
  assert.match(source, /htmlFor="stitch-counter-milestone"/);
  assert.match(source, /htmlFor="stitch-counter-reminder-row"/);
  assert.match(source, /htmlFor="stitch-counter-reminder-note"/);
  assert.match(source, /aria-label={`Remove reminder at row \$\{r\.row\}/);
  assert.match(source, /aria-label={`Name for \$\{counter\.name/);
  assert.match(source, /aria-label={`Subtract 1 from \$\{counter\.name/);
  assert.match(source, /aria-label={`Add 1 to \$\{counter\.name/);
  assert.match(source, /aria-label={`Add \$\{n\} to \$\{counter\.name/);
  assert.match(source, /aria-label={`Reset \$\{counter\.name/);
  assert.match(source, /aria-label={`Remove \$\{counter\.name/);
  assert.match(source, /<output[\s\S]*role="status"[\s\S]*aria-live="polite"[\s\S]*aria-label={`\$\{counter\.name/);
});

test("restores the supported zero milestone setting instead of replacing it with the default", () => {
  assert.match(source, /Number\.isInteger\(data\.milestoneEvery\)/);
  assert.match(source, /data\.milestoneEvery >= 0/);
  assert.doesNotMatch(source, /if \(data\.milestoneEvery\) setMilestoneEvery/);
});
