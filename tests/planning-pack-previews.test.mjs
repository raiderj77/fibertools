import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";

const read = path => readFileSync(new URL(path, import.meta.url));
const manifest = JSON.parse(read("../config/planning-pack-release-manifest.json"));
const provenance = JSON.parse(read("../config/planning-pack-preview-provenance.json"));

test("only checksum-bound partial-page PNGs from the paid edition are public", () => {
  assert.equal(provenance.edition, manifest.edition.id);
  assert.equal(provenance.sourceSha256, manifest.privateArtifact.expectedSha256);
  assert.equal(provenance.sourceBytes, manifest.privateArtifact.byteSize);
  assert.equal(provenance.sourcePages, manifest.edition.pageCount);
  assert.deepEqual(provenance.previews.map(p => p.sourcePage), [2, 3, 7]);
  const directory = new URL("../public/images/planning-pack/", import.meta.url);
  assert.deepEqual(readdirSync(directory).sort(), provenance.previews.map(p => p.file).sort());
  for (const preview of provenance.previews) {
    const bytes = readFileSync(new URL(preview.file, directory));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), preview.sha256);
    assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(bytes.readUInt32BE(16), preview.width);
    assert.equal(bytes.readUInt32BE(20), preview.height);
    assert.ok(preview.cropPdfPoints[3] - preview.cropPdfPoints[1] < 792);
  }
});

test("preview section labels excerpts and provides readable descriptions and full-size links", () => {
  const page = read("../src/app/fiber-project-planning-pack/page.tsx").toString();
  assert.match(page, /Preview actual workbook pages/);
  assert.match(page, /partial-page excerpts/);
  assert.match(page, /static images/);
  assert.match(page, /aria-labelledby="pack-preview-heading"/);
  assert.match(page, /loading="lazy"/);
  assert.match(page, /width=\{preview.width\}/);
  assert.match(page, /height=\{preview.height\}/);
  assert.match(page, /alt=\{preview.description\}/);
  assert.match(page, /View full-size \{preview.title\} preview/);
  assert.doesNotMatch(page, /preview[^\n]*\.pdf/i);
});
